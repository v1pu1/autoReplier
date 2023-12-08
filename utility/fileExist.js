import fs from 'fs';

//simple function to see if file exists on the given path
export default async function fileExist (path) {
    try{
        await fs.promises.access(path);
        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
}