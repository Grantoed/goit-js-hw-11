export const axios = require('axios').default;

export const API_KEY = '29655167-0362cdc5085e0df03dd8615c7';
export let page = 1;

export const searchParams = new URLSearchParams({
  key: API_KEY,
  q: '',
  image_type: 'photo',
  orientation: 'horizontal',
  safeSearch: true,
  page: 1,
});

export async function fetchImages(searchParams) {
  const BASE_URL = 'https://pixabay.com/api/';

  try {
    const response = await axios.get(
      `${BASE_URL}?${searchParams}&page=${page}`
    );
    page += 1;
    return response;
  } catch (error) {
    console.log(error.message);
  }
}

export function loadMore() {
  return fetchImages(searchParams);
}

export function resetPage() {
  page = 1;
}
