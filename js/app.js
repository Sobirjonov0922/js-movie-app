const API_KEY = '2b966d03-d434-429b-a19e-8e3ead5f476d'
const API_URL_POPULAR = 'https://kinopoiskapiunofficial.tech/api/v2.2/films/top?type=TOP_100_POPULAR_FILMS&page=1'
const API_URL_SEARCH = 'https://kinopoiskapiunofficial.tech/api/v2.1/films/search-by-keyword?keyword='
const API_URL_MOVIE_DETAILS = 'https://kinopoiskapiunofficial.tech/api/v2.2/films/'

getMovies(API_URL_POPULAR)

async function getMovies(url) {
  const resp = await fetch(url, {
    headers: {
      "Content-Type": "appliaction/json",
      "X-API-KEY": API_KEY
    }
  })
  const respData = await resp.json()
  showMovies(respData)
}

function getClassByRate(vote) {
  if (vote >= 7) {
    return "green"
  } else if (vote > 5) {
    return "orange"
  } else {
    return "red"
  }
}

function showMovies(data) {
  const moviesEl = document.querySelector(".movies__cards")

  // Очищаем предыдущие фильмы
  document.querySelector('.movies__cards').innerHTML = ''

  data.films.forEach(movie => {
    const movieEl = document.createElement('div')
    movieEl.classList.add('movies__card')
    movieEl.innerHTML = `
      <div class="card__cover-inner">
        <img
          src="${movie.posterUrlPreview}"
          alt="${movie.nameEn}"
          class="card__cover"
        >
        <div class="card__cover-darkened"></div>
      </div>
      <div class="card__info">
        <h3 class="card__title">${movie.nameRu}</h3>
        <p class="card__genre">
          ${movie.genres.map(genre => ` ${genre.genre}`)}
        </p>
        ${movie.rating ? (
          `<span class="card__rating card__rating-${getClassByRate(movie.rating)}">${movie.rating}</span>`
          ) : (
            ''
          )
        }
      </div>
    `
    movieEl.addEventListener('click', () => openModal(movie.filmId))
    moviesEl.append(movieEl)
  });
}

let form = document.querySelector('form'),
    search = document.querySelector('.nav__search')

form.addEventListener('submit', function (e) {
  e.preventDefault()

  const apiSearchUrl = `${API_URL_SEARCH}${search.value}`
  if (search.value) {
    getMovies(apiSearchUrl)

    search.value = ''
  }
})

// Modal block
let modalEl = document.querySelector('.modal')

async function openModal(id) {
  const resp = await fetch(API_URL_MOVIE_DETAILS + id, {
    headers: {
      "Content-Type": "appliaction/json",
      "X-API-KEY": API_KEY
    }
  })
  const respData = await resp.json()

  modalEl.classList.add('active')
  document.body.classList.add('stop-scrolling')
  
  modalEl.innerHTML = `
    <div class="modal__card">
      <img src="${respData.posterUrlPreview}" alt="${respData.nameEn}" class="modal__movie-backdrop">
      <h2 class="modal__title">Название: ${respData.nameRu}</h2>
      <h3 class="modal__release">Дата выпуска: ${respData.year}</h3>
      <ul class="modal__info">
        <div class="loader"></div>
        <li class="modal__item modal__genre">Жанр: ${respData.genres.map((el) => `<span>${el.genre}</span>`)}</li>
        ${respData.filmLength ? `<li class="modal__item modal__runtime">Время: ${respData.filmLength} мин</li>` : ''}
        <li class="modal__item modal__website">Сайт: <a href="${respData.webUrl}" target="_blank" class="modal__website-link">${respData.webUrl}</a></li>
        <li class="modal__item modal__description">Описание: ${respData.description}</li>
      </ul>
      <button class="modal__close" type="button">Закрыть</button>
    </div>
  `

  let btnClose = document.querySelector('.modal__close')

  btnClose.addEventListener('click', () => closeModal())
}

function closeModal() {
  modalEl.classList.remove('active')
  document.body.classList.remove('stop-scrolling')
}

window.addEventListener('click', (e) => {
  if (e.target === modalEl) {
    closeModal()
  }
})

window.addEventListener('keydown', (e) => {
  if (e.keyCode === 27) {
    closeModal()
  }
})