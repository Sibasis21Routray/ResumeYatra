export function buildPikachuTemplate(data: any, theme?: any): string {
  const defaultTheme = {
    primary: '#000000',
    secondary: '#000000',
    background: '#ffffff',
    headingFont: 'Times New Roman, serif',
    bodyFont: 'Times New Roman, serif'
  }
  const currentTheme = theme || defaultTheme

  // Font size and family from data (user settings)
  const userFontSize = data.formatting?.bodyFontSize || data.fontSize || 12 
  const userFontFamily = data.formatting?.fontFamily || data.fontFamily || 'Times New Roman, serif'

  // Calculate responsive font sizes based on user font size
  const baseFontSize = userFontSize

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

  // Helper to format date range without empty parentheses
  const formatDateRange = (startDate?: string, endDate?: string, isCurrent?: boolean): string => {
    const parts = [];
    if (startDate && startDate.trim()) parts.push(startDate.trim());
    if (endDate && endDate.trim()) parts.push(endDate.trim());
    else if (isCurrent && parts.length > 0) parts.push("Present");
    
    if (parts.length === 0) return "";
    if (parts.length === 1) return parts[0];
    return parts.join(" – ");
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

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Resume</title>
  <style>
  * { margin: 0; padding: 0; box-sizing: border-box; }

  :root {
    --primary-color: ${currentTheme.primary};
    --secondary-color: ${currentTheme.secondary};
    --background-color: ${currentTheme.background};
  }

  body {
    font-family: ${userFontFamily};
    font-size: ${baseFontSize}px;
    color: #000000;
    background: #f3f4f6; /* Light gray background for preview mode */
    line-height: 1.4;
    padding: 20px;
  }

  /* OUTER BORDER (Double border effect from screenshot) */
  .outer-border {
    background: #ffffff;
    border: 1px solid #000000;
    padding: 4px;
    max-width: 850px;
    margin: 0 auto;
  }

  /* INNER CONTAINER */
  .container {
    border: 1px solid #000000;
    padding: 40px;
    min-height: 1000px;
    background: #ffffff;
  }

  /* ===== HEADER (Screenshot Style) ===== */
  .cv-title {
    text-align: center;
    font-size: ${baseFontSize + 2}px;
    margin-bottom: 25px;
    text-transform: none;
  }

  .header-flex {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 20px;
  }

  .name {
    font-size: ${baseFontSize + 4}px;
    font-weight: bold;
    color: #000000;
    margin-bottom: 5px;
    text-decoration: underline;
  }

  .contact-info {
    font-size: ${baseFontSize}px;
    color: #000000;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .contact-row {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
    align-items: center;
  }

  .contact-item {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .profile-photo {
    width: 120px;
    height: 140px;
    border: 1px solid #000;
    object-fit: cover;
    background: #eee;
  }

  .profile-photo-container {
    position: relative;
    width: 120px;
    height: 140px;
    flex-shrink: 0;
  }

  .photo-placeholder {
    width: 100%;
    height: 100%;
    border-radius: 8px;
    background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
    border: 1px solid #000;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #64748b;
    font-size: 12px;
    text-align: center;
    padding: 10px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  /* ===== SECTIONS (Screenshot Style) ===== */
  .section {
    margin-top: 20px;
    margin-bottom: 10px;
  }

  .section-title {
    font-size: ${baseFontSize + 1}px;
    font-weight: bold;
    text-transform: uppercase;
    text-decoration: underline;
    display: block;
    margin-bottom: 4px;
  }

  .horizontal-line {
    border-top: 1.5px solid #000000;
    margin-bottom: 10px;
  }

  /* ===== CONTENT & BULLETS ===== */
  .entry {
    margin-bottom: 15px;
  }

  .entry-title-bold {
    font-weight: bold;
    display: block;
    margin-bottom: 5px;
  }

  .label-underline {
    font-weight: bold;
    text-decoration: underline;
    margin: 10px 0 5px 0;
    display: block;
  }

  ul {
    list-style-type: none;
    padding-left: 20px;
  }

  li {
    position: relative;
    padding-left: 20px;
    margin-bottom: 4px;
  }

  /* Arrow bullet from screenshot */
  li::before {
    content: "➤";
    position: absolute;
    left: 0;
    font-size: 10px;
    top: 3px;
  }

  .skills-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 5px;
  }

  /* Metrics Grid for Professional Context */
  .metrics-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    gap: 10px;
    margin: 10px 0;
    padding: 10px;
    background: #f8f9fa;
    border: 1px solid #000;
  }

  .metric-item {
    text-align: center;
  }

  .metric-value {
    font-weight: 700;
    color: #000;
  }

  .metric-label {
    font-size: ${baseFontSize - 1}px;
    color: #333;
  }

  .tags-container {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 10px;
  }

  .tag {
    padding: 4px 8px;
    border: 1px solid #000;
    background: #f1f5f9;
    font-size: ${baseFontSize - 1}px;
  }

  @media print {
    body { background: none; padding: 0; }
    .outer-border { border: 1px solid #000; max-width: 100%; margin: 0; }
    .container { border: 1px solid #000; }
  }
</style>
</head>
<body>
<div class="outer-border">
<div class="container">
  <div class="cv-title">Curriculum Vitae</div>

  <div class="header-flex" data-section="personal">
    <div class="personal-info">
      <div class="name" data-section="personal">${data.personal?.name && data.personal?.name !== 'undefined' ? data.personal.name : "Your Name"}${data.personal?.middleName ? ` ${data.personal.middleName}` : ""}</div>
      ${data.personal?.role ? `<div style="font-size: 16px; color: #64748b; margin-bottom: 10px; font-weight: 600;">${data.personal.role}</div>` : ''}

      ${(data.personal?.email || data.personal?.phone || data.personal?.alternatePhone || data.personal?.location || data.personal?.country || data.personal?.pinCode || data.personal?.fullAddress || data.personal?.linkedinUrl || data.personal?.githubUrl || data.personal?.portfolioUrl || data.personal?.website || data.personal?.twitterUrl || data.personal?.facebookUrl || data.personal?.instagramUrl || data.personal?.behanceUrl || data.personal?.dribbbleUrl || data.personal?.stackoverflowUrl || data.personal?.mediumUrl) ? `
      <div class="contact-info">
        <!-- Address Line -->
        ${(() => {
          const addressParts = [
            data.personal?.fullAddress,
            data.personal?.location,
            data.personal?.country,
            data.personal?.pinCode
          ].filter(Boolean);
          return addressParts.length > 0 ? `
          <div class="contact-row">
            <div class="contact-item">📍 ${addressParts.join(', ')}</div>
          </div>
          ` : "";
        })()}

        <!-- Contact Line -->
        <div class="contact-row">
          ${data.personal?.email ? `<div class="contact-item">✉️ ${data.personal.email}</div>` : ""}
          ${data.personal?.phone ? `<div class="contact-item">📞 ${data.personal.phone}</div>` : ""}
          ${data.personal?.alternatePhone ? `<div class="contact-item">📞 ${data.personal.alternatePhone}</div>` : ""}
        </div>

        <!-- URLs Line -->
        ${(() => {
          const socialLinks = [];
          if (data.personal?.linkedinUrl) socialLinks.push(`<div class="contact-item"><a href="${data.personal.linkedinUrl}" target="_blank" style="color: #000; text-decoration: underline;">🔗 LinkedIn</a></div>`);
          if (data.personal?.githubUrl) socialLinks.push(`<div class="contact-item"><a href="${data.personal.githubUrl}" target="_blank" style="color: #000; text-decoration: underline;">🐙 GitHub</a></div>`);
          if (data.personal?.portfolioUrl) socialLinks.push(`<div class="contact-item"><a href="${data.personal.portfolioUrl}" target="_blank" style="color: #000; text-decoration: underline;">💼 Portfolio</a></div>`);
          if (data.personal?.website) socialLinks.push(`<div class="contact-item"><a href="${data.personal.website}" target="_blank" style="color: #000; text-decoration: underline;">🌐 Website</a></div>`);
          if (data.personal?.twitterUrl) socialLinks.push(`<div class="contact-item"><a href="${data.personal.twitterUrl}" target="_blank" style="color: #000; text-decoration: underline;">🐦 Twitter</a></div>`);
          if (data.personal?.facebookUrl) socialLinks.push(`<div class="contact-item"><a href="${data.personal.facebookUrl}" target="_blank" style="color: #000; text-decoration: underline;">📘 Facebook</a></div>`);
          if (data.personal?.instagramUrl) socialLinks.push(`<div class="contact-item"><a href="${data.personal.instagramUrl}" target="_blank" style="color: #000; text-decoration: underline;">📷 Instagram</a></div>`);
          if (data.personal?.behanceUrl) socialLinks.push(`<div class="contact-item"><a href="${data.personal.behanceUrl}" target="_blank" style="color: #000; text-decoration: underline;">🎨 Behance</a></div>`);
          if (data.personal?.dribbbleUrl) socialLinks.push(`<div class="contact-item"><a href="${data.personal.dribbbleUrl}" target="_blank" style="color: #000; text-decoration: underline;">🏀 Dribbble</a></div>`);
          if (data.personal?.stackoverflowUrl) socialLinks.push(`<div class="contact-item"><a href="${data.personal.stackoverflowUrl}" target="_blank" style="color: #000; text-decoration: underline;">📚 Stack Overflow</a></div>`);
          if (data.personal?.mediumUrl) socialLinks.push(`<div class="contact-item"><a href="${data.personal.mediumUrl}" target="_blank" style="color: #000; text-decoration: underline;">📝 Medium</a></div>`);
          
          return socialLinks.length > 0 ? `
          <div class="contact-row">
            ${socialLinks.join('')}
          </div>
          ` : "";
        })()}

        <!-- Personal Details Row -->
        ${(() => {
          const personalDetails = [];
          if (data.personal?.fathersName) personalDetails.push(`<div class="contact-item">👨 Father: ${data.personal.fathersName}</div>`);
          if (data.personal?.dob) personalDetails.push(`<div class="contact-item">📅 DOB: ${data.personal.dob}</div>`);
          if (data.personal?.gender) personalDetails.push(`<div class="contact-item">⚥ Gender: ${data.personal.gender}</div>`);
          if (data.personal?.maritalStatus) personalDetails.push(`<div class="contact-item">💍 Marital: ${data.personal.maritalStatus}</div>`);
          if (data.personal?.nationality) personalDetails.push(`<div class="contact-item">🌍 Nationality: ${data.personal.nationality}</div>`);
          if (data.personal?.passportNo) personalDetails.push(`<div class="contact-item">🛂 Passport: ${data.personal.passportNo}</div>`);
          
          return personalDetails.length > 0 ? `
          <div class="contact-row">
            ${personalDetails.join('')}
          </div>
          ` : "";
        })()}
      </div>
      ` : ''}
    </div>
    
    <div class="profile-photo-container">
      ${data.personal?.image ?
      `<img src="${data.personal.image}" alt="${data.personal?.name && data.personal?.name !== 'undefined' ? data.personal.name : 'Profile Photo'}" class="profile-photo" />` :
      `<div class="photo-placeholder">Profile Photo</div>`
    }
    </div>
  </div>

  <!-- Professional Context -->
  ${nonEmptyProfessionalContext ? `
  <div class="section" data-section="professionalContext">
    <span class="section-title">PROFESSIONAL CONTEXT</span>
    <div class="horizontal-line"></div>
    <div class="metrics-grid">
      ${nonEmptyProfessionalContext.totalExperience ? `
      <div class="metric-item">
        <div class="metric-value">${nonEmptyProfessionalContext.totalExperience}</div>
        <div class="metric-label">Total Experience</div>
      </div>` : ''}
      ${nonEmptyProfessionalContext.teamSize ? `
      <div class="metric-item">
        <div class="metric-value">${nonEmptyProfessionalContext.teamSize}</div>
        <div class="metric-label">Team Size</div>
      </div>` : ''}
      ${nonEmptyProfessionalContext.industry ? `
      <div class="metric-item">
        <div class="metric-value">${nonEmptyProfessionalContext.industry}</div>
        <div class="metric-label">Industry</div>
      </div>` : ''}
      ${nonEmptyProfessionalContext.functionalDomain ? `
      <div class="metric-item">
        <div class="metric-value">${nonEmptyProfessionalContext.functionalDomain}</div>
        <div class="metric-label">Domain</div>
      </div>` : ''}
      ${nonEmptyProfessionalContext.geographicScope ? `
      <div class="metric-item">
        <div class="metric-value">${nonEmptyProfessionalContext.geographicScope}</div>
        <div class="metric-label">Geographic Scope</div>
      </div>` : ''}
      ${nonEmptyProfessionalContext.revenueResponsibility ? `
      <div class="metric-item">
        <div class="metric-value">${nonEmptyProfessionalContext.revenueResponsibility}</div>
        <div class="metric-label">Revenue Responsibility</div>
      </div>` : ''}
    </div>
  </div>
  ` : ''}

  <!-- Availability & Work Auth -->
  ${nonEmptyAvailabilityWorkAuth ? `
  <div class="section" data-section="availabilityWorkAuth">
    <span class="section-title">AVAILABILITY</span>
    <div class="horizontal-line"></div>
    <div class="tags-container">
      ${nonEmptyAvailabilityWorkAuth.availabilityNoticePeriod ? `<span class="tag">📅 Notice: ${nonEmptyAvailabilityWorkAuth.availabilityNoticePeriod}</span>` : ''}
      ${nonEmptyAvailabilityWorkAuth.workAuthorizationStatus ? `<span class="tag">🪪 Work Auth: ${nonEmptyAvailabilityWorkAuth.workAuthorizationStatus}</span>` : ''}
      ${nonEmptyAvailabilityWorkAuth.preferredLocation ? `<span class="tag">📍 Preferred: ${nonEmptyAvailabilityWorkAuth.preferredLocation}</span>` : ''}
    </div>
  </div>
  ` : ''}

  <div class="content-wrapper">
      <!-- Summary -->
      ${data.summary && data.summary.trim() ? `
      <div class="section" data-section="summary">
        <span class="section-title">PROFESSIONAL SUMMARY</span>
        <div class="horizontal-line"></div>
        <p class="summary-text">${data.summary}</p>
      </div>` : ''}

      <!-- Career Objective -->
      ${data.careerObjective && data.careerObjective.trim() ? `
      <div class="section" data-section="careerObjective">
        <span class="section-title">CAREER OBJECTIVE</span>
        <div class="horizontal-line"></div>
        <p class="summary-text">${data.careerObjective}</p>
      </div>` : ''}

      <!-- Work Experience -->
      ${hasNonEmptyItems(data.experience) ? `
      <div class="section" data-section="experience">
        <span class="section-title">WORK EXPERIENCE</span>
        <div class="horizontal-line"></div>
        ${getNonEmptyArray(data.experience).map((exp: any, index: number) => {
          const dateRange = formatDateRange(exp.startDate, exp.endDate, exp.isCurrent);
          const companyLocation = formatSubtitle([exp.company, exp.location]);
          
          return `
          <div class="entry" data-section="experience" data-index="${index}">
            <span class="entry-title-bold">${exp.company || ''} ${dateRange ? `(${dateRange})` : ''}</span>
            <div style="margin-left: 10px;">
                <div>${exp.title || ''}${exp.location && !companyLocation.includes(exp.location) ? ` - ${exp.location}` : ''}</div>
                ${exp.description ? `
                <span class="label-underline">Job Responsibilities:</span>
                <ul>
                  ${(exp.description || '').split('\n').filter((l: string) => l.trim()).map((line: string) => `<li>${line.replace(/^[•*-]\s*/, '')}</li>`).join('')}
                </ul>
                ` : ''}
                ${exp.achievements ? `<div style="margin-top: 5px;"><strong>Achievements:</strong> ${exp.achievements}</div>` : ''}
            </div>
          </div>
        `}).join('')}
      </div>` : ''}

      <!-- Internships -->
      ${nonEmptyInternships.length > 0 ? `
      <div class="section" data-section="internships">
        <span class="section-title">INTERNSHIPS</span>
        <div class="horizontal-line"></div>
        ${nonEmptyInternships.map((item: any, index: number) => {
          const dateRange = item.duration || formatDateRange(item.startDate, item.endDate);
          const companyLocation = formatSubtitle([item.company, item.location]);
          
          return `
          <div class="entry" data-section="internships" data-index="${index}">
            <span class="entry-title-bold">${item.company || ''} ${dateRange ? `(${dateRange})` : ''}</span>
            <div style="margin-left: 10px;">
                <div>${item.title || ''}${item.location && !companyLocation.includes(item.location) ? ` - ${item.location}` : ''}</div>
                ${item.description ? `
                <ul>
                  ${(item.description || '').split('\n').filter((l: string) => l.trim()).map((line: string) => `<li>${line.replace(/^[•*-]\s*/, '')}</li>`).join('')}
                </ul>
                ` : ''}
            </div>
          </div>
        `}).join('')}
      </div>` : ''}

      <!-- Training Programs -->
      ${nonEmptyTrainingPrograms.length > 0 ? `
      <div class="section" data-section="trainingPrograms">
        <span class="section-title">TRAINING PROGRAMS</span>
        <div class="horizontal-line"></div>
        ${nonEmptyTrainingPrograms.map((item: any, index: number) => `
          <div class="entry" data-section="trainingPrograms" data-index="${index}">
            <span class="entry-title-bold">${item.name || ''}</span>
            <div>${formatSubtitle([item.provider || item.organization, item.duration])}</div>
            ${item.completionDate ? `<div>${item.completionDate}</div>` : ''}
            ${item.description ? `<div>${item.description}</div>` : ''}
          </div>
        `).join('')}
      </div>` : ''}

      <!-- Education -->
      ${hasNonEmptyItems(data.education) ? `
      <div class="section" data-section="education">
        <span class="section-title">EDUCATION</span>
        <div class="horizontal-line"></div>
        ${getNonEmptyArray(data.education).map((edu: any, index: number) => `
          <div class="entry" data-section="education" data-index="${index}">
            <span class="entry-title-bold">${edu.school || ''}</span>
            <div>${edu.degree || ''} ${edu.field ? `in ${edu.field}` : ''} ${edu.graduationDate ? `(${edu.graduationDate})` : ''}</div>
            ${edu.grade ? `<div>Grade: ${edu.grade}</div>` : ''}
            ${edu.description ? `<div style="font-style: italic; font-size: 0.9em; margin-top:5px;">${edu.description}</div>` : ''}
          </div>
        `).join('')}
      </div>` : ''}

      <!-- Academic Projects -->
      ${nonEmptyAcademicProjects.length > 0 ? `
      <div class="section" data-section="academicProjects">
        <span class="section-title">ACADEMIC PROJECTS</span>
        <div class="horizontal-line"></div>
        ${nonEmptyAcademicProjects.map((item: any, index: number) => `
          <div class="entry" data-section="academicProjects" data-index="${index}">
            <span class="entry-title-bold">${item.name || item.title || ''}</span>
            <div>${formatSubtitle([item.institution, item.course ? `Course: ${item.course}` : ''])}</div>
            ${item.duration ? `<div>${item.duration}</div>` : ''}
            <div>${item.description || ''}</div>
            ${item.technologies ? `<div><strong>Technologies:</strong> ${Array.isArray(item.technologies) ? item.technologies.join(', ') : item.technologies}</div>` : ''}
            ${item.url ? `<div><a href="${item.url}" target="_blank" style="color: #000; text-decoration: underline;">View Project</a></div>` : ''}
          </div>
        `).join('')}
      </div>` : ''}

      <!-- Client Projects -->
      ${nonEmptyClientProjects.length > 0 ? `
      <div class="section" data-section="clientProjects">
        <span class="section-title">CLIENT PROJECTS</span>
        <div class="horizontal-line"></div>
        ${nonEmptyClientProjects.map((item: any, index: number) => `
          <div class="entry" data-section="clientProjects" data-index="${index}">
            <span class="entry-title-bold">${item.name || ''}</span>
            <div>${formatSubtitle([item.clientOrganization, item.role ? `Role: ${item.role}` : '', item.duration])}</div>
            <div>${item.description || ''}</div>
            ${item.toolsTechnologies ? `<div><strong>Tools:</strong> ${item.toolsTechnologies}</div>` : ''}
            ${item.projectUrl ? `<div><a href="${item.projectUrl}" target="_blank" style="color: #000; text-decoration: underline;">View Project</a></div>` : ''}
          </div>
        `).join('')}
      </div>` : ''}

      <!-- Portfolio -->
      ${nonEmptyPortfolio.length > 0 ? `
      <div class="section" data-section="portfolio">
        <span class="section-title">PORTFOLIO</span>
        <div class="horizontal-line"></div>
        ${nonEmptyPortfolio.map((item: any, index: number) => `
          <div class="entry" data-section="portfolio" data-index="${index}">
            <span class="entry-title-bold">${item.name || ''}</span>
            <div>${formatSubtitle([item.type, item.platform ? `on ${item.platform}` : ''])}</div>
            <div>${item.description || ''}</div>
            ${item.url ? `<div><a href="${item.url}" target="_blank" style="color: #000; text-decoration: underline;">View Portfolio</a></div>` : ''}
          </div>
        `).join('')}
      </div>` : ''}

      <!-- Leadership Positions -->
      ${nonEmptyLeadershipPositions.length > 0 ? `
      <div class="section" data-section="leadershipPositions">
        <span class="section-title">LEADERSHIP & POSITIONS</span>
        <div class="horizontal-line"></div>
        ${nonEmptyLeadershipPositions.map((item: any, index: number) => {
          const dateRange = formatDateRange(item.startDate, item.endDate);
          
          return `
          <div class="entry" data-section="leadershipPositions" data-index="${index}">
            <span class="entry-title-bold">${item.position || item.title || ''}</span>
            <div>${item.organization || ''} ${dateRange ? `(${dateRange})` : ''}</div>
            <div>${item.description || ''}</div>
          </div>
        `}).join('')}
      </div>` : ''}

      <!-- Volunteering -->
      ${nonEmptyVolunteering.length > 0 ? `
      <div class="section" data-section="volunteering">
        <span class="section-title">VOLUNTEERING</span>
        <div class="horizontal-line"></div>
        ${nonEmptyVolunteering.map((item: any, index: number) => `
          <div class="entry" data-section="volunteering" data-index="${index}">
            <span class="entry-title-bold">${item.role || ''}</span>
            <div>${formatSubtitle([item.organization, item.causeArea, item.duration])}</div>
            <div>${item.description || ''}</div>
          </div>
        `).join('')}
      </div>` : ''}

      <!-- Military Service -->
      ${nonEmptyMilitaryService.length > 0 ? `
      <div class="section" data-section="militaryService">
        <span class="section-title">MILITARY SERVICE</span>
        <div class="horizontal-line"></div>
        ${nonEmptyMilitaryService.map((item: any, index: number) => `
          <div class="entry" data-section="militaryService" data-index="${index}">
            <span class="entry-title-bold">${item.rank ? item.rank : ''}${item.rank && item.branch ? ' - ' : ''}${item.branch || ''}</span>
            ${item.specialization ? `<div>${item.specialization}</div>` : ''}
            ${item.duration ? `<div>${item.duration}</div>` : ''}
            <div>${item.description || ''}</div>
          </div>
        `).join('')}
      </div>` : ''}

      <!-- Teaching Experience -->
      ${nonEmptyTeachingExperience.length > 0 ? `
      <div class="section" data-section="teachingExperience">
        <span class="section-title">TEACHING EXPERIENCE</span>
        <div class="horizontal-line"></div>
        ${nonEmptyTeachingExperience.map((item: any, index: number) => `
          <div class="entry" data-section="teachingExperience" data-index="${index}">
            <span class="entry-title-bold">${item.subjectCourseTaught || item.title || ''}</span>
            <div>${formatSubtitle([item.institution, item.duration])}</div>
            <div>${item.description || ''}</div>
          </div>
        `).join('')}
      </div>` : ''}

      <!-- Mentorship Experience -->
      ${nonEmptyMentorshipExperience.length > 0 ? `
      <div class="section" data-section="mentorshipExperience">
        <span class="section-title">MENTORSHIP EXPERIENCE</span>
        <div class="horizontal-line"></div>
        ${nonEmptyMentorshipExperience.map((item: any, index: number) => `
          <div class="entry" data-section="mentorshipExperience" data-index="${index}">
            <span class="entry-title-bold">${item.mentorshipArea || ''}</span>
            <div>${formatSubtitle([item.organizationPlatform, item.menteeLevel ? `Mentee Level: ${item.menteeLevel}` : '', item.duration])}</div>
            <div>${item.description || ''}</div>
          </div>
        `).join('')}
      </div>` : ''}

      <!-- Research Grants -->
      ${nonEmptyResearchGrants.length > 0 ? `
      <div class="section" data-section="researchGrants">
        <span class="section-title">RESEARCH GRANTS</span>
        <div class="horizontal-line"></div>
        ${nonEmptyResearchGrants.map((item: any, index: number) => `
          <div class="entry" data-section="researchGrants" data-index="${index}">
            <span class="entry-title-bold">${item.title || ''}</span>
            <div>${formatSubtitle([item.agency, item.amount ? `Amount: ${item.amount}` : '', item.year])}</div>
            <div>${item.description || ''}</div>
          </div>
        `).join('')}
      </div>` : ''}

      <!-- Publications -->
      ${nonEmptyPublications.length > 0 ? `
      <div class="section" data-section="publications">
        <span class="section-title">PUBLICATIONS</span>
        <div class="horizontal-line"></div>
        ${nonEmptyPublications.map((item: any, index: number) => `
          <div class="entry" data-section="publications" data-index="${index}">
            <span class="entry-title-bold">${item.title || ''}</span>
            <div>${formatSubtitle([item.journalPublisher, item.publicationType, item.year])}</div>
            ${item.authors ? `<div><strong>Authors:</strong> ${item.authors}</div>` : ''}
            ${item.urlDoi ? `<div><a href="${item.urlDoi}" target="_blank" style="color: #000; text-decoration: underline;">${item.urlDoi}</a></div>` : ''}
          </div>
        `).join('')}
      </div>` : ''}

      <!-- Patents -->
      ${nonEmptyPatents.length > 0 ? `
      <div class="section" data-section="patents">
        <span class="section-title">PATENTS</span>
        <div class="horizontal-line"></div>
        ${nonEmptyPatents.map((item: any, index: number) => `
          <div class="entry" data-section="patents" data-index="${index}">
            <span class="entry-title-bold">${item.title || ''}</span>
            <div>${formatSubtitle([item.patentNumber ? `Patent #: ${item.patentNumber}` : '', item.issuingAuthority, item.year])}</div>
            ${item.status ? `<div><strong>Status:</strong> ${item.status}</div>` : ''}
          </div>
        `).join('')}
      </div>` : ''}

      <!-- Test Scores -->
      ${nonEmptyTestScores.length > 0 ? `
      <div class="section" data-section="testScores">
        <span class="section-title">TEST SCORES</span>
        <div class="horizontal-line"></div>
        ${nonEmptyTestScores.map((item: any, index: number) => `
          <div class="entry" data-section="testScores" data-index="${index}">
            <span class="entry-title-bold">${item.testName || ''}</span>
            <div>Score: ${item.score || ''}${item.percentileRank ? ` (${item.percentileRank} percentile)` : ''} ${item.year ? `- ${item.year}` : ''}</div>
          </div>
        `).join('')}
      </div>` : ''}

      <!-- Scholarships -->
      ${nonEmptyScholarships.length > 0 ? `
      <div class="section" data-section="scholarships">
        <span class="section-title">SCHOLARSHIPS</span>
        <div class="horizontal-line"></div>
        ${nonEmptyScholarships.map((item: any, index: number) => `
          <div class="entry" data-section="scholarships" data-index="${index}">
            <span class="entry-title-bold">${item.name || ''}</span>
            <div>${formatSubtitle([item.provider || item.organization, item.amount ? `Amount: ${item.amount}` : '', item.year])}</div>
            <div>${item.description || ''}</div>
          </div>
        `).join('')}
      </div>` : ''}

      <!-- Co-curricular Activities -->
      ${nonEmptyCoCurricular.length > 0 ? `
      <div class="section" data-section="coCurricular">
        <span class="section-title">CO-CURRICULAR ACTIVITIES</span>
        <div class="horizontal-line"></div>
        ${nonEmptyCoCurricular.map((item: any, index: number) => `
          <div class="entry" data-section="coCurricular" data-index="${index}">
            <span class="entry-title-bold">${item.activity || ''}</span>
            <div>${formatSubtitle([item.organization, item.role ? `Role: ${item.role}` : ''])}</div>
            <div>${item.year || ''}</div>
            <div>${item.description || ''}</div>
          </div>
        `).join('')}
      </div>` : ''}

      <!-- Extracurricular Activities -->
      ${nonEmptyExtracurricular.length > 0 ? `
      <div class="section" data-section="extracurricular">
        <span class="section-title">EXTRACURRICULAR ACTIVITIES</span>
        <div class="horizontal-line"></div>
        ${nonEmptyExtracurricular.map((item: any, index: number) => `
          <div class="entry" data-section="extracurricular" data-index="${index}">
            <span class="entry-title-bold">${item.activity || ''}</span>
            <div>${formatSubtitle([item.organization, item.role ? `Role: ${item.role}` : ''])}</div>
            <div>${item.year || ''}</div>
            <div>${item.description || ''}</div>
          </div>
        `).join('')}
      </div>` : ''}

      <!-- Skills -->
      ${nonEmptySkills.length > 0 ? `
      <div class="section" data-section="skills">
        <span class="section-title">SKILLS & TOOLS</span>
        <div class="horizontal-line"></div>
        <div class="skills-grid">
          ${nonEmptySkills.map((skill: any) => `
            <li>${typeof skill === 'string' ? skill.trim() : skill}</li>
          `).join('')}
        </div>
      </div>` : ''}

      <!-- Tools & Technologies -->
      ${nonEmptyToolsTechnologies.length > 0 ? `
      <div class="section" data-section="toolsTechnologies">
        <span class="section-title">TOOLS & TECHNOLOGIES</span>
        <div class="horizontal-line"></div>
        <div class="skills-grid">
          ${nonEmptyToolsTechnologies.map((item: any) => `
            <li>${item.name || ''}${item.proficiency ? ` (${item.proficiency})` : ''}${item.experienceDuration ? ` - ${item.experienceDuration}` : ''}</li>
          `).join('')}
        </div>
      </div>` : ''}

      <!-- Methodologies -->
      ${nonEmptyMethodologies.length > 0 ? `
      <div class="section" data-section="methodologies">
        <span class="section-title">METHODOLOGIES</span>
        <div class="horizontal-line"></div>
        <div class="skills-grid">
          ${nonEmptyMethodologies.map((item: any) => `
            <li>${item.name || ''}${item.certification ? ` (${item.certification})` : ''}${item.experienceDuration ? ` - ${item.experienceDuration} years` : ''}</li>
          `).join('')}
        </div>
      </div>` : ''}

      <!-- Industry Expertise -->
      ${nonEmptyIndustryExpertise.length > 0 ? `
      <div class="section" data-section="industryExpertise">
        <span class="section-title">INDUSTRY EXPERTISE</span>
        <div class="horizontal-line"></div>
        <div class="skills-grid">
          ${nonEmptyIndustryExpertise.map((item: any) => `
            <li>${item.industry || ''}${item.domainArea ? ` - ${item.domainArea}` : ''}${item.experienceDuration ? ` (${item.experienceDuration} years)` : ''}</li>
          `).join('')}
        </div>
      </div>` : ''}

      <!-- Projects -->
      ${nonEmptyProjects.length > 0 ? `
      <div class="section" data-section="projects">
        <span class="section-title">PROJECTS</span>
        <div class="horizontal-line"></div>
        ${nonEmptyProjects.map((project: any, index: number) => `
          <div class="entry" data-index="${index}">
            <span class="entry-title-bold">${project.name || ''}</span>
            ${project.technologies ? `<div>${project.technologies}</div>` : ''}
            ${project.startDate || project.endDate ? `<div>${formatDateRange(project.startDate, project.endDate)}</div>` : ''}
            <p>${project.description || ''}</p>
            ${project.url ? `<div><a href="${project.url}" target="_blank" style="color: #000; text-decoration: underline;">${project.urlText || "View Project"}</a></div>` : ''}
          </div>
        `).join('')}
      </div>` : ''}

      <!-- Certifications -->
      ${nonEmptyCertifications.length > 0 ? `
      <div class="section" data-section="certifications">
        <span class="section-title">CERTIFICATIONS</span>
        <div class="horizontal-line"></div>
        <ul>
          ${nonEmptyCertifications.map((cert: any) => `<li>${cert.name || ''} - ${cert.issuer || ''} ${cert.date ? `(${cert.date})` : ''}</li>`).join('')}
        </ul>
        ${nonEmptyCertifications.some(cert => cert.url) ? `
        <div style="margin-top: 5px;">
          ${nonEmptyCertifications.filter(cert => cert.url).map(cert => `<div><a href="${cert.url}" target="_blank" style="color: #000; text-decoration: underline;">View Certificate for ${cert.name}</a></div>`).join('')}
        </div>
        ` : ''}
      </div>` : ''}

      <!-- Languages -->
      ${nonEmptyLanguages.length > 0 ? `
      <div class="section" data-section="languages">
        <span class="section-title">LANGUAGES</span>
        <div class="horizontal-line"></div>
        <ul>
          ${nonEmptyLanguages.map((lang: any) => `<li>${lang.language || lang}${lang.level ? ` (${lang.level})` : ''}${lang.capability ? ` - ${lang.capability}` : ''}</li>`).join('')}
        </ul>
      </div>` : ''}

      <!-- Hobbies -->
      ${nonEmptyHobbies.length > 0 ? `
      <div class="section" data-section="hobbies">
        <span class="section-title">HOBBIES & INTERESTS</span>
        <div class="horizontal-line"></div>
        <div class="tags-container">
          ${nonEmptyHobbies.map((hobby: any) => `<span class="tag">${hobby}</span>`).join('')}
        </div>
      </div>` : ''}

      <!-- Social Links -->
      ${nonEmptySocialLinks.length > 0 ? `
      <div class="section" data-section="socialLinks">
        <span class="section-title">SOCIAL LINKS</span>
        <div class="horizontal-line"></div>
        <div class="tags-container">
          ${nonEmptySocialLinks.map((link: any) => `<a href="${link.url}" target="_blank" style="color: #000; text-decoration: underline; margin-right: 15px;">${link.urlText || link.url.replace('https://', '').replace('http://', '')}</a>`).join('')}
        </div>
      </div>` : ''}

      <!-- Social Profiles -->
      ${nonEmptySocialProfiles.length > 0 ? `
      <div class="section" data-section="socialProfiles">
        <span class="section-title">SOCIAL PROFILES</span>
        <div class="horizontal-line"></div>
        <div class="tags-container">
          ${nonEmptySocialProfiles.map((profile: any) => `<a href="${profile.url}" target="_blank" style="color: #000; text-decoration: underline; margin-right: 15px;">${profile.platform || "Profile"}</a>`).join('')}
        </div>
      </div>` : ''}

      <!-- References -->
      ${nonEmptyReferences.length > 0 ? `
      <div class="section" data-section="references">
        <span class="section-title">REFERENCES</span>
        <div class="horizontal-line"></div>
        ${nonEmptyReferences.map((ref: any, index: number) => `
          <div class="entry" data-section="references" data-index="${index}">
            <span class="entry-title-bold">${ref.name || ''}</span>
            <div>${formatSubtitle([ref.designationRelationship, ref.organization])}</div>
            ${ref.contactInformation ? `<div><strong>Contact:</strong> ${ref.contactInformation}</div>` : ''}
          </div>
        `).join('')}
      </div>` : ''}

      <!-- Key Achievements -->
      ${nonEmptyKeyAchievements.length > 0 ? `
      <div class="section" data-section="keyAchievements">
        <span class="section-title">KEY ACHIEVEMENTS</span>
        <div class="horizontal-line"></div>
        <ul>
          ${nonEmptyKeyAchievements.map((achievement: string) => `<li>${achievement}</li>`).join('')}
        </ul>
      </div>` : ''}

      <!-- Key Responsibilities -->
      ${nonEmptyResponsibilities.length > 0 ? `
      <div class="section" data-section="responsibilities">
        <span class="section-title">KEY RESPONSIBILITIES</span>
        <div class="horizontal-line"></div>
        <ul>
          ${nonEmptyResponsibilities.map((line: string) => `<li>${line.trim()}</li>`).join('')}
        </ul>
      </div>` : ''}

      <!-- Tools -->
      ${nonEmptyTools.length > 0 ? `
      <div class="section" data-section="tools">
        <span class="section-title">TOOLS & TECHNOLOGIES</span>
        <div class="horizontal-line"></div>
        <ul>
          ${nonEmptyTools.map((line: string) => `<li>${line.trim()}</li>`).join('')}
        </ul>
      </div>` : ''}

      <!-- Awards -->
      ${nonEmptyAwards.length > 0 ? `
      <div class="section" data-section="awards">
        <span class="section-title">AWARDS</span>
        <div class="horizontal-line"></div>
        ${nonEmptyAwards.map((award: any, index: number) => `
          <div class="entry" data-section="awards" data-index="${index}">
            <span class="entry-title-bold">${award.title || ''}</span>
            <div>${award.organization || ''} ${award.issueYear ? `(${award.issueYear})` : ''}</div>
            ${award.description ? `<div>${award.description}</div>` : ''}
          </div>
        `).join('')}
      </div>` : ''}

      <!-- Speaking Engagements -->
      ${nonEmptySpeakingEngagements.length > 0 ? `
      <div class="section" data-section="speakingEngagements">
        <span class="section-title">SPEAKING ENGAGEMENTS</span>
        <div class="horizontal-line"></div>
        ${nonEmptySpeakingEngagements.map((item: any, index: number) => `
          <div class="entry" data-section="speakingEngagements" data-index="${index}">
            <span class="entry-title-bold">${item.topic || ''}</span>
            <div>${item.eventName || ''} ${item.date ? `(${item.date})` : ''}</div>
            <div>${item.description || ''}</div>
          </div>
        `).join('')}
      </div>` : ''}

      <!-- Memberships -->
      ${nonEmptyMemberships.length > 0 ? `
      <div class="section" data-section="memberships">
        <span class="section-title">MEMBERSHIPS</span>
        <div class="horizontal-line"></div>
        ${nonEmptyMemberships.map((item: any, index: number) => `
          <div class="entry" data-section="memberships" data-index="${index}">
            <span class="entry-title-bold">${item.membershipName || ''}</span>
            <div>${item.organizationName || ''} ${item.year ? `(${item.year})` : ''}</div>
            <div>${item.description || ''}</div>
          </div>
        `).join('')}
      </div>` : ''}

      <!-- Workshops -->
      ${nonEmptyWorkshops.length > 0 ? `
      <div class="section" data-section="workshops">
        <span class="section-title">WORKSHOPS</span>
        <div class="horizontal-line"></div>
        ${nonEmptyWorkshops.map((item: any, index: number) => `
          <div class="entry" data-section="workshops" data-index="${index}">
            <span class="entry-title-bold">${item.programTitle || ''}</span>
            <div>${item.conductedBy || ''} ${item.year ? `(${item.year})` : ''}</div>
            <div>${item.description || ''}</div>
          </div>
        `).join('')}
      </div>` : ''}

      <!-- Custom Sections -->
      ${nonEmptyCustomSections.length > 0 ? data.customSections.filter((section: any) => section.isVisible && section.entries && hasNonEmptyItems(section.entries)).map((section: any) => `
        <div class="section" data-section="customSections">
          <span class="section-title">${section.heading || 'Custom Section'}</span>
          <div class="horizontal-line"></div>
          ${section.entries && section.entries.length > 0 ? section.entries.filter((entry: any) => entry.isVisible && (entry.title || entry.description)).map((entry: any, entryIndex: number) => `
            <div class="entry" data-index="${entryIndex}">
              <span class="entry-title-bold">${entry.title || ''}${entry.title && entry.organization ? ' at ' : ''}${entry.organization || ''}</span>
              ${entry.date ? `<div>${entry.date}</div>` : ''}
              ${entry.description ? `<div>${entry.description}</div>` : ''}
            </div>
          `).join('') : '<div style="color: #64748b; font-style: italic;">No entries in this section</div>'}
        </div>
      `).join('') : ""}

    </div>
  </div>
</div>
</body>
</html>`
}