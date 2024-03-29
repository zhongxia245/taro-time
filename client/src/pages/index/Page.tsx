import Taro, { useEffect } from "@tarojs/taro";
import { View, Text } from "@tarojs/components";
import { AtCard, AtSwipeAction, AtFab } from "taro-ui";
import dayjs from "dayjs";
import { useStore, TimeStore, deleteTime, setTimes } from "../../store";
import "./index.scss";

export default function Page() {
  const { times, openid } = useStore(TimeStore);

  useEffect(() => {
    action.getData();
  }, []);

  const action = {
    getData() {
      const db = Taro.cloud.database();
      db.collection("times")
        .where({
          _openid: openid
        })
        .get({
          success: res => {
            setTimes(res.data);
            console.log("[数据库] [查询记录] 成功: ", res);
          },
          fail: err => {
            console.error("[数据库] [查询记录] 失败：", err);
          }
        });
    },
    onDelete(id) {
      if (id) {
        const db = Taro.cloud.database();
        db.collection("times")
          .doc(id)
          .remove({
            success: res => {
              console.log("[数据库] [删除记录] 成功：", res);
              deleteTime(id);
            },
            fail: err => {
              console.error("[数据库] [删除记录] 失败：", err);
            }
          });
      }
    },
    onAdd() {
      Taro.navigateTo({ url: "add" });
    },
    onEdit(id) {
      Taro.navigateTo({ url: `add?id=${id}` });
    }
  };

  return (
    <View className="page-index">
      <View className="page-index__fixedbtn">
        <AtFab onClick={action.onAdd}>
          <Text className="at-fab__icon at-icon at-icon-add"></Text>
        </AtFab>
      </View>
      {times.map(item => {
        let now = new Date();
        let timeDate = new Date(item.time);

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
        return (
          <View key={String(item._id)} className="page-index__card">
            <AtSwipeAction
              autoClose
              onClick={() => {
                action.onDelete(item._id);
              }}
              options={[
                {
                  text: "删除",
                  style: {
                    backgroundColor: "#FF4949"
                  }
                }
              ]}
            >
              <AtCard
                title={item.title}
                extra={item.time}
                onClick={() => {
                  action.onEdit(item._id);
                }}
              >
                <View>
                  距离今天已经过了<Text className="card__days">{diffDays}</Text>
                  天
                  {diffYears > 0 ? (
                    <Text>
                      （<Text className="card__days">{diffYears}</Text>年+）
                    </Text>
                  ) : (
                    ""
                  )}
                  ~
                </View>
                <View>
                  距离明年的『{item.title}』，还有
                  <Text className="card__days">{countDownDays}</Text>
                  天哦~
                </View>
                <View className="card__remark">{item.remark}</View>
              </AtCard>
            </AtSwipeAction>
          </View>
        );
      })}
    </View>
  );
}
