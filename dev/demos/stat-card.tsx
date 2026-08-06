'use client';
import { Progress, StatCard, StatusDot } from '../../src';
import { BotIcon, PlayIcon, ServerIcon } from '../lib/icons';
import { MACHINES, RUNS, activeRuns, offlineCount, onlineCount, totalAgents } from '../lib/data';

export const Demo = () => (
  <>
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
      <StatCard title="CPU" value="34%" progress={34} progressLabel="CPU used" />
      <StatCard
        title="Memory"
        value="6.2 / 16 GB"
        description={<Progress value={39} variant="info" className="mt-2" label="Memory used" />}
      />
    </div>
    <div className="grid grid-cols-4 gap-4">
      <StatCard title="Storage" value="4.2 / 10 GB" progress={42} description="Plan quota" />
      <StatCard
        pressable
        icon={<ServerIcon />}
        title="Machines"
        value={MACHINES.length}
        description="Pressable — opens the machines list"
        onClick={() => undefined}
      />
    </div>
  </>
);
