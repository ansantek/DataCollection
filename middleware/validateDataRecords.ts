/**
 * Created by larry on 1/25/15.
 */
///<reference path='../typings/node/node.d.ts'/>
///<reference path='../typings/express/express.d.ts'/>

import Express=require('express');
import Database=require('../models/Database');

interface collectionRequest extends Express.Request {
    collectionObject : any;
}

var BadDateError:Error={name:'BADTIMESTAMP', message:'Bad date format'};
var FieldMissingError:Error={name:'FIELDMISSING', message:'Data record field missing'};

function validateDataRecords() {
    return function (request:collectionRequest, response:Express.Response, next:Function) {
        var Data = request.collectionObject;
        var Record : Database.DataItem;
        var i: number;

        for(i=0; i<Data.length; i++){
            Record=Data[i];
            if(!Record.TS || !Record.D1 || !Record.D2) return next(FieldMissingError);
            var TimeStamp=Date.parse(Record.TS);
            if(isNaN(TimeStamp))return next(BadDateError);

            //make sure that timestamp is in acceptable format
            Data[i].TS=new Date(TimeStamp).toISOString();
        }
        next();
    }
}
export=validateDataRecords;