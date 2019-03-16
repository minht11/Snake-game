import { css } from 'lit-element'

export const appStyles = [css`
:host {
  display: contents;
}
#app-bar {
  display: flex;
  align-items: center;
  position: relative;
  height: 56px;
  width: 100%;
  background: #0d344e;
  color: #fff;
  fill: #fff;
  flex-shrink: 0;
  padding: 0 8px 0 24px;
  box-sizing: border-box;
  font-size: 14px;
}
#header-game-mode-name {
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
  width: max-content;
}

.icon-button {
  height: 40px;
  width: 40px;
  border-radius: 50%;
  margin-left: auto;
  cursor: pointer;
}
.icon-button svg {
  height: 30px;
  width: 30px;
  fill: #fff;
}

button {
  padding: 0;
  border: none;
  font: inherit;
  color: #fff;
  font-weight: 600;
  font-size: 18px;
  background: transparent;
}

#game-mode-selector {
  display: flex;
  margin: 0 auto 24px;
  border: 1px solid rgba(255,255,255,.5);
}

#game-mode-selector input {
  display: none;
}
#game-mode-selector label {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 40px;
  width: 96px;
  box-sizing: border-box;
  color: #fff;
  margin: -1px;
}
input[type=radio]:checked ~ label {
  border: 2px solid #0DFF92;
  color: #0DFF92;
}

#game-renderer {
  width: 100%;
  height: calc(100% - 56px);
  box-sizing: border-box;
}

.action-button {
  background: #FF8C00;
  width: fit-content;
  height: 48px;
  padding: 0 36px;
  margin: auto;
  display: flex;
  justify-content: center;
  align-items: center;
  text-transform: uppercase;
  border-bottom: 2px solid #F7630C;
  box-sizing: border-box;
}

.action-button:hover {
  border-bottom: 2px solid #FF8C00;
  background: #F7630C;
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
`]
