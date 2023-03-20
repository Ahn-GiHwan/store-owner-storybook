import logger from '@/plugins/vueLogger';
import { useAuthStore, useCommonStore } from '@/stores';
import { STORE_STATUS, STORE_USER_STATUS } from '@/constants';

import {
  getActiveDeliveryAgencyStore,
  getCurrentDeliveryCondition,
  getCurrentStoreDeposit,
} from '@/utils/storeUtils';

const _gotoLogin = (to, form, next) => {
  next({
    path: '/login',
    query: {
      return_url: to.path,
    },
    hash: to.hash,
  });
};

export async function beforeHooks(to, from, next) {
  const auth = useAuthStore();
  const common = useCommonStore();

  try {
    if (to.meta.requiresAuth) {
      if (!auth.accessToken) {
        try {
          await auth.me();
        } catch (err) {
          logger.error(err);
          _gotoLogin(to, from, next);
          return;
        }
      }

      // 필수동의 미동의 유저일 경우 강제 로그아웃 후 로그인 화면으로
      if (!auth.isRequiredAgreement || auth.currentUser.isPasswordChangeRequired) {
        auth.logoutUser();
        _gotoLogin(to, from, next);
        return;
      }

      // 주문 제휴사, 배달대행사 리스트를 비동기 형식으로 불러옵니다.
      if (!common.getOrderAgencies) {
        common.orderAgencies();
      }
      if (!common.getDeliveryAgencies) {
        common.deliveryAgencies();
      }

      if (!auth.storeUserList) {
        await auth.storeUsers();

        // 연결된 상점이 없을 경우 intro 화면으로 페이지 전환
        // 회원가입시 완료 화면으론 전환 필요
        if (
          (to.name !== 'SignupComplete' && from.name !== 'Signup') &&
          auth.storeUserList.length === 0
        ) {
          // 맥도날드 오픈 버전에서는 intro pass하고 바로고 상점 연결로 이동
          next('/transfer-barogo');
          return;
        }

        // 상점 연결(혹은 진행)이 된 상태에서 상점연결화면 접근시도시 메인화면으로 페이지 전환
        if (to.path.indexOf('transfer') > -1 && auth.storeUserList.length > 0) {
          next('/');
          return;
        }
      }

      // 초기 상점 설정
      if (auth.storeUserList?.length > 0) {
        auth.selectStore(auth.storeUserList[0].store);
        // 고객센터 전화번호 설정
        common.setDeliveryContactTelNumber();

        // 상점 & 상점 유저가 모두 승인된 첫번째 상점 설정
        const approvedUserStores = auth.storeUserList.filter(
          (item) =>
            item.status === STORE_USER_STATUS.APPROVED &&
            item.store.status === STORE_STATUS.APPROVED,
        );

        if (approvedUserStores.length > 0) {
          auth.selectStore(approvedUserStores[0].store);

          // 배달대행사 상태, 예치금 조회
          if (auth.currentStore) {
            const activeDeliveryAgencyStore =
              getActiveDeliveryAgencyStore(auth.currentStore.deliveryAgencyStores);

            if (activeDeliveryAgencyStore) {
              const payload = {
                storeId: auth.currentStore.storeId,
                deliveryAgencyId: activeDeliveryAgencyStore.deliveryAgencyId,
              };

              // 배달대행사 상태 조회
              const conditionPromise = auth.deliveryCondition(payload);
              // 현재 액티브한 배달대행사의 예치금 조회
              const depositPromise = auth.storeDeposit(payload);

              const promises = [conditionPromise, depositPromise];

              Promise.allSettled(promises)
                .then(() => {
                  // 현재 액티브한 배달대행사의 상태 설정
                  auth.setCurrentDeliveryCondition(
                    getCurrentDeliveryCondition(
                      auth.deliveryConditions,
                      activeDeliveryAgencyStore.deliveryAgencyId,
                    ),
                  );

                  // 현재 액티브한 배달대행사의 상태 설정
                  auth.setCurrentStoreDeposit(
                    getCurrentStoreDeposit(
                      auth.storeDeposits,
                      activeDeliveryAgencyStore.deliveryAgencyId,
                    ),
                  );
                })
                .catch(() => {
                  auth.setCurrentDeliveryCondition(null);
                  auth.setCurrentStoreDeposit(null);
                });
            }
          }
        }
      }

      // 상점 메모
      if (auth.currentStore && !common.getPredefinedOrderMemos) {
        common.predefinedOrderMemos(auth.currentStore.storeId);
      }
    }

    if (to.meta.requiresApproval) {
      // 승인된 상점유저의 배열을 얻어서
      const approvedUserStores = auth.storeUserList.filter(
        (item) =>
          item.status === STORE_USER_STATUS.APPROVED &&
          item.store.status === STORE_STATUS.APPROVED,
      );

      // 승인된 상점이 하나도 없는 경우에는 미승인 페이지로 이동하게 하기
      if (approvedUserStores.length === 0) {
        next('/non-approved-user');
        return;
      }
    }
    next();
  } catch (err) {
    logger.error(err);

    // TODO : 에러 타입에 따라서 특정 에러 페이지로 이동하는 것 챙기기
    next({
      path: '/error',
    });
  } finally {
    common.setIsOverlayLoading(false);
  }
}

export function afterHooks(to, from) {
  const common = useCommonStore();

  common.setPreviousRoute(from);
  common.setCurrentFullPath(to);
}
