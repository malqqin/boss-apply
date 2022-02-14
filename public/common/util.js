export const countDown = (timeNum, callBack) => {
    if (timeNum < 0) {
        return
    }
    countDownTimer = setInterval(() => {
        timeNum -= 1000;
        if (timeNum <= 0) {
            clearInterval(countDownTimer)
            callBack();
        }
    }, 1000);
}
export const getStartTimeStamp = (timeStr) => {
    let Year = new Date().getFullYear(),
        Month = new Date().getMonth() + 1,
        date = new Date().getDate(),
        defualtTime = Year + '-' + Month + '-' + date,
        timeStamp = new Date(timeStr ? timeStr : defualtTime).getTime();
    return timeStamp
}
export const getMathRandom = (min, max) => {
    return Math.floor(Math.random(max - min + 1)) + min;
}
