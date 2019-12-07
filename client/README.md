# 纪念日小程序

## 一、产品功能

### 1.1 纪念日展示

可以增删改查纪念日，并且看到纪念日距离现在的天数。后续会增加纪念日的通知，比如一年挣了，666 天了，888 天了。

## 二、开发小问题

为什么不在 `index.tsx` 内直接写页面内容呢，为了使用 `React Hooks`。

```js
import Taro, { Component, Config } from "@tarojs/taro";
import Page from "./Page";
import "./add.scss";

export default class Index extends Component {
  config: Config = {
    navigationBarTitleText: "首页"
  };

  render() {
    return <Page />;
  }
}

// 当然 Taro 现在也支持下面这种方式, 只是这样的话，config 则没有TS 的智能提示。 这个不太喜欢因此保留这样的模式，后面可以替换掉
function Index() {
  return <View>Hello World</View>;
}
Index.config = {
  navigationBarTitleText: "首页"
};
```
