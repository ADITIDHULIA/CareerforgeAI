import { GoogleGenerativeAI } from '@google/generative-ai';
import { config } from '../config/env';
import { logger } from '../utils/logger';

export interface AnalysisResult {
  matchScore: number;
  summary: string;
  matchingSkills: string[];
  missingSkills: string[];
  strengths: string[];
  improvements: string[];
  interviewQuestions: {
    technical: Array<{
      question: string;
      expectedAnswer: string;
      difficulty: 'Easy' | 'Medium' | 'Hard';
    }>;
    behavioral: Array<{
      question: string;
      tips: string;
    }>;
  };
  learningPriorities: Array<{
    skill: string;
    priority: 'High' | 'Medium' | 'Low';
    actionPlan: string;
    estimatedWeeks: number;
  }>;
}

export class GeminiService {
  private static getClient(): GoogleGenerativeAI {
    if (!config.geminiApiKey || config.geminiApiKey.trim() === '') {
      throw new Error(
        'GEMINI_API_KEY is not configured on the server. Please add a valid Google Gemini API key to backend/.env to perform AI analyses.'
      );
    }
    return new GoogleGenerativeAI(config.geminiApiKey);
  }

  public static async analyzeResume(
    resumeText: string,
    jobTitle: string,
    jobDescription: string,
    company?: string
  ): Promise<AnalysisResult> {
    const genAI = this.getClient();
    const candidateModels = [
      'gemini-3.5-flash-lite',
      'gemini-3.5-flash',
      'gemini-3.8-flash',
      'gemini-flash-latest',
    ];

    const targetInfo = company ? `${jobTitle} at ${company}` : jobTitle;

    const prompt = `
You are CareerForge AI, a senior technical recruiter and career coach.
Analyze the candidate's resume text against the target job description thoroughly and constructively.
Be objective and realistic. Highlight genuine strengths, identify critical skill gaps, suggest specific resume bullet improvements, generate tailored technical and behavioral interview preparation questions, and outline structured learning priorities.
Do not fabricate credentials, and never claim this report guarantees employment.

Target Role: ${targetInfo}

Candidate Resume Text:
"""
${resumeText.slice(0, 8000)}
"""

Target Job Description:
"""
${jobDescription.slice(0, 8000)}
"""

You MUST respond strictly with a valid JSON object matching the following structure:
{
  "matchScore": number (integer between 0 and 100 representing the resume alignment with the job requirements),
  "summary": "A 2 to 3 sentence concise executive summary highlighting alignment and main areas for growth.",
  "matchingSkills": ["list", "of", "skills", "found", "in", "both"],
  "missingSkills": ["list", "of", "key", "skills", "demanded", "in", "job", "description", "missing", "from", "resume"],
  "strengths": ["Clear strength 1 with context", "Strength 2", "Strength 3"],
  "improvements": ["Specific resume enhancement suggestion 1", "Specific suggestion 2", "Specific suggestion 3"],
  "interviewQuestions": {
    "technical": [
      {
        "question": "Realistic technical question evaluating a required skill",
        "expectedAnswer": "Key technical concepts, architectural decisions, or best practices expected in an answer",
        "difficulty": "Easy" | "Medium" | "Hard"
      }
    ],
    "behavioral": [
      {
        "question": "Scenario or behavioral question tailored to this role",
        "tips": "Tips on structuring the answer using the STAR method"
      }
    ]
  },
  "learningPriorities": [
    {
      "skill": "Missing or weak skill name",
      "priority": "High" | "Medium" | "Low",
      "actionPlan": "Clear hands-on recommendation to master this concept or build a project with it",
      "estimatedWeeks": 2
    }
  ]
}
`;

    let lastError: any = null;

    for (const modelName of candidateModels) {
      try {
        logger.info(`Attempting AI analysis using model: ${modelName}`);
        const model = genAI.getGenerativeModel({
          model: modelName,
          generationConfig: {
            responseMimeType: 'application/json',
            temperature: 0.2,
          },
        });

        const response = await model.generateContent(prompt);
        const text = response.response.text();

        // Clean response text in case there are markdown tags
        const cleaned = text
          .replace(/^```json/im, '')
          .replace(/^```/im, '')
          .replace(/```$/im, '')
          .trim();

        const parsed: AnalysisResult = JSON.parse(cleaned);

        // Validate required properties
        if (
          typeof parsed.matchScore !== 'number' ||
          !Array.isArray(parsed.matchingSkills) ||
          !Array.isArray(parsed.missingSkills)
        ) {
          throw new Error('Invalid JSON format received from Gemini AI model.');
        }

        // Constrain matchScore between 0 and 100
        parsed.matchScore = Math.min(Math.max(Math.round(parsed.matchScore), 0), 100);

        logger.info(`AI analysis successfully generated with ${modelName}`);
        return parsed;
      } catch (error: any) {
        lastError = error;
        logger.warn(`Model ${modelName} encountered an error: ${error.message}`);

        // If invalid key, fail immediately without retrying other models
        if (error.message?.includes('API_KEY_INVALID') || error.message?.includes('API key not valid')) {
          throw new Error('The configured GEMINI_API_KEY is invalid. Please verify your Google AI Studio API key.');
        }

        // Otherwise continue to next model in the candidate list
      }
    }

    logger.error('All Gemini AI candidate models failed. Last error:', lastError?.message);

    if (lastError?.message?.includes('RESOURCE_EXHAUSTED') || lastError?.status === 429) {
      throw new Error('Gemini API rate limit or quota exceeded. Please wait a moment and try again.');
    }

    if (lastError?.name === 'SyntaxError') {
      throw new Error('Failed to parse AI response into structured data. Please try again.');
    }

    throw new Error(
      lastError?.message ||
        'The AI analysis service is temporarily unavailable. Please try again in a few moments.'
    );
  }
}
