<template>
  <StoreCommonLayer v-bind="{ dialog }" bottom @close="emit('close-layer')">
    <template #header>
      {{ $t('views.orderDetail.reorderLayer.title') }}
    </template>
    <template #content>
      <VForm>
        <VRow class="px-2 pb-2 flex-column text-center" no-gutters>
          <VCol class="text-left">
            {{ $t('views.orderDetail.reorderLayer.description') }}
          </VCol>
          <VCol class="mt-4 text-left">
            <StoreTextField
              name="reorderType"
              v-model="reorderTypeValue"
              :placeholder="
                $t('views.orderDetail.reorderLayer.label.reorderTypePlaceholder')"
              :title="$t('views.orderDetail.reorderLayer.label.reorderType')"
              variant="outlined"
              :dark="true"
              maxlength="30"
              append-inner-icon="mdi-menu-down"
              @click="isShowReorderTypeModal = true"
              required
            />
          </VCol>
          <VCol class="mt-4 text-left">
            <StoreTextarea
              name="reorderReason"
              v-model="form.reorderReason"
              :title="$t('views.orderDetail.reorderLayer.label.reorderReason')"
              variant="outlined"
              :dark="true"
              maxlength="40"
              :disabled="!reorderReasonRequired"
              :required="reorderReasonRequired"
            />
            <StoreErrorMessageText
              v-if="reorderReasonRequired && form.reorderReason.length <= 0"
              errorMessage="상세 사유를 1자 이상 40자 이하로 작성해 주세요."
              icon
              class="mt-4"
            />
          </VCol>
        </VRow>
      </VForm>
    </template>
    <template #footer>
      <div class="d-flex">
        <VCol class="pa-0 pl-1">
          <StoreButton
            block
            color="primary"
            :disabled="!form.reorderType
              || (reorderReasonRequired && !form.reorderReason)"
            @click.stop="handleReorder"
          >
            <span class="font-weight-bold">
              {{ $t('views.orderDetail.reorderLayer.button.reorder') }}
            </span>
          </StoreButton>
        </VCol>
      </div>
    </template>
  </StoreCommonLayer>

  <!-- 다시 주문 사유 바텀시트-->
  <SelectTranslatedValueBottomSheet
    v-model:visible="isShowReorderTypeModal"
    :title="$t('views.orderDetail.reorderLayer.label.reorderType')"
    :description="$t('views.orderDetail.reorderLayer.label.description')"
    typeTranslator="common.reorderType"
    :valueOptions="reorderTypeOptions"
    :selectedValue="form.reorderType"
    type="REORDER_TYPE"
    @set-data="handleSetData"
    @close-layer="closeLayer"
  />
</template>

<script>
import { defineComponent, ref, computed, reactive, watch } from 'vue';
import { useLocale } from 'vuetify';
import { useRouter } from 'vue-router';

import { REORDER_TYPE } from '@/constants';

import StoreCommonLayer from '@/components/common/StoreCommonLayer.vue';
import StoreTextField from '@/components/common/StoreTextField.vue';
import StoreTextarea from '@/components/common/StoreTextarea.vue';
import StoreErrorMessageText from '@/components/common/StoreErrorMessageText.vue';
import StoreButton from '@/components/common/StoreButton.vue';
import SelectTranslatedValueBottomSheet from '@/components/order/common/SelectTranslatedValueBottomSheet.vue';

export default defineComponent({
  components: {
    StoreCommonLayer,
    StoreTextField,
    StoreTextarea,
    StoreErrorMessageText,
    StoreButton,
    SelectTranslatedValueBottomSheet,
  },
  name: 'ReorderLayer',
  props: {
    dialog: {
      type: Boolean,
      default: false,
    },
    order: {
      type: Object,
      required: true,
    },
    action: {
      type: Object,
    },
  },
  emits: ['close-layer'],
  setup(props, { emit }) {
    const { t } = useLocale();
    const router = useRouter();

    const isShowReorderTypeModal = ref(false);

    const form = reactive({
      reorderType: '',
      reorderReason: '',
    });

    const REASON_REQUIRED_TYPES = [
      REORDER_TYPE.MISTAKE_STORE,
      REORDER_TYPE.MISTAKE_CUSTOMER,
      REORDER_TYPE.MISTAKE_DELIVERY,
      REORDER_TYPE.ETC,
    ];

    watch(() => form.reorderType, (newValue) => {
      if (!REASON_REQUIRED_TYPES.includes(newValue)) {
        form.reorderReason = '';
      }
    });

    const handleSetData = ({ type, value }) => {
      if (type === 'REORDER_TYPE') {
        isShowReorderTypeModal.value = false;
        if (value) {
          form.reorderType = value;
        }
      }
    };

    const closeLayer = () => {
      isShowReorderTypeModal.value = false;
    };

    const handleReorder = async () => {
      emit('close-layer');
      router.replace({
        name: 'CreateOrder',
        query: {
          reorderId: props.order.orderId,
          reorderType: form.reorderType,
          reorderReason: form.reorderReason,
        },
      });
    };

    return {
      reorderTypeValue: computed(() => (form.reorderType ? t(`common.reorderType.${form.reorderType}`) : '')),
      reorderTypeOptions: Object.values(REORDER_TYPE),
      isShowReorderTypeModal,
      reorderReasonRequired: computed(() => REASON_REQUIRED_TYPES.includes(form.reorderType)),
      handleSetData,
      form,
      closeLayer,
      handleReorder,
      emit,
    };
  },
});
</script>

<style lang="scss" scoped>
.checkbox {
  margin-left: -1rem;
}
</style>
