<template>
  <VRow class="flex-column" no-gutters>
    <VCol class="page-title">
      {{ $t('views.transfer.o2o.pageInfo') }}
    </VCol>
    <VCol class="mt-6">
      <StoreTextField
        name="name"
        v-model="form.username"
        :title="$t('views.transfer.inputField.username.title')"
        :label="$t('views.transfer.inputField.username.label')"
        type="text"
        :dark="true"
        maxlength="20"
        :autofocus="true"
        required
      />
    </VCol>
    <VCol class="mt-4">
      <StoreTextField
        name="password"
        v-model="form.password"
        :title="$t('views.transfer.inputField.password.title')"
        :label="$t('views.transfer.inputField.password.label')"
        variant="outlined"
        :type="showPassword ? 'text' : 'password'"
        @click:append-inner="showPassword = !showPassword"
        :appendInnerIcon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
        :dark="true"
        @keypress.enter="findStore"
        required
      />
    </VCol>
  </VRow>

  <StoreNotUseBarogoModal v-if="isShowNotUseBarogoModal" @close="closeModal" />
  <StoreNewRegisterModal v-if="isShowNewRegisterStoreModal" @close="closeModal" />
  <StoreIncorrectInputModal v-if="isShowIncorrectInputModal" @close="closeModal" />
</template>
<script>
import { ref, reactive, defineComponent, watchEffect, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useLocale } from 'vuetify';
import { useLogger } from 'vue-logger-plugin';

import { useTransferStore, useErrorsStore, useCommonStore } from '@/stores';
import Rules from '@/utils/validationRules';
import { addHyphenPhoneNumber, addHyphenBusinessNumber } from '@/utils/stringUtils';

import StoreTextField from '@/components/common/StoreTextField.vue';
import StoreNotUseBarogoModal from '@/components/transfer/o2o/StoreNotUseBarogoModal.vue';
import StoreNewRegisterModal from '@/components/transfer/o2o/StoreNewRegisterModal.vue';
import StoreIncorrectInputModal from '@/components/transfer/o2o/StoreIncorrectInputModal.vue';

export default defineComponent({
  name: 'StoreO2OContent',
  components: {
    StoreTextField,
    StoreNotUseBarogoModal,
    StoreNewRegisterModal,
    StoreIncorrectInputModal,
  },
  emits: ['validation-changed'],
  setup(props, { emit }) {
    const { passwordRule } = Rules;
    const router = useRouter();
    const logger = useLogger();
    const common = useCommonStore();
    const errors = useErrorsStore();
    const transfer = useTransferStore();
    const { t } = useLocale();

    const form = reactive({
      username: '',
      password: '',
    });

    const formValid = ref();
    const error = ref(false);
    const errorMessage = ref('');
    const showPassword = ref(false);
    const isShowNotUseBarogoModal = ref(false);
    const isShowNewRegisterStoreModal = ref(false);
    const isShowIncorrectInputModal = ref(false);

    const closeModal = () => {
      isShowNotUseBarogoModal.value = false;
      isShowNewRegisterStoreModal.value = false;
      isShowIncorrectInputModal.value = false;
    };

    const findStore = async () => {
      try {
        common.setIsOverlayLoading(true);
        const data = await transfer.findO2OStore(form);

        if (data?.error) {
          error.value = true;
          errorMessage.value = t('views.transfer.message.checkLoginIdAndPassword');
          return;
        }

        const payload = {
          barogoStoreId: data.code,
          barogoDistributorCode: data.distributorId,
        };

        await transfer.transferBarogoStore(payload);
        router.push({ name: 'TransferResult' });
      } catch (err) {
        const mappingErrorCode = ['STORE_MAPPED_OTHER_COMPANY', 'STORE_MAPPING_ALL_PAUSED'];

        if (
          errors.convertedError?.code &&
          mappingErrorCode.some((code) => code === errors.convertedError.code)
        ) {
          isShowNotUseBarogoModal.value = true;
          return;
        }

        if (errors.convertedError?.code === 'ERROR_CODE_NOT_ALLOW_BRAND_DISTRIBUTOR') {
          isShowNewRegisterStoreModal.value = true;
          return;
        }

        isShowIncorrectInputModal.value = true;
        logger.error(err);
      } finally {
        common.setIsOverlayLoading(false);
      }
    };

    // Form validation 확인
    const _checkFormValidation = async () => {
      emit('validation-changed', true);

      if (form.username && form.password) {
        error.value = false;
        errorMessage.value = '';

        emit('validation-changed', false);
      }
    };

    watchEffect(() => {
      _checkFormValidation();
    });

    return {
      isShowIncorrectInputModal,
      isShowNotUseBarogoModal,
      isShowNewRegisterStoreModal,
      showPassword,
      formValid,
      error,
      errorMessage,
      passwordRule,
      form,
      findStore,
      closeModal,
      addHyphenPhoneNumber,
      addHyphenBusinessNumber,
      getStoreList: computed(() => transfer.getStoreList),
    };
  },
});
</script>

<style lang="scss" scoped>
@import '@/styles/common/form.scss';
@import '@/styles/common/button.scss';
@import '@/styles/mixins';
:deep(.v-selection-control) {
  background: #ffffff;
  border: 1px solid $color-gray-bd;
  border-radius: 4px;
  box-sizing: border-box;
  flex-direction: row-reverse;
  height: 5.2rem;
  padding: 0 0 0 1.6rem;
}
:deep(.v-selection-control--dirty) {
  border: 1px solid $color-primary;
  border-radius: 4px;
  box-sizing: border-box;
}
.page-title {
  line-height: 2.4rem;
  white-space: pre-line;
}
</style>
