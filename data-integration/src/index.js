import { createReadStream } from 'node:fs';
import { pipeline } from 'node:stream/promises';
import csvtojson from 'csvtojson';
import { Transform } from 'node:stream';
import { randomUUID } from 'node:crypto';
import { log, makeRequest } from './util.js';
import ThrottleRequest from './throttle.js';
const throttle = new ThrottleRequest({
    objectMode: true,
    requestPerSecond: 100
}) 

const dataProcessor = Transform({
    objectMode: true,
    transform(chunk, enc, callback) {
        const now = performance.now();
        const jsonData = chunk.toString().replace(/\d/g, now);
        const data = JSON.parse(jsonData);
        data.id = randomUUID();

        return callback(null, JSON.stringify(data));
    }
})

await pipeline(
    createReadStream('big.csv'),
    csvtojson(),
    dataProcessor,
    throttle,
    async function * (source) {
        let counter = 0;
        for await (const data of source) {
            log(`processed ${++counter} items...`);
            const status = await makeRequest(data);
            if(status !== 200) {
                throw new Error(`oops! reached rate limit, stupid! - status ${status}`);
            }
        }
    }
)