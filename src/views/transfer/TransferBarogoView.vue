<template>
    <VMain>
    <div class="content">
      <VRow no-gutters class="view-page">
        <VCol>
          <StoreBarogoContent
            ref="refBarogoContentComponent"
            @validation-changed="onValidationChanged"
          />
        </VCol>
      </VRow>
    </div>
  </VMain>

  <StoreContentBottom class="mb-4">
    <StoreButton
      block
      @click.stop="getStoreList.length === 0 ? submit() : confirmStore()"
      :disabled="isDisabled" class="text-center"
    >
      {{ $t('views.transfer.buttonText.nextStep') }}
    </StoreButton>
  </StoreContentBottom>
</template>
<script>
import { ref, defineComponent, computed, onBeforeMount, onUpdated } from 'vue';
import { useRouter, useRoute } from 'vue-router';

import { useTransferStore, useCommonStore } from '@/stores';

import StoreBarogoContent from '@/components/transfer/barogo/StoreBarogoContent.vue';
import StoreContentBottom from '@/components/common/StoreContentBottom.vue';
import StoreButton from '@/components/common/StoreButton.vue';

export default defineComponent({
  name: 'TransferBarogoView',
  components: {
    StoreBarogoContent,
    StoreContentBottom,
    StoreButton,
  },
  setup() {
    const router = useRouter();
    const route = useRoute();

    const transfer = useTransferStore();
    const commonStore = useCommonStore();

    const refBarogoContentComponent = ref('');
    const error = ref(false);
    const errorMessage = ref('');
    const isDisabled = ref(true);

    const onValidationChanged = (value) => {
      isDisabled.value = value;
    };

    onUpdated(() => {
      // 상점연결 조회 결과(list)화면에서
      // back을 하여 조회 입력 화면으로 올때 이전 입력된 값 초기화
      if (commonStore.getPreviousRoute.name === 'TransferBarogoSearching') {
        transfer.resetStoreList();
        refBarogoContentComponent.value.selectStoreId = null;
        refBarogoContentComponent.value.form.businessNumber = '';
        refBarogoContentComponent.value.form.phone = '';
      }
    });

    const currentRouteName = computed(() => route.name);
    onBeforeMount(() => {
      transfer.resetStoreList();

      // 상점 연결 최종확인(Result)에서 back버튼(뒤로) 클릭시
      // 한번더 back을 하여 상점 조회 입력 화면으로
      if (currentRouteName.value === 'TransferBarogoSearching') {
        router.back();
      }
    });

    return {
      refBarogoContentComponent,
      error,
      errorMessage,
      isDisabled,
      onValidationChanged,
      submit: () => refBarogoContentComponent.value.findBarogoStore(),
      confirmStore: () => refBarogoContentComponent.value.confirmStore(),
      getStoreList: computed(() => transfer.getStoreList),
    };
  },
});
</script>

<style lang="scss" scoped>
@import '@/styles/common/form.scss';
@import '@/styles/common/button.scss';
@import '@/styles/layout/main.scss';
.v-main {
  background: white;
}
</style>
