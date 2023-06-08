import { merge } from "./imageUtils.js";
import { getUUID } from "./uuid.js";
import { addSkinToHistory } from "./skinHistory.js";
import { convertImageToBase64, download } from "./fileUtils.js";

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
const errorMessage = document.getElementById("errorMessage");
const exportButton = document.getElementById("exportBtn");
const importButton = document.getElementById("importBtn");

mojangSkinButton.addEventListener("click", () => {
  clearError();
  const playerName = playerNameInput.value;
  if (playerName.trim() !== "") {
    getUUID(playerName).then((uuid) => {
      loadMojangSkin(uuid);
      addSkinToHistory(uuid, loadMojangSkin);
    })
      .catch((error) => {
        showError(error);
      });
  } else {
    showError("Please enter a valid username");
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

  fileInput.addEventListener("change", () => {
    const file = fileInput.files[0];
    if (file) {
      const img = new Image();
      images[name] = img;
      img.src = URL.createObjectURL(file);
      img.onload = () => {
        compose();
      };
    }
  });
});

function checkImageSize(images, backgroundWidth, backgroundHeight) {
  for (let name in images) {
    const img = images[name];
    if (img.width !== backgroundWidth || img.height !== backgroundHeight) {
      showError(`Error: "${name}" image must have the same size as the background image (${backgroundWidth}x${backgroundHeight})`);
      return false;
    }
  }
  return true;
}

function addCheckToButton(name) {
  const label = document.querySelector(`label[for="${name}Input"]`);
  label.classList.add('loaded');
  label.querySelector('.button-icon').innerHTML = '✓';
}

function compose() {
  const container = document.createElement("div");
  for (let name in images) container.appendChild(images[name]);

  const background = images.background;
  const backgroundWidth = background.width;
  const backgroundHeight = background.height;

  let allImagesCorrectSize = checkImageSize(images, backgroundWidth, backgroundHeight);

  if (allImagesCorrectSize) {
    for (let name in images) {
      addCheckToButton(name);
    }

    combine(images.player, images.hat, skin, function (player, hat) {
      renderWallpaper(player);
      if (hat) {
        ctx.drawImage(hat, 0, 0);
      }
    });
  }
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

exportButton.addEventListener("click", () => {
  const template = {
    background: convertImageToBase64(images.background),
    player: convertImageToBase64(images.player),
    hat: convertImageToBase64(images.hat)
  };

  const jsonData = JSON.stringify(template);
  const fileName = "template_" + Date.now() + ".json";
  download(jsonData, fileName);

  const templateButton = document.createElement("button");
  templateButton.classList.add("template-preview");

  const templateImg = new Image();
  templateImg.src = images.background.src;
  templateImg.classList.add("template-preview-image");
  templateButton.appendChild(templateImg);

  templateButton.addEventListener("click", () => {
    applyTemplate(template);
  });

  const templateMenu = document.getElementById("templateMenu");
  templateMenu.appendChild(templateButton);
});

function applyTemplate(template) {
  const loadImages = (src) => {
    return new Promise((resolve) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.src = src;
    });
  };

  Promise.all([
    loadImages(template.background),
    loadImages(template.player),
    loadImages(template.hat)
  ])
    .then(([backgroundImage, playerImage, hatImage]) => {
      images.background = backgroundImage;
      images.player = playerImage;
      images.hat = hatImage;
      clearError();
      compose();
    })
    .catch((error) => {
      showError("Error: Failed to load template images");
      console.error(error);
    });
}

importButton.addEventListener("change", async (event) => {
  const file = event.target.files[0];
  const reader = new FileReader();

  const jsonData = await new Promise((resolve, reject) => {
    reader.onload = (event) => resolve(event.target.result);
    reader.onerror = (event) => reject(event.error);
    reader.readAsText(file);
  });

  const template = JSON.parse(jsonData);

  if (!template.background && !template.player) {
    showError("Error: Invalid template file");
    return;
  }

  const loadImages = (template) => {
    const imagePromises = Object.values(template).map((src) => {
      return new Promise((resolve) => {
        const image = new Image();
        image.onload = () => resolve(image);
        image.src = src;
      });
    });
    return Promise.all(imagePromises);
  };

  const [backgroundImage, playerImage, hatImage] = await loadImages(template);

  images.background = backgroundImage;
  images.player = playerImage;
  images.hat = hatImage;

  clearError();
  compose();
});

function showError(message) {
  errorMessage.textContent = message;
}

function clearError() {
  errorMessage.textContent = "‎";
}
