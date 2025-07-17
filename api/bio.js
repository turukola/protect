export default async function handler(req, res) {
  const { username } = req.query;
  if (!username) return res.status(400).json({ error: "username missing" });

  try {
    const igRes = await fetch(`https://www.instagram.com/${username}/`, {
      headers: {
        "User-Agent": "Mozilla/5.0"
      }
    });

    const html = await igRes.text();

    // Ambil bio dari elemen <span dir="auto">...</span>
    const match = html.match(/<span class="[^"]*" dir="auto">([^<]*)<\/span>/);
    const bio = match ? match[1].trim() : null;

    res.setHeader("Access-Control-Allow-Origin", "*");
    return res.status(200).json({ bio });
  } catch (err) {
    return res.status(500).json({ error: "Failed to fetch bio", details: err.message });
  }
}
