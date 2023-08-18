const BASE_URL = 'https://swapi.dev/api/';
const ITEMS_PER_PAGE = 10;

let currentCategory = 'people';
let currentPage = 1;

document.addEventListener('DOMContentLoaded', init);

function init() {
    setupCategoryButtonListeners();
    fetchData();
}

function fetchData() {
    const url = buildURL();

    fetch(url)
        .then(parseResponse)
        .then(data => {
            displayData(data);
            handlePagination(data.count);
        })
        .catch(handleError);
}

function buildURL() {
    return `${BASE_URL}${currentCategory}/?page=${currentPage}`;
}

function parseResponse(response) {
    return response.json();
}

function displayData(data) {
    const dataList = document.getElementById('data-list');
    clearElement(dataList);

    data.results.forEach(item => {
        const listItem = createListItem(item);
        dataList.appendChild(listItem);
    });
}

function clearElement(element) {
    element.innerHTML = '';
}

function createListItem(item) {
    const li = document.createElement('li');
    li.classList.add('list-group-item', 'd-flex', 'align-items-center');

    const img = document.createElement('img');
    img.src = getIconSrc(currentCategory);
    img.alt = currentCategory;
    img.style.height = '24px';  // height of the icon
    img.style.marginRight = '8px'; // space between the icon and the text

    const span = document.createElement('span');
    span.textContent = item.name || item.title;

    li.appendChild(img);
    li.appendChild(span);
    li.addEventListener('click', () => showModal(item));

    return li;
}

function getIconSrc(category) {
    switch (category) {
        case 'people':
            return 'people.png';
        case 'planets':
            return 'planet.png';
        case 'starships':
            return 'starship.png';
        default:
            return '';
    }
}

function showModal(item) {
    const modal = document.getElementById('modal');
    const modalText = document.getElementById('modal-text');
    const closeModalBtn = document.querySelector('.modal-close');

    modalText.textContent = JSON.stringify(item, null, 2);

    modal.style.display = "block";

    closeModalBtn.onclick = function () {
        modal.style.display = "none";
    };

    window.onclick = function (event) {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    };
}

function handlePagination(totalCount) {
    const paginationDiv = document.getElementById('pagination');
    clearElement(paginationDiv);

    const totalPages = calculateTotalPages(totalCount);

    for (let i = 1; i <= totalPages; i++) {
        const pageButton = createPageButton(i);
        paginationDiv.appendChild(pageButton);
    }
}

function calculateTotalPages(count) {
    return Math.ceil(count / ITEMS_PER_PAGE);
}

function createPageButton(pageNumber) {
    const btn = document.createElement('button');
    btn.classList.add('btn', 'btn-secondary', 'mr-2');
    btn.textContent = pageNumber;

    if (pageNumber === currentPage) {
        btn.classList.add('active');
    }

    btn.addEventListener('click', () => setPageAndFetch(pageNumber));

    return btn;
}

function setPageAndFetch(pageNumber) {
    currentPage = pageNumber;
    fetchData();
}

function handleError(error) {
    console.error('Error:', error);
}

function setupCategoryButtonListeners() {
    setupCategoryButtonListener('people', 'people');
    setupCategoryButtonListener('planets', 'planets');
    setupCategoryButtonListener('starships', 'starships');
}

function setupCategoryButtonListener(id, category) {
    document.getElementById(id).addEventListener('click', () => setCategoryAndFetch(category));
}

function setCategoryAndFetch(category) {
    currentCategory = category;
    fetchData();
}

function showModal(item) {
    const modalTitle = document.getElementById('modal-title');
    const modalText = document.getElementById('modal-text');
    const modal = $('#exampleModal');  // jQuery selector

    let formattedData = '';
    if (currentCategory === 'people') {
        formattedData += `Name: ${item.name}\nHeight: ${item.height}cm\nMass: ${item.mass}kg\nHair Color: ${item.hair_color}\nSkin Color: ${item.skin_color}\nEye Color: ${item.eye_color}\nBirth Year: ${item.birth_year}\nGender: ${item.gender}\n\nFilms: ${item.films.length}`;
    } else if (currentCategory === 'planets') {
        formattedData += `Name: ${item.name}\nRotation Period: ${item.rotation_period}hrs\nOrbital Period: ${item.orbital_period} days\nDiameter: ${item.diameter}km\nClimate: ${item.climate}\nGravity: ${item.gravity}\nTerrain: ${item.terrain}\nSurface Water: ${item.surface_water}%\nPopulation: ${item.population}\n\nFilms: ${item.films.length}`;
    } else if (currentCategory === 'starships') {
        formattedData += `Name: ${item.name}\nModel: ${item.model}\nManufacturer: ${item.manufacturer}\nCost in Credits: ${item.cost_in_credits}\nLength: ${item.length}m\nMax Atmosphering Speed: ${item.max_atmosphering_speed}\nCrew: ${item.crew}\nPassengers: ${item.passengers}\nCargo Capacity: ${item.cargo_capacity}\nConsumables: ${item.consumables}\nHyperdrive Rating: ${item.hyperdrive_rating}\nStarship Class: ${item.starship_class}\n\nFilms: ${item.films.length}`;
    }

    modalTitle.textContent = item.name || item.title;
    modalText.textContent = formattedData;

    modal.modal('show');
}
