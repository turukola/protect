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

    const ldJsonMatch = html.match(/<script type="application\/ld\+json">(.+?)<\/script>/);
    if (!ldJsonMatch) {
      return res.status(200).json({ bio: null });
    }

    const ldJson = JSON.parse(ldJsonMatch[1]);
    const bio = ldJson?.description?.trim() || null;

    res.setHeader("Access-Control-Allow-Origin", "*");
    return res.status(200).json({ bio });
  } catch (err) {
    return res.status(500).json({ error: "Failed to fetch bio", details: err.message });
  }
}
