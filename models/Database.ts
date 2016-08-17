/// <reference path="../typings/index.d.ts" />

import * as async from 'async';
import * as mysql from 'mysql';

interface Callback {(err : Error, results: any)}

export var pool=mysql.createPool({
    host: 'localhost',
    user: 'Larry',
    password: 'nalanala',
    database: 'freshair',
    connectionLimit: 10
});

export interface DeviceRecord {
    idDevices : number;
    idAccounts : number;
    ID : string;
    Name : string;
    Bluetooth : string;
    Location : string;
    EncryptKey: string;
    InstallationStatus : string;
    FirmwareVersion : string;
    HardwareVersion : string;
    InstallationTimestamp : string;
    LastConnection : string;
    Logging : boolean;
}
export function GetDevice(ID : string, cb: Callback):void {
    pool.getConnection(function(err,connection){

        if (err) {console.log('connection error:'+err); cb(err,null);return};
        connection.query('SELECT * FROM Devices WHERE ID='+connection.escape(ID),
            function(err,results:DeviceRecord[]){
                connection.release();
                if (err) cb(err, null)
                else cb(null,results);
            })
    });

    }


export interface DataItem {
    TS : string;
    D1 : number;
    D2 : number;
}

export function SaveData(DeviceId:number, Data:DataItem[], callback:Callback):void {
    /*add data to database using asynchronous, serial execution */
    pool.getConnection(function (err, connection) {
        if (err) {console.log('connection error:' + err); callback(err,null); return}

        async.eachSeries(Data, function (item:DataItem, cb) {
                var xx='INSERT INTO DeviceData (D1, D2, TS, idDevices) ' +
                    ' VALUES (' + item.D1 + ',' + item.D2 + ',' + connection.escape(item.TS) + ',' + DeviceId + ')';
                connection.query(xx,function (err, results) {
                        if (err) cb(err); //pass back error
                        cb();
                    })
            },
            function (err) {
                connection.release();
                if (err) callback(err, null)
                else callback(null, null); //pass back final result
            })
    })
}

export interface EventItem {
    TS: string;
    ET: string;
    ED: string;
}

export interface EventRecord {
    idDeviceEvents : number;
    idDevices : number;
    TS : string;
    ET : number;
    ED : string;
}

export interface EventTypeRecord {
    idEventTypes : number;
    EventName: string;
}

var EventTypeError:Error={name:"BADEVENTTYPE", message:"Bad event type"};

export function SaveEvents(DeviceId:number, Data:EventItem[], cb:Callback):void {
    /*add data to database using asynchronous, serial execution */
    pool.getConnection(function (err, connection) {
        if (err) {console.log('connection error:' + err); cb(err,null); return}

        async.eachSeries(Data, function (item:EventItem, cb) {
                connection.query('SELECT idEventTypes FROM EventTypes WHERE EventName='+connection.escape(item.ET),
                    function(err, results:EventTypeRecord[]){
                    if(err) return cb(err,null);
                    if(!results || (results.length!=1)) return cb(EventTypeError, null);

                    var idEventTypes:number = results[0].idEventTypes;

                    connection.query('INSERT INTO DeviceEvents (ET, ED, TS, idDevices) ' +
                        ' VALUES (' + idEventTypes + ',' +
                        connection.escape(item.ED) + ',' +
                        connection.escape(item.TS) + ',' +
                        connection.escape(DeviceId) + ')',
                        function (err, results) {
                            if(err) cb(err);
                            cb(); //pass back item result
                        });
                });
            },
            function (err) {
                connection.release();
                if(err) cb(err,null)
                else cb(null,null); //pass back final result
            });
        });
    }

export function LogDeviceRequest(deviceId : number, deviceRequest : string, callback : Callback){

    pool.getConnection(function(err, connection){
        if(err){console.log('connection error:'+err); callback(err,null); return}

        var timestamp : string = new Date(Date.now()).toISOString();
        connection.query('INSERT INTO DeviceLog (idDevices, LogTS, LogEntry) ' +
        'VALUES('+ deviceId + ',' + connection.escape(timestamp) + ',' + connection.escape(deviceRequest) +')', function(err, results){
            connection.release();
            if(err)callback(err,null)
            else callback(null,null);
        })
    })
}


export interface taskRec{
    TaskName:string;
    TaskData:string;
}

export function GetNextTask(idDevices, callback:Callback){
    pool.getConnection(function(err, connection){
        if(err){console.log('connection error:'+err); callback(err,null); return}
        var qry='SELECT DeviceTasks.idDeviceTasks as ID, TaskTypes.TaskTypeName as TaskName, DeviceTasks.TaskData as TaskData' +
            ' FROM DeviceTasks JOIN TaskTypes ON DeviceTasks.idTaskType = TaskTypes.idTaskTypes' +
            ' WHERE DeviceTasks.idDevices='+idDevices + ' ORDER BY idDeviceTasks';
        connection.query(qry, function(err, results) {
            connection.release();
            if (err)callback(err, null)
            else callback(null, null);
        });
    })
}

export function DeleteDeviceTask(idDeviceTasks, callback:Callback){
    pool.getConnection(function(err, connection){
        if(err){console.log('connection error:'+err); callback(err,null); return}
        var qry='DELETE FROM DeviceTask WHERE DeviceTasks.idDeviceTasks='+idDeviceTasks;
        connection.query(qry, function(err, results) {
            connection.release();
            if (err)callback(err, null)
            else callback(null, null);
        });
    })
}

export function UpdateToken(id, token, callback){}
