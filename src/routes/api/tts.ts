import { createFileRoute } from "@tanstack/react-router";
import {
  grokTtsAvailable,
  listGrokVoices,
  synthesizeGrokSpeech,
  DEFAULT_GROK_VOICE,
} from "@/lib/grok-tts.server";

export const Route = createFileRoute("/api/tts")({
  server: {
    handlers: {
      GET: async () => {
        const grok = grokTtsAvailable();
        const voices = grok ? await listGrokVoices() : [];
        return Response.json({
          grok,
          openai: grok,
          voice: DEFAULT_GROK_VOICE,
          voices,
        });
      },
      POST: async ({ request }) => {
        let body: {
          text?: string;
          voice?: string;
          voice_id?: string;
          language?: string;
          lang?: string;
        } = {};
        try {
          body = (await request.json()) as typeof body;
        } catch {
          return Response.json({ error: "Expected JSON" }, { status: 400 });
        }
        try {
          const spoken = await synthesizeGrokSpeech({
            text: body.text || "",
            voice: body.voice_id || body.voice,
            language: body.language || body.lang,
          });
          const audio = Buffer.from(spoken.bytes).toString("base64");
          return Response.json({
            audio,
            format: "mp3",
            voice: spoken.voice,
            language: spoken.language,
            words: [],
          });
        } catch (error) {
          const status = (error as { status?: number }).status || 500;
          const message =
            error instanceof Error ? error.message : "Grok voice failed";
          return Response.json({ error: message }, { status });
        }
      },
    },
  },
});
