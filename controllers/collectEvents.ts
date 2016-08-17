/// <reference path="../typings/index.d.ts" />

import * as express from 'express';
import * as Database from '../models/Database';

export interface EventRequest extends express.Request{
    collectionObject : any;
    Device : Database.DeviceRecord;
}

export function save(request:EventRequest, response:express.Response) {
    Database.SaveEvents(request.Device.idDevices, request.collectionObject, function(err, results){
        if(err) return response.status(500).send(err);
        else return response.sendStatus(200);
    })
}
