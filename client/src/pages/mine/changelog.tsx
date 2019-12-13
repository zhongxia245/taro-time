import Taro from "@tarojs/taro";
import { View } from "@tarojs/components";
import { AtTimeline } from "taro-ui";
import "./changelog.scss";

export default function ChangeLog() {
  return (
    <View className="page-changelog">
      <AtTimeline
        items={[
          {
            title: "2019-12-07 12:46:03",
            content: ["1. 增加小程序云函数的支持"]
          },
          {
            title: "2019-12-02 23:00:33",
            content: ["1. 增加农历转公历的工具"]
          },
          {
            title: "2019-12-01 21:01:39",
            content: ["1. 增加倒计时的列表展示", "2. 增加 tabbar 选项卡"]
          },
          {
            title: "2019-11-30 21:01:39",
            content: ["1. 初始化项目", "2. 纪念日的增删改查"]
          }
        ]}
      ></AtTimeline>
    </View>
  );
}

ChangeLog.config = {
  navigationBarTitleText: "更新日志"
};
