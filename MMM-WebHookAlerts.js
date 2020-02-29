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

    /**
     * @param {String}  notification
     * @param {Object}  payload
     */
    socketNotificationReceived: function(notification, payload) {
        if (notification === 'WEBHOOKALERTS_NOTIFICATION') {
            let fadeSpeed = this.config.fadeSpeed;
            if (this.currentNotification && typeof this.currentNotification.fadeSpeed !== 'undefined') {
                fadeSpeed = this.currentNotification.fadeSpeed;
            }

            this.currentNotification = payload;
            this.updateDom(fadeSpeed);
            this.sendNotification('SCREEN_WAKEUP', true);
        }
    },

    /**
     * @returns {*}
     */
    getDom: function() {
        let message = '';
        if (this.currentNotification !== null) {
            message = this.currentNotification.message;

            // Talk to the Sounds Module
            if (typeof this.currentNotification.sound !== 'undefined') {
                this.sendNotification('PLAY_SOUND', this.currentNotification.sound);
            }

            // Set timeout to hide this soon, but first clear the existing timeout
            if (this.currentTimeout) {
                clearTimeout(this.currentTimeout);
            }

            // Message
            let display_ms = (this.currentNotification.displaySeconds || this.defaults.displaySeconds) * 1000;
            let fadeSpeed  = this.currentNotification.fadeSpeed || this.config.fadeSpeed;

            this.currentTimeout = setTimeout(() => {
                this.currentTimeout = null;
                this.updateDom(fadeSpeed);
            }, display_ms);

            this.currentNotification = null;
        }

        let wrapper = document.createElement('div');
        wrapper.className = 'thin bright ';
        wrapper.innerHTML=message;     
        return wrapper;
    }
});
