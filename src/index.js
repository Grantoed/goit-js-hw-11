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
  populateGallery();
}

async function fetchImages(searchParams) {
  const response = await axios.get(`${BASE_URL}?${searchParams}`);
  const images = response.data.hits;
  return images;
}

async function populateGallery() {
  const images = await fetchImages(searchParams);
  const markup = images
    .map(
      image => `<div class="photo-card">
  <img src="${image.webformatURL}" alt="${image.tags}" loading="lazy" />
  <div class="info">
    <p class="info-item">
      <b>Likes</b>
      <span>${image.likes}<span>
    </p>
    <p class="info-item">
      <b>Views</b>
      <span>${image.views}<span>
    </p>
    <p class="info-item">
      <b>Comments</b>
      <span>${image.comments}<span>
    </p>
    <p class="info-item">
      <b>Downloads</b>
      <span>${image.downloads}<span>
    </p>
  </div>
</div>`
    )
    .join('');

  if (images.length === 0) {
    Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    return;
  }

  refs.gallery.innerHTML = markup;
}
