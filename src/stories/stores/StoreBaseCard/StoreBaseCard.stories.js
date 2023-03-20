import StoreBaseCard from '@/components/common/StoreBaseCard.vue';

export default {
  title: 'store/StoreBaseCard',
  component: StoreBaseCard,
};

const Template = (args) => ({
  components: { StoreBaseCard },
  setup() {
    return { args };
  },
  template: `
    <StoreBaseCard class='pa-2'>
      <template #card-header>
        <div>
          <span class='d-block'> card-header </span>
          <span> 사장님 안녕하세요 </span>
          <hr/>
        </div>
      </template>
      <template #card-content>
        <div>
          <span class='d-block'> card-content </span>
          <span> 바로고에 오신 것을 환영합니다.</span>
          <hr/>
        </div>
      </template>
      <template #card-bottom>
        <div>
          <span class='d-block'> card-bottom </span>
          <span> 회원 가입과 상점 연결을 시작합니다. </span>
        </div>
      </template>
    </StoreBaseCard>
  `,
});

export const Primary = Template.bind({});

Primary.args = {

};

export const Sec = Template.bind({});
Sec.args = {

};
