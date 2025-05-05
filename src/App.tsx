import React from 'react';
import { SelectIDWebComponent } from './components/SelectID';

export default function App(): React.JSX.Element {
    return (
        <SelectIDWebComponent
            language="de"
            open
            primary="#EE2233"
            secondary="#00FF00"
            theme="dark"
            onclose={id => {
                if (id === null) {
                    // close dialog
                    console.log('Close dialog');
                } else {
                    console.log(`Selected ${id}`);
                }
            }}
            port="8081"
        />
    );
}
