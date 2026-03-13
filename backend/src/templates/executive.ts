export function buildExecutiveTemplate(data: any, theme?: any): string {
  const defaultTheme = {
    primary: "#3B82F6",
    secondary: "#666666",
    background: "#ffffff",
    headingFont: "Arial",
    bodyFont: "Arial",
  };
  const currentTheme = theme || defaultTheme;

  // Utility function to normalize array fields that may contain objects from DB
  // e.g., hobbies: [{ _id: '...', name: 'Reading' }] → ['Reading']
  const normalizeToStrings = (arr: any[] | undefined): string[] => {
    if (!arr || !Array.isArray(arr)) return [];
    return arr.map((item) => {
      if (typeof item === "string") return item;
      if (item && typeof item === "object" && "name" in item) return item.name;
      return String(item);
    });
  };

  // Utility function to normalize array fields for filtering
  const normalizeToArray = (arr: any[] | undefined): any[] => {
    if (!arr || !Array.isArray(arr)) return [];
    return arr;
  };

  // Font size and family from data (user settings)
  const userFontSize = data.formatting?.bodyFontSize || data.fontSize || 15; // Default 15px
  const userFontFamily =
    data.formatting?.fontFamily || data.fontFamily || "Lato, sans-serif";

  // Calculate responsive font sizes based on user font size
  const baseFontSize = userFontSize;
  const headingFontSize = Math.round(userFontSize * 2.25); // 2.25x base size
  const subheadingFontSize = Math.round(userFontSize * 1.125); // 1.125x base size

  // Helper function to check if an array has meaningful content
  const hasContent = (arr: any): boolean => {
    if (!arr || !Array.isArray(arr)) return false;
    if (arr.length === 0) return false;
    return arr.some((item: any) => {
      if (typeof item === "string") return item.trim().length > 0;
      if (typeof item === "object" && item !== null) {
        return Object.values(item).some(
          (val: any) => typeof val === "string" && val.trim().length > 0
        );
      }
      return false;
    });
  };

  // Helper to safely get non-empty array
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

  // Helper to safely format subtitle with multiple fields
  const formatSubtitle = (parts: (string | undefined | null)[]): string => {
    const filtered = parts.filter(part => part && typeof part === "string" && part.trim().length > 0);
    return filtered.join(" | ");
  };

  // Helper to safely format date range
  const formatDateRange = (startDate?: string, endDate?: string): string => {
    if (!startDate && !endDate) return "";
    if (startDate && !endDate) return startDate;
    if (!startDate && endDate) return endDate;
    return `${startDate} – ${endDate}`;
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
  const nonEmptyKeyAchievements = getNonEmptyArray(data.keyAchievements);
  const nonEmptyResponsibilities = getNonEmptyArray(
    Array.isArray(data.responsibilities)
      ? data.responsibilities
      : (data.responsibilities || "").split("\n")
  );
  const nonEmptyTools = getNonEmptyArray(
    Array.isArray(data.tools) ? data.tools : (data.tools || "").split("\n")
  );

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
      --heading-font: ${currentTheme.headingFont || "Monospace"};
      --body-font: ${currentTheme.bodyFont || "Arial"};
    }

    body {
      font-family: ${userFontFamily};
      color: #1a1a1a;
      line-height: 1.6;
      background: #f5f5f5;
      font-size: ${baseFontSize}px;
      margin: 0;
      padding: 0;
    }
    
    .container {
      max-width: 1200px;
      width: 100%;
      margin: 0 auto;
      background: #ffffff;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      display: flex;
      min-height: 100vh;
    }
    
    /* Left Sidebar */
    .sidebar {
      width: 35%;
      background: #E8E8E8;
      padding: 40px 30px;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    
    .profile-photo-container {
      width: 200px;
      height: 200px;
      margin-bottom: 30px;
      position: relative;
    }
    
    .profile-photo {
      width: 100%;
      height: 100%;
      object-fit: cover;
      clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
    }
    
    .profile-photo-placeholder {
      width: 100%;
      height: 100%;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: ${Math.round(baseFontSize * 4)}px;
      font-weight: 700;
      font-family: var(--heading-font), sans-serif;
    }
    
    .sidebar-section {
      width: 100%;
      margin-bottom: 30px;
    }
    
    .sidebar-title {
      background: var(--primary-color);
      color: white;
      padding: 10px 15px;
      font-size: ${Math.round(baseFontSize * 0.933)}px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 15px;
      font-family: var(--heading-font), sans-serif;
    }
    
    .sidebar-content {
      padding: 0 15px;
      font-size: ${Math.round(baseFontSize * 0.867)}px;
      line-height: 1.6;
      color: #333;
    }
    
    .sidebar-content p {
      text-align: justify;
      margin-bottom: 10px;
    }
    
    .contact-item {
      display: flex;
      align-items: flex-start;
      margin-bottom: 10px;
      word-break: break-word;
    }
    
    .contact-label {
      font-weight: 700;
      margin-right: 5px;
      white-space: nowrap;
      min-width: 80px;
    }
    
    .contact-value {
      color: #555;
      flex: 1;
    }
    
    .skills-list {
      list-style: none;
      padding: 0;
    }
    
    .skills-list li {
      padding: 5px 0;
      border-bottom: 1px solid #d0d0d0;
      font-size: ${Math.round(baseFontSize * 0.867)}px;
    }
    
    .skills-list li:last-child {
      border-bottom: none;
    }
    
    .hobbies-list {
      font-size: ${Math.round(baseFontSize * 0.867)}px;
      line-height: 1.8;
    }
    
    /* Main Content Area */
    .main-content {
      width: 65%;
      padding: 40px 50px;
    }
    
    .header {
      margin-bottom: 40px;
    }
    
    .name {
      font-family: var(--heading-font), serif;
      font-size: ${Math.round(baseFontSize * 3.667)}px;
      font-weight: 700;
      color: #000;
      margin-bottom: 3px;
      letter-spacing: 0.02em;
      text-transform: uppercase;
    }
    
    .role {
      font-size: ${Math.round(baseFontSize * 1.2)}px;
      color: #555;
      font-weight: 400;
      margin-bottom: 20px;
    }
    
    .section {
      margin-bottom: 35px;
    }
    
    .section-title {
      font-family: var(--heading-font), serif;
      font-size: ${Math.round(baseFontSize * 1.067)}px;
      font-weight: 700;
      color: var(--primary-color);
      text-transform: uppercase;
      letter-spacing: 0.1em;
      margin-bottom: 20px;
      padding-bottom: 8px;
      border-bottom: 2px solid #000;
    }
    
    .entry {
      margin-bottom: 25px;
      page-break-inside: avoid;
    }
    
    .entry-header {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      margin-bottom: 8px;
      gap: 15px;
    }
    
    .entry-title {
      font-weight: 700;
      font-size: ${Math.round(baseFontSize * 1.067)}px;
      color: #000;
    }
    
    .entry-date {
      font-size: ${Math.round(baseFontSize * 0.867)}px;
      color: #666;
      white-space: nowrap;
      font-style: italic;
    }
    
    .entry-subtitle {
      color: #555;
      font-size: ${baseFontSize}px;
      margin-bottom: 8px;
      font-style: italic;
    }
    
    .entry-content {
      font-size: ${Math.round(baseFontSize * 0.933)}px;
      color: #333;
      line-height: 1.7;
      text-align: justify;
    }

    .entry-content ul {
      margin: 8px 0 8px 20px;
      padding: 0;
      list-style-type: disc;
    }

    .entry-content li {
      margin: 4px 0;
      padding: 0;
      color: #333;
    }

    .entry-content b {
      font-weight: 700;
      color: #000;
    }
    
    .entry-content ol {
      margin: 8px 0 8px 20px;
      padding: 0;
    }
    
    .entry-content ol li {
      margin: 6px 0;
      padding-left: 5px;
    }
    
    /* Education Styles */
    .education-field {
      color: var(--primary-color);
      font-weight: 600;
      margin-bottom: 5px;
    }
    
    .education-location {
      color: #666;
      font-style: italic;
      margin-bottom: 8px;
      font-size: ${Math.round(baseFontSize * 0.933)}px;
    }
    
    .education-description {
      font-size: ${Math.round(baseFontSize * 0.933)}px;
      color: #333;
      line-height: 1.7;
      text-align: justify;
      margin-top: 10px;
    }

    .education-description ul {
      margin: 8px 0 8px 20px;
      padding: 0;
      list-style-type: disc;
    }

    .education-description li {
      margin: 4px 0;
      padding: 0;
      color: #333;
    }

    .education-description b {
      font-weight: 700;
      color: #000;
    }
    
    .education-achievements {
      margin-top: 12px;
      padding-top: 12px;
      border-top: 1px solid #e0e0e0;
    }

    .education-achievements h4 {
      font-size: ${Math.round(baseFontSize * 0.933)}px;
      font-weight: 700;
      color: #000;
      margin-bottom: 8px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .education-achievements ul {
      margin: 0;
      padding-left: 0;
      list-style: none;
    }

    .education-achievements li {
      position: relative;
      padding-left: 15px;
      margin-bottom: 5px;
      color: #333;
      font-size: ${Math.round(baseFontSize * 0.933)}px;
    }

    .education-achievements li:before {
      content: "▪";
      color: var(--primary-color);
      font-weight: bold;
      position: absolute;
      left: 0;
    }

    /* Metrics Grid for Professional Context */
    .metrics-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
      gap: 12px;
      margin-bottom: 20px;
    }

    .metric-item {
      background: #f5f5f5;
      padding: 12px;
      border-radius: 4px;
    }

    .metric-value {
      font-size: ${Math.round(baseFontSize * 1.2)}px;
      font-weight: 700;
      color: var(--primary-color);
      line-height: 1.2;
    }

    .metric-label {
      font-size: ${Math.round(baseFontSize * 0.8)}px;
      color: #666;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-top: 2px;
    }

    /* Tags for Tools, Methodologies, etc */
    .tags-container {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-top: 10px;
    }

    .tag {
      background: #f0f0f0;
      color: #333;
      padding: 4px 10px;
      border-radius: 3px;
      font-size: ${Math.round(baseFontSize * 0.8)}px;
      border: 1px solid #d0d0d0;
    }
    
    @media print {
      body { background: white; }
      .container { margin: 0; box-shadow: none; }
    }
    
    @media screen and (max-width: 768px) {
      .container {
        flex-direction: column;
      }
      .sidebar, .main-content {
        width: 100%;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    
    <!-- Left Sidebar -->
    <div class="sidebar">
      <div class="profile-photo-container">
        ${
          data.personal?.photoUrl || data.personal?.image
            ? `
          <img src="${data.personal.photoUrl || data.personal.image}" alt="${
                data.personal?.name || "Profile"
              }" class="profile-photo" />
        `
            : `
          <div class="profile-photo-placeholder">
            ${
              data.personal?.name
                ? data.personal.name.charAt(0).toUpperCase()
                : "?"
            }
          </div>
        `
        }
      </div>
      
      <!-- Profile Summary in Sidebar -->
      ${
        data.sectionVisibility?.summary !== false &&
        data.summary &&
        data.summary.trim()
          ? `
        <div class="sidebar-section" data-section="summary">
          <div class="sidebar-title" data-section="summary">PROFILE</div>
          <div class="sidebar-content" data-section="summary">
            <p>${data.summary}</p>
          </div>
        </div>
      `
          : ""
      }
      
      <!-- Objective -->
      ${
        data.objective && data.objective.trim()
          ? `
        <div class="sidebar-section" data-section="objective">
          <div class="sidebar-title" data-section="objective">OBJECTIVE</div>
          <div class="sidebar-content" data-section="objective">
            <p>${data.objective}</p>
          </div>
        </div>
      `
          : ""
      }
      
      <!-- Career Objective -->
      ${
        typeof data.careerObjective === "string" &&
        data.careerObjective.trim().length > 0
          ? `
        <div class="sidebar-section" data-section="careerObjective">
          <div class="sidebar-title" data-section="careerObjective">CAREER OBJECTIVE</div>
          <div class="sidebar-content" data-section="careerObjective">
            <p>${data.careerObjective}</p>
          </div>
        </div>
      `
          : ""
      }
      
      <!-- Contact Information -->
      ${
        data.personal
          ? `
        <div class="sidebar-section" data-section="personal">
          <div class="sidebar-title" data-section="personal">CONTACT</div>
          <div class="sidebar-content" data-section="personal">
            ${
              data.personal?.fullAddress || data.personal?.location || data.personal?.country || data.personal?.pinCode
                ? (() => {
                    const addressParts = [
                      data.personal?.fullAddress,
                      data.personal?.location,
                      data.personal?.country,
                      data.personal?.pinCode
                    ].filter(Boolean);
                    return `
              <div class="contact-item">
                <span class="contact-label">Address:</span>
                <span class="contact-value">${addressParts.join(", ")}</span>
              </div>
            `;
                  })()
                : ""
            }
            ${
              data.personal?.phone
                ? `
              <div class="contact-item">
                <span class="contact-label">Mobile No:</span>
                <span class="contact-value">${data.personal.phone}</span>
              </div>
            `
                : ""
            }
            ${
              data.personal?.alternatePhone
                ? `
              <div class="contact-item">
                <span class="contact-label">Alt. Phone:</span>
                <span class="contact-value">${data.personal.alternatePhone}</span>
              </div>
            `
                : ""
            }
            ${
              data.personal?.email
                ? `
              <div class="contact-item">
                <span class="contact-label">EMAIL:</span>
                <span class="contact-value">${data.personal.email}</span>
              </div>
            `
                : ""
            }
            ${
              data.personal?.linkedinUrl
                ? `
              <div class="contact-item">
                <span class="contact-label">LinkedIn:</span>
                <span class="contact-value"><a href="${
                  data.personal.linkedinUrl
                }" target="_blank" style="color: var(--primary-color); text-decoration: none;">${data.personal.linkedinUrl
                    .replace("https://", "")
                    .replace("http://", "")}</a></span>
              </div>
            `
                : ""
            }
            ${
              data.personal?.githubUrl
                ? `
              <div class="contact-item">
                <span class="contact-label">GitHub:</span>
                <span class="contact-value"><a href="${
                  data.personal.githubUrl
                }" target="_blank" style="color: var(--primary-color); text-decoration: none;">${data.personal.githubUrl
                    .replace("https://", "")
                    .replace("http://", "")}</a></span>
              </div>
            `
                : ""
            }
            ${
              data.personal?.portfolioUrl
                ? `
              <div class="contact-item">
                <span class="contact-label">Portfolio:</span>
                <span class="contact-value"><a href="${
                  data.personal.portfolioUrl
                }" target="_blank" style="color: var(--primary-color); text-decoration: none;">${data.personal.portfolioUrl
                    .replace("https://", "")
                    .replace("http://", "")}</a></span>
              </div>
            `
                : ""
            }
            ${
              data.personal?.website
                ? `
              <div class="contact-item">
                <span class="contact-label">Website:</span>
                <span class="contact-value"><a href="${
                  data.personal.website
                }" target="_blank" style="color: var(--primary-color); text-decoration: none;">${data.personal.website
                    .replace("https://", "")
                    .replace("http://", "")}</a></span>
              </div>
            `
                : ""
            }
            ${
              data.personal?.twitterUrl
                ? `
              <div class="contact-item">
                <span class="contact-label">Twitter:</span>
                <span class="contact-value"><a href="${
                  data.personal.twitterUrl
                }" target="_blank" style="color: var(--primary-color); text-decoration: none;">${data.personal.twitterUrl
                    .replace("https://", "")
                    .replace("http://", "")}</a></span>
              </div>
            `
                : ""
            }
            ${
              data.personal?.facebookUrl
                ? `
              <div class="contact-item">
                <span class="contact-label">Facebook:</span>
                <span class="contact-value"><a href="${
                  data.personal.facebookUrl
                }" target="_blank" style="color: var(--primary-color); text-decoration: none;">${data.personal.facebookUrl
                    .replace("https://", "")
                    .replace("http://", "")}</a></span>
              </div>
            `
                : ""
            }
            ${
              data.personal?.instagramUrl
                ? `
              <div class="contact-item">
                <span class="contact-label">Instagram:</span>
                <span class="contact-value"><a href="${
                  data.personal.instagramUrl
                }" target="_blank" style="color: var(--primary-color); text-decoration: none;">${data.personal.instagramUrl
                    .replace("https://", "")
                    .replace("http://", "")}</a></span>
              </div>
            `
                : ""
            }
            ${
              data.personal?.behanceUrl
                ? `
              <div class="contact-item">
                <span class="contact-label">Behance:</span>
                <span class="contact-value"><a href="${
                  data.personal.behanceUrl
                }" target="_blank" style="color: var(--primary-color); text-decoration: none;">${data.personal.behanceUrl
                    .replace("https://", "")
                    .replace("http://", "")}</a></span>
              </div>
            `
                : ""
            }
            ${
              data.personal?.dribbbleUrl
                ? `
              <div class="contact-item">
                <span class="contact-label">Dribbble:</span>
                <span class="contact-value"><a href="${
                  data.personal.dribbbleUrl
                }" target="_blank" style="color: var(--primary-color); text-decoration: none;">${data.personal.dribbbleUrl
                    .replace("https://", "")
                    .replace("http://", "")}</a></span>
              </div>
            `
                : ""
            }
            ${
              data.personal?.stackoverflowUrl
                ? `
              <div class="contact-item">
                <span class="contact-label">Stack Overflow:</span>
                <span class="contact-value"><a href="${
                  data.personal.stackoverflowUrl
                }" target="_blank" style="color: var(--primary-color); text-decoration: none;">${data.personal.stackoverflowUrl
                    .replace("https://", "")
                    .replace("http://", "")}</a></span>
              </div>
            `
                : ""
            }
            ${
              data.personal?.mediumUrl
                ? `
              <div class="contact-item">
                <span class="contact-label">Medium:</span>
                <span class="contact-value"><a href="${
                  data.personal.mediumUrl
                }" target="_blank" style="color: var(--primary-color); text-decoration: none;">${data.personal.mediumUrl
                    .replace("https://", "")
                    .replace("http://", "")}</a></span>
              </div>
            `
                : ""
            }

            ${
              data.personal?.personalInfoDisplay === "inline"
                ? `
            ${
              data.personal?.fathersName
                ? `
              <div class="contact-item">
                <span class="contact-label">Father's Name:</span>
                <span class="contact-value">${data.personal.fathersName}</span>
              </div>
            `
                : ""
            }
            ${
              data.personal?.dob
                ? `
              <div class="contact-item">
                <span class="contact-label">DOB:</span>
                <span class="contact-value">${data.personal.dob}</span>
              </div>
            `
                : ""
            }
            ${
              data.personal?.gender
                ? `
              <div class="contact-item">
                <span class="contact-label">Gender:</span>
                <span class="contact-value">${data.personal.gender}</span>
              </div>
            `
                : ""
            }
            ${
              data.personal?.maritalStatus
                ? `
              <div class="contact-item">
                <span class="contact-label">Marital Status:</span>
                <span class="contact-value">${data.personal.maritalStatus}</span>
              </div>
            `
                : ""
            }
            ${
              data.personal?.nationality
                ? `
              <div class="contact-item">
                <span class="contact-label">Nationality:</span>
                <span class="contact-value">${data.personal.nationality}</span>
              </div>
            `
                : ""
            }
            `
                : ""
            }

          </div>
        </div>
      `
          : ""
      }
      
      <!-- Skills Section -->
      ${
        nonEmptySkills.length > 0
          ? `
        <div class="sidebar-section" data-section="skills">
          <div class="sidebar-title" data-section="skills">TECHNICAL SKILLS</div>
          <div class="sidebar-content" data-section="skills">
            <ul class="skills-list">
              ${nonEmptySkills
                .map(
                  (skill: any, index: number) => `
                <li data-section="skills" data-index="${index}">${
                    typeof skill === "string" ? skill.trim() : skill
                  }</li>
              `
                )
                .join("")}
            </ul>
          </div>
        </div>
      `
          : ""
      }

      <!-- Tools & Technologies (in sidebar) -->
      ${
        nonEmptyToolsTechnologies.length > 0
          ? `
        <div class="sidebar-section" data-section="toolsTechnologies">
          <div class="sidebar-title" data-section="toolsTechnologies">TOOLS & TECH</div>
          <div class="sidebar-content" data-section="toolsTechnologies">
            <ul class="skills-list">
              ${nonEmptyToolsTechnologies
                .map(
                  (item: any, index: number) => `
                <li data-section="toolsTechnologies" data-index="${index}">
                  ${item.name || ''}${item.proficiency ? ` (${item.proficiency})` : ''}${item.experienceDuration ? ` - ${item.experienceDuration}` : ''}
                </li>
              `
                )
                .join("")}
            </ul>
          </div>
        </div>
      `
          : ""
      }

      <!-- Methodologies (in sidebar) -->
      ${
        nonEmptyMethodologies.length > 0
          ? `
        <div class="sidebar-section" data-section="methodologies">
          <div class="sidebar-title" data-section="methodologies">METHODOLOGIES</div>
          <div class="sidebar-content" data-section="methodologies">
            <ul class="skills-list">
              ${nonEmptyMethodologies
                .map(
                  (item: any, index: number) => `
                <li data-section="methodologies" data-index="${index}">
                  ${item.name || ''}${item.certification ? ` (${item.certification})` : ''}${item.experienceDuration ? ` - ${item.experienceDuration} years` : ''}
                </li>
              `
                )
                .join("")}
            </ul>
          </div>
        </div>
      `
          : ""
      }

      <!-- Industry Expertise (in sidebar) -->
      ${
        nonEmptyIndustryExpertise.length > 0
          ? `
        <div class="sidebar-section" data-section="industryExpertise">
          <div class="sidebar-title" data-section="industryExpertise">INDUSTRY EXPERTISE</div>
          <div class="sidebar-content" data-section="industryExpertise">
            <ul class="skills-list">
              ${nonEmptyIndustryExpertise
                .map(
                  (item: any, index: number) => `
                <li data-section="industryExpertise" data-index="${index}">
                  ${item.industry || ''}${item.domainArea ? ` - ${item.domainArea}` : ''}${item.experienceDuration ? ` (${item.experienceDuration} years)` : ''}
                </li>
              `
                )
                .join("")}
            </ul>
          </div>
        </div>
      `
          : ""
      }
      
      <!-- Hobbies -->
      ${
        data.sectionVisibility?.hobbies !== false &&
        data.hobbies &&
        normalizeToStrings(data.hobbies).length > 0
          ? `
        <div class="sidebar-section" data-section="hobbies">
          <div class="sidebar-title" data-section="hobbies">HOBBIES</div>
          <div class="sidebar-content hobbies-list" data-section="hobbies">
            ${normalizeToStrings(data.hobbies).join(", ")}
          </div>
        </div>
      `
          : ""
      }
      
      <!-- Languages -->
      ${
        data.sectionVisibility?.languages !== false &&
        data.languages &&
        normalizeToArray(data.languages).length > 0
          ? `
        <div class="sidebar-section" data-section="languages">
          <div class="sidebar-title" data-section="languages">LANGUAGES</div>
          <div class="sidebar-content" data-section="languages">
            <ul class="skills-list">
              ${normalizeToArray(data.languages)
                .map(
                  (lang: any, index: number) => `
                <li data-section="languages" data-index="${index}">${
                    lang.language || lang.name || lang
                  }${
                    lang.level || lang.proficiency
                      ? ` (${lang.level || lang.proficiency})`
                      : ""
                  }${lang.capability ? ` - ${lang.capability}` : ""}</li>
              `
                )
                .join("")}
            </ul>
          </div>
        </div>
      `
          : ""
      }

      <!-- Certifications (in sidebar if few) -->
      ${
        data.sectionVisibility?.certifications !== false &&
        data.certifications &&
        data.certifications.length > 0 && data.certifications.length <= 3
          ? `
        <div class="sidebar-section" data-section="certifications">
          <div class="sidebar-title" data-section="certifications">CERTIFICATIONS</div>
          <div class="sidebar-content" data-section="certifications">
            <ul class="skills-list">
              ${(data.certifications || [])
                .map(
                  (cert: any, index: number) => `
                <li data-section="certifications" data-index="${index}">
                  ${cert.name || ""}${cert.issuer ? ` - ${cert.issuer}` : ''}${cert.date ? ` (${cert.date})` : ''}
                </li>
              `
                )
                .join("")}
            </ul>
          </div>
        </div>
      `
          : ""
      }

      <!-- Availability & Work Authorization (in sidebar) -->
      ${
        data.availabilityWorkAuth && Object.values(data.availabilityWorkAuth).some(v => v)
          ? `
        <div class="sidebar-section" data-section="availabilityWorkAuth">
          <div class="sidebar-title" data-section="availabilityWorkAuth">AVAILABILITY</div>
          <div class="sidebar-content" data-section="availabilityWorkAuth">
            <ul class="skills-list">
              ${data.availabilityWorkAuth.availabilityNoticePeriod ? `<li>Notice: ${data.availabilityWorkAuth.availabilityNoticePeriod}</li>` : ''}
              ${data.availabilityWorkAuth.workAuthorizationStatus ? `<li>Work Auth: ${data.availabilityWorkAuth.workAuthorizationStatus}</li>` : ''}
              ${data.availabilityWorkAuth.preferredLocation ? `<li>Preferred: ${data.availabilityWorkAuth.preferredLocation}</li>` : ''}
            </ul>
          </div>
        </div>
      `
          : ""
      }

      <!-- Social Profiles (in sidebar) -->
      ${
        nonEmptySocialProfiles.length > 0
          ? `
        <div class="sidebar-section" data-section="socialProfiles">
          <div class="sidebar-title" data-section="socialProfiles">SOCIAL PROFILES</div>
          <div class="sidebar-content" data-section="socialProfiles">
            <ul class="skills-list">
              ${nonEmptySocialProfiles
                .map(
                  (profile: any, index: number) => `
                <li data-section="socialProfiles" data-index="${index}">
                  <a href="${profile.url}" target="_blank" style="color: var(--primary-color);">${profile.platform || "Profile"}</a>
                </li>
              `
                )
                .join("")}
            </ul>
          </div>
        </div>
      `
          : ""
      }
    </div>
    
    <!-- Main Content Area -->
    <div class="main-content">
      <div class="header" data-section="personal">
        <div class="name" data-section="personal">
          ${(() => {
            const name =
              data.personal?.name && data.personal?.name !== "undefined"
                ? data.personal.name
                : "Your Name";
            const parts = name.split(" ");
            const first = parts[0] || "";
            const middle = parts.slice(1, -1).join(" ") || "";
            const last = parts[parts.length - 1] || "";
            return `
              <div>${first}</div>
              ${middle ? `<div>${middle}</div>` : ""}
              <div style="color: var(--primary-color);">${last}</div>
            `;
          })()}
        </div>
      ${
        data.personal?.role
          ? `<div class="role" data-section="personal">${data.personal.role}</div>`
          : ""
      }
      </div>

      <!-- Professional Context -->
      ${
        data.professionalContext && Object.values(data.professionalContext).some(v => v)
          ? `
        <div class="section" data-section="professionalContext">
          <div class="section-title">PROFESSIONAL CONTEXT</div>
          <div class="metrics-grid">
            ${data.professionalContext.totalExperience ? `
            <div class="metric-item">
              <div class="metric-value">${data.professionalContext.totalExperience}</div>
              <div class="metric-label">Total Experience</div>
            </div>` : ''}
            ${data.professionalContext.teamSize ? `
            <div class="metric-item">
              <div class="metric-value">${data.professionalContext.teamSize}</div>
              <div class="metric-label">Team Size</div>
            </div>` : ''}
            ${data.professionalContext.industry ? `
            <div class="metric-item">
              <div class="metric-value">${data.professionalContext.industry}</div>
              <div class="metric-label">Industry</div>
            </div>` : ''}
            ${data.professionalContext.functionalDomain ? `
            <div class="metric-item">
              <div class="metric-value">${data.professionalContext.functionalDomain}</div>
              <div class="metric-label">Domain</div>
            </div>` : ''}
            ${data.professionalContext.geographicScope ? `
            <div class="metric-item">
              <div class="metric-value">${data.professionalContext.geographicScope}</div>
              <div class="metric-label">Geographic Scope</div>
            </div>` : ''}
            ${data.professionalContext.revenueResponsibility ? `
            <div class="metric-item">
              <div class="metric-value">${data.professionalContext.revenueResponsibility}</div>
              <div class="metric-label">Revenue Responsibility</div>
            </div>` : ''}
          </div>
        </div>`
          : ""
      }

      <!-- Personal Details (if not inline) -->
      ${
        data.personal?.personalInfoDisplay !== "inline" &&
        (data.personal?.fathersName ||
          data.personal?.dob ||
          data.personal?.gender ||
          data.personal?.maritalStatus ||
          data.personal?.nationality ||
          data.personal?.passportNo)
          ? `
        <div class="section" data-section="personal">
          <div class="section-title" data-section="personal">PERSONAL DETAILS</div>
          ${
            data.personal?.fathersName
              ? `
            <div class="entry-content">
              <strong>Father's Name:</strong> ${data.personal.fathersName}
            </div>
          `
              : ""
          }
          ${
            data.personal?.dob
              ? `
            <div class="entry-content">
              <strong>Date of Birth:</strong> ${data.personal.dob}
            </div>
          `
              : ""
          }
          ${
            data.personal?.gender
              ? `
            <div class="entry-content">
              <strong>Gender:</strong> ${data.personal.gender}
            </div>
          `
              : ""
          }
          ${
            data.personal?.maritalStatus
              ? `
            <div class="entry-content">
              <strong>Marital Status:</strong> ${data.personal.maritalStatus}
            </div>
          `
              : ""
          }
          ${
            data.personal?.nationality
              ? `
            <div class="entry-content">
              <strong>Nationality:</strong> ${data.personal.nationality}
            </div>
          `
              : ""
          }
          ${
            data.personal?.passportNo
              ? `
            <div class="entry-content">
              <strong>Passport No:</strong> ${data.personal.passportNo}
            </div>
          `
              : ""
          }
        </div>
      `
          : ""
      }

      <!-- Work Experience -->
      ${
        data.sectionVisibility?.experience !== false &&
        data.experience &&
        data.experience.length > 0
          ? `
        <div class="section" data-section="experience">
          <div class="section-title" data-section="experience">WORK EXPERIENCE</div>
          ${(data.experience || [])
            .map(
              (exp: any, index: number) => `
            <div class="entry" data-section="experience" data-index="${index}">
              <div class="entry-header" data-section="experience" data-index="${index}">
                <div class="entry-title" data-section="experience" data-index="${index}">${
                exp.title || ""
              }</div>
                <div class="entry-date" data-section="experience" data-index="${index}">${formatDateRange(exp.startDate, exp.endDate)}</div>
              </div>
              <div class="entry-subtitle" data-section="experience" data-index="${index}">${formatSubtitle([exp.company, exp.location])}</div>
              <div class="entry-content" data-section="experience" data-index="${index}">${
                exp.description || ""
              }</div>
              ${exp.achievements ? `<div class="entry-content" style="margin-top: 8px;"><strong>Achievements:</strong> ${exp.achievements}</div>` : ""}
            </div>
          `
            )
            .join("")}
        </div>
      `
          : ""
      }

      <!-- Internships -->
      ${
        nonEmptyInternships.length > 0
          ? `
        <div class="section" data-section="internships">
          <div class="section-title" data-section="internships">INTERNSHIPS</div>
          ${nonEmptyInternships
            .map(
              (item: any, index: number) => `
            <div class="entry" data-section="internships" data-index="${index}">
              <div class="entry-header" data-section="internships" data-index="${index}">
                <div class="entry-title" data-section="internships" data-index="${index}">${
                  item.title || ""
                }</div>
                <div class="entry-date" data-section="internships" data-index="${index}">${item.duration || ""}</div>
              </div>
              <div class="entry-subtitle" data-section="internships" data-index="${index}">${
                item.company || ""
              }</div>
              <div class="entry-content" data-section="internships" data-index="${index}">${
                item.description || ""
              }</div>
            </div>
          `
            )
            .join("")}
        </div>
      `
          : ""
      }

      <!-- Training Programs -->
      ${
        nonEmptyTrainingPrograms.length > 0
          ? `
        <div class="section" data-section="trainingPrograms">
          <div class="section-title" data-section="trainingPrograms">TRAINING PROGRAMS</div>
          ${nonEmptyTrainingPrograms
            .map(
              (item: any, index: number) => `
            <div class="entry" data-section="trainingPrograms" data-index="${index}">
              <div class="entry-header" data-section="trainingPrograms" data-index="${index}">
                <div class="entry-title" data-section="trainingPrograms" data-index="${index}">${
                  item.name || ""
                }</div>
                <div class="entry-date" data-section="trainingPrograms" data-index="${index}">${
                  item.completionDate || ""
                }</div>
              </div>
              <div class="entry-subtitle" data-section="trainingPrograms" data-index="${index}">${formatSubtitle([item.provider || item.organization, item.duration])}</div>
              <div class="entry-content" data-section="trainingPrograms" data-index="${index}">${
                item.description || ""
              }</div>
            </div>
          `
            )
            .join("")}
        </div>
      `
          : ""
      }

      <!-- Education -->
      ${
        data.sectionVisibility?.education !== false &&
        data.education &&
        data.education.length > 0
          ? `
        <div class="section" data-section="education">
          <div class="section-title" data-section="education">EDUCATION</div>
          ${(data.education || [])
            .map(
              (edu: any, index: number) => `
            <div class="entry" data-section="education" data-index="${index}">
              <div class="entry-header" data-section="education" data-index="${index}">
                <div class="entry-title" data-section="education" data-index="${index}">
                  ${edu.degree || ""}${edu.field ? ` in ${edu.field}` : ""}${edu.qualification ? ` (${edu.qualification})` : ""}
                </div>
                <div class="entry-date" data-section="education" data-index="${index}">${edu.graduationDate || ""}</div>
              </div>
              
              ${
                edu.school
                  ? `<div class="entry-subtitle" data-section="education" data-index="${index}">${edu.school}${edu.location ? `, ${edu.location}` : ""}</div>`
                  : ""
              }
              ${
                edu.grade
                  ? `<div class="education-field" data-section="education" data-index="${index}"> ${edu.grade}</div>`
                  : ""
              }
              
              ${
                edu.description
                  ? `
                <div class="education-description" data-section="education" data-index="${index}">
                  ${edu.description}
                </div>
              `
                  : ""
              }
              
              ${
                edu.achievements && edu.achievements.length > 0
                  ? `
                <div class="education-achievements" data-section="education" data-index="${index}">
                  <h4>Achievements & Honors</h4>
                  <ul>
                    ${edu.achievements
                      .filter((achievement: string) => achievement.trim())
                      .map(
                        (achievement: string, achIndex: number) =>
                          `<li data-section="education" data-index="${index}" data-item-index="${achIndex}">${achievement}</li>`
                      )
                      .join("")}
                  </ul>
                </div>
              `
                  : ""
              }
            </div>
          `
            )
            .join("")}
        </div>
      `
          : ""
      }

      <!-- Academic Projects -->
      ${
        nonEmptyAcademicProjects.length > 0
          ? `
        <div class="section" data-section="academicProjects">
          <div class="section-title" data-section="academicProjects">ACADEMIC PROJECTS</div>
          ${nonEmptyAcademicProjects
            .map(
              (item: any, index: number) => `
            <div class="entry" data-section="academicProjects" data-index="${index}">
              <div class="entry-header" data-section="academicProjects" data-index="${index}">
                <div class="entry-title" data-section="academicProjects" data-index="${index}">${
                  item.name || item.title || ""
                }</div>
                <div class="entry-date" data-section="academicProjects" data-index="${index}">${
                  item.duration || ""
                }</div>
              </div>
              <div class="entry-subtitle" data-section="academicProjects" data-index="${index}">${formatSubtitle([item.institution, item.course ? `Course: ${item.course}` : ""])}</div>
              <div class="entry-content" data-section="academicProjects" data-index="${index}">${
                item.description || ""
              }</div>
              ${
                item.technologies
                  ? `<div class="entry-content" data-section="academicProjects" data-index="${index}"><strong>Technologies:</strong> ${Array.isArray(item.technologies) ? item.technologies.join(', ') : item.technologies}</div>`
                  : ""
              }
              ${
                item.url
                  ? `<div class="entry-content" data-section="academicProjects" data-index="${index}"><a href="${item.url}" target="_blank" style="color: var(--primary-color);">View Project</a></div>`
                  : ""
              }
            </div>
          `
            )
            .join("")}
        </div>
      `
          : ""
      }

      <!-- Client Projects -->
      ${
        nonEmptyClientProjects.length > 0
          ? `
        <div class="section" data-section="clientProjects">
          <div class="section-title" data-section="clientProjects">CLIENT PROJECTS</div>
          ${nonEmptyClientProjects
            .map(
              (item: any, index: number) => `
            <div class="entry" data-section="clientProjects" data-index="${index}">
              <div class="entry-header" data-section="clientProjects" data-index="${index}">
                <div class="entry-title" data-section="clientProjects" data-index="${index}">${
                  item.name || ""
                }</div>
                <div class="entry-date" data-section="clientProjects" data-index="${index}">${
                  item.duration || ""
                }</div>
              </div>
              <div class="entry-subtitle" data-section="clientProjects" data-index="${index}">${formatSubtitle([item.clientOrganization, item.role ? `Role: ${item.role}` : ""])}</div>
              <div class="entry-content" data-section="clientProjects" data-index="${index}">${
                item.description || ""
              }</div>
              ${
                item.toolsTechnologies
                  ? `<div class="entry-content" data-section="clientProjects" data-index="${index}"><strong>Tools:</strong> ${item.toolsTechnologies}</div>`
                  : ""
              }
              ${
                item.projectUrl
                  ? `<div class="entry-content" data-section="clientProjects" data-index="${index}"><a href="${item.projectUrl}" target="_blank" style="color: var(--primary-color);">View Project</a></div>`
                  : ""
              }
            </div>
          `
            )
            .join("")}
        </div>
      `
          : ""
      }

      <!-- Portfolio -->
      ${
        nonEmptyPortfolio.length > 0
          ? `
        <div class="section" data-section="portfolio">
          <div class="section-title" data-section="portfolio">PORTFOLIO</div>
          ${nonEmptyPortfolio
            .map(
              (item: any, index: number) => `
            <div class="entry" data-section="portfolio" data-index="${index}">
              <div class="entry-header" data-section="portfolio" data-index="${index}">
                <div class="entry-title" data-section="portfolio" data-index="${index}">${
                  item.name || ""
                }</div>
                <div class="entry-date" data-section="portfolio" data-index="${index}">${formatSubtitle([item.type, item.platform])}</div>
              </div>
              <div class="entry-content" data-section="portfolio" data-index="${index}">${
                item.description || ""
              }</div>
              ${
                item.url
                  ? `<div class="entry-content" data-section="portfolio" data-index="${index}"><a href="${item.url}" target="_blank" style="color: var(--primary-color);">View Portfolio</a></div>`
                  : ""
              }
            </div>
          `
            )
            .join("")}
        </div>
      `
          : ""
      }

      <!-- Key Projects -->
      ${
        data.sectionVisibility?.projects !== false &&
        data.projects &&
        data.projects.length > 0
          ? `
        <div class="section" data-section="projects">
          <div class="section-title" data-section="projects">KEY PROJECTS</div>
          ${(data.projects || [])
            .map(
              (project: any, index: number) => `
            <div class="entry" data-section="projects" data-index="${index}">
              <div class="entry-header" data-section="projects" data-index="${index}">
                <div class="entry-title" data-section="projects" data-index="${index}">${
                project.name || ""
              }</div>
                ${(() => {
                  const dateRange = formatDateRange(project.startDate, project.endDate);
                  return dateRange ? `<div class="entry-date" data-section="projects" data-index="${index}">${dateRange}</div>` : "";
                })()}
              </div>
              <div class="entry-subtitle" data-section="projects" data-index="${index}">${
                project.technologies || ""
              }</div>
              <div class="entry-content" data-section="projects" data-index="${index}">${
                project.description || ""
              }</div>
              ${
                project.url
                  ? `<div class="entry-content" style="margin-top: 8px;"><strong>Link:</strong> <a href="${
                      project.url
                    }" target="_blank" style="color: var(--primary-color); text-decoration: underline;">${
                      project.urlText || project.url
                    }</a></div>`
                  : ""
              }
            </div>
          `
            )
            .join("")}
        </div>
      `
          : ""
      }

      <!-- Leadership & Positions -->
      ${
        nonEmptyLeadershipPositions.length > 0
          ? `
        <div class="section" data-section="leadershipPositions">
          <div class="section-title" data-section="leadershipPositions">LEADERSHIP & POSITIONS</div>
          ${nonEmptyLeadershipPositions
            .map(
              (item: any, index: number) => `
            <div class="entry" data-section="leadershipPositions" data-index="${index}">
              <div class="entry-header" data-section="leadershipPositions" data-index="${index}">
                <div class="entry-title" data-section="leadershipPositions" data-index="${index}">${
                  item.position || item.title || ""
                }</div>
                <div class="entry-date" data-section="leadershipPositions" data-index="${index}">${formatDateRange(item.startDate, item.endDate)}</div>
              </div>
              <div class="entry-subtitle" data-section="leadershipPositions" data-index="${index}">${
                item.organization || ""
              }</div>
              <div class="entry-content" data-section="leadershipPositions" data-index="${index}">${
                item.description || ""
              }</div>
            </div>
          `
            )
            .join("")}
        </div>
      `
          : ""
      }

      <!-- Volunteering -->
      ${
        nonEmptyVolunteering.length > 0
          ? `
        <div class="section" data-section="volunteering">
          <div class="section-title" data-section="volunteering">VOLUNTEERING</div>
          ${nonEmptyVolunteering
            .map(
              (item: any, index: number) => `
            <div class="entry" data-section="volunteering" data-index="${index}">
              <div class="entry-header" data-section="volunteering" data-index="${index}">
                <div class="entry-title" data-section="volunteering" data-index="${index}">${
                  item.role || ""
                }</div>
                <div class="entry-date" data-section="volunteering" data-index="${index}">${
                  item.duration || ""
                }</div>
              </div>
              <div class="entry-subtitle" data-section="volunteering" data-index="${index}">${formatSubtitle([item.organization, item.causeArea])}</div>
              <div class="entry-content" data-section="volunteering" data-index="${index}">${
                item.description || ""
              }</div>
            </div>
          `
            )
            .join("")}
        </div>
      `
          : ""
      }

      <!-- Military Service -->
      ${
        nonEmptyMilitaryService.length > 0
          ? `
        <div class="section" data-section="militaryService">
          <div class="section-title" data-section="militaryService">MILITARY SERVICE</div>
          ${nonEmptyMilitaryService
            .map(
              (item: any, index: number) => `
            <div class="entry" data-section="militaryService" data-index="${index}">
              <div class="entry-header" data-section="militaryService" data-index="${index}">
                <div class="entry-title" data-section="militaryService" data-index="${index}">${item.rank ? `${item.rank} - ${item.branch}` : item.branch || ""}</div>
                <div class="entry-date" data-section="militaryService" data-index="${index}">${
                  item.duration || ""
                }</div>
              </div>
              <div class="entry-subtitle" data-section="militaryService" data-index="${index}">${
                item.specialization || ""
              }</div>
              <div class="entry-content" data-section="militaryService" data-index="${index}">${
                item.description || ""
              }</div>
            </div>
          `
            )
            .join("")}
        </div>
      `
          : ""
      }

      <!-- Teaching Experience -->
      ${
        nonEmptyTeachingExperience.length > 0
          ? `
        <div class="section" data-section="teachingExperience">
          <div class="section-title" data-section="teachingExperience">TEACHING EXPERIENCE</div>
          ${nonEmptyTeachingExperience
            .map(
              (item: any, index: number) => `
            <div class="entry" data-section="teachingExperience" data-index="${index}">
              <div class="entry-header" data-section="teachingExperience" data-index="${index}">
                <div class="entry-title" data-section="teachingExperience" data-index="${index}">${
                  item.title || ""
                }</div>
                <div class="entry-date" data-section="teachingExperience" data-index="${index}">${
                  item.duration || ""
                }</div>
              </div>
              <div class="entry-subtitle" data-section="teachingExperience" data-index="${index}">${formatSubtitle([item.institution, item.subjectCourseTaught])}</div>
              <div class="entry-content" data-section="teachingExperience" data-index="${index}">${
                item.description || ""
              }</div>
            </div>
          `
            )
            .join("")}
        </div>
      `
          : ""
      }

      <!-- Mentorship Experience -->
      ${
        nonEmptyMentorshipExperience.length > 0
          ? `
        <div class="section" data-section="mentorshipExperience">
          <div class="section-title" data-section="mentorshipExperience">MENTORSHIP EXPERIENCE</div>
          ${nonEmptyMentorshipExperience
            .map(
              (item: any, index: number) => `
            <div class="entry" data-section="mentorshipExperience" data-index="${index}">
              <div class="entry-header" data-section="mentorshipExperience" data-index="${index}">
                <div class="entry-title" data-section="mentorshipExperience" data-index="${index}">${
                  item.mentorshipArea || ""
                }</div>
                <div class="entry-date" data-section="mentorshipExperience" data-index="${index}">${
                  item.duration || ""
                }</div>
              </div>
              <div class="entry-subtitle" data-section="mentorshipExperience" data-index="${index}">${formatSubtitle([item.organizationPlatform, item.menteeLevel ? `Mentee Level: ${item.menteeLevel}` : ""])}</div>
              <div class="entry-content" data-section="mentorshipExperience" data-index="${index}">${
                item.description || ""
              }</div>
            </div>
          `
            )
            .join("")}
        </div>
      `
          : ""
      }

      <!-- Research Grants -->
      ${
        nonEmptyResearchGrants.length > 0
          ? `
        <div class="section" data-section="researchGrants">
          <div class="section-title" data-section="researchGrants">RESEARCH GRANTS</div>
          ${nonEmptyResearchGrants
            .map(
              (item: any, index: number) => `
            <div class="entry" data-section="researchGrants" data-index="${index}">
              <div class="entry-header" data-section="researchGrants" data-index="${index}">
                <div class="entry-title" data-section="researchGrants" data-index="${index}">${
                  item.title || ""
                }</div>
                <div class="entry-date" data-section="researchGrants" data-index="${index}">${
                  item.year || ""
                }</div>
              </div>
              <div class="entry-subtitle" data-section="researchGrants" data-index="${index}">${formatSubtitle([item.agency, item.amount])}</div>
              <div class="entry-content" data-section="researchGrants" data-index="${index}">${
                item.description || ""
              }</div>
            </div>
          `
            )
            .join("")}
        </div>
      `
          : ""
      }

      <!-- Publications -->
      ${
        nonEmptyPublications.length > 0
          ? `
        <div class="section" data-section="publications">
          <div class="section-title" data-section="publications">PUBLICATIONS</div>
          ${nonEmptyPublications
            .map(
              (item: any, index: number) => `
            <div class="entry" data-section="publications" data-index="${index}">
              <div class="entry-header" data-section="publications" data-index="${index}">
                <div class="entry-title" data-section="publications" data-index="${index}">${
                  item.title || ""
                }</div>
                <div class="entry-date" data-section="publications" data-index="${index}">${
                  item.year || ""
                }</div>
              </div>
              <div class="entry-subtitle" data-section="publications" data-index="${index}">${formatSubtitle([item.journalPublisher, item.publicationType])}</div>
              ${item.authors ? `<div class="entry-content"><strong>Authors:</strong> ${item.authors}</div>` : ""}
              ${
                item.urlDoi
                  ? `<div class="entry-content" style="margin-top: 5px;"><a href="${item.urlDoi}" target="_blank" style="color: var(--primary-color);">View Publication</a></div>`
                  : ""
              }
            </div>
          `
            )
            .join("")}
        </div>
      `
          : ""
      }

      <!-- Patents -->
      ${
        nonEmptyPatents.length > 0
          ? `
        <div class="section" data-section="patents">
          <div class="section-title" data-section="patents">PATENTS</div>
          ${nonEmptyPatents
            .map(
              (item: any, index: number) => `
            <div class="entry" data-section="patents" data-index="${index}">
              <div class="entry-header" data-section="patents" data-index="${index}">
                <div class="entry-title" data-section="patents" data-index="${index}">${
                  item.title || ""
                }</div>
                <div class="entry-date" data-section="patents" data-index="${index}">${
                  item.year || ""
                }</div>
              </div>
              <div class="entry-subtitle" data-section="patents" data-index="${index}">${formatSubtitle([item.patentNumber, item.issuingAuthority])}</div>
              <div class="entry-content"><strong>Status:</strong> ${item.status || ""}</div>
            </div>
          `
            )
            .join("")}
        </div>
      `
          : ""
      }

      <!-- Test Scores -->
      ${
        nonEmptyTestScores.length > 0
          ? `
        <div class="section" data-section="testScores">
          <div class="section-title" data-section="testScores">TEST SCORES</div>
          ${nonEmptyTestScores
            .map(
              (item: any, index: number) => `
            <div class="entry" data-section="testScores" data-index="${index}">
              <div class="entry-header" data-section="testScores" data-index="${index}">
                <div class="entry-title" data-section="testScores" data-index="${index}">${
                  item.testName || ""
                }</div>
                <div class="entry-date" data-section="testScores" data-index="${index}">${
                  item.year || ""
                }</div>
              </div>
              <div class="entry-subtitle" data-section="testScores" data-index="${index}">Score: ${item.score || ""}${item.percentileRank ? ` (${item.percentileRank} percentile)` : ""}</div>
            </div>
          `
            )
            .join("")}
        </div>
      `
          : ""
      }

      <!-- Certifications (if many, show in main content) -->
      ${
        data.sectionVisibility?.certifications !== false &&
        data.certifications &&
        data.certifications.length > 3
          ? `
        <div class="section" data-section="certifications">
          <div class="section-title" data-section="certifications">CERTIFICATIONS</div>
          ${(data.certifications || [])
            .map(
              (cert: any, index: number) => `
            <div class="entry" data-section="certifications" data-index="${index}">
              <div class="entry-header" data-section="certifications" data-index="${index}">
                <div class="entry-title" data-section="certifications" data-index="${index}">${
                cert.name || ""
              }</div>
                <div class="entry-date" data-section="certifications" data-index="${index}">${
                cert.date || ""
              }</div>
              </div>
              <div class="entry-subtitle" data-section="certifications" data-index="${index}">${
                cert.issuer || ""
              }</div>
              ${cert.description ? `<div class="entry-content">${cert.description}</div>` : ""}
              ${
                cert.url
                  ? `<div class="entry-content" style="margin-top: 8px;"><strong>Link:</strong> <a href="${cert.url}" target="_blank" style="color: var(--primary-color); text-decoration: underline;">View Certificate</a></div>`
                  : ""
              }
            </div>
          `
            )
            .join("")}
        </div>
      `
          : ""
      }

      <!-- Scholarships -->
      ${
        nonEmptyScholarships.length > 0
          ? `
        <div class="section" data-section="scholarships">
          <div class="section-title" data-section="scholarships">SCHOLARSHIPS</div>
          ${nonEmptyScholarships
            .map(
              (item: any, index: number) => `
            <div class="entry" data-section="scholarships" data-index="${index}">
              <div class="entry-header" data-section="scholarships" data-index="${index}">
                <div class="entry-title" data-section="scholarships" data-index="${index}">${
                  item.name || ""
                }</div>
                <div class="entry-date" data-section="scholarships" data-index="${index}">${
                  item.year || ""
                }</div>
              </div>
              <div class="entry-subtitle" data-section="scholarships" data-index="${index}">${formatSubtitle([item.provider || item.organization, item.amount])}</div>
              <div class="entry-content" data-section="scholarships" data-index="${index}">${
                item.description || ""
              }</div>
            </div>
          `
            )
            .join("")}
        </div>
      `
          : ""
      }

      <!-- Awards -->
      ${
        nonEmptyAwards.length > 0
          ? `
        <div class="section" data-section="awards">
          <div class="section-title" data-section="awards">AWARDS</div>
          ${nonEmptyAwards
            .map(
              (item: any, index: number) => `
            <div class="entry" data-section="awards" data-index="${index}">
              <div class="entry-header" data-section="awards" data-index="${index}">
                <div class="entry-title" data-section="awards" data-index="${index}">${
                  item.title || ""
                }</div>
                <div class="entry-date" data-section="awards" data-index="${index}">${
                  item.issueYear || ""
                }</div>
              </div>
              <div class="entry-subtitle" data-section="awards" data-index="${index}">${
                item.organization || ""
              }</div>
              <div class="entry-content" data-section="awards" data-index="${index}">${
                item.description || ""
              }</div>
            </div>
          `
            )
            .join("")}
        </div>
      `
          : ""
      }

      <!-- Speaking Engagements -->
      ${
        nonEmptySpeakingEngagements.length > 0
          ? `
        <div class="section" data-section="speakingEngagements">
          <div class="section-title" data-section="speakingEngagements">SPEAKING ENGAGEMENTS</div>
          ${nonEmptySpeakingEngagements
            .map(
              (item: any, index: number) => `
            <div class="entry" data-section="speakingEngagements" data-index="${index}">
              <div class="entry-header" data-section="speakingEngagements" data-index="${index}">
                <div class="entry-title" data-section="speakingEngagements" data-index="${index}">${
                  item.topic || ""
                }</div>
                <div class="entry-date" data-section="speakingEngagements" data-index="${index}">${
                  item.date || ""
                }</div>
              </div>
              <div class="entry-subtitle" data-section="speakingEngagements" data-index="${index}">${
                item.eventName || ""
              }</div>
              <div class="entry-content" data-section="speakingEngagements" data-index="${index}">${
                item.description || ""
              }</div>
            </div>
          `
            )
            .join("")}
        </div>
      `
          : ""
      }

      <!-- Memberships -->
      ${
        nonEmptyMemberships.length > 0
          ? `
        <div class="section" data-section="memberships">
          <div class="section-title" data-section="memberships">MEMBERSHIPS</div>
          ${nonEmptyMemberships
            .map(
              (item: any, index: number) => `
            <div class="entry" data-section="memberships" data-index="${index}">
              <div class="entry-header" data-section="memberships" data-index="${index}">
                <div class="entry-title" data-section="memberships" data-index="${index}">${
                  item.membershipName || ""
                }</div>
                <div class="entry-date" data-section="memberships" data-index="${index}">${
                  item.year || ""
                }</div>
              </div>
              <div class="entry-subtitle" data-section="memberships" data-index="${index}">${
                item.organizationName || ""
              }</div>
              <div class="entry-content" data-section="memberships" data-index="${index}">${
                item.description || ""
              }</div>
            </div>
          `
            )
            .join("")}
        </div>
      `
          : ""
      }

      <!-- Workshops -->
      ${
        nonEmptyWorkshops.length > 0
          ? `
        <div class="section" data-section="workshops">
          <div class="section-title" data-section="workshops">WORKSHOPS</div>
          ${nonEmptyWorkshops
            .map(
              (item: any, index: number) => `
            <div class="entry" data-section="workshops" data-index="${index}">
              <div class="entry-header" data-section="workshops" data-index="${index}">
                <div class="entry-title" data-section="workshops" data-index="${index}">${
                  item.programTitle || ""
                }</div>
                <div class="entry-date" data-section="workshops" data-index="${index}">${
                  item.year || ""
                }</div>
              </div>
              <div class="entry-subtitle" data-section="workshops" data-index="${index}">${
                item.conductedBy || ""
              }</div>
              <div class="entry-content" data-section="workshops" data-index="${index}">${
                item.description || ""
              }</div>
            </div>
          `
            )
            .join("")}
        </div>
      `
          : ""
      }

      <!-- Co-curricular Activities -->
      ${
        nonEmptyCoCurricular.length > 0
          ? `
        <div class="section" data-section="coCurricular">
          <div class="section-title" data-section="coCurricular">CO-CURRICULAR ACTIVITIES</div>
          ${nonEmptyCoCurricular
            .map(
              (item: any, index: number) => `
            <div class="entry" data-section="coCurricular" data-index="${index}">
              <div class="entry-header" data-section="coCurricular" data-index="${index}">
                <div class="entry-title" data-section="coCurricular" data-index="${index}">${
                  item.activity || ""
                }</div>
                <div class="entry-date" data-section="coCurricular" data-index="${index}">${
                  item.year ||
                  (item.startDate ? `${item.startDate} – ${item.endDate || ""}` : "")
                }</div>
              </div>
              <div class="entry-subtitle" data-section="coCurricular" data-index="${index}">${formatSubtitle([item.organization, item.role])}</div>
              <div class="entry-content" data-section="coCurricular" data-index="${index}">${
                item.description || ""
              }</div>
            </div>
          `
            )
            .join("")}
        </div>
      `
          : ""
      }

      <!-- Extracurricular Activities -->
      ${
        nonEmptyExtracurricular.length > 0
          ? `
        <div class="section" data-section="extracurricular">
          <div class="section-title" data-section="extracurricular">EXTRACURRICULAR ACTIVITIES</div>
          ${nonEmptyExtracurricular
            .map(
              (item: any, index: number) => `
            <div class="entry" data-section="extracurricular" data-index="${index}">
              <div class="entry-header" data-section="extracurricular" data-index="${index}">
                <div class="entry-title" data-section="extracurricular" data-index="${index}">${
                  item.activity || ""
                }</div>
                <div class="entry-date" data-section="extracurricular" data-index="${index}">${
                  item.year ||
                  (item.startDate ? `${item.startDate} – ${item.endDate || ""}` : "")
                }</div>
              </div>
              <div class="entry-subtitle" data-section="extracurricular" data-index="${index}">${formatSubtitle([item.organization, item.role])}</div>
              <div class="entry-content" data-section="extracurricular" data-index="${index}">${
                item.description || ""
              }</div>
            </div>
          `
            )
            .join("")}
        </div>
      `
          : ""
      }

      <!-- Key Achievements -->
      ${
        nonEmptyKeyAchievements.length > 0
          ? `
        <div class="section" data-section="keyAchievements">
          <div class="section-title" data-section="keyAchievements">KEY ACHIEVEMENTS</div>
          <div class="entry-content">
            <ul>
              ${nonEmptyKeyAchievements
                .map(
                  (achievement: string, index: number) =>
                    `<li data-section="keyAchievements" data-index="${index}" style="margin-bottom: 8px;">${achievement}</li>`
                )
                .join("")}
            </ul>
          </div>
        </div>
      `
          : ""
      }

      <!-- Key Responsibilities -->
      ${
        nonEmptyResponsibilities.length > 0
          ? `
        <div class="section" data-section="responsibilities">
          <div class="section-title" data-section="responsibilities">KEY RESPONSIBILITIES</div>
          <div class="entry-content">
            <ul>
              ${nonEmptyResponsibilities
                .map(
                  (line: string, index: number) =>
                    `<li data-section="responsibilities" data-index="${index}" style="margin-bottom: 8px;">${line.trim()}</li>`
                )
                .join("")}
            </ul>
          </div>
        </div>
      `
          : ""
      }

      <!-- Tools (Simple List) -->
      ${
        nonEmptyTools.length > 0
          ? `
        <div class="section" data-section="tools">
          <div class="section-title" data-section="tools">TOOLS & TECHNOLOGIES</div>
          <div class="entry-content">
            <ul>
              ${nonEmptyTools
                .map(
                  (line: string, index: number) =>
                    `<li data-section="tools" data-index="${index}" style="margin-bottom: 8px;">${line.trim()}</li>`
                )
                .join("")}
            </ul>
          </div>
        </div>
      `
          : ""
      }

      <!-- Social Links -->
      ${
        data.sectionVisibility?.socialLinks !== false &&
        data.socialLinks &&
        data.socialLinks.length > 0
          ? `
        <div class="section" data-section="socialLinks">
          <div class="section-title" data-section="socialLinks">SOCIAL LINKS</div>
          <div style="display: flex; flex-wrap: wrap; gap: 15px;" data-section="socialLinks">
            ${data.socialLinks
              .map(
                (link: any, index: number) => `
              <a href="${
                link.url
              }" target="_blank" style="color: var(--primary-color); text-decoration: none; font-weight: 500; font-size: ${Math.round(
                  baseFontSize * 0.933
                )}px;" data-section="socialLinks" data-index="${index}">${
                  link.urlText ||
                  link.url.replace("https://", "").replace("http://", "")
                }</a>
            `
              )
              .join("")}
          </div>
        </div>
      `
          : ""
      }

      <!-- References -->
      ${
        nonEmptyReferences.length > 0
          ? `
        <div class="section" data-section="references">
          <div class="section-title" data-section="references">REFERENCES</div>
          ${nonEmptyReferences
            .map(
              (ref: any, index: number) => `
            <div class="entry" data-section="references" data-index="${index}">
              <div class="entry-header" data-section="references" data-index="${index}">
                <div class="entry-title" data-section="references" data-index="${index}">${ref.name || ""}</div>
              </div>
              <div class="entry-subtitle" data-section="references" data-index="${index}">${formatSubtitle([ref.designationRelationship, ref.organization])}</div>
              <div class="entry-content" data-section="references" data-index="${index}">${ref.contactInformation || ""}</div>
            </div>
          `
            )
            .join("")}
        </div>
      `
          : ""
      }

      <!-- Custom Sections -->
      ${
        data.customSections && data.customSections.length > 0
          ? data.customSections
              .filter(
                (section: any) =>
                  section.isVisible &&
                  section.entries &&
                  section.entries.some(
                    (entry: any) =>
                      entry.isVisible &&
                      (entry.title || entry.organization || entry.description)
                  )
              )
              .map(
                (section: any, sectionIndex: number) => `
        <div class="section" data-section="custom-${sectionIndex}">
          <div class="section-title" data-section="custom-${sectionIndex}">${
            section.heading || "Custom Section"
          }</div>
          ${
            section.entries && section.entries.length > 0
              ? section.entries
                  .filter(
                    (entry: any) =>
                      entry.isVisible &&
                      (entry.title || entry.organization || entry.description)
                  )
                  .map(
                    (entry: any, entryIndex: number) => `
            <div class="entry" data-section="custom-${sectionIndex}" data-index="${entryIndex}">
              <div class="entry-header" data-section="custom-${sectionIndex}" data-index="${entryIndex}">
                <div class="entry-title" data-section="custom-${sectionIndex}" data-index="${entryIndex}">${
                      entry.title || ""
                    }${entry.title && entry.organization ? " at " : ""}${
                      entry.organization || ""
                    }</div>
                ${
                  entry.date
                    ? `<div class="entry-date" data-section="custom-${sectionIndex}" data-index="${entryIndex}">${entry.date}</div>`
                    : ""
                }
              </div>
              ${
                entry.description
                  ? `<div class="entry-content" data-section="custom-${sectionIndex}" data-index="${entryIndex}">${entry.description}</div>`
                  : ""
              }
            </div>
          `
                  )
                  .join("")
              : ""
          }
        </div>
      `
              )
              .join("")
          : ""
      }
    </div>
  </div>
</body>
</html>`;
}