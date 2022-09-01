import { Notify } from 'notiflix/build/notiflix-notify-aio';
const axios = require('axios').default;

const API_KEY = '29655167-0362cdc5085e0df03dd8615c7';
const BASE_URL = 'https://pixabay.com/api/';

const refs = {
  gallery: document.querySelector('.gallery'),
  form: document.querySelector('.search-form'),
  input: document.querySelector('[name="searchQuery"]'),
};

const searchParams = new URLSearchParams({
  key: API_KEY,
  q: '',
  image_type: 'photo',
  orientation: 'horizontal',
  safeSearch: true,
});

refs.form.addEventListener('submit', onSearch);

function onSearch(evt) {
  searchParams.set('q', refs.input.value);
  evt.preventDefault();
  fetchImages(searchParams);
  // populateGallery();
}

async function fetchImages(searchParams) {
  const response = await axios.get(`${BASE_URL}?${searchParams}`);
  return response;
}

async function populateGallery() {
  const images = await fetchImages();
  // images.hits.forEach(image => console.log(image));
}
