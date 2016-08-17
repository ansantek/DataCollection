/**
 * Created by larry on 1/25/15.
 */
///<reference path='../typings/node/node.d.ts'/>
///<reference path='../typings/express/express.d.ts'/>

import Express=require('express');
function decryptPacket() {
    return function (request:Express.Request, response:Express.Response, next:Function) {
        next();  //do nothing for now
    }
}
export=decryptPacket;