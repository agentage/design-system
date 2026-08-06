'use client';
import { Button, TopBar, TopBarActions, TopBarBrand, TopBarNav, TopBarNavItem } from '../../src';

export const Demo = () => (
  <>
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
  </>
);
