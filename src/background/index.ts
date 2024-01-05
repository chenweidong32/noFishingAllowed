/*
 * @Author: cwd
 * @Date: 2024-01-03 14:55:30
 * @LastEditors: cwd
 * @LastEditTime: 2024-01-05 10:22:33
 * @FilePath: \chromepie-nozhihu\no-fishing-allowed\src\background\index.ts
 * @Description: 
 * 
 * Copyright (c) 2024 by cwd, All Rights Reserved. 
 */
chrome.runtime.onInstalled.addListener(async () => {

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
        const dayOfWeek = today.getDay();
        return dayOfWeek
    }
    const isCycle = async () => {
        const { cycle } = await chrome.storage.sync.get()
        return cycle.includes(getToday())
    }

    chrome.tabs.onUpdated.addListener( async (tabId, _changeInfo, tab) => {

        const existingTab = await new Promise(resolve => chrome.tabs.get(tabId, resolve));

        if (tab && tab.status === 'loading' && typeof tab.url !== 'undefined' && existingTab &&
            await isCurrentTimeInTimeRange() && await isCycle() && matchUrl(tab.url)) {
            chrome.tabs.remove(tabId);
        }

    })


})



export { }
