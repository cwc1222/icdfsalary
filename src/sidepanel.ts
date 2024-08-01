import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import type { PaySplit } from './types';

@customElement('cwc-app')
export class App extends LitElement {
  static styles = css`
    .d-none {
      display: none;
    }
  `;

  @property()
  name = 'Somebody';

  @state()
  paysplit?: PaySplit;

  _handlePaysplitGenerating() {}

  async _handleParsePaysplitData() {
    const action = 'PARSE_PAYSPLIT';
    this.paysplit = (await chrome.runtime.sendMessage({action})) as PaySplit;
    this.renderRoot?.querySelector("")?.classList.remove("d-none");
  }

  render() {
    const paysplitHtml = this.paysplit 
      ? html``
      : html``;

    return html`
      <div class="main">
        <div class="actions">
          <button @click="${this._handlePaysplitGenerating}">Generate Paysplit</button>
          <button @click="${this._handleParsePaysplitData}">Parse Paysplit Data</button>
          <button @click="${this._handleParsePaysplitData}">Hide Log Panel</button>
          <button @click="${this._handleParsePaysplitData}">Hide Parsed Panel</button>
        </div>
        <div class="log-panel d-none"></div>
        ${paysplitHtml}
        <div class="parsed-data-panel d-none">

          <div name="year-month"></div>
        </div>
      </div>
    `;
  }
}
