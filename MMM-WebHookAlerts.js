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

    // getStyles: function() {
    //     return [
    //         'WebHookAlert.css', // will try to load it from the vendor folder, otherwise it will load is from the module folder.            
    //     ]
    // },

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
    //     let message = '';
    //     if (this.currentNotification !== null) {
    //         message = this.currentNotification.message;

    //         // Talk to the Sounds Module
    //         if (typeof this.currentNotification.sound !== 'undefined') {
    //             this.sendNotification('PLAY_SOUND', this.currentNotification.sound);
    //         }

    //         // Set timeout to hide this soon, but first clear the existing timeout
    //         if (this.currentTimeout) {
    //             clearTimeout(this.currentTimeout);
    //         }

    //         // Message
    //         let display_ms = (this.currentNotification.displaySeconds || this.defaults.displaySeconds) * 1000;
    //         let fadeSpeed  = this.currentNotification.fadeSpeed || this.config.fadeSpeed;

    //         this.currentTimeout = setTimeout(() => {
    //             this.currentTimeout = null;
    //             this.updateDom(fadeSpeed);
    //         }, display_ms);

    //         this.currentNotification = null;
    //     }

    //     let wrapper = document.createElement('div');
    //     wrapper.id="WebHookAlert";
    //     wrapper.className = 'thin bright WebHookAlert';
    //     wrapper.innerHTML=message;     
    //     return wrapper;
    // }
});
