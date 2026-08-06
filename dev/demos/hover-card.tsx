'use client';
import { Avatar, Badge, Button, HoverCard, StatusDot } from '../../src';

export const Demo = () => (
  <>
    <HoverCard trigger={<Button variant="link">@dev-machine</Button>}>
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Avatar name="Dev Machine" size="sm" />
          <span className="font-semibold text-sm">dev-machine</span>
          <StatusDot variant="online" />
        </div>
        <p className="text-xs text-muted-foreground">linux/amd64 · 5 agents · Last seen 2m ago</p>
        <div className="flex gap-2">
          <Badge variant="success">Online</Badge>
          <Badge variant="outline">5 agents</Badge>
        </div>
      </div>
    </HoverCard>
  </>
);
