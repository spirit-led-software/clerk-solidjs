import { cleanup, render, screen } from '@solidjs/testing-library';
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
import { SignInButton } from '../sign-in-button';

const mockRedirectToSignIn = vi.fn();
const originalError = console.error;

const mockClerk = {
  redirectToSignIn: mockRedirectToSignIn
} as any;

vi.mock('../with-clerk', () => {
  return {
    withClerk: (Component: any) => (props: any) => {
      return <Component {...props} clerk={() => mockClerk} />;
    }
  };
});

const url = 'https://www.clerk.com';

describe('<SignInButton/>', () => {
  beforeAll(() => {
    console.error = vi.fn();
  });

  afterAll(() => {
    console.error = originalError;
  });

  beforeEach(() => {
    cleanup();
    mockRedirectToSignIn.mockReset();
  });

  it('calls clerk.redirectToSignIn when clicked', async () => {
    render(() => <SignInButton />);
    const btn = screen.getByText('Sign in');
    await userEvent.click(btn);
    expect(mockRedirectToSignIn).toHaveBeenCalled();
  });

  it('handles forceRedirectUrl prop', async () => {
    render(() => <SignInButton forceRedirectUrl={url} />);

    const btn = screen.getByText('Sign in');
    await userEvent.click(btn);

    expect(mockRedirectToSignIn).toHaveBeenCalledWith({
      forceRedirectUrl: url,
      signInForceRedirectUrl: url
    });
  });

  it('handles fallbackRedirectUrl prop', async () => {
    render(() => <SignInButton fallbackRedirectUrl={url} />);

    const btn = screen.getByText('Sign in');
    await userEvent.click(btn);

    expect(mockRedirectToSignIn).toHaveBeenCalledWith({
      fallbackRedirectUrl: url,
      signInFallbackRedirectUrl: url
    });
  });

  it('renders passed button and calls both click handlers', async () => {
    const handler = vi.fn();

    render(() => (
      <SignInButton>
        <button onClick={handler} type="button">
          custom button
        </button>
      </SignInButton>
    ));

    const btn = screen.getByText('custom button');
    await userEvent.click(btn);

    expect(handler).toHaveBeenCalled();
    expect(mockRedirectToSignIn).toHaveBeenCalled();
  });

  it('uses text passed as children', async () => {
    render(() => <SignInButton>text</SignInButton>);
    screen.getByText('text');
  });

  it('throws if multiple children provided', () => {
    expect(() => {
      render(() => (
        <SignInButton>
          <button>1</button>
          <button>2</button>
        </SignInButton>
      ));
    }).toThrow();
  });
});
