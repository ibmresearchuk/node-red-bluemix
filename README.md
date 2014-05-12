node-red-bluemix
================

A wrapper for deploying node-red into IBM's Codename: BlueMix platform.

*This is a work in progress... carry on about your daily business*


### What is Codename: BlueMix?

BlueMix is an implementation of IBM's Open Cloud Architecture, built on Cloud Foundry.

You can find more background information over [here](http://www-01.ibm.com/software/ebusiness/jstart/bluemix/). To sign-up for the open beta, head on over [here](http://www.bluemix.net).

### Node-RED in BlueMix

This repository provides two things.

1. a wrapper to Node-RED that is suitable for deploying your own instance into BlueMix - under the `public/app` directory

2. a node.js application that serves this up as a quick-start boilerplate into the BlueMix dashboard.

### Deploying Node-RED into BlueMix

This assumes you already have the `cf` tool [installed](http://www.ng.bluemix.net/docs/BuildingWeb.jsp#install-cf) and logged into BlueMix.

1. Decide what you want to call your application. For this example, let's go with `nr-fred`.
2. Via the BlueMix dashboard, create an instance of TimeSeriesDatabase called: `nr-fred:TimeSeriesDatabase`
3. Create the file `public/app/manifest.yml`, with the following contents, updated to reflect your chosen name:

   ```
    ---
    applications:
    - name: nr-fred
      memory: 256M
      command: node node_modules/node-red/red.js --settings ./bluemix-settings.js
      services:
      - nr-fred:TimeSeriesDatabase
   ```
4. From within the `public/app` directory, run:
   ```
    $ cf push
    ```

5. Once deployed, you can access your instance of Node-RED at <https://nr-fred.ng.bluemix.net>.

