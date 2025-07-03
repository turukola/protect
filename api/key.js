export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");

  const { KV_REST_API_URL, KV_REST_API_TOKEN } = process.env;
  const key = "key_protect";

  try {
    const response = await fetch(`${KV_REST_API_URL}/get/${key}`, {
      headers: {
        Authorization: `Bearer ${KV_REST_API_TOKEN}`
      }
    });

    if (!response.ok) throw new Error("Failed to fetch pass");

    const json = await response.json();
    return res.status(200).json({ password: json.result });
  } catch (e) {
    return res.status(500).json({ error: "Server Error" });
  }
}
