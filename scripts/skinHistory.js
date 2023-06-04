const skinHistoryContainer = document.getElementById("skinHistoryContainer");
const skinHistoryMap = new Map();

export function addSkinToHistory(uuid) {
    if (!uuid) {
      return;
    }
    if (skinHistoryMap.has(uuid)) {
      const existingItem = skinHistoryMap.get(uuid);
      skinHistoryContainer.insertBefore(existingItem, skinHistoryContainer.firstChild);
    } else {
      const historyItem = document.createElement("div");
      historyItem.classList.add("history-item");
      const skinPreviewBtn = document.createElement("button");
      skinPreviewBtn.classList.add("skin-preview-button");
      skinPreviewBtn.style.backgroundImage = `url(https://visage.surgeplay.com/front/128/${uuid})`;
      skinPreviewBtn.addEventListener("click", () => {
        loadMojangSkin(uuid);
      });
      historyItem.appendChild(skinPreviewBtn);
      skinHistoryContainer.insertBefore(historyItem, skinHistoryContainer.firstChild);
  
      skinHistoryMap.set(uuid, historyItem);
    }
  }