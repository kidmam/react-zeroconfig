import fs from 'fs-extra';
import glob from 'glob';
import { Config, TranslationContent, TranslationStore, TranslationType } from '../../types';
import exportTranslation from './export';

interface Params {
  appDirectory: Config['appDirectory'];
  outputPath: string;
  type: TranslationType;
  globPattern?: string;
}

export = function ({appDirectory, outputPath, type, globPattern = `${appDirectory}/src/**/locales/[a-z][a-z]-[A-Z][A-Z].json`}: Params): Promise<void> {
  return new Promise<void>((resolve: () => void, reject: (error: Error) => void) => {
    glob(
      globPattern,
      (error: Error, filePaths: string[]) => {
        if (error) {
          reject(error);
          return;
        }
        
        const translationStore: TranslationStore = new Map();
        
        for (const filePath of filePaths) {
          const content: TranslationContent = fs.readJsonSync(filePath, {encoding: 'utf8'});
          const languageCode: string = (/\/([a-z]{2}-[A-Z]{2}).json$/.exec(filePath) as RegExpExecArray)[1];
          
          if (!translationStore.has(languageCode)) {
            translationStore.set(languageCode, new Map());
          }
          
          const languageContentMap: Map<string, TranslationContent> | undefined = translationStore.get(languageCode);
          
          if (languageContentMap) {
            languageContentMap.set(filePath, content);
          }
        }
        
        resolve();
        
        exportTranslation({
          translationStore,
          outputPath,
          type,
        }).then(() => resolve());
      },
    );
  });
}