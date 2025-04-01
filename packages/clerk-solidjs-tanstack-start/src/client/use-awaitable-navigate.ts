import type { NavigateOptions } from '@tanstack/solid-router';
import { useLocation, useNavigate } from '@tanstack/solid-router';
import { createEffect, on, useTransition } from 'solid-js';

type Resolve = (value?: unknown) => void;

export const useAwaitableNavigate = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const resolveFunctionsRef: Resolve[] = [];
  const resolveAll = () => {
    resolveFunctionsRef.forEach((resolve) => resolve());
    resolveFunctionsRef.splice(0, resolveFunctionsRef.length);
  };
  const [, startTransition] = useTransition();

  createEffect(
    on(
      () => location,
      () => {
        resolveAll();
      }
    )
  );

  return (to: string, options?: Partial<NavigateOptions>) => {
    return new Promise((res) => {
      startTransition(() => {
        resolveFunctionsRef.push(res);
        res(navigate({ to, ...options }));
      });
    });
  };
};
