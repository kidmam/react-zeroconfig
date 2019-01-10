import { MiddlewareHandler, Options, PerRouteMiddleware } from 'browser-sync';
import compression from 'compression';
import proxyMiddleware from 'http-proxy-middleware';
import webpack, { Compiler, Configuration } from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import { Config } from './types';

interface Params {
  app: Config['app'];
  appDirectory: Config['appDirectory'];
  ssrEnabled: Config['ssrEnabled'];
  middlewares?: (MiddlewareHandler | PerRouteMiddleware)[]
}

export = function ({app, appDirectory, ssrEnabled, middlewares = []}: Params, webpackConfig: Configuration): Promise<Options> {
  const compiler: Compiler.Watching | Compiler = webpack(webpackConfig);
  
  const middleware: (MiddlewareHandler | PerRouteMiddleware)[] = [
    webpackDevMiddleware(compiler, {
      publicPath: app.publicPath,
      stats: {colors: true},
    }),
    
    webpackHotMiddleware(compiler),
    
    compression(),
    
    ...middlewares,
  ];
  
  if (ssrEnabled) {
    middleware.push(
      proxyMiddleware(['**', '!**/*.*'], {
        target: `http://localhost:${app.ssrPort}`,
      }),
    );
  }
  
  return Promise.resolve({
    port: app.port,
    open: false,
    ghostMode: false,
    https: app.https,
    
    server: {
      baseDir: app.staticFileDirectories.map(dir => {
        return `${appDirectory}/${dir}`;
      }),
      
      middleware,
    },
  });
};