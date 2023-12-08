import 'dotenv/config'
import { loadTokens } from './utility/gmail_auth.js';
import fileExist from "./utility/fileExist.js";
import { replyAll } from './utility/emailReply.js';
import createLabel from './utility/createLabel.js';
import cron from 'node-cron';

async function main() {
    try {
        //check for token saved locally or get access_token if not present
        await loadTokens();

        //check if label file exists of not
        const labelExists = await fileExist('label.json');
        if (!labelExists) {
            console.log("Creating label...");
            //create label creates a label on gmail
            await createLabel();
        }

        // node-cron to monitor emails every 1 minute
        console.log("Checking for mails every 1 minute.");
        cron.schedule('*/1 * * * *', async () => {
            console.log('Checking for new emails...');
            //replyAll gets the emails recieved and replies to them
            await replyAll();
        });
    } catch (error) {
        console.error('Error in the main function:', error);
    }
}

main();


