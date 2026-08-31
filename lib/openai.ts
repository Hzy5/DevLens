import { createOpenAI } from "@ai-sdk/openai";
import { APICallError, generateText, Output } from "ai";
import { AnalyzeError } from "@/lib/errors";
import { buildUserPrompt, DEVLENS_SYSTEM_PROMPT } from "@/lib/prompts";
import { analysisSchema, parseAnalysis } from "@/lib/validation";
import type { Analysis, InputMode, ScreenshotPayload } from "@/types/analysis";

const MODEL_ID = "gpt-5.4-mini";

function getClient() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new AnalyzeError("api_failure");
  }
  return createOpenAI({ apiKey });
}

function isRateLimited(error: unknown): boolean {
  if (APICallError.isInstance(error) && error.statusCode === 429) {
    return true;
  }
  return false;
}

export async function analyzeWithOpenAI(options: {
  input: string;
  mode: InputMode;
  image: ScreenshotPayload | null;
}): Promise<Analysis> {
  const client = getClient();
  const userText = buildUserPrompt(options.input, options.mode);

  const content: Array<
    | { type: "text"; text: string }
    | { type: "file"; mediaType: string; data: string }
  > = [{ type: "text", text: userText }];

  if (options.image) {
    content.push({
      type: "file",
      mediaType: options.image.mimeType,
      data: options.image.data,
    });
  }

  try {
    const { output } = await generateText({
      model: client(MODEL_ID),
      system: DEVLENS_SYSTEM_PROMPT,
      output: Output.object({
        name: "DevLensDiagnosis",
        description: "Structured debugging diagnosis from DevLens.",
        schema: analysisSchema,
      }),
      messages: [{ role: "user", content }],
      experimental_telemetry: { isEnabled: false },
    });

    return parseAnalysis(output);
  } catch (error) {
    if (error instanceof AnalyzeError) {
      throw error;
    }

    if (isRateLimited(error)) {
      throw new AnalyzeError("rate_limited");
    }

    if (APICallError.isInstance(error)) {
      // Log status only — never the key, prompt, or provider body.
      console.error("analyze_failed", { status: error.statusCode });
    } else {
      console.error("analyze_failed", { type: error instanceof Error ? error.name : "unknown" });
    }

    throw new AnalyzeError("api_failure");
  }
}
