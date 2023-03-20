<template>
  <ul class="d-inline-flex footer_link">
    <li v-for="(value, index) in data" :key="index">
      <RouterLink :to="value.path" :class="value.bold && 'bold'">{{ value.name }}</RouterLink>
    </li>
  </ul>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'StoreFooterLink',
  props: {
    required: Boolean,
    data: {
      type: Array,
      default: () => [],
    },
    bold: {
      type: Boolean,
      default: false,
    },
  },
});
</script>

<style lang="scss" scoped>
.footer_link {
  & a {
    text-decoration: none;
    color: #616161;
  }
  & li {
    list-style: none;
    position: relative;
    padding: 0 10px;
  }
  & li ~ li:after {
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    width: 0.1rem;
    height: 1.4rem;
    background: #e0e0e0;
    transform: translateY(-50%);
  }
  & .bold {
    color: #000000;
  }
}
</style>
