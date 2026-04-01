const searchInput = document.querySelector(".landing__search-bar");
const searchBtn = document.querySelector(".search-btn");
const animeGrid = document.querySelector(".anime-grid");
const filterButtons = document.querySelectorAll(".filter-btn")
const sortSelect = document.querySelector('.sort-select')
const resetFilterBtn = document.querySelector('.reset-filters--btn')
const resultsSection = document.getElementById('results')



async function renderAnime(query) {
resultsSection.classList.add('anime__loading')
animeGrid.classList.add('anime-grid--hide')

  const response = await fetch(`https://api.jikan.moe/v4/anime?q=${query}`);
  const data = await response.json();
  currentResults = data.data;

  resultsSection.classList.remove('anime__loading')
  animeGrid.classList.remove('anime-grid--hide')

    currentResults.forEach(anime => {
        anime.safeTitle = anime.title_english || anime.title || "Unknown";
        anime.genreList = anime.genres.map(g => g.name).join(", ") || "Unknown"
    });
    
    renderGrid()  
}

function renderGrid() {

    animeGrid.innerHTML = '';

     if (currentResults.length <= 0) {
        const failedSearch = document.createElement('div')
        failedSearch.classList.add('failed--pop-up')
    
            failedSearch.innerHTML = `
                    <img class="pop-up--img" src="./assets/download.png" alt="">
                    <h1 class="pop-up--title">Sorry, we couldn't find the anime you were looking for... <br>
                    Please try again.</h1>`
            console.log('no results')
            animeGrid.appendChild(failedSearch)
            return
        }

    currentResults.forEach(anime => {
        const card = document.createElement("div");
        card.classList.add('anime-card');

        card.innerHTML = `
            <img class="anime__img" src="${anime.images.jpg.image_url}" alt="${anime.safeTitle}">
            <h3 class="anime__title">${anime.safeTitle}</h3>
            <p class="anime__genre"><span class="bold"> Genre's: </span>${anime.genreList}</p>
        `;

        animeGrid.appendChild(card);
    });

}

function applyFilter(type) {
    if (type === 'popular') {
        currentResults.sort((a, b) => b.score - a.score)
    }

    if (type === 'new') {
        currentResults.sort((a, b) => getAiredDate(b) - getAiredDate(a))
    }

    if (type === 'old') {
        currentResults.sort((a, b) => getAiredDate(a) - getAiredDate(b))
    }

    if (type === 'az') {
        currentResults.sort((a, b) => a.safeTitle.localeCompare(b.safeTitle))
    }

    if (type === 'za') {
        currentResults.sort((a, b) => b.safeTitle.localeCompare(a.safeTitle))
    }

    renderGrid()
}


function getAiredDate(anime) {
    const from = anime?.aired?.prop?.from
    if (!from || !from.year) return 0

    return new Date(from.year, (from.month || 1) - 1, from.day || 1).getTime()
}

function submitSearch() {
    const query = searchInput.value;
    renderAnime(query);
}


filterButtons.forEach(btn => {
    btn.addEventListener('click',  () => {
        filterButtons.forEach(b => b.classList.remove('filter-btn-active'))
        btn.classList.add('filter-btn-active')
    const type = btn.dataset.filter

    applyFilter(type)
    console.log(type)
    })
})

sortSelect.addEventListener('change', () => {
    const selected = sortSelect.options[sortSelect.selectedIndex]
    const type = selected.dataset.filter

    if (!type) return 

    applyFilter(type)
    console.log(type)
    console.log(sortSelect.innerHTML)

})

resetFilterBtn.addEventListener('click', () => {
   filterButtons.forEach(btn => btn.classList.remove('filter-btn-active'))
   sortSelect.selectedIndex = 0
    searchInput.value = ''
    renderAnime('one piece')
})

searchBtn.addEventListener("click", submitSearch)
searchInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") 
    submitSearch()
})

window.addEventListener("DOMContentLoaded", () => {
    renderAnime('one piece')
})


