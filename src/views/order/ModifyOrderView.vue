<template>
  <VMain>
    <div class="content">
      <VRow no-gutters>
        <VCol>
          <StoreModifyOrder
            ref="refModifyOrderComponent"
          />
        </VCol>
      </VRow>
    </div>

    <StoreDiscardChangesModal
      v-if="isCancelModal"
      @cancel="cancelModal"
      @confirm="confirmDiscard"
    />
  </VMain>
</template>

<script>
import { defineComponent, ref, computed } from 'vue';
import { onBeforeRouteLeave, useRouter, useRoute } from 'vue-router';

import StoreModifyOrder from '@/components/order/modify/StoreModifyOrder.vue';
import StoreDiscardChangesModal from '@/components/order/modify/StoreDiscardChangesModal.vue';

export default defineComponent({
  name: 'ModifyOrderView',
  components: {
    StoreModifyOrder,
    StoreDiscardChangesModal,
  },
  setup() {
    const router = useRouter();
    const route = useRoute();
    const refModifyOrderComponent = ref(null);
    const toRoute = ref();

    const isCancelModal = ref(false);
    let isCancelConfirm = false;

    const confirmDiscard = () => {
      isCancelModal.value = false;
      isCancelConfirm = true;

      if (toRoute.value) {
        const { name, params, hash, query } = toRoute.value;
        router.push({ name, params, hash, query });
        return;
      }

      router.back();
    };

    const cancelModal = () => {
      isCancelModal.value = false;
    };

    const isGoBack = computed(() =>
      String(router.options.history.state.forward).localeCompare(route.path) === 0);

    const isGoForward = computed(() =>
      String(router.options.history.state.current).localeCompare(route.path) === 0);

    // 주문서 수정 화면에서 뒤로가기 할 경우 수정된 내용이 있을 때는 작성취소 모달 표시
    onBeforeRouteLeave((to, from, next) => {
      // NOTE: onBeforeRouteLeave 의 경우, 부모컴포넌트 -> 자식컴포넌트 순서로 수행되므로, 취소 모달을 띄우기전에 오버레이 화면을 먼저 체크해야 함
      if (isGoBack.value && refModifyOrderComponent.value?.isShowOverlayView) {
        refModifyOrderComponent.value?.closeOverlayView();
        next(false);
        return;
      }

      if (!to.params?.action &&
        !isCancelModal.value &&
        refModifyOrderComponent.value.edited &&
        !refModifyOrderComponent.value.modifyConfirmed &&
        !isCancelConfirm) {
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
      refModifyOrderComponent,
      confirmDiscard,
      cancelModal,
    };
  },
});
</script>

<style lang="scss" scoped>
@import '@/styles/common/form.scss';
@import '@/styles/common/button.scss';
@import '@/styles/layout/main.scss';
</style>
