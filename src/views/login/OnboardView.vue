<template>
  <VMain>
    <div class="content">
      <VRow no-gutters class="flex-column view-page">
        <VCol>
          <StoreOnboardTop />
        </VCol>
      </VRow>
    </div>
  </VMain>

  <StoreContentBottom bottomUp>
    <template #bottom-up>
      <StoreButton block @click.stop="submit">
        바로고 사장님 회원가입하기
      </StoreButton>
    </template>
    <StoreFullDivider />
    <StoreCommonLink :toPathName="'Login'" :linkName="'이미 계정이 있습니다'" :replace="false" />
  </StoreContentBottom>
</template>

<script>
import { defineComponent } from 'vue';
import { useDisplay } from 'vuetify';
import { useRouter } from 'vue-router';

import StoreContentBottom from '@/components/common/StoreContentBottom.vue';
import StoreButton from '@/components/common/StoreButton.vue';
import StoreFullDivider from '@/components/common/StoreFullDivider.vue';
import StoreCommonLink from '@/components/common/StoreCommonLink.vue';
import StoreOnboardTop from '@/components/login/onboard/StoreOnboardTop.vue';

export default defineComponent({
  name: 'OnboardView',
  components: {
    StoreContentBottom,
    StoreButton,
    StoreFullDivider,
    StoreCommonLink,
    StoreOnboardTop,
  },
  setup() {
    const { mobile } = useDisplay();
    const router = useRouter();

    const submit = () => {
      router.push({ name: 'Signup' });
    };

    return { mobile, submit };
  },
});
</script>

<style lang="scss" scoped>
@import '@/styles/common/form.scss';
@import '@/styles/common/button.scss';
@import '@/styles/layout/main.scss';
.v-main {
  background: white;
}
</style>
