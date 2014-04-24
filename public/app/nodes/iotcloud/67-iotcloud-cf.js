/**
 * Copyright 2014 IBM Corp.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 **/

var RED = require(process.env.NODE_RED_HOME+"/red/red");
var connectionPool = require(process.env.NODE_RED_HOME+"/nodes/core/io/lib/mqttConnectionPool");
var util = require("util");

function IotcloudNode(n) {
    RED.nodes.createNode(this,n);

    // Store local copies of the node configuration (as defined in the .html)
    // hard-coded for Impact Alpha
    this.brokerHost = "messaging.quickstart.internetofthings.ibmcloud.com";
    this.brokerPort = "1883";
    this.tenantPrefix = "quickstart";

    this.deviceId = n.deviceId;
    
    // lower-case any upper case characters in device ID, and remove any : or - characters
    this.deviceId = this.deviceId.toLowerCase();
    this.deviceId = this.deviceId.replace(/-|:/g, "");

    if(n.messageType == "*"){
    	this.messageType = "+";
    }else{
    	this.messageType = n.messageType;
    }    

    this.clientId = this.tenantPrefix + ":" + this.deviceId + "-nodered-subscriber";
    this.topic = "iot-1/d/"+this.deviceId+"/evt/"+this.messageType+"/json";
    
    this.log("Client ID: "+this.clientId);
    this.log("Topic: "+this.topic);

    this.client = connectionPool.get(
        this.brokerHost,
        this.brokerPort,
        this.clientId,
        null,
        null);

    var node = this;
    this.client.subscribe(this.topic,0,function(topic,payload,qos,retain) {
    	
    	
    	// if topic string ends in "json" attempt to parse. If fails, just pass through as string.
    	// if topic string ends in anything other than "json" just pass through as string.
    	var parsedPayload = "";
    	if ( /json$/.test(topic) ){
    		try{
    			parsedPayload = JSON.parse(payload);
    		}catch(err){
    			parsedPayload = payload;
    		}
    	}else{
    		parsedPayload = payload;
    	}
    	
        var msg = {topic:topic,payload:parsedPayload};
        node.send(msg);
    });

    this.client.connect();

    this.on("close", function() {
        if (this.client) {
            this.client.disconnect();
        }
    });

}

RED.nodes.registerType("iot",IotcloudNode);

function IotCloudOutNode(n) {
    RED.nodes.createNode(this,n);

    var that = this;
    that.messageType = n.messageType;

    if (n.deviceId == "") {
        require('getmac').getMac(function(err, mac) {
            if (err) {
                node.error(err);
            } else {
                that.deviceId = mac.toLowerCase().replace(/:/g, "");
                outNode(that);
            }
        });
    } else {
    	that.deviceId = n.deviceId.toLowerCase().replace(/-|:/g, "");
        outNode(that);
    }
}

function outNode(node) {
    // hard-coded for Impact Alpha
    node.brokerHost = "messaging.quickstart.internetofthings.ibmcloud.com";
    node.brokerPort = "1883";
    node.tenantPrefix = "quickstart";

    node.clientId = node.tenantPrefix + ":" + node.deviceId;
    node.topic = "iot-1/d/"+node.deviceId+"/evt/"+node.messageType+"/json";
    
    node.log("Client ID: "+node.clientId);
    node.log("Topic: "+node.topic);
    
    node.client = connectionPool.get(node.brokerHost,node.brokerPort,node.clientId, null, null);
    node.on("input", function(msg) {
        if (msg != null) {
            if (node.topic) {
                msg.topic = node.topic;
            }
            node.client.publish(msg);
         }
    });
    node.client.connect();
}

RED.nodes.registerType("iot out",IotCloudOutNode);
