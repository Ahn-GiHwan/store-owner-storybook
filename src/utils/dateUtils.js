import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { TIME_ZONE, FILTER_DATE_PERIOD } from '@/constants';

dayjs.extend(utc);
dayjs.extend(timezone);

const oneSecond = 1000;
const oneMinute = oneSecond * 60;
const oneHour = oneMinute * 60;
const oneDay = oneHour * 24;
const oneWeek = oneDay * 7;

const formatBy2DigitNumber = (value) => (Number(value) < 10 ? `0${Number(value)}` : `${Number(value)}`);

const timestampToDateTime = (t, format = 'YYYY-MM-DD HH:mm') => dayjs(t).tz(TIME_ZONE).format(format);

const getDatePeriod = (type, date) => {
  const startFormat = 'YYYY-MM-DD 00:00:00.000';
  const endFormat = 'YYYY-MM-DD 23:59:59.999';

  // 직접 기간을 설정
  if (FILTER_DATE_PERIOD.SELF && date) {
    const startDate = dayjs(date[0]).format(startFormat);
    const endDate = dayjs(date[1]).format(endFormat);
    const startAt = dayjs(startDate).valueOf();
    const endAt = dayjs(endDate).valueOf();

    return {
      startAt,
      endAt,
    };
  }

  let beforeDay = 0;
  if (type === FILTER_DATE_PERIOD.ONE_WEEK) {
    beforeDay = 7;
  } else if (type === FILTER_DATE_PERIOD.ONE_MONTH) {
    beforeDay = 30;
  }

  const startTimestamp = dayjs(dayjs().add(-beforeDay, 'day').tz(TIME_ZONE).format(startFormat)).valueOf();
  const endTimestamp = dayjs(dayjs().tz(TIME_ZONE).format(endFormat)).valueOf();

  return {
    startAt: startTimestamp,
    endAt: endTimestamp,
  };
};

const getOrderDateTime = (timestamp, format) => {
  const toDate = dayjs(timestamp).tz(TIME_ZONE);

  if (format) {
    return dayjs(toDate).format(format);
  }

  if (dayjs().isSame(toDate, 'day')) {
    return dayjs(toDate).format('HH:mm');
  }

  return dayjs(toDate).format('DD일 HH:mm');
};

const diffMinutes = (from, to) => Math.floor((to - from) / (1000 * 60));

export {
  oneSecond,
  oneMinute,
  oneHour,
  oneDay,
  oneWeek,
  formatBy2DigitNumber,
  timestampToDateTime,
  diffMinutes,
  getOrderDateTime,
  getDatePeriod,
};
