// import fs from "fs"
import {readTextFile, writeTextFile, exists} from "@tauri-apps/api/fs";
import {resourceDir, join, BaseDirectory} from '@tauri-apps/api/path';

export async function saveLoginInfo(studentID, password) {
    const resourceDirPath = await resourceDir();
    const configFilePath = await join(resourceDirPath, "config.json")
    let config = {}
    if (await exists(configFilePath)) {
        let buffer = await readTextFile(configFilePath);
        config = JSON.parse(buffer);
    }
    config['loginInfo'] = {
        'studentID': studentID,
        'password': password,
    }
    // console.log(JSON.stringify(config));
    await writeTextFile({path: 'config.json', contents: JSON.stringify(config)}, {dir: BaseDirectory.Resource});
}

export async function readLoginInfo() {
    const resourceDirPath = await resourceDir();
    const configFilePath = await join(resourceDirPath, "config.json")
    if (await exists(configFilePath)) {
        let buffer = await readTextFile(configFilePath);
        // console.log(buffer)
        let config = JSON.parse(buffer);
        let studentID = config['loginInfo']['studentID'];
        let password = config['loginInfo']['password'];
        if (studentID && password)
            return {
                'status': 'success',
                'studentID': studentID,
                'password': password,
            }
        else
            return {
                'status': 'empty'
            }
    } else
        return {
            'status': 'not exist'
        }
}