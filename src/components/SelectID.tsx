import React, { Component } from 'react';
import { ThemeProvider, StyledEngineProvider } from '@mui/material/styles';

import {
    SelectID,
    type Connection,
    Theme,
    type IobTheme,
    I18n,
} from '@iobroker/adapter-react-v5';

import type { OAuth2Response } from '@iobroker/socket-client';
import singletonConnection from './singletonConnection';

type OnClose = (
    newId: string | null,
    newObj?: ioBroker.Object | null,
    oldId?: string,
    oldObj?: ioBroker.Object | null,
) => void;

export interface ISelectIDWebComponentProps {
    port?: number | string;
    protocol?: 'http:' | 'https:';
    token?: string;
    host?: string;
    selected?: string;
    onclose: OnClose | string;
    open: string | boolean;
    language: ioBroker.Languages;
    all?: 'true' | 'false';
    theme?: 'light' | 'dark';
    primary?: string;
    secondary?: string;
    paper?: string;
    zindex?: string;
}

interface SelectIDWebComponentState {
    connected: boolean;
    socket: Connection | null;
    theme: IobTheme;
    selected: string;
    opened: boolean;
    all: 'true' | 'false';
    token: string;
}

export class SelectIDWebComponent extends Component<ISelectIDWebComponentProps, SelectIDWebComponentState> {
    private closeCalled = false;

    constructor(props: ISelectIDWebComponentProps) {
        super(props);

        const theme = Theme(props.theme || 'light');
        // modify primary and secondary colors
        if (props.primary) {
            theme.palette.primary.main = props.primary;
        }
        if (props.secondary) {
            theme.palette.secondary.main = props.secondary;
        }
        if (props.paper) {
            theme.palette.background.paper = props.paper;
        }

        this.state = {
            theme,
            selected: props.selected || '',
            socket: null,
            opened: !!props.open,
            connected: false,
            all: props.all || 'false',
            token: props.token || '',
        };
        I18n.setLanguage(props.language || 'en');
    }

    iobOnPropertyChanged = (attr: string, value: string | boolean): void => {
        console.log(`New value ${attr}, ${value}`);
        if (attr === 'open') {
            const _opened = value === true || value === 'true';
            if (_opened !== this.state.opened) {
                if (_opened) {
                    this.closeCalled = false;
                }
                this.setState({ opened: _opened });
            }
        } else if (attr === 'selected' && value !== this.state.selected) {
            this.setState({ selected: value as string });
        } else if (attr === 'all' && value !== this.state.all) {
            this.setState({ all: value as 'true' | 'false' });
        } else if (attr === 'token' && value !== JSON.stringify(this.state.token)) {
            this.setState({ token: (value as string) || '', connected: false }, () => {
                let access_token = '';
                if (this.state.token) {
                    try {
                        const token: OAuth2Response = JSON.parse(this.state.token);
                        access_token = token?.access_token || '';
                    } catch {
                        // ignore
                    }
                }
                this.setState({
                    socket: singletonConnection(
                        {
                            port: this.props.port,
                            host: this.props.host,
                            protocol: this.props.protocol,
                            token: access_token,
                        },
                        (connected: boolean): void => this.setState({ connected }),
                    ),
                });
            });
        }
    };

    componentDidMount(): void {
        (window as any)._iobOnPropertyChanged = this.iobOnPropertyChanged;
        let accessToken = '';
        if (this.state.token) {
            try {
                const token: OAuth2Response = JSON.parse(this.state.token);
                accessToken = token?.access_token || '';
            } catch {
                // ignore
            }
        }

        this.setState({
            socket: singletonConnection(
                {
                    port: this.props.port,
                    host: this.props.host,
                    protocol: this.props.protocol,
                    token: accessToken,
                },
                (connected: boolean): void => this.setState({ connected }),
            ),
        });
    }

    componentWillUnmount(): void {
        if ((window as any)._iobOnPropertyChanged === this.iobOnPropertyChanged) {
            (window as any)._iobOnPropertyChanged = null;
        }
    }

    render(): React.JSX.Element {
        (window as any)._renderText = `[${new Date().toString()}] render`;

        console.log(
            `Render socket: ${!!this.state.socket}, theme: ${!!this.state.theme}, connected: ${this.state.connected}, opened: ${this.state.opened}, selected: ${this.state.selected}, zindex: ${this.props.zindex}`,
        );

        if (!this.state.socket || !this.state.theme) {
            return <div>...</div>;
        }
        if (!this.state.connected) {
            return <div>...</div>;
        }

        return this.state.opened ? (
            <StyledEngineProvider injectFirst>
                <ThemeProvider theme={this.state.theme}>
                    <SelectID
                        zIndex={this.props.zindex ? parseInt(this.props.zindex, 10) : undefined}
                        themeName={this.state.theme.palette.mode}
                        themeType={this.state.theme.palette.mode}
                        allowNonObjects={this.state.all === 'true'}
                        imagePrefix={`${this.props.protocol || window.location.protocol}//${this.props.host || window.location.hostname}:${this.props.port || 8081}`}
                        theme={this.state.theme}
                        selected={this.state.selected}
                        socket={this.state.socket}
                        onClose={(): void => {
                            if (this.closeCalled) {
                                return;
                            }
                            if (
                                typeof this.props.onclose === 'string' &&
                                typeof (window as any)[this.props.onclose] === 'function'
                            ) {
                                (window as any)[this.props.onclose](null);
                                return;
                            }

                            return (this.props.onclose as OnClose)(null);
                        }}
                        onOk={async (selected: string | string[] | undefined): Promise<void> => {
                            this.closeCalled = true;

                            let id: string | undefined;
                            if (selected && typeof selected === 'object') {
                                id = selected[0];
                            } else {
                                id = selected;
                            }
                            if (id) {
                                const newObj = await this.state.socket?.getObject(id);
                                let oldObj: ioBroker.Object | undefined | null;
                                if (this.props.selected) {
                                    oldObj = await this.state.socket?.getObject(this.props.selected);
                                }
                                if (
                                    typeof this.props.onclose === 'string' &&
                                    typeof (window as any)[this.props.onclose] === 'function'
                                ) {
                                    (window as any)[this.props.onclose](id, newObj, this.props.selected, oldObj);
                                    return;
                                }

                                return (this.props.onclose as OnClose)(id, newObj, this.props.selected, oldObj);
                            }

                            if (
                                typeof this.props.onclose === 'string' &&
                                typeof (window as any)[this.props.onclose] === 'function'
                            ) {
                                (window as any)[this.props.onclose](null);
                                return;
                            }

                            return (this.props.onclose as OnClose)(null);
                        }}
                    />
                </ThemeProvider>
            </StyledEngineProvider>
        ) : (
            <div />
        );
    }
}
