import { ClerkAPIResponseError } from '@clerk/clerk-js';
import { createWritableMemo } from '@solid-primitives/memo';
import {
  createInfiniteQuery,
  createQuery,
  QueryClient
} from '@tanstack/solid-query';
import { Accessor, createMemo, createSignal } from 'solid-js';
import type {
  CacheSetter,
  PagesOrInfiniteConfig,
  PagesOrInfiniteOptions,
  PaginatedResources
} from '../types';

function getDifferentKeys(
  obj1: Record<string, unknown>,
  obj2: Record<string, unknown>
): Record<string, unknown> {
  const keysSet = new Set(Object.keys(obj2));
  const differentKeysObject: Record<string, unknown> = {};

  for (const key1 of Object.keys(obj1)) {
    if (!keysSet.has(key1)) {
      differentKeysObject[key1] = obj1[key1];
    }
  }

  return differentKeysObject;
}

export const convertToSafeValues = <T extends PagesOrInfiniteOptions>(
  params: T | true | undefined,
  defaultValues: T
) => {
  const shouldUseDefaults = typeof params === 'boolean' && params;

  // Cache initialPage and initialPageSize until unmount
  const initialPageRef = shouldUseDefaults
    ? defaultValues.initialPage
    : params?.initialPage ?? defaultValues.initialPage;

  const pageSizeRef = shouldUseDefaults
    ? defaultValues.pageSize
    : params?.pageSize ?? defaultValues.pageSize;

  const newObj: Record<string, unknown> = {};
  for (const key of Object.keys(defaultValues)) {
    newObj[key] = shouldUseDefaults
      ? // @ts-ignore
        defaultValues[key]
      : // @ts-ignore
        params?.[key] ?? defaultValues[key];
  }

  return {
    ...newObj,
    initialPage: initialPageRef,
    pageSize: pageSizeRef
  } as T;
};

type ArrayType<DataArray> =
  DataArray extends Array<infer ElementType> ? ElementType : never;
type ExtractData<Type> = Type extends { data: infer Data }
  ? ArrayType<Data>
  : Type;

type UsePagesOrInfinite = <
  Params extends PagesOrInfiniteOptions,
  FetcherReturnData extends Record<string, any>,
  CacheKeys = Record<string, unknown>,
  TConfig extends PagesOrInfiniteConfig = PagesOrInfiniteConfig
>(
  options: Accessor<{
    /**
     * The parameters will be passed to the fetcher
     */
    params: Params;
    /**
     * A Promise returning function to fetch your data
     */
    fetcher:
      | ((p: Params) => FetcherReturnData | Promise<FetcherReturnData>)
      | undefined;
    /**
     * Internal configuration of the hook
     */
    config: TConfig;
    cacheKeys: CacheKeys;
  }>
) => PaginatedResources<ExtractData<FetcherReturnData>>;

export const usePagesOrInfinite: UsePagesOrInfinite = (options) => {
  const [paginatedPage, setPaginatedPage] = createWritableMemo(
    () => options().params.initialPage ?? 1
  );

  // Cache initialPage and initialPageSize until unmount
  const initialPage = createMemo(() => options().params.initialPage ?? 1);
  const pageSize = createMemo(() => options().params.pageSize ?? 10);

  const enabled = createMemo(() => options().config.enabled ?? true);
  const triggerInfinite = createMemo(() => options().config.infinite ?? false);

  const [queryClient] = createSignal(new QueryClient());

  const pagesCacheKey = createMemo(() => ({
    ...options().cacheKeys,
    ...options().params,
    initialPage: paginatedPage(),
    pageSize: pageSize()
  }));
  const query = createQuery(
    () => ({
      queryKey: [pagesCacheKey()],
      queryFn: ({ queryKey: [cacheKeyParams] }) => {
        // @ts-ignore
        const requestParams = getDifferentKeys(cacheKeyParams, cacheKeys);
        // @ts-ignore
        return fetcher?.(requestParams);
      },
      enabled: !triggerInfinite() && !!options().fetcher && enabled
    }),
    queryClient
  );

  const infiniteQueryKey = createMemo(() => ({
    ...options().cacheKeys,
    ...options().params,
    pageSize: pageSize()
  }));
  const infiniteQuery = createInfiniteQuery(
    () => ({
      queryKey: [infiniteQueryKey()],
      queryFn: ({ pageParam, queryKey: [cacheKeyParams] }) => {
        const requestParams = getDifferentKeys(
          {
            initialPage: initialPage() + pageParam,
            ...cacheKeyParams
          },
          // @ts-ignore
          cacheKeys
        );
        // @ts-ignore
        return fetcher?.(requestParams);
      },
      initialPageParam: initialPage(),
      getNextPageParam: (lastPage) => {
        if (lastPage && !lastPage.length) {
          return null;
        }
      },
      enabled: triggerInfinite() && enabled
    }),
    queryClient
  );

  const page = createMemo(() => {
    if (triggerInfinite()) {
      return infiniteQuery.data?.pages.length ?? 0;
    }
    return paginatedPage();
  });

  const data = createMemo(() => {
    if (triggerInfinite()) {
      return infiniteQuery.data?.pages.flat() ?? [];
    }
    return query.data?.data ?? [];
  });

  const count = createMemo(() => {
    if (triggerInfinite()) {
      return (
        infiniteQuery.data?.pages?.[infiniteQuery.data?.pages.length - 1]
          ?.total_count || 0
      );
    }
    return query.data?.total_count ?? 0;
  });

  const isLoading = createMemo(() =>
    triggerInfinite() ? infiniteQuery.isLoading : query.isLoading
  );
  const isFetching = createMemo(() =>
    triggerInfinite() ? infiniteQuery.isFetching : query.isFetching
  );
  const error = createMemo(
    () =>
      (triggerInfinite()
        ? infiniteQuery.error
        : query.error) as ClerkAPIResponseError | null
  );
  const isError = createMemo(() => !!error());
  /**
   * Helpers
   */
  const fetchNext = () => {
    if (triggerInfinite()) {
      void infiniteQuery.fetchNextPage();
      return;
    }
    return setPaginatedPage((n) => n + 1);
  };

  const fetchPrevious = () => {
    if (triggerInfinite()) {
      void infiniteQuery.fetchPreviousPage();
      return;
    }
    return setPaginatedPage((n) => n - 1);
  };

  const offsetCount = createMemo(() => (initialPage() - 1) * pageSize());

  const pageCount = createMemo(() =>
    Math.ceil((count() - offsetCount()) / pageSize())
  );
  const hasNextPage = createMemo(
    () => count() - offsetCount() * pageSize() > page() * pageSize()
  );
  const hasPreviousPage = createMemo(
    () => (page() - 1) * pageSize() > offsetCount() * pageSize()
  );

  const setData: CacheSetter = triggerInfinite()
    ? (value) => queryClient().setQueryData([infiniteQueryKey], value)!
    : (value) => queryClient().setQueryData([pagesCacheKey()], value)!;

  const revalidate = triggerInfinite()
    ? () => infiniteQuery.refetch()
    : () => query.refetch();

  return {
    data,
    count,
    error,
    isLoading,
    isFetching,
    isError,
    page,
    pageCount,
    fetchNext,
    fetchPrevious,
    hasNextPage,
    hasPreviousPage,
    // Let the hook return type define this type
    setData: setData as any,
    // Let the hook return type define this type
    revalidate: revalidate as any
  };
};
