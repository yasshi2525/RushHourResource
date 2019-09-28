const path = require("path");

module.exports = {
    entry: {
        index: [ "./src/index.ts" ]
    },
    output: {
        path: path.join(__dirname, "build/js"),
    },
    module: {
        rules: [
            { test: /\.ts$/, use: ["ts-loader"] }, 
            { test: /\.(png|jpg|gif)$/, use: ["url-loader"] },
        ]
    },
    resolve: {
        extensions: [".js", ".ts"]
    },
    mode: "development"
};