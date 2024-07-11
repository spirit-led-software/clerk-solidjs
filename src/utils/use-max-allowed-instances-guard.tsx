import { Accessor, Component, createEffect } from 'solid-js';
import { errorThrower } from '../errors/error-thrower';

const counts = new Map<string, number>();

export function useMaxAllowedInstancesGuard(
  props: Accessor<{ name: string; error: string; maxCount?: number }>
): void {
  createEffect(() => {
    const count = counts.get(props().name) || 0;
    if (count == (props().maxCount ?? 1)) {
      return errorThrower.throw(props().error);
    }
    counts.set(props().name, count + 1);

    return () => {
      counts.set(props().name, (counts.get(props().name) || 1) - 1);
    };
  });
}

export function withMaxAllowedInstancesGuard<P>(
  WrappedComponent: Component<P>,
  name: string,
  error: string
): Component<P> {
  const displayName = WrappedComponent.name || name || 'Component';
  const Hoc = (props: P) => {
    useMaxAllowedInstancesGuard(() => ({ name, error }));
    return <WrappedComponent {...(props as any)} />;
  };
  Hoc.displayName = `withMaxAllowedInstancesGuard(${displayName})`;
  return Hoc;
}
