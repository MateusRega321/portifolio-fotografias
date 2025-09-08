export default async function handler(req, res) {
  try {
    const {
      GOOGLE_CLIENT_ID,
      GOOGLE_CLIENT_SECRET,
      GOOGLE_REFRESH_TOKEN,
      GOOGLE_PHOTOS_ALBUM_ID,
    } = process.env;

    if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET || !GOOGLE_REFRESH_TOKEN || !GOOGLE_PHOTOS_ALBUM_ID) {
      return res.status(500).json({ error: "Variáveis de ambiente faltando" });
    }

    // Gera access_token a partir do refresh token
    const tokenResp = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        refresh_token: GOOGLE_REFRESH_TOKEN,
        grant_type: "refresh_token",
      }),
    });

    const tokenData = await tokenResp.json();

    if (!tokenData.access_token) {
      return res.status(500).json({ error: "Falha ao gerar access_token", details: tokenData });
    }

    const accessToken = tokenData.access_token;

    // Busca fotos do álbum
    const response = await fetch("https://photoslibrary.googleapis.com/v1/mediaItems:search", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ albumId: GOOGLE_PHOTOS_ALBUM_ID, pageSize: 100 }),
    });

    const data = await response.json();

    if (data.error) {
      return res.status(500).json({ error: "Google Photos API Error", details: data.error });
    }

    const photos = (data.mediaItems || []).map(item => ({
      src: item.baseUrl + "=w800-h600",
      alt: item.filename,
    }));

    res.status(200).json({ photos });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
      }
