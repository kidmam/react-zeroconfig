"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const mini_css_extract_plugin_1 = __importDefault(require("mini-css-extract-plugin"));
const getCSSModuleLocalIdent_1 = __importDefault(require("react-dev-utils/getCSSModuleLocalIdent"));
module.exports = function (cssRegex, cssModuleRegex, extractCSS, preProcessor = null) {
    const styleLoader = extractCSS
        ? mini_css_extract_plugin_1.default.loader
        : require.resolve('style-loader');
    const postcssLoader = {
        loader: require.resolve('postcss-loader'),
        options: {
            ident: 'postcss',
            plugins: () => [
                require('postcss-flexbugs-fixes'),
                require('postcss-preset-env')({
                    autoprefixer: {
                        flexbox: 'no-2009',
                    },
                    stage: 3,
                }),
            ],
            sourceMap: true,
        },
    };
    const use = [
        styleLoader,
        {
            loader: require.resolve('css-loader'),
            options: {
                url: false,
                importLoaders: preProcessor ? 2 : 1,
                sourceMap: true,
            },
        },
        postcssLoader,
    ];
    const moduleUse = [
        styleLoader,
        {
            loader: require.resolve('css-loader'),
            options: {
                url: false,
                importLoaders: preProcessor ? 2 : 1,
                sourceMap: true,
                modules: true,
                getLocalIdent: getCSSModuleLocalIdent_1.default,
            },
        },
        postcssLoader,
    ];
    if (preProcessor) {
        const preProcessorLoader = {
            loader: require.resolve(preProcessor),
            options: {
                sourceMap: true,
                javascriptEnabled: true,
            },
        };
        use.push(preProcessorLoader);
        moduleUse.push(preProcessorLoader);
    }
    return [
        {
            test: cssRegex,
            exclude: cssModuleRegex,
            use,
        },
        {
            test: cssModuleRegex,
            use: moduleUse,
        },
    ];
};
//# sourceMappingURL=getStyleLoaders.js.map