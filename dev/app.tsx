'use client';
import { useState } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Alert,
  AlertDialog,
  Avatar,
  Badge,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Checkbox,
  CodeBlock,
  InlineCode,
  CollapsibleContent,
  CollapsibleTrigger,
  Combobox,
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandSeparator,
  DatePicker,
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  EmptyState,
  FilterBar,
  FilterButtonGroup,
  FilterClear,
  FilterResults,
  FilterSearch,
  FilterSort,
  FormField,
  Heading,
  HoverCard,
  IconButton,
  IconContainer,
  Input,
  Kbd,
  Label,
  Modal,
  ModalFooter,
  NavLink,
  PageHeader,
  Pagination,
  Popover,
  Progress,
  Prose,
  RadioGroup,
  RadioGroupItem,
  ScrollArea,
  Section,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Separator,
  Sheet,
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  Skeleton,
  Slider,
  Spinner,
  StatCard,
  StatusDot,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Textarea,
  ToastProvider,
  useToast,
  ToggleGroup,
  Tooltip,
  // Catalog & Site additions
  Chip,
  CopyButton,
  DocSidebar,
  DocSidebarGroup,
  DocSidebarItem,
  Footer,
  FooterSections,
  FooterSection,
  FooterLink,
  FooterBottom,
  MarkdownRenderer,
  TopBar,
  TopBarBrand,
  TopBarNav,
  TopBarNavItem,
  TopBarActions,
  // Stat Card advanced composables
  Sparkline,
  MiniBars,
  StatBreakdown,
  StatProgress,
  StatComparison,
  // Advanced full-card patterns
  GaugeCard,
  DonutCard,
  ScoreCard,
  FunnelCard,
  HeatmapCard,
  MultiStatCard,
  RankedListCard,
} from '../src';

/* ── Icons ── */
const InfoIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="16" x2="12" y2="12" />
    <line x1="12" y1="8" x2="12.01" y2="8" />
  </svg>
);
const EditIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);
const UserIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);
const HomeIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);
const BotIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 8V4H8" />
    <rect width="16" height="12" x="4" y="8" rx="2" />
    <path d="M2 14h2" />
    <path d="M20 14h2" />
    <path d="M15 13v2" />
    <path d="M9 13v2" />
  </svg>
);
const HeartIcon = ({ filled }: { filled?: boolean }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill={filled ? 'currentColor' : 'none'}
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
  </svg>
);
const BrandedLogo = () => (
  <span className="font-semibold tracking-tight flex items-center gap-0.5 text-foreground text-sm">
    Agent
    <span className="text-primary">
      <HeartIcon filled />
    </span>
    Age
  </span>
);
const ServerIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect width="20" height="8" x="2" y="2" rx="2" />
    <rect width="20" height="8" x="2" y="14" rx="2" />
    <line x1="6" y1="6" x2="6.01" y2="6" />
    <line x1="6" y1="18" x2="6.01" y2="18" />
  </svg>
);
const PlayIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polygon points="6 3 20 12 6 21 6 3" />
  </svg>
);
const MailIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect width="20" height="16" x="2" y="4" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

const PAGES = [
  'Foundations',
  'Data Display',
  'Cards',
  'Forms',
  'Feedback',
  'Layout',
  'Navigation',
  'Site & Docs',
] as const;
type Page = (typeof PAGES)[number];

const S = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section className="space-y-4">
    <h2 className="text-lg font-semibold text-foreground border-b border-border pb-2">{title}</h2>
    <div className="space-y-3">{children}</div>
  </section>
);

const ToastDemo = () => {
  const { toast } = useToast();
  return (
    <div className="flex flex-wrap gap-2">
      <Button
        size="sm"
        onClick={() => toast({ title: 'Default toast', description: 'Something happened.' })}
      >
        Default
      </Button>
      <Button size="sm" onClick={() => toast({ title: 'Run completed', variant: 'success' })}>
        Success
      </Button>
      <Button size="sm" onClick={() => toast({ title: 'Run failed', variant: 'destructive' })}>
        Error
      </Button>
      <Button size="sm" onClick={() => toast({ title: 'Check config', variant: 'warning' })}>
        Warning
      </Button>
      <Button size="sm" onClick={() => toast({ title: 'New event', variant: 'info' })}>
        Info
      </Button>
    </div>
  );
};

/* ── Sample Data ── */
const MACHINES = [
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
const RUNS = [
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
const onlineCount = MACHINES.filter((m) => m.status === 'online').length;
const offlineCount = MACHINES.filter((m) => m.status === 'offline').length;
const totalAgents = MACHINES.reduce((s, m) => s + m.agents, 0);
const activeRuns = RUNS.filter((r) => ['submitted', 'working'].includes(r.state)).length;
const runStateColor = (s: string) =>
  s === 'completed'
    ? ('success' as const)
    : s === 'failed'
      ? ('destructive' as const)
      : s === 'working'
        ? ('info' as const)
        : ('warning' as const);

export const App = () => {
  const [page, setPage] = useState<Page>('Foundations');
  const [theme, setTheme] = useState<'dark' | 'light' | 'system'>('dark');
  const handleTheme = (v: string) => {
    const t = v as typeof theme;
    setTheme(t);
    document.documentElement.setAttribute('data-theme', t);
  };

  return (
    <ToastProvider>
      <div className="min-h-screen bg-background text-foreground">
        <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
          <div className="max-w-5xl mx-auto px-6 flex items-center justify-between h-14">
            <div className="flex items-center gap-6">
              <button
                type="button"
                onClick={() => setPage('Foundations')}
                aria-label="Home"
                className="cursor-pointer rounded-md transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
              >
                <BrandedLogo />
              </button>
              <nav className="flex items-center gap-1">
                {PAGES.map((p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`px-3 py-1.5 rounded-md text-xs font-medium cursor-pointer transition-colors ${page === p ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-accent'}`}
                  >
                    {p}
                  </button>
                ))}
              </nav>
            </div>
            <ToggleGroup
              value={theme}
              onChange={handleTheme}
              options={[
                { value: 'dark', label: 'Dark' },
                { value: 'light', label: 'Light' },
                { value: 'system', label: 'System' },
              ]}
              columns={3}
            />
          </div>
        </header>
        <main className="max-w-5xl mx-auto px-6 py-8 space-y-10">
          {page === 'Foundations' && <FoundationsPage />}
          {page === 'Data Display' && <DataDisplayPage />}
          {page === 'Cards' && <CardsPage />}
          {page === 'Forms' && <FormsPage />}
          {page === 'Feedback' && <FeedbackPage />}
          {page === 'Layout' && <LayoutPage />}
          {page === 'Navigation' && <NavTypoPage />}
          {page === 'Site & Docs' && <SiteDocsPage />}
        </main>
      </div>
    </ToastProvider>
  );
};

/* ═══════════════════ FOUNDATIONS ═══════════════════ */
const FoundationsPage = () => (
  <>
    <Heading as="h1" description="OKLCH colors, typography, semantic tokens, and design primitives">
      Foundations
    </Heading>

    <S title="Typography">
      <div className="space-y-3">
        <div className="grid grid-cols-[100px_1fr] gap-2 items-baseline">
          <span className="text-xs text-muted-foreground font-mono">font-sans</span>
          <p className="font-sans text-base">
            system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto
          </p>
        </div>
        <div className="grid grid-cols-[100px_1fr] gap-2 items-baseline">
          <span className="text-xs text-muted-foreground font-mono">font-mono</span>
          <p className="font-mono text-base">
            ui-monospace, SFMono-Regular, SF Mono, Menlo, Consolas
          </p>
        </div>
        <Separator />
        <div className="space-y-2">
          {(
            [
              'text-4xl font-bold tracking-tight',
              'text-3xl font-bold tracking-tight',
              'text-2xl font-semibold',
              'text-xl font-semibold',
              'text-lg font-medium',
              'text-base',
              'text-sm',
              'text-xs',
            ] as const
          ).map((cls) => (
            <div key={cls} className="flex items-baseline gap-4">
              <span className="text-xs text-muted-foreground font-mono w-40 shrink-0">
                {cls.split(' ')[0]}
              </span>
              <span className={`${cls} text-foreground`}>The quick brown fox</span>
            </div>
          ))}
        </div>
        <Separator />
        <div className="flex gap-6">
          {['font-normal', 'font-medium', 'font-semibold', 'font-bold'].map((w) => (
            <div key={w} className="text-center">
              <p className={`${w} text-foreground`}>Agentage</p>
              <span className="text-xs text-muted-foreground font-mono">{w}</span>
            </div>
          ))}
        </div>
      </div>
    </S>

    <S title="Color Primitives (OKLCH)">
      <div className="space-y-1.5">
        {[
          'gold',
          'neutral',
          'red',
          'green',
          'blue',
          'orange',
          'violet',
          'cyan',
          'rose',
          'amber',
        ].map((hue) => (
          <div key={hue} className="flex items-center gap-1">
            <span className="text-xs text-muted-foreground w-16 font-mono">{hue}</span>
            {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950].map((stop) => (
              <Tooltip key={stop} content={`${hue}-${stop}`}>
                <div
                  className="size-8 rounded-md border border-border/50 cursor-crosshair"
                  style={{ backgroundColor: `var(--color-${hue}-${stop})` }}
                />
              </Tooltip>
            ))}
          </div>
        ))}
      </div>
    </S>

    <S title="Semantic Colors">
      <div className="flex flex-wrap gap-3">
        {[
          'background',
          'foreground',
          'card',
          'primary',
          'secondary',
          'muted',
          'accent',
          'destructive',
          'success',
          'warning',
          'info',
          'border',
          'sidebar',
          'popover',
        ].map((c) => (
          <div key={c} className="flex flex-col items-center gap-1">
            <div className={`size-12 rounded-lg border border-border/50 bg-${c}`} />
            <span className="text-[10px] text-muted-foreground">{c}</span>
          </div>
        ))}
      </div>
    </S>

    <S title="Button">
      <div className="flex flex-wrap items-center gap-2">
        <Button>Default</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="destructive">Destructive</Button>
        <Button variant="link">Link</Button>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Button size="sm">Small</Button>
        <Button size="default">Default</Button>
        <Button size="lg">Large</Button>
        <Button disabled>Disabled</Button>
        <Button size="icon">
          <EditIcon />
        </Button>
        <Button size="icon-sm">
          <InfoIcon />
        </Button>
      </div>
    </S>

    <S title="Badge">
      <div className="flex flex-wrap items-center gap-2">
        <Badge>Default</Badge>
        <Badge variant="secondary">Secondary</Badge>
        <Badge variant="destructive">Destructive</Badge>
        <Badge variant="success">Success</Badge>
        <Badge variant="warning">Warning</Badge>
        <Badge variant="info">Info</Badge>
        <Badge variant="outline">Outline</Badge>
      </div>
    </S>

    <S title="Card">
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Card Title</CardTitle>
            <CardDescription>Description text.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm">
              Compound: Header, Title, Description, Content, Footer, Action.
            </p>
          </CardContent>
          <CardFooter>
            <Button size="sm">Action</Button>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Loading State</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Skeleton variant="text" />
              <Skeleton variant="text" className="w-3/4" />
              <Skeleton variant="rectangular" className="h-16" />
            </div>
          </CardContent>
        </Card>
      </div>
    </S>

    <S title="Avatar & Icons">
      <div className="flex items-end gap-3">
        <Avatar name="John Doe" size="xs" />
        <Avatar name="Jane Smith" size="sm" />
        <Avatar name="Volodymyr Vreshch" size="md" />
        <Avatar name="Alice Wonder" size="lg" />
        <Avatar name="Charlie" size="xl" />
        <Avatar size="2xl" />
      </div>
      <div className="flex items-center gap-3 mt-3">
        <Tooltip content="Edit">
          <span>
            <IconButton icon={<EditIcon />} onClick={() => {}} title="Edit" />
          </span>
        </Tooltip>
        <Tooltip content="Info">
          <span>
            <IconButton icon={<InfoIcon />} onClick={() => {}} title="Info" />
          </span>
        </Tooltip>
        <IconContainer color="blue">
          <InfoIcon />
        </IconContainer>
        <IconContainer color="green">
          <EditIcon />
        </IconContainer>
        <IconContainer color="amber">
          <HeartIcon />
        </IconContainer>
        <IconContainer color="violet">
          <BotIcon />
        </IconContainer>
        <IconContainer color="rose">
          <HeartIcon />
        </IconContainer>
        <IconContainer color="cyan">
          <ServerIcon />
        </IconContainer>
      </div>
    </S>

    <S title="Loading States">
      <div className="flex items-center gap-8">
        <div className="space-y-2 w-48">
          <Skeleton variant="circular" className="size-10" />
          <Skeleton variant="text" />
          <Skeleton variant="text" className="w-3/4" />
          <Skeleton variant="rectangular" className="h-20" />
        </div>
        <div className="flex items-center gap-3">
          <Spinner size="sm" />
          <Spinner size="md" />
          <Spinner size="lg" />
        </div>
      </div>
    </S>

    <S title="Separator">
      <Separator />
      <div className="flex items-center gap-4 h-8">
        <span className="text-sm">Left</span>
        <Separator orientation="vertical" />
        <span className="text-sm">Center</span>
        <Separator orientation="vertical" />
        <span className="text-sm">Right</span>
      </div>
    </S>
  </>
);

/* ═══════════════════ DATA DISPLAY ═══════════════════ */
const DataDisplayPage = () => {
  const [pageNum, setPageNum] = useState(1);
  const [filter, setFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState<'name' | 'agents'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const filtered = MACHINES.filter(
    (m) =>
      (statusFilter === 'all' || m.status === statusFilter) &&
      m.name.toLowerCase().includes(filter.toLowerCase())
  ).sort((a, b) => {
    const mul = sortOrder === 'asc' ? 1 : -1;
    return sortBy === 'name' ? mul * a.name.localeCompare(b.name) : mul * (a.agents - b.agents);
  });
  const hasFilters = filter !== '' || statusFilter !== 'all';

  return (
    <>
      <Heading
        as="h1"
        description="Tables, stat cards, status indicators, code blocks, and progress"
      >
        Data Display
      </Heading>

      <S title="Stat Cards">
        <div className="grid grid-cols-3 gap-4">
          <StatCard
            icon={<ServerIcon />}
            iconColor="bg-green-500/10 text-green-500"
            title="Machines"
            value={`${onlineCount} / ${MACHINES.length} online`}
            description={
              <>
                <span className="flex items-center gap-1">
                  <StatusDot variant="online" size="sm" />
                  {onlineCount} online
                </span>
                <span className="flex items-center gap-1 mt-0.5">
                  <StatusDot variant="offline" size="sm" />
                  {offlineCount} offline
                </span>
              </>
            }
          />
          <StatCard
            icon={<BotIcon />}
            iconColor="bg-blue-500/10 text-blue-500"
            title="Agents"
            value={totalAgents}
            description={
              <>
                {MACHINES.filter((m) => m.status === 'online').map((m) => (
                  <span key={m.name} className="flex items-center gap-1">
                    <StatusDot variant="online" size="sm" />
                    {m.name}: {m.agents}
                  </span>
                ))}
              </>
            }
          />
          <StatCard
            icon={<PlayIcon />}
            iconColor="bg-amber-500/10 text-amber-500"
            title="Active Runs"
            value={activeRuns}
            description={
              <>
                {RUNS.filter((r) => r.state === 'completed').length} completed ·{' '}
                {RUNS.filter((r) => r.state === 'failed').length} failed ·{' '}
                {RUNS.filter((r) => r.state === 'working').length} working
              </>
            }
          />
        </div>
        <div className="grid grid-cols-4 gap-4">
          <StatCard
            title="Runs Today"
            value={47}
            trend={{ value: '+12%', up: true }}
            description="vs. 42 yesterday"
          />
          <StatCard
            title="Success Rate"
            value="95.2%"
            trend={{ value: '+2.1%', up: true }}
            description="45 completed, 2 failed"
          />
          <StatCard title="Avg Duration" value="4.3s" description="Median: 3.1s" />
          <StatCard
            title="Errors"
            value={2}
            trend={{ value: '-67%', up: true }}
            description="Down from 6"
          />
        </div>
        <div className="grid grid-cols-4 gap-4">
          <StatCard
            icon={<ServerIcon />}
            iconColor="bg-blue-500/10 text-blue-500"
            title="Platform"
            value="linux/amd64"
            description="daemon v0.7.1"
          />
          <StatCard
            icon={<BotIcon />}
            iconColor="bg-green-500/10 text-green-500"
            title="Agents"
            value={5}
            description="All registered"
          />
          <StatCard
            title="CPU"
            value="34%"
            description={<Progress value={34} className="mt-2" />}
          />
          <StatCard
            title="Memory"
            value="6.2 / 16 GB"
            description={<Progress value={39} variant="info" className="mt-2" />}
          />
        </div>
      </S>

      <S title="Stat Cards Advanced">
        <p className="-mt-2 text-xs text-muted-foreground">
          Composable extensions plugged into the StatCard description slot: inline sparkline · mini
          bar chart · segmented breakdown · progress-to-target · vs-previous-period comparison.
        </p>
        <div className="grid grid-cols-3 gap-4">
          <StatCard
            title="Active Users"
            value="8,432"
            trend={{ value: '+5.2%', up: true }}
            description={<Sparkline data={[40, 55, 50, 65, 60, 72, 78, 82, 88, 92]} showLastDot />}
          />
          <StatCard
            title="Runs / day"
            value={142}
            description={<MiniBars data={[12, 18, 9, 24, 16, 22, 19, 28, 31, 25, 33, 38]} />}
          />
          <StatCard
            title="MRR"
            value="$48.2K"
            description={
              <StatComparison
                current={48200}
                previous={42300}
                format={(n) => `$${(n / 1000).toFixed(1)}K`}
              />
            }
          />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <StatCard
            title="Storage used"
            value="3.2 / 5 GB"
            description={
              <StatProgress
                current={3200}
                target={5000}
                format={(n) => `${(n / 1000).toFixed(1)} GB`}
              />
            }
          />
          <StatCard
            title="Machines"
            value={42}
            description={
              <StatBreakdown
                segments={[
                  { label: 'Active', value: 28, color: 'bg-success' },
                  { label: 'Idle', value: 10, color: 'bg-warning' },
                  { label: 'Offline', value: 4, color: 'bg-muted-foreground/60' },
                ]}
              />
            }
          />
          <StatCard
            title="ARR by source"
            value="$1.2M"
            trend={{ value: '+18%', up: true }}
            description={
              <StatBreakdown
                showLegend={false}
                segments={[
                  { label: 'New', value: 620, color: 'bg-primary' },
                  { label: 'Expansion', value: 380, color: 'bg-info' },
                  { label: 'Churn', value: 100, color: 'bg-destructive' },
                ]}
              />
            }
          />
        </div>
      </S>

      <S title="Machines Table">
        <FilterBar>
          <FilterSearch value={filter} onChange={setFilter} placeholder="Search by name..." />
          <FilterButtonGroup
            label="Status"
            value={statusFilter}
            onChange={setStatusFilter}
            options={[
              { value: 'all', label: 'All' },
              { value: 'online', label: 'Online', icon: <StatusDot variant="online" size="sm" /> },
              {
                value: 'offline',
                label: 'Offline',
                icon: <StatusDot variant="offline" size="sm" />,
              },
            ]}
          />
          <FilterSort
            label="Sort by"
            value={sortBy}
            order={sortOrder}
            onChange={(v, o) => {
              setSortBy(v);
              setSortOrder(o);
            }}
            options={[
              { value: 'name', label: 'Name' },
              { value: 'agents', label: 'Agents', icon: <BotIcon /> },
            ]}
          />
          <FilterClear
            active={hasFilters}
            onClear={() => {
              setFilter('');
              setStatusFilter('all');
            }}
          />
        </FilterBar>
        <FilterResults
          icon={<ServerIcon />}
          filtered={filtered.length}
          total={MACHINES.length}
          label="machines"
        />
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Platform</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Agents</TableHead>
              <TableHead>Last Seen</TableHead>
              <TableHead className="w-10" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6}>
                  <EmptyState title="No machines match" description="Try adjusting your filters." />
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((m) => (
                <TableRow key={m.name}>
                  <TableCell className="font-medium">{m.name}</TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">
                    {m.platform}/{m.arch}
                  </TableCell>
                  <TableCell>
                    <StatusDot variant={m.status} label={m.status} />
                  </TableCell>
                  <TableCell>{m.agents}</TableCell>
                  <TableCell className="text-muted-foreground">{m.last_seen}</TableCell>
                  <TableCell>
                    <DropdownMenu
                      trigger={
                        <IconButton icon={<EditIcon />} onClick={() => {}} title="Actions" />
                      }
                      side="top"
                    >
                      <DropdownMenuLabel>Machine</DropdownMenuLabel>
                      <DropdownMenuItem>View details</DropdownMenuItem>
                      <DropdownMenuItem>View agents</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem variant="destructive">Deregister</DropdownMenuItem>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </S>

      <S title="Runs Table">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Agent</TableHead>
              <TableHead>Machine</TableHead>
              <TableHead>State</TableHead>
              <TableHead>Started</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {RUNS.map((r) => (
              <TableRow key={r.id}>
                <TableCell>
                  <InlineCode>{r.id}</InlineCode>
                </TableCell>
                <TableCell className="font-medium">{r.agent}</TableCell>
                <TableCell className="text-muted-foreground">{r.machine ?? '—'}</TableCell>
                <TableCell>
                  <Badge variant={runStateColor(r.state)}>{r.state}</Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">{r.started}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </S>

      <S title="Pagination">
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground">Page {pageNum} of 12 · 120 total runs</p>
          <Pagination page={pageNum} pageCount={12} onPageChange={setPageNum} />
        </div>
      </S>

      <S title="Empty State">
        <div className="grid grid-cols-2 gap-4">
          <div className="border border-border rounded-lg">
            <EmptyState
              icon={<BotIcon />}
              title="No agents found"
              description="Connect a machine to register agents."
              action={<Button size="sm">Get Started</Button>}
            />
          </div>
          <div className="border border-border rounded-lg">
            <EmptyState
              icon={<PlayIcon />}
              title="No runs yet"
              description="Create your first run to see results here."
              action={
                <Button size="sm" variant="outline">
                  Create Run
                </Button>
              }
            />
          </div>
        </div>
      </S>

      <S title="Status Dot">
        <div className="flex flex-wrap items-center gap-4">
          <StatusDot variant="online" label="Online" />
          <StatusDot variant="offline" label="Offline" />
          <StatusDot variant="working" label="Working" />
          <StatusDot variant="error" label="Error" />
          <StatusDot variant="warning" label="Warning" />
          <StatusDot variant="info" label="Info" />
          <StatusDot variant="pending" label="Pending" />
        </div>
      </S>

      <S title="Code Block">
        <CodeBlock
          language="bash"
          code={`npm install -g @agentage/cli\nagentage login\nagentage daemon start`}
        />
        <CodeBlock
          language="typescript"
          code={`import { Agent } from '@agentage/core';\n\nconst agent: Agent = {\n  name: 'code-reviewer',\n  description: 'Reviews PRs for quality',\n  version: '1.0.0',\n};`}
          className="mt-3"
        />
      </S>

      <S title="Progress">
        <div className="space-y-3 max-w-md">
          {(
            [
              ['Default', 65, 'default'],
              ['Success', 100, 'success'],
              ['Warning', 80, 'warning'],
              ['Error', 30, 'destructive'],
              ['Info', 50, 'info'],
            ] as const
          ).map(([label, value, variant]) => (
            <div key={label} className="flex items-center gap-3">
              <span className="text-xs text-muted-foreground w-16">{label}</span>
              <Progress value={value} variant={variant} />
              <span className="text-xs text-muted-foreground w-8">{value}%</span>
            </div>
          ))}
        </div>
      </S>
    </>
  );
};

/* ═══════════════════ FORMS ═══════════════════ */
const FormsPage = () => {
  const [checked, setChecked] = useState(false);
  const [switchOn, setSwitchOn] = useState(false);
  const [radio, setRadio] = useState('option1');
  const [sliderVal, setSliderVal] = useState(40);
  const [combo, setCombo] = useState('');
  const [date, setDate] = useState<Date | undefined>();
  const [toggleVal, setToggleVal] = useState('dark');

  return (
    <>
      <Heading
        as="h1"
        description="Inputs, selects, checkboxes, sliders, and advanced form controls"
      >
        Forms
      </Heading>

      <S title="Input, Textarea, Select">
        <div className="grid grid-cols-2 gap-4 max-w-lg">
          <FormField label="Name" required>
            <Input placeholder="Enter name..." />
          </FormField>
          <FormField label="Email" error="Invalid email address">
            <Input error placeholder="user@..." />
          </FormField>
          <FormField label="Role" className="col-span-2">
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select role..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="user">User</SelectItem>
              </SelectContent>
            </Select>
          </FormField>
          <FormField label="Bio" hint="Max 200 characters" className="col-span-2">
            <Textarea placeholder="Tell us about yourself..." rows={3} />
          </FormField>
        </div>
      </S>

      <S title="Label">
        <div className="flex items-center gap-4">
          <Label htmlFor="label-demo" required>
            Username
          </Label>
          <Input id="label-demo" placeholder="Click label to focus" className="max-w-xs" />
        </div>
      </S>

      <S title="Checkbox & Switch">
        <div className="space-y-3">
          <div className="flex items-center gap-8">
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <Checkbox checked={checked} onCheckedChange={setChecked} />
              Accept terms
            </label>
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <Checkbox checked={true} onCheckedChange={() => {}} />
              Checked
            </label>
            <label className="flex items-center gap-2 text-sm">
              <Checkbox disabled />
              Disabled
            </label>
          </div>
          <div className="flex items-center gap-8">
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <Switch checked={switchOn} onCheckedChange={setSwitchOn} />
              Notifications
            </label>
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <Switch checked={true} onCheckedChange={() => {}} />
              Active
            </label>
            <label className="flex items-center gap-2 text-sm">
              <Switch disabled />
              Disabled
            </label>
          </div>
        </div>
      </S>

      <S title="Radio Group">
        <RadioGroup value={radio} onValueChange={setRadio}>
          <RadioGroupItem value="option1">Default option</RadioGroupItem>
          <RadioGroupItem value="option2">Alternative option</RadioGroupItem>
          <RadioGroupItem value="option3" disabled>
            Disabled option
          </RadioGroupItem>
        </RadioGroup>
      </S>

      <S title="Slider">
        <div className="max-w-sm space-y-2">
          <Slider value={sliderVal} onValueChange={setSliderVal} aria-label="Volume" />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>0</span>
            <span>{sliderVal}</span>
            <span>100</span>
          </div>
        </div>
      </S>

      <S title="Combobox">
        <div className="max-w-sm">
          <Combobox
            value={combo}
            onValueChange={setCombo}
            placeholder="Select agent..."
            options={[
              {
                value: 'code-review',
                label: 'Code Reviewer',
                description: 'Reviews PRs for quality',
              },
              { value: 'test-gen', label: 'Test Generator', description: 'Generates unit tests' },
              { value: 'doc-writer', label: 'Doc Writer', description: 'Writes documentation' },
              { value: 'deploy', label: 'Deploy Agent', description: 'Handles deployments' },
              { value: 'monitor', label: 'Monitor Agent', description: 'Watches for anomalies' },
            ]}
          />
          {combo && (
            <p className="mt-2 text-xs text-muted-foreground">
              Selected: <InlineCode>{combo}</InlineCode>
            </p>
          )}
        </div>
      </S>

      <S title="Date Picker">
        <div className="max-w-sm">
          <DatePicker value={date} onValueChange={setDate} />
          {date && (
            <p className="mt-2 text-xs text-muted-foreground">
              Selected: {date.toLocaleDateString()}
            </p>
          )}
        </div>
      </S>

      <S title="Toggle Group">
        <ToggleGroup
          value={toggleVal}
          onChange={setToggleVal}
          options={[
            { value: 'light', label: 'Light' },
            { value: 'dark', label: 'Dark' },
            { value: 'system', label: 'System' },
          ]}
          columns={3}
        />
      </S>
    </>
  );
};

/* ═══════════════════ FEEDBACK & OVERLAY ═══════════════════ */
const FeedbackPage = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [cmdOpen, setCmdOpen] = useState(false);

  return (
    <>
      <Heading as="h1" description="Modals, dialogs, toasts, tooltips, and menus">
        Feedback
      </Heading>

      <S title="Alert">
        <div className="space-y-2 max-w-lg">
          <Alert onClose={() => {}}>Default — neutral information.</Alert>
          <Alert variant="info" icon={<InfoIcon />} onClose={() => {}}>
            Info — with icon and close button.
          </Alert>
          <Alert variant="success" onClose={() => {}}>
            Success — operation completed.
          </Alert>
          <Alert variant="warning" onClose={() => {}}>
            Warning — check configuration.
          </Alert>
          <Alert variant="destructive" onClose={() => {}}>
            Error — something went wrong.
          </Alert>
        </div>
      </S>

      <S title="Toast">
        <ToastDemo />
      </S>

      <S title="Tooltip">
        <div className="flex gap-4">
          <Tooltip content="Edit this item">
            <Button variant="outline" size="sm">
              Top
            </Button>
          </Tooltip>
          <Tooltip content="More info" side="bottom">
            <Button variant="outline" size="sm">
              Bottom
            </Button>
          </Tooltip>
          <Tooltip content="Navigate" side="left">
            <Button variant="outline" size="sm">
              Left
            </Button>
          </Tooltip>
          <Tooltip content="Navigate" side="right">
            <Button variant="outline" size="sm">
              Right
            </Button>
          </Tooltip>
        </div>
      </S>

      <S title="Modal">
        <Button onClick={() => setModalOpen(true)}>Open Modal</Button>
        <Modal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title="Create Run"
          description="Configure and start a new agent run."
        >
          <div className="space-y-3">
            <FormField label="Agent" required>
              <Combobox
                value=""
                onValueChange={() => {}}
                placeholder="Select agent..."
                options={[
                  { value: 'code-review', label: 'Code Reviewer' },
                  { value: 'test-gen', label: 'Test Generator' },
                ]}
              />
            </FormField>
            <FormField label="Task">
              <Textarea placeholder="What should the agent do?" rows={3} />
            </FormField>
          </div>
          <ModalFooter>
            <Button variant="ghost" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setModalOpen(false)}>Start Run</Button>
          </ModalFooter>
        </Modal>
      </S>

      <S title="Alert Dialog">
        <Button variant="destructive" onClick={() => setAlertOpen(true)}>
          Delete Machine
        </Button>
        <AlertDialog
          open={alertOpen}
          onOpenChange={setAlertOpen}
          title="Delete Machine?"
          description="This will deregister the machine and remove all associated agents. This action cannot be undone."
          confirmLabel="Delete"
          variant="destructive"
          onConfirm={() => {}}
        />
      </S>

      <S title="Sheet">
        <Button variant="outline" onClick={() => setSheetOpen(true)}>
          Open Sheet
        </Button>
        <Sheet
          open={sheetOpen}
          onOpenChange={setSheetOpen}
          title="Agent Details"
          description="View and edit agent configuration."
        >
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Avatar name="Code Reviewer" size="lg" />
              <div>
                <p className="font-semibold text-sm">Code Reviewer</p>
                <p className="text-xs text-muted-foreground">v1.2.0 · dev-machine</p>
              </div>
            </div>
            <Separator />
            <FormField label="Name">
              <Input defaultValue="code-reviewer" />
            </FormField>
            <FormField label="Description">
              <Textarea defaultValue="Reviews PRs for quality issues" rows={3} />
            </FormField>
          </div>
        </Sheet>
      </S>

      <S title="Dropdown Menu">
        <DropdownMenu
          trigger={
            <Button variant="outline" size="sm">
              Actions
            </Button>
          }
        >
          <DropdownMenuLabel>Run Actions</DropdownMenuLabel>
          <DropdownMenuItem>View details</DropdownMenuItem>
          <DropdownMenuItem>Copy run ID</DropdownMenuItem>
          <DropdownMenuItem>Re-run</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive">Cancel run</DropdownMenuItem>
        </DropdownMenu>
      </S>

      <S title="Popover">
        <Popover
          trigger={
            <Button variant="outline" onClick={() => setPopoverOpen(!popoverOpen)}>
              Toggle Popover
            </Button>
          }
          content={
            <div className="space-y-2">
              <p className="text-sm font-medium">Machine Info</p>
              <p className="text-xs text-muted-foreground">linux/amd64 · 5 agents · Online</p>
            </div>
          }
          isOpen={popoverOpen}
          onClose={() => setPopoverOpen(false)}
        />
      </S>

      <S title="Hover Card">
        <HoverCard trigger={<Button variant="link">@dev-machine</Button>}>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Avatar name="Dev Machine" size="sm" />
              <span className="font-semibold text-sm">dev-machine</span>
              <StatusDot variant="online" />
            </div>
            <p className="text-xs text-muted-foreground">
              linux/amd64 · 5 agents · Last seen 2m ago
            </p>
            <div className="flex gap-2">
              <Badge variant="success">Online</Badge>
              <Badge variant="outline">5 agents</Badge>
            </div>
          </div>
        </HoverCard>
      </S>

      <S title="Command Palette">
        <Button variant="outline" onClick={() => setCmdOpen(true)}>
          Open Command <Kbd>⌘K</Kbd>
        </Button>
        <Command open={cmdOpen} onOpenChange={setCmdOpen}>
          <CommandGroup heading="Navigation">
            <CommandItem icon={<HomeIcon />} shortcut="⌘1" onClick={() => setCmdOpen(false)}>
              Dashboard
            </CommandItem>
            <CommandItem icon={<BotIcon />} shortcut="⌘2" onClick={() => setCmdOpen(false)}>
              Agents
            </CommandItem>
            <CommandItem icon={<ServerIcon />} shortcut="⌘3" onClick={() => setCmdOpen(false)}>
              Machines
            </CommandItem>
            <CommandItem icon={<PlayIcon />} shortcut="⌘4" onClick={() => setCmdOpen(false)}>
              Runs
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Actions">
            <CommandItem icon={<EditIcon />} onClick={() => setCmdOpen(false)}>
              Create new run
            </CommandItem>
            <CommandItem icon={<UserIcon />} onClick={() => setCmdOpen(false)}>
              Settings
            </CommandItem>
          </CommandGroup>
          <CommandEmpty>No results found.</CommandEmpty>
        </Command>
      </S>
    </>
  );
};

/* ═══════════════════ LAYOUT ═══════════════════ */
const LayoutPage = () => (
  <>
    <Heading as="h1" description="Page structure, sidebars, sections, and layout patterns">
      Layout
    </Heading>

    <S title="Page Header">
      <div className="rounded-lg border border-border bg-sidebar p-4">
        <PageHeader
          icon={<BotIcon />}
          title="Agents"
          subtitle="Manage your AI agents across machines"
          actions={[{ icon: <EditIcon />, title: 'New Agent', onClick: () => {} }]}
        />
      </div>
      <div className="rounded-lg border border-border bg-sidebar p-4 mt-3">
        <PageHeader
          icon={<PlayIcon />}
          title="Run #abc-123"
          subtitle="code-reviewer on dev-machine"
          actions={[
            { icon: <InfoIcon />, title: 'Details', onClick: () => {} },
            { icon: <EditIcon />, title: 'Cancel', onClick: () => {}, variant: 'destructive' },
          ]}
        >
          <Badge variant="success">completed</Badge>
        </PageHeader>
      </div>
    </S>

    <S title="Section">
      <div className="grid grid-cols-2 gap-4">
        <Section
          icon={<UserIcon />}
          iconColor="bg-blue-500/10 text-blue-500"
          title="Profile"
          description="Your account information"
          action={
            <Button variant="ghost" size="sm">
              Edit
            </Button>
          }
        >
          <div className="flex items-center gap-3">
            <Avatar name="Ada Lovelace" size="lg" />
            <div>
              <p className="text-sm font-medium">Ada Lovelace</p>
              <p className="text-xs text-muted-foreground">ada@example.com</p>
              <p className="text-xs text-muted-foreground">Founder & CEO · Agentage</p>
            </div>
          </div>
        </Section>
        <Section
          icon={<BotIcon />}
          iconColor="bg-green-500/10 text-green-500"
          title="Agent Settings"
          description="Configure default behavior"
        >
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm">Auto-restart on failure</span>
              <Switch checked={true} onCheckedChange={() => {}} />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Verbose logging</span>
              <Switch onCheckedChange={() => {}} />
            </div>
          </div>
        </Section>
      </div>
    </S>

    <S title="Sidebar">
      <div className="border border-border rounded-lg overflow-hidden h-[420px] flex">
        <Sidebar width="w-56">
          <SidebarHeader>
            <BrandedLogo />
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Main</SidebarGroupLabel>
              <NavLink icon={<HomeIcon />} href="#" active>
                Dashboard
              </NavLink>
              <NavLink icon={<ServerIcon />} href="#">
                Machines{' '}
                <Badge variant="outline" className="ml-auto text-[10px]">
                  {MACHINES.length}
                </Badge>
              </NavLink>
              <NavLink icon={<BotIcon />} href="#">
                Agents
              </NavLink>
              <NavLink icon={<PlayIcon />} href="#">
                Runs
              </NavLink>
            </SidebarGroup>
            <SidebarGroup>
              <SidebarGroupLabel>Settings</SidebarGroupLabel>
              <NavLink icon={<UserIcon />} href="#">
                Profile
              </NavLink>
              <NavLink icon={<MailIcon />} href="#">
                Notifications
              </NavLink>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter>
            <div className="flex items-center gap-2">
              <Avatar name="Ada Lovelace" size="sm" />
              <div className="min-w-0">
                <p className="text-xs font-medium truncate">Ada Lovelace</p>
                <p className="text-[10px] text-muted-foreground truncate">ada@example.com</p>
              </div>
            </div>
          </SidebarFooter>
        </Sidebar>
        <div className="flex-1 flex flex-col bg-background overflow-hidden">
          <div className="shrink-0 px-4 py-3 border-b border-border">
            <PageHeader
              icon={<HomeIcon />}
              title="Dashboard"
              subtitle="Overview of your platform"
            />
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            <div className="grid grid-cols-3 gap-3">
              <StatCard
                icon={<ServerIcon />}
                iconColor="bg-green-500/10 text-green-500"
                title="Machines"
                value={`${onlineCount} / ${MACHINES.length}`}
              />
              <StatCard
                icon={<BotIcon />}
                iconColor="bg-blue-500/10 text-blue-500"
                title="Agents"
                value={totalAgents}
              />
              <StatCard
                icon={<PlayIcon />}
                iconColor="bg-amber-500/10 text-amber-500"
                title="Active Runs"
                value={activeRuns}
              />
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Platform</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Agents</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {MACHINES.map((m) => (
                  <TableRow key={m.name}>
                    <TableCell className="font-medium">{m.name}</TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      {m.platform}/{m.arch}
                    </TableCell>
                    <TableCell>
                      <StatusDot variant={m.status} size="sm" />
                    </TableCell>
                    <TableCell>{m.agents}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </S>

    <S title="Scroll Area">
      <ScrollArea className="h-40 border border-border rounded-lg p-3">
        {Array.from({ length: 30 }, (_, i) => (
          <div
            key={i}
            className="flex items-center justify-between py-2 border-b border-border last:border-0"
          >
            <span className="text-sm">Event #{i + 1}</span>
            <span className="text-xs text-muted-foreground">{i}s ago</span>
          </div>
        ))}
      </ScrollArea>
    </S>
  </>
);

/* ═══════════════════ NAVIGATION & TYPOGRAPHY ═══════════════════ */
const NavTypoPage = () => {
  const [tab, setTab] = useState('overview');
  const [collapsibleOpen, setCollapsibleOpen] = useState(false);

  return (
    <>
      <Heading as="h1" description="Breadcrumbs, tabs, headings, prose, and disclosure patterns">
        Navigation
      </Heading>

      <S title="Breadcrumb">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="#">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="#">Runs</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>run-abc123</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </S>

      <S title="Tabs">
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
            <TabsTrigger value="logs">Logs</TabsTrigger>
            <TabsTrigger value="disabled" disabled>
              Disabled
            </TabsTrigger>
          </TabsList>
          <TabsContent value="overview">
            <p className="text-sm text-muted-foreground">
              Use arrow keys to navigate. Panels linked via aria-controls.
            </p>
          </TabsContent>
          <TabsContent value="settings">
            <p className="text-sm text-muted-foreground">Settings panel content.</p>
          </TabsContent>
          <TabsContent value="logs">
            <p className="text-sm text-muted-foreground">Logs panel content.</p>
          </TabsContent>
        </Tabs>
      </S>

      <S title="Heading">
        <div className="space-y-4">
          <Heading as="h1">Heading 1 — Page Title</Heading>
          <Heading as="h2" description="With supporting description">
            Heading 2 — Section
          </Heading>
          <Heading as="h3">Heading 3 — Subsection</Heading>
          <Heading as="h4">Heading 4 — Label</Heading>
        </div>
      </S>

      <S title="Prose">
        <Prose className="max-w-lg">
          <p>
            This is a <strong>rich text</strong> block with <a href="#">links</a>,{' '}
            <code>inline code</code>, and proper spacing.
          </p>
          <p>Second paragraph with natural spacing between blocks.</p>
          <h3>Subsection</h3>
          <ul>
            <li>List item one</li>
            <li>List item two</li>
          </ul>
          <blockquote>Blockquote with border styling.</blockquote>
        </Prose>
      </S>

      <S title="Kbd">
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-sm text-muted-foreground">Command Palette:</span>
          <Kbd>⌘</Kbd>
          <Kbd>K</Kbd>
          <span className="text-sm text-muted-foreground ml-4">Save:</span>
          <Kbd>Ctrl</Kbd>
          <Kbd>S</Kbd>
          <span className="text-sm text-muted-foreground ml-4">Close:</span>
          <Kbd>Esc</Kbd>
        </div>
      </S>

      <S title="Collapsible">
        <div className="max-w-md border border-border rounded-lg overflow-hidden">
          <CollapsibleTrigger onClick={() => setCollapsibleOpen(!collapsibleOpen)}>
            Thinking... {collapsibleOpen ? '(collapse)' : '(expand)'}
          </CollapsibleTrigger>
          {collapsibleOpen && (
            <CollapsibleContent className="px-3 pb-3">
              <p className="text-sm text-muted-foreground">
                I need to analyze the code structure and determine the best approach for
                implementing this feature...
              </p>
            </CollapsibleContent>
          )}
        </div>
      </S>

      <S title="Accordion">
        <div className="max-w-md border border-border rounded-lg px-4">
          <Accordion>
            <AccordionItem value="faq-1">
              <AccordionTrigger>What is Agentage?</AccordionTrigger>
              <AccordionContent>
                A control plane for AI agents across machines. Daemon per machine, hub as single
                pane of glass.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="faq-2">
              <AccordionTrigger>How do I get started?</AccordionTrigger>
              <AccordionContent>
                Install the CLI with <InlineCode>npm install -g @agentage/cli</InlineCode>, then run{' '}
                <InlineCode>agentage login</InlineCode>.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="faq-3">
              <AccordionTrigger>Can I use multiple machines?</AccordionTrigger>
              <AccordionContent>
                Yes! Each machine runs its own daemon. The hub aggregates all machines, agents, and
                runs.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </S>
    </>
  );
};

const SITE_DOCS_MD = `## Installation

Install the package:

\`\`\`bash
npm install @agentage/design-system
\`\`\`

It supports **bold**, *italic*, [links](https://agentage.io), and \`inline code\`.

### Features

- GitHub-flavored markdown via remark-gfm
- Tables and task lists
- Optional raw HTML via rehype-raw

> "One memory. Every AI. Owned by you."`;

const SiteDocsPage = () => {
  const initialChips = ['Database', 'AI / ML', 'Cloud', 'Productivity'];
  const [chips, setChips] = useState<string[]>(initialChips);
  return (
    <>
      <Heading
        as="h1"
        description="Markdown rendering, copy buttons, removable chips, footers, top bars, and doc sidebars — added for the mcpxhub merge gap-fill."
      >
        Site & Docs
      </Heading>

      <S title="MarkdownRenderer">
        <div className="rounded-lg border border-border bg-card p-6">
          <MarkdownRenderer>{SITE_DOCS_MD}</MarkdownRenderer>
        </div>
      </S>

      <S title="CopyButton">
        <div className="flex flex-wrap items-center gap-3">
          <CopyButton text="npm install @agentage/design-system" />
          <CopyButton text="npx agentage memory init" variant="default" />
          <CopyButton text="memory.agentage.io" variant="secondary" />
          <CopyButton text="export TOKEN=..." iconOnly variant="ghost" />
        </div>
        <div className="mt-3 flex items-center gap-2 rounded-md border border-border bg-muted/30 px-3 py-2 font-mono text-xs">
          <span className="flex-1 truncate text-foreground">
            $ npm install @agentage/design-system
          </span>
          <CopyButton text="npm install @agentage/design-system" iconOnly variant="ghost" />
        </div>
      </S>

      <S title="Chip">
        <div className="flex flex-wrap gap-2">
          <Chip>Default</Chip>
          <Chip variant="default">Primary</Chip>
          <Chip variant="secondary">Secondary</Chip>
          <Chip variant="success">Active</Chip>
          <Chip variant="warning">Beta</Chip>
          <Chip variant="destructive">Deprecated</Chip>
          <Chip variant="info">New</Chip>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {chips.map((c) => (
            <Chip
              key={c}
              variant="secondary"
              onRemove={() => setChips((prev) => prev.filter((x) => x !== c))}
            >
              {c}
            </Chip>
          ))}
          {chips.length < initialChips.length && (
            <Button size="sm" variant="ghost" onClick={() => setChips(initialChips)}>
              Reset
            </Button>
          )}
        </div>
      </S>

      <S title="Footer">
        <div className="-mx-6 rounded-lg overflow-hidden border border-border">
          <Footer className="border-t-0">
            <FooterSections>
              <FooterSection title="Product">
                <FooterLink href="#">Memory</FooterLink>
                <FooterLink href="#">MCP Hub</FooterLink>
                <FooterLink href="#">Pricing</FooterLink>
              </FooterSection>
              <FooterSection title="Developers">
                <FooterLink href="#">Docs</FooterLink>
                <FooterLink href="#">API</FooterLink>
                <FooterLink href="#">CLI</FooterLink>
              </FooterSection>
              <FooterSection title="Company">
                <FooterLink href="#">About</FooterLink>
                <FooterLink href="#">Blog</FooterLink>
                <FooterLink href="#">Contact</FooterLink>
              </FooterSection>
              <FooterSection title="Legal">
                <FooterLink href="#">Privacy</FooterLink>
                <FooterLink href="#">Terms</FooterLink>
                <FooterLink href="#">Sub-processors</FooterLink>
              </FooterSection>
            </FooterSections>
            <FooterBottom copyright="© 2026 agentage. All rights reserved.">
              <div className="flex items-center gap-3">
                <a href="#" className="transition-colors hover:text-foreground">
                  GitHub
                </a>
                <a href="#" className="transition-colors hover:text-foreground">
                  X
                </a>
                <a href="#" className="transition-colors hover:text-foreground">
                  RSS
                </a>
              </div>
            </FooterBottom>
          </Footer>
        </div>
      </S>

      <S title="TopBar">
        <div className="-mx-6 overflow-hidden rounded-lg border border-border">
          <TopBar className="border-b-0">
            <TopBarBrand>
              <span className="text-primary">⟁</span>
              Agentage
            </TopBarBrand>
            <TopBarNav>
              <TopBarNavItem href="#" active>
                Memory
              </TopBarNavItem>
              <TopBarNavItem href="#">Hub</TopBarNavItem>
              <TopBarNavItem href="#">Docs</TopBarNavItem>
              <TopBarNavItem href="#">Pricing</TopBarNavItem>
            </TopBarNav>
            <TopBarActions>
              <Button variant="ghost" size="sm">
                Sign in
              </Button>
              <Button size="sm">Start free</Button>
            </TopBarActions>
          </TopBar>
        </div>
      </S>

      <S title="DocSidebar">
        <div
          className="flex overflow-hidden rounded-lg border border-border"
          style={{ minHeight: 380 }}
        >
          <DocSidebar className="border-r" width="w-56">
            <DocSidebarGroup title="Getting started">
              <DocSidebarItem href="#" active>
                Introduction
              </DocSidebarItem>
              <DocSidebarItem href="#">Install the CLI</DocSidebarItem>
              <DocSidebarItem href="#">Connect to Claude</DocSidebarItem>
              <DocSidebarItem href="#">Connect to ChatGPT</DocSidebarItem>
            </DocSidebarGroup>
            <DocSidebarGroup title="MCP tools">
              <DocSidebarItem href="#">memory__search</DocSidebarItem>
              <DocSidebarItem href="#">memory__read</DocSidebarItem>
              <DocSidebarItem href="#">memory__write</DocSidebarItem>
              <DocSidebarItem href="#" depth={1}>
                Schemas
              </DocSidebarItem>
              <DocSidebarItem href="#" depth={1}>
                Errors
              </DocSidebarItem>
              <DocSidebarItem href="#">memory__edit</DocSidebarItem>
              <DocSidebarItem href="#">memory__list</DocSidebarItem>
              <DocSidebarItem href="#">memory__delete</DocSidebarItem>
            </DocSidebarGroup>
            <DocSidebarGroup title="Reference">
              <DocSidebarItem href="#">Auth (OAuth 2.1)</DocSidebarItem>
              <DocSidebarItem href="#">Rate limits</DocSidebarItem>
            </DocSidebarGroup>
          </DocSidebar>
          <div className="flex-1 p-6">
            <Heading as="h2">Introduction</Heading>
            <Prose className="mt-3">
              <p>
                Welcome to <strong>agentage Memory</strong>. This is a documentation layout demo
                using <code>DocSidebar</code> on the left and a content area on the right.
              </p>
              <p>
                The sidebar supports grouped sections, active state, and nested items via the{' '}
                <code>depth</code> prop.
              </p>
            </Prose>
          </div>
        </div>
      </S>
    </>
  );
};

/* ═══════════════════ CARDS (advanced patterns) ═══════════════════ */

// Deterministic-ish pseudo-random for the activity heatmap so frames don't dance.
const heatmapData = (() => {
  const rows = 7;
  const cols = 12;
  const grid: number[][] = [];
  let seed = 1234;
  const rng = (): number => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
  for (let r = 0; r < rows; r++) {
    const row: number[] = [];
    const base = r < 5 ? 8 : 3;
    for (let c = 0; c < cols; c++) {
      row.push(Math.floor(rng() * base * (1 + c * 0.05)) + 1);
    }
    grid.push(row);
  }
  return grid;
})();

const CardsPage = () => (
  <>
    <Heading
      as="h1"
      description="Advanced card patterns informed by 2026 dashboard research: gauges with threshold zones, donuts for part-of-whole, score bands (NPS/CSAT), conversion funnels, activity & cohort heatmaps, multi-stat groupings, ranked lists."
    >
      Cards
    </Heading>

    <S title="Gauge Card — threshold zones">
      <p className="-mt-2 text-xs text-muted-foreground">
        Semicircle gauge with optional green/yellow/red threshold zones. Use when crossing a limit
        matters (capacity, error rate, latency).
      </p>
      <div className="grid grid-cols-3 gap-4">
        <GaugeCard
          title="CPU"
          value={34}
          thresholds={{ warning: 60, critical: 85 }}
          format={(n) => `${n}%`}
          description="4 cores · linux/amd64"
        />
        <GaugeCard
          title="Memory"
          value={72}
          thresholds={{ warning: 70, critical: 90 }}
          format={(n) => `${n}%`}
          description="11.5 / 16 GB used"
        />
        <GaugeCard
          title="p99 latency"
          value={420}
          max={1000}
          thresholds={{ warning: 300, critical: 700 }}
          format={(n) => `${n} ms`}
          description="API gateway · last 5 min"
        />
      </div>
    </S>

    <S title="Donut Card — part of whole">
      <p className="-mt-2 text-xs text-muted-foreground">
        For composition (storage breakdown, traffic source mix). Pair donut with a legend; center
        label is optional.
      </p>
      <div className="grid grid-cols-2 gap-4">
        <DonutCard
          title="Storage by type"
          segments={[
            { label: 'Notes', value: 1240, color: 'var(--color-primary)' },
            { label: 'Images', value: 820, color: 'var(--color-info)' },
            { label: 'Attachments', value: 380, color: 'var(--color-warning)' },
            { label: 'Other', value: 110, color: 'var(--color-muted-foreground)' },
          ]}
          centerLabel="2.55GB"
          centerSubLabel="of 5 GB"
        />
        <DonutCard
          title="Traffic source"
          segments={[
            { label: 'Direct', value: 42, color: 'var(--color-primary)' },
            { label: 'Search', value: 28, color: 'var(--color-info)' },
            { label: 'Referral', value: 18, color: 'var(--color-success)' },
            { label: 'Social', value: 12, color: 'var(--color-warning)' },
          ]}
          centerLabel="14.2K"
          centerSubLabel="visits / 7d"
        />
      </div>
    </S>

    <S title="Score Card — semantic bands">
      <p className="-mt-2 text-xs text-muted-foreground">
        0..max with colored bands. Designed for NPS, CSAT, health scores. Marker shows the current
        position; band pill labels which zone you're in.
      </p>
      <div className="grid grid-cols-3 gap-4">
        <ScoreCard
          title="NPS"
          score={47}
          max={100}
          bands={[
            { label: 'Detractors', from: 0, to: 30, color: 'var(--color-destructive)' },
            { label: 'Passives', from: 30, to: 50, color: 'var(--color-warning)' },
            { label: 'Promoters', from: 50, to: 100, color: 'var(--color-success)' },
          ]}
          description="Last 30 days · 482 responses"
        />
        <ScoreCard
          title="CSAT"
          score={4.2}
          max={5}
          bands={[
            { label: 'Poor', from: 0, to: 2, color: 'var(--color-destructive)' },
            { label: 'OK', from: 2, to: 4, color: 'var(--color-warning)' },
            { label: 'Great', from: 4, to: 5, color: 'var(--color-success)' },
          ]}
          description="Survey average · 1.2K responses"
        />
        <ScoreCard
          title="Health"
          score={82}
          bands={[
            { label: 'Critical', from: 0, to: 50, color: 'var(--color-destructive)' },
            { label: 'Warning', from: 50, to: 75, color: 'var(--color-warning)' },
            { label: 'Healthy', from: 75, to: 100, color: 'var(--color-success)' },
          ]}
          description="All systems checked 30s ago"
        />
      </div>
    </S>

    <S title="Funnel Card — conversion stages">
      <p className="-mt-2 text-xs text-muted-foreground">
        Vertical funnel with per-stage drop-off %. Bar width is proportional to the top of the
        funnel.
      </p>
      <div className="grid grid-cols-2 gap-4">
        <FunnelCard
          title="Signup → paid"
          stages={[
            { label: 'Landing visit', value: 18420 },
            { label: 'Signup started', value: 4210 },
            { label: 'Email verified', value: 3680 },
            { label: 'First memory written', value: 2140 },
            { label: 'Paid subscriber', value: 312 },
          ]}
        />
        <FunnelCard
          title="Hiring pipeline"
          stages={[
            { label: 'Applications', value: 264 },
            { label: 'Phone screen', value: 71 },
            { label: 'Onsite', value: 22 },
            { label: 'Offer extended', value: 8 },
            { label: 'Hired', value: 5 },
          ]}
        />
      </div>
    </S>

    <S title="Heatmap Card — activity & cohorts">
      <p className="-mt-2 text-xs text-muted-foreground">
        Grid where cell intensity encodes value. Use for activity-by-time, cohort retention,
        error-by-route.
      </p>
      <div className="grid grid-cols-2 gap-4">
        <HeatmapCard
          title="Activity (last 12 weeks)"
          rowLabels={['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']}
          data={heatmapData}
          description="Notes written per day · darker = more"
        />
        <HeatmapCard
          title="Cohort retention"
          rowLabels={['Jan', 'Feb', 'Mar', 'Apr', 'May']}
          colLabels={['M1', 'M2', 'M3', 'M4', 'M5', 'M6']}
          data={[
            [100, 72, 58, 51, 47, 44],
            [100, 75, 60, 53, 49, 0],
            [100, 78, 62, 55, 0, 0],
            [100, 81, 65, 0, 0, 0],
            [100, 84, 0, 0, 0, 0],
          ]}
          max={100}
          color="var(--color-info)"
          description="% of cohort retained over months"
        />
      </div>
    </S>

    <S title="Multi-Stat Card — grouped figures">
      <p className="-mt-2 text-xs text-muted-foreground">
        Several tightly related stats in one card with a shared header. Avoids 4-up visual noise.
      </p>
      <div className="grid grid-cols-2 gap-4">
        <MultiStatCard
          title="ARR composition"
          stats={[
            { label: 'New', value: '$620K', trend: { value: '+22%', up: true } },
            { label: 'Expansion', value: '$380K', trend: { value: '+11%', up: true } },
            { label: 'Churn', value: '−$100K', trend: { value: '−4%', up: false } },
          ]}
          description="Last 12 months · monthly average"
        />
        <MultiStatCard
          title="Run outcomes today"
          stats={[
            { label: 'Submitted', value: 142 },
            { label: 'Working', value: 8 },
            { label: 'Completed', value: 127, trend: { value: '+12', up: true } },
            { label: 'Failed', value: 7, trend: { value: '−3', up: true } },
          ]}
        />
      </div>
    </S>

    <S title="Ranked List Card — top-N">
      <p className="-mt-2 text-xs text-muted-foreground">
        Rank + label + value. Use for top agents, busiest machines, hottest queries.
      </p>
      <div className="grid grid-cols-2 gap-4">
        <RankedListCard
          title="Top agents by run count"
          items={[
            { label: 'code-reviewer', value: 184, hint: '2.1s avg' },
            { label: 'test-gen', value: 152, hint: '3.4s avg' },
            { label: 'doc-writer', value: 98, hint: '5.8s avg' },
            { label: 'deploy', value: 67, hint: '12.3s avg' },
            { label: 'monitor', value: 41, hint: '0.8s avg' },
          ]}
        />
        <RankedListCard
          title="Busiest machines (24h)"
          items={[
            { label: 'prod-worker-1', value: '94%', hint: '8 agents' },
            { label: 'dev-machine', value: '67%', hint: '5 agents' },
            { label: 'staging-01', value: '42%', hint: '3 agents' },
            { label: 'test-runner', value: '18%', hint: '1 agent' },
          ]}
        />
      </div>
    </S>
  </>
);
