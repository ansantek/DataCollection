/// <reference path="../typings/index.d.ts" />

import * as express from 'express';
import * as Database from '../models/Database';

interface collectionRequest extends express.Request {
    collectionObject : any;
}

var BadDateError:Error={name:'BADTIMESTAMP', message:'Bad date format'};
var FieldMissingError:Error={name:'FIELDMISSING', message:'Data record field missing'};

export function validateEventRecords() {
    return function (request:collectionRequest, response:express.Response, next:Function) {
        var Data = request.collectionObject;
        var Record : Database.EventItem;
        var i: number;

        for(i=0; i<Data.length; i++){
            Record=Data[i];
            if(!Record.TS || !Record.ET || !Record.ED) return next(FieldMissingError);

            var TimeStamp=Date.parse(Record.TS);
            if(isNaN(TimeStamp))return next(BadDateError);

            //make sure that timestamp is in acceptable format
            Data[i].TS=new Date(TimeStamp).toISOString();
       }

        next();
    }
}