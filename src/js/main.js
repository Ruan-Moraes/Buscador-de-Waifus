const form = document.querySelector("#form");

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  
  changingTheButtonState();

  const paramsUrl = createRequest();
  const waifuImageURL = await getWaifu(paramsUrl);

  changingTheButtonState();

  addImageToDOM(waifuImageURL);
  addImageForDownload(waifuImageURL);
});

function createRequest() {
  const preMadeTags = document.querySelector("#options").value || "waifu";
  const params = {
    included_tags: [preMadeTags],
  };

  const queryParams = new URLSearchParams();

  for (const key in params) {
    if (Array.isArray(params[key])) {
      params[key].forEach((value) => {
        queryParams.append(key, value);
      });
    } else {
      queryParams.set(key, params[key]);
    }
  }

  return queryParams.toString();
}

async function getWaifu(paramsUrl) {
  const apiUrl = "https://api.waifu.im/search";
  const requestUrl = `${apiUrl}?${paramsUrl}`;

  try {
    return await fetch(requestUrl).then((response) => response.json()).then((response) => response.images[0].url);
  } catch (error) {
    changingTheButtonState();

    console.error(`Ocorreu um erro: ${error}`);
  }
}

function changingTheButtonState () {
  const button = document.querySelector("#search-waifu");
  
  if (button.innerHTML === "Buscar Waifu") {
    button.innerHTML = "Buscando Waifu...";
  } else {
    button.innerHTML = "Buscar Waifu";
  }
}

function addImageToDOM(waifuImageURL) { 
  const image = document.querySelector("#waifu-image");

  loadingImageDom(image, waifuImageURL)

  setTimeout(() => {
    image.src = waifuImageURL;
  }, 500);
}

function loadingImageDom (image, waifuImageURL) {
  if (image.src !== waifuImageURL) {
    image.src = "./assets/loading/loading.svg";
  }
}

async function addImageForDownload(waifuImageURL) {
  const downloadLink = document.querySelector("#download");

  const imageBlob = await fetch(waifuImageURL).then((response) => response.blob());

  downloadLink.href = URL.createObjectURL(imageBlob);
}

