<template>
  <VCard width="100vw" height="100vh">
    <!-- 헤더. 상점 이름과 닫기 버튼 -->
    <VToolbar color="white">
      <div class="content-header-wrapper">
        <div class="content-header">
          <VRow class="align-center text-center py-1" no-gutters>
            <VCol>
              <VAppBarTitle>
                {{ $t('views.nonApprovedUser.title.storeInfo') }}
              </VAppBarTitle>
            </VCol>
          </VRow>
        </div>
      </div>
    </VToolbar>
    <VDivider/>
    <VContainer class="content-wrapper">
      <VRow no-gutters>
        <VCol class="d-flex justify-center">
          <img class="logo_image" :src="nonApprovedUser"/>
        </VCol>
      </VRow>
      <VRow no-gutters>
        <VCol class="text-left">
          <span class="font-size-18 font-weight-700">
            {{ $t('views.nonApprovedUser.title.checkingStoreUserInfo') }}
          </span>
        </VCol>
      </VRow>
      <VRow no-gutters class="mt-1">
        <VCol class="text-left">
          <span class="font-size-12 font-weight-400 s-color-gray-61">
            {{ $t('views.nonApprovedUser.description.checkingStoreUserInfo') }}
          </span>
        </VCol>
      </VRow>
      <VRow no-gutters class="mt-2 mb-4">
        <VCol class="text-left">
          <span class="font-size-12 font-weight-400">
            {{ $t('views.nonApprovedUser.description.pleasePrepareAccepttingOrder') }}
          </span>
        </VCol>
      </VRow>
      <VDivider/>
      <VRow no-gutters>
        <VCol class="text-left d-flex align-center" cols="2">
          <span class="py-4 font-size-14 font-weight-400 s-color-gray-61">
            {{ $t('views.nonApprovedUser.title.storeName') }}
          </span>
        </VCol>
        <VCol class="text-left d-flex align-center">
          <span class="font-size-14 font-weight-400">
            {{ storeName }}
          </span>
        </VCol>
      </VRow>
      <VDivider/>
      <VRow no-gutters class="mt-4">
        <VCol>
          <StoreButton
            block
            variant="outlined"
            :color="gray3Color"
            @click.once="handleLogout"
          >
            <span class="s-color-red-ff">
              {{ $t('views.nonApprovedUser.button.logout') }}
            </span>
          </StoreButton>
        </VCol>
      </VRow>
    </VContainer>
  </VCard>
</template>

<script setup name="NonApprovedUserView">
import { computed } from 'vue';
import { useLocale } from 'vuetify';
import { useRouter } from 'vue-router';

import StoreButton from '@/components/common/StoreButton.vue';

import { useAuthStore, useCommonStore } from '@/stores';
import nonApprovedUser from '@/assets/images/main/non_approved_user.png';
import {
  gray3Color,
} from '@/styles/_export.module.scss';

const { t } = useLocale();
const auth = useAuthStore();
const common = useCommonStore();
const router = useRouter();

const storeName = computed(() => auth.currentStore?.name);

const handleLogout = async () => {
  try {
    await auth.logoutUser();
    router.push({ name: 'Login' });
  } catch (err) {
    common.showToast('error', t('views.navigationMenu.errors.failedToLogout'));
  }
};

</script>

<style lang="scss" scoped>
.content-header-wrapper {
  width: 100vw;
}

.content-wrapper {
  max-width: $breakpoint-tablet;
}

.logo_image {
  width: 13.6rem;
  height: 13.6rem;
}
</style>
