declare namespace google.maps {
  class Map {
    constructor(mapDiv: Element, opts?: MapOptions);
    setCenter(latLng: LatLng | LatLngLiteral): void;
    setZoom(zoom: number): void;
    fitBounds(bounds: LatLngBounds): void;
    panTo(latLng: LatLng | LatLngLiteral): void;
    getMapTypeId(): MapTypeId;
    setMapTypeId(mapTypeId: MapTypeId): void;
  }

  interface MapOptions {
    center?: LatLng | LatLngLiteral;
    zoom?: number;
    mapTypeId?: MapTypeId;
    mapTypeControl?: boolean;
    streetViewControl?: boolean;
    fullscreenControl?: boolean;
    zoomControl?: boolean;
    styles?: MapTypeStyle[];
  }

  class Marker {
    constructor(opts?: MarkerOptions);
    setMap(map: Map | null): void;
    addListener(eventName: string, handler: Function): MapsEventListener;
  }

  interface MarkerOptions {
    position?: LatLng | LatLngLiteral;
    map?: Map;
    title?: string;
    icon?: string | Icon | Symbol;
    label?: string | MarkerLabel;
  }

  interface MarkerLabel {
    text: string;
    color?: string;
    fontSize?: string;
    fontWeight?: string;
  }

  interface Icon {
    path: string | SymbolPath;
    scale?: number;
    fillColor?: string;
    fillOpacity?: number;
    strokeColor?: string;
    strokeWeight?: number;
  }

  enum SymbolPath {
    CIRCLE = 0,
    FORWARD_CLOSED_ARROW = 1,
  }

  class DirectionsService {
    route(request: DirectionsRequest, callback: (result: DirectionsResult | null, status: DirectionsStatus) => void): void;
  }

  interface DirectionsRequest {
    origin: LatLng | LatLngLiteral | string;
    destination: LatLng | LatLngLiteral | string;
    travelMode: TravelMode;
    unitSystem?: UnitSystem;
  }

  interface DirectionsResult {
    routes: DirectionsRoute[];
  }

  interface DirectionsRoute {
    legs: DirectionsLeg[];
  }

  interface DirectionsLeg {
    start_location: LatLng;
    end_location: LatLng;
    distance?: Text;
    duration?: Text;
    steps?: DirectionsStep[];
  }

  interface Text {
    text: string;
    value: number;
  }

  interface DirectionsStep {
    distance?: Text;
    duration?: Text;
    instructions: string;
    path: LatLng[];
    travel_mode: TravelMode;
  }

  enum TravelMode {
    WALKING = 'WALKING',
    BICYCLING = 'BICYCLING',
    DRIVING = 'DRIVING',
    TRANSIT = 'TRANSIT',
  }

  enum UnitSystem {
    METRIC = 0,
    IMPERIAL = 1,
  }

  enum DirectionsStatus {
    OK = 'OK',
    NOT_FOUND = 'NOT_FOUND',
    ZERO_RESULTS = 'ZERO_RESULTS',
    MAX_WAYPOINTS_EXCEEDED = 'MAX_WAYPOINTS_EXCEEDED',
    MAX_ROUTE_LENGTH_EXCEEDED = 'MAX_ROUTE_LENGTH_EXCEEDED',
    INVALID_REQUEST = 'INVALID_REQUEST',
    OVER_QUERY_LIMIT = 'OVER_QUERY_LIMIT',
    REQUEST_DENIED = 'REQUEST_DENIED',
    UNKNOWN_ERROR = 'UNKNOWN_ERROR',
  }

  class DirectionsRenderer {
    constructor(opts?: DirectionsRendererOptions);
    setMap(map: Map | null): void;
    setDirections(directions: DirectionsResult | { routes: [] }): void;
  }

  interface DirectionsRendererOptions {
    suppressMarkers?: boolean;
    polylineOptions?: PolylineOptions;
  }

  interface PolylineOptions {
    path?: LatLng[] | LatLngLiteral[];
    geodesic?: boolean;
    strokeColor?: string;
    strokeOpacity?: number;
    strokeWeight?: number;
    icons?: IconSequence[];
  }

  interface IconSequence {
    icon: Icon;
    offset?: string;
    repeat?: string;
  }

  class InfoWindow {
    constructor(opts?: InfoWindowOptions);
    setContent(content: string | Element): void;
    open(map?: Map, anchor?: Marker): void;
    close(): void;
  }

  interface InfoWindowOptions {
    content?: string | Element;
  }

  class LatLng {
    constructor(lat: number, lng: number);
  }

  interface LatLngLiteral {
    lat: number;
    lng: number;
  }

  class LatLngBounds {
    constructor(sw?: LatLng, ne?: LatLng);
    extend(point: LatLng): void;
  }

  enum MapTypeId {
    ROADMAP = 'roadmap',
    SATELLITE = 'satellite',
    HYBRID = 'hybrid',
    TERRAIN = 'terrain',
  }

  interface MapTypeStyle {
    featureType?: string;
    elementType?: string;
    stylers?: Array<{ [key: string]: any }>;
  }

  interface MapsEventListener {
    remove(): void;
  }

  class Polyline {
    constructor(opts?: PolylineOptions);
    setMap(map: Map | null): void;
    set(key: string, value: any): void;
  }

  interface PolylineOptions {
    path?: LatLng[] | LatLngLiteral[];
    geodesic?: boolean;
    strokeColor?: string;
    strokeOpacity?: number;
    strokeWeight?: number;
    icons?: IconSequence[];
  }
}

declare global {
  interface Window {
    google: typeof google;
  }
}
