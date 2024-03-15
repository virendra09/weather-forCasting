import React, { useEffect, useState } from "react";
import hotBg from "./assets/hot.jpg";
import coldBg from "./assets/cold.jpg";
import Descriptions from "./components/Descriptions";
import { getFormattedWeatherData } from "./weatherService";

import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

function App() {
  const [city, setCity] = useState("New York");
  const [weather, setWeather] = useState(null);
  const [units, setUnits] = useState("metric");
  const [bg, setBg] = useState(hotBg);
  const [cityImage, setCityImage] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [showLiveDiv, setShowLiveDiv] = useState(false);

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        const data = await getFormattedWeatherData(city, units);
        if (!data) {
          setErrorMessage("Please try another city");
          return;
        }
        setWeather(data);
        setErrorMessage(""); // Clear error message if data is available

        const imageUrl = await getImageForCity(city);
        setCityImage(imageUrl);

        const threshold = units === "metric" ? 20 : 60;
        setBg(data.temp <= threshold ? coldBg : hotBg);
      } catch (error) {
        console.error("Error fetching weather data:", error.message);
        setErrorMessage("Error fetching weather data. Please try again later.");
      }
    };

    fetchWeatherData();
  }, [units, city]);

  const handleUnitsClick = (e) => {
    const button = e.currentTarget;
    const currentUnit = button.innerText.slice(1);
    const isCelsius = currentUnit === "C";
    button.innerText = isCelsius ? "°F" : "°C";
    setUnits(isCelsius ? "metric" : "imperial");
  };

  const enterKeyPressed = (e) => {
    if (e.keyCode === 13) {
      setCity(e.currentTarget.value);
      e.currentTarget.blur();
    }
  };

  const getImageForCity = async (city) => {
    const accessKey = "wuhMg1PAOPPsGf_uUnhvdRwqY4vC2fGHhWK15I1EjyE";
    const response = await fetch(
      `https://api.unsplash.com/search/photos?query=${city}&per_page=1&client_id=${accessKey}`
    );
    const data = await response.json();
    if (data.results.length > 0) {
      return data.results[0].urls.regular;
    } else {
      return null;
    }
  };

  function formatDate(date) {
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = monthNames[date.getMonth()];
    const day = date.getDate();
    const year = date.getFullYear();
    return `${month} ${day}, ${year}`;
  }

  const currentDate = new Date();
  const formattedDate = formatDate(currentDate);

  // Function to show the live div
  const showLiveDivHandler = () => {
    setShowLiveDiv(true);
  };

  // Function to hide the live div
  const hideLiveDivHandler = () => {
    setShowLiveDiv(false);
  };

  return (
    <div className="app" style={{ backgroundImage: `url(${bg})` }}>
      <div className="overlay">
        {errorMessage && (
          <div className="error-message">{errorMessage}</div>
        )}
        {weather && (
          <div className="container">
            <div className="section section__inputs">
              <input
                onKeyDown={enterKeyPressed}
                type="text"
                name="city"
                placeholder="Enter City..."
              />
              <button onClick={(e) => handleUnitsClick(e)}>°F</button>
            </div>
            <div className="section section__temperature">
              <div className="icon">
                <h3>{`${weather.name}, ${weather.country}`}</h3>
                <p>{formattedDate}</p>
                <img src={weather.iconURL} alt="weatherIcon" />
                <h3>{weather.description}</h3>
              </div>
              <div style={{ position: 'relative' }}>
                {cityImage && (
                  <img className="location_image" src={cityImage} alt="places" />
                )}
                <button onClick={showLiveDivHandler} style={{ position: 'absolute', top: '10px', left: '10px', backgroundColor: 'red', color: 'white', height: '24px', width: '45px' }}>Live</button>
              </div>
            </div>
            <div className="section section__temperature">
              <div className="temperature">
                <h1>{`${weather.temp.toFixed()} °${units === "metric" ? "C" : "F"}`}</h1>
              </div>
              <div className="datepicker">
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label="Last Month"
                    inputFormat="MM/dd/yyyy" />
                </LocalizationProvider>
              </div>
            </div>
            <Descriptions weather={weather} units={units} />
          </div>
        )}
      </div>
      {showLiveDiv && (
        <div className="live-div" style={{ position: 'absolute', top: '0', left: '0', width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          <div className="live-content" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: 'white', padding: '20px', borderRadius: '5px', backgroundImage: `url(${cityImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
            <div className="live-content-item">
              <h2>{`${weather.name}, ${weather.country}`}</h2>
              <p>{formattedDate}</p>
              <img src={weather.iconURL} alt="weatherIcon" />
              <h3>{weather.description}</h3>
            </div>
            <button onClick={hideLiveDivHandler} style={{ position: 'absolute', top: '10px', left: '10px', backgroundColor: 'red', color: 'white', height: '24px', width: '45px' }}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;



