<template>
  <div class="datepicker-component">
    <div
      class="dimm-background"
      v-if="isDimmBackground && isDimm"
      @click.self.prevent
    />
    <Datepicker
      ref="datepicker"
      :class="getDatepickerStyle"
      v-model="bindDate"
      range
      hide-offset-dates
      :month-change-on-scroll="false"
      :enable-time-picker="false"
      week-start="0"
      :min-date="getMinDate"
      :max-date="today"
      :format="getFormat"
      :cancel-text="`${$t('common.button.close')}`"
      :select-text="`${$t('common.button.apply')}`"
      :locale="locale"
      :teleport="`#${teleportId}`"
      teleport-center
      @open="openDimm"
      @closed="closeDimm"
    >
      <template v-if="isKorean" #year="{ year }"> {{ year }}년 </template>
    </Datepicker>
    <slot :openCalendar="openCalendar"></slot>
  </div>
</template>

<script setup name="StoreDatePicker">
import { computed, ref, defineEmits, defineExpose } from 'vue';
import Datepicker from '@vuepic/vue-datepicker';
import { useI18n } from 'vue-i18n';

const props = defineProps({
  // 달력 아이콘을 클릭했을 때 나오는 캘린더 팝업이 어떤 부모 아래에 위치할 것인지 정의
  // teleportId와 동일한 이름의 id를 가진 element가 있어야 사용 가능
  teleportId: {
    type: String,
    required: true,
  },
  // 실제 연결할 날짜 데이터
  date: {
    type: Array,
    required: true,
  },
  // 선택 가능한 최소 날짜 (며칠 전부터 선택 가능한지)
  minDateNumber: {
    type: Number,
    default: 30,
  },
  // 달력 아이콘 - 날짜 숨김 여부
  hideInput: {
    type: Boolean,
    default: true,
  },
  // 배경에 딤 처리 여부
  isDimmBackground: {
    type: Boolean,
    default: true,
  },
});

const emits = defineEmits(['update:date']);

const { locale } = useI18n();
const isKorean = computed(() => locale.value === 'ko');

const datepicker = ref(null);
const openCalendar = () => {
  datepicker.value.openMenu();
};
defineExpose({ openCalendar });

const getDatepickerStyle = computed(() => ({
  'header-direction-reverse': isKorean.value,
  'visible-datepicker': props.hideInput,
}));

const today = new Date();
const getMinDate = computed(() => {
  const minDate = new Date(new Date().setDate(today.getDate() - props.minDateNumber));
  return minDate;
});

const getFormat = (format) => {
  if (format.length < 2) {
    return null;
  }

  const startYear = format[0].getFullYear();
  const startMonth = format[0].getMonth() + 1;
  const startDay = format[0].getDate();

  const endYear = format[1].getFullYear();
  const endMonth = format[1].getMonth() + 1;
  const endDay = format[1].getDate();

  if (isKorean.value) {
    return `${startYear}년 ${startMonth}월 ${startDay}일 ~ ${endYear}년 ${endMonth}월 ${endDay}일`;
  }

  return `${startMonth}/${startDay}/${startYear} - ${endMonth}/${endDay}/${endYear}`;
};

const bindDate = computed({
  get: () => props.date,
  set: (dates) => {
    if (!dates[1]) {
      // 구조분해 할당 형태로 하지 않으면 린트 에러가 발생하여 아래와 같이 적용
      [dates[1]] = dates;
    }
    emits('update:date', dates);
  },
});

const isDimm = ref(false);
const openDimm = () => {
  isDimm.value = true;
};
const closeDimm = () => {
  isDimm.value = false;
};
</script>
<style lang="scss" scoped>
.datepicker-component {
  z-index: 80001;
  position: fixed;
  top: 0;
  left:0;

  .dimm-background {
    pointer-events: auto;
    background: rgba(0, 0, 0, 0.32);
    border-radius: inherit;
    bottom: 0;
    left: 0;
    position: fixed;
    width:100vw;
    height: 100vh;
  }

  .visible-datepicker {
    display: none;
  }

  :deep(.header-direction-reverse) ~ .dp__menu {
    .dp__instance_calendar {
      .dp__month_year_row {
        .dp__month_year_wrap {
          flex-direction: row-reverse !important;
        }
      }
    }
  }

  :deep(.dp__menu) {
    border-radius: 8px;

    .dp__arrow_top {
      display: none;
    }

    .dp__instance_calendar {
      .dp__month_year_row {
        justify-content: flex-end;
        height: 88px;
        background-color: $color-primary;
        border-radius: 8px 8px 0 0;
        padding: 16px;

        .dp__month_year_col_nav {
          .dp__inner_nav {
            color: $color-gray-ff;

            &:hover {
              color: $color-primary;
            }
          }
        }
        .dp__month_year_wrap {
          .dp__month_year_select {
            width: 100%;
            color: $color-gray-ff;
            font-weight: 700;
            font-family: Spoqa Han Sans Neo, sans-serif;
            font-size: 24px;
            line-height: 32px;

            &:hover {
              color: $color-primary;
            }
          }
        }
      }

      .dp__calendar {
        .dp__calendar_wrap {
          .dp__calendar_header {
            font-family: Spoqa Han Sans Neo, sans-serif;
            font-size: 14px;
            font-weight: 400;
            color: rgba(0, 0, 0, 0.38);
            line-height: 20px;
            gap: 2px;
            width: 100%;
            padding: 0 14px;

            .dp__calendar_header_item {
              width: 32px;
              height: 32px;
              padding: 0;
              display: flex;
              justify-content: center;
              align-items: center;
            }
          }

          .dp__calendar {
            display: flex;
            flex-direction: column;
            gap: 4px;
            width: 100%;
            padding: 0 14px;
            margin-top: 10px;

            .dp__calendar_row {
              margin: 0;
              gap: 4px;

              .dp__calendar_item {
                border-radius: 100%;
                width: 32px;
                height: 32px;
                .dp__cell_inner {
                  font-size: 12px;
                  font-family: Spoqa Han Sans Neo, sans-serif;
                  font-weight: 400;
                  border-radius: 100%;
                  box-sizing: border-box;
                  width: 100%;
                  height: 100%;

                }

                .dp__pointer {
                  &:hover {
                    color: #000;
                    background-color: #f3f3f3;
                  }
                }

                .dp__range_start,
                .dp__range_end,
                .dp__range_between {
                  background-color: $color-primary;
                  color: $color-gray-ff;
                  border: none;
                }

                .dp__cell_disabled {
                  background-color: $color-gray-ff;
                  color: #c0c4cc;
                }

                .dp__today {
                  color: $color-primary;
                }

                .dp__today.dp__range_start {
                  color: $color-gray-ff;

                  &:hover {
                    color: #212121;
                  }
                }

                .dp__today.dp__range_between {
                  border: solid 1px $color-primary;
                  color: $color-gray-ff;

                  &:hover {
                    color: $color-gray-ff;
                  }
                }

                .dp__today.dp__range_end {
                  color: $color-gray-ff;

                  &:hover {
                    color: $color-gray-ff;
                    background-color: $color-primary;
                  }
                }
              }
            }
          }
        }
      }
    }

    .dp__action_row {
      flex-direction: column;
      align-items: flex-start;

      .dp__selection_preview {
        width: 100%;
        height: 20px;
        text-align: center;
      }

      .dp__action_buttons {
        width: 100%;
        display: flex;
        align-items: center;
        gap: 8px;
        margin-top: 10px;
        font-family: Spoqa Han Sans Neo, sans-serif;
        font-size: 14px;
        font-weight: 700;
        line-height: 20px;

        .dp__action {
          flex: 1;
          display: flex;
          justify-content: center;
          align-items: center;
          height: 52px;
        }

        .dp__cancel {
          border-radius: 4px;
          border: solid 1px #bdbdbd;
          color: #757575;
        }

        .dp__select {
          border-radius: 4px;
          background-color: $color-primary;
          color: $color-gray-ff;
        }
      }
    }
  }
}
</style>
