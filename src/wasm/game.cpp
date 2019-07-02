#include <SDL.h>
#include <emscripten.h>
#include <algorithm>
#include <cmath>

#include "snake.cpp"
#include "food.cpp"
#include "painter.cpp"

extern "C" {
  extern void setupDirectionListener();
  extern void pauseDirectionListener();
  extern void setDirection(int);
  extern int getDirection();
  extern void onGameOverCallback();
  extern void onScoreChangedCallback(int);
}

class Game : public Painter {
  private:
  int score = 0;
  Food food;
  Snake snake;
  int zoneSize = 50;
  int minimumZoneCount = 20;
  int rowCount = 20;
  int columnCount = 20;
  float wallXSize = 10;
  float wallYSize = 10;
  float perspectiveDistance = zoneSize / 100.0 * 20;

  public:
  bool playing = false;
  bool isInitialized = false;

  void initialize() {
    Painter::initialize();
    drawBoard(); 
    setupDirectionListener();
    isInitialized = true;
  }  

  void resize(float w, float h) {
    Painter::resize(w, h);
    zoneSize = (w > h ? h : w) / minimumZoneCount;
  
    // Size - minimum wall size.
    float wAdjusted = w - 10 * 2;
    float hAdjusted = h - 10 * 2;

    rowCount = hAdjusted / zoneSize;
    columnCount = wAdjusted / zoneSize;
    perspectiveDistance = zoneSize / 100.0 * 20;
    wallXSize = (screenWidth - columnCount * zoneSize) / 2.0;
    wallYSize = (screenHeight - rowCount * zoneSize) / 2.0;

    drawBoard();
  }

  void setScene() {
    score = 0;
    snake.setStartingPosition(columnCount /  2, rowCount /  2);
    food.generateNewCoordinate(columnCount-1, rowCount-1);
    setDirection(3);
    onScoreChangedCallback(score);
  }

  void tick() {
    snake.setDirection(getDirection());
    snake.move();
    if (snake.didCollideWithItself() || snake.isOutOfBounds(columnCount, rowCount)) {
      playing = false;
      pauseDirectionListener();
      onGameOverCallback();
      return;
    }
    Coordinate foodCoordinate = food.getCoordinates();
    if (snake.eat(foodCoordinate)) {
      auto snakePath = snake.getCoordinates();
      foodCoordinate = food.generateNewCoordinate(columnCount-1, rowCount-1);

      while(1) {
        if(std::find(snakePath.begin(), snakePath.end(), foodCoordinate) != snakePath.end()) {
          foodCoordinate = food.generateNewCoordinate(columnCount-1, rowCount-1);
          continue;
        }
        break;
      }
      score += 1;
      onScoreChangedCallback(score);
    }
    draw();
  }

  int getDrawPositionX(int coordinateX) {
    return coordinateX * zoneSize + wallXSize;
  }

  int getDrawPositionY(int coordinateY) {
    return coordinateY * zoneSize + wallYSize;
  }

  void draw() {
    drawBoard();
    drawSnake();
    drawFood();
    Painter::draw();
  }

  void drawBoard() {
    // Draw solid background
    SDL_SetRenderDrawColor(renderer, 0x0a, 0x2e, 0x46, 0xFF); // #0a2e46
    SDL_RenderClear(renderer);

    // Draw walls
    SDL_SetRenderDrawColor(renderer, 0x07, 0x26, 0x3A, 0xFF); // #07263A
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
  }

  void drawFood() {
    Coordinate foodCoordinate = food.getCoordinates();
    double foodSize = zoneSize - 2.0 * perspectiveDistance;
    double foodOffset = (zoneSize - foodSize) / 2.0;

    SDL_Rect foodRect;
    foodRect.h = foodSize;
    foodRect.w = foodSize;
    foodRect.x = getDrawPositionX(foodCoordinate.x) + foodOffset;
    foodRect.y = getDrawPositionY(foodCoordinate.y) + foodOffset;
    SDL_SetRenderDrawColor(renderer, 0x10, 0x89, 0x3E, 0xFF); // #10893E
    SDL_RenderDrawRect(renderer, &foodRect);

    foodRect.y -= perspectiveDistance;
    SDL_SetRenderDrawColor(renderer, 0x00, 0xCC, 0x6A, 0xFF); // #00CC6A
    SDL_RenderDrawRect(renderer, &foodRect);
  }

  void drawSnake() {
    auto snakePath = snake.getCoordinates();
    SDL_Rect snakeRect;
    snakeRect.h = zoneSize + 2;
    snakeRect.w = zoneSize + 2;
    for (auto & it : snakePath) {
      snakeRect.x = getDrawPositionX(it.x) - 1;
      snakeRect.y = getDrawPositionY(it.y) - 1;
      SDL_SetRenderDrawColor(renderer, 0xF7, 0x63, 0x0C, 0xFF); // #F7630C
      SDL_RenderDrawRect(renderer, &snakeRect);

      snakeRect.y -= perspectiveDistance;
      SDL_SetRenderDrawColor(renderer, 0xFF, 0x8C, 0x00, 0xFF); // #FF8C00
      SDL_RenderDrawRect(renderer, &snakeRect);
    };

    // Draw snakes head
    auto snakeHeadCoord = snake.getHeadCoordinate();
    SDL_SetRenderDrawColor(renderer, 0xF7, 0x63, 0x0C, 0xFF); // #F7630C
    snakeRect.x = getDrawPositionX(snakeHeadCoord.x);
    snakeRect.y = getDrawPositionY(snakeHeadCoord.y);
    SDL_RenderFillRect(renderer, &snakeRect);

    SDL_SetRenderDrawColor(renderer, 0xFF, 0x8C, 0x00, 0xFF); // #FF8C00
    snakeRect.y = snakeRect.y - perspectiveDistance;
    SDL_RenderFillRect(renderer, &snakeRect);
  }
};