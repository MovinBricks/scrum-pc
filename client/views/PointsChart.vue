<template>
    <div id="app" class="wrap">
        <div class="bg_top"></div>
        <div class="bg_bottom"></div>
        <header class="header">
            <div class="headerContent">
                <h1 class="title">
                    敏捷拓展集
                </h1>
                <nav class="nav">
                    <a href="#" class="nav_item">Show Points</a>
                    <a href="#" class="nav_item">Restart</a>
                    <a href="#" class="nav_item">Kill All</a>
                </nav>

            </div>
        </header>
        <div class="main">
            <!--创建一个echarts的容器-->
            <div id="echartContainer" class="echartContainer"></div>
            <div class="userBox">
                <div class="userItem" v-for="item in userData" :key="item.id">
                    <div class="userPhoto">
                        <img class="userPhotoImg" :src="item.photo" alt="">
                    </div>
                    <div class="userItemName">
                        <span class="userItemNameText">{{item.name}}</span>
                    </div>
                </div>
            </div>
            <div class="placeholder">

            </div>
        </div>
    </div>
</template>

<script>
const echarts = require("echarts");
const userData = [
    {
        id: 1,
        value: 5,
        name: "啸啸啸",
        photo: "https://pages.c-ctrip.com/hotel_h5/agility/photo_1.jpg"
    },
    {
        id: 2,
        value: 5,
        name: "天马",
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
];
export default {
    data() {
        return {
            userData: userData
        };
    },
    mounted() {
        // 基于准备好的dom，初始化echarts实例
        const myChart = echarts.init(
            document.getElementById("echartContainer")
        );

        let yMax = 0;
        let suggest = 5;

        const names = userData.map(d => d.name);
        const values = userData.map(d => d.value);
        for (var i = 0; i < values.length; i++) {
            if (yMax < values[i]) {
                yMax = values[i];
            }
        }
        const dataShadow = userData.map(d => yMax);

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
                    markLine: {
                        data: [
                            {
                                name: "推荐值",
                                yAxis: suggest
                            }
                        ]
                    },
                    itemStyle: {
                        normal: {
                            color: new echarts.graphic.LinearGradient(
                                0,
                                0,
                                0,
                                1,
                                [
                                    { offset: 0, color: "#83bff6" },
                                    { offset: 0.5, color: "#188df0" },
                                    { offset: 1, color: "#188df0" }
                                ]
                            )
                        },
                        emphasis: {
                            color: new echarts.graphic.LinearGradient(
                                0,
                                0,
                                0,
                                1,
                                [
                                    { offset: 0, color: "#2378f7" },
                                    { offset: 0.7, color: "#2378f7" },
                                    { offset: 1, color: "#83bff6" }
                                ]
                            )
                        }
                    }
                }
            ]
        };

        // 绘制图表
        myChart.setOption(option);
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
.placeholder {
    width: 900px;
    height: 420px;
    left: 70px;
    top: 40px;
    position: absolute;
    background-color: rgba($color: #fff, $alpha: 0.8);
    z-index: 1;
}
.userBox {
    width: 840px;
    margin: 0 auto;
    display: flex;
    padding: 0 80px;
    margin-top: -30px;
}
.userItem {
    flex: 1;
    margin: 0 0.5rem;
}
.userPhoto {
    border-radius: 50%;
    overflow: hidden;
    margin: 0 auto;
    border: 3px solid #ccdeed;
    max-width: 50px;
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
</style>