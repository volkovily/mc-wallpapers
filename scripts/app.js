import { merge } from "./imageUtils.js";
import { getUUID } from "./uuid.js";
import { addSkinToHistory } from "./skinHistory.js";

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const fileInputs = [
  { id: "backgroundInput", name: "background" },
  { id: "playerInput", name: "player" },
  { id: "hatInput", name: "hat" }
];

const images = {};
const skin = new Image();
skin.src = "src/img/steve_new.png";

const OLD_FORMAT_HEIGHT = 32;

const mojangSkinButton = document.getElementById("getMojangSkinBtn");
const skinInput = document.getElementById("skinInput");
const playerNameInput = document.getElementById("playerNameInput");

mojangSkinButton.addEventListener("click", () => {
  const playerName = playerNameInput.value;
  if (playerName.trim() !== "") {
    getUUID(playerName).then((uuid) => {
      loadMojangSkin(uuid);
      addSkinToHistory(uuid, loadMojangSkin);
    });
  }
});

skinInput.addEventListener("change", (event) => {
  const file = event.target.files[0];
  const reader = new FileReader();
  reader.onload = (event) => {
    skin.src = event.target.result;
    compose();
  };
  reader.readAsDataURL(file);
});

function loadMojangSkin(uuid) {
  skin.src = `https://visage.surgeplay.com/skin/${uuid}`;
  skin.crossOrigin = "anonymous";
  skin.onload = () => {
    if (skin.height === OLD_FORMAT_HEIGHT) {
      skin.src = `https://visage.surgeplay.com/processedskin/${uuid}`;
      skin.onload = () => {
        compose();
      };
    } else {
      compose();
    }
  };
}

fileInputs.forEach(({ id, name }) => {
  const fileInput = document.getElementById(id);
  const label = document.querySelector(`label[for="${id}"]`);

  fileInput.addEventListener("change", () => {
    const file = fileInput.files[0];
    if (file) {
      const img = new Image();
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
  const container = document.createElement("div");
  for (let name in images) container.appendChild(images[name]);

  combine(images.player, images.hat, skin, function (player, hat) {
    renderWallpaper(player);
    if (hat) {
      ctx.drawImage(hat, 0, 0);
    }
  });
}

function combine(img1, img2, skin, callback) {
  merge(img1, skin, function (player) {
    if (img2) {
      merge(img2, skin, function (hat) {
        callback(player, hat);
      });
    } else {
      callback(player, null);
    }
  });
}

function renderWallpaper(player) {
  canvas.width = images.background.width;
  canvas.height = images.background.height;
  ctx.drawImage(images.background, 0, 0);
  ctx.drawImage(player, 0, 0);
}
