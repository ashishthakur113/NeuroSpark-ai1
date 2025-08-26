import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";

const apiKey = "AIzaSyC2eCFjc2RVbB4iSzsSOappI3Pg_EfNL0k"; 
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

async function run(prompt) {
  const chatSession = model.startChat({
    generationConfig,
    history: [
        {
    role: "user",
    parts: [
      { text: `
You are NeuroSpark, a smart but friendly AI assistant.

⚡ Guidelines for behavior:
- Always greet warmly if the user says "hi", "hello", "hey".
- Be conversational, casual, and human-like (avoid robotic or corporate-sounding replies).
- Keep answers clear, concise, and correct.
- If asked for code, use **Markdown code blocks** with the right language tag (e.g., \`\`\`js).
- When explaining, use **real-world examples** so answers feel practical.
- If you don’t know something, admit it honestly instead of making stuff up.
- Never copy raw HTML tags like <p> or <br> into text responses.
- For casual talk (jokes, chit-chat), be light and engaging — like a friendly buddy.
- For technical talk, be structured and accurate.

Your goal: Be helpful, engaging, and trustworthy.
      `}
    ]
  }
    ],
  });

  const result = await chatSession.sendMessage(prompt);
  console.log(result.response.text());
  return result.response.text()
}

export default run;
