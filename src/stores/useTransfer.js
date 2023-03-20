import { defineStore } from 'pinia';
import apolloClient from '@/plugins/apollo';

import { useZooOAUTH, useZooStoresMe } from '@/composables/useZooAPI';

import storesByBusinessNumberAndPhone from '@/graphql/queries/storesByBusinessNumberAndPhone.gql';
import store from '@/graphql/queries/store.gql';
import transferBarogoStore from '@/graphql/mutations/transferBarogoStore.gql';
import createStoreUser from '@/graphql/mutations/createStoreUser.gql';

export const useTransferStore = defineStore('store', {
  state: () => ({
    storeList: [],
    storeData: null,
  }),
  persist: {
    storage: sessionStorage,
    paths: ['storeData'],
  },
  actions: {
    async findStore({ phone, businessNumber }) {
      const { data } = await apolloClient.query({
        query: storesByBusinessNumberAndPhone,
        variables: {
          where: {
            phone,
            businessNumber,
          },
        },
      });
      this.storeList = data.storesByBusinessNumberAndPhone;
      return data;
    },
    async getStore({ storeId }) {
      const { data } = await apolloClient.query({
        query: store,
        variables: {
          conditions: {
            storeId,
          },
        },
      });
      return data;
    },

    async findO2OStore(form) {
      try {
        const response = await useZooOAUTH(form);
        if (response?.error) {
          return response;
        }
        const { data } = await useZooStoresMe();
        return data.data;
      } catch (err) {
        return err;
      }
    },

    selectedBarogoStore(payload) {
      this.storeData = payload;
    },

    async createStoreUser(storeId) {
      const { data } = await apolloClient.mutate({
        mutation: createStoreUser,
        variables: {
          storeId,
        },
      });
      return data;
    },

    async transferBarogoStore({ barogoStoreId, barogoDistributorCode }) {
      const { data } = await apolloClient.mutate({
        mutation: transferBarogoStore,
        variables: {
          conditions: {
            barogoStoreId,
            barogoDistributorCode,
          },
        },
      });
      this.selectedBarogoStore(data.transferBarogoStore);
      return data;
    },

    resetStoreList() {
      this.storeList = [];
    },
  },
  getters: {
    getStoreList: (state) => state.storeList,
    getStoreData: (state) => state.storeData,
  },
});
