<template>
  <header id="header">
    <!-- 좌측 네비게이션 메뉴 -->
    <VNavigationDrawer
      v-if="currentStore"
      v-model="isShowNavigationDrawer"
      width="100vw"
    >
      <StoreNavigationDrawer
        v-if="currentStore"
        :storeName="currentStore.name"
        @close-navigation-drawer="handleCloseNavigationDrawer"
      />
    </VNavigationDrawer>

    <div class="header">
      <VToolbar color="white">
        <VRow class="align-center text-center" no-gutters>
          <VCol cols="2" class="text-left">
            <template v-if="currentRouteName !== 'Certification'">
              <VAppBarNavIcon
                v-if="currentRouteName === 'Main'"
                @click="isShowNavigationDrawer = true">
              </VAppBarNavIcon>
              <VBtn v-else dark icon @click="backBtn">
                <VIcon icon="mdi-arrow-left"></VIcon>
              </VBtn>
            </template>
          </VCol>
          <VCol cols="8">
            <VAppBarTitle>
              {{ title }}
              <template v-if="currentRouteName === 'OrderDetail'">
                {{ orderId }}
                <OrderNumberTooltip />
              </template>
            </VAppBarTitle>
          </VCol>
          <VCol cols="2">
            <VSpacer />
          </VCol>
        </VRow>
      </VToolbar>
      <StoreDeliveryStatusTabs v-if="currentRouteName === 'Main'" />
    </div>
    <VDivider />
  </header>
</template>

<script setup name="StoreHeader">

import { useRouter, useRoute, onBeforeRouteLeave } from 'vue-router';
import { ref, computed } from 'vue';
import { useAuthStore } from '@/stores';

import StoreNavigationDrawer from '@/components/layout/StoreNavigationDrawer.vue';
import StoreDeliveryStatusTabs from '@/components/layout/StoreDeliveryStatusTabs.vue';
import OrderNumberTooltip from '@/components/order/detail/OrderNumberTooltip.vue';

const router = useRouter();
const route = useRoute();
const auth = useAuthStore();

const props = defineProps({
  title: {
    type: String,
    default: '배달 현황',
  },
});

const isShowNavigationDrawer = ref(false);

const title = computed(() => props.title);
const currentRouteName = computed(() => router?.currentRoute?.value.name);
const currentStore = computed(() => auth.currentStore);
const orderId = computed(() => Number(route.params.orderId));

const backBtn = () => {
  // NOTE: 주소 입력으로 페이지 접근 시 히스토리가 쌓이지 않아, Main 페이지로 이동하도록 처리
  if (!router.options.history.state.back) {
    router.push({ name: 'Main' });
    return;
  }

  router.back();
};

const handleCloseNavigationDrawer = () => {
  isShowNavigationDrawer.value = false;
};

const isGoBack = computed(() =>
  String(router.options.history.state.forward).localeCompare(route.path) === 0);

const isShowOverlayView = computed(() => isShowNavigationDrawer.value);
const closeOverlayView = () => { isShowNavigationDrawer.value = false; };

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
.header {
  max-width: $breakpoint-tablet;
}

:deep(.v-btn--active > .v-btn__overlay) {
  opacity: 0;
}

:deep(.v-btn--active:hover > .v-btn__overlay) {
  opacity: 0;
}

:deep(.v-navigation-drawer) {
  width: 100vw;
}
</style>
