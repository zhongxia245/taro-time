import Taro, { useState, useRouter, useEffect } from "@tarojs/taro";
import { View, Text, Picker } from "@tarojs/components";
import { AtForm, AtInput, AtTextarea, AtButton } from "taro-ui";
import dayjs from "dayjs";

import { addTime, editTime, getTimeById } from "../../store/index";

import "./add.scss";

export default function Add() {
  const routerParams = useRouter().params;
  const id = routerParams.id;

  const [data, setData] = useState({
    time: dayjs(new Date()).format("YYYY/MM/DD"),
    title: "",
    remark: ""
  });

  useEffect(() => {
    if (id) {
      let time = getTimeById(id);
      setData(time);
    }
  }, []);

  const action = {
    onChange(name, val) {
      val = val.detail ? val.detail.value : val;
      setData({ ...data, [name]: val });
    },
    onAdd() {
      const db = Taro.cloud.database();
      db.collection("times").add({
        data: data,
        success: res => {
          addTime({ ...data, _id: res._id });
        },
        fail: err => {
          console.error("[数据库] [新增记录] 失败：", err);
          Taro.showToast({
            title: "添加记录失败~",
            icon: "fail"
          });
        }
      });
    },
    onEdit() {
      const db = Taro.cloud.database();
      db.collection("times")
        .doc(id)
        .update({
          data: { title: data.title, time: data.time, remark: data.remark },
          success: () => {
            editTime(id, data);
          },
          fail: err => {
            console.error("[数据库] [更新记录] 失败：", err);
            Taro.showToast({
              title: "更新记录失败~",
              icon: "fail"
            });
          }
        });
    },
    onSubmit() {
      if (!data.title) {
        Taro.showToast({
          title: "纪念日标题不能为空",
          icon: "none"
        });
        return;
      }
      if (!data.time) {
        Taro.showToast({
          title: "纪念日时间不能为空",
          icon: "none"
        });
        return;
      }

      if (id) {
        action.onEdit();
      } else {
        action.onAdd();
      }
      Taro.navigateBack();
    }
  };

  return (
    <View className="page-add">
      <AtForm onSubmit={action.onSubmit}>
        <AtInput
          name="value"
          title="标题"
          type="text"
          placeholder="这个日子是什么呢？"
          value={data.title}
          onChange={val => {
            action.onChange("title", val);
          }}
        />
        <View className="form-item">
          <Text className="form-item__label">日期</Text>
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
        <View className="form-item">
          <AtTextarea
            value={data.remark}
            onChange={e => {
              let val = e.detail.value;
              action.onChange("remark", val);
            }}
            maxLength={200}
            placeholder="这个日子有什么值得记录的话吗？"
          />
        </View>
        <AtButton formType="submit" type="primary">
          {id ? "更新" : "提交"}
        </AtButton>
      </AtForm>
    </View>
  );
}

Add.config = {
  navigationBarTitleText: "添加个好日子"
};
