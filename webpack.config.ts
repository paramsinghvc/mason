import webpack from "webpack";
import path from "path";
import { CleanWebpackPlugin } from "clean-webpack-plugin";
import DtsBundlePlugin from "@ahrakio/witty-webpack-declaration-files";
import { BundleAnalyzerPlugin } from "webpack-bundle-analyzer";

const config: webpack.Configuration = {
  entry: path.resolve(__dirname, "./src/index.ts"),
  mode: process.env.NODE_ENV === "development" ? "development" : "production",
  devtool: "source-map",
  target: "web",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: "babel-loader",
            options: {
              babelrc: false,
              presets: ["@babel/preset-env"]
            }
          },
          {
            loader: "ts-loader",
            options: {
              context: __dirname,
              configFile: "tsconfig.json"
            }
          }
        ],
        exclude: /node_modules/
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin({
      verbose: true
    }),
    new DtsBundlePlugin({ merge: true })
  ],
  resolve: {
    extensions: [".tsx", ".ts", ".js"]
  },
  externals: {
    react: "react"
  },
  output: {
    filename: "index.js",
    path: path.resolve(__dirname, "dist"),
    library: "mason",
    libraryTarget: "umd"
  }
};

if (process.env.ANALYZE) {
  config.plugins.push(new BundleAnalyzerPlugin());
}

export default config;
