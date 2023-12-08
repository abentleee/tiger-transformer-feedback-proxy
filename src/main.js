import express from 'express';
import dotenv from 'dotenv';
import { Buffer } from 'buffer';

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.text());

const port = process.env.PORT || 3000;

// success endpoint
app.post('/api/v1/success', async (req, res) => {
    const host = `${process.env.TIGER_TRANSFORMER_FEEDBACK_API_HOST}/api/v1/success`;

    // pull creds from request body (temp workaround due to cors issue)
    let body = req.body;
    const auth = body.substring(body.indexOf(`Basic`), body.indexOf(`\"}`))

    // remove auth from payload to api
    body = body.replace(`, "authorization": "${auth}"`, '');

    // return bad request if no request body
    if (!Object.keys(req.body).length) {
        console.error(`no request body found, returning 400`);
        res.status(400).send();
        return;
    }

    // call tiger-transformer-feedback-api app with headers and body
    const options = {
        method: 'POST',
        headers: {
            'Authorization': auth,
            'Content-Type': 'application/json'
        },
        body,
    }

    try {
        const response = await fetch(host, options);
        console.log(`response: ${JSON.stringify(response.status)} - ${JSON.stringify(response)}`);

        res.status(201).send();
    } catch (err) {
        console.error(err);
        res.status(500).send();
    }
});

// error endpoint
app.post('/api/v1/error', async (req, res) => {
    const host = `${process.env.TIGER_TRANSFORMER_FEEDBACK_API_HOST}/api/v1/error`;

    // pull creds from request body (temp workaround due to cors issue)
    let body = req.body;
    const auth = body.substring(body.indexOf(`Basic`), body.indexOf(`\"}`))

    console.log(`auth: ${auth}`)

    // remove auth from payload to api
    body = body.replace(`, "authorization": "${auth}"`, '');

    // return bad request if no request body
    if (!Object.keys(req.body).length) {
        console.error(`no request body found, returning 400`);
        res.status(400).send();
        return;
    }

    // call tiger-transformer-feedback-api app with headers and body
    const options = {
        method: 'POST',
        headers: {
            'Authorization': auth,
            'Content-Type': 'application/json'
        },
        body,
    }

    try {
        const response = await fetch(host, options);
        console.log(`response: ${JSON.stringify(response.status)} - ${JSON.stringify(response)}`);

        res.status(201).send();
    } catch (err) {
        console.error(err);
        res.status(500).send();
    }
});

// TODO: feedback endpoint

app.get('/', (req, res) => {
    res.send('Hello world!');
});

app.listen(port, () => {
    console.log(`tiger-transformer-feedback-api listening on port ${port}`);
});

