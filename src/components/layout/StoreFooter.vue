<template>
  <VFooter app>
    <slot>
      <VRow justify="center" no-gutters>
        <VCol class="text-center mt-4" cols="12">
          {{ new Date().getFullYear() }} — <strong>Barogo</strong>
        </VCol>
      </VRow>
    </slot>
  </VFooter>
</template>
<script>
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'StoreFooter',
});
</script>
