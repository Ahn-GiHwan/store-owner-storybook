import { h } from 'vue';

import { isEditableOrder } from '@utils/orderUtils';
import { useAuthStore, useCommonStore, useOrderDetailStore } from '@/stores';
import SiteHeader from '@/components/layout/StoreHeader.vue';
import { asyncComponent } from './utils';
import i18n from '@/plugins/vueI18n';

const { t } = i18n.global;

const setHeader = (title) => ({
  render() {
    return h(SiteHeader, { title });
  },
});

const routes = [
  {
    path: '/',
    name: 'Main',
    components: {
      header: setHeader(),
      default: asyncComponent('delivery/DeliveryStatusView'),
    },
    beforeEnter: (to, from, next) => {
      const auth = useAuthStore();

      if (!auth.currentStore?.storeId) {
        next('/transfer-intro');
        return;
      }
      next();
    },
    meta: {
      requiresAuth: true,
      requiresApproval: true,
    },
  },
  {
    path: '/signup',
    name: 'Signup',
    components: {
      header: setHeader(t('views.signup.memberJoin')),
      default: asyncComponent('login/SignupView'),
    },
    beforeEnter: (to, from, next) => {
      next();
    },
    meta: {},
  },
  {
    path: '/signup-complete',
    name: 'SignupComplete',
    components: {
      default: asyncComponent('login/SignupCompleteView'),
    },
    beforeEnter: (to, from, next) => {
      next();
    },
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/identify-verification-result',
    name: 'Certification',
    components: {
      header: setHeader(t('views.certificationResult.barogoStorePhoneCertification')),
      default: asyncComponent('login/CertificationResultView'),
    },
    meta: {},
  },
  {
    path: '/find-login-id',
    name: 'FindLoginId',
    components: {
      header: setHeader(t('views.findLoginId.findLoginId')),
      default: asyncComponent('login/FindLoginIdView'),
    },
    meta: {},
  },
  {
    path: '/find-login-id-result',
    name: 'FindLoginIdResult',
    components: {
      header: setHeader(t('views.findLoginId.findLoginId')),
      default: asyncComponent('login/FindLoginIdResultView'),
    },
    meta: {},
  },
  {
    path: '/login',
    name: 'Login',
    components: {
      default: asyncComponent('login/LoginView'),
    },
    beforeEnter: async (to, from, next) => {
      // 로그인 페이지에 진입하기 전 기존 인증정보가 존재하는 경우 로그아웃을 해서 삭제합니다.
      const auth = useAuthStore();
      if (auth.accessToken) {
        auth.logoutUser();
      }
      next();
    },
    meta: {},
  },
  {
    path: '/change-password',
    name: 'ChangePassword',
    components: {
      header: setHeader(t('views.changePassword.changePassword')),
      default: asyncComponent('login/ChangePasswordView'),
    },
    meta: {},
  },
  {
    path: '/find-password',
    name: 'FindPassword',
    components: {
      header: setHeader(t('views.findPassword.findPassword')),
      default: asyncComponent('login/FindPasswordView'),
    },
    meta: {},
  },
  {
    path: '/transfer-intro',
    name: 'TransferIntro',
    components: {
      default: asyncComponent('transfer/TransferIntroView'),
    },
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/transfer-barogo',
    name: 'TransferBarogo',
    components: {
      header: setHeader(t('views.transfer.barogoTransfer')),
      default: asyncComponent('transfer/TransferBarogoView'),
    },
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/transfer-barogo-searching',
    name: 'TransferBarogoSearching',
    components: {
      header: setHeader(t('views.transfer.barogoTransfer')),
      default: asyncComponent('transfer/TransferBarogoView'),
    },
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/transfer-o2o',
    name: 'TransferO2O',
    components: {
      header: setHeader(t('views.transfer.o2oTransfer')),
      default: asyncComponent('transfer/TransferO2OView'),
    },
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/transfer-result',
    name: 'TransferResult',
    components: {
      header: setHeader(t('views.transfer.barogoTransfer')),
      default: asyncComponent('transfer/TransferResultView'),
    },
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/non-approved-user',
    name: 'NonApprovedUser',
    components: {
      default: asyncComponent('login/NonApprovedUserView'),
    },
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/create-order',
    name: 'CreateOrder',
    components: {
      header: setHeader(t('views.createOrder.createOrder')),
      default: asyncComponent('order/CreateOrderView'),
    },
    meta: {
      requiresAuth: true,
      requiresApproval: true,
    },
  },
  {
    path: '/modify-order/:orderId',
    name: 'ModifyOrder',
    components: {
      header: setHeader(t('views.modifyOrder.modifyOrder')),
      default: asyncComponent('order/ModifyOrderView'),
    },
    beforeEnter: async (to, from, next) => {
      const common = useCommonStore();
      common.setIsOverlayLoading(true);

      if (Number.isNaN(Number(to.params?.orderId))) {
        common.setIsOverlayLoading(false);
        next({ name: 'NotFoundPage' });
      } else {
        // 주문이 수정 가능한 상태의 주문인지 파악을 먼저 합니다.
        const auth = useAuthStore();

        const orderDetail = useOrderDetailStore();

        await orderDetail.doReadModifyOrder({
          orderId: Number(to.params?.orderId),
          storeId: auth.currentStore?.storeId,
        });

        if (!isEditableOrder(orderDetail.modifyOrder)) {
          common.setIsOverlayLoading(false);
          next({ name: 'NotFoundPage' });
          return;
        }

        common.setIsOverlayLoading(false);
        next();
      }
    },
    props: ({ params }) => ({
      orderId: params.orderId,
    }),
    meta: {
      requiresAuth: true,
      requiresApproval: true,
    },
  },
  {
    path: '/order/:orderId',
    name: 'OrderDetail',
    components: {
      header: setHeader(t('views.orderDetail.title')),
      default: asyncComponent('order/OrderDetailView'),
    },
    meta: {
      requiresAuth: true,
      requiresApproval: true,
    },
  },
  {
    path: '/onboard',
    name: 'Onboard',
    components: {
      default: asyncComponent('login/OnboardView'),
    },
  },
  {
    path: '/completed-order',
    name: 'CompletedOrder',
    components: {
      header: setHeader('완료'),
      default: asyncComponent('order/CompletedOrderView'),
    },
    meta: {
      requiresAuth: true,
      requiresApproval: true,
    },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFoundPage',
    components: {
      default: asyncComponent('error/NotFoundView'),
    },
    meta: {},
  },
];

export default [...routes];
