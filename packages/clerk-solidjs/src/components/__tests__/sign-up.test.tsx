import { expectTypeOf } from 'expect-type';

import { ComponentProps } from 'solid-js';
import { describe, test } from 'vitest';
import type { SignUp } from '..';

export type SignUpComponentProps = ComponentProps<typeof SignUp>;

describe('<SignUp/>', () => {
  describe('Type tests', () => {
    test('has path filled', () => {
      expectTypeOf({ path: '/sign-up' }).toMatchTypeOf<SignUpComponentProps>();
    });

    test('has path filled and routing has path as a value', () => {
      expectTypeOf({
        path: '/sign-up',
        routing: 'path' as const
      }).toMatchTypeOf<SignUpComponentProps>();
    });

    test('when path is filled, routing must only have path as value', () => {
      expectTypeOf({
        path: '/sign-up',
        routing: 'virtual' as const
      }).not.toMatchTypeOf<SignUpComponentProps>();

      expectTypeOf({
        path: '/sign-up',
        routing: 'hash' as const
      }).not.toMatchTypeOf<SignUpComponentProps>();
    });

    test('when routing is hash or virtual path must be present', () => {
      expectTypeOf({
        routing: 'hash' as const
      }).toMatchTypeOf<SignUpComponentProps>();
    });
  });
});
