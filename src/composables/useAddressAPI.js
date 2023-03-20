import axios from 'axios';
import { useAuthStore } from '@/stores';

const API_TIMEOUT = 10000; // 10s
const ADDRESS_RADIUS = 20000; // 단위 m

axios.defaults.headers.post['Content-Type'] = 'application/json';

const s9AddressAPI = axios.create({
  timeout: API_TIMEOUT,
  headers: {},
});

/** S9S Address API */
const useS9AddressAPI = async (inputKeyword) => {
  const auth = useAuthStore();

  const { latitude, longitude } = auth.currentStore.location;
  const coordinate = [latitude, longitude, ADDRESS_RADIUS].join(',');
  const params = {
    q: inputKeyword,
  };

  try {
    const { data } = await s9AddressAPI.get(
      `/barogo/jusoapi/msearch.s9s?l=5&t=true&n=100&${new URLSearchParams(params)}&c=${coordinate}`,
    );

    return data;
  } catch (err) {
    throw new Error(err);
  }
};
export { useS9AddressAPI };
