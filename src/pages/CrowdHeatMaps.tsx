import React from 'react';
import { Flame, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const CrowdHeatMaps: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-4 h-4 mr-2" /> Back
          </Button>
          <div className="p-2 rounded-lg bg-red-100 text-red-600">
            <Flame className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-bold">Crowd Heatmap</h1>
        </div>
        <p className="text-muted-foreground mb-4">Live crowd density hotspots overlaid on the campus map.</p>
        {/* Color scheme legend */}
        <div className="mb-6 rounded-xl border border-border bg-card p-4">
          <div className="flex flex-wrap items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <span className="inline-block w-4 h-4 rounded-full" style={{background: 'radial-gradient(circle, rgba(239,68,68,0.6) 0%, rgba(239,68,68,0.25) 60%, rgba(239,68,68,0) 80%)'}} />
              <span className="font-medium">High</span>
              <span className="text-muted-foreground">(Red)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-block w-4 h-4 rounded-full" style={{background: 'radial-gradient(circle, rgba(249,115,22,0.35) 0%, rgba(249,115,22,0.18) 60%, rgba(249,115,22,0) 80%)'}} />
              <span className="font-medium">Medium</span>
              <span className="text-muted-foreground">(Orange)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-block w-4 h-4 rounded-full" style={{background: 'radial-gradient(circle, rgba(234,179,8,0.28) 0%, rgba(234,179,8,0.14) 60%, rgba(234,179,8,0) 80%)'}} />
              <span className="font-medium">Low</span>
              <span className="text-muted-foreground">(Yellow)</span>
            </div>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">Color scheme: Red = high density, Orange = medium, Yellow = low.</p>
        </div>
        {/* Map container with hotspots */}
        <div className="rounded-xl border border-border overflow-hidden bg-white dark:bg-card">
          <div className="relative aspect-[16/9] w-full">
            {/* Base Map */}
            <img src="/heatmap.png" alt="MUJ Crowd Heatmap" className="absolute inset-0 w-full h-full object-cover" />

            {/* Hotspot overlays */}
            {/* Red hotspot (darker) */}
            <div
              className="absolute"
              style={{
                left: '22%',
                top: '35%',
                width: '22%',
                height: '22%',
                transform: 'translate(-50%, -50%)',
                background:
                  'radial-gradient(circle, rgba(239,68,68,0.55) 0%, rgba(239,68,68,0.35) 38%, rgba(239,68,68,0.12) 66%, rgba(239,68,68,0) 78%)',
                filter: 'blur(2px)'
              }}
            />

            {/* Orange hotspot (lighter) */}
            <div
              className="absolute"
              style={{
                left: '62%',
                top: '48%',
                width: '26%',
                height: '26%',
                transform: 'translate(-50%, -50%)',
                background:
                  'radial-gradient(circle, rgba(249,115,22,0.26) 0%, rgba(249,115,22,0.18) 42%, rgba(249,115,22,0.06) 70%, rgba(249,115,22,0) 80%)',
                filter: 'blur(2px)'
              }}
            />

            {/* Yellow hotspot (lighter) */}
            <div
              className="absolute"
              style={{
                left: '78%',
                top: '20%',
                width: '18%',
                height: '18%',
                transform: 'translate(-50%, -50%)',
                background:
                  'radial-gradient(circle, rgba(234,179,8,0.22) 0%, rgba(234,179,8,0.16) 40%, rgba(234,179,8,0.05) 68%, rgba(234,179,8,0) 78%)',
                filter: 'blur(2px)'
              }}
            />

            {/* Another yellow/orange hotspot (darker) */}
            <div
              className="absolute"
              style={{
                left: '36%',
                top: '72%',
                width: '20%',
                height: '20%',
                transform: 'translate(-50%, -50%)',
                background:
                  'radial-gradient(circle, rgba(251,146,60,0.38) 0%, rgba(251,146,60,0.22) 42%, rgba(251,146,60,0.08) 70%, rgba(251,146,60,0) 82%)',
                filter: 'blur(2px)'
              }}
            />
          </div>
        </div>

        {/* Message card below the map */}
        <div className="mt-6 rounded-xl border border-border bg-card p-5 text-sm text-muted-foreground">
          This feature will go live once UniWay has more users onboard. Stay tuned!
        </div>
      </div>
    </div>
  );
};

export default CrowdHeatMaps;
