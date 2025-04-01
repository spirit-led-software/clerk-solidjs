import type { AuthObject } from '@clerk/backend';
import { stripPrivateDataFromObject } from '@clerk/backend/internal';

import { errorThrower } from '../utils';
import { noFetchFnCtxPassedInGetAuth } from '../utils/errors';
import { authenticateRequest } from './authenticate-request';
import { loadOptions } from './load-options';
import type { LoaderOptions } from './types';

type GetAuthReturn = Promise<AuthObject>;

type GetAuthOptions = Pick<LoaderOptions, 'secretKey'>;

export async function getAuth(
  request: Request,
  opts?: GetAuthOptions
): GetAuthReturn {
  if (!request) {
    return errorThrower.throw(noFetchFnCtxPassedInGetAuth);
  }

  const loadedOptions = loadOptions(request, opts);

  const requestState = await authenticateRequest(request, loadedOptions);

  return stripPrivateDataFromObject(requestState.toAuth());
}
