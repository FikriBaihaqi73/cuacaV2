import { useState, useEffect } from 'react'
import './App.css'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

const apiKey = import.meta.env.VITE_WEATHER_API_KEY;
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric&lang=id&q=";

// Fungsi untuk mendapatkan tanggal hari ini dalam format yang diinginkan
function getFormattedDate() {
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    
    const date = new Date();
    const day = days[date.getDay()]; 
    const dayNum = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    
    return `${day}, ${dayNum} ${month} ${year}`;
}

// Fungsi untuk menampilkan ikon cuaca yang sesuai
function getWeatherIcon(iconCode) {
    return `https://openweathermap.org/img/wn/${iconCode}@4x.png`;
}

function App() {
  const [weatherData, setWeatherData] = useState(null);
  const [city, setCity] = useState("Jakarta"); // Default city to Jakarta
  const [searchCity, setSearchCity] = useState("Jakarta"); // State for search input
  const [error, setError] = useState(null);
  const [currentDate, setCurrentDate] = useState("");
  const [mainCardBackground, setMainCardBackground] = useState("linear-gradient(135deg, #74b9ff, #0984e3)"); // Default background

  const checkWeather = async (cityName) => {
    try {
      const response = await fetch(apiUrl + cityName + `&appid=${apiKey}`);
      if (!response.ok) {
        // Handle 404 specifically or other HTTP errors
        if (response.status === 404) {
            setError("Tempat tidak diketahui, coba cari yang lain.");
        } else {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        setWeatherData(null);
        setMainCardBackground("linear-gradient(135deg, #74b9ff, #0984e3)"); // Reset background on error
        return;
      }
      const data = await response.json();
      setWeatherData(data);
      setError(null);

      // Change background based on weather condition
      const weatherCondition = data.weather[0].main.toLowerCase();
      let bgColor;
      
      if (weatherCondition.includes('cloud')) {
        // Berawan - abu-abu lembut dengan nuansa dingin
        bgColor = "linear-gradient(135deg, #bdc3c7, #2c3e50)";
      } else if (weatherCondition.includes('rain') || weatherCondition.includes('drizzle')) {
        // Hujan - gelap dramatis dengan nuansa biru-abu
        bgColor = "linear-gradient(135deg, #4b6cb7, #182848)";
      } else if (weatherCondition.includes('clear')) {
        // Cerah - biru langit yang ceria dan hangat
        bgColor = "linear-gradient(135deg, #74b9ff, #0984e3)";
      } else if (weatherCondition.includes('snow')) {
        // Salju - putih bersih dengan sentuhan biru dingin
        bgColor = "linear-gradient(135deg, #ddd6f3, #faaca8)";
      } else if (weatherCondition.includes('storm') || weatherCondition.includes('thunder')) {
        // Badai - gelap dramatis dengan nuansa ungu gelap
        bgColor = "linear-gradient(135deg, #2c3e50, #4a4a4a)";
      } else if (weatherCondition.includes('fog') || weatherCondition.includes('mist')) {
        // Kabut - abu-abu lembut dengan nuansa putih
        bgColor = "linear-gradient(135deg, #ecf0f1, #bdc3c7)";
      } else if (weatherCondition.includes('wind')) {
        // Berangin - gradien dinamis dengan nuansa biru-hijau
        bgColor = "linear-gradient(135deg, #a8e6cf, #88d8c0)";
      } else {
        // Default - gradien netral yang menenangkan
        bgColor = "linear-gradient(135deg, #667eea, #764ba2)";
      }
      setMainCardBackground(bgColor);

    } catch (err) {
      console.error("Error fetching weather data:\n", err);
      setError("Terjadi kesalahan. Silakan coba lagi nanti.");
      setWeatherData(null);
      setMainCardBackground("linear-gradient(135deg, #74b9ff, #0984e3)"); // Reset background on error
    }
  };

  useEffect(() => {
    checkWeather(city);
    setCurrentDate(getFormattedDate());
  }, [city]);

  const handleSearch = () => {
    setCity(searchCity);
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  useEffect(() => {
    document.body.style.background = mainCardBackground;
  }, [mainCardBackground]);

  return (
    <>
      <div className="main-container">
        <div className="weather-main-card" style={{ background: mainCardBackground }}>
            <div className="date-display">
                <p>{currentDate.split(',')[0]}</p>
                <p className="sub-date">{currentDate.split(',').slice(1).join(',').trim()}</p>
            </div>
            {weatherData && (
              <>
                <img id="weather-icon" src={getWeatherIcon(weatherData.weather[0].icon)} alt="Weather Icon" />
                <p id="temperature" className="temp">{Math.round(weatherData.main.temp)}°C</p>
                <p id="description" className="description">{weatherData.weather[0].description}</p>
              </>
            )}
        </div>
        <div className="weather-detail-card">
            <div className="search-box">
                <Input
                    id="city-input"
                    type="text"
                    placeholder="Cari lokasi..."
                    value={searchCity}
                    onChange={(e) => setSearchCity(e.target.value)}
                    onKeyPress={handleKeyPress}
                />
                <Button onClick={handleSearch}>Cari</Button>
            </div>
            {error && (
                <p className="error-message" id="error">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-search"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                    {error}
                </p>
            )}
            {weatherData && (
                <div className="weather-info-detail">
                    <p>Nama: <span>{weatherData.name}, {weatherData.sys.country}</span></p>
                    <p>Suhu: <span>{Math.round(weatherData.main.temp)}°C</span></p>
                    <p>Terasa: <span>{Math.round(weatherData.main.feels_like)}°C</span></p>
                    <p>Kelembaban: <span>{weatherData.main.humidity}%</span></p>
                    <p>Kecepatan Angin: <span>{weatherData.wind.speed} km/j</span></p>
                </div>
            )}
        </div>
      </div>
    </>
  );
}

export default App
