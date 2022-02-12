
import EventEmitter from "../public/common/eventEmitter"
import { greetQueue } from "../public/common/eventQueue";
import { companyList } from "./data/companyList"
import { countDown } from "../public/common/util"
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
        countDown(timeDiff);
    }
    timeResolve() {
        let random = this.getMathRandom(1, 3);
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve()
            }, 5000 * random);
        })
    }
    getMathRandom(min, max) {
        return Math.floor(Math.random(max - min + 1)) + min;
    }
    async interValtask() {
        let random = this.getMathRandom(1, 3);
        let list = $('.user-list').find('li');
        if (this.isGreetUrl()) {
            const greetList = this.getGreetList();
            for (let g of greetList) {
                // 防止账号被识别到恶意操作导致被封 。>5秒之行一下，>3秒延迟做一次点击
                await this.timeResolve()
                // console.log(g)
                $(list)[g.index].scrollIntoView({ behavior: 'smooth' })
                setTimeout(() => {
                    $(list)[g.index].click()
                }, 3000 * random);
            }
            // this.greetTask(greetList);
        } else {
            window.open("https://www.zhipin.com/web/geek/chat");
        }
    }
    getGreetList() {
        let list = $('.user-list').find('li');
        let res = []
        $(list).each(function () {
            const name = $(this).find('.gray').text();
            const index = $(this).index();
            for (let item of companyList) {
                if (name.includes(item.name)) {
                    res.push({ name, index })
                }
            }
        });
        console.log(res);
        return res;
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
}