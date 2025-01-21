import { copyFileSync } from 'node:fs';
copyFileSync(`./node_modules/@iobroker/ws/dist/esm/socket.io.min.js`, `./public/socket.iob.js`);
