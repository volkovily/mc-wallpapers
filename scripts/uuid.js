export async function getUUID(username) {
  const loadingPromise = showLoadingAnimation();
  const url = `https://api.ashcon.app/mojang/v2/user/${username}`;
  try {
    const response = await fetch(url);
    if (response.status === 404) {
      throw new Error("No player found for: " + username);
    }
    const data = await response.json();
    await loadingPromise;

    return data.uuid;
  } catch (err) {
    await loadingPromise;
    throw err;
  }
}

function showLoadingAnimation() {
  const loading = document.getElementById("loading");
  loading.style.display = "block";

  return new Promise((resolve) => {
    loading.style.display = "none";
    resolve();
  });
}
