import { defineStore } from 'pinia';
import apolloClient from '@/plugins/apollo';

import order from '@/graphql/queries/order.gql';
import orderChangeHistories from '@/graphql/queries/orderChangeHistories.gql';

export const useOrderDetailStore = defineStore('orderDetail', {
  state: () => ({
    _loading: false,
    _order: null,
    _loadingHistories: false,
    _orderChangeHistories: null,
    _modifyOrder: null,
    _isLoadingModifyOrder: false,
  }),
  persist: {
    storage: sessionStorage,
    paths: [],
  },
  actions: {
    async order({ orderId, storeId }) {
      this._loading = true;

      const { data } = await apolloClient.query({
        query: order,
        variables: {
          orderId,
          storeId,
        },
      });

      this._loading = false;
      this._order = data.order;

      return data;
    },

    async orderChangeHistories({ orderId, storeId }) {
      this._loadingHistories = true;

      const { data } = await apolloClient.query({
        query: orderChangeHistories,
        variables: {
          conditions: {
            orderId,
            storeId,
          },
        },
      });

      this._loadingHistories = false;
      // 최신순으로 정렬하여 저장
      this._orderChangeHistories = data.orderChangeHistories.sort((a, b) => {
        if (a.createdAt > b.createdAt) {
          return -1;
        } if (a.createdAt === b.createdAt) {
          return 0;
        }
        return 1;
      });

      this._orderChangeHistories.forEach((history) => {
        if (typeof history.before === 'string') {
          history.before = JSON.parse(history.before);
        }
        if (typeof history.after === 'string') {
          history.after = JSON.parse(history.after);
        }
      });

      return data;
    },
    async doReadModifyOrder({ orderId, storeId }) {
      this._modifyOrder = null;
      this._isLoadingModifyOrder = true;

      const data = await this.order({ orderId, storeId });

      this._isLoadingModifyOrder = false;
      this._modifyOrder = data.order;

      return data;
    },
  },
  getters: {
    getIsLoading: (state) => state._loading,
    getOrder: (state) => (!state._loading && state._order ? state._order : undefined),
    getIsLoadingHistories: (state) => state._loadingHistories,
    getOrderChangeHistories: (state) =>
      (!state._loadingHistories && state._orderChangeHistories
        ? state._orderChangeHistories : undefined),
    deliveryRiderInfo: (state) => (deliveryId) =>
      state._order.deliveries.find((item) => item.deliveryId === deliveryId),
    modifyOrder: (state) => (!state._isLoadingModifyOrder ? state._modifyOrder : null),
    isLoadingModifyOrder: (state) => state._isLoadingModifyOrder,
  },
});
