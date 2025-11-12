import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userInput } = await req.json();
    
    if (!userInput || userInput.trim().length < 10) {
      return new Response(
        JSON.stringify({ error: "入力内容が短すぎます。もう少し詳しく入力してください。" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log("Generating theme content for input:", userInput);

    const systemPrompt = `You are a professional business communication assistant for insurance agency management in Japan.
Given information from a manager, create a formal announcement for sales staff to share with agency owners.

Return ONLY a valid JSON object with this exact structure:
{
  "title": "A clear, formal Japanese title (20-40 characters)",
  "content": "Professional formatted content (200-400 characters)"
}

Content guidelines:
- Use formal Japanese business language (keigo)
- Include polite greeting if appropriate
- Clear explanation of the information
- Relevant details (dates, times, locations if provided)
- Use line breaks (\\n) for readability
- Use bullet points (・) where appropriate
- End with a call to action or closing

Format everything professionally for internal business communication.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content: systemPrompt
          },
          {
            role: "user",
            content: `以下の情報から、営業担当者が代理店経営者に伝えるための投稿を作成してください：\n\n${userInput}`
          }
        ],
        response_format: { type: "json_object" }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI API error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "レート制限に達しました。しばらく待ってから再試行してください。" }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI利用枠が不足しています。管理者にお問い合わせください。" }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      throw new Error("AI API error");
    }

    const data = await response.json();
    let content = data.choices[0].message.content;
    
    console.log("AI response content:", content);
    
    // Strip markdown code blocks if present
    if (content.trim().startsWith('```')) {
      const match = content.match(/```(?:json)?\s*\n([\s\S]*?)\n```/);
      if (match) {
        content = match[1];
      }
    }
    
    let parsed;
    try {
      parsed = JSON.parse(content);
    } catch (e) {
      console.error("Failed to parse AI response:", content);
      throw new Error("AIの応答を解析できませんでした。");
    }

    if (!parsed.title || !parsed.content) {
      console.error("Invalid AI response structure:", parsed);
      throw new Error("AIの応答が不正な形式です。");
    }

    console.log("Successfully generated theme content");

    return new Response(
      JSON.stringify({ 
        title: parsed.title, 
        content: parsed.content 
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in generate-theme-content function:", error);
    const errorMessage = error instanceof Error ? error.message : "コンテンツの生成中にエラーが発生しました。";
    return new Response(
      JSON.stringify({ 
        error: errorMessage
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
