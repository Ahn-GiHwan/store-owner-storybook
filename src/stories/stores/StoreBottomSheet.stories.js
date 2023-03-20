import StoreBottomSheet from '@/components/common/StoreBottomSheet.vue';

export default {
  title: 'store/StoreBottomSheet',
  component: StoreBottomSheet,
};

const Template = (args) => ({
  components: { StoreBottomSheet },
  setup() {
    return { args };
  },
  template: `
    <StoreBottomSheet v-bind="args">
      <template #title>
        <div>Title</div>
      </template>
      <template #content>
        <div>Contents</div>
      </template>
    </StoreBottomSheet>
  `,
});

export const Primary = Template.bind({});

Primary.args = {

};
