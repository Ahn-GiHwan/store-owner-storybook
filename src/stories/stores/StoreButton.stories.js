import StoreButton from '@/components/common/StoreButton.vue';

export default {
  title: 'store/StoreButton',
  component: StoreButton,
};

const Template = (args) => ({
  components: { StoreButton },
  setup() {
    return { args };
  },
  template: '<StoreButton v-bind="args">Button</StoreButton>',
});

export const Primary = Template.bind({});

Primary.args = {

};
