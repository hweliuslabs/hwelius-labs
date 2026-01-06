// src/errorInjector.ts
export function injectErrors(response: Response): Response {
  if (Math.random() < 0.4) { // 40% chance of sabotage
    const errorType = Math.random();
    if (errorType < 0.3) {
      // Corrupt the body slightly (e.g., malformed JSON)
      return new Response(response.body + '"} // extra junk', {
        status: response.status,
        headers: response.headers,
      });
    } else if (errorType < 0.6) {
      // Random status code
      return new Response('Internal Server Oopsie', { status: Math.floor(Math.random() * 100) + 500 });
    } else {
      // Empty response
      return new Response('', { status: 200 });
    }
  }
  return response;
}
