"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const getCurrentTime_1 = __importDefault(require("../utils/getCurrentTime"));
const distribute_1 = __importDefault(require("../utils/translation/distribute"));
module.exports = function ({ appDirectory }) {
    const filePath = path_1.default.join(appDirectory, 'src/generated/locales.json');
    if (fs_1.default.existsSync(filePath)) {
        distribute_1.default({
            filePath,
            appDirectory,
            type: 'i18next',
        }).then(() => {
            console.log(`[${getCurrentTime_1.default()}] 👍 Translation distribute is successful.`);
        })
            .catch((error) => {
            console.error(`[${getCurrentTime_1.default()}] 💀 Translation distribute is failed.`);
            console.error(error);
        });
    }
    else {
        console.error(`[${getCurrentTime_1.default()}] 💀 "${filePath}" does not exists.`);
    }
};
//# sourceMappingURL=i18next.distribute.js.map