export async function handler(event) {
  const targetUrl = event.queryStringParameters.url;

  if (!targetUrl) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Missing URL param" }),
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json"
      }
    };
  }

  try {
    const response = await fetch(targetUrl);

    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
    }

    const contentType = response.headers.get("content-type") || "application/json";
    const body = await response.text(); // Per JSON, non arrayBuffer

    return {
      statusCode: 200,
      body: body,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": contentType
      }
    };

  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json"
      }
    };
  }
}
