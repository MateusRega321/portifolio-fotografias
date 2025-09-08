import fetch from "node-fetch";

export default async function handler(req, res) {
  try {
    const {
      GOOGLE_CLIENT_ID,
      GOOGLE_CLIENT_SECRET,
      GOOGLE_REFRESH_TOKEN,
      GOOGLE_PHOTOS_ALBUM_ID,
    } = process.env;

    // 1. Troca refresh_token por access_token
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
      return res
        .status(500)
        .json({ error: "Falha ao gerar access_token", details: tokenData });
    }

    // 2. Função auxiliar para buscar todas as páginas
    async function fetchAllPhotos(accessToken, albumId) {
      let photos = [];
      let pageToken = null;

      do {
        const body = {
          albumId,
          pageSize: 50,
        };
        if (pageToken) body.pageToken = pageToken;

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

        if (data.mediaItems) {
          photos = photos.concat(data.mediaItems.map((item) => item.baseUrl));
        }

        pageToken = data.nextPageToken || null;
      } while (pageToken);

      return photos;
    }

    // 3. Busca todas as fotos do álbum
    const photos = await fetchAllPhotos(
      tokenData.access_token,
      GOOGLE_PHOTOS_ALBUM_ID
    );

    res.status(200).json({ photos });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro interno" });
  }
}
