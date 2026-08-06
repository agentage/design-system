import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { FormField } from './form-field';
import { Input } from './input';

describe('FormField', () => {
  it('links the label to the control', () => {
    render(
      <FormField label="Name">
        <Input placeholder="Name" />
      </FormField>
    );
    expect(screen.getByLabelText('Name')).toBe(screen.getByPlaceholderText('Name'));
  });

  it('describes the control with the error and marks it invalid', () => {
    render(
      <FormField label="Email" error="Invalid email">
        <Input placeholder="Email" />
      </FormField>
    );
    const control = screen.getByPlaceholderText('Email');
    expect(control.getAttribute('aria-invalid')).toBe('true');
    expect(
      document.getElementById(control.getAttribute('aria-describedby') ?? '')?.textContent
    ).toBe('Invalid email');
  });

  it('describes the control with the hint when there is no error', () => {
    render(
      <FormField label="Bio" hint="Max 200 characters">
        <Input placeholder="Bio" />
      </FormField>
    );
    const control = screen.getByPlaceholderText('Bio');
    expect(control.getAttribute('aria-invalid')).toBeNull();
    expect(
      document.getElementById(control.getAttribute('aria-describedby') ?? '')?.textContent
    ).toBe('Max 200 characters');
  });

  it('marks the control required for assistive tech', () => {
    render(
      <FormField label="Name" required>
        <Input placeholder="Name" />
      </FormField>
    );
    expect(screen.getByPlaceholderText('Name').getAttribute('aria-required')).toBe('true');
  });

  it('keeps an explicit id on the control', () => {
    render(
      <FormField label="Role" id="role">
        <Input id="custom" placeholder="Role" />
      </FormField>
    );
    expect(screen.getByPlaceholderText('Role').id).toBe('custom');
  });
});

describe('FormField class strings', () => {
  it('keeps the root class string byte-identical', () => {
    const { container } = render(
      <FormField label="Name" className="mt-4">
        <Input placeholder="Name" />
      </FormField>
    );
    expect((container.querySelector('[data-slot="form-field"]') as HTMLElement).className).toBe(
      'space-y-1.5 mt-4'
    );
  });

  it('spreads unknown props onto the root', () => {
    render(
      <FormField label="Name" data-testid="ff">
        <Input placeholder="Name" />
      </FormField>
    );
    expect(screen.getByTestId('ff').getAttribute('data-slot')).toBe('form-field');
  });
});
