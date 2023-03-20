import { defineStore, getActivePinia } from 'pinia';
import {
  getActiveDeliveryAgencyStore,
  getCurrentDeliveryCondition,
  getCurrentStoreDeposit,
} from '@utils/storeUtils';
import { useCookies } from 'vue3-cookies';
import apolloClient from '@/plugins/apollo';
import { REQUIRED_AGREEMENT_TYPE } from '@/constants';

import { useCommonStore } from '@/stores';
import { getHashedString } from '@/utils/hash';
import { diffMinutes } from '@/utils/dateUtils';
import { createPrepareTime } from '@/utils/orderUtils';

import termsAndPolicies from '@/graphql/queries/termsAndPolicies.gql';
import loginUserForMobile from '@/graphql/mutations/loginUserForMobiles.gql';
import updateUserAgreements from '@/graphql/mutations/updateUserAgreements.gql';
import generateTemporaryTokenForMobile from '@/graphql/mutations/generateTemporaryTokenForMobile.gql';
import requestIdentityVerificationAddress from '@/graphql/mutations/requestIdentityVerificationAddress.gql';
import isDuplicatedLoginId from '@/graphql/queries/isDuplicatedLoginId.gql';
import changePassword from '@/graphql/mutations/changePassword.gql';
import me from '@/graphql/queries/me.gql';
import registerUser from '@/graphql/mutations/registerUser.gql';
import findLoginId from '@/graphql/queries/findLoginId.gql';
import findUnmaskedLoginId from '@/graphql/queries/findUnmaskedLoginId.gql';
import skipChangePassword from '@/graphql/mutations/skipChangePassword.gql';
import logoutUser from '@/graphql/mutations/logoutUser.gql';
import storeUsers from '@/graphql/queries/storeUsers.gql';
import deliveryCondition from '@/graphql/queries/deliveryCondition.gql';
import storeDeposit from '@/graphql/queries/storeDeposit.gql';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    _currentUser: null,
    _accessToken: '',
    _storeUserList: null,
    _currentStoreUser: null,
    _currentStore: null,
    _currentDeliveryCondition: null,
    _currentStoreDeposit: null,
    _currentPickupMinute: 0,

    _deliveryConditions: null,
    _storeDeposits: null,
    _isLoadingDeliveryAgencyStores: false,

    termsAndPolicies: null,
    _isRequiredAgreement: false,

    certificationParam: null,
    findLoginIdInfo: {
      name: '',
      phone: '',
    },
    findLoginIdList: [],
  }),

  persist: {
    storage: sessionStorage,
    paths: ['_currentUser', '_currentStore', '_currentStoreUser'],
  },
  actions: {
    async loginUserForMobile({ loginId, password, rememberMe }) {
      const { data } = await apolloClient.mutate({
        mutation: loginUserForMobile,
        variables: {
          loginId,
          password: getHashedString(password),
          rememberMe,
        },
      });

      const { accessToken, ...loginUser } = data.loginUserForMobile;

      this._accessToken = accessToken;
      this._currentUser = loginUser;

      if (!this._isRequiredAgreement && loginUser?.userTermsAgreements?.length > 0) {
        this.setRequiredAgreement(loginUser);
      }
      return data;
    },

    async me() {
      const { data } = await apolloClient.query({
        query: me,
      });

      const { accessToken, ...loginUser } = data.me;

      this._accessToken = accessToken;
      this._currentUser = loginUser;

      if (!this._isRequiredAgreement && loginUser?.userTermsAgreements?.length > 0) {
        this.setRequiredAgreement(loginUser);
      }
      return data;
    },

    async setMe(accessToken, loginUser) {
      this._accessToken = accessToken;
      this._currentUser = loginUser;
    },

    async storeUsers() {
      const { data } = await apolloClient.query({
        query: storeUsers,
      });
      this._storeUserList = data.storeUsers;
      return data;
    },

    async deliveryCondition(payload) {
      const { data } = await apolloClient.query({
        query: deliveryCondition,
        variables: {
          ...payload,
        },
      });

      this._deliveryConditions = data.deliveryCondition;
      return data;
    },

    async storeDeposit(payload) {
      const { data } = await apolloClient.query({
        query: storeDeposit,
        variables: {
          ...payload,
        },
      });

      this._storeDeposits = data.storeDeposit;
      return data;
    },

    async logoutUser() {
      const { data } = await apolloClient.mutate({
        mutation: logoutUser,
      });

      // 쿠키 삭제
      this.removeSaveLoginCookie();

      // logout시 모든 active 스토어 초기화 처리
      getActivePinia()._s.forEach((store) => store.$reset());
      return data;
    },

    async getTermsPolicies() {
      if (!this.termsAndPolicies) {
        const { data } = await apolloClient.query({
          query: termsAndPolicies,
        });
        this.termsAndPolicies = data;
      }
      return this.termsAndPolicies;
    },

    async updateUserAgreements(payload) {
      const { data } = await apolloClient.mutate({
        mutation: updateUserAgreements,
        variables: {
          data: payload,
        },
      });
      return data;
    },
    async requestCertification(payload) {
      const { data } = await apolloClient.mutate({
        mutation: requestIdentityVerificationAddress,
        variables: {
          conditions: {
            ...payload,
          },
        },
      });
      this.certificationParam = payload;
      return data;
    },

    async generateTemporaryTokenForMobile() {
      const { data } = await apolloClient.mutate({
        mutation: generateTemporaryTokenForMobile,
      });
      this._accessToken = data.generateTemporaryTokenForMobile?.accessToken;
      return data;
    },

    async isDuplicatedLoginId({ loginId }) {
      const { data } = await apolloClient.query({
        query: isDuplicatedLoginId,
        variables: {
          conditions: {
            loginId,
          },
        },
      });
      return data;
    },

    async changePassword({ loginId, newPassword }) {
      const { data } = await apolloClient.mutate({
        mutation: changePassword,
        variables: {
          loginId,
          newPassword: getHashedString(newPassword),
        },
      });
      this._accessToken = null;
      return data;
    },

    async registerUser({ loginId, password, identityVerificationId, userTermsAgreements }) {
      const { data } = await apolloClient.mutate({
        mutation: registerUser,
        variables: {
          data: {
            loginId,
            identityVerificationId,
            password: getHashedString(password),
            userTermsAgreements,
          },
        },
      });
      return data;
    },

    async findLoginIds({ name, phone }) {
      const { data } = await apolloClient.query({
        query: findLoginId,
        variables: {
          conditions: {
            name,
            phone,
          },
        },
      });
      this.findLoginIdList = data.findLoginId;
      this.findLoginIdInfo.name = name;
      this.findLoginIdInfo.phone = phone;
      return data;
    },

    async findUnmaskedLoginId({ name, phone, identityVerificationId }) {
      const { data } = await apolloClient.query({
        query: findUnmaskedLoginId,
        variables: {
          conditions: {
            name,
            phone,
            identityVerificationId,
          },
        },
      });
      this.findLoginIdList = data.findUnmaskedLoginId;
      return data;
    },

    async skipChangePassword({ loginId }) {
      const { data } = await apolloClient.mutate({
        mutation: skipChangePassword,
        variables: {
          conditions: {
            loginId,
          },
        },
      });
      return data;
    },

    selectStore(store) {
      // 특정 상점을 선택
      this._currentStore = store;
      // 해당 상점의 상점유저도 선택
      this._currentStoreUser =
        this._storeUserList.find(
          (v) => v.storeId === store.storeId && v.userId === this._currentUser.userId,
        );
    },

    setCurrentDeliveryCondition(currentDeliveryCondition) {
      const common = useCommonStore();

      this._currentDeliveryCondition = currentDeliveryCondition;
      this._currentPickupMinute =
        diffMinutes(common.systemTimestamp, this._currentDeliveryCondition.pickupMinimumAt);
    },

    setCurrentStoreDeposit(currentStoreDeposit) {
      this._currentStoreDeposit = currentStoreDeposit;
    },

    setRequiredAgreement(loginUser) {
      // 필수 동의 체크
      this._isRequiredAgreement = REQUIRED_AGREEMENT_TYPE.every((terms) =>
        loginUser.userTermsAgreements.find((item) => item.termsAndPolicyType === terms).isAgree);
    },

    async refreshDeliveryAgencyStores() {
      this._isLoadingDeliveryAgencyStores = true;

      const activeDeliveryAgencyStore =
        getActiveDeliveryAgencyStore(this._currentStore.deliveryAgencyStores);

      if (activeDeliveryAgencyStore) {
        const payload = {
          storeId: this._currentStore.storeId,
          deliveryAgencyId: activeDeliveryAgencyStore.deliveryAgencyId,
        };

        // 배달대행사 상태 조회
        const conditionPromise = this.deliveryCondition(payload);
        // 현재 액티브한 배달대행사의 예치금 조회
        const depositPromise = this.storeDeposit(payload);

        const promises = [conditionPromise, depositPromise];

        return Promise.allSettled(promises)
          .then(() => {
            // 현재 액티브한 배달대행사의 상태 설정
            this.setCurrentDeliveryCondition(
              getCurrentDeliveryCondition(
                this._deliveryConditions,
                activeDeliveryAgencyStore.deliveryAgencyId,
              ),
            );

            // 현재 액티브한 배달대행사의 상태 설정
            this.setCurrentStoreDeposit(
              getCurrentStoreDeposit(
                this._storeDeposits,
                activeDeliveryAgencyStore.deliveryAgencyId,
              ),
            );

            this._isLoadingDeliveryAgencyStores = false;
          });
      }
      return new Promise((resolve) => {
        resolve(null);
        this._isLoadingDeliveryAgencyStores = false;
      });
    },

    removeSaveLoginCookie() {
      const { cookies } = useCookies();
      const currentCookie = cookies.get('saveLogin');

      if (currentCookie?.checkedAutoLogin) {
        // 자동로그인만 false로 변경
        cookies.set('saveLogin', {
          ...currentCookie,
          checkedAutoLogin: false,
        });
      }
    },
  },
  getters: {
    accessToken: (state) => state._accessToken,
    currentUser: (state) => state._currentUser,
    currentStore: (state) => state._currentStore,
    currentStoreUser: (state) => state._currentStoreUser,

    currentDeliveryCondition: (state) => state._currentDeliveryCondition,
    currentStoreDeposit: (state) => state._currentStoreDeposit,
    isRequiredAgreement: (state) => state._isRequiredAgreement,
    currentPickupMinute: (state) => state._currentPickupMinute,

    storeUserList: (state) => state._storeUserList,
    deliveryConditions: (state) => state._deliveryConditions,
    storeDeposits: (state) => state._storeDeposits,
    isLoadingDeliveryAgencyStores: (state) => state._isLoadingDeliveryAgencyStores,
    prepareTimeData: (state) => createPrepareTime(state._currentStore?.productPrepareTime),
    minimumPrepareTime: (state) => {
      const prepareTimeData = createPrepareTime(state._currentStore?.productPrepareTime);
      const diffMinute = diffMinutes(Date.now(), state._currentDeliveryCondition?.pickupMinimumAt);

      if (diffMinute >= state._currentStore?.productPrepareTime) {
        return prepareTimeData.filter((item) => item.value > diffMinute)[0].value;
      }
      return state._currentStore?.productPrepareTime;
    },
    getCetificationParam: (state) => state.certificationParam,
    getFindLoginList: (state) =>
      state.findLoginIdList.map((value) => value).sort((a, b) => b.lastLoginAt - a.lastLoginAt),
    getFindUser: (state) => state.findLoginIdInfo,
  },
});
