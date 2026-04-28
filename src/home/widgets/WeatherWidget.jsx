import { useState, useEffect } from 'react'
import { Cloud, Sun, CloudRain, CloudSnow, Wind, Zap } from 'lucide-react'
import { useNovaStore } from '../../store/index.js'

const ICONS = {
  Clear:        { icon: Sun,       color: '#f59e0b' },
  Clouds:       { icon: Cloud,     color: '#94a3b8' },
  Rain:         { icon: CloudRain, color: '#3b82f6' },
  Drizzle:      { icon: CloudRain, color: '#60a5fa' },
  Snow:         { icon: CloudSnow, color: '#bfdbfe' },
  Thunderstorm: { icon: Zap,       color: '#a78bfa' },
  Wind:         { icon: Wind,      color: '#94a3b8' },
}

export default function WeatherWidget() {
  const { settings } = useNovaStore()
  const [weather, setWeather] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const apiKey = settings.weatherApiKey

  useEffect(() => {
    if (!apiKey) return
    fetchWeather()
  }, [apiKey])

  const fetchWeather = async () => {
    setLoading(true)
    setError(null)
    try {
      // Primero obtener ubicación
      const geoRes = await fetch(
        `https://ipapi.co/json/`
      )
      const geo = await geoRes.json()

      const weatherRes = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${geo.latitude}&lon=${geo.longitude}&appid=${apiKey}&units=metric&lang=es`
      )
      const data = await weatherRes.json()

      if (data.cod !== 200) throw new Error(data.message)

      setWeather({
        temp:        Math.round(data.main.temp),
        feels_like:  Math.round(data.main.feels_like),
        humidity:    data.main.humidity,
        description: data.weather[0].description,
        main:        data.weather[0].main,
        city:        data.name,
        country:     data.sys.country,
      })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (!apiKey) {
    return (
      <div
        className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs"
        style={{
          background: 'var(--card)',
          border: '1px solid var(--border)',
          color: 'var(--muted)',
        }}
      >
        <Cloud size={13} />
        <span>Clima — configura API key en Settings</span>
      </div>
    )
  }

  if (loading) {
    return (
      <div
        className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs"
        style={{ background: 'var(--card)', border: '1px solid var(--border)', color: 'var(--muted)' }}
      >
        <Cloud size={13} className="animate-pulse" />
        <span>Cargando clima...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div
        className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs"
        style={{ background: 'var(--card)', border: '1px solid var(--border)', color: '#ef4444' }}
      >
        <Cloud size={13} />
        <span>Error: {error}</span>
      </div>
    )
  }

  if (!weather) return null

  const { icon: Icon, color } = ICONS[weather.main] || ICONS.Clouds

  return (
    <div
      className="flex items-center gap-3 px-4 py-2 rounded-xl text-xs"
      style={{
        background: 'var(--card)',
        border: '1px solid var(--border)',
        color: 'var(--text)',
      }}
    >
      <Icon size={20} style={{ color }} />
      <div>
        <div className="flex items-baseline gap-1">
          <span className="text-xl font-light" style={{ color: 'var(--text)' }}>
            {weather.temp}°
          </span>
          <span style={{ color: 'var(--muted)' }}>C</span>
        </div>
        <p style={{ color: 'var(--muted)' }} className="capitalize">
          {weather.description} · {weather.city}
        </p>
      </div>
      <div className="text-right ml-2" style={{ color: 'var(--muted)' }}>
        <p>💧 {weather.humidity}%</p>
        <p>ST {weather.feels_like}°</p>
      </div>
    </div>
  )
}