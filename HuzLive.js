import { NotificationManager } from './NotificationManager.js';

const YT_UserId = 'UCwwTPrN3XUFEGzCb6XuVniQ';
const YT_key = 'AIzaSyDEyfIk3335BGClFHmHDcSKXxDzYOHitlg';

const Twitch_UserId = '42428057';

// Meristo ID
/* const Twitch_UserId = '39381860'; */
const Twitch_key = '7m3kxyorkss6bg4fzgz1pyueuhcjyb';


/**
 * @module HuzLive
 */
export class HuzLive {

    constructor() { 

      /**
       * Correspond aux données du composants
       * 
       * @property _datas
       * @type {Object}
       * @private
       */
      this._datas = {
          videos: [],
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
     * Obtientla promesse de donnée Youtube
     * 
     * @method _getYoutubeDatasPromise
     * @returns {Promise}
     * @private
     */
    _getYoutubeDatasPromise() {

        return fetch(
            `https://www.googleapis.com/youtube/v3/search?key=${YT_key}&channelId=${YT_UserId}&part=snippet,id&order=date&maxResults=2`
        )
    };


    /**
     * Obtientla promesse de donnée Youtube
     * 
     * @method _getTwitchDatasPromise
     * @returns {Promise}
     * @private
     */
    _getTwitchDatasPromise() {

        const headers = new Headers({
            'Client-ID': Twitch_key
        });
        
        return fetch(
            `https://api.twitch.tv/helix/streams?user_id=${Twitch_UserId}`, 
            { headers: headers }
        )
    }

    /**
     * Met à jour les données provenant de Youtube
     * 
     * @method updateYoutubeDatas
     * @chainable
     */
    updateYoutubeDatas() {

        var self = this;

        this._getYoutubeDatasPromise()
        .then(response => response.json())
        .then(data => {

            chrome.storage.sync.get(['videos'], (storedData) => {

                var condition = true;

                if (Object.keys(storedData).length > 0) {
        
                    const localRecentDate = new Date(storedData.videos[0].date);
                    const serverRecentDate = new Date(data.items[0].snippet.publishedAt);

                    condition = localRecentDate < serverRecentDate;

                    chrome.storage.sync.get(['settings'], (result) => {

                        if (condition && result.settings.notifications.youtube) {

                            self._notificationManager.notify(
                                'youtube', 
                                {
                                    type: "basic",
                                    title: data.items[0].snippet.title,
                                    message: 'Une nouvelle vidéo est sortie !',
                                    iconUrl: './images/huz_logo48.png'
                                }
                            );

                        }
                    });
                }

                if (condition) {

                    self._datas.videos = [];
            
                    data.items.forEach(item => {

                        self._datas.videos.push({
                            id          : item.id.videoId,
                            title       : item.snippet.title,
                            description : item.snippet.description,
                            date        : item.snippet.publishedAt,
                            thumbnail   : item.snippet.thumbnails.default.url
                        });
                    });

                    chrome.storage.sync.set({ videos: self._datas.videos }, () => true);         
                }
            });
        })
            .catch((e) => {
                console.log(e);
            });

        return this;
    }

    
    /**
     * Met à jour les données provenant de Twitch
     * 
     * @method updateTwitchDatas
     * @chainable
     */
    updateTwitchDatas() {

        var self = this;
        
        this._getTwitchDatasPromise()
            .then(response => response.json())
            .then(data => {

                const prevData = self._datas.live 

                if (data.data.length === 0) {

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
                        title : data.data[0].title,
                        date  : data.data[0].started_at
                    }
                }

                chrome.storage.sync.set({ live: self._datas.live }, () => {

                    chrome.storage.sync.get(['settings'], (result) => {

                        if (prevData === null && 
                            result.settings.notifications.twitch && 
                            data.data.length > 0) {

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
