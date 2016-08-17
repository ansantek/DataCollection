/// <reference path="../typings/index.d.ts" />

import * as fs from 'fs';
import * as path from 'path';

export interface configType {
    devicetokensecret?:string;
    tokenexpiration?:number;
    host?:string;
    user?:string;
    password?:string;
    database?:string;
    connectionLimit?:number;
}

var ConfigObject : configType;

//configuration file consists of multiple lines of configuration definitions.  A configuration
//definition looks like: name=value

export function getConfigObject() : configType {
    if(!ConfigObject){
        ConfigObject={};
        var filePath=path.resolve(__dirname,'..')+'/DataCollection.cfg';
        var configFile=fs.readFileSync(filePath,{encoding:'utf8'});
        var configStrings=configFile.split('\n');
        for (var i=0; i<configStrings.length; i++){
            if(configStrings[i]!=''){
                var definition=configStrings[i].split('=');
                ConfigObject[definition[0]]=definition[1];
            }
        }
    }
    return ConfigObject;
}