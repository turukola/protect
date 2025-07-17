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

    const match = html.match(/<script type="application\/json" id="__NEXT_DATA__">(.+?)<\/script>/);
    if (!match) {
      return res.status(200).json({ bio: null });
    }

    const json = JSON.parse(match[1]);

    const bio =
      json?.props?.pageProps?.graphql?.user?.biography?.trim() ||
      json?.props?.pageProps?.profilePage?.[0]?.graphql?.user?.biography?.trim() ||
      null;

    res.setHeader("Access-Control-Allow-Origin", "*");
    return res.status(200).json({ bio });
  } catch (err) {
    return res.status(500).json({ error: "Failed to fetch bio", details: err.message });
  }
}
