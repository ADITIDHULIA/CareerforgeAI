import fs from 'fs';
import path from 'path';
import mammoth from 'mammoth';
import pdfParse from 'pdf-parse';
import { logger } from '../utils/logger';

// Common technical skills list for initial keyword parsing
const COMMON_SKILLS = [
  'JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'C#', 'Go', 'Rust', 'PHP', 'Ruby', 'Swift', 'Kotlin',
  'React', 'Next.js', 'Vue.js', 'Angular', 'Svelte', 'Node.js', 'Express', 'NestJS', 'Django', 'FastAPI', 'Spring Boot',
  'PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'SQLite', 'Prisma', 'TypeORM', 'Mongoose',
  'Docker', 'Kubernetes', 'AWS', 'Azure', 'GCP', 'CI/CD', 'GitHub Actions', 'Terraform', 'Linux',
  'Git', 'REST API', 'GraphQL', 'Microservices', 'Tailwind CSS', 'Redux', 'Jest', 'Cypress', 'Vitest',
  'Machine Learning', 'Data Analysis', 'Pandas', 'NumPy', 'TensorFlow', 'PyTorch', 'Agile', 'Scrum'
];

export class TextExtractorService {
  /**
   * Extract readable text from PDF or DOCX file
   */
  public static async extractText(filePath: string, fileType: string): Promise<string> {
    try {
      const ext = path.extname(filePath).toLowerCase();
      let extractedText = '';

      if (ext === '.pdf' || fileType.includes('pdf')) {
        const fileBuffer = await fs.promises.readFile(filePath);
        const data = await pdfParse(fileBuffer);
        extractedText = data.text || '';
      } else if (ext === '.docx' || fileType.includes('word') || fileType.includes('document')) {
        const result = await mammoth.extractRawText({ path: filePath });
        extractedText = result.value || '';
      } else {
        throw new Error(`Unsupported document extension: ${ext}`);
      }

      // Clean up whitespace and non-printable characters
      const cleanedText = extractedText
        .replace(/\r\n/g, '\n')
        .replace(/\r/g, '\n')
        .replace(/\t/g, ' ')
        .replace(/\n\s*\n\s*\n/g, '\n\n')
        .trim();

      if (!cleanedText || cleanedText.length < 20) {
        throw new Error(
          'Document contains no readable text or is an image-based scan. Please upload a standard text-based PDF or DOCX file.'
        );
      }

      return cleanedText;
    } catch (error: any) {
      logger.error(`Failed to extract text from ${filePath}: ${error.message}`);
      throw error;
    }
  }

  /**
   * Extract recognized skills present in the parsed text
   */
  public static extractSkills(text: string): string[] {
    const textLower = text.toLowerCase();
    const foundSkills = new Set<string>();

    for (const skill of COMMON_SKILLS) {
      // Use word boundary check where appropriate
      const regex = new RegExp(`(^|[^a-zA-Z0-9+#.])${skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}([^a-zA-Z0-9+#.]|$)`, 'i');
      if (regex.test(textLower)) {
        foundSkills.add(skill);
      }
    }

    return Array.from(foundSkills);
  }
}
