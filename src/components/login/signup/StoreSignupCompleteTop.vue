<template>
  <VContainer fluid class="pa-0">
    <VRow no-gutters class="d-flex flex-column my-4 mx-5">
      <VCol class="py-0">
        <StoreBaseCard flat class="mt-2">
          <template #card-header>
            <div class="header-title font-weight-bold font-size-24">
              {{ $t('views.signup.message.confirmMemberInfo') }}
            </div>
          </template>
          <template #card-content>
            <div class="mt-6">
              <span class="content font-size-16">{{
                $t('views.signup.message.welcomeToBarogo')
              }}</span>
              <div class="text-center mt-5">
                <img src="/src/assets/images/signup/congratulations.png" />
              </div>
            </div>
          </template>
        </StoreBaseCard>
      </VCol>
    </VRow>
  </VContainer>
</template>
<script>
import { defineComponent } from 'vue';

import StoreBaseCard from '@/components/common/StoreBaseCard.vue';

export default defineComponent({
  name: 'StoreSignupCompleteTop',
  components: {
    StoreBaseCard,
  },
});
</script>

<style lang="scss" scoped>
.header-title {
  line-height: 3.2rem;
  white-space: pre-line;
}
.content {
  line-height: 2.4rem;
}

img {
  width: 14rem;
  height: 13.5rem;
}
</style>
