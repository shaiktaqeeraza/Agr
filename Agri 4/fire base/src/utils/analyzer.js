// Lightweight rule-based crop "Analyzer". Gives instant feedback without an
// external AI service. Swap the body of analyzeCrop() for a call to a
// vision/AI model later — the UI already expects a promise resolving to
// { condition, suggestion }.
const TIPS = {
  tomato: 'Water at the base to avoid leaf spot, and stake plants as fruit sets.',
  wheat: 'Watch for yellowing at the tips, a common sign of nitrogen deficiency.',
  onion: 'Reduce watering a couple of weeks before harvest to help bulbs cure.',
  rice: 'Keep consistent standing water during the tillering stage.',
  potato: 'Hill soil around the base to keep tubers from greening in sunlight.',
  cotton: 'Scout regularly for bollworm, especially in warm, humid weeks.',
  default: 'Keep an eye on watering consistency and check leaves for early pest signs.',
}

export async function analyzeCrop(cropName = '') {
  await new Promise((r) => setTimeout(r, 900))
  const key = Object.keys(TIPS).find((k) => cropName.toLowerCase().includes(k))
  return {
    condition: 'Looks healthy based on the listing details',
    suggestion: TIPS[key] || TIPS.default,
  }
}
