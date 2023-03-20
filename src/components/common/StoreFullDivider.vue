<template>
  <hr />
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'StoreFullDivider',
});
</script>

<style lang="scss" scoped>
hr {
  padding: 1px 0;
  border: none;
  &:before {
    // full-width divider
    content: '';
    display: block;
    position: absolute;
    right: -1440px;
    max-width: 3840px !important;
    width: 3840px;
    border-style: solid;
    border-width: thin 0 0 0;
    border-color: 0, 0, 0;
    opacity: 0.12;
  }
}
</style>
