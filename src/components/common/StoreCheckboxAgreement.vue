<template>
  <VContainer fluid class="pa-0">
    <VRow justify="start">
      <VCol cols="auto" class="pa-0 pl-1">
        <VCheckbox
          v-bind="{
            ...$props,
            ...$attrs,
          }"
          color="primary"
          hide-details
        >
          <template v-slot:label>
            <I18nT :keypath="$props.label" tag="span" class="font-size-12">
              <template v-if="$props.termsAndPolicies?.first" v-slot:first>
                <a
                  href=""
                  @click.prevent="toggleModal($props.termsAndPolicies.first)"
                  class="font-size-12 text-decoration-none"
                >
                  {{ $t($props.termsAndPolicies.first.title) }}
                </a>
              </template>
              <template v-if="$props.termsAndPolicies?.second" v-slot:second>
                <a
                  href=""
                  @click.prevent="toggleModal($props.termsAndPolicies.second)"
                  class="font-size-12 text-decoration-none"
                >
                  {{ $t($props.termsAndPolicies.second.title) }}
                </a>
              </template>
            </I18nT>
          </template>
        </VCheckbox>
      </VCol>
    </VRow>
  </VContainer>
  <StoreScrollableModal
    v-if="showModal"
    :title="$t(title)"
    :contents="contents"
    @close-modal="toggleModal"
  />
</template>
<script>
import { defineComponent, ref, computed } from 'vue';
import { Translation as I18nT } from 'vue-i18n';
import { useRouter, useRoute, onBeforeRouteLeave } from 'vue-router';

import StoreScrollableModal from '@/components/common/StoreScrollableModal.vue';

export default defineComponent({
  name: 'StoreCheckboxAgreement',
  components: { I18nT, StoreScrollableModal },
  props: {
    modelValue: {
      type: Boolean,
      default: false,
    },
    name: {
      type: String,
      default: '',
    },
    label: {
      type: String,
      default: '',
    },
    termsAndPolicies: {
      type: Object,
    },
  },
  setup() {
    const router = useRouter();
    const route = useRoute();

    const showModal = ref(false);
    const title = ref('');
    const contents = ref('');

    const toggleModal = (termsAndPolicy) => {
      if (termsAndPolicy) {
        title.value = termsAndPolicy.title;
        contents.value = termsAndPolicy.contents;
      }
      showModal.value = !showModal.value;
    };

    const isGoBack = computed(() =>
      String(router.options.history.state.forward).localeCompare(route.path) === 0);

    const isShowOverlayView = computed(() => showModal.value);
    const closeOverlayView = () => { showModal.value = false; };

    onBeforeRouteLeave((to, from, next) => {
      if (isGoBack.value && isShowOverlayView.value) {
        closeOverlayView();
        next(false);
        return;
      }

      next();
    });

    return {
      showModal,
      toggleModal,
      title,
      contents,
    };
  },
});
</script>
