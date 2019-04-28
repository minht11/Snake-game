set -e

DYNAMIC_ARGUMENTS=""
if [ "$dev" = true ] ; then
  echo 'Compiling in DEV mode'
  DYNAMIC_ARGUMENTS="-O1 -s ASSERTIONS=0"
else
  echo 'Compiling in OPTIMIZED mode'
  DYNAMIC_ARGUMENTS="-O3 -s ASSERTIONS=0 --closure 1"
fi

MAIN_ARGUMENTS="--std=c++1z \
    -s STRICT=1 \
    -s MODULARIZE=1 \
    -s USE_SDL=2 \
    -s USE_SDL_IMAGE=0 \
    -s USE_SDL_NET=0 \
    -s MALLOC=emmalloc
    -s GL_EMULATE_GLES_VERSION_STRING_FORMAT=0 \
    -s GL_POOL_TEMP_BUFFERS=0 \
    -s FILESYSTEM=0 \
    -s SUPPORT_ERRNO=0 \
    -s EXPORT_NAME=\"wasmGame\" \
    -s ENVIRONMENT=\"web\" \
    --js-library src/wasm/libraries/callbacks.js \
    --js-library src/wasm/libraries/input.js"

echo "============================================="
(
  mkdir -p dist
  emcc \
    $DYNAMIC_ARGUMENTS \
    $MAIN_ARGUMENTS \
    -s WASM=1 \
    -s EXPORT_ES6=1 \
    -o ./dist/wasm-game.js \
    src/wasm/main.cpp

  if [ "$asm" = true ] ; then
    emcc \
      $DYNAMIC_ARGUMENTS \
      $MAIN_ARGUMENTS \
      -s WASM=0 \
      -s LEGACY_VM_SUPPORT=1 \
      -o ./dist/wasm-game-asm.js \
      src/wasm/main.cpp
  fi
  mv dist/wasm-game.js src/
)
echo "============================================="
echo "Compiling wasm done"
echo "============================================="