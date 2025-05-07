export async function handler(event) {
  const targetUrl = event.queryStringParameters.url;

  if (!targetUrl) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Missing URL param" }),
      headers: { 'Access-Control-Allow-Origin': '*' }
    };
  }

  try {
    const response = await fetch(targetUrl);
    const contentType = response.headers.get("content-type");
    const buffer = await response.arrayBuffer();

    return {
      statusCode: 200,
      body: Buffer.from(buffer).toString("base64"),
      isBase64Encoded: true,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': contentType || 'application/octet-stream'
      }
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
      headers: { 'Access-Control-Allow-Origin': '*' }
    };
  }
}
