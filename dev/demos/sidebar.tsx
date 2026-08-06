'use client';
import {
  Avatar,
  Badge,
  NavLink,
  PageHeader,
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  StatCard,
  StatusDot,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../src';
import {
  BotIcon,
  BrandedLogo,
  HomeIcon,
  MailIcon,
  PlayIcon,
  ServerIcon,
  UserIcon,
} from '../lib/icons';
import { MACHINES, activeRuns, onlineCount, totalAgents } from '../lib/data';

export const Demo = () => (
  <>
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
          <PageHeader icon={<HomeIcon />} title="Dashboard" subtitle="Overview of your platform" />
        </div>
        <div
          className="flex-1 overflow-y-auto p-4 space-y-3"
          tabIndex={0}
          role="region"
          aria-label="Dashboard content"
        >
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
  </>
);
