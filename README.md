# HuzLive

HuzLive is a web extension create for **Mozilla Firefox**, **Google Chrome** and **Opera**.
You can package it for Firefox directly without any modification. However, please, follow instruction to package it on Chrome and Opera.

## Compatibility Google Chrome and Opera

You have to remove the *applications* key => value pair.

For example, move :

*manifest.json*
    {
        "name": "HuzLive",
        "version": "0.4.1",
        "description": "Soyez toujours au courant des lives & vidéos de votre streameur Dofus préféré",
        "permissions": ["https://api.twitch.tv/*", "https://www.googleapis.com/*", "activeTab", "notifications", "storage"],
        "background": {
            "page": "background.html"
        },
        "browser_action": {
            "default_popup": "popup.html",
            "default_icon": {
                "16": "images/huz_logo16.png",
                "32": "images/huz_logo32.png",
                "48": "images/huz_logo48.png",
                "128": "images/huz_logo128.png"
            }
        },
        "icons": {
            "16": "images/huz_logo16.png",
            "32": "images/huz_logo32.png",
            "48": "images/huz_logo48.png",
            "128": "images/huz_logo128.png"
        },
        "applications": {
            "gecko": {
            "id": "{b8e90417-1550-474f-bd6e-de91b8382298}",
            "strict_min_version": "42.0"
            }
        },
        "manifest_version": 2
    }

to :

*manifest.json*
    {
        "name": "HuzLive",
        "version": "0.4.1",
        "description": "Soyez toujours au courant des lives & vidéos de votre streameur Dofus préféré",
        "permissions": ["https://api.twitch.tv/*", "https://www.googleapis.com/*", "activeTab", "notifications", "storage"],
        "background": {
            "page": "background.html"
        },
        "browser_action": {
            "default_popup": "popup.html",
            "default_icon": {
                "16": "images/huz_logo16.png",
                "32": "images/huz_logo32.png",
                "48": "images/huz_logo48.png",
                "128": "images/huz_logo128.png"
            }
        },
        "icons": {
            "16": "images/huz_logo16.png",
            "32": "images/huz_logo32.png",
            "48": "images/huz_logo48.png",
            "128": "images/huz_logo128.png"
        },
        "manifest_version": 2
    }