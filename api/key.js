export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  const { STORAGE_REST_API_URL, STORAGE_REST_API_TOKEN } = process.env;
  const key = "password";

  if (!STORAGE_REST_API_URL || !STORAGE_REST_API_TOKEN) {
    return res.status(500).json({ error: "Redis config missing" });
  }

  try {
    const response = await fetch(`${STORAGE_REST_API_URL}/get/${key}`, {
      headers: {
        Authorization: `Bearer ${STORAGE_REST_API_TOKEN}`
      }
    });

    if (!response.ok) {
      return res.status(response.status).json({ error: "Failed to fetch password from Redis" });
    }

    const json = await response.json();
    return res.status(200).json({ password: json.result });
  } catch (err) {
    return res.status(500).json({ error: "Server error" });
  }
}
