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
  // 纪念日
  times: [
    {
      id: 1,
      title: "来北京",
      time: "2015/09/28",
      remark: "那年一个人来了北京，挺好的"
    },
    { id: 2, title: "加入公司", time: "2016/10/31", remark: "" },
    { id: 3, title: "在一起", time: "2018/02/03", remark: "" }
  ],
  // 收藏的农历
  lunarDate: []
});

/**
 * 添加纪念日
 * @param item.title 纪念日标题
 * @param item.time 纪念日时间
 * @param item.remark 纪念日描述
 */
export const addTime = item => {
  TimeStore.set(({ times }) => ({
    times: [
      ...times,
      {
        ...item,
        id: times.reduce((maxId, todo) => Math.max(todo.id, maxId), -1) + 1
      }
    ]
  }));
};

/**
 * 删除纪念日
 **/
export const deleteTime = id => {
  TimeStore.set(({ times }) => ({
    times: times.filter(item => item.id !== id)
  }));
};

/**
 * 编辑纪念日
 */
export const editTime = (id, item) => {
  TimeStore.set(({ times }) => ({
    times: times.map(time => (time.id === id ? { ...time, ...item } : time))
  }));
};

/**
 * 根据 id 获取纪念日
 * @param {string|number} id 纪念日 id
 */
export const getTimeById = id => {
  let times = TimeStore.get().times;
  return times.filter(item => item.id === id)[0];
};
