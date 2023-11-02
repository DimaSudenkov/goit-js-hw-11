import Notiflix from 'notiflix';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import axios from 'axios';


const API_KEY = '40353085-e3455b0a542e3d0387c32db14';
const BASE_URL = 'https://pixabay.com/api/';


const selectors = {
  searchForm: document.querySelector('.search-form'),
  gallery: document.querySelector('.gallery'),
  button: document.querySelector('.load-more')
}


async function fetchData(query, page) {
  try {
    const res = await axios.get(
      `${BASE_URL}?key=${API_KEY}&q=${query}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${page}`
    );
    return res.data
  } catch (error) {
    console.error(error);
  }
}

const lightbox = new SimpleLightbox('.gallery a');

let page = 1;
let query = '';

selectors.button.style.visibility = 'hidden'

selectors.searchForm.addEventListener('submit', handlerSubmit);

async function handlerSubmit(evt) {
  evt.preventDefault();
  selectors.gallery.innerHTML = '';
  page = 1;

  query = evt.target.elements.searchQuery.value;

  const dataCard = await fetchData(query, page);

  console.log(dataCard.hits.length);
  console.log(dataCard.totalHits);

  if (dataCard.total > 0) {
    Notiflix.Notify.success(`Hooray! We found ${dataCard.total} images.`);
  }

  if (dataCard.hits.length < dataCard.totalHits) {
    selectors.button.style.visibility = 'visible';
  }

  const cardsData = dataCard.hits;
  const markupCreate = pageMarkup(cardsData)

  if (!cardsData.length) {
    Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');

  } else {
    selectors.gallery.insertAdjacentHTML('beforeend', markupCreate);
    lightbox.refresh();
  }
}

function pageMarkup(cardsData) {
  return cardsData.map(card => {
    const { webformatURL, largeImageURL, tags, likes, views, comments, downloads } = card;
    return `<div class="photo-card">
                <a class = "gallery__link" href="${largeImageURL}">
                 <img class= "gallery-img" src="${webformatURL}" alt="${tags}" loading="lazy" />
                  <div class="info">
                    <p class="info-item">
                      <b>Likes</b><br>
                       ${likes}
                    </p>
                    <p class="info-item">
                      <b>Views</b><br>
                        ${views}
                    </p>
                     <p class="info-item">
                      <b>Comments</b><br>
                        ${comments}
                     </p>
                     <p class="info-item">
                        <b>Downloads</b><br>
                          ${downloads}
                     </p>
                     </div>
                     </a>
                  </div>
                  `}).join('');
}


selectors.button.addEventListener('click', handlerClick)

async function handlerClick() {

  page += 1;
  const dataFetch = await fetchData(query, page);
  const cardsData = dataFetch.hits;
  const createMarkup = pageMarkup(cardsData);
  selectors.gallery.insertAdjacentHTML('beforeend', createMarkup);
  lightbox.refresh();

  console.log(cardsData.length);
  console.log(dataFetch.totalHits);

  if (page * 40 >= dataFetch.totalHits) {
    Notiflix.Notify.failure("We're sorry, but you've reached the end of search results.");
    selectors.button.style.visibility = 'hidden';
  }

  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: "smooth",
  });
}
