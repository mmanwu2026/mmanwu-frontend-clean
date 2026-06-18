import "dotenv/config";
import { createClient } from "@supabase/supabase-js";

// ------------------------------
//  Supabase + API Key Setup
// ------------------------------
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const apiKey = process.env.OPENAI_API_KEY!;

// ------------------------------
//  generateRewrites Function
// ------------------------------
async function generateRewrites(input: string, apiKey: string) {
  return {
    calm: input,
    direct: input,
    elevated: input,
  };
}

// ------------------------------
//  Gatekeeper Worker Loop
// ------------------------------
async function runWorker() {
  console.log("Gatekeeper Worker started...");

  while (true) {
    const { data: job, error: jobError } = await supabase
      .from("gatekeeper_jobs")
      .select("*")
      .eq("status", "pending")
      .order("created_at", { ascending: true })
      .limit(1)
      .single();

    if (jobError || !job) {
      await sleep(2000);
      continue;
    }

    console.log("Processing job:", job.id);

    await supabase
      .from("gatekeeper_jobs")
      .update({ status: "processing" })
      .eq("id", job.id);

    const { data: post } = await supabase
      .from("posts")
      .select("*")
      .eq("id", job.post_id)
      .single();

    if (!post) {
      console.log("Post not found, skipping job");
      await supabase
        .from("gatekeeper_jobs")
        .update({ status: "done" })
        .eq("id", job.id);
      continue;
    }

    const text = post.content;

    const analysisRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `
Analyze the user's message and return ONLY JSON:
{
  "emotion": "...",
  "intensity": 0-1,
  "toxicity": 0-1,
  "bullying": 0-1,
  "clarity": 0-1
}
            `,
          },
          { role: "user", content: text },
        ],
        temperature: 0,
      }),
    });

    const analysisJson = await analysisRes.json();

    // ------------------------------
    //  Safe JSON Parsing
    // ------------------------------
    let analysis;

    try {
      const content = analysisJson?.choices?.[0]?.message?.content;
      analysis = content ? JSON.parse(content) : null;
    } catch {
      analysis = null;
    }

    if (!analysis) {
      analysis = {
        emotion: "neutral",
        intensity: 0,
        toxicity: 0,
        bullying: 0,
        clarity: 1,
      };
    }

    const rewrites = await generateRewrites(text, apiKey);

    await supabase
      .from("posts")
      .update({
        emotion: analysis.emotion,
        toxicity: analysis.toxicity,
        bullying: analysis.bullying,
        clarity: analysis.clarity,
        rewrites,
        status: "processed",
      })
      .eq("id", post.id);

    await supabase
      .from("gatekeeper_jobs")
      .update({ status: "done" })
      .eq("id", job.id);

    console.log("Job completed:", job.id);
  }
}

// ------------------------------
//  Sleep Helper
// ------------------------------
function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ------------------------------
//  Start the Worker
// ------------------------------
runWorker();
