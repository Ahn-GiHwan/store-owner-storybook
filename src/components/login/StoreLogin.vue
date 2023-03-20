<template>
  <VForm class="login">
    <VContainer fluid class="pa-0">
      <VRow no-gutters class="d-flex flex-column">
        <VCol :class="[mobile && 'text-center']">
          <StoreLogo />
        </VCol>
        <VCol :class="[mobile ? 'mt-11' : 'mt-7']">
          <StoreTextField
            name="loginId"
            v-model="form.loginId"
            title="아이디"
            label="아이디를 입력해 주세요."
            placeholder="영문자, 숫자 포함 5자 이상"
            type="text"
            :dark="true"
            maxlength="20"
            :autofocus="!form.loginId && true"
            required
          />
        </VCol>
        <VCol class="mb-0 mt-4">
          <StoreTextField
            name="password"
            v-model="form.password"
            title="비밀번호"
            label="비밀번호를 입력해 주세요."
            placeholder="8자 이상"
            variant="outlined"
            :type="showPassword ? 'text' : 'password'"
            :appendInnerIcon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
            @click:append-inner="showPassword = !showPassword"
            @keyup.enter.stop="signIn"
            :dark="true"
            :autofocus="form.checkedSaveId"
            maxlength="20"
            required
        /></VCol>
        <VCol class="mt-6">
          <VRow class="d-flex flex-row align-baseline">
            <VCol class="pa-0">
              <VCheckbox
                v-model="form.checkedAutoLogin"
                label="자동 로그인"
                color="primary"
                @change="checkAutoLogin"
                hide-details
              />
            </VCol>
            <VCol class="pa-0 pl-6">
              <VCheckbox
                v-model="form.checkedSaveId"
                label="아이디 저장"
                color="info"
                :disabled="form.checkedAutoLogin"
                hide-details
              />
            </VCol>
            <VSpacer />
          </VRow>
        </VCol>
        <VCol class="mt-8">
          <div v-if="error" class="error-message-password text-end mb-2">
            <p v-html="errorMessage"></p>
          </div>
          <VBtn
            block
            @click="signIn"
            :disabled="!form.loginId || !form.password"
            :color="!form.loginId || !form.password ? '#EEEEEE' : 'primary'"
          >
            로그인
          </VBtn>
        </VCol>
        <VCol class="text-center mt-6">
          <StoreFooterLink :data="links" />
        </VCol>
        <VCol class="text-center mt-5">
          <div class="help">
            도움이 필요하세요?
            <a href="tel:02-550-9900">02-550-9900</a>
          </div>
        </VCol>
      </VRow>
    </VContainer>
  </VForm>
  <StoreModalAgreements v-if="isShowTermsAgreementModal" @goto-main="gotoMain" />
  <StoreModalRestrictUse
    v-if="isShowUserRestrictModal"
    @close="closeModal"
    :loginId="form.loginId"
  />
  <StoreChangePasswordLayer
    :dialog="isShowChangePassowrdLayer"
    :currentPassword="form.password"
    @goto-main="gotoMain"
  />
</template>

<script setup name="StoreLogin">
import { ref, reactive, onBeforeMount, computed } from 'vue';
import { useRouter, useRoute, onBeforeRouteLeave } from 'vue-router';
import { useDisplay } from 'vuetify';
import { useCookies } from 'vue3-cookies';
import { useLogger } from 'vue-logger-plugin';

import { useCommonStore, useAuthStore, useErrorsStore } from '@/stores';
import { getAgreementStatus } from '@/utils/userUtils';

import StoreTextField from '@/components/common/StoreTextField.vue';
import StoreLogo from '@/components/common/StoreLogo.vue';
import StoreFooterLink from '@/components/common/StoreFooterLink.vue';
import StoreModalRestrictUse from '@/components/login/StoreModalRestrictUse.vue';
import StoreModalAgreements from '@/components/login/StoreModalAgreements.vue';
import StoreChangePasswordLayer from '@/components/login/StoreChangePasswordLayer.vue';

const router = useRouter();
const route = useRoute();
const { mobile } = useDisplay();
const { cookies } = useCookies();
const logger = useLogger();

const common = useCommonStore();
const auth = useAuthStore();
const errors = useErrorsStore();

const form = reactive({
  loginId: cookies.get('saveLogin')?.checkedSaveId ? cookies.get('saveLogin').saveLoginId : '',
  password: '',
  checkedSaveId: cookies.get('saveLogin')?.checkedSaveId || false,
  checkedAutoLogin: cookies.get('saveLogin')?.checkedAutoLogin || false,
});
const error = ref(false);
const errorMessage = ref('');
const isShowTermsAgreementModal = ref(false);
const isShowUserRestrictModal = ref(false);
const isShowChangePassowrdLayer = ref(false);
const isPasswordChangeRequired = computed(() => auth.currentUser?.isPasswordChangeRequired);
const showPassword = ref(false);

const links = [
  {
    name: '아이디 찾기',
    path: { name: 'FindLoginId' },
  },
  {
    name: '비밀번호 찾기',
    path: '/find-password',
  },
  {
    name: '회원가입',
    path: { name: 'Signup' },
    bold: true,
  },
];

const closeModal = () => {
  form.loginId = '';
  form.password = '';
  isShowUserRestrictModal.value = false;
};

const checkAutoLogin = () => {
  form.checkedSaveId = !form.checkedSaveId;
  if (form.checkedAutoLogin) {
    form.checkedSaveId = true;
  }
};

const _saveLoginCookies = () => {
  if (form.checkedSaveId) {
    const { checkedSaveId, checkedAutoLogin } = form;
    const payload = {
      saveLoginId: form.loginId,
      checkedSaveId,
      checkedAutoLogin,
    };
    cookies.set('saveLogin', {
      ...payload,
    });
  } else {
    cookies.remove('saveLogin');
  }
};

const gotoMain = () => {
  isShowTermsAgreementModal.value = false;
  isShowChangePassowrdLayer.value = false;

  if (isPasswordChangeRequired.value) {
    isShowChangePassowrdLayer.value = true;
    return;
  }

  if (router.currentRoute.value?.query?.return_url) {
    // NOTE: 메인페이지에서 브라우저 뒤로가기 버튼 클릭 시, 최초 진입이 메인페이지라 사이트를 벗어남.
    // (오버레이 화면이 보여진 상태에서 뒤로가기 버튼 클릭 시 사이트 벗어나서 replace -> push 로 변경
    router.push({
      path: router.currentRoute.value?.query?.return_url,
      hash: router.currentRoute.value?.hash,
    });
    return;
  }

  _saveLoginCookies();

  // NOTE: 메인페이지에서 브라우저 뒤로가기 버튼 클릭 시, 최초 진입이 메인페이지라 사이트를 벗어남.
  // (오버레이 화면이 보여진 상태에서 뒤로가기 버튼 클릭 시 사이트 벗어나서 replace -> push 로 변경
  router.push({ name: 'Main' });
};

const signIn = async () => {
  try {
    if (!form.password) {
      return;
    }

    const payload = {
      ...form,
    };

    if (form.checkedAutoLogin) {
      payload.rememberMe = true;
    }

    common.setIsOverlayLoading(true);
    const { loginUserForMobile } = await auth.loginUserForMobile(payload);
    const { userTermsAgreements } = loginUserForMobile;

    if (getAgreementStatus(userTermsAgreements, common.systemTimestamp).isAgreementRequired) {
      isShowTermsAgreementModal.value = true;
      return;
    }

    gotoMain();
  } catch (err) {
    error.value = true;

    if (!window.navigator.onLine) {
      common.showToast('error', '서버에 접속할 수 없습니다.\n인터넷 연결이나 방화벽 설정을 확인해 주세요.');
      return;
    }

    if (['NEED_REGISTER', 'LOGIN_FAIL'].includes((errors.convertedError?.code || errors.errorCode))) {
      errorMessage.value = '아이디나 비밀번호를 확인해 주세요.';
    } else if ((errors.convertedError?.code || errors.errorCode) === 'LOGIN_FAIL_WARNING') {
      errorMessage.value =
            '아이디나 비밀번호를 확인해 주세요.<br />5회 이상 틀릴 경우 이용이 제한됩니다.';
    } else if ((errors.convertedError?.code || errors.errorCode) === 'LOGIN_BLOCK') {
      isShowUserRestrictModal.value = true;
    } else {
      common.showToast('error', '로그인에 실패했습니다.\n다시 시도해주세요.');
    }
    logger.error(err);
  } finally {
    common.setIsOverlayLoading(false);
  }
};

onBeforeMount(() => {
  // 자동 로그인 체크 상태이면 메인 페이지로
  if (cookies.get('saveLogin')?.checkedAutoLogin) {
    common.setIsOverlayLoading(true);
    gotoMain();
  }
});

const isGoBack = computed(() =>
  String(router.options.history.state.forward).localeCompare(route.path) === 0);

const isShowOverlayView = computed(() =>
  isShowChangePassowrdLayer.value
  || isShowTermsAgreementModal.value);

const closeOverlayView = () => {
  isShowChangePassowrdLayer.value = false;
  isShowTermsAgreementModal.value = false;
};

onBeforeRouteLeave((to, from, next) => {
  if (isGoBack.value && isShowOverlayView.value) {
    closeOverlayView();
    next(false);
    return;
  }

  next();
});

</script>

<style lang="scss" scoped>
@import '@/styles/login';
</style>
