import Taro from "@tarojs/taro";
import { Store } from "laco";
import { useState, useEffect } from "@tarojs/taro";

export function useStore(store) {
  const [state, setState] = useState(store.get());

  function updateState() {
    // 把数据缓存到 storage
    Taro.setStorage({
      key: "time-store",
      data: JSON.stringify(store.get())
    }).then(() => {
      console.log(`[INFO]:set storage success...`);
    });
    setState(store.get());
  }

  useEffect(() => {
    store.subscribe(updateState);
    return () => store.unsubscribe(updateState);
  });

  return state;
}

export const TimeStore = new Store({
  user: {},
  openid: "",
  // 纪念日
  times: [],
  // 收藏的农历
  lunarDate: []
});

/**
 * 设置用户信息
 */
export const setUser = item => {
  TimeStore.set(() => ({ user: item }));
};

/**
 * 设置用户信息
 */
export const setOpenid = id => {
  TimeStore.set(() => ({ openid: id }));
};

/**
 * 设置纪念日列表
 */
export const setTimes = times => {
  TimeStore.set(() => ({ times: times }));
};

/**
 * 添加纪念日
 * @param item.title 纪念日标题
 * @param item.time 纪念日时间
 * @param item.remark 纪念日描述
 */
export const addTime = item => {
  TimeStore.set(({ times }) => ({
    times: [...times, item]
  }));
};

/**
 * 删除纪念日
 **/
export const deleteTime = id => {
  TimeStore.set(({ times }) => ({
    times: times.filter(item => item._id !== id)
  }));
};

/**
 * 编辑纪念日
 */
export const editTime = (id, item) => {
  TimeStore.set(({ times }) => ({
    times: times.map(time => (time._id === id ? { ...time, ...item } : time))
  }));
};

/**
 * 根据 id 获取纪念日
 * @param {string|number} id 纪念日 id
 */
export const getTimeById = id => {
  let times = TimeStore.get().times;
  return times.filter(item => item._id === id)[0];
};
