export default async function handler(req, res) {
  const { username } = req.query;
  if (!username) return res.status(400).json({ error: "username missing" });

  try {
    const igRes = await fetch(`https://www.instagram.com/${username}/?__a=1&__d=dis`, {
      headers: {
        "User-Agent": "Mozilla/5.0"
      }
    });

    const data = await igRes.json();
    const bio = data?.graphql?.user?.biography || null;

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.status(200).json({ bio });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch bio", details: err.message });
  }
}
