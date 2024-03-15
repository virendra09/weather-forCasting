// Define API_KEY
const API_KEY = "7da1ae56667fae3a090b32489620acdb";

// Define makeIconURL function
const makeIconURL = (iconId) =>
  `https://openweathermap.org/img/wn/${iconId}@2x.png`;

const getFormattedWeatherData = async (city, units = "metric") => {
  const URL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=${units}`;

  try {
    const response = await fetch(URL);
    if (!response.ok) {
      throw new Error('City not found');
    }

    const data = await response.json();

    if (!data || !data.weather || !data.main || !data.wind || !data.sys) {
      throw new Error('Invalid data received');
    }

    const {
      weather,
      main: { temp, feels_like, temp_min, temp_max, pressure, humidity },
      wind: { speed },
      sys: { country },
      name,
    } = data;

    const { description, icon } = weather[0];

    return {
      description,
      iconURL: makeIconURL(icon),
      temp,
      feels_like,
      temp_min,
      temp_max,
      pressure,
      humidity,
      speed,
      country,
      name,
    };
  } catch (error) {
    console.error('Error fetching weather data:', error.message);
    return null;
  }
};

export { getFormattedWeatherData };

