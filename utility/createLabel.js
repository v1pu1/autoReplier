import { writeFileSync } from "fs";
import { gmail } from "./gmail_auth.js";

export default async function createLabel() {
    try {
        // console.log(gmail.users);
        const res = await gmail.users.labels.list({ userId: 'me' });
        const labels = res.data.labels;

        //checking if label already exists on gmail or not
        const labelExists = labels.some((label) => label.name === process.env.PERSONALISED_LABEL);

        //if doesnt exist, create
        if (!labelExists) {
            const labeldata = await gmail.users.labels.create({
                userId: 'me',
                requestBody: {
                    name: process.env.PERSONALISED_LABEL,
                    messageListVisibility: 'labelShow',
                    labelListVisibility: 'show'
                }
            });

            //save the id locally
            console.log(labeldata.data.id);
            writeFileSync(
                'label.json', JSON.stringify({
                    "name": process.env.PERSONALISED_LABEL,
                    "id": labeldata.data.id
                })
            );
            console.log('Label created successfully.');
        } 
    } catch (error) {
        console.error('Error creating label:', error.message);
    }
}