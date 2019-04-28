
import { LitElement, customElement, property, html } from 'lit-element'
import { shellStyles, buttonStyles } from './styles'
import { SnkPopup } from './snk-popup'
import wasmGame from '../wasm-game.js'

type GameSpeedType = 0 | 1 | 2

@customElement('snk-shell' as any)
export class SnkShell extends LitElement {
  game!: any
  
  @property()
  isGamePlaying: boolean = false

  @property()
  isGamePaused = false

  @property()
  isGameOver = false

  @property()
  isNewBestScore = false

  @property()
  gameSpeed: GameSpeedType = 1

  @property()
  gameScore: number = 0;

  @property()
  bestGameScores = {
    slow: 0,
    normal: 0,
    fast: 0,
  }

  get currentGameSpeedName() {
    return ['slow', 'normal', 'fast'][this.gameSpeed]
  }

  get currentGameSpeedBestScore() {
    return this.bestGameScores[this.currentGameSpeedName]
  }

  set currentGameSpeedBestScore(score) {
    this.bestGameScores[this.currentGameSpeedName] = score
  }

  static get styles() {
    return [buttonStyles, shellStyles]
  }

  render() {
    const pausedPopup = html`
      <snk-popup id='game-paused-popup'>
        <div class='popup-title' slot='popup-title'>Game paused</div>
        <button class='button action-button' @click=${this.resumeGame}>Resume</button>
      </snk-popup>
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
        <div ?bestscore=${this.isNewBestScore} id='score-info'>
          <div id='header-game-speed-name'>${this.currentGameSpeedName}</div>
          <span>  
            <svg class='trophy-svg' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' viewBox='0 0 24 24' version='1.1'>
              <path d='M2,2V11C2,12 3,13 4,13H6.2C6.6,15 7.9,16.7 11,17V19.1C8.8,19.3 8,20.4 8,21.7V22H16V21.7C16,20.4 15.2,19.3 13,19.1V17C16.1,16.7 17.4,15 17.8,13H20C21,13 22,12 22,11V2H18C17.1,2 16,3 16,4H8C8,3 6.9,2 6,2H2M4,4H6V6L6,11H4V4M18,4H20V11H18V6L18,4M8,6H16V11.5C16,13.43 15.42,15 12,15C8.59,15 8,13.43 8,11.5V6Z'></path>
            </svg>
          </span>
          <span>Best: ${this.currentGameSpeedBestScore}</span>
        </div>
        <div id='header-game-score'
            ?hidden=${!this.isGamePlaying}>
          Score: ${this.gameScore}
        </div>
        <button
            title='Pause game'
            class='icon-button pause'
            @click=${this.pauseGame}
            ?hidden=${!this.isGamePlaying || this.isGamePaused}>
          <svg xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' viewBox='0 0 50 50' version='1.1'>
            <path d='M 12 8 L 12 42 L 22 42 L 22 8 Z M 28 8 L 28 42 L 38 42 L 38 8 Z M 14 10 L 20 10 L 20 40 L 14 40 Z M 30 10 L 36 10 L 36 40 L 30 40 Z '></path>
          </svg>
        </button>
        <button
            class='icon-button'
            @click=${this.pauseGame}>
          <a href='https://github.com/minht11/Snake-game' target='_blank' rel='noreferrer' title='Github source'>
            <svg xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' viewBox='0 0 18 18' version='1.1'>
              <path d='M 9 0 C 4.027344 0 0 4.027344 0 9 C 0 12.980469 2.574219 16.347656 6.152344 17.539062 C 6.605469 17.617188 6.773438 17.347656 6.773438 17.113281 C 6.773438 16.898438 6.761719 16.191406 6.761719 15.433594 C 4.5 15.851562 3.914062 14.882812 3.734375 14.378906 C 3.632812 14.117188 3.195312 13.320312 2.8125 13.105469 C 2.496094 12.9375 2.046875 12.519531 2.800781 12.511719 C 3.511719 12.496094 4.015625 13.164062 4.183594 13.433594 C 4.996094 14.792969 6.289062 14.410156 6.804688 14.175781 C 6.886719 13.589844 7.121094 13.195312 7.378906 12.972656 C 5.378906 12.746094 3.285156 11.972656 3.285156 8.527344 C 3.285156 7.550781 3.632812 6.738281 4.207031 6.109375 C 4.117188 5.882812 3.800781 4.960938 4.296875 3.722656 C 4.296875 3.722656 5.050781 3.488281 6.773438 4.644531 C 7.492188 4.445312 8.257812 4.339844 9.023438 4.339844 C 9.789062 4.339844 10.550781 4.445312 11.273438 4.644531 C 12.992188 3.476562 13.746094 3.722656 13.746094 3.722656 C 14.242188 4.960938 13.925781 5.882812 13.835938 6.109375 C 14.410156 6.738281 14.761719 7.539062 14.761719 8.527344 C 14.761719 11.980469 12.65625 12.746094 10.652344 12.972656 C 10.980469 13.253906 11.261719 13.792969 11.261719 14.636719 C 11.261719 15.839844 11.25 16.808594 11.25 17.113281 C 11.25 17.347656 11.417969 17.628906 11.867188 17.539062 C 15.425781 16.347656 18 12.972656 18 9 C 18 4.027344 13.972656 0 9 0 Z M 9 0 '></path>
            </svg>
          </a>
        </button>
      </header>
      ${this.isGamePaused ? pausedPopup : ''}

      <snk-popup id='game-play-popup' open>
        <div class='popup-title' slot='popup-title'>
          ${this.isGameOver ? 'Game over' : 'Snakee'}
        </div>
        <div slot='popup-header'
            ?bestscore=${this.isNewBestScore}
            ?hidden=${!this.isGameOver}>
          ${`Your ${this.isNewBestScore ? 'new highscore' : 'score'}: ${this.gameScore}`}
        </div>
        <div class='content-sizing-container'>
          <div>Game speed:</div>
          <div id='game-speed-selector' @change=${this.changeGameSpeed}>
            <div>
              <input type='radio' id='game-slow' name='game-speed'>
              <label for='game-slow'>Slow</label>
            </div>
            <div>
              <input type='radio' id='game-normal' name='game-speed' checked>
              <label for='game-normal'>Standart</label>
            </div>
            <div>
              <input type='radio' id='game-fast' name='game-speed'>
              <label for='game-fast'>Fast</label>
            </div>
          </div>
          <button class='button action-button' @click=${this.playGame}>Play <span ?hidden=${!this.isGameOver}>Again</span></button>
        </div>
      </snk-popup>

      <canvas id='game-renderer' ?faded=${!this.isGamePlaying || this.isGamePaused}></canvas>
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

  setupGameRenderer() {
    const canvas = <HTMLCanvasElement>this.shadowRoot!.getElementById('game-renderer')

    const options = {
      canvas: canvas,
      onGameOver: () => this.gameOver(),
      onScoreChanged: (score) => this.setGameScore(score),
    }

    this.game = wasmGame(options)
    this.game.then(() => {
      this.setupResizeObserver(canvas)
      document.dispatchEvent(new Event('app-loaded'))
    })
  }

  setupResizeObserver(canvas) {
    const setSize = ({ width, height }) => this.game._resizeGame(width, height)

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
    if (this.isGamePaused || !this.isGamePlaying)
      return

    this.game._pauseGame()
    this.isGamePaused = true
    await this.updateComplete
    const popup = <SnkPopup>this.shadowRoot!.getElementById('game-paused-popup')
    popup.openPopup()
  }

  async resumeGame() {
    const popup = <SnkPopup>this.shadowRoot!.getElementById('game-paused-popup')
    await popup.closePopup()
    const countDownElement = this.shadowRoot!.getElementById('resume-game-countdown')!
    countDownElement.setAttribute('start', '')
    setTimeout(() => {
      this.isGamePaused = false
      countDownElement.removeAttribute('start')
      this.game._resumeGame()
    }, 3000)
  }

  async playGame() {
    const popup = <SnkPopup>this.shadowRoot!.getElementById('game-play-popup')
    await popup.closePopup()
    this.gameScore = 0; 
    this.isGamePlaying = true
    this.isGameOver = false
    this.isGamePaused = false
    this.isNewBestScore = false
    this.game._playGame()
  }

  async gameOver() {
    this.isGameOver = true
    this.isGamePlaying = false
    this.isGamePaused = false
    const popup = <SnkPopup>this.shadowRoot!.getElementById('game-play-popup')
    await popup.openPopup()
    const jsonBest = JSON.stringify(this.bestGameScores)
    localStorage.setItem('best-results', jsonBest)
  }

  changeGameSpeed(e: Event) {
    const path = e.composedPath() as HTMLElement[]
    const selector = path[2]
    const item = path[1]
    this.gameSpeed = Array.from(selector.children).indexOf(item) as GameSpeedType
    this.game._setGameSpeed(this.gameSpeed)
  }

  setGameScore(score) {
    this.gameScore = score
    if (this.currentGameSpeedBestScore < score) {
      this.currentGameSpeedBestScore = score
      this.isNewBestScore = true
    }
  }
}
