#include <SDL.h>

class Painter {
  protected:
  float screenWidth = 500;
  float screenHeight = 500;
  SDL_Window *window = nullptr;
  SDL_Renderer *renderer = nullptr;

  virtual void initialize() {
    SDL_Init(SDL_INIT_VIDEO);

    window = SDL_CreateWindow(
      "Snakee",
      SDL_WINDOWPOS_UNDEFINED, SDL_WINDOWPOS_UNDEFINED,
      screenWidth, screenHeight,
      SDL_WINDOW_OPENGL);

    renderer = SDL_CreateRenderer(window, -1, SDL_RENDERER_ACCELERATED);
  }

  virtual void resize(float w, float h) {
    screenWidth = w;
    screenHeight = h;
    SDL_SetWindowSize(window, w, h);
  }

  virtual void draw() {
    SDL_RenderPresent(renderer);
  };
};
