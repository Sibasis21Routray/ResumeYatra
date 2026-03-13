export function buildClassicProfessionalTemplate(data: any, theme?: any): string {
  const defaultTheme = {
    primary: '#000000',
    secondary: '#333333',
    background: '#ffffff',
    sidebarGray: '#f1f1f1',
    sidebarDarkerGray: '#e0e0e0',
    headingFont: 'Arial, sans-serif',
    bodyFont: 'Arial, sans-serif'
  };
  const currentTheme = theme || defaultTheme;

  const bodyFontSize = '10pt';
  const headingFontSize = '12pt';
  const nameFontSize = '24pt';

  // ── Safe helpers ──────────────────────────────────────────────────────────

  /** Returns true only when a value is a non-empty string / non-empty array */
  const hasValue = (v: any): boolean => {
    if (v === null || v === undefined) return false;
    if (typeof v === 'string') return v.trim().length > 0;
    if (Array.isArray(v)) return v.length > 0;
    if (typeof v === 'object') return Object.keys(v).length > 0;
    return Boolean(v);
  };

  /** Safely join an array or split a string into bullet-ready lines */
  const toLines = (v: any): string[] => {
    if (!v) return [];
    if (Array.isArray(v)) return v.map(String).filter(s => s.trim());
    return String(v).split('\n').filter(s => s.trim());
  };

  /** Render a value or empty string */
  const s = (v: any) => (v ?? '');

  // ── Derived data ──────────────────────────────────────────────────────────

  const sortedExperience = Array.isArray(data.experience)
    ? [...data.experience].sort(
        (a: any, b: any) =>
          new Date(b.startDate || '1900-01-01').getTime() -
          new Date(a.startDate || '1900-01-01').getTime()
      )
    : [];

  /** Render skills — handles both array and HTML string */
  const renderSkills = (): string => {
    if (!data.skills) return '';
    if (Array.isArray(data.skills)) {
      return data.skills.map((skill: any, index: number) => `
        <div class="skill-row" data-section="skills" data-index="${index}">
          <span>• ${typeof skill === 'object' ? (s(skill.name) + (skill.level ? ` (${s(skill.level)})` : '')) : s(skill)}</span>
          <div class="skill-bar"></div>
        </div>`).join('');
    }
    // HTML string — render inline
    return `<div style="font-size:9pt;">${data.skills}</div>`;
  };

  /** Normalise experience achievements — string or array */
  const expAchievements = (exp: any): string[] => {
    if (!exp.achievements) return [];
    if (Array.isArray(exp.achievements)) return exp.achievements.filter((a: string) => String(a).trim());
    return String(exp.achievements).split('\n').filter((a: string) => a.trim());
  };

  const responsibilityLines = toLines(data.responsibilities);
  const hasResponsibilitiesContent = responsibilityLines.length > 0;
  const hasToolsContent = hasValue(data.tools);

  // ── Section visibility guard ──────────────────────────────────────────────
  const show = (section: string) => data.sectionVisibility?.[section] !== false;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    :root {
      --primary-color: ${currentTheme.primary};
      --secondary-color: ${currentTheme.secondary};
      --bg-gray: ${currentTheme.sidebarGray};
      --bg-darker: ${currentTheme.sidebarDarkerGray};
      --body-font: ${currentTheme.bodyFont};
    }

    body {
      font-family: var(--body-font);
      color: var(--primary-color);
      line-height: 1.4;
      margin: 0; padding: 0;
      background: #fff;
    }

    .resume-container {
      width: 100%;
      max-width: 800px;
      margin: 0 auto;
    }

    /* Top Header */
    .header {
      text-align: center;
      padding: 40px 0 20px 0;
    }
    .name {
      font-size: ${nameFontSize};
      font-weight: bold;
      text-transform: uppercase;
      margin: 0;
      letter-spacing: 1px;
    }
    .title {
      font-size: 14pt;
      margin-top: 5px;
    }
    .divider {
      border-top: 1px solid #ddd;
      margin: 20px 40px;
    }

    /* Layout Structure */
    .main-body {
      display: flex;
      flex-direction: column;
      padding: 0 20px;
    }

    /* Sidebar */
    .sidebar { width: 100%; }
    .sidebar-section { padding: 15px; margin-bottom: 0; }
    .sidebar-light { background-color: #f3f3f3; }
    .sidebar-mid { background-color: #E3E3E3; }
    .sidebar-expertise { background-color: #D5D5D5; }
    .sidebar-plain { padding: 15px; }

    /* Main Content */
    .content { width: 100%; padding-left: 0; }

    .section-title {
      font-size: ${headingFontSize};
      font-weight: bold;
      text-transform: uppercase;
      margin-bottom: 12px;
    }

    /* Skill Bars */
    .skill-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 9pt;
      margin-bottom: 8px;
    }
    .skill-bar {
      width: 40px; height: 3px;
      background: #ccc; position: relative;
    }
    .skill-bar::after {
      content: '';
      position: absolute;
      left: 0; top: 0; bottom: 0;
      width: 70%;
      background: #666;
    }

    /* Education */
    .education-entry {
      margin-bottom: 12px; padding: 8px;
      background: rgba(255,255,255,0.6);
      border-left: 3px solid var(--primary-color);
    }
    .education-degree { font-weight: bold; color: var(--primary-color); margin-bottom: 3px; font-size: 9pt; }
    .education-field  { font-weight: 600; color: var(--secondary-color); margin-bottom: 3px; font-size: 8.5pt; }
    .education-school { font-weight: bold; color: var(--primary-color); margin-bottom: 3px; font-size: 9pt; }
    .education-location { color: var(--secondary-color); font-style: italic; margin-bottom: 5px; font-size: 8pt; }
    .education-date { font-size: 8pt; color: var(--secondary-color); margin-bottom: 5px; }
    .education-gpa { font-size: 8pt; color: var(--secondary-color); margin-bottom: 5px; }
    .education-description {
      font-size: 8pt; color: var(--secondary-color);
      line-height: 1.4; margin-top: 6px; padding: 6px;
      background: rgba(255,255,255,0.8); border-radius: 3px;
    }
    .education-description ul { margin: 4px 0 4px 15px; padding: 0; list-style-type: disc; }
    .education-description li { margin: 2px 0; color: var(--secondary-color); }
    .education-description b { font-weight: bold; color: var(--primary-color); }
    .education-achievements { margin-top: 6px; padding-top: 6px; border-top: 1px solid #d0d0d0; }
    .education-achievements h4 {
      font-size: 8pt; font-weight: bold; color: var(--primary-color);
      margin-bottom: 4px; text-transform: uppercase; letter-spacing: 0.5px;
    }
    .education-achievements ul { margin: 0; padding-left: 0; list-style: none; }
    .education-achievements li {
      position: relative; padding-left: 12px;
      margin-bottom: 2px; color: var(--secondary-color); font-size: 8pt;
    }
    .education-achievements li:before { content: "📚"; position: absolute; left: 0; font-size: 7pt; }

    /* Work Experience */
    .exp-item { margin-bottom: 20px; }
    .exp-header {
      display: flex; justify-content: space-between;
      align-items: center; font-weight: bold;
      text-transform: uppercase; font-size: 10pt;
    }
    .exp-line { flex-grow: 1; height: 1px; background: #ccc; margin: 0 10px; }
    .exp-subhead { font-size: 9pt; margin-bottom: 8px; }

    /* Contact */
    .contact-item {
      font-size: 9pt; margin-bottom: 8px;
      display: flex; align-items: center; gap: 6px;
    }

    p, li { font-size: ${bodyFontSize}; margin: 0 0 5px 0; }
    ul { padding-left: 15px; margin: 5px 0; }

    /* Responsive */
    @media (min-width: 768px) {
      .main-body { flex-direction: row; padding: 0 40px; }
      .sidebar { width: 30%; }
      .content { width: 70%; padding-left: 30px; }
    }
  </style>
</head>
<body>
<div class="resume-container">

  <!-- ═══════════════ HEADER ═══════════════ -->
  <div class="header" data-section="personal">
    ${hasValue(data.personal?.image) ? `<img src="${s(data.personal.image)}" alt="Profile" style="width:80px;height:80px;border-radius:50%;object-fit:cover;margin-bottom:10px;border:2px solid #ddd;">` : ''}
    <div class="name">${s(data.personal?.name) || 'YOUR NAME'}</div>
    ${hasValue(data.personal?.title) ? `<div class="title">${s(data.personal?.title)}</div>` : ''}
    <div class="divider"></div>
  </div>

  <div class="main-body">

    <!-- ═══════════════ SIDEBAR ═══════════════ -->
    <div class="sidebar">

      <!-- Personal Details -->
      ${(hasValue(data.personal?.fathersName) || hasValue(data.personal?.mothersName) || hasValue(data.personal?.dob) || hasValue(data.personal?.gender) || hasValue(data.personal?.maritalStatus) || hasValue(data.personal?.nationality) || hasValue(data.personal?.religion) || hasValue(data.personal?.category)) ? `
      <div class="sidebar-section sidebar-light" data-section="personal">
        <div class="section-title">PERSONAL DETAILS</div>
        <div style="font-size: 9pt; color: var(--secondary-color); display: flex; flex-direction: column; gap: 6px;">
          ${hasValue(data.personal?.fathersName)    ? `<div><strong>Father's Name:</strong> ${s(data.personal.fathersName)}</div>` : ''}
          ${hasValue(data.personal?.mothersName)    ? `<div><strong>Mother's Name:</strong> ${s(data.personal.mothersName)}</div>` : ''}
          ${hasValue(data.personal?.dob)            ? `<div><strong>Date of Birth:</strong> ${s(data.personal.dob)}</div>` : ''}
          ${hasValue(data.personal?.age)            ? `<div><strong>Age:</strong> ${s(data.personal.age)}</div>` : ''}
          ${hasValue(data.personal?.gender)         ? `<div><strong>Gender:</strong> ${s(data.personal.gender)}</div>` : ''}
          ${hasValue(data.personal?.maritalStatus)  ? `<div><strong>Marital Status:</strong> ${s(data.personal.maritalStatus)}</div>` : ''}
          ${hasValue(data.personal?.nationality)    ? `<div><strong>Nationality:</strong> ${s(data.personal.nationality)}</div>` : ''}
          ${hasValue(data.personal?.religion)       ? `<div><strong>Religion:</strong> ${s(data.personal.religion)}</div>` : ''}
          ${hasValue(data.personal?.category)       ? `<div><strong>Category:</strong> ${s(data.personal.category)}</div>` : ''}
        </div>
      </div>` : ''}

      <!-- Education -->
      ${(show('education') && Array.isArray(data.education) && data.education.length > 0) ? `
      <div class="sidebar-section sidebar-light" data-section="education">
        <div class="section-title">EDUCATION</div>
        ${data.education.map((edu: any, index: number) => `
          <div class="education-entry" data-section="education" data-index="${index}">
            ${hasValue(edu.degree) ? `<div class="education-degree" data-section="education" data-index="${index}">${s(edu.degree)}${hasValue(edu.qualification) ? ` (${s(edu.qualification)})` : ''}</div>` : ''}
            ${hasValue(edu.field)        ? `<div class="education-field"    data-section="education" data-index="${index}">${s(edu.field)}</div>` : ''}
            ${hasValue(edu.school)       ? `<div class="education-school"   data-section="education" data-index="${index}">${s(edu.school)}</div>` : ''}
            ${hasValue(edu.university)   ? `<div class="education-school"   data-section="education" data-index="${index}">${s(edu.university)}</div>` : ''}
            ${hasValue(edu.board)        ? `<div style="font-size:8pt;color:var(--secondary-color);" data-section="education" data-index="${index}">Board: ${s(edu.board)}</div>` : ''}
            ${hasValue(edu.location)     ? `<div class="education-location" data-section="education" data-index="${index}">${s(edu.location)}</div>` : ''}
            ${(hasValue(edu.graduationDate) || hasValue(edu.startDate) || hasValue(edu.endDate)) ? `
              <div class="education-date" data-section="education" data-index="${index}">
                ${edu.startDate && edu.endDate ? `${s(edu.startDate)} – ${s(edu.endDate)}` : (s(edu.graduationDate) || s(edu.endDate) || s(edu.startDate))}
              </div>` : ''}
            ${hasValue(edu.percentage)   ? `<div class="education-gpa" data-section="education" data-index="${index}">Score: ${s(edu.percentage)}%</div>` : ''}
            ${hasValue(edu.cgpa)         ? `<div class="education-gpa" data-section="education" data-index="${index}">CGPA: ${s(edu.cgpa)}</div>` : ''}
            ${hasValue(edu.gpa)          ? `<div class="education-gpa" data-section="education" data-index="${index}">GPA: ${s(edu.gpa)}</div>` : ''}
            ${hasValue(edu.grade)        ? `<div class="education-gpa" data-section="education" data-index="${index}">Grade: ${s(edu.grade)}</div>` : ''}
            ${hasValue(edu.description)  ? `
              <div class="education-description" data-section="education" data-index="${index}">
                ${edu.description.includes('<ul>') || edu.description.includes('<li>')
                  ? edu.description
                  : `<p>${edu.description}</p>`}
              </div>` : ''}
            ${(Array.isArray(edu.achievements) && edu.achievements.filter((a: string) => a.trim()).length > 0) ? `
              <div class="education-achievements" data-section="education" data-index="${index}">
                <h4>Academic Excellence</h4>
                <ul>
                  ${edu.achievements.filter((a: string) => a.trim()).map((a: string, ai: number) =>
                    `<li data-section="education" data-index="${index}" data-item-index="${ai}">${a}</li>`
                  ).join('')}
                </ul>
              </div>` : ''}
          </div>
        `).join('')}
      </div>` : ''}

      <!-- Skills -->
      ${(show('skills') && hasValue(data.skills)) ? `
      <div class="sidebar-section sidebar-mid" data-section="skills">
        <div class="section-title">SKILLS</div>
        ${renderSkills()}
      </div>` : ''}

      <!-- Expertise / Key Achievements in sidebar -->
      ${(Array.isArray(data.keyAchievements) && data.keyAchievements.length > 0) ? `
      <div class="sidebar-section sidebar-expertise" style="border-top: 1px solid #ccc;" data-section="expertise">
        <div class="section-title">EXPERTISE</div>
        ${data.keyAchievements.slice(0, 4).map((item: any, index: number) => `
          <div class="skill-row" data-section="keyAchievements" data-index="${index}">
            <span>• ${s(item)}</span><div class="skill-bar"></div>
          </div>
        `).join('')}
      </div>` : ''}

      <!-- Contact -->
      <div class="sidebar-plain" data-section="contact">
        <div class="section-title">CONTACT</div>
        ${hasValue(data.personal?.phone)         ? `<div class="contact-item" data-section="personal" data-index="0">📞 ${s(data.personal.phone)}</div>` : ''}
        ${hasValue(data.personal?.alternatePhone) ? `<div class="contact-item" data-section="personal" data-index="1">📞 ${s(data.personal.alternatePhone)}</div>` : ''}
        ${(hasValue(data.personal?.location) || hasValue(data.personal?.city) || hasValue(data.personal?.state) || hasValue(data.personal?.country) || hasValue(data.personal?.pinCode) || hasValue(data.personal?.fullAddress)) ? `
          <div class="contact-item" data-section="personal" data-index="2">📍 ${[
            data.personal?.fullAddress,
            data.personal?.location,
            data.personal?.city,
            data.personal?.state,
            data.personal?.country,
            data.personal?.pinCode
          ].filter(Boolean).join(', ')}</div>` : ''}
        ${hasValue(data.personal?.email)         ? `<div class="contact-item" data-section="personal" data-index="5">✉️ ${s(data.personal.email)}</div>` : ''}
        ${hasValue(data.personal?.linkedinUrl)   ? `<div class="contact-item" data-section="personal" data-index="6">🔗 <a href="${s(data.personal.linkedinUrl)}" target="_blank">LinkedIn</a></div>` : ''}
        ${hasValue(data.personal?.githubUrl)     ? `<div class="contact-item" data-section="personal" data-index="7">💻 <a href="${s(data.personal.githubUrl)}" target="_blank">GitHub</a></div>` : ''}
        ${hasValue(data.personal?.portfolioUrl)  ? `<div class="contact-item" data-section="personal" data-index="8">🌐 <a href="${s(data.personal.portfolioUrl)}" target="_blank">Portfolio</a></div>` : ''}
        ${hasValue(data.personal?.website)       ? `<div class="contact-item" data-section="personal" data-index="9">🌐 <a href="${s(data.personal.website)}" target="_blank">Website</a></div>` : ''}
        ${hasValue(data.personal?.twitter)       ? `<div class="contact-item" data-section="personal" data-index="10">🐦 <a href="${s(data.personal.twitter)}" target="_blank">Twitter</a></div>` : ''}
        ${hasValue(data.personal?.skype)         ? `<div class="contact-item" data-section="personal" data-index="11">💬 Skype: ${s(data.personal.skype)}</div>` : ''}
      </div>

      <!-- Social Links -->
      ${(show('socialLinks') && Array.isArray(data.socialLinks) && data.socialLinks.length > 0) ? `
      <div class="sidebar-plain" data-section="socialLinks">
        <div class="section-title">SOCIAL LINKS</div>
        ${data.socialLinks.map((link: any, index: number) => `
          <div class="contact-item" data-section="socialLinks" data-index="${index}">
            🔗 <a href="${s(link.url)}" target="_blank">${s(link.urlText) || s(link.url).replace(/https?:\/\//, '')}</a>
          </div>
        `).join('')}
      </div>` : ''}

      <!-- Declare (optional sidebar section for declaration text) -->
      ${(show('declaration') && hasValue(data.declaration)) ? `
      <div class="sidebar-section sidebar-light" data-section="declaration">
        <div class="section-title">DECLARATION</div>
        <p style="font-size:9pt;">${s(data.declaration)}</p>
      </div>` : ''}

    </div><!-- /sidebar -->

    <!-- ═══════════════ MAIN CONTENT ═══════════════ -->
    <div class="content">

      <!-- Summary / About Me -->
      ${hasValue(data.summary) ? `
      <div class="main-section" style="margin-bottom: 30px;" data-section="summary">
        <div class="section-title">ABOUT ME</div>
        <p>${s(data.summary)}</p>
        <div style="border-top: 1px solid #ddd; margin-top: 20px;"></div>
      </div>` : ''}

      <!-- Career Objective -->
      ${(show('careerObjective') && hasValue(data.careerObjective)) ? `
      <div class="main-section" style="margin-bottom: 30px;" data-section="careerObjective">
        <div class="section-title">CAREER OBJECTIVE</div>
        <p>${s(data.careerObjective)}</p>
        <div style="border-top: 1px solid #ddd; margin-top: 20px;"></div>
      </div>` : ''}

      <!-- Work Experience -->
      ${(show('experience') && sortedExperience.length > 0) ? `
      <div class="main-section" data-section="experience">
        <div class="section-title">WORK EXPERIENCE</div>
        ${sortedExperience.map((exp: any, index: number) => {
          const descLines = toLines(exp.description);
          const firstLine = descLines[0] || '';
          const restLines = descLines.slice(1);
          return `
          <div class="exp-item" data-section="experience" data-index="${index}">
            <div class="exp-header">
              <span>${s(exp.company)}</span>
              <div class="exp-line"></div>
              <span>${s(exp.startDate)}${(exp.startDate || exp.endDate) ? '–' : ''}${s(exp.endDate) || (exp.startDate ? 'Present' : '')}</span>
            </div>
            <div class="exp-subhead">
              ${s(exp.title)}
              ${hasValue(exp.location) ? ` | ${s(exp.location)}` : ''}
              ${hasValue(exp.employmentType) ? ` | ${s(exp.employmentType)}` : ''}
            </div>
            ${hasValue(firstLine) ? `<p>${firstLine}</p>` : ''}
            ${restLines.length > 0 ? `
            <ul>
              ${restLines.map((line: string, li: number) =>
                `<li data-section="experience" data-index="${index}" data-item-index="${li}">${line.trim()}</li>`
              ).join('')}
            </ul>` : ''}
          ${expAchievements(exp).length > 0 ? `
            <ul>
              ${expAchievements(exp).map((a: string, ai: number) =>
                `<li data-section="experience" data-index="${index}" data-item-index="${ai}">⭐ ${a}</li>`
              ).join('')}
            </ul>` : ''}
            ${hasValue(exp.technologies) ? `<p style="font-size:8.5pt;"><strong>Tech:</strong> ${s(exp.technologies)}</p>` : ''}
          </div>`;
        }).join('')}
      </div>` : ''}

      <!-- Projects -->
      ${(show('projects') && Array.isArray(data.projects) && data.projects.length > 0) ? `
      <div class="main-section" data-section="projects">
        <div class="section-title">PROJECTS</div>
        ${data.projects.map((project: any, index: number) => `
          <div style="margin-bottom: 15px;" data-section="projects" data-index="${index}">
            <div style="font-weight: bold; font-size: 10pt;">
              ${s(project.name)}
              ${hasValue(project.technologies) ? ` | ${s(project.technologies)}` : ''}
              ${(project.startDate || project.endDate) ? ` | ${s(project.startDate)} – ${s(project.endDate) || 'Present'}` : ''}
            </div>
            ${hasValue(project.role)        ? `<div style="font-size:9pt;font-style:italic;">${s(project.role)}</div>` : ''}
            ${hasValue(project.description) ? `<p style="font-size: 9pt;">${s(project.description)}</p>` : ''}
            ${hasValue(project.url)         ? `<p style="font-size: 8pt;"><a href="${s(project.url)}" target="_blank">${s(project.urlText) || 'View Project'}</a></p>` : ''}
            ${hasValue(project.githubUrl)   ? `<p style="font-size: 8pt;"><a href="${s(project.githubUrl)}" target="_blank">GitHub</a></p>` : ''}
          </div>
        `).join('')}
      </div>` : ''}

      <!-- Certifications -->
      ${(show('certifications') && Array.isArray(data.certifications) && data.certifications.length > 0) ? `
      <div class="main-section" data-section="certifications">
        <div class="section-title">CERTIFICATIONS</div>
        ${data.certifications.map((cert: any, index: number) => `
          <div style="margin-bottom: 10px;" data-section="certifications" data-index="${index}">
            <div style="font-weight: bold; font-size: 9pt;">${s(cert.name)}</div>
            <div style="font-size: 8pt;">
              ${s(cert.issuer)}
              ${hasValue(cert.date) ? ` | ${s(cert.date)}` : ''}
              ${hasValue(cert.expiryDate) ? ` | Expires: ${s(cert.expiryDate)}` : ''}
              ${hasValue(cert.credentialId) ? ` | ID: ${s(cert.credentialId)}` : ''}
            </div>
            ${hasValue(cert.description) ? `<p style="font-size:9pt;">${s(cert.description)}</p>` : ''}
            ${hasValue(cert.url) ? `<p style="font-size: 8pt;"><a href="${s(cert.url)}" target="_blank">View Certificate</a></p>` : ''}
          </div>
        `).join('')}
      </div>` : ''}

      <!-- Internships -->
      ${(show('internships') && Array.isArray(data.internships) && data.internships.length > 0) ? `
      <div class="main-section" data-section="internships">
        <div class="section-title">INTERNSHIPS</div>
        ${data.internships.map((item: any, index: number) => `
          <div style="margin-bottom: 10px;" data-section="internships" data-index="${index}">
            <div style="font-weight: bold; font-size: 9pt;">${s(item.title)}</div>
            <div style="font-size: 8pt;">
              ${s(item.company)}
              ${hasValue(item.location) ? `, ${s(item.location)}` : ''}
              ${(item.startDate || item.endDate) ? ` | ${s(item.startDate)} – ${s(item.endDate) || 'Present'}` : ''}
            </div>
            ${hasValue(item.stipend)     ? `<div style="font-size:8pt;">Stipend: ${s(item.stipend)}</div>` : ''}
            ${hasValue(item.description) ? `<p style="font-size: 9pt;">${s(item.description)}</p>` : ''}
            ${hasValue(item.technologies)? `<p style="font-size:8.5pt;"><strong>Tech:</strong> ${s(item.technologies)}</p>` : ''}
          </div>
        `).join('')}
      </div>` : ''}

      <!-- Academic Projects -->
      ${(show('academicProjects') && Array.isArray(data.academicProjects) && data.academicProjects.length > 0) ? `
      <div class="main-section" data-section="academicProjects">
        <div class="section-title">ACADEMIC PROJECTS</div>
        ${data.academicProjects.map((item: any, index: number) => `
          <div style="margin-bottom: 10px;" data-section="academicProjects" data-index="${index}">
            <div style="font-weight: bold; font-size: 9pt;">${s(item.name) || s(item.title)}</div>
            <div style="font-size: 8pt;">
              ${s(item.institution)}
              ${hasValue(item.duration) ? ` | ${s(item.duration)}` : ''}
              ${hasValue(item.year)     ? ` | ${s(item.year)}` : ''}
            </div>
            ${hasValue(item.description)  ? `<p style="font-size: 9pt;">${s(item.description)}</p>` : ''}
            ${hasValue(item.technologies) ? `<p style="font-size: 8pt;"><strong>Technologies:</strong> ${s(item.technologies)}</p>` : ''}
            ${hasValue(item.url)          ? `<p style="font-size: 8pt;"><a href="${s(item.url)}" target="_blank">View Project</a></p>` : ''}
          </div>
        `).join('')}
      </div>` : ''}

      <!-- Leadership Positions -->
      ${(show('leadershipPositions') && Array.isArray(data.leadershipPositions) && data.leadershipPositions.length > 0) ? `
      <div class="main-section" data-section="leadershipPositions">
        <div class="section-title">LEADERSHIP &amp; POSITIONS</div>
        ${data.leadershipPositions.map((item: any, index: number) => `
          <div style="margin-bottom: 10px;" data-section="leadershipPositions" data-index="${index}">
            <div style="font-weight: bold; font-size: 9pt;">${s(item.position) || s(item.title)}</div>
            <div style="font-size: 8pt;">
              ${s(item.organization)}
              ${(item.startDate || item.endDate) ? ` | ${s(item.startDate)} – ${s(item.endDate) || 'Present'}` : ''}
            </div>
            ${hasValue(item.description) ? `<p style="font-size: 9pt;">${s(item.description)}</p>` : ''}
          </div>
        `).join('')}
      </div>` : ''}

      <!-- Training Programs -->
      ${(show('trainingPrograms') && Array.isArray(data.trainingPrograms) && data.trainingPrograms.length > 0) ? `
      <div class="main-section" data-section="trainingPrograms">
        <div class="section-title">TRAINING PROGRAMS</div>
        ${data.trainingPrograms.map((item: any, index: number) => `
          <div style="margin-bottom: 10px;" data-section="trainingPrograms" data-index="${index}">
            <div style="font-weight: bold; font-size: 9pt;">${s(item.name)}</div>
            <div style="font-size: 8pt;">
              ${s(item.provider) || s(item.organization)}
              ${hasValue(item.duration)       ? ` | ${s(item.duration)}` : ''}
              ${hasValue(item.completionDate) ? ` | ${s(item.completionDate)}` : ''}
              ${hasValue(item.mode)           ? ` | ${s(item.mode)}` : ''}
            </div>
            ${hasValue(item.description) ? `<p style="font-size: 9pt;">${s(item.description)}</p>` : ''}
          </div>
        `).join('')}
      </div>` : ''}

      <!-- Scholarships -->
      ${(show('scholarships') && Array.isArray(data.scholarships) && data.scholarships.length > 0) ? `
      <div class="main-section" data-section="scholarships">
        <div class="section-title">SCHOLARSHIPS</div>
        ${data.scholarships.map((item: any, index: number) => `
          <div style="margin-bottom: 10px;" data-section="scholarships" data-index="${index}">
            <div style="font-weight: bold; font-size: 9pt;">${s(item.name)}</div>
            <div style="font-size: 8pt;">
              ${s(item.provider) || s(item.organization)}
              ${hasValue(item.amount) ? ` | ${s(item.amount)}` : ''}
              ${hasValue(item.year)   ? ` | ${s(item.year)}` : ''}
            </div>
            ${hasValue(item.description) ? `<p style="font-size: 9pt;">${s(item.description)}</p>` : ''}
          </div>
        `).join('')}
      </div>` : ''}

      <!-- Awards / Honors -->
      ${(show('awards') && Array.isArray(data.awards) && data.awards.length > 0) ? `
      <div class="main-section" data-section="awards">
        <div class="section-title">AWARDS &amp; HONORS</div>
        ${data.awards.map((item: any, index: number) => `
          <div style="margin-bottom: 10px;" data-section="awards" data-index="${index}">
            <div style="font-weight: bold; font-size: 9pt;">${s(item.title) || s(item.name)}</div>
            <div style="font-size: 8pt;">
              ${s(item.issuer || item.organization)}
              ${hasValue(item.date || item.issueYear || item.year) ? ` | ${s(item.date || item.issueYear || item.year)}` : ''}
            </div>
            ${hasValue(item.description) ? `<p style="font-size: 9pt;">${s(item.description)}</p>` : ''}
          </div>
        `).join('')}
      </div>` : ''}

      <!-- Volunteer Work -->
      ${(show('volunteer') && Array.isArray(data.volunteer) && data.volunteer.length > 0) ? `
      <div class="main-section" data-section="volunteer">
        <div class="section-title">VOLUNTEER WORK</div>
        ${data.volunteer.map((item: any, index: number) => `
          <div style="margin-bottom: 10px;" data-section="volunteer" data-index="${index}">
            <div style="font-weight: bold; font-size: 9pt;">${s(item.role) || s(item.title)}</div>
            <div style="font-size: 8pt;">
              ${s(item.organization)}
              ${(item.startDate || item.endDate) ? ` | ${s(item.startDate)} – ${s(item.endDate) || 'Present'}` : ''}
            </div>
            ${hasValue(item.description) ? `<p style="font-size: 9pt;">${s(item.description)}</p>` : ''}
          </div>
        `).join('')}
      </div>` : ''}

      <!-- Publications -->
      ${(show('publications') && Array.isArray(data.publications) && data.publications.length > 0) ? `
      <div class="main-section" data-section="publications">
        <div class="section-title">PUBLICATIONS</div>
        ${data.publications.map((item: any, index: number) => `
          <div style="margin-bottom: 10px;" data-section="publications" data-index="${index}">
            <div style="font-weight: bold; font-size: 9pt;">${s(item.title)}</div>
            <div style="font-size: 8pt;">
              ${s(item.publisher || item.journalPublisher || item.journal)}
              ${hasValue(item.publicationType) ? ` | ${s(item.publicationType)}` : ''}
              ${hasValue(item.date || item.year) ? ` | ${s(item.date || item.year)}` : ''}
              ${hasValue(item.authors) ? ` | ${s(item.authors)}` : ''}
            </div>
            ${hasValue(item.description) ? `<p style="font-size: 9pt;">${s(item.description)}</p>` : ''}
            ${hasValue(item.url || item.urlDoi) ? `<p style="font-size: 8pt;"><a href="${s(item.url || item.urlDoi)}" target="_blank">Read</a></p>` : ''}
          </div>
        `).join('')}
      </div>` : ''}

      <!-- Co-Curricular Activities -->
      ${(show('coCurricular') && Array.isArray(data.coCurricular) && data.coCurricular.length > 0) ? `
      <div class="main-section" data-section="coCurricular">
        <div class="section-title">CO-CURRICULAR ACTIVITIES</div>
        ${data.coCurricular.map((item: any, index: number) => `
          <div style="margin-bottom: 10px;" data-section="coCurricular" data-index="${index}">
            <div style="font-weight: bold; font-size: 9pt;">${s(item.activity)}</div>
            <div style="font-size: 8pt;">
              ${s(item.organization)}
              ${hasValue(item.role)      ? ` | ${s(item.role)}` : ''}
              ${hasValue(item.year)      ? ` | ${s(item.year)}`
                : (item.startDate       ? ` | ${s(item.startDate)} – ${s(item.endDate) || ''}` : '')}
            </div>
            ${hasValue(item.description) ? `<p style="font-size: 9pt;">${s(item.description)}</p>` : ''}
          </div>
        `).join('')}
      </div>` : ''}

      <!-- Extracurricular Activities -->
      ${(show('extracurricular') && Array.isArray(data.extracurricular) && data.extracurricular.length > 0) ? `
      <div class="main-section" data-section="extracurricular">
        <div class="section-title">EXTRACURRICULAR ACTIVITIES</div>
        ${data.extracurricular.map((item: any, index: number) => `
          <div style="margin-bottom: 10px;" data-section="extracurricular" data-index="${index}">
            <div style="font-weight: bold; font-size: 9pt;">${s(item.activity)}</div>
            <div style="font-size: 8pt;">
              ${s(item.organization)}
              ${hasValue(item.role)  ? ` | ${s(item.role)}` : ''}
              ${hasValue(item.year)  ? ` | ${s(item.year)}`
                : (item.startDate   ? ` | ${s(item.startDate)} – ${s(item.endDate) || ''}` : '')}
            </div>
            ${hasValue(item.description) ? `<p style="font-size: 9pt;">${s(item.description)}</p>` : ''}
          </div>
        `).join('')}
      </div>` : ''}

      <!-- Languages -->
      ${(show('languages') && Array.isArray(data.languages) && data.languages.length > 0) ? `
      <div class="main-section" data-section="languages">
        <div class="section-title">LANGUAGES</div>
        <p style="font-size: 9pt;">
          ${data.languages.map((lang: any) =>
            typeof lang === 'string'
              ? lang
              : `${s(lang.language)}${hasValue(lang.level) ? ` (${s(lang.level)})` : ''}`
          ).join(', ')}
        </p>
      </div>` : ''}

      <!-- Hobbies & Interests -->
      ${(show('hobbies') && Array.isArray(data.hobbies) && data.hobbies.length > 0) ? `
      <div class="main-section" data-section="hobbies">
        <div class="section-title">HOBBIES &amp; INTERESTS</div>
        <p style="font-size: 9pt;">${data.hobbies.join(', ')}</p>
      </div>` : ''}

      <!-- Key Achievements (main column) -->
      ${(show('keyAchievements') && Array.isArray(data.keyAchievements) && data.keyAchievements.length > 0) ? `
      <div class="main-section" data-section="keyAchievements">
        <div class="section-title">KEY ACHIEVEMENTS</div>
        <ul>
          ${data.keyAchievements.map((item: string, index: number) =>
            `<li style="font-size: 9pt;" data-section="keyAchievements" data-index="${index}">${s(item)}</li>`
          ).join('')}
        </ul>
      </div>` : ''}

      <!-- Key Responsibilities -->
      ${hasResponsibilitiesContent ? `
      <div class="main-section" data-section="responsibilities">
        <div class="section-title">KEY RESPONSIBILITIES</div>
        <ul>
          ${responsibilityLines.map((line: string, index: number) =>
            `<li style="font-size: 9pt;" data-section="responsibilities" data-index="${index}">${line.trim()}</li>`
          ).join('')}
        </ul>
      </div>` : ''}

      <!-- Tools & Technologies -->
      ${hasToolsContent ? `
      <div class="main-section" data-section="tools">
        <div class="section-title">TOOLS &amp; TECHNOLOGIES</div>
        <p style="font-size: 9pt;">${Array.isArray(data.tools) ? data.tools.join(', ') : s(data.tools)}</p>
      </div>` : ''}

      <!-- References -->
      ${hasValue(data.references) ? `
      <div class="main-section" style="border-top: 1px solid #ddd; padding-top: 15px;" data-section="references">
        <div class="section-title">REFERENCES</div>
        ${Array.isArray(data.references)
          ? `<div style="display: flex; flex-wrap: wrap; gap: 20px; font-size: 8pt;">
              ${data.references.map((ref: any, index: number) => `
                <div data-section="references" data-index="${index}">
                  ${hasValue(ref.name)                    ? `<div style="font-weight:bold;">${s(ref.name)}</div>` : ''}
                  ${hasValue(ref.position || ref.designationRelationship) ? `<div>${s(ref.position || ref.designationRelationship)}</div>` : ''}
                  ${hasValue(ref.company || ref.organization) ? `<div>${s(ref.company || ref.organization)}</div>` : ''}
                  ${hasValue(ref.phone || ref.contactInformation) ? `<div>📞 ${s(ref.phone || ref.contactInformation)}</div>` : ''}
                  ${hasValue(ref.email)                   ? `<div>✉️ ${s(ref.email)}</div>` : ''}
                  ${hasValue(ref.relationship)            ? `<div><em>${s(ref.relationship)}</em></div>` : ''}
                </div>
              `).join('')}
            </div>`
          : `<div style="display: flex; justify-content: space-between; font-size: 8pt;">${s(data.references)}</div>`
        }
      </div>` : ''}

      <!-- Custom Sections -->
      ${(Array.isArray(data.customSections) && data.customSections.length > 0)
        ? data.customSections
            .filter((section: any) =>
              section.isVisible &&
              Array.isArray(section.entries) &&
              section.entries.length > 0 &&
              section.entries.some((e: any) => e.isVisible)
            )
            .map((section: any) => `
        <div class="main-section" data-section="customSections">
          <div class="section-title">${s(section.heading) || 'Custom Section'}</div>
          ${section.entries
            .filter((entry: any) => entry.isVisible)
            .map((entry: any, entryIndex: number) => `
              <div style="margin-bottom: 10px;" data-section="customSections" data-index="${entryIndex}">
                <div style="font-weight: bold; font-size: 10pt;">
                  ${s(entry.title)}
                  ${hasValue(entry.organization) ? ` | ${s(entry.organization)}` : ''}
                  ${hasValue(entry.date) ? ` | ${s(entry.date)}` : ''}
                  ${hasValue(entry.location) ? ` | ${s(entry.location)}` : ''}
                </div>
                ${hasValue(entry.subtitle)    ? `<div style="font-size:9pt;font-style:italic;">${s(entry.subtitle)}</div>` : ''}
                ${hasValue(entry.description) ? `<p style="font-size: 9pt;">${s(entry.description)}</p>` : ''}
                ${hasValue(entry.url)         ? `<p style="font-size:8pt;"><a href="${s(entry.url)}" target="_blank">${s(entry.urlText) || 'View'}</a></p>` : ''}
              </div>
            `).join('')}
        </div>
        `).join('')
        : ''}

      <!-- Speaking Engagements -->
      ${(show('speakingEngagements') && Array.isArray(data.speakingEngagements) && data.speakingEngagements.length > 0) ? `
      <div class="main-section" data-section="speakingEngagements">
        <div class="section-title">SPEAKING ENGAGEMENTS</div>
        ${data.speakingEngagements.map((item: any, index: number) => `
          <div style="margin-bottom:10px;" data-section="speakingEngagements" data-index="${index}">
            <div style="font-weight:bold;font-size:9pt;">${s(item.topic)}</div>
            <div style="font-size:8pt;">
              ${s(item.eventName)}
              ${hasValue(item.date) ? ` | ${s(item.date)}` : ''}
              ${hasValue(item.location) ? ` | ${s(item.location)}` : ''}
            </div>
            ${hasValue(item.description) ? `<p style="font-size:9pt;">${s(item.description)}</p>` : ''}
          </div>
        `).join('')}
      </div>` : ''}

      <!-- Memberships -->
      ${(show('memberships') && Array.isArray(data.memberships) && data.memberships.length > 0) ? `
      <div class="main-section" data-section="memberships">
        <div class="section-title">MEMBERSHIPS</div>
        ${data.memberships.map((item: any, index: number) => `
          <div style="margin-bottom:10px;" data-section="memberships" data-index="${index}">
            <div style="font-weight:bold;font-size:9pt;">${s(item.membershipName)}</div>
            <div style="font-size:8pt;">
              ${s(item.organizationName)}
              ${hasValue(item.year) ? ` | ${s(item.year)}` : ''}
              ${hasValue(item.membershipId) ? ` | ID: ${s(item.membershipId)}` : ''}
            </div>
            ${hasValue(item.description) ? `<p style="font-size:9pt;">${s(item.description)}</p>` : ''}
          </div>
        `).join('')}
      </div>` : ''}

      <!-- Workshops -->
      ${(show('workshops') && Array.isArray(data.workshops) && data.workshops.length > 0) ? `
      <div class="main-section" data-section="workshops">
        <div class="section-title">WORKSHOPS</div>
        ${data.workshops.map((item: any, index: number) => `
          <div style="margin-bottom:10px;" data-section="workshops" data-index="${index}">
            <div style="font-weight:bold;font-size:9pt;">${s(item.programTitle)}</div>
            <div style="font-size:8pt;">
              ${s(item.conductedBy)}
              ${hasValue(item.year) ? ` | ${s(item.year)}` : ''}
              ${hasValue(item.duration) ? ` | ${s(item.duration)}` : ''}
              ${hasValue(item.location) ? ` | ${s(item.location)}` : ''}
            </div>
            ${hasValue(item.description) ? `<p style="font-size:9pt;">${s(item.description)}</p>` : ''}
          </div>
        `).join('')}
      </div>` : ''}

      <!-- Portfolio -->
      ${(show('portfolio') && Array.isArray(data.portfolio) && data.portfolio.length > 0) ? `
      <div class="main-section" data-section="portfolio">
        <div class="section-title">PORTFOLIO</div>
        ${data.portfolio.map((item: any, index: number) => `
          <div style="margin-bottom:10px;" data-section="portfolio" data-index="${index}">
            <div style="font-weight:bold;font-size:9pt;">
              ${s(item.name)}
              ${hasValue(item.type) ? ` | ${s(item.type)}` : ''}
              ${hasValue(item.platform) ? ` | ${s(item.platform)}` : ''}
            </div>
            ${hasValue(item.description) ? `<p style="font-size:9pt;">${s(item.description)}</p>` : ''}
            ${hasValue(item.url) ? `<p style="font-size:8pt;"><a href="${s(item.url)}" target="_blank">View</a></p>` : ''}
          </div>
        `).join('')}
      </div>` : ''}

      <!-- Client Projects -->
      ${(show('clientProjects') && Array.isArray(data.clientProjects) && data.clientProjects.length > 0) ? `
      <div class="main-section" data-section="clientProjects">
        <div class="section-title">CLIENT PROJECTS</div>
        ${data.clientProjects.map((item: any, index: number) => `
          <div style="margin-bottom:10px;" data-section="clientProjects" data-index="${index}">
            <div style="font-weight:bold;font-size:9pt;">${s(item.name)}</div>
            <div style="font-size:8pt;">
              ${hasValue(item.role) ? `${s(item.role)}` : ''}
              ${hasValue(item.clientOrganization) ? ` | Client: ${s(item.clientOrganization)}` : ''}
              ${hasValue(item.duration) ? ` | ${s(item.duration)}` : ''}
            </div>
            ${hasValue(item.description) ? `<p style="font-size:9pt;">${s(item.description)}</p>` : ''}
            ${hasValue(item.toolsTechnologies) ? `<p style="font-size:8.5pt;"><strong>Tech:</strong> ${s(item.toolsTechnologies)}</p>` : ''}
            ${hasValue(item.projectUrl) ? `<p style="font-size:8pt;"><a href="${s(item.projectUrl)}" target="_blank">View Project</a></p>` : ''}
          </div>
        `).join('')}
      </div>` : ''}

      <!-- Volunteering -->
      ${(show('volunteering') && Array.isArray(data.volunteering) && data.volunteering.length > 0) ? `
      <div class="main-section" data-section="volunteering">
        <div class="section-title">VOLUNTEERING</div>
        ${data.volunteering.map((item: any, index: number) => `
          <div style="margin-bottom:10px;" data-section="volunteering" data-index="${index}">
            <div style="font-weight:bold;font-size:9pt;">
              ${s(item.role)}
              ${hasValue(item.organization) ? ` | ${s(item.organization)}` : ''}
            </div>
            <div style="font-size:8pt;">
              ${hasValue(item.causeArea) ? `Cause: ${s(item.causeArea)}` : ''}
              ${hasValue(item.duration) ? ` | ${s(item.duration)}` : ''}
              ${(item.startDate || item.endDate) ? ` | ${s(item.startDate)} – ${s(item.endDate) || 'Present'}` : ''}
            </div>
            ${hasValue(item.description) ? `<p style="font-size:9pt;">${s(item.description)}</p>` : ''}
          </div>
        `).join('')}
      </div>` : ''}

      <!-- Military Service -->
      ${(show('militaryService') && Array.isArray(data.militaryService) && data.militaryService.length > 0) ? `
      <div class="main-section" data-section="militaryService">
        <div class="section-title">MILITARY SERVICE</div>
        ${data.militaryService.map((item: any, index: number) => `
          <div style="margin-bottom:10px;" data-section="militaryService" data-index="${index}">
            <div style="font-weight:bold;font-size:9pt;">
              ${s(item.rank)}${hasValue(item.branch) ? ` — ${s(item.branch)}` : ''}
            </div>
            <div style="font-size:8pt;">
              ${hasValue(item.duration) ? `${s(item.duration)}` : ''}
              ${(item.startDate || item.endDate) ? ` | ${s(item.startDate)} – ${s(item.endDate) || 'Present'}` : ''}
              ${hasValue(item.specialization) ? ` | ${s(item.specialization)}` : ''}
            </div>
            ${hasValue(item.description) ? `<p style="font-size:9pt;">${s(item.description)}</p>` : ''}
          </div>
        `).join('')}
      </div>` : ''}

      <!-- Methodologies -->
      ${(show('methodologies') && Array.isArray(data.methodologies) && data.methodologies.length > 0) ? `
      <div class="main-section" data-section="methodologies">
        <div class="section-title">METHODOLOGIES</div>
        <div style="display:flex;flex-wrap:wrap;gap:8px;">
          ${data.methodologies.map((item: any, index: number) => `
            <div style="font-size:9pt;background:#f3f3f3;padding:4px 8px;border-radius:3px;" data-section="methodologies" data-index="${index}">
              <strong>${s(item.name)}</strong>
              ${hasValue(item.certification) ? ` (${s(item.certification)})` : ''}
              ${hasValue(item.experienceDuration) ? ` | ${s(item.experienceDuration)} yrs` : ''}
            </div>
          `).join('')}
        </div>
      </div>` : ''}

      <!-- Industry Expertise -->
      ${(show('industryExpertise') && Array.isArray(data.industryExpertise) && data.industryExpertise.length > 0) ? `
      <div class="main-section" data-section="industryExpertise">
        <div class="section-title">INDUSTRY EXPERTISE</div>
        <div style="display:flex;flex-wrap:wrap;gap:8px;">
          ${data.industryExpertise.map((item: any, index: number) => `
            <div style="font-size:9pt;background:#f3f3f3;padding:4px 8px;border-radius:3px;" data-section="industryExpertise" data-index="${index}">
              <strong>${s(item.industry)}</strong>
              ${hasValue(item.domainArea) ? ` — ${s(item.domainArea)}` : ''}
              ${hasValue(item.experienceDuration) ? ` | ${s(item.experienceDuration)} yrs` : ''}
            </div>
          `).join('')}
        </div>
      </div>` : ''}

      <!-- Social Profiles -->
      ${(show('socialProfiles') && Array.isArray(data.socialProfiles) && data.socialProfiles.length > 0) ? `
      <div class="main-section" data-section="socialProfiles">
        <div class="section-title">SOCIAL PROFILES</div>
        <div style="display:flex;flex-wrap:wrap;gap:8px;">
          ${data.socialProfiles.map((item: any, index: number) => `
            <div style="font-size:9pt;" data-section="socialProfiles" data-index="${index}">
              🔗 <a href="${s(item.url)}" target="_blank">${s(item.platform)}</a>
              ${hasValue(item.username) ? ` (${s(item.username)})` : ''}
            </div>
          `).join('')}
        </div>
      </div>` : ''}

      <!-- Teaching Experience -->
      ${(show('teachingExperience') && Array.isArray(data.teachingExperience) && data.teachingExperience.length > 0) ? `
      <div class="main-section" data-section="teachingExperience">
        <div class="section-title">TEACHING EXPERIENCE</div>
        ${data.teachingExperience.map((item: any, index: number) => `
          <div style="margin-bottom:10px;" data-section="teachingExperience" data-index="${index}">
            <div style="font-weight:bold;font-size:9pt;">${s(item.title)}</div>
            <div style="font-size:8pt;">
              ${s(item.institution)}
              ${hasValue(item.duration) ? ` | ${s(item.duration)}` : ''}
              ${(item.startDate || item.endDate) ? ` | ${s(item.startDate)} – ${s(item.endDate) || 'Present'}` : ''}
            </div>
            ${hasValue(item.subjectCourseTaught) ? `<div style="font-size:8.5pt;"><strong>Subject:</strong> ${s(item.subjectCourseTaught)}</div>` : ''}
            ${hasValue(item.description) ? `<p style="font-size:9pt;">${s(item.description)}</p>` : ''}
          </div>
        `).join('')}
      </div>` : ''}

      <!-- Mentorship Experience -->
      ${(show('mentorshipExperience') && Array.isArray(data.mentorshipExperience) && data.mentorshipExperience.length > 0) ? `
      <div class="main-section" data-section="mentorshipExperience">
        <div class="section-title">MENTORSHIP EXPERIENCE</div>
        ${data.mentorshipExperience.map((item: any, index: number) => `
          <div style="margin-bottom:10px;" data-section="mentorshipExperience" data-index="${index}">
            <div style="font-weight:bold;font-size:9pt;">
              ${s(item.mentorshipArea)}
              ${hasValue(item.organizationPlatform) ? ` | ${s(item.organizationPlatform)}` : ''}
            </div>
            <div style="font-size:8pt;">
              ${hasValue(item.menteeLevel) ? `Mentee Level: ${s(item.menteeLevel)}` : ''}
              ${hasValue(item.duration) ? ` | ${s(item.duration)}` : ''}
            </div>
            ${hasValue(item.description) ? `<p style="font-size:9pt;">${s(item.description)}</p>` : ''}
          </div>
        `).join('')}
      </div>` : ''}

      <!-- Research Grants -->
      ${(show('researchGrants') && Array.isArray(data.researchGrants) && data.researchGrants.length > 0) ? `
      <div class="main-section" data-section="researchGrants">
        <div class="section-title">RESEARCH GRANTS</div>
        ${data.researchGrants.map((item: any, index: number) => `
          <div style="margin-bottom:10px;" data-section="researchGrants" data-index="${index}">
            <div style="font-weight:bold;font-size:9pt;">${s(item.title)}</div>
            <div style="font-size:8pt;">
              ${s(item.agency)}
              ${hasValue(item.amount) ? ` | ₹${s(item.amount)}` : ''}
              ${hasValue(item.year) ? ` | ${s(item.year)}` : ''}
            </div>
            ${hasValue(item.description) ? `<p style="font-size:9pt;">${s(item.description)}</p>` : ''}
          </div>
        `).join('')}
      </div>` : ''}

      <!-- Test Scores -->
      ${(show('testScores') && Array.isArray(data.testScores) && data.testScores.length > 0) ? `
      <div class="main-section" data-section="testScores">
        <div class="section-title">TEST SCORES</div>
        <div style="display:flex;flex-wrap:wrap;gap:10px;">
          ${data.testScores.map((item: any, index: number) => `
            <div style="font-size:9pt;background:#f3f3f3;padding:6px 10px;border-radius:3px;" data-section="testScores" data-index="${index}">
              <strong>${s(item.testName)}</strong>: ${s(item.score)}
              ${hasValue(item.percentileRank) ? ` | ${s(item.percentileRank)} percentile` : ''}
              ${hasValue(item.year) ? ` | ${s(item.year)}` : ''}
            </div>
          `).join('')}
        </div>
      </div>` : ''}

      <!-- Patents -->
      ${(show('patents') && Array.isArray(data.patents) && data.patents.length > 0) ? `
      <div class="main-section" data-section="patents">
        <div class="section-title">PATENTS</div>
        ${data.patents.map((item: any, index: number) => `
          <div style="margin-bottom:10px;" data-section="patents" data-index="${index}">
            <div style="font-weight:bold;font-size:9pt;">${s(item.title)}</div>
            <div style="font-size:8pt;">
              ${hasValue(item.patentNumber) ? `No: ${s(item.patentNumber)}` : ''}
              ${hasValue(item.status) ? ` | ${s(item.status)}` : ''}
              ${hasValue(item.issuingAuthority) ? ` | ${s(item.issuingAuthority)}` : ''}
              ${hasValue(item.year) ? ` | ${s(item.year)}` : ''}
            </div>
            ${hasValue(item.description) ? `<p style="font-size:9pt;">${s(item.description)}</p>` : ''}
          </div>
        `).join('')}
      </div>` : ''}

      <!-- Tools & Technologies (structured array) -->
      ${(show('toolsTechnologies') && Array.isArray(data.toolsTechnologies) && data.toolsTechnologies.length > 0) ? `
      <div class="main-section" data-section="toolsTechnologies">
        <div class="section-title">TOOLS &amp; TECHNOLOGIES</div>
        <div style="display:flex;flex-wrap:wrap;gap:8px;">
          ${data.toolsTechnologies.map((item: any, index: number) => `
            <div style="font-size:9pt;background:#f3f3f3;padding:4px 8px;border-radius:3px;" data-section="toolsTechnologies" data-index="${index}">
              <strong>${s(item.name)}</strong>
              ${hasValue(item.category) ? ` (${s(item.category)})` : ''}
              ${hasValue(item.proficiency) ? ` | ${s(item.proficiency)}` : ''}
              ${hasValue(item.experienceDuration) ? ` | ${s(item.experienceDuration)}` : ''}
            </div>
          `).join('')}
        </div>
      </div>` : ''}

      <!-- Availability & Work Authorization -->
      ${(show('availabilityWorkAuth') && hasValue(data.availabilityWorkAuth)) ? (() => {
        const a = data.availabilityWorkAuth;
        const fields = [a?.availabilityNoticePeriod, a?.workAuthorizationStatus, a?.preferredLocation].filter(Boolean);
        return fields.length > 0 ? `
        <div class="main-section" data-section="availabilityWorkAuth">
          <div class="section-title">AVAILABILITY &amp; WORK AUTH</div>
          <div style="font-size:9pt;display:flex;flex-direction:column;gap:4px;">
            ${hasValue(a?.availabilityNoticePeriod)   ? `<div><strong>Notice Period:</strong> ${s(a.availabilityNoticePeriod)}</div>` : ''}
            ${hasValue(a?.workAuthorizationStatus)     ? `<div><strong>Work Auth:</strong> ${s(a.workAuthorizationStatus)}</div>` : ''}
            ${hasValue(a?.preferredLocation)           ? `<div><strong>Preferred Location:</strong> ${s(a.preferredLocation)}</div>` : ''}
            ${hasValue(a?.visaType)                    ? `<div><strong>Visa Type:</strong> ${s(a.visaType)}</div>` : ''}
            ${hasValue(a?.willingToRelocate)           ? `<div><strong>Relocate:</strong> ${s(a.willingToRelocate)}</div>` : ''}
          </div>
        </div>` : '';
      })() : ''}

    </div><!-- /content -->
  </div><!-- /main-body -->
</div><!-- /resume-container -->
</body>
</html>`;
}