# InteriorVista - AI Interior Design Assistant

InteriorVista is a production-ready web application that helps users visualize their dream spaces using Google's Gemini AI. 

## Features
- **AI Room Analysis**: Upload a photo of any room and receive style, furniture, and color suggestions.
- **Interactive AI Chat**: Talk to a specialized interior design chatbot for instant advice.
- **Saved Designs**: Manage and revisit your previous design generation projects.
- **Firebase Auth**: Secure login via email or Google.
- **Responsive Design**: Polished experience on both desktop and mobile.

## Tech Stack
- **Frontend**: React, Vite, Framer Motion, Lucide Icons, Tailwind CSS
- **AI**: Google Gemini API
- **Backend/Auth**: Firebase Firestore & Authentication
- **Utilities**: Axios, clsx, tailwind-merge

## Deployment on Vercel

1. **Prerequisites**: Ensure you have a Firebase project and a Google Gemini API Key.
2. **Push to GitHub**: Fork this repository and commit your changes.
3. **Connect to Vercel**: Import the repository into Vercel.
4. **Environment Variables**: Add the following variables in the Vercel dashboard:
   - `GEMINI_API_KEY`: Your Google AI Studio key.
   - `VITE_FIREBASE_API_KEY`: (If you use standard Vite env) Or just ensure the `firebase-applet-config.json` is included.
5. **Build Command**: `npm run build`
6. **Output Directory**: `dist`

## Setup & Local Development
```bash
npm install
npm run dev
```

*Note: This app is configured for port 3000 and binding to 0.0.0.0 for development environments.*
