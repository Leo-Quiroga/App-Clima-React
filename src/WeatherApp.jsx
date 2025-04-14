import { useState, useEffect } from 'react'
import './WeatherApp.css'

export const WeatherApp = () => {
    const [city, setCity] = useState('')
    const [weatherData, setWeatherData] = useState(null)
    const [loading, setLoading] = useState(false)
    const [background, setBackground] = useState('linear-gradient(135deg, #0066cc, #00a8ff)')

    const urlBase = 'https://api.openweathermap.org/data/2.5/weather'
    const API_KEY = 'REEMPLAZAR-API-KEY'
    const difKelvin = 273.15

    const getBackgroundByTemp = (temp) => {
        if (temp < 10) return 'linear-gradient(135deg, #1e3d58, #6dd5ed)'
        if (temp < 20) return 'linear-gradient(135deg, #2980b9, #6dd5ed)'
        if (temp < 30) return 'linear-gradient(135deg, #00b4db, #0083b0)'
        return 'linear-gradient(135deg,rgb(243, 163, 142),rgb(195, 168, 130))'
    }

    const fetchWeatherData = async () => {
        if (!city.trim()) return
        
        setLoading(true)
        try {
            const response = await fetch(`${urlBase}?q=${city}&appid=${API_KEY}&lang=es`)
            const data = await response.json()
            
            if (data.cod === 200) {
                setWeatherData(data)
                const temp = Math.floor(data.main.temp - difKelvin)
                setBackground(getBackgroundByTemp(temp))
            } else {
                alert('Ciudad no encontrada. Intenta con otro nombre.')
            }
        } catch (error) {
            console.error('Error:', error)
            alert('Error al obtener los datos del clima')
        } finally {
            setLoading(false)
        }
    }

    const handleCityChange = (event) => {
        setCity(event.target.value)
    }

    const handleSubmit = (event) => {
        event.preventDefault()
        fetchWeatherData()
    }

    // Efecto para cambiar el fondo del body
    useEffect(() => {
        document.body.style.background = background
    }, [background])

    return (
        <div className="container">
            <h1>WeatherVision</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Ingresa una ciudad..."
                    value={city}
                    onChange={handleCityChange}
                    disabled={loading}
                />
                <button type="submit" disabled={loading}>
                    {loading ? 'Buscando...' : 'Buscar'}
                </button>
            </form>

            {weatherData && (
                <div className="weather-card">
                    <div className="weather-info">
                        <h2>{weatherData.name}, {weatherData.sys.country}</h2>
                        <div className="temperature">
                            {Math.floor(weatherData.main.temp - difKelvin)}
                        </div>
                        <p className="description">{weatherData.weather[0].description}</p>
                        <img
                            className="weather-icon"
                            src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@4x.png`}
                            alt={weatherData.weather[0].description}
                        />
                    </div>
                    
                    <div className="weather-details">
                        <div className="weather-detail">
                            <p>Sensación térmica</p>
                            <p>{Math.floor(weatherData.main.feels_like - difKelvin)}°C</p>
                        </div>
                        <div className="weather-detail">
                            <p>Humedad</p>
                            <p>{weatherData.main.humidity}%</p>
                        </div>
                        <div className="weather-detail">
                            <p>Viento</p>
                            <p>{weatherData.wind.speed} m/s</p>
                        </div>
                        <div className="weather-detail">
                            <p>Presión</p>
                            <p>{weatherData.main.pressure} hPa</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}