import 'dotenv/config'
import { google } from 'googleapis';
import { createInterface } from 'readline';
import { readFileSync, writeFileSync } from 'fs';

//initializing oauth2client with credentials
const oauth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.REDIRECT_URI
);

//scopes mentioned in the gmail API docs
const scopes = [
    'https://www.googleapis.com/auth/gmail.modify', 
    'https://www.googleapis.com/auth/gmail.readonly',
    'https://www.googleapis.com/auth/gmail.send',
    'https://www.googleapis.com/auth/gmail.labels'
];

const autorize = async () =>{

    //snippet got from googleAPI docs
    const url = oauth2Client.generateAuthUrl({
        // 'online' (default) or 'offline' (gets refresh_token)
        access_type: 'offline',
      
        // If you only need one scope you can pass it as a string
        scope: scopes,
        prompt:'consent'
    });

    //url to login and retreive access_token, authorisation
    console.log('authorize here :', url);


    //cammant line to read the token
    const rl = createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    const auth_code = await new Promise((resolve) => {
        rl.question('Enter the authorization code here: ', (code) => {
            rl.close();
            resolve(code);
        });
    });


    //setting the token and saving it locally for more feasibility
    const { tokens } = await oauth2Client.getToken(auth_code);
    oauth2Client.credentials = tokens;
    writeFileSync(process.env.TOKEN_PATH, JSON.stringify(tokens));
    console.log('Token stored to', process.env.TOKEN_PATH);

}

export const loadTokens = async() => {
    try {
        //get token if saved locally
        const token = readFileSync(process.env.TOKEN_PATH);
        oauth2Client.setCredentials(JSON.parse(token));
    } catch (error) {
        //if not found or expired
        await autorize();
    }
}

//authclient 
export const gmail = google.gmail({version : 'v1', auth : oauth2Client});
