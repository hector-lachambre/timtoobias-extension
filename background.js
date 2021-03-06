"use strict";

import { Application } from './Application.js';

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


const application = new Application();

application.updateDatas()

setInterval(
    () => { application.updateDatas() },
    30 * 1000
)