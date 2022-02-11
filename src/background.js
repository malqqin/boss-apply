console.log('background.js')
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    console.log("content script发来的消息:" + JSON.stringify(request));
    console.log(sender.tab)
    if (request.type == "greeting") { //打招呼(立即聊)
        chrome.tabs.query({ 'active': true, 'windowId': chrome.windows.WINDOW_ID_CURRENT },
            function (tabs) {
                const url = new URL(tabs[0].url)
                const host = url.host;
                chrome.cookies.getAll({
                    domain: host
                }, (cookies) => {
                    const cookiesStr = cookies.map(c => c.name + "=" + c.value).join(';')
                    console.log(cookiesStr)
                    sendResponse(cookiesStr)
                })
            }
        );
    }
    return true;
})
// 打开新标签
function createNewTab(info) {
    console.log(chrome.tabs)
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        console.log(tabs);
        const tabId = tabs[0] ? tabs[0].id : null;
        if (tabId) { // 有打开窗口，更新url
            chrome.tabs.update(tabId, {
                url: info.website,
                active: true
            }, function () {
                console.log('打开页面')
            })
        } else { // 没有窗口，打开新窗口
            chrome.tabs.create({
                active: true,
                url: info.website
            }, function (create_tab) {

            });
        }
    });
}