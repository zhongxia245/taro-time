import Taro, { useState, useEffect, getSystemInfoSync } from "@tarojs/taro";
import { View, MovableArea, MovableView } from "@tarojs/components";
import { useStore, TimeStore } from "../../store";
import "./index.scss";

export default function MoveCard() {
  const { times } = useStore(TimeStore);
  const [systemInfo, setSystemInfo] = useState({
    screenWidth: 320,
    screenHeight: 568,
    pixelRatio: 2
  });
  const [data, setData]: any[] = useState({
    x: systemInfo.screenWidth,
    y: 0,
    startX: 0,
    startY: 0,
    distance: 0,
    list: []
  });

  useEffect(() => {
    let systemInfo = getSystemInfoSync();
    setSystemInfo(systemInfo);
    action.getData();
  }, []);

  const action = {
    getData() {
      let newList = [...data.list];
      let arr = JSON.parse(JSON.stringify(times)) || [];
      for (let item of arr) {
        item.x = systemInfo.screenWidth;
        item.y = 0;
        newList.unshift(item);
      }
      setData({ ...data, list: newList });
    },
    onTouchStart(e) {
      let startX = e.touches[0].clientX;
      let startY = e.touches[0].clientY;
      setData({ ...data, startX, startY });
    },
    onTouchEnd(e) {
      let startX = data.startX;
      let startY = data.startY;
      let endX = e.changedTouches[0].clientX;
      let endY = e.changedTouches[0].clientY;
      var distance = data.distance;
      // 与结束点与图片初始位置距离
      let disX = Math.abs(distance - systemInfo.screenWidth);
      // 当前操作，初始点与结束点距离
      let disClientX = Math.abs(endX - startX);
      let disClientY = Math.abs(endY - startY);

      // 当滑动大于 滑块宽度的1/3翻页
      let moveDis = 666 / (systemInfo.pixelRatio * 4);

      if (disX > moveDis && disClientX > moveDis) {
        console.log("切换下一张");
        let newList = data.list;
        let index = e.currentTarget.dataset.index;
        newList[index].x =
          endX - startX > 0
            ? systemInfo.screenWidth * 2
            : -systemInfo.screenWidth;
        setData({ ...data, list: newList });

        setTimeout(() => {
          newList.splice(newList.length - 1, 1);
          setData({ ...data, list: newList });
          // // 列表长度小于4的时候请求服务端
          // if (list.length < 2) {
          //   action.getData();
          // }
        }, 300);
      } else if (disClientX < 1 && disClientY < 1) {
        // 点击进入
        console.log("点击进入详情");
      } else {
        console.log("移动距离太短");
        let newList = data.list;

        let index = e.currentTarget.dataset.index;
        newList[index].x = systemInfo.screenWidth;
        newList[index].y = 0;
        setData({ ...data, list: newList });
      }
    },
    onChange(e) {
      setData({ ...data, distance: e.detail.x });
    }
  };

  return (
    <View className="m-box">
      <MovableArea className="m-area">
        {data.list.map((time, index) => {
          return (
            <MovableView
              key={String(time.id + "_" + index)}
              x={time.x}
              y={time.y}
              data-index={index}
              className="m-item"
              damping={50}
              direction="all"
              inertia={true}
              outOfBounds={false}
              onChange={action.onChange}
              onTouchStart={action.onTouchStart}
              onTouchEnd={action.onTouchEnd}
            >
              <View className={`m-item-box ${index === 0 ? "box-active" : ""}`}>
                {time.title}
              </View>
            </MovableView>
          );
        })}
      </MovableArea>
    </View>
  );
}

MoveCard.config = {
  navigationBarTitleText: "卡片列表"
};
