import { cleanup, render, screen, waitFor } from '@solidjs/testing-library';
import userEvent from '@testing-library/user-event';

import {
  afterAll,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi
} from 'vitest';
import { SignOutButton } from '../sign-out-button';

const mockSignOut = vi.fn();
const originalError = console.error;

const mockClerk = {
  signOut: mockSignOut
} as any;

vi.mock('../with-clerk', () => {
  return {
    withClerk: (Component: any) => (props: any) => {
      const reactiveProps = () => props;
      return <Component {...reactiveProps()} clerk={() => mockClerk} />;
    }
  };
});

describe('<SignOutButton />', () => {
  beforeAll(() => {
    console.error = vi.fn();
  });

  afterAll(() => {
    console.error = originalError;
  });

  beforeEach(() => {
    cleanup();
    mockSignOut.mockReset();
  });

  it('calls clerk.signOutOne when clicked', async () => {
    render(() => <SignOutButton />);
    const btn = screen.getByText('Sign out');
    userEvent.click(btn);
    await waitFor(() => {
      expect(mockSignOut).toHaveBeenCalled();
    });
  });

  it('uses text passed as children', async () => {
    render(() => <SignOutButton>text</SignOutButton>);
    screen.getByText('text');
  });

  it('throws if multiple children provided', async () => {
    expect(() => {
      render(() => (
        <SignOutButton>
          <button>1</button>
          <button>2</button>
        </SignOutButton>
      ));
    }).toThrow();
  });
});
