const API_URL = '/api/gemini-chat';

export async function getAIResponse(question: string, topicName: string): Promise<string> {
  console.log(`Fetching real AI response for topic "${topicName}": "${question}"`);

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ question, topicName }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `Server responded with status ${response.status}`);
    }

    const data = await response.json();
    return data.answer;

  } catch (error) {
    console.error('Failed to fetch AI response:', error);
    if (error instanceof Error && error.message.includes('Failed to fetch')) {
        return "I couldn't connect to the backend server. Is it running? Please check the terminal where you ran 'npm start' in the 'backend' folder.";
    }
    return "Sorry, I encountered an error trying to get a response. Please check the backend server console for more details.";
  }
}
