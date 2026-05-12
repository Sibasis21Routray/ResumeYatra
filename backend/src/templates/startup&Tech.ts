export function buildStartupAndTechTemplate(data: any, theme?: any): string {
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


  const defaultTheme = {
    primary: "#2d3e50",
    headerBg: "#2d3e50",
    accentColor: "#2d3e50",
    diamondColor: "#2d3e50",
  };
  const currentTheme = { ...defaultTheme, ...(theme || {}) };
  const baseFontSize = data?.formatting?.bodyFontSize || data?.fontSize || 10;
  const userFontFamily = data?.formatting?.fontFamily || data?.fontFamily || "'Calibri', 'Segoe UI', 'Helvetica Neue', sans-serif";
  const nameFontSize = Math.round(baseFontSize * 3.0);
  const sectionTitleSize = Math.round(baseFontSize * 1.3);
  const primaryColor = currentTheme.primary || currentTheme.headerBg || "#2d3e50";
  const diamondColor = currentTheme.diamondColor || primaryColor;
  const headerBg = currentTheme.headerBg || primaryColor;


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
    const start = startDate?.trim() || "";
    const end = isCurrent ? "Pre sent" : (endDate?.trim() || "");
    return [start, end].filter(Boolean).join(" -\n");
  };

  const formatDateRangeInline = (startDate?: string, endDate?: string, isCurrent?: boolean): string => {
    const parts = [];
    if (startDate?.trim()) parts.push(startDate.trim());
    if (isCurrent) parts.push("Present");
    else if (endDate?.trim()) parts.push(endDate.trim());
    return parts.join(" - ");
  };

  const renderBullets = (description: string): string => {
    if (!description) return "";
    if (description.includes('<ul>') || description.includes('<li>') || description.includes('<div>')) {
      return `<div class="description-html">${description}</div>`;
    }
    const lines = description.split("\n").filter(line => line.trim());
    if (lines.length === 0) return "";
    return `<ul class="bullet-list">${lines.map(l => `<li>${l.trim()}</li>`).join("")}</ul>`;
  };

  // Diamond SVG icon (rotated square)
  const diamond = (size = 16, color = diamondColor) =>
    `<svg width="${size}" height="${size}" viewBox="0 0 16 16" style="display:inline-block;vertical-align:middle;flex-shrink:0;"><rect x="2" y="2" width="12" height="12" transform="rotate(45 8 8)" fill="${color}"/></svg>`;

  const smallDiamond = (size = 10, color = diamondColor) =>
    `<svg width="${size}" height="${size}" viewBox="0 0 10 10" style="display:inline-block;vertical-align:middle;flex-shrink:0;"><rect x="1" y="1" width="8" height="8" transform="rotate(45 5 5)" fill="${color}"/></svg>`;

  const skillArray = typeof skills === "string"
    ? skills.split(",").map(s => s.trim()).filter(s => s)
    : Array.isArray(skills) ? skills : [];

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
  const nonEmptyAwards = getNonEmptyItems(awards);
  const nonEmptyPublications = getNonEmptyItems(publications);
  const nonEmptyPatents = getNonEmptyItems(patents);
  const nonEmptyVolunteering = getNonEmptyItems(volunteering);
  const nonEmptyMethodologies = getNonEmptyItems(methodologies);
  const nonEmptyIndustryExpertise = getNonEmptyItems(industryExpertise);
  const nonEmptyReferences = getNonEmptyItems(references);
  const nonEmptyTeachingExperience = getNonEmptyItems(teachingExperience);
  const nonEmptyMentorshipExperience = getNonEmptyItems(mentorshipExperience);
  const nonEmptyResearchGrants = getNonEmptyItems(researchGrants);
  const nonEmptyTestScores = getNonEmptyItems(testScores);
  const nonEmptyToolsTechnologies = getNonEmptyItems(toolsTechnologies);
  const nonEmptyHobbies = getNonEmptyItems(hobbies);
  const nonEmptySpeakingEngagements = getNonEmptyItems(speakingEngagements);
  const nonEmptyMemberships = getNonEmptyItems(memberships);
  const nonEmptyWorkshops = getNonEmptyItems(workshops);
  const nonEmptyScholarships = getNonEmptyItems(scholarships);
  const nonEmptyMilitaryService = getNonEmptyItems(militaryService);
  const nonEmptyClientProjects = getNonEmptyItems(clientProjects);
  const nonEmptyPortfolio = getNonEmptyItems(portfolio);

  const summaryText = summary || careerObjective;

  // Section header helper — big diamond centered on the body's vertical line
  // body content starts after padding-left:44px; line is at left:66px from element = 22px from content edge
  // diamond (20px wide) left-edge = 22 - 10 = 12px from content edge
  const sectionHeader = (title: string) =>
    `<div class="section-header" style="position:relative; margin-left:0;">
      <span class="section-diamond" style="position:absolute; left:12px; top:50%; transform:translateY(-50%); z-index:3;">${diamond(20, diamondColor)}</span>
      <span class="section-title" style="margin-left:46px;">${title}</span>
    </div>`;

  // Timeline item: dot on line | date col | content col
  const timelineItem = (dateStr: string, titleHtml: string, subtitleHtml: string, bodyHtml: string, index?: number) =>
    `<div class="timeline-item" ${index !== undefined ? `data-index="${index}"` : ''}>
      <div class="timeline-dot">${smallDiamond(13, diamondColor)}</div>
      <div class="timeline-date">${dateStr || ''}</div>
      <div class="timeline-content">
        ${titleHtml}
        ${subtitleHtml}
        ${bodyHtml}
      </div>
    </div>`;

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }

        body {
          font-family: ${userFontFamily};
          font-size: ${baseFontSize}px;
          color: #222;
          background: #ffffff;
          line-height: 1.5;
        }

        /* ── DARK HEADER ── */
        .resume-header {
          background-color: ${headerBg};
          color: #ffffff;
          padding: 32px 44px 28px 44px;
        }
        .resume-name {
          font-size: ${nameFontSize}px;
          font-weight: 700;
          letter-spacing: 1px;
          text-transform: uppercase;
          color: #ffffff;
          margin-bottom: 18px;
          line-height: 1.1;
        }
        .contact-table {
          display: table;
          border-collapse: collapse;
        }
        .contact-row {
          display: table-row;
        }
        .contact-label {
          display: table-cell;
          font-weight: 700;
          color: #ffffff;
          font-size: ${baseFontSize}px;
          padding-right: 16px;
          padding-bottom: 3px;
          white-space: nowrap;
          vertical-align: top;
        }
        .contact-value {
          display: table-cell;
          color: #dde3ea;
          font-size: ${baseFontSize}px;
          padding-bottom: 3px;
          vertical-align: top;
        }
        .contact-value a {
          color: #dde3ea;
          text-decoration: none;
        }

        /* ── BODY WRAPPER: single vertical line on the left ── */
        .resume-body {
          padding: 24px 40px 40px 44px;
          position: relative;
        }
        /* THE single continuous vertical line for the whole body */
        .resume-body::before {
          content: "";
          position: absolute;
          left: 66px;           /* fixed left rail position */
          top: 0;
          bottom: 0;
          width: 2px;
          background: ${primaryColor};
          opacity: 0.3;
          border-radius: 2px;
        }

        /* ── SUMMARY: indented past the line ── */
        .summary-block {
          margin-bottom: 28px;
          margin-left: 36px;   /* push right of the line */
          font-size: ${baseFontSize}px;
          color: #333;
          line-height: 1.7;
        }

        /* ── SECTION HEADER ── */
        .section-header {
          display: flex;
          align-items: center;
          margin-bottom: 12px;
          margin-top: 28px;
          position: relative;
          height: 28px;
        }
        .section-title {
          font-size: ${sectionTitleSize}px;
          font-weight: 700;
          color: ${primaryColor};
          letter-spacing: 0.3px;
        }
        .section-diamond {
          display: flex;
          align-items: center;
          flex-shrink: 0;
          z-index: 3;
        }

        /* ── TIMELINE LAYOUT ── */
        /* Each timeline section's content is indented past the line */
        .timeline-wrapper {
          position: relative;
          margin-left: 36px;   /* past the line */
        }

        .timeline-item {
          position: relative;
          margin-bottom: 20px;
          /* date + content side by side */
          display: grid;
          grid-template-columns: 80px 1fr;
          gap: 0 10px;
          align-items: start;
        }

        /* Small diamond dot on the line — positioned relative to resume-body line */
        .timeline-dot {
          position: absolute;
          /* body padding-left:44px, line at left:66px → line is 22px from content start
             timeline-wrapper margin-left:36px → dot offset = -(36-22) - 6(half dot) = -20px */
          left: -20px;
          top: 3px;
          z-index: 4;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .timeline-date {
          font-size: ${baseFontSize * 0.80}px;
          font-weight: 700;
          color: #444;
          text-transform: uppercase;
          letter-spacing: 0.3px;
          line-height: 1.35;
          white-space: pre-line;
          padding-top: 1px;
        }
        .timeline-content {
          padding-bottom: 2px;
        }
        .timeline-title {
          font-size: ${baseFontSize * 1.05}px;
          font-weight: 700;
          color: #111;
          margin-bottom: 2px;
        }
        .timeline-subtitle {
          font-size: ${baseFontSize * 0.92}px;
          color: #6b7280;
          margin-bottom: 6px;
        }

        /* ── BULLET LIST ── */
        .bullet-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        .bullet-list li {
          list-style: none;
          position: relative;
          padding-left: 14px;
          margin-bottom: 4px;
          font-size: ${baseFontSize * 0.95}px;
          color: #333;
          line-height: 1.5;
          text-align: justify;
        }
        .bullet-list li::before {
          content: "•";
          position: absolute;
          left: 0;
          color: #555;
          font-size: ${baseFontSize * 0.85}px;
        }
        .description-html ul,
        .description-html ol {
          list-style: none;
          padding-left: 0;
          margin: 5px 0;
        }
        .description-html li {
          list-style: none;
          position: relative;
          padding-left: 14px;
          margin-bottom: 4px;
          font-size: ${baseFontSize * 0.95}px;
          color: #333;
          line-height: 1.5;
          text-align: justify;
        }
        .description-html li::before {
          content: "•";
          position: absolute;
          left: 0;
          color: #555;
        }

        /* ── SKILLS GRID (2 columns) ── */
        .skills-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2px 24px;
          margin-left: 36px;
        }
        .skill-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: ${baseFontSize * 0.95}px;
          color: #333;
          padding: 3px 0;
        }

        /* ── EDUCATION TIMELINE ── */
        /* reuses .timeline-item */
        .edu-degree {
          font-size: ${baseFontSize * 1.0}px;
          font-weight: 700;
          color: #111;
        }
        .edu-school {
          font-size: ${baseFontSize * 0.92}px;
          color: #2d6a9f;
          margin-top: 1px;
        }
        .edu-grade {
          font-size: ${baseFontSize * 0.88}px;
          color: #666;
          margin-top: 1px;
        }

        /* ── GENERIC SIDEBAR/LIST ITEMS ── */
        .simple-list {
          list-style: none;
          padding: 0;
          margin-left: 36px;
        }
        .simple-list li {
          list-style: none;
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: ${baseFontSize * 0.95}px;
          color: #333;
          padding: 3px 0;
        }
        .item-name {
          font-weight: 700;
          color: #111;
        }
        .item-sub {
          font-size: ${baseFontSize * 0.88}px;
          color: #666;
        }

        .info-text {
          font-size: ${baseFontSize * 0.92}px;
          color: #555;
          margin-top: 3px;
        }

        @media print {
          body { background: white; }
          * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        }
      </style>
    </head>
    <body>
      <!-- ── DARK HEADER ── -->
      <div class="resume-header" data-section="personal">
        <div class="resume-name">${personal.name || 'YOUR NAME'}</div>
        <div class="contact-table">
          ${personal.location ? `
          <div class="contact-row">
            <div class="contact-label">Address</div>
            <div class="contact-value">${personal.location}</div>
          </div>` : ''}
          ${personal.phone ? `
          <div class="contact-row">
            <div class="contact-label">Phone</div>
            <div class="contact-value">${personal.phone}</div>
          </div>` : ''}
          ${personal.alternatePhone ? `
          <div class="contact-row">
            <div class="contact-label">Alt Phone</div>
            <div class="contact-value">${personal.alternatePhone}</div>
          </div>` : ''}
          ${personal.email ? `
          <div class="contact-row">
            <div class="contact-label">E-mail</div>
            <div class="contact-value">${personal.email}</div>
          </div>` : ''}
          ${linkedIn ? `
          <div class="contact-row">
            <div class="contact-label">LinkedIn</div>
            <div class="contact-value"><a href="${linkedIn}">${linkedIn}</a></div>
          </div>` : ''}
          ${github ? `
          <div class="contact-row">
            <div class="contact-label">GitHub</div>
            <div class="contact-value"><a href="${github}">${github}</a></div>
          </div>` : ''}
          ${personal.dob ? `
          <div class="contact-row">
            <div class="contact-label">DOB</div>
            <div class="contact-value">${personal.dob}</div>
          </div>` : ''}
          ${personal.gender ? `
          <div class="contact-row">
            <div class="contact-label">Gender</div>
            <div class="contact-value">${personal.gender}</div>
          </div>` : ''}
          ${availabilityWorkAuth && hasObjectValues(availabilityWorkAuth) ? `
          <div data-section="availabilityWorkAuth">
            ${availabilityWorkAuth.workAuthorizationStatus ? `
            <div class="contact-row">
              <div class="contact-label">Work Auth</div>
              <div class="contact-value">${availabilityWorkAuth.workAuthorizationStatus}</div>
            </div>` : ''}
            ${availabilityWorkAuth.availabilityNoticePeriod ? `
            <div class="contact-row">
              <div class="contact-label">Notice</div>
              <div class="contact-value">${availabilityWorkAuth.availabilityNoticePeriod}</div>
            </div>` : ''}
            ${availabilityWorkAuth.preferredLocation ? `
            <div class="contact-row">
              <div class="contact-label">Preferred Location</div>
              <div class="contact-value">${availabilityWorkAuth.preferredLocation}</div>
            </div>` : ''}
          </div>
          ` : ''}
        </div>
      </div>

      <!-- ── BODY ── -->
      <div class="resume-body">

        <!-- SUMMARY -->
        ${summaryText ? `<p class="summary-block" data-section="summary">${summaryText}</p>` : ''}

        <!-- WORK HISTORY -->
        ${nonEmptyExperience.length > 0 ? `
        ${sectionHeader('Work History')}
        <div class="timeline-wrapper" data-section="experience">
          ${nonEmptyExperience.map((exp: any, idx: number) => {
            const dateStr = exp.isCurrent
              ? `${exp.startDate || ''} -\nPre sent`
              : `${exp.startDate || ''}${exp.endDate ? ` -\n${exp.endDate}` : ''}`;
            return timelineItem(
              dateStr,
              `<div class="timeline-title">${exp.title || ''}</div>`,
              `<div class="timeline-subtitle">${exp.company || ''}${exp.location ? ` | ${exp.location}` : ''}</div>`,
              exp.description ? renderBullets(exp.description) : '',
              idx
            );
          }).join('')}
        </div>
        ` : ''}

        <!-- INTERNSHIPS -->
        ${nonEmptyInternships.length > 0 ? `
        ${sectionHeader('Internships')}
        <div class="timeline-wrapper" data-section="internships">
          ${nonEmptyInternships.map((item: any, idx: number) => {
            const dateStr = item.duration || formatDateRangeInline(item.startDate, item.endDate);
            return timelineItem(
              dateStr,
              `<div class="timeline-title">${item.title || ''}</div>`,
              `<div class="timeline-subtitle">${item.company || ''}</div>`,
              item.description ? renderBullets(item.description) : '',
              idx
            );
          }).join('')}
        </div>
        ` : ''}

        <!-- SKILLS -->
        ${skillArray.length > 0 ? `
        ${sectionHeader('Skills')}
        <div class="skills-grid" data-section="skills">
          ${skillArray.map((skill, idx) => `
            <div class="skill-item" data-index="${idx}">
              ${smallDiamond(9, diamondColor)}
              <span>${skill}</span>
            </div>
          `).join('')}
        </div>
        ` : ''}

        <!-- TOOLS & TECHNOLOGIES -->
        ${nonEmptyToolsTechnologies.length > 0 ? `
        ${sectionHeader('Tools & Technologies')}
        <div class="skills-grid" data-section="toolsTechnologies">
          ${nonEmptyToolsTechnologies.map((item: any, idx: number) => `
            <div class="skill-item" data-index="${idx}">
              ${smallDiamond(9, diamondColor)}
              <span>${item.name || item}${item.proficiency ? ` (${item.proficiency})` : ''}</span>
            </div>
          `).join('')}
        </div>
        ` : ''}

        <!-- EDUCATION -->
        ${nonEmptyEducation.length > 0 ? `
        ${sectionHeader('Education')}
        <div class="timeline-wrapper" data-section="education">
          ${nonEmptyEducation.map((edu: any, idx: number) => {
            const dateStr = formatDateRangeInline(edu.startDate, edu.graduationDate || edu.endDate, edu.isCurrent);
            return timelineItem(
              dateStr,
              `<div class="edu-degree">${edu.degree || edu.course || ''}${edu.field ? `: ${edu.field}` : ''}</div>`,
              `<div class="edu-school">${edu.school || edu.university || ''}${edu.location ? ` | ${edu.location}` : ''}</div>`,
              `${edu.grade ? `<div class="edu-grade">Grade: ${edu.grade}</div>` : ''}${edu.description ? renderBullets(edu.description) : ''}`,
              idx
            );
          }).join('')}
        </div>
        ` : ''}

        <!-- LANGUAGES -->
        ${nonEmptyLanguages.length > 0 ? `
        ${sectionHeader('Languages')}
        <ul class="simple-list" data-section="languages">
          ${nonEmptyLanguages.map((lang: any, idx: number) => `
            <li data-index="${idx}">
              ${smallDiamond(9, diamondColor)}
              <span>${lang.language || lang}${lang.proficiency ? ` — ${lang.proficiency}` : ''}</span>
            </li>
          `).join('')}
        </ul>
        ` : ''}

        <!-- CERTIFICATIONS -->
        ${nonEmptyCertifications.length > 0 ? `
        ${sectionHeader('Certifications')}
        <div class="timeline-wrapper" data-section="certifications">
          ${nonEmptyCertifications.map((cert: any, idx: number) => timelineItem(
            cert.year || '',
            `<div class="timeline-title">${cert.name || ''}</div>`,
            cert.issuer ? `<div class="timeline-subtitle">${cert.issuer}</div>` : '',
            '',
            idx
          )).join('')}
        </div>
        ` : ''}

        <!-- PROJECTS -->
        ${nonEmptyProjects.length > 0 ? `
        ${sectionHeader('Projects')}
        <div class="timeline-wrapper" data-section="projects">
          ${nonEmptyProjects.map((project: any, idx: number) => timelineItem(
            project.duration || '',
            `<div class="timeline-title">${project.name || project.title || ''}</div>`,
            project.role ? `<div class="timeline-subtitle">${project.role}</div>` : '',
            (project.description ? renderBullets(project.description) : '') +
            (project.technologies ? `<p class="info-text"><strong>Technologies:</strong> ${project.technologies}</p>` : ''),
            idx
          )).join('')}
        </div>
        ` : ''}

        <!-- ACADEMIC PROJECTS -->
        ${nonEmptyAcademicProjects.length > 0 ? `
        ${sectionHeader('Academic Projects')}
        <div class="timeline-wrapper" data-section="academicProjects">
          ${nonEmptyAcademicProjects.map((item: any, idx: number) => timelineItem(
            item.duration || '',
            `<div class="timeline-title">${item.name || item.title || ''}</div>`,
            item.institution ? `<div class="timeline-subtitle">${item.institution}</div>` : '',
            item.description ? renderBullets(item.description) : '',
            idx
          )).join('')}
        </div>
        ` : ''}

        <!-- TRAINING -->
        ${nonEmptyTrainingPrograms.length > 0 ? `
        ${sectionHeader('Training')}
        <div class="timeline-wrapper" data-section="trainingPrograms">
          ${nonEmptyTrainingPrograms.map((item: any, idx: number) => timelineItem(
            item.completionDate || '',
            `<div class="timeline-title">${item.name || ''}</div>`,
            item.provider || item.organization ? `<div class="timeline-subtitle">${item.provider || item.organization}</div>` : '',
            '',
            idx
          )).join('')}
        </div>
        ` : ''}

        <!-- LEADERSHIP -->
        ${nonEmptyLeadershipPositions.length > 0 ? `
        ${sectionHeader('Leadership')}
        <div class="timeline-wrapper" data-section="leadershipPositions">
          ${nonEmptyLeadershipPositions.map((item: any, idx: number) => timelineItem(
            formatDateRangeInline(item.startDate, item.endDate),
            `<div class="timeline-title">${item.position || item.title || ''}</div>`,
            `<div class="timeline-subtitle">${item.organization || ''}</div>`,
            item.description ? renderBullets(item.description) : '',
            idx
          )).join('')}
        </div>
        ` : ''}

        <!-- ACTIVITIES -->
        ${(nonEmptyCoCurricular.length > 0 || nonEmptyExtracurricular.length > 0) ? `
        ${sectionHeader('Activities')}
        <ul class="simple-list" data-section="activities">
          ${[...nonEmptyCoCurricular, ...nonEmptyExtracurricular].map((item: any, idx: number) => `
            <li data-index="${idx}">
              ${smallDiamond(9, diamondColor)}
              <span><strong>${item.activity || ''}</strong>${item.role ? ` — ${item.role}` : ''}</span>
            </li>
          `).join('')}
        </ul>
        ` : ''}

        <!-- AWARDS -->
        ${nonEmptyAwards.length > 0 ? `
        ${sectionHeader('Awards & Honors')}
        <div class="timeline-wrapper" data-section="awards">
          ${nonEmptyAwards.map((item: any, idx: number) => timelineItem(
            item.year || '',
            `<div class="timeline-title">${item.title || ''}</div>`,
            item.organization ? `<div class="timeline-subtitle">${item.organization}</div>` : '',
            item.description ? `<p class="info-text">${item.description}</p>` : '',
            idx
          )).join('')}
        </div>
        ` : ''}

        <!-- PUBLICATIONS -->
        ${nonEmptyPublications.length > 0 ? `
        ${sectionHeader('Publications')}
        <div class="timeline-wrapper" data-section="publications">
          ${nonEmptyPublications.map((item: any, idx: number) => timelineItem(
            item.year || '',
            `<div class="timeline-title">${item.title || ''}</div>`,
            item.journalPublisher ? `<div class="timeline-subtitle">${item.journalPublisher}</div>` : '',
            item.authors ? `<p class="info-text">${item.authors}</p>` : '',
            idx
          )).join('')}
        </div>
        ` : ''}

        <!-- PATENTS -->
        ${nonEmptyPatents.length > 0 ? `
        ${sectionHeader('Patents')}
        <ul class="simple-list" data-section="patents">
          ${nonEmptyPatents.map((item: any, idx: number) => `
            <li data-index="${idx}">
              ${smallDiamond(9, diamondColor)}
              <span><strong>${item.title || ''}</strong>${item.patentNumber ? ` — #${item.patentNumber}` : ''}</span>
            </li>
          `).join('')}
        </ul>
        ` : ''}

        <!-- VOLUNTEERING -->
        ${nonEmptyVolunteering.length > 0 ? `
        ${sectionHeader('Volunteering')}
        <div class="timeline-wrapper" data-section="volunteering">
          ${nonEmptyVolunteering.map((item: any, idx: number) => timelineItem(
            formatDateRangeInline(item.startDate, item.endDate),
            `<div class="timeline-title">${item.role || ''}</div>`,
            `<div class="timeline-subtitle">${item.organization || ''}</div>`,
            item.description ? renderBullets(item.description) : '',
            idx
          )).join('')}
        </div>
        ` : ''}

        <!-- MEMBERSHIPS -->
        ${nonEmptyMemberships.length > 0 ? `
        ${sectionHeader('Memberships')}
        <ul class="simple-list" data-section="memberships">
          ${nonEmptyMemberships.map((item: any, idx: number) => `
            <li data-index="${idx}">
              ${smallDiamond(9, diamondColor)}
              <span><strong>${item.organization || ''}</strong>${item.role ? ` — ${item.role}` : ''}</span>
            </li>
          `).join('')}
        </ul>
        ` : ''}

        <!-- SPEAKING ENGAGEMENTS -->
        ${nonEmptySpeakingEngagements.length > 0 ? `
        ${sectionHeader('Speaking Engagements')}
        <div class="timeline-wrapper" data-section="speakingEngagements">
          ${nonEmptySpeakingEngagements.map((item: any, idx: number) => timelineItem(
            item.date || item.year || '',
            `<div class="timeline-title">${item.title || item.topic || ''}</div>`,
            `<div class="timeline-subtitle">${item.event || item.organization || ''}</div>`,
            '',
            idx
          )).join('')}
        </div>
        ` : ''}

        <!-- WORKSHOPS -->
        ${nonEmptyWorkshops.length > 0 ? `
        ${sectionHeader('Workshops')}
        <div class="timeline-wrapper" data-section="workshops">
          ${nonEmptyWorkshops.map((item: any, idx: number) => timelineItem(
            item.date || '',
            `<div class="timeline-title">${item.name || item.title || ''}</div>`,
            `<div class="timeline-subtitle">${item.organizer || item.organization || ''}</div>`,
            '',
            idx
          )).join('')}
        </div>
        ` : ''}

        <!-- SCHOLARSHIPS -->
        ${nonEmptyScholarships.length > 0 ? `
        ${sectionHeader('Scholarships')}
        <ul class="simple-list" data-section="scholarships">
          ${nonEmptyScholarships.map((item: any, idx: number) => `
            <li data-index="${idx}">
              ${smallDiamond(9, diamondColor)}
              <span><strong>${item.title || item.name || ''}</strong>${item.organization ? ` — ${item.organization}` : ''}</span>
            </li>
          `).join('')}
        </ul>
        ` : ''}

        <!-- TEST SCORES -->
        ${nonEmptyTestScores.length > 0 ? `
        ${sectionHeader('Test Scores')}
        <ul class="simple-list" data-section="testScores">
          ${nonEmptyTestScores.map((item: any, idx: number) => `
            <li data-index="${idx}">
              ${smallDiamond(9, diamondColor)}
              <span><strong>${item.testName || ''}</strong> — ${item.score || ''}${item.year ? ` (${item.year})` : ''}</span>
            </li>
          `).join('')}
        </ul>
        ` : ''}

        <!-- HOBBIES -->
        ${nonEmptyHobbies.length > 0 ? `
        ${sectionHeader('Hobbies & Interests')}
        <ul class="simple-list" data-section="hobbies">
          ${nonEmptyHobbies.map((h: any, idx: number) => `
            <li data-index="${idx}">
              ${smallDiamond(9, diamondColor)}
              <span>${typeof h === 'string' ? h : h.name || ''}</span>
            </li>
          `).join('')}
        </ul>
        ` : ''}

        <!-- TEACHING -->
        ${nonEmptyTeachingExperience.length > 0 ? `
        ${sectionHeader('Teaching Experience')}
        <div class="timeline-wrapper" data-section="teachingExperience">
          ${nonEmptyTeachingExperience.map((item: any, idx: number) => timelineItem(
            formatDateRangeInline(item.startDate, item.endDate),
            `<div class="timeline-title">${item.subjectCourseTaught || item.title || ''}</div>`,
            `<div class="timeline-subtitle">${item.institution || ''}</div>`,
            '',
            idx
          )).join('')}
        </div>
        ` : ''}

        <!-- MENTORSHIP -->
        ${nonEmptyMentorshipExperience.length > 0 ? `
        ${sectionHeader('Mentorship')}
        <ul class="simple-list" data-section="mentorshipExperience">
          ${nonEmptyMentorshipExperience.map((item: any, idx: number) => `
            <li data-index="${idx}">
              ${smallDiamond(9, diamondColor)}
              <span><strong>${item.mentorshipArea || ''}</strong>${item.organizationPlatform ? ` — ${item.organizationPlatform}` : ''}</span>
            </li>
          `).join('')}
        </ul>
        ` : ''}

        <!-- RESEARCH GRANTS -->
        ${nonEmptyResearchGrants.length > 0 ? `
        ${sectionHeader('Research Grants')}
        <div class="timeline-wrapper" data-section="researchGrants">
          ${nonEmptyResearchGrants.map((item: any, idx: number) => timelineItem(
            item.amount || '',
            `<div class="timeline-title">${item.title || ''}</div>`,
            `<div class="timeline-subtitle">${item.agency || ''}</div>`,
            '',
            idx
          )).join('')}
        </div>
        ` : ''}

        <!-- METHODOLOGIES -->
        ${nonEmptyMethodologies.length > 0 ? `
        ${sectionHeader('Methodologies')}
        <ul class="simple-list" data-section="methodologies">
          ${nonEmptyMethodologies.map((item: any, idx: number) => `
            <li data-index="${idx}">
              ${smallDiamond(9, diamondColor)}
              <span><strong>${item.name || ''}</strong>${item.certification ? ` — Certified: ${item.certification}` : ''}</span>
            </li>
          `).join('')}
        </ul>
        ` : ''}

        <!-- INDUSTRY EXPERTISE -->
        ${nonEmptyIndustryExpertise.length > 0 ? `
        ${sectionHeader('Industry Expertise')}
        <ul class="simple-list" data-section="industryExpertise">
          ${nonEmptyIndustryExpertise.map((item: any, idx: number) => `
            <li data-index="${idx}">
              ${smallDiamond(9, diamondColor)}
              <span><strong>${item.industry || ''}</strong>${item.domainArea ? ` — ${item.domainArea}` : ''}</span>
            </li>
          `).join('')}
        </ul>
        ` : ''}

        <!-- MILITARY SERVICE -->
        ${nonEmptyMilitaryService.length > 0 ? `
        ${sectionHeader('Military Service')}
        <div class="timeline-wrapper" data-section="militaryService">
          ${nonEmptyMilitaryService.map((item: any, idx: number) => timelineItem(
            formatDateRangeInline(item.startDate, item.endDate),
            `<div class="timeline-title">${item.rank || ''}${item.role ? ` — ${item.role}` : ''}</div>`,
            `<div class="timeline-subtitle">${item.branch || ''}</div>`,
            '',
            idx
          )).join('')}
        </div>
        ` : ''}

        <!-- CLIENT PROJECTS -->
        ${nonEmptyClientProjects.length > 0 ? `
        ${sectionHeader('Client Projects')}
        <div class="timeline-wrapper" data-section="clientProjects">
          ${nonEmptyClientProjects.map((item: any, idx: number) => timelineItem(
            item.duration || '',
            `<div class="timeline-title">${item.clientName || item.name || ''}</div>`,
            item.projectName ? `<div class="timeline-subtitle">${item.projectName}</div>` : '',
            item.description ? renderBullets(item.description) : '',
            idx
          )).join('')}
        </div>
        ` : ''}

        <!-- PORTFOLIO -->
        ${nonEmptyPortfolio.length > 0 ? `
        ${sectionHeader('Portfolio')}
        <ul class="simple-list" data-section="portfolio">
          ${nonEmptyPortfolio.map((item: any, idx: number) => `
            <li data-index="${idx}">
              ${smallDiamond(9, diamondColor)}
              <span><strong>${item.title || item.name || ''}</strong>${item.url ? ` — <a href="${item.url}" style="color:#2d6a9f;">${item.url}</a>` : ''}</span>
            </li>
          `).join('')}
        </ul>
        ` : ''}

        <!-- REFERENCES -->
        ${nonEmptyReferences.length > 0 ? `
        ${sectionHeader('References')}
        <div class="timeline-wrapper" data-section="references">
          ${nonEmptyReferences.map((item: any, idx: number) => timelineItem(
            '',
            `<div class="timeline-title">${item.name || ''}</div>`,
            `<div class="timeline-subtitle">${item.designationRelationship || ''}${item.organization ? ` at ${item.organization}` : ''}</div>`,
            [item.email, item.phone].filter(Boolean).map(v => `<p class="info-text">${v}</p>`).join(''),
            idx
          )).join('')}
        </div>
        ` : ''}

      </div><!-- end resume-body -->
    </body>
    </html>
  `;
}