import { defineStore } from 'pinia';
import apolloClient from '@/plugins/apollo';

import { useAuthStore } from '@/stores';
import { getActiveDeliveryAgencyStore } from '@/utils/storeUtils';
import { addHyphenPhoneNumber } from '@/utils/stringUtils';
import { useS9AddressAPI } from '@/composables/useAddressAPI';

import orderAgencies from '@/graphql/queries/orderAgencies.gql';
import deliveryAgencies from '@/graphql/queries/deliveryAgencies.gql';
import predefinedOrderMemos from '@/graphql/queries/predefinedOrderMemos.gql';
import predefinedOrderMemo from '@/graphql/queries/predefinedOrderMemo.gql';
import downloadOrders from '@/graphql/queries/downloadOrders.gql';
import deliveryAgencyCallCenterHubPhone from '@/graphql/queries/deliveryAgencyCallCenterHubPhone.gql';

export const useCommonStore = defineStore('common', {
  state: () => ({
    _toast: {
      show: false,
      color: '',
      message: '',
    },
    _deliveryStatusModals: [],
    _alertMessages: [],
    fromRoute: null,
    currentPath: null,
    address: null,
    isOverlayLoading: false,
    _systemTimespan: 0,
    _orderAgencies: null,
    _deliveryAgencies: null,
    _predefinedOrderMemos: null,
    _contactTelNumer: '',
  }),
  persist: {
    storage: sessionStorage,
    paths: ['fromRoute', 'currentPath'],
  },
  actions: {
    setPreviousRoute({ fullPath, name, path, query }) {
      this.fromRoute = {
        fullPath,
        name,
        path,
        query,
      };
    },

    setCurrentFullPath({ fullPath }) {
      this.currentPath = fullPath;
    },

    showToast(color, message, timeout = 5000) {
      this._toast.show = true;
      this._toast.message = message;
      this._toast.color = color || 'success';

      if (color === 'error') {
        this._toast.color = 'error-bg-snackbar';
      }

      setTimeout(() => {
        this._toast.show = false;
      }, timeout);
    },

    showDeliveryStatusModal(dsmInfo) {
      this._deliveryStatusModals.push(dsmInfo);
    },

    truncateDeliveryStatusModal() {
      this._deliveryStatusModals = [];
    },

    showAlertMessage({ title, subtitle, message }, time, action, isPositive = true) {
      const id = `${Date.now()}-${this._alertMessages.length}`; // 메세지 구분용 랜덤 아이디
      this._alertMessages.push({
        id,
        isPositive,
        title,
        subtitle,
        message,
        time: (time || Date.now()) + this._systemTimespan,
        action,
      });
    },

    hideAlertMessage(id) {
      this._alertMessages = this._alertMessages.filter((alertMessage) => alertMessage.id !== id);
    },

    async findAddressKeyword(keyword) {
      const res = await useS9AddressAPI(keyword);
      this.address = res.values;

      return res;
    },

    setIsOverlayLoading(value) {
      this.isOverlayLoading = value;
    },

    setSystemTimespan(value) {
      this._systemTimespan = value;
    },

    async orderAgencies() {
      const { data } = await apolloClient.query({
        query: orderAgencies,
      });
      this._orderAgencies = data.orderAgencies;
      return data;
    },

    async deliveryAgencies() {
      const { data } = await apolloClient.query({
        query: deliveryAgencies,
      });
      this._deliveryAgencies = data.deliveryAgencies;
      return data;
    },

    async predefinedOrderMemos(storeId) {
      const { data } = await apolloClient.query({
        query: predefinedOrderMemos,
        variables: {
          conditions: {
            storeId,
          },
        },
      });
      this._predefinedOrderMemos = data.predefinedOrderMemos;
      return data;
    },

    async predefinedOrderMemo({ predefinedOrderMemoId }) {
      const { data } = await apolloClient.query({
        query: predefinedOrderMemo,
        variables: {
          conditions: {
            predefinedOrderMemoId,
          },
        },
      });
      return data;
    },

    async downloadOrders(payload) {
      const { data } = await apolloClient.query({
        query: downloadOrders,
        variables: {
          conditions: {
            ...payload,
          },
        },
      });
      return data;
    },

    async deliveryAgencyCallCenterHubPhone({ storeId, deliveryAgencyId }) {
      const { data } = await apolloClient.query({
        query: deliveryAgencyCallCenterHubPhone,
        variables: {
          conditions: {
            storeId,
            deliveryAgencyId,
          },
        },
      });
      return data;
    },

    async setDeliveryContactTelNumber() {
      // 배달 대행사 연락처
      // - 로드샵 상점 : 배달 관리자 대표번호(허브 콜센터 전화번호) 노출
      // - 로드샵 상점(가맹점 또는 허브 연결 정지인 경우) : 바로고 고객 센터 02-550-9900 노출
      // - 브랜드 상점 : 바로고 고객 센터 02-550-9988 노출
      const auth = useAuthStore();

      const activeStoreId = auth.currentStore.storeId;
      const activeDeliveryAgencyStore =
        getActiveDeliveryAgencyStore(auth.currentStore.deliveryAgencyStores);
      const isRoadShop = auth.currentStoreUser.store.manageOrderAgencyId === 'self';
      this._contactTelNumer = '바로고 고객 센터: 02-550-9988';

      if (isRoadShop) {
        this._contactTelNumer = '바로고 고객 센터: 02-550-9900';

        // active 상태인 배달 대행사가 있을 경우
        if (activeDeliveryAgencyStore?.deliveryAgencyId) {
          const response = await this.deliveryAgencyCallCenterHubPhone({
            storeId: activeStoreId,
            deliveryAgencyId: activeDeliveryAgencyStore.deliveryAgencyId,
          });
          if (response.deliveryAgencyCallCenterHubPhone?.callCenterHubPhone) {
            this._contactTelNumer = `배달 관리자 대표번호: ${addHyphenPhoneNumber(response.deliveryAgencyCallCenterHubPhone?.callCenterHubPhone)}`;
          }
        }
      }
    },
  },
  getters: {
    getPreviousRoute: (state) => state.fromRoute,
    getCurrentPath: (state) => state.currentPath,
    getAddressList: (state) => state.address,
    getOrderAgencies: (state) => state._orderAgencies,
    getDeliveryAgencies: (state) => state._deliveryAgencies,
    getPredefinedOrderMemos: (state) => state._predefinedOrderMemos,
    systemTimestamp: (state) => Date.now() + state._systemTimespan,
    toast: (state) => state._toast,
    orderAgencyRejectTime: (state) => (orderAgencyId) =>
      state._orderAgencies.find((agency) => agency.orderAgencyId === orderAgencyId)
        .orderAgencyRejectTime || 5,
    orderReservedOrderDisplayTime: (state) => (orderAgencyId) =>
      state._orderAgencies.find((agency) => agency.orderAgencyId === orderAgencyId)
        .reservedOrderDisplayTime,
    alertMessages: (state) => state._alertMessages,
    deliveryStatusModals: (state) => state._deliveryStatusModals,
    deliveryContactTelNumber: (state) => state._contactTelNumer,
  },
});
