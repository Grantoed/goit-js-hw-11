const axios = require('axios').default;

const API_KEY = '29655167-0362cdc5085e0df03dd8615c7';

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

  const response = await axios.get(`${BASE_URL}?${searchParams}`);
  return response;
}
