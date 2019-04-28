import { LitElement, customElement, html, css, property } from 'lit-element'
import { buttonStyles } from './styles'

@customElement('snk-update-toast' as any)
export class SnkUpdateToast extends LitElement {
  @property({ type: Boolean, reflect: true })
  open: boolean = false;

  static get styles() {
    return [buttonStyles, css`
      :host {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        position: fixed;
        width: 100%;
        max-width: 384px;
        height: 64px;
        background: #4c4c4c;
        color: #fff;
        z-index: 3;
        margin: auto;
        left: 0;
        right: 0;
        bottom: 0;
        padding: 0 16px;
        box-sizing: border-box;
      }
      .button {
        margin: 0 0 0 auto;
      }
    `]
  }

  render() {
    return html`
      <div>Game update available</div>
      <button class='button' outline @click=${this.reload}>Reload</button>
    `
  }

  async reload() {
    location.reload()
  }
}