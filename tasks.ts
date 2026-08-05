import { copyFileSync } from 'node:fs';
copyFileSync(`./node_modules/@iobroker/ws/build/esm/socket.io.min.js`, `./public/socket.iob.js`);
