export function buildSkillsFirstTemplate(data: any, theme?: any): string {
  const defaultTheme = {
    primary: "#000000",
    secondary: "#444444",
    background: "#ffffff",
    accent: "#f3f3f3",
    headingFont: "Arial, sans-serif",
    bodyFont: "Arial, sans-serif",
  };
  const currentTheme = theme || defaultTheme;

  const bodyFontSize = "10pt";
  const headingFontSize = "12pt";
  const nameFontSize = "24pt";

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

  // Helper to check if a section has content
  const hasExpertiseContent = nonEmptyKeyAchievements.length > 0;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    :root {
      --primary-color: ${currentTheme.primary};
      --secondary-color: ${currentTheme.secondary};
      --bg-color: ${currentTheme.background};
      --accent-color: ${currentTheme.accent};
    }

    body {
      font-family: ${currentTheme.bodyFont};
      color: var(--primary-color);
      line-height: 1.3;
      margin: 0; padding: 0;
      background: white;
    }

    .header {
      background-color: #EAEAEA;
      text-align: center;
      padding: 40px 20px;
      margin-bottom: 20px;
      border-radius: 0 0 40px 40px;
    }

    .name {
      font-size: ${nameFontSize};
      font-weight: bold;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 5px;
    }

    .title-sub {
      font-size: 14pt;
      color: var(--secondary-color);
    }

    .main-grid {
      display: flex;
      padding: 0 40px 40px 40px;
    }

    .sidebar {
      width: 30%;
      padding-right: 25px;
    }

    .sidebar-box {
      background-color: var(--accent-color);
      padding: 15px;
      margin-bottom: 1px; /* Creates the thin separation seen in image */
    }

    .content-main {
      width: 70%;
      padding-left: 25px;
    }

    .section-title {
      font-size: ${headingFontSize};
      font-weight: bold;
      text-transform: uppercase;
      margin-bottom: 15px;
      border-bottom: 1px solid #ddd;
      padding-bottom: 5px;
    }

    .sidebar-box .section-title {
      border-bottom: none;
    }

    .contact-item {
      font-size: 9pt;
      margin-bottom: 10px;
      display: flex;
      align-items: center;
    }

    .contact-item a {
      color: var(--primary-color);
      text-decoration: none;
    }

    .contact-item a:hover {
      text-decoration: underline;
    }

    /* Experience styling with horizontal lines */
    .exp-item { margin-bottom: 20px; }
    .exp-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-weight: bold;
      text-transform: uppercase;
      font-size: 10pt;
    }
    .line-spacer {
      flex-grow: 1;
      height: 1px;
      background: #ccc;
      margin: 0 10px;
    }
    .role-title {
      font-size: 9pt;
      font-style: italic;
      margin-bottom: 5px;
    }

    /* Skill Bars */
    .skill-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 9pt;
      margin-bottom: 8px;
    }
    .skill-track {
      width: 50px;
      height: 4px;
      background: #ddd;
      position: relative;
    }
    .skill-fill {
      position: absolute;
      left: 0; top: 0; bottom: 0;
      width: 70%;
      background: #555;
    }

    /* Enhanced Education Styles */
    .education-entry {
      margin-bottom: 12px;
      padding: 8px;
      background: rgba(255,255,255,0.7);
      border-left: 3px solid #666;
      border-radius: 2px;
    }

    .education-degree {
      font-weight: bold;
      color: var(--primary-color);
      margin-bottom: 3px;
      font-size: 9pt;
    }

    .education-field {
      font-weight: 600;
      color: var(--secondary-color);
      margin-bottom: 3px;
      font-size: 8.5pt;
    }

    .education-school {
      font-weight: bold;
      color: var(--primary-color);
      margin-bottom: 3px;
      font-size: 9pt;
    }

    .education-location {
      color: var(--secondary-color);
      font-style: italic;
      margin-bottom: 5px;
      font-size: 8pt;
    }

    .education-date {
      font-size: 8pt;
      color: #666;
      margin-bottom: 5px;
    }

    .education-description {
      font-size: 8pt;
      color: var(--secondary-color);
      line-height: 1.4;
      margin-top: 6px;
      padding: 6px;
      background: rgba(255,255,255,0.9);
      border-radius: 3px;
      border: 1px solid #e0e0e0;
    }

    .education-description ul {
      margin: 4px 0 4px 15px;
      padding: 0;
      list-style-type: disc;
    }

    .education-description li {
      margin: 2px 0;
      color: var(--secondary-color);
    }

    .education-description b {
      font-weight: bold;
      color: var(--primary-color);
    }

    .education-achievements {
      margin-top: 6px;
      padding-top: 6px;
      border-top: 1px solid #d0d0d0;
    }

    .education-achievements h4 {
      font-size: 8pt;
      font-weight: bold;
      color: var(--primary-color);
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
      padding-left: 12px;
      margin-bottom: 2px;
      color: var(--secondary-color);
      font-size: 8pt;
    }

    .education-achievements li:before {
      content: "⚡";
      position: absolute;
      left: 0;
      font-size: 7pt;
    }

    /* Two column layout for skills */
    .skills-two-column {
      columns: 2;
      column-gap: 30px;
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .skills-two-column li {
      font-size: 9pt;
      margin-bottom: 6px;
      break-inside: avoid;
    }

    p, li { font-size: ${bodyFontSize}; }
    ul { padding-left: 18px; margin-top: 5px; }
  </style>
</head>
<body>
  <div class="header" data-section="personal">
    <div class="name" data-section="personal">${
      data.personal?.name || "YOUR NAME"
    }${data.personal?.middleName ? ` ${data.personal.middleName}` : ""}</div>
    ${
      data.personal?.role
        ? `<div class="title-sub">${data.personal.role}</div>`
        : data.experience?.[0]?.title
        ? `<div class="title-sub">${data.experience[0].title}</div>`
        : ""
    }
  </div>

  <div class="main-grid">
    <div class="sidebar">
      <!-- Personal Details -->
      ${(() => {
        const personalDetails = [];
        if (data.personal?.fathersName) personalDetails.push(`<div><strong>Father's Name:</strong> ${data.personal.fathersName}</div>`);
        if (data.personal?.dob) personalDetails.push(`<div><strong>Date of Birth:</strong> ${data.personal.dob}</div>`);
        if (data.personal?.gender) personalDetails.push(`<div><strong>Gender:</strong> ${data.personal.gender}</div>`);
        if (data.personal?.maritalStatus) personalDetails.push(`<div><strong>Marital Status:</strong> ${data.personal.maritalStatus}</div>`);
        if (data.personal?.nationality) personalDetails.push(`<div><strong>Nationality:</strong> ${data.personal.nationality}</div>`);
        if (data.personal?.passportNo) personalDetails.push(`<div><strong>Passport No:</strong> ${data.personal.passportNo}</div>`);
        
        return personalDetails.length > 0 ? `
      <div class="sidebar-box" data-section="personal">
        <div class="section-title" style="border:none;">PERSONAL DETAILS</div>
        <div style="font-size: 9pt; color: var(--secondary-color); display: flex; flex-direction: column; gap: 6px;">
          ${personalDetails.join('')}
        </div>
      </div>` : '';
      })()}

      <!-- Professional Context -->
      ${nonEmptyProfessionalContext ? `
      <div class="sidebar-box" data-section="professionalContext">
        <div class="section-title" style="border:none;">PROFESSIONAL CONTEXT</div>
        <div style="font-size: 9pt; color: var(--secondary-color); display: flex; flex-direction: column; gap: 6px;">
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
      <div class="sidebar-box" data-section="availabilityWorkAuth">
        <div class="section-title" style="border:none;">AVAILABILITY</div>
        <div style="font-size: 9pt; color: var(--secondary-color); display: flex; flex-direction: column; gap: 6px;">
          ${nonEmptyAvailabilityWorkAuth.availabilityNoticePeriod ? `<div><strong>Notice Period:</strong> ${nonEmptyAvailabilityWorkAuth.availabilityNoticePeriod}</div>` : ''}
          ${nonEmptyAvailabilityWorkAuth.workAuthorizationStatus ? `<div><strong>Work Auth:</strong> ${nonEmptyAvailabilityWorkAuth.workAuthorizationStatus}</div>` : ''}
          ${nonEmptyAvailabilityWorkAuth.preferredLocation ? `<div><strong>Preferred Location:</strong> ${nonEmptyAvailabilityWorkAuth.preferredLocation}</div>` : ''}
        </div>
      </div>` : ''}

      <!-- Contact Information -->
      <div class="sidebar-box" style="background: none; padding-left: 0;" data-section="personal">
        ${data.personal?.phone ? `<div class="contact-item" data-section="personal">📞 ${data.personal.phone}</div>` : ''}
        ${data.personal?.alternatePhone ? `<div class="contact-item" data-section="personal">📱 ${data.personal.alternatePhone}</div>` : ''}
        ${(() => {
          const addressParts = [
            data.personal?.fullAddress,
            data.personal?.location,
            data.personal?.country,
            data.personal?.pinCode
          ].filter(Boolean);
          return addressParts.length > 0 ? `<div class="contact-item" data-section="personal">📍 ${addressParts.join(", ")}</div>` : '';
        })()}
        ${data.personal?.email ? `<div class="contact-item" data-section="personal">✉️ ${data.personal.email}</div>` : ''}
        ${data.personal?.linkedinUrl ? `<div class="contact-item" data-section="personal">🔗 <a href="${data.personal.linkedinUrl}" target="_blank">LinkedIn</a></div>` : ''}
        ${data.personal?.githubUrl ? `<div class="contact-item" data-section="personal">💻 <a href="${data.personal.githubUrl}" target="_blank">GitHub</a></div>` : ''}
        ${data.personal?.portfolioUrl ? `<div class="contact-item" data-section="personal">🌐 <a href="${data.personal.portfolioUrl}" target="_blank">Portfolio</a></div>` : ''}
        ${data.personal?.website ? `<div class="contact-item" data-section="personal">🌐 <a href="${data.personal.website}" target="_blank">Website</a></div>` : ''}
        ${data.personal?.twitterUrl ? `<div class="contact-item" data-section="personal">🐦 <a href="${data.personal.twitterUrl}" target="_blank">Twitter</a></div>` : ''}
        ${data.personal?.facebookUrl ? `<div class="contact-item" data-section="personal">📘 <a href="${data.personal.facebookUrl}" target="_blank">Facebook</a></div>` : ''}
        ${data.personal?.instagramUrl ? `<div class="contact-item" data-section="personal">📷 <a href="${data.personal.instagramUrl}" target="_blank">Instagram</a></div>` : ''}
        ${data.personal?.behanceUrl ? `<div class="contact-item" data-section="personal">🎨 <a href="${data.personal.behanceUrl}" target="_blank">Behance</a></div>` : ''}
        ${data.personal?.dribbbleUrl ? `<div class="contact-item" data-section="personal">🏀 <a href="${data.personal.dribbbleUrl}" target="_blank">Dribbble</a></div>` : ''}
        ${data.personal?.stackoverflowUrl ? `<div class="contact-item" data-section="personal">📚 <a href="${data.personal.stackoverflowUrl}" target="_blank">Stack Overflow</a></div>` : ''}
        ${data.personal?.mediumUrl ? `<div class="contact-item" data-section="personal">📝 <a href="${data.personal.mediumUrl}" target="_blank">Medium</a></div>` : ''}
      </div>

      <!-- Social Links -->
      ${nonEmptySocialLinks.length > 0 ? `
      <div class="sidebar-box" data-section="socialLinks">
        <div class="section-title" style="border:none;">SOCIAL LINKS</div>
        ${nonEmptySocialLinks.map((link: any, index: number) => `
          <div class="contact-item" data-section="socialLinks" data-index="${index}">🔗 <a href="${link.url}" target="_blank">${link.urlText || link.url.replace('https://', '').replace('http://', '')}</a></div>
        `).join('')}
      </div>` : ''}

      <!-- Social Profiles -->
      ${nonEmptySocialProfiles.length > 0 ? `
      <div class="sidebar-box" data-section="socialProfiles">
        <div class="section-title" style="border:none;">SOCIAL PROFILES</div>
        ${nonEmptySocialProfiles.map((profile: any, index: number) => `
          <div class="contact-item" data-section="socialProfiles" data-index="${index}">👤 <a href="${profile.url}" target="_blank">${profile.platform || "Profile"}</a></div>
        `).join('')}
      </div>` : ''}

      <!-- Education -->
      ${hasNonEmptyItems(data.education) ? `
      <div class="sidebar-box" data-section="education">
        <div class="section-title" style="border:none;">EDUCATION</div>
        ${getNonEmptyArray(data.education).map((edu: any, index: number) => `
          <div class="education-entry" data-section="education" data-index="${index}">
            <div class="education-degree" data-section="education" data-index="${index}">
              ${edu.degree || ''}${edu.field ? ` in ${edu.field}` : ''}${edu.qualification ? ` (${edu.qualification})` : ''}
            </div>
            
            ${edu.school ? `<div class="education-school" data-section="education" data-index="${index}">${edu.school}</div>` : ''}
            ${edu.location ? `<div class="education-location" data-section="education" data-index="${index}">${edu.location}</div>` : ''}
            <div class="education-date" data-section="education" data-index="${index}">${edu.graduationDate || ''}${edu.grade ? ` | Grade: ${edu.grade}` : ''}</div>
            
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

      <!-- Skills (in sidebar) -->
      ${nonEmptySkills.length > 0 ? `
      <div class="sidebar-box" data-section="skills">
        <div class="section-title" style="border:none;">SKILLS</div>
        ${nonEmptySkills.map((skill: any, index: number) => `
          <div class="skill-row" data-section="skills" data-index="${index}"><span>${typeof skill === 'string' ? skill.trim() : skill}</span><div class="skill-track"><div class="skill-fill" style="width: 70%;"></div></div></div>
        `).join('')}
      </div>` : ''}

      <!-- Tools & Technologies (in sidebar) -->
      ${nonEmptyToolsTechnologies.length > 0 ? `
      <div class="sidebar-box" data-section="toolsTechnologies">
        <div class="section-title" style="border:none;">TOOLS & TECH</div>
        ${nonEmptyToolsTechnologies.map((item: any, index: number) => `
          <div class="skill-row" data-section="toolsTechnologies" data-index="${index}">
            <span>${item.name || ''}${item.proficiency ? ` (${item.proficiency})` : ''}${item.experienceDuration ? ` - ${item.experienceDuration}` : ''}</span>
            <div class="skill-track"><div class="skill-fill" style="width: 70%;"></div></div>
          </div>
        `).join('')}
      </div>` : ''}

      <!-- Languages (in sidebar) -->
      ${nonEmptyLanguages.length > 0 ? `
      <div class="sidebar-box" data-section="languages">
        <div class="section-title" style="border:none;">LANGUAGES</div>
        ${nonEmptyLanguages.map((lang: any, index: number) => `
          <div class="skill-row" data-section="languages" data-index="${index}">
            <span>${lang.language || lang}${lang.level ? ` (${lang.level})` : ''}${lang.capability ? ` - ${lang.capability}` : ''}</span>
            <div class="skill-track"><div class="skill-fill" style="width: 70%;"></div></div>
          </div>
        `).join('')}
      </div>` : ''}

      <!-- Certifications (in sidebar if few) -->
      ${nonEmptyCertifications.length > 0 && nonEmptyCertifications.length <= 3 ? `
      <div class="sidebar-box" data-section="certifications">
        <div class="section-title" style="border:none;">CERTIFICATIONS</div>
        ${nonEmptyCertifications.map((cert: any, index: number) => `
          <div style="margin-bottom: 8px; font-size: 9pt;" data-section="certifications" data-index="${index}">
            <strong>${cert.name || ''}</strong><br/>
            ${cert.issuer ? `<span>${cert.issuer}</span>` : ''}
            ${cert.date ? `<span> | ${cert.date}</span>` : ''}
          </div>
        `).join('')}
      </div>` : ''}

      <!-- Expertise (Key Achievements with skill bars) -->
      ${hasExpertiseContent ? `
      <div class="sidebar-box" data-section="expertise">
        <div class="section-title" style="border:none;">EXPERTISE</div>
        ${nonEmptyKeyAchievements.slice(0, 4).map((item: any, index: number) => `
          <div class="skill-row" data-section="keyAchievements" data-index="${index}"><span>${item}</span><div class="skill-track"><div class="skill-fill"></div></div></div>
        `).join('')}
      </div>` : ''}

      <!-- References (in sidebar) -->
      ${nonEmptyReferences.length > 0 ? `
      <div class="sidebar-box" data-section="references">
        <div class="section-title" style="border:none;">REFERENCES</div>
        ${nonEmptyReferences.map((ref: any, index: number) => `
          <div style="margin-bottom: 10px; font-size: 9pt;" data-section="references" data-index="${index}">
            <strong>${ref.name || ''}</strong><br/>
            ${ref.designationRelationship ? `<span>${ref.designationRelationship}</span><br/>` : ''}
            ${ref.organization ? `<span>${ref.organization}</span><br/>` : ''}
            ${ref.contactInformation ? `<span>${ref.contactInformation}</span>` : ''}
          </div>
        `).join('')}
      </div>` : ''}
    </div>

    <div class="content-main">
      <!-- Summary -->
      ${data.summary && data.summary.trim() ? `
      <div class="section" data-section="summary">
        <div class="section-title">ABOUT ME</div>
        <p>${data.summary}</p>
      </div>` : ''}

      <!-- Career Objective -->
      ${data.careerObjective && data.careerObjective.trim() ? `
      <div class="section" data-section="careerObjective">
        <div class="section-title">CAREER OBJECTIVE</div>
        <p>${data.careerObjective}</p>
      </div>` : ''}

      <!-- Work Experience -->
      ${hasNonEmptyItems(data.experience) ? `
      <div class="section" data-section="experience">
        <div class="section-title">WORK EXPERIENCE</div>
        ${getNonEmptyArray(data.experience).map((exp: any, index: number) => {
          const dateRange = formatDateRange(exp.startDate, exp.endDate, exp.isCurrent);
          const subtitle = formatSubtitle([exp.company, exp.location, exp.domain]);
          
          return `
          <div class="exp-item" data-section="experience" data-index="${index}">
            <div class="exp-header">
              <span>${exp.company || ''}</span>
              <div class="line-spacer"></div>
              <span>${dateRange}</span>
            </div>
            <div class="role-title">${exp.title || ''}</div>
            <p>${exp.description || ''}</p>
            ${exp.achievements ? `<p><strong>Achievements:</strong> ${exp.achievements}</p>` : ''}
          </div>
        `}).join('')}
      </div>` : ''}

      <!-- Internships -->
      ${nonEmptyInternships.length > 0 ? `
      <div class="section" data-section="internships">
        <div class="section-title">INTERNSHIPS</div>
        ${nonEmptyInternships.map((item: any, index: number) => {
          const dateRange = item.duration || formatDateRange(item.startDate, item.endDate);
          const subtitle = formatSubtitle([item.company, item.location]);
          
          return `
          <div class="exp-item" data-section="internships" data-index="${index}">
            <div class="exp-header">
              <span>${item.title || ''}</span>
              <div class="line-spacer"></div>
              <span>${dateRange}</span>
            </div>
            <div class="role-title">${subtitle}</div>
            <p>${item.description || ''}</p>
          </div>
        `}).join('')}
      </div>` : ''}

      <!-- Training Programs -->
      ${nonEmptyTrainingPrograms.length > 0 ? `
      <div class="section" data-section="trainingPrograms">
        <div class="section-title">TRAINING PROGRAMS</div>
        ${nonEmptyTrainingPrograms.map((item: any, index: number) => `
          <div class="exp-item" data-section="trainingPrograms" data-index="${index}">
            <div class="exp-header">
              <span>${item.name || ''}</span>
              <div class="line-spacer"></div>
              <span>${item.completionDate || ''}</span>
            </div>
            <div class="role-title">${formatSubtitle([item.provider || item.organization, item.duration])}</div>
            <p>${item.description || ''}</p>
          </div>
        `).join('')}
      </div>` : ''}

      <!-- Skills (in main content) -->
      ${nonEmptySkills.length > 0 ? `
      <div class="section" data-section="skills">
        <div class="section-title">SKILLS</div>
        <ul class="skills-two-column">
          ${nonEmptySkills.map((skill: any, index: number) => `
            <li data-section="skills" data-index="${index}">• ${typeof skill === 'string' ? skill.trim() : skill}</li>
          `).join('')}
        </ul>
      </div>` : ''}

      <!-- Tools & Technologies (in main content) -->
      ${nonEmptyToolsTechnologies.length > 0 ? `
      <div class="section" data-section="toolsTechnologies">
        <div class="section-title">TOOLS & TECHNOLOGIES</div>
        <ul class="skills-two-column">
          ${nonEmptyToolsTechnologies.map((item: any, index: number) => `
            <li data-section="toolsTechnologies" data-index="${index}">• ${item.name || ''}${item.proficiency ? ` (${item.proficiency})` : ''}${item.experienceDuration ? ` - ${item.experienceDuration}` : ''}</li>
          `).join('')}
        </ul>
      </div>` : ''}

      <!-- Methodologies -->
      ${nonEmptyMethodologies.length > 0 ? `
      <div class="section" data-section="methodologies">
        <div class="section-title">METHODOLOGIES</div>
        <ul class="skills-two-column">
          ${nonEmptyMethodologies.map((item: any, index: number) => `
            <li data-section="methodologies" data-index="${index}">• ${item.name || ''}${item.certification ? ` (${item.certification})` : ''}${item.experienceDuration ? ` - ${item.experienceDuration} years` : ''}</li>
          `).join('')}
        </ul>
      </div>` : ''}

      <!-- Industry Expertise -->
      ${nonEmptyIndustryExpertise.length > 0 ? `
      <div class="section" data-section="industryExpertise">
        <div class="section-title">INDUSTRY EXPERTISE</div>
        <ul class="skills-two-column">
          ${nonEmptyIndustryExpertise.map((item: any, index: number) => `
            <li data-section="industryExpertise" data-index="${index}">• ${item.industry || ''}${item.domainArea ? ` - ${item.domainArea}` : ''}${item.experienceDuration ? ` (${item.experienceDuration} years)` : ''}</li>
          `).join('')}
        </ul>
      </div>` : ''}

      <!-- Projects -->
      ${nonEmptyProjects.length > 0 ? `
      <div class="section" data-section="projects">
        <div class="section-title">PROJECTS</div>
        ${nonEmptyProjects.map((project: any, index: number) => {
          const dateRange = formatDateRange(project.startDate, project.endDate);
          
          return `
          <div style="margin-bottom: 15px;" data-section="projects" data-index="${index}">
            <div style="font-weight: bold; font-size: 10pt;">${project.name || ''}${project.technologies ? ` | ${project.technologies}` : ''} ${dateRange ? `| ${dateRange}` : ''}</div>
            <p style="font-size: 9pt;">${project.description || ''}</p>
            ${project.url ? `<p style="font-size: 8pt;"><a href="${project.url}" target="_blank">${project.urlText || "View Project"}</a></p>` : ''}
          </div>
        `}).join('')}
      </div>` : ''}

      <!-- Academic Projects -->
      ${nonEmptyAcademicProjects.length > 0 ? `
      <div class="section" data-section="academicProjects">
        <div class="section-title">ACADEMIC PROJECTS</div>
        ${nonEmptyAcademicProjects.map((item: any, index: number) => `
          <div class="exp-item" data-section="academicProjects" data-index="${index}">
            <div class="exp-header">
              <span>${item.name || item.title || ''}</span>
              <div class="line-spacer"></div>
              <span>${item.duration || ''}</span>
            </div>
            <div class="role-title">${formatSubtitle([item.institution, item.course ? `Course: ${item.course}` : ''])}</div>
            <p>${item.description || ''}</p>
            ${item.technologies ? `<p style="font-size: 9pt;"><strong>Technologies:</strong> ${Array.isArray(item.technologies) ? item.technologies.join(', ') : item.technologies}</p>` : ''}
            ${item.url ? `<p style="font-size: 8pt;"><a href="${item.url}" target="_blank">View Project</a></p>` : ''}
          </div>
        `).join('')}
      </div>` : ''}

      <!-- Client Projects -->
      ${nonEmptyClientProjects.length > 0 ? `
      <div class="section" data-section="clientProjects">
        <div class="section-title">CLIENT PROJECTS</div>
        ${nonEmptyClientProjects.map((item: any, index: number) => `
          <div class="exp-item" data-section="clientProjects" data-index="${index}">
            <div class="exp-header">
              <span>${item.name || ''}</span>
              <div class="line-spacer"></div>
              <span>${item.duration || ''}</span>
            </div>
            <div class="role-title">${formatSubtitle([item.clientOrganization, item.role ? `Role: ${item.role}` : ''])}</div>
            <p>${item.description || ''}</p>
            ${item.toolsTechnologies ? `<p><strong>Tools:</strong> ${item.toolsTechnologies}</p>` : ''}
            ${item.projectUrl ? `<p style="font-size: 8pt;"><a href="${item.projectUrl}" target="_blank">View Project</a></p>` : ''}
          </div>
        `).join('')}
      </div>` : ''}

      <!-- Portfolio -->
      ${nonEmptyPortfolio.length > 0 ? `
      <div class="section" data-section="portfolio">
        <div class="section-title">PORTFOLIO</div>
        ${nonEmptyPortfolio.map((item: any, index: number) => `
          <div style="margin-bottom: 15px;" data-section="portfolio" data-index="${index}">
            <div style="font-weight: bold; font-size: 10pt;">${item.name || ''}${item.type ? ` | ${item.type}` : ''}${item.platform ? ` | on ${item.platform}` : ''}</div>
            <p style="font-size: 9pt;">${item.description || ''}</p>
            ${item.url ? `<p style="font-size: 8pt;"><a href="${item.url}" target="_blank">View Portfolio</a></p>` : ''}
          </div>
        `).join('')}
      </div>` : ''}

      <!-- Leadership Positions -->
      ${nonEmptyLeadershipPositions.length > 0 ? `
      <div class="section" data-section="leadershipPositions">
        <div class="section-title">LEADERSHIP & POSITIONS</div>
        ${nonEmptyLeadershipPositions.map((item: any, index: number) => {
          const dateRange = formatDateRange(item.startDate, item.endDate);
          
          return `
          <div class="exp-item" data-section="leadershipPositions" data-index="${index}">
            <div class="exp-header">
              <span>${item.position || item.title || ''}</span>
              <div class="line-spacer"></div>
              <span>${dateRange}</span>
            </div>
            <div class="role-title">${item.organization || ''}</div>
            <p>${item.description || ''}</p>
          </div>
        `}).join('')}
      </div>` : ''}

      <!-- Volunteering -->
      ${nonEmptyVolunteering.length > 0 ? `
      <div class="section" data-section="volunteering">
        <div class="section-title">VOLUNTEERING</div>
        ${nonEmptyVolunteering.map((item: any, index: number) => `
          <div class="exp-item" data-section="volunteering" data-index="${index}">
            <div class="exp-header">
              <span>${item.role || ''}</span>
              <div class="line-spacer"></div>
              <span>${item.duration || ''}</span>
            </div>
            <div class="role-title">${formatSubtitle([item.organization, item.causeArea])}</div>
            <p>${item.description || ''}</p>
          </div>
        `).join('')}
      </div>` : ''}

      <!-- Military Service -->
      ${nonEmptyMilitaryService.length > 0 ? `
      <div class="section" data-section="militaryService">
        <div class="section-title">MILITARY SERVICE</div>
        ${nonEmptyMilitaryService.map((item: any, index: number) => `
          <div class="exp-item" data-section="militaryService" data-index="${index}">
            <div class="exp-header">
              <span>${item.rank ? item.rank : ''}${item.rank && item.branch ? ' - ' : ''}${item.branch || ''}</span>
              <div class="line-spacer"></div>
              <span>${item.duration || ''}</span>
            </div>
            <div class="role-title">${item.specialization || ''}</div>
            <p>${item.description || ''}</p>
          </div>
        `).join('')}
      </div>` : ''}

      <!-- Teaching Experience -->
      ${nonEmptyTeachingExperience.length > 0 ? `
      <div class="section" data-section="teachingExperience">
        <div class="section-title">TEACHING EXPERIENCE</div>
        ${nonEmptyTeachingExperience.map((item: any, index: number) => `
          <div class="exp-item" data-section="teachingExperience" data-index="${index}">
            <div class="exp-header">
              <span>${item.subjectCourseTaught || item.title || ''}</span>
              <div class="line-spacer"></div>
              <span>${item.duration || ''}</span>
            </div>
            <div class="role-title">${item.institution || ''}</div>
            <p>${item.description || ''}</p>
          </div>
        `).join('')}
      </div>` : ''}

      <!-- Mentorship Experience -->
      ${nonEmptyMentorshipExperience.length > 0 ? `
      <div class="section" data-section="mentorshipExperience">
        <div class="section-title">MENTORSHIP EXPERIENCE</div>
        ${nonEmptyMentorshipExperience.map((item: any, index: number) => `
          <div class="exp-item" data-section="mentorshipExperience" data-index="${index}">
            <div class="exp-header">
              <span>${item.mentorshipArea || ''}</span>
              <div class="line-spacer"></div>
              <span>${item.duration || ''}</span>
            </div>
            <div class="role-title">${formatSubtitle([item.organizationPlatform, item.menteeLevel ? `Mentee Level: ${item.menteeLevel}` : ''])}</div>
            <p>${item.description || ''}</p>
          </div>
        `).join('')}
      </div>` : ''}

      <!-- Research Grants -->
      ${nonEmptyResearchGrants.length > 0 ? `
      <div class="section" data-section="researchGrants">
        <div class="section-title">RESEARCH GRANTS</div>
        ${nonEmptyResearchGrants.map((item: any, index: number) => `
          <div class="exp-item" data-section="researchGrants" data-index="${index}">
            <div class="exp-header">
              <span>${item.title || ''}</span>
              <div class="line-spacer"></div>
              <span>${item.year || ''}</span>
            </div>
            <div class="role-title">${formatSubtitle([item.agency, item.amount ? `Amount: ${item.amount}` : ''])}</div>
            <p>${item.description || ''}</p>
          </div>
        `).join('')}
      </div>` : ''}

      <!-- Publications -->
      ${nonEmptyPublications.length > 0 ? `
      <div class="section" data-section="publications">
        <div class="section-title">PUBLICATIONS</div>
        ${nonEmptyPublications.map((item: any, index: number) => `
          <div style="margin-bottom: 12px;" data-section="publications" data-index="${index}">
            <div style="font-weight: bold; font-size: 10pt;">${item.title || ''}</div>
            <div style="font-size: 9pt;">${formatSubtitle([item.journalPublisher, item.publicationType, item.year])}</div>
            ${item.authors ? `<div style="font-size: 8pt;"><strong>Authors:</strong> ${item.authors}</div>` : ''}
            ${item.urlDoi ? `<div style="font-size: 8pt;"><a href="${item.urlDoi}" target="_blank">${item.urlDoi}</a></div>` : ''}
          </div>
        `).join('')}
      </div>` : ''}

      <!-- Patents -->
      ${nonEmptyPatents.length > 0 ? `
      <div class="section" data-section="patents">
        <div class="section-title">PATENTS</div>
        ${nonEmptyPatents.map((item: any, index: number) => `
          <div style="margin-bottom: 12px;" data-section="patents" data-index="${index}">
            <div style="font-weight: bold; font-size: 10pt;">${item.title || ''}</div>
            <div style="font-size: 9pt;">${formatSubtitle([item.patentNumber ? `Patent #: ${item.patentNumber}` : '', item.issuingAuthority, item.year])}</div>
            ${item.status ? `<div style="font-size: 8pt;"><strong>Status:</strong> ${item.status}</div>` : ''}
          </div>
        `).join('')}
      </div>` : ''}

      <!-- Test Scores -->
      ${nonEmptyTestScores.length > 0 ? `
      <div class="section" data-section="testScores">
        <div class="section-title">TEST SCORES</div>
        ${nonEmptyTestScores.map((item: any, index: number) => `
          <div style="margin-bottom: 8px;" data-section="testScores" data-index="${index}">
            <div style="font-weight: bold; font-size: 9pt;">${item.testName || ''}</div>
            <div style="font-size: 8pt;">Score: ${item.score || ''}${item.percentileRank ? ` (${item.percentileRank} percentile)` : ''} ${item.year ? `| ${item.year}` : ''}</div>
          </div>
        `).join('')}
      </div>` : ''}

      <!-- Scholarships -->
      ${nonEmptyScholarships.length > 0 ? `
      <div class="section" data-section="scholarships">
        <div class="section-title">SCHOLARSHIPS</div>
        ${nonEmptyScholarships.map((item: any, index: number) => `
          <div class="exp-item" data-section="scholarships" data-index="${index}">
            <div class="exp-header">
              <span>${item.name || ''}</span>
              <div class="line-spacer"></div>
              <span>${item.year || ''}</span>
            </div>
            <div class="role-title">${formatSubtitle([item.provider || item.organization, item.amount])}</div>
            <p>${item.description || ''}</p>
          </div>
        `).join('')}
      </div>` : ''}

      <!-- Awards -->
      ${nonEmptyAwards.length > 0 ? `
      <div class="section" data-section="awards">
        <div class="section-title">AWARDS</div>
        ${nonEmptyAwards.map((award: any, index: number) => `
          <div class="exp-item" data-section="awards" data-index="${index}">
            <div class="exp-header">
              <span>${award.title || ''}</span>
              <div class="line-spacer"></div>
              <span>${award.issueYear || award.year || ''}</span>
            </div>
            <div class="role-title">${award.organization || ''}</div>
            ${award.description ? `<p>${award.description}</p>` : ''}
          </div>
        `).join('')}
      </div>` : ''}

      <!-- Co-curricular Activities -->
      ${nonEmptyCoCurricular.length > 0 ? `
      <div class="section" data-section="coCurricular">
        <div class="section-title">CO-CURRICULAR ACTIVITIES</div>
        ${nonEmptyCoCurricular.map((item: any, index: number) => `
          <div class="exp-item" data-section="coCurricular" data-index="${index}">
            <div class="exp-header">
              <span>${item.activity || ''}</span>
              <div class="line-spacer"></div>
              <span>${item.year || formatDateRange(item.startDate, item.endDate) || ''}</span>
            </div>
            <div class="role-title">${formatSubtitle([item.organization, item.role ? `Role: ${item.role}` : ''])}</div>
            <p>${item.description || ''}</p>
          </div>
        `).join('')}
      </div>` : ''}

      <!-- Extracurricular Activities -->
      ${nonEmptyExtracurricular.length > 0 ? `
      <div class="section" data-section="extracurricular">
        <div class="section-title">EXTRACURRICULAR ACTIVITIES</div>
        ${nonEmptyExtracurricular.map((item: any, index: number) => `
          <div class="exp-item" data-section="extracurricular" data-index="${index}">
            <div class="exp-header">
              <span>${item.activity || ''}</span>
              <div class="line-spacer"></div>
              <span>${item.year || formatDateRange(item.startDate, item.endDate) || ''}</span>
            </div>
            <div class="role-title">${formatSubtitle([item.organization, item.role ? `Role: ${item.role}` : ''])}</div>
            <p>${item.description || ''}</p>
          </div>
        `).join('')}
      </div>` : ''}

      <!-- Certifications (in main content if many) -->
      ${nonEmptyCertifications.length > 3 ? `
      <div class="section" data-section="certifications">
        <div class="section-title">CERTIFICATIONS</div>
        ${nonEmptyCertifications.map((cert: any, index: number) => `
          <div style="margin-bottom: 10px;" data-section="certifications" data-index="${index}">
            <div style="font-weight: bold; font-size: 9pt;">${cert.name || ''}</div>
            <div style="font-size: 8pt;">${cert.issuer || ''} ${cert.date ? `| ${cert.date}` : ''}</div>
            ${cert.description ? `<div style="font-size: 8pt;">${cert.description}</div>` : ''}
            ${cert.url ? `<p style="font-size: 8pt;"><a href="${cert.url}" target="_blank">View Certificate</a></p>` : ''}
          </div>
        `).join('')}
      </div>` : ''}

      <!-- Languages (in main content if many) -->
      ${nonEmptyLanguages.length > 5 ? `
      <div class="section" data-section="languages">
        <div class="section-title">LANGUAGES</div>
        <p style="font-size: 9pt;">${nonEmptyLanguages.map((lang: any) => `${lang.language || lang}${lang.level ? ` (${lang.level})` : ''}${lang.capability ? ` - ${lang.capability}` : ''}`).join(", ")}</p>
      </div>` : ''}

      <!-- Hobbies -->
      ${nonEmptyHobbies.length > 0 ? `
      <div class="section" data-section="hobbies">
        <div class="section-title">HOBBIES & INTERESTS</div>
        <p style="font-size: 9pt;">${nonEmptyHobbies.join(", ")}</p>
      </div>` : ''}

      <!-- Key Achievements -->
      ${nonEmptyKeyAchievements.length > 0 ? `
      <div class="section" data-section="keyAchievements">
        <div class="section-title">KEY ACHIEVEMENTS</div>
        <ul>
          ${nonEmptyKeyAchievements.map((achievement: string, index: number) =>
            `<li style="font-size: 9pt;" data-section="keyAchievements" data-index="${index}">${achievement}</li>`
          ).join('')}
        </ul>
      </div>` : ''}

      <!-- Key Responsibilities -->
      ${nonEmptyResponsibilities.length > 0 ? `
      <div class="section" data-section="responsibilities">
        <div class="section-title">KEY RESPONSIBILITIES</div>
        <ul>
          ${nonEmptyResponsibilities.map((line: string, index: number) =>
            `<li style="font-size: 9pt;" data-section="responsibilities" data-index="${index}">${line.trim()}</li>`
          ).join('')}
        </ul>
      </div>` : ''}

      <!-- Tools -->
      ${nonEmptyTools.length > 0 ? `
      <div class="section" data-section="tools">
        <div class="section-title">TOOLS & TECHNOLOGIES</div>
        <p style="font-size: 9pt;">${nonEmptyTools.join(", ")}</p>
      </div>` : ''}

      <!-- Speaking Engagements -->
      ${nonEmptySpeakingEngagements.length > 0 ? `
      <div class="section" data-section="speakingEngagements">
        <div class="section-title">SPEAKING ENGAGEMENTS</div>
        ${nonEmptySpeakingEngagements.map((item: any, index: number) => `
          <div class="exp-item" data-section="speakingEngagements" data-index="${index}">
            <div class="exp-header">
              <span>${item.topic || ''}</span>
              <div class="line-spacer"></div>
              <span>${item.date || ''}</span>
            </div>
            <div class="role-title">${item.eventName || ''}</div>
            <p>${item.description || ''}</p>
          </div>
        `).join('')}
      </div>` : ''}

      <!-- Memberships -->
      ${nonEmptyMemberships.length > 0 ? `
      <div class="section" data-section="memberships">
        <div class="section-title">MEMBERSHIPS</div>
        ${nonEmptyMemberships.map((item: any, index: number) => `
          <div class="exp-item" data-section="memberships" data-index="${index}">
            <div class="exp-header">
              <span>${item.membershipName || ''}</span>
              <div class="line-spacer"></div>
              <span>${item.year || ''}</span>
            </div>
            <div class="role-title">${item.organizationName || ''}</div>
            <p>${item.description || ''}</p>
          </div>
        `).join('')}
      </div>` : ''}

      <!-- Workshops -->
      ${nonEmptyWorkshops.length > 0 ? `
      <div class="section" data-section="workshops">
        <div class="section-title">WORKSHOPS</div>
        ${nonEmptyWorkshops.map((item: any, index: number) => `
          <div class="exp-item" data-section="workshops" data-index="${index}">
            <div class="exp-header">
              <span>${item.programTitle || ''}</span>
              <div class="line-spacer"></div>
              <span>${item.year || ''}</span>
            </div>
            <div class="role-title">${item.conductedBy || ''}</div>
            <p>${item.description || ''}</p>
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
          <div style="margin-bottom: 10px;" data-section="custom-${sectionIndex}" data-index="${entryIndex}">
            <div style="font-weight: bold; font-size: 10pt;">${entry.title || ''}${entry.organization ? ` | ${entry.organization}` : ''}${entry.date ? ` | ${entry.date}` : ''}</div>
            ${entry.description ? `<p style="font-size: 9pt;">${entry.description}</p>` : ''}
          </div>
        `).join('') : '<div style="color: #666; font-style: italic; font-size: 9pt;">No entries in this section</div>'}
      </div>
      `).join('') : ''}
    </div>
  </div>
</body>
</html>`;
}