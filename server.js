import express from 'express';
import mongoose from 'mongoose';
import path from 'path';

import {APP_PORT, DB_URL } from './config'
import errorHandler from './middlewares/errorHandler';
import routes from './routes';


const app= express();

// Db Connection
mongoose.connect(DB_URL,{useNewUrlParser:true, useUnifiedTopology: true, useFindAndModify: false});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection error'));
db.once('open',()=>{
    console.log('Db Connected....');
});

global.rootDir = path.resolve(__dirname);  //rootDIr will be avabilable globally

app.use(express.urlencoded({extended:false}));

app.use(express.json())         //convert req to json

app.use('/api',routes);         // Router

app.use(errorHandler);          //Global errorhandler

app.listen(APP_PORT,()=>console.log(`Server is running on ${APP_PORT}`))