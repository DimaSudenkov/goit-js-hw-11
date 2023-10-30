import axios from 'axios';
import Notiflix from 'notiflix';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const BASE_URL = 'https://pixabay.com/api/'
const API_KEY = '40353085-e3455b0a542e3d0387c32db14'

async function fetchData(choose) {
  try {
    const response = await axios.get(`${BASE_URL}?key=${API_KEY}&q=${choose}&image_type=photo&orientation=horizontal&safesearch=true`);
    if (response.data.hits.length === 0) {
      Notify.failure('Sorry, there are no images matching your search query. Please try again.')
    };
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

const selectors = {
  searchForm: document.querySelector('#search-form'),
}

selectors.searchForm.addEventListener('submit', handlerSubmit);

async function handlerSubmit(evt) {
  evt.preventDefault();
  const { searchQuery } = evt.currentTarget.elements;
  const data = searchQuery.value;
  const searchData = await fetchData(data)
  return searchData


}
