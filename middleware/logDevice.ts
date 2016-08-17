/// <reference path="../typings/index.d.ts" />

import * as express from 'express';
import * as Database from '../models/Database';

interface logRequest extends express.Request {
    Logging : number;
    Device:Database.DeviceRecord;
}

export function logRequest() {
    return function (request:logRequest, response:express.Response, next:Function) {
        console.log('logRequest-Logging:'+request.Device.Logging);
        console.log(request.body);
        if(!request.Device.Logging) next();
        Database.LogDeviceRequest(request.Device.idDevices, JSON.stringify(request.body), function(err, results){
            if(err)next(err)
            else next();
        })
    }
}
