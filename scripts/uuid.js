export async function getUUID(username) {
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
