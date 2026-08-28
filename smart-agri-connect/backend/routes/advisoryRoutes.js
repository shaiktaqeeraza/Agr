const express = require('express');
const Question = require('../models/Question');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// ---- Farming Tips & Disease/Pest Guidance (static reference content, editable by admin later) ----
const farmingTips = [
  { id: 1, title: 'Soil testing before sowing', category: 'soil', tip: 'Test soil pH and nutrient levels every season to choose the right crop and fertilizer dose.' },
  { id: 2, title: 'Drip irrigation saves water', category: 'irrigation', tip: 'Drip irrigation can reduce water usage by 30-50% compared to flood irrigation while improving yield.' },
  { id: 3, title: 'Crop rotation', category: 'soil', tip: 'Rotate cereals with legumes to naturally restore soil nitrogen and break pest cycles.' },
  { id: 4, title: 'Timely harvesting', category: 'harvest', tip: 'Harvest at the right maturity stage to maximize both yield and market price.' },
  { id: 5, title: 'Seed treatment', category: 'sowing', tip: 'Treat seeds with recommended fungicide/bio-agent before sowing to prevent early-stage disease.' }
];

const diseaseGuidance = [
  { id: 1, crop: 'Wheat', issue: 'Yellow Rust', symptoms: 'Yellow-orange stripes on leaves', remedy: 'Spray Propiconazole 25% EC at first sign; avoid excess nitrogen.' },
  { id: 2, crop: 'Cotton', issue: 'Pink Bollworm', symptoms: 'Rosette flowers, damaged bolls', remedy: 'Use pheromone traps, timely picking, and recommended insecticide rotation.' },
  { id: 3, crop: 'Tomato', issue: 'Early Blight', symptoms: 'Dark concentric spots on lower leaves', remedy: 'Remove infected leaves; spray Mancozeb or Chlorothalonil.' },
  { id: 4, crop: 'Paddy', issue: 'Brown Plant Hopper', symptoms: 'Hopper burn, yellowing patches', remedy: 'Avoid excess nitrogen, use resistant varieties, apply recommended insecticide at base of plant.' },
  { id: 5, crop: 'Potato', issue: 'Late Blight', symptoms: 'Water-soaked lesions turning brown/black', remedy: 'Ensure field drainage; spray Metalaxyl + Mancozeb combination.' }
];

router.get('/tips', (req, res) => res.json({ success: true, tips: farmingTips }));
router.get('/disease-guidance', (req, res) => res.json({ success: true, guidance: diseaseGuidance }));

// ---- Weather ----
// If WEATHER_API_KEY is configured, fetch live data from OpenWeatherMap; otherwise return a friendly placeholder.
router.get('/weather', async (req, res, next) => {
  try {
    const { lat, lon, city } = req.query;
    const apiKey = process.env.WEATHER_API_KEY;

    if (!apiKey) {
      return res.json({
        success: true,
        mock: true,
        message: 'Set WEATHER_API_KEY in .env to enable live weather data.',
        weather: { location: city || 'Your area', temp: 28, condition: 'Partly Cloudy', humidity: 65, windSpeed: 12 }
      });
    }

    const query = city ? `q=${encodeURIComponent(city)}` : `lat=${lat}&lon=${lon}`;
    const url = `https://api.openweathermap.org/data/2.5/weather?${query}&units=metric&appid=${apiKey}`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.cod && data.cod !== 200) {
      return res.status(400).json({ success: false, message: data.message || 'Could not fetch weather' });
    }

    res.json({
      success: true,
      weather: {
        location: data.name,
        temp: data.main.temp,
        condition: data.weather[0].description,
        humidity: data.main.humidity,
        windSpeed: data.wind.speed
      }
    });
  } catch (err) {
    next(err);
  }
});

// ---- Farmer Q&A ----
// @route   POST /api/advisory/questions
router.post('/questions', protect, authorize('farmer'), async (req, res, next) => {
  try {
    const { title, description, category, photos } = req.body;
    const question = await Question.create({ farmer: req.user._id, title, description, category, photos });
    res.status(201).json({ success: true, question });
  } catch (err) {
    next(err);
  }
});

// @route   GET /api/advisory/questions
// @desc    All questions (public feed) or ?mine=true for own questions
router.get('/questions', protect, async (req, res, next) => {
  try {
    const query = req.query.mine === 'true' ? { farmer: req.user._id } : {};
    const questions = await Question.find(query)
      .populate('farmer', 'name location')
      .sort('-createdAt');
    res.json({ success: true, questions });
  } catch (err) {
    next(err);
  }
});

// @route   PUT /api/advisory/questions/:id/answer
// @desc    Admin/expert answers a farmer's question
router.put('/questions/:id/answer', protect, authorize('admin'), async (req, res, next) => {
  try {
    const { answer } = req.body;
    const question = await Question.findByIdAndUpdate(
      req.params.id,
      { answer, answeredBy: req.user._id, status: 'answered' },
      { new: true }
    );
    if (!question) return res.status(404).json({ success: false, message: 'Question not found' });
    res.json({ success: true, question });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
