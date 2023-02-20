const API_KEY = '2b966d03-d434-429b-a19e-8e3ead5f476d'
const API_URL_POPULAR = 'https://kinopoiskapiunofficial.tech/api/v2.2/films/top?type=TOP_100_POPULAR_FILMS&page=1'
const API_URL_SEARCH = 'https://kinopoiskapiunofficial.tech/api/v2.1/films/search-by-keyword?keyword='

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
      <div class="card_info">
        <h3 class="card_title">${movie.nameRu}</h3>
        <p class="card_genre">
          ${movie.genres.map(genre => ` ${genre.genre}`)}
        </p>
        ${movie.rating ? (
          `<span class="card_rating card_rating-${getClassByRate(movie.rating)}">${movie.rating}</span>`
          ) : (
            ''
          )
        }
      </div>
    `

    moviesEl.append(movieEl)
  });
}

let form = document.querySelector('form'),
    search = document.querySelector('.header__search')

form.addEventListener('submit', function (e) {
  e.preventDefault()

  const apiSearchUrl = `${API_URL_SEARCH}${search.value}`
  if (search.value) {
    getMovies(apiSearchUrl)

    search.value = ''
  }
})