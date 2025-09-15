let alldata = [];
const mainn = document.getElementById("mainn");
const select1 = document.getElementById("select1");
const Togglebtn = document.getElementById("Togglebtn");
const outerdiv = document.getElementById("outerdiv");
const modalContent = document.getElementById("modalContent");
const imageContainer = document.getElementById("imageContainer");

fetch("https://restcountries.com/v3.1/all?fields=name,flags,population,region,continents")
    .then(res => res.json())
    .then(data => {
        alldata = data;
        showCountries(alldata);
    });

function countryCard(country) {
    const div = document.createElement("div");
    div.classList.add("card");
    div.innerHTML = `<img src="${country.flags.png}" alt="${country.name.common}">
                       <h3>${country.name.common}</h3>
                       <p>Population: ${country.population}</p>
                       <p>Region: ${country.region}</p>`;
    div.addEventListener("click", () => openModal(country));
    return div;
}

function showCountries(list) {

    mainn.innerHTML = "";
    list.forEach(c => mainn.appendChild(countryCard(c)));
}

function openModal(country) {

    modalContent.innerHTML = `<img class="flag-lg" src="${country.flags.png}" alt="${country.name.common}">
                                <h2>${country.name.common}</h2>
                                <p>Population: ${country.population}</p>
                                <p>Region: ${country.region}</p>`;
    outerdiv.style.display = "flex";

    imageContainer.innerHTML = '<p>Loading images...</p>';

    fetch(`https://pixabay.com/api/?key=50279977-b2512726339180646dc912675&q=${encodeURIComponent(country.name.common)}&per_page=10`)
        .then(r => r.json())

        .then(data => {
            imageContainer.innerHTML = '';
            if (data.hits.length > 0) {
                data.hits.forEach(img => {
                    const im = document.createElement('img');
                    im.src = img.webformatURL;
                    im.alt = img.tags;
                    im.addEventListener('click', () => window.open(img.largeImageURL, '_blank'));
                    imageContainer.appendChild(im);
                });

            } else {

                imageContainer.innerHTML = '<p>No images found</p>';
            }
        })
        .catch(err => {

            imageContainer.innerHTML = '<p>Error loading images</p>';
        });
}

function closeModal() {
    outerdiv.style.display = "none";

}

document.getElementById("searchInput").addEventListener("input", (e) => {
    const val = e.target.value.toLowerCase();

    const filtered = alldata.filter(c => c.name.common.toLowerCase().includes(val));
    showCountries(filtered);
});

// Populate continents
const continents = ["all", "Africa", "Antarctica", "Asia", "Europe", "Oceania", "North America", "South America"];
continents.forEach(c => {
    const opt = document.createElement("option");
    opt.value = c;
    opt.textContent = c;
    select1.appendChild(opt);
});

select1.addEventListener("change", e => {

    if (e.target.value === "all") showCountries(alldata);
    else showCountries(alldata.filter(c => c.continents.includes(e.target.value)));
});

Togglebtn.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    Togglebtn.innerText = document.body.classList.contains("dark-mode") ? "Dark Mode" : "Light Mode";

});

document.getElementById("arrowup").addEventListener("click", () => {

    window.scrollTo({ top: 0, behavior: "smooth" });
});
