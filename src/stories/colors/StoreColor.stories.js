import StoreColor from './StoreColor.vue';

export default {
  title: 'color/StoreColor',
  component: StoreColor,
  argTypes: {
    type: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'accent', 'error', 'info', 'success', 'warning'],
    },
  },
};

const Template = (args) => ({
  components: { StoreColor },
  setup() {
    return { args };
  },
  template: '<StoreColor v-bind="args"/>',
});

export const Primary = Template.bind({});

Primary.args = {
  type: 'primary',
};
