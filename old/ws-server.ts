import wsLib from 'ws';
import { Observable, Subscriber } from 'rxjs';
import { Service, Inject } from 'typedi';
import { MsgClient } from '../src/shared/msg-client/msg-client';
import { $FIX_ME } from '../src/shared/types/fix-me.type';
import { IncomingMessage } from 'http';

// hmm...

// const wss = new wsLib.Server({
//   port: 5500,
//   perMessageDeflate: undefined,
// });






// wss.on('connection', (ws) => {
//   console.log('connection...');
//   ws.on('close', (code, reason) => {
//     console.log('ws close...', { code, reason });
//   });
//   ws.on('error', (err) => {
//     console.log('ws error...', { err, errCtor: err.constructor });
//   });
//   ws.on('message', (rawData: wsLib.Data) => {
//     console.log('received message...', rawData);
//     try {
//       const parsedMsg = JSON.parse(String(rawData));
//       console.log('parsed message...', parsedMsg);
//       ws.send(`echo... ${JSON.stringify(parsedMsg)}`)
//     } catch(err) {
//       const failMsg = `SERVER ERR: "${err}" while parsing "${rawData}"`;
//       console.error(failMsg, err);
//       ws.send(failMsg);
//     }
//   });
//   ws.on('open', () => {
//     console.log('ws open...');
//   });
//   ws.on('ping', (data) => {
//     console.log('ws ping...', { raw: data, data: String(data) });
//   });
//   ws.on('pong', (data) => {
//     console.log('ws pong...', { raw: data, data: String(data) });
//   });
//   ws.on('unexpected-response', (req, msg) => {
//     console.log('ws unexpected response...');
//   });
//   ws.on('upgrade', (msg) => {
//     console.log('ws upgrade...');
//   });




//   ws.send('hello friend');
// });
// wss.on('close', (conn: any) => {
//   console.log('close...');
// });
// wss.on('error', (conn) => {
//   console.log('error...');
// });
// wss.on('headers', (conn) => {
//   console.log('headers...');
// });
// wss.on('listening', (conn: any) => {
//   console.log('listening...');
// });

// console.log('hi', wss);