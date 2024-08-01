/// <reference types="vite/client" />

declare module '*?base64' {
  const src: string;
  export default src;
}

declare global {
  import { App } from './sidepanel';

  interface HTMLElementTagNameMap {
    'cwc-app': App;
  }
}
