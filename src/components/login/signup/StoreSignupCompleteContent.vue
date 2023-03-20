<template>
  <VRow v-for="(item, index) in items" :key="index">
    <VCol cols="3" sm="2"> {{ item.label }} </VCol>
    <VCol cols="9" sm="10"> {{ item.data }} </VCol>
  </VRow>
</template>
<script>
import { defineComponent, ref } from 'vue';
import { useLocale } from 'vuetify';

import { useAuthStore } from '@/stores';
import { addHyphenPhoneNumber } from '@/utils/stringUtils';

export default defineComponent({
  name: 'StoreSignupCompleteContent',
  setup() {
    const auth = useAuthStore();
    const items = ref([]);
    const { t } = useLocale();

    items.value.push({
      label: t('views.signup.loginId'),
      data: auth.currentUser?.loginId,
    });
    items.value.push({
      label: t('views.signup.name'),
      data: auth.currentUser?.name,
    });
    items.value.push({
      label: t('views.signup.phoneNumber'),
      data: addHyphenPhoneNumber(auth.currentUser?.phone),
    });

    return {
      items,
    };
  },
});
</script>
