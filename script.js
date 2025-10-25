// ==================== CLOCK & DATE ====================
function updateClock() {
  const now = new Date()

  // Time
  const hours = String(now.getHours()).padStart(2, "0")
  const minutes = String(now.getMinutes()).padStart(2, "0")
  const seconds = String(now.getSeconds()).padStart(2, "0")
  document.getElementById("clock").textContent = `${hours}:${minutes}:${seconds}`

  // Date
  const options = { year: "numeric", month: "long", day: "numeric" }
  const dateStr = now.toLocaleDateString("en-US", options)
  document.getElementById("date").textContent = dateStr

  // Day
  const dayOptions = { weekday: "long" }
  const dayStr = now.toLocaleDateString("en-US", dayOptions)
  document.getElementById("day").textContent = dayStr
}

setInterval(updateClock, 1000)
updateClock()

// ==================== WEATHER ====================
async function fetchWeather() {
  try {
    // Get user's location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords
          await getWeatherData(latitude, longitude)
        },
        () => {
          // Default to New York if location denied
          getWeatherData(40.7128, -74.006)
        },
      )
    } else {
      getWeatherData(40.7128, -74.006)
    }
  } catch (error) {
    console.error("Weather error:", error)
    document.getElementById("weatherContent").innerHTML = '<div class="weather-loading">Unable to load weather</div>'
  }
}

async function getWeatherData(lat, lon) {
  try {
    // Using Open-Meteo API (free, no API key required)
    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code,wind_speed_10m,relative_humidity_2m&temperature_unit=fahrenheit`,
    )
    const data = await response.json()
    const current = data.current

    const weatherIcons = {
      0: "☀️",
      1: "🌤️",
      2: "⛅",
      3: "☁️",
      45: "🌫️",
      48: "🌫️",
      51: "🌧️",
      53: "🌧️",
      55: "🌧️",
      61: "🌧️",
      63: "⛈️",
      65: "⛈️",
      71: "❄️",
      73: "❄️",
      75: "❄️",
      77: "❄️",
      80: "🌧️",
      81: "⛈️",
      82: "⛈️",
      85: "❄️",
      86: "❄️",
      95: "⛈️",
      96: "⛈️",
      99: "⛈️",
    }

    const weatherDesc = {
      0: "Clear sky",
      1: "Mainly clear",
      2: "Partly cloudy",
      3: "Overcast",
      45: "Foggy",
      48: "Foggy",
      51: "Light drizzle",
      53: "Moderate drizzle",
      55: "Dense drizzle",
      61: "Slight rain",
      63: "Moderate rain",
      65: "Heavy rain",
      71: "Slight snow",
      73: "Moderate snow",
      75: "Heavy snow",
      77: "Snow grains",
      80: "Slight rain showers",
      81: "Moderate rain showers",
      82: "Violent rain showers",
      85: "Slight snow showers",
      86: "Heavy snow showers",
      95: "Thunderstorm",
      96: "Thunderstorm with hail",
      99: "Thunderstorm with hail",
    }

    const icon = weatherIcons[current.weather_code] || "🌡️"
    const desc = weatherDesc[current.weather_code] || "Unknown"

    document.getElementById("weatherContent").innerHTML = `
            <div class="weather-info">
                <div class="weather-temp">${Math.round(current.temperature_2m)}°F</div>
                <div class="weather-desc">${desc}</div>
                <div class="weather-details">
                    <div class="weather-detail">
                        <strong>Humidity:</strong> ${current.relative_humidity_2m}%
                    </div>
                    <div class="weather-detail">
                        <strong>Wind:</strong> ${Math.round(current.wind_speed_10m)} mph
                    </div>
                </div>
            </div>
            <div class="weather-icon">${icon}</div>
        `
  } catch (error) {
    console.error("Weather fetch error:", error)
    document.getElementById("weatherContent").innerHTML = '<div class="weather-loading">Unable to load weather</div>'
  }
}

fetchWeather()

// ==================== QUOTES ====================
const quotes = [
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { text: "Innovation distinguishes between a leader and a follower.", author: "Steve Jobs" },
  { text: "Life is what happens when you're busy making other plans.", author: "John Lennon" },
  { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
  { text: "It is during our darkest moments that we must focus to see the light.", author: "Aristotle" },
  { text: "The only impossible journey is the one you never begin.", author: "Tony Robbins" },
  { text: "Success is not final, failure is not fatal.", author: "Winston Churchill" },
  { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
  { text: "The best time to plant a tree was 20 years ago. The second best time is now.", author: "Chinese Proverb" },
  { text: "Your time is limited, don't waste it living someone else's life.", author: "Steve Jobs" },
  { text: "The way to get started is to quit talking and begin doing.", author: "Walt Disney" },
  { text: "Don't let yesterday take up too much of today.", author: "Will Rogers" },
  { text: "You learn more from failure than from success.", author: "Unknown" },
  { text: "It's not whether you get knocked down, it's whether you get up.", author: "Vince Lombardi" },
  {
    text: "If you are working on something that you really care about, you don't have to be pushed. The vision pulls you.",
    author: "Steve Jobs",
  },
]

function fetchQuote() {
  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)]
  document.getElementById("quoteText").textContent = `"${randomQuote.text}"`
  document.getElementById("quoteAuthor").textContent = `— ${randomQuote.author}`
}

fetchQuote()

// ==================== TODO LIST ====================
function loadTodos() {
  const todos = JSON.parse(localStorage.getItem("todos")) || []
  renderTodos(todos)
}

function saveTodos(todos) {
  localStorage.setItem("todos", JSON.stringify(todos))
}

function addTodo() {
  const input = document.getElementById("todoInput")
  const text = input.value.trim()

  if (text === "") {
    alert("Please enter a task!")
    return
  }

  const todos = JSON.parse(localStorage.getItem("todos")) || []
  const newTodo = {
    id: Date.now(),
    text: text,
    completed: false,
  }

  todos.push(newTodo)
  saveTodos(todos)
  renderTodos(todos)
  input.value = ""
  input.focus()
}

function deleteTodo(id) {
  const todos = JSON.parse(localStorage.getItem("todos")) || []
  const filtered = todos.filter((todo) => todo.id !== id)
  saveTodos(filtered)
  renderTodos(filtered)
}

function toggleTodo(id) {
  const todos = JSON.parse(localStorage.getItem("todos")) || []
  const todo = todos.find((t) => t.id === id)
  if (todo) {
    todo.completed = !todo.completed
    saveTodos(todos)
    renderTodos(todos)
  }
}

function renderTodos(todos) {
  const todoList = document.getElementById("todoList")

  if (todos.length === 0) {
    todoList.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">📝</div>
                <p>No tasks yet. Add one to get started!</p>
            </div>
        `
    return
  }

  todoList.innerHTML = todos
    .map(
      (todo) => `
        <div class="todo-item ${todo.completed ? "completed" : ""}">
            <input 
                type="checkbox" 
                class="todo-checkbox" 
                ${todo.completed ? "checked" : ""}
                onchange="toggleTodo(${todo.id})"
            >
            <span class="todo-text">${escapeHtml(todo.text)}</span>
            <button class="todo-delete" onclick="deleteTodo(${todo.id})">✕</button>
        </div>
    `,
    )
    .join("")
}

function handleKeyPress(event) {
  if (event.key === "Enter") {
    addTodo()
  }
}

function escapeHtml(text) {
  const div = document.createElement("div")
  div.textContent = text
  return div.innerHTML
}

// Initialize
loadTodos()
