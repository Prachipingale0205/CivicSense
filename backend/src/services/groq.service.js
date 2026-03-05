const Groq = require("groq-sdk");
const env = require("../config/env");

const groq = new Groq({ apiKey: env.GROQ_API_KEY });

const analyzeComplaint = async (title, description) => {
  const systemPrompt = `You are an AI assistant for CivicSense, a government civic grievance platform in India.

Analyze the complaint and return ONLY valid JSON. No explanation. No markdown.

Categories: Water Supply, Roads & Infrastructure, Electricity, Sanitation & Waste, Public Safety, Healthcare, Education, Transportation, Environment, Other

Departments:
- Water Supply → Water & Sanitation Board
- Roads & Infrastructure → Public Works Department
- Electricity → Electricity Distribution Company
- Sanitation & Waste → Municipal Corporation
- Public Safety → Police Department
- Healthcare → Health Department
- Education → Education Department
- Transportation → Transport Authority
- Environment → Environment Department
- Other → General Administration

Urgency: 9-10=Critical, 6-8=High, 3-5=Medium, 1-2=Low

Return this exact JSON:
{
  "category": "string",
  "department": "string",
  "urgencyScore": number,
  "urgencyLabel": "Low|Medium|High|Critical",
  "sentiment": "Neutral|Frustrated|Angry|Urgent",
  "aiSummary": "1-2 sentence summary"
}`;

  try {
    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: systemPrompt },
        {
          role: "user",
          content: `Title: ${title}\nDescription: ${description}`,
        },
      ],
      temperature: 0.1,
      max_tokens: 300,
      response_format: { type: "json_object" },
    });

    const parsed = JSON.parse(response.choices[0].message.content);

    return {
      category:     parsed.category     || "Other",
      department:   parsed.department   || "General Administration",
      urgencyScore: parsed.urgencyScore || 5,
      urgencyLabel: parsed.urgencyLabel || "Medium",
      sentiment:    parsed.sentiment    || "Neutral",
      aiSummary:    parsed.aiSummary    || "Complaint submitted for review.",
    };
  } catch (error) {
    console.error("Groq AI failed — using fallback:", error.message);
    return {
      category:     "Other",
      department:   "General Administration",
      urgencyScore: 5,
      urgencyLabel: "Medium",
      sentiment:    "Neutral",
      aiSummary:    "AI analysis unavailable. Submitted for manual review.",
    };
  }
};

const chatbot = async (message, complaintData) => {
  const context = complaintData
    ? `Complaint: ${complaintData.title}, Status: ${complaintData.status}, Department: ${complaintData.department}`
    : "No active complaint found.";

  try {
    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant for CivicSense. Be empathetic and concise. Max 3 sentences.",
        },
        {
          role: "user",
          content: `${context}\n\nCitizen: ${message}`,
        },
      ],
      temperature: 0.4,
      max_tokens: 200,
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error("Groq chatbot failed:", error.message);
    return "I'm having trouble connecting. Please check the tracking page for your latest status.";
  }
};

module.exports = { analyzeComplaint, chatbot };