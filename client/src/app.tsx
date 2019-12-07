import Taro, { Component, Config } from "@tarojs/taro";
import Index from "./pages/index";
import { setUser, setOpenid } from "./store";

import "./app.scss";

// 如果需要在 h5 环境中开启 React Devtools
// 取消以下注释：
// if (process.env.NODE_ENV !== 'production' && process.env.TARO_ENV === 'h5')  {
//   require('nerv-devtools')
// }

class App extends Component {
  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  config: Config = {
    pages: [
      "pages/index/index",
      "pages/index/add",
      "pages/mine/index",
      "pages/mine/changelog",
      "pages/tools/solar-lunar"
      // "pages/move-card/index"
    ],
    window: {
      backgroundTextStyle: "light",
      navigationBarBackgroundColor: "#fff",
      navigationBarTitleText: "WeChat",
      navigationBarTextStyle: "black"
    },
    tabBar: {
      selectedColor: "#1296db",
      color: "#515151",
      list: [
        {
          text: "列表",
          pagePath: "pages/index/index",
          iconPath: "static/img/tabbar/icon1.png",
          selectedIconPath: "static/img/tabbar/icon1-on.png"
        },
        {
          text: "我的",
          pagePath: "pages/mine/index",
          iconPath: "static/img/tabbar/mine.png",
          selectedIconPath: "static/img/tabbar/mine-on.png"
        }
      ]
    }
  };

  componentWillMount() {
    // 调用云函数前需要先初始化
    if (!Taro.cloud) {
      console.error("请使用 2.2.3 或以上的基础库以使用云能力");
    } else {
      Taro.cloud.init({
        // env 参数说明：
        //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
        //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
        //   如不填则使用默认环境（第一个创建的环境）
        // env: 'my-env-id',
        traceUser: true
      });

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

    Taro.getSetting({
      success(res) {
        console.log("setting", res);
        // Taro.authorize 提前获取授权，不能获取用户信息的授权，用户信息需要用 Button按钮获取
        // authorize:fail 系统错误，错误码：-12007,scope unauthorized
        // https://developers.weixin.qq.com/community/develop/doc/0006026b3c83c0e244573a0025bc08
        if (res.authSetting["scope.userInfo"]) {
          Taro.getUserInfo({
            success: function(res: any) {
              console.log(res);
              if (res.errMsg === "getUserInfo:ok") {
                setUser(res.userInfo);
              } else {
                Taro.showToast({
                  title: "获取用户名称头像失败",
                  icon: "fail"
                });
              }
            }
          });
        }
      }
    });
  }

  // 在 App 类中的 render() 函数没有实际作用
  // 请勿修改此函数
  render() {
    return <Index />;
  }
}

Taro.render(<App />, document.getElementById("app"));
