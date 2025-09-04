import React from 'react';
import ReactDOM from 'react-dom/client';
import { type ISelectIDWebComponentProps, SelectIDWebComponent } from './components/SelectID';

export const normalizeAttribute = (attribute: string): string => {
    return attribute.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
};

export default class SubscriptionWebComponent extends HTMLElement {
    private componentRoot: ReactDOM.Root | null = null;
    // is called when the element is created
    constructor() {
        super();
        // which allows you to interact with elements within your Shadow DOM using the shadowRoot method of the parent element from your JavaScript code.
        this.attachShadow({ mode: 'open' });
    }

    static get observedAttributes(): string[] {
        return ['open', 'selected', 'all'];
    }

    // eslint-disable-next-line class-methods-use-this
    attributeChangedCallback(name: string, oldValue: string, newValue: string): void {
        console.log(`attributeChangedCallback: ${name}, ${oldValue}, ${newValue}`);
        if ((window as any)._iobOnPropertyChanged) {
            (window as any)._iobOnPropertyChanged(name, newValue);
        }
    }

    // is called after the element is attached to the DOM
    connectedCallback(): void {
        const props = this.getPropsFromAttributes<ISelectIDWebComponentProps>();
        this.componentRoot = ReactDOM.createRoot(this.shadowRoot as ShadowRoot);
        this.componentRoot.render(<SelectIDWebComponent {...props} />);
    }

    disconnectedCallback(): void {
        this.componentRoot?.unmount();
        this.componentRoot = null;
    }

    // converts "should-display-mentions" to "shouldDisplayMentions"
    private getPropsFromAttributes<T>(): T {
        const props: Record<string, string> = {};

        for (let index = 0; index < this.attributes.length; index++) {
            const attribute = this.attributes[index];
            props[normalizeAttribute(attribute.name)] = attribute.value;
        }

        return props as T;
    }
}
