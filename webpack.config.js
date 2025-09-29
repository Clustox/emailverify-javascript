const path = require("path");

module.exports = {
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "emailVerifySDK.js",
    globalObject: "this",
    library: "EmailVerifySDK",
    libraryTarget: "umd",
    libraryExport: "default",
  },
  module: {
    rules: [
      {
        exclude: /node_modules/,
      },
    ],
  },
};
