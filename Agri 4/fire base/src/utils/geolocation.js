// Browser GPS -> lat/lng -> human readable "City, State" via OpenStreetMap's
// free reverse-geocoding API (no key required). Swap the fetch URL for
// Google's Geocoding API if you have a key and want higher accuracy/quota.
export function getCurrentPosition() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by this browser.'))
      return
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      (err) => reject(err),
      { enableHighAccuracy: true, timeout: 10000 }
    )
  })
}

export async function reverseGeocode(lat, lng) {
  const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=10&addressdetails=1`
  const res = await fetch(url, { headers: { Accept: 'application/json' } })
  if (!res.ok) throw new Error('Could not resolve location')
  const data = await res.json()
  const addr = data.address || {}
  const city = addr.city || addr.town || addr.village || addr.county || ''
  const state = addr.state || ''
  const label = [city, state].filter(Boolean).join(', ') || data.display_name || 'Unknown location'
  return { city, state, label }
}

export async function detectLocation() {
  const { lat, lng } = await getCurrentPosition()
  const { city, state, label } = await reverseGeocode(lat, lng)
  return { lat, lng, city, state, label }
}
