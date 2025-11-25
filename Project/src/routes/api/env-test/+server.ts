// src/routes/api/env-test/+server.ts
export function GET() {
  const hasKey = !!import.meta.env.VITE_GEMINI_API_KEY;
  return new Response(hasKey ? 'VITE_GEMINI_API_KEY: present'
                             : 'VITE_GEMINI_API_KEY: missing');
}
