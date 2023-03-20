<template>
  <VMain>
    <div class="content">
      <VRow no-gutters>
        <VCol>
          <StoreCreateOrder ref="refStoreCreateOrder"/>
        </VCol>
      </VRow>
    </div>
  </VMain>

  <StoreOrderWrittenCancelModal v-if="isCancelModal" @cancel="cancelModal"  @close="closeModal"/>
</template>

<script>
import { defineComponent, ref, computed } from 'vue';
import { onBeforeRouteLeave, useRouter, useRoute } from 'vue-router';

import StoreCreateOrder from '@/components/order/create/StoreCreateOrder.vue';
import StoreOrderWrittenCancelModal from '@/components/order/create/StoreOrderWrittenCancelModal.vue';

export default defineComponent({
  name: 'CreateOrderView',
  components: {
    StoreCreateOrder,
    StoreOrderWrittenCancelModal,
  },
  setup() {
    const router = useRouter();
    const route = useRoute();

    const refStoreCreateOrder = ref();
    const isCancelModal = ref(false);
    const toRoute = ref();
    let isCancelConfirm = false;

    const closeModal = () => {
      isCancelModal.value = false;
    };

    const cancelModal = () => {
      isCancelModal.value = false;
      isCancelConfirm = true;

      if (toRoute.value) {
        const { name, params, hash, query } = toRoute.value;
        router.push({ name, params, hash, query });
        return;
      }

      router.back();
    };

    const isGoBack = computed(() =>
      String(router.options.history.state.forward).localeCompare(route.path) === 0);

    const isGoForward = computed(() =>
      String(router.options.history.state.current).localeCompare(route.path) === 0);

    // 주문서 작성 화면에서 뒤로가기 할 경우 작성취소 모달 표시
    onBeforeRouteLeave((to, from, next) => {
      // NOTE: onBeforeRouteLeave 의 경우, 부모컴포넌트 -> 자식컴포넌트 순서로 수행되므로, 취소 모달을 띄우기전에 오버레이 화면을 먼저 체크해야 함
      if (isGoBack.value && refStoreCreateOrder.value?.isShowOverlayView) {
        refStoreCreateOrder.value?.closeOverlayView();
        next(false);
        return;
      }

      const isWritten = refStoreCreateOrder.value?.getIsWritten ?
        refStoreCreateOrder.value?.getIsWritten() :
        false;

      if (isWritten && refStoreCreateOrder.value?.isOrderWrittenCancel && !isCancelConfirm) {
        isCancelModal.value = true;

        if (isGoForward.value) {
          toRoute.value = to;
        }

        next(false);
        return;
      }

      next();
    });

    return {
      isCancelModal,
      closeModal,
      cancelModal,
      refStoreCreateOrder,
    };
  },
});
</script>

<style lang="scss" scoped>
@import '@/styles/common/form.scss';
@import '@/styles/common/button.scss';
@import '@/styles/layout/main.scss';
</style>
