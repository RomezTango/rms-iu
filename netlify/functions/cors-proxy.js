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
      const data = await response.text();
  
      return {
        statusCode: 200,
        body: data,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
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
  