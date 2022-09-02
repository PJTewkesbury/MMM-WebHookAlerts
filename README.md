# MMM-WebHookAlerts
[MagicMirror](https://magicmirror.builders/) The MMM-WebHookAlerts module for [MagicMirror](https://magicmirror.builders/) will display a message on your MagicMirror when a [webhook notification](https://en.wikipedia.org/wiki/Webhook) is received. When a webhook notification message is received, then it is displayed fullscreen on the MagicMirror. You can specify what is displayed by the use of templates, and you can even pull data from the body of the HTTP Post in Json format into the template because the template engine used is [Mustache](https://www.npmjs.com/package/mustache). You can define multiple templates for different webhook notifications by the use of a query string parameter called 'templateName'

![Screenshot](screenshot.png)

This module is intended to display immediate notifications of events from any device that can send a HTTP Post message.
Notifications will show for a default of 60 seconds before disappearing. There is no on-screen history of events.

## Module installation

Clone the module and npm install:

```bash
cd ~/MagicMirror/modules
git clone https://github.com/PJTewkesbury/MMM-WebHookAlerts.git
cd MMM-WebHookAlerts
npm install
```

Add the module config to `~/MagicMirror/config/config.js`

```javascript
modules: [
    {
        module: 'MMM-WebHookAlerts',        
        position: 'fullscreen_above',
        config: {
                fadeSpeed: 30,
		displaySeconds:90,
		sound:"twip.wav",
		templates:
		[
		{
			templateName: "AzureDevOps",
			template: "<div style='height:100%; background-color: #202020; color:white;border: 3px solid black; padding:5px'><h1>{{resource.definition.project.name}}</h1><br/><b>{{message.text}}</b></div>",
			sound:"wobble.wav",
		},
		{
			templateName: "SimpleAlert",
			template: "<div class='fullscreen' style='border:1px solid black;'><b>{{message}}</b></div>",
			title  : "{{Title}}",
			displaySeconds:10,
			fadeSpeed:10,
			sound:"wobble.wav",
		}
		]    
        }
    }
]
```


## Module Configuration Options

<table width="100%">
    <thead>
        <tr>
            <th>Option</th>
            <th>Type</th>
            <th>Default</th>
            <th width="100%">Description</th>
        </tr>
    <thead>
    <tbody>
        <tr>
            <td><code>displaySeconds</code></td>
            <td>Integer</td>
            <td><code>60</code></td>
            <td>Number of seconds to show a notification for</td>
        </tr>
        <tr>
            <td><code>fadeSpeed</code></td>
            <td>Integer</td>
            <td><code>3000</code></td>
            <td>Milliseconds fade transition speed</td>
        </tr>
	<tr>
            <td><code>templates</code></td>
            <td>Array of template</td>
            <td><code>		
	    </code></td>
            <td>This is where each template is defined. See below for details</td>
        </tr>	    	    
    </tbody>
</table>

## Template definition
<table>
	<tbody>	    
        </tr>
	    <tr>
            <td><code>templateName</code></td>
            <td>String</td>
            <td><code>Name of the templalte</code></td>
            <td>The webhook url query string parameter is matched to this value</td>
        </tr>	
        </tr>
	    <tr>
            <td><code>title</code></td>
            <td>String</td>
            <td><code>A html mustache template</code></td>
            <td>This is the html mustache template for the title</td>
        </tr>	
 <tr>
            <td><code>template</code></td>
            <td>String</td>
            <td><code>A html mustache template</code></td>
            <td>This is the html mustache template for the main notification text</td>
        </tr>
        </tr>
	    <tr>
            <td><code>sound</code></td>
            <td>String</td>
            <td><code>wobble.mp3</code></td>
            <td>optional - This is the name of the sound to play when the alert is shown</td>
        </tr>
	<tr>
            <td><code>displaySeconds</code></td>
            <td>Integer</td>
            <td><code>60</code></td>
            <td>Number of seconds to show a notification for. This will override the default setting.</td>
        </tr>
        <tr>
            <td><code>fadeSpeed</code></td>
            <td>Integer</td>
            <td><code>3000</code></td>
            <td>Milliseconds fade transition speed. This will override the default setting.</td>
        </tr>
    </tbody>
</table>

## Setting up a WebHookAlerts

### Making your mirror internet accessible

For this module to work, you will need to get dirty with your router, specifically with Port Forwarding.

I'm not going to go into detail here, there are plenty of [Google results](https://www.google.com.au/?gws_rd=ssl#q=router+port+forwarding) on the topic.

You will need to forward any port you nominate, to the local IP of your Magic Mirror on port 8080.

You will also need to set up a dynamic DNS hostname for your home network, I'm a [Duckdns](https://www.duckdns.org/)
 fan personally. Atlernatively you could look into a http forward solution like [ngrok](https://ngrok.com/). 
 
It is also possible to use NGinx as a reverse proxy to forward http traffic to your MagicMirror. Please note that when using a reverse proxy you need to be careful how you configure it because HTTP POST's can be forwarded as HTTP GET's if NGINX is configured to convert HTTP to HTTPS. 

# Sending WebHook Notifcations

Once you have configured your router/reverse proxy to route HTTP POST traffic to your Magic Mirror, you can send any HTTP POST messages using the url http://yourhouse.duckdns.org:8080/webhook?templateName=SimpleAlert.

You can use CURL for testing.

```bash
curl -X POST -H "Content-Type: application/json" \
    -d '{"message": "Your pizza is ready!"}' \
    "http://yourhouse.duckdns.org:8080/webhook?templateName=SimpleAlert"
```

In this example we are using the templateName SimpleAlert which is matched to the template in the config.js. The template will then render the data into the template and display the result full screen.

You can have as many templates as you need, and so display alerts from all sorts of systems:- Azure DevOps, GitHub,  IFTTT, etc.

## IFTTT

Log in to [IFTTT](https://ifttt.com/) and create a new recipe. You can essentially choose any channel
 you want for the Trigger but for the Action channel you must select Maker.

There is only one Action, "Make a web request".

Action fields explained:

<table width="100%">
    <thead>
        <tr>
            <th>Field</th>
            <th>Description</th>
            <th>Example</th>
        </tr>
    <thead>
    <tbody>
        <tr>
            <td>URL</td>
            <td>Notification endpoint</td>
            <td>http://yourhouse.duckdns.org:8080/webhook?templateName=SimpleAlert</td>
        </tr>
        <tr>
            <td>Method</td>
            <td>HTTP Method, MUST be POST</td>
            <td>POST</td>
        </tr>
        <tr>
            <td>Content Type</td>
            <td>How the data is sent</td>
            <td>application/json</td>
        </tr>
        <tr>
            <td>Body</td>
            <td>The notification content, explained below</td>
            <td><pre><code>{
    "message": "<<<{{From}}>>> tagged you in a Photo",
    "displaySeconds": 45,    
}</code></pre></td>
        </tr>
    </tbody>
</table>

The notification body JSON MUST contain the `message` item. If it doesn't, the endpoint will return a 400 error.
 All of the configuration options can also be passed with the JSON, which will override the config for
 that recipe only.

The `<<<{{From}}>>>` in the example above is a IFTTT wildcard field that you select in the Body section
 of the action. You can create any message you like that incorporates any wildcard. Stay away from fields that may
 contain HTML or links, they won't display well. These fields should be surrounded in `<<<` and `>>>` strings in
 order for the field to be escaped properly.

## Using additional modules

This module will send out notifications to other supported modules, if those options are included in the notification JSON.
The supported modules are:

#### [MMM-Sounds](https://github.com/jc21/MMM-Sounds)

This additional module can play audio sounds if your mirror supports it. An example of a template that would play a Sound:

```json
{
    "templateName": "SimpleAlertWithSound",
    "template":"<div>Your text here</div>", 
    "sound": "wobble.wav"
}
```
