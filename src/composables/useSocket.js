import { ref } from 'vue';

import { useAuthStore } from '@/stores';
import storeSocketManager from './StoreSocketManager';

const useSocket = () => {
  const initSocket = () => {
    const socketAccessToken = ref();
    const socketStoreInfo = ref();

    const authStore = useAuthStore();
    authStore.$subscribe(() => {
      const { accessToken, currentStore } = authStore;

      let needReconnect = false;
      if (accessToken !== socketAccessToken.value) {
        socketAccessToken.value = accessToken;
        needReconnect = true;
      }
      if (currentStore?.storeId !== socketStoreInfo.value?.storeId) {
        socketStoreInfo.value = currentStore;
        needReconnect = true;
      }

      if (needReconnect) {
        if (storeSocketManager.isConnected) {
          storeSocketManager.disconnect();
        }
        if (socketAccessToken.value && socketStoreInfo.value?.storeId) {
          storeSocketManager.connect(socketAccessToken.value, socketStoreInfo.value?.storeId);
        }
      }
    });
  };

  const reconnect = () => {
    const auth = useAuthStore();

    if (storeSocketManager.isConnected) {
      storeSocketManager.disconnect();
    }

    if (auth.accessToken && auth.currentStore.storeId) {
      storeSocketManager.connect(auth.accessToken, auth.currentStore.storeId);
    }
  };

  return {
    initSocket,
    subscribe: (event, eventHandler) => {
      storeSocketManager.subscribe(event, eventHandler);
    },
    unsubscribe: (event, eventHandler) => {
      storeSocketManager.unsubscribe(event, eventHandler);
    },
    reconnect,
  };
};

export default useSocket;
