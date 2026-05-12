import { parsePlainText } from '../parsers/text.parser';

async function testParser() {
  try {
    console.log('🚀 Testing resume parsing pipeline...');

    // Test with provided text
    const text = `Work Experience
under 2 seconds, improving developer productivity by 70%. •
Designed a clean, responsive UI with dark/light theme toggling, • undefined - Present

Skills
Express.js
accelerating data exchange by
30%. Slashed data retrieval
OAuth 2.0
which decreased unauthorized access
attempts by 40%.
deliver
Nalanda Institute of Technology
Bhubaneswar
React.js Next.js Java Script
CSS
Optimization Git
Git Hub CI/CDRender
CodeLens AI – Real-Time AI Code Review Tool
Designed a clean
responsive UI with dark/light theme toggling

Education
B.Tech – Computer Science & Engineering2025
Nalanda Institute of Technology, Bhubaneswar
2025

Projects
Engineered an AI-powered crop monitoring platform for 500+
farmers, integrating real-time weather and soil APIs to boost decision-making insights by 35%. Architected a secure MetaMask crypto payment gateway for seamless blockchain transactions. Implemented a multilingual chatbot with automated KYC verification, slashing user onboarding time by 40%. HireSense – AI Interview Assistant Designed an AI-driven mock interview platform generating personalized questions based on resumes, used by 100+ job seekers. Automated resume parsing (PDF upload) and AI analytics dashboard to track performance and interview readiness. • Integrated Google OAuth login and secure JWT flow, boosting user retention and accessibility. github.com/Debanjali081 CodeLens AI – Real-Time AI Code Review Tool Built a real-time AI code review engine delivering feedback in`;

    console.log('📄 Parsing text...');

    // Use the text parser
    const parsed = parsePlainText(text);
    console.log('✅ Parsing successful!');
    console.log('📊 Parsed resume data:');
    console.log(JSON.stringify(parsed, null, 2));

  } catch (error: any) {
    console.error('❌ Test failed:', error.message);
    console.error('Stack:', error.stack);
  }
}

testParser();