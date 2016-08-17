/// <reference path="../typings/index.d.ts" />

import * as express from'express';
export function decryptPacket() {
    return function (request:express.Request, response:express.Response, next:Function) {
        next();  //do nothing for now
    }
}