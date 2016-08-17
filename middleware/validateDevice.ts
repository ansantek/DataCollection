/// <reference path="../typings/index.d.ts" />

import * as express from 'express';
import * as Database from '../models/Database';

interface DataEventRequest extends express.Request {
    DeviceID : string;
    Device : Database.DeviceRecord;
}

var NoDeviceError:Error={name:'DEVICEUNDEF', message:'No such device defined'};
var MultipleDeviceError:Error={name:'MULTIPLEDEVICES', message:'Multiple devices with same name'};

export function validateDevice(){
    return function(request:DataEventRequest, response:express.Response, next: Function){
        Database.GetDevice(request.body.DeviceID, function(err, results:Database.DeviceRecord[]){
            if (err) return next(err);
            if (!results || (results.length==0)) return next(NoDeviceError);
            if (results.length != 1) return next(MultipleDeviceError);
            request.Device = results[0];
            next();
        })
    }
}

//export=validateDevice;