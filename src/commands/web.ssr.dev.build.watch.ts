import createWebpackConfig from '../createWebpackConfig';
import removeDirectory from '../removeDirectory';
import { Config } from '../types';
import watchWebpack from '../watchWebpack';
import app from '../webpack/app';
import base from '../webpack/base';
import build from '../webpack/build-ssr';
import ssr from '../webpack/ssr';
import style from '../webpack/style';
import getCurrentTime from '../getCurrentTime';

export = function (config: Config) {
  const outputPath: string = `${config.appDirectory}/dist-dev/ssr`;
  const extractCss: boolean = true;
  const isProduction: boolean = false;
  
  removeDirectory(outputPath)
    .then(() => {
      return createWebpackConfig(config, [
        base({
          mode: 'development',
          output: {
            path: outputPath,
          },
        }),
        ssr(),
        app(),
        style({extractCss}),
        build({isProduction}),
      ]);
    })
    .then(webpackConfig => {
      watchWebpack(config, webpackConfig).subscribe(
        () => {
          console.log(`[${getCurrentTime()}] 👍 App build is successful.`);
        },
        error => {
          console.error(`[${getCurrentTime()}] 💀 App build is failed.`);
          console.error(error);
        },
      );
    })
    .catch(error => {
      console.error(`[${getCurrentTime()}] 💀 App build is failed.`);
      console.error(error);
    });
};