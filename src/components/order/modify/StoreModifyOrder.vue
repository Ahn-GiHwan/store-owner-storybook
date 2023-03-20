<template>
  <VForm v-if="originalOrder" ref="formValid">
    <VRow no-gutters class="d-flex flex-column ma-4">
      <VCol class="mt-2 d-flex align-center">
        <span class="font-size-16 font-weight-bold">{{ $t('views.createOrder.orderInfo') }}</span>
      </VCol>
      <!-- 전화번호 입력 -->
      <VCol class="mt-4">
        <StoreTextField
          name="ordererPhone"
          v-model="form.ordererPhone"
          :title="$t('views.createOrder.inputField.ordererPhone.title')"
          :label="$t('views.createOrder.inputField.ordererPhone.label')"
          :placeholder="$t('views.createOrder.inputField.ordererPhone.placeholder')"
          variant="outlined"
          type="tel"
          :dark="true"
          :rules="telRules"
          maxlength="13"
          clearable
          @click:clear="form.ordererPhone = ''"
          @input="inputHandlerOrdererPhone"
          required
        />
      </VCol>
      <!-- 주소 입력 -->
      <VCol class="mt-4">
        <template v-if="!form.dropRoadAddress && !form.dropJibunAddress">
          <StoreTextField
            name="dropAddress"
            v-model="form.dropRoadAddress"
            :title="$t('views.createOrder.inputField.dropAddress.title')"
            :label="$t('views.createOrder.inputField.dropAddress.label')"
            variant="outlined"
            :dark="true"
            @focusin="openAddressLayer"
            required
          />
        </template>
        <template v-else>
          <p class="mb-2 text-black">
            {{ $t('views.createOrder.inputField.dropAddress.title') }}
          </p>
          <div class="address d-flex justify-space-between">
            <VRow no-gutters class="">
              <VCol class="d-inline" cols="10">
                <div @click="openAddressLayer">
                  {{ form.dropRoadAddress }}
                </div>
                <div class="mt-1" @click="openAddressLayer">
                  <VChip
                    rounded="2"
                    :color="gray6Color"
                    size="x-small"
                    label
                    variant="outlined"
                    close
                  >
                    {{ $t('views.modifyOrder.inputField.dropAddress.jibunName') }}
                  </VChip>
                  <span class="ml-1 font-size-12"> {{ form.dropJibunAddress }}</span>
                </div>
              </VCol>
              <VCol cols="2" class="icon">
                <div class="icon-map" @click="showDropMapLayer = true">
                  <VIcon class="mt-2" icon="mdi-map-marker"></VIcon>
                </div>
              </VCol>
            </VRow>
          </div>
        </template>
      </VCol>
      <!-- 상세주소 입력 -->
      <VCol class="mt-4">
        <StoreTextField
          name="dropAddressDetail"
          v-model="form.dropAddressDetail"
          :title="$t('views.createOrder.inputField.dropAddressDetail.title')"
          :placeholder="$t('views.createOrder.inputField.dropAddressDetail.placeholder')"
          variant="outlined"
          :dark="true"
          required
      /></VCol>
      <!-- 메뉴 금액 정보 표기 및 금액 수정 -->
      <VCol class="mt-4 pt-1 pb-2 amount">
        <VRow no-gutters class="px-3 amount">
          <VCol class="text-left">
            <VRow no-gutters>
              <VCol class="mt-1 font-size-12 s-color-gray-66">
                {{ $t('views.createOrder.inputField.actualPayPrice.title') }}
              </VCol>
            </VRow>
            <VRow no-gutters>
              <VCol class="font-size-14 s-color-gray-66">
                {{
                  numberWithCommas(form.totalPayPrice) || 0
                }} {{ $t('common.currency') }}
              </VCol>
            </VRow>
          </VCol>
          <VCol cols="2" class="text-right">
            <!-- 금액 수정 버튼 -->
            <StoreButton
              class="pa-2 font-weight-700"
              variant="text"
              :color="primaryColor"
              @click="
                form.orderType === 'STORE_ORDER'
                  ? (showModifyPayment = true)
                  : (showModifyPostPayment = true)
              "
            >
              <span class="text-decoration-underline">{{
                $t('views.modifyOrder.inputField.actualPayPrice.modifyPrice')
              }}</span>
            </StoreButton>
          </VCol>
        </VRow>
        <div v-if="form.actualPayPrice > 0">
          <VDivider class="mx-3 mb-2"></VDivider>
          <!-- 결제방법 표기 -->
          <VRow no-gutters class="px-3 mt-1">
            <VCol cols="6" class="text-left font-size-12 s-color-gray-66">
              {{ $t('views.modifyOrder.paymentAdditionalInfo.paymentMethod') }}
            </VCol>
            <VCol cols="6" class="text-right font-size-12 s-color-gray-66">
              <!-- 후불결제인 경우 후불결제 : 라고 표기하면서 결제방식을 표기합니다. -->
              <span
                class="text-right font-size-12 s-color-gray-66"
                v-show="paymentMethod === 'CARD' || paymentMethod === 'CASH'"
              >
                {{ `${$t('views.modifyOrder.paymentAdditionalInfo.postPaid')}: ` }}
              </span>
              <!-- 결제 방법을 표기합니다. -->
              {{ $t(`views.modifyOrder.paymentAdditionalInfo.${paymentMethod}`) }}
              <!-- 복합결제 인 경우 괄호를 쳐서 안에 세부적인 결제방법을 표기합니다. -->
              <span
                class="text-right font-size-12 s-color-gray-66"
                v-show="paymentMethod === 'MIXED_PAYMENT'"
              >
                ({{ paymentMethodsString }})
              </span>
            </VCol>
          </VRow>
        </div>
        <!-- 선결제 금액 표기 -->
        <VRow v-if="form.prepaidPrice > 0" no-gutters class="px-3 mt-1">
          <VCol cols="6" class="text-left font-size-12 s-color-gray-66">
            {{ $t('views.modifyOrder.paymentAdditionalInfo.prepaidPrice') }}
          </VCol>
          <VCol cols="6" class="text-right font-size-12 s-color-gray-66">
            {{ numberWithCommas(form.prepaidPrice) }} {{ $t('common.currency') }}
          </VCol>
        </VRow>
        <!-- 후불결제 금액 표기 -->
        <VRow
          no-gutters
          class="px-3 mt-1"
          v-show="form.paymentCardPrice + form.paymentCashPrice > 0"
        >
          <VCol cols="6" class="text-left font-size-12 s-color-gray-66">
            {{ $t('views.modifyOrder.paymentAdditionalInfo.postpaidPrice') }}
          </VCol>
          <VCol cols="6" class="text-right font-size-12 s-color-gray-66">
            {{ numberWithCommas(
                (form.paymentCardPrice + form.paymentCashPrice))
            }} {{ $t('common.currency') }}
          </VCol>
        </VRow>
        <!-- 배달팁 표기 -->
        <VRow v-if="hasDeliveryTips" no-gutters class="px-3 mt-1">
          <VCol cols="6" class="text-left font-size-12 s-color-gray-66">
            {{ $t('views.modifyOrder.paymentAdditionalInfo.deliveryTip') }}
          </VCol>
          <VCol cols="6" class="text-right font-size-12 s-color-gray-66">
            {{ deliveryTipPrices }} {{ $t('common.currency') }}
          </VCol>
        </VRow>
        <!-- 할인금액 표기 -->
        <VRow v-if="hasDiscount" no-gutters class="px-3 mt-1">
          <VCol cols="6" class="text-left font-size-12 s-color-gray-66">
            {{ $t('views.modifyOrder.paymentAdditionalInfo.discountPrice') }}
          </VCol>
          <VCol cols="6" class="text-right font-size-12 s-color-gray-66">
            - {{ numberWithCommas(discountPrice) }} {{ $t('common.currency') }}
          </VCol>
        </VRow>
        <!-- 1회용품 보증금 표기 -->
        <VRow v-if="hasTaxFreePayPrice" no-gutters class="px-3 mt-1">
          <VCol cols="6" class="text-left font-size-12 s-color-gray-66">
            {{ $t('views.modifyOrder.paymentAdditionalInfo.taxFreePayPrice') }}
          </VCol>
          <VCol cols="6" class="text-right font-size-12 s-color-gray-66">
            {{ $t('views.modifyOrder.paymentAdditionalInfo.taxFreePriceIncludePostPayPrice', {
                taxFreePrice:
                  `${numberWithCommas(taxFreePayPrice)} ${$t('common.currency')}`
              })
            }}
          </VCol>
        </VRow>
      </VCol>
      <div v-if="form.actualPayPrice === 0" class="pt-2 text-right">
        <span class="s-color-red-e5">{{
          $t('views.createOrder.inputField.totalPrice.freeProductMessage')
        }}</span>
      </div>
      <!-- 총 결제금액 표기 -->
      <VCol class="mt-4">
        <VRow no-gutters class="pa-4 amount">
          <VCol cols="5" class="text-left"
            >{{ $t('views.createOrder.inputField.totalPrice.title') }}
          </VCol>
          <VCol class="text-right">
            {{ numberWithCommas(form.actualPayPrice) }} {{ $t('common.currency') }}
          </VCol>
        </VRow>
      </VCol>
      <!-- 메모 입력 -->
      <VCol class="mt-4" cols="12">
        <p class="mb-2">{{ $t('views.createOrder.inputField.storeOrderMemo.title') }}</p>
        <VTextarea
          name="storeOrderMemo"
          v-model="form.storeOrderMemo"
          :label="$t('views.createOrder.inputField.storeOrderMemo.label')"
          :placeholder="$t('views.createOrder.inputField.storeOrderMemo.placeholder')"
          variant="outlined"
          single-line
          hide-details="auto"
          auto-grow
          color="primary"
          rows="1"
          row-height="25"
        >
          <template v-slot:append>
            <VBtn @click="openRequestMemoModal" height="56" class="pa-0" variant="tonal">
              {{ $t('views.createOrder.inputField.storeOrderMemo.appendButton') }}
            </VBtn>
          </template>
        </VTextarea>
      </VCol>
    </VRow>
    <div class="horizontal"></div>
    <!-- 배달 정보 영역 타이틀 -->
    <VRow no-gutters class="d-flex flex-column ma-4">
      <VCol class="mt-4">
        <div class="d-flex justify-space-between align-center">
          <span class="font-size-16 font-weight-bold"
            >{{ $t('views.createOrder.deliveryInfo') }}
          </span>
          <span>
            <VCheckbox
              v-model="form.isUntact"
              :label="$t('views.createOrder.inputField.isUntact.label')"
              color="primary"
              hide-details
            ></VCheckbox
          ></span>
        </div>
      </VCol>
      <!-- 상품 준비시간 선택 -->
      <VCol v-if="showPickupWishAt" class="mt-4">
        <StoreTextField
          name="productPrepareTime"
          v-model="productPrepareTimeStr"
          :title="$t('views.modifyOrder.inputField.productPrepareTime.title')"
          variant="outlined"
          :dark="true"
          maxlength="30"
          append-inner-icon="mdi-menu-down"
          :disabled="!canChangePickupWishAt"
          @click.stop="canChangePickupWishAt ? showProductPrepareBottom = true : ''"
          readonly
          required
      /></VCol>
      <!-- 고객 도착시간 선택 -->
      <VCol v-if="showStoreDropExpectedAt" class="mt-4">
        <StoreTextField
          name="storeDropExpectedAt"
          v-model="storeDropExpectedAtStr"
          :title="$t('views.modifyOrder.inputField.storeDropExpectedAt.title')"
          variant="outlined"
          :dark="true"
          maxlength="30"
          append-inner-icon="mdi-menu-down"
          :disabled="!canChangeStoreDropExpectedAt"
          @click.stop="canChangeStoreDropExpectedAt? showStoreDropExpectedBottom = true : ''"
          readonly
          required
      /></VCol>
      <VCol v-if="loading || deliveryPossibleInfo" class="mt-4">
        <div v-if="loading" class="text-center">
          <VProgressCircular indeterminate color="primary"></VProgressCircular>
        </div>
        <div v-else>
          <div v-if="isPossibleDelivery">
            <StorePickupExpected :deliveryInfo="deliveryPossibleInfo" />
            <StoreOrderDeliveryInfo :deliveryInfo="deliveryPossibleInfo" class="mt-2"/>
          </div>
          <div v-else class="text-right">
            <span class="s-color-red-e5 font-size-12">
              <VIcon icon="mdi-information-outline" />
              {{ $t(`common.deliveryPossibleReason.${deliveryPossibleInfo.reason}`,
                  $t('common.deliveryPossibleReason.UNKNOWN_SERVER_ERROR'))}}
            </span>
          </div>
        </div>
      </VCol>
      <VCol class="mt-4">
        <VRow no-gutters>
          <VCol class="pr-2">
            <StoreButton
              block
              @click.stop="
                needRequestDelivery ?
                  submitForm(DELIVERY_TYPE.SELF) : cancelModify()"
              variant="outlined"
            >
              <span class="s-color-primary">
                <template v-if="needRequestDelivery">
                {{ $t('views.modifyOrder.selfDelivery') }}
                </template>
                <template v-else>
                  {{ $t('views.modifyOrder.cancel') }}
                </template>
              </span>
            </StoreButton>
          </VCol>
          <VCol class="pl-2">
            <StoreButton
              block
              @click.stop="!isDisabled && submitForm(DELIVERY_TYPE.AGENCY)"
              :disabled="!isPossibleDelivery || isDisabled || loading"
            >
              <template v-if="needRequestDelivery">
                {{ $t('views.modifyOrder.requestDelivery') }}
              </template>
              <template v-else>
                {{ $t('views.modifyOrder.confirmModify') }}
              </template>
            </StoreButton>
          </VCol>
        </VRow>
      </VCol>
    </VRow>
  </VForm>

  <!--주소검색 레이어-->
  <StoreAddressLayer
    :dialog="showAddressLayer"
    @set-data="closeAndSettingAddress"
    @close-layer="closeLayer"
  ></StoreAddressLayer>

  <!--목적지 맵 레이어-->
  <StoreDropAddressMapLayer
    v-if="form.dropJibunAddress"
    :dialog="showDropMapLayer"
    :drop-address="form.dropRoadAddress"
    :jibun-address="form.dropJibunAddress"
    :location="location"
    @close-layer="closeLayer"
  />

  <!--후불결제 금액 수정 레이어-->
  <StoreModifyPostPayment
    :dialog="showModifyPostPayment"
    :actualPayPrice="form.actualPayPrice"
    :paymentCardPrice="form.paymentCardPrice"
    :paymentCashPrice="form.paymentCashPrice"
    :prepaidPrice="form.prepaidPrice"
    :deliveryTipPrice="deliveryTipPrices"
    :taxFreePayPrice="form.taxFreePayPrice"
    :orderProducts="form.orderProducts"
    @set-data="onDataSetAndclose"
    @close-layer="closeLayer"
  ></StoreModifyPostPayment>

  <!-- STORE_ORDER 용 금액 수정 레이어 -->
  <StoreModifyPayment
    :dialog="showModifyPayment"
    :totalPayPrice="form.totalPayPrice"
    :actualPayPrice="form.actualPayPrice"
    :paymentCardPrice="form.paymentCardPrice"
    :paymentCashPrice="form.paymentCashPrice"
    :prepaidPrice="form.prepaidPrice"
    :deliveryTipPrice="deliveryTipPrices"
    :taxFreePayPrice="form.taxFreePayPrice"
    :orderProducts="form.orderProducts"
    @set-data="onDataSetAndclose"
    @close-layer="closeLayer"
  ></StoreModifyPayment>

  <!--요청사항 바텀시트-->
  <StoreRequestMemoBottomSheet
    v-if="storeMemos"
    v-model:visible="showRequestMemoBottom"
    :storeMemos="storeMemos"
    @set-data="onDataSetAndclose"
    @close-layer="closeLayer"
  />

  <!--상품준비시간 바텀시트-->
  <StoreProductPrepareBottomSheet
    v-model:visible="showProductPrepareBottom"
    :title="$t('views.modifyOrder.inputField.productPrepareTime.title')"
    :description="$t('views.modifyOrder.inputField.productPrepareTime.description')"
    :dataType="'PREPARE'"
    :times="prepareTimes"
    :selectedTime="form.productPrepareTime"
    @set-data="onDataSetAndclose"
    @close-layer="closeLayer"
  />

  <!--고객 도착시간 바텀시트-->
  <StoreProductPrepareBottomSheet
    v-model:visible="showStoreDropExpectedBottom"
    :title="$t('views.modifyOrder.inputField.storeDropExpectedAt.title')"
    :description="$t('views.modifyOrder.inputField.storeDropExpectedAt.description')"
    :dataType="'DROP_EXPECTED_AT'"
    :times="dropExpectedTimes"
    :selectedTime="form.dropExpectedTime"
    @set-data="onDataSetAndclose"
    @close-layer="closeLayer"
  />
</template>

<script setup name="StoreModifyOrder">
/* eslint-disable no-use-before-define */
import { ref, reactive, watch, onBeforeMount, computed, onBeforeUnmount } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import _ from 'lodash';
import { useLocale } from 'vuetify';
import * as Sentry from '@sentry/vue';
import logger from '@/plugins/vueLogger';

import {
  useAuthStore,
  useOrderStore,
  useOrderDetailStore,
  useCommonStore,
  useDeliveryStore,
  useErrorsStore,
} from '@/stores';

import Rules from '@/utils/validationRules';

import {
  numberWithCommas,
  addHyphenPhoneNumber,
  stringToNumber,
  removeNonNumeric,
} from '@/utils/stringUtils';

import {
  diffMinutes,
  oneMinute,
} from '@/utils/dateUtils';

import { ORDER_STATUS, ORDER_TYPE, DELIVERY_TYPE, DELIVERY_STATUS, CUSTOM_DSM_TYPE } from '@/constants';

import {
  hasDeliveryTip,
  deliveryTipPrice,
  getPaymentMethod,
  getMainDelivery,
  hasAfterAllocated,
  isOrderProductsEquals,
} from '@/utils/orderUtils';

import {
  isFailedDelivery,
} from '@/utils/deliveryUtils';

import StoreButton from '@/components/common/StoreButton.vue';
import StoreTextField from '@/components/common/StoreTextField.vue';
import StoreOrderDeliveryInfo from '@/components/order/common/StoreOrderDeliveryInfo.vue';
import StoreRequestMemoBottomSheet from '@/components/order/common/StoreRequestMemoBottomSheet.vue';
import StoreProductPrepareBottomSheet from '@/components/order/common/StoreProductPrepareBottomSheet.vue';
import StoreDropAddressMapLayer from '@/components/order/common/StoreDropAddressMapLayer.vue';
import StoreAddressLayer from '@/components/order/common/StoreAddressLayer.vue';
import StoreModifyPostPayment from '@/components/order/modify/StoreModifyPostPayment.vue';
import StoreModifyPayment from '@/components/order/modify/StoreModifyPayment.vue';
import StorePickupExpected from '@/components/order/common/StorePickupExpected.vue';

import {
  primaryColor,
  gray6Color,
} from '@/styles/_export.module.scss';

const NO_CHANGES = -1;

const { t } = useLocale();
const router = useRouter();
const route = useRoute();

const auth = useAuthStore();
const orders = useOrderStore();
const orderDetail = useOrderDetailStore();

const delivery = useDeliveryStore();
const common = useCommonStore();
const errors = useErrorsStore();

const { telRules } = Rules;

const form = reactive({
  // 주문 기본 정보
  orderId: 0,
  orderAgencyId: '',
  orderAgencyOrderId: '',
  orderType: '',
  status: '',
  // 주문자 정보
  ordererName: '',
  ordererPhone: '',
  // 수령자 정보
  receiverName: '',
  receiverPhone: '',
  // 도착지 정보
  dropJibunAddress: '',
  dropRoadAddress: '',
  dropAddressDetail: '',
  dropLocation: {
    latitude: 0,
    longitude: 0,
  },
  orderDropAddress: {
    location: {
      latitude: 0,
      longitude: 0,
    },
    siDo: '',
    siGunGu: '',
    eupMyeonDong: '',
    ri: '',
    mainLandNumber: '',
    subLandNumber: '',
    roadName: '',
    mainBuildingNumber: '',
    subBuildingNumber: '',
    buildingName: '',
  },
  // 결제 금액 정보
  totalPayPrice: 0,
  actualPayPrice: 0,
  prepaidPrice: 0,
  prepaidMethod: '',
  paymentCashPrice: 0,
  paymentCardPrice: 0,
  taxFreePayPrice: 0,
  // 메모
  storeOrderMemo: '',
  ordererOrderMemo: '',

  // 픽업, 드랍 요청시간
  pickupWishAt: 0,
  dropWishAt: 0,
  storeDropExpectedAt: 0,
  // 상품 준비시간
  productPrepareTime: NO_CHANGES,
  // 고객 도착시간
  dropExpectedTime: NO_CHANGES,

  // 메인 배달
  mainDelivery: null,
  // 메뉴 리스트
  orderProducts: null,
  isUntact: false,
  isReservation: false,
});

const location = reactive({
  from_lat: auth.currentStore?.location.latitude,
  from_lng: auth.currentStore?.location.longitude,
  to_lat: '',
  to_lng: '',
});

const formValid = ref();
const showRequestMemoBottom = ref(false);
const showProductPrepareBottom = ref(false);
const showModifyPostPayment = ref(false);
const showModifyPayment = ref(false);
const showDropMapLayer = ref(false);
const showAddressLayer = ref(false);
const showStoreDropExpectedBottom = ref(false);
const deliveryPossibleInfo = ref(null);
const originalOrder = ref(null);
const modifyConfirmed = ref(true);
const needRequestDelivery = ref(false);
const pickupExpectedAtChangedDSM = ref(false);

const loading = ref(false);
const isDisabled = ref(true);

// 배달 가능 상태
const isPossibleDelivery = computed(() =>
  deliveryPossibleInfo.value && deliveryPossibleInfo.value.isPossible);

// #region 'computed'
const hasDeliveryTips = computed(() => hasDeliveryTip(form));
const hasDiscount = computed(() => form.totalPayPrice - form.actualPayPrice > 0);
const hasTaxFreePayPrice = computed(() => form.taxFreePayPrice > 0);

const deliveryTipPrices = computed(() => deliveryTipPrice(form));
const discountPrice = computed(() => form.totalPayPrice - form.actualPayPrice);
const taxFreePayPrice = computed(() => form.taxFreePayPrice);

const paymentMethod = computed(() => getPaymentMethod(form));
const paymentMethodsString = computed(() => {
  let result = '';
  if (form.prepaidPrice > 0) {
    result += `, ${t('views.modifyOrder.paymentAdditionalInfo.PREPAID')}`;
  }
  if (form.paymentCashPrice > 0 || form.paymentCardPrice > 0) {
    let postPaidStr = '';
    if (form.paymentCardPrice > 0) {
      postPaidStr += `, ${t('views.modifyOrder.paymentAdditionalInfo.CARD')}`;
    }
    if (form.paymentCashPrice > 0) {
      postPaidStr += `, ${t('views.modifyOrder.paymentAdditionalInfo.CASH')}`;
    }

    if (postPaidStr.length > 0) {
      result += `, ${t(
        'views.modifyOrder.paymentAdditionalInfo.postPaid',
      )}: ${postPaidStr.slice(2, postPaidStr.length)}`;
    }
  }

  if (result.length > 0) {
    result = result.slice(2, result.length);
  }

  return result;
});

const productPrepareTimeStr = computed(() => {
  if (form.productPrepareTime === NO_CHANGES) {
    // 고객 도착 예정시간 기준으로 계산을 하는데, 만약 값이 없다면 상점의 상품 준비시간 기준으로 표기합니다.
    const diff = diffMinutes(
      common.systemTimestamp,
      form.mainDelivery?.pickupExpectedAt ?
        form.mainDelivery?.pickupExpectedAt :
        common.systemTimestamp + auth.currentStore.productPrepareTime * oneMinute,
    );

    if (diff >= 0) {
      return (
        `${t('views.modifyOrder.inputField.productPrepareTime.noChanges')}` +
        `(${diff}${t('views.modifyOrder.inputField.productPrepareTime.minutesAfter')})`
      );
    }
    return (
      `${t('views.modifyOrder.inputField.productPrepareTime.noChanges')}` +
      `(${0 - diff}` +
      `${t('views.modifyOrder.inputField.productPrepareTime.minutesBefore')})`
    );
  }
  return `${form.productPrepareTime}${t('common.dateTime.minute')}`;
});

const storeDropExpectedAtStr = computed(() => {
  if (form.dropExpectedTime === NO_CHANGES) {
    const diff = diffMinutes(common.systemTimestamp, form.storeDropExpectedAt);
    if (diff >= 0) {
      return (
        `${t('views.modifyOrder.inputField.storeDropExpectedAt.noChanges')}` +
        `(${diff}${t('views.modifyOrder.inputField.storeDropExpectedAt.minutesAfter')})`
      );
    }
    return (
      `${t('views.modifyOrder.inputField.storeDropExpectedAt.noChanges')}` +
      `(${0 - diff}` +
      `${t('views.modifyOrder.inputField.storeDropExpectedAt.minutesBefore')})`
    );
  }
  return `${form.dropExpectedTime}${t('common.dateTime.minute')}`;
});

const showPickupWishAt = computed(() => {
  const mainDelivery = getMainDelivery(originalOrder.value);

  return originalOrder.value &&
    mainDelivery &&
    mainDelivery.deliveryType === DELIVERY_TYPE.AGENCY;
});

const showStoreDropExpectedAt = computed(() =>
  originalOrder.value &&
  originalOrder.value.orderType === ORDER_TYPE.FOR_ORDER &&
  [ORDER_STATUS.ACCEPTED, ORDER_STATUS.PREPARED].includes(originalOrder.value.status));

const canChangePickupWishAt = computed(() =>
  !hasAfterAllocated(originalOrder.value));

const canChangeStoreDropExpectedAt = computed(() =>
  originalOrder.value.orderType === ORDER_TYPE.FOR_ORDER);

const edited = computed(
  // 원본 데이터와 편집된 내용이 있는지 확인
  () =>
    addHyphenPhoneNumber(originalOrder.value.ordererPhone) !== form.ordererPhone ||
    originalOrder.value.dropJibunAddress !== form.dropJibunAddress ||
    originalOrder.value.dropRoadAddress !== form.dropRoadAddress ||
    originalOrder.value.dropAddressDetail !== form.dropAddressDetail ||
    originalOrder.value.actualPayPrice !== form.actualPayPrice ||
    originalOrder.value.prepaidPrice !== form.prepaidPrice ||
    originalOrder.value.paymentCardPrice !== form.paymentCardPrice ||
    originalOrder.value.paymentCashPrice !== form.paymentCashPrice ||
    originalOrder.value.taxFreePayPrice !== form.taxFreePayPrice ||
    originalOrder.value.storeOrderMemo !== form.storeOrderMemo ||
    originalOrder.value.pickupWishAt !== form.pickupWishAt ||
    originalOrder.value.isUntact !== form.isUntact ||
    form.productPrepareTime !== NO_CHANGES ||
    form.dropExpectedTime !== NO_CHANGES,
);
// 상점 메모
const storeMemos = computed(() => common.getPredefinedOrderMemos);

// 준비시간 데이터 생성
const _createPrepareTimes = (defaultPrepareTime, hasNoChanges = true) => {
  // 변경없음 선택지
  let defaultSelection = '';
  let firstPrepareTime = 0;

  // 현재 설정된 상품 준비시간이 아직 미래인 경우
  if (defaultPrepareTime >= 0) {
    // 미래시간에 대한 변경없음 표기
    defaultSelection =
      `${t('views.modifyOrder.inputField.productPrepareTime.noChanges')}` +
      `(${defaultPrepareTime}` +
      `${t('views.modifyOrder.inputField.productPrepareTime.minutesAfter')})`;

    // 선택지의 가장 첫 선택 값 ++
    firstPrepareTime = defaultPrepareTime + (5 - (defaultPrepareTime % 5));
  } else {
    // 과거시간에 대한 변경없음 표기
    defaultSelection =
      `${t('views.modifyOrder.inputField.productPrepareTime.noChanges')}` +
      `(${0 - defaultPrepareTime}` +
      `${t('views.modifyOrder.inputField.productPrepareTime.minutesBefore')})`;
    // 픽업 예정시간이 이미 지나간 경우에는 상점 상품 준비시간을 첫 선택지로 한다.
    firstPrepareTime = auth.currentStore.productPrepareTime;
  }

  const times = [];
  for (let i = 0; i < 8; i += 1) {
    times.push({
      str: `${i < 4 ? 5 * i + firstPrepareTime : i * 5 + firstPrepareTime + (i - 3) * 5} ` +
        `${t('common.dateTime.minute')}`,
      value: i < 4 ? 5 * i + firstPrepareTime : i * 5 + firstPrepareTime + (i - 3) * 5,
    });
  }

  // 문자열, 실제 값 형식으로 리턴합니다.
  if (hasNoChanges) {
    return [{ str: defaultSelection, value: NO_CHANGES }, ...times];
  }
  return times;
};

const _createDropExpectedTimes = (defaultExpectedTime) => {
  let expectedTime = defaultExpectedTime;

  // 상품 준비시간이 변경없음이 아니고, 고객 도착시간이 상품준비시간보다 작을 때는
  if (form.productPrepareTime > -1 && expectedTime < form.productPrepareTime) {
    // 20분 이후의 시간이 반드시 선택되도록 함.
    expectedTime = form.productPrepareTime + 15;
    return _createPrepareTimes(expectedTime, false);
  }
  return _createPrepareTimes(expectedTime, true);
};

const prepareTimes = computed(() =>
  _createPrepareTimes(
    diffMinutes(
      common.systemTimestamp,
      form.mainDelivery?.pickupExpectedAt ?
        form.mainDelivery?.pickupExpectedAt :
        common.systemTimestamp + auth.currentStore.productPrepareTime * oneMinute,
    ),
  ));

const dropExpectedTimes = computed(() =>
  _createDropExpectedTimes(
    diffMinutes(common.systemTimestamp, form.storeDropExpectedAt),
  ));
// #endregion

// #region onBeforeMount
onBeforeMount(async () => {
  // path에 들어온 parameter에 orderId 를 가지고 주문 정보를 불러옵니다.
  if (route.params.orderId) {
    try {
      modifyConfirmed.value = false;

      const order = orderDetail.modifyOrder;

      // 원본 주문 정보를 저장하고 있는다.
      originalOrder.value = _.cloneDeep(order);
      const mainDelivery = getMainDelivery(order);

      // 배달이 취소되어 해결하기 통해서 주문 수정 페이지에 진입했는지 여부
      if (route.query['request-delivery']) {
        // 배달요청을 해달라고 query 를 넘기는 것 뿐만 아니라 실제 메인 배달의 상태도 확인합니다.
        needRequestDelivery.value =
          (route.query['request-delivery'].toLowerCase() === 'true') &&
          (
            mainDelivery &&
            [
              DELIVERY_STATUS.CANCELED,
              DELIVERY_STATUS.REJECTED,
              DELIVERY_STATUS.FAILED,
            ].includes(mainDelivery.status)
          );

        if (mainDelivery.cancelType === 'INVALID_GOODS_PAY_TYPE_ONLY_PREPAID'
          || mainDelivery.cancelType === 'INVALID_GOODS_PAY_TYPE_ONLY_PREPAID_OR_CARD') {
          common.showToast('error', t('views.modifyOrder.message.clickPaymentModifyButton'));
        }
      }

      // 주문 기본 정보
      form.orderId = order.orderId;
      form.orderAgencyId = order.orderAgencyId;
      form.orderAgencyOrderId = order.orderAgencyOrderId;
      form.orderType = order.orderType;
      form.status = order.status;

      // 주문자 정보
      form.ordererName = order.ordererName;
      form.ordererPhone = addHyphenPhoneNumber(order.ordererPhone);

      // 수령자 정보
      form.receiverName = order.receiverName;
      form.receiverPhone = addHyphenPhoneNumber(order.receiverPhone);

      // 도착지 정보
      form.dropJibunAddress = order.dropJibunAddress;
      form.dropRoadAddress = order.dropRoadAddress;
      form.dropAddressDetail = order.dropAddressDetail;
      form.dropLocation.latitude = order.dropLocation.latitude;
      form.dropLocation.longitude = order.dropLocation.longitude;

      location.to_lat = form.dropLocation.latitude;
      location.to_lng = form.dropLocation.longitude;

      form.orderDropAddress.location.latitude = order.orderDropAddress.location.latitude;
      form.orderDropAddress.location.longitude = order.orderDropAddress.location.longitude;
      form.orderDropAddress.siDo = order.orderDropAddress.siDo;
      form.orderDropAddress.siGunGu = order.orderDropAddress.siGunGu;
      form.orderDropAddress.eupMyeonDong = order.orderDropAddress.eupMyeonDong;
      form.orderDropAddress.ri = order.orderDropAddress.ri;
      form.orderDropAddress.mainLandNumber = order.orderDropAddress.mainLandNumber;
      form.orderDropAddress.subLandNumber = order.orderDropAddress.subLandNumber;
      form.orderDropAddress.roadName = order.orderDropAddress.roadName;
      form.orderDropAddress.mainBuildingNumber = order.orderDropAddress.mainBuildingNumber;
      form.orderDropAddress.subBuildingNumber = order.orderDropAddress.subBuildingNumber;
      form.orderDropAddress.buildingName = order.orderDropAddress.buildingName;

      // 결제 금액 정보
      form.totalPayPrice = order.totalPayPrice;
      form.actualPayPrice = order.actualPayPrice;
      form.prepaidPrice = order.prepaidPrice;
      form.prepaidMethod = order.prepaidMethod;
      form.paymentCashPrice = order.paymentCashPrice;
      form.paymentCardPrice = order.paymentCardPrice;
      form.taxFreePayPrice = order.taxFreePayPrice;

      // 메뉴 정보
      form.orderProducts = [...order.orderProducts];

      // 메모
      form.storeOrderMemo = order.storeOrderMemo;
      form.ordererOrderMemo = order.ordererOrderMemo;

      // 픽업, 드랍 요청시간
      form.pickupWishAt = order.pickupWishAt;
      form.dropWishAt = order.dropWishAt;
      form.storeDropExpectedAt = order.storeDropExpectedAt;

      // 상품 준비시간
      form.productPrepareTime = NO_CHANGES;
      // 고객 도착시간
      form.dropExpectedTime = NO_CHANGES;

      form.isUntact = order.isUntact;
      form.isReservation = order.isReservation;

      // 메인 배달 찾기
      form.mainDelivery = { ...getMainDelivery(order) };

      // 마운트시 저장된 주소로 배달 가능 여부 조회
      fetchDeliveryPossible();
    } catch (err) {
      logger.error(err);
    } finally {
      common.setIsOverlayLoading(false);
    }
  }
});
// #endregion

// #region deliveryPossible 호출
const _deliveryPossible = async (pickupWishAt) => {
  const payload = {
    storeId: auth.currentStore.storeId,
    dropJibunAddress: form.dropJibunAddress,
    dropRoadAddress: form.dropRoadAddress,
    dropAddressDetail: form.dropAddressDetail,
    pickupWishAt,
    totalPayPrice: form.totalPayPrice,
    actualPayPrice: form.actualPayPrice,
    prepaidPrice: form.prepaidPrice,
    isUntact: form.isUntact,
    orderAgencyId: form.orderAgencyId,
    dropAddressInfo: {
      location: { ...form.orderDropAddress.location },
      siDo: form.orderDropAddress.siDo ? form.orderDropAddress.siDo : '',
      siGunGu: form.orderDropAddress.siGunGu ? form.orderDropAddress.siGunGu : '',
      eupMyeonDong: form.orderDropAddress.eupMyeonDong ? form.orderDropAddress.eupMyeonDong : '',
      ri: form.orderDropAddress.ri ? form.orderDropAddress.ri : '',
      mainLandNumber: form.orderDropAddress.mainLandNumber ? form.orderDropAddress.mainLandNumber : '',
      subLandNumber: form.orderDropAddress.subLandNumber ? form.orderDropAddress.subLandNumber : '',
      roadName: form.orderDropAddress.roadName ? form.orderDropAddress.roadName : '',
      mainBuildingNumber: form.orderDropAddress.mainBuildingNumber ? form.orderDropAddress.mainBuildingNumber : '',
      subBuildingNumber: form.orderDropAddress.subBuildingNumber ? form.orderDropAddress.subBuildingNumber : '',
      buildingName: form.orderDropAddress.buildingName ? form.orderDropAddress.buildingName : '',
    },
  };

  try {
    const { deliveryPossible } = await delivery.deliveryPossible(payload);
    deliveryPossibleInfo.value = deliveryPossible;
  } catch (err) {
    // 서버 오류가 난 것으로 표기합니다.
    deliveryPossibleInfo.value = {
      isPossible: false,
      reason: errors.convertedError.code,
    };
  }
};

// 배달가능 조회
const fetchDeliveryPossible = _.debounce(async () => {
  try {
    if (form.dropJibunAddress || form.dropRoadAddress) {
      deliveryPossibleInfo.value = null;
      loading.value = true;

      // 픽업 요청시간이 0보다 작은 경우는 최소 5분으로 배달가능여부 조회를 합니다.
      let pickupMinute = form.productPrepareTime;
      if (pickupMinute <= 0) {
        pickupMinute = 5;
      }

      await _deliveryPossible(common.systemTimestamp + pickupMinute * oneMinute);
    }
  } catch (err) {
    logger.error(err);
  } finally {
    loading.value = false;
  }
}, 500);

// #endregion

// #region 각종 모달, 버텀 시트에 대한 데이터 처리
const closeLayer = () => {
  showAddressLayer.value = false;
  showRequestMemoBottom.value = false;
  showProductPrepareBottom.value = false;
  showModifyPostPayment.value = false;
  showModifyPayment.value = false;
  showDropMapLayer.value = false;
  showStoreDropExpectedBottom.value = false;
};

// 주소정보 등록
const closeAndSettingAddress = (item) => {
  showAddressLayer.value = false;

  if (item) {
    // 주문의 도착지 정보 설정
    form.dropRoadAddress = `${item.dname} ${item.dorono} ${item.dororef}`;
    form.dropJibunAddress = `${item.bname} ${item.jibunno} (${item.hname})`;

    // eslint-disable-next-line prefer-destructuring
    form.dropLocation.latitude = item.latlng.split(',')[0];
    // eslint-disable-next-line prefer-destructuring
    form.dropLocation.longitude = item.latlng.split(',')[1];

    // orderDropAddress 정보 설정
    form.orderDropAddress.location = { ...form.dropLocation };
    form.orderDropAddress.siDo = item.sido;
    form.orderDropAddress.siGunGu = item.sgg;
    form.orderDropAddress.eupMyeonDong = item.emd;
    form.orderDropAddress.ri = item.lee;
    form.orderDropAddress.mainLandNumber = item.jmno;
    form.orderDropAddress.subLandNumber = item.jsno;
    form.orderDropAddress.roadName = item.dname;
    form.orderDropAddress.mainBuildingNumber = item.dmno;
    form.orderDropAddress.subBuildingNumber = item.dsno;
    form.orderDropAddress.buildingName = item.buildName;

    [location.to_lat, location.to_lng] = item.latlng.split(',');
  }
  fetchDeliveryPossible();
};

// 타입에 따라 데이터 바인딩 후 close
const onDataSetAndclose = ({ type, value, isUntact }) => {
  if (type === 'MEMO') {
    showRequestMemoBottom.value = false;
    if (value) {
      form.storeOrderMemo = value;
    }

    if (isUntact !== undefined) {
      form.isUntact = isUntact;
    }
  }

  if (type === 'PREPARE') {
    if (!Number.isNaN(value)) {
      form.productPrepareTime = value;
      form.dropExpectedTime =
        _createDropExpectedTimes(
          diffMinutes(common.systemTimestamp, form.storeDropExpectedAt),
        )[0].value;

      if (form.dropJibunAddress) {
        fetchDeliveryPossible();
      }
    }
    showProductPrepareBottom.value = false;
  }

  if (type === 'DROP_EXPECTED_AT') {
    if (value) {
      form.dropExpectedTime = value;
    }
    showStoreDropExpectedBottom.value = false;
  }

  if (type === 'POST_PAYMENT') {
    showModifyPostPayment.value = false;
    if (value) {
      form.actualPayPrice = value.actualPayPrice;
      form.totalPayPrice = value.totalPayPrice;
      form.paymentCashPrice = value.paymentCashPrice;
      form.paymentCardPrice = value.paymentCardPrice;
      form.taxFreePayPrice = value.taxFreePayPrice;

      form.orderProducts = [...value.orderProducts];

      // 상품 금액 변경에 따라 상품할증이 발생할 수 있으므로 배달대행료 조회를 다시 합니다.
      if (edited.value) fetchDeliveryPossible();
    }
  }

  if (type === 'PAYMENT') {
    showModifyPayment.value = false;
    if (value) {
      form.actualPayPrice = value.actualPayPrice;
      form.totalPayPrice = value.totalPayPrice;
      form.prepaidPrice = value.prepaidPrice;
      form.paymentCashPrice = value.paymentCashPrice;
      form.paymentCardPrice = value.paymentCardPrice;
      form.taxFreePayPrice = value.taxFreePayPrice;

      form.orderProducts = [...value.orderProducts];

      // 상품 금액 변경에 따라 상품할증이 발생할 수 있으므로 배달대행료 조회를 다시 합니다.
      if (edited.value) fetchDeliveryPossible();
    }
  }
};

const openAddressLayer = () => {
  common.$state.address = null;
  showAddressLayer.value = true;
};

// 요청사항 모달 오픈
const openRequestMemoModal = () => {
  showRequestMemoBottom.value = true;
};

const inputHandlerOrdererPhone = () => {
  form.ordererPhone = addHyphenPhoneNumber(form.ordererPhone);
  form.receiverPhone = addHyphenPhoneNumber(form.ordererPhone);
};
// #endregion

// #region 주문 수정 함수들
const updateOrderPaymentInfo = async (targetOrder, forceUpdate = false, recursive = true) => {
  let response = {
    isSuccess: true,
    category: '',
    code: '',
    order: null,
  };

  if (
    // 변경여부 체크 없이 무조건 업데이트
    forceUpdate ||
    // 또는 변경사항이 있을 때에만 업데이트
    originalOrder.value.totalPayPrice !== targetOrder.totalPayPrice ||
    originalOrder.value.actualPayPrice !== targetOrder.actualPayPrice ||
    originalOrder.value.prepaidPrice !== targetOrder.prepaidPrice ||
    originalOrder.value.paymentCashPrice !== targetOrder.paymentCashPrice ||
    originalOrder.value.paymentCardPrice !== targetOrder.paymentCardPrice ||
    originalOrder.value.taxFreePayPrice !== targetOrder.taxFreePayPrice ||
    originalOrder.value.isUntact !== targetOrder.isUntact ||
    !isOrderProductsEquals(originalOrder.value, targetOrder)
  ) {
    // OrderProductInput 에 맞게 적절하게 가공합니다.
    const products = _.cloneDeep(targetOrder.orderProducts);

    products.forEach((p) => {
      delete p.orderProductId;
      delete p.orderId;
      delete p.createdAt;
      delete p.updatedAt;

      p.orderProductOptions.forEach((o) => {
        delete o.orderProductOptionId;
        delete o.orderProductId;
        delete o.createdAt;
        delete o.updatedAt;
      });
    });

    const payload = {
      conditions: {
        orderId: targetOrder.orderId,
        storeId: auth.currentStore?.storeId,
      },
      data: {
        orderProducts: products,
        totalPayPrice: targetOrder.totalPayPrice,
        prepaidMethod: targetOrder.prepaidMethod,
        prepaidPrice: targetOrder.prepaidPrice,
        actualPayPrice: targetOrder.actualPayPrice,
        paymentCashPrice: targetOrder.paymentCashPrice,
        paymentCardPrice: targetOrder.paymentCardPrice,
        deferredPrice: targetOrder.paymentCashPrice + targetOrder.paymentCardPrice,
        taxFreePayPrice: targetOrder.taxFreePayPrice,
        isUntact: targetOrder.isUntact,
      },
    };

    try {
      const res = await orders.updateOrderPaymentInfo(payload);
      response.isSuccess = res.isSuccess;

      if (res.isSuccess) {
        response.category = '';
        response.code = '';
      } else {
        response.category = '';
        response.code = res.reason;
      }

      response.order = res.order;
    } catch (err) {
      response.isSuccess = false;
      response.category = errors.convertedError?.category;
      response.code = errors.convertedError?.code;
    }

    if (response.isSuccess) {
      if (recursive) {
        response = await updateOrderDropInfo(targetOrder);
      }
      return response;
    }

    // 실패한 경우 실패 응답.
    return response;
  }
  if (recursive) {
    response = await updateOrderDropInfo(targetOrder);
  }
  return response;
};

const updateOrderDropInfo = async (targetOrder, forceUpdate = false, recursive = true) => {
  let response = {
    isSuccess: true,
    category: '',
    code: '',
    order: null,
  };

  if (
    // 변경여부 체크 없이 무조건 업데이트
    forceUpdate ||
    // 또는 변경사항이 있을 때에만 업데이트
    originalOrder.value.dropJibunAddress !== targetOrder.dropJibunAddress ||
    originalOrder.value.dropRoadAddress !== targetOrder.dropRoadAddress ||
    originalOrder.value.dropAddressDetail !== targetOrder.dropAddressDetail
  ) {
    const payload = {
      conditions: {
        orderId: targetOrder.orderId,
        storeId: auth.currentStore?.storeId,
      },
      data: {
        dropJibunAddress: targetOrder.dropJibunAddress,
        dropRoadAddress: targetOrder.dropRoadAddress,
        dropAddressDetail: targetOrder.dropAddressDetail,
        dropAddressInfo: {
          location: {
            latitude: targetOrder.orderDropAddress.location.latitude,
            longitude: targetOrder.orderDropAddress.location.longitude,
          },
          siDo: targetOrder.orderDropAddress.siDo,
          siGunGu: targetOrder.orderDropAddress.siGunGu,
          eupMyeonDong: targetOrder.orderDropAddress.eupMyeonDong,
          ri: targetOrder.orderDropAddress.ri,
          mainLandNumber: targetOrder.orderDropAddress.mainLandNumber,
          subLandNumber: targetOrder.orderDropAddress.subLandNumber,
          roadName: targetOrder.orderDropAddress.roadName,
          mainBuildingNumber: targetOrder.orderDropAddress.mainBuildingNumber,
          subBuildingNumber: targetOrder.orderDropAddress.subBuildingNumber,
          buildingName: targetOrder.orderDropAddress.buildingName,
        },
      },
    };

    try {
      const res = await orders.updateOrderDropInfo(payload);
      response.isSuccess = res.isSuccess;

      if (res.isSuccess) {
        response.category = '';
        response.code = '';
      } else {
        response.category = '';
        response.code = res.reason;
      }

      response.order = res.order;
    } catch (err) {
      response.isSuccess = false;
      response.category = errors.convertedError?.category;
      response.code = errors.convertedError?.code;
    }

    if (response.isSuccess) {
      if (recursive) {
        response = await updateOrderStoreOrderMemo(targetOrder);
      }
      return response;
    }
    if (recursive) {
      // 롤백 로직 돌아야 함!
      await updateOrderPaymentInfo(originalOrder.value, true, false);
    }
    return response;
  }

  if (recursive) {
    response = await updateOrderStoreOrderMemo(targetOrder);
  }
  return response;
};

const updateOrderStoreOrderMemo =
async (targetOrder, forceUpdate = false, recursive = true) => {
  let response = {
    isSuccess: true,
    category: '',
    code: '',
    order: null,
  };

  if (
  // 변경여부 체크 없이 무조건 업데이트
    forceUpdate ||
      // 또는 변경사항이 있을 때에만 업데이트
      originalOrder.value.storeOrderMemo !== targetOrder.storeOrderMemo
  ) {
    const payload = {
      conditions: {
        orderId: targetOrder.orderId,
        storeId: auth.currentStore?.storeId,
      },
      data: {
        storeOrderMemo: targetOrder.storeOrderMemo,
      },
    };

    try {
      const res = await orders.updateOrderStoreOrderMemo(payload);
      response.isSuccess = res.isSuccess;

      if (res.isSuccess) {
        response.category = '';
        response.code = '';
      } else {
        response.category = '';
        response.code = res.reason;
      }
      response.order = res.order;
    } catch (err) {
      response.isSuccess = false;
      response.category = errors.convertedError?.category;
      response.code = errors.convertedError?.code;
    }

    if (response.isSuccess) {
      if (recursive) {
        response = await updateOrderPhoneInfo(targetOrder);
      }
      return response;
    }

    // 롤백 로직 돌아야 함!
    if (recursive) {
      // 롤백 로직 돌아야 함!
      let rollbackResult = await updateOrderPaymentInfo(originalOrder.value, true, false);
      if (rollbackResult.isSuccess) {
        rollbackResult = await updateOrderDropInfo(originalOrder.value, true, false);
      }
    }
    return response;
  }

  if (recursive) {
    response = await updateOrderPhoneInfo(targetOrder);
  }

  return response;
};

const updateOrderPhoneInfo = async (targetOrder, forceUpdate = false, recursive = true) => {
  let response = {
    isSuccess: true,
    category: '',
    code: '',
    order: null,
  };

  if (
  // 변경여부 체크 없이 무조건 업데이트
    forceUpdate ||
      // 또는 변경사항이 있을 때에만 업데이트
      originalOrder.value.ordererPhone !== targetOrder.ordererPhone ||
      originalOrder.value.receiverPhone !== targetOrder.receiverPhone
  ) {
    const payload = {
      conditions: {
        orderId: targetOrder.orderId,
        storeId: auth.currentStore?.storeId,
      },
      data: {
        ordererPhone: removeNonNumeric(targetOrder.ordererPhone),
      },
    };

    // 값이 존재할 때에만 payload 에 추가합니다.
    if (targetOrder.receiverPhone) {
      payload.data.receiverPhone = removeNonNumeric(targetOrder.receiverPhone);
    }

    try {
      const res = await orders.updateOrderPhoneInfo(payload);
      response.isSuccess = res.isSuccess;

      if (res.isSuccess) {
        response.category = '';
        response.code = '';
      } else {
        response.category = '';
        response.code = res.reason;
      }

      response.order = res.order;
    } catch (err) {
      response.isSuccess = false;
      response.category = errors.convertedError?.category;
      response.code = errors.convertedError?.code;
    }

    if (response.isSuccess) {
      if (recursive) {
        response = await updateOrderPickupWishAt(targetOrder);
      }
      return response;
    }

    if (recursive) {
    // 롤백 로직 돌아야 함!
      let rollbackResult = await updateOrderPaymentInfo(originalOrder.value, true, false);
      if (rollbackResult.isSuccess) {
        rollbackResult = await updateOrderDropInfo(originalOrder.value, true, false);
        if (rollbackResult.isSuccess) {
          rollbackResult = await updateOrderStoreOrderMemo(originalOrder.value, true, false);
        }
      }
    }
    return response;
  }

  if (recursive) {
    response = await updateOrderPickupWishAt(targetOrder);
  }
  return response;
};

const updateOrderPickupWishAt = async (targetOrder, forceUpdate = false, recursive = true) => {
  pickupExpectedAtChangedDSM.value = false;
  let response = {
    isSuccess: true,
    category: '',
    code: '',
    order: null,
  };
  if (
  // 변경여부 체크 없이 무조건 업데이트
    forceUpdate ||
      // 또는 변경사항이 있을 때에만 업데이트
      originalOrder.value.pickupWishAt !== targetOrder.pickupWishAt
  ) {
    const payload = {
      conditions: {
        orderId: targetOrder.orderId,
        storeId: auth.currentStore?.storeId,
      },
      data: {
        pickupWishAt: targetOrder.pickupWishAt,
      },
    };

    try {
      const res = await orders.updateOrderPickupWishAt(payload);
      response.isSuccess = res.isSuccess;

      if (res.isSuccess) {
        response.category = '';
        response.code = '';
        if (!forceUpdate && recursive) {
          const mainDelivery = getMainDelivery(res.order);
          if (mainDelivery && !isFailedDelivery(mainDelivery)) {
            pickupExpectedAtChangedDSM.value = {
              orderId: res.order.orderId,
              pickupExpectedAt: mainDelivery.pickupExpectedAt,
              dropJibunAddress: res.order.dropJibunAddress,
              dropRoadAddress: res.order.dropRoadAddress,
              dropAddressDetail: res.order.dropAddressDetail,
            };
          }
        }
      } else {
        response.category = '';
        response.code = res.reason;
      }

      response.order = res.order;
    } catch (err) {
      response.isSuccess = false;
      response.category = errors.convertedError?.category;
      response.code = errors.convertedError?.code;
    }

    if (response.isSuccess) {
      if (recursive) {
        response = await updateOrderStoreDropExpectedAt(targetOrder);
      }
      return response;
    }

    if (recursive) {
      // 롤백 로직 돌아야 함!
      let rollbackResult = await updateOrderPaymentInfo(originalOrder.value, true, false);
      if (rollbackResult.isSuccess) {
        rollbackResult = await updateOrderDropInfo(originalOrder.value, true, false);
        if (rollbackResult.isSuccess) {
          rollbackResult = await updateOrderStoreOrderMemo(originalOrder.value, true, false);
          if (rollbackResult.isSuccess) {
            rollbackResult = await updateOrderPhoneInfo(originalOrder.value, true, false);
          }
        }
      }
    }
    return response;
  }
  if (recursive) {
    response = await updateOrderStoreDropExpectedAt(targetOrder);
  }

  return response;
};

const updateOrderStoreDropExpectedAt =
async (targetOrder, forceUpdate = false, recursive = true) => {
  const response = {
    isSuccess: true,
    category: '',
    code: '',
    order: null,
  };

  if (
  // 변경여부 체크 없이 무조건 업데이트
    forceUpdate ||
      // 또는 변경사항이 있을 때에만 업데이트
      originalOrder.value.storeDropExpectedAt !== targetOrder.storeDropExpectedAt
  ) {
    try {
      const res = await orders.updateOrderStoreDropExpectedAt({
        orderId: targetOrder.orderId,
        storeId: auth.currentStore?.storeId,
        storeDropExpectedAt: targetOrder.storeDropExpectedAt,
      });

      // 고객 도착시간 수정은 isSuccess 여부를 리턴하지 않고 결과를 바로 리턴합니다. 실패한 경우에는 catch 문에서 처리될 것입니다.
      response.isSuccess = true;
      response.category = '';
      response.code = '';

      response.order = res;
    } catch (err) {
      response.isSuccess = false;
      response.category = errors.convertedError?.category;
      response.code = errors.convertedError?.code;
    }

    if (response.isSuccess) {
      return response;
    }

    if (recursive) {
      // 롤백 로직 돌아야 함!
      let rollbackResult = await updateOrderPaymentInfo(originalOrder.value, true, false);
      if (rollbackResult.isSuccess) {
        rollbackResult = await updateOrderDropInfo(originalOrder.value, true, false);
        if (rollbackResult.isSuccess) {
          rollbackResult = await updateOrderStoreOrderMemo(originalOrder.value, true, false);
          if (rollbackResult.isSuccess) {
            rollbackResult = await updateOrderPhoneInfo(originalOrder.value, true, false);
            if (rollbackResult.isSuccess) {
              rollbackResult = await updateOrderPickupWishAt(originalOrder.value, true, false);
            }
          }
        }
      }
    }
    return response;
  }
  return response;
};

// #endregion

// #region 수정 완료, 취소
const submitForm = async (deliveryType) => {
  try {
    // 비대면일 경우 선결제만 가능
    if (form.isUntact) {
      if (
        stringToNumber(form.paymentCardPrice) > 0 ||
        stringToNumber(form.paymentCashPrice) > 0
      ) {
        common.showToast('error', `${t('views.createOrder.message.errorIsUntact')} ${t('views.createOrder.message.fixAndRetry')}`);
        return;
      }
    }

    // 바로 배달요청을 해야 하는데 픽업 요청시간이 현재 시간보다 과거일 경우 오류 토스트를 내보내고 에러 리턴합니다.
    if (needRequestDelivery.value &&
      canChangePickupWishAt.value &&
      form.productPrepareTime === NO_CHANGES &&
      form.pickupWishAt < common.systemTimestamp
    ) {
      common.showToast('error', t('views.modifyOrder.message.mustChangePickupWishAt'));
      return;
    }

    // 상품 준비시간 설정. 배달이 존재하고 배차 전일 경우에 수정 가능합니다.
    if (showPickupWishAt.value &&
      canChangePickupWishAt.value &&
      form.productPrepareTime !== NO_CHANGES) {
      form.pickupWishAt = common.systemTimestamp + form.productPrepareTime * oneMinute;
    }

    // 고객 도착시간 설정. for order 주문에 대해서만 수정 가능합니다.
    if (showStoreDropExpectedAt.value &&
      canChangeStoreDropExpectedAt.value &&
      form.dropExpectedTime !== NO_CHANGES) {
      form.storeDropExpectedAt = common.systemTimestamp + form.dropExpectedTime * oneMinute;
    }

    common.setIsOverlayLoading(true);

    // 금액 수정부터 순차적으로 타고 들어갑니다.
    const res = await updateOrderPaymentInfo(form);

    if (res.isSuccess) {
      // 수정 완료 표기
      modifyConfirmed.value = true;

      // 바로 배달요청이 필요한 경우
      if (needRequestDelivery.value) {
        const response = {
          code: '',
          isSuccess: false,
        };
        try {
          const payload = {
            storeId: auth.currentStore.storeId,
            orderId: form.orderId,
            deliveryId: form.mainDelivery.deliveryId,
            deliveryType,
            pickupWishAt: form.pickupWishAt,
            isUntact: form.isUntact,
            isManual: false,
          };

          const { reRequestDelivery } = await delivery.reRequestDelivery(payload);

          response.isSuccess = reRequestDelivery.isSuccess;

          if (reRequestDelivery.isSuccess) {
            const mainDelivery = reRequestDelivery.delivery;

            // 새롭게 배달 요청된 데이터를 기반으로 픽업 예상시간 수정 dsm 을 표기합니다.
            if (mainDelivery && !isFailedDelivery(mainDelivery)) {
              pickupExpectedAtChangedDSM.value = {
                orderId: form.orderId,
                pickupExpectedAt: mainDelivery.pickupExpectedAt,
                dropJibunAddress: form.dropJibunAddress,
                dropRoadAddress: form.dropRoadAddress,
                dropAddressDetail: form.dropAddressDetail,
              };
            }
          } else {
            response.code = reRequestDelivery.reason;
          }
        } catch (err) {
          response.code = errors.convertedError.code;
          logger.error(err);
          Sentry.captureException(err);
        }

        if (!response.isSuccess) {
          common.showToast('error', t(`errors.requestDelivery.${response.code}`, t('errors.requestDelivery.UNKNOWN_SERVER_ERROR')));
          return;
        }

        // 상품 준비완료 이력이 있는 경우 상품 준비완료 요청을 다시 보내 새로 생성한 배달이 준비완료 상태가 되도록 합니다.
        if (
          deliveryType === DELIVERY_TYPE.AGENCY &&
          originalOrder.value &&
          originalOrder.value.orderPreparedNotificationHistories &&
          originalOrder.value.orderPreparedNotificationHistories.length > 0
        ) {
          try {
            // 준비완료 알람 보내기
            await orders.prepareOrderForNotification({
              storeId: auth.currentStore?.storeId,
              orderId: form.orderId,
            });
          } catch (err) {
            // 알람 보내기 실패한 경우 로그만 남기고 우선 진행!
            logger.error(err);
            Sentry.captureException(err);
          }
        }
      }

      // 라우터 히스토리가 없다면 직접 진행중 상세로 이동.
      if (!router.options.history.state.back) {
        router.replace({ name: 'OrderDetail',
          params: {
            orderId: originalOrder.value.orderId,
          } });
        return;
      }
      // 주문 수정 버튼을 눌러 이동한 경우 뒤로가기를 하여 원래 페이지로 이동.
      router.back();
    } else {
      // 실패 사유별 에러 토스트 표기
      common.showToast(
        'error',
        t(
          `views.modifyOrder.message.modifyRejected.${res.code}`,
          t('views.modifyOrder.message.modifyRejected.UNKNOWN_ERROR'),
        ),
      );
    }
  } catch (err) {
    logger.error(err);
  }
};

onBeforeUnmount(() => {
  if (pickupExpectedAtChangedDSM.value) {
    common.showDeliveryStatusModal({
      event: CUSTOM_DSM_TYPE.DELIVERY_PICKUP_EXPECTED_AT_CHANGED,
      message: pickupExpectedAtChangedDSM.value,
    });
  }
});

const cancelModify = () => {
  router.back();
};
// #endregion

// 메뉴 금액 초기화('') 입력시 결제수단도 초기화 처리
watch(
  () => ({ ...form }),
  () => {
    isDisabled.value = !edited.value;
  },
);

const isShowOverlayView = computed(() =>
  showAddressLayer.value
  || showDropMapLayer.value
  || showModifyPostPayment.value
  || showModifyPayment.value
  || showRequestMemoBottom.value
  || showProductPrepareBottom.value
  || showStoreDropExpectedBottom.value);

const closeOverlayView = () => {
  showAddressLayer.value = false;
  showDropMapLayer.value = false;
  showModifyPostPayment.value = false;
  showModifyPayment.value = false;
  showRequestMemoBottom.value = false;
  showProductPrepareBottom.value = false;
  showStoreDropExpectedBottom.value = false;
};

// ref 로 외부 컴포넌트가 참조할 변수 외부로 노출!
defineExpose({ edited, modifyConfirmed, isShowOverlayView, closeOverlayView });
</script>

<style lang="scss" scoped>
.horizontal {
  max-width: $breakpoint-tablet;
  height: 4px;
  background: $color-gray-f5;
}

:deep(.v-expansion-panel-title__overlay) {
  background-color: $color-gray-f5;
}
:deep(.v-expansion-panel-text__wrapper) {
  background-color: $color-gray-f5;
  padding: 0 1.6rem 1.2rem 1.6rem;
}
.icon {
  text-align: -webkit-right;
}
.icon-map {
  box-sizing: border-box;
  width: 39px;
  height: 40px;
  left: 0px;
  right: 0px;
  top: 12px;

  background: $color-gray-ff;
  border: 1px solid $color-gray-cb;
  border-radius: 4px;
  text-align: center;
  vertical-align: -webkit-baseline-middle;
}
.address {
  box-sizing: border-box;

  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 16px;
  gap: 4px;

  width: auto;
  height: 76px;

  background: #ffffff;

  border: 1px solid $color-gray-bd;
  border-radius: 4px;

  flex: none;
  order: 1;
  flex-grow: 0;

  border: 1px solid $color-gray-bd;
  border-radius: 4px;
}
.amount {
  background: $color-gray-f5;
  border-radius: 4px;
}
.payment {
  text-align: center;
  letter-spacing: 0.5px;
  text-decoration-line: underline;
  color: $color-gray-99;
}

:deep(.v-textarea) .v-field__field {
  align-self: center;
}
</style>
