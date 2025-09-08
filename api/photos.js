
export default async function handler(req, res) {
  try {
    const {
      GOOGLE_CLIENT_ID,
      GOOGLE_CLIENT_SECRET,
      GOOGLE_REFRESH_TOKEN,
      GOOGLE_PHOTOS_ALBUM_ID,
    } = process.env;

    console.log("🔹 Iniciando /api/photos");
    console.log("Variáveis de ambiente:", {
      client_id: GOOGLE_CLIENT_ID ? "ok" : "missing",
      client_secret: GOOGLE_CLIENT_SECRET ? "ok" : "missing",
      refresh_token: GOOGLE_REFRESH_TOKEN ? "ok" : "missing",
      album_id: GOOGLE_PHOTOS_ALBUM_ID ? "ok" : "missing",
    });

    if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET || !GOOGLE_REFRESH_TOKEN || !GOOGLE_PHOTOS_ALBUM_ID) {
      throw new Error("❌ Variáveis de ambiente faltando");
    }

    // 1️⃣ Troca refresh_token por access_token
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
    console.log("🔹 tokenData:", tokenData);

    if (!tokenData.access_token) {
      throw new Error("❌ Falha ao gerar access_token");
    }

    const accessToken = tokenData.access_token;

    // 2️⃣ Buscar todas as fotos do álbum
    let photos = [];
    let pageToken = null;

    do {
      const body = { albumId: GOOGLE_PHOTOS_ALBUM_ID, pageSize: 50 };
      if (pageToken) body.pageToken = pageToken;

      console.log("🔹 Requisitando fotos com body:", body);

      const response = await fetch(
        "https://photoslibrary.googleapis.com/v1/mediaItems:search",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        }
      );

      const data = await response.json();
      console.log("🔹 Dados recebidos da API do Google Photos:", data);

      if (data.error) {
        throw new Error(`Google Photos API Error: ${JSON.stringify(data.error)}`);
      }

      if (data.mediaItems) {
        photos = photos.concat(
          data.mediaItems.map((item, i) => ({
            src: item.baseUrl + "=w800-h600",
            category: "all",
            alt: item.filename || `Foto ${i + 1}`,
          }))
        );
      }

      pageToken = data.nextPageToken || null;
    } while (pageToken);

    console.log(`🔹 Total de fotos carregadas: ${photos.length}`);

    res.status(200).json({ photos });
  } catch (err) {
    console.error("❌ ERRO NO /api/photos:", err);
    res.status(500).json({ error: err.message });
  }
}
