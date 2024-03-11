const form = document.querySelector('#form');

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const options = document.querySelector('#options').value;

  const apiUrl = 'https://api.waifu.im/search';
  const params = {
    included_tags: [options],
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

  const requestUrl = `${apiUrl}?${queryParams.toString()}`;

  try {
    const image = await fetch(requestUrl)
      .then((response) => response.json())
      .then((data) => data.images[0].url);

    const imageElement = document.querySelector('#waifu');

    imageElement.src = image;
  } catch (error) {
    console.error(`Ocorreu um erro: ${error}`);
  }
});
