import Taro, { useState } from "@tarojs/taro";
import { View, Picker, Text } from "@tarojs/components";
import { AtCard, AtForm, AtButton } from "taro-ui";
import {
  getDiffInfo,
  getLunar2Solar,
  getCurrentYearLunar
} from "../../utils/date";

import "./solar-lunar.scss";

export default function SolarLunar() {
  const [data, setData] = useState({
    time: "1992/10/26"
  });

  const action = {
    onChange(name, val) {
      setData({ ...data, [name]: val });
    }
  };


  // TODO:后期优化计算的方式

  let date = new Date(data.time);
  let timeInfo = getLunar2Solar(date); // 计算当前的选中日期的农历

  // 计算今年的农历对应的公历
  let currentLunarTime = getCurrentYearLunar(
    date.getMonth() + 1,
    date.getDate()
  );
  let currentSolarTime = new Date(
    currentLunarTime.cYear,
    currentLunarTime.cMonth - 1,
    currentLunarTime.cDay
  );

  let solarDate = new Date(timeInfo.cYear, timeInfo.cMonth - 1, timeInfo.cDay);
  let diffInfo = getDiffInfo(new Date(), solarDate);
  let nextTime = getDiffInfo(new Date(), currentSolarTime);

  return (
    <View className="page-solar-lunar">
      <AtForm>
        <View className="form-item">
          <Text className="form-item__label">农历日期</Text>
          <View className="form-item__control">
            <Picker
              mode="date"
              value={data.time}
              onChange={e => {
                let val = e.detail.value;
                action.onChange("time", val);
              }}
            >
              <View>
                {data.time || (
                  <Text className="form-item__placeholder">什么时候呢？</Text>
                )}
              </View>
            </Picker>
          </View>
        </View>
      </AtForm>
      <AtCard className="result" title="农历转公历结果">
        <View className="result__item">
          农历信息：
          <Text className="span">{timeInfo.yearCn}</Text>
          <Text className="span"> {timeInfo.monthCn}</Text>
          <Text className="span">{timeInfo.dayCn}</Text>
          <Text className="span">{timeInfo.ncWeek}</Text>
          <Text className="span">{timeInfo.animal}</Text>
        </View>
        <View className="result__item">
          公历日期：
          <Text className="span">
            {timeInfo.cYear}年{timeInfo.cMonth}月{timeInfo.cDay}日
          </Text>
        </View>
        <View className="result__item">
          距离今天，已经过去了
          <Text className="span--big">{diffInfo.diffYears}年+</Text>， 共
          <Text className="span--big">{diffInfo.diffDays}</Text>天
        </View>
        <View className="result__item">
          下一个日子还有
          <Text className="span--big">{nextTime.countDownDays}</Text>天
        </View>
        <View className="result__item">
          下一个日期
          <Text className="span">
            {currentLunarTime.cYear}年{currentLunarTime.cMonth}月
            {currentLunarTime.cDay}日
          </Text>
          <Text className="span">{currentLunarTime.ncWeek}</Text>
        </View>
      </AtCard>
      <View className="btns">
        <AtButton type="primary">收藏该日子</AtButton>
      </View>
    </View>
  );
}

SolarLunar.config = {
  navigationBarTitleText: "工具 - 农历转公历"
};
