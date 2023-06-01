import { merge } from "./imageUtils.js";
import { getUUID } from "./uuid.js";

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const fileInputs = [
  { id: "backgroundInput", name: "background" },
  { id: "playerInput", name: "player" },
];

let images = {};
let skin = new Image();
skin.src = "src/img/steve_new.png";

const OLD_FORMAT_HEIGHT = 32;

const playerNameButton = document.getElementById("getSkinBtn");
const playerNameInput = document.getElementById("playerNameInput");

playerNameButton.addEventListener("click", () => {
let playerName = playerNameInput.value;
  getUUID(playerName).then((uuid) => {
    skin.src = `https://visage.surgeplay.com/skin/${uuid}`;
    skin.crossOrigin = "anonymous";
    skin.onload = () => {
      if (skin.height == OLD_FORMAT_HEIGHT) {
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

fileInputs.forEach(({ id, name }) => {
  const fileInput = document.getElementById(id);
  const label = document.querySelector(`label[for="${id}"]`);

  fileInput.addEventListener("change", () => {
    const file = fileInput.files[0];
    if (file) {
      let img = new Image();
      images[name] = img;
      img.src = URL.createObjectURL(file);
      img.onload = () => {
        compose();
        label.classList.add('loaded');
        label.querySelector('.button-icon').innerHTML = '✓';
      };
    }
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
