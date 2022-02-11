const path = require('path');
const fs = require('fs');
const CopyPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const getEntry = (pathDir) => {
    let entries = {},
        filePath = pathDir || path.resolve(__dirname, './src');
    fs.readdirSync(filePath).forEach((filename) => {
        states = fs.statSync(filePath + "/" + filename);
        if (!states.isDirectory() && /\.js/.test(filename)) {
            let enrtyKey = filename.split('.')[0];
            entries[enrtyKey] = path.join(filePath, filename);
        } else {
            entries = Object.assign(entries, getEntry(pathDir));
        }
    });
    return entries;
};

module.exports = {
    mode: process.env.NODE_ENV,
    entry: getEntry(),
    output: {
        filename: '[name].js',
        path: path.join(__dirname, './dist'),
    },
    devtool: process.env.NODE_ENV === 'production' ? undefined : 'cheap-module-source-map',
    module: {
        rules: [
            {
                test: /.js$/,
                use: {
                    loader: 'babel-loader',
                }
            }
        ],
    },
    resolve: {
        extensions: [".js"],
    },
    plugins: [
        new CleanWebpackPlugin(),
        new CopyPlugin({
            patterns: [
                { from: "public", to: "" },
            ],
        }),
    ],
}