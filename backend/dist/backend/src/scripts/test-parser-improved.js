"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const text_parser_1 = require("../parsers/text.parser");
async function testParserImproved() {
    try {
        console.log('🚀 Testing improved resume parsing...\n');
        // Realistic resume text based on the PDF that was parsed
        const resumeText = `BINAYA KUMAR DAS
Full Stack Developer
www.linkedin.com/in/binaya-kumar-das-bbb021206 | +91 8249611167 | binayakumar824@gmail.com |

SUMMARY:
Full-stack developer with 2+ years of experience building scalable web platforms and AI-powered document intelligence systems. Specialized in MERN + Python architectures, OCR/LLM integrations, real-time systems, and automated build pipelines. Proven experience delivering production-grade platforms handling large document and multi-tenant application workflows.

EXPERIENCE:
Software Developer | January, 2024 - Present
Quotus Software Solution pvt.ltd.
Built MERN + Python microservice architecture for large-scale document processing platform handling bulk PDF ingestion with parallel Celery tasks.
Engineered OCR (Tesseract) + LLM (Gemini AI) pipeline extracting structured data from invoices with 95% accuracy.
Integrated Google Vision API and Twilio for real-time SMS notifications on document processing completion.
Optimized MongoDB queries with indexing strategies, reducing API latency by 40%.
Implemented JWT-based authentication and role-based access control (RBAC) for multi-tenant security.

Trainee Software Developer | May, 2023 - December, 2023
TechXcel Solutions pvt.ltd.
Developed React.js components with TypeScript and Tailwind CSS for responsive e-commerce UI.
Built Node.js + Express.js REST APIs for user authentication using OAuth 2.0 and JWT.
Configured CI/CD pipelines using GitHub Actions for automated testing and deployment to AWS.
Collaborated with senior developers on code reviews and documented API endpoints with Swagger.

EDUCATION:
B.Tech – Computer Science & Engineering | 2025
Nalanda Institute of Technology, Bhubaneswar
CGPA: 8.2/10 | Relevant Coursework: Data Structures, Database Systems, Web Development

SKILLS:
Frontend: React, React.js, Next.js, TypeScript, JavaScript (ES6+), HTML, CSS, Tailwind CSS, Bootstrap, Material UI, Responsive Design
Backend: Node.js, Express.js, Python, Django, REST APIs, GraphQL, Microservices Architecture
Databases: MongoDB, PostgreSQL, MySQL, Redis, Firebase, Elasticsearch
DevOps & Tools: Docker, Kubernetes, AWS, CI/CD, Git, GitHub, Linux, Postman, Swagger
AI/ML & APIs: Gemini AI, Google Vision API, OCR, LLM Integration, Twilio, MetaMask, Web3
Testing & Monitoring: Jest, Mocha, Unit Testing, Sentry, PostHog Analytics

PROJECTS:
ResumeYatra – Intelligent Resume Processing Platform | Nov 2024 - Present
AI-powered document intelligence system for resume parsing, extraction, and multi-format export (PDF, DOCX).
Architected end-to-end document processing: PDF upload → OCR → LLM Models → labeled field JSON extraction.
Implemented microservice architecture with React frontend, Node.js backend, Python OCR service, and MongoDB database.
Integrated Gemini AI for intelligent field extraction, reducing manual data entry by 85%.

HireSense – AI Mock Interview Platform | Aug 2024 - Oct 2024
Built an AI-driven mock interview platform generating personalized questions based on uploaded resumes.
Implemented resume parsing logic and created analytics dashboard tracking user performance and progress.
Integrated Google OAuth for secure login and JWT authentication for session management.
Optimized database queries achieving 300ms average response time for interview generation.

LANGUAGES:
English – Professional Working Proficiency
Hindi – Native Proficiency

CERTIFICATIONS:
Certified Full Stack Developer – Udemy
React Mastery Course – Coursera
Advanced Node.js – Frontend Masters`;
        console.log('📄 Input resume text length:', resumeText.length, 'characters');
        console.log('---');
        // Use the text parser
        const parsed = (0, text_parser_1.parsePlainText)(resumeText);
        console.log('\n✅ Parsing completed!\n');
        console.log('📊 PARSING RESULTS:');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        // Personal Info
        console.log('\n👤 PERSONAL INFO:');
        console.log('  Name:', parsed.personal.name);
        console.log('  Email:', parsed.personal.email);
        console.log('  Phone:', parsed.personal.phone);
        console.log('  Role:', parsed.personal.role);
        // Summary
        console.log('\n📝 SUMMARY:');
        console.log(' ', parsed.summary?.substring(0, 100) + '...');
        // Skills
        console.log('\n💻 SKILLS:', `(${parsed.skills.length} total)`);
        console.log('  ', parsed.skills.slice(0, 10).join(', ') + (parsed.skills.length > 10 ? `... +${parsed.skills.length - 10} more` : ''));
        // Experience
        console.log('\n💼 EXPERIENCE:', `(${parsed.experience.length} entries)`);
        parsed.experience.forEach((exp, i) => {
            console.log(`  ${i + 1}. ${exp.title} at ${exp.company}`);
            if (exp.startDate)
                console.log(`     Duration: ${exp.startDate} - ${exp.endDate || 'Present'}`);
        });
        // Education
        console.log('\n🎓 EDUCATION:', `(${parsed.education.length} entries)`);
        parsed.education.forEach((edu, i) => {
            console.log(`  ${i + 1}. ${edu.degree} in ${edu.field}`);
            if (edu.school)
                console.log(`     From: ${edu.school}`);
        });
        // Projects
        console.log('\n🚀 PROJECTS:', `(${parsed.projects.length} entries)`);
        parsed.projects.forEach((proj, i) => {
            console.log(`  ${i + 1}. ${proj.name}`);
        });
        // Languages
        console.log('\n🌍 LANGUAGES:', `(${parsed.languages.length} entries)`);
        parsed.languages.forEach((lang, i) => {
            console.log(`  ${i + 1}. ${lang.language}${lang.level ? ` (${lang.level})` : ''}`);
        });
        console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('\n✅ Test completed successfully!');
    }
    catch (error) {
        console.error('❌ Test failed:', error.message);
        console.error('Stack:', error.stack);
    }
}
testParserImproved();
