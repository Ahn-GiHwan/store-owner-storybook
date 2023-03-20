/* eslint-disable brace-style */
import { defineStore } from 'pinia';
import apolloClient from '@/plugins/apollo';

import { DELIVERY_STATUS, FILTER_DATE_PERIOD, FILTER_ORDER_SORTING } from '@/constants';
import useOrderAsync from '@/composables/useOrderAsync';
import { getDatePeriod } from '@/utils/dateUtils';

import
{
  getMainDelivery,
  isNeedAccept,
  isCanRequestDelivery,
  isDeliveryFailed,
  isAccepted,
  isAllocated,
  isSelfDeliveryCreated,
  isDeliveriesInAllocated,
  isDeliveriesInPickup,
  isPickupFinished,
  isSelfDeliveryDeparted,
  isHallOrder,
  isPackingOrder,
  reserveOrderProceedAt,
  appendOrderBadgeData,
}
  from '@/utils/orderUtils';

import createDeliveryOrder from '@/graphql/mutations/createDeliveryOrder.gql';
import createDeliveryReorder from '@/graphql/mutations/createDeliveryReorder.gql';
import order from '@/graphql/queries/order.gql';
import orders from '@/graphql/queries/orders.gql';
import storeDeposit from '@/graphql/queries/storeDeposit.gql';
import storeProducts from '@/graphql/queries/storeProducts.gql';
import ordersPagination from '@/graphql/queries/ordersPagination.gql';
import orderStatusesCount from '@/graphql/queries/orderStatusesCount.gql';
import finishedOrderStat from '@/graphql/queries/finishedOrderStat.gql';
import prepareOrder from '@/graphql/mutations/prepareOrder.gql';
import prepareOrderForNotification from '@/graphql/mutations/prepareOrderForNotification.gql';
import acceptOrder from '@/graphql/mutations/acceptOrder.gql';
import rejectOrder from '@/graphql/mutations/rejectOrder.gql';
import cancelOrder from '@/graphql/mutations/cancelOrder.gql';

import updateOrderDropInfo from '@/graphql/mutations/updateOrderDropInfo.gql';
import updateOrderPaymentInfo from '@/graphql/mutations/updateOrderPaymentInfo.gql';
import updateOrderPhoneInfo from '@/graphql/mutations/updateOrderPhoneInfo.gql';
import updateOrderPickupWishAt from '@/graphql/mutations/updateOrderPickupWishAt.gql';
import updateOrderStoreDropExpectedAt from '@/graphql/mutations/updateOrderStoreDropExpectedAt.gql';
import updateOrderStoreOrderMemo from '@/graphql/mutations/updateOrderStoreOrderMemo.gql';

export const useOrderStore = defineStore('order', {
  state: () => ({
    _storeOrders: [],
    _selectedTab: '',
    _selectedTabOrders: [],
    _wating: [],
    _accepted: [],
    _allocated: [],
    _pickup: [],
    _finished: [],
    _completed: [],
    _completedTotalCount: 0,
    _totalInfo: {
      totalPaymentPrice: 0,
      totalDeliveryPrice: 0,
      totalRevenue: 0,
    },
    _deliveryOrder: {
      countOrder: 0,
      countPostpaidPrice: 0,
      sumPostpaidPrice: 0,
      countPaymentCardPrice: 0,
      sumPaymentCardPrice: 0,
      countPaymentCashPrice: 0,
      sumPaymentCashPrice: 0,
      countPrepaidPrice: 0,
      sumPrepaidPrice: 0,
      countPaymentMixedPrice: 0,
      sumPaymentMixedPrice: 0,
      sumActualPayPrice: 0,
      countTaxFreePayPrice: 0,
      sumTaxFreePayPrice: 0,
    },
    _packingOrder: {
      countOrder: 0,
      countPostpaidPrice: 0,
      sumPostpaidPrice: 0,
      countPrepaidPrice: 0,
      sumPrepaidPrice: 0,
      countPaymentMixedPrice: 0,
      sumPaymentMixedPrice: 0,
      sumActualPayPrice: 0,
      countTaxFreePayPrice: 0,
      sumTaxFreePayPrice: 0,
    },
    _hallOrder: {
      countOrder: 0,
      countPostpaidPrice: 0,
      sumPostpaidPrice: 0,
      countPrepaidPrice: 0,
      sumPrepaidPrice: 0,
      countPaymentMixedPrice: 0,
      sumPaymentMixedPrice: 0,
      sumActualPayPrice: 0,
      countTaxFreePayPrice: 0,
      sumTaxFreePayPrice: 0,
    },
    _deliveryPriceInfo: {
      countDeliveryPrice: 0,
      sumDeliveryPrice: 0,
      countExtraCharge: 0,
      sumExtraCharge: 0,
      extraCharges: {
        chargeType: '',
        count: 0,
        charge: 0,
      },
      sumVATPrice: 0,
      countCommission: 0,
      sumCommission: 0,
      countMaintenanceFee: 0,
      sumMaintenanceFee: 0,
      sumTotalDeliveryPrice: 0,
    },
    _selectedFiltering: {
      datePeriod: FILTER_DATE_PERIOD.TODAY,
      orderStatus: '',
      orderSorting: FILTER_ORDER_SORTING.DESC,
      deliveryType: '',
      createdAt: {
        ...getDatePeriod(FILTER_DATE_PERIOD.TODAY),
      },
      paymentMethod: '',
    },
    _filterConditions: null,
    _orderStatusCount: null,
  }),
  persist: {
    storage: sessionStorage,
    paths: ['_selectedTab', '_selectedFiltering'],
  },
  actions: {
    initState() {
      this._wating = [];
      this._accepted = [];
      this._allocated = [];
      this._pickup = [];
      this._finished = [];
    },

    setSelectedFiltering(filter) {
      this._selectedFiltering = filter;
    },

    setFilterConditions(filter) {
      this._filterConditions = filter;
    },

    resetCompletedList() {
      this._completed = [];
      this._completedTotalCount = 0;
    },

    async finishedOrderStat({ storeId, startAt, endAt }) {
      const { data } = await apolloClient.query({
        query: finishedOrderStat,
        variables: {
          storeId,
          startAt,
          endAt,
        },
      });

      this._totalInfo = data.finishedOrderStat.totalInfo;
      this._deliveryOrder = data.finishedOrderStat.deliveryOrder;
      this._packingOrder = data.finishedOrderStat.packingOrder;
      this._hallOrder = data.finishedOrderStat.hallOrder;
      this._deliveryPriceInfo = data.finishedOrderStat.deliveryPriceInfo;
      return data;
    },

    async orderStatusesCount({ storeId, createdAt, deliveryType }) {
      const { data } = await apolloClient.query({
        query: orderStatusesCount,
        variables: {
          conditions: {
            storeId,
            createdAt,
            deliveryType,
          },
        },
      });
      this._orderStatusCount = data.orderStatusesCount;
      return data;
    },

    async ordersPagination({ storeId, where }) {
      const { data } = await apolloClient.query({
        query: ordersPagination,
        variables: {
          conditions: {
            storeId,
            ...where,
          },
        },
      });
      this._completed.push(...data.ordersPagination.rows);
      this._completedTotalCount = data.ordersPagination.count;
      return data;
    },

    async acceptOrder({ storeId, orderId, storeDropExpectedAt }) {
      const { data } = await apolloClient.mutate({
        mutation: acceptOrder,
        variables: {
          conditions: {
            storeId,
            orderId,
          },
          data: {
            storeDropExpectedAt,
          },
        },
      });
      return data;
    },

    async rejectOrder({ storeId, orderId, rejectType }) {
      const { data } = await apolloClient.mutate({
        mutation: rejectOrder,
        variables: {
          conditions: {
            storeId,
            orderId,
          },
          data: {
            rejectType,
          },
        },
      });
      return data;
    },

    async prepareOrder({ storeId, orderId }) {
      const { data } = await apolloClient.mutate({
        mutation: prepareOrder,
        variables: {
          conditions: {
            storeId,
            orderId,
          },
        },
      });
      return data;
    },

    async cancelOrder({ storeId, orderId }) {
      const { data } = await apolloClient.mutate({
        mutation: cancelOrder,
        variables: {
          conditions: {
            storeId,
            orderId,
          },
        },
      });
      return data;
    },

    async prepareOrderForNotification({ storeId, orderId }) {
      const { data } = await apolloClient.mutate({
        mutation: prepareOrderForNotification,
        variables: {
          conditions: {
            storeId,
            orderId,
          },
        },
      });
      return data;
    },

    async storeProducts({ storeId }) {
      const { data } = await apolloClient.query({
        query: storeProducts,
        variables: {
          where: {
            storeId,
          },
        },
      });
      return data;
    },

    async storeDeposit({ storeId, deliveryAgencyId }) {
      const { data } = await apolloClient.query({
        query: storeDeposit,
        variables: {
          storeId,
          deliveryAgencyId,
        },
      });
      return data;
    },

    async orders({ storeId, createdAt, dropWishAt }) {
      const { data } = await apolloClient.query({
        query: orders,
        variables: {
          conditions: {
            storeId,
            orderStatus: ['CREATED', 'ACCEPTED', 'REJECTED', 'CANCELED', 'PREPARED'],
            createdAt,
            dropWishAt,
          },
        },
      });

      this._storeOrders = data.orders;
      this.initOrders();
      return data;
    },

    async createDeliveryOrder(payload) {
      const { data } = await apolloClient.mutate({
        mutation: createDeliveryOrder,
        variables: {
          data: {
            ...payload,
          },
        },
      });
      return data;
    },

    async createDeliveryReorder(payload) {
      const { data } = await apolloClient.mutate({
        mutation: createDeliveryReorder,
        variables: {
          data: {
            ...payload,
          },
        },
      });
      return data;
    },

    async order({ orderId, storeId }) {
      const { data } = await apolloClient.query({
        query: order,
        variables: {
          orderId,
          storeId,
        },
      });

      return data;
    },

    async updateOrderDropInfo({ conditions, data }) {
      const res = await apolloClient.mutate({
        mutation: updateOrderDropInfo,
        variables: {
          conditions: {
            ...conditions,
          },
          data: {
            ...data,
          },
        },
      });
      return res.data.updateOrderDropInfo;
    },

    async updateOrderPaymentInfo({ conditions, data }) {
      const res = await apolloClient.mutate({
        mutation: updateOrderPaymentInfo,
        variables: {
          conditions: {
            ...conditions,
          },
          data: {
            ...data,
          },
        },
      });

      return res.data.updateOrderPaymentInfo;
    },

    async updateOrderPhoneInfo({ conditions, data }) {
      const res = await apolloClient.mutate({
        mutation: updateOrderPhoneInfo,
        variables: {
          conditions: {
            ...conditions,
          },
          data: {
            ...data,
          },
        },
      });
      return res.data.updateOrderPhoneInfo;
    },

    async updateOrderPickupWishAt({ conditions, data }) {
      const res = await apolloClient.mutate({
        mutation: updateOrderPickupWishAt,
        variables: {
          conditions: {
            ...conditions,
          },
          data: {
            ...data,
          },
        },
      });
      return res.data.updateOrderPickupWishAt;
    },

    async updateOrderStoreDropExpectedAt({ orderId, storeId, storeDropExpectedAt }) {
      const res = await apolloClient.mutate({
        mutation: updateOrderStoreDropExpectedAt,
        variables: {
          conditions: {
            orderId,
            storeId,
          },
          data: {
            storeDropExpectedAt,
          },
        },
      });

      return res.data.updateOrderStoreDropExpectedAt;
    },

    async updateOrderStoreOrderMemo({ conditions, data }) {
      const res = await apolloClient.mutate({
        mutation: updateOrderStoreOrderMemo,
        variables: {
          conditions: {
            ...conditions,
          },
          data: {
            ...data,
          },
        },
      });
      return res.data.updateOrderStoreOrderMemo;
    },

    initOrders() {
      // 상태별 주문리스트 초기화
      this.initState();

      const orderList = this._storeOrders
        .map((o) => ({ ...o, badge: appendOrderBadgeData(o) }))
        .sort((a, b) => {
          if (b.isReservation) {
            return reserveOrderProceedAt(b) - a.createdAt;
          }
          return b.createdAt - a.createdAt;
        });

      orderList.forEach((o) => {
        // 접수대기
        if (
          // 수락 가능한 주문
          isNeedAccept(o) ||
          // 배달 요청 가능한 주문
          isCanRequestDelivery(o) ||
          // 배달요청 실패한 주문
          isDeliveryFailed(o)
        ) {
          // 접수대기 그룹에 추가
          this._wating.push(o);
        } else
        // 접수
        if (isAccepted(o)) {
          this._accepted.push(o);
        } else
        // 배차
        if (
          // 배차되었거나
          isAllocated(o) ||
          // 직접 배달 출발 전이거나
          isSelfDeliveryCreated(o) ||
          // 다중 배달이 진행중이거나
          isDeliveriesInAllocated(o)
        ) {
          this._allocated.push(o);
        } else
        // 픽업
        if (
          isPickupFinished(o) ||
          isSelfDeliveryDeparted(o) ||
          isHallOrder(o) ||
          isPackingOrder(o) ||
          isDeliveriesInPickup(o)
        ) {
          this._pickup.push(o);
        }
      });

      if (!this._selectedTab) {
        this._selectedTab = 'waiting';
      }
      this._selectedTabOrders = this[this._selectedTab];
    },

    // 주문 새로고침
    async refreshOrders() {
      const { doGetOrders } = useOrderAsync();
      await doGetOrders();
    },

    // 배단현황 tab 변경
    async changeDeliveryStatus(type) {
      this.refreshOrders();
      this._selectedTab = type;
      this._selectedTabOrders = this[type];
    },
  },
  getters: {
    storeOrders: (state) => state._storeOrders,
    selectedTab: (state) => state._selectedTab,
    selectedTabOrders: (state) => state._selectedTabOrders,
    waiting: (state) => {
      const list = state._wating;
      const cancelOrders = [];
      const proceedOrders = [];

      list.forEach((o) => {
        const mainDelivery = getMainDelivery(o);
        if (mainDelivery?.status === DELIVERY_STATUS.CANCELED) {
          cancelOrders.push(o);
        } else {
          proceedOrders.push(o);
        }
      });
      return [...proceedOrders, ...cancelOrders];
    },
    accepted: (state) => state._accepted,
    allocated: (state) => state._allocated,
    pickup: (state) => state._pickup,
    completed: (state) => state._completed,
    completedTotalCount: (state) => state._completedTotalCount,
    totalPaymentInfo: (state) => state._totalInfo,
    deliveryOrder: (state) => state._deliveryOrder,
    packingOrder: (state) => state._packingOrder,
    hallOrder: (state) => state._hallOrder,
    deliveryPriceInfo: (state) => state._deliveryPriceInfo,
    selectedFiltering: (state) => state._selectedFiltering,
    filterConditions: (state) => state._filterConditions,
    orderStatusCount: (state) => state._orderStatusCount,
  },
});
