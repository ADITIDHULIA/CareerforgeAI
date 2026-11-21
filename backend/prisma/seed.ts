import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting CareerForge AI database seed...');

  // 1. Clean existing test data safely
  await prisma.analysisReport.deleteMany({});
  await prisma.resume.deleteMany({});
  await prisma.user.deleteMany({});

  // 2. Create demo student user
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash('Student123!', salt);

  const demoUser = await prisma.user.create({
    data: {
      name: 'Alex Johnson',
      email: 'alex@careerforge.ai',
      passwordHash,
      role: 'student',
      targetRole: 'Full Stack Software Engineer',
      targetCompany: 'Google',
      bio: 'Final year Computer Science student passionate about distributed systems, React, and cloud architecture.',
    },
  });

  console.log(`👤 Created demo user: ${demoUser.email} / Student123!`);

  // 3. Create demo resume
  const demoResume = await prisma.resume.create({
    data: {
      userId: demoUser.id,
      fileName: 'Alex_Johnson_Software_Engineer_Resume.pdf',
      fileUrl: 'sample-resume.pdf',
      fileSize: 142500,
      fileType: 'pdf',
      parsedText: `
ALEX JOHNSON
Email: alex@careerforge.ai | GitHub: github.com/alexjohnson | LinkedIn: linkedin.com/in/alexjohnson

EDUCATION
State University — B.S. in Computer Science (GPA: 3.8/4.0) | Graduating May 2026

TECHNICAL SKILLS
Languages: TypeScript, JavaScript, Python, SQL, C++, HTML/CSS
Frontend: React, Next.js, Tailwind CSS, Redux Toolkit
Backend: Node.js, Express, REST APIs, PostgreSQL, Prisma ORM, Redis
DevOps & Tools: Docker, Git, GitHub Actions, Linux, Jest

PROJECTS
CareerForge AI (Full Stack SaaS)
- Built an AI career prep application using React, Vite, Node.js, Express, and PostgreSQL.
- Implemented secure JWT authentication, Zod schema validation, and PDF resume parsing.
- Integrated Google Gemini AI to analyze resume-to-job descriptions with sub-second response times.

Distributed Task Queue
- Implemented a resilient asynchronous task processing system using Redis and Node.js.
- Handled over 1,500 jobs/sec with exponential backoff retries and dead-letter queue.

EXPERIENCE
Software Engineering Intern — CloudScale Labs (Summer 2025)
- Developed and optimized REST endpoints in Express, reducing latency by 32%.
- Built reusable React component libraries adopted across 3 internal engineering portals.
`,
      extractedSkills: [
        'TypeScript',
        'JavaScript',
        'Python',
        'React',
        'Next.js',
        'Node.js',
        'Express',
        'PostgreSQL',
        'Prisma',
        'Docker',
        'Git',
        'Redis',
        'Tailwind CSS',
        'Jest',
        'REST API',
      ],
    },
  });

  console.log(`📄 Created demo resume: ${demoResume.fileName}`);

  // 4. Create sample analysis report
  const demoAnalysis = await prisma.analysisReport.create({
    data: {
      userId: demoUser.id,
      resumeId: demoResume.id,
      jobTitle: 'Junior Full Stack Engineer',
      company: 'TechCorp Innovations',
      jobDescription: `
We are looking for a motivated Junior Full Stack Engineer to join our core product team.
Responsibilities:
- Build responsive, reliable web applications using React, TypeScript, and modern CSS.
- Develop scalable backend microservices and RESTful APIs using Node.js and Express.
- Work closely with relational databases like PostgreSQL and ORMs.
- Collaborate with DevOps engineers on Docker containerization and Kubernetes deployments.
- Write thorough unit and integration tests using Jest.
Requirements:
- Strong proficiency in TypeScript, React, and Node.js.
- Hands-on experience with PostgreSQL and schema design.
- Familiarity with cloud providers (AWS or GCP) and CI/CD pipelines.
- Excellent communication skills and problem-solving mindset.
      `,
      matchScore: 84,
      summary:
        'Strong alignment with the core frontend and backend requirements. The candidate has proven expertise in TypeScript, React, Node.js, and PostgreSQL with hands-on internship experience. Cloud DevOps (AWS/Kubernetes) is the primary growth area.',
      matchingSkills: [
        'TypeScript',
        'React',
        'Node.js',
        'Express',
        'PostgreSQL',
        'Docker',
        'Jest',
        'REST API',
      ],
      missingSkills: [
        'Kubernetes',
        'AWS / Cloud Deployments',
        'Microservices Architecture',
      ],
      strengths: [
        'Solid production-ready full-stack portfolio with measurable performance optimizations (32% latency reduction).',
        'Hands-on experience with modern relational databases (PostgreSQL) and ORMs (Prisma).',
        'Proactive learning demonstrated through distributed systems projects (Redis queue).',
      ],
      improvements: [
        'Explicitly highlight any exposure to AWS services (S3, EC2, ECS) in the projects or internship section.',
        'Detail your experience with CI/CD pipeline automation and container orchestration.',
        'Add test coverage metrics to your academic and personal projects.',
      ],
      interviewQuestions: {
        technical: [
          {
            question:
              'How do you handle database connection pooling and query optimization in Node.js when connecting to PostgreSQL?',
            expectedAnswer:
              'Discuss Prisma client lifecycle management, using connection pools like PgBouncer, adding indexes to queried columns, and analyzing slow queries using EXPLAIN ANALYZE.',
            difficulty: 'Medium',
          },
          {
            question:
              'What strategies do you use in React to prevent unnecessary re-renders in complex dashboards?',
            expectedAnswer:
              'Mention React.memo, useCallback, useMemo, proper component splitting, and state lifting or atomic state management.',
            difficulty: 'Easy',
          },
        ],
        behavioral: [
          {
            question:
              'Describe a scenario where you received critical code review feedback. How did you adapt your solution?',
            tips:
              'Use the STAR framework. Emphasize receptiveness, understanding the underlying concern (e.g., maintainability or edge cases), and how the final code was stronger.',
          },
        ],
      },
      learningPriorities: [
        {
          skill: 'AWS Fundamentals & ECS',
          priority: 'High',
          actionPlan:
            'Set up a free tier AWS account, containerize a backend service, and deploy it to AWS ECS or App Runner with an automated GitHub Action.',
          estimatedWeeks: 2,
        },
        {
          skill: 'Kubernetes Core Concepts',
          priority: 'Medium',
          actionPlan:
            'Complete hands-on tutorials with Minikube, learning Pods, Deployments, Services, and ConfigMaps.',
          estimatedWeeks: 2,
        },
      ],
    },
  });

  console.log(`📊 Created sample analysis report: ${demoAnalysis.jobTitle} (Score: ${demoAnalysis.matchScore}%)`);
  console.log('✅ Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
