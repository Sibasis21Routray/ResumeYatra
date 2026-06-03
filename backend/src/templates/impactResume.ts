export function buildImpactResumeTemplate(data: any, theme?: any): string {
  const {
    personal = {},
    summary = "",
    careerObjective = "",
    experience = [],
    projects = [],
    education = [],
    internships = [],
    trainingPrograms = [],
    academicProjects = [],
    leadershipPositions = [],
    coCurricular = [],
    extracurricular = [],
    skills = "",
    coreCompetencies = "",
    languages = [],
    hobbies = [],
    certifications = [],
    scholarships = [],
    awards = [],
    speakingEngagements = [],
    memberships = [],
    workshops = [],
    clientProjects = [],
    portfolio = [],
    volunteering = [],
    militaryService = [],
    methodologies = [],
    industryExpertise = [],
    references = [],
    teachingExperience = [],
    mentorshipExperience = [],
    researchGrants = [],
    testScores = [],
    publications = [],
    patents = [],
    toolsTechnologies = [],
    professionalContext = {},
    availabilityWorkAuth = {},
    socialProfiles = []
  } = data;

  // ✅ Step 1: Theme system with defaults
  const defaultTheme = {
    primary: "#3b82f6",
    text: "#111827",
    heading: "#111827",
    textLight: "#4b5563",
    background: "#ffffff",
  };

  const currentTheme = { ...defaultTheme, ...(theme || {}) };
  
  // ✅ Dynamic font size and family from user settings
  const baseFontSize = data?.formatting?.bodyFontSize || data?.fontSize || 11;
  const userFontFamily = data?.formatting?.fontFamily || data?.fontFamily || "'Inter', sans-serif";

  // Helper functions
  const getNonEmptyItems = (arr: any[]): any[] => {
    if (!arr || !Array.isArray(arr)) return [];
    return arr.filter(item => {
      if (typeof item === "string") return item.trim().length > 0;
      if (typeof item === "object" && item !== null) {
        return Object.values(item).some(val => 
          typeof val === "string" && val.trim().length > 0
        );
      }
      return false;
    });
  };

  const hasObjectValues = (obj: any): boolean => {
    if (!obj || typeof obj !== "object") return false;
    return Object.values(obj).some(val => 
      val !== null && val !== undefined && val !== ""
    );
  };

  const formatDateRange = (startDate?: string, endDate?: string, isCurrent?: boolean): string => {
    const parts = [];
    if (startDate?.trim()) parts.push(startDate.trim());
    if (isCurrent) parts.push("Present");
    else if (endDate?.trim()) parts.push(endDate.trim());
    return parts.join(" – ");
  };

  const renderBullets = (description: string): string => {
    if (!description) return "";
    const lines = description.split("\n").filter(line => line.trim());
    if (lines.length === 0) return "";
    return `<ul class="bullets">${lines.map(l => `<li>${l.trim()}</li>`).join("")}</ul>`;
  };

  const skillArray = typeof skills === "string" 
  ? skills.split(",").map(s => s.trim()).filter(s => s) 
  : Array.isArray(skills) ? skills : [];

const coreCompArray = typeof coreCompetencies === "string" 
  ? coreCompetencies.split(",").map(s => s.trim()).filter(s => s) 
  : Array.isArray(coreCompetencies) ? coreCompetencies : [];


  const linkedIn = socialProfiles.find((p: any) => p.platform?.toLowerCase().includes("linkedin"))?.url || "";
  const github = socialProfiles.find((p: any) => p.platform?.toLowerCase().includes("github"))?.url || "";
  
  // Filter arrays
  const nonEmptyExperience = getNonEmptyItems(experience);
  const nonEmptyEducation = getNonEmptyItems(education);
  const nonEmptyProjects = getNonEmptyItems(projects);
  const nonEmptyInternships = getNonEmptyItems(internships);
  const nonEmptyTrainingPrograms = getNonEmptyItems(trainingPrograms);
  const nonEmptyAcademicProjects = getNonEmptyItems(academicProjects);
  const nonEmptyLeadershipPositions = getNonEmptyItems(leadershipPositions);
  const nonEmptyCoCurricular = getNonEmptyItems(coCurricular);
  const nonEmptyExtracurricular = getNonEmptyItems(extracurricular);
  const nonEmptyLanguages = getNonEmptyItems(languages);
  const nonEmptyCertifications = getNonEmptyItems(certifications);
  const nonEmptyScholarships = getNonEmptyItems(scholarships);
  const nonEmptyAwards = getNonEmptyItems(awards);
  const nonEmptySpeakingEngagements = getNonEmptyItems(speakingEngagements);
  const nonEmptyMemberships = getNonEmptyItems(memberships);
  const nonEmptyWorkshops = getNonEmptyItems(workshops);
  const nonEmptyClientProjects = getNonEmptyItems(clientProjects);
  const nonEmptyPortfolio = getNonEmptyItems(portfolio);
  const nonEmptyVolunteering = getNonEmptyItems(volunteering);
  const nonEmptyMilitaryService = getNonEmptyItems(militaryService);
  const nonEmptyMethodologies = getNonEmptyItems(methodologies);
  const nonEmptyIndustryExpertise = getNonEmptyItems(industryExpertise);
  const nonEmptyReferences = getNonEmptyItems(references);
  const nonEmptyTeachingExperience = getNonEmptyItems(teachingExperience);
  const nonEmptyMentorshipExperience = getNonEmptyItems(mentorshipExperience);
  const nonEmptyResearchGrants = getNonEmptyItems(researchGrants);
  const nonEmptyTestScores = getNonEmptyItems(testScores);
  const nonEmptyPublications = getNonEmptyItems(publications);
  const nonEmptyPatents = getNonEmptyItems(patents);
  const nonEmptyToolsTechnologies = getNonEmptyItems(toolsTechnologies);
  const nonEmptyHobbies = getNonEmptyItems(hobbies);
  const nonEmptySocialProfiles = getNonEmptyItems(socialProfiles);
  
  const summaryText = summary || careerObjective;

  // Language proficiency pills (5-level scale)
  const getProficiencyPills = (level?: string) => {
    const levels: Record<string, number> = {
      'Beginner': 1, 'Elementary': 2, 'Intermediate': 3, 'Conversational': 3,
      'Advanced': 4, 'Fluent': 4, 'Professional': 4, 'Native': 5, 'Expert': 5, 'Bilingual': 5
    };
    const filledCount = level ? (levels[level] || 3) : 3;
    return `
      <div class="pill-container">
        ${[1,2,3,4,5].map(i => `<div class="pill ${i <= filledCount ? 'filled' : ''}"></div>`).join('')}
      </div>
    `;
  };

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          font-family: ${userFontFamily};
          color: ${currentTheme.text};
          line-height: 1.4;
          padding: 40px 50px;
          background: #ffffff;
          font-size: ${baseFontSize}px;
        }

        header { text-align: center; margin-bottom: 10px; }
        .name {
          font-size: ${Math.round(baseFontSize * 2.9)}px;
          font-weight: 800;
          text-transform: uppercase;
          margin-bottom: 12px;
          letter-spacing: -0.5px;
          color: ${currentTheme.heading};
        }
        .contact-bar {
          display: flex;
          justify-content: center;
          gap: 25px;
          color: ${currentTheme.textLight};
          font-weight: 500;
          flex-wrap: wrap;
        }
        .contact-bar a { color: inherit; text-decoration: none; }

        .divider {
          height: 4px;
          background: ${currentTheme.primary};
          width: 100%;
          margin: 18px 0 28px 0;
        }

        .container {
          display: grid;
          grid-template-columns: 1.8fr 1fr;
          gap: 45px;
        }

        .section-title {
          font-size: ${Math.round(baseFontSize * 1.27)}px;
          font-weight: 800;
          text-transform: uppercase;
          border-bottom: 2px solid ${currentTheme.text};
          padding-bottom: 4px;
          margin-bottom: 15px;
          color: ${currentTheme.heading};
        }

        .section { margin-bottom: 30px; position: relative; }
        .text-muted { color: ${currentTheme.textLight}; text-align: justify; line-height: 1.6; }

        .exp-item { margin-bottom: 20px; position: relative; }
        .job-title { font-weight: 800; font-size: ${Math.round(baseFontSize * 1.1)}px; display: block; }
        .company { color: ${currentTheme.primary}; font-weight: 700; display: block; }
        .date { color: #9ca3af; font-size: ${Math.round(baseFontSize * 0.9)}px; font-weight: 600; margin-bottom: 8px; display: block; }

        .bullets { list-style: none; }
        .bullets li {
          position: relative;
          padding-left: 15px;
          margin-bottom: 5px;
          color: #374151;
        }
        .bullets li::before {
          content: "•";
          position: absolute;
          left: 0;
          color: ${currentTheme.primary};
          font-weight: bold;
        }

        .skill-text { line-height: 1.8; color: #374151; font-weight: 500; }
        .edu-item { margin-bottom: 15px; }
        .edu-course { font-weight: 800; display: block; }
        .edu-school { color: ${currentTheme.primary}; font-weight: 600; display: block; }
        .edu-meta { color: #9ca3af; font-size: ${Math.round(baseFontSize * 0.9)}px; }

        .lang-row { display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px; }
        .pill-container { display: flex; gap: 3px; }
        .pill { width: 12px; height: 12px; border-radius: 2px; background: #e5e7eb; }
        .pill.filled { background: ${currentTheme.primary}; }

        .simple-list { list-style: none; }
        .simple-list li {
          position: relative;
          padding-left: 15px;
          margin-bottom: 5px;
          color: #374151;
        }
        .simple-list li::before {
          content: "•";
          position: absolute;
          left: 0;
          color: ${currentTheme.primary};
        }

        .cert-item { margin-bottom: 12px; }
        .cert-name { font-weight: 700; display: block; }
        .cert-issuer { color: ${currentTheme.textLight}; font-size: ${Math.round(baseFontSize * 0.9)}px; }

        @media print {
          body { padding: 0; }
          .divider, .pill.filled { -webkit-print-color-adjust: exact; background-color: ${currentTheme.primary} !important; }
        }
      </style>
    </head>
    <body>
      <header data-section="personal">
        <h1 class="name">${personal.name || 'YOUR NAME'}</h1>
        <div class="contact-bar">
          ${personal.phone ? `<span>${personal.phone}</span>` : ''}
          ${personal.alternatePhone ? `<span>${personal.alternatePhone}</span>` : ''}
          ${personal.email ? `<span>${personal.email}</span>` : ''}
          ${personal.location ? `<span>${personal.location}</span>` : ''}
        </div>
        <div class="contact-bar" style="margin-top: 5px; font-size: ${Math.round(baseFontSize * 0.9)}px;">
          ${linkedIn ? `<a href="${linkedIn}">LinkedIn</a>` : ''}
          ${github ? `<a href="${github}">GitHub</a>` : ''}
          ${personal.dob ? `<span>DOB: ${personal.dob}</span>` : ''}
        </div>
      </header>

      <div class="divider"></div>

      <div class="container">
        <div class="main-col">
          <!-- Professional Summary -->
          ${summaryText ? `
          <div class="section" data-section="summary">
            <h2 class="section-title">Summary</h2>
            <p class="text-muted">${summaryText}</p>
          </div>
          ` : ''}

          <!-- Availability & Work Authorization -->
          ${hasObjectValues(availabilityWorkAuth) ? `
          <div class="section" data-section="availabilityWorkAuth">
            <h2 class="section-title">Work Authorization</h2>
            <p class="text-muted">
              ${availabilityWorkAuth.workAuthorizationStatus ? `<strong>Status:</strong> ${availabilityWorkAuth.workAuthorizationStatus}<br>` : ''}
              ${availabilityWorkAuth.availabilityNoticePeriod ? `<strong>Notice Period:</strong> ${availabilityWorkAuth.availabilityNoticePeriod}` : ''}
            </p>
          </div>
          ` : ''}

          <!-- Experience -->
          ${nonEmptyExperience.length > 0 ? `
          <div class="section" data-section="experience">
            <h2 class="section-title">Experience</h2>
            ${nonEmptyExperience.map((exp: any, idx: number) => `
              <div class="exp-item" data-index="${idx}">
                <span class="job-title">${exp.title || ''}</span>
                <span class="company">${exp.company || ''}${exp.location ? ` | ${exp.location}` : ''}</span>
                <span class="date">${formatDateRange(exp.startDate, exp.endDate, exp.isCurrent)}</span>
                ${exp.description ? renderBullets(exp.description) : ''}
                ${exp.achievements ? `<p class="text-muted" style="margin-top:4px;"><strong>Achievements:</strong> ${exp.achievements}</p>` : ''}
              </div>
            `).join('')}
          </div>
          ` : ''}

          <!-- Projects -->
          ${nonEmptyProjects.length > 0 ? `
          <div class="section" data-section="projects">
            <h2 class="section-title">Projects</h2>
            ${nonEmptyProjects.map((project: any, idx: number) => `
              <div class="exp-item" data-index="${idx}">
                <span class="job-title">${project.name || project.title || ''}</span>
                <span class="company">${project.role ? `Role: ${project.role}` : ''}${project.duration ? ` | ${project.duration}` : ''}</span>
                ${project.description ? renderBullets(project.description) : ''}
                ${project.technologies ? `<p class="text-muted"><strong>Technologies:</strong> ${project.technologies}</p>` : ''}
              </div>
            `).join('')}
          </div>
          ` : ''}

          <!-- Internships -->
          ${nonEmptyInternships.length > 0 ? `
          <div class="section" data-section="internships">
            <h2 class="section-title">Internships</h2>
            ${nonEmptyInternships.map((item: any, idx: number) => `
              <div class="exp-item" data-index="${idx}">
                <span class="job-title">${item.title || ''}</span>
                <span class="company">${item.company || ''}</span>
                <span class="date">${formatDateRange(item.startDate, item.endDate)}</span>
                ${item.description ? renderBullets(item.description) : ''}
              </div>
            `).join('')}
          </div>
          ` : ''}

          <!-- Academic Projects -->
          ${nonEmptyAcademicProjects.length > 0 ? `
          <div class="section" data-section="academicProjects">
            <h2 class="section-title">Academic Projects</h2>
            ${nonEmptyAcademicProjects.map((item: any, idx: number) => `
              <div class="exp-item" data-index="${idx}">
                <span class="job-title">${item.name || item.title || ''}</span>
                <span class="company">${item.institution || ''}${item.duration ? ` | ${item.duration}` : ''}</span>
                ${item.description ? renderBullets(item.description) : ''}
              </div>
            `).join('')}
          </div>
          ` : ''}

          <!-- Leadership Positions -->
          ${nonEmptyLeadershipPositions.length > 0 ? `
          <div class="section" data-section="leadershipPositions">
            <h2 class="section-title">Leadership</h2>
            ${nonEmptyLeadershipPositions.map((item: any, idx: number) => `
              <div class="exp-item" data-index="${idx}">
                <span class="job-title">${item.position || item.title || ''}</span>
                <span class="company">${item.organization || ''}</span>
                <span class="date">${formatDateRange(item.startDate, item.endDate)}</span>
                ${item.description ? renderBullets(item.description) : ''}
              </div>
            `).join('')}
          </div>
          ` : ''}

          <!-- Training Programs -->
          ${nonEmptyTrainingPrograms.length > 0 ? `
          <div class="section" data-section="trainingPrograms">
            <h2 class="section-title">Training Programs</h2>
            <ul class="simple-list">
              ${nonEmptyTrainingPrograms.map((item: any, idx: number) => `<li data-index="${idx}"><strong>${item.name || ''}</strong>${item.provider ? ` - ${item.provider}` : ''}${item.completionDate ? ` (${item.completionDate})` : ''}</li>`).join('')}
            </ul>
          </div>
          ` : ''}

          <!-- Teaching Experience -->
          ${nonEmptyTeachingExperience.length > 0 ? `
          <div class="section" data-section="teachingExperience">
            <h2 class="section-title">Teaching Experience</h2>
            ${nonEmptyTeachingExperience.map((item: any, idx: number) => `
              <div class="exp-item" data-index="${idx}">
                <span class="job-title">${item.subjectCourseTaught || item.title || ''}</span>
                <span class="company">${item.institution || ''}</span>
                <span class="date">${formatDateRange(item.startDate, item.endDate)}</span>
                ${item.description ? renderBullets(item.description) : ''}
              </div>
            `).join('')}
          </div>
          ` : ''}

          <!-- Mentorship Experience -->
          ${nonEmptyMentorshipExperience.length > 0 ? `
          <div class="section" data-section="mentorshipExperience">
            <h2 class="section-title">Mentorship Experience</h2>
            <ul class="simple-list">
              ${nonEmptyMentorshipExperience.map((item: any, idx: number) => `<li data-index="${idx}"><strong>${item.mentorshipArea || ''}</strong>${item.organizationPlatform ? ` @ ${item.organizationPlatform}` : ''}</li>`).join('')}
            </ul>
          </div>
          ` : ''}

          <!-- Speaking Engagements -->
          ${nonEmptySpeakingEngagements.length > 0 ? `
          <div class="section" data-section="speakingEngagements">
            <h2 class="section-title">Speaking Engagements</h2>
            <ul class="simple-list">
              ${nonEmptySpeakingEngagements.map((item: any, idx: number) => `<li data-index="${idx}"><strong>${item.topic || item.title || ''}</strong>${item.eventName ? ` at ${item.eventName}` : ''}${item.date ? ` (${item.date})` : ''}</li>`).join('')}
            </ul>
          </div>
          ` : ''}

          <!-- Workshops -->
          ${nonEmptyWorkshops.length > 0 ? `
          <div class="section" data-section="workshops">
            <h2 class="section-title">Workshops</h2>
            <ul class="simple-list">
              ${nonEmptyWorkshops.map((item: any, idx: number) => `<li data-index="${idx}"><strong>${item.programTitle || item.title || ''}</strong>${item.conductedBy ? ` by ${item.conductedBy}` : ''}</li>`).join('')}
            </ul>
          </div>
          ` : ''}

          <!-- Client Projects -->
          ${nonEmptyClientProjects.length > 0 ? `
          <div class="section" data-section="clientProjects">
            <h2 class="section-title">Client Projects</h2>
            ${nonEmptyClientProjects.map((item: any, idx: number) => `
              <div class="exp-item" data-index="${idx}">
                <span class="job-title">${item.name || ''}</span>
                <span class="company">${item.clientOrganization || ''}${item.role ? ` - ${item.role}` : ''}</span>
                ${item.description ? renderBullets(item.description) : ''}
              </div>
            `).join('')}
          </div>
          ` : ''}

          <!-- Volunteering -->
          ${nonEmptyVolunteering.length > 0 ? `
          <div class="section" data-section="volunteering">
            <h2 class="section-title">Volunteering</h2>
            <ul class="simple-list">
              ${nonEmptyVolunteering.map((item: any, idx: number) => `<li data-index="${idx}"><strong>${item.role || ''}</strong>${item.organization ? ` at ${item.organization}` : ''}</li>`).join('')}
            </ul>
          </div>
          ` : ''}

          <!-- Military Service -->
          ${nonEmptyMilitaryService.length > 0 ? `
          <div class="section" data-section="militaryService">
            <h2 class="section-title">Military Service</h2>
            <ul class="simple-list">
              ${nonEmptyMilitaryService.map((item: any, idx: number) => `<li data-index="${idx}"><strong>${item.branch || ''}</strong>${item.rank ? ` - ${item.rank}` : ''}</li>`).join('')}
            </ul>
          </div>
          ` : ''}

          <!-- Research Grants -->
          ${nonEmptyResearchGrants.length > 0 ? `
          <div class="section" data-section="researchGrants">
            <h2 class="section-title">Research Grants</h2>
            <ul class="simple-list">
              ${nonEmptyResearchGrants.map((item: any, idx: number) => `<li data-index="${idx}"><strong>${item.title || ''}</strong> - ${item.agency || ''}${item.amount ? ` (${item.amount})` : ''}</li>`).join('')}
            </ul>
          </div>
          ` : ''}

          <!-- Publications -->
          ${nonEmptyPublications.length > 0 ? `
          <div class="section" data-section="publications">
            <h2 class="section-title">Publications</h2>
            <ul class="simple-list">
              ${nonEmptyPublications.map((item: any, idx: number) => `<li data-index="${idx}"><strong>${item.title || ''}</strong>${item.journalPublisher ? ` - ${item.journalPublisher}` : ''}${item.year ? ` (${item.year})` : ''}</li>`).join('')}
            </ul>
          </div>
          ` : ''}

          <!-- Patents -->
          ${nonEmptyPatents.length > 0 ? `
          <div class="section" data-section="patents">
            <h2 class="section-title">Patents</h2>
            <ul class="simple-list">
              ${nonEmptyPatents.map((item: any, idx: number) => `<li data-index="${idx}"><strong>${item.title || ''}</strong>${item.patentNumber ? ` - #${item.patentNumber}` : ''}</li>`).join('')}
            </ul>
          </div>
          ` : ''}

          <!-- Portfolio -->
          ${nonEmptyPortfolio.length > 0 ? `
          <div class="section" data-section="portfolio">
            <h2 class="section-title">Portfolio</h2>
            <ul class="simple-list">
              ${nonEmptyPortfolio.map((item: any, idx: number) => `<li data-index="${idx}"><a href="${item.url}" style="color: ${currentTheme.primary};">${item.name || item.title || 'Portfolio'}</a></li>`).join('')}
            </ul>
          </div>
          ` : ''}
        </div>

        <div class="side-col">
          <!-- Skills -->
          ${skillArray.length > 0 ? `
          <div class="section" data-section="skills">
            <h2 class="section-title">Skills</h2>
            <p class="skill-text">${skillArray.join(', ')}</p>
          </div>
          ` : ''}

          <!-- Core Competencies -->
${coreCompArray.length > 0 ? `
<div class="section" data-section="coreCompetencies">
  <h2 class="section-title">Core Competencies</h2>
  <p class="skill-text">${coreCompArray.join(', ')}</p>
</div>
` : ''}

          <!-- Tools & Technologies -->
          ${nonEmptyToolsTechnologies.length > 0 ? `
          <div class="section" data-section="toolsTechnologies">
            <h2 class="section-title">Tools & Technologies</h2>
            <p class="skill-text">${nonEmptyToolsTechnologies.map((t: any) => t.name || t).join(', ')}</p>
          </div>
          ` : ''}

          <!-- Methodologies -->
          ${nonEmptyMethodologies.length > 0 ? `
          <div class="section" data-section="methodologies">
            <h2 class="section-title">Methodologies</h2>
            <p class="skill-text">${nonEmptyMethodologies.map((m: any) => m.name).join(', ')}</p>
          </div>
          ` : ''}

          <!-- Industry Expertise -->
          ${nonEmptyIndustryExpertise.length > 0 ? `
          <div class="section" data-section="industryExpertise">
            <h2 class="section-title">Industry Expertise</h2>
            <p class="skill-text">${nonEmptyIndustryExpertise.map((i: any) => i.industry).join(', ')}</p>
          </div>
          ` : ''}

          <!-- Certifications -->
          ${nonEmptyCertifications.length > 0 ? `
          <div class="section" data-section="certifications">
            <h2 class="section-title">Certifications</h2>
            ${nonEmptyCertifications.map((cert: any, idx: number) => `
              <div class="cert-item" data-index="${idx}">
                <span class="cert-name">${cert.name || ''}</span>
                ${cert.issuer ? `<span class="cert-issuer">${cert.issuer}</span>` : ''}
                ${cert.date ? `<span class="cert-issuer">${cert.date}</span>` : ''}
              </div>
            `).join('')}
          </div>
          ` : ''}

          <!-- Education -->
          ${nonEmptyEducation.length > 0 ? `
          <div class="section" data-section="education">
            <h2 class="section-title">Education</h2>
            ${nonEmptyEducation.map((edu: any, idx: number) => {
              const degreeName = edu.degree || edu.course || '';
              const fieldName = edu.field ? `, ${edu.field}` : '';
              const institution = edu.school || edu.university || '';
              const yearValue = formatDateRange(edu.startDate, edu.graduationDate || edu.endDate || edu.year, edu.isCurrent);
              const gradeValue = edu.grade || edu.percentage || '';
              
              return `
              <div class="edu-item" data-index="${idx}">
                <span class="edu-course">${degreeName}${fieldName}</span>
                <span class="edu-school">${institution}${edu.location ? ` | ${edu.location}` : ''}</span>
                <span class="edu-meta">${yearValue} ${gradeValue ? `| ${gradeValue}` : ''}</span>
                ${edu.description ? `<div style="margin-top:4px;">${renderBullets(edu.description)}</div>` : ''}
              </div>`;
            }).join('')}
          </div>
          ` : ''}

          <!-- Languages -->
          ${nonEmptyLanguages.length > 0 ? `
          <div class="section" data-section="languages">
            <h2 class="section-title">Languages</h2>
            ${nonEmptyLanguages.map((lang: any, idx: number) => `
              <div class="lang-row" data-index="${idx}">
                <span style="font-weight:600;">${lang.language || lang}</span>
                ${getProficiencyPills(lang.proficiency)}
              </div>
            `).join('')}
          </div>
          ` : ''}

          <!-- Awards -->
          ${nonEmptyAwards.length > 0 ? `
          <div class="section" data-section="awards">
            <h2 class="section-title">Awards</h2>
            ${nonEmptyAwards.map((item: any, idx: number) => `
              <div class="cert-item" data-index="${idx}">
                <span class="cert-name">${item.title || ''}</span>
                <span class="cert-issuer">${item.organization || ''}${item.year ? ` (${item.year})` : ''}</span>
              </div>
            `).join('')}
          </div>
          ` : ''}

          <!-- Scholarships -->
          ${nonEmptyScholarships.length > 0 ? `
          <div class="section" data-section="scholarships">
            <h2 class="section-title">Scholarships</h2>
            ${nonEmptyScholarships.map((item: any, idx: number) => `
              <div class="cert-item" data-index="${idx}">
                <span class="cert-name">${item.name || ''}</span>
                <span class="cert-issuer">${item.provider || ''}${item.year ? ` (${item.year})` : ''}</span>
              </div>
            `).join('')}
          </div>
          ` : ''}

          <!-- Test Scores -->
          ${nonEmptyTestScores.length > 0 ? `
          <div class="section" data-section="testScores">
            <h2 class="section-title">Test Scores</h2>
            ${nonEmptyTestScores.map((item: any, idx: number) => `
              <div class="cert-item" data-index="${idx}">
                <span class="cert-name">${item.testName || ''}</span>
                <span class="cert-issuer">Score: ${item.score || ''}${item.year ? ` (${item.year})` : ''}</span>
              </div>
            `).join('')}
          </div>
          ` : ''}

          <!-- Activities -->
          ${(nonEmptyCoCurricular.length > 0 || nonEmptyExtracurricular.length > 0) ? `
          <div class="section" data-section="activities">
            <h2 class="section-title">Activities</h2>
            <ul class="simple-list">
              ${[...nonEmptyCoCurricular, ...nonEmptyExtracurricular].map((item: any, idx: number) => `<li data-index="${idx}"><strong>${item.activity || ''}</strong>${item.role ? ` — ${item.role}` : ''}</li>`).join('')}
            </ul>
          </div>
          ` : ''}

          <!-- Hobbies -->
          ${nonEmptyHobbies.length > 0 ? `
          <div class="section" data-section="hobbies">
            <h2 class="section-title">Hobbies</h2>
            <p class="skill-text">${nonEmptyHobbies.map((h: any) => typeof h === 'string' ? h : h.name).join(', ')}</p>
          </div>
          ` : ''}

          <!-- Memberships -->
          ${nonEmptyMemberships.length > 0 ? `
          <div class="section" data-section="memberships">
            <h2 class="section-title">Memberships</h2>
            <ul class="simple-list">
              ${nonEmptyMemberships.map((item: any, idx: number) => `<li data-index="${idx}"><strong>${item.organizationName || item.organization || ''}</strong>${item.role ? ` — ${item.role}` : ''}</li>`).join('')}
            </ul>
          </div>
          ` : ''}

          <!-- References -->
          ${nonEmptyReferences.length > 0 ? `
          <div class="section" data-section="references">
            <h2 class="section-title">References</h2>
            ${nonEmptyReferences.map((item: any, idx: number) => `
              <div class="cert-item" data-index="${idx}">
                <span class="cert-name">${item.name || ''}</span>
                <span class="cert-issuer">${item.designationRelationship || ''}${item.organization ? ` at ${item.organization}` : ''}</span>
              </div>
            `).join('')}
          </div>
          ` : ''}

          <!-- Social Profiles -->
          ${nonEmptySocialProfiles.length > 0 ? `
          <div class="section" data-section="socialProfiles">
            <h2 class="section-title">Social Profiles</h2>
            <ul class="simple-list">
              ${nonEmptySocialProfiles.map((item: any, idx: number) => `<li data-index="${idx}"><a href="${item.url}" style="color: ${currentTheme.primary};">${item.platform || 'Profile'}</a></li>`).join('')}
            </ul>
          </div>
          ` : ''}
        </div>
      </div>
    </body>
    </html>
  `;
}