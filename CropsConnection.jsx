import React, { useState, useMemo } from "react";

const FONTS = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=IBM+Plex+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@500;600&display=swap');
`;

const COLORS = {
  ink: "#1F3D2B",
  bg: "#EFF3EA",
  card: "#FFFFFF",
  gold: "#C99A2E",
  clay: "#A8442E",
  olive: "#5B6B52",
  line: "#DCE3D6",
};

const INITIAL_POSTS = [
  {
    id: 1,
    farmer: "Ramesh Kumar",
    initials: "RK",
    avatar: "#8FA876",
    location: "Nashik, Maharashtra",
    time: "2h ago",
    crop: "Javari Tomato",
    emoji: "🍅",
    imgTint: "#C4472B",
    price: 10,
    unit: "kg",
    total: 1000,
    remaining: 1000,
    priceType: "Negotiable",
  },
  {
    id: 2,
    farmer: "Sunita Patil",
    initials: "SP",
    avatar: "#C99A2E",
    location: "Ahmednagar, Maharashtra",
    time: "5h ago",
    crop: "Wheat",
    emoji: "🌾",
    imgTint: "#7A8C3E",
    price: 24,
    unit: "kg",
    total: 2000,
    remaining: 2000,
    priceType: "Fixed",
  },
  {
    id: 3,
    farmer: "Ahmed Khan",
    initials: "AK",
    avatar: "#6B7FA8",
    location: "Bidar, Karnataka",
    time: "1d ago",
    crop: "Onion",
    emoji: "🧅",
    imgTint: "#8A5A9E",
    price: 25,
    unit: "kg",
    total: 500,
    remaining: 500,
    priceType: "Negotiable",
  },
];

function PriceStamp({ price, unit }) {
  return (
    <div
      style={{
        transform: `rotate(-6deg)`,
        border: `2px dashed ${COLORS.gold}`,
        borderRadius: "50%",
        width: 64,
        height: 64,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        color: COLORS.gold,
        fontFamily: "'IBM Plex Mono', monospace",
        flexShrink: 0,
        background: "rgba(201,154,46,0.06)",
      }}
    >
      <span style={{ fontSize: 15, fontWeight: 600, lineHeight: 1 }}>₹{price}</span>
      <span style={{ fontSize: 9, letterSpacing: 0.5 }}>/{unit}</span>
    </div>
  );
}

function Avatar({ initials, color, size = 40 }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: color,
        color: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'IBM Plex Sans', sans-serif",
        fontWeight: 600,
        fontSize: size * 0.38,
        flexShrink: 0,
      }}
    >
      {initials}
    </div>
  );
}

function Icon({ name, size = 18, color = COLORS.ink }) {
  const common = { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: color, strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round" };
  switch (name) {
    case "bell":
      return <svg {...common}><path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.7 21a2 2 0 0 1-3.4 0" /></svg>;
    case "search":
      return <svg {...common}><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></svg>;
    case "pin":
      return <svg {...common}><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="2.5" /></svg>;
    case "bookmark":
      return <svg {...common}><path d="M6 3h12v18l-6-4-6 4Z" /></svg>;
    case "share":
      return <svg {...common}><path d="M4 12v7a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-7" /><path d="M16 6l-4-4-4 4" /><path d="M12 2v14" /></svg>;
    case "leaf":
      return <svg {...common}><path d="M5 21c8 0 14-6 14-14V4h-3C8 4 4 10 4 18v3Z" /><path d="M5 21C9 15 12 12 15 9" /></svg>;
    case "send":
      return <svg {...common}><path d="M22 2 11 13" /><path d="M22 2 15 22l-4-9-9-4Z" /></svg>;
    case "close":
      return <svg {...common}><path d="M18 6 6 18" /><path d="M6 6l12 12" /></svg>;
    default:
      return null;
  }
}

const TABS = ["Feed", "Chats", "Following", "Profile"];

export default function CropsConnection() {
  const [posts, setPosts] = useState(INITIAL_POSTS);
  const [tab, setTab] = useState("Feed");
  const [query, setQuery] = useState("");
  const [following, setFollowing] = useState(new Set());
  const [saved, setSaved] = useState(new Set());
  const [notifOpen, setNotifOpen] = useState(false);
  const [chatWith, setChatWith] = useState(null);
  const [analyzerFor, setAnalyzerFor] = useState(null);
  const [sellFor, setSellFor] = useState(null);
  const [sellQty, setSellQty] = useState("");
  const [chatLog, setChatLog] = useState({});
  const [chatDraft, setChatDraft] = useState("");
  const [toast, setToast] = useState(null);

  const notifications = [
    { id: 1, text: "Sunita Patil started following you." },
    { id: 2, text: "Ahmed Khan liked your tomato post." },
    { id: 3, text: "You have a new message from a buyer." },
  ];

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return posts;
    return posts.filter(
      (p) =>
        p.crop.toLowerCase().includes(q) ||
        p.location.toLowerCase().includes(q) ||
        p.farmer.toLowerCase().includes(q)
    );
  }, [posts, query]);

  function toggleFollow(farmer) {
    setFollowing((prev) => {
      const next = new Set(prev);
      next.has(farmer) ? next.delete(farmer) : next.add(farmer);
      return next;
    });
  }

  function toggleSave(id) {
    setSaved((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(null), 1800);
  }

  function confirmSell() {
    const qty = parseInt(sellQty, 10);
    if (!qty || qty <= 0) return;
    setPosts((prev) =>
      prev.map((p) =>
        p.id === sellFor ? { ...p, remaining: Math.max(0, p.remaining - qty) } : p
      )
    );
    setSellFor(null);
    setSellQty("");
    showToast("Updated remaining quantity.");
  }

  function sendMessage(farmer) {
    if (!chatDraft.trim()) return;
    setChatLog((prev) => ({
      ...prev,
      [farmer]: [...(prev[farmer] || []), { from: "me", text: chatDraft }],
    }));
    setChatDraft("");
  }

  const chatPartners = Array.from(new Set(posts.map((p) => p.farmer)));

  function renderPost(p) {
    const soldOut = p.remaining <= 0;
    return (
      <div key={p.id} style={{ background: COLORS.card, borderRadius: 16, border: `1px solid ${COLORS.line}`, marginBottom: 18, overflow: "hidden" }}>
        <div style={{ display: "flex", alignItems: "center", padding: "14px 14px 10px", gap: 10 }}>
          <Avatar initials={p.initials} color={p.avatar} />
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 600, fontSize: 14.5, color: COLORS.ink }}>{p.farmer}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 3, fontSize: 12, color: COLORS.olive }}>
              <Icon name="pin" size={12} color={COLORS.olive} />
              {p.location}
            </div>
          </div>
          <button
            onClick={() => toggleFollow(p.farmer)}
            style={{
              border: `1px solid ${following.has(p.farmer) ? COLORS.line : COLORS.ink}`,
              background: following.has(p.farmer) ? COLORS.bg : COLORS.ink,
              color: following.has(p.farmer) ? COLORS.olive : "#fff",
              borderRadius: 20,
              padding: "6px 14px",
              fontSize: 12.5,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            {following.has(p.farmer) ? "Following" : "Follow"}
          </button>
        </div>
        <div style={{ fontSize: 11, color: COLORS.olive, padding: "0 14px 10px" }}>{p.time}</div>

        <div style={{ position: "relative", height: 170, background: p.imgTint, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ fontSize: 64 }}>{p.emoji}</span>
          {soldOut && (
            <div style={{
              position: "absolute", top: 18, right: -34, transform: "rotate(35deg)",
              background: COLORS.clay, color: "#fff", padding: "4px 44px",
              fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, letterSpacing: 1.5, fontWeight: 600,
              boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
            }}>
              SOLD
            </div>
          )}
        </div>

        <div style={{ display: "flex", gap: 12, padding: "14px", alignItems: "center" }}>
          <PriceStamp price={p.price} unit={p.unit} />
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 600, fontSize: 15, color: COLORS.ink, fontFamily: "'Fraunces', serif" }}>{p.crop}</div>
            <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 12.5, color: COLORS.olive, marginTop: 2 }}>
              {soldOut ? "Available: 0 kg" : `Available: ${p.remaining} ${p.unit}`}
              {!soldOut && p.remaining !== p.total ? ` (of ${p.total})` : ""}
            </div>
            <div style={{ fontSize: 12, color: p.priceType === "Negotiable" ? COLORS.gold : COLORS.olive, marginTop: 2, fontWeight: 600 }}>
              {p.priceType}
            </div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 14px 14px" }}>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => setAnalyzerFor(p.id)} style={btnGhost}>Analyzer</button>
            {!soldOut ? (
              <button onClick={() => setSellFor(p.id)} style={btnGhost}>Mark sold</button>
            ) : (
              <span style={{ ...btnGhost, color: COLORS.clay, borderColor: COLORS.clay, cursor: "default" }}>Sold</span>
            )}
            <button onClick={() => setChatWith(p.farmer)} style={btnPrimary}>Message</button>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={() => toggleSave(p.id)} style={{ background: "none", border: "none", cursor: "pointer" }}>
              <Icon name="bookmark" size={18} color={saved.has(p.id) ? COLORS.gold : COLORS.olive} />
            </button>
            <button onClick={() => showToast("Link copied.")} style={{ background: "none", border: "none", cursor: "pointer" }}>
              <Icon name="share" size={18} color={COLORS.olive} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: "'IBM Plex Sans', sans-serif", background: COLORS.bg, minHeight: "100%", display: "flex", justifyContent: "center", padding: "20px 0" }}>
      <style>{FONTS}</style>
      <div style={{ width: "100%", maxWidth: 460, background: COLORS.bg }}>
        <div style={{ position: "sticky", top: 0, background: COLORS.bg, paddingBottom: 12, zIndex: 5 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "4px 4px 14px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Icon name="leaf" color={COLORS.ink} size={22} />
              <span style={{ fontFamily: "'Fraunces', serif", fontWeight: 600, fontSize: 22, color: COLORS.ink }}>
                CropsConnection
              </span>
            </div>
            <div style={{ position: "relative" }}>
              <button
                onClick={() => setNotifOpen((v) => !v)}
                style={{ background: "none", border: "none", cursor: "pointer", padding: 6 }}
                aria-label="Notifications"
              >
                <Icon name="bell" size={22} />
              </button>
              {notifOpen && (
                <div style={{ position: "absolute", right: 0, top: 36, width: 240, background: COLORS.card, borderRadius: 10, boxShadow: "0 8px 24px rgba(31,61,43,0.18)", padding: 10, zIndex: 10 }}>
                  {notifications.map((n) => (
                    <div key={n.id} style={{ padding: "8px 6px", fontSize: 13, color: COLORS.ink, borderBottom: `1px solid ${COLORS.line}` }}>
                      {n.text}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div style={{ display: "flex", gap: 20, padding: "0 4px 14px", borderBottom: `1px solid ${COLORS.line}` }}>
            {TABS.map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontFamily: "'IBM Plex Sans', sans-serif",
                  fontSize: 14.5,
                  fontWeight: tab === t ? 600 : 500,
                  color: tab === t ? COLORS.ink : COLORS.olive,
                  paddingBottom: 10,
                  borderBottom: tab === t ? `2px solid ${COLORS.ink}` : "2px solid transparent",
                }}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {tab === "Feed" && (
          <div style={{ padding: "0 4px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, background: COLORS.card, borderRadius: 24, padding: "10px 14px", marginBottom: 16, border: `1px solid ${COLORS.line}` }}>
              <Icon name="search" size={17} color={COLORS.olive} />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search crop name or location"
                style={{ border: "none", outline: "none", background: "none", fontSize: 13.5, flex: 1, fontFamily: "'IBM Plex Sans', sans-serif", color: COLORS.ink }}
              />
            </div>

            {filtered.length === 0 && (
              <div style={{ textAlign: "center", color: COLORS.olive, padding: "40px 0", fontSize: 14 }}>
                No crops match "{query}" yet.
              </div>
            )}

            {filtered.map((p) => renderPost(p))}
          </div>
        )}

        {tab === "Chats" && (
          <div style={{ padding: "0 4px" }}>
            {chatPartners.map((name) => {
              const post = posts.find((p) => p.farmer === name);
              const log = chatLog[name] || [];
              const last = log[log.length - 1];
              return (
                <button
                  key={name}
                  onClick={() => setChatWith(name)}
                  style={{ display: "flex", alignItems: "center", gap: 12, width: "100%", background: COLORS.card, border: `1px solid ${COLORS.line}`, borderRadius: 14, padding: 12, marginBottom: 10, cursor: "pointer", textAlign: "left" }}
                >
                  <Avatar initials={post.initials} color={post.avatar} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: 14, color: COLORS.ink }}>{name}</div>
                    <div style={{ fontSize: 12.5, color: COLORS.olive }}>
                      {last ? last.text : `Ask about ${post.crop.toLowerCase()}`}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {tab === "Following" && (
          <div style={{ padding: "0 4px" }}>
            {following.size === 0 && (
              <div style={{ textAlign: "center", color: COLORS.olive, padding: "40px 0", fontSize: 14 }}>
                You're not following any farmers yet — tap Follow on a post in the Feed.
              </div>
            )}

            {Array.from(following).length > 0 && (
              <div style={{ display: "flex", gap: 8, overflowX: "auto", marginBottom: 16, paddingBottom: 2 }}>
                {Array.from(following).map((name) => {
                  const post = posts.find((p) => p.farmer === name);
                  return (
                    <div key={name} style={{ display: "flex", alignItems: "center", gap: 6, background: COLORS.card, border: `1px solid ${COLORS.line}`, borderRadius: 20, padding: "6px 12px 6px 6px", flexShrink: 0 }}>
                      <Avatar initials={post.initials} color={post.avatar} size={26} />
                      <span style={{ fontSize: 12.5, fontWeight: 600, color: COLORS.ink, whiteSpace: "nowrap" }}>{name}</span>
                    </div>
                  );
                })}
              </div>
            )}

            {posts.filter((p) => following.has(p.farmer)).map((p) => renderPost(p))}
          </div>
        )}

        {tab === "Profile" && (
          <div style={{ padding: "0 4px" }}>
            <div style={{ background: COLORS.card, borderRadius: 16, border: `1px solid ${COLORS.line}`, padding: 20, textAlign: "center", marginBottom: 16 }}>
              <div style={{ display: "flex", justifyContent: "center", marginBottom: 10 }}>
                <Avatar initials="YOU" color={COLORS.ink} size={64} />
              </div>
              <div style={{ fontFamily: "'Fraunces', serif", fontSize: 19, fontWeight: 600, color: COLORS.ink }}>Your Farm Profile</div>
              <div style={{ fontSize: 12.5, color: COLORS.olive, marginTop: 2 }}>📍 Add your location</div>
              <div style={{ display: "flex", justifyContent: "center", gap: 24, marginTop: 16, fontFamily: "'IBM Plex Mono', monospace" }}>
                <div><div style={{ fontWeight: 600, color: COLORS.ink }}>{posts.length}</div><div style={{ fontSize: 11, color: COLORS.olive }}>Posts</div></div>
                <div><div style={{ fontWeight: 600, color: COLORS.ink }}>{following.size}</div><div style={{ fontSize: 11, color: COLORS.olive }}>Following</div></div>
                <div><div style={{ fontWeight: 600, color: COLORS.ink }}>0</div><div style={{ fontSize: 11, color: COLORS.olive }}>Followers</div></div>
              </div>
            </div>
            <div style={{ fontSize: 13, color: COLORS.olive, textAlign: "center" }}>
              Saved posts: {saved.size === 0 ? "none yet" : Array.from(saved).map((id) => posts.find((p) => p.id === id)?.crop).join(", ")}
            </div>
          </div>
        )}
      </div>

      {chatWith && (
        <Modal onClose={() => setChatWith(null)} title={chatWith}>
          <div style={{ minHeight: 160, maxHeight: 260, overflowY: "auto", display: "flex", flexDirection: "column", gap: 8, marginBottom: 12 }}>
            <div style={bubbleTheirs}>{`Hello, is the ${posts.find((p) => p.farmer === chatWith)?.crop.toLowerCase()} still available?`}</div>
            {(chatLog[chatWith] || []).map((m, i) => (
              <div key={i} style={bubbleMine}>{m.text}</div>
            ))}
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <input
              value={chatDraft}
              onChange={(e) => setChatDraft(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage(chatWith)}
              placeholder="Type a message"
              style={{ flex: 1, border: `1px solid ${COLORS.line}`, borderRadius: 20, padding: "10px 14px", outline: "none", fontSize: 13.5, fontFamily: "'IBM Plex Sans', sans-serif" }}
            />
            <button onClick={() => sendMessage(chatWith)} style={{ background: COLORS.ink, border: "none", borderRadius: "50%", width: 40, height: 40, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
              <Icon name="send" size={16} color="#fff" />
            </button>
          </div>
        </Modal>
      )}

      {analyzerFor && (
        <Modal onClose={() => setAnalyzerFor(null)} title="Analyzer">
          {(() => {
            const p = posts.find((x) => x.id === analyzerFor);
            return (
              <div style={{ fontSize: 13.5, color: COLORS.ink, lineHeight: 1.7 }}>
                <div><b>Crop:</b> {p.crop}</div>
                <div><b>Condition:</b> Looks healthy based on the listing photo</div>
                <div><b>Suggestion:</b> Maintain steady irrigation and sell within the next few days for best freshness</div>
                <div style={{ marginTop: 10, fontSize: 11.5, color: COLORS.olive }}>
                  Mock preview — connect an image-analysis model here for real crop condition detection.
                </div>
              </div>
            );
          })()}
        </Modal>
      )}

      {sellFor && (
        <Modal onClose={() => { setSellFor(null); setSellQty(""); }} title="Update quantity sold">
          {(() => {
            const p = posts.find((x) => x.id === sellFor);
            return (
              <div>
                <div style={{ fontSize: 13, color: COLORS.olive, marginBottom: 10 }}>
                  Remaining: {p.remaining} {p.unit}
                </div>
                <input
                  type="number"
                  value={sellQty}
                  onChange={(e) => setSellQty(e.target.value)}
                  placeholder={`Quantity sold (${p.unit})`}
                  style={{ width: "100%", border: `1px solid ${COLORS.line}`, borderRadius: 10, padding: "10px 12px", fontSize: 13.5, outline: "none", marginBottom: 12, boxSizing: "border-box", fontFamily: "'IBM Plex Sans', sans-serif" }}
                />
                <button onClick={confirmSell} style={{ ...btnPrimary, width: "100%", padding: "10px 0" }}>Update</button>
              </div>
            );
          })()}
        </Modal>
      )}

      {toast && (
        <div style={{ position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)", background: COLORS.ink, color: "#fff", padding: "10px 18px", borderRadius: 20, fontSize: 13, boxShadow: "0 6px 18px rgba(0,0,0,0.25)" }}>
          {toast}
        </div>
      )}
    </div>
  );
}

function Modal({ children, onClose, title }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(31,61,43,0.35)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50, padding: 20 }} onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} style={{ background: COLORS.card, borderRadius: 16, padding: 18, width: "100%", maxWidth: 360 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
          <span style={{ fontFamily: "'Fraunces', serif", fontWeight: 600, fontSize: 17, color: COLORS.ink }}>{title}</span>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer" }}>
            <Icon name="close" size={18} color={COLORS.olive} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

const btnGhost = {
  border: `1px solid ${COLORS.line}`,
  background: "#fff",
  color: COLORS.ink,
  borderRadius: 18,
  padding: "7px 12px",
  fontSize: 12.5,
  fontWeight: 600,
  cursor: "pointer",
};

const btnPrimary = {
  border: "none",
  background: COLORS.ink,
  color: "#fff",
  borderRadius: 18,
  padding: "7px 14px",
  fontSize: 12.5,
  fontWeight: 600,
  cursor: "pointer",
};

const bubbleTheirs = {
  alignSelf: "flex-start",
  background: COLORS.bg,
  color: COLORS.ink,
  padding: "8px 12px",
  borderRadius: "12px 12px 12px 2px",
  fontSize: 13,
  maxWidth: "80%",
};

const bubbleMine = {
  alignSelf: "flex-end",
  background: COLORS.ink,
  color: "#fff",
  padding: "8px 12px",
  borderRadius: "12px 12px 2px 12px",
  fontSize: 13,
  maxWidth: "80%",
};
