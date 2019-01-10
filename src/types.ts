import { Configuration } from 'webpack';

export interface ModuleBuildOption {
  name: string;
  group: string | undefined;
  groupDirectory: string;
  file: string;
  externals: string[];
}

export interface Config {
  app: {
    entry: string[];
    port: number;
    staticFileDirectories: string[];
    
    buildPath: string;
    https: boolean | {key: string, cert: string};
    vendorFileName: string;
    styleFileName: string;
    publicPath: string;
    ssrPort: number;
  };
  
  modules: {
    entry: {[name: string]: {group?: string}};
  }
  
  command: string;
  appDirectory: string;
  ssenpackDirectory: string;
  ssrEnabled: boolean;
}

export type UserConfig = Partial<Config>;

export type WebpackFunction = (config: Config) => Promise<Configuration>;

export type TranslationStore = Map<string, Map<string, object>>;