const DOWNLOAD_API = 'https://api.cobalt.tools/';
const ALLOWED_ORIGIN = '*';

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json; charset=utf-8'
  };
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: corsHeaders()
  });
}

export default {
  async fetch(request) {
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders() });
    }

    if (request.method !== 'POST') {
      return json({ error: 'Use POST para solicitar um download.' }, 405);
    }

    let body;
    try {
      body = await request.json();
    } catch (_) {
      return json({ error: 'O corpo da requisição precisa ser JSON.' }, 400);
    }

    const urlValue = typeof body.url === 'string' ? body.url.trim() : '';
    let mediaUrl;
    try {
      mediaUrl = new URL(urlValue);
    } catch (_) {
      return json({ error: 'URL inválida.' }, 400);
    }

    if (!['http:', 'https:'].includes(mediaUrl.protocol)) {
      return json({ error: 'Somente URLs HTTP e HTTPS são aceitas.' }, 400);
    }

    const mediaType = body.type === 'audio' || body.downloadMode === 'audio' ? 'audio' : 'video';

    try {
      const response = await fetch(DOWNLOAD_API, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          url: mediaUrl.toString(),
          downloadMode: mediaType === 'audio' ? 'audio' : 'auto',
          audioFormat: 'mp3',
          videoQuality: '720'
        })
      });

      const result = await response.json();
      if (!response.ok) {
        return json({ error: 'A API de download recusou a solicitação.' }, 502);
      }

      return json(result, 200);
    } catch (error) {
      console.error('Download API error:', error);
      return json({ error: 'A API de download está indisponível no momento.' }, 502);
    }
  }
};
