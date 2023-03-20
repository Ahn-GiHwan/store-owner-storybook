<template>
  <VSnackbar
    v-model="snackbar"
    multi-line
    location="top"
    timeout="-1"
    width="100%"
    max-width="49rem"
    color="#F5F5F5"
    @update:modelValue="handleModalEvent"
    @click="handleClick"
  >
    <VRow class="ma-0">
      <VCol class="pa-0 d-flex justify-space-between">
        <div class="w-100 d-flex align-center">
          <VIcon
            icon="mdi-alert-circle-outline"
            :color="$props.alertMessage.isPositive ? '#41CF6D' : '#E53935'"
            size="1.33rem"
            class="mr-1"
          />
          <p class="title d-inline">
            {{ $props.alertMessage.title }}
          </p>
          <span
            v-if="$props.alertMessage.subtitle"
            class="subtitle"
          >
            {{ $props.alertMessage.subtitle }}
          </span>
        </div>
        <div class="close-button-wrap">
          <VBtn
            variant="text"
            @click.stop="handleClose"
            class="pa-0 text-right"
            size="x-small"
            icon="mdi-close"
            color="#000000"
          />
        </div>
      </VCol>
    </VRow>
    <VDivider class="my-2" color="#CBCBCB"/>
    <VRow class="ma-0">
      <VCol class="pa-0 d-flex justify-space-between">
        <span class="content">{{ $props.alertMessage.message }}</span>
        <span class="time">{{ timestampToDateTime($props.alertMessage.time, 'HH:mm') }}</span>
      </VCol>
    </VRow>
    <audio
      hidden="true"
      ref="audio"
    >
      <source :src="alertSoundEffect" type="audio/wav">
    </audio>
    <div
      class="more py-2 px-8"
      v-if="snackbar && $props.waitingMessageCount > 0"
      @click.stop="handleClose"
    >
      +{{ $props.waitingMessageCount }}개 알림 보기
    </div>
  </VSnackbar>
</template>

<script>
import { defineComponent, ref, onMounted } from 'vue';

import alertSoundEffect from '@/assets/sounds/alert.wav';
import { timestampToDateTime } from '@/utils/dateUtils';

export default defineComponent({
  name: 'StoreAlertMessageItem',
  props: {
    alertMessage: {
      type: Object,
      required: true,
    },
    waitingMessageCount: {
      type: Number,
      default: 0,
    },
  },
  emits: ['closed'],
  setup(props, { emit }) {
    const snackbar = ref(true);
    const audio = ref(null);

    onMounted(() => {
      const promise = audio.value?.play();
      if (promise) {
        promise.then(() => {
          // Autoplay started!
        }).catch(() => {
          // Autoplay was prevented.
          // Show a "Play" button so that user can start playback.
        });
      }
    });

    const closeModal = () => {
      snackbar.value = false;
      emit('closed', props.alertMessage.id);
    };

    return {
      snackbar,
      audio,
      alertSoundEffect,
      timestampToDateTime,
      handleModalEvent: (modelValue) => {
        // 자동으로 닫힐 때 호출됨
        if (!modelValue) {
          emit('closed', props.alertMessage.id);
        }
      },
      handleClick: () => {
        // DSM을 클릭할 때 호출됨
        closeModal();
        if (props.alertMessage.action) {
          props.alertMessage.action();
        }
      },
      handleClose: () => {
        // 닫기 버튼을 누를 때 호출됨
        closeModal();
      },
    };
  },
});
</script>

<style lang="scss" scoped>
.title {
  color: #000000;
  font-weight: 500;
  line-height: 20px;
  font-size: 12px;
  min-width: 8rem;
}
.subtitle {
  font-weight: 400;
  line-height: 20px;
  font-size: 12px;
  color: #666666;

  text-overflow: ellipsis;
  word-wrap: break-word;
  word-break: break-all;
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  line-clamp: 1;
  max-height: 2rem;
}
.close-button-wrap {
  margin: -1rem -1.2rem;
}
.content {
  line-height: 20px;
  font-size: 12px;
  color: #616161;

  text-overflow: ellipsis;
  word-wrap: break-word;
  word-break: break-all;
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  line-clamp: 1;
  max-height: 2rem;
}
.time {
  min-width: 4rem;
  line-height: 20px;
  font-size: 12px;
  color: #666666;
}
.more {
  position: absolute;
  bottom: -4rem;
  right: 0.4rem;
  background: #F5F5F5;
  border-radius: 10rem;
  font-weight: 700;
  line-height: 18px;
  font-size: 12px;
  color: #000000;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.25);
}
</style>
