"use strict";

moment.locale('fr');

function escapeHTML(unsafe) {
    return unsafe
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;");
}

function render() {

    var notificationsToggleSwitch = document.querySelectorAll('.js-notifications__toggle-switch');

    var application = document.querySelector('.application');

    var datasReadyEvent = new Event('datasReady');

    application.addEventListener('datasReady', () => {

        var loader = document.querySelector('.js-loader');
        var main   = document.querySelector('.js-main');

        loader.classList.add('hidden');
        main.classList.remove('visually-hidden');
    })

    chrome.storage.sync.get(['videos'], function (result) {

        if (result.videos === undefined) {
            return this;
        }

        application.dispatchEvent(datasReadyEvent);

        if (Object.keys(result).length > 0) {

            var videosRow = document.querySelectorAll('.js-videos__row');

            var keys = Object.keys(result.videos);

            videosRow.forEach((element, index) => {

                var videosThumbnail    = element.querySelector('.js-videos__thumbnail');
                var videosLink         = element.querySelectorAll('.js-videos__link');
                var videosTitles       = element.querySelector('.js-videos__title');
                var videosDescriptions = element.querySelector('.js-videos__description');
                var videosMoment       = element.querySelector('.js-videos__moment');

                videosThumbnail.src            = escapeHTML(result.videos[keys[index]].thumbnail);
                videosTitles.textContent       = escapeHTML(result.videos[keys[index]].title);
                videosDescriptions.textContent = escapeHTML(result.videos[keys[index]].description);
                videosMoment.textContent       = escapeHTML(`Publiée ${moment(result.videos[keys[index]].date).fromNow()}`);

                videosLink.forEach((element) => {
                    element.href = escapeHTML(`https://www.youtube.com/watch?v=${result.videos[keys[index]].id}`);
                });
            });
        }
    });

    chrome.storage.sync.get(['live'], function (result) {
    
        var header       = document.querySelector('.js-header');
        var headerTitle  = document.querySelector('.js-header__title');
        var headerMoment = document.querySelector('.js-header__moment');

        if (result.live !== null && result.live !== undefined) {

            header.classList.add('header--online')
            headerTitle.textContent  = escapeHTML(result.live.title);
            headerMoment.textContent = escapeHTML(moment(result.live.date).fromNow());
        }
    });

    chrome.storage.sync.get(['settings'], function (result) {
    
        var youtubeNotificationToggle = document.querySelector(
            '.js-notifications__toggle-switch[name="notification-youtube"]'
        );

        var twitchNotificationToggle = document.querySelector(
            '.js-notifications__toggle-switch[name="notification-twitch"]'
        );

        youtubeNotificationToggle.checked = result.settings.notifications.youtube;
        twitchNotificationToggle.checked  = result.settings.notifications.twitch;

        youtubeNotificationToggle.addEventListener('change', (e) => {
            chrome.storage.sync.set(
                {
                    settings: {
                        notifications: {
                            youtube: e.target.checked,
                            twitch: twitchNotificationToggle.checked
                        }
                    }
                }, 
                () => {}
            );
        });

        twitchNotificationToggle.addEventListener('change', (e) => {
            chrome.storage.sync.set(
                {
                    settings: {
                        notifications: {
                            twitch: e.target.checked,
                            youtube: youtubeNotificationToggle.checked
                        }
                    }
                }, 
                () => {}
            );
        });
    });
}

render();

