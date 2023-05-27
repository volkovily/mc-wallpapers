const fileInput = document.getElementById("fileInput");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let images = {};

fileInput.addEventListener("change", () => {
  const files = fileInput.files;
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const reader = new FileReader();

  reader.onload = () => {
    let img = new Image();
    let name = file.name.replace(".png", "");
    images[name] = img;
    img.src = URL.createObjectURL(file);
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
    };
  };
  reader.readAsDataURL(file);
  }
});

Caman.Filter.register("remap", function (image, uChannel, vChannel) {
  let pixelData = canvas.getContext("2d").getImageData(0, 0, canvas.width, canvas.height).data;
  this.process("remap", function (rgba) {
    let location = (rgba[vChannel] * canvas.width + rgba[uChannel]) * 4;
    rgba.r = (rgba.a * pixelData[location + 0]) / 255;
    rgba.g = (rgba.a * pixelData[location + 1]) / 255;
    rgba.b = (rgba.a * pixelData[location + 2]) / 255;
    rgba.a = (rgba.a * pixelData[location + 3]) / 255;
  });
});
