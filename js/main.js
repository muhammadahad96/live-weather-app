// Search for a City Name (e.g. Karachi) or a comma-separated City Name along with Country Code (e.g. Karachi, Pakistan)

const form = document.querySelector('.top-banner form');
const input = document.querySelector('.top-banner input');
const msg = document.querySelector('.top-banner .msg');
const list = document.querySelector('.ajax-section .cities');

// Open Weather Map API Key
const apiKey = 'c08198140ebed88f403d73af8e1decb5';

form.addEventListener('submit', e => {
  e.preventDefault();
  let inputVal = input.value;

  // search for city based on input
  const listItems = list.querySelectorAll('.ajax-section .city');
  const listItemsArray = Array.from(listItems);

  if (listItemsArray.length > 0) {
    const filteredArray = listItemsArray.filter(el => {
      let content = '';

      if (inputVal.includes(',')) {
        if (inputVal.split(',')[1].length > 2) {
          inputVal = inputVal.split(',')[0];
          content = el
            .querySelector('.city-name span')
            .textContent.toLowerCase();
        } else {
          content = el.querySelector('.city-name').dataset.name.toLowerCase();
        }
      } else {
        content = el.querySelector('.city-name span').textContent.toLowerCase();
      }
      return content === inputVal.toLowerCase();
    });

    if (filteredArray.length > 0) {
      msg.textContent = `Search result for ${
        filteredArray[0].querySelector('.city-name span').textContent
      } already loaded. Try again with a different City`;

      form.reset();
      input.focus();
      return;
    }
  }

  // Fetch API Data
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${inputVal}&appid=${apiKey}&units=metric`;

  fetch(url)
    .then(res => res.json())
    .then(data => {
      const { main, name, sys, weather } = data;
      const icon = `https://s3-us-west-2.amazonaws.com/s.cdpn.io/162656/${
        weather[0].icon
      }.svg`;

      const li = document.createElement('li');
      li.classList.add('city');
      const markup = `
      <h2 class="city-name" data-name="${name}, ${sys.country}">
        <span>${name}</span>
        <sup>${sys.country}</sup>  
      </h2>
      <div class="city-temp">${Math.round(main.temp)}
        <sup>°C</sup>
      </div>
      <figure>
        <img class="city-icon" src="${icon}" alt="${weather[0].description}">
        <figcaption>${weather[0].description}</figcaption>
      </figure>
      `;

      li.innerHTML = markup;
      list.appendChild(li);
    })
    .catch(() => {
      msg.textContent = 'Please search for a valid City';
    });

  msg.textContent = '';
  form.reset();
  input.focus();
});
