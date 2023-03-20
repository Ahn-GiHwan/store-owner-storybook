import { defineStore } from 'pinia';
import apolloClient from '@/plugins/apollo';

import deliveryPossible from '@/graphql/queries/deliveryPossible.gql';
import requestDelivery from '@/graphql/mutations/requestDelivery.gql';
import cancelDelivery from '@/graphql/mutations/cancelDelivery.gql';
import reRequestDelivery from '@/graphql/mutations/reRequestDelivery.gql';
import updateDeliveryStatus from '@/graphql/mutations/updateDeliveryStatus.gql';
import requestDeliveryAddition from '@/graphql/mutations/requestDeliveryAddition.gql';

export const useDeliveryStore = defineStore('delivery', {
  state: () => ({
  }),
  actions: {
    async requestDelivery(payload) {
      const { data } = await apolloClient.mutate({
        mutation: requestDelivery,
        variables: {
          conditions: {
            ...payload,
          },
        },
      });
      return data;
    },

    async deliveryPossible(payload) {
      const { data } = await apolloClient.query({
        query: deliveryPossible,
        variables: {
          conditions: {
            ...payload,
          },
        },
      });
      return data;
    },

    async cancelDelivery(payload) {
      const { data } = await apolloClient.mutate({
        mutation: cancelDelivery,
        variables: {
          input: {
            ...payload,
          },
        },
      });
      return data;
    },

    async reRequestDelivery(payload) {
      const { data } = await apolloClient.mutate({
        mutation: reRequestDelivery,
        variables: {
          conditions: {
            ...payload,
          },
        },
      });
      return data;
    },

    async updateDeliveryStatus({ deliveryId, status, storeId }) {
      const { data } = await apolloClient.mutate({
        mutation: updateDeliveryStatus,
        variables: {
          input: {
            deliveryId,
            status,
            storeId,
          },
        },
      });
      return data;
    },

    async requestDeliveryAddition(payload) {
      const { data } = await apolloClient.mutate({
        mutation: requestDeliveryAddition,
        variables: {
          conditions: {
            ...payload,
          },
        },
      });
      return data;
    },
  },
  getters: {},
});
