var GameInputLibrary = {
  $DIRECTION_INPUT: {
    // Directions in order: up, left, down, right
    direction: 3,
    start: {},
    isPaused: true,

    onTouchStartHandler: function(e) {
      if (DIRECTION_INPUT.isPaused)
        return;
      
      var touch = e.changedTouches[0];
      DIRECTION_INPUT.start = { x: touch.clientX, y: touch.clientY };
      e.preventDefault();
    },

    onTouchEndHandler: function(e) {
      if (DIRECTION_INPUT.isPaused)
        return;
  
      var threshold = 40;
      var startX = DIRECTION_INPUT.start.x;
      var startY = DIRECTION_INPUT.start.y;

      var touch = e.changedTouches[0];
      var endX = touch.clientX;
      var endY = touch.clientY;

      if (endX < startX && Math.abs(endY - startY) < threshold) {
        DIRECTION_INPUT.direction = 1;
      }
  
      if (endX > startX && Math.abs(endX - startX) > threshold) {
        DIRECTION_INPUT.direction = 3;
      }
  
      if (endY < startY && Math.abs(endX - startX) < threshold) {
        DIRECTION_INPUT.direction = 0;
      }
  
      if (endY > startY && Math.abs(endY - startY) > threshold) {
        DIRECTION_INPUT.direction = 2;
      }
    },
  
    onKeyDownHandler: function(e) {
      if (DIRECTION_INPUT.isPaused)
        return;
  
      var keyCodes = {
        38: 0,
        40: 2,
        37: 1,
        39: 3,
      };
      var keyCode = e.keyCode;
      if (keyCode in keyCodes) {
        DIRECTION_INPUT.direction = keyCodes[keyCode]
      }
    },
  },
  setupDirectionListener: function() {
    if (Module['canvas']) {
      Module['canvas'].addEventListener('touchstart', DIRECTION_INPUT.onTouchStartHandler, false);
      Module['canvas'].addEventListener('touchend', DIRECTION_INPUT.onTouchEndHandler, false);
      window.addEventListener('keydown', DIRECTION_INPUT.onKeyDownHandler);
    }
  },
  pauseDirectionListener: function() {
    DIRECTION_INPUT.isPaused = true;
  },
  resumeDirectionListener: function() {
    DIRECTION_INPUT.isPaused = false;
  },
  getDirection: function () {
    return DIRECTION_INPUT.direction;
  },
  setDirection: function (value) {
    return DIRECTION_INPUT.direction = value;
  }
}

autoAddDeps(GameInputLibrary, '$DIRECTION_INPUT')
mergeInto(LibraryManager.library, GameInputLibrary)