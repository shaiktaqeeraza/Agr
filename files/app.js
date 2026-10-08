const ENDPOINT = 'https://fra.cloud.appwrite.io/v1';
const PROJECT_ID = '6ac7e339002e4bd9a028';
const DB_ID = '6ac7e46c000c91c5f32d';

const { Client, Account, Databases, ID, Query, Permission, Role } = Appwrite;
const client = new Client().setEndpoint(ENDPOINT).setProject(PROJECT_ID);
const account = new Account(client);
const db = new Databases(client);

async function getUser() { try { return await account.get(); } catch { return null; } }
async function requireUser() {
  const u = await getUser();
  if (!u) { location.href = 'auth.html'; return null; }
  return u;
}
async function logout() { await account.deleteSession('current'); location.href = 'auth.html'; }
function esc(s) { return String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }

async function renderNav() {
  const u = await getUser();
  const links = u
    ? `<a href="post.html">Post</a><a href="messages.html">Messages</a><a href="profile.html">Profile</a><a href="#" onclick="logout()">Log out</a>`
    : `<a href="auth.html">Log in</a>`;
  document.getElementById('nav').innerHTML = `<a class="brand" href="index.html">TradeLink</a><div>${links}</div>`;
  return u;
}

// ids of verified traders (collection "verified", you add docs by hand in the Console)
async function getVerifiedIds() {
  try {
    const r = await db.listDocuments(DB_ID, 'verified', [Query.limit(500)]);
    return new Set(r.documents.map(d => d.$id));
  } catch { return new Set(); }
}
