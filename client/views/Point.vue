<template>
    <div class='card-list-wrap'>
        <div class='top-bar'>
            <div class='points-view'>
                <span class='points-text'>评分：<span class='points-total'>{{totalPoints}}</span></span>
            </div>
            <button class='quit-btn' @click="webSocket">提交</button>
        </div>
        <div class='card-list'>
            <div v-for="item in cards" class='card' v-bind:style="{backgroundColor:item.bgColor}" :key="item.value" @click='selectCard(item.value)'>
                <div class='selected-card' v-show="{hasChoose}">
                    <font-icon id="icon-wenhao" class="selected-card-icon"></font-icon>
                </div>
                <font-icon :id='"icon-"+item.name' class="cardText"></font-icon>
            </div>

        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            cards: [
                {
                    value: "1",
                    bgColor: "#19A0F0",
                    name: "shuzi1"
                },
                {
                    value: "2",
                    bgColor: "#F5D397",
                    name: "shuzi2"
                },
                {
                    value: "3",
                    bgColor: "#4993DC",
                    name: "shuzi3"
                },
                {
                    value: "5",
                    bgColor: "#F3BB7A",
                    name: "shuzi5"
                },
                {
                    value: "8",
                    bgColor: "#3B79B7",
                    name: "shuzi8"
                },
                {
                    value: "13",
                    bgColor: "#E1A05C",
                    name: "shuzi13"
                },
                {
                    value: "20",
                    bgColor: "#2C5F91",
                    name: "shuzi20"
                },
                {
                    value: "unknown",
                    bgColor: "#C78538",
                    name: "wenhao"
                }
            ],
            selectValues: [],
            websock: null
        };
    },
    computed: {
        totalPoints() {
            let _result = 0;
            if (this.selectValues.includes("unknown")) {
                _result = "unknown";
            } else if (this.selectValues.length) {
                _result = this.selectValues.reduce(
                    (v1, v2) => Number(v1) + Number(v2)
                );
            }
            return _result;
        },
        hasChoose(value) {
            return this.selectValues.includes(value);
        }
    },
    methods: {
        selectCard(value) {
            if (this.selectValues.includes(value)) {
                this.selectValues.splice(
                    this.selectValues.findIndex(v => v === value),
                    1
                );
            } else {
                this.selectValues.push(value);
            }
        },
        webSocket() {
            this.$socket.emit("add", { a: 5, b: 3 });
        }
    },
    socket: {
        // Prefix for event names
        // prefix: "/counter/",
        // If you set `namespace`, it will create a new socket connection to the namespace instead of `/`
        // namespace: "/counter",
        events: {
            // Similar as this.$socket.on("changed", (msg) => { ... });
            // If you set `prefix` to `/counter/`, the event name will be `/counter/changed`
            //
            changed(msg) {
                console.log("Something changed: " + msg);
            },

            //common socket.io events
            connect() {
                console.log("Websocket connected to " + this.$socket.nsp);
            },

            disconnect() {
                console.log("Websocket disconnected from " + this.$socket.nsp);
            },

            error(err) {
                console.error("Websocket error!", err);
            }
        }
    }
};
</script>

<style lang="scss" scoped>
/* pages/cards/cards.wxss */

.card-list-wrap {
    background-color: #ebebeb;
    padding-top: 0.5rem;
    padding-bottom: 3rem;
}

.top-bar {
    display: flex;
    background-color: #fff;
    border-radius: 0.3rem;
    margin: 0.5rem 0.5rem;
    margin-top: 0;
    padding: 0.5rem;
}

.points-view {
    flex: 1;
    height: 30px;
    line-height: 30px;
}

.points-text {
    font-size: 16px;
    line-height: 16px;
    color: #333;
}

.points-total {
    color: #19a0f0;
    font-weight: 600;
}

.quit-btn {
    border-radius: 5px;
    width: 80px;
    height: 30px;
    line-height: 30px;
    font-size: 14px;
    padding: 0;
    color: #fff;
    background-color: #4fc232;
}

.card-list {
    box-sizing: border-box;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    background-color: #fff;
    margin: 0.5rem 0.5rem;
    padding-top: 1rem;
    border-radius: 0.5rem;
}

.card {
    width: 8rem;
    height: 5rem;
    line-height: 5rem;
    font-size: 3.5rem;
    text-align: center;
    border-radius: 0.3rem;
    margin-bottom: 1rem;
    position: relative;
}

.cardText {
    color: #fff;
}
.selected-card {
    position: absolute;
    width: 100%;
    height: 100%;
    opacity: 0.6;
    background-color: #000;
}
.selected-card-icon::before {
    content: "\e650";
    color: #fff;
    font-size: 40px;
}
</style>
