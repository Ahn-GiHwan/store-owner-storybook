import StoreLogo from '@/components/common/StoreLogo.vue';

export default {
  title: 'image/StoreLogo',
  component: StoreLogo,
};

const Template = (args) => ({
  components: { StoreLogo },
  setup() {
    return { args };
  },
  template: '<StoreLogo v-bind="args"/>',
});

export const Primary = Template.bind({});

Primary.args = {

};
