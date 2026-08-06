'use client';
import { Footer, FooterBottom, FooterLink, FooterSection, FooterSections } from '../../src';

export const Demo = () => (
  <>
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
  </>
);
