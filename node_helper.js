/* 
This code was originally written by JC21 https://github.com/jc21/MMM-IFTTT and modified by P J Tewkesbury
*/

'use strict';

const _ = require('lodash');
const NodeHelper = require('node_helper');
const bodyParser = require('body-parser');
const moment = require('moment');
const Mustache = require('mustache');
var url = require('url');

module.exports = NodeHelper.create({
    /**
     * node_helper start method
     */
    start: function () {
        this.log('Starting node_helper');

        // Create endpoint for Webhook notifications
        this.expressApp.use(bodyParser.json());
        this.expressApp.use(bodyParser.urlencoded({ extended: true }));

        //https://docs.microsoft.com/en-us/azure/devops/service-hooks/events?view=azure-devops#work-item
        this.expressApp.post('/webhook', (req, res) => {

            // Process request.
            this.log('Incoming webhook notification : ' + JSON.stringify(req.body), true);

            // Get query string from request
            var url_parts = url.parse(req.url, true);
            var query = url_parts.query;

            // Get templateName from Query String
            var templateName = "";
            if (query) {
                if (query.templateName) {
                    templateName = query.templateName;
                }
            }

            // Find TemplateName in MagicMirror Config
            var t = this.config.templates.find(function (e) {
                return (e.templateName == templateName);
            });

            // If we have template then render and display
            if (t) {
                var template = t.template;
                try {
                    var output = Mustache.render(template,  req.body);

                    var msg = {
                        message : output,
                        sound : t.sound,
                        displaySeconds : t.displaySeconds,
                        fadeSpeed : t.fadeSpeed,
                        size : t.size,
                    };
                    this.sendSocketNotification('WEBHOOKALERTS_NOTIFICATION', msg);

                    // return OK to caller
                    res.status(200)
                        .send({
                            status: 200
                        });
                }
                catch (err) {
                    // Return errors to caller
                    let final_error = new Error(err);
                    res.status(400)
                        .send({
                            status: 400,
                            error: err.message
                        });
                }
            }
            else {
                // Return error to caller
                res.status(400)
                    .send({
                        status: 400,
                        error: "templateName not specified in query string or specified templateName in query string not defined in MagicMirror config"
                    });
            }
        });
    },

    /**
     *
     * @param {String} notification
     * @param {*}      payload
     */
    socketNotificationReceived: function (notification, payload) {
        if (notification === 'START') {
            // Load config into this module
            this.config = payload;
        }
    },

    /**
     * Outputs log messages
     *
     * @param {String}  message
     * @param {Boolean} [debug_only]
     */
    log: function (message, debug_only) {
        if (!debug_only || (debug_only && typeof this.config.debug !== 'undefined' && this.config.debug)) {
            console.log('[' + moment().format('YYYY-MM-DD HH:mm:ss') + '] [MMM-IFTTT] ' + message);
        }
    }
});
