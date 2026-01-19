require('dotenv').config();

async function checkModels() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("No API KEY found in .env");
    return;
  }

  console.log("Querying Google API for available models...");
  const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
  
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status} - ${await response.text()}`);
    }
    const data = await response.json();
    
    console.log("\n--- AVAILABLE MODELS FOR GENERATE CONTENT ---");
    let found = false;
    if (data.models) {
        data.models.forEach(m => {
            // Filter for models that support 'generateContent'
            if (m.supportedGenerationMethods && m.supportedGenerationMethods.includes("generateContent")) {
                // The name field comes back like "models/gemini-pro", we usually just need "gemini-pro"
                const shortName = m.name.replace('models/', '');
                console.log(`Model: ${shortName}`);
                found = true;
            }
        });
    }
    
    if (!found) {
        console.log("No models found that support generateContent.");
    }
    console.log("-------------------------------------------\n");

  } catch (e) {
    console.error("Error fetching models:", e);
  }
}

checkModels();
