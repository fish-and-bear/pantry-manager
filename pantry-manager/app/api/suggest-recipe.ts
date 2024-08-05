import { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { ingredients } = req.body;

      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are a helpful assistant that suggests recipes based on available ingredients."
          },
          {
            role: "user",
            content: `Suggest a recipe using some or all of these ingredients: ${ingredients.join(', ')}`
          }
        ],
      });

      const recipe = response.choices[0].message.content;

      res.status(200).json({ recipe });
    } catch (error) {
      console.error('Error suggesting recipe:', error);
      res.status(500).json({ error: 'Error suggesting recipe' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}