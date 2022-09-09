
// import './sass/main.scss';
import SimpleLightbox from 'simplelightbox';
import Notiflix from 'notiflix';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { getImgParams, fetchGallery } from './services/api-service.js';
// import card from 'src/templates/card.hbs';

const refs = {
  form: document.querySelector('#search-form'),
  input: document.querySelector("input[name$='searchQuery']"),
  submitBtn: document.querySelector("button[type$='submit']"),
  gallery: document.querySelector('.gallery'),
  loadMore: document.querySelector('.load-more'),
};

const incrementPage = () => (getImgParams.page += 1);
const resetPage = () => (getImgParams.page = 1);

const addBtn = () => {
  refs.loadMore.classList.remove('visually-hidden');
};

refs.loadMore.classList.add('visually-hidden');

let ligthbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  animationSpeed: 210,
  fadeSpeed: 210,
});
const getImages = e => {
  e.preventDefault();
  resetPage();
  clearCardList();
  if (!refs.input.value) {
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.',
    );

    return;
  }
  getImgParams.page = 1;
  getImgParams.q = refs.input.value.trim();
  console.log(refs.input.value.trim());
  fetchGallery(getImgParams)
    .then(data => {
      createImagesMarkup(data.hits);
      let pageValue = data.total / getImgParams.per_page;
      incrementPage();
      addBtn();
      Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);

      if (getImgParams.page >= pageValue) {
        Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
        return refs.loadMore.classList.add('visually-hidden');
      }
    })
    .catch(error => {
      Notiflix.Notify.failure(error.message);
    });
};

refs.form.addEventListener('submit', getImages);
refs.loadMore.addEventListener('click', loadImages);

function clearCardList() {
  refs.gallery.innerHTML = '';
}

function loadImages() {
  fetchGallery(getImgParams)
    .then(data => {
      let pageValue = data.total / getImgParams.per_page;
      createImagesMarkup(data.hits);
      incrementPage();

      if (getImgParams.page >= pageValue) {
        refs.loadMore.classList.add('visually-hidden');
        Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
      }
    })
    .catch(error => {
      Notiflix.Notify.failure(error.message);
    });
}

function createImagesMarkup(images) {
  const markup = card(images);
  refs.gallery.insertAdjacentHTML('beforeend', markup);
  ligthbox.refresh();
  return markup;
}