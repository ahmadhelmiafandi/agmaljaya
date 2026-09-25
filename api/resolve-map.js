export default async function handler(req, res) {
  const { url } = req.query;
  if (!url) {
    return res.status(400).json({ error: 'Missing url parameter' });
  }
  try {
    const response = await fetch(url, {
      redirect: 'follow',
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });
    return res.status(200).json({ finalUrl: response.url });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
