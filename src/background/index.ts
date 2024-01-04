chrome.runtime.onInstalled.addListener(async (opt) => {

    await chrome.storage.local.clear()
    const initStorageCache = await chrome.storage.sync.get();
    if (!initStorageCache.urls) {
        const urls = ["www.zhihu.com"];
        await chrome.storage.sync.set({ urls: urls })
    }
    if (!initStorageCache.time) {
        const time = ['09:00', '17:30']
        await chrome.storage.sync.set({ time: time })
    }
    if (!initStorageCache.cycle) {
        const cycle = [1, 2, 3, 4, 5]
        await chrome.storage.sync.set({ cycle: cycle })
    }
    const { urls } = await chrome.storage.sync.get()
    const matchUrl = (url: string) => {
        const domainRegex = /(?:https?:\/\/)?(?:www\.)?([^\/]+)/;
        const match = url.match(domainRegex);

        if (match) {
            const matchedDomain = match[1];
            return urls.some((domain: any) => {
                const domainMatched = domain.match(domainRegex)[1]
                return domainMatched === matchedDomain;
            });
        } else {
            return false;
        }
    }
    const isCurrentTimeInTimeRange = async () => {
        const { time } = await chrome.storage.sync.get()

        // 获取当前时间
        const currentTime = new Date();
        // 将时间数组中的时间转换为Date对象
        const startTime = new Date(currentTime.toDateString() + ' ' + time[0]);
        const endTime = new Date(currentTime.toDateString() + ' ' + time[1]);

        return currentTime >= startTime && currentTime <= endTime;
    }

    const getToday = () => {
        const today = new Date();
        const dayOfWeek = today.getDay() + 1;
        return dayOfWeek
    }
    const isCycle = async () => {
        const { cycle } = await chrome.storage.sync.get()
        return cycle.includes(getToday())
    }

    chrome.tabs.onUpdated.addListener((tabId, _changeInfo, tab) => {
        setTimeout(async () => {
            if (tab && tabId) {
                if (tab.status === 'loading' && typeof tab.url !== 'undefined') {
                    const is = matchUrl(tab.url)
                    if (is && await isCurrentTimeInTimeRange() && await isCycle()) {
                        chrome.tabs.remove(tabId)
                        return false
                    }
                }
            }
        }, 10);
        return false
    })

})

// console.log('hello world from background')

export { }
