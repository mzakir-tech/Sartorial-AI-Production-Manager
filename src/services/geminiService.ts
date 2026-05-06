import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export interface ProductionPlan {
  understanding: string;
  reasoning: string;
  decision: {
    fabric: string;
    cost: string;
    delivery: string;
  };
  riskAndTradeoff: string;
  decisionConfidence: {
    fabricChoice: string;
    timelineFeasibility: string;
    budgetSafetyMargin: string;
    riskLevel: string;
  };
  rejectedOptions: {
    option: string;
    reason: string;
  }[];
  toolsUsed: string[];
  agentTrace: string;
  systemExecutionFlow: string;
  bufferLogic: string;
  systemConfidence: string;
  actionSimulation: string;
  finalOutput: string;
}

export async function generateProductionPlan(orderRequest: string): Promise<ProductionPlan> {
  const prompt = `
    You are an AI Fashion Production Manager. 
    Your job is to:
    - Understand customer order
    - Decide fabric based on budget (be realistic about fashion costs)
    - Estimate cost
    - Plan production steps (cutting, sewing, quality control, etc.)
    - Estimate delivery time
    - Analyze potential risks and the reasoning behind tradeoffs made
    - Maintain an action-based agentic internal state

    Customer Order: "${orderRequest}"

    You MUST provide your response in a strict JSON format that matches the following structure (no other text, just the JSON):
    {
      "understanding": "...",
      "reasoning": "...",
      "decision": {
        "fabric": "...",
        "cost": "...",
        "delivery": "..."
      },
      "riskAndTradeoff": "...",
      "decisionConfidence": {
        "fabricChoice": "92%",
        "timelineFeasibility": "88%",
        "budgetSafetyMargin": "96%",
        "riskLevel": "Medium"
      },
      "rejectedOptions": [
        { "option": "Velvet", "reason": "Too heavy for travel and humidity" },
        { "option": "Pure Zardozi", "reason": "Exceeds timeline constraints" }
      ],
      "toolsUsed": ["Constraint Parsing Engine", "Multi-Factor Fabric Decision System", "Cost–Time Optimization Engine", "Production Load Balancer", "Logistics Risk Predictor"],
      "agentTrace": "Input parsed → Constraint Weighting → Option Scoring → Rejection Filtering → Final Optimization",
      "systemExecutionFlow": "Input → Constraint Weighting → Option Scoring → Rejection Filtering → Final Optimization → Output Generation",
      "bufferLogic": "10% time buffer added due to customs uncertainty; Backup stitching lane prepared.",
      "systemConfidence": "High",
      "actionSimulation": "...",
      "finalOutput": "..."
    }

    Specific Instructions for fields:
    - "toolsUsed": MUST use highly technical, action-based names.
    - "decisionConfidence": Provide percentage estimates and a categorical risk level.
    - "rejectedOptions": List at least 2-3 options considered but rejected with logic.
    - "agentTrace": A concise step-by-step trace of how you arrived at the decision.
    - "systemExecutionFlow": A breakdown of the logic flow used.
    - "bufferLogic": Specific safety margins and fallback plans implemented.
    - "systemConfidence": Low, Medium, or High.

    Ensure the content follows these specific headers in the final output but use the keys above:
    [UNDERSTANDING]
    [REASONING]
    [DECISION]
    [RISK & TRADEOFF]
    [DECISION CONFIDENCE]
    [REJECTED OPTIONS]
    [TOOLS USED]
    [SYSTEM EXECUTION FLOW]
    [BUFFER LOGIC]
    [AGENT TRACE]
    [ACTION SIMULATION]
    [FINAL OUTPUT]

    Be professional, decisive, and knowledgeable about textiles and garment manufacturing.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from Gemini");

    // Robustly extract the JSON object in case of extra text
    const firstBrace = text.indexOf('{');
    const lastBrace = text.lastIndexOf('}');
    
    if (firstBrace === -1 || lastBrace === -1) {
      throw new Error("No JSON found in response");
    }

    const cleanedText = text.substring(firstBrace, lastBrace + 1);

    return JSON.parse(cleanedText) as ProductionPlan;
  } catch (error) {
    console.error("Error generating production plan:", error);
    throw error;
  }
}
