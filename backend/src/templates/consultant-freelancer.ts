export function buildConsultantFreelancerTemplate(data: any, theme?: any): string {
  const defaultTheme = {
    primary: '#333333',
    secondary: '#666666',
    background: '#ffffff',
    headingFont: 'Georgia, serif',
    bodyFont: 'Georgia, serif',
    borderColor: '#cccccc'
  };
  const currentTheme = theme || defaultTheme;

  // Font sizes matching the screenshot
  const bodyFontSize = '10pt';
  const headingFontSize = '11pt';
  const nameFontSize = '16pt';
  const contactFontSize = '9pt';

  // Helper function to check if an array has non-empty items
  const hasNonEmptyItems = (arr: any[]): boolean => {
    if (!arr || !Array.isArray(arr)) return false;
    return arr.some(item => {
      if (typeof item === "string") return item.trim().length > 0;
      if (typeof item === "object" && item !== null) {
        return Object.values(item).some(val => 
          typeof val === "string" && val.trim().length > 0
        );
      }
      return false;
    });
  };

  // Helper to get non-empty array items
  const getNonEmptyArray = (arr: any): any[] => {
    if (!arr || !Array.isArray(arr)) return [];
    return arr.filter((item: any) => {
      if (typeof item === "string") return item.trim().length > 0;
      if (typeof item === "object" && item !== null) {
        return Object.values(item).some(
          (val: any) => typeof val === "string" && val.trim().length > 0
        );
      }
      return false;
    });
  };

  // Helper to check if an object has any non-empty values
  const hasObjectValues = (obj: any): boolean => {
    if (!obj || typeof obj !== "object") return false;
    return Object.values(obj).some(val => 
      val !== null && val !== undefined && val !== ""
    );
  };

  // Helper to safely join strings with separator, filtering empty values
  const safeJoin = (items: any[], separator: string = ", "): string => {
    if (!items || !Array.isArray(items)) return "";
    const filtered = items.filter(item => item && typeof item === "string" && item.trim().length > 0);
    return filtered.join(separator);
  };

  // Helper to format date range
  const formatDateRange = (startDate?: string, endDate?: string, isCurrent?: boolean): string => {
    const parts = [];
    if (startDate && startDate.trim()) parts.push(startDate.trim());
    if (endDate && endDate.trim()) parts.push(endDate.trim());
    else if (isCurrent && parts.length > 0) parts.push("Present");
    
    if (parts.length === 0) return "";
    if (parts.length === 1) return parts[0];
    return parts.join(" - ");
  };

  // Helper to format subtitle with multiple fields
  const formatSubtitle = (parts: (string | undefined | null)[]): string => {
    const filtered = parts.filter(part => part && typeof part === "string" && part.trim().length > 0);
    return filtered.join(" | ");
  };

  // Parse skills (handles HTML string or array)
  const parseSkills = (): any[] => {
    if (!data.skills) return [];
    if (Array.isArray(data.skills)) return data.skills.filter((s: any) => s && (typeof s === "string" ? s.trim() : s));
    if (typeof data.skills === 'string') {
      if (data.skills.includes('<ul>')) {
        const matches = data.skills.match(/<li>(.*?)<\/li>/g);
        if (matches) {
          return matches.map(m => m.replace(/<\/?li>/g, '').trim());
        }
      }
      return data.skills.split(',').map((s: string) => s.trim()).filter(Boolean);
    }
    return [];
  };

  const nonEmptySkills = parseSkills();
  const nonEmptyInternships = getNonEmptyArray(data.internships);
  const nonEmptyTrainingPrograms = getNonEmptyArray(data.trainingPrograms);
  const nonEmptyAcademicProjects = getNonEmptyArray(data.academicProjects);
  const nonEmptyClientProjects = getNonEmptyArray(data.clientProjects);
  const nonEmptyPortfolio = getNonEmptyArray(data.portfolio);
  const nonEmptyLeadershipPositions = getNonEmptyArray(data.leadershipPositions);
  const nonEmptyVolunteering = getNonEmptyArray(data.volunteering);
  const nonEmptyMilitaryService = getNonEmptyArray(data.militaryService);
  const nonEmptyTeachingExperience = getNonEmptyArray(data.teachingExperience);
  const nonEmptyMentorshipExperience = getNonEmptyArray(data.mentorshipExperience);
  const nonEmptyResearchGrants = getNonEmptyArray(data.researchGrants);
  const nonEmptyPublications = getNonEmptyArray(data.publications);
  const nonEmptyPatents = getNonEmptyArray(data.patents);
  const nonEmptyTestScores = getNonEmptyArray(data.testScores);
  const nonEmptyScholarships = getNonEmptyArray(data.scholarships);
  const nonEmptyAwards = getNonEmptyArray(data.awards);
  const nonEmptySpeakingEngagements = getNonEmptyArray(data.speakingEngagements);
  const nonEmptyMemberships = getNonEmptyArray(data.memberships);
  const nonEmptyWorkshops = getNonEmptyArray(data.workshops);
  const nonEmptyCoCurricular = getNonEmptyArray(data.coCurricular);
  const nonEmptyExtracurricular = getNonEmptyArray(data.extracurricular);
  const nonEmptyToolsTechnologies = getNonEmptyArray(data.toolsTechnologies);
  const nonEmptyMethodologies = getNonEmptyArray(data.methodologies);
  const nonEmptyIndustryExpertise = getNonEmptyArray(data.industryExpertise);
  const nonEmptyReferences = getNonEmptyArray(data.references);
  const nonEmptySocialProfiles = getNonEmptyArray(data.socialProfiles);
  const nonEmptySocialLinks = getNonEmptyArray(data.socialLinks);
  const nonEmptyLanguages = getNonEmptyArray(data.languages);
  const nonEmptyHobbies = getNonEmptyArray(data.hobbies);
  const nonEmptyKeyAchievements = getNonEmptyArray(data.keyAchievements);
  const nonEmptyResponsibilities = getNonEmptyArray(
    Array.isArray(data.responsibilities)
      ? data.responsibilities
      : (data.responsibilities || "").split("\n")
  );
  const nonEmptyTools = getNonEmptyArray(
    Array.isArray(data.tools) ? data.tools : (data.tools || "").split("\n")
  );
  const nonEmptyProjects = getNonEmptyArray(data.projects);
  const nonEmptyCertifications = getNonEmptyArray(data.certifications);
  const nonEmptyCustomSections = getNonEmptyArray(data.customSections);
  const nonEmptyProfessionalContext = data.professionalContext && hasObjectValues(data.professionalContext) ? data.professionalContext : null;
  const nonEmptyAvailabilityWorkAuth = data.availabilityWorkAuth && hasObjectValues(data.availabilityWorkAuth) ? data.availabilityWorkAuth : null;

  // For backward compatibility
  const hasContent = (arr: any): boolean => {
    if (!arr || !Array.isArray(arr)) return arr && (typeof arr === 'string' ? arr.trim().length > 0 : false);
    if (arr.length === 0) return false;
    return arr.some((item: any) => {
      if (typeof item === 'string') return item.trim().length > 0;
      if (typeof item === 'object' && item !== null) {
        return Object.values(item).some((val: any) =>
          typeof val === 'string' && val.trim().length > 0
        );
      }
      return false;
    });
  };

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Resume</title>
  <style>
    :root {
      --primary-color: ${currentTheme.primary};
      --secondary-color: ${currentTheme.secondary};
      --background-color: ${currentTheme.background};
      --heading-font: ${currentTheme.headingFont};
      --body-font: ${currentTheme.bodyFont};
    }

    body {
      font-family: var(--body-font);
      color: var(--primary-color);
      line-height: 1.5;
      margin: 0;
      padding: 0;
      background: #f5f5f5;
    }
    .container {
      max-width: 650px;
      margin: 40px auto;
      padding: 50px 60px;
      background: white;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      border-radius: 8px;
    }
    .header {
      text-align: center;
      margin-bottom: 20px;
      padding-bottom: 15px;
      border-bottom: 1px solid #e0e0e0;
    }
    .section {
      margin-bottom: 20px;
    }
    .section-title {
      font-size: ${headingFontSize};
      font-weight: bold;
      margin-bottom: 8px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      border-bottom: 1px solid #e0e0e0;
      padding-bottom: 3px;
      text-align: center;
    }
    .name {
      font-size: ${nameFontSize};
      font-weight: bold;
      margin-bottom: 8px;
      color: #000;
    }
    .contact {
      font-size: ${contactFontSize};
      color: var(--secondary-color);
      margin-bottom: 0;
      line-height: 1.4;
    }
    .contact a {
      color: var(--primary-color);
      text-decoration: none;
    }
    .contact a:hover {
      text-decoration: underline;
    }
    .job-header {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      margin-bottom: 5px;
    }
    .job-title {
      font-weight: bold;
      font-size: ${bodyFontSize};
    }
    .job-date {
      font-size: ${contactFontSize};
      color: var(--secondary-color);
      font-style: italic;
    }
    .company-name {
      font-size: ${contactFontSize};
      color: var(--secondary-color);
      margin-bottom: 5px;
    }
    p, ul, li {
      font-size: ${bodyFontSize};
      margin: 0;
      padding: 0;
    }
    p {
      margin-bottom: 8px;
    }
    ul {
      margin-left: 20px;
      margin-top: 5px;
    }
    li {
      margin-bottom: 4px;
      line-height: 1.6;
    }
    .section-content {
      margin-bottom: 12px;
    }

    /* Enhanced Education Styles */
    .education-entry {
      margin-bottom: 16px;
      padding: 12px;
      background: rgba(248, 250, 252, 0.8);
      border: 1px solid #e2e8f0;
      border-left: 3px solid #333;
      border-radius: 4px;
    }

    .education-degree {
      font-weight: bold;
      color: #000;
      margin-bottom: 4px;
      font-size: 11pt;
    }

    .education-field {
      font-weight: 600;
      color: #666;
      margin-bottom: 3px;
      font-size: 10pt;
    }

    .education-school {
      font-weight: bold;
      color: #000;
      margin-bottom: 3px;
      font-size: 11pt;
    }

    .education-location {
      color: #666;
      font-style: italic;
      margin-bottom: 5px;
      font-size: 9pt;
    }

    .education-date {
      font-size: 9pt;
      color: #666;
      font-style: italic;
      margin-bottom: 6px;
    }

    .education-description {
      font-size: 10pt;
      color: #666;
      line-height: 1.5;
      margin-top: 8px;
      padding: 8px;
      background: rgba(255,255,255,0.9);
      border-radius: 3px;
      border: 1px solid #e2e8f0;
    }

    .education-description ul {
      margin: 4px 0 4px 15px;
      padding: 0;
      list-style-type: disc;
    }

    .education-description li {
      margin: 2px 0;
      color: #666;
    }

    .education-description b {
      font-weight: bold;
      color: #000;
    }

    .education-achievements {
      margin-top: 8px;
      padding-top: 8px;
      border-top: 1px solid #e2e8f0;
    }

    .education-achievements h4 {
      font-size: 9pt;
      font-weight: bold;
      color: #333;
      margin-bottom: 4px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .education-achievements ul {
      margin: 0;
      padding-left: 0;
      list-style: none;
    }

    .education-achievements li {
      position: relative;
      padding-left: 14px;
      margin-bottom: 2px;
      color: #666;
      font-size: 10pt;
    }

    .education-achievements li:before {
      content: "💼";
      position: absolute;
      left: 0;
      font-size: 8pt;
    }
  </style>
</head>
<body>
<div class="container">
  <div class="header" data-section="personal">
    <div class="name" data-section="personal" data-field="name">${data.personal?.name && data.personal?.name !== 'undefined' ? data.personal.name : 'Your Name'}${data.personal?.middleName ? ` ${data.personal.middleName}` : ''}</div>
    <div class="contact" data-section="personal">
      ${(() => {
        const contactParts = [];
        if (data.personal?.location || data.personal?.country || data.personal?.pinCode || data.personal?.fullAddress) {
          const addressParts = [
            data.personal?.fullAddress,
            data.personal?.location,
            data.personal?.country,
            data.personal?.pinCode
          ].filter(Boolean);
          contactParts.push(addressParts.join(', '));
        }
        if (data.personal?.phone) contactParts.push(data.personal.phone);
        if (data.personal?.alternatePhone) contactParts.push(data.personal.alternatePhone);
        if (data.personal?.email) contactParts.push(data.personal.email);
        if (data.personal?.fathersName) contactParts.push(`Father: ${data.personal.fathersName}`);
        if (data.personal?.dob) contactParts.push(`DOB: ${data.personal.dob}`);
        if (data.personal?.gender) contactParts.push(`Gender: ${data.personal.gender}`);
        if (data.personal?.maritalStatus) contactParts.push(`Marital: ${data.personal.maritalStatus}`);
        if (data.personal?.nationality) contactParts.push(`Nationality: ${data.personal.nationality}`);
        if (data.personal?.passportNo) contactParts.push(`Passport: ${data.personal.passportNo}`);
        if (data.personal?.linkedinUrl) contactParts.push(`<a href="${data.personal.linkedinUrl}" target="_blank">LinkedIn</a>`);
        if (data.personal?.githubUrl) contactParts.push(`<a href="${data.personal.githubUrl}" target="_blank">GitHub</a>`);
        if (data.personal?.portfolioUrl) contactParts.push(`<a href="${data.personal.portfolioUrl}" target="_blank">Portfolio</a>`);
        if (data.personal?.website) contactParts.push(`<a href="${data.personal.website}" target="_blank">Website</a>`);
        if (data.personal?.twitterUrl) contactParts.push(`<a href="${data.personal.twitterUrl}" target="_blank">Twitter</a>`);
        if (data.personal?.facebookUrl) contactParts.push(`<a href="${data.personal.facebookUrl}" target="_blank">Facebook</a>`);
        if (data.personal?.instagramUrl) contactParts.push(`<a href="${data.personal.instagramUrl}" target="_blank">Instagram</a>`);
        if (data.personal?.behanceUrl) contactParts.push(`<a href="${data.personal.behanceUrl}" target="_blank">Behance</a>`);
        if (data.personal?.dribbbleUrl) contactParts.push(`<a href="${data.personal.dribbbleUrl}" target="_blank">Dribbble</a>`);
        if (data.personal?.stackoverflowUrl) contactParts.push(`<a href="${data.personal.stackoverflowUrl}" target="_blank">Stack Overflow</a>`);
        if (data.personal?.mediumUrl) contactParts.push(`<a href="${data.personal.mediumUrl}" target="_blank">Medium</a>`);
        
        return contactParts.length > 0 ? ' | ' + contactParts.join(' | ') : '';
      })()}
    </div>
  </div>

  <!-- Professional Context -->
  ${nonEmptyProfessionalContext ? `
  <div class="section" data-section="professionalContext">
    <div class="section-title">Professional Context</div>
    <div style="font-size: ${bodyFontSize}; line-height: 1.6;">
      ${nonEmptyProfessionalContext.totalExperience ? `<div><strong>Total Experience:</strong> ${nonEmptyProfessionalContext.totalExperience}</div>` : ''}
      ${nonEmptyProfessionalContext.teamSize ? `<div><strong>Team Size:</strong> ${nonEmptyProfessionalContext.teamSize}</div>` : ''}
      ${nonEmptyProfessionalContext.industry ? `<div><strong>Industry:</strong> ${nonEmptyProfessionalContext.industry}</div>` : ''}
      ${nonEmptyProfessionalContext.functionalDomain ? `<div><strong>Domain:</strong> ${nonEmptyProfessionalContext.functionalDomain}</div>` : ''}
      ${nonEmptyProfessionalContext.geographicScope ? `<div><strong>Geographic Scope:</strong> ${nonEmptyProfessionalContext.geographicScope}</div>` : ''}
      ${nonEmptyProfessionalContext.revenueResponsibility ? `<div><strong>Revenue Responsibility:</strong> ${nonEmptyProfessionalContext.revenueResponsibility}</div>` : ''}
    </div>
  </div>` : ''}

  <!-- Availability & Work Auth -->
  ${nonEmptyAvailabilityWorkAuth ? `
  <div class="section" data-section="availabilityWorkAuth">
    <div class="section-title">Availability</div>
    <div style="font-size: ${bodyFontSize}; line-height: 1.6;">
      ${nonEmptyAvailabilityWorkAuth.availabilityNoticePeriod ? `<div><strong>Notice Period:</strong> ${nonEmptyAvailabilityWorkAuth.availabilityNoticePeriod}</div>` : ''}
      ${nonEmptyAvailabilityWorkAuth.workAuthorizationStatus ? `<div><strong>Work Auth:</strong> ${nonEmptyAvailabilityWorkAuth.workAuthorizationStatus}</div>` : ''}
      ${nonEmptyAvailabilityWorkAuth.preferredLocation ? `<div><strong>Preferred Location:</strong> ${nonEmptyAvailabilityWorkAuth.preferredLocation}</div>` : ''}
    </div>
  </div>` : ''}

  <!-- Summary -->
  ${data.summary && data.summary.trim() ? `
  <div class="section" data-section="summary">
    <div class="section-title">Summary</div>
    <p>${data.summary}</p>
  </div>` : ''}

  <!-- Career Objective -->
  ${data.careerObjective && data.careerObjective.trim() ? `
  <div class="section" data-section="careerObjective">
    <div class="section-title">Career Objective</div>
    <p>${data.careerObjective}</p>
  </div>` : ''}

  <!-- Work Experience -->
  ${hasNonEmptyItems(data.experience) ? `
  <div class="section" data-section="experience">
    <div class="section-title">Experience</div>
    ${getNonEmptyArray(data.experience).map((exp: any, index: number) => {
      const dateRange = formatDateRange(exp.startDate, exp.endDate, exp.isCurrent);
      const subtitle = formatSubtitle([exp.location, exp.domain]);
      
      return `
      <div class="section-content" data-section="experience" data-index="${index}">
        <div class="job-header">
          <div class="job-title" data-section="experience" data-index="${index}">${exp.title || ''}</div>
          <div class="job-date" data-section="experience" data-index="${index}">${dateRange}</div>
        </div>
        <div class="company-name" data-section="experience" data-index="${index}">${exp.company || ''}${subtitle ? ` | ${subtitle}` : ''}</div>
        ${exp.description ? `<ul>${exp.description.split('\n').filter((line: string) => line.trim()).map((line: string, lineIndex: number) => `<li data-section="experience" data-index="${index}-${lineIndex}">${line.trim()}</li>`).join('')}</ul>` : ''}
        ${exp.achievements ? `<p><strong>Achievements:</strong> ${exp.achievements}</p>` : ''}
      </div>
    `}).join('')}
  </div>` : ''}

  <!-- Internships -->
  ${nonEmptyInternships.length > 0 ? `
  <div class="section" data-section="internships">
    <div class="section-title">Internships</div>
    ${nonEmptyInternships.map((item: any, index: number) => {
      const dateRange = item.duration || formatDateRange(item.startDate, item.endDate);
      
      return `
      <div class="section-content" data-section="internships" data-index="${index}">
        <div class="job-header">
          <div class="job-title" data-section="internships" data-index="${index}">${item.title || ''}</div>
          <div class="job-date" data-section="internships" data-index="${index}">${dateRange}</div>
        </div>
        <div class="company-name" data-section="internships" data-index="${index}">${item.company || ''}${item.location ? ` | ${item.location}` : ''}</div>
        ${item.description ? `<ul>${item.description.split('\n').filter((line: string) => line.trim()).map((line: string, lineIndex: number) => `<li data-section="internships" data-index="${index}-${lineIndex}">${line.trim()}</li>`).join('')}</ul>` : ''}
      </div>
    `}).join('')}
  </div>` : ''}

  <!-- Training Programs -->
  ${nonEmptyTrainingPrograms.length > 0 ? `
  <div class="section" data-section="trainingPrograms">
    <div class="section-title">Training Programs</div>
    ${nonEmptyTrainingPrograms.map((item: any, index: number) => `
      <div class="section-content" data-section="trainingPrograms" data-index="${index}">
        <div class="job-header">
          <div class="job-title" data-section="trainingPrograms" data-index="${index}">${item.name || ''}</div>
          <div class="job-date" data-section="trainingPrograms" data-index="${index}">${item.completionDate || ''}</div>
        </div>
        <div class="company-name" data-section="trainingPrograms" data-index="${index}">${formatSubtitle([item.provider || item.organization, item.duration])}</div>
        <p>${item.description || ''}</p>
      </div>
    `).join('')}
  </div>` : ''}

  <!-- Skills -->
  ${nonEmptySkills.length > 0 ? `
  <div class="section" data-section="skills">
    <div class="section-title">Skills</div>
    <p>${nonEmptySkills.join(' • ')}</p>
  </div>` : ''}

  <!-- Tools & Technologies -->
  ${nonEmptyToolsTechnologies.length > 0 ? `
  <div class="section" data-section="toolsTechnologies">
    <div class="section-title">Tools & Technologies</div>
    <p>${nonEmptyToolsTechnologies.map(item => `${item.name || ''}${item.proficiency ? ` (${item.proficiency})` : ''}${item.experienceDuration ? ` - ${item.experienceDuration}` : ''}`).join(' • ')}</p>
  </div>` : ''}

  <!-- Methodologies -->
  ${nonEmptyMethodologies.length > 0 ? `
  <div class="section" data-section="methodologies">
    <div class="section-title">Methodologies</div>
    <p>${nonEmptyMethodologies.map(item => `${item.name || ''}${item.certification ? ` (${item.certification})` : ''}${item.experienceDuration ? ` - ${item.experienceDuration} years` : ''}`).join(' • ')}</p>
  </div>` : ''}

  <!-- Industry Expertise -->
  ${nonEmptyIndustryExpertise.length > 0 ? `
  <div class="section" data-section="industryExpertise">
    <div class="section-title">Industry Expertise</div>
    <p>${nonEmptyIndustryExpertise.map(item => `${item.industry || ''}${item.domainArea ? ` - ${item.domainArea}` : ''}${item.experienceDuration ? ` (${item.experienceDuration} years)` : ''}`).join(' • ')}</p>
  </div>` : ''}

  <!-- Education -->
  ${hasNonEmptyItems(data.education) ? `
  <div class="section" data-section="education">
    <div class="section-title">Education</div>
    ${getNonEmptyArray(data.education).map((edu: any, index: number) => `
      <div class="education-entry" data-section="education" data-index="${index}">
        <div class="education-degree" data-section="education" data-index="${index}">
          ${edu.degree || ''}${edu.field ? ` in ${edu.field}` : ''}${edu.qualification ? ` (${edu.qualification})` : ''}
        </div>
        
        ${edu.school ? `<div class="education-school" data-section="education" data-index="${index}">${edu.school}</div>` : ''}
        ${edu.location ? `<div class="education-location" data-section="education" data-index="${index}">${edu.location}</div>` : ''}
        <div class="education-date" data-section="education" data-index="${index}">${edu.graduationDate || ''}${edu.grade ? ` |  ${edu.grade}` : ''}</div>
        
        ${edu.description ? `
          <div class="education-description" data-section="education" data-index="${index}">
            ${edu.description}
          </div>
        ` : ''}
        
        ${edu.achievements && edu.achievements.length > 0 ? `
          <div class="education-achievements" data-section="education" data-index="${index}">
            <h4>Academic Excellence</h4>
            <ul>
              ${edu.achievements.filter((achievement: string) => achievement.trim()).map((achievement: string, achIndex: number) => 
                `<li data-section="education" data-index="${index}" data-item-index="${achIndex}">${achievement}</li>`
              ).join('')}
            </ul>
          </div>
        ` : ''}
      </div>
    `).join('')}
  </div>` : ''}

  <!-- Academic Projects -->
  ${nonEmptyAcademicProjects.length > 0 ? `
  <div class="section" data-section="academicProjects">
    <div class="section-title">Academic Projects</div>
    ${nonEmptyAcademicProjects.map((item: any, index: number) => `
      <div class="section-content" data-section="academicProjects" data-index="${index}">
        <div class="job-header">
          <div class="job-title" data-section="academicProjects" data-index="${index}">${item.name || item.title || ''}</div>
          <div class="job-date" data-section="academicProjects" data-index="${index}">${item.duration || ''}</div>
        </div>
        <div class="company-name" data-section="academicProjects" data-index="${index}">${formatSubtitle([item.institution, item.course ? `Course: ${item.course}` : ''])}</div>
        <p>${item.description || ''}</p>
        ${item.technologies && item.technologies.length > 0 ? `<p><strong>Technologies:</strong> ${Array.isArray(item.technologies) ? item.technologies.join(', ') : item.technologies}</p>` : ''}
        ${item.url ? `<p><a href="${item.url}" target="_blank">${item.url}</a></p>` : ''}
      </div>
    `).join('')}
  </div>` : ''}

  <!-- Client Projects -->
  ${nonEmptyClientProjects.length > 0 ? `
  <div class="section" data-section="clientProjects">
    <div class="section-title">Client Projects</div>
    ${nonEmptyClientProjects.map((item: any, index: number) => `
      <div class="section-content" data-section="clientProjects" data-index="${index}">
        <div class="job-header">
          <div class="job-title" data-section="clientProjects" data-index="${index}">${item.name || ''}</div>
          <div class="job-date" data-section="clientProjects" data-index="${index}">${item.duration || ''}</div>
        </div>
        <div class="company-name" data-section="clientProjects" data-index="${index}">${formatSubtitle([item.clientOrganization, item.role ? `Role: ${item.role}` : ''])}</div>
        <p>${item.description || ''}</p>
        ${item.toolsTechnologies ? `<p><strong>Tools:</strong> ${item.toolsTechnologies}</p>` : ''}
        ${item.projectUrl ? `<p><a href="${item.projectUrl}" target="_blank">View Project</a></p>` : ''}
      </div>
    `).join('')}
  </div>` : ''}

  <!-- Portfolio -->
  ${nonEmptyPortfolio.length > 0 ? `
  <div class="section" data-section="portfolio">
    <div class="section-title">Portfolio</div>
    ${nonEmptyPortfolio.map((item: any, index: number) => `
      <div class="section-content" data-section="portfolio" data-index="${index}">
        <div class="job-header">
          <div class="job-title" data-section="portfolio" data-index="${index}">${item.name || ''}</div>
          <div class="job-date" data-section="portfolio" data-index="${index}">${formatSubtitle([item.type, item.platform ? `on ${item.platform}` : ''])}</div>
        </div>
        <p>${item.description || ''}</p>
        ${item.url ? `<p><a href="${item.url}" target="_blank">View Portfolio</a></p>` : ''}
      </div>
    `).join('')}
  </div>` : ''}

  <!-- Projects -->
  ${nonEmptyProjects.length > 0 ? `
  <div class="section" data-section="projects">
    <div class="section-title">Project Experience</div>
    ${nonEmptyProjects.map((project: any, index: number) => {
      const dateRange = formatDateRange(project.startDate, project.endDate);
      
      return `
      <div class="section-content" data-section="projects" data-index="${index}">
        <div class="job-header">
          <div class="job-title" data-section="projects" data-index="${index}">${project.name || ''}${project.technologies ? ` | ${project.technologies}` : ''}</div>
          <div class="job-date" data-section="projects" data-index="${index}">${dateRange}</div>
        </div>
        <p>${project.description || ''}</p>
        ${project.url ? `<p><a href="${project.url}" target="_blank">${project.urlText || 'View Project'}</a></p>` : ''}
      </div>
    `}).join('')}
  </div>` : ''}

  <!-- Leadership Positions -->
  ${nonEmptyLeadershipPositions.length > 0 ? `
  <div class="section" data-section="leadershipPositions">
    <div class="section-title">Leadership & Positions</div>
    ${nonEmptyLeadershipPositions.map((item: any, index: number) => {
      const dateRange = formatDateRange(item.startDate, item.endDate);
      
      return `
      <div class="section-content" data-section="leadershipPositions" data-index="${index}">
        <div class="job-header">
          <div class="job-title" data-section="leadershipPositions" data-index="${index}">${item.position || item.title || ''}</div>
          <div class="job-date" data-section="leadershipPositions" data-index="${index}">${dateRange}</div>
        </div>
        <div class="company-name" data-section="leadershipPositions" data-index="${index}">${item.organization || ''}</div>
        <p>${item.description || ''}</p>
      </div>
    `}).join('')}
  </div>` : ''}

  <!-- Volunteering -->
  ${nonEmptyVolunteering.length > 0 ? `
  <div class="section" data-section="volunteering">
    <div class="section-title">Volunteering</div>
    ${nonEmptyVolunteering.map((item: any, index: number) => `
      <div class="section-content" data-section="volunteering" data-index="${index}">
        <div class="job-header">
          <div class="job-title" data-section="volunteering" data-index="${index}">${item.role || ''}</div>
          <div class="job-date" data-section="volunteering" data-index="${index}">${item.duration || ''}</div>
        </div>
        <div class="company-name" data-section="volunteering" data-index="${index}">${formatSubtitle([item.organization, item.causeArea])}</div>
        <p>${item.description || ''}</p>
      </div>
    `).join('')}
  </div>` : ''}

  <!-- Military Service -->
  ${nonEmptyMilitaryService.length > 0 ? `
  <div class="section" data-section="militaryService">
    <div class="section-title">Military Service</div>
    ${nonEmptyMilitaryService.map((item: any, index: number) => `
      <div class="section-content" data-section="militaryService" data-index="${index}">
        <div class="job-header">
          <div class="job-title" data-section="militaryService" data-index="${index}">${item.rank ? item.rank : ''}${item.rank && item.branch ? ' - ' : ''}${item.branch || ''}</div>
          <div class="job-date" data-section="militaryService" data-index="${index}">${item.duration || ''}</div>
        </div>
        <div class="company-name" data-section="militaryService" data-index="${index}">${item.specialization || ''}</div>
        <p>${item.description || ''}</p>
      </div>
    `).join('')}
  </div>` : ''}

  <!-- Teaching Experience -->
  ${nonEmptyTeachingExperience.length > 0 ? `
  <div class="section" data-section="teachingExperience">
    <div class="section-title">Teaching Experience</div>
    ${nonEmptyTeachingExperience.map((item: any, index: number) => `
      <div class="section-content" data-section="teachingExperience" data-index="${index}">
        <div class="job-header">
          <div class="job-title" data-section="teachingExperience" data-index="${index}">${item.subjectCourseTaught || item.title || ''}</div>
          <div class="job-date" data-section="teachingExperience" data-index="${index}">${item.duration || ''}</div>
        </div>
        <div class="company-name" data-section="teachingExperience" data-index="${index}">${item.institution || ''}</div>
        <p>${item.description || ''}</p>
      </div>
    `).join('')}
  </div>` : ''}

  <!-- Mentorship Experience -->
  ${nonEmptyMentorshipExperience.length > 0 ? `
  <div class="section" data-section="mentorshipExperience">
    <div class="section-title">Mentorship Experience</div>
    ${nonEmptyMentorshipExperience.map((item: any, index: number) => `
      <div class="section-content" data-section="mentorshipExperience" data-index="${index}">
        <div class="job-header">
          <div class="job-title" data-section="mentorshipExperience" data-index="${index}">${item.mentorshipArea || ''}</div>
          <div class="job-date" data-section="mentorshipExperience" data-index="${index}">${item.duration || ''}</div>
        </div>
        <div class="company-name" data-section="mentorshipExperience" data-index="${index}">${formatSubtitle([item.organizationPlatform, item.menteeLevel ? `Mentee Level: ${item.menteeLevel}` : ''])}</div>
        <p>${item.description || ''}</p>
      </div>
    `).join('')}
  </div>` : ''}

  <!-- Research Grants -->
  ${nonEmptyResearchGrants.length > 0 ? `
  <div class="section" data-section="researchGrants">
    <div class="section-title">Research Grants</div>
    ${nonEmptyResearchGrants.map((item: any, index: number) => `
      <div class="section-content" data-section="researchGrants" data-index="${index}">
        <div class="job-header">
          <div class="job-title" data-section="researchGrants" data-index="${index}">${item.title || ''}</div>
          <div class="job-date" data-section="researchGrants" data-index="${index}">${item.year || ''}</div>
        </div>
        <div class="company-name" data-section="researchGrants" data-index="${index}">${formatSubtitle([item.agency, item.amount ? `Amount: ${item.amount}` : ''])}</div>
        <p>${item.description || ''}</p>
      </div>
    `).join('')}
  </div>` : ''}

  <!-- Publications -->
  ${nonEmptyPublications.length > 0 ? `
  <div class="section" data-section="publications">
    <div class="section-title">Publications</div>
    ${nonEmptyPublications.map((item: any, index: number) => `
      <div class="section-content" data-section="publications" data-index="${index}">
        <div class="job-header">
          <div class="job-title" data-section="publications" data-index="${index}">${item.title || ''}</div>
          <div class="job-date" data-section="publications" data-index="${index}">${item.year || ''}</div>
        </div>
        <div class="company-name" data-section="publications" data-index="${index}">${formatSubtitle([item.journalPublisher, item.publicationType])}</div>
        ${item.authors ? `<p><strong>Authors:</strong> ${item.authors}</p>` : ''}
        ${item.urlDoi ? `<p><a href="${item.urlDoi}" target="_blank">${item.urlDoi}</a></p>` : ''}
      </div>
    `).join('')}
  </div>` : ''}

  <!-- Patents -->
  ${nonEmptyPatents.length > 0 ? `
  <div class="section" data-section="patents">
    <div class="section-title">Patents</div>
    ${nonEmptyPatents.map((item: any, index: number) => `
      <div class="section-content" data-section="patents" data-index="${index}">
        <div class="job-header">
          <div class="job-title" data-section="patents" data-index="${index}">${item.title || ''}</div>
          <div class="job-date" data-section="patents" data-index="${index}">${item.year || ''}</div>
        </div>
        <div class="company-name" data-section="patents" data-index="${index}">${formatSubtitle([item.patentNumber ? `Patent #: ${item.patentNumber}` : '', item.issuingAuthority])}</div>
        <p><strong>Status:</strong> ${item.status || ''}</p>
      </div>
    `).join('')}
  </div>` : ''}

  <!-- Test Scores -->
  ${nonEmptyTestScores.length > 0 ? `
  <div class="section" data-section="testScores">
    <div class="section-title">Test Scores</div>
    ${nonEmptyTestScores.map((item: any, index: number) => `
      <div class="section-content" data-section="testScores" data-index="${index}">
        <div class="job-header">
          <div class="job-title" data-section="testScores" data-index="${index}">${item.testName || ''}</div>
          <div class="job-date" data-section="testScores" data-index="${index}">${item.year || ''}</div>
        </div>
        <div class="company-name" data-section="testScores" data-index="${index}">Score: ${item.score || ''}${item.percentileRank ? ` (${item.percentileRank} percentile)` : ''}</div>
      </div>
    `).join('')}
  </div>` : ''}

  <!-- Scholarships -->
  ${nonEmptyScholarships.length > 0 ? `
  <div class="section" data-section="scholarships">
    <div class="section-title">Scholarships</div>
    ${nonEmptyScholarships.map((item: any, index: number) => `
      <div class="section-content" data-section="scholarships" data-index="${index}">
        <div class="job-header">
          <div class="job-title" data-section="scholarships" data-index="${index}">${item.name || ''}</div>
          <div class="job-date" data-section="scholarships" data-index="${index}">${item.year || ''}</div>
        </div>
        <div class="company-name" data-section="scholarships" data-index="${index}">${formatSubtitle([item.provider || item.organization, item.amount])}</div>
        <p>${item.description || ''}</p>
      </div>
    `).join('')}
  </div>` : ''}

  <!-- Certifications -->
  ${nonEmptyCertifications.length > 0 ? `
  <div class="section" data-section="certifications">
    <div class="section-title">Certifications</div>
    ${nonEmptyCertifications.map((cert: any, index: number) => `
      <div class="section-content" data-section="certifications" data-index="${index}">
        <div class="job-title" data-section="certifications" data-index="${index}">${cert.name || ''}</div>
        <div class="company-name" data-section="certifications" data-index="${index}">${cert.issuer || ''}${cert.date ? ` | ${cert.date}` : ''}</div>
        ${cert.description ? `<p>${cert.description}</p>` : ''}
        ${cert.url ? `<p><a href="${cert.url}" target="_blank">View Certificate</a></p>` : ''}
      </div>
    `).join('')}
  </div>` : ''}

  <!-- Awards -->
  ${nonEmptyAwards.length > 0 ? `
  <div class="section" data-section="awards">
    <div class="section-title">Awards</div>
    ${nonEmptyAwards.map((award: any, index: number) => `
      <div class="section-content" data-section="awards" data-index="${index}">
        <div class="job-header">
          <div class="job-title" data-section="awards" data-index="${index}">${award.title || ''}</div>
          <div class="job-date" data-section="awards" data-index="${index}">${award.issueYear || award.year || ''}</div>
        </div>
        <div class="company-name" data-section="awards" data-index="${index}">${award.organization || ''}</div>
        ${award.description ? `<p>${award.description}</p>` : ''}
      </div>
    `).join('')}
  </div>` : ''}

  <!-- Speaking Engagements -->
  ${nonEmptySpeakingEngagements.length > 0 ? `
  <div class="section" data-section="speakingEngagements">
    <div class="section-title">Speaking Engagements</div>
    ${nonEmptySpeakingEngagements.map((item: any, index: number) => `
      <div class="section-content" data-section="speakingEngagements" data-index="${index}">
        <div class="job-header">
          <div class="job-title" data-section="speakingEngagements" data-index="${index}">${item.topic || ''}</div>
          <div class="job-date" data-section="speakingEngagements" data-index="${index}">${item.date || ''}</div>
        </div>
        <div class="company-name" data-section="speakingEngagements" data-index="${index}">${item.eventName || ''}</div>
        <p>${item.description || ''}</p>
      </div>
    `).join('')}
  </div>` : ''}

  <!-- Memberships -->
  ${nonEmptyMemberships.length > 0 ? `
  <div class="section" data-section="memberships">
    <div class="section-title">Memberships</div>
    ${nonEmptyMemberships.map((item: any, index: number) => `
      <div class="section-content" data-section="memberships" data-index="${index}">
        <div class="job-header">
          <div class="job-title" data-section="memberships" data-index="${index}">${item.membershipName || ''}</div>
          <div class="job-date" data-section="memberships" data-index="${index}">${item.year || ''}</div>
        </div>
        <div class="company-name" data-section="memberships" data-index="${index}">${item.organizationName || ''}</div>
        <p>${item.description || ''}</p>
      </div>
    `).join('')}
  </div>` : ''}

  <!-- Workshops -->
  ${nonEmptyWorkshops.length > 0 ? `
  <div class="section" data-section="workshops">
    <div class="section-title">Workshops</div>
    ${nonEmptyWorkshops.map((item: any, index: number) => `
      <div class="section-content" data-section="workshops" data-index="${index}">
        <div class="job-header">
          <div class="job-title" data-section="workshops" data-index="${index}">${item.programTitle || ''}</div>
          <div class="job-date" data-section="workshops" data-index="${index}">${item.year || ''}</div>
        </div>
        <div class="company-name" data-section="workshops" data-index="${index}">${item.conductedBy || ''}</div>
        <p>${item.description || ''}</p>
      </div>
    `).join('')}
  </div>` : ''}

  <!-- Co-curricular Activities -->
  ${nonEmptyCoCurricular.length > 0 ? `
  <div class="section" data-section="coCurricular">
    <div class="section-title">Co-curricular Activities</div>
    ${nonEmptyCoCurricular.map((item: any, index: number) => `
      <div class="section-content" data-section="coCurricular" data-index="${index}">
        <div class="job-header">
          <div class="job-title" data-section="coCurricular" data-index="${index}">${item.activity || ''}</div>
          <div class="job-date" data-section="coCurricular" data-index="${index}">${item.year || (item.startDate ? `${item.startDate} - ${item.endDate || ''}` : '')}</div>
        </div>
        <div class="company-name" data-section="coCurricular" data-index="${index}">${formatSubtitle([item.organization, item.role ? `Role: ${item.role}` : ''])}</div>
        <p>${item.description || ''}</p>
      </div>
    `).join('')}
  </div>` : ''}

  <!-- Extracurricular Activities -->
  ${nonEmptyExtracurricular.length > 0 ? `
  <div class="section" data-section="extracurricular">
    <div class="section-title">Extracurricular Activities</div>
    ${nonEmptyExtracurricular.map((item: any, index: number) => `
      <div class="section-content" data-section="extracurricular" data-index="${index}">
        <div class="job-header">
          <div class="job-title" data-section="extracurricular" data-index="${index}">${item.activity || ''}</div>
          <div class="job-date" data-section="extracurricular" data-index="${index}">${item.year || (item.startDate ? `${item.startDate} - ${item.endDate || ''}` : '')}</div>
        </div>
        <div class="company-name" data-section="extracurricular" data-index="${index}">${formatSubtitle([item.organization, item.role ? `Role: ${item.role}` : ''])}</div>
        <p>${item.description || ''}</p>
      </div>
    `).join('')}
  </div>` : ''}

  <!-- Languages -->
  ${nonEmptyLanguages.length > 0 ? `
  <div class="section" data-section="languages">
    <div class="section-title">Languages</div>
    <p>${nonEmptyLanguages.map((lang: any) => `${lang.language || lang}${lang.level ? ` (${lang.level})` : ''}${lang.capability ? ` - ${lang.capability}` : ''}`).join(', ')}</p>
  </div>` : ''}

  <!-- Hobbies -->
  ${nonEmptyHobbies.length > 0 ? `
  <div class="section" data-section="hobbies">
    <div class="section-title">Hobbies & Interests</div>
    <p>${nonEmptyHobbies.join(', ')}</p>
  </div>` : ''}

  <!-- Key Achievements -->
  ${nonEmptyKeyAchievements.length > 0 ? `
  <div class="section" data-section="keyAchievements">
    <div class="section-title">Key Achievements</div>
    <ul>
      ${nonEmptyKeyAchievements.map((achievement: string, index: number) => `<li data-section="keyAchievements" data-index="${index}">${achievement}</li>`).join('')}
    </ul>
  </div>` : ''}

  <!-- Key Responsibilities -->
  ${nonEmptyResponsibilities.length > 0 ? `
  <div class="section" data-section="responsibilities">
    <div class="section-title">Key Responsibilities</div>
    <ul>
      ${nonEmptyResponsibilities.map((line: string, index: number) => `<li data-section="responsibilities" data-index="${index}">${line.trim()}</li>`).join('')}
    </ul>
  </div>` : ''}

  <!-- Tools -->
  ${nonEmptyTools.length > 0 ? `
  <div class="section" data-section="tools">
    <div class="section-title">Tools & Technologies</div>
    <p>${nonEmptyTools.join(', ')}</p>
  </div>` : ''}

  <!-- Social Links -->
  ${nonEmptySocialLinks.length > 0 ? `
  <div class="section" data-section="socialLinks">
    <div class="section-title">Social Links</div>
    <p>${nonEmptySocialLinks.map((link: any, index: number) => `<a href="${link.url}" target="_blank">${link.urlText || link.url.replace('https://', '').replace('http://', '')}</a>`).join(', ')}</p>
  </div>` : ''}

  <!-- Social Profiles -->
  ${nonEmptySocialProfiles.length > 0 ? `
  <div class="section" data-section="socialProfiles">
    <div class="section-title">Social Profiles</div>
    <p>${nonEmptySocialProfiles.map((profile: any) => `<a href="${profile.url}" target="_blank">${profile.platform || "Profile"}</a>`).join(', ')}</p>
  </div>` : ''}

  <!-- References -->
  ${nonEmptyReferences.length > 0 ? `
  <div class="section" data-section="references">
    <div class="section-title">References</div>
    ${nonEmptyReferences.map((ref: any, index: number) => `
      <div class="section-content" data-section="references" data-index="${index}">
        <div class="job-title">${ref.name || ''}</div>
        <div class="company-name">${formatSubtitle([ref.designationRelationship, ref.organization])}</div>
        ${ref.contactInformation ? `<p><strong>Contact:</strong> ${ref.contactInformation}</p>` : ''}
      </div>
    `).join('')}
  </div>` : ''}

  <!-- Custom Sections -->
  ${nonEmptyCustomSections.length > 0 ? data.customSections
    .filter((section: any) => section.isVisible && section.entries && hasNonEmptyItems(section.entries))
    .map((section: any, sectionIndex: number) => `
  <div class="section" data-section="custom-${sectionIndex}">
    <div class="section-title">${section.heading || 'Custom Section'}</div>
    ${section.entries && section.entries.length > 0 ? section.entries
      .filter((entry: any) => entry.isVisible && (entry.title || entry.description))
      .map((entry: any, entryIndex: number) => `
      <div class="section-content" data-section="custom-${sectionIndex}" data-index="${entryIndex}">
        <div class="job-header">
          <div class="job-title" data-section="custom-${sectionIndex}" data-index="${entryIndex}">${entry.title || ''}${entry.organization ? ` | ${entry.organization}` : ''}</div>
          ${entry.date ? `<div class="job-date" data-section="custom-${sectionIndex}" data-index="${entryIndex}">${entry.date}</div>` : ''}
        </div>
        ${entry.description ? `<p>${entry.description}</p>` : ''}
      </div>
    `).join('') : ''}
  </div>
  `).join('') : ''}
</div>
</body>
</html>`;
}