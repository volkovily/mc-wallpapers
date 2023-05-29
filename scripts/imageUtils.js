export function merge(uvmap, skin, onRender) {
  let caman = Caman(uvmap, function () {
    this.remap(skin, uvmap.u || "r", uvmap.v || "g");
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
    let location = (rgba[vChannel] * canvas.width + rgba[uChannel]) * 4;
    rgba.r = (rgba.a * pixelData[location + 0]) / 255;
    rgba.g = (rgba.a * pixelData[location + 1]) / 255;
    rgba.b = (rgba.a * pixelData[location + 2]) / 255;
    rgba.a = (rgba.a * pixelData[location + 3]) / 255;
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
