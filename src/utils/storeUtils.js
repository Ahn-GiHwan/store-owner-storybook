import {
  MAPPING_STATUS,
} from '@/constants';

// 첫 번째로 발견된 매핑상태 done 인 deliveryAgencyStore 리턴
const getActiveDeliveryAgencyStore = (deliveryAgencyStores) => {
  const actives = deliveryAgencyStores.filter((v) => v.mappingStatus === MAPPING_STATUS.DONE);

  if (actives && actives.length > 0) {
    return actives[0];
  }

  return null;
};

const getCurrentDeliveryCondition = (deliveryConditions, deliveryAgencyId) =>
  deliveryConditions.find((v) => v.deliveryAgencyId === deliveryAgencyId);

const getCurrentStoreDeposit = (storeDeposits, deliveryAgencyId) =>
  storeDeposits.find((v) => v.deliveryAgencyId === deliveryAgencyId);

export {
  getActiveDeliveryAgencyStore,
  getCurrentDeliveryCondition,
  getCurrentStoreDeposit,
};
