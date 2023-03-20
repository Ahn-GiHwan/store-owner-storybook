<template>
  <VMain>
    <VSheet class="logout-content">
      <!-- 헤더. 상점 이름과 닫기 버튼 -->
      <VToolbar color="white">
        <div class="content-header-wrapper">
          <div class="content-header">
            <VRow class="align-center text-center py-1" no-gutters>
              <VCol cols="2">
                <VSpacer />
              </VCol>
              <VCol>
                <VAppBarTitle>
                  {{ storeName }}
                </VAppBarTitle>
              </VCol>
              <VCol cols="2">
                <VBtn class="close-button" icon @click="closeNavigationDrawer">
                  <VIcon icon="mdi-close"></VIcon>
                </VBtn>
              </VCol>
            </VRow>
          </div>
        </div>
      </VToolbar>
      <VDivider></VDivider>
      <VContainer class="content pa-0 ma-0">
        <!-- 배너 영역 -->
        <VRow no-gutters>
          <VCol>
            <VBtn block height="80px" @click.stop="handleClickBanner">
              <img
                :srcset="
                  `${currentBanner.bannerSet[0]} 1x, ` +
                  `${currentBanner.bannerSet[1]} 2x, ` +
                  `${currentBanner.bannerSet[2]} 3x`
                "
                alt="배너" />
            </VBtn>
          </VCol>
        </VRow>
        <div v-if="!isLoading && activeDeliveryAgencyStore && storeDeposit && deliveryCondition">
          <VRow class="mt-6 ma-0" v-if="!deliveryCondition?.error?.errorCode">
            <!-- 예치금 표기 -->
            <VCol class="pa-0 px-4 text-left align-center d-flex">
              <div class="font-size-24 d-inline-flex">
                {{ numberWithCommas(storeDeposit.deposit) }} {{ $t('common.currency')}}
              </div>
              <VBtn icon class="d-inline-flex" @click.once="refreshDeliveryAgencyStore">
                <VIcon icon="mdi-sync"/>
              </VBtn>
            </VCol>
          </VRow>
          <!-- 배달대행사 아이콘, 이름 -->
          <VRow no-gutters class="my-2 mx-2 d-flex justify-space-between">
            <VCol
              class="rounded text-left d-inline-flex justify-start align-center px-2 py-2"
              :class="!deliveryCondition.isDeliveryPossible ? 'delivery-disabled': ''"
            >
              <!-- 배대사 아이콘 -->
              <DeliveryAgencyIcon
                class="delivery-agency-icon"
                :deliveryAgencyId="activeDeliveryAgencyStore.deliveryAgencyId"
              />
              <!-- 배대사 이름 -->
              <span class="ml-2 font-size-16 font-weight-400">
                {{ $t(`common.deliveryAgency.${activeDeliveryAgencyStore.deliveryAgencyId}`)}}
              </span>
              <!-- 배달 중단이 되었을 때 중단 표기 -->
              <span
                v-if="!deliveryCondition.isDeliveryPossible"
                class="ml-2 font-size-14 s-color-red-e5"
              >
                {{ $t('views.navigationMenu.deliveryDisabled') }}
              </span>
              <!-- 배달대행사 정보 불러오기에 실패한 경우 오류 표기 -->
              <span
                v-else-if="deliveryCondition?.error?.errorCode"
                class="ml-2 font-size-14 s-color-red-e5"
              >
                {{ $t('views.navigationMenu.deliveryConditionReadError') }}
              </span>
            </VCol>
            <!-- 배달대행사 정보 불러오기 실패. 새로고침 버튼 -->
            <VCol v-if="deliveryCondition?.error?.errorCode" class="text-right">
              <span>
                {{ $t('views.navigationMenu.failedToReadDeliveryCondition') }}
              </span>
              <VBtn icon @click.once="refreshDeliveryAgencyStore">
                <VIcon icon="mdi-sync"></VIcon>
              </VBtn>
            </VCol>
          </VRow>
          <!-- 할증, 지연 정보 -->
          <VRow
            no-gutters
            class="mt-2 px-4 d-flex justify-start align-center"
            style="gap:0.4rem"
            v-if="
              deliveryCondition &&
              deliveryCondition.isDeliveryPossible &&
              !deliveryCondition.error?.errorCode"
          >
            <!-- 지연 정보 -->
            <VCol
              cols="6"
              class="rounded"
              :class="deliveryCondition.delayTime > 0 ? 'abnormal-info' : 'normal-info'"
            >
              <VRow class="ma-0 pa-0 flex-column">
                <VCol
                  v-if="deliveryCondition.delayTime > 0"
                  class="ml-2 mt-2 mb-1 pa-0 font-size-14 font-weight-400 s-color-red-e5 text-left"
                >
                  {{ $t('views.navigationMenu.delayed') }}
                </VCol>
                <VCol v-else
                  class="ml-2 mt-2 mb-1 pa-0 font-size-14 font-weight-400 s-color-gray-61 text-left"
                >
                  {{ $t('views.navigationMenu.pickupTime') }}
                </VCol>
                <VCol
                  class="ma-2 mt-0 pa-0 font-size-14 font-weight-700 text-left"
                  :class="deliveryCondition.delayTime > 0 ? 's-color-red-e5' : ''">
                  {{
                    numberWithCommas(pickupMinute)
                  }}
                  {{
                    $t('common.dateTime.minute')
                  }}
                </VCol>
              </VRow>
            </VCol>
            <!-- 할증 정보 -->
            <VCol
              class="normal-info rounded"
            >
              <VRow class="ma-0 pa-0 flex-column">
                <VCol class="ma-2 mb-0 pa-0 font-size-14 text-left s-color-gray-61">
                  {{ $t('views.navigationMenu.extraCharge') }}
                </VCol>
                <VCol class="ma-2 mt-1 pa-0 font-size-14 s-color-gray-61 font-weight-700 text-left">
                  {{ extraChargesStr }}
                </VCol>
              </VRow>
            </VCol>
          </VRow>
        </div>
        <div v-else-if="isLoading">
          <VProgressCircular
            class="my-15"
            indeterminate
            size="64"
            color="primary">
          </VProgressCircular>
        </div>
        <div>
          <!-- 네비게이션 메뉴 영역 -->
          <VRow no-gutters class="px-4 mt-8 mb-5">
            <VCol class="font-size-12 font-weight-700 s-color-gray-bd text-left">
              배달
            </VCol>
          </VRow>
          <!-- 실제 메뉴 -->
          <VRow
            no-gutters
            class="px-4 d-flex"
            :class="
              mobile? 'flex-nowrap flex-column' : 'flex-wrap justify-space-between'"
          >
            <VCol
              class="px-0 navigation-menu d-flex justify-space-between align-center"
              :class="mobile? '' : 'navigation-menu-tablet'"
              v-for="(menu) in navigationMenus"
              :key="menu.routeName"
              @click.stop="moveTo(menu.routeName)"
            >
            <span class="py-5 font-size-14 font-weight-400">
              {{ menu.title }}
            </span>
            <VIcon
              :icon="menu.appendIcon"
            />
            </VCol>
          </VRow>
        </div>
      </VContainer>
      <!-- 로그아웃 버튼 -->
      <StoreContentBottom class="mb-6">
        <VRow no-gutters class="flex-column logout-bottom">
          <VCol class="d-flex justify-space-between mb-4">
            <span class="font-size-12">{{ deliveryAgencyContact }}</span>
            <span class="font-size-12">{{ $t('common.version') }} {{ version }}</span>
          </VCol>
          <VCol>
            <StoreButton
              block
              variant="outlined"
              :color="gray3Color"
              @click.stop.once="logOut"
              class="text-center"
            >
              <span class="s-color-red-e5 font-size-14 font-weight-700">
                {{ $t('views.navigationMenu.logOut') }}
              </span>
            </StoreButton>
          </VCol>
        </VRow>
      </StoreContentBottom>
    </VSheet>
  </VMain>
</template>

<script setup name="StoreNavigationDrawer">

import { computed } from 'vue';
import { useLocale, useDisplay } from 'vuetify';
import { useRouter } from 'vue-router';

import { useAuthStore, useCommonStore } from '@/stores';

import { numberWithCommas } from '@/utils/stringUtils';
import {
  getActiveDeliveryAgencyStore,
} from '@/utils/storeUtils';

import { EXTRA_CHARGE_DATA_TYPE } from '@/constants';

import StoreContentBottom from '@/components/common/StoreContentBottom.vue';
import StoreButton from '@/components/common/StoreButton.vue';
import DeliveryAgencyIcon from '@/components/common/DeliveryAgencyIcon.vue';

import {
  gray3Color,
} from '@/styles/_export.module.scss';

import dndnStore from '@/assets/images/navigation/dndn_store.png';
import dndnStore2x from '@/assets/images/navigation/dndn_store@2x.png';
import dndnStore3x from '@/assets/images/navigation/dndn_store@3x.png';

const auth = useAuthStore();
const common = useCommonStore();
const router = useRouter();
const { mobile } = useDisplay();
const { t } = useLocale();

const props = defineProps({
  storeName: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(['close-navigation-drawer']);

const currentBanner = computed(() => ({
  url: 'https://bit.ly/dndnstore',
  bannerSet: [
    dndnStore,
    dndnStore2x,
    dndnStore3x,
  ],
}));

const navigationMenus = computed(() => [
  // 주문서 작성
  {
    routeName: 'CreateOrder',
    title: t('views.navigationMenu.createOrder'),
    prependIcon: '',
    appendIcon: 'mdi-chevron-right',
  },
  // 배달 현황
  {
    routeName: 'Main',
    title: t('views.navigationMenu.deliveryList'),
    prependIcon: '',
    appendIcon: 'mdi-chevron-right',
  },
  // 완료
  {
    routeName: 'CompletedOrder',
    title: t('views.navigationMenu.completedOrders'),
    prependIcon: '',
    appendIcon: 'mdi-chevron-right',
  },
]);

const storeName = computed(() => props.storeName);
const activeDeliveryAgencyStore = computed(() =>
  getActiveDeliveryAgencyStore(auth.currentStore.deliveryAgencyStores));

const deliveryCondition = computed(() => auth.currentDeliveryCondition);
const storeDeposit = computed(() => auth.currentStoreDeposit);
const pickupMinute = computed(() => auth.currentPickupMinute);
const isLoading = computed(() => auth.isLoadingDeliveryAgencyStores);

const extraChargesStr = computed(() => {
  let result = '';

  let fixed = 0;
  let rate = 0;

  if (auth.currentDeliveryCondition) {
    const condition = auth.currentDeliveryCondition;

    condition.extraCharges.forEach((charge) => {
      if (charge.dataType === EXTRA_CHARGE_DATA_TYPE.FIXED) {
        fixed += charge.charge;
      } else if (charge.dataType === EXTRA_CHARGE_DATA_TYPE.RATE) {
        rate += charge.charge;
      }
    });

    if (fixed) {
      result += `, ${numberWithCommas(fixed)} ${t('common.currency')}`;
    }
    if (rate) {
      result += `, ${numberWithCommas(rate)} %`;
    }
  }
  if (result.length > 0) {
    return result.slice(2, result.length);
  }
  return '-';
});

const refreshDeliveryAgencyStore = () => {
  auth.refreshDeliveryAgencyStores()
    .catch(() => {
      common.showToast('error', t('views.navigationMenu.errors.failedToRefreshDeliveryAgencyStore'));
    })
    .finally(() => {
      // 불러오기 후 배달대행사 정보 불러오기에 실패했다는 오류코드를 받은 경우
      if (auth.currentDeliveryCondition && auth.currentDeliveryCondition.error?.errorCode) {
        common.showToast('error', t('views.navigationMenu.errors.failedToRefreshDeliveryAgencyStore'));
      }
    });
};

const closeNavigationDrawer = () => {
  emit('close-navigation-drawer');
};

const handleClickBanner = () => {
  if (currentBanner.value) {
    window.open(currentBanner.value.url, '_blank');
  }
};

const moveTo = (routeName) => {
  closeNavigationDrawer();
  router.push({
    name: routeName,
  });
};

const logOut = async () => {
  // 로그아웃 시도
  try {
    await auth.logoutUser();

    router.push({
      name: 'Login',
    });
  } catch (err) {
    common.showToast('error', t('views.navigationMenu.errors.failedToLogout'));
  }
};

// eslint-disable-next-line no-undef
const version = __APP_VERSION__;

// 고객센터 전화번호
const deliveryAgencyContact = computed(() => (common.deliveryContactTelNumber));

</script>

<style lang="scss" scoped>
.content-header-wrapper {
  width: 100vw;
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-around;
}
.delivery-agency-icon {
  width: 1.6rem;
  height: 1.6rem;
}
.delivery-disabled {
  background-color: $color-pink-e53;
  border: 1px solid $color-red-e5;
}
.content-header {
  width: $breakpoint-tablet;
}
.content {
  max-width: $breakpoint-tablet;
  background: white;
}

.close-button {
  position: relative;
  left: 0px;
  top: 0px;
}

.abnormal-info {
  background-color: $color-pink-e53;
  height: 6rem;
}

.normal-info {
  background-color: $color-gray-f5;
  height: 6rem;
}

.navigation-menu-wrapper {
  height: 11.2rem;
}
.navigation-menu {
  height: 6rem;
}
.navigation-menu-tablet {
  min-width: 208px;
  max-width: 208px;
}

.logout-content {
  width: 100vw;
  padding-bottom: 3rem;
}

.logout-bottom {
  max-width: 460px;
  color: #666666;
}
</style>
