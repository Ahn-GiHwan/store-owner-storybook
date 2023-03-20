<template>
  <div class="content-footer">
    <RouterLink :to="{ name: toPathName }" :replace = "$props.replace">{{ linkName }}</RouterLink>
  </div>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'StoreCommonLink',
  props: {
    linkName: {
      type: String,
      required: true,
    },
    toPathName: {
      type: String,
      required: true,
    },
    replace: {
      type: Boolean,
      default: true,
    },
  },
});
</script>

<style lang="scss" scoped>
.content-footer {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 6.4rem;
  & a {
    color: $color-primary;
    font-weight: bold;
    align-content: center;
  }
}
</style>
