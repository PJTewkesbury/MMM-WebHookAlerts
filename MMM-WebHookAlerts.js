/* global Module */
/* 
This code was originally written by JC21 https://github.com/jc21/MMM-IFTTT and modified by P J Tewkesbury
*/

Module.register('MMM-WebHookAlerts',{

    /**
     * Module config defaults
     */
    defaults: {
        displaySeconds: 60,
        fadeSpeed: 3000        
    },

    /**
     * @var {Object}
     */
    currentNotification: null,

    /**
     * @var {Integer}
     */
    currentTimeout: null,

    /**
     * Starting of the module
     */
    start: function() {
        Log.info('[' + this.name + '] Starting');
        this.sendSocketNotification('START', this.config);
    },

    getStyles: function() {
         return [
             'WebHookAlert.css', // will try to load it from the vendor folder, otherwise it will load is from the module folder.            
         ]
    },

    /**
     * @param {String}  notification
     * @param {Object}  payload
     */
    socketNotificationReceived: function(notification, payload) {
        if (notification === 'WEBHOOKALERTS_NOTIFICATION') {
            let fadeSpeed = this.config.fadeSpeed;
            if (payload && typeof payload.fadeSpeed !== 'undefined') {
                fadeSpeed = payload.fadeSpeed;
            }

            // this.currentNotification = payload;
            // this.updateDom(fadeSpeed);
            this.sendNotification('SCREEN_WAKEUP', true);
            this.sendNotification("SHOW_ALERT", {type: "notification", title:payload.title, message: payload.message, timer : payload.displaySeconds * 1000});
            if (payload.sound !==undefined)
                this.sendNotification('PLAY_SOUND', payload.sound);
        }
    },

    // /**
    //  * @returns {*}
    //  */
    getDom: function() {
        return null;
    }
});
