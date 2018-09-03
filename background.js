"use strict";

import { HuzLive } from './HuzLive.js';

const settings = {
    settings: {
        notifications: {
            youtube: true,
            twitch: true
        }
    }
}

chrome.runtime.onInstalled.addListener(function () {
    chrome.storage.sync.clear(function () {
        chrome.storage.sync.set(settings, () => { });
    });
});


const huzLive = new HuzLive();

huzLive
    .updateYoutubeDatas()
    .updateTwitchDatas();

setInterval(
    () => {

        huzLive
            .updateYoutubeDatas()
            .updateTwitchDatas();
    },
    30000
)