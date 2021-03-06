"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sortPackageJsonFiles_1 = __importDefault(require("../../../utils/module/sortPackageJsonFiles"));
describe('module/sortPackageJsonFiles', () => {
    it('Should be sorted modules by their dependencies', () => {
        function test(jsonFiles) {
            const sorted = sortPackageJsonFiles_1.default(jsonFiles);
            sorted.reverse().forEach((a, i) => {
                // sorted.slice(0, i) does not have a
                for (const b of sorted.slice(0, i)) {
                    const aFile = jsonFiles.find((jsonFile) => jsonFile.name === a);
                    expect(aFile).not.toBeUndefined();
                    if (aFile) {
                        expect(!aFile.dependencies || !aFile.dependencies[b]).toBeTruthy();
                    }
                }
            });
        }
        test([
            {
                name: 'a',
                dependencies: {
                    'c': '0.0.0',
                },
            },
            {
                name: 'b',
                dependencies: {
                    'a': '0.0.0',
                    'c': '0.0.0',
                },
            },
            {
                name: 'c',
            },
            {
                name: 'd',
                dependencies: {
                    'e': '0.0.0',
                    'b': '0.0.0',
                },
            },
            {
                name: 'e',
            },
        ]);
        test([
            {
                name: '@ssen/test-module1',
                dependencies: {
                    'react': '0',
                },
            },
            {
                name: '@ssen/test-module2',
                dependencies: {
                    'react': '0',
                    'test-module3': '0',
                },
            },
            {
                name: 'router-store',
                dependencies: {
                    'react': '0',
                    'react-router': '0',
                },
            },
            {
                name: 'test-module3',
                dependencies: {
                    'react': '0',
                    '@ssen/test-module1': '0',
                },
            },
            {
                name: 'use-react-intl',
                dependencies: {
                    'react': '0',
                    'react-intl': '0',
                },
            },
        ]);
    });
});
//# sourceMappingURL=sortPackageJsonFiles.js.map