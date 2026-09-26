// Gradium text to speech call behind POST /voice. The upstream wav body is streamed straight back.
export const GRADIUM_ENDPOINT = "https://api.gradium.ai/api/post/speech/tts";

export interface VoiceRequest {
  text: string;
  voice: string;
}

export function parseVoice(body: unknown): VoiceRequest | null {
  if (typeof body !== "object" || body === null) return null;
  const b = body as Record<string, unknown>;
  if (typeof b.text !== "string" || !b.text.trim()) return null;
  if (typeof b.voice !== "string" || !b.voice.trim()) return null;
  return { text: b.text.slice(0, 600), voice: b.voice };
}

// Returns the upstream response when it carries audio, null on any failure.
export async function fetchSpeech(req: VoiceRequest, apiKey: string, fetchImpl: typeof fetch = fetch): Promise<Response | null> {
  let response: Response;
  try {
    response = await fetchImpl(GRADIUM_ENDPOINT, {
      method: "POST",
      headers: { "content-type": "application/json", "x-api-key": apiKey },
      body: JSON.stringify({ text: req.text, voice_id: req.voice, output_format: "wav", only_audio: true }),
    });
  } catch {
    return null;
  }
  if (!response.ok || !response.body) return null;
  return response;
}
