import { NotificationManager } from './vendor/NotificationManager.js';

/**
 * @module Application
 */
export class Application {

    constructor() { 

      /**
       * Correspond aux données du composants
       * 
       * @property _datas
       * @type {Object}
       * @private
       */
      this._datas = {
          videos: null,
          live: null
      }

      /**
       * Correspond aux options de l'extensions
       * 
       * @property _settings
       * @type {Object}
       * @private
       */
      this._settings = {
          notifications: {
              youtube: false,
              twitch: false
          }
      }


      /**
       * Géstionnaire de notification
       * 
       * @property _notificationManager
       * @type {NotificationManager}
       * @private
       */
      this._notificationManager = new NotificationManager();
    }


    /**
     * Obtientla promesse de données 
     * 
     * @method _getDatasPromise
     * @returns {Promise}
     * @private
     */
    _getDatasPromise() {
        
        return fetch(
            'https://api.hectorlachambre.pro/huzlive'
        )
    }

    /**
     * Met à jour les données provenant de Youtube
     * 
     * @method updateDatas
     * @chainable
     */
    updateDatas() {

        var self = this;

        this._getDatasPromise()
        .then(response => response.json())
        .then(data => {

            chrome.storage.sync.get(['videos'], (storedData) => {
        
                var hasMainExpired = true;
                var hasSecondExpired = true;

                if (Object.keys(storedData).length > 0) {

                    const localRecentDateMain = new Date(storedData.videos.main.date);
                    const serverRecentDateMain = new Date(data.videos.datas.main.date);

                    const localRecentDateSecond = new Date(storedData.videos.second.date);
                    const serverRecentDateSecond = new Date(data.videos.datas.second.date);
                        
                    hasMainExpired = localRecentDateMain < serverRecentDateMain;
                    hasSecondExpired = localRecentDateSecond < serverRecentDateSecond;
                }

        

                chrome.storage.sync.get(['settings'], (result) => {

                    if (hasMainExpired && result.settings.notifications.youtube) {

                        self._notificationManager.notify(
                            'youtube-main', 
                            {
                                type: "basic",
                                title: data.videos.datas.main.title,
                                message: 'Une nouvelle vidéo est sortie !',
                                iconUrl: './images/huz_logo48.png'
                            }
                        );

                    }

                    if (hasSecondExpired && result.settings.notifications.youtube) {

                        self._notificationManager.notify(
                            'youtube-second', 
                            {
                                type: "basic",
                                title: data.videos.datas.second.title,
                                message: 'Une nouvelle vidéo est sortie sur la chaine secondaire !',
                                iconUrl: './images/huz_second_logo48.png'
                            }
                        );

                    }
                });
            });

            self._datas.videos = self._datas.videos || {};

            self._datas.videos.main = {
                id          : data.videos.datas.main.id,
                title       : data.videos.datas.main.title,
                description : data.videos.datas.main.description,
                date        : data.videos.datas.main.date,
                thumbnail   : data.videos.datas.main.thumbnail
            };

            self._datas.videos.second = {
                id          : data.videos.datas.second.id,
                title       : data.videos.datas.second.title,
                description : data.videos.datas.second.description,
                date        : data.videos.datas.second.date,
                thumbnail   : data.videos.datas.second.thumbnail
            };

            chrome.storage.sync.set({ videos: self._datas.videos }, () => true); 

            const prevData = self._datas.live 

            if (data.stream.datas === null) {

                self._datas.live = null;

                chrome.browserAction.setIcon({
                    path: {
                        16: "images/huz_logo_gray16.png",
                        32: "images/huz_logo_gray32.png",
                        48: "images/huz_logo_gray48.png",
                        128: "images/huz_logo_gray128.png"
                    }
                });

                chrome.browserAction.setBadgeText({text:''});
                chrome.browserAction.setTitle({title:'HuzLive - Offline'});
            }
            else {

                chrome.browserAction.setIcon({
                    path: {
                        16: "images/huz_logo16.png",
                        32: "images/huz_logo32.png",
                        48: "images/huz_logo48.png",
                        128: "images/huz_logo128.png"
                    }
                });

                chrome.browserAction.setBadgeText({text:'Live'});
                chrome.browserAction.setTitle({title:'HuzLive - Online'});

                self._datas.live = {
                    title : data.stream.datas.title,
                    date  : data.stream.datas.date
                }
            }

            chrome.storage.sync.set({ live: self._datas.live }, () => {

                chrome.storage.sync.get(['settings'], (result) => {

                    if (prevData === null && 
                        result.settings.notifications.twitch && 
                        data.stream.datas !== null) {

                        self._notificationManager.notify(
                            'twitch', 
                            {
                                type: "basic",
                                title: self._datas.live.title,
                                message: 'On vient de lancer un stream, viens nous passer le bonjour !',
                                iconUrl: './images/huz_logo48.png'
                            }
                        );
                    }
                });
            
            });
        })
        .catch((e) => {
            console.log(e);
        });

        return this;
    }
}
