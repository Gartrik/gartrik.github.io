// Sélection des éléments DOM
const navbarSearch = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
const resetBtn = document.getElementById('clear-btn');
const resultsContainer = document.querySelector('.results-container');

function showNotification(message) {
  const notification = document.createElement('div');
  notification.innerText = message;

  // Style de la notification
  Object.assign(notification.style, {
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      backgroundColor: '#333',
      color: '#fff',
      padding: '10px 20px',
      borderRadius: '5px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      zIndex: '1000',
  });

  document.body.appendChild(notification);

  // Supprimer la notification après 3 secondes
  setTimeout(() => {
      document.body.removeChild(notification);
  }, 3000);
}

// Fonction pour récupérer les recommandations
async function fetchRecommendations(keyword) {
  try {
    const response = await fetch('travel_recommendation_api.json'); // Vérifiez que le fichier existe et est accessible
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // Normaliser le mot-clé saisi
    const normalizedKeyword = keyword.toLowerCase();

    // Ajouter des variations courantes des mots-clés
    const keywordVariations = [normalizedKeyword];
    if (normalizedKeyword.includes('beach')) {
      keywordVariations.push('beaches');
    } else if (normalizedKeyword.includes('temple')) {
      keywordVariations.push('temples');
    } else if (normalizedKeyword.includes('country')) {
      keywordVariations.push('countries');
    }

    // Rechercher dans les différentes sections du JSON
    const recommendations = [];

    // Recherche dans les pays
    if (data.countries && Array.isArray(data.countries)) {
      data.countries.forEach((country) => {
        if (country.cities && Array.isArray(country.cities)) {
          country.cities.forEach((city) => {
            if (
              keywordVariations.some((variation) =>
                city.name.toLowerCase().includes(variation) ||
                city.description.toLowerCase().includes(variation)
              )
            ) {
              recommendations.push({
                ...city,
                type: 'city', // Ajout d'un type pour différencier les résultats
              });
            }
          });
        }
      });
    }

    // Recherche dans les temples
    if (data.temples && Array.isArray(data.temples)) {
      data.temples.forEach((temple) => {
        if (
          keywordVariations.some((variation) =>
            temple.name.toLowerCase().includes(variation) ||
            temple.description.toLowerCase().includes(variation)
          )
        ) {
          recommendations.push({
            ...temple,
            type: 'temple', // Ajout d'un type pour différencier les résultats
          });
        }
      });
    }

    // Recherche dans les plages
    if (data.beaches && Array.isArray(data.beaches)) {
      data.beaches.forEach((beach) => {
        if (
          keywordVariations.some((variation) =>
            beach.name.toLowerCase().includes(variation) ||
            beach.description.toLowerCase().includes(variation)
          )
        ) {
          recommendations.push({
            ...beach,
            type: 'beach',
            type: 'temple', // Ajout d'un type pour différencier les résultats
          });
        }
      });
    }

    return recommendations;
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    return [];
  }
}

// Fonction pour afficher l'heure du pays recommandé
function displayCountryTime(timeZone) {
  try {
    const options = {
      timeZone,
      hour12: true,
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
    };
    return new Date().toLocaleTimeString('en-US', options);
  } catch (error) {
    console.error('Error displaying country time:', error);
    return 'N/A';
  }
}

// Fonction pour afficher les résultats
function displayResults(recommendations) {
  resultsContainer.innerHTML = ''; // Réinitialise les résultats

  if (recommendations.length === 0) {
    resultsContainer.innerHTML += `
      <div class="failed-result-box">
        <p class="failed-result-description">No results found for your search.</p>
      </div>
    `;
    return;
  }

  recommendations.forEach((recommendation) => { // Affiche tous les résultats
    const currentTime = displayCountryTime(recommendation.timeZone); // Obtient l'heure locale
    resultsContainer.innerHTML += `
      <div class="result-box">
        <img src="${recommendation.imageUrl}" alt="${recommendation.name}" class="result-image">
        <h3 class="result-title">${recommendation.name}</h3>
        <p class="result-description-time">Current time: ${currentTime}</p>
        <p class="result-description">${recommendation.description}</p>
        <button class="result-visit-btn">Visit</button>
      </div>
    `;
  });
}

// Fonction pour réinitialiser les résultats
function clearResults() {
  resultsContainer.innerHTML = '';
}

// Gestion de la recherche
function handleSearch() {
  const keyword = navbarSearch.value.toLowerCase().trim();
  if (!keyword) {
    alert('Please enter a keyword to search!');
    return;
  }

  fetchRecommendations(keyword)
    .then(displayResults)
    .catch((error) => console.error('Error:', error));
}

// Gestion de la réinitialisation
function handleReset() {
  clearResults();
  navbarSearch.value = '';
}

// Gestion de l'événement de soumission du formulaire
const contactForm = document.getElementById('contact-form');
const contactBox = document.querySelector('.contact-box');

contactForm?.addEventListener('submit', function (event) {
  event.preventDefault();

  contactBox.innerHTML = `
    <div class="thank-you-message">
      <h2>Thank You!</h2>
      <p>Your message has been successfully sent.</p>
      <p>We will get back to you shortly.</p>
    </div>
  `;
});

// Ajout des écouteurs d'événements
navbarSearch.addEventListener('keypress', function (event) {
  if (event.key === 'Enter') {
    event.preventDefault();
    handleSearch();
  }
});

searchBtn?.addEventListener('click', handleSearch);
resetBtn?.addEventListener('click', handleReset);


const bookNowButton = document.getElementById('book-now-btn');
bookNowButton.addEventListener('click', function() {
    const notification = document.createElement('div');
    notification.innerText = 'Coming Soon!';
    
    // Style de la notification
    notification.style.position = 'fixed';
    notification.style.top = '50%';
    notification.style.left = '50%';
    notification.style.transform = 'translate(-50%, -50%)'; // Centre horizontalement et verticalement
    notification.style.backgroundColor = '#333';
    notification.style.color = '#fff';
    notification.style.padding = '10px 20px';
    notification.style.borderRadius = '5px';
    notification.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
    notification.style.zIndex = '1000'; // S'assurer que c'est au-dessus des autres éléments

    // Ajouter la notification au DOM
    document.body.appendChild(notification);

    // Supprimer la notification après 3 secondes
    setTimeout(() => {
        document.body.removeChild(notification);
    }, 3000);
});

// Gestion de la délégation des événements pour les boutons dynamiques
resultsContainer.addEventListener('click', (event) => {
  if (event.target.classList.contains('result-visit-btn')) {
      showNotification('Coming Soon!');
  }
});

// Gestion des événements liés à la recherche
searchBtn?.addEventListener('click', handleSearch);
resetBtn?.addEventListener('click', clearResults);
navbarSearch?.addEventListener('keypress', function (event) {
  if (event.key === 'Enter') {
      event.preventDefault();
      handleSearch();
  }
});

