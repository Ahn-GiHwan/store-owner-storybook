<template>
  <VBtn class=" outliend" :color="type">
    {{ type }}
   </VBtn>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Store-Color',
  props: {
    type: {
      type: String,
      required: true,
    },
  },
});
</script>

<style scoped>
.colorBtn {
  border: 1px solid;
}
</style>
