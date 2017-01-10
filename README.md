# paperless_office

### By Samuel Baudez and Bob Van Elst

### Instructions on how to get the site up and running
* Install [meteor](https://www.meteor.com/)
* Locally: go to the project root in the terminal and type meteor (OCR won't work locally, to simulate local OCR, put the OCR variables in testing mode in the following functions in Document.js ==> var microsoftOcrCall & var freeOcrAPICall.
* Online: if you want to deploy the site on your own server, change the mup.js file and create a .pem key. Install & follow [mup guide](https://github.com/kadirahq/meteor-up#accessing-the-database). Don't forget to revert the ocr variables to production mode after changing them to environment mode for local testing.
