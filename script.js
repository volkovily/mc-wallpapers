const fileInput = document.getElementById("fileInput");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let images = {};
let skin = new Image();
skin.src = "src/img/steve_new.png";

fileInput.addEventListener("change", () => {
  const files = fileInput.files;
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    let img = new Image();
    let name = file.name.replace(".png", "");
    images[name] = img;
    img.src = URL.createObjectURL(file);
    img.onload = () => {
      compose();
    };
  }
});

//change to accept any image name
function compose() {
  let container = document.createElement("div");
  for (let name in images) container.appendChild(images[name]);

  merge(
    images.player,
    skin,
    images.background,
    renderWallpaper
  );
}

function renderWallpaper(player) {
  canvas.width = images.background.width;
  canvas.height = images.background.height;
  ctx.drawImage(images.background, 0, 0);
  ctx.drawImage(player, 0, 0);
}

function merge(uvmap, skin, background, onRender) {
  let caman = Caman(uvmap, function () {
    this.remap(skin, uvmap.u || "r", uvmap.v || "g");
    this.render(function () {
      onRender(caman.canvas);
    });
  });
}

Caman.Filter.register("remap", function (image, uChannel, vChannel) {
  let canvas = resizeSkin(image, 256 / image.width);
  let pixelData = canvas.getContext("2d").getImageData(0, 0, canvas.width, canvas.height).data;
  this.process("remap", function (rgba) {
    let location = (rgba[vChannel] * canvas.width + rgba[uChannel]) * 4;
    rgba.r = (rgba.a * pixelData[location + 0]) / 255;
    rgba.g = (rgba.a * pixelData[location + 1]) / 255;
    rgba.b = (rgba.a * pixelData[location + 2]) / 255;
    rgba.a = (rgba.a * pixelData[location + 3]) / 255;
  });
});

function resizeSkin(image, factor) {
  canvas.width = image.width * factor;
  canvas.height = canvas.width;

  ctx.scale(factor, factor);
  ctx.drawImage(image, 0, 0);
  return canvas;
}
