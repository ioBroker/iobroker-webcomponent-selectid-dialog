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
function openSelectIdDialog(selected, cb) {
    window._iobOnSelected = function (newId, newObj, oldId, oldObj) {
        if (newId === null) {
            let selectDialog = document.getElementById('iob-select-id');
            if (selectDialog) {
                selectDialog.setAttribute('open', 'false');
            }
        } else {
            console.log('Selected ' + newId);
            cb && cb(newId);
        }
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
        window._iobSelectDialog.setAttribute('all', 'true');
        window._iobSelectDialog.setAttribute('selected', selected);
        window._iobSelectDialog.setAttribute('open', 'true');
        document.body.appendChild(window._iobSelectDialog);
    } else {
        window._iobSelectDialog.setAttribute('all', allowAll ? 'true' : 'false');
        window._iobSelectDialog.setAttribute('selected', $('#node-input-topic').val());
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
    open="true"
></iobroker-select-id>
```

## Changelog
<!--
    ### **WORK IN PROGRESS**
-->
### 1.0.1 (2025-01-21)
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
