// Small inline SVG icon set — keeps the app dependency-free (no icon package).
const base = { width: 20, height: 20, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' }

export const LeafIcon = (p) => (
  <svg {...base} {...p}><path d="M11 20A7 7 0 0 1 4 13c0-5 4-9 9-9 5 0 9 4 9 9a7 7 0 0 1-7 7H11Z"/><path d="M11 20 20 4"/></svg>
)
export const BellIcon = (p) => (
  <svg {...base} {...p}><path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
)
export const SearchIcon = (p) => (
  <svg {...base} {...p}><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
)
export const HomeIcon = (p) => (
  <svg {...base} {...p}><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z"/><path d="M9 22V12h6v10"/></svg>
)
export const ChatIcon = (p) => (
  <svg {...base} {...p}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2Z"/></svg>
)
export const UsersIcon = (p) => (
  <svg {...base} {...p}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
)
export const UserIcon = (p) => (
  <svg {...base} {...p}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
)
export const MapPinIcon = (p) => (
  <svg {...base} {...p}><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
)
export const PlusIcon = (p) => (
  <svg {...base} {...p}><path d="M12 5v14M5 12h14"/></svg>
)
export const XIcon = (p) => (
  <svg {...base} {...p}><path d="M18 6 6 18M6 6l12 12"/></svg>
)
export const CameraIcon = (p) => (
  <svg {...base} {...p}><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2Z"/><circle cx="12" cy="13" r="4"/></svg>
)
export const SparkleIcon = (p) => (
  <svg {...base} {...p}><path d="M12 3v4M12 17v4M5 12H1M23 12h-4M18.4 5.6l-2.8 2.8M8.4 15.6l-2.8 2.8M18.4 18.4l-2.8-2.8M8.4 8.4 5.6 5.6"/></svg>
)
export const MessageIcon = (p) => (
  <svg {...base} {...p}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2Z"/></svg>
)
export const BookmarkIcon = ({ filled, ...p }) => (
  <svg {...base} fill={filled ? 'currentColor' : 'none'} {...p}><path d="M19 21 12 16l-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2Z"/></svg>
)
export const ShareIcon = (p) => (
  <svg {...base} {...p}><path d="m22 2-11 11M22 2l-7 20-4-9-9-4Z"/></svg>
)
export const ChevronLeftIcon = (p) => (
  <svg {...base} {...p}><path d="m15 18-6-6 6-6"/></svg>
)
export const SendIcon = (p) => (
  <svg {...base} {...p}><path d="m22 2-7 20-4-9-9-4Z"/></svg>
)
export const CrosshairIcon = (p) => (
  <svg {...base} {...p}><circle cx="12" cy="12" r="9"/><path d="M12 3v3M12 18v3M3 12h3M18 12h3"/></svg>
)
