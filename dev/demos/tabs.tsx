'use client';
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../src';

export const Demo = () => {
  const [tab, setTab] = useState('overview');

  return (
    <>
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
    </>
  );
};
