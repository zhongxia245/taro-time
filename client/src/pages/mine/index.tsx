import Taro, { useEffect } from "@tarojs/taro";
import { View, Button } from "@tarojs/components";
import { AtList, AtListItem, AtAvatar } from "taro-ui";
import { useStore, TimeStore, setOpenid } from "../../store";

import "./index.scss";

export default function Mine() {
  const { user = {} } = useStore(TimeStore);

  const action = {
    showTip() {
      Taro.showToast({
        title: "该功能暂未开发",
        icon: "none"
      });
    },
    getOpenId() {
      Taro.cloud.callFunction({
        name: "login",
        data: {},
        success: res => {
          console.log("[云函数] [login] user openid: ", res.result.openid);
          console.log(res.result);
          setOpenid(res.result.openid);
        },
        fail: err => {
          console.error("[云函数] [login] 调用失败", err);
        }
      });
    }
  };

  const isLogin = !!user.nickName;

  return (
    <View className="page-mine">
      {isLogin ? (
        <View className="page-mine__header">
          <AtAvatar circle size="large" image={user.avatarUrl} />
          <View className="mine-header__name">{user.nickName}</View>
        </View>
      ) : (
        <View className="page-mine__header">
          <Button
            size="mini"
            type="primary"
            openType="getUserInfo"
            style={{ backgroundColor: "#1296db" }}
          >
            登录
          </Button>
        </View>
      )}
      <AtList>
        <AtListItem title="登录用户" arrow="right" onClick={action.getOpenId} />
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
