<template>
  <VRow no-gutters class="flex-column">
    <VCol class="result-title px-5 pt-7">
      <div v-if="fromRouteName === 'TransferO2O'">
        {{ $t('views.transfer.result.o2oSubject') }}
      </div>
      <div v-else>
        {{ $t('views.transfer.result.barogoSubject') }}
      </div>
      <br />
      <span class="s-color-gray-66"
        >{{ $t('views.transfer.result.customerService') }}: 02-550-9900</span
      >
    </VCol>
    <VCol>
      <VSheet :color="gray2Color" class="mt-7 pa-4" rounded="0">
        <div class="mt-2 mb-5">
          <span class="font-size-18 font-weight-bold">{{ storeData.name }}</span>
        </div>
        <VRow class="pt-1" v-for="(item, index) in items" :key="index">
          <VCol cols="4">
            <span class="s-color-gray-66">{{ item.label }}</span>
          </VCol>
          <VCol cols="8">
            <template v-if="typeof item.data === 'object'">
              <span v-for="(value, idx) in item.data" :key="idx">
                <div class="py-2" v-if="idx === 1">
                  <VChip rounded="1" size="x-small" label variant="outlined" close>
                    <span class="font-size-12 s-color-gray-66">
                      {{ $t('views.transfer.result.addressRoad') }}
                    </span>
                  </VChip>
                </div>
                {{ value }}
              </span>
            </template>
            <template v-else>
              {{ item.data }}
            </template>
          </VCol>
        </VRow>
      </VSheet>
    </VCol>
    <VCol class="pl-2 mt-1 text-end">
      <VCheckbox
        v-model="isConfirm"
        :label="$t('views.transfer.result.confirmStoreInfo')"
        color="primary"
        hide-details
        @click="emit('validation-changed', isConfirm)"
      ></VCheckbox>
    </VCol>
  </VRow>
</template>
<script setup name="StoreTransferResultContent">
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useLocale } from 'vuetify';
import * as Sentry from '@sentry/vue';

import { useAuthStore, useTransferStore, useCommonStore, useErrorsStore } from '@/stores';
import {
  addHyphenPhoneNumber,
  addHyphenBusinessNumber,
  nameMasking,
  phoneMasking,
} from '@/utils/stringUtils';

import { gray2Color } from '@/styles/_export.module.scss';

const emit = defineEmits(['validation-changed']);

const router = useRouter();
const { t } = useLocale();

const auth = useAuthStore();
const common = useCommonStore();
const transfer = useTransferStore();
const error = useErrorsStore();
const isConfirm = ref(false);
const items = ref([]);

const fromRouteName = computed(() => common.getPreviousRoute.name);
const storeData = computed(() => transfer.getStoreData);

onMounted(() => {
  items.value = [];

  const maskingDetailAddress =
    storeData.value.detailAddress ? storeData.value.detailAddress?.replace(/./g, '*') : '';

  items.value.push({
    label: t('views.transfer.result.viewLabel.businessNumber'),
    data: addHyphenBusinessNumber(storeData.value.businessNumber),
  });
  items.value.push({
    label: t('views.transfer.result.viewLabel.address'),
    data: [`${storeData.value.jibunAddress} ${maskingDetailAddress}`, `${storeData.value.roadAddress} ${maskingDetailAddress}`],
  });
  items.value.push({
    label: t('views.transfer.result.viewLabel.phone'),
    data: addHyphenPhoneNumber(storeData.value.phone),
  });
  items.value.push({
    label: t('views.transfer.result.viewLabel.ownerName'),
    data: nameMasking(storeData.value.ownerName),
  });
  items.value.push({
    label: t('views.transfer.result.viewLabel.ownerPhone'),
    data: phoneMasking(addHyphenPhoneNumber(storeData.value.ownerPhone)),
  });
});

const sumbitTransfer = async () => {
  const storeId = storeData?.value?.storeId;

  if (storeId) {
    try {
      common.setIsOverlayLoading(true);
      const { createStoreUser } = await transfer.createStoreUser(storeId);

      // 토큰을 다시 발급받고, 상점 유저 리스트를 새로고침 할 것
      await auth.me();
      await auth.storeUsers();

      // 새로 불러온 상점 유저 정보에서 현재 연결된 상점을 찾습니다.
      const { store } = auth.storeUserList.find((v) =>
        v.storeId === createStoreUser.storeId && v.userId === createStoreUser.userId);

      // 해당 상점을 선택합니다.
      auth.selectStore(store);
    } catch (err) {
      if (error.convertedError.code === 'DUPLICATED_ID') {
        common.showToast('error', `${t('views.transfer.message.alreadyConnectedStore')}`);
      } else {
        common.showToast('error', '알 수 없는 에러가 발생하였습니다.');
        Sentry.captureException(error.convertedError);
      }
    } finally {
      common.setIsOverlayLoading(false);
      router.push({ name: 'Main' });
    }
  }
};

defineExpose({ sumbitTransfer });
</script>

<style lang="scss" scoped>
.result-title {
  line-height: 2.4rem;
  white-space: pre-line;
}
.v-chip {
  font-size: 1.2rem;
  background: #ffffff;
  border: 1px solid $color-gray-cb;
}
</style>
