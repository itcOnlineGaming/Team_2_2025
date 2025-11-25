import { json } from '@sveltejs/kit';
import { GoogleGenAI } from '@google/genai';

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey });

type Msg = { role: 'user' | 'ai'; content: string };

function toPrompt(messages: Msg[]) {
	return messages
		.map((m) => (m.role === 'user' ? `User: ${m.content}` : `Assistant: ${m.content}`))
		.join('\n');
}

export async function POST({ request }) {
	try {
		const body = await request.json();

		const prompt: string | undefined =
			typeof body?.prompt === 'string'
				? body.prompt
				: Array.isArray(body?.messages)
					? toPrompt(body.messages as Msg[])
					: undefined;

		if (!prompt) {
			return json({ error: 'Send { prompt: string } or { messages: {role, content}[] }' }, { status: 400 });
		}

		const response = await ai.models.generateContent({
			model: 'gemini-2.5-flash',
			contents: prompt
		});

		return json({ reply: response.text });
	} catch (err) {
		console.error(err);
		return json({ error: `Gemini error: ${String(err)}` }, { status: 500 });
	}
}
