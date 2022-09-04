import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

import { searchParams, fetchImages } from './js/pixabay-api';

const refs = {
  gallery: document.querySelector('.gallery'),
  form: document.querySelector('.search-form'),
  input: document.querySelector('[name="searchQuery"]'),
};

refs.form.addEventListener('submit', onSearch);

function onSearch(evt) {
  searchParams.set('q', refs.input.value);
  evt.preventDefault();
  populateGallery();
}

async function populateGallery() {
  const response = await fetchImages(searchParams);
  const images = response.data.hits;
  const imagesFound = images.length !== 0;
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

  if (imagesFound) {
    Notify.success(`Enjoy ${response.data.totalHits} images`);
  } else {
    Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    return;
  }

  refs.gallery.innerHTML = markup;

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
