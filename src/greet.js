
import EventEmitter from "../public/common/eventEmitter"
import { greetQueue } from "../public/common/eventQueue";
export default class GreetTask {
    constructor() {
        this.timeSpace = 24 * 60 * 60 * 1000;
        this.hour = 10;
        this.greetTimeArray = [];
        this.countDownTimer = null;
        this.intervalTime = localStorage.intervalTime || 15;
        this.events = new EventEmitter();
    }
    // 任务初始化
    init(type) {
        // 任务发布
        if (type === "stop") {
            this.events.emit('stopTask');
        } else {
            this.events.emit('startTask');
        }
        return this;
    }
    // 开始任务
    startTask() {
        this.openTask() ? this.interValtask() : this.listenerTime();
    }
    //结束任务
    stopTask() {
        let { greetTimeArray } = this;
        for (let i = 0; i < greetTimeArray.length; i++) {
            clearTimeout(greetTimeArray[i]);
        }
        clearTimeout(this.countDownTimer);
        alert('插件已停止运行!!');
    }
    // 消息监听
    listerMessage() {
        // 任务订阅
        greetQueue.forEach((queue) => {
            this.events.on(queue.eventName, this[queue.eventCallback].bind(this));
        })
        chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
            if (request.type === 'start') {
                alert('您设置了时间!!,插件将记录您的设置');
                localStorage.setItem('intervalTime', request.intervalTime);
                if (this.isGreetUrl()) {
                    window.location.reload();
                } else {
                    window.open("https://www.zhipin.com/web/geek/chat");
                }

            }
            this.init(request.type);
        });
        return this;
    }
    getStartTimeStamp() {
        const Year = new Date().getFullYear();
        const Month = new Date().getMonth() + 1;
        const date = new Date().getDate();
        let timeStamp = new Date(Year + '-' + Month + '-' + date + " " + "10:00:00").getTime();
        return timeStamp
    }
    // 监听时间
    listenerTime() {
        let StartTimeStamp = this.getStartTimeStamp();
        let curStamp = new Date().getTime();
        let timeDiff = StartTimeStamp - curStamp;
        this.countDown(timeDiff);
    }
    interValtask() {
        if (this.isGreetUrl()) {
            const btnArray = this.getResumeBtnList();
            this.greetTask(btnArray);
        } else {
            // window.open("https://www.zhipin.com/web/geek/chat");
        }
    }
    // 当前时间是否在任务开启时间
    openTask() {
        return new Date().getHours() >= this.hour;
    }
    // 判断是否是打招呼页面
    isGreetUrl() {
        const cUrl = "https://www.zhipin.com/web/geek/chat";
        return location.href.indexOf(cUrl) !== -1;
    }
    // 倒计时
    countDown(timeNum) {
        if (timeNum < 0) {
            return
        }
        this.countDownTimer = setInterval(() => {
            timeNum -= 1000;
            console.log('timeNum:', timeNum)
            if (timeNum <= 0) {
                console.log('重新开始打招呼')
                clearInterval(this.countDownTimer)
                window.location.reload();
            }
        }, 1000);
    }
}