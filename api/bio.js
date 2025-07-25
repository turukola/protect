export default async function handler(req, res) {
  const { username } = req.query;
  if (!username) {
    return res.status(400).json({ error: "username missing" });
  }

  try {
    const igRes = await fetch(`https://www.instagram.com/api/v1/users/web_profile_info/?username=${username}`, {
      headers: {
        "User-Agent": "Instagram 155.0.0.37.107 Android",
        "x-ig-app-id": "936619743392459",
        "Accept": "application/json"
      }
    });

    const contentType = igRes.headers.get("content-type");
    const text = await igRes.text();

    // Kalau bukan JSON → kemungkinan besar HTML (gagal)
    if (!contentType || !contentType.includes("application/json")) {
      return res.status(500).json({
        error: "Failed to fetch bio",
        details: "Invalid content-type, got HTML instead of JSON",
        preview: text.slice(0, 100)
      });
    }

    const json = JSON.parse(text);
    const bio = json?.data?.user?.biography?.trim() || null;

    res.setHeader("Access-Control-Allow-Origin", "*");
    return res.status(200).json({ bio });
  } catch (err) {
    return res.status(500).json({
      error: "Failed to fetch bio",
      details: err.message
    });
  }
}
