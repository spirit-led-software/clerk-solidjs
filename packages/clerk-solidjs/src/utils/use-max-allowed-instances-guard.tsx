import { Accessor, Component, createEffect, onCleanup } from 'solid-js';
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

    onCleanup(() => {
      counts.set(props().name, (counts.get(props().name) || 1) - 1);
    });
  });
}

export function withMaxAllowedInstancesGuard<P extends Record<string, any>>(
  WrappedComponent: Component<P>,
  name: string,
  error: string
): Component<P> {
  const HOC = (props: P) => {
    useMaxAllowedInstancesGuard(() => ({ name, error }));
    return <WrappedComponent {...props} />;
  };
  return HOC;
}
