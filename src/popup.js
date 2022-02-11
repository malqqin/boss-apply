// popup主动发消息给content-script
$('#begin').click(() => {
    const intervalTime = $('input').val();
    if (isNaN(intervalTime) || (intervalTime < 5 || intervalTime > 50)) {
        return alert('必须是5-50之间数字');
    }
    sendMessageToContentScript({ type: 'start', intervalTime, }, (response) => {
        if (response) alert('收到来自content-script的回复：' + response);
    });
});
$('#stop').click(() => {
    sendMessageToContentScript({ type: 'stop' }, (response) => {
        if (response) alert('收到来自content-script的回复：' + response);
    });
});
function sendMessageToContentScript(message, callback) {
    getCurrentTabId((tabId) => {
        chrome.tabs.sendMessage(tabId, message, function (response) {
            if (callback) callback(response);
        });
    });
}
// 获取当前选项卡ID
function getCurrentTabId(callback) {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        if (callback) callback(tabs.length ? tabs[0].id : null);
    });
}

