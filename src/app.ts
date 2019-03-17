
import { LitElement, customElement, property, html } from 'lit-element'
import { appStyles, buttonStyles } from './app-styles'
import { GamePopup } from './game-popup'
// @ts-ignore file generated using Emscripten 
import game from './game.js'

import './game-popup'
import './app-update-toast'

@customElement('game-shell' as any)
export class GameShell extends LitElement {
  gameRenderer!: any
  
  @property()
  isGamePlaying = false

  @property()
  isGamePaused = false

  @property()
  isGameOver = false

  @property()
  isNewBestScore = false

  @property()
  gameMode: 0 | 1 | 2 = 1

  @property()
  gameScore: number = 0;

  @property()
  bestGameScores = {
    slow: 0,
    normal: 0,
    fast: 0,
  }

  get currentGameModeName() {
    return ['slow', 'normal', 'fast'][this.gameMode]
  }

  get currentGameModeBestScore() {
    return this.bestGameScores[this.currentGameModeName]
  }

  set currentGameModeBestScore(score) {
    this.bestGameScores[this.currentGameModeName] = score
  }

  static get styles() {
    return [buttonStyles, appStyles]
  }

  render() {

    const pausedPopup = html`
      <game-popup id='game-paused-popup'>
        <div class='popup-title' slot='popup-title'>Game paused</div>
        <button class='button action-button' @click=${this.resumeGame}>Resume</button>
      </game-popup>
      <div id='resume-game-countdown-container' count>
        <div id='resume-game-countdown'>
          <div>3</div>
          <div>2</div>
          <div>1</div>
        </div>
      </div>
    `

    return html`
      <header id='app-bar'>
        <div ?bestscore=${this.isNewBestScore}>
          <div id='header-game-mode-name'>${this.currentGameModeName}</div>
          <span>  
            <svg class='trophy-svg' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' viewBox='0 0 24 24' version='1.1'>
              <path d='M2,2V11C2,12 3,13 4,13H6.2C6.6,15 7.9,16.7 11,17V19.1C8.8,19.3 8,20.4 8,21.7V22H16V21.7C16,20.4 15.2,19.3 13,19.1V17C16.1,16.7 17.4,15 17.8,13H20C21,13 22,12 22,11V2H18C17.1,2 16,3 16,4H8C8,3 6.9,2 6,2H2M4,4H6V6L6,11H4V4M18,4H20V11H18V6L18,4M8,6H16V11.5C16,13.43 15.42,15 12,15C8.59,15 8,13.43 8,11.5V6Z'></path>
            </svg>
          </span>
          <span>Best: ${this.currentGameModeBestScore}</span>
        </div>
        <div id='header-game-score'
            ?hidden=${!this.isGamePlaying}>
          Score: ${this.gameScore}
        </div>
        <button
            class='icon-button'
            @click=${this.pauseGame}
            ?hidden=${!this.isGamePlaying || this.isGamePaused}>
          <svg xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' viewBox='0 0 50 50' version='1.1'>
            <path d='M 12 8 L 12 42 L 22 42 L 22 8 Z M 28 8 L 28 42 L 38 42 L 38 8 Z M 14 10 L 20 10 L 20 40 L 14 40 Z M 30 10 L 36 10 L 36 40 L 30 40 Z '></path>
          </svg>
        </button>
      </header>
      ${this.isGamePaused ? pausedPopup : ''}

      <game-popup id='game-play-popup' open>
        <div class='popup-title' slot='popup-title'>
          ${this.isGameOver ? 'Game over' : 'Snakee'}
        </div>
        <div slot='popup-header'
            ?bestscore=${this.isNewBestScore}
            ?hidden=${!this.isGameOver}>
          ${`Your ${this.isNewBestScore ? 'new highscore' : 'score'}: ${this.gameScore}`}
        </div>
        <div id='game-mode-selector' @change=${this.changeGameMode}>
          <div>
            <input type='radio' id='game-slow' name='game-mode'>
            <label for='game-slow'>Slow</label>
          </div>
          <div>
            <input type='radio' id='game-normal' name='game-mode' checked>
            <label for='game-normal'>Standart</label>
          </div>
          <div>
            <input type='radio' id='game-fast' name='game-mode'>
            <label for='game-fast'>Fast</label>
          </div>
        </div>
        <button class='button action-button' @click=${this.playGame}>Play <span ?hidden=${!this.isGameOver}>Again</span></button>
      </game-popup>

      <canvas id='game-renderer'></canvas>
    `
  }

  constructor() {
    super()
    const best = localStorage.getItem('best-results') as Object | undefined
    if (typeof best === 'string') {
      this.bestGameScores = {
        ...this.bestGameScores,
        ...JSON.parse(best),
      }
    }
  }

  firstUpdated() {
    this.setupGameRenderer()
    window.addEventListener('blur', () => this.pauseGame())
  }

  async setupGameRenderer() {
    const canvas = <HTMLCanvasElement>this.shadowRoot!.getElementById('game-renderer')
    
    const response = await fetch('game.wasm')
    const buffer = await response.arrayBuffer()

    const options = {
      canvas: canvas,
      wasmBinary: buffer,
    }

    this.gameRenderer = game(options).then(() => {
      this.setupResizeObserver(canvas)
      document.documentElement.setAttribute('loaded', '')
    })
  }

  setupResizeObserver(canvas) {

    const setSize = ({ width, height }) => {
      canvas.width = width
      canvas.height = height
      this.gameRenderer.ccall('resizeGame', 'void', ['number', 'number'], [width, height])
    }

    if ('ResizeObserver' in window) {
      // @ts-ignore
      const resizeObserver = new ResizeObserver((entries) =>
        entries.forEach(({ contentRect }) => setSize(contentRect))
      )

      resizeObserver.observe(canvas)
    } else {
      setSize(canvas.getBoundingClientRect())
      window.addEventListener('resize', () => setSize(canvas.getBoundingClientRect()))
    }
  }

  async pauseGame() {
    if (this.isGamePaused)
      return

    this.gameRenderer.ccall('pauseGame', 'void')
    this.isGamePaused = true
    await this.updateComplete
    const popup = <GamePopup>this.shadowRoot!.getElementById('game-paused-popup')
    popup.openPopup()
  }

  async resumeGame() {
    const popup = <GamePopup>this.shadowRoot!.getElementById('game-paused-popup')
    await popup.closePopup()
    const countDownElement = this.shadowRoot!.getElementById('resume-game-countdown')!
    countDownElement.setAttribute('start', '')
    setTimeout(() => {
      this.isGamePaused = false
      countDownElement.removeAttribute('start')
      this.gameRenderer.ccall('resumeGame', 'void')
    }, 3000)
  }

  async playGame() {
    const popup = <GamePopup>this.shadowRoot!.getElementById('game-play-popup')
    await popup.closePopup()
    this.gameScore = 0; 
    this.isGamePlaying = true
    this.isGameOver = false
    this.isGamePaused = false
    this.isNewBestScore = false
    this.gameRenderer.ccall('playGame', 'void')
  }

  async gameOver() {
    this.isGameOver = true
    this.isGamePlaying = false
    this.isGamePaused = false
    const popup = <GamePopup>this.shadowRoot!.getElementById('game-play-popup')
    await popup.openPopup()
    const jsonBest = JSON.stringify(this.bestGameScores)
    localStorage.setItem('best-results', jsonBest)
  }

  changeGameMode(e: Event) {
    const path = e.composedPath() as HTMLElement[]
    const selector = path[2]
    const item = path[1]
    this.gameMode = Array.from(selector.children).indexOf(item) as 0 | 1 | 2
    this.gameRenderer.ccall('setGameMode', 'void', ['number'], [this.gameMode])
  }

  setGameScore(score) {
    this.gameScore = score
    if (this.currentGameModeBestScore < score) {
      this.currentGameModeBestScore = score
      this.isNewBestScore = true
    }
  }
}

if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      const registration = await navigator.serviceWorker.register('/service-worker.js')
      console.log('ServiceWorker registration successful with scope: ', registration.scope)
      
      registration.onupdatefound = () => {
        const appUpdateToast = document.createElement('app-update-toast')
        document.body.appendChild(appUpdateToast)
      }

      navigator.serviceWorker.onmessage = function (evt) {
        console.log('yo')
        var message = JSON.parse(evt.data);

    var isRefresh = message.type === 'refresh';
    var isAsset = message.url.includes('asset');
    var lastETag = localStorage.currentETag;
    console.log(message)
    // [ETag](https://en.wikipedia.org/wiki/HTTP_ETag) header usually contains
    // the hash of the resource so it is a very effective way of check for fresh
    // content.
    var isNew =  lastETag !== message.eTag;

    if (isRefresh && isAsset && isNew) {
      // Escape the first time (when there is no ETag yet)
      if (lastETag) {
        // Inform the user about the update
        console.log('inform about update')
      }
      // For teaching purposes, although this information is in the offline
      // cache and it could be retrieved from the service worker, keeping track
      // of the header in the `localStorage` keeps the implementation simple.
      localStorage.currentETag = message.eTag;
    }
      }
      // navigator.serviceWorker.ready.then((reload))
      // function reload() {
      //   location.reload()
      // }
  
    } catch(err) {
      console.log('ServiceWorker registration failed: ', err)
    }
  })
}