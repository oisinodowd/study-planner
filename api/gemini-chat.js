const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini AI
// Note: In Vercel, process.env is populated from Project Settings
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }

  const { question, topicName } = req.body;

  if (!question || !topicName) {
    return res.status(400).json({ error: 'Question and topicName are required.' });
  }

  try {
    const prompt = `As an expert tutor, answer the following question about the study topic "${topicName}". Keep your answer concise and helpful.\n\nQuestion: "${question}"`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    res.status(200).json({ answer: text });

  } catch (error) {
    console.error('Error calling Gemini API:', error);

    // Check for specific 404 error
    if (error.message && error.message.includes('404')) {
        return res.status(500).json({ 
            error: "Error: The AI model was not found. Please check Google Cloud project setup."
        });
    }

    res.status(500).json({ error: 'Failed to get a response from the AI.' });
  }
}