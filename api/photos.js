import fetch from "node-fetch";

export default async function handler(req, res) {
  try {
    const {
      GOOGLE_CLIENT_ID,
      GOOGLE_CLIENT_SECRET,
      GOOGLE_REFRESH_TOKEN,
      GOOGLE_PHOTOS_ALBUM_ID,
    } = process.env;

    // 1. Troca refresh_token por um access_token novo
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

    if (!tokenData.access_token) {
      console.error("Erro ao pegar access_token:", tokenData);
      return res.status(500).json({ error: "Não foi possível gerar access_token" });
    }

    // 2. Pega as fotos do álbum
    const photosResponse = await fetch(
      "https://photoslibrary.googleapis.com/v1/mediaItems:search",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${tokenData.access_token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          albumId: GOOGLE_PHOTOS_ALBUM_ID,
          pageSize: 50, // ajusta se quiser mais/menos
        }),
      }
    );

    const photosData = await photosResponse.json();

    if (!photosData.mediaItems) {
      return res.status(500).json({ error: "Não foi possível buscar fotos", details: photosData });
    }

    // 3. Retorna só URLs de imagem (ou tudo se quiser)
    const photos = photosData.mediaItems.map((item) => ({
      baseUrl: item.baseUrl,
      filename: item.filename,
    }));

    res.status(200).json(photos);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro interno" });
  }
}
