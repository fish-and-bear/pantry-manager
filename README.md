
# Pantry Management Application

This repository contains a Pantry Management Application built with Next.js, Material UI, and Firebase. The application allows users to manage their pantry items, including adding, editing, deleting, and searching for items. Additionally, users can upload images, which are classified using GPT Vision API and GCP Vertex AI.

## Features

- **CRUD Operations**: Add, edit, delete, and view pantry items.
- **Search and Filter**: Easily find pantry items with search functionality.
- **Image Capture and Upload**: Take pictures using the device's camera and upload them to Firebase.
- **Image Classification**: Classify images using GPT Vision API and GCP Vertex AI.
- **Recipe Suggestions**: Get recipe suggestions based on the contents of your pantry using OpenAI API.
- **Responsive Design**: A user-friendly interface designed with Material UI.
- **Deployment**: Deployed using Vercel with CI/CD.

## Technologies Used

- **Next.js**: A React framework for server-rendered applications.
- **Material UI**: A popular React UI framework.
- **Firebase**: For authentication, Firestore database, and storage.
- **GPT Vision API**: For image classification.
- **GCP Vertex AI**: For advanced image classification.
- **OpenAI API**: For generating recipe suggestions.
- **Vercel**: For deployment with CI/CD.

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- Firebase account
- OpenAI account
- GCP account

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/pantry-management-app.git
   cd pantry-management-app
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up Firebase:**
   - Create a Firebase project in the Firebase console.
   - Enable Firestore, Authentication, and Storage.
   - Create a `.env.local` file in the root directory and add your Firebase config:
     ```env
     NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
     NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-auth-domain
     NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
     NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-storage-bucket
     NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
     NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
     ```

4. **Set up OpenAI and GCP Vertex AI:**
   - Add your API keys and endpoints to the `.env.local` file:
     ```env
     NEXT_PUBLIC_OPENAI_API_KEY=your-openai-api-key
     NEXT_PUBLIC_GCP_API_KEY=your-gcp-api-key
     ```

5. **Run the development server:**
   ```bash
   npm run dev
   ```

   The application will be available at [http://localhost:3000](http://localhost:3000).

### Deployment

This application is set up to be deployed on Vercel. Follow these steps:

1. **Push your repository to GitHub:**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Deploy to Vercel:**
   - Log in to Vercel and import your repository.
   - Set up environment variables in Vercel with the same keys from `.env.local`.
   - Vercel will automatically build and deploy your application.

## API Endpoints

### Image Classification API

This endpoint sends an image URL to the GPT Vision API for classification.

- **Endpoint:** `/api/classify`
- **Method:** `POST`
- **Payload:**
  ```json
  {
    "imageUrl": "https://path-to-your-image"
  }
  ```

### Recipe Suggestions API

This endpoint sends pantry items to the OpenAI API for recipe suggestions.

- **Endpoint:** `/api/get-recipes`
- **Method:** `POST`
- **Payload:**
  ```json
  {
    "items": ["item1", "item2", "item3"]
  }
  ```

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or new features.

## License

This project is licensed under the MIT License.