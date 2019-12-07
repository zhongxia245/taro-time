import dayjs from "dayjs";
// https://www.npmjs.com/package/solarlunar
import solarLunar from "solarlunar";

/**
 * 计算两个时间差
 * 并返回目标时间的农历信息
 */
export function getDiffInfo(startTime, targetTime) {
  let now = new Date(startTime);
  let timeDate = new Date(targetTime);

  let diffYear = dayjs(now).diff(timeDate, "year");
  let nextTime = dayjs(timeDate).add(diffYear, "year");

  let diffDays = dayjs(now).diff(timeDate, "day");
  let diffYears = dayjs(now).diff(timeDate, "year");
  let countDownDays = dayjs(nextTime).diff(now, "day");

  // 如果今年的纪念日已经过了，则计算距离明年还有多少天
  if (countDownDays < 0) {
    diffYear += 1;
    nextTime = dayjs(timeDate).add(diffYear, "year");
    countDownDays = dayjs(nextTime).diff(now, "day");
  }

  return {
    diffDays,
    diffYears,
    countDownDays
  };
}

/**
 * 公历转农历
 */
export function getLunar2Solar(date: Date) {
  let lunarInfo = solarLunar.lunar2solar(
    date.getFullYear(),
    date.getMonth() + 1,
    date.getDate()
  );
  return lunarInfo;
}

/**
 * 公历转农历
 */
export function getSolar2Lunar(date: Date) {
  let lunarInfo = solarLunar.solar2lunar(
    date.getFullYear(),
    date.getMonth() + 1,
    date.getDate()
  );
  return lunarInfo;
}
