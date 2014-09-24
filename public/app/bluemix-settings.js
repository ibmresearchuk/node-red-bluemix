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

var path = require("path");

var cfEnv = require("cf-env");
var cfCore = cfEnv.getCore();

var VCAP_APPLICATION = JSON.parse(process.env.VCAP_APPLICATION);
var VCAP_SERVICES = JSON.parse(process.env.VCAP_SERVICES);

var settings = module.exports = {
    uiPort: process.env.VCAP_APP_PORT || 1880,
    mqttReconnectTime: 15000,
    serialReconnectTime: 15000,
    debugMaxLength: 1000,

    // Add the bluemix-specific nodes in
    nodesDir: path.join(__dirname,"nodes"),

    // Blacklist the non-bluemix friendly nodes
    nodesExcludes:['66-mongodb.js','75-exec.js','35-arduino.js','36-rpi-gpio.js','25-serial.js','28-tail.js','50-file.js','31-tcpin.js','32-udp.js'],

    // Enable module reinstalls on start-up; this ensures modules installed
    // post-deploy are restored after a restage
    autoInstallModules: true,

    // Move the admin UI
    httpAdminRoot: '/red',

    // You can protect the user interface with a userid and password by using the following property
    // the password must be an md5 hash  eg.. 5f4dcc3b5aa765d61d8327deb882cf99 ('password')
    //httpAdminAuth: {user:"user",pass:"5f4dcc3b5aa765d61d8327deb882cf99"},

    // Serve up the welcome page
    httpStatic: path.join(__dirname,"public"),

    functionGlobalContext: { },

    storageModule: require("./couchstorage")
}

settings.couchAppname = VCAP_APPLICATION['application_name'];

var storageServiceName = process.env.NODE_RED_STORAGE_NAME || settings.couchAppname+":cloudantNoSQLDB";
settings.couchUrl = cfEnv.getService(storageServiceName).credentials.url;
