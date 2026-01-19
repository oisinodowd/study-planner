// Load environment variables from .env file
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Express app
const app = express();
const port = process.env.PORT || 3001;

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});

// Middleware
app.use(cors({
  origin: 'http://localhost:5173' // Allow requests from the frontend
}));
app.use(express.json()); // To parse JSON bodies

// API Endpoint for Gemini Chat
app.post('/api/gemini-chat', async (req, res) => {
  const { question, topicName } = req.body;

  if (!question || !topicName) {
    return res.status(400).json({ error: 'Question and topicName are required.' });
  }

  try {
    const prompt = `As an expert tutor, answer the following question about the study topic "${topicName}". Keep your answer concise and helpful.\n\nQuestion: "${question}"`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    res.json({ answer: text });

  } catch (error) {
    console.error('Error calling Gemini API:', error);

    // Check for specific 404 error and provide a helpful message
    if (error.message && error.message.includes('404')) {
        return res.status(500).json({ 
            error: "Error: The AI model was not found. This is likely an issue with your Google Cloud project setup.\n\n" +
                   "How to fix:\n" +
                   "1. Go to the Google Cloud Console.\n" +
                   "2. Select the project linked to your API key.\n" +
                   "3. Go to 'APIs & Services' > 'Library'.\n" +
                   "4. Search for 'Vertex AI API' and click 'Enable'.\n" +
                   "5. Restart this backend server."
        });
    }

    res.status(500).json({ error: 'Failed to get a response from the AI.' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Backend server is running on http://localhost:${port}`);
  if (!process.env.GEMINI_API_KEY) {
    console.warn('WARNING: GEMINI_API_KEY is not set. The AI endpoint will fail.');
  }
});
