<template>
    <div id="app" class="wrap">
        <div class="bg_top"></div>
        <div class="bg_bottom"></div>
        <header class="header">
            <div class="headerContent">
                <h1 class="title">
                    敏捷拓展集
                    <span style="padding-left:10px;">ID：{{roomid}}</span>
                </h1>
                <nav class="nav">
                    <span @click="showPointsAction" class="nav_item">Show Points</span>
                    <span @click="restartAction" class="nav_item">Restart</span>
                    <span @click="killAllAction" class="nav_item">Kill All</span>
                </nav>
            </div>
        </header>
        <div class="main">
            <!--创建一个echarts的容器-->
            <div id="echartContainer" class="echartContainer"></div>
            <div class="userBox">
                <div class="userItem" v-for="item in userData" :key="item.userInfo.uid">
                    <div class="userPhoto">
                        <div class="userPhotoImgWrap icon-close" @click="killUserAction(item.userInfo.uid)">
                            <div class="blackShade" v-show="!item.score">
                                <img src="../utils/svg-loaders/puff.svg" class="loading-svg" alt>
                            </div>
                            <img class="userPhotoImg" :src="item.userInfo.avatarUrl" alt>
                        </div>
                        <font-icon v-show="!!item.score" id="icon-gouxuan" class="userDoneGou"></font-icon>
                    </div>
    
                    <div class="userItemName">
                        <span class="userItemNameText">{{item.userInfo.nickName}}</span>
                    </div>
                </div>
            </div>
            <div class="placeholder">
                <!-- <div v-show="isShowLoading" class="loadingBox">
                                                            <div class="thing"></div>
                                                            <div class="thing"></div>
                                                            <div class="thing"></div>
                                                            <div class="thing"></div>
            </div>-->
                <Loading v-show="isShowLoading" class="loading-box" />
            </div>
        </div>
    </div>
</template>

<script>
    import Loading from "../components/Loading.vue";
    //const echarts = require('echarts');
    const echarts = require("echarts/lib/echarts");
    require("echarts/lib/chart/bar");
    require("echarts/lib/component/markLine");
    const {
        serverHost
    } = require("../common/config.js");
    
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
        components: {
            Loading
        },
        methods: {
            openWebsock() {
                this.websock = new WebSocket(serverHost);
                const Request = GetRequest();
                this.websock.onopen = () => {
                    let webObj = {
                        type: "CREATE"
                    };
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
                        window.history.replaceState({
                                roomid: this.roomid
                            },
                            "",
                            `?roomid=${this.roomid}`
                        );
                        this.restartAction();
                    }
    
                    if (
                        ["JOIN_USER", "CREATE", "GRADE", "KICK", "RESTART"].includes(
                            received_msg.type
                        )
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
                        this.isShowLoading = true;
                        this.createEcharts();
                    }
    
                    if (received_msg.type === "SHOW" && received_msg.status === "SUCCESS") {
                        this.isShowLoading = false;
                        if (received_msg.average) {
                            this.average = received_msg.average;
                        }
                        this.createEcharts();
                    }
    
                    console.log("onmessage...", received_msg);
                };
    
                this.websock.onclose = () => {
                    this.websock = new WebSocket(serverHost);
                };
            },
    
            restartAction() {
                this.websock.send(
                    JSON.stringify({
                        type: "RESTART"
                    })
                );
            },
            killAllAction() {
                const uids = this.userData.map(user => user.userInfo.uid);
                this.websock.send(
                    JSON.stringify({
                        type: "KICK",
                        kickedUids: uids
                    })
                );
            },
            killUserAction(uid) {
                this.websock.send(
                    JSON.stringify({
                        type: "KICK",
                        kickedUids: [uid]
                    })
                );
            },
            showPointsAction() {
                this.websock.send(
                    JSON.stringify({
                        type: "SHOW"
                    })
                );
            },
            createEcharts() {
                let yMax = 0;
                const names = this.userData.map(d => d.userInfo.nickName);
                const values = this.userData.map(d => d.score || 0);
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
                    series: [/* {
                            // For shadow
                            type: "bar",
                            itemStyle: {
                                normal: {
                                    color: "rgba(0,0,0,0.05)"
                                }
                            },
                            barGap: "-100%",
                            barCategoryGap: "40%",
                            data: dataShadow,
                            animation: false
                        }, */
                        {
                            data: values,
                            type: "bar",
                            markLine: this.average > 0 ?
                                {
                                    data: [{
                                        type: "average",
                                        name: "推荐值",
                                        yAxis: this.average
                                    }]
                                } :
                                null,
                            itemStyle: {
                                normal: {
                                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                            offset: 0,
                                            color: "#83bff6"
                                        },
                                        {
                                            offset: 0.5,
                                            color: "#188df0"
                                        },
                                        {
                                            offset: 1,
                                            color: "#188df0"
                                        }
                                    ])
                                },
                                emphasis: {
                                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                            offset: 0,
                                            color: "#2378f7"
                                        },
                                        {
                                            offset: 0.7,
                                            color: "#2378f7"
                                        },
                                        {
                                            offset: 1,
                                            color: "#83bff6"
                                        }
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
        text-decoration: none;
        line-height: 2;
        padding: 5px 20px;
        cursor: pointer;
        font-weight: 400;
        position: relative;
        color: white;
        -webkit-transform: perspective(1px) translateZ(0);
        transform: perspective(1px) translateZ(0);
        transition-duration: 0.3s;
    }
    
    .nav_item:before {
        content: "";
        position: absolute;
        z-index: -1;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background: #3866AB;
        -webkit-transform: scaleX(0);
        transform: scaleX(0);
        -webkit-transform-origin: 50%;
        transform-origin: 50%;
        -webkit-transition-property: transform;
        transition-property: transform;
        -webkit-transition-duration: 0.3s;
        transition-duration: 0.3s;
        -webkit-transition-timing-function: ease-out;
        transition-timing-function: ease-out;
    }
    
    .nav_item:hover:before {
        -webkit-transform: scaleX(1);
        transform: scaleX(1);
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
        margin-top: -20px;
    }
    
    .userItem {
        flex: 1;
        margin: 0 0.5rem;
        position: relative;
    }
    
    .blackShade {
        width: 180%;
        height: 180%;
        left: -40%;
        top: -40%;
        position: absolute;
        border-radius: 50%;
        //background-color: rgba($color: #000000, $alpha: 0.4);
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
        transition: all 1s;
        cursor: pointer;
        position: relative;
        border: 3px solid #ccdeed;
        border-radius: 50%;
        //overflow: hidden;
    }
    
    .userPhotoImgWrap .userPhotoImg {
        transition: all 0.5s;
        width: 100%;
        border-radius: 50%;
        position: relative;
        display: block;
    }
    
    .userPhotoImgWrap:before {
        background-color: rgba(0, 0, 0, 0);
        border-radius: 50%;
        height: 0;
        display: flex;
        font-size: 26px;
        margin: 0;
        width: 0;
        opacity: 0;
        left: 50%;
        top: 50%;
        position: absolute;
        transition: all 0.5s;
        z-index: 4;
        align-items: center;
        justify-content: center;
    }
    
    .userPhotoImgWrap:hover:before {
        background-color: rgba(0, 0, 0, 0.8);
        width: 120%;
        margin: -60%;
        opacity: 1;
        height: 120%;
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
        background-color: rgba($color: #fff, $alpha: 0.8);
        z-index: 1;
    }
    
    .loading-box {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }
</style>
