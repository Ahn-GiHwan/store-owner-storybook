import { ApolloClient, createHttpLink, InMemoryCache, ApolloLink, fromPromise } from '@apollo/client/core';
import { onError } from '@apollo/client/link/error';
import { setContext } from '@apollo/client/link/context';
import { useErrorsStore } from '@/stores/useErrors';
import { useAuthStore, useCommonStore } from '@/stores';

import me from '@/graphql/queries/me.gql';

const READONLY_GRAPHQLS = [
  'finishedOrderStat',
  'order',
  'order_and_deliveries', // 클라이언트에서만 정의
  'order_drop_address', // 클라이언트에서만 정의
  'order_status_only', // 클라이언트에서만 정의
  'orderChangeHistories',
  'orders',
  'ordersPagination',
  'orderStatusesCount',
  'storeProducts',
];

// HTTP connection to the API
// https://www.apollographql.com/docs/react/networking/advanced-http-networking/#custom-fetching
const customFetch = (uri, options) => {
  // localhost에서는 /graphql 로만 요청하도록 함
  if (import.meta.env.MODE === 'localhost') {
    return fetch(uri, options);
  }
  const { operationName } = JSON.parse(options.body);
  const customUri = READONLY_GRAPHQLS.includes(operationName) ? `${uri}/read` : uri;

  return fetch(customUri, options);
};

const httpLink = createHttpLink({
  // You should use an absolute URL here
  credentials: 'include',
  fetch: customFetch,
});

// eslint-disable-next-line import/no-mutable-exports
let apolloClient;

const getMe = () => apolloClient
  .query({ query: me })
  .then((response) => {
    // extract your accessToken from your response data and return it
    const { me: _me } = response.data;
    return _me;
  });

// eslint-disable-next-line consistent-return
const errorHandler = onError(({ graphQLErrors, operation, forward }) => {
  if (graphQLErrors) {
    const storeError = (error) => {
      useErrorsStore().$state = {
        message: error[0].message,
        category: error[0].extensions.category,
        errorCode: error[0].extensions.errorCode,
        convertedError: error[0].extensions.convertedError,
        fields: error[0].extensions.validation ?? { input: {} },
      };
    };
    if (graphQLErrors[0].extensions.errorCode === 'EXPIRED_TOKEN'
      || graphQLErrors[0].extensions.convertedError?.code === 'EXPIRED_TOKEN') {
      return fromPromise(
        getMe().catch(() => {
          storeError(graphQLErrors);
        }),
      )
        .filter((value) => Boolean(value))
        .flatMap(({ accessToken, ...loginUser }) => {
          const auth = useAuthStore();
          auth.setMe(accessToken, loginUser);

          const oldHeaders = operation.getContext().headers;
          operation.setContext({
            headers: {
              ...oldHeaders,
              authorization: `Bearer ${accessToken}`,
            },
          });
          return forward(operation);
        });
    }
    return storeError(graphQLErrors);
  }
});

const authLink = setContext((_, { headers }) => {
  const auth = useAuthStore();
  const token = auth.accessToken;
  // eslint-disable-next-line no-undef
  const version = __APP_VERSION__;

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : undefined,
      version,
    },
  };
});

// http response 에 대한 처리를 위한 middleware
const afterwareLink = new ApolloLink((operation, forward) =>
  forward(operation).map((response) => {
    const common = useCommonStore();
    const context = operation.getContext();

    const timestamp = context.response.headers.get('timestamp') || Date.now();

    // 서버 시간과 로컬 시간의 차이를 저장해 둡니다.
    common.setSystemTimespan(timestamp - Date.now());

    return response;
  }));

// Create the apollo client
apolloClient = new ApolloClient({
  cache: new InMemoryCache({
    addTypename: false,
  }),
  link: ApolloLink.from([authLink, errorHandler, afterwareLink, httpLink]),
  // fetchPolicy 참고: https://www.apollographql.com/docs/react/data/queries/#setting-a-fetch-policy
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'no-cache',
    },
    query: {
      fetchPolicy: 'no-cache',
    },
    mutate: {
      fetchPolicy: 'no-cache',
    },
  },
});

export default apolloClient;
