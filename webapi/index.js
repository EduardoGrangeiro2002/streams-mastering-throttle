import express from 'express';
import bodyParser from 'body-parser';
import { createWriteStream } from 'node:fs';
import rateLimit from 'express-rate-limit';
const output = createWriteStream('output.ndjson');

const limiter = rateLimit({
    windowMs: 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false
});

const app = express();
const PORT = 3000;
app.use(bodyParser.json());
app.use(limiter);

app.post('/', (req, res) => {
    output.write(JSON.stringify(req.body) + "\n")
    return res.send('ok!!');
})

app.listen(PORT, () => console.log(`Server running at ${PORT}`));