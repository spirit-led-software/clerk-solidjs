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
import { SignInWithMetamaskButton } from '../sign-in-with-metamask-button';

const mockAuthenticatewithMetamask = vi.fn();
const originalError = console.error;

const mockClerk = {
  authenticateWithMetamask: mockAuthenticatewithMetamask
} as any;

vi.mock('../with-clerk', () => {
  return {
    withClerk: (Component: any) => (props: any) => {
      const reactiveProps = () => props;
      return <Component {...reactiveProps()} clerk={() => mockClerk} />;
    }
  };
});

describe('<SignInWithMetamaskButton/>', () => {
  beforeAll(() => {
    console.error = vi.fn();
  });

  afterAll(() => {
    console.error = originalError;
  });

  beforeEach(() => {
    cleanup();
    mockAuthenticatewithMetamask.mockReset();
  });

  it('calls clerk.authenticateWithMetamask when clicked', async () => {
    render(() => <SignInWithMetamaskButton />);
    const btn = screen.getByText('Sign in with Metamask');
    userEvent.click(btn);
    await waitFor(() => {
      expect(mockAuthenticatewithMetamask).toHaveBeenCalled();
    });
  });

  it('uses text passed as children', () => {
    render(() => <SignInWithMetamaskButton>text</SignInWithMetamaskButton>);
    screen.getByText('text');
  });

  it('throws if multiple children provided', () => {
    expect(() => {
      render(() => (
        <SignInWithMetamaskButton>
          <button>1</button>
          <button>2</button>
        </SignInWithMetamaskButton>
      ));
    }).toThrow();
  });
});
