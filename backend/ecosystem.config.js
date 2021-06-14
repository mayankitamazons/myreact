module.exports = {
    apps: [{
        name: "app",
        script: "./index.js",
        env: {
            NODE_ENV: "development",
            JWT_KEY: "ainode_security_key",
            MONGO_URI: "mongodb://localhost/aiincode",
            BASE_URL: "http://52.242.121.10/"
        },
        env_production: {
            NODE_ENV: "production",
            JWT_KEY: "ainode_security_key",
            MONGO_URI: "mongodb://myUserAdmin:doctorappdev@52.242.121.10:27017/ainode?authSource=admin&readPreference=primary&appname=MongoDB%20Compass&ssl=false",

            BASE_URL: "http://52.242.121.10/"
        }
    }]
}
BASE_URL = "http://52.242.121.10/"