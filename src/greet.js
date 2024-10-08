
import EventEmitter from "../public/common/eventEmitter"
import { greetQueue } from "../public/common/eventQueue";
import { companyList } from "./data/companyList"
import { countDown, getStartTimeStamp, getMathRandom } from "../public/common/util"
export default class GreetTask {
    constructor() {
        this.timeSpace = 24 * 60 * 60 * 1000;
        this.greetTimeArray = [];
        this.countDownTimer = null;
        this.intervalTime = localStorage.intervalTime || 15;
        this.events = new EventEmitter();
        this.setStartTime = null;
    }
    // 任务初始化
    init(type) {
        // 任务发布
        if (type === "stop") {
            this.events.emit("stopTask");
        } else {
            this.events.emit("startTask");
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
        alert("插件已停止运行!!");
    }
    // 消息监听
    listerMessage() {
        // 任务订阅
        greetQueue.forEach((queue) => {
            this.events.on(queue.eventName, this[queue.eventCallback].bind(this));
        })
        chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
            if (request.type === "start") {
                alert("您设置了时间!!,插件将记录您的设置");
                localStorage.setItem("intervalTime", request.intervalTime);
                localStorage.setItem("startTime", request.timeStr);
                this.intervalTime = request.intervalTime
                this.setStartTime = request.timeStr;
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
    // 监听时间
    listenerTime() {
        let curStamp = new Date().getTime();
        let StartTimeStamp = getStartTimeStamp(this.setStartTime);
        let timeDiff = StartTimeStamp - curStamp;
        countDown(timeDiff, () => { window.location.reload() });
    }
    timeResolve() {
        let random = getMathRandom(1, 3);
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve()
            }, this.intervalTime * random);
        })
    }
    async interValtask() {
        let random = getMathRandom(1, 3);
        let list = $(".user-list").find("li");
        if (this.isGreetUrl()) {
            const greetList = this.getGreetList();
            for (let g of greetList) {
                // 防止账号被识别到恶意操作导致被封，>3秒延迟做一次点击
                await this.timeResolve()
                $(list)[g.index].scrollIntoView({ behavior: "smooth" })
                setTimeout(() => {
                    $(list)[g.index].click();
                    $(".respond-popover").find('.btn-agree').click(); // 同意发送简历
                }, 3000 * random);
            }
            // this.greetTask(greetList);
        } else {
            window.open("https://www.zhipin.com/web/geek/chat");
        }
    }
    getGreetList() {
        let list = $(".user-list").find("li"),
            res = [];
        $(list).each(function () {
            let name = $(this).find(".gray").text(),
                index = $(this).index();
            for (let item of companyList) {
                name.includes(item.name) && res.push({ name, index })
            }
        });
        console.log(res);
        return res;
    }
    // 当前时间是否在任务开启时间
    openTask() {
        return new Date().getTime() >= getStartTimeStamp(this.setStartTime);;
    }
    // 判断是否是打招呼页面
    isGreetUrl() {
        const cUrl = "https://www.zhipin.com/web/geek/chat";
        return location.href.indexOf(cUrl) !== -1;
    }
}