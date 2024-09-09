import type { LoadedClerk, Without } from '@clerk/types';
import { Accessor, Component, createEffect, JSX, Show } from 'solid-js';
import { useIsomorphicClerkContext } from '../contexts/isomorphic-clerk';
import { errorThrower } from '../errors/error-thrower';
import { hocChildrenNotAFunctionError } from '../errors/messages';
import { useAssertWrappedByClerkProvider } from '../hooks/use-assert-wrapped-by-clerk-provider';

export const withClerk = <P extends { clerk: Accessor<LoadedClerk> }>(
  Component: Component<P>,
  displayName?: string
) => {
  displayName = displayName || Component.name || 'Component';
  return (props: Without<P, 'clerk'>) => {
    useAssertWrappedByClerkProvider(displayName || 'withClerk');
    const clerk = useIsomorphicClerkContext();
    const isLoaded = () => clerk().loaded;

    return (
      <Show when={isLoaded()}>
        <Component {...(props as P)} clerk={clerk} />
      </Show>
    );
  };
};

export const WithClerk: Component<{
  children: (clerk: Accessor<LoadedClerk>) => JSX.Element;
}> = (props) => {
  const clerk = useIsomorphicClerkContext();
  const isLoaded = () => clerk().loaded;
  createEffect(() => {
    if (typeof props.children !== 'function') {
      errorThrower.throw(hocChildrenNotAFunctionError);
    }
  });
  return (
    <Show when={isLoaded()}>
      {props.children(clerk as unknown as Accessor<LoadedClerk>)}
    </Show>
  );
};
