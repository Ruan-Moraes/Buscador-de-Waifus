'use strict';

const tagsList = new Set(['waifu']);
const addTag = document.querySelector('#addTag');
addTag.addEventListener('click', () => {
  const addedTag = document.querySelector('#availableLabels').value;

  addTagToList(addedTag);
  addTagInDOM(addedTag);
  addEventToRemove();
});

function addTagToList(addedTag) {
  if (addedTag === '') return;

  tagsList.add(addedTag);
}

function addTagInDOM(addedTag) {
  if (addedTag === '') return;
  if (verifyIfTagExists()) return;

  const tagElement = document.createElement('li');
  tagElement.classList.add('tagItem');
  tagElement.innerHTML = addedTag;

  const containerTags = document.querySelector('#tagsContainer');
  containerTags.appendChild(tagElement);
}

function verifyIfTagExists() {
  const tagsElement = document.querySelectorAll('#tagsContainer li');

  for (let i = 0; i < tagsElement.length; i++) {
    if (
      tagsElement[i].innerHTML ===
      document.querySelector('#availableLabels').value
    )
      return true;
  }

  return false;
}

function addEventToRemove() {
  const tagsElement = document.querySelectorAll('#tagsContainer li');

  tagsElement.forEach((tag) => {
    tag.addEventListener('click', () => {
      tagsList.delete(tag.innerHTML);

      tag.remove();
    });
  });
}

// Main function

document.querySelector('#searchWaifu').addEventListener('click', async () => {
  changingTheButtonState();

  const paramsUrl = createRequest(Array.from(tagsList));
  const waifuImageURL = await getWaifu(paramsUrl);

  changingTheButtonState();

  if (waifuImageURL) {
    addImageToDOM(waifuImageURL);
    addImageForDownload(waifuImageURL);
  }
});

function changingTheButtonState() {
  const button = document.querySelector('#searchWaifu');

  if (button.innerText === 'Buscar Waifu') {
    button.innerText = 'Buscando Waifu...';
  } else {
    button.innerText = 'Buscar Waifu';
  }
}

function createRequest(included_tags) {
  const params = {
    included_tags: included_tags,
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
  const apiUrl = 'https://api.waifu.im/search';
  const requestUrl = `${apiUrl}?${paramsUrl}`;

  try {
    return await fetch(requestUrl)
      .then((response) => response.json())
      .then((response) => response.images[0].url);
  } catch (error) {
    console.error(error);

    alert(
      `Não foi possível encontrar uma waifu com as tags selecionadas. Tente novamente! Lembre-se de está conectado a internet.`
    );

    return false;
  }
}

function addImageToDOM(waifuImageURL) {
  const image = document.querySelector('#waifuImage');

  if (placeLoadingSVG(image, waifuImageURL)) {
    setTimeout(() => {
      image.removeAttribute('class');
      image.src = waifuImageURL;
    }, 50);
  }
}

function placeLoadingSVG(image, waifuImageURL) {
  if (image.src !== waifuImageURL) {
    image.src = './assets/loading/ripples.svg';

    return true;
  }

  alert('Imagem já carregada!');

  return false;
}

async function addImageForDownload(waifuImageURL) {
  const downloadLink = document.querySelector('#downloadTheWaifu');

  const imageBlob = await fetch(waifuImageURL).then((response) =>
    response.blob()
  );

  downloadLink.href = URL.createObjectURL(imageBlob);
}
