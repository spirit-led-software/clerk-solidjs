import type { LoadedClerk, Without } from '@clerk/types';
import { Component, JSX, Show } from 'solid-js';
import { useIsomorphicClerkContext } from '../contexts/isomorphic-clerk';
import { errorThrower } from '../errors/error-thrower';
import { hocChildrenNotAFunctionError } from '../errors/messages';
import { useAssertWrappedByClerkProvider } from '../hooks/use-assert-wrapped-by-clerk-provider';

export const withClerk = <P extends { clerk: LoadedClerk }>(
  Component: Component<P>,
  displayName?: string
) => {
  displayName = displayName || Component.name || 'Component';
  return (props: Without<P, 'clerk'>) => {
    useAssertWrappedByClerkProvider(displayName || 'withClerk');

    const clerk = useIsomorphicClerkContext();

    return (
      <Show when={clerk().loaded}>
        <Component {...(props as P)} clerk={clerk} />
      </Show>
    );
  };
};

export const WithClerk: Component<{
  children: (clerk: LoadedClerk) => JSX.Element;
}> = ({ children }) => {
  const clerk = useIsomorphicClerkContext();

  if (typeof children !== 'function') {
    errorThrower.throw(hocChildrenNotAFunctionError);
  }

  return (
    <Show when={clerk().loaded}>
      {children(clerk as unknown as LoadedClerk)}
    </Show>
  );
};
