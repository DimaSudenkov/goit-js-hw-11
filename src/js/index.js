import axios from 'axios';
import Notiflix from 'notiflix';


const selectors = {
  searchForm: document.querySelector('#search-form'),
  gallery: document.querySelector('.gallery'),
  button: document.querySelector('.load-more')
}

const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '40353085-e3455b0a542e3d0387c32db14';

let pageBtn = 1;
let userInput = '';

selectors.button.style.display = 'none'

async function fetchData(choose) {
  try {
    const response = await axios.get(`${BASE_URL}?key=${API_KEY}&q=${choose}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${pageBtn}`);

    if (response.data.hits.length === 0) {
      Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.')
    };

    let arr = response.data.hits;
    console.log(arr);
    makeListCard(arr)
    selectors.button.style.display = 'block'
  } catch (error) {
    console.error(error);
  }
}


selectors.searchForm.addEventListener('submit', handlerSubmit);
selectors.button.addEventListener('click', handlerClick)


async function handlerSubmit(evt) {
  evt.preventDefault();

  const { searchQuery } = evt.currentTarget.elements;
  const userInput = searchQuery.value;
  const searchData = await fetchData(userInput);

  // if (data === '') {
  //   return;
  // }

}

function pageMarkup(data) {
  return data.map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) => `
    <div class="photo-card">
      <img src="${webformatURL}" alt="${tags}" loading="lazy" />
        <div class="info">
          <p class="info-item">
            <b>Likes</b>
            ${likes}
          </p>
          <p class="info-item">
            <b>Views</b>
            ${views}
          </p>
          <p class="info-item">
            <b>Comments</b>
            ${comments}
          </p>
          <p class="info-item">
            <b>Downloads</b>
            ${downloads}
          </p>
        </div>
    </div>`).join('');
}

function handlerClick() {
  fetchData(userInput).then(() => {
    pageBtn += 1;
  });
  makeListCard();
}

function makeListCard(data) {
  const markup = pageMarkup(data);
  selectors.gallery.insertAdjacentHTML('beforeend', markup);
}