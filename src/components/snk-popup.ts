import { LitElement, customElement, html, css, property } from 'lit-element'

@customElement('snk-popup' as any)
export class SnkPopup extends LitElement {
  @property({ type: Boolean, reflect: true })
  open: boolean = false;

  static get styles() {
    return [css`
      :host {
        display: none;
        flex-direction: column;
        position: absolute;
        width: 100%;
        max-width: 384px;
        height: 321px;
        height: fit-content !important;
        box-sizing: border-box;
        padding-bottom: 24px;
        background: #395174;
        border-bottom: 24px solid #23334a;
        z-index: 3;
        margin: auto;
        left: 0;
        right: 0;
        bottom: 0;
        top: 0;
        filter: drop-shadow(0 30px 20px rgba(0,0,0,.24));
        will-change: transform, opacity;
        align-items: center;
      }
      :host([open]) {
        display: flex;
      }
      #header {
        width: 100%;
        box-sizing: border-box;
        min-height: 112px;
        border-bottom: 1px solid rgba(255,255,255,.2);
        color: #fff;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding: 24px;
        margin-bottom: 16px;
      }
    `]
  }

  render() {
    return html`
      <div id='header'>
        <slot name='popup-title'></slot>
        <slot name='popup-header'></slot>
      </div>
      <slot></slot>
    `
  }

  async transition(state) {
    const timing: AnimationEffectTiming = state ? {
      duration: 185,
      easing: 'cubic-bezier(0.4, 0.0, 1, 1)',
      fill: 'both',
    } : {
      duration: 125,
      easing: 'cubic-bezier(0.0, 0.0, 0.2, 1)',
      fill: 'both',
      direction: 'reverse',
    }
    await new Promise((resolve) => {
      if ('animate' in this) {
        this.animate({
          transform: ['translateY(25px)', 'translateY(0)'],
          opacity: [0, 1],
        }, timing).onfinish = () => resolve()
      } else {
        resolve()
      }
    })
  }
  
  async openPopup() {
    this.open = true;
    await this.transition(true)
  }

  async closePopup() {
    await this.transition(false)
    this.open = false
  }
}