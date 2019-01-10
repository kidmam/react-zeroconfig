"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const mini_css_extract_plugin_1 = __importDefault(require("mini-css-extract-plugin"));
const optimize_css_assets_webpack_plugin_1 = __importDefault(require("optimize-css-assets-webpack-plugin"));
const postcss_safe_parser_1 = __importDefault(require("postcss-safe-parser"));
const terser_webpack_plugin_1 = __importDefault(require("terser-webpack-plugin"));
module.exports = ({ isProduction }) => ({ app, appDirectory }) => {
    return Promise.resolve({
        entry: app.entry.reduce((entry, entryItemName) => {
            entry[entryItemName] = `${appDirectory}/src/_entry/client/${entryItemName}`;
            return entry;
        }, {}),
        optimization: {
            concatenateModules: isProduction,
            minimize: isProduction,
            minimizer: [
                new terser_webpack_plugin_1.default({
                    terserOptions: {
                        parse: {
                            ecma: 8,
                        },
                        compress: {
                            ecma: 5,
                            warnings: false,
                            comparisons: false,
                            inline: 2,
                        },
                        mangle: {
                            safari10: true,
                        },
                        output: {
                            ecma: 5,
                            comments: false,
                            ascii_only: true,
                        },
                    },
                    parallel: true,
                    cache: true,
                    sourceMap: true,
                }),
                new optimize_css_assets_webpack_plugin_1.default({
                    cssProcessorOptions: {
                        parser: postcss_safe_parser_1.default,
                        map: isProduction
                            ? {
                                inline: false,
                                annotation: true,
                            }
                            : false,
                    },
                }),
            ],
        },
        plugins: [
            new mini_css_extract_plugin_1.default({
                filename: `${app.buildPath}[name].css`,
                chunkFilename: `${app.buildPath}[name].css`,
            }),
        ],
    });
};
//# sourceMappingURL=build-web.js.map