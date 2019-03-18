
import { LitElement, customElement, html, css, property } from 'lit-element'


@customElement('game-popup' as any)

export class GamePopup extends LitElement {
  @property({ type: Boolean, reflect: true })
  open: boolean = false;

  static get styles() {
    return [css`
      :host {
        display: none;
        flex-direction: column;
        position: absolute;
        width: 384px;
        height: fit-content;
        padding-bottom: 24px;
        background: #395174;
        border-bottom: 24px solid #23334a;
        z-index: 3;
        margin: auto;
        left: 0;
        right: 0;
        filter: drop-shadow(0 30px 20px rgba(0,0,0,.24));
        will-change: transform, opacity;
      }
      :host([open]) {
        display: flex;
      }
      #header {
        min-height: 64px;
        border-bottom: 1px solid rgba(255,255,255,.2);
        color: #fff;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding: 24px;
        margin-bottom: 24px;
      }
      ::slotted([slot='popup-title']) {
        font-size: 40px;
      }
      ::slotted([slot='popup-header']) {
        font-size: 20px;
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