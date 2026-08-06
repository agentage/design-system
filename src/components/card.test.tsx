import { createRef } from 'react';
import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from './card';

describe('Card', () => {
  it('forwards refs from every card element', () => {
    const refs = {
      card: createRef<HTMLDivElement>(),
      header: createRef<HTMLDivElement>(),
      title: createRef<HTMLDivElement>(),
      description: createRef<HTMLDivElement>(),
      action: createRef<HTMLDivElement>(),
      content: createRef<HTMLDivElement>(),
      footer: createRef<HTMLDivElement>(),
    };

    render(
      <Card ref={refs.card}>
        <CardHeader ref={refs.header}>
          <CardTitle ref={refs.title}>Usage</CardTitle>
          <CardDescription ref={refs.description}>Last 30 days</CardDescription>
          <CardAction ref={refs.action}>Menu</CardAction>
        </CardHeader>
        <CardContent ref={refs.content}>Body</CardContent>
        <CardFooter ref={refs.footer}>Footer</CardFooter>
      </Card>
    );

    expect(refs.card.current?.getAttribute('data-slot')).toBe('card');
    expect(refs.header.current?.getAttribute('data-slot')).toBe('card-header');
    expect(refs.title.current?.getAttribute('data-slot')).toBe('card-title');
    expect(refs.description.current?.getAttribute('data-slot')).toBe('card-description');
    expect(refs.action.current?.getAttribute('data-slot')).toBe('card-action');
    expect(refs.content.current?.getAttribute('data-slot')).toBe('card-content');
    expect(refs.footer.current?.getAttribute('data-slot')).toBe('card-footer');
  });
});
