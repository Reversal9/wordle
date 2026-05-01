const express = require('express')
const fs = require('fs')
const path = require('path')

const app = express()
const PORT = process.env.PORT || 3000

const words = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/words.json'), 'utf-8'))
const START_DATE = '2026-04-30'

function isValidDate(str) {
  if (typeof str !== 'string') return false
  if (!/^\d{4}-\d{2}-\d{2}$/.test(str)) return false
  const d = new Date(str)
  if (isNaN(d.getTime())) return false
  return d.toISOString().startsWith(str)
}

function daysSinceStart(dateStr) {
  const start = new Date(START_DATE)
  const target = new Date(dateStr)
  return Math.floor((target - start) / 86_400_000)
}

function getLocalFallback() {
  const now = new Date()
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1).padStart(2, '0')
  const d = String(now.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

app.get('/api/word', (req, res) => {
  const dateStr = isValidDate(req.query.date) ? req.query.date : getLocalFallback()
  const days = daysSinceStart(dateStr)
  // Positive modulo handles any negative days (dates before START_DATE)
  const word = words[((days % words.length) + words.length) % words.length]
  const puzzleNumber = days + 1
  res.json({ word, date: dateStr, puzzleNumber })
})

app.listen(PORT, () => console.log(`Backend running on port ${PORT}`))
