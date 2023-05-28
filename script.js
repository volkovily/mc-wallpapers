const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const fileInputs = [
  { id: "backgroundInput", name: "background" },
  { id: "playerInput", name: "player" },
];

let images = {};
let skin = new Image();
skin.src = "src/img/steve_new.png";

const playerNameButton = document.getElementById("getSkinBtn");
playerNameButton.addEventListener("click", () => {
  playerName = prompt("Enter username:");
  getUUID(playerName).then((uuid) => {
    skin.src = `https://visage.surgeplay.com/skin/${uuid}`;
    skin.crossOrigin = "anonymous";
    skin.onload = () => {
      if (skin.height == 32) {
        skin.src = `https://visage.surgeplay.com/processedskin/${uuid}`;
        skin.onload = () => {
          compose();
        };
      } else {
        compose();
      }
    };
  });
});

async function getUUID(username) {
  const url = `https://api.ashcon.app/mojang/v2/user/${username}`;
  try {
    const response = await fetch(url);
    if (response.status === 404) {
      throw new Error("No player found for: " + username);
    }
    const data = await response.json();
    return data.uuid;
  } catch (err) {
    throw err;
  }
}

fileInputs.forEach(({ id, name }) => {
  const fileInput = document.getElementById(id);
  fileInput.addEventListener("change", () => {
    const file = fileInput.files[0];
    let img = new Image();
    images[name] = img;
    img.src = URL.createObjectURL(file);
    img.onload = () => {
      compose();
    };
    file.name = name;
  });
});

function compose() {
  let container = document.createElement("div");
  for (let name in images) container.appendChild(images[name]);

  merge(images.player, skin, renderWallpaper);
}

function renderWallpaper(player) {
  canvas.width = images.background.width;
  canvas.height = images.background.height;
  ctx.drawImage(images.background, 0, 0);
  ctx.drawImage(player, 0, 0);
}

function merge(uvmap, skin, onRender) {
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
