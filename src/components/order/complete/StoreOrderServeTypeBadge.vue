<template>
  <VChip
    v-if="isViewLabel"
    class="mr-1"
    rounded="1"
    size="x-small"
    label
    :color="color"
  >
    <span class="font-size-12"> {{ labelName }}</span>
  </VChip>

  <span
    v-if="color === 'error'"
    class="error-order font-size-12 px-1 mr-1"
  >
  {{ labelName }}
  </span>
</template>

<script setup name="StoreOrderServeTypeBadge">
defineProps({
  isViewLabel: {
    type: Boolean,
    default: false,
  },
  labelName: {
    type: String,
    default: '',
  },
  color: {
    type: String,
    default: 'primary',
  },
});

</script>

<style lang="scss" scoped>
.error-order {
  background: $color-red-e5;
  line-height: 2rem;
  color: white;
  border-radius: 2px;
}
</style>
