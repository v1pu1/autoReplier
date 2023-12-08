import { gmail } from "./gmail_auth.js";
import { readFileSync } from "fs";

//get recieved email attributes, sender and subject
async function getSenderAndSubject(emailId) {
    const email = await gmail.users.messages.get({
        userId: 'me',
        id: emailId
    });

    const sender = email.data.payload.headers.find(
        (header) => header.name === 'From'
    ).value;

    const subject = email.data.payload.headers.find(
        (header) => header.name === 'Subject'
    ).value;

    return { sender, subject };
}

//sends reply to given emailId
async function sendReply(emailId, sender, subject, body) {

    //creating a email format
    const requestBody = {
        raw: Buffer.from(
            `From: "me"\nTo: ${sender}\nSubject: ${subject}\n\n${body}`
        ).toString('base64'),
        threadId: emailId,
    };

    //sends email
    await gmail.users.messages.send({
        userId: 'me',
        requestBody,
    });
}

async function markEmailAsRead(emailId) {

    //retrive id of label saved locally
    const { id } = JSON.parse(readFileSync(process.env.LABEL_PATH));

    //set the mail as read and assign the new label with label id
    await gmail.users.messages.modify({
        userId: 'me',
        id: emailId,
        requestBody: {
            addLabelIds: ['INBOX', id],
            removeLabelIds: ['UNREAD'],
        },
    });
}

async function sendAutoReplies(emails) {

    //call all functions here
    for (const email of emails) {
        //get email attributes
        const { sender, subject } = await getSenderAndSubject(email.id);

        //for better visibility
        console.log('# Sender:', sender);
        console.log('# Subject:', subject);

        //email content
        const body = `Hi ${sender}, \n\nI'm on vacation, I'll get back to you as soon as I can. \n\n Thanks & Regards`;

        //function calls sending and marking them as read
        await sendReply(email.id, sender, subject, body);
        await markEmailAsRead(email.id);

        console.log('Reply sent.');
    }
}

export async function replyAll() {
    try {
        //retriving unread emails max=9
        const res = await gmail.users.messages.list({
            userId: 'me',
            labelIds: ['UNREAD', 'INBOX'],
            maxResults: 9,
        });

        const emails = res.data.messages || [];

        //if new emails are recieved, reply to them
        if (emails.length > 0) {
            console.log('Recent emails:');
            await sendAutoReplies(emails);
        } else {
            console.log('No new emails.');
        }
    } catch (err) {
        console.error(err);
    }
}
