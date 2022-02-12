// 倒计时
export const countDown = (timeNum) => {
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
