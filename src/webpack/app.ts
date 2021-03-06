import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin-alt';
import path from 'path';
import typescriptFormatter from 'react-dev-utils/typescriptFormatter';
import resolve from 'resolve';
import webpack, { Configuration, Plugin } from 'webpack';
import { Config } from '../types';
import getAlias from '../utils/webpack/getAlias';
import getDefaultLoaders from '../utils/webpack/getDefaultLoaders';
import getStyleLoaders from '../utils/webpack/getStyleLoaders';

interface Params {
  extractCss: boolean;
}

export = ({extractCss}: Params) => (config: Config): Promise<Configuration> => {
  const {app, appDirectory, typescriptEnabled} = config;
  
  const enforce: 'pre' = 'pre';
  
  const typeScriptPlugins: Plugin[] = typescriptEnabled ? [
    new ForkTsCheckerWebpackPlugin({
      typescript: resolve.sync('typescript', {
        basedir: path.join(appDirectory, 'node_modules'),
      }),
      async: false,
      checkSyntacticErrors: true,
      tsconfig: path.join(appDirectory, 'tsconfig.json'),
      reportFiles: [
        '**',
        '!**/*.json',
        '!**/__tests__/**',
        '!**/?(*.)(spec|test).*',
        '!**/src/setupProxy.*',
        '!**/src/setupTests.*',
      ],
      watch: path.join(appDirectory, 'src'),
      silent: true,
      formatter: typescriptFormatter,
    }),
  ] : [];
  
  return Promise.resolve({
    resolve: {
      alias: getAlias(config),
    },
    
    module: {
      strictExportPresence: true,
      
      rules: [
        // tslint
        {
          test: /\.(ts|tsx)?$/,
          enforce,
          use: [
            {
              loader: require.resolve('tslint-loader'),
              options: {
                configFile: path.join(appDirectory, 'tslint.json'),
                tsConfigFile: path.join(appDirectory, 'tsconfig.json'),
              },
            },
          ],
        },
        
        {
          oneOf: [
            // convert files to data url
            {
              test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
              loader: require.resolve('url-loader'),
              options: {
                limit: 10000,
                name: 'static/[name].[hash:8].[ext]',
              },
            },
            
            ...getDefaultLoaders(path.join(appDirectory, 'src')),
            
            ...getStyleLoaders(
              /\.css$/,
              /\.module.css$/,
              extractCss,
            ),
            ...getStyleLoaders(
              /\.(scss|sass)$/,
              /\.module.(scss|sass)$/,
              extractCss,
              'sass-loader',
            ),
            ...getStyleLoaders(
              /\.less$/,
              /\.module.less$/,
              extractCss,
              'less-loader',
            ),
            
            // export files to static directory
            {
              loader: require.resolve('file-loader'),
              exclude: [/\.(js|mjs|jsx|ts|tsx)$/, /\.html$/, /\.json$/],
              options: {
                name: 'static/[name].[hash:8].[ext]',
              },
            },
          ],
        },
      ],
    },
    
    plugins: [
      ...typeScriptPlugins,
      new webpack.DefinePlugin({
        'process.env.SERVER_PORT': JSON.stringify(app.serverPort),
      }),
    ],
  });
};