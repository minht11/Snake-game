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
  double perspectiveDistance = zoneSize / 100.0 * 20;
  SDL_Window *window = NULL;
  SDL_Renderer *renderer = NULL;
  SDL_Keycode direction = SDLK_RIGHT;

  public:
  bool isGameOver = false;
  bool playing = false;

  void initializeRender() {
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
  }

  void resize(double w, double h) {
    screenWidth = w;
    screenHeight = h;
    zoneSize = (w > h ? h : w) / minimumZoneCount;
  
    rowCount = h / zoneSize;
    columnCount = w / zoneSize;
    perspectiveDistance = zoneSize / 100.0 * 20;

    SDL_SetWindowSize(window, w, h);
    drawBoard();

    EM_ASM_({
      console.log($0, $1);
    }, rowCount, columnCount);
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
      EM_ASM_({
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
      EM_ASM_({
        document.getElementById('game').setGameScore($0);
      }, score);
    }
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

    SDL_SetRenderDrawColor(renderer, 0x0a, 0x2c, 0x42, 0xFF); // #0a2c42
    int col = round(columnCount / 2.0);
    SDL_Rect ckeckbox;
    ckeckbox.h = zoneSize;
    ckeckbox.w = zoneSize;
    for (size_t i = 0; i < rowCount; i++) {
      for (size_t j = 0; j < col; j++) {
        if (!(col * 2 > columnCount && j == col - 1 && i % 2 == 0)) {
          ckeckbox.x = 2 * j * zoneSize + (i % 2 ? 0 : zoneSize);
          ckeckbox.y = i * zoneSize;
          SDL_RenderFillRect(renderer, &ckeckbox);
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

      foodRect.x = foodCoordinate.x * zoneSize + foodOffset;
      foodRect.y = foodCoordinate.y * zoneSize + foodOffset - distance;
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
        snakeRect.x = zoneSize * it.x;
        snakeRect.y = zoneSize * it.y - distance;
        SDL_RenderDrawRect(renderer, &snakeRect);
      };
    };
    snakeLambada(true);
    snakeLambada();

    // Draw snakes head
    auto snakeHeadCoord = snake.getHeadCoordinate();
    SDL_SetRenderDrawColor(renderer, 0xDA, 0x3B, 0x01, 0xFF); // #DA3B01
    snakeRect.x = zoneSize * snakeHeadCoord.x;
    snakeRect.y = zoneSize * snakeHeadCoord.y;
    SDL_RenderFillRect(renderer, &snakeRect);

    SDL_SetRenderDrawColor(renderer, 0xFF, 0x8C, 0x00, 0xFF); // #FF8C00
    snakeRect.y = snakeRect.y - perspectiveDistance;
    SDL_RenderFillRect(renderer, &snakeRect);
  }
};