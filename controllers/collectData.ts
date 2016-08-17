/// <reference path="../typings/index.d.ts" />

import * as express from 'express';
import * as Database from '../models/Database';

interface DataRequest extends express.Request{
    collectionObject : any;
    Device : Database.DeviceRecord;
}

export function save(request:DataRequest, response:express.Response) {
    console.log('save:'+request.Device.idDevices+':'+JSON.stringify(request.collectionObject));
    Database.SaveData(request.Device.idDevices, request.collectionObject, function(err, results){
        console.log('return from save');
        if(err) return response.status(500).send(err.message);
        else response.sendStatus(200);
    });
}


