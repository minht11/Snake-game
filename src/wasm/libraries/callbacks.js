var GameCallbacksLibrary = {
  onGameOverCallback: function () {
    if (Module['onGameOver']) {
      return Module['onGameOver']();
    }
  },
  onScoreChangedCallback: function (score) {
    if (Module['onScoreChanged']) {
      return Module['onScoreChanged'](score);
    };
  }
};

mergeInto(LibraryManager.library, GameCallbacksLibrary);