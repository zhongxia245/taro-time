import Taro, { useEffect } from "@tarojs/taro";
import { View } from "@tarojs/components";
import { AtList, AtListItem, AtAvatar } from "taro-ui";

import "./index.scss";

export default function Mine() {
  const action = {
    showTip() {
      Taro.showToast({
        title: "该功能暂未开发",
        icon: "none"
      });
    }
  };

  return (
    <View className="page-mine">
      <View className="page-mine__header">
        <AtAvatar
          circle
          size="large"
          image="http://asset.izhongxia.com/ipic/2019-11-16-avator2.jpeg"
        />
        <View className="mine-header__name">zhongxia</View>
      </View>
      <AtList>
        <AtListItem title="同步到云端" arrow="right" onClick={action.showTip} />
        <AtListItem
          title="公历转农历"
          arrow="right"
          onClick={() => {
            Taro.navigateTo({ url: "/pages/tools/solar-lunar" });
          }}
        />
        <AtListItem
          title="更新日志"
          arrow="right"
          onClick={() => {
            Taro.navigateTo({ url: "/pages/mine/changelog" });
          }}
        />
        <AtListItem title="关于应用" arrow="right" onClick={action.showTip} />
      </AtList>
    </View>
  );
}

Mine.config = {
  navigationBarTitleText: "我的"
};
