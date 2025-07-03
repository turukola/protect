export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  const { username } = req.query;

  if (!username) {
    return res.status(400).json({ error: "Missing username" });
  }

  try {
    const response = await fetch(`https://www.instagram.com/api/v1/users/web_profile_info/?username=${username}`, {
      headers: {
        "User-Agent": iphone_ua,
        "x-ig-app-id": "936619743392459",
        "x-asbd-id": "359341",
        "x-csrftoken": "99fHK0D6j-CPjLRWkpxZ9O"
      }
    });

    if (!response.ok) {
      return res.status(response.status).json({ error: "Failed to fetch from Instagram" });
    }

    const json = await response.json();
    return res.status(200).json(json);
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
