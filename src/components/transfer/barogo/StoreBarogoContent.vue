<template>
  <VSheet>
    <VForm ref="formValid">
      <VRow class="flex-column" no-gutters>
        <VCol class="mb-6">
          {{ $t('views.transfer.barogo.pageInfo') }}
        </VCol>
        <VCol class="mb-6">
          <StoreTextField
            name="businessNumber"
            v-model="form.businessNumber"
            :title="$t('views.transfer.inputField.businessNumber.title')"
            :label="$t('views.transfer.inputField.businessNumber.label')"
            :placeholder="$t('views.transfer.inputField.businessNumber.placeholder')"
            type="text"
            :dark="true"
            :errorMessages="errorMessage"
            maxlength="12"
            :autofocus="true"
            @input="form.businessNumber = addHyphenBusinessNumber(form.businessNumber)"
            :disabled="(getStoreList.length > 0)"
            :rules="corpNumberRules"
            required
          />
        </VCol>
        <VCol>
          <StoreTextField
            name="phone"
            v-model="form.phone"
            :title="$t('views.transfer.inputField.phone.title')"
            :label="$t('views.transfer.inputField.phone.label')"
            :placeholder="$t('views.transfer.inputField.phone.placeholder')"
            variant="outlined"
            type="tel"
            :dark="true"
            maxlength="14"
            @input="form.phone = addHyphenPhoneNumber(form.phone)"
            @keypress.enter="findBarogoStore"
            :rules="telRules"
            :disabled="(getStoreList.length > 0)"
            required
          />
        </VCol>
      </VRow>
    </VForm>
  </VSheet>

  <VMain v-if="getStoreList.length > 0">
    <VCard flat :color="gray2Color" class="mt-3 pa-4">
      <p class="pt-3 mb-5">
        {{ $t('views.transfer.barogo.searchResult') }}
      </p>
      <VRadioGroup v-model="selectStoreId" row>
        <StoreTextFieldRadio
          v-for="(val, index) in getStoreList"
          :key="index"
          :value="val.storeId"
          color="primary"
          class="mb-4"
        >
          <span class="s-color-gray-75">{{ val.name }}</span>
        </StoreTextFieldRadio>
      </VRadioGroup>
    </VCard>
  </VMain>
  <StoreFindResultModal v-if="isShowStoreFindModal" @close="closeModal" />
</template>

<script setup name="StoreBarogoContent">
import { ref, reactive, watchEffect, watch, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useLogger } from 'vue-logger-plugin';

import { useTransferStore, useCommonStore } from '@/stores';
import Rules from '@/utils/validationRules';

import StoreTextField from '@/components/common/StoreTextField.vue';
import StoreTextFieldRadio from '@/components/common/StoreTextFieldRadio.vue';
import StoreFindResultModal from '@/components/transfer/barogo/StoreFindResultModal.vue';
import { addHyphenPhoneNumber, addHyphenBusinessNumber } from '@/utils/stringUtils';

import { gray2Color } from '@/styles/_export.module.scss';

const emits = defineEmits(['validation-changed']);

const router = useRouter();
const logger = useLogger();
const transfer = useTransferStore();
const common = useCommonStore();

const { telRules, corpNumberRules } = Rules;

const form = reactive({
  businessNumber: '',
  phone: '',
});

const errorMessage = ref('');
const isShowStoreFindModal = ref(false);
const selectStoreId = ref(null);
const formValid = ref();
const getStoreList = computed(() => transfer.getStoreList);

const closeModal = () => {
  isShowStoreFindModal.value = false;
};

const confirmStore = async () => {
  const data = transfer.getStoreList.find((item) => item.storeId === selectStoreId.value);
  const payload = {
    storeId: selectStoreId.value,
    name: data.name,
    businessNumber: data.businessNumber,
    ownerName: data.ownerName,
    ownerPhone: data.ownerPhone,
    phone: data.phone,
    jibunAddress: data.jibunAddress,
    roadAddress: data.roadAddress,
    detailAddress: data.detailAddress,
  };

  await transfer.selectedBarogoStore(payload);

  router.push({ name: 'TransferResult' });
};

const findBarogoStore = async () => {
  try {
    const payload = {
      businessNumber: form.businessNumber.replaceAll('-', ''),
      phone: form.phone.replaceAll('-', ''),
    };

    common.setIsOverlayLoading(true);
    const { storesByBusinessNumberAndPhone } = await transfer.findStore(payload);

    if (storesByBusinessNumberAndPhone.length === 0) {
      isShowStoreFindModal.value = true;
      return;
    }

    // 사업자번호 & 상점전화번호로 결과 조회 후 버튼 비활성화 처리
    emits('validation-changed', true);
    router.push({ name: 'TransferBarogoSearching' });
  } catch (err) {
    isShowStoreFindModal.value = true;
    logger.error(err);
  } finally {
    common.setIsOverlayLoading(false);
  }
};

// Form validation 확인
const _checkFormValidation = async () => {
  const isVal = await formValid.value?.items.every((element) => element.isValid);
  emits('validation-changed', true);

  if (isVal && form.businessNumber && form.phone) {
    emits('validation-changed', false);
  }
};

// 연결할 상점 선택시 버튼 disabled 해제
watch(selectStoreId, (newVal) => {
  if (newVal) {
    emits('validation-changed', false);
  }
});

watchEffect(() => {
  _checkFormValidation();
});

// 상점 검색후 스크롤 맨 아래로 이동
watch(() => (getStoreList.value), (newList) => {
  if (newList.length > 0) {
    setTimeout(() => {
      document.documentElement.scrollTop = document.documentElement.scrollHeight;
    }, 0);
  }
});

defineExpose({ confirmStore, findBarogoStore, selectStoreId, form });

</script>

<style lang="scss" scoped>
@import '@/styles/common/form.scss';
@import '@/styles/common/button.scss';
@import '@/styles/mixins';

* {
  line-height: 2.4rem;
  white-space: pre-line;
}

:deep(.v-selection-control) {
  background: #ffffff;
  border: 1px solid $color-gray-bd;
  border-radius: 4px;
  box-sizing: border-box;
  flex-direction: row-reverse;
  padding: 0 0 0 1.6rem;
}

:deep(.v-selection-control--dirty) {
  border: 1px solid $color-primary;
  border-radius: 4px;
  box-sizing: border-box;
}

.v-main {
  background: $color-gray-f5;
}
</style>
