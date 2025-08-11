type NodeId = string;

export interface GraphEdge {
  to: NodeId;
  weight: number;
}

export type Graph = Record<NodeId, GraphEdge[]>;

function euclidean(a: { x: number; y: number }, b: { x: number; y: number }) {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return Math.sqrt(dx * dx + dy * dy);
}

export function buildGraphFromCoordinates(
  nodes: Array<{ id: NodeId; coordinates: { x: number; y: number } }>,
  neighborRadiusPercent: number = 25
): Graph {
  const graph: Graph = {};
  for (const n of nodes) {
    graph[n.id] = [];
  }
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const dist = euclidean(nodes[i].coordinates, nodes[j].coordinates);
      if (dist <= neighborRadiusPercent) {
        graph[nodes[i].id].push({ to: nodes[j].id, weight: dist });
        graph[nodes[j].id].push({ to: nodes[i].id, weight: dist });
      }
    }
  }
  return graph;
}

export function dijkstra(graph: Graph, start: NodeId, target: NodeId): NodeId[] {
  const distances: Record<NodeId, number> = {};
  const previous: Record<NodeId, NodeId | null> = {};
  const visited: Set<NodeId> = new Set();
  const queue: Array<{ id: NodeId; dist: number }> = [];

  for (const node in graph) {
    distances[node] = Infinity;
    previous[node] = null;
  }
  distances[start] = 0;
  queue.push({ id: start, dist: 0 });

  while (queue.length > 0) {
    queue.sort((a, b) => a.dist - b.dist);
    const current = queue.shift()!;
    if (visited.has(current.id)) continue;
    visited.add(current.id);
    if (current.id === target) break;

    for (const edge of graph[current.id] || []) {
      const alt = distances[current.id] + edge.weight;
      if (alt < distances[edge.to]) {
        distances[edge.to] = alt;
        previous[edge.to] = current.id;
        queue.push({ id: edge.to, dist: alt });
      }
    }
  }

  const path: NodeId[] = [];
  let u: NodeId | null = target;
  while (u) {
    path.unshift(u);
    u = previous[u];
  }
  if (path[0] !== start) return [];
  return path;
}


