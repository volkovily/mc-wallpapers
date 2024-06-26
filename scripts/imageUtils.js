const RGBA_VALUES = 4;
const MAX_PIXEL_VALUE = 255;

export function merge(uvmap, skin, illumination, onRender) {
  const playerMask = createSolidColorMask(uvmap, "red");

  var caman = Caman(uvmap, function () {
    this.newLayer(function () {
      this.setBlendingMode("multiply"); 
      this.overlayImage(playerMask);
    });

    this.remap(skin, uvmap.u || "r", uvmap.v || "g");
      this.newLayer(function () {
        this.setBlendingMode("multiply");
        this.overlayImage(illumination);
      });
    this.render(function () {
      onRender(caman.canvas);
    });
  });
}

Caman.Filter.register("remap", function (image, uChannel, vChannel) {
  let canvas = resizeSkin(image, 256 / image.width);
  let pixelData = canvas
    .getContext("2d")
    .getImageData(0, 0, canvas.width, canvas.height).data;
  this.process("remap", function (rgba) {
    let location = (rgba[vChannel] * canvas.width + rgba[uChannel]) * RGBA_VALUES;
    rgba.r = (rgba.a * pixelData[location + 0]) / MAX_PIXEL_VALUE;
    rgba.g = (rgba.a * pixelData[location + 1]) / MAX_PIXEL_VALUE;
    rgba.b = (rgba.a * pixelData[location + 2]) / MAX_PIXEL_VALUE;
    rgba.a = (rgba.a * pixelData[location + 3]) / MAX_PIXEL_VALUE;
  });
});

function resizeSkin(image, factor) {
  let canvas = document.createElement("canvas");
  let ctx = canvas.getContext("2d");

  canvas.width = image.width * factor;
  canvas.height = canvas.width;

  ctx.imageSmoothingEnabled = false;
  ctx.scale(factor, factor);
  ctx.drawImage(image, 0, 0);
  return canvas;
}

function createSolidColorMask(image, color) {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  canvas.width = image.width;
  canvas.height = image.height;
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  return canvas;
}
