#include <stdio.h>
#include <stdlib.h>
#include <vector>
#include <math.h>

#include <SDL2/SDL.h>

#include "snake.cpp"
#include "food.cpp"

Food food;
Snake snake;

class Game {
  private:

  int score = 0;

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
  SDL_Keycode direction = SDLK_RIGHT;

  public:
  bool isInitialized = false;
  bool isGameOver = false;
  bool playing = false;

  void initialize() {
    isInitialized = true;
    SDL_Init(SDL_INIT_VIDEO);

    window = SDL_CreateWindow(
      "Snakee",
      SDL_WINDOWPOS_UNDEFINED, SDL_WINDOWPOS_UNDEFINED,
      screenWidth, screenHeight,
      SDL_WINDOW_SHOWN | SDL_WINDOW_OPENGL);

    renderer = SDL_CreateRenderer(window, -1, SDL_RENDERER_ACCELERATED);
    drawBoard();
  }

  void clearRenderer() {
    SDL_DestroyRenderer(renderer);
    SDL_DestroyWindow(window);
    SDL_Quit();
    isInitialized = false;
  }

  void resize(double w, double h) {
    screenWidth = w;
    screenHeight = h;
    zoneSize = (w > h ? h : w) / minimumZoneCount;
  
    // Size - minimum wall size.
    double wAdjusted = w - 10 * 2;
    double hAdjusted = h - 10 * 2;

    rowCount = hAdjusted / zoneSize;
    columnCount = wAdjusted / zoneSize;
    perspectiveDistance = zoneSize / 100.0 * 20;
    wallXSize = (screenWidth - columnCount * zoneSize) / 2.0;
    wallYSize = (screenHeight - rowCount * zoneSize) / 2.0;

    SDL_SetWindowSize(window, w, h);
    drawBoard();
  }

  void setScene() {
    score = 0;
    isGameOver = false;
    direction = SDLK_RIGHT;
    snake.setStartingPosition();
    food.generateNewCoordinate(columnCount-1, rowCount-1);
  }

  void changeDirection(SDL_Keycode newDirection) {
    direction = newDirection;
  }

  void logic() {
    snake.setDirection(direction);
    snake.move();
    if (snake.checkIfItCollided() || snake.checkIfOutOfBounds(columnCount, rowCount)) {
      isGameOver = true;
      EM_ASM({
        document.getElementById('game').gameOver();
      }, score);
    }
    Coordinate foodCoordinate = food.getCoordinates();
    if (snake.eat(foodCoordinate)) {
      auto snakePath = snake.getCoordinates();
      foodCoordinate = food.generateNewCoordinate(columnCount-1, rowCount-1);

      bool foodSpawnedBehindSnake = true;
      while(foodSpawnedBehindSnake) {
        for (auto & it : snakePath) {
          if (foodCoordinate == it) {
            foodCoordinate = food.generateNewCoordinate(columnCount-1, rowCount-1);
            continue;
          }
        }
        foodSpawnedBehindSnake = false;
      }
      score += 1;
      EM_ASM({
        document.getElementById('game').setGameScore($0);
      }, score);
    }
  }

  int getPositionX(int coordinateX) {
    return coordinateX * zoneSize + wallXSize;
  }

  int getPositionY(int coordinateY) {
    return coordinateY * zoneSize + wallYSize;
  }

  void draw() {
    if (!playing)
      return;

    drawBoard();
    drawSnake();
    drawFood();
    
    SDL_RenderPresent(renderer);
  }

  void drawBoard() {
    
    // Draw solid background
    SDL_SetRenderDrawColor(renderer, 0x08, 0x25, 0x38, 0xFF); // #082538
    SDL_RenderClear(renderer);

    // Draw walls
    SDL_SetRenderDrawColor(renderer, 0x04, 0x14, 0x1f, 0xFF); // #04141f
    SDL_Rect wallRect;
    // Left
    wallRect.w = wallXSize;
    wallRect.h = screenHeight;
    wallRect.x = 0;
    wallRect.y = 0;
    SDL_RenderFillRect(renderer, &wallRect);
    // Right
    wallRect.x = screenWidth - wallXSize;
    SDL_RenderFillRect(renderer, &wallRect);
    // Top
    wallRect.w = screenWidth;
    wallRect.h = wallYSize;
    wallRect.x = 0;
    wallRect.y = 0;
    SDL_RenderFillRect(renderer, &wallRect);
    // Bottom
    wallRect.y = screenHeight - wallYSize;
    SDL_RenderFillRect(renderer, &wallRect);

    // Draw checkboxes
    SDL_SetRenderDrawColor(renderer, 0x0a, 0x2c, 0x42, 0xFF); // #0a2c42
    int col = round(columnCount / 2.0);
    SDL_Rect checkboxRect;
    checkboxRect.h = zoneSize;
    checkboxRect.w = zoneSize;
    for (size_t i = 0; i < rowCount; i++) {
      for (size_t j = 0; j < col; j++) {
        if (!(col * 2 > columnCount && j == col - 1 && i % 2 == 0)) {
          checkboxRect.x = 2 * j * zoneSize + (i % 2 ? 0 : zoneSize) + wallXSize;
          checkboxRect.y = i * zoneSize + wallYSize;
          SDL_RenderFillRect(renderer, &checkboxRect);
        }
      }
    }
  }

  void drawFood() {
    Coordinate foodCoordinate = food.getCoordinates();
    double foodSize = zoneSize - 2.0 * perspectiveDistance;
    double foodOffset = (zoneSize - foodSize) / 2.0;

    SDL_Rect foodRect;
    foodRect.h = foodSize;
    foodRect.w = foodSize;
    auto foodLambada = [&](bool perspective = false) -> void {
      double distance = 0;
      if (perspective) {
        SDL_SetRenderDrawColor(renderer, 0x10, 0x89, 0x3E, 0xFF); // #10893E
      } else {
        distance = perspectiveDistance;
        SDL_SetRenderDrawColor(renderer, 0x00, 0xCC, 0x6A, 0xFF); // #00CC6A
      }

      foodRect.x = getPositionX(foodCoordinate.x) + foodOffset;
      foodRect.y = getPositionY(foodCoordinate.y) + foodOffset - distance;
      SDL_RenderDrawRect(renderer, &foodRect);
    };
    foodLambada(true);
    foodLambada();
  }

  void drawSnake() {
    auto snakePath = snake.getCoordinates();
    SDL_Rect snakeRect;
    snakeRect.h = zoneSize;
    snakeRect.w = zoneSize;
    auto snakeLambada = [&](bool perspective = false) -> void {
      double distance = 0;
      if (perspective) {
        SDL_SetRenderDrawColor(renderer, 0xF7, 0x63, 0x0C, 0xFF); // #F7630C
      } else {
        distance = perspectiveDistance;
        SDL_SetRenderDrawColor(renderer, 0xFF, 0x8C, 0x00, 0xFF); // #FF8C00
      }

      for (auto & it : snakePath) {
        snakeRect.x = getPositionX(it.x);
        snakeRect.y = getPositionY(it.y) - distance;
        SDL_RenderDrawRect(renderer, &snakeRect);
      };
    };
    snakeLambada(true);
    snakeLambada();

    // Draw snakes head
    auto snakeHeadCoord = snake.getHeadCoordinate();
    SDL_SetRenderDrawColor(renderer, 0xF7, 0x63, 0x0C, 0xFF); // #F7630C
    snakeRect.x = getPositionX(snakeHeadCoord.x);
    snakeRect.y = getPositionY(snakeHeadCoord.y);
    SDL_RenderFillRect(renderer, &snakeRect);

    SDL_SetRenderDrawColor(renderer, 0xFF, 0x8C, 0x00, 0xFF); // #FF8C00
    snakeRect.y = snakeRect.y - perspectiveDistance;
    SDL_RenderFillRect(renderer, &snakeRect);
  }
};