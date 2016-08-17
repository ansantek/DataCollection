/**
 * Created by larry on 2/27/15.
 */
///<reference path='../typings/node/node.d.ts'/>
///<reference path='../typings/express/express.d.ts'/>
///<reference path='../typings/mocha/mocha.d.ts'/>


var chai=require('chai');
var agent=require('superagent');
var app=require('../app');

var target='freshair-dev.cloudapp.net:3002';
//var target='localhost:3003'
var local=false;
var port=3002;
var server;

describe('Data Entry testing:', function() {

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

    it('bad url', function(done){
        agent.post('/xx').end(function(err,res){
            chai.expect(err).null;
            chai.expect(res.statusCode).equals(404);
            done();
        })
    });

    it('bad device', function(done){
        var BadDeviceBody={"DeviceID":"11111113", "Data":[{"TS":"2014-3-29", "D1":111, "D2":222}]};
        agent
            .post(target+'/sensor/device/data')
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
            .post(target+'/sensor/device/data')
            .set('Content-Type', 'application/json')
            .send(NoDataBody)
            .end(function(err,res) {
                chai.expect(err).null;
                chai.expect(res.statusCode).equals(400);
                chai.expect(res.body.name).equals('NODATA');
                done();
            });

    });

    it('bad packet: Data is not an array', function(done){
        var NoArrayBody={DeviceID:"11111112", Data:{}};
        agent
            .post(target+'/sensor/device/data')
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
            .post(target+'/sensor/device/data')
            .set('Content-Type', 'application/json')
            .send(DataIsEmptyBody)
            .end(function(err,res) {
                chai.expect(err).null;
                chai.expect(res.statusCode).equals(400);
                chai.expect(res.body.name).equals('DATAISEMPTY');
                done();
            });

    });

     it('bad packet: missing Data field', function(done){
     var MissingDataBody={DeviceID:"11111112", Data:[{TS:"2014-3-29"}]};
     agent
     .post(target+'/sensor/device/data')
     .set('Content-Type', 'application/json')
     .send(MissingDataBody)
     .end(function(err,res) {
        chai.expect(err).null;
        chai.expect(res.statusCode).equals(400);
        chai.expect(res.body.name).equals('FIELDMISSING');
        done();
     });

     });
    it('bad packet: missing data field D2', function(done){
        var MissingDataFieldD2={DeviceID:"11111112", Data:[{TS:"2014-3-29", D1:111}]};
        agent
            .post(target+'/sensor/device/data')
            .set('Content-Type', 'application/json')
            .send(MissingDataFieldD2)
            .end(function(err,res) {
                chai.expect(err).null;
                chai.expect(res.statusCode).equals(400);
                chai.expect(res.body.name).equals('FIELDMISSING');
                done();
            });

    })

    it('bad packet: missing data field D1', function(done){
        var MissingDataFieldD1={DeviceID:"11111112", Data:[{TS:"2014-3-29", D2:111}]};
        agent
            .post(target+'/sensor/device/data')
            .set('Content-Type', 'application/json')
            .send(MissingDataFieldD1)
            .end(function(err,res) {
                chai.expect(err).null;
                chai.expect(res.statusCode).equals(400);
                chai.expect(res.body.name).equals('FIELDMISSING');
                done();
            });

    });

    it('bad packet: missing data field TS', function(done){
        var MissingDataFieldTS={DeviceID:"11111112", Data:[{D1:222, D2:111}]};
        agent
            .post(target+'/sensor/device/data')
            .set('Content-Type', 'application/json')
            .send(MissingDataFieldTS)
            .end(function(err,res) {
                chai.expect(err).null;
                chai.expect(res.statusCode).equals(400);
                chai.expect(res.body.name).equals('FIELDMISSING');
                done();
            });

    })

    it('bad packet: bad timestamp field', function(done){
        var BadTimestampField={DeviceID:"11111112", Data:[{TS:"xxx", D1:222, D2:111}]};
        agent
            .post(target+'/sensor/device/data')
            .set('Content-Type', 'application/json')
            .send(BadTimestampField)
            .end(function(err,res) {
                chai.expect(err).null;
                chai.expect(res.statusCode).equals(400);
                chai.expect(res.body.name).equals('BADTIMESTAMP');
                done();
            });

    });

    it('good data', function(done){
        var GoodData={DeviceID:"11111112", Data:[{TS:"2014-3-1", D1:111, D2:222}, {TS:"1/2/2014", D1:444, D2:555}]};
        agent
            .post(target+'/sensor/device/data')
            .set('Content-Type', 'application/json')
            .send(GoodData)
            .end(function(err,res) {
                chai.expect(err).null;
                chai.expect(res.statusCode).equals(200);
                done();
            });

    })
})