import { useState, useRef } from 'react'
import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { db, storage } from '../firebase.js'
import { useAuth } from '../context/AuthContext.jsx'
import { detectLocation } from '../utils/geolocation.js'
import { XIcon, CameraIcon, CrosshairIcon } from './icons.jsx'

const UNITS = ['kg', 'quintal', 'ton', 'dozen', 'piece']

export default function CreatePostModal({ onClose, onCreated }) {
  const { user, profile } = useAuth()
  const fileInputRef = useRef(null)

  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState('')
  const [cropName, setCropName] = useState('')
  const [price, setPrice] = useState('')
  const [unit, setUnit] = useState('kg')
  const [totalQuantity, setTotalQuantity] = useState('')
  const [priceType, setPriceType] = useState('fixed')
  const [locationLabel, setLocationLabel] = useState('')
  const [lat, setLat] = useState(null)
  const [lng, setLng] = useState(null)
  const [locating, setLocating] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  function handleImagePick(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  async function handleUseLocation() {
    setLocating(true)
    setError('')
    try {
      const loc = await detectLocation()
      setLocationLabel(loc.label)
      setLat(loc.lat)
      setLng(loc.lng)
    } catch (err) {
      setError('Could not detect location. You can type it manually below.')
    } finally {
      setLocating(false)
    }
  }

  const canSubmit = cropName && price && totalQuantity && locationLabel && !submitting

  async function handleSubmit() {
    if (!canSubmit) return
    setSubmitting(true)
    setError('')
    try {
      let imageURL = ''
      if (imageFile) {
        const storageRef = ref(storage, `posts/${user.uid}/${Date.now()}-${imageFile.name}`)
        await uploadBytes(storageRef, imageFile)
        imageURL = await getDownloadURL(storageRef)
      }

      const qty = Number(totalQuantity)
      await addDoc(collection(db, 'posts'), {
        userId: user.uid,
        userName: profile?.name || 'Guest Farmer',
        userPhoto: profile?.photoURL || '',
        userInitials: profile?.initials || (profile?.name || 'GF').slice(0, 2).toUpperCase(),
        locationLabel,
        lat,
        lng,
        cropName,
        price: Number(price),
        unit,
        priceType,
        totalQuantity: qty,
        availableQuantity: qty,
        imageURL,
        status: 'available',
        createdAt: serverTimestamp(),
      })

      onCreated?.()
      onClose()
    } catch (err) {
      console.error(err)
      setError('Something went wrong posting your crop. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>
        <h3 className="modal-title">
          Post a crop
          <button onClick={onClose} aria-label="Close"><XIcon /></button>
        </h3>

        <div className="field">
          <label>Crop photo</label>
          <label className="upload-box">
            {imagePreview ? (
              <img src={imagePreview} alt="preview" />
            ) : (
              <>
                <CameraIcon width={26} height={26} style={{ marginBottom: 6 }} />
                <div>Tap to upload a photo</div>
              </>
            )}
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImagePick} />
          </label>
        </div>

        <div className="field">
          <label>Crop name</label>
          <input value={cropName} onChange={(e) => setCropName(e.target.value)} placeholder="e.g. Javari Tomato" />
        </div>

        <div className="field-row">
          <div className="field">
            <label>Price</label>
            <input type="number" inputMode="decimal" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="10" />
          </div>
          <div className="field">
            <label>Unit</label>
            <select value={unit} onChange={(e) => setUnit(e.target.value)}>
              {UNITS.map((u) => <option key={u} value={u}>{u}</option>)}
            </select>
          </div>
        </div>

        <div className="field">
          <label>Total quantity available</label>
          <input type="number" inputMode="numeric" value={totalQuantity} onChange={(e) => setTotalQuantity(e.target.value)} placeholder="1000" />
        </div>

        <div className="field">
          <label>Price type</label>
          <div className="segmented">
            <button className={priceType === 'fixed' ? 'active' : ''} onClick={() => setPriceType('fixed')} type="button">Fixed</button>
            <button className={priceType === 'negotiable' ? 'active' : ''} onClick={() => setPriceType('negotiable')} type="button">Negotiable</button>
          </div>
        </div>

        <div className="field">
          <label>Location</label>
          <div className="location-row">
            <button type="button" className="location-btn" onClick={handleUseLocation} disabled={locating}>
              <CrosshairIcon width={15} height={15} /> {locating ? 'Locating…' : 'Use current location'}
            </button>
          </div>
          <input
            style={{ marginTop: 8 }}
            value={locationLabel}
            onChange={(e) => setLocationLabel(e.target.value)}
            placeholder="e.g. Nashik, Maharashtra"
          />
        </div>

        {error && <div className="error-text">{error}</div>}

        <button className="primary-btn" onClick={handleSubmit} disabled={!canSubmit}>
          {submitting ? 'Posting…' : 'Post'}
        </button>
      </div>
    </div>
  )
}
