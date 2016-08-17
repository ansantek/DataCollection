/**
 * Created by larry on 11/26/14.
 */
///<reference path='../typings/node/node.d.ts'/>
///<reference path='../typings/express/express.d.ts'/>
///<reference path='../typings/mocha/mocha.d.ts'/>

var chai=require('chai');
var sinon=require('sinon');
var agent=require('superagent');
var app=require('../app');

var target='freshair-dev.cloudapp.net:3002';
var port=3002;
var local=false;
var server;

describe('Event Entry testing:', function() {

    before(function(done){
        if(local) {server=app.listen(port,function(){
            console.log('test started on port:'+ port);
        })}
        done();
    })

    after(function(done){
        if(local) server.close();
        done();
    })

    it('bad device', function(done){
        var BadDeviceBody={"DeviceID":"11112", "Data":[{"TS":"2014-3-29", "D1":111, "D2":222}]};
        agent
            .post(target+'/sensor/device/event')
            .set('Content-Type', 'application/json')
            .send(BadDeviceBody)
            .end(function(err,res){
                chai.expect(err).null;
                chai.expect(res.statusCode).equals(400);
                chai.expect(res.body.name).equals('DEVICEUNDEF');
                done();
            });
    });

    it('bad packet: Data is missing', function(done){
        var NoDataBody={DeviceID:"11111112"};
        agent
            .post(target+'/sensor/device/event')
            .set('Content-Type', 'application/json')
            .send(NoDataBody)
            .end(function(err,res) {
                chai.expect(err).null;
                chai.expect(res.statusCode).equals(400);
                chai.expect(res.body.name).equals('NODATA')
                done();
            });

    });

    it('bad packet: Data is not an array', function(done){
        var NoArrayBody={DeviceID:"11111112", Data:{}};
        agent
            .post(target+'/sensor/device/event')
            .set('Content-Type', 'application/json')
            .send(NoArrayBody)
            .end(function(err,res) {
                chai.expect(err).null;
                chai.expect(res.statusCode).equals(400);
                chai.expect(res.body.name).equals('DATANOTARRAY');
                done();
            });

    });

    it('bad packet: Data is empty', function(done){
        var DataIsEmptyBody={DeviceID:"11111112", Data:[]};
        agent
            .post(target+'/sensor/device/event')
            .set('Content-Type', 'application/json')
            .send(DataIsEmptyBody)
            .end(function(err,res) {
                chai.expect(err).null;
                chai.expect(res.statusCode).equals(400);
                chai.expect(res.body.name).equals('DATAISEMPTY');
                done();
            });

    });

    it('bad packet: missing data field ED', function(done){
        var MissingFieldEDBody={DeviceID:"11111112", Data:[{TS:"2014-3-29",ET:"START"}]};
        agent
            .post(target+'/sensor/device/event')
            .set('Content-Type', 'application/json')
            .send(MissingFieldEDBody)
            .end(function(err,res) {
                chai.expect(err).null;
                chai.expect(res.statusCode).equals(400);
                chai.expect(res.body.name).equals('FIELDMISSING');
                done();
            });

    })

    it('bad packet: missing data field ET', function(done){
        var MissingFieldETBody={DeviceID:"11111112", Data:[{TS:"2014-3-29",ED:"xxx"}]};
        agent
            .post(target+'/sensor/device/event')
            .set('Content-Type', 'application/json')
            .send(MissingFieldETBody)
            .end(function(err,res) {
                chai.expect(err).null;
                chai.expect(res.statusCode).equals(400);
                chai.expect(res.body.name).equals('FIELDMISSING');
                done();
            });

    });

    it('bad packet: missing data field TS', function(done){
        var MissingFieldTSBody={DeviceID:"11111112", Data:[{ET:"START",ED:"xxx"}]};
        agent
            .post(target+'/sensor/device/event')
            .set('Content-Type', 'application/json')
            .send(MissingFieldTSBody)
            .end(function(err,res) {
                chai.expect(err).null;
                chai.expect(res.statusCode).equals(400);
                chai.expect(res.body.name).equals('FIELDMISSING');
                done();
            });

    })

    it('bad packet: bad timestamp field', function(done){
        var BadTimestampBody={DeviceID:"11111112", Data:[{TS:"aaa",ET:"START",ED:"xxx"}]};
        agent
            .post(target+'/sensor/device/event')
            .set('Content-Type', 'application/json')
            .send(BadTimestampBody)
            .end(function(err,res) {
                chai.expect(err).null;
                chai.expect(res.statusCode).equals(400);
                chai.expect(res.body.name).equals('BADTIMESTAMP');
                done();
            });

    });

    it('good packet', function(done){
        var GoodData={DeviceID:"11111112", Data:[{TS:"2014-3-1", ET:"START", ED:"222"}, {TS:"1/2/2014", ET:"STOP", ED:"555"}]};
        agent
            .post(target+'/sensor/device/event')
            .set('Content-Type', 'application/json')
            .send(GoodData)
            .end(function(err,res) {
                chai.expect(err).null;
                chai.expect(res.statusCode).equals(200);
                done();
            });

    })
})