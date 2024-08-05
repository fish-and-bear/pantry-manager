import type { NextApiRequest, NextApiResponse } from 'next'
import { PredictionServiceClient, protos } from '@google-cloud/aiplatform';

const client = new PredictionServiceClient({
  apiEndpoint: 'us-central1-aiplatform.googleapis.com',
});

async function classifyImageWithVertexAI(imageUrl: string) {
  const projectId = process.env.GOOGLE_CLOUD_PROJECT_ID;
  const location = process.env.GOOGLE_CLOUD_LOCATION;
  const modelId = process.env.GOOGLE_CLOUD_MODEL_ID;

  if (!projectId || !location || !modelId) {
    throw new Error('Missing Vertex AI configuration');
  }

  const endpoint = `projects/${projectId}/locations/${location}/models/${modelId}`;

  const imageContent = await fetch(imageUrl).then(res => res.arrayBuffer()).then(buffer => 
    Buffer.from(buffer).toString('base64')
  );

  const request: protos.google.cloud.aiplatform.v1.IPredictRequest = {
    endpoint,
    instances: [
      {
        structValue: {
          fields: {
            image: { stringValue: imageContent },
          },
        },
      },
    ],
    parameters: {
      structValue: {
        fields: {
          confidenceThreshold: { numberValue: 0.5 },
          maxPredictions: { numberValue: 5 },
        },
      },
    },
  };

  const [response] = await client.predict(request);
  return response;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    try {
      const { imageUrl } = req.body;
      const classification = await classifyImageWithVertexAI(imageUrl);
      res.status(200).json({ classification });
    } catch (error) {
      console.error('Error classifying image with Vertex AI:', error);
      res.status(500).json({ error: 'Failed to classify image' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}