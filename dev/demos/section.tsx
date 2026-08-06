'use client';
import { Avatar, Button, Section, Switch } from '../../src';
import { BotIcon, UserIcon } from '../lib/icons';

export const Demo = () => (
  <>
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
            <Switch
              checked={true}
              onCheckedChange={() => {}}
              aria-label="Auto-restart on failure"
            />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">Verbose logging</span>
            <Switch onCheckedChange={() => {}} aria-label="Verbose logging" />
          </div>
        </div>
      </Section>
    </div>
  </>
);
