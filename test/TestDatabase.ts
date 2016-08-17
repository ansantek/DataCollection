/**
 * Created by larry on 1/25/15.
 */
///<reference path='../typings/node/node.d.ts'/>
///<reference path='../typings/express/express.d.ts'/>
///<reference path='../typings/mysql/mysql.d.ts'/>
///<reference path='../typings/mocha/mocha.d.ts'/>


var chai=require('chai');
var sinon=require('sinon');
var agent=require('superagent');

import Database = require('../models/Database');

describe('GetDevice testing:', function() {
    before(function(done){
        Database.pool.getConnection(function (err, connection) {
            chai.expect(err).null;
            connection.query('DELETE FROM Devices WHERE ID="11111111"',
                function (err, results) {
                    chai.expect(err).null;
                    connection.query('INSERT INTO Devices (idAccounts, ID, Name,' +
                        'Bluetooth, Location, EncryptKey, InstallationStatus, FirmwareVersion, ' +
                        'HardwareVersion, InstallationTimestamp, LastConnection) ' +
                        'VALUES (2, "11111111", "TestDevice", "", "", "", "Installing", "", "","","")',
                        function (err, results) {
                            connection.release();
                            chai.expect(err).null;
                            done();
                        });
                });
        });
    });

    it('Testing for undefined device', function(done) {
        Database.GetDevice('YYYYYYYYYYYYYY', function (err, results) {
            chai.expect(err).null;
            chai.expect(results.length).equals(0);
            done();
        });
    });
    it('Testing for known device', function(done){
        Database.GetDevice('11111111', function (err, results) {
            chai.expect(err).null;
            chai.expect(results.length).equals(1);
            var rec:Database.DeviceRecord=results[0];
            chai.expect(rec.idAccounts).equals(2);
            chai.expect(rec.Name).equals("TestDevice");
            chai.expect(rec.ID).not.null;
            chai.expect(rec.Bluetooth).not.null;
            chai.expect(rec.Location).not.null;
            chai.expect(rec.EncryptKey).not.null;
            chai.expect(rec.InstallationStatus).not.null;
            chai.expect(rec.FirmwareVersion).not.null;
            chai.expect(rec.HardwareVersion).not.null;
            chai.expect(rec.InstallationTimestamp).not.null;
            chai.expect(rec.LastConnection).not.null;
            done();
        })
    })
})

describe('SaveData testing',function(){
    var idDevices : number;
    before(function(done){
        Database.pool.getConnection(function (err, connection) {
            chai.expect(err).null;
            connection.query('DELETE FROM DeviceData WHERE idDevices = (SELECT idDevices FROM Devices WHERE ID="11111111")',
                function(err,results){
                    connection.release();
                    chai.expect(err).null;
                    Database.GetDevice('11111111',function(err,results:Database.DeviceRecord[]){
                        chai.expect(err).null;
                        chai.expect(results).not.null;
                        chai.expect(results.length).equal(1);
                        idDevices=results[0].idDevices;
                        done()
                    });
                });
                });
    });

    it('Testing for data save', function(done){
        var TestData : Database.DataItem[] = [{TS:"2015-03-01", D1:111, D2:222}];
        Database.SaveData(idDevices,TestData,function(err,results){
            chai.expect(err).null;
            Database.pool.getConnection(function(err, connection){
                chai.expect(err).null;
                connection.query('SELECT * FROM DeviceData WHERE idDevices='+idDevices, function(err, results:Database.DataItem[]){
                    chai.expect(err).null;
                    chai.expect(results).not.null;
                    chai.expect(results.length).equal(1);
                    chai.expect(results[0].D1).equal(111);
                    chai.expect(results[0].D2).equal(222);
                    done();
                })
            })
        })
    })
})

describe('SaveEvents testing',function() {
    var idDevices:number;
    before(function (done) {
        Database.pool.getConnection(function (err, connection) {
            chai.expect(err).null;
            connection.query('DELETE FROM DeviceEvents WHERE idDevices = (SELECT idDevices FROM Devices WHERE ID="11111111")',
                function (err, results) {
                    connection.release();
                    chai.expect(err).null;
                    Database.GetDevice('11111111', function (err, results:Database.DeviceRecord[]) {
                        chai.expect(err).null;
                        chai.expect(results).not.null;
                        chai.expect(results.length).equal(1);
                        idDevices = results[0].idDevices;
                        done()
                    });
                });
        });
    });
    it('Testing for events save', function (done) {
        var TestData:Database.EventItem[] = [{TS: "2015-03-01", ET: "START", ED: "XXX"}];
        Database.SaveEvents(idDevices, TestData, function (err, results) {
            chai.expect(err).null;
            Database.pool.getConnection(function (err, connection) {
                chai.expect(err).null;
                connection.query('SELECT DE.ED AS ED, ET.EventName AS ET FROM DeviceEvents DE ' +
                    'JOIN EventTypes ET ON DE.ET = ET.idEventTypes WHERE idDevices=' +
                idDevices,
                    function (err, results:Database.EventItem[]) {
                    chai.expect(err).null;
                    chai.expect(results).not.null;
                    chai.expect(results.length).equal(1);
                    chai.expect(results[0].ED).equal("XXX");
                    chai.expect(results[0].ET).equal("START");
                    done();
                })
            })
        })
    })
})

describe('LogDeviceRequest testing',function() {
    before(function(done){
        var idDevices:number;
        Database.GetDevice('11111111',function(err, results){
            chai.expect(err).null;
            idDevices=results[0].idDevices;
            Database.pool.getConnection(function(err, connection) {
                chai.expect(err).null;
                connection.query('DELETE FROM DeviceLog WHERE idDevices='+idDevices, function (err, results) {
                    connection.release();
                    chai.expect(err).null;
                    done();
                });
            });
        })
    });

    it('Testing logging', function(done){
        var idDevices:number;
        Database.GetDevice('11111111', function(err, results){
            chai.expect(err).null;
            idDevices=results[0].idDevices;

            Database.LogDeviceRequest(idDevices, 'xxxx', function(err, results){
                chai.expect(err).null;

                Database.pool.getConnection(function(err, connection){
                    chai.expect(err).null;
                    connection.query('SELECT * FROM DeviceLog WHERE idDevices='+idDevices, function(err, results){
                        chai.expect(err).null;
                        chai.expect(results).not.null;
                        chai.expect(results.length).equals(1);
                        chai.expect(results[0].LogEntry).not.null;
                        chai.expect(results[0].LogEntry).equals('xxxx');
                        done();
                    });
                });
            });

        });
    });
})