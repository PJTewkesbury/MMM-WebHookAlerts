/* global Module */
/*
This code was originally written by JC21 https://github.com/jc21/MMM-IFTTT and modified by P J Tewkesbury
*/

Module.register('MMM-WebHookAlerts', {

    /**
     * Module config defaults
     */
    defaults: {
        displaySeconds: 60,
        fadeSpeed: 3000,

        effect: "slide", // scale|slide|genie|jelly|flip|bouncyflip|exploader
        alert_effect: "jelly", // scale|slide|genie|jelly|flip|bouncyflip|exploader
        display_time: 3500, // time a notification is displayed in seconds
        position: "center",
        welcome_message: false // shown at startup
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
    start: function () {
        Log.info('[' + this.name + '] Starting');
        this.sendSocketNotification('START', this.config);

        if (this.config.effect === "slide") {
            this.config.effect = `${this.config.effect}-${this.config.position}`;
        }
    },

    getScripts() {
        return ["notificationFx.js"];
    },

    getStyles: function () {
        return ['WebHookAlert.css', "font-awesome.css", this.file(`./styles/notificationFx.css`), this.file(`./styles/${this.config.position}.css`)];
    },

    getTemplate(type) {
        return `templates/${type}.njk`;
    },

    async showNotification(notification) {
        const message = await this.renderMessage("notification", notification);

        new NotificationFx({
            message,
            layout: "growl",
            effect: this.config.effect,
            ttl: notification.timer || this.config.display_time
        }).show();
    },

    /**
     * @param {String}  notification
     * @param {Object}  payload
     */
    socketNotificationReceived: function (notification, payload) {
        if (notification === 'WEBHOOKALERTS_NOTIFICATION') {
            let fadeSpeed = this.config.fadeSpeed;
            if (payload && typeof payload.fadeSpeed !== 'undefined') {
                fadeSpeed = payload.fadeSpeed;
            }

            // this.currentNotification = payload;
            // this.updateDom(fadeSpeed);
            this.sendNotification('SCREEN_WAKEUP', true);

            console.log(`WebHook  ${payload.message}`);
            console.log(`WebHook  ${payload.title}`);
            this.showNotification({ type: "notification", title: payload.title, message: payload.message, timer: payload.displaySeconds * 1000 });

            // this.sendNotification("SHOW_ALERT", {type: "notification", title:payload.title, message: payload.message, timer : payload.displaySeconds * 1000});

            if (payload.sound !== undefined)
                this.sendNotification('PLAY_SOUND', payload.sound);
        }
    },

    hideAlert(sender, close = true) {
        // Dismiss alert and remove from this.alerts
        if (this.alerts[sender.name]) {
            this.alerts[sender.name].dismiss(close);
            delete this.alerts[sender.name];
            // Remove overlay
            if (!Object.keys(this.alerts).length) {
                this.toggleBlur(false);
            }
        }
    },

    renderMessage(type, data) {
        return new Promise((resolve) => {
            this.nunjucksEnvironment().render(this.getTemplate(type), data, function (err, res) {
                if (err) {
                    Log.error("Failed to render alert", err);
                }

                resolve(res);
            });
        });
    },

    toggleBlur(add = false) {
        const method = add ? "add" : "remove";
        const modules = document.querySelectorAll(".module");
        for (const module of modules) {
            module.classList[method]("alert-blur");
        }
    },

    // /**
    //  * @returns {*}
    //  */
    getDom: function () {
        return null;
    }
});
