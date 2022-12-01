import { Transform } from 'node:stream';
const ONE_SECOND = 1000;
export default class ThrottleRequest extends Transform {
    #requestPerSecond = 0;
    #internalCounter = 0;
    constructor({
        objectMode,
        requestPerSecond
    }) {
        super({
            objectMode
        })

        this.#requestPerSecond = requestPerSecond
    }
    _transform(chunk, enc, callback) {
        this.#internalCounter ++;
        if(!(this.#internalCounter >= this.#requestPerSecond)) {
            this.push(chunk);
            return callback();
        }

        setTimeout(() => {
            this.#internalCounter = 0;
            this.push(chunk);
            return callback();
        }, ONE_SECOND)
    }


}