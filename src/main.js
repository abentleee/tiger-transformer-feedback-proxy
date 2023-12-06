import express from 'express';
import dotenv from 'dotenv';
import { Buffer } from 'buffer';

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.text());

const port = process.env.PORT || 3000;

app.post('/api/v1/success', async (req, res) => {
    const host = `${process.env.TIGER_TRANSFORMER_FEEDBACK_API_HOST}/api/v1/success`;
    
    // pull creds from env
    // const creds = `${process.env.TIGER_TRANSFORMER_FEEDBACK_API_USER}:${process.env.TIGER_TRANSFORMER_FEEDBACK_API_PASSWORD}`
    // const auth = `Basic ${Buffer.from(creds).toString('base64')}`;

    // pull creds from request body (temp workaround due to cors issue)
    const body = JSON.stringify(req.body);
    const auth = body.substring(body.indexOf(`Basic`), body.indexOf(`\"}`))

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

    res.status(201).send();
});

app.get('/', (req, res) => {
    res.send('Hello world!');
});

app.listen(port, () => {
    console.log(`tiger-transformer-feedback-api listening on port ${port}`);
});

