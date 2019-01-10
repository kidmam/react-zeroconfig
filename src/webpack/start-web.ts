import webpack, { Configuration } from 'webpack';
import { Config } from '../types';
import path from 'path';

export = () => ({app, appDirectory}: Config): Promise<Configuration> => {
  return Promise.resolve({
    entry: app.entry.reduce((entry, entryItemName) => {
      entry[entryItemName] = [
        `${path.dirname(require.resolve('webpack-hot-middleware/package.json'))}/client?http://localhost:${app.port}`,
        `${path.dirname(require.resolve('webpack/package.json'))}/hot/only-dev-server`,
        `${appDirectory}/src/_entry/client/${entryItemName}`,
      ];
      return entry;
    }, {}),
    
    optimization: {
      namedModules: true,
      noEmitOnErrors: true,
    },
    
    plugins: [
      new webpack.HotModuleReplacementPlugin(),
    ],
  });
};