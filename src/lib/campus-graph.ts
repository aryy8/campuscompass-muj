import { Graph } from './shortest-path';

export type NodeId = string;

export type LatLng = [number, number];

export const SUBWAY_NODE_ID: NodeId = 'subway';

// Campus nodes (approximate). Replace with precise coords as needed.
export const NODE_COORDS: Record<NodeId, LatLng> = {
  main: [26.8429, 75.5654],
  library: [26.8433, 75.5659],
  auditorium: [26.8425, 75.5648],
  cse: [26.8436, 75.5651],
  mech: [26.8438, 75.5646],
  civil: [26.8430, 75.5642],
  admin: [26.8427, 75.5650],
  hA_boys: [26.8440, 75.5670],
  hB_boys: [26.8443, 75.5665],
  hA_girls: [26.8420, 75.5672],
  hB_girls: [26.8417, 75.5667],
  foodcourt: [26.8432, 75.5662],
  cafeteria: [26.8422, 75.5658],
  sports: [26.8419, 75.5649],
  cricket: [26.8414, 75.5661],
  football: [26.8409, 75.5656],
  [SUBWAY_NODE_ID]: [26.841583, 75.563417],
};

function toRad(n: number) { return (n * Math.PI) / 180; }
function haversineMeters(a: LatLng, b: LatLng) {
  const R = 6371000;
  const dLat = toRad(b[0] - a[0]);
  const dLon = toRad(b[1] - a[1]);
  const lat1 = toRad(a[0]);
  const lat2 = toRad(b[0]);
  const s = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(s), Math.sqrt(1 - s));
  return R * c;
}

function w(a: NodeId, b: NodeId) {
  return haversineMeters(NODE_COORDS[a], NODE_COORDS[b]);
}

// Define edges roughly following walkable paths and roads
const RAW_EDGES: Array<[NodeId, NodeId]> = [
  // Campus core grid
  ['main', 'library'], ['main', 'auditorium'], ['main', 'admin'],
  ['library', 'cse'], ['cse', 'mech'], ['mech', 'civil'], ['civil', 'auditorium'],
  ['admin', 'library'], ['admin', 'cafeteria'],

  // Sports area connections
  ['auditorium', 'sports'], ['sports', 'football'], ['sports', 'civil'],

  // Food connections
  ['library', 'foodcourt'], ['foodcourt', 'cafeteria'],

  // Hostel spines to campus
  ['hA_boys', 'foodcourt'], ['hB_boys', 'foodcourt'],
  ['hA_girls', 'cafeteria'], ['hB_girls', 'cafeteria'],

  // Cricket ground towards hostels
  ['cricket', 'foodcourt'], ['cricket', 'hB_girls'],

  // Subway connectors
  ['civil', SUBWAY_NODE_ID], ['sports', SUBWAY_NODE_ID],
  [SUBWAY_NODE_ID, 'football'],
];

export const CAMPUS_GRAPH: Graph = Object.keys(NODE_COORDS).reduce((acc: Graph, id) => {
  acc[id] = [];
  return acc;
}, {} as Graph);

for (const [a, b] of RAW_EDGES) {
  const weight = w(a, b);
  CAMPUS_GRAPH[a].push({ to: b, weight });
  CAMPUS_GRAPH[b].push({ to: a, weight });
}

// Bounding box for campus to decide when to use campus routing
const lats = Object.values(NODE_COORDS).map(([lat]) => lat);
const lngs = Object.values(NODE_COORDS).map(([, lng]) => lng);
const BOUNDS = {
  minLat: Math.min(...lats) - 0.0008,
  maxLat: Math.max(...lats) + 0.0008,
  minLng: Math.min(...lngs) - 0.0008,
  maxLng: Math.max(...lngs) + 0.0008,
};

export function isWithinCampus([lat, lng]: LatLng) {
  return lat >= BOUNDS.minLat && lat <= BOUNDS.maxLat && lng >= BOUNDS.minLng && lng <= BOUNDS.maxLng;
}

export function nearestNodeId([lat, lng]: LatLng): NodeId | null {
  let best: { id: NodeId; d: number } | null = null;
  for (const [id, coord] of Object.entries(NODE_COORDS)) {
    const d = haversineMeters([lat, lng], coord as LatLng);
    if (!best || d < best.d) best = { id: id as NodeId, d };
  }
  // Accept within 250m snap radius to avoid wrong matches
  if (best && best.d <= 250) return best.id;
  return null;
}
