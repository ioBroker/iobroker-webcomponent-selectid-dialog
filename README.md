# Web component to select objects from ioBroker (admin or web)
This web component enables the implementation of the Select-ID Dialog for an ioBroker instance.
It can operate with admin or web instances without requiring authentication. If admin/web has authentication enabled, there is no solution for that yet.
It can work with admin or web instances only without authentication currently.

Please note that mixed connections from an HTTP page to a WSS server and vice versa (from HTTPS to WS) do not work in most browsers.

Before creating the dialog, the socket file must be loaded. You can find the code [here](https://github.com/ioBroker/ioBroker.ws.client/tree/main/dist/esm).

However, it is always better to load the client part from the ioBroker server.
```html
<script src="http://iobrokerIP:8081/lib/js/socket.io.js"></script>
<!-- or for web server -->
<script src="http://iobrokerIP:8082/lib/js/socket.io.js"></script>

<!-- Load SelectID web component -->
<script src="./iobrokerSelectId.umd.js"></script>
```

In this scenario, you can ensure that the loaded version is compatible with the backend.
For example, the ioBroker web server might use socket.io or a pure web socket connection.
Therefore, you must ensure that the correct client library is loaded.

How to use with Dynamic creation:
```js
function openSelectIdDialog(selected, cb, allowAll) {
    window._iobOnSelected = function (newId/*, newObj, oldId, oldObj */) {
        let selectDialog = document.getElementById('iob-select-id');
        if (selectDialog) {
            selectDialog.setAttribute('open', 'false');
        }

        console.log('Selected ' + newId);
        cb && cb(newId);
    };

    if (!window._iobSelectDialog) {
        window._iobSelectDialog = document.createElement('iobroker-select-id');
        window._iobSelectDialog.setAttribute('id', 'iob-select-id');
        // Place here the real port of ioBroker admin or web instance
        window._iobSelectDialog.setAttribute('port', window.location.port);
        // Place here the real port of ioBroker admin or web instance
        window._iobSelectDialog.setAttribute('host', window.location.host);
        // Place here the real protocol http: or https:
        window._iobSelectDialog.setAttribute('protocol', window.location.protocol);
        window._iobSelectDialog.setAttribute('language', 'en');
        // This is a name of a global function
        window._iobSelectDialog.setAttribute('onclose', '_iobOnSelected');
        window._iobSelectDialog.setAttribute('primary', '#AD1625');
        window._iobSelectDialog.setAttribute('secondary', 'rgb(228, 145, 145)');
        window._iobSelectDialog.setAttribute('paper', 'rgb(243, 243, 243)');
        window._iobSelectDialog.setAttribute('all', allowAll ? 'true' : 'false');
        window._iobSelectDialog.setAttribute('selected', selected || '');
        window._iobSelectDialog.setAttribute('token', token || '');
        window._iobSelectDialog.setAttribute('open', 'true');
        document.body.appendChild(window._iobSelectDialog);
    } else {
        window._iobSelectDialog.setAttribute('all', allowAll ? 'true' : 'false');
        window._iobSelectDialog.setAttribute('selected', selected || '');
        window._iobSelectDialog.setAttribute('token', token || '');
        window._iobSelectDialog.setAttribute('open', 'true');
    }
}
openSelectIdDialog('', id => {
    
});
```

Or static:
```html
<iobroker-select-id
    port="8081"
    host="localhost"
    protocol="http:"
    language="en"
    onclose="_iobOnSelected"
    all="true"
    selected="system.adapter.admin.0"
    token="{\"access_token\":\"AAA\"}" // optional
    open="true"
></iobroker-select-id>
```

There is also a wrapper included in the file `selectIdHelper.js`, wich lazy loads the ESM module
and provides a promise to open the UI:
```js
  import openSelectIdDialog from '@iobroker/webcomponent-selectid-dialog/dist/selectIdHelper.js'
  const id = await openSelectIdDialog({
      port: 8089,
      host: '1.2.3.4',
      protocol: 'http:',
      language: 'en',
      allowAll: true,
      selected: '',
      primary: '#AD1625',
      secondary: 'rgb(228, 145, 145)',
      paper: 'rgb(243, 243, 243)',
      token: '{ "access_token": "AAA" }', // optional
  });
```

## Changelog
<!--
    ### **WORK IN PROGRESS**
-->
### 1.0.12 (2025-09-04)
- (@GermanBluefox) Destroy dialog after close if created dynamically

### 1.0.10 (2025-06-21)
- (@GermanBluefox) Allowed setting zIndex for the dialog

### 1.0.8 (2025-05-05)
- (@GermanBluefox) Corrected error if the token was not provided

### 1.0.7 (2025-03-25)
- (@GermanBluefox) Allowed authentication with token

### 1.0.4 (2025-03-23)
- (@GermanBluefox) Updated packages

### 1.0.3 (2025-01-21)
- (@jogibear9988) Added lazy loader

### 1.0.2 (2025-01-21)
- (@GermanBluefox) Initial commit

## License
The MIT License (MIT)

Copyright (c) 2025 Denis Haev <dogafox@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
