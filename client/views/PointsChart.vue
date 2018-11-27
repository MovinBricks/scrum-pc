<template>
  <div
    id="app"
    class="wrap"
  >
    <div class="bg_top"></div>
    <div class="bg_bottom"></div>
    <header class="header">
      <div class="headerContent">
        <h1 class="title">
          敏捷拓展集 <span style="padding-left:10px;">ID：{{roomid}}</span>
        </h1>
        <nav class="nav">
          <a
            href="#"
            @click="showPointsAction"
            class="nav_item"
          >Show Points</a>
          <a
            href="#"
            @click="restartAction"
            class="nav_item"
          >Restart</a>
          <a
            href="#"
            @click="killAllAction"
            class="nav_item"
          >Kill All</a>
        </nav>

      </div>
    </header>
    <div class="main">
      <!--创建一个echarts的容器-->
      <div
        id="echartContainer"
        class="echartContainer"
      ></div>
      <div class="userBox">
        <div
          class="userItem"
          v-for="item in userData"
          :key="item.userInfo.uid"
        >
          <div class="userPhoto">

            <div
              class="userPhotoImgWrap"
              @click="killUserAction(item.userInfo.uid)"
            >
              <div
                class="blackShade"
                v-show="!item.score"
              >
                <img
                  src="../utils/svg-loaders/rings.svg"
                  class="loading-svg"
                  alt=""
                >
              </div>
              <img
                class="userPhotoImg"
                :src="item.userInfo.avatarUrl"
                alt=""
              >
            </div>
            <font-icon
              v-show="!!item.score"
              id="icon-gouxuan"
              class="userDoneGou"
            ></font-icon>

          </div>

          <div class="userItemName">
            <span class="userItemNameText">{{item.userInfo.nickName}}</span>
          </div>

        </div>
      </div>
      <div class="placeholder">
        <div
          v-show="isShowLoading"
          class="loadingBox"
        >
          <div class="thing"></div>
          <div class="thing"></div>
          <div class="thing"></div>
          <div class="thing"></div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
const echarts = require("echarts/lib/echarts");
require("echarts/lib/chart/bar");
const { serverHost } = require("../common/config.js");
/* const userData = [
    {
        id: 1,
        value: 5,
        isDone: true,
        name: "啸啸啸",
        photo: "https://pages.c-ctrip.com/hotel_h5/agility/photo_1.jpg"
    },
    {
        id: 2,
        value: 5,
        name: "天马",
        isDone: true,
        photo: "https://pages.c-ctrip.com/hotel_h5/agility/photo_2.jpg"
    },
    {
        id: 3,
        value: 2,
        name: "陶波",
        photo: "https://pages.c-ctrip.com/hotel_h5/agility/photo_3.jpg"
    },
    {
        id: 4,
        value: 3,
        name: "海岸",
        photo: "https://pages.c-ctrip.com/hotel_h5/agility/photo_4.jpg"
    },
    {
        id: 5,
        value: 8,
        name: "孝义",
        photo: "https://pages.c-ctrip.com/hotel_h5/agility/photo_5.jpg"
    },
    {
        id: 6,
        value: 5,
        name: "啸啸",
        photo: "https://pages.c-ctrip.com/hotel_h5/agility/photo_1.jpg"
    },
    {
        id: 7,
        value: 5,
        name: "天马",
        photo: "https://pages.c-ctrip.com/hotel_h5/agility/photo_2.jpg"
    },
    {
        id: 8,
        value: 2,
        name: "陶波",
        photo: "https://pages.c-ctrip.com/hotel_h5/agility/photo_3.jpg"
    },
    {
        id: 9,
        value: 3,
        name: "海岸",
        photo: "https://pages.c-ctrip.com/hotel_h5/agility/photo_4.jpg"
    }
]; */
function GetRequest() {
  let url = location.search; //获取url中"?"符后的字串
  let theRequest = new Object();
  if (url.indexOf("?") != -1) {
    let str = url.substr(1);
    let strs = str.split("&");
    for (let i = 0; i < strs.length; i++) {
      theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
    }
  }
  return theRequest;
}

export default {
  data() {
    return {
      userData: [],
      roomid: 0,
      average: 0,
      isShowLoading: true,
      myChart: null
    };
  },

  mounted() {
    this.openWebsock();
    this.myChart = echarts.init(document.getElementById("echartContainer"));
  },
  methods: {
    openWebsock() {
      this.websock = new WebSocket(serverHost);
      const Request = GetRequest();
      this.websock.onopen = () => {
        let webObj = { type: "CREATE" };
        if (Request.roomid) {
          this.roomid = Request.roomid;
          webObj.roomID = Request.roomid;
        }
        this.websock.send(JSON.stringify(webObj));

        console.log("onopen...");
      };
      this.websock.onmessage = evt => {
        var received_msg = JSON.parse(evt.data);

        if (
          received_msg.type === "CREATE" &&
          received_msg.status === "SUCCESS"
        ) {
          this.roomid = received_msg.roomID;
          window.history.replaceState(
            {
              roomid: this.roomid
            },
            "",
            `?roomid=${this.roomid}`
          );
        }

        if (
          ["JOIN_USER", "GRADE", "KICK", "RESTART"].includes(received_msg.type)
        ) {
          this.userData = received_msg.users;
        }

        if (
          received_msg.type === "RESTART" &&
          received_msg.status === "SUCCESS"
        ) {
          this.isShowLoading = true;
          this.userData = received_msg.users;
          this.myChart.clear();
        }

        if (received_msg.type === "KICK" && received_msg.status === "SUCCESS") {
          if (received_msg.average) {
            this.average = received_msg.average;
          }
          this.isShowLoading = true;
          this.createEcharts();
        }

        if (received_msg.type === "SHOW" && received_msg.status === "SUCCESS") {
          this.isShowLoading = false;
          this.createEcharts();
        }

        console.log("onmessage...", received_msg);
      };

      this.websock.onclose = () => {
        this.websock = new WebSocket(serverHost);
      };
    },

    restartAction() {
      this.websock.send(JSON.stringify({ type: "RESTART" }));
    },
    killAllAction() {
      const uids = this.userData.map(user => user.userInfo.uid);
      this.websock.send(JSON.stringify({ type: "KICK", kickedUids: uids }));
    },
    killUserAction(uid) {
      this.websock.send(JSON.stringify({ type: "KICK", kickedUids: [uid] }));
    },
    showPointsAction() {
      this.websock.send(JSON.stringify({ type: "SHOW" }));
    },
    createEcharts() {
      let yMax = 0;
      console.log(this.userData, "this.userData");
      const names = this.userData.map(d => d.userInfo.nickName);
      const values = this.userData.map(d => d.score);
      for (var i = 0; i < values.length; i++) {
        if (yMax < values[i]) {
          yMax = values[i];
        }
      }
      const dataShadow = this.userData.map(d => yMax);

      const option = {
        title: {
          show: false
        },
        xAxis: {
          type: "category",
          data: values,
          axisLabel: {
            inside: true,
            textStyle: {
              color: "#fff",
              fontSize: 20,
              fontWeight: "400"
            }
          },
          axisTick: {
            show: false
          },
          axisLine: {
            show: false
          },
          z: 10
        },
        yAxis: {
          type: "value",
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            textStyle: {
              color: "#333",
              fontSize: 14
            }
          }
        },
        series: [
          {
            // For shadow
            type: "bar",
            itemStyle: {
              normal: { color: "rgba(0,0,0,0.05)" }
            },
            barGap: "-100%",
            barCategoryGap: "40%",
            data: dataShadow,
            animation: false
          },
          {
            data: values,
            type: "bar",
            markLine:
              this.average > 0
                ? {
                    data: [
                      {
                        name: "推荐值",
                        yAxis: this.average
                      }
                    ]
                  }
                : null,
            itemStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: "#83bff6" },
                  { offset: 0.5, color: "#188df0" },
                  { offset: 1, color: "#188df0" }
                ])
              },
              emphasis: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: "#2378f7" },
                  { offset: 0.7, color: "#2378f7" },
                  { offset: 1, color: "#83bff6" }
                ])
              }
            }
          }
        ]
      };

      // 绘制图表
      this.myChart.setOption(option);
    }
  }
};
</script>

<style lang="scss" scoped>
.wrap {
  position: relative;
  overflow: hidden;
  background: #1e88e5;
  max-width: 100vw;
  box-sizing: border-box;
}
.main {
  -webkit-box-orient: horizontal;
  -webkit-box-direction: normal;
  max-width: 1040px;
  margin: 0 auto;
  position: relative;
  color: #fff;
  width: 100%;
  background-color: rgba($color: #5b9ce6, $alpha: 0.6);
  padding-bottom: 30px;
}
.bg_top {
  transform: skewY(-5deg) translateY(-90%);
  width: 100vw;
  height: 550px;
  top: 0px;
  position: absolute;
  background: linear-gradient(90deg, #2196f3, #1e88e5);
  background: -webkit-linear-gradient(90deg, #2196f3, #1e88e5);
  background: -moz-linear-gradient(90deg, #2196f3, #1e88e5);
  box-sizing: border-box;
}
.bg_bottom {
  transform: skewY(-5deg) translateY(76%);
  bottom: 0px;
  background: #fff;
  width: 100vw;
  height: 550px;
  position: absolute;
  box-sizing: border-box;
}

.header {
  background-color: #1e88e5;
  z-index: 900;
  width: 100%;
  height: 48px;
  margin-bottom: 10px;
}
.headerContent {
  max-width: 1040px;
  margin: 0 auto;
  color: #fff;
  align-items: center;
  -webkit-box-align: center;
  display: flex;
  display: -webkit-box;
  display: -moz-box;
  display: -ms-flexbox;
  display: -webkit-flex;
  position: relative;
}
.title {
  font-weight: 400;
  font-size: 20px;
  padding: 10px 20px;
  margin: 0px;
}
.nav {
  margin-left: auto;
}
.nav_item {
  display: inline-block;
  text-align: left;
  font-size: 17px;
  transition: all 0.15s ease;
  -webkit-transition: all 0.15s ease;
  -moz-transition: all 0.15s ease;
  text-decoration: none;
  line-height: 2;
  padding: 5px 20px;
  cursor: pointer;
  font-weight: 400;
  color: white;
}
.nav_item:hover {
  background-color: #2c4f94;
}
.echartContainer {
  width: 1040px;
  height: 500px;
  position: relative;
  z-index: 2;
}

.userBox {
  width: 840px;
  margin: 0 auto;
  display: flex;
  padding: 0 80px;
  position: relative;
  z-index: 3;
  margin-top: -30px;
}
.userItem {
  flex: 1;
  margin: 0 0.5rem;
  position: relative;
}
.blackShade {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  background-color: rgba($color: #000000, $alpha: 0.4);
}
.loading-svg {
  width: 100%;
}
.userPhoto {
  margin: 0 auto;
  position: relative;
  max-width: 50px;
}
.userPhotoImgWrap {
  position: relative;
  border: 3px solid #ccdeed;
  border-radius: 50%;
  overflow: hidden;
}
.userPhotoImg {
  width: 100%;

  display: block;
}
.userItemName {
  margin: 0 auto;
  text-align: center;
  padding-top: 5px;
}
.userItemNameText {
  font-size: 14px;
  font-weight: "600";
  color: #ffffff;
}
.userDoneGou {
  font-size: 20px;
  position: absolute;
  z-index: 2;
  right: -2px;
  bottom: -3px;
  color: #4b88e5;
}

$size: 50px;
.placeholder {
  width: 900px;
  height: 420px;
  left: 70px;
  top: 40px;
  position: absolute;
  background-color: rgba($color: #fff, $alpha: 0.3);
  z-index: 1;
}
.loadingBox {
  height: #{$size * 2};
  width: #{$size * 2};
  position: absolute;
  top: calc(50% - #{$size / 2});
  left: calc(50% - #{$size / 2});
  perspective: 1000px;
}

.thing {
  height: $size;
  width: $size;
  background-color: #e87722;
  position: absolute;
  box-sizing: border-box;
  top: 0;
  left: 0;
}

@for $i from 1 through 4 {
  .thing:nth-of-type(#{$i}) {
    animation: bounce 0.5s ease-in-out infinite alternate,
      move 4s #{-$i}s infinite;
  }
}

@keyframes bounce {
  from {
    transform: scale(1);
  }
  to {
    transform: scale(0.8);
  }
}

@keyframes move {
  0% {
    top: 0;
    left: 0;
    background-color: #e87722;
  }
  25% {
    top: 0;
    left: 50%;
    background-color: #a4d65e;
  }
  50% {
    top: 50%;
    left: 50%;
    background-color: #69b3e7;
  }
  75% {
    top: 50%;
    left: 0;
    background-color: #ffc845;
  }
}
</style>
