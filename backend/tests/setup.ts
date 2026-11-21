import { GeminiService } from '../src/services/gemini.service';

// Mock GeminiService globally during test runs
jest.spyOn(GeminiService, 'analyzeResume').mockImplementation(async (
  resumeText: string,
  jobTitle: string,
  _jobDescription: string,
  _company?: string
) => {
  return {
    matchScore: 82,
    summary: `Mock AI evaluation for ${jobTitle}. Good foundational skills identified.`,
    matchingSkills: ['TypeScript', 'React', 'Node.js'],
    missingSkills: ['Kubernetes', 'AWS'],
    strengths: ['Strong programming basics', 'Clear project history'],
    improvements: ['Add quantitative outcomes to project bullets', 'Mention cloud tools'],
    interviewQuestions: {
      technical: [
        {
          question: 'Mock Question: Explain the Node.js event loop.',
          expectedAnswer: 'Timers, pending callbacks, poll, check, close callbacks phases.',
          difficulty: 'Medium',
        },
      ],
      behavioral: [
        {
          question: 'Mock Question: How do you handle conflicting project priorities?',
          tips: 'Use the STAR method and demonstrate stakeholder communication.',
        },
      ],
    },
    learningPriorities: [
      {
        skill: 'AWS Cloud Architecture',
        priority: 'High',
        actionPlan: 'Deploy a full-stack container on AWS ECS.',
        estimatedWeeks: 2,
      },
    ],
  };
});
