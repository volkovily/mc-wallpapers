const skinHistoryContainer = document.getElementById("skinHistoryContainer");
const skinHistoryMap = new Map();

export function addSkinToHistory(uuid, callback) {
  if (!uuid) {
    return;
  }

  if (skinHistoryMap.has(uuid)) {
    moveExistingItemToTop(uuid);
  } else {
    createAndInsertNewItem(uuid, callback);
  }
}

function moveExistingItemToTop(uuid) {
  const existingItem = skinHistoryMap.get(uuid);
  skinHistoryContainer.insertBefore(existingItem, skinHistoryContainer.firstChild);
}

function createAndInsertNewItem(uuid, callback) {
  const historyItem = createHistoryItem(uuid, callback);
  skinHistoryContainer.insertBefore(historyItem, skinHistoryContainer.firstChild);
  skinHistoryMap.set(uuid, historyItem);
}

function createHistoryItem(uuid, callback) {
  const historyItem = document.createElement("div");
  historyItem.classList.add("history-item");
  const skinPreviewBtn = createSkinPreviewButton(uuid, callback);
  historyItem.appendChild(skinPreviewBtn);
  return historyItem;
}

function createSkinPreviewButton(uuid, callback) {
  const skinPreviewBtn = document.createElement("button");
  skinPreviewBtn.classList.add("skin-preview-button");
  skinPreviewBtn.style.backgroundImage = `url(https://visage.surgeplay.com/front/128/${uuid})`;
  skinPreviewBtn.addEventListener("click", () => {
    callback(uuid);
  });
  return skinPreviewBtn;
}