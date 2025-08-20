import React, { useEffect, useRef, useState } from 'react';

export type LevelConfig = {
  id: string;
  label: string;
  position: { lat: number; lng: number }; // approximate location for this level's pano
  panoId?: string; // optional known pano ID to jump directly
  pov?: { heading: number; pitch: number; zoom?: number };
  embedSrc?: string; // optional: if provided, render this iframe instead of API Street View
};

interface Props {
  levels: LevelConfig[];
  initialLevelId?: string;
  height?: string | number;
}

const StreetViewLevels: React.FC<Props> = ({ levels, initialLevelId, height = '56.25%' }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const panoRef = useRef<any>(null);
  const [activeId, setActiveId] = useState(initialLevelId || (levels[0]?.id ?? ''));
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [resolvedPanoId, setResolvedPanoId] = useState<string | null>(null);
  const requestSeqRef = useRef(0); // used to ignore stale async responses

  useEffect(() => {
    // If all levels use embedSrc (iframes), we don't need the Maps JS API at all
    const anyApiLevels = levels.some(l => !l.embedSrc);
    if (!anyApiLevels) {
      // Mark as loaded so component logic relying on isLoaded won't block iframe rendering
      setIsLoaded(false); // keep false; iframe path doesn't need API
      return;
    }

    const ensureGoogleMaps = () => {
      if ((window as any).google && (window as any).google.maps) {
        setIsLoaded(true);
        return;
      }
      const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
      if (!apiKey) {
        console.error('Missing Google Maps API key. Please set VITE_GOOGLE_MAPS_API_KEY in your .env file.');
        return;
      }
      const existing = document.querySelector('script[data-gmaps-loader="true"]') as HTMLScriptElement | null;
      if (existing) {
        existing.addEventListener('load', () => setIsLoaded(true), { once: true });
        return;
      }
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}`;
      script.async = true;
      script.defer = true;
      script.dataset.gmapsLoader = 'true';
      script.onload = () => setIsLoaded(true);
      script.onerror = () => console.error('Failed to load Google Maps JS');
      document.head.appendChild(script);
    };

    ensureGoogleMaps();
  }, [levels]);

  useEffect(() => {
    if (!isLoaded || !containerRef.current) return;
    // If current active level uses iframe, skip API panorama init
    const active = levels.find(l => l.id === activeId);
    if (active?.embedSrc) return;
    // Initialize panorama if not already
    if (!panoRef.current) {
      const initLevel = levels.find(l => l.id === activeId) || levels[0];
      const opts: any = {
        position: initLevel?.position,
        pov: { heading: 0, pitch: 0 },
        zoom: 1,
        motionTracking: false,
        motionTrackingControl: false,
        addressControl: false,
        fullscreenControl: true,
        linksControl: true,
        panControl: true,
        enableCloseButton: false,
      };
      const gmaps = (window as any).google?.maps;
      opts.source = gmaps.StreetViewSource.DEFAULT;
      panoRef.current = new gmaps.StreetViewPanorama(containerRef.current, opts);
      // Ensure visibility when a pano is actually loaded
      panoRef.current.addListener('pano_changed', () => {
        try { panoRef.current?.setVisible(true); } catch { /* noop */ }
        try {
          // Force a resize to re-render tiles in some browsers
          gmaps.event.trigger(panoRef.current, 'resize');
        } catch { /* noop */ }
      });
      panoRef.current.addListener('status_changed', () => {
        const vis = !!panoRef.current?.getPano();
        try { panoRef.current?.setVisible(vis); } catch { /* noop */ }
      });
    }
  }, [isLoaded]);

  const activateLevel = (level: LevelConfig) => {
    const myReqId = ++requestSeqRef.current;
    setActiveId(level.id);
    // If this level uses iframe, hide API viewer and stop here
    if (level.embedSrc) {
      try { panoRef.current?.setVisible(false); } catch { /* noop */ }
      return;
    }
    if (!panoRef.current) return;
    const gmaps = (window as any).google?.maps;
    const sv = new gmaps.StreetViewService();
    const applyPov = () => {
      if (!panoRef.current) return;
      const pov = level.pov ?? { heading: 0, pitch: 0, zoom: 1 };
      panoRef.current!.setPov({ heading: pov.heading, pitch: pov.pitch });
      panoRef.current!.setZoom(pov.zoom ?? 1);
      panoRef.current!.setVisible(true);
    };

    const getPanoramaWithRetry = (
      request: any,
      attempts = 3,
      delayMs = 500
    ) =>
      new Promise<any>((resolve) => {
        const attempt = (left: number, wait: number) => {
          sv.getPanorama(request, (data: any, status: any) => {
            if (status === gmaps.StreetViewStatus.OK) {
              return resolve({ data, status });
            }
            // Retry on transient errors (e.g., rate limits or unknown)
            if (left > 0 && (status === gmaps.StreetViewStatus.UNKNOWN_ERROR)) {
              return setTimeout(() => attempt(left - 1, wait * 2), wait);
            }
            // Give up
            resolve({ data: null, status });
          });
        };
        attempt(attempts, delayMs);
      });

    // If panoId is provided, resolve via service for reliability
    if (level.panoId) {
      getPanoramaWithRetry({ pano: level.panoId }).then(({ data, status }) => {
        if (myReqId !== requestSeqRef.current) return; // stale
        if (status === gmaps.StreetViewStatus.OK && data?.location?.pano) {
          const pid = data.location.pano;
          panoRef.current!.setPano(pid);
          setResolvedPanoId(pid);
          applyPov();
          console.info(`[SV] Loaded pano for ${level.id} via panoId: ${pid}`);
        } else {
          // Fallback to location search if direct pano lookup failed
          getPanoramaWithRetry({ location: level.position, radius: 250 }).then(({ data: d2, status: s2 }) => {
            if (myReqId !== requestSeqRef.current) return; // stale
            if (s2 === gmaps.StreetViewStatus.OK && d2?.location?.pano) {
              const pid2 = d2.location.pano;
              panoRef.current!.setPano(pid2);
              setResolvedPanoId(pid2);
              applyPov();
              console.info(`[SV] Fallback loaded pano near ${level.id}: ${pid2}`);
            } else {
              // No panorama available nearby; keep viewer hidden to avoid black screen
              try { panoRef.current!.setVisible(false); } catch { /* noop */ }
              setResolvedPanoId(null);
              console.warn(`[SV] Could not resolve pano for ${level.id}.`);
            }
          });
        }
      });
      return;
    }

    // Otherwise, search for closest pano around the level's position
    getPanoramaWithRetry({ location: level.position, radius: 250 }).then(({ data, status }) => {
      if (myReqId !== requestSeqRef.current) return; // stale
      if (status === gmaps.StreetViewStatus.OK && data && data.location) {
        const pid = data.location.pano!;
        panoRef.current!.setPano(pid);
        setResolvedPanoId(pid);
        applyPov();
        console.info(`[SV] Resolved panoId for level ${level.id}: ${pid}`, data);
      } else {
        // No panorama available nearby; keep viewer hidden to avoid black screen
        try { panoRef.current!.setVisible(false); } catch { /* noop */ }
        setResolvedPanoId(null);
        console.warn(`[SV] No pano found near level ${level.id} at`, level.position);
      }
    });
  };

  useEffect(() => {
    if (!isLoaded || !panoRef.current) return;
    const current = levels.find(l => l.id === activeId);
    if (current) activateLevel(current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded, activeId]);

  return (
    <div className="w-full">
      <div className="mb-4 flex gap-2">
        {levels.map(l => (
          <button
            key={l.id}
            onClick={() => activateLevel(l)}
            className={`px-3 py-1.5 rounded-md text-sm border transition-colors ${
              l.id === activeId
                ? 'bg-blue-600 text-white border-blue-700'
                : 'bg-white/80 text-gray-800 border-gray-300 hover:bg-gray-50'
            }`}
          >
            {l.label}
          </button>
        ))}
      </div>
      <div className="w-full rounded-xl overflow-hidden border border-gray-200 shadow-2xl">
        {(() => {
          const active = levels.find(l => l.id === activeId);
          if (active?.embedSrc) {
            return (
              <iframe
                title={active.label}
                src={active.embedSrc}
                width="100%"
                height={typeof height === 'string' ? height : `${height}px`}
                style={{ border: 0 }}
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
              />
            );
          }
          return (
            <div ref={containerRef} style={{ width: '100%', height: typeof height === 'string' ? height : `${height}px` }} />
          );
        })()}
      </div>
      {/* Pano ID display removed per request */}
    </div>
  );
};

export default StreetViewLevels;
