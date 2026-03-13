export function buildAzurillTemplate(data: any, theme?: any): string {
  const defaultTheme = {
    primary: '#1e40af',
    secondary: '#ffffff',
    background: '#ffffff',
    headingFont: 'Poppins',
    bodyFont: 'Poppins'
  }

  const currentTheme = theme || defaultTheme

  const userFontSize = data.formatting?.bodyFontSize || data.fontSize || 14
  const userFontFamily = data.formatting?.fontFamily || data.fontFamily || 'Poppins, sans-serif'

  const headingFontSize = Math.round(userFontSize * 2.1)
  const subheadingFontSize = Math.round(userFontSize * 1.2)

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
<html>
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Resume</title>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

:root {
  --primary-color: ${currentTheme.primary};
  --secondary-color: ${currentTheme.secondary};
  --background-color: ${currentTheme.background};
  --heading-font: ${currentTheme.headingFont || 'Poppins'};
  --body-font: ${currentTheme.bodyFont || 'Poppins'};
}

body {
  font-family: ${userFontFamily};
  font-size: ${userFontSize}px;
  background: #e5e5e5;
  color: #333;
  line-height: 1.6;
}

.resume {
  max-width: 900px;
  margin: 30px auto;
  background: #ffffff;
  display: flex;
}

/* LEFT SIDEBAR */
.sidebar {
  width: 32%;
  background: var(--secondary-color);
  padding: 30px 22px;
  color: #333;
}

.profile-pic {
  width: 110px;
  height: 110px;
  border-radius: 50%;
  overflow: hidden;
  border: 4px solid #fff;
  margin-bottom: 20px;
}

.profile-pic img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.sidebar-section {
  margin-bottom: 26px;
}

.sidebar-title {
  font-weight: 700;
  font-size: ${Math.round(userFontSize * 0.95)}px;
  background: var(--primary-color);
  color: white;
  padding: 6px 10px;
  margin-bottom: 10px;
}

.sidebar p {
  margin-bottom: 6px;
}

.sidebar ul {
  margin-left: 18px;
}

.sidebar li {
  margin-bottom: 6px;
}

/* Enhanced Education Styles for Sidebar */
.education-item {
  margin-bottom: 20px;
  padding: 12px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  border-left: 3px solid #fff;
}

.education-degree {
  font-weight: 700;
  font-size: ${Math.round(userFontSize * 1.0)}px;
  color: #333;
  margin-bottom: 4px;
}

.education-field {
  font-weight: 500;
  font-size: ${Math.round(userFontSize * 0.9)}px;
  color: #333;
  margin-bottom: 4px;
  font-style: italic;
}

.education-school {
  font-size: ${Math.round(userFontSize * 0.85)}px;
  color: #333;
  margin-bottom: 4px;
  font-weight: 500;
}

.education-location {
  font-size: ${Math.round(userFontSize * 0.8)}px;
  color: #333;
  margin-bottom: 6px;
  font-style: italic;
}

.education-date {
  font-size: ${Math.round(userFontSize * 0.8)}px;
  color: #333;
  font-weight: 500;
  margin-bottom: 6px;
}

.education-description {
  font-size: ${Math.round(userFontSize * 0.8)}px;
  color: #333;
  line-height: 1.4;
  margin-top: 8px;
  padding: 8px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 4px;
}

.education-description ul {
  margin: 6px 0 6px 16px;
  padding: 0;
  list-style-type: disc;
}

.education-description li {
  margin: 3px 0;
  color: #333;
}

.education-description b {
  font-weight: 600;
  color: #333;
}

.education-achievements {
  margin-top: 10px;
  padding-top: 8px;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
}

.education-achievements h4 {
  font-size: ${Math.round(userFontSize * 0.75)}px;
  font-weight: 600;
  color: #333;
  margin-bottom: 6px;
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
  margin-bottom: 4px;
  color: #333;
  font-size: ${Math.round(userFontSize * 0.8)}px;
}

.education-achievements li:before {
  content: "▪";
  color: #333;
  font-weight: bold;
  position: absolute;
  left: 0;
}

/* RIGHT CONTENT */
.main {
  width: 68%;
  padding: 30px 36px;
}

.header-bar {
  background: var(--primary-color);
  color: #ffffff;
  padding: 18px 24px;
  margin-bottom: 28px;
}

.name {
  font-size: ${headingFontSize}px;
  font-weight: 700;
}

.role {
  font-size: ${subheadingFontSize}px;
  margin-top: 6px;
}

.section {
  margin-bottom: 28px;
}

.section-title {
  font-weight: 700;
  font-size: ${Math.round(userFontSize * 1.05)}px;
  color: var(--primary-color);
  border-bottom: 2px solid var(--primary-color);
  padding-bottom: 6px;
  margin-bottom: 12px;
}

.entry {
  margin-bottom: 18px;
}

.entry-title {
  font-weight: 600;
}

.entry-subtitle {
  font-size: ${Math.round(userFontSize * 0.95)}px;
  color: #555;
}

.entry-date {
  font-size: ${Math.round(userFontSize * 0.9)}px;
  color: #777;
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 10px;
  margin-bottom: 15px;
  padding: 10px;
  background: rgba(30, 64, 175, 0.05);
  border-radius: 6px;
}

.metric-item {
  text-align: center;
}

.metric-value {
  font-size: ${Math.round(userFontSize * 1.2)}px;
  font-weight: 700;
  color: var(--primary-color);
  line-height: 1.2;
}

.metric-label {
  font-size: ${Math.round(userFontSize * 0.8)}px;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-top: 2px;
}

@media print {
  body {
    background: #fff;
  }
}
</style>
</head>

<body>
<div class="resume">

  <!-- SIDEBAR -->
  <aside class="sidebar">

    ${data.personal?.image ? `
      <div class="profile-pic">
        <img src="${data.personal.image}" alt="Profile" />
      </div>
    ` : ''}

    <div class="sidebar-section">
      <div class="sidebar-title">Contact Details</div>
      ${data.personal?.phone ? `<p data-section="personal">📞 ${data.personal.phone}</p>` : ''}
      ${data.personal?.alternatePhone ? `<p data-section="personal">📞 ${data.personal.alternatePhone}</p>` : ''}
      ${data.personal?.email ? `<p data-section="personal">✉️ ${data.personal.email}</p>` : ''}
      ${(() => {
        const addressParts = [
          data.personal?.fullAddress,
          data.personal?.location,
          data.personal?.country,
          data.personal?.pinCode
        ].filter(Boolean);
        return addressParts.length > 0 ? `<p data-section="personal">📍 ${addressParts.join(', ')}</p>` : '';
      })()}
      ${data.personal?.linkedinUrl ? `<p data-section="personal"><a href="${data.personal.linkedinUrl}" target="_blank" style="color: #222; text-decoration: none;">🔗 LinkedIn</a></p>` : ''}
      ${data.personal?.githubUrl ? `<p data-section="personal"><a href="${data.personal.githubUrl}" target="_blank" style="color: #222; text-decoration: none;">🐙 GitHub</a></p>` : ''}
      ${data.personal?.portfolioUrl ? `<p data-section="personal"><a href="${data.personal.portfolioUrl}" target="_blank" style="color: #222; text-decoration: none;">💼 Portfolio</a></p>` : ''}
      ${data.personal?.website ? `<p data-section="personal"><a href="${data.personal.website}" target="_blank" style="color: #222; text-decoration: none;">🌐 Website</a></p>` : ''}
      ${data.personal?.twitterUrl ? `<p data-section="personal"><a href="${data.personal.twitterUrl}" target="_blank" style="color: #222; text-decoration: none;">🐦 Twitter</a></p>` : ''}
      ${data.personal?.facebookUrl ? `<p data-section="personal"><a href="${data.personal.facebookUrl}" target="_blank" style="color: #222; text-decoration: none;">📘 Facebook</a></p>` : ''}
      ${data.personal?.instagramUrl ? `<p data-section="personal"><a href="${data.personal.instagramUrl}" target="_blank" style="color: #222; text-decoration: none;">📷 Instagram</a></p>` : ''}
      ${data.personal?.behanceUrl ? `<p data-section="personal"><a href="${data.personal.behanceUrl}" target="_blank" style="color: #222; text-decoration: none;">🎨 Behance</a></p>` : ''}
      ${data.personal?.dribbbleUrl ? `<p data-section="personal"><a href="${data.personal.dribbbleUrl}" target="_blank" style="color: #222; text-decoration: none;">🏀 Dribbble</a></p>` : ''}
      ${data.personal?.stackoverflowUrl ? `<p data-section="personal"><a href="${data.personal.stackoverflowUrl}" target="_blank" style="color: #222; text-decoration: none;">📚 Stack Overflow</a></p>` : ''}
      ${data.personal?.mediumUrl ? `<p data-section="personal"><a href="${data.personal.mediumUrl}" target="_blank" style="color: #222; text-decoration: none;">📝 Medium</a></p>` : ''}
      
      ${(() => {
        const personalDetails = [];
        if (data.personal?.fathersName) personalDetails.push(`👨 Father: ${data.personal.fathersName}`);
        if (data.personal?.dob) personalDetails.push(`📅 DOB: ${data.personal.dob}`);
        if (data.personal?.gender) personalDetails.push(`⚥ Gender: ${data.personal.gender}`);
        if (data.personal?.maritalStatus) personalDetails.push(`💍 Marital: ${data.personal.maritalStatus}`);
        
        return personalDetails.length > 0 ? personalDetails.map(detail => `<p data-section="personal">${detail}</p>`).join('') : '';
      })()}
    </div>

    <!-- Professional Context in Sidebar -->
    ${nonEmptyProfessionalContext ? `
      <div class="sidebar-section" data-section="professionalContext">
        <div class="sidebar-title">Professional Context</div>
        ${nonEmptyProfessionalContext.totalExperience ? `<p><b>Experience:</b> ${nonEmptyProfessionalContext.totalExperience}</p>` : ''}
        ${nonEmptyProfessionalContext.teamSize ? `<p><b>Team Size:</b> ${nonEmptyProfessionalContext.teamSize}</p>` : ''}
        ${nonEmptyProfessionalContext.industry ? `<p><b>Industry:</b> ${nonEmptyProfessionalContext.industry}</p>` : ''}
        ${nonEmptyProfessionalContext.functionalDomain ? `<p><b>Domain:</b> ${nonEmptyProfessionalContext.functionalDomain}</p>` : ''}
        ${nonEmptyProfessionalContext.geographicScope ? `<p><b>Scope:</b> ${nonEmptyProfessionalContext.geographicScope}</p>` : ''}
        ${nonEmptyProfessionalContext.revenueResponsibility ? `<p><b>Revenue:</b> ${nonEmptyProfessionalContext.revenueResponsibility}</p>` : ''}
      </div>
    ` : ''}

    <!-- Availability & Work Auth in Sidebar -->
    ${nonEmptyAvailabilityWorkAuth ? `
      <div class="sidebar-section" data-section="availabilityWorkAuth">
        <div class="sidebar-title">Availability</div>
        ${nonEmptyAvailabilityWorkAuth.availabilityNoticePeriod ? `<p><b>Notice:</b> ${nonEmptyAvailabilityWorkAuth.availabilityNoticePeriod}</p>` : ''}
        ${nonEmptyAvailabilityWorkAuth.workAuthorizationStatus ? `<p><b>Work Auth:</b> ${nonEmptyAvailabilityWorkAuth.workAuthorizationStatus}</p>` : ''}
        ${nonEmptyAvailabilityWorkAuth.preferredLocation ? `<p><b>Preferred:</b> ${nonEmptyAvailabilityWorkAuth.preferredLocation}</p>` : ''}
      </div>
    ` : ''}

    <!-- Skills -->
    ${nonEmptySkills.length > 0 ? `
    <div class="sidebar-section">
      <div class="sidebar-title">Competencies</div>
      <ul data-section="skills">
        ${nonEmptySkills.map((s: any, index: number) => `<li data-section="skills" data-index="${index}">${typeof s === 'string' ? s : s}</li>`).join('')}
      </ul>
    </div>` : ''}

    <!-- Tools & Technologies -->
    ${nonEmptyToolsTechnologies.length > 0 ? `
    <div class="sidebar-section">
      <div class="sidebar-title">Tools & Tech</div>
      <ul data-section="toolsTechnologies">
        ${nonEmptyToolsTechnologies.map((item: any, index: number) => `
          <li data-section="toolsTechnologies" data-index="${index}">
            ${item.name || ''}${item.proficiency ? ` (${item.proficiency})` : ''}${item.experienceDuration ? ` - ${item.experienceDuration}` : ''}
          </li>
        `).join('')}
      </ul>
    </div>` : ''}

    <!-- Methodologies -->
    ${nonEmptyMethodologies.length > 0 ? `
    <div class="sidebar-section">
      <div class="sidebar-title">Methodologies</div>
      <ul data-section="methodologies">
        ${nonEmptyMethodologies.map((item: any, index: number) => `
          <li data-section="methodologies" data-index="${index}">
            ${item.name || ''}${item.certification ? ` (${item.certification})` : ''}${item.experienceDuration ? ` - ${item.experienceDuration} years` : ''}
          </li>
        `).join('')}
      </ul>
    </div>` : ''}

    <!-- Industry Expertise -->
    ${nonEmptyIndustryExpertise.length > 0 ? `
    <div class="sidebar-section">
      <div class="sidebar-title">Industry Expertise</div>
      <ul data-section="industryExpertise">
        ${nonEmptyIndustryExpertise.map((item: any, index: number) => `
          <li data-section="industryExpertise" data-index="${index}">
            ${item.industry || ''}${item.domainArea ? ` - ${item.domainArea}` : ''}${item.experienceDuration ? ` (${item.experienceDuration} years)` : ''}
          </li>
        `).join('')}
      </ul>
    </div>` : ''}

    <!-- Education -->
    ${hasNonEmptyItems(data.education) ? `
    <div class="sidebar-section">
      <div class="sidebar-title">Education</div>
      ${getNonEmptyArray(data.education).map((edu: any, index: number) => `
        <div class="education-item" data-section="education" data-index="${index}">
          <div class="education-degree" data-section="education" data-index="${index}">
            ${edu.degree || ''}${edu.field ? ` in ${edu.field}` : ''}${edu.qualification ? ` (${edu.qualification})` : ''}
          </div>
          ${edu.school ? `<div class="education-school" data-section="education" data-index="${index}">${edu.school}${edu.location ? `, ${edu.location}` : ''}</div>` : ''}
          ${edu.graduationDate ? `<div class="education-date" data-section="education" data-index="${index}">${edu.graduationDate}</div>` : ''}
          ${edu.grade ? `<div class="education-field" data-section="education" data-index="${index}"> ${edu.grade}</div>` : ''}
          
          ${edu.description ? `
            <div class="education-description" data-section="education" data-index="${index}">
              ${edu.description}
            </div>
          ` : ''}
          
          ${edu.achievements && edu.achievements.length > 0 ? `
            <div class="education-achievements" data-section="education" data-index="${index}">
              <h4>Achievements</h4>
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

    <!-- Languages -->
    ${nonEmptyLanguages.length > 0 ? `
    <div class="sidebar-section">
      <div class="sidebar-title">Languages</div>
      ${nonEmptyLanguages.map((lang: any, index: number) => `
        <p data-section="languages" data-index="${index}">
          <b data-section="languages" data-index="${index}">${lang.language || ''}</b>${lang.level ? ` - ${lang.level}` : ''}${lang.capability ? ` (${lang.capability})` : ''}
        </p>
      `).join('')}
    </div>` : ''}

    <!-- Certifications -->
    ${nonEmptyCertifications.length > 0 ? `
    <div class="sidebar-section">
      <div class="sidebar-title">Certifications</div>
      ${nonEmptyCertifications.map((cert: any, index: number) => `
        <p data-section="certifications" data-index="${index}">
          <b data-section="certifications" data-index="${index}">${cert.name || ''}</b><br/>
          ${cert.issuer ? `<span data-section="certifications" data-index="${index}">${cert.issuer}</span>` : ''}
          ${cert.date ? `<br/><span data-section="certifications" data-index="${index}">${cert.date}</span>` : ''}
          ${cert.description ? `<br/><span data-section="certifications" data-index="${index}">${cert.description}</span>` : ''}
          ${cert.url ? `<br/><a href="${cert.url}" target="_blank" style="color: var(--primary-color);">View Certificate</a>` : ''}
        </p>
      `).join('')}
    </div>` : ''}

    <!-- Hobbies -->
    ${nonEmptyHobbies.length > 0 ? `
    <div class="sidebar-section">
      <div class="sidebar-title">Hobbies & Interests</div>
      <ul data-section="hobbies">
        ${nonEmptyHobbies.map((hobby: any, index: number) => `<li data-section="hobbies" data-index="${index}">${hobby}</li>`).join('')}
      </ul>
    </div>` : ''}

    <!-- Social Links -->
    ${nonEmptySocialLinks.length > 0 ? `
    <div class="sidebar-section">
      <div class="sidebar-title">Social Links</div>
      <div style="display: flex; flex-wrap: wrap; gap: 10px;" data-section="socialLinks">
        ${nonEmptySocialLinks.map((link: any, index: number) => `
          <a href="${link.url}" target="_blank" style="color: #222; text-decoration: none; font-size: ${Math.round(userFontSize * 0.8)}px;" data-section="socialLinks" data-index="${index}">${link.urlText || link.url.replace('https://', '').replace('http://', '')}</a>
        `).join('')}
      </div>
    </div>` : ''}

    <!-- Social Profiles -->
    ${nonEmptySocialProfiles.length > 0 ? `
    <div class="sidebar-section">
      <div class="sidebar-title">Social Profiles</div>
      <ul data-section="socialProfiles">
        ${nonEmptySocialProfiles.map((profile: any, index: number) => `
          <li data-section="socialProfiles" data-index="${index}">
            <a href="${profile.url}" target="_blank" style="color: #222; text-decoration: none;">${profile.platform || "Profile"}</a>
          </li>
        `).join('')}
      </ul>
    </div>` : ''}

    <!-- References -->
    ${nonEmptyReferences.length > 0 ? `
    <div class="sidebar-section">
      <div class="sidebar-title">References</div>
      ${nonEmptyReferences.map((ref: any, index: number) => `
        <div data-section="references" data-index="${index}" style="margin-bottom: 10px;">
          <b>${ref.name || ''}</b><br/>
          ${ref.designationRelationship ? `<span>${ref.designationRelationship}</span><br/>` : ''}
          ${ref.organization ? `<span>${ref.organization}</span><br/>` : ''}
          ${ref.contactInformation ? `<span>${ref.contactInformation}</span>` : ''}
        </div>
      `).join('')}
    </div>` : ''}

  </aside>

  <!-- MAIN CONTENT -->
  <main class="main">

    <div class="header-bar" data-section="personal">
      <div class="name" data-section="personal">${data.personal?.name && data.personal?.name !== 'undefined' ? data.personal.name : ''}${data.personal?.middleName ? ` ${data.personal.middleName}` : ''}</div>
      <div class="role" data-section="personal">${data.personal?.role || data.personal?.title || ''}</div>
    </div>

    <!-- Summary -->
    ${data.summary && data.summary.trim() ? `
    <div class="section" data-section="summary">
      <div class="section-title" data-section="summary">Career Overview</div>
      <p data-section="summary">${data.summary}</p>
    </div>` : ''}

    <!-- Career Objective -->
    ${data.careerObjective && data.careerObjective.trim() ? `
    <div class="section" data-section="careerObjective">
      <div class="section-title" data-section="careerObjective">Career Objective</div>
      <p data-section="careerObjective">${data.careerObjective}</p>
    </div>` : ''}

    <!-- Work Experience -->
    ${hasNonEmptyItems(data.experience) ? `
    <div class="section" data-section="experience">
      <div class="section-title" data-section="experience">Work Experience</div>
      ${getNonEmptyArray(data.experience).map((exp: any, index: number) => {
        const dateRange = formatDateRange(exp.startDate, exp.endDate, exp.isCurrent);
        const metaParts = formatSubtitle([exp.company, exp.location, exp.domain]);
        
        return `
        <div class="entry" data-section="experience" data-index="${index}">
          <div class="entry-title" data-section="experience" data-index="${index}">${exp.title || ''}</div>
          ${metaParts ? `<div class="entry-subtitle" data-section="experience" data-index="${index}">${metaParts}</div>` : ''}
          ${dateRange ? `<div class="entry-date" data-section="experience" data-index="${index}">${dateRange}</div>` : ''}
          <p data-section="experience" data-index="${index}">${exp.description || ''}</p>
          ${exp.achievements ? `<p><strong>Achievements:</strong> ${exp.achievements}</p>` : ''}
        </div>
      `}).join('')}
    </div>` : ''}

    <!-- Internships -->
    ${nonEmptyInternships.length > 0 ? `
    <div class="section" data-section="internships">
      <div class="section-title" data-section="internships">Internships</div>
      ${nonEmptyInternships.map((item: any, index: number) => {
        const dateRange = item.duration || formatDateRange(item.startDate, item.endDate);
        const metaParts = formatSubtitle([item.company, item.location]);
        
        return `
        <div class="entry" data-section="internships" data-index="${index}">
          <div class="entry-title" data-section="internships" data-index="${index}">${item.title || ''}</div>
          ${metaParts ? `<div class="entry-subtitle" data-section="internships" data-index="${index}">${metaParts}</div>` : ''}
          ${dateRange ? `<div class="entry-date" data-section="internships" data-index="${index}">${dateRange}</div>` : ''}
          <p data-section="internships" data-index="${index}">${item.description || ''}</p>
        </div>
      `}).join('')}
    </div>` : ''}

    <!-- Training Programs -->
    ${nonEmptyTrainingPrograms.length > 0 ? `
    <div class="section" data-section="trainingPrograms">
      <div class="section-title" data-section="trainingPrograms">Training Programs</div>
      ${nonEmptyTrainingPrograms.map((item: any, index: number) => `
        <div class="entry" data-section="trainingPrograms" data-index="${index}">
          <div class="entry-title" data-section="trainingPrograms" data-index="${index}">${item.name || ''}</div>
          <div class="entry-subtitle" data-section="trainingPrograms" data-index="${index}">${formatSubtitle([item.provider || item.organization, item.duration])}</div>
          ${item.completionDate ? `<div class="entry-date" data-section="trainingPrograms" data-index="${index}">${item.completionDate}</div>` : ''}
          <p data-section="trainingPrograms" data-index="${index}">${item.description || ''}</p>
        </div>
      `).join('')}
    </div>` : ''}

    <!-- Projects -->
    ${nonEmptyProjects.length > 0 ? `
    <div class="section" data-section="projects">
      <div class="section-title" data-section="projects">Projects</div>
      ${nonEmptyProjects.map((project: any, index: number) => {
        const dateRange = formatDateRange(project.startDate, project.endDate);
        
        return `
        <div class="entry" data-section="projects" data-index="${index}">
          <div class="entry-title" data-section="projects" data-index="${index}">${project.name || ''}</div>
          ${project.technologies ? `<div class="entry-subtitle" data-section="projects" data-index="${index}">${project.technologies}</div>` : ''}
          ${dateRange ? `<div class="entry-date" data-section="projects" data-index="${index}">${dateRange}</div>` : ''}
          <p data-section="projects" data-index="${index}">${project.description || ''}</p>
          ${project.url ? `<p data-section="projects" data-index="${index}"><a href="${project.url}" target="_blank" style="color: var(--primary-color);">${project.urlText || "View Project"}</a></p>` : ''}
        </div>
      `}).join('')}
    </div>` : ''}

    <!-- Academic Projects -->
    ${nonEmptyAcademicProjects.length > 0 ? `
    <div class="section" data-section="academicProjects">
      <div class="section-title" data-section="academicProjects">Academic Projects</div>
      ${nonEmptyAcademicProjects.map((item: any, index: number) => `
        <div class="entry" data-section="academicProjects" data-index="${index}">
          <div class="entry-title" data-section="academicProjects" data-index="${index}">${item.name || item.title || ''}</div>
          <div class="entry-subtitle" data-section="academicProjects" data-index="${index}">${formatSubtitle([item.institution, item.course ? `Course: ${item.course}` : ''])}</div>
          ${item.duration ? `<div class="entry-date" data-section="academicProjects" data-index="${index}">${item.duration}</div>` : ''}
          <p data-section="academicProjects" data-index="${index}">${item.description || ''}</p>
          ${item.technologies ? `<p data-section="academicProjects" data-index="${index}"><strong>Technologies:</strong> ${Array.isArray(item.technologies) ? item.technologies.join(', ') : item.technologies}</p>` : ''}
          ${item.url ? `<p data-section="academicProjects" data-index="${index}"><a href="${item.url}" target="_blank" style="color: var(--primary-color);">${item.url}</a></p>` : ''}
        </div>
      `).join('')}
    </div>` : ''}

    <!-- Client Projects -->
    ${nonEmptyClientProjects.length > 0 ? `
    <div class="section" data-section="clientProjects">
      <div class="section-title" data-section="clientProjects">Client Projects</div>
      ${nonEmptyClientProjects.map((item: any, index: number) => `
        <div class="entry" data-section="clientProjects" data-index="${index}">
          <div class="entry-title" data-section="clientProjects" data-index="${index}">${item.name || ''}</div>
          <div class="entry-subtitle" data-section="clientProjects" data-index="${index}">${formatSubtitle([item.clientOrganization, item.role ? `Role: ${item.role}` : '', item.duration])}</div>
          <p data-section="clientProjects" data-index="${index}">${item.description || ''}</p>
          ${item.toolsTechnologies ? `<p><strong>Tools:</strong> ${item.toolsTechnologies}</p>` : ''}
          ${item.projectUrl ? `<p><a href="${item.projectUrl}" target="_blank" style="color: var(--primary-color);">View Project</a></p>` : ''}
        </div>
      `).join('')}
    </div>` : ''}

    <!-- Portfolio -->
    ${nonEmptyPortfolio.length > 0 ? `
    <div class="section" data-section="portfolio">
      <div class="section-title" data-section="portfolio">Portfolio</div>
      ${nonEmptyPortfolio.map((item: any, index: number) => `
        <div class="entry" data-section="portfolio" data-index="${index}">
          <div class="entry-title" data-section="portfolio" data-index="${index}">${item.name || ''}</div>
          <div class="entry-subtitle" data-section="portfolio" data-index="${index}">${formatSubtitle([item.type, item.platform ? `on ${item.platform}` : ''])}</div>
          <p data-section="portfolio" data-index="${index}">${item.description || ''}</p>
          ${item.url ? `<p><a href="${item.url}" target="_blank" style="color: var(--primary-color);">View Portfolio</a></p>` : ''}
        </div>
      `).join('')}
    </div>` : ''}

    <!-- Leadership Positions -->
    ${nonEmptyLeadershipPositions.length > 0 ? `
    <div class="section" data-section="leadershipPositions">
      <div class="section-title" data-section="leadershipPositions">Leadership & Positions</div>
      ${nonEmptyLeadershipPositions.map((item: any, index: number) => {
        const dateRange = formatDateRange(item.startDate, item.endDate);
        
        return `
        <div class="entry" data-section="leadershipPositions" data-index="${index}">
          <div class="entry-title" data-section="leadershipPositions" data-index="${index}">${item.position || item.title || ''}</div>
          <div class="entry-subtitle" data-section="leadershipPositions" data-index="${index}">${item.organization || ''}</div>
          ${dateRange ? `<div class="entry-date" data-section="leadershipPositions" data-index="${index}">${dateRange}</div>` : ''}
          <p data-section="leadershipPositions" data-index="${index}">${item.description || ''}</p>
        </div>
      `}).join('')}
    </div>` : ''}

    <!-- Volunteering -->
    ${nonEmptyVolunteering.length > 0 ? `
    <div class="section" data-section="volunteering">
      <div class="section-title" data-section="volunteering">Volunteering</div>
      ${nonEmptyVolunteering.map((item: any, index: number) => `
        <div class="entry" data-section="volunteering" data-index="${index}">
          <div class="entry-title" data-section="volunteering" data-index="${index}">${item.role || ''}</div>
          <div class="entry-subtitle" data-section="volunteering" data-index="${index}">${formatSubtitle([item.organization, item.causeArea, item.duration])}</div>
          <p data-section="volunteering" data-index="${index}">${item.description || ''}</p>
        </div>
      `).join('')}
    </div>` : ''}

    <!-- Military Service -->
    ${nonEmptyMilitaryService.length > 0 ? `
    <div class="section" data-section="militaryService">
      <div class="section-title" data-section="militaryService">Military Service</div>
      ${nonEmptyMilitaryService.map((item: any, index: number) => `
        <div class="entry" data-section="militaryService" data-index="${index}">
          <div class="entry-title" data-section="militaryService" data-index="${index}">${item.rank ? item.rank : ''}${item.rank && item.branch ? ' - ' : ''}${item.branch || ''}</div>
          ${item.specialization ? `<div class="entry-subtitle">${item.specialization}</div>` : ''}
          ${item.duration ? `<div class="entry-date">${item.duration}</div>` : ''}
          <p data-section="militaryService" data-index="${index}">${item.description || ''}</p>
        </div>
      `).join('')}
    </div>` : ''}

    <!-- Teaching Experience -->
    ${nonEmptyTeachingExperience.length > 0 ? `
    <div class="section" data-section="teachingExperience">
      <div class="section-title" data-section="teachingExperience">Teaching Experience</div>
      ${nonEmptyTeachingExperience.map((item: any, index: number) => `
        <div class="entry" data-section="teachingExperience" data-index="${index}">
          <div class="entry-title" data-section="teachingExperience" data-index="${index}">${item.subjectCourseTaught || item.title || ''}</div>
          <div class="entry-subtitle" data-section="teachingExperience" data-index="${index}">${formatSubtitle([item.institution, item.duration])}</div>
          <p data-section="teachingExperience" data-index="${index}">${item.description || ''}</p>
        </div>
      `).join('')}
    </div>` : ''}

    <!-- Mentorship Experience -->
    ${nonEmptyMentorshipExperience.length > 0 ? `
    <div class="section" data-section="mentorshipExperience">
      <div class="section-title" data-section="mentorshipExperience">Mentorship Experience</div>
      ${nonEmptyMentorshipExperience.map((item: any, index: number) => `
        <div class="entry" data-section="mentorshipExperience" data-index="${index}">
          <div class="entry-title" data-section="mentorshipExperience" data-index="${index}">${item.mentorshipArea || ''}</div>
          <div class="entry-subtitle" data-section="mentorshipExperience" data-index="${index}">${formatSubtitle([item.organizationPlatform, item.menteeLevel ? `Mentee Level: ${item.menteeLevel}` : '', item.duration])}</div>
          <p data-section="mentorshipExperience" data-index="${index}">${item.description || ''}</p>
        </div>
      `).join('')}
    </div>` : ''}

    <!-- Research Grants -->
    ${nonEmptyResearchGrants.length > 0 ? `
    <div class="section" data-section="researchGrants">
      <div class="section-title" data-section="researchGrants">Research Grants</div>
      ${nonEmptyResearchGrants.map((item: any, index: number) => `
        <div class="entry" data-section="researchGrants" data-index="${index}">
          <div class="entry-title" data-section="researchGrants" data-index="${index}">${item.title || ''}</div>
          <div class="entry-subtitle" data-section="researchGrants" data-index="${index}">${formatSubtitle([item.agency, item.amount ? `Amount: ${item.amount}` : '', item.year])}</div>
          <p data-section="researchGrants" data-index="${index}">${item.description || ''}</p>
        </div>
      `).join('')}
    </div>` : ''}

    <!-- Publications -->
    ${nonEmptyPublications.length > 0 ? `
    <div class="section" data-section="publications">
      <div class="section-title" data-section="publications">Publications</div>
      ${nonEmptyPublications.map((item: any, index: number) => `
        <div class="entry" data-section="publications" data-index="${index}">
          <div class="entry-title" data-section="publications" data-index="${index}">${item.title || ''}</div>
          <div class="entry-subtitle" data-section="publications" data-index="${index}">${formatSubtitle([item.journalPublisher, item.publicationType, item.year])}</div>
          ${item.authors ? `<p><strong>Authors:</strong> ${item.authors}</p>` : ''}
          ${item.urlDoi ? `<p><a href="${item.urlDoi}" target="_blank" style="color: var(--primary-color);">${item.urlDoi}</a></p>` : ''}
        </div>
      `).join('')}
    </div>` : ''}

    <!-- Patents -->
    ${nonEmptyPatents.length > 0 ? `
    <div class="section" data-section="patents">
      <div class="section-title" data-section="patents">Patents</div>
      ${nonEmptyPatents.map((item: any, index: number) => `
        <div class="entry" data-section="patents" data-index="${index}">
          <div class="entry-title" data-section="patents" data-index="${index}">${item.title || ''}</div>
          <div class="entry-subtitle" data-section="patents" data-index="${index}">${formatSubtitle([item.patentNumber ? `Patent #: ${item.patentNumber}` : '', item.issuingAuthority, item.year])}</div>
          ${item.status ? `<p><strong>Status:</strong> ${item.status}</p>` : ''}
        </div>
      `).join('')}
    </div>` : ''}

    <!-- Test Scores -->
    ${nonEmptyTestScores.length > 0 ? `
    <div class="section" data-section="testScores">
      <div class="section-title" data-section="testScores">Test Scores</div>
      ${nonEmptyTestScores.map((item: any, index: number) => `
        <div class="entry" data-section="testScores" data-index="${index}">
          <div class="entry-title" data-section="testScores" data-index="${index}">${item.testName || ''}</div>
          <div class="entry-subtitle" data-section="testScores" data-index="${index}">Score: ${item.score || ''}${item.percentileRank ? ` (${item.percentileRank} percentile)` : ''}</div>
          ${item.year ? `<div class="entry-date">${item.year}</div>` : ''}
        </div>
      `).join('')}
    </div>` : ''}

    <!-- Scholarships -->
    ${nonEmptyScholarships.length > 0 ? `
    <div class="section" data-section="scholarships">
      <div class="section-title" data-section="scholarships">Scholarships</div>
      ${nonEmptyScholarships.map((item: any, index: number) => `
        <div class="entry" data-section="scholarships" data-index="${index}">
          <div class="entry-title" data-section="scholarships" data-index="${index}">${item.name || ''}</div>
          <div class="entry-subtitle" data-section="scholarships" data-index="${index}">${formatSubtitle([item.provider || item.organization, item.amount])}</div>
          ${item.year ? `<div class="entry-date">${item.year}</div>` : ''}
          <p data-section="scholarships" data-index="${index}">${item.description || ''}</p>
        </div>
      `).join('')}
    </div>` : ''}

    <!-- Awards -->
    ${nonEmptyAwards.length > 0 ? `
    <div class="section" data-section="awards">
      <div class="section-title" data-section="awards">Awards</div>
      ${nonEmptyAwards.map((item: any, index: number) => `
        <div class="entry" data-section="awards" data-index="${index}">
          <div class="entry-title" data-section="awards" data-index="${index}">${item.title || ''}</div>
          <div class="entry-subtitle" data-section="awards" data-index="${index}">${formatSubtitle([item.organization, item.issueYear || item.year])}</div>
          ${item.description ? `<p>${item.description}</p>` : ''}
        </div>
      `).join('')}
    </div>` : ''}

    <!-- Speaking Engagements -->
    ${nonEmptySpeakingEngagements.length > 0 ? `
    <div class="section" data-section="speakingEngagements">
      <div class="section-title" data-section="speakingEngagements">Speaking Engagements</div>
      ${nonEmptySpeakingEngagements.map((item: any, index: number) => `
        <div class="entry" data-section="speakingEngagements" data-index="${index}">
          <div class="entry-title" data-section="speakingEngagements" data-index="${index}">${item.topic || ''}</div>
          <div class="entry-subtitle" data-section="speakingEngagements" data-index="${index}">${formatSubtitle([item.eventName, item.date])}</div>
          <p data-section="speakingEngagements" data-index="${index}">${item.description || ''}</p>
        </div>
      `).join('')}
    </div>` : ''}

    <!-- Memberships -->
    ${nonEmptyMemberships.length > 0 ? `
    <div class="section" data-section="memberships">
      <div class="section-title" data-section="memberships">Memberships</div>
      ${nonEmptyMemberships.map((item: any, index: number) => `
        <div class="entry" data-section="memberships" data-index="${index}">
          <div class="entry-title" data-section="memberships" data-index="${index}">${item.membershipName || ''}</div>
          <div class="entry-subtitle" data-section="memberships" data-index="${index}">${formatSubtitle([item.organizationName, item.year])}</div>
          <p data-section="memberships" data-index="${index}">${item.description || ''}</p>
        </div>
      `).join('')}
    </div>` : ''}

    <!-- Workshops -->
    ${nonEmptyWorkshops.length > 0 ? `
    <div class="section" data-section="workshops">
      <div class="section-title" data-section="workshops">Workshops</div>
      ${nonEmptyWorkshops.map((item: any, index: number) => `
        <div class="entry" data-section="workshops" data-index="${index}">
          <div class="entry-title" data-section="workshops" data-index="${index}">${item.programTitle || ''}</div>
          <div class="entry-subtitle" data-section="workshops" data-index="${index}">${formatSubtitle([item.conductedBy, item.year])}</div>
          <p data-section="workshops" data-index="${index}">${item.description || ''}</p>
        </div>
      `).join('')}
    </div>` : ''}

    <!-- Co-curricular Activities -->
    ${nonEmptyCoCurricular.length > 0 ? `
    <div class="section" data-section="coCurricular">
      <div class="section-title" data-section="coCurricular">Co-curricular Activities</div>
      ${nonEmptyCoCurricular.map((item: any, index: number) => `
        <div class="entry" data-section="coCurricular" data-index="${index}">
          <div class="entry-title" data-section="coCurricular" data-index="${index}">${item.activity || ''}</div>
          <div class="entry-subtitle" data-section="coCurricular" data-index="${index}">${formatSubtitle([item.organization, item.role])}</div>
          ${item.year ? `<div class="entry-date">${item.year}</div>` : ''}
          <p data-section="coCurricular" data-index="${index}">${item.description || ''}</p>
        </div>
      `).join('')}
    </div>` : ''}

    <!-- Extracurricular Activities -->
    ${nonEmptyExtracurricular.length > 0 ? `
    <div class="section" data-section="extracurricular">
      <div class="section-title" data-section="extracurricular">Extracurricular Activities</div>
      ${nonEmptyExtracurricular.map((item: any, index: number) => `
        <div class="entry" data-section="extracurricular" data-index="${index}">
          <div class="entry-title" data-section="extracurricular" data-index="${index}">${item.activity || ''}</div>
          <div class="entry-subtitle" data-section="extracurricular" data-index="${index}">${formatSubtitle([item.organization, item.role])}</div>
          ${item.year ? `<div class="entry-date">${item.year}</div>` : ''}
          <p data-section="extracurricular" data-index="${index}">${item.description || ''}</p>
        </div>
      `).join('')}
    </div>` : ''}

    <!-- Key Achievements -->
    ${nonEmptyKeyAchievements.length > 0 ? `
    <div class="section" data-section="keyAchievements">
      <div class="section-title" data-section="keyAchievements">Key Achievements</div>
      <ul data-section="keyAchievements">
        ${nonEmptyKeyAchievements.map((achievement: any, index: number) => `<li data-section="keyAchievements" data-index="${index}">${achievement}</li>`).join('')}
      </ul>
    </div>` : ''}

    <!-- Key Responsibilities -->
    ${nonEmptyResponsibilities.length > 0 ? `
    <div class="section" data-section="responsibilities">
      <div class="section-title" data-section="responsibilities">Key Responsibilities</div>
      <ul data-section="responsibilities">
        ${nonEmptyResponsibilities.map((line: string, index: number) => `<li data-section="responsibilities" data-index="${index}">${line.trim()}</li>`).join('')}
      </ul>
    </div>` : ''}

    <!-- Tools -->
    ${nonEmptyTools.length > 0 ? `
    <div class="section" data-section="tools">
      <div class="section-title" data-section="tools">Tools & Technologies</div>
      <ul data-section="tools">
        ${nonEmptyTools.map((line: string, index: number) => `<li data-section="tools" data-index="${index}">${line.trim()}</li>`).join('')}
      </ul>
    </div>` : ''}

    <!-- Custom Sections -->
    ${nonEmptyCustomSections.length > 0 ? data.customSections.filter((section: any) => section.isVisible && section.entries && hasNonEmptyItems(section.entries)).map((section: any) => `
    <div class="section" data-section="customSections">
      <div class="section-title" data-section="customSections">${section.heading || 'Custom Section'}</div>
      ${section.entries && section.entries.length > 0 ? section.entries.filter((entry: any) => entry.isVisible && (entry.title || entry.description)).map((entry: any, entryIndex: number) => `
        <div class="entry" data-section="customSections" data-index="${entryIndex}">
          <div class="entry-title" data-section="customSections" data-index="${entryIndex}">${entry.title || ''}${entry.title && entry.organization ? ' at ' : ''}${entry.organization || ''}</div>
          ${entry.date ? `<div class="entry-date" data-section="customSections" data-index="${entryIndex}">${entry.date}</div>` : ''}
          ${entry.description ? `<p data-section="customSections" data-index="${entryIndex}">${entry.description}</p>` : ''}
        </div>
      `).join('') : '<p style="color: #777; font-style: italic;">No entries in this section</p>'}
    </div>
    `).join('') : ''}

</div>
</body>
</html>`
}