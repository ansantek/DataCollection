/// <reference path="./typings/index.d.ts" />

//standard middleware
import * as express      from "express";
import * as logger       from "morgan";
import * as cookieParser from "cookie-parser";
import * as bodyParser   from "body-parser";

//application specific middleware
import {validateDevice}         from './middleware/validateDevice';
import {decryptPacket}          from './middleware/decryptPacket';
import {createCollectionObject} from './middleware/createCollectionObject';
import {validateDataRecords}    from './middleware/validateDataRecords';
import {validateEventRecords}   from './middleware/validateEventRecords';
import {logRequest}             from'./middleware/logDevice';
import {getConfigObject}        from './services/config';

//application routes
import {save as DataSave}       from './controllers/collectData';
import {save as EventsSave}     from './controllers/collectEvents';



var app = express();
var port = 3002;  //listening port

//set up configuration object before starting processing
var configObject=getConfigObject();

//define middleware sequence
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(cookieParser());
app.use(validateDevice());
app.use(decryptPacket());
app.use(logRequest());
app.use(createCollectionObject());
app.use('/sensor/device/data',validateDataRecords());
app.use('/sensor/device/event',validateEventRecords());


//define routes
app.post('/sensor/device/data',DataSave);
app.post('/sensor/device/event',EventsSave);

//handle errors
app.use(function(err,req:express.Request,res:express.Response,next){
    console.log(err);
    res.status( 400).send(err);
});

if (!module.parent) {
    app.listen(port, function () {
        console.log("Express server listening on port %d",port);
    });

};

export = app;
