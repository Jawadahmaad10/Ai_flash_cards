import { NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai';

const systemPrompt = `
You are a flashcard creator, you take in text and create multiple flashcards from it. Make sure to create exactly 10 flashcards.
The front of the card should contain a topic or question and the back should contain an explanation or answer.
Both front and back should be one sentence long.
You should return in the following JSON format:
{
  "type": "object",
  "flashcards": {
    "front": {
      "type": "string",
      "description": "The question or topic on the front of the flashcard"
    },
    "back": {
      "type": "string",
      "description": "The answer or explanation on the back of the flashcard"
    }
  }
}`;

export async function POST(req) {
  const data = await req.text();
  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY);
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    systemInstruction: systemPrompt,
    generationConfig: { responseMimeType: "application/json" }
  });

  const result = await model.generateContent(data);
  const response = await result.response.text();

  // Parse the JSON response from the Gemini API
  const flashcards = JSON.parse(response)

  // Return the flashcards as a JSON response
  return NextResponse.json(flashcards.flashcards)
}