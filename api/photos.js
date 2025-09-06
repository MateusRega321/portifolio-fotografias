// /api/photos.js
import fetch from "node-fetch";

export default async function handler(req, res) {
  const {
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    GOOGLE_REFRESH_TOKEN,
    GOOGLE_PHOTOS_ALBUM_ID,
  } = process.env;

  if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET || !GOOGLE_REFRESH_TOKEN || !GOOGLE_PHOTOS_ALBUM_ID) {
    return res.status(500).json({ error: "Variáveis de ambiente não configuradas." });
  }

  try {
    // 1️⃣ Obter access token usando refresh token
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        refresh_token: GOOGLE_REFRESH_TOKEN,
        grant_type: "refresh_token",
      }),
    });
    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    // 2️⃣ Buscar fotos do álbum
    const photosResponse = await fetch("https://photoslibrary.googleapis.com/v1/mediaItems:search", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ albumId: GOOGLE_PHOTOS_ALBUM_ID, pageSize: 50 }),
    });

    const photosData = await photosResponse.json();

    // 3️⃣ Extrair URLs das imagens
    const urls = (photosData.mediaItems || []).map(item => `${item.baseUrl}=w800-h800`);

    res.status(200).json({ photos: urls });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao buscar fotos." });
  }
}
