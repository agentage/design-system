'use client';
import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';

/**
 * ~40-line History-API router. nginx and `vite preview` both fall back to
 * index.html, so clean paths deep-link and reload without a dependency.
 */
const RouteContext = createContext<{ path: string; navigate: (to: string) => void }>({
  path: '/',
  navigate: () => undefined,
});

const currentPath = (): string =>
  typeof window === 'undefined' ? '/' : window.location.pathname || '/';

export const RouterProvider = ({ children }: { children: ReactNode }) => {
  const [path, setPath] = useState(currentPath);

  useEffect(() => {
    const onPop = (): void => {
      setPath(currentPath());
    };
    window.addEventListener('popstate', onPop);
    return () => {
      window.removeEventListener('popstate', onPop);
    };
  }, []);

  const navigate = useCallback((to: string) => {
    if (to === currentPath()) return;
    window.history.pushState(null, '', to);
    setPath(to);
    window.scrollTo(0, 0);
  }, []);

  // Design-system link components take a plain href, so intercept them here
  // rather than teaching every one of them about the router.
  useEffect(() => {
    const onClick = (e: MouseEvent): void => {
      if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
      const anchor = (e.target as HTMLElement | null)?.closest?.('a');
      const href = anchor?.getAttribute('href');
      if (!anchor || !href?.startsWith('/') || anchor.target === '_blank') return;
      e.preventDefault();
      navigate(href);
    };
    document.addEventListener('click', onClick);
    return () => {
      document.removeEventListener('click', onClick);
    };
  }, [navigate]);

  return <RouteContext.Provider value={{ path, navigate }}>{children}</RouteContext.Provider>;
};

export const useRoute = () => useContext(RouteContext);

/** Anchor that keeps the SPA in-process but stays a real, copyable link. */
export const Link = ({
  to,
  children,
  className,
  ...props
}: { to: string; children: ReactNode } & React.AnchorHTMLAttributes<HTMLAnchorElement>) => {
  const { navigate } = useRoute();
  return (
    <a
      href={to}
      className={className}
      onClick={(e) => {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
        e.preventDefault();
        navigate(to);
      }}
      {...props}
    >
      {children}
    </a>
  );
};
