<template>
  <VForm ref="formValid">
    <VRow class="flex-column" no-gutters>
      <VCol> {{ $t('views.findLoginId.message.enterMemberInfo') }} </VCol>
      <VCol class="mt-6">
        <StoreTextField
          name="name"
          v-model="form.name"
          :title="$t('views.findLoginId.inputField.name.title')"
          :label="$t('views.findLoginId.inputField.name.label')"
          :placeholder="$t('views.findLoginId.inputField.name.placeholder')"
          type="text"
          :dark="true"
          :rules="nameRules"
          maxlength="30"
          :autofocus="true"
          required
        />
      </VCol>
      <VCol class="mt-4">
        <StoreTextField
          name="phone"
          v-model="form.phone"
          :title="$t('views.findLoginId.inputField.phoneNumber.title')"
          :label="$t('views.findLoginId.inputField.phoneNumber.label')"
          :placeholder="$t('views.findLoginId.inputField.phoneNumber.placeholder')"
          variant="outlined"
          type="tel"
          :dark="true"
          :rules="phoneRules"
          maxlength="13"
          @input="form.phone = addHyphenPhoneNumber(form.phone)"
          required
        />
      </VCol>
    </VRow>
  </VForm>
</template>
<script>
import { ref, reactive, defineComponent, watchEffect } from 'vue';
import { useRouter } from 'vue-router';
import { useLocale } from 'vuetify';
import { useLogger } from 'vue-logger-plugin';

import { useAuthStore } from '@/stores';
import { addHyphenPhoneNumber } from '@/utils/stringUtils';

import Rules from '@/utils/validationRules';

import StoreTextField from '@/components/common/StoreTextField.vue';

export default defineComponent({
  components: {
    StoreTextField,
  },
  name: 'StoreFindLoginIdContent',
  emits: ['validation-changed'],
  setup(props, { emit }) {
    const { t } = useLocale();
    const logger = useLogger();
    const { phoneRules, nameRules } = Rules;
    const router = useRouter();
    const auth = useAuthStore();
    const form = reactive({
      name: '',
      phone: '',
    });

    const formValid = ref();
    const error = ref(false);
    const errorMessage = ref('');
    const showPassword = ref(false);

    const findId = async () => {
      try {
        error.value = false;
        errorMessage.value = '';
        const payload = {
          ...form,
          phone: form.phone.replaceAll('-', ''),
        };
        const { findLoginId } = await auth.findLoginIds(payload);

        if (findLoginId.length === 0) {
          error.value = true;
          errorMessage.value = t('views.findLoginId.message.notFoundLoginId');
          return;
        }
        router.push({ name: 'FindLoginIdResult' });
      } catch (err) {
        logger.log(err);
      }
    };

    // Form validation 확인
    const _checkFormValidation = async () => {
      const isVal = formValid.value?.items.every((element) => element.isValid);
      emit('validation-changed', true);
      if (isVal) {
        emit('validation-changed', false);
      }
    };

    watchEffect(() => {
      _checkFormValidation();
    });
    return {
      formValid,
      error,
      errorMessage,
      showPassword,
      phoneRules,
      nameRules,
      form,
      findId,
      addHyphenPhoneNumber,
    };
  },
});
</script>

<style lang="scss" scoped>
@import '@/styles/common/form.scss';
@import '@/styles/common/button.scss';
@import '@/styles/mixins';
</style>
