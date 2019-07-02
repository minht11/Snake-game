import { css } from 'lit-element'

export const shellStyles = [css`
:host {
  display: contents;
}
#game-renderer {
  transition: opacity .4s;
}
#game-renderer[faded] {
  opacity: .6;
}
#app-bar {
  display: flex;
  align-items: center;
  position: relative;
  height: 56px;
  width: 100%;
  background: #07263A;
  color: #fff;
  fill: #fff;
  flex-shrink: 0;
  padding: 0 8px 0 24px;
  box-sizing: border-box;
  font-size: 14px;
}
#score-info {
  margin-right: auto;
}
#header-game-speed-name {
  font-size: 18px;
  text-transform: capitalize;
  margin-right: 24px;
  color: #fff;
}
[bestscore] {
  fill: #00b2ff;
  color: #00b2ff;
}
.trophy-svg {
  height: 16px;
  width: 16px;
}

#header-game-score {
  margin: auto;
  position: absolute;
  font-size: 18px;
  left: 0;
  right: 0;
  width: 100px;
  width: max-content;
  top: 0;
  bottom: 0;
  display: flex;
  align-items: center;
}

.icon-button {
  height: 40px;
  width: 40px;
  border-radius: 50%;
  cursor: pointer;
  border: none;
  padding: 0;
  background: transparent;
  display: flex;
  justify-content: center;
  align-items: center;
}
.icon-button a {
  cursor: pointer;
}
.icon-button svg {
  height: 24px;
  width: 24px;
  fill: #fff;
}
.icon-button.pause svg {
  height: 30px;
  width: 30px;
}

.content-sizing-container {
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  color: rgba(255, 255, 255, 0.7);
}

#game-speed-selector {
  display: flex;
  border: 1px solid rgba(255,255,255,.5);
  margin: 16px 0 24px;
  color: rgba(255, 255, 255, 0.7);
}

#game-speed-selector input {
  display: none;
}
#game-speed-selector label {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 40px;
  width: 96px;
  box-sizing: border-box;
  margin: -1px;
  cursor: pointer;
  transition: background-color .12s;
}
#game-speed-selector label:hover {
  background-color: rgba(255, 255, 255, .1);
}
input[type=radio]:checked ~ label {
  border: 2px solid #0DFF92;
  color: #0DFF92;
}

.action-button {
  font-size: 14px;
  color: rgba(0, 0, 0, 0.87);
  background: #FF8C00;
  border-bottom: 2px solid #F7630C;
  height: 48px;
  padding: 0 36px;
  text-transform: uppercase;
  font-weight: 600;
  width: 100%;
}
.action-button:hover {
  border-bottom: 2px solid #FF8C00;
  background: #F7630C;
}

#game-renderer {
  width: 100%;
  height: calc(100% - 56px);
  box-sizing: border-box;
}

#game-paused-popup {
  height: 224px;
}

#game-paused-popup .action-button {
  margin: 0 24px;
  width: auto;
}

#resume-game-countdown-container {
  height: 124px;
  width: 124px;
  overflow: hidden;
  margin: auto;
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  z-index: 3;
  pointer-events: none;
}

#resume-game-countdown {
  font-size: 124px;
  color: #fff;
  display: none;
}

#resume-game-countdown[start] {
  display: block;
  animation: move-countdown  3s steps(1) both, scale-countdown 1s 3 both;
}

@keyframes move-countdown {
  0% {
    transform: translateY(0);
  }
  33% {
    transform: translateY(-124px);
  }
  66% {
    transform: translateY(-248px);
  }
  100% {
    transform: translateY(-100%);
  }
}

/** This only works in chrome for now */
@keyframes scale-countdown {
  0% {
    opacity: 0;
    scale: 0 0;
  }
  100% {
    opacity: 1;
    scale: 1 1;
  }
}

[hidden] {
  display: none;
}
.popup-title {
  font-size: 40px;
}
.popup-header {
  font-size: 20px;
}
`]

export const buttonStyles = css`
.button {
  background: transparent;
  width: auto;
  width: fit-content;
  padding: 0 8px;
  height: 36px;
  margin: auto;
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  border: none;
  font: inherit;
  color: #fff;
  cursor: pointer;
  font-size: 14px;
  transition: background-color .2s, border-color .2s;
}

.button[outline] {
  border: 2px solid #FF8C00;
}

.button:hover {
  background: rgba(255,255,255,.1);
}
`