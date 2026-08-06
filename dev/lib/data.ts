export const QUOTAS = [
  {
    label: 'Storage',
    value: 17,
    max: 100,
    format: (v: number, m: number) => `${String(v)} MB / ${String(m)} MB`,
  },
  {
    label: 'Memories',
    value: 84,
    max: 100,
    format: (v: number, m: number) => `${String(v)} / ${String(m)} notes`,
  },
  {
    label: 'API calls',
    value: 9_800,
    max: 10_000,
    format: (v: number, m: number) => `${String(v / 1000)}k / ${String(m / 1000)}k`,
  },
];

/* ── Sample Data ── */
export const MACHINES = [
  {
    name: 'dev-machine',
    status: 'online' as const,
    platform: 'linux',
    arch: 'x64',
    agents: 5,
    last_seen: '30s ago',
  },
  {
    name: 'staging-01',
    status: 'online' as const,
    platform: 'linux',
    arch: 'arm64',
    agents: 3,
    last_seen: '1 min ago',
  },
  {
    name: 'prod-worker-1',
    status: 'online' as const,
    platform: 'linux',
    arch: 'x64',
    agents: 8,
    last_seen: '15s ago',
  },
  {
    name: 'local-mac',
    status: 'offline' as const,
    platform: 'darwin',
    arch: 'arm64',
    agents: 2,
    last_seen: '3 hours ago',
  },
  {
    name: 'test-runner',
    status: 'offline' as const,
    platform: 'linux',
    arch: 'x64',
    agents: 1,
    last_seen: '2 days ago',
  },
];
export const RUNS = [
  {
    id: 'a1b2c3d4',
    agent: 'code-reviewer',
    machine: 'dev-machine',
    state: 'completed' as const,
    started: '2 min ago',
  },
  {
    id: 'e5f6g7h8',
    agent: 'test-gen',
    machine: 'staging-01',
    state: 'working' as const,
    started: '45s ago',
  },
  {
    id: 'i9j0k1l2',
    agent: 'deploy',
    machine: 'prod-worker-1',
    state: 'failed' as const,
    started: '10 min ago',
  },
  {
    id: 'm3n4o5p6',
    agent: 'doc-writer',
    machine: 'dev-machine',
    state: 'completed' as const,
    started: '1 hour ago',
  },
  {
    id: 'q7r8s9t0',
    agent: 'monitor',
    machine: null as string | null,
    state: 'submitted' as const,
    started: '5s ago',
  },
];
export const DEPLOYMENTS = [
  {
    id: 'dpl-9f2a',
    title: 'memory-api',
    description: 'master · feat: git-per-memory search index',
    status: 'online' as const,
    time: '2 min ago',
  },
  {
    id: 'dpl-7c31',
    title: 'dashboard',
    description: 'feature/list-views · feat: entity list rows',
    status: 'working' as const,
    time: '18 min ago',
  },
  {
    id: 'dpl-4b88',
    title: 'landing',
    description: 'master · chore: docs registry cleanup',
    status: 'error' as const,
    time: '3 hours ago',
  },
  {
    id: 'dpl-1a04',
    title: 'mcp-catalog',
    description: 'master · fix: facet crawl cache headers',
    status: 'offline' as const,
    time: 'yesterday',
  },
];
export const onlineCount = MACHINES.filter((m) => m.status === 'online').length;
export const offlineCount = MACHINES.filter((m) => m.status === 'offline').length;
export const totalAgents = MACHINES.reduce((s, m) => s + m.agents, 0);
export const activeRuns = RUNS.filter((r) => ['submitted', 'working'].includes(r.state)).length;
export const runStateColor = (s: string) =>
  s === 'completed'
    ? ('success' as const)
    : s === 'failed'
      ? ('destructive' as const)
      : s === 'working'
        ? ('info' as const)
        : ('warning' as const);
