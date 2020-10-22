const fs = require('fs');
const path = require('path');
const rimraf = require('rimraf');

const currentFolder = process.cwd();

async function getDirectories(filePath) {
    let dirs = [];
    for (const file of await fs.readdirSync(filePath)) {
        if ((await fs.statSync(path.join(filePath, file))).isDirectory()) {
            dirs = [...dirs, file];
        }
    }
    return dirs;
}

async function removeDuplicateSongs() {
    console.log(`Reading directories...`);

    const dirs = await getDirectories(currentFolder);
    const songs = [];

    console.log(`(${dirs.length}) Directories ready... reading song info.`);

    let removedDuplicates = 0;

    for (let i = 0; i < dirs.length; i++) {
        const folder = dirs[i];
        const folderLocation = path.join(currentFolder, folder);
        const files = fs.readdirSync(folderLocation);

        const index = files.findIndex((file) => file.includes('info.dat') || file.includes('Info.dat'));
        if (index <= -1) {
            continue;
        }

        const fileDataJSON = fs.readFileSync(path.join(folderLocation, files[index]));
        let fileData;

        try {
            fileData = JSON.parse(fileDataJSON);
        } catch (err) {
            continue;
        }

        if (songs.findIndex((x) => x.name.toLowerCase() === fileData._songName.toLowerCase()) !== -1) {
            removedDuplicates += 1;
            rimraf.sync(folderLocation);
            console.log(`Removed: ${folderLocation}`);
            continue;
        }

        songs.push({ name: fileData._songName.toLowerCase(), path: folderLocation });
    }

    console.log(`${removedDuplicates} duplicate songs were removed.`);
    console.log(`Closing window in 5 seconds...`);
    setTimeout(() => {
        console.log(`Bye! :)`);
    }, 5000);
}

removeDuplicateSongs();
