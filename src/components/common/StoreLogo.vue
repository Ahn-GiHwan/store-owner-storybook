<template>
  <picture>
    <source :srcset="logo_login" />
    <img :src="logo_login" alt="로그인 이미지" />
  </picture>
</template>
<script>
import { defineComponent } from 'vue';
import logo from '@/assets/images/logo/barogo_logo.png';

export default defineComponent({
  name: 'StoreLogo',
  data() {
    return {
      logo_login: logo,
    };
  },
});
</script>

<style lang="scss" scoped>
img {
  width: 14rem;
  height: 2.2rem;
}
</style>
