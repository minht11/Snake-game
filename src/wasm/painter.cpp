#include <SDL2/SDL.h>

class Painter {
  public:
  ~Painter() {
    SDL_DestroyRenderer(renderer);
    SDL_DestroyWindow(window);
    SDL_Quit();
  }

  double screenWidth = 500;
  double screenHeight = 500;
  int zoneSize = 50;
  int minimumZoneCount = 20;
  int rowCount = 20;
  int columnCount = 20;
  double wallXSize = 10;
  double wallYSize = 10;
  double perspectiveDistance = zoneSize / 100.0 * 20;
  SDL_Window *window = NULL;
  SDL_Renderer *renderer = NULL;

  virtual void initialize() {
    SDL_Init(SDL_INIT_VIDEO);

    window = SDL_CreateWindow(
      "Snakee",
      SDL_WINDOWPOS_UNDEFINED, SDL_WINDOWPOS_UNDEFINED,
      screenWidth, screenHeight,
      SDL_WINDOW_SHOWN | SDL_WINDOW_OPENGL);

    renderer = SDL_CreateRenderer(window, -1, SDL_RENDERER_ACCELERATED);
  }

  virtual void draw() = 0;
 
};

