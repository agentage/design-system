'use client';
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../src';

export const Demo = () => {
  const [underlineTab, setUnderlineTab] = useState('deployments');

  return (
    <>
      <p className="-mt-2 text-xs text-muted-foreground">
        Page-level navigation variant: transparent list on a bottom rule, active tab marked by a 2px
        foreground underline.
      </p>
      <Tabs value={underlineTab} onValueChange={setUnderlineTab} variant="underline">
        <TabsList>
          <TabsTrigger value="project">Project</TabsTrigger>
          <TabsTrigger value="deployments">Deployments</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        <TabsContent value="project">
          <p className="text-sm text-muted-foreground">Project overview panel.</p>
        </TabsContent>
        <TabsContent value="deployments">
          <p className="text-sm text-muted-foreground">Deployments panel.</p>
        </TabsContent>
        <TabsContent value="analytics">
          <p className="text-sm text-muted-foreground">Analytics panel.</p>
        </TabsContent>
        <TabsContent value="settings">
          <p className="text-sm text-muted-foreground">Settings panel.</p>
        </TabsContent>
      </Tabs>
    </>
  );
};
