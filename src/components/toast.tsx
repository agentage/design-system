'use client';

import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { cva, type VariantProps } from 'class-variance-authority';
import { useMounted } from '../lib/use-mounted';
import { cn } from '../lib/utils';

const toastVariants = cva(
  'pointer-events-auto flex w-full max-w-sm items-center gap-3 rounded-lg border p-4 shadow-lg transition-all',
  {
    variants: {
      variant: {
        default: 'border-border bg-card text-card-foreground',
        success: 'border-success/30 bg-success/10 text-success',
        destructive: 'border-destructive/30 bg-destructive/10 text-destructive',
        warning: 'border-warning/30 bg-warning/10 text-warning',
        info: 'border-info/30 bg-info/10 text-info',
      },
    },
    defaultVariants: { variant: 'default' },
  }
);

interface ToastData {
  id: string;
  title: string;
  description?: string;
  variant?: VariantProps<typeof toastVariants>['variant'];
  duration?: number;
}

interface ToastContextValue {
  toast: (data: Omit<ToastData, 'id'>) => void;
}

const ToastContext = createContext<ToastContextValue>({
  toast: () => {},
});

export const useToast = (): ToastContextValue => useContext(ToastContext);

let toastCounter = 0;

export const ToastProvider = ({ children }: { children: ReactNode }): React.JSX.Element => {
  const [toasts, setToasts] = useState<ToastData[]>([]);
  const mounted = useMounted();

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    (data: Omit<ToastData, 'id'>) => {
      const id = `toast-${String(++toastCounter)}`;
      setToasts((prev) => [...prev, { ...data, id }]);
      setTimeout(() => removeToast(id), data.duration ?? 4000);
    },
    [removeToast]
  );

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      {mounted &&
        createPortal(
          <div
            role="status"
            aria-live="polite"
            aria-relevant="additions"
            className="fixed bottom-4 right-4 z-[var(--z-toast,100)] flex flex-col gap-2 pointer-events-none"
            data-slot="toast-container"
          >
            {toasts.map((t) => (
              <div
                key={t.id}
                // Errors interrupt; everything else rides the polite container.
                role={t.variant === 'destructive' ? 'alert' : undefined}
                className={cn(toastVariants({ variant: t.variant }))}
                data-slot="toast"
              >
                <div className="flex-1">
                  <p className="text-sm font-medium">{t.title}</p>
                  {t.description && <p className="mt-0.5 text-xs opacity-80">{t.description}</p>}
                </div>
                <button
                  type="button"
                  onClick={() => removeToast(t.id)}
                  className={cn(
                    'shrink-0 rounded-md p-1 opacity-60 hover:opacity-100 transition-opacity',
                    'focus-visible:outline-none focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-ring/50'
                  )}
                  aria-label={`Dismiss ${t.title}`}
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
            ))}
          </div>,
          document.body
        )}
    </ToastContext.Provider>
  );
};
