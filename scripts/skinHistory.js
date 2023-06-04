const skinHistoryContainer = document.getElementById("skinHistoryContainer");
const skinHistoryMap = new Map();

export function addSkinToHistory(uuid) {
  if (!uuid) return

  if (skinHistoryMap.has(uuid)) {
    moveExistingItemToTop(uuid);
  } else {
    createAndInsertNewItem(uuid);
  }
}

function moveExistingItemToTop(uuid) {
  const existingItem = skinHistoryMap.get(uuid);
  skinHistoryContainer.insertBefore(existingItem, skinHistoryContainer.firstChild);
}

function createAndInsertNewItem(uuid) {
  const historyItem = createHistoryItem(uuid);
  skinHistoryContainer.insertBefore(historyItem, skinHistoryContainer.firstChild);
  skinHistoryMap.set(uuid, historyItem);
}

function createHistoryItem(uuid) {
  const historyItem = document.createElement("div");
  historyItem.classList.add("history-item");
  const skinPreviewBtn = createSkinPreviewButton(uuid);
  historyItem.appendChild(skinPreviewBtn);
  return historyItem;
}

function createSkinPreviewButton(uuid) {
  const skinPreviewBtn = document.createElement("button");
  skinPreviewBtn.classList.add("skin-preview-button");
  skinPreviewBtn.style.backgroundImage = `url(https://visage.surgeplay.com/front/128/${uuid})`;
  skinPreviewBtn.addEventListener("click", () => {
    loadMojangSkin(uuid);
  });
  return skinPreviewBtn;
}
