/// <reference path="../typings/index.d.ts" />

import * as express from 'express';
import * as config from '../services/config';

var NoDataError:Error={name:'NODATA', message:'No data sent'};
var DataNotArrayError:Error={name:'DATANOTARRAY', message:'Data is not an array'};
var DataIsEmptyError:Error={name:'DATAISEMPTY', message:'Data array is empty'};

interface collectionRequest extends express.Request {
    collectionObject : any;
}
export function createCollectionObject() {
    return function (request:collectionRequest, response:express.Response, next:Function) {
        var collectionObject=request.body.Data;

        if(!collectionObject) return next(NoDataError);
        if(!Array.isArray(collectionObject)) return next(DataNotArrayError);
        if(!(collectionObject.length>0)) return next(DataIsEmptyError);

        request.collectionObject=collectionObject;
        next();
    }
}