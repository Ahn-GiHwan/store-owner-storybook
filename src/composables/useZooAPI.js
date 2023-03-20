import axios from 'axios';

const ZOO_OAUTH_API = import.meta.env.VITE_ZOO_OAUTH_API_URL;
const ZOO_CLIENT_API = import.meta.env.VITE_ZOO_CLIENT_API_URL;
const API_TIMEOUT = 10000; // 10s
const oauthRequiresParams = {
  grant_type: `${import.meta.env.VITE_ZOO_GRANT_TYPE}`,
  client_id: `${import.meta.env.VITE_ZOO_CLIENT_ID}`,
  client_secret: `${import.meta.env.VITE_ZOO_CLIENT_SECRET}`,
  accountType: `${import.meta.env.VITE_ZOO_ACCOUNT_TYPE}`,
};
axios.defaults.headers.post['Content-Type'] = 'application/json';

const zooCliAPI = axios.create({
  baseURL: ZOO_CLIENT_API,
  timeout: API_TIMEOUT,
  headers: {},
});

const zooOAuthAPI = axios.create({
  baseURL: ZOO_OAUTH_API,
  timeout: API_TIMEOUT,
  headers: {},
});

/** Zoo Client API */
const useZooStoresMe = () => zooCliAPI.get('/api/v1/stores/me');

/** Zoo OAuth API */
const useZooOAUTH = async ({ username, password }) => {
  const params = {
    ...oauthRequiresParams,
    username,
    password,
  };
  try {
    const { data } = await zooOAuthAPI.post(`/api/v1/auth/token?${new URLSearchParams(params)}`);
    zooCliAPI.defaults.headers.common = { Authorization: `Bearer ${data.access_token}` };
  } catch ({ response }) {
    return response.data;
  }
};
export { useZooOAUTH, useZooStoresMe };
