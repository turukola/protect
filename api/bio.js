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
    const match = html.match(/"biography":"(.*?)"/);
    const raw = match ? match[1] : null;

    // decode unicode escape (contoh \u003C jadi <)
    const bio = raw ? JSON.parse(`"${raw}"`) : null;

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.status(200).json({ bio });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch bio", details: err.message });
  }
}
