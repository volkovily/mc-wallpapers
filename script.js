const fileInput = document.getElementById("fileInput");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let images = {};

fileInput.addEventListener("change", () => {
  const files = fileInput.files;
  console.log(images)
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const reader = new FileReader();

  reader.onload = () => {
    let img = new Image();
    let name = files[i].name;
    images[name] = img;
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
    };
    img.src = reader.result;
  };
  reader.readAsDataURL(file);
  }
});
