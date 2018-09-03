export class NotificationManager {

    constructor() {
        
    }

    requestPersmission() {
    
        Notification.requestPermission(function (permission) {

            if(!('permission' in Notification)) {
                Notification.permission = permission;
            }
        });
    }

    notify(id, options) {

        chrome.notifications.clear(id)

        if (!("Notification" in window)) {
    
            console.log("Ce navigateur ne supporte pas les notifications desktop");
            
            return this;
        }

        if (Notification.permission === "granted" || Notification.permission === "default") {
    
            var notification = chrome.notifications.create(id, options);
        }
    }
}