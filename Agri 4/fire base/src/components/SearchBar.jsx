import { SearchIcon } from './icons.jsx'

export default function SearchBar({ value, onChange, placeholder = 'search the Crops name and location' }) {
  return (
    <div className="search-bar">
      <SearchIcon width={17} height={17} />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label="Search crops and location"
      />
    </div>
  )
};
