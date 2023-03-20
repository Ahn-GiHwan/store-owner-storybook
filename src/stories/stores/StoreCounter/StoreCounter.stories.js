// import StoreCounter from '@/components/common/StoreCounter.vue';
import { userEvent, within } from '@storybook/testing-library';
import StoreCounter from './StoriesStoreCounter.vue';

export default {
  title: 'store/StoreCounter',
  component: StoreCounter,
};

const Template = (args) => ({
  components: { StoreCounter },
  setup() {
    return { args };
  },
  template: '<StoreCounter v-bind="args">Button</StoreCounter>',
});

export const Primary = Template.bind({});

Primary.args = {

};

Primary.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  // eslint-disable-next-line no-console
  // console.log(canvas.getByTestId('up'));

  await userEvent.click(canvas.getByTestId('up'));
  await userEvent.click(canvas.getByTestId('up'));
  await userEvent.click(canvas.getByTestId('up'));
  await userEvent.click(canvas.getByTestId('up'));
  // await userEvent.click(canvas.getByTestId('down'));
  // await userEvent.click(canvas.getByTestId('down'));
  // await userEvent.click(canvas.getByTestId('down'));
  // await userEvent.click(canvas.getByTestId('down'));
};
