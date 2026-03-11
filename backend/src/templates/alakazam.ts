export function buildAlakazamTemplate(data: any, theme?: any): string {
  const defaultTheme = {
    primary: '#004369', // Dark Blue from image
    secondary: '#ffffff',
    background: '#ffffff',
    headingFont: 'Arial, sans-serif',
    bodyFont: 'Arial, sans-serif'
  };
  const currentTheme = theme || defaultTheme;
  
  const userFontSize = data.formatting?.bodyFontSize || data.fontSize || 12;
  const userFontFamily = data.formatting?.fontFamily || data.fontFamily || 'Arial, sans-serif';

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
  <title>Resume</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: ${userFontFamily};
      background-color: #f0f0f0;
      display: flex;
      justify-content: center;
      padding: 20px;
    }

    .resume-container {
      width: 210mm; /* A4 Width */
      min-height: 297mm;
      background: white;
      display: flex;
      box-shadow: 0 0 10px rgba(0,0,0,0.1);
    }

    /* LEFT SIDEBAR */
    .sidebar {
      width: 35%;
      background-color: ${currentTheme.primary};
      color: white;
      padding: 30px 20px;
      display: flex;
      flex-direction: column;
    }

    .photo-container {
      width: 100%;
      aspect-ratio: 1/1;
      background: #eee;
      margin-bottom: 20px;
      overflow: hidden;
    }

    .photo-container img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .name-heading {
       font-size: ${userFontSize + 20}px;
       font-weight: bold;
       line-height: 1.1;
       margin-bottom: 5px;
       word-wrap: break-word;
     }

     .job-title {
       font-size: ${userFontSize + 4}px;
       color: rgba(255,255,255,0.7);
       margin-bottom: 30px;
     }

     .sidebar-section { margin-bottom: 25px; }

     .sidebar-title {
       font-size: ${userFontSize + 6}px;
       font-weight: bold;
       text-transform: uppercase;
       border-bottom: 1px solid rgba(255,255,255,0.3);
       padding-bottom: 5px;
       margin-bottom: 15px;
     }

    .contact-item {
      margin-bottom: 15px;
      font-size: ${userFontSize}px;
    }

    .contact-label {
      font-weight: bold;
      display: block;
      margin-bottom: 2px;
    }

    .contact-item a {
      color: white;
      text-decoration: underline;
      word-break: break-all;
    }

    .skill-list {
      list-style: none;
      padding-left: 0;
    }

    .skill-list li {
      margin-bottom: 8px;
      font-size: ${userFontSize}px;
      display: flex;
      align-items: flex-start;
    }

    .skill-list li::before {
      content: "•";
      margin-right: 8px;
    }

    /* RIGHT MAIN CONTENT */
    .main-content {
      width: 65%;
      padding: 40px 30px;
      color: #333;
    }

    .main-section { margin-bottom: 30px; }

    .main-section-title {
      font-size: ${userFontSize + 8}px;
      font-weight: bold;
      color: ${currentTheme.primary};
      border-bottom: 2px solid #eee;
      padding-bottom: 5px;
      margin-bottom: 15px;
    }

    .entry {
      display: flex;
      margin-bottom: 20px;
      gap: 20px;
    }

    .entry-date {
      width: 100px;
      font-size: ${userFontSize - 1}px;
      color: #666;
      flex-shrink: 0;
    }

    .entry-details { flex: 1; }

    .entry-header {
      font-weight: bold;
      font-size: ${userFontSize + 2}px;
      margin-bottom: 4px;
    }

    .entry-sub {
      font-size: ${userFontSize}px;
      color: #555;
      margin-bottom: 8px;
    }

    .entry-desc {
      font-size: ${userFontSize}px;
      line-height: 1.5;
    }

    .entry-desc ul {
      margin-top: 5px;
      padding-left: 18px;
    }

    .entry-desc li { margin-bottom: 4px; }

    /* Metrics Grid for Professional Context */
    .metrics-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 12px;
      margin: 15px 0;
    }

    .metric-item {
      background: #f5f5f5;
      padding: 10px;
      border-left: 3px solid ${currentTheme.primary};
    }

    .metric-value {
      font-weight: bold;
      font-size: ${userFontSize + 4}px;
      color: ${currentTheme.primary};
    }

    .metric-label {
      font-size: ${userFontSize - 2}px;
      color: #666;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .tags-container {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-top: 10px;
    }

    .tag {
      background: #f0f0f0;
      padding: 4px 10px;
      border-radius: 4px;
      font-size: ${userFontSize - 1}px;
    }

    .tag a {
      color: #333;
      text-decoration: none;
    }

    @media print {
      body { padding: 0; background: white; }
      .resume-container { box-shadow: none; width: 100%; height: 100%; }
      .sidebar { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    }
  </style>
</head>
<body>
  <div class="resume-container">
    <div class="sidebar">
      <div class="photo-container" data-section="personal">
        ${data.personal?.image ? `<img src="${data.personal.image}" alt="Profile">` : `<div style="display:flex; align-items:center; justify-content:center; height:100%; color:#ccc;">Photo</div>`}
      </div>
      
      <h1 class="name-heading">${data.personal?.name || 'Your Name'}${data.personal?.middleName ? ` ${data.personal.middleName}` : ''}</h1>
      <p class="job-title">${data.personal?.role || ''}</p>

      <div class="sidebar-section" data-section="personal">
        <h2 class="sidebar-title">Contact</h2>
        ${(() => {
          const addressParts = [
            data.personal?.fullAddress,
            data.personal?.location,
            data.personal?.country,
            data.personal?.pinCode
          ].filter(Boolean);
          return addressParts.length > 0 ? `
        <div class="contact-item">
          <span class="contact-label">Address</span>
          ${addressParts.join(', ')}
        </div>` : '';
        })()}
        ${data.personal?.phone ? `
        <div class="contact-item">
          <span class="contact-label">Phone</span>
          ${data.personal.phone}
        </div>` : ''}
        ${data.personal?.email ? `
        <div class="contact-item">
          <span class="contact-label">E-mail</span>
          ${data.personal.email}
        </div>` : ''}
        ${data.personal?.alternatePhone ? `
        <div class="contact-item">
          <span class="contact-label">Alternate Phone</span>
          ${data.personal.alternatePhone}
        </div>` : ''}
        ${data.personal?.fathersName ? `
        <div class="contact-item">
          <span class="contact-label">Father's Name</span>
          ${data.personal.fathersName}
        </div>` : ''}
        ${data.personal?.dob ? `
        <div class="contact-item">
          <span class="contact-label">Date of Birth</span>
          ${data.personal.dob}
        </div>` : ''}
        ${data.personal?.gender ? `
        <div class="contact-item">
          <span class="contact-label">Gender</span>
          ${data.personal.gender}
        </div>` : ''}
        ${data.personal?.maritalStatus ? `
        <div class="contact-item">
          <span class="contact-label">Marital Status</span>
          ${data.personal.maritalStatus}
        </div>` : ''}
        ${data.personal?.nationality ? `
        <div class="contact-item">
          <span class="contact-label">Nationality</span>
          ${data.personal.nationality}
        </div>` : ''}
        ${data.personal?.passportNo ? `
        <div class="contact-item">
          <span class="contact-label">Passport No</span>
          ${data.personal.passportNo}
        </div>` : ''}
        ${data.personal?.linkedinUrl ? `
        <div class="contact-item">
          <span class="contact-label">LinkedIn</span>
          <a href="${data.personal.linkedinUrl}" target="_blank">${data.personal.linkedinUrl.replace('https://', '').replace('http://', '')}</a>
        </div>` : ''}
        ${data.personal?.githubUrl ? `
        <div class="contact-item">
          <span class="contact-label">GitHub</span>
          <a href="${data.personal.githubUrl}" target="_blank">${data.personal.githubUrl.replace('https://', '').replace('http://', '')}</a>
        </div>` : ''}
        ${data.personal?.portfolioUrl ? `
        <div class="contact-item">
          <span class="contact-label">Portfolio</span>
          <a href="${data.personal.portfolioUrl}" target="_blank">${data.personal.portfolioUrl.replace('https://', '').replace('http://', '')}</a>
        </div>` : ''}
        ${data.personal?.website ? `
        <div class="contact-item">
          <span class="contact-label">Website</span>
          <a href="${data.personal.website}" target="_blank">${data.personal.website.replace('https://', '').replace('http://', '')}</a>
        </div>` : ''}
        ${data.personal?.twitterUrl ? `
        <div class="contact-item">
          <span class="contact-label">Twitter</span>
          <a href="${data.personal.twitterUrl}" target="_blank">Twitter</a>
        </div>` : ''}
        ${data.personal?.facebookUrl ? `
        <div class="contact-item">
          <span class="contact-label">Facebook</span>
          <a href="${data.personal.facebookUrl}" target="_blank">Facebook</a>
        </div>` : ''}
        ${data.personal?.instagramUrl ? `
        <div class="contact-item">
          <span class="contact-label">Instagram</span>
          <a href="${data.personal.instagramUrl}" target="_blank">Instagram</a>
        </div>` : ''}
        ${data.personal?.behanceUrl ? `
        <div class="contact-item">
          <span class="contact-label">Behance</span>
          <a href="${data.personal.behanceUrl}" target="_blank">Behance</a>
        </div>` : ''}
        ${data.personal?.dribbbleUrl ? `
        <div class="contact-item">
          <span class="contact-label">Dribbble</span>
          <a href="${data.personal.dribbbleUrl}" target="_blank">Dribbble</a>
        </div>` : ''}
        ${data.personal?.stackoverflowUrl ? `
        <div class="contact-item">
          <span class="contact-label">Stack Overflow</span>
          <a href="${data.personal.stackoverflowUrl}" target="_blank">Stack Overflow</a>
        </div>` : ''}
        ${data.personal?.mediumUrl ? `
        <div class="contact-item">
          <span class="contact-label">Medium</span>
          <a href="${data.personal.mediumUrl}" target="_blank">Medium</a>
        </div>` : ''}
      </div>

      <!-- Professional Context in Sidebar -->
      ${nonEmptyProfessionalContext ? `
      <div class="sidebar-section" data-section="professionalContext">
        <h2 class="sidebar-title">Professional Context</h2>
        ${nonEmptyProfessionalContext.totalExperience ? `
        <div class="contact-item">
          <span class="contact-label">Total Experience</span>
          ${nonEmptyProfessionalContext.totalExperience}
        </div>` : ''}
        ${nonEmptyProfessionalContext.teamSize ? `
        <div class="contact-item">
          <span class="contact-label">Team Size</span>
          ${nonEmptyProfessionalContext.teamSize}
        </div>` : ''}
        ${nonEmptyProfessionalContext.industry ? `
        <div class="contact-item">
          <span class="contact-label">Industry</span>
          ${nonEmptyProfessionalContext.industry}
        </div>` : ''}
        ${nonEmptyProfessionalContext.functionalDomain ? `
        <div class="contact-item">
          <span class="contact-label">Domain</span>
          ${nonEmptyProfessionalContext.functionalDomain}
        </div>` : ''}
        ${nonEmptyProfessionalContext.geographicScope ? `
        <div class="contact-item">
          <span class="contact-label">Geographic Scope</span>
          ${nonEmptyProfessionalContext.geographicScope}
        </div>` : ''}
        ${nonEmptyProfessionalContext.revenueResponsibility ? `
        <div class="contact-item">
          <span class="contact-label">Revenue Responsibility</span>
          ${nonEmptyProfessionalContext.revenueResponsibility}
        </div>` : ''}
      </div>` : ''}

      <!-- Availability & Work Auth -->
      ${nonEmptyAvailabilityWorkAuth ? `
      <div class="sidebar-section" data-section="availabilityWorkAuth">
        <h2 class="sidebar-title">Availability</h2>
        ${nonEmptyAvailabilityWorkAuth.availabilityNoticePeriod ? `
        <div class="contact-item">
          <span class="contact-label">Notice Period</span>
          ${nonEmptyAvailabilityWorkAuth.availabilityNoticePeriod}
        </div>` : ''}
        ${nonEmptyAvailabilityWorkAuth.workAuthorizationStatus ? `
        <div class="contact-item">
          <span class="contact-label">Work Auth</span>
          ${nonEmptyAvailabilityWorkAuth.workAuthorizationStatus}
        </div>` : ''}
        ${nonEmptyAvailabilityWorkAuth.preferredLocation ? `
        <div class="contact-item">
          <span class="contact-label">Preferred Location</span>
          ${nonEmptyAvailabilityWorkAuth.preferredLocation}
        </div>` : ''}
      </div>` : ''}

      <!-- Skills -->
      ${nonEmptySkills.length > 0 ? `
      <div class="sidebar-section" data-section="skills">
        <h2 class="sidebar-title">Skills</h2>
        <ul class="skill-list">
          ${nonEmptySkills.map((s: any, index: number) => `<li data-section="skills" data-index="${index}">${typeof s === 'string' ? s.trim() : s}</li>`).join('')}
        </ul>
      </div>` : ''}

      <!-- Tools & Technologies -->
      ${nonEmptyToolsTechnologies.length > 0 ? `
      <div class="sidebar-section" data-section="toolsTechnologies">
        <h2 class="sidebar-title">Tools & Technologies</h2>
        <ul class="skill-list">
          ${nonEmptyToolsTechnologies.map((item: any, index: number) => `
            <li data-section="toolsTechnologies" data-index="${index}">
              ${item.name || ''}${item.proficiency ? ` (${item.proficiency})` : ''}${item.experienceDuration ? ` - ${item.experienceDuration}` : ''}
            </li>
          `).join('')}
        </ul>
      </div>` : ''}

      <!-- Methodologies -->
      ${nonEmptyMethodologies.length > 0 ? `
      <div class="sidebar-section" data-section="methodologies">
        <h2 class="sidebar-title">Methodologies</h2>
        <ul class="skill-list">
          ${nonEmptyMethodologies.map((item: any, index: number) => `
            <li data-section="methodologies" data-index="${index}">
              ${item.name || ''}${item.certification ? ` (${item.certification})` : ''}${item.experienceDuration ? ` - ${item.experienceDuration} years` : ''}
            </li>
          `).join('')}
        </ul>
      </div>` : ''}

      <!-- Industry Expertise -->
      ${nonEmptyIndustryExpertise.length > 0 ? `
      <div class="sidebar-section" data-section="industryExpertise">
        <h2 class="sidebar-title">Industry Expertise</h2>
        <ul class="skill-list">
          ${nonEmptyIndustryExpertise.map((item: any, index: number) => `
            <li data-section="industryExpertise" data-index="${index}">
              ${item.industry || ''}${item.domainArea ? ` - ${item.domainArea}` : ''}${item.experienceDuration ? ` (${item.experienceDuration} years)` : ''}
            </li>
          `).join('')}
        </ul>
      </div>` : ''}

      <!-- Languages -->
      ${nonEmptyLanguages.length > 0 ? `
      <div class="sidebar-section" data-section="languages">
        <h2 class="sidebar-title">Languages</h2>
        <ul class="skill-list">
          ${nonEmptyLanguages.map((lang: any, index: number) => `<li data-section="languages" data-index="${index}">${lang.language || lang}${lang.level ? ` (${lang.level})` : ''}${lang.capability ? ` - ${lang.capability}` : ''}</li>`).join('')}
        </ul>
      </div>` : ''}

      <!-- Hobbies -->
      ${nonEmptyHobbies.length > 0 ? `
      <div class="sidebar-section" data-section="hobbies">
        <h2 class="sidebar-title">Hobbies & Interests</h2>
        <ul class="skill-list">
          ${nonEmptyHobbies.map((hobby: string, index: number) => `<li data-section="hobbies" data-index="${index}">${hobby}</li>`).join('')}
        </ul>
      </div>` : ''}

      <!-- Social Links -->
      ${nonEmptySocialLinks.length > 0 ? `
      <div class="sidebar-section" data-section="socialLinks">
        <h2 class="sidebar-title">Social Links</h2>
        ${nonEmptySocialLinks.map((link: any, index: number) => `
          <div class="contact-item" data-section="socialLinks" data-index="${index}">
            <span class="contact-label">${link.platform || link.urlText || 'Link'}</span>
            <a href="${link.url}" target="_blank">${link.url}</a>
          </div>
        `).join('')}
      </div>` : ''}

      <!-- Social Profiles -->
      ${nonEmptySocialProfiles.length > 0 ? `
      <div class="sidebar-section" data-section="socialProfiles">
        <h2 class="sidebar-title">Social Profiles</h2>
        ${nonEmptySocialProfiles.map((profile: any, index: number) => `
          <div class="contact-item" data-section="socialProfiles" data-index="${index}">
            <span class="contact-label">${profile.platform || 'Profile'}</span>
            <a href="${profile.url}" target="_blank">${profile.url}</a>
          </div>
        `).join('')}
      </div>` : ''}

      <!-- References -->
      ${nonEmptyReferences.length > 0 ? `
      <div class="sidebar-section" data-section="references">
        <h2 class="sidebar-title">References</h2>
        ${nonEmptyReferences.map((ref: any, index: number) => `
          <div class="contact-item" data-section="references" data-index="${index}">
            <span class="contact-label">${ref.name || ''}</span>
            ${ref.designationRelationship ? `<div>${ref.designationRelationship}</div>` : ''}
            ${ref.organization ? `<div>${ref.organization}</div>` : ''}
            ${ref.contactInformation ? `<div>${ref.contactInformation}</div>` : ''}
          </div>
        `).join('')}
      </div>` : ''}
    </div>

    <div class="main-content">

      <!-- Summary -->
      ${data.summary && data.summary.trim() ? `
      <div class="main-section" data-section="summary">
        <h2 class="main-section-title">Professional Summary</h2>
        <p style="font-size: ${userFontSize}px; line-height: 1.5;">${data.summary}</p>
      </div>` : ''}

      <!-- Career Objective -->
      ${data.careerObjective && data.careerObjective.trim() ? `
      <div class="main-section" data-section="careerObjective">
        <h2 class="main-section-title">Career Objective</h2>
        <p style="font-size: ${userFontSize}px; line-height: 1.5;">${data.careerObjective}</p>
      </div>` : ''}

      <!-- Internships -->
      ${nonEmptyInternships.length > 0 ? `
      <div class="main-section" data-section="internships">
        <h2 class="main-section-title">Internships</h2>
        ${nonEmptyInternships.map((item: any, index: number) => {
          const dateRange = item.duration || formatDateRange(item.startDate, item.endDate);
          const subtitle = formatSubtitle([item.company, item.location]);
          
          return `
          <div class="entry" data-section="internships" data-index="${index}">
            <div class="entry-date">${dateRange.replace(' – ', ' -<br>')}</div>
            <div class="entry-details">
              <div class="entry-header">${item.title || ''}</div>
              ${subtitle ? `<div class="entry-sub">${subtitle}</div>` : ''}
              ${item.description ? `<div class="entry-desc">${item.description}</div>` : ''}
            </div>
          </div>
        `}).join('')}
      </div>` : ''}

      <!-- Education -->
      ${hasNonEmptyItems(data.education) ? `
      <div class="main-section" data-section="education">
        <h2 class="main-section-title">Education</h2>
        ${getNonEmptyArray(data.education).map((edu: any, index: number) => `
          <div class="entry" data-section="education" data-index="${index}">
            <div class="entry-date">${edu.graduationDate || ''}</div>
            <div class="entry-details">
              <div class="entry-header">${edu.degree || ''}${edu.field ? ` in ${edu.field}` : ''}${edu.qualification ? ` (${edu.qualification})` : ''}</div>
              <div class="entry-sub">${formatSubtitle([edu.school, edu.location])}</div>
              ${edu.grade ? `<div class="entry-sub">Grade: ${edu.grade}</div>` : ''}
              ${edu.description ? `<div class="entry-desc">${edu.description}</div>` : ''}
            </div>
          </div>
        `).join('')}
      </div>` : ''}

      <!-- Work Experience -->
      ${hasNonEmptyItems(data.experience) ? `
      <div class="main-section" data-section="experience">
        <h2 class="main-section-title">Work History</h2>
        ${getNonEmptyArray(data.experience).map((exp: any, index: number) => {
          const dateRange = formatDateRange(exp.startDate, exp.endDate, exp.isCurrent);
          const subtitle = formatSubtitle([exp.company, exp.location]);
          
          return `
          <div class="entry" data-section="experience" data-index="${index}">
            <div class="entry-date">${dateRange.replace(' – ', ' -<br>')}</div>
            <div class="entry-details">
              <div class="entry-header">${exp.title || ''}</div>
              ${subtitle ? `<div class="entry-sub">${subtitle}</div>` : ''}
              ${exp.description ? `<div class="entry-desc">${exp.description}</div>` : ''}
              ${exp.achievements ? `<div class="entry-desc"><strong>Achievements:</strong> ${exp.achievements}</div>` : ''}
            </div>
          </div>
        `}).join('')}
      </div>` : ''}

      <!-- Training Programs -->
      ${nonEmptyTrainingPrograms.length > 0 ? `
      <div class="main-section" data-section="trainingPrograms">
        <h2 class="main-section-title">Training Programs</h2>
        ${nonEmptyTrainingPrograms.map((item: any, index: number) => `
          <div class="entry" data-section="trainingPrograms" data-index="${index}">
            <div class="entry-date">${item.completionDate || ''}</div>
            <div class="entry-details">
              <div class="entry-header">${item.name || ''}</div>
              <div class="entry-sub">${formatSubtitle([item.provider || item.organization, item.duration])}</div>
              ${item.description ? `<div class="entry-desc">${item.description}</div>` : ''}
            </div>
          </div>
        `).join('')}
      </div>` : ''}

      <!-- Academic Projects -->
      ${nonEmptyAcademicProjects.length > 0 ? `
      <div class="main-section" data-section="academicProjects">
        <h2 class="main-section-title">Academic Projects</h2>
        ${nonEmptyAcademicProjects.map((item: any, index: number) => `
          <div class="entry" data-section="academicProjects" data-index="${index}">
            <div class="entry-date">${item.duration || ''}</div>
            <div class="entry-details">
              <div class="entry-header">${item.name || item.title || ''}</div>
              <div class="entry-sub">${formatSubtitle([item.institution, item.course ? `Course: ${item.course}` : ''])}</div>
              <div class="entry-desc">${item.description || ''}</div>
              ${item.technologies ? `<div class="entry-desc"><strong>Technologies:</strong> ${Array.isArray(item.technologies) ? item.technologies.join(', ') : item.technologies}</div>` : ''}
              ${item.url ? `<div class="entry-desc"><a href="${item.url}" target="_blank" style="color: ${currentTheme.primary};">View Project</a></div>` : ''}
            </div>
          </div>
        `).join('')}
      </div>` : ''}

      <!-- Client Projects -->
      ${nonEmptyClientProjects.length > 0 ? `
      <div class="main-section" data-section="clientProjects">
        <h2 class="main-section-title">Client Projects</h2>
        ${nonEmptyClientProjects.map((item: any, index: number) => `
          <div class="entry" data-section="clientProjects" data-index="${index}">
            <div class="entry-date">${item.duration || ''}</div>
            <div class="entry-details">
              <div class="entry-header">${item.name || ''}</div>
              <div class="entry-sub">${formatSubtitle([item.clientOrganization, item.role ? `Role: ${item.role}` : ''])}</div>
              <div class="entry-desc">${item.description || ''}</div>
              ${item.toolsTechnologies ? `<div class="entry-desc"><strong>Tools:</strong> ${item.toolsTechnologies}</div>` : ''}
              ${item.projectUrl ? `<div class="entry-desc"><a href="${item.projectUrl}" target="_blank" style="color: ${currentTheme.primary};">View Project</a></div>` : ''}
            </div>
          </div>
        `).join('')}
      </div>` : ''}

      <!-- Portfolio -->
      ${nonEmptyPortfolio.length > 0 ? `
      <div class="main-section" data-section="portfolio">
        <h2 class="main-section-title">Portfolio</h2>
        ${nonEmptyPortfolio.map((item: any, index: number) => `
          <div class="entry" data-section="portfolio" data-index="${index}">
            <div class="entry-details" style="flex: 1;">
              <div class="entry-header">${item.name || ''}</div>
              <div class="entry-sub">${formatSubtitle([item.type, item.platform ? `on ${item.platform}` : ''])}</div>
              <div class="entry-desc">${item.description || ''}</div>
              ${item.url ? `<div class="entry-desc"><a href="${item.url}" target="_blank" style="color: ${currentTheme.primary};">${item.url}</a></div>` : ''}
            </div>
          </div>
        `).join('')}
      </div>` : ''}

      <!-- Projects -->
      ${nonEmptyProjects.length > 0 ? `
      <div class="main-section" data-section="projects">
        <h2 class="main-section-title">Projects</h2>
        ${nonEmptyProjects.map((project: any, index: number) => `
          <div class="entry" data-section="projects" data-index="${index}">
            <div class="entry-details" style="flex: 1;">
              <div class="entry-header">${project.name || ''}${project.technologies ? ` | ${project.technologies}` : ''}</div>
              <div class="entry-sub">${project.description || ''}</div>
              ${project.startDate || project.endDate ? `<div class="entry-sub">${formatDateRange(project.startDate, project.endDate)}</div>` : ''}
              ${project.url ? `<div class="entry-desc"><a href="${project.url}" target="_blank">${project.urlText || 'View Project'}</a></div>` : ''}
            </div>
          </div>
        `).join('')}
      </div>` : ''}

      <!-- Leadership Positions -->
      ${nonEmptyLeadershipPositions.length > 0 ? `
      <div class="main-section" data-section="leadershipPositions">
        <h2 class="main-section-title">Leadership & Positions</h2>
        ${nonEmptyLeadershipPositions.map((item: any, index: number) => {
          const dateRange = formatDateRange(item.startDate, item.endDate);
          
          return `
          <div class="entry" data-section="leadershipPositions" data-index="${index}">
            <div class="entry-date">${dateRange.replace(' – ', ' -<br>')}</div>
            <div class="entry-details">
              <div class="entry-header">${item.position || item.title || ''}</div>
              <div class="entry-sub">${item.organization || ''}</div>
              <div class="entry-desc">${item.description || ''}</div>
            </div>
          </div>
        `}).join('')}
      </div>` : ''}

      <!-- Volunteering -->
      ${nonEmptyVolunteering.length > 0 ? `
      <div class="main-section" data-section="volunteering">
        <h2 class="main-section-title">Volunteering</h2>
        ${nonEmptyVolunteering.map((item: any, index: number) => `
          <div class="entry" data-section="volunteering" data-index="${index}">
            <div class="entry-date">${item.duration || ''}</div>
            <div class="entry-details">
              <div class="entry-header">${item.role || ''}</div>
              <div class="entry-sub">${formatSubtitle([item.organization, item.causeArea])}</div>
              <div class="entry-desc">${item.description || ''}</div>
            </div>
          </div>
        `).join('')}
      </div>` : ''}

      <!-- Military Service -->
      ${nonEmptyMilitaryService.length > 0 ? `
      <div class="main-section" data-section="militaryService">
        <h2 class="main-section-title">Military Service</h2>
        ${nonEmptyMilitaryService.map((item: any, index: number) => `
          <div class="entry" data-section="militaryService" data-index="${index}">
            <div class="entry-date">${item.duration || ''}</div>
            <div class="entry-details">
              <div class="entry-header">${item.rank ? item.rank : ''}${item.rank && item.branch ? ' - ' : ''}${item.branch || ''}</div>
              ${item.specialization ? `<div class="entry-sub">${item.specialization}</div>` : ''}
              <div class="entry-desc">${item.description || ''}</div>
            </div>
          </div>
        `).join('')}
      </div>` : ''}

      <!-- Teaching Experience -->
      ${nonEmptyTeachingExperience.length > 0 ? `
      <div class="main-section" data-section="teachingExperience">
        <h2 class="main-section-title">Teaching Experience</h2>
        ${nonEmptyTeachingExperience.map((item: any, index: number) => `
          <div class="entry" data-section="teachingExperience" data-index="${index}">
            <div class="entry-date">${item.duration || ''}</div>
            <div class="entry-details">
              <div class="entry-header">${item.subjectCourseTaught || item.title || ''}</div>
              <div class="entry-sub">${item.institution || ''}</div>
              <div class="entry-desc">${item.description || ''}</div>
            </div>
          </div>
        `).join('')}
      </div>` : ''}

      <!-- Mentorship Experience -->
      ${nonEmptyMentorshipExperience.length > 0 ? `
      <div class="main-section" data-section="mentorshipExperience">
        <h2 class="main-section-title">Mentorship Experience</h2>
        ${nonEmptyMentorshipExperience.map((item: any, index: number) => `
          <div class="entry" data-section="mentorshipExperience" data-index="${index}">
            <div class="entry-date">${item.duration || ''}</div>
            <div class="entry-details">
              <div class="entry-header">${item.mentorshipArea || ''}</div>
              <div class="entry-sub">${formatSubtitle([item.organizationPlatform, item.menteeLevel ? `Mentee Level: ${item.menteeLevel}` : ''])}</div>
              <div class="entry-desc">${item.description || ''}</div>
            </div>
          </div>
        `).join('')}
      </div>` : ''}

      <!-- Research Grants -->
      ${nonEmptyResearchGrants.length > 0 ? `
      <div class="main-section" data-section="researchGrants">
        <h2 class="main-section-title">Research Grants</h2>
        ${nonEmptyResearchGrants.map((item: any, index: number) => `
          <div class="entry" data-section="researchGrants" data-index="${index}">
            <div class="entry-date">${item.year || ''}</div>
            <div class="entry-details">
              <div class="entry-header">${item.title || ''}</div>
              <div class="entry-sub">${formatSubtitle([item.agency, item.amount ? `Amount: ${item.amount}` : ''])}</div>
              <div class="entry-desc">${item.description || ''}</div>
            </div>
          </div>
        `).join('')}
      </div>` : ''}

      <!-- Publications -->
      ${nonEmptyPublications.length > 0 ? `
      <div class="main-section" data-section="publications">
        <h2 class="main-section-title">Publications</h2>
        ${nonEmptyPublications.map((item: any, index: number) => `
          <div class="entry" data-section="publications" data-index="${index}">
            <div class="entry-date">${item.year || ''}</div>
            <div class="entry-details">
              <div class="entry-header">${item.title || ''}</div>
              <div class="entry-sub">${formatSubtitle([item.journalPublisher, item.publicationType])}</div>
              ${item.authors ? `<div class="entry-sub"><strong>Authors:</strong> ${item.authors}</div>` : ''}
              ${item.urlDoi ? `<div class="entry-desc"><a href="${item.urlDoi}" target="_blank" style="color: ${currentTheme.primary};">${item.urlDoi}</a></div>` : ''}
            </div>
          </div>
        `).join('')}
      </div>` : ''}

      <!-- Patents -->
      ${nonEmptyPatents.length > 0 ? `
      <div class="main-section" data-section="patents">
        <h2 class="main-section-title">Patents</h2>
        ${nonEmptyPatents.map((item: any, index: number) => `
          <div class="entry" data-section="patents" data-index="${index}">
            <div class="entry-date">${item.year || ''}</div>
            <div class="entry-details">
              <div class="entry-header">${item.title || ''}</div>
              <div class="entry-sub">${formatSubtitle([item.patentNumber ? `Patent #: ${item.patentNumber}` : '', item.issuingAuthority])}</div>
              ${item.status ? `<div class="entry-sub"><strong>Status:</strong> ${item.status}</div>` : ''}
            </div>
          </div>
        `).join('')}
      </div>` : ''}

      <!-- Test Scores -->
      ${nonEmptyTestScores.length > 0 ? `
      <div class="main-section" data-section="testScores">
        <h2 class="main-section-title">Test Scores</h2>
        ${nonEmptyTestScores.map((item: any, index: number) => `
          <div class="entry" data-section="testScores" data-index="${index}">
            <div class="entry-date">${item.year || ''}</div>
            <div class="entry-details">
              <div class="entry-header">${item.testName || ''}</div>
              <div class="entry-sub">Score: ${item.score || ''}${item.percentileRank ? ` (${item.percentileRank} percentile)` : ''}</div>
            </div>
          </div>
        `).join('')}
      </div>` : ''}

      <!-- Scholarships -->
      ${nonEmptyScholarships.length > 0 ? `
      <div class="main-section" data-section="scholarships">
        <h2 class="main-section-title">Scholarships</h2>
        ${nonEmptyScholarships.map((item: any, index: number) => `
          <div class="entry" data-section="scholarships" data-index="${index}">
            <div class="entry-date">${item.year || ''}</div>
            <div class="entry-details">
              <div class="entry-header">${item.name || ''}</div>
              <div class="entry-sub">${formatSubtitle([item.provider || item.organization, item.amount])}</div>
              <div class="entry-desc">${item.description || ''}</div>
            </div>
          </div>
        `).join('')}
      </div>` : ''}

      <!-- Co-curricular Activities -->
      ${nonEmptyCoCurricular.length > 0 ? `
      <div class="main-section" data-section="coCurricular">
        <h2 class="main-section-title">Co-curricular Activities</h2>
        ${nonEmptyCoCurricular.map((item: any, index: number) => `
          <div class="entry" data-section="coCurricular" data-index="${index}">
            <div class="entry-date">${item.year || formatDateRange(item.startDate, item.endDate) || ''}</div>
            <div class="entry-details">
              <div class="entry-header">${item.activity || ''}</div>
              <div class="entry-sub">${formatSubtitle([item.organization, item.role ? `Role: ${item.role}` : ''])}</div>
              <div class="entry-desc">${item.description || ''}</div>
            </div>
          </div>
        `).join('')}
      </div>` : ''}

      <!-- Extracurricular Activities -->
      ${nonEmptyExtracurricular.length > 0 ? `
      <div class="main-section" data-section="extracurricular">
        <h2 class="main-section-title">Extracurricular Activities</h2>
        ${nonEmptyExtracurricular.map((item: any, index: number) => `
          <div class="entry" data-section="extracurricular" data-index="${index}">
            <div class="entry-date">${item.year || formatDateRange(item.startDate, item.endDate) || ''}</div>
            <div class="entry-details">
              <div class="entry-header">${item.activity || ''}</div>
              <div class="entry-sub">${formatSubtitle([item.organization, item.role ? `Role: ${item.role}` : ''])}</div>
              <div class="entry-desc">${item.description || ''}</div>
            </div>
          </div>
        `).join('')}
      </div>` : ''}

      <!-- Certifications -->
      ${nonEmptyCertifications.length > 0 ? `
      <div class="main-section" data-section="certifications">
        <h2 class="main-section-title">Certifications</h2>
        ${nonEmptyCertifications.map((cert: any, index: number) => `
          <div class="entry" data-section="certifications" data-index="${index}">
            <div class="entry-date">${cert.date || ''}</div>
            <div class="entry-details">
              <div class="entry-header">${cert.name || ''}</div>
              <div class="entry-sub">${cert.issuer || ''}</div>
              ${cert.description ? `<div class="entry-desc">${cert.description}</div>` : ''}
              ${cert.url ? `<div class="entry-desc"><a href="${cert.url}" target="_blank">View Certificate</a></div>` : ''}
            </div>
          </div>
        `).join('')}
      </div>` : ''}

      <!-- Awards -->
      ${nonEmptyAwards.length > 0 ? `
      <div class="main-section" data-section="awards">
        <h2 class="main-section-title">Awards</h2>
        ${nonEmptyAwards.map((award: any, index: number) => `
          <div class="entry" data-section="awards" data-index="${index}">
            <div class="entry-date">${award.issueYear || award.year || ''}</div>
            <div class="entry-details">
              <div class="entry-header">${award.title || ''}</div>
              <div class="entry-sub">${award.organization || ''}</div>
              ${award.description ? `<div class="entry-desc">${award.description}</div>` : ''}
            </div>
          </div>
        `).join('')}
      </div>` : ''}

      <!-- Speaking Engagements -->
      ${nonEmptySpeakingEngagements.length > 0 ? `
      <div class="main-section" data-section="speakingEngagements">
        <h2 class="main-section-title">Speaking Engagements</h2>
        ${nonEmptySpeakingEngagements.map((item: any, index: number) => `
          <div class="entry" data-section="speakingEngagements" data-index="${index}">
            <div class="entry-date">${item.date || ''}</div>
            <div class="entry-details">
              <div class="entry-header">${item.topic || ''}</div>
              <div class="entry-sub">${item.eventName || ''}</div>
              ${item.description ? `<div class="entry-desc">${item.description}</div>` : ''}
            </div>
          </div>
        `).join('')}
      </div>` : ''}

      <!-- Memberships -->
      ${nonEmptyMemberships.length > 0 ? `
      <div class="main-section" data-section="memberships">
        <h2 class="main-section-title">Memberships</h2>
        ${nonEmptyMemberships.map((item: any, index: number) => `
          <div class="entry" data-section="memberships" data-index="${index}">
            <div class="entry-date">${item.year || ''}</div>
            <div class="entry-details">
              <div class="entry-header">${item.membershipName || ''}</div>
              <div class="entry-sub">${item.organizationName || ''}</div>
              ${item.description ? `<div class="entry-desc">${item.description}</div>` : ''}
            </div>
          </div>
        `).join('')}
      </div>` : ''}

      <!-- Workshops -->
      ${nonEmptyWorkshops.length > 0 ? `
      <div class="main-section" data-section="workshops">
        <h2 class="main-section-title">Workshops</h2>
        ${nonEmptyWorkshops.map((item: any, index: number) => `
          <div class="entry" data-section="workshops" data-index="${index}">
            <div class="entry-date">${item.year || ''}</div>
            <div class="entry-details">
              <div class="entry-header">${item.programTitle || ''}</div>
              <div class="entry-sub">${item.conductedBy || ''}</div>
              ${item.description ? `<div class="entry-desc">${item.description}</div>` : ''}
            </div>
          </div>
        `).join('')}
      </div>` : ''}

      <!-- Key Achievements -->
      ${nonEmptyKeyAchievements.length > 0 ? `
      <div class="main-section" data-section="keyAchievements">
        <h2 class="main-section-title">Key Achievements</h2>
        <ul style="font-size: ${userFontSize}px; line-height: 1.5; padding-left: 18px;">
          ${nonEmptyKeyAchievements.map((achievement: string, index: number) => `<li data-section="keyAchievements" data-index="${index}">${achievement}</li>`).join('')}
        </ul>
      </div>` : ''}

      <!-- Key Responsibilities -->
      ${nonEmptyResponsibilities.length > 0 ? `
      <div class="main-section" data-section="responsibilities">
        <h2 class="main-section-title">Key Responsibilities</h2>
        <ul style="font-size: ${userFontSize}px; line-height: 1.5; padding-left: 18px;">
          ${nonEmptyResponsibilities.map((line: string, index: number) => `<li data-section="responsibilities" data-index="${index}">${line.trim()}</li>`).join('')}
        </ul>
      </div>` : ''}

      <!-- Tools -->
      ${nonEmptyTools.length > 0 ? `
      <div class="main-section" data-section="tools">
        <h2 class="main-section-title">Tools & Technologies</h2>
        <ul style="font-size: ${userFontSize}px; line-height: 1.5; padding-left: 18px;">
          ${nonEmptyTools.map((line: string, index: number) => `<li data-section="tools" data-index="${index}">${line.trim()}</li>`).join('')}
        </ul>
      </div>` : ''}

      <!-- Custom Sections -->
      ${nonEmptyCustomSections.length > 0 ? data.customSections
        .filter((section: any) => section.isVisible && section.entries && hasNonEmptyItems(section.entries))
        .map((section: any, sectionIndex: number) => `
      <div class="main-section" data-section="custom-${sectionIndex}">
        <h2 class="main-section-title">${section.heading || 'Custom Section'}</h2>
        ${section.entries && section.entries.length > 0 ? section.entries
          .filter((entry: any) => entry.isVisible && (entry.title || entry.description))
          .map((entry: any, entryIndex: number) => `
          <div class="entry" data-section="custom-${sectionIndex}" data-index="${entryIndex}">
            <div class="entry-date">${entry.date || ''}</div>
            <div class="entry-details">
              <div class="entry-header">${entry.title || ''}${entry.title && entry.organization ? ' at ' : ''}${entry.organization || ''}</div>
              ${entry.description ? `<div class="entry-desc">${entry.description}</div>` : ''}
            </div>
          </div>
        `).join('') : '<p style="color: #666; font-style: italic;">No entries in this section</p>'}
      </div>
      `).join('') : ''}
    </div>
  </div>
</body>
</html>`;
}