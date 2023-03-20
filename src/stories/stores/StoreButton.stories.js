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
  template: '<StoreButton v-bind="args">버튼</StoreButton>',
});

export const Primary = Template.bind({});

Primary.args = {
  block: true,
};

Primary.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/WfYesvtDvJHo2KTri40CQx/Gorela-%EC%82%AC%EC%9E%A5%EB%8B%98-UI-Kit-(Deprecated)?node-id=720-2467&t=xpu9i5RY4pd50F7B-4',
  },
};
