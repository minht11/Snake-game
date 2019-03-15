#include <stdio.h>
#include <stdlib.h>
#include <vector>
#include <math.h>

#include <SDL2/SDL.h>

#include "snake.cpp"
#include "food.cpp"

class Painter {
  private:
  SDL_Window *window = NULL;
  SDL_Renderer *renderer = NULL;

  protected:
  double screenWidth = 500;
  double screenHeight = 500;
  int zoneSize = 50;
  int minimumZoneCount = 20;
  int rowCount = 20;
  int columnCount = 20;
  int offset = zoneSize / 100.0 * 20;

  bool playing = true;

  Snake snake;
  Food food;

  public:


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
    offset = zoneSize / 100.0 * 20;

    SDL_SetWindowSize(window, w, h);
    drawBoard();

    EM_ASM_({
      console.log($0, $1);
    }, rowCount, columnCount);
  }

  void draw() {
    if (!playing)
    return;
    drawBoard();

    // Draw snake
    auto snakeC = snake.getCoordinates();
    SDL_Rect snakeRect;
    SDL_SetRenderDrawColor(renderer, 0xF7, 0x63, 0x0C, 0xFF); // #F7630C
    // SDL_SetRenderDrawColor(renderer, 0xFF, 0x8C, 0x00, 0xFF); // #FF8C00
    for (auto & it : snakeC) {
      snakeRect.x = zoneSize * it.x;
      snakeRect.y = zoneSize * it.y;
      snakeRect.h = zoneSize;
      snakeRect.w = zoneSize;
      SDL_RenderFillRect(renderer, &snakeRect);
    }

    SDL_SetRenderDrawColor(renderer, 0xFF, 0x8C, 0x00, 0xFF); // #FF8C00
    for (auto & it : snakeC) {
      snakeRect.x = zoneSize * it.x;
      snakeRect.y = zoneSize * it.y - offset;
      snakeRect.h = zoneSize;
      snakeRect.w = zoneSize;
      SDL_RenderFillRect(renderer, &snakeRect);
    }

    // Draw snakes head
    SDL_SetRenderDrawColor(renderer, 0xDA, 0x3B, 0x01, 0xFF); // #DA3B01
    auto snakeHeadC = snake.getLastCoordinate();
    SDL_Rect snakeHeadRect;
    snakeHeadRect.x = zoneSize * snakeHeadC.x;
    snakeHeadRect.y = zoneSize * snakeHeadC.y; 
    snakeHeadRect.w = zoneSize;
    snakeHeadRect.h = zoneSize;
    // SDL_RenderFillRect(renderer, &snakeHeadRect);

    // SDL_SetRenderDrawColor(renderer, 0xF7, 0x63, 0x0C, 0xFF); // #F7630C
    snakeHeadRect.y = snakeHeadRect.y - offset;
    SDL_RenderFillRect(renderer, &snakeHeadRect);

    drawFood(true);
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
    for (size_t i = 0; i < rowCount; i++) {
      for (size_t j = 0; j < col; j++) {
        if (!(col * 2 > columnCount && j == col - 1 && i % 2 == 0)) {
          ckeckbox.x = 2 * j * zoneSize + (i % 2 ? 0 : zoneSize);
          ckeckbox.y = i * zoneSize;
          ckeckbox.h = zoneSize;
          ckeckbox.w = zoneSize;
          SDL_RenderFillRect(renderer, &ckeckbox);
        }
      }
    }
  }

  void drawFood(bool shadow = false) {
    int dist = offset / 2.0;
    
    if (shadow) {
      dist = 0;
      SDL_SetRenderDrawColor(renderer, 0x10, 0x89, 0x3E, 0xFF); // #10893E
    } else {
      SDL_SetRenderDrawColor(renderer, 0x00, 0xCC, 0x6A, 0xFF); // #00CC6A
    }


    Coordinate foodCoordinate = food.getCoordinates();
    int foodSize = (zoneSize - offset * 2) / 3;

    SDL_Rect foodPart;
    foodPart.h = foodSize;
    foodPart.w = foodSize;

    // Left
    foodPart.x = foodCoordinate.x * zoneSize + offset;
    foodPart.y = foodCoordinate.y * zoneSize + foodSize + offset - dist;
    SDL_RenderFillRect(renderer, &foodPart);
  
    // Right
    foodPart.x = foodCoordinate.x * zoneSize + offset + foodSize * 2;
    foodPart.y = foodCoordinate.y * zoneSize + foodSize + offset - dist;
    SDL_RenderFillRect(renderer, &foodPart);

    // Top
    foodPart.x = foodCoordinate.x * zoneSize + foodSize + offset;
    foodPart.y = foodCoordinate.y * zoneSize + offset - dist;
    SDL_RenderFillRect(renderer, &foodPart);

    // Bottom
    foodPart.x = foodCoordinate.x * zoneSize + foodSize + offset;
    foodPart.y = foodCoordinate.y * zoneSize + offset + foodSize * 2 - dist;
    SDL_RenderFillRect(renderer, &foodPart);
  }
};