import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { imageUrl } = await request.json();

    const response = await openai.chat.completions.create({
      model: "gpt-4-vision-preview",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: "What item is in this image? Provide a single word answer." },
            { type: "image_url", image_url: { url: imageUrl } }
          ],
        },
      ],
    });

    const classification = response.choices[0].message.content;

    return NextResponse.json({ classification }, { status: 200 });
  } catch (error) {
    console.error('Error classifying image:', error);
    return NextResponse.json({ error: 'Error classifying image' }, { status: 500 });
  }
}