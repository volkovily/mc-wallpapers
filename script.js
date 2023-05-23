const fileInput = document.getElementById("fileInput");
const imageContainer = document.getElementById("imageContainer");

fileInput.addEventListener("change", () => {
  const file = fileInput.files[0];
  const reader = new FileReader();

  reader.onload = () => {
    imageContainer.innerHTML = `<img src="${reader.result}">`;
  };

  reader.readAsDataURL(file);
});
