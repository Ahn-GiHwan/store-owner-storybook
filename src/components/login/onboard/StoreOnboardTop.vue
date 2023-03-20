<template>
  <VContainer fluid class="pa-0">
    <VRow no-gutters class="d-flex flex-column my-4 mx-5">
      <VCol class="py-0">
        <StoreBaseCard flat class="mt-2">
          <template #card-header>
            <div class="header-title font-weight-bold font-size-24">
              사장님 안녕하세요
            </div>
          </template>
          <template #card-content>
            <div class="mt-6">
              <span class="content font-size-16">바로고에 오신 것을 환영합니다.<br />
                회원 가입과 상점 연결을 시작합니다. </span>
              <div class="text-center mt-12">
                <img src="/src/assets/images/login/onboard_welcome.png" />
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
  name: 'StoreOnboardTop',
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
  width: 14.3rem;
  height: 12.2rem;
}
</style>
