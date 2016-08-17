/**
 * Created by larry on 2/18/15.
 */
///<reference path='../typings/node/node.d.ts'/>
///<reference path='../typings/express/express.d.ts'/>
import express=require('express');
import Database=require('../models/Database');

interface logRequest extends express.Request {
    Logging : number;
    Device:Database.DeviceRecord;
}

function logRequest() {
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

export=logRequest;