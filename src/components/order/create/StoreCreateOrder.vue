<template>
  <VForm ref="formValid">
    <VRow no-gutters class="d-flex flex-column ma-4">
      <VCol class="mt-2 d-flex justify-space-between">
        <span class="font-size-16 font-weight-bold">{{ $t('views.createOrder.orderInfo') }}</span>
        <StoreOrderServeTypeBadge
          v-if="reOrderReason"
          color="orange"
          :labelName="reOrderReason"
        />
      </VCol>
      <VCol class="mt-4">
        <StoreTextField
          v-model="form.ordererPhone"
          name="ordererPhone"
          :title="$t('views.createOrder.inputField.ordererPhone.title')"
          :label="$t('views.createOrder.inputField.ordererPhone.label')"
          :placeholder="$t('views.createOrder.inputField.ordererPhone.placeholder')"
          variant="outlined"
          type="tel"
          :dark="true"
          :rules="telRules"
          maxlength="14"
          clearable
          required
          @click:clear="form.ordererPhone = ''"
          @input="form.ordererPhone = addHyphenPhoneNumber(form.ordererPhone)"
        />
      </VCol>
      <VCol class="mt-4">

        <template v-if="!isSuccessAddressSearch && !form.jibunAddress && !form.roadAddress">
          <StoreTextField
            v-model="form.jibunAddress"
            :title="$t('views.createOrder.inputField.dropAddress.title')"
            :label="$t('views.createOrder.inputField.dropAddress.label')"
            variant="outlined"
            :dark="true"
            required
            @focusin="openAddressLayer"
            @click.prevent=""
          />
        </template>
        <template v-else>
          <p class="mb-2"
            :class="{ 'error-text': !isSuccessAddressSearch }">
            {{ $t('views.createOrder.inputField.dropAddress.title') }}
          </p>
          <div class="address d-flex justify-space-between"
            :class="{ 'error-border': !isSuccessAddressSearch }"
            >
            <VRow no-gutters>
              <VCol class="d-inline" @click="openAddressLayer">
                <div :class="{ 'error-text': !isSuccessAddressSearch }">
                  {{ form.jibunAddress }}
                </div>

                <div class="mt-1">
                  <VChip
                    rounded="2"
                    :color="gray6Color"
                    size="x-small"
                    label
                    variant="outlined"
                    close
                  >
                    {{ $t('views.createOrder.inputField.dropAddress.roadName') }}
                  </VChip>
                  <span class="ml-1 font-size-12"
                    :class="{ 'error-text': !isSuccessAddressSearch }">
                      {{ form.roadAddress }}
                  </span>
                </div>
              </VCol>
              <VCol v-if="isSuccessAddressSearch" cols="2">
                <OrderMapButton
                  :jibunAddress="form.jibunAddress"
                  :roadAddress="form.roadAddress"
                  :location="location"
                />
              </VCol>
            </VRow>
          </div>
        </template>
      </VCol>
      <VCol class="mt-4">
        <StoreTextField
          v-model="form.dropAddressDetail"
          name="dropAddressDetail"
          :title="$t('views.createOrder.inputField.dropAddressDetail.title')"
          :placeholder="$t('views.createOrder.inputField.dropAddressDetail.placeholder')"
          variant="outlined"
          :dark="true"
          maxlength="100"
          required
        />
      </VCol>
      <VCol class="mt-4">
        <StoreTextField
          v-model="form.actualPayPrice"
          type="tel"
          name="actualPayPrice"
          :title="actualPayPriceTitle"
          :label="$t('views.createOrder.inputField.actualPayPrice.label')"
          :placeholder="$t('views.createOrder.inputField.actualPayPrice.placeholder')"
          variant="outlined"
          :dark="true"
          maxlength="10"
          required
          @input="(e) => (form.actualPayPrice = numberWithCommas(e.target.value))"
          @focusout="fetchDeliveryPossible"
          @blur="compareActualTaxFreePrice"
        />
        <!-- 배달팁, 할인, 무료제공 메시지 노출 영역 -->
        <div v-if="isVisibleAmountMessage" class="pt-2 text-right">
          <p v-html="additionAmountInfo"></p>
          <span v-if="form.actualPayPrice === '0'" class="s-color-red-e5">
            {{ $t('views.createOrder.inputField.totalPrice.freeProductMessage') }}
          </span>
        </div>
      </VCol>
      <VCol v-if="isTaxFreePayPriceApplied" class="d-flex align-center justify-space-between mt-4">
        {{ $t('views.createOrder.cupDeposit') }}({{ $t('views.createOrder.cupDepositOne') }})
        <StoreDepositCounter
          v-model:count="cupDepositCount"
          :isDisabled="stringToNumber(form.actualPayPrice) < CUP_DEPOSIT"/>
      </VCol>
      <VCol class="mt-4">
        <VRow no-gutters>
          <VCol v-for="(item, index) in paymentMethod" :key="index" class="pr-2" cols="3">
            <StoreButton
              block
              :color="stringToNumber(form[item.field]) > 0 ? 'primary' : 'grey'"
              :variant="stringToNumber(form.actualPayPrice) > 0 ? 'outlined' : 'tonal'"
              @click.stop="stringToNumber(form.actualPayPrice) > 0 && changePaymentMethod(item)"
            >
              <span :class="stringToNumber(form[item.field]) > 0 ? 'primary' : 'text-black'">{{
                item.name
              }}</span>
            </StoreButton>
          </VCol>
          <VCol cols="3" class="text-center">
            <StoreButton
              class="payment"
              variant="text"
              :color="stringToNumber(form.actualPayPrice) > 0 ? primaryColor : ''"
              @click="stringToNumber(form.actualPayPrice) > 0 ? (isShowMixPaymentLayer = true) : ''"
            >
              <span
                class="text-decoration-underline"
                :class="stringToNumber(form.actualPayPrice) === 0 && 's-color-gray-99'"
                >{{ $t('views.createOrder.paymentMethod.mixpaid') }}</span
              >
            </StoreButton>
          </VCol>
        </VRow>
      </VCol>
      <VCol class="mt-4">
        <VRow no-gutters class="pa-4 amount">
          <VCol cols="5" class="text-left">
            {{ $t('views.createOrder.inputField.totalPrice.title') }}
            <p v-if="cupDepositCount" class="font-size-12">
              ({{
                $t('views.createOrder.cupDeposit')}} {{ $t('views.createOrder.cupDepositInclusion')
              }})
            </p>
          </VCol>
          <VCol class="text-right">
            {{ (form.actualPayPrice) || 0 }} {{ $t('common.currency') }}
          </VCol>
        </VRow>
      </VCol>
      <VCol class="mt-4" cols="12">
        <p class="mb-2">
          {{ $t('views.createOrder.inputField.storeOrderMemo.title') }}
        </p>
        <VTextarea
          v-model="form.storeOrderMemo"
          name="storeOrderMemo"
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
          <template #append>
            <VBtn height="56" class="pa-0" variant="tonal" @click="openRequestMemoModal">
              {{ $t('views.createOrder.inputField.storeOrderMemo.appendButton') }}
            </VBtn>
          </template>
        </VTextarea>
      </VCol>
    </VRow>
    <div class="horizontal" />
    <VRow no-gutters class="d-flex flex-column ma-4">
      <VCol class="mt-4">
        <div class="d-flex justify-space-between align-center">
          <span class="font-size-16 font-weight-bold">{{
            $t('views.createOrder.deliveryInfo')
          }}</span>
          <span>
            <VCheckbox
              v-model="form.isUntact"
              :label="$t('views.createOrder.inputField.isUntact.label')"
              color="primary"
              hide-details
          /></span>
        </div>
      </VCol>
      <VCol class="mt-4">
        <StoreTextField
          v-model="form.productPrepareTime"
          name="productPrepareTime"
          :title="$t('views.createOrder.inputField.productPrepareTime.title')"
          variant="outlined"
          :dark="true"
          maxlength="30"
          append-inner-icon="mdi-menu-down"
          readonly
          :disabled="isLoadingPrepareTime"
          required
          @click="!isLoadingPrepareTime ? isShowProductPrepareBottom = true : ''"
        />
      </VCol>
      <VCol v-if="loading || deliveryPossibleInfo?.isPossible" class="mt-4">
        <div v-if="loading" class="text-center">
          <VProgressCircular indeterminate color="primary" />
        </div>
        <template v-if="deliveryPossibleInfo?.isPossible">
          <VRow no-gutters class="flex-column">
            <VCol>
              <StorePickupExpected :delivery-info="deliveryPossibleInfo" />
            </VCol>
            <VCol class="mt-2">
              <StoreOrderDeliveryInfo :delivery-info="deliveryPossibleInfo" />
            </VCol>
          </VRow>
        </template>
      </VCol>
      <VCol v-if="errorMessage" class="mt-4">
        <StoreErrorMessageText :errorMessage="errorMessage" icon />
      </VCol>
      <VCol v-if="isReOrder" class="mt-4">
        <VCheckbox
          v-model="isReOrderConfirm"
          class="d-flex justify-end"
          :label="$t('views.createOrder.message.reOrderConfirmText')"
          color="primary"
          hide-details
        />
      </VCol>
      <VCol class="mt-4">
        <VRow no-gutters>
          <VCol class="pr-2">
            <StoreButton
              block
              :class="!isDisabled && 'outlined'"
              :disabled="isDisabled"
              variant="outlined"
              @click.stop="submitForm('SELF')"
            >
              <span class="s-color-gray-75">{{ $t('views.createOrder.selfDelivery') }}</span>
            </StoreButton>
          </VCol>
          <VCol class="pl-2">
            <StoreButton
              block
              :disabled="!deliveryPossibleInfo?.isPossible || isDisabled"
              @click.stop="!submitForm('AGENCY')"
            >
              {{ $t('views.createOrder.agencyDelivery') }}
            </StoreButton>
          </VCol>
        </VRow>
      </VCol>
    </VRow>
  </VForm>

  <!-- 주소검색 레이어 -->
  <StoreAddressLayer
    :dialog="isShowAddressLayer"
    @set-data="closeAndSettingAddress"
    @close-layer="closeLayer"
  />

  <!-- 목적지 맵 레이어 -->
  <StoreDropAddressMapLayer
    v-if="form.jibunAddress"
    :dialog="isShowDropMapLayer"
    :drop-address="form.roadAddress"
    :jibun-address="form.jibunAddress"
    :location="location"
    @close-layer="closeLayer"
  />

  <!-- 복합결제 레이어 -->
  <StoreMixPaidLayer
    :dialog="isShowMixPaymentLayer"
    :actual-pay-price="form.actualPayPrice.toString()"
    :payment-card-price="form.paymentCardPrice.toString()"
    :payment-cash-price="form.paymentCashPrice.toString()"
    :prepaid-price="form.prepaidPrice.toString()"
    :cupDepositPrice="form.taxFreePayPrice"
    @set-data="onDataSetAndclose"
    @close-layer="closeLayer"
  />

  <!-- 요청사항 바텀시트 -->
  <StoreRequestMemoBottomSheet
    v-model:visible="isShowRequestMemoBottom"
    :store-memos="storeMemos"
    @set-data="onDataSetAndclose"
    @close-layer="closeLayer"
  />

  <!-- 상품준비시간 바텀시트 -->
  <StoreProductPrepareBottomSheet
    v-if="isShowProductPrepareBottom"
    v-model:visible="isShowProductPrepareBottom"
    :title="$t('views.createOrder.inputField.productPrepareTime.title')"
    :description="$t('views.createOrder.inputField.productPrepareTime.description')"
    :data-type="'PREPARE'"
    :times="prepareTime"
    :selected-time="form.productPrepareTime"
    @set-data="onDataSetAndclose"
    @close-layer="closeLayer"
  />

  <StoreToastMessage v-model="isSnackbar" color="error" multi-line>
    <VRow no-gutters>
      <VCol cols="12" sm="6" :class="smAndUp && 'text-end'">
        <span class="text-something">{{ $t('views.createOrder.message.errorIsUntact') }}</span>
      </VCol>
      <VCol cols="12" sm="6" :class="smAndUp && 'text-start'">
        &nbsp;{{ $t('views.createOrder.message.fixAndRetry') }}
      </VCol>
    </VRow>
  </StoreToastMessage>

  <StoreOrderDuplicationModal
    v-if="isShowDuplicationModal"
    :orderId="duplicatedOrderId"
    @close="isShowDuplicationModal = false"
    @gotoView="handleGotoView"
  />
</template>

<script setup="StoreCreateOrder">
import { ref, reactive, watchEffect, onMounted, watch, computed, defineExpose } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import _ from 'lodash';
import { useLocale, useDisplay } from 'vuetify';
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
} from '@/utils/stringUtils';
import {
  sumOrderTotalPayPrice,
  deliveryTipPrice,
  deleteOrderProductsProperty,
  getPaymentMethod,
  getTemporaryProduct,
  getProductPriceExcludeTemporary,
  isValidOrderProductsPrice,
} from '@/utils/orderUtils';

import { parseMcdonaldOrder } from '@/utils/parser';
import { PAYMENT_METHOD, CUP_DEPOSIT, ONE_MINUTE } from '@/constants';

import StoreButton from '@/components/common/StoreButton.vue';
import StoreTextField from '@/components/common/StoreTextField.vue';
import StoreOrderDeliveryInfo from '@/components/order/common/StoreOrderDeliveryInfo.vue';
import StoreRequestMemoBottomSheet from '@/components/order/common/StoreRequestMemoBottomSheet.vue';
import StoreProductPrepareBottomSheet from '@/components/order/common/StoreProductPrepareBottomSheet.vue';
import StoreDropAddressMapLayer from '@/components/order/common/StoreDropAddressMapLayer.vue';
import StoreAddressLayer from '@/components/order/common/StoreAddressLayer.vue';
import StorePickupExpected from '@/components/order/common/StorePickupExpected.vue';
import OrderMapButton from '@/components/order/common/OrderMapButton.vue';
import StoreToastMessage from '@/components/common/StoreToastMessage.vue';
import StoreMixPaidLayer from '@/components/order/create/StoreMixPaidLayer.vue';
import StoreErrorMessageText from '@/components/common/StoreErrorMessageText.vue';
import StoreOrderDuplicationModal from '@/components/order/create/StoreOrderDuplicationModal.vue';
import StoreDepositCounter from '@/components/order/create/StoreDepositCounter.vue';
import StoreOrderServeTypeBadge from '@/components/delivery/StoreOrderServeTypeBadge.vue';

import { primaryColor, gray6Color } from '@/styles/_export.module.scss';

const { t } = useLocale();
const router = useRouter();
const route = useRoute();
const { smAndUp } = useDisplay();

const auth = useAuthStore();
const orderStore = useOrderStore();
const orderDetailStore = useOrderDetailStore();
const delivery = useDeliveryStore();
const common = useCommonStore();
const errors = useErrorsStore();

const { telRules } = Rules;
const form = reactive({
  orderAgencyId: null, // 맥도날드에서 사용
  orderAgencyStoreId: null, // 맥도날드에서 사용
  orderAgencyOrderId: null, // 맥도날드에서 사용
  ordererName: '', // 맥도날드에서 사용
  ordererPhone: '',
  roadAddress: '',
  jibunAddress: '',
  dropAddressDetail: '',
  unknownAddress: '',
  storeOrderMemo: '',
  ordererOrderMemo: '',
  prepaidMethod: '',
  isUntact: false,
  productPrepareTime: `${auth.minimumPrepareTime} 분`,
  pickupWishAt: 0,
  actualPayPrice: '',
  prepaidPrice: 0,
  paymentCashPrice: 0,
  paymentCardPrice: 0,
  taxFreePayPrice: 0,
  orderProducts: [],
});

const _orderDefaultProduct = {
  type: 'TEMPORARY',
  name: t('views.createOrder.tempProduct'),
  quantity: 1,
  unitPrice: 0,
  totalPrice: 0,
  storeProductId: 0,
  orderProductOptions: [],
};
const location = reactive({
  from_lat: auth.currentStore?.location.latitude,
  from_lng: auth.currentStore?.location.longitude,
  to_lat: '',
  to_lng: '',
});
const paymentMethod = reactive([
  {
    name: t('views.createOrder.paymentMethod.card'),
    field: 'paymentCardPrice',
    type: PAYMENT_METHOD.CARD,
    active: false,
  },
  {
    name: t('views.createOrder.paymentMethod.cash'),
    field: 'paymentCashPrice',
    type: PAYMENT_METHOD.CASH,
    active: false,
  },
  {
    name: t('views.createOrder.paymentMethod.prepaid'),
    field: 'prepaidPrice',
    type: PAYMENT_METHOD.PREPAID,
    active: false,
  },
]);
const dropAddressInfo = reactive({
  location: {
    latitude: '',
    longitude: '',
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
});

const storeMemos = computed(() => common.getPredefinedOrderMemos || []);
const prepareTime = computed(() => auth.prepareTimeData);
const isSnackbar = ref(false);
const formValid = ref();
const errorMessage = ref('');
const isShowRequestMemoBottom = ref(false);
const isShowProductPrepareBottom = ref(false);
const isShowMixPaymentLayer = ref(false);
const isShowDropMapLayer = ref(false);
const isShowAddressLayer = ref(false);
const deliveryPossibleInfo = ref(null);
const loading = ref(false);
const isDisabled = ref(true);
const isShowDuplicationModal = ref(false);
const duplicatedOrderId = ref();
const isOrderWrittenCancel = ref(true);
const reOrderReason = ref('');
const reOrderAdditionForm = reactive({
  parentOrderId: 0,
  reorderType: '',
  reorderReason: '',
});
const isSuccessAddressSearch = ref(false);
const isExistOrderData = ref(false);

/**
 * 상품준비시간
 */
const _minPrepareTime = computed(() => auth.minimumPrepareTime);

// 새로고침 했을 경우
// deliveryCondition 조회 중 상품준비시간 disabled 처리
const isLoadingPrepareTime = computed(() => !auth.currentDeliveryCondition);

// deliveryCondition 조회 후 최소 상품준비시간 설정
watch(_minPrepareTime, (newTime) => {
  form.productPrepareTime = `${newTime} 분`;
});

watch(() => form.productPrepareTime, (newVal, oldVal) => {
  // 최소 픽업시간 미만으로 선택한 경우
  if (_minPrepareTime.value > parseInt(newVal, 10)) {
    form.productPrepareTime = oldVal;
    common.showToast('error', `${t('errors.deliveryPossible.INVALID_PICKUP_WISH_AT', { minute: _minPrepareTime.value })}`);
  }
});

/**
 * 배달팁 / 할인금액 문구 노출 관련
 */
const deliveryTipAmount = ref(0);
const discountAmount = ref(0);

const isVisibleAmountMessage = computed(() => deliveryTipAmount.value || discountAmount || form.actualPayPrice === '0');
const additionAmountInfo = computed(() => {
  const messageArray = [];
  const deliveryTipElement = `<span>${
    t('views.orderDetail.orderCard.label.deliveryTip', { price: numberWithCommas(deliveryTipAmount.value) })
  } ${t('views.createOrder.applying')}</span>`;
  const discountTagElemnet = `<span class="s-color-red-e5">${
    t('views.orderDetail.orderCard.label.discountPrice', { price: numberWithCommas(discountAmount.value) })
  }</span>`;

  if (deliveryTipAmount.value) {
    messageArray.push(deliveryTipElement);
  }

  if (discountAmount.value) {
    messageArray.push(discountTagElemnet);
  }

  return messageArray.join(', ');
});

const _deliveryPossible = async () => {
  errorMessage.value = '';
  const payload = {
    storeId: auth.currentStore.storeId,
    dropJibunAddress: `${form.jibunAddress}`,
    dropRoadAddress: `${form.roadAddress}`,
    dropAddressDetail: form.dropAddressDetail || '',
    pickupWishAt: form.pickupWishAt,
    totalPayPrice: stringToNumber(form.actualPayPrice),
    actualPayPrice: stringToNumber(form.actualPayPrice),
    prepaidPrice: stringToNumber(form.prepaidPrice),
    dropAddressInfo,
  };
  const response = {
    code: '',
    isPossible: false,
    deliveryPossibleInfo: null,
  };

  try {
    const { deliveryPossible } = await delivery.deliveryPossible(payload);
    response.isPossible = deliveryPossible.isPossible;
    if (!deliveryPossible.isPossible) {
      response.code = deliveryPossible.reason;
    }
    response.deliveryPossibleInfo = deliveryPossible;

    return response;
  } catch (err) {
    response.isPossible = false;
    response.code = errors.convertedError.code;
    response.deliveryPossibleInfo = null;

    return response;
  }
};

// 배달가능 조회
const fetchDeliveryPossible = _.debounce(async () => {
  try {
    if (form.jibunAddress || form.roadAddress) {
      deliveryPossibleInfo.value = null;
      loading.value = true;
      form.pickupWishAt = _.now() + ONE_MINUTE * parseInt(form.productPrepareTime, 10);

      const response = await _deliveryPossible();
      deliveryPossibleInfo.value = response.deliveryPossibleInfo;

      if (!response.isPossible) {
        errorMessage.value = t(
          `errors.deliveryPossible.${response.code}`,
          t('errors.deliveryPossible.UNKNOWN_SERVER_ERROR'),
        );
      }
    }
  } finally {
    loading.value = false;
  }
}, 500);

const closeLayer = () => {
  isShowAddressLayer.value = false;
  isShowRequestMemoBottom.value = false;
  isShowProductPrepareBottom.value = false;
  isShowMixPaymentLayer.value = false;
  isShowDropMapLayer.value = false;
};

// 주소정보 등록
const closeAndSettingAddress = (item, inputAddress) => {
  isShowAddressLayer.value = false;

  // 주소검색 결과가 없을 경우
  if (!item) {
    isSuccessAddressSearch.value = false;
    form.roadAddress = inputAddress.dropRoadAddress;
    form.jibunAddress = inputAddress.dropJibunAddress;

    common.showToast('error', t('views.createOrder.message.errorInvaildAddress'));
    Sentry.captureException(new Error('Drop address search failed.'));
    return;
  }

  isSuccessAddressSearch.value = true;
  form.roadAddress = `${item.dname} ${item.dorono} ${item.dororef2}`;
  form.jibunAddress = `${item.bname} ${item.jibunno} (${item.hname})`;
  [location.to_lat, location.to_lng] = item.latlng.split(',');
  dropAddressInfo.location.latitude = location.to_lat;
  dropAddressInfo.location.longitude = location.to_lng;
  dropAddressInfo.siDo = item.sido;
  dropAddressInfo.siGunGu = item.sgg;
  dropAddressInfo.eupMyeonDong = item.emd;
  dropAddressInfo.ri = item.lee;
  dropAddressInfo.mainLandNumber = item.jmno;
  dropAddressInfo.subLandNumber = item.jsno;
  dropAddressInfo.mainBuildingNumber = item.dorono;
  dropAddressInfo.subBuildingNumber = item.dsno;
  dropAddressInfo.roadName = item.dname;
  dropAddressInfo.buildingName = item.buildname;
  fetchDeliveryPossible();
};

const settingOrderDropAddress = (orderDropAddress) => {
  isSuccessAddressSearch.value = true;

  // 도로명주소
  let roadAddress = orderDropAddress.roadName;
  let dorono = orderDropAddress.mainBuildingNumber;
  if (orderDropAddress.subBuildingNumber) {
    dorono += `-${orderDropAddress.subBuildingNumber}`;
  }
  roadAddress += ` ${dorono}`;

  let dororef = orderDropAddress.eupMyeonDong;
  if (orderDropAddress.buildingName) {
    dororef += `, ${orderDropAddress.buildingName}`;
  }
  roadAddress += ` (${dororef})`;
  form.roadAddress = roadAddress;

  // 지번주소
  let jibunAddress = orderDropAddress.eupMyeonDong;
  let jibunno = orderDropAddress.mainLandNumber;
  if (orderDropAddress.subLandNumber) {
    jibunno += `-${orderDropAddress.subLandNumber}`;
  }
  jibunAddress += ` ${jibunno}`;

  if (orderDropAddress.buildingName) {
    jibunAddress += ` (${orderDropAddress.buildingName})`;
  }
  form.jibunAddress = jibunAddress;

  location.to_lat = orderDropAddress.location.latitude;
  location.to_lng = orderDropAddress.location.longitude;
  dropAddressInfo.location.latitude = orderDropAddress.location.latitude;
  dropAddressInfo.location.longitude = orderDropAddress.location.longitude;
  dropAddressInfo.siDo = orderDropAddress.siDo;
  dropAddressInfo.siGunGu = orderDropAddress.siGunGu;
  dropAddressInfo.eupMyeonDong = orderDropAddress.eupMyeonDong;
  dropAddressInfo.ri = orderDropAddress.ri;
  dropAddressInfo.mainLandNumber = orderDropAddress.mainLandNumber;
  dropAddressInfo.subLandNumber = orderDropAddress.subLandNumber;
  dropAddressInfo.mainBuildingNumber = orderDropAddress.mainBuildingNumber;
  dropAddressInfo.subBuildingNumber = orderDropAddress.subBuildingNumber;
  dropAddressInfo.roadName = orderDropAddress.roadName;
  dropAddressInfo.buildingName = orderDropAddress.buildingName;
  fetchDeliveryPossible();
};

// 타입에 따라 데이터 바인딩 후 close
const onDataSetAndclose = ({ type, value, isUntact }) => {
  if (type === 'MEMO') {
    isShowRequestMemoBottom.value = false;
    if (value) {
      form.storeOrderMemo = value;
    }

    if (isUntact !== undefined) {
      form.isUntact = isUntact;
    }
  }

  if (type === 'PREPARE') {
    form.productPrepareTime = `${value} ${t('common.dateTime.minute')}`;

    if (form.jibunAddress) {
      fetchDeliveryPossible();
    }
    isShowProductPrepareBottom.value = false;
  }

  if (type === 'PAYMENT') {
    isShowMixPaymentLayer.value = false;
    if (value) {
      form.prepaidPrice = stringToNumber(value.preparePrice);
      form.paymentCashPrice = stringToNumber(value.cashPrice);
      form.paymentCardPrice = stringToNumber(value.creditCardPrice);
    }
  }
};

const openAddressLayer = () => {
  common.$state.address = null;
  isShowAddressLayer.value = true;
};

// 요청사항 모달 오픈
const openRequestMemoModal = () => {
  isShowRequestMemoBottom.value = true;
};

// 상품금액((단가+옵션총액 *) 수량) < 상품총금액 인 경우, 임의 옵션을 추가
const _adjustOrderProducts = (orderProducts) =>
  orderProducts.map((orderProduct) => {
    const _orderProduct = { ...orderProduct };
    const orderProductOptions = orderProduct.options || orderProduct.orderProductOptions || [];
    const sumOptionPrice = orderProductOptions.reduce((sumPrice, orderProductOption) =>
      (sumPrice + (orderProductOption.unitPrice * orderProductOption.quantity)), 0);

    const sumProductAndOptionPrice =
            (orderProduct.unitPrice + sumOptionPrice) * orderProduct.quantity;

    if (sumProductAndOptionPrice < orderProduct.totalPrice) {
      const optionUnitPrice =
        (orderProduct.totalPrice - sumProductAndOptionPrice) / orderProduct.quantity;
      _orderProduct.orderProductOptions?.push({
        quantity: 1,
        name: `>> ${t('views.createOrder.tempProductOption')}`,
        unitPrice: optionUnitPrice,
      });
    }

    return _orderProduct;
  });

/**
 * 메뉴금액 변경시 임의상품 처리
 */
watch(() => form.actualPayPrice, (newPrice) => {
  // 맥도날드 주문 중 세트 메뉴 옵션을 다른 걸로 변경할 경우, 상품 금액과 상품 총금액이 맞지 않는 케이스 발생함
  // 해당 케이스인 경우, 임의상품이 추가되는 버그가 있어서, 임의옵션 추가하도록 함
  if (form.orderAgencyId) {
    form.orderProducts = _adjustOrderProducts(form.orderProducts);
  }

  // 입력된 메뉴금액
  const _newActualPayPrice = stringToNumber(newPrice);
  const tempProduct = getTemporaryProduct(form.orderProducts);

  if (_newActualPayPrice > getProductPriceExcludeTemporary(form.orderProducts)) {
    // 임의상품이 이미 존재하는 경우 임의상품의 금액을 조절
    if (tempProduct) {
      tempProduct.totalPrice =
        _newActualPayPrice - getProductPriceExcludeTemporary(form.orderProducts);
      tempProduct.unitPrice = tempProduct.totalPrice;
    } else {
      // 임의상품이 없다면 임의상품을 추가
      _orderDefaultProduct.totalPrice =
        _newActualPayPrice - getProductPriceExcludeTemporary(form.orderProducts);
      _orderDefaultProduct.unitPrice = _orderDefaultProduct.totalPrice;

      form.orderProducts.push(_orderDefaultProduct);
    }
  } else if (tempProduct) {
    // 입력한 금액이 메뉴금액의 총합보다 작거나 같은 경우
    // 주문 상품에서 임의상품 제거
    form.orderProducts.splice(form.orderProducts.findIndex((value) => value === tempProduct), 1);
  }
});

/**
 * 1회용 컵 보증금
 */
const isTaxFreePayPriceApplied = computed(() => auth.currentStore?.isTaxFreePayPriceApplied);
const cupDepositCount = ref(0);
const actualPayPriceTitle = computed(() => {
  let title = t('views.createOrder.inputField.actualPayPrice.title');

  if (cupDepositCount.value > 0) {
    title += ` (*${t('views.createOrder.cupDeposit')} ${t('views.createOrder.cupDepositInclusion')})`;
  }

  return title;
});

// 메뉴금액과 총 컵보증금 비교
const compareActualTaxFreePrice = () => {
  // 메뉴금액이 총 보증금보다 작을 경우
  if (stringToNumber(form.actualPayPrice) < form.taxFreePayPrice) {
    common.showToast('error', `${t('views.createOrder.message.menuPriceNotSetting', { price: numberWithCommas(form.taxFreePayPrice) })}`);
  }
  return stringToNumber(form.actualPayPrice) < form.taxFreePayPrice;
};

watch(cupDepositCount, (newCnt) => {
  const _actualPayPrice = stringToNumber(form.actualPayPrice);
  // 보증금(300원) * 컵 개수
  form.taxFreePayPrice = (CUP_DEPOSIT * stringToNumber(newCnt));

  // 총보증금 > 메뉴금액 보다 클 경우
  if (form.taxFreePayPrice > _actualPayPrice) {
    common.showToast('error', `${t('views.createOrder.message.cupDepositOverPriceMenu', { price: numberWithCommas(form.taxFreePayPrice) })}`);
    // 너무 낮은 금액으로 수정 했을 경우 watch가 반복적으로 실행 되기때문에
    // 수정된 금액 보다 크지 않도록 보증금 개수 강제 수정
    cupDepositCount.value = Math.floor(_actualPayPrice / CUP_DEPOSIT);
    form.taxFreePayPrice = CUP_DEPOSIT * cupDepositCount.value;
  }

  // 99개에서 plus 버튼 누를 경우
  if (newCnt > 99) {
    common.showToast('error', `${t('views.createOrder.message.cupDepositMaxcount')}`);
    cupDepositCount.value = 99;
  }
});

// 입력된 메뉴금액과 컵보증금 비교
watch(() => form.actualPayPrice, (newPrice, oldPrice) => {
  const _newActualPayPrice = stringToNumber(newPrice);

  // 메뉴금액이 총 보증금보다 작을 경우
  if (_newActualPayPrice < form.taxFreePayPrice) {
    common.showToast('error', `${t('views.createOrder.message.menuPriceNotSetting', { price: numberWithCommas(form.taxFreePayPrice) })}`);
    form.actualPayPrice = stringToNumber(oldPrice);
  }

  if (_newActualPayPrice >= sumOrderTotalPayPrice(form.orderProducts)) {
    discountAmount.value = 0;
    return;
  }
  discountAmount.value = sumOrderTotalPayPrice(form.orderProducts) - _newActualPayPrice;
});

const submitForm = async (type) => {
  // 총 보증금이 메뉴금액보다 클경우
  if (compareActualTaxFreePrice()) {
    common.showToast('error', `${t('views.createOrder.message.menuPriceNotSetting', { price: numberWithCommas(form.taxFreePayPrice) })}`);
    return;
  }

  // 컵보증금이 포함되면 결제수단 선결제만으로 불가능
  if (isTaxFreePayPriceApplied.value && form.taxFreePayPrice > 0 &&
          stringToNumber(form.actualPayPrice) === stringToNumber(form.prepaidPrice)
  ) {
    common.showToast('error', `${t('views.createOrder.mixPayment.toastMessage.notPrepaid')}`);
    return;
  }

  // 비대면일 경우 선결제만 가능
  if (form.isUntact) {
    if (
      stringToNumber(form.paymentCardPrice) > 0 ||
            stringToNumber(form.paymentCashPrice) > 0
    ) {
      common.showToast('error', `${t('views.createOrder.message.errorIsUntact')}\n${t('views.createOrder.message.fixAndRetry')}`);
      return;
    }
  }

  // 맥도날드 주문의 경우, 주문상품 가격이 잘못된 케이스가 발생할 수 있어서 추가됨
  if (form.orderAgencyId) {
    // 맥도날드 주문 중 세트 메뉴 옵션을 다른 걸로 변경할 경우, 상품 금액과 상품 총금액이 맞지 않는 케이스 발생함
    form.orderProducts = _adjustOrderProducts(form.orderProducts);

    if (!isValidOrderProductsPrice(form.orderProducts)) {
      common.showToast('error', t('views.createOrder.message.invalidOrderTotalPrice'));
      Sentry.captureException(new Error('OrderProductsPrice is invalid'));
      return;
    }
  }

  // 메뉴가 없으면 임의상품
  if (form.orderProducts.length === 0) {
    _orderDefaultProduct.unitPrice = stringToNumber(form.actualPayPrice);
    _orderDefaultProduct.totalPrice = stringToNumber(form.actualPayPrice);
    form.orderProducts.push(_orderDefaultProduct);
  }

  // 상품 준비시간 최소값은 5분입니다.
  let prepareMinute = parseInt(form.productPrepareTime, 10);
  if (prepareMinute <= 0) {
    prepareMinute = 5;
  }

  // 요청 직전 pickupWishAt 을 설정해 주어서 요청 당시의 시간으로 요청하게 합니다.
  form.pickupWishAt =
    common.systemTimestamp + ONE_MINUTE * prepareMinute;

  const orderPayload = {
    storeId: auth.currentStore.storeId,
    dropJibunAddress: form.jibunAddress,
    dropRoadAddress: form.roadAddress,
    dropAddressDetail: form.dropAddressDetail || '',
    ordererName: form.ordererName?.substring(0, 10),
    ordererPhone: form.ordererPhone.replace(/-/g, ''),
    receiverPhone: form.ordererPhone.replace(/-/g, ''),
    storeOrderMemo: form.storeOrderMemo,
    ordererOrderMemo: form.ordererOrderMemo,
    orderProducts: form.orderProducts,
    totalPayPrice: sumOrderTotalPayPrice(form.orderProducts),
    prepaidPrice: stringToNumber(form.prepaidPrice),
    actualPayPrice: stringToNumber(form.actualPayPrice),
    paymentCashPrice: stringToNumber(form.paymentCashPrice),
    paymentCardPrice: stringToNumber(form.paymentCardPrice),
    deferredPrice:
            stringToNumber(form.paymentCashPrice) + stringToNumber(form.paymentCardPrice),
    taxFreePayPrice: form.taxFreePayPrice,
    isUntact: form.isUntact,
    dropAddressInfo,
  };

  if (form.orderAgencyId) {
    orderPayload.orderAgencyId = form.orderAgencyId;
    orderPayload.orderAgencyStoreId = form.orderAgencyStoreId;
    orderPayload.orderAgencyOrderId = form.orderAgencyOrderId;
  }

  // TODO: 서버 요청 결과에 대한 화면 전환 시나리오
  // - 주문생성 에러 -> 주문서작성(현재페이지유지)
  // - 주문생성 성공, 배달요청 에러 또는 거절) -> 접수대기 탭
  // - 주문생성 성공, 배달요청 성공 -> 접수 탭
  common.setIsOverlayLoading(true);
  let _createDeliveryOrder;
  try {
    // 다시 주문 생성 요청
    if (reOrderAdditionForm.parentOrderId) {
      // 다시 주문시 요청시 불필요한 속성 삭제
      deleteOrderProductsProperty(form.orderProducts);
      delete orderPayload.ordererOrderMemo;
      delete orderPayload.ordererName;

      const { createDeliveryReorder } = await orderStore.createDeliveryReorder(
        { ...orderPayload,
          ...reOrderAdditionForm,
          orderProducts: form.orderProducts,
        },
      );
      _createDeliveryOrder = createDeliveryReorder;
    } else {
      const { createDeliveryOrder } = await orderStore.createDeliveryOrder(orderPayload);
      _createDeliveryOrder = createDeliveryOrder;
    }
  } catch (err) {
    common.setIsOverlayLoading(false);

    const errorCode = errors.convertedError?.code;
    // NOTE: 이미 생성된 주문이 있는 경우
    if (errorCode === 'DUPLICATED_ID') {
      duplicatedOrderId.value = errors.convertedError?.info?.orderId;
      isShowDuplicationModal.value = true;
      return;
    }

    common.showToast('error', t(`errors.createDeliveryOrder.${errorCode}`, t('errors.createDeliveryOrder.GENERAL_ERROR')));

    logger.error(err);
    Sentry.captureException(err);
    return;
  }

  const response = {
    code: '',
    isSuccess: false,
  };
  try {
    const { requestDelivery } = await delivery.requestDelivery({
      storeId: auth.currentStore.storeId,
      orderId: _createDeliveryOrder.orderId,
      deliveryType: type,
      pickupWishAt: form.pickupWishAt,
      isUntact: form.isUntact,
    });
    response.isSuccess = requestDelivery.isSuccess;

    if (!requestDelivery.isSuccess) {
      response.code = requestDelivery.reason;
    }
  } catch (err) {
    response.code = errors.convertedError.code;
    logger.error(err);
    Sentry.captureException(err);
  }

  if (!response.isSuccess) {
    common.showToast('error', t(`errors.requestDelivery.${response.code}`, t('errors.requestDelivery.UNKNOWN_SERVER_ERROR')));
  }

  isOrderWrittenCancel.value = false;
  router.push({ name: 'Main' });
};

// 결제수단 변경
const changePaymentMethod = (_item) => {
  const item = _item;
  form[item.field] = form.actualPayPrice;

  paymentMethod.forEach((value) => {
    if (value.type !== item.type) {
      form[value.field] = 0;
    }
  });
};

const handleGotoView = (gotoRoute) => {
  isOrderWrittenCancel.value = false;
  router.push(gotoRoute);
};

// 맥도날드 / 다시주문 시 주문정보 셋 함수
const setOrderFormData = async (order) => {
  const {
    ordererName,
    ordererPhone,
    dropJibunAddress,
    dropRoadAddress,
    dropAddressDetail,
    dropUnknownAddress,
    totalPayPrice,
    actualPayPrice,
    prepaidPrice,
    paymentCashPrice,
    paymentCardPrice,
    taxFreePayPrice,
    storeOrderMemo,
    ordererOrderMemo,
    orderProducts,
  } = order;

  // 다시주문일경우 메모의 우선순위 ordererOrderMemo
  form.storeOrderMemo = ordererOrderMemo || storeOrderMemo;

  form.ordererName = ordererName;
  form.ordererPhone = addHyphenPhoneNumber(ordererPhone);
  form.orderProducts.push(...orderProducts);
  form.dropAddressDetail = dropAddressDetail;

  // 다시주문 시 이미 있는 주소 정보로 설정함
  const { orderDropAddress } = order;
  if (orderDropAddress) {
    settingOrderDropAddress(orderDropAddress);
  } else {
    // s9s 주소검색하여 주소 정보 설정함.

    let addressRes = await common.findAddressKeyword(dropRoadAddress);

    /*
      도로명으로 검색 해보고, 없거나 여러건인 경우 지번으로 다시 검색하도록 함
      errorcode 0 : 성공
      errorcode 1 : 1건 이상의 결과가 있지만 동일한 주소이거나 구주소, 지번주소 등의 주소로 1건만 검색되었을 때 -> 성공 케이스

      errorcode 2 : 다수의 결과가 있을 때 (이 부분도 우선은 다시 검색하도록 하긴 했는데 고민 필요)
      errorcode 3 : 결과가 250건 이상일 때
      errorcode 4 : 구 주소에서 1건 이상을 찾았을 경우 (고민 필요)
      errorcode 404 : 결과 없음
    */
    if (addressRes.errorcode !== 0 && addressRes.errorcode !== 1) {
      addressRes = await common.findAddressKeyword(dropJibunAddress);
    }

    // 도로명으로 검색 해보고, 없거나 너무 많다면(errorCode가 3번) 언노운 타입으로 다시 검색하도록 함
    if (addressRes.errorcode !== 0 && addressRes.errorcode !== 1) {
      await common.findAddressKeyword(dropUnknownAddress);
    }

    closeAndSettingAddress(common.getAddressList[0], { dropJibunAddress, dropRoadAddress });
  }

  form.actualPayPrice = numberWithCommas(actualPayPrice);
  form.prepaidPrice = prepaidPrice;
  form.paymentCashPrice = paymentCashPrice;
  form.paymentCardPrice = paymentCardPrice;
  form.taxFreePayPrice = taxFreePayPrice;

  const paymentMethodType = getPaymentMethod(order);
  // 컵 보증금이 있고 선결제가 아닌 경우 컵 보증금 count
  if (taxFreePayPrice > 0 && paymentMethodType !== PAYMENT_METHOD.PREPAID) {
    cupDepositCount.value = taxFreePayPrice / CUP_DEPOSIT;
  }

  // 배달팁
  deliveryTipAmount.value = deliveryTipPrice({ orderProducts });

  // 할인
  discountAmount.value = totalPayPrice - actualPayPrice;

  // 결제 수단 선택
  const paymentMethodItem = paymentMethod.find((item) => item.type === paymentMethodType);
  if (paymentMethodItem) {
    paymentMethodItem.active = true;
  }
};

const isReOrder = ref(false);
const isReOrderConfirm = ref(false);
onMounted(async () => {
  const reOrder = route.query;

  // 다시 주문을 통해 주문서 작성 페이지로 올 경우
  if (reOrder?.reorderId) {
    isExistOrderData.value = true;
    isReOrder.value = true;
    try {
      await orderDetailStore.order({
        storeId: auth.currentStore.storeId,
        orderId: Number(reOrder.reorderId),
      });

      const payload = {
        ...orderDetailStore.getOrder,
        paymentMethodType: orderDetailStore.getOrder.prepaidMethod,
      };

      // form data binding
      setOrderFormData(payload);

      reOrderAdditionForm.parentOrderId = Number(reOrder.reorderId);
      reOrderAdditionForm.reorderType = reOrder.reorderType;
      reOrderAdditionForm.reorderReason = reOrder.reorderReason;
      reOrderReason.value = t(`common.deliveryAdditionType.${reOrder.reorderType}`);

      if (reOrder.reorderReason) {
        reOrderReason.value += `(${reOrder.reorderReason})`;
      }
    } catch (err) {
      logger.error(errors.convertedError.code);
      Sentry.captureException(errors.convertedError.code);
    }
  }

  // 맥도날드 해시데이터 체크
  if (route.hash) {
    isExistOrderData.value = true;
    const hashValue = route.hash.slice(1);
    let parsedData;
    try {
      parsedData = parseMcdonaldOrder(hashValue);
    } catch (err) {
      logger.error(err);
      Sentry.captureException(err);
    }

    // set form데이터 맥도날드 주문 정보
    const { orderAgencyStoreId, orderAgencyOrderId } = parsedData;
    form.orderAgencyId = 'mcdonald';
    form.orderAgencyStoreId = orderAgencyStoreId;
    form.orderAgencyOrderId = orderAgencyOrderId;

    setOrderFormData(parsedData);
  }
});

// 메뉴 금액 초기화('') 입력시 결제수단도 초기화 처리
watch(() => form.actualPayPrice, (newVal, oldVal) => {
  isSnackbar.value = false;

  // 초기 데이터 설정 시에는 결제수단 초기화 하지 않음 (맥도날드 주문, 다시주문인 경우)
  if (!oldVal && isExistOrderData.value) {
    return;
  }

  if (newVal !== oldVal) {
    paymentMethod.forEach((item) => {
      item.active = false;
    });
    form.paymentCardPrice = 0;
    form.paymentCashPrice = 0;
    form.prepaidPrice = 0;
  }
});

watchEffect(() => {
  if (
    form.ordererPhone &&
        isSuccessAddressSearch && form.jibunAddress && // 서버에서 지번주소가 필수임
        ((stringToNumber(form.prepaidPrice) ||
          stringToNumber(form.paymentCardPrice) ||
          stringToNumber(form.paymentCashPrice)) > 0 ||
          form.actualPayPrice === '0')
  ) {
    // 다시 주문일 경우 주문 확인 체크 로직 추가
    if (isReOrder.value && !isReOrderConfirm.value) {
      isDisabled.value = true;
      return;
    }
    isDisabled.value = false;
  } else {
    isDisabled.value = true;
  }
});

const isShowOverlayView = computed(() =>
  isShowAddressLayer.value
  || isShowDropMapLayer.value
  || isShowMixPaymentLayer.value
  || isShowRequestMemoBottom.value
  || isShowProductPrepareBottom.value);

const closeOverlayView = () => {
  isShowAddressLayer.value = false;
  isShowMixPaymentLayer.value = false;
  isShowRequestMemoBottom.value = false;
  isShowProductPrepareBottom.value = false;
  isShowDuplicationModal.value = false;
};

// 내용 작성했는지 여부
// (computed로 하게 될 경우 값을 입력할때마다 연산을 다시 하게 되어 필요한 시점에 호출해서 확인)
const getIsWritten = () => {
  const {
    ordererPhone,
    jibunAddress,
    dropAddress,
    dropAddressDetail,
    actualPayPrice,
    storeOrderMemo,
  } = form;

  return ordererPhone
        || jibunAddress
        || dropAddress
        || dropAddressDetail
        || actualPayPrice
        || storeOrderMemo;
};

defineExpose({
  isOrderWrittenCancel,
  isShowOverlayView,
  closeOverlayView,
  getIsWritten,
});
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

  background: #ffffff;

  border: 1px solid $color-gray-bd;
  border-radius: 4px;

  flex: none;
  order: 1;
  flex-grow: 0;
}

.error-border {
  border: 1px solid $color-red-e5;
}
.error-text {
  color: $color-red-e5;
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
