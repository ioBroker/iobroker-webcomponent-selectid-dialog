import { Connection, PROGRESS, type ConnectionProps, I18n } from '@iobroker/adapter-react-v5';

import langEn from '@iobroker/adapter-react-v5/i18n/en.json';
import langDe from '@iobroker/adapter-react-v5/i18n/de.json';
import langRu from '@iobroker/adapter-react-v5/i18n/ru.json';
import langPt from '@iobroker/adapter-react-v5/i18n/pt.json';
import langNl from '@iobroker/adapter-react-v5/i18n/nl.json';
import langFr from '@iobroker/adapter-react-v5/i18n/fr.json';
import langIt from '@iobroker/adapter-react-v5/i18n/it.json';
import langEs from '@iobroker/adapter-react-v5/i18n/es.json';
import langPl from '@iobroker/adapter-react-v5/i18n/pl.json';
import langUk from '@iobroker/adapter-react-v5/i18n/uk.json';
import langZhCn from '@iobroker/adapter-react-v5/i18n/zh-cn.json';

if (window.socketUrl) {
    if (window.socketUrl.startsWith(':')) {
        window.socketUrl = `${window.location.protocol}//${window.location.hostname}${window.socketUrl}`;
    } else if (!window.socketUrl.startsWith('http://') && !window.socketUrl.startsWith('https://')) {
        window.socketUrl = `${window.location.protocol}//${window.socketUrl}`;
    }
}

let connection: Connection;
let onConnectionChanged: ((connected: boolean) => void) | null = null;
export default function singletonConnection(
    props: ConnectionProps,
    newOnConnectionChanged: (connected: boolean) => void,
): Connection {
    onConnectionChanged = newOnConnectionChanged;
    if (connection) {
        if (connection.isConnected()) {
            onConnectionChanged(true);
        }
        return connection;
    }

    // init translations
    const translations: Record<ioBroker.Languages, Record<string, string>> = {
        en: langEn,
        de: langDe,
        ru: langRu,
        pt: langPt,
        nl: langNl,
        fr: langFr,
        it: langIt,
        es: langEs,
        pl: langPl,
        uk: langUk,
        'zh-cn': langZhCn,
    };
    I18n.setTranslations(translations);

    if (!props.protocol || !props.host || !props.port) {
        if (window.socketUrl) {
            if (window.socketUrl.startsWith('https')) {
                props.protocol = 'https:';
            } else {
                props.protocol = 'http:';
            }
            const [host, port] = window.socketUrl.split('/')[2].split(':');
            props.port = port || 80;
            props.host = host;
        }
    }

    connection = new Connection({
        ...props,
        protocol: props.protocol || window.location.protocol,
        host: props.host || window.location.hostname,
        port: props.port || 8081,
        name: 'select-web-component',
        // @ts-expect-error
        token: props.token,
        onProgress: (progress: PROGRESS) => {
            if (progress === PROGRESS.CONNECTING) {
                onConnectionChanged?.(false);
            } else if (progress === PROGRESS.READY) {
                onConnectionChanged?.(true);
            } else {
                onConnectionChanged?.(true);
            }
        },
        onReady: (/* objects, scripts */) => {},
        // Remove this line after adapter-react-v5 version 7.4.10 is released
        onLog: (_message: any) => {
            // ignore
        },
    });

    return connection;
}
