cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
    {
        "file": "plugins/cordova-plugin-facebook4/www/facebook-native.js",
        "id": "cordova-plugin-facebook4.FacebookConnectPlugin",
        "clobbers": [
            "facebookConnectPlugin"
        ]
    },
    {
        "file": "plugins/cordova-plugin-app-preferences/www/apppreferences.js",
        "id": "cordova-plugin-app-preferences.apppreferences",
        "clobbers": [
            "plugins.appPreferences"
        ]
    }
];
module.exports.metadata = 
// TOP OF METADATA
{
    "cordova-plugin-whitelist": "1.2.2",
    "cordova-plugin-crosswalk-webview": "1.8.0",
    "cordova-plugin-facebook4": "1.7.1",
    "cordova-plugin-app-preferences": "0.99.0"
};
// BOTTOM OF METADATA
});