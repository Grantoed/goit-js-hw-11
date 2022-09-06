import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

import * as pixabayAPI from './js/pixabay-api';

const API_KEY = '29655167-0362cdc5085e0df03dd8615c7';

const searchParams = new URLSearchParams({
  key: API_KEY,
  q: '',
  image_type: 'photo',
  orientation: 'horizontal',
  safeSearch: true,
  page: 1,
});

const refs = {
  gallery: document.querySelector('.gallery'),
  form: document.querySelector('.search-form'),
  input: document.querySelector('[name="searchQuery"]'),
};

refs.form.addEventListener('submit', onSearch);

window.addEventListener('scroll', onScroll);

function onSearch(evt) {
  searchParams.set('q', refs.input.value);
  evt.preventDefault();
  resetOutput();
  pixabayAPI.resetPage();
  pixabayAPI.fetchImages(searchParams).then(r => {
    populateGallery(r);
    makeNotification(r);
  });
}

function onScroll() {
  if (
    window.scrollY + window.innerHeight >=
    document.documentElement.scrollHeight
  ) {
    loadMore().then(response => {
      if (response.data.hits.length === 0) {
        Notify.warning('You have reached the end of the list');
        window.removeEventListener('scroll', onScroll);
        return;
      } else {
        populateGallery(response);
      }
    });
  }
}

function loadMore() {
  return pixabayAPI.fetchImages(searchParams);
}

async function populateGallery(response) {
  const images = response.data.hits;
  const markup = images.reduce(
    (acc, image) =>
      acc +
      `<div class="photo-card"><a href="${image.largeImageURL}">
    <img src="${image.webformatURL}" alt="${image.tags}" loading="lazy"/></a>
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
  </div>`,
    ''
  );

  refs.gallery.insertAdjacentHTML('beforeend', markup);

  openLightbox();
}

function openLightbox() {
  let lightbox = new SimpleLightbox('.photo-card a', {
    captionsData: 'alt',
    captionDelay: '250ms',
  });
  refs.gallery.addEventListener('click', evt => {
    evt.preventDefault();
    lightbox.on('show.simplelightbox');
  });
  lightbox.refresh();
}

function resetOutput() {
  refs.gallery.innerHTML = '';
}

function makeNotification(response) {
  const imagesFound = response.data.hits.length !== 0;

  if (imagesFound) {
    Notify.success(`Enjoy ${response.data.totalHits} images`);
  } else {
    Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    return;
  }
}
