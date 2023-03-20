import { userEvent, within } from '@storybook/testing-library';
import StoreTextField from '@/components/common/StoreTextField.vue';

export default {
  title: 'store/StoreTextField',
  component: StoreTextField,
};

const Template = (args) => ({
  components: { StoreTextField },
  setup() {
    return { args };
  },
  template: '<StoreTextField v-bind="args"/>',
});

export const Primary = Template.bind({});

Primary.args = {

};
Primary.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  // eslint-disable-next-line no-console
  console.log(canvas.getByTestId('tt'));

  const inputEL = document.querySelector('.v-field__input');

  await userEvent.click(inputEL);
  await userEvent.keyboard('안녕하세요 반가워용');
};
