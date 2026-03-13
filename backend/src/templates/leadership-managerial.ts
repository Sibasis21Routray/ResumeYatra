export function buildLeadershipManagerialTemplate(data: any, theme?: any): string {
  const defaultTheme = {
    primary: '#000000',
    secondary: '#333333',
    background: '#ffffff',
    accent: '#1a73e8',
    headingFont: 'Arial, sans-serif',
    bodyFont: 'Arial, sans-serif'
  };
  const currentTheme = theme || defaultTheme;

  const bodyFontSize = '11pt';
  const headingFontSize = '12pt';
  const nameFontSize = '20pt';
  const titleFontSize = '14pt';

  // ── Safe helpers ──────────────────────────────────────────────────────────

  const hasValue = (v: any): boolean => {
    if (v === null || v === undefined) return false;
    if (typeof v === 'string') return v.trim().length > 0;
    if (Array.isArray(v)) return v.length > 0;
    if (typeof v === 'object') return Object.keys(v).length > 0;
    return Boolean(v);
  };

  const s = (v: any): string => (v == null ? '' : String(v));

  const toLines = (v: any): string[] => {
    if (!v) return [];
    if (Array.isArray(v)) return v.map(String).filter(l => l.trim());
    return String(v).split('\n').filter(l => l.trim());
  };

  const show = (section: string) => data.sectionVisibility?.[section] !== false;

  // ── Derived ───────────────────────────────────────────────────────────────

  const sortedExperience = Array.isArray(data.experience)
    ? [...data.experience].sort(
        (a: any, b: any) =>
          new Date(b.startDate || '1900-01-01').getTime() -
          new Date(a.startDate || '1900-01-01').getTime()
      )
    : [];

  const responsibilityLines = toLines(data.responsibilities);

  /** Normalise experience/internship achievements — string or array */
  const expAchievements = (item: any): string[] => {
    if (!item.achievements) return [];
    if (Array.isArray(item.achievements))
      return item.achievements.filter((a: string) => String(a).trim());
    return String(item.achievements).split('\n').filter((a: string) => a.trim());
  };

  /** Render skills — array or HTML string */
  const renderSkills = (): string => {
    if (!data.skills) return '';
    if (Array.isArray(data.skills)) {
      return `<div class="skills-list">
        ${data.skills.map((skill: any, i: number) => `
          <div class="skill-item" data-section="skills" data-index="${i}">
            ${typeof skill === 'object'
              ? s(skill.name) + (skill.level ? ` (${s(skill.level)})` : '')
              : s(skill)}
          </div>`).join('')}
      </div>`;
    }
    return `<div style="font-size:${bodyFontSize};">${data.skills}</div>`;
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
      --accent-color: ${currentTheme.accent || '#1a73e8'};
      --heading-font: ${currentTheme.headingFont};
      --body-font: ${currentTheme.bodyFont};
    }
    body {
      font-family: var(--body-font);
      color: var(--primary-color);
      line-height: 1.4;
      margin: 0; padding: 0;
      background: var(--background-color);
    }
    .resume-container { max-width: 800px; margin: 0 auto; padding: 40px; }
    .header { margin-bottom: 30px; text-align: center; }
    .name { font-size: ${nameFontSize}; font-weight: bold; color: var(--primary-color); margin-bottom: 5px; text-transform: uppercase; }
    .title { font-size: ${titleFontSize}; color: var(--accent-color); margin-bottom: 5px; font-weight: 600; }
    .contact-info { font-size: ${bodyFontSize}; color: var(--secondary-color); margin-bottom: 20px; }
    .contact-item { display: inline-block; margin: 0 10px; }
    .section { margin-bottom: 25px; }
    .section-title {
      font-size: ${headingFontSize}; font-weight: bold;
      color: var(--accent-color); margin-bottom: 12px;
      text-transform: uppercase; letter-spacing: 1px;
      border-bottom: 2px solid var(--accent-color); padding-bottom: 5px;
    }
    p, ul, li { font-size: ${bodyFontSize}; margin: 0; padding: 0; color: var(--secondary-color); }
    ul { margin-left: 20px; }
    li { margin-bottom: 6px; line-height: 1.5; }
    .summary { margin-bottom: 25px; }
    .experience-item { margin-bottom: 20px; }
    .company-title { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 5px; }
    .company { font-weight: bold; font-size: ${bodyFontSize}; color: var(--primary-color); }
    .job-title { color: var(--accent-color); font-weight: 600; margin-bottom: 3px; font-size: ${bodyFontSize}; }
    .date { color: #666; font-size: ${bodyFontSize}; font-weight: normal; white-space: nowrap; }
    .skills-section { margin-bottom: 20px; }
    .skills-list { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 10px; }
    .skill-item { background: #f5f5f5; padding: 5px 12px; border-radius: 4px; font-size: ${bodyFontSize}; }
    .badge-list { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 8px; }
    .badge { background: #f0f4ff; border: 1px solid #c7d7f9; padding: 4px 10px; border-radius: 4px; font-size: 10pt; color: var(--primary-color); }
    .education-item { margin-bottom: 15px; }
    .education-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 3px; }
    .degree { font-weight: 600; color: var(--primary-color); }
    .school { color: var(--secondary-color); margin-bottom: 2px; }
    .certification-item { margin-bottom: 10px; }
    .certification-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 3px; }
    .cert-name { font-weight: 600; color: var(--primary-color); }
    .issuer { color: var(--secondary-color); }
    a { color: var(--accent-color); text-decoration: none; }
    a:hover { text-decoration: underline; }
    .profile-photo-container {
      width: 100px; height: 100px; border-radius: 50%;
      overflow: hidden; border: 2px solid var(--accent-color);
      margin: 0 auto 15px; background: #f5f5f5;
    }
    .profile-photo { width: 100%; height: 100%; object-fit: cover; }
    .profile-photo-placeholder {
      width: 100%; height: 100%; display: flex; flex-direction: column;
      align-items: center; justify-content: center;
      background: #f5f5f5; color: #999; font-size: 12px; text-align: center; padding: 8px;
    }
    .profile-photo-placeholder svg { width: 24px; height: 24px; margin-bottom: 8px; opacity: 0.6; }
    /* Education enhanced */
    .education-entry {
      margin-bottom: 18px; padding: 15px;
      background: rgba(26,115,232,0.03);
      border: 1px solid rgba(26,115,232,0.1);
      border-left: 4px solid var(--accent-color);
      border-radius: 6px;
    }
    .education-degree { font-weight: 700; color: var(--accent-color); margin-bottom: 5px; font-size: 12pt; }
    .education-field  { font-weight: 600; color: var(--primary-color); margin-bottom: 4px; font-size: 11pt; }
    .education-school { font-weight: 700; color: var(--primary-color); margin-bottom: 4px; font-size: 11pt; }
    .education-location { color: var(--secondary-color); font-style: italic; margin-bottom: 6px; font-size: 10pt; }
    .education-date { font-size: 10pt; color: #666; font-weight: 600; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.5px; }
    .education-gpa { font-size: 10pt; color: var(--secondary-color); margin-bottom: 6px; }
    .education-description {
      font-size: 11pt; color: var(--secondary-color); line-height: 1.5;
      margin-top: 10px; padding: 10px; background: rgba(255,255,255,0.9);
      border-radius: 4px; border-left: 2px solid var(--accent-color);
    }
    .education-description ul { margin: 4px 0 4px 15px; padding: 0; list-style-type: disc; }
    .education-description li { margin: 2px 0; color: var(--secondary-color); }
    .education-description b { font-weight: 700; color: var(--primary-color); }
    .education-achievements { margin-top: 10px; padding-top: 10px; border-top: 2px solid rgba(26,115,232,0.1); }
    .education-achievements h4 { font-size: 10pt; font-weight: 700; color: var(--accent-color); margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.5px; }
    .education-achievements ul { margin: 0; padding-left: 0; list-style: none; }
    .education-achievements li { position: relative; padding-left: 16px; margin-bottom: 3px; color: var(--secondary-color); font-size: 11pt; }
    .education-achievements li:before { content: "👔"; position: absolute; left: 0; font-size: 9pt; }
    .two-col { display: flex; flex-wrap: wrap; gap: 10px; }
    .info-row { display: flex; flex-direction: column; gap: 6px; font-size: ${bodyFontSize}; color: var(--secondary-color); }
  </style>
</head>
<body>
<div class="resume-container">

  <!-- ═══ HEADER ═══ -->
  <div class="header" data-section="personal">
    ${hasValue(data.personal?.image)
      ? `<div class="profile-photo-container"><img src="${s(data.personal.image)}" alt="Profile" class="profile-photo"/></div>`
      : `<div class="profile-photo-container"><div class="profile-photo-placeholder">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
          </svg>Add Photo</div></div>`}
    <div class="name">${s(data.personal?.name) || 'Your Name'}</div>
    ${hasValue(data.personal?.role) ? `<div class="title">${s(data.personal.role)}</div>` : ''}
    ${hasValue(data.personal?.title) ? `<div style="font-size:14px;color:var(--secondary-color);font-weight:600;margin-bottom:5px;">${s(data.personal.title)}</div>` : ''}
    <div class="contact-info">
      ${hasValue(data.personal?.phone)         ? `<span class="contact-item">📞 ${s(data.personal.phone)}</span>` : ''}
      ${hasValue(data.personal?.alternatePhone) ? `<span class="contact-item">📞 ${s(data.personal.alternatePhone)}</span>` : ''}
      ${hasValue(data.personal?.email)         ? `<span class="contact-item">✉️ ${s(data.personal.email)}</span>` : ''}
      ${(hasValue(data.personal?.location) || hasValue(data.personal?.city) || hasValue(data.personal?.state) || hasValue(data.personal?.country) || hasValue(data.personal?.pinCode) || hasValue(data.personal?.fullAddress))
        ? `<span class="contact-item">📍 ${[data.personal?.fullAddress, data.personal?.location, data.personal?.city, data.personal?.state, data.personal?.country, data.personal?.pinCode].filter(Boolean).join(', ')}</span>` : ''}
      ${hasValue(data.personal?.linkedinUrl)   ? `<span class="contact-item"><a href="${s(data.personal.linkedinUrl)}" target="_blank">LinkedIn</a></span>` : ''}
      ${hasValue(data.personal?.githubUrl)     ? `<span class="contact-item"><a href="${s(data.personal.githubUrl)}" target="_blank">GitHub</a></span>` : ''}
      ${hasValue(data.personal?.portfolioUrl)  ? `<span class="contact-item"><a href="${s(data.personal.portfolioUrl)}" target="_blank">Portfolio</a></span>` : ''}
      ${hasValue(data.personal?.website)       ? `<span class="contact-item"><a href="${s(data.personal.website)}" target="_blank">Website</a></span>` : ''}
      ${hasValue(data.personal?.twitter)       ? `<span class="contact-item"><a href="${s(data.personal.twitter)}" target="_blank">Twitter</a></span>` : ''}
      ${hasValue(data.personal?.skype)         ? `<span class="contact-item">Skype: ${s(data.personal.skype)}</span>` : ''}
    </div>
  </div>

  <!-- ═══ PERSONAL DETAILS ═══ -->
  ${(hasValue(data.personal?.fathersName) || hasValue(data.personal?.mothersName) || hasValue(data.personal?.dob) || hasValue(data.personal?.gender) || hasValue(data.personal?.maritalStatus) || hasValue(data.personal?.nationality) || hasValue(data.personal?.religion) || hasValue(data.personal?.category)) ? `
  <div class="section" data-section="personal">
    <div class="section-title">Personal Details</div>
    <div class="info-row">
      ${hasValue(data.personal?.fathersName)   ? `<div><strong>Father's Name:</strong> ${s(data.personal.fathersName)}</div>` : ''}
      ${hasValue(data.personal?.mothersName)   ? `<div><strong>Mother's Name:</strong> ${s(data.personal.mothersName)}</div>` : ''}
      ${hasValue(data.personal?.dob)           ? `<div><strong>Date of Birth:</strong> ${s(data.personal.dob)}</div>` : ''}
      ${hasValue(data.personal?.age)           ? `<div><strong>Age:</strong> ${s(data.personal.age)}</div>` : ''}
      ${hasValue(data.personal?.gender)        ? `<div><strong>Gender:</strong> ${s(data.personal.gender)}</div>` : ''}
      ${hasValue(data.personal?.maritalStatus) ? `<div><strong>Marital Status:</strong> ${s(data.personal.maritalStatus)}</div>` : ''}
      ${hasValue(data.personal?.nationality)   ? `<div><strong>Nationality:</strong> ${s(data.personal.nationality)}</div>` : ''}
      ${hasValue(data.personal?.religion)      ? `<div><strong>Religion:</strong> ${s(data.personal.religion)}</div>` : ''}
      ${hasValue(data.personal?.category)      ? `<div><strong>Category:</strong> ${s(data.personal.category)}</div>` : ''}
    </div>
  </div>` : ''}

  <!-- ═══ SUMMARY ═══ -->
  ${(show('summary') && hasValue(data.summary)) ? `
  <div class="section summary" data-section="summary">
    <div class="section-title">Summary</div>
    <p>${s(data.summary)}</p>
  </div>` : ''}

  <!-- ═══ CAREER OBJECTIVE ═══ -->
  ${(show('careerObjective') && hasValue(data.careerObjective)) ? `
  <div class="section" data-section="careerObjective">
    <div class="section-title">Career Objective</div>
    <p>${s(data.careerObjective)}</p>
  </div>` : ''}

  <!-- ═══ SKILLS ═══ -->
  ${(show('skills') && hasValue(data.skills)) ? `
  <div class="section skills-section" data-section="skills">
    <div class="section-title">Professional Skills</div>
    ${renderSkills()}
  </div>` : ''}

  <!-- ═══ WORK EXPERIENCE ═══ -->
  ${(show('experience') && sortedExperience.length > 0) ? `
  <div class="section" data-section="experience">
    <div class="section-title">Work Experience</div>
    ${sortedExperience.map((exp: any, index: number) => {
      const lines = toLines(exp.description);
      const achievements = expAchievements(exp);
      return `
      <div class="experience-item" data-section="experience" data-index="${index}">
        <div class="company-title">
          <div class="company">${s(exp.company)}${hasValue(exp.location) ? ` — ${s(exp.location)}` : ''}</div>
          <div class="date">${s(exp.startDate)}${(exp.startDate || exp.endDate) ? ' – ' : ''}${s(exp.endDate) || (exp.startDate ? 'Present' : '')}</div>
        </div>
        <div class="job-title">
          ${s(exp.title)}
          ${hasValue(exp.employmentType) ? ` | ${s(exp.employmentType)}` : ''}
        </div>
        ${lines.length > 0 ? `<ul>${lines.map((l: string, li: number) => `<li data-section="experience" data-index="${index}" data-item-index="${li}">${l.trim()}</li>`).join('')}</ul>` : ''}
        ${achievements.length > 0 ? `<ul style="margin-top:6px;">${achievements.map((a: string, ai: number) => `<li data-section="experience" data-index="${index}" data-item-index="${ai}">⭐ ${a}</li>`).join('')}</ul>` : ''}
        ${hasValue(exp.technologies) ? `<p style="margin-top:5px;"><strong>Technologies:</strong> ${s(exp.technologies)}</p>` : ''}
      </div>`;
    }).join('')}
  </div>` : ''}

  <!-- ═══ EDUCATION ═══ -->
  ${(show('education') && Array.isArray(data.education) && data.education.length > 0) ? `
  <div class="section" data-section="education">
    <div class="section-title">Education</div>
    ${data.education.map((edu: any, index: number) => `
      <div class="education-entry" data-section="education" data-index="${index}">
        ${hasValue(edu.degree) ? `<div class="education-degree" data-section="education" data-index="${index}">${s(edu.degree)}${hasValue(edu.qualification) ? ` (${s(edu.qualification)})` : ''}</div>` : ''}
        ${hasValue(edu.field)       ? `<div class="education-field"    data-section="education" data-index="${index}">${s(edu.field)}</div>` : ''}
        ${hasValue(edu.school)      ? `<div class="education-school"   data-section="education" data-index="${index}">${s(edu.school)}</div>` : ''}
        ${hasValue(edu.university)  ? `<div class="education-school"   data-section="education" data-index="${index}">${s(edu.university)}</div>` : ''}
        ${hasValue(edu.board)       ? `<div style="font-size:10pt;color:var(--secondary-color);" data-section="education" data-index="${index}">Board: ${s(edu.board)}</div>` : ''}
        ${hasValue(edu.location)    ? `<div class="education-location" data-section="education" data-index="${index}">${s(edu.location)}</div>` : ''}
        ${(hasValue(edu.graduationDate) || hasValue(edu.startDate) || hasValue(edu.endDate)) ? `
          <div class="education-date" data-section="education" data-index="${index}">
            ${edu.startDate && edu.endDate ? `${s(edu.startDate)} – ${s(edu.endDate)}` : (s(edu.graduationDate) || s(edu.endDate) || s(edu.startDate))}
          </div>` : ''}
        ${hasValue(edu.percentage)  ? `<div class="education-gpa" data-section="education" data-index="${index}">Score: ${s(edu.percentage)}%</div>` : ''}
        ${hasValue(edu.cgpa)        ? `<div class="education-gpa" data-section="education" data-index="${index}">CGPA: ${s(edu.cgpa)}</div>` : ''}
        ${hasValue(edu.gpa)         ? `<div class="education-gpa" data-section="education" data-index="${index}">GPA: ${s(edu.gpa)}</div>` : ''}
        ${hasValue(edu.grade)       ? `<div class="education-gpa" data-section="education" data-index="${index}">Grade: ${s(edu.grade)}</div>` : ''}
        ${hasValue(edu.description) ? `
          <div class="education-description" data-section="education" data-index="${index}">
            ${edu.description.includes('<ul>') || edu.description.includes('<li>') ? edu.description : `<p>${edu.description}</p>`}
          </div>` : ''}
        ${(Array.isArray(edu.achievements) && edu.achievements.filter((a: string) => a.trim()).length > 0) ? `
          <div class="education-achievements" data-section="education" data-index="${index}">
            <h4>Academic Excellence</h4>
            <ul>${edu.achievements.filter((a: string) => a.trim()).map((a: string, ai: number) =>
              `<li data-section="education" data-index="${index}" data-item-index="${ai}">${a}</li>`).join('')}</ul>
          </div>` : ''}
      </div>
    `).join('')}
  </div>` : ''}

  <!-- ═══ CERTIFICATIONS ═══ -->
  ${(show('certifications') && Array.isArray(data.certifications) && data.certifications.length > 0) ? `
  <div class="section" data-section="certifications">
    <div class="section-title">Certifications</div>
    ${data.certifications.map((cert: any, index: number) => `
      <div class="certification-item" data-section="certifications" data-index="${index}">
        <div class="certification-header">
          <div class="cert-name">${s(cert.name)}</div>
          <div class="date">${s(cert.date)}</div>
        </div>
        <div class="issuer">${s(cert.issuer)}${hasValue(cert.expiryDate) ? ` | Expires: ${s(cert.expiryDate)}` : ''}${hasValue(cert.credentialId) ? ` | ID: ${s(cert.credentialId)}` : ''}</div>
        ${hasValue(cert.description) ? `<p style="margin-top:4px;">${s(cert.description)}</p>` : ''}
        ${hasValue(cert.url) ? `<div style="margin-top:8px;"><a href="${s(cert.url)}" target="_blank">View Certificate</a></div>` : ''}
      </div>
    `).join('')}
  </div>` : ''}

  <!-- ═══ PROJECTS ═══ -->
  ${(show('projects') && Array.isArray(data.projects) && data.projects.length > 0) ? `
  <div class="section" data-section="projects">
    <div class="section-title">Projects</div>
    ${data.projects.map((project: any, index: number) => `
      <div class="experience-item" data-section="projects" data-index="${index}">
        <div class="company-title">
          <div class="company">${s(project.name)}</div>
          <div class="date">${s(project.startDate)}${(project.startDate || project.endDate) ? ' – ' : ''}${s(project.endDate) || (project.startDate ? 'Present' : '')}</div>
        </div>
        ${hasValue(project.role)         ? `<div class="job-title">${s(project.role)}</div>` : ''}
        ${hasValue(project.technologies) ? `<div style="color:var(--secondary-color);font-size:${bodyFontSize};margin-bottom:5px;">${s(project.technologies)}</div>` : ''}
        ${hasValue(project.description)  ? `<p>${s(project.description)}</p>` : ''}
        ${hasValue(project.url)          ? `<p style="margin-top:8px;"><strong>Link:</strong> <a href="${s(project.url)}" target="_blank">${s(project.urlText) || s(project.url)}</a></p>` : ''}
        ${hasValue(project.githubUrl)    ? `<p style="margin-top:4px;"><strong>GitHub:</strong> <a href="${s(project.githubUrl)}" target="_blank">View</a></p>` : ''}
      </div>
    `).join('')}
  </div>` : ''}

  <!-- ═══ INTERNSHIPS ═══ -->
  ${(show('internships') && Array.isArray(data.internships) && data.internships.length > 0) ? `
  <div class="section" data-section="internships">
    <div class="section-title">Internships</div>
    ${data.internships.map((item: any, index: number) => {
      const lines = toLines(item.description);
      return `
      <div class="experience-item" data-section="internships" data-index="${index}">
        <div class="company-title">
          <div class="company">${s(item.title)}</div>
          <div class="date">${s(item.startDate)}${(item.startDate || item.endDate || item.duration) ? ' ' : ''}${s(item.endDate) || s(item.duration)}</div>
        </div>
        <div class="job-title">${s(item.company)}${hasValue(item.location) ? `, ${s(item.location)}` : ''}</div>
        ${hasValue(item.stipend)      ? `<p><strong>Stipend:</strong> ${s(item.stipend)}</p>` : ''}
        ${lines.length > 0 ? `<ul>${lines.map((l: string, li: number) => `<li data-section="internships" data-index="${index}" data-item-index="${li}">${l.trim()}</li>`).join('')}</ul>` : ''}
        ${hasValue(item.technologies) ? `<p style="margin-top:5px;"><strong>Technologies:</strong> ${s(item.technologies)}</p>` : ''}
      </div>`;
    }).join('')}
  </div>` : ''}

  <!-- ═══ ACADEMIC PROJECTS ═══ -->
  ${(show('academicProjects') && Array.isArray(data.academicProjects) && data.academicProjects.length > 0) ? `
  <div class="section" data-section="academicProjects">
    <div class="section-title">Academic Projects</div>
    ${data.academicProjects.map((item: any, index: number) => `
      <div class="experience-item" data-section="academicProjects" data-index="${index}">
        <div class="company-title">
          <div class="company">${s(item.name) || s(item.title)}</div>
          <div class="date">${s(item.duration)}${hasValue(item.year) ? ` | ${s(item.year)}` : ''}</div>
        </div>
        <div class="job-title">${s(item.institution)}${hasValue(item.course) ? ` | ${s(item.course)}` : ''}</div>
        ${hasValue(item.description)  ? `<p>${s(item.description)}</p>` : ''}
        ${hasValue(item.technologies) ? `<p style="margin-top:5px;"><strong>Technologies:</strong> ${Array.isArray(item.technologies) ? item.technologies.join(', ') : s(item.technologies)}</p>` : ''}
        ${hasValue(item.url)          ? `<p style="margin-top:5px;"><a href="${s(item.url)}" target="_blank">View Project</a></p>` : ''}
      </div>
    `).join('')}
  </div>` : ''}

  <!-- ═══ LEADERSHIP POSITIONS ═══ -->
  ${(show('leadershipPositions') && Array.isArray(data.leadershipPositions) && data.leadershipPositions.length > 0) ? `
  <div class="section" data-section="leadershipPositions">
    <div class="section-title">Leadership &amp; Positions</div>
    ${data.leadershipPositions.map((item: any, index: number) => `
      <div class="experience-item" data-section="leadershipPositions" data-index="${index}">
        <div class="company-title">
          <div class="company">${s(item.position) || s(item.title)}</div>
          <div class="date">${s(item.startDate)}${(item.startDate || item.endDate) ? ' – ' : ''}${s(item.endDate) || (item.startDate ? 'Present' : '')}</div>
        </div>
        <div class="job-title">${s(item.organization)}</div>
        ${hasValue(item.description) ? `<p>${s(item.description)}</p>` : ''}
      </div>
    `).join('')}
  </div>` : ''}

  <!-- ═══ TRAINING PROGRAMS ═══ -->
  ${(show('trainingPrograms') && Array.isArray(data.trainingPrograms) && data.trainingPrograms.length > 0) ? `
  <div class="section" data-section="trainingPrograms">
    <div class="section-title">Training Programs</div>
    ${data.trainingPrograms.map((item: any, index: number) => `
      <div class="experience-item" data-section="trainingPrograms" data-index="${index}">
        <div class="company-title">
          <div class="company">${s(item.name)}</div>
          <div class="date">${s(item.completionDate)}</div>
        </div>
        <div class="job-title">${s(item.provider) || s(item.organization)}${hasValue(item.duration) ? ` | ${s(item.duration)}` : ''}${hasValue(item.mode) ? ` | ${s(item.mode)}` : ''}</div>
        ${hasValue(item.description) ? `<p>${s(item.description)}</p>` : ''}
      </div>
    `).join('')}
  </div>` : ''}

  <!-- ═══ SCHOLARSHIPS ═══ -->
  ${(show('scholarships') && Array.isArray(data.scholarships) && data.scholarships.length > 0) ? `
  <div class="section" data-section="scholarships">
    <div class="section-title">Scholarships</div>
    ${data.scholarships.map((item: any, index: number) => `
      <div class="experience-item" data-section="scholarships" data-index="${index}">
        <div class="company-title">
          <div class="company">${s(item.name)}</div>
          <div class="date">${s(item.year)}</div>
        </div>
        <div class="job-title">${s(item.provider) || s(item.organization)}${hasValue(item.amount) ? ` | ${s(item.amount)}` : ''}</div>
        ${hasValue(item.description) ? `<p>${s(item.description)}</p>` : ''}
      </div>
    `).join('')}
  </div>` : ''}

  <!-- ═══ AWARDS ═══ -->
  ${(show('awards') && Array.isArray(data.awards) && data.awards.length > 0) ? `
  <div class="section" data-section="awards">
    <div class="section-title">Awards &amp; Honors</div>
    ${data.awards.map((item: any, index: number) => `
      <div class="experience-item" data-section="awards" data-index="${index}">
        <div class="company-title">
          <div class="company">${s(item.title) || s(item.name)}</div>
          <div class="date">${s(item.date || item.issueYear || item.year)}</div>
        </div>
        <div class="job-title">${s(item.issuer || item.organization)}</div>
        ${hasValue(item.description) ? `<p>${s(item.description)}</p>` : ''}
      </div>
    `).join('')}
  </div>` : ''}

  <!-- ═══ SPEAKING ENGAGEMENTS ═══ -->
  ${(show('speakingEngagements') && Array.isArray(data.speakingEngagements) && data.speakingEngagements.length > 0) ? `
  <div class="section" data-section="speakingEngagements">
    <div class="section-title">Speaking Engagements</div>
    ${data.speakingEngagements.map((item: any, index: number) => `
      <div class="experience-item" data-section="speakingEngagements" data-index="${index}">
        <div class="company-title">
          <div class="company">${s(item.topic)}</div>
          <div class="date">${s(item.date)}</div>
        </div>
        <div class="job-title">${s(item.eventName)}${hasValue(item.location) ? ` | ${s(item.location)}` : ''}</div>
        ${hasValue(item.description) ? `<p>${s(item.description)}</p>` : ''}
      </div>
    `).join('')}
  </div>` : ''}

  <!-- ═══ MEMBERSHIPS ═══ -->
  ${(show('memberships') && Array.isArray(data.memberships) && data.memberships.length > 0) ? `
  <div class="section" data-section="memberships">
    <div class="section-title">Memberships</div>
    ${data.memberships.map((item: any, index: number) => `
      <div class="experience-item" data-section="memberships" data-index="${index}">
        <div class="company-title">
          <div class="company">${s(item.membershipName)}</div>
          <div class="date">${s(item.year)}</div>
        </div>
        <div class="job-title">${s(item.organizationName)}${hasValue(item.membershipId) ? ` | ID: ${s(item.membershipId)}` : ''}</div>
        ${hasValue(item.description) ? `<p>${s(item.description)}</p>` : ''}
      </div>
    `).join('')}
  </div>` : ''}

  <!-- ═══ WORKSHOPS ═══ -->
  ${(show('workshops') && Array.isArray(data.workshops) && data.workshops.length > 0) ? `
  <div class="section" data-section="workshops">
    <div class="section-title">Workshops</div>
    ${data.workshops.map((item: any, index: number) => `
      <div class="experience-item" data-section="workshops" data-index="${index}">
        <div class="company-title">
          <div class="company">${s(item.programTitle)}</div>
          <div class="date">${s(item.year)}</div>
        </div>
        <div class="job-title">${s(item.conductedBy)}${hasValue(item.duration) ? ` | ${s(item.duration)}` : ''}${hasValue(item.location) ? ` | ${s(item.location)}` : ''}</div>
        ${hasValue(item.description) ? `<p>${s(item.description)}</p>` : ''}
      </div>
    `).join('')}
  </div>` : ''}

  <!-- ═══ PORTFOLIO ═══ -->
  ${(show('portfolio') && Array.isArray(data.portfolio) && data.portfolio.length > 0) ? `
  <div class="section" data-section="portfolio">
    <div class="section-title">Portfolio</div>
    ${data.portfolio.map((item: any, index: number) => `
      <div class="experience-item" data-section="portfolio" data-index="${index}">
        <div class="company-title">
          <div class="company">${s(item.name)}</div>
          <div class="date">${s(item.type)}${hasValue(item.platform) ? ` | ${s(item.platform)}` : ''}</div>
        </div>
        ${hasValue(item.description) ? `<p>${s(item.description)}</p>` : ''}
        ${hasValue(item.url) ? `<p style="margin-top:5px;"><a href="${s(item.url)}" target="_blank">View</a></p>` : ''}
      </div>
    `).join('')}
  </div>` : ''}

  <!-- ═══ CLIENT PROJECTS ═══ -->
  ${(show('clientProjects') && Array.isArray(data.clientProjects) && data.clientProjects.length > 0) ? `
  <div class="section" data-section="clientProjects">
    <div class="section-title">Client Projects</div>
    ${data.clientProjects.map((item: any, index: number) => `
      <div class="experience-item" data-section="clientProjects" data-index="${index}">
        <div class="company-title">
          <div class="company">${s(item.name)}</div>
          <div class="date">${s(item.duration)}</div>
        </div>
        <div class="job-title">${s(item.role)}${hasValue(item.clientOrganization) ? ` | Client: ${s(item.clientOrganization)}` : ''}</div>
        ${hasValue(item.description)       ? `<p>${s(item.description)}</p>` : ''}
        ${hasValue(item.toolsTechnologies) ? `<p style="margin-top:5px;"><strong>Tech:</strong> ${s(item.toolsTechnologies)}</p>` : ''}
        ${hasValue(item.projectUrl)        ? `<p style="margin-top:5px;"><a href="${s(item.projectUrl)}" target="_blank">View Project</a></p>` : ''}
      </div>
    `).join('')}
  </div>` : ''}

  <!-- ═══ VOLUNTEERING ═══ -->
  ${(show('volunteering') && Array.isArray(data.volunteering) && data.volunteering.length > 0) ? `
  <div class="section" data-section="volunteering">
    <div class="section-title">Volunteering</div>
    ${data.volunteering.map((item: any, index: number) => `
      <div class="experience-item" data-section="volunteering" data-index="${index}">
        <div class="company-title">
          <div class="company">${s(item.role)}</div>
          <div class="date">${s(item.duration)}${(item.startDate || item.endDate) ? ` | ${s(item.startDate)} – ${s(item.endDate) || 'Present'}` : ''}</div>
        </div>
        <div class="job-title">${s(item.organization)}${hasValue(item.causeArea) ? ` | ${s(item.causeArea)}` : ''}</div>
        ${hasValue(item.description) ? `<p>${s(item.description)}</p>` : ''}
      </div>
    `).join('')}
  </div>` : ''}

  <!-- ═══ MILITARY SERVICE ═══ -->
  ${(show('militaryService') && Array.isArray(data.militaryService) && data.militaryService.length > 0) ? `
  <div class="section" data-section="militaryService">
    <div class="section-title">Military Service</div>
    ${data.militaryService.map((item: any, index: number) => `
      <div class="experience-item" data-section="militaryService" data-index="${index}">
        <div class="company-title">
          <div class="company">${s(item.rank)}${hasValue(item.branch) ? ` — ${s(item.branch)}` : ''}</div>
          <div class="date">${s(item.duration)}${(item.startDate || item.endDate) ? ` | ${s(item.startDate)} – ${s(item.endDate) || 'Present'}` : ''}</div>
        </div>
        ${hasValue(item.specialization) ? `<div class="job-title">${s(item.specialization)}</div>` : ''}
        ${hasValue(item.description) ? `<p>${s(item.description)}</p>` : ''}
      </div>
    `).join('')}
  </div>` : ''}

  <!-- ═══ TEACHING EXPERIENCE ═══ -->
  ${(show('teachingExperience') && Array.isArray(data.teachingExperience) && data.teachingExperience.length > 0) ? `
  <div class="section" data-section="teachingExperience">
    <div class="section-title">Teaching Experience</div>
    ${data.teachingExperience.map((item: any, index: number) => `
      <div class="experience-item" data-section="teachingExperience" data-index="${index}">
        <div class="company-title">
          <div class="company">${s(item.title)}</div>
          <div class="date">${s(item.duration)}${(item.startDate || item.endDate) ? ` | ${s(item.startDate)} – ${s(item.endDate) || 'Present'}` : ''}</div>
        </div>
        <div class="job-title">${s(item.institution)}</div>
        ${hasValue(item.subjectCourseTaught) ? `<p><strong>Subject:</strong> ${s(item.subjectCourseTaught)}</p>` : ''}
        ${hasValue(item.description) ? `<p>${s(item.description)}</p>` : ''}
      </div>
    `).join('')}
  </div>` : ''}

  <!-- ═══ MENTORSHIP EXPERIENCE ═══ -->
  ${(show('mentorshipExperience') && Array.isArray(data.mentorshipExperience) && data.mentorshipExperience.length > 0) ? `
  <div class="section" data-section="mentorshipExperience">
    <div class="section-title">Mentorship Experience</div>
    ${data.mentorshipExperience.map((item: any, index: number) => `
      <div class="experience-item" data-section="mentorshipExperience" data-index="${index}">
        <div class="company-title">
          <div class="company">${s(item.mentorshipArea)}</div>
          <div class="date">${s(item.duration)}</div>
        </div>
        <div class="job-title">${s(item.organizationPlatform)}${hasValue(item.menteeLevel) ? ` | Mentee Level: ${s(item.menteeLevel)}` : ''}</div>
        ${hasValue(item.description) ? `<p>${s(item.description)}</p>` : ''}
      </div>
    `).join('')}
  </div>` : ''}

  <!-- ═══ PUBLICATIONS ═══ -->
  ${(show('publications') && Array.isArray(data.publications) && data.publications.length > 0) ? `
  <div class="section" data-section="publications">
    <div class="section-title">Publications</div>
    ${data.publications.map((item: any, index: number) => `
      <div class="experience-item" data-section="publications" data-index="${index}">
        <div class="company-title">
          <div class="company">${s(item.title)}</div>
          <div class="date">${s(item.date || item.year)}</div>
        </div>
        <div class="job-title">${s(item.publisher || item.journalPublisher || item.journal)}${hasValue(item.publicationType) ? ` | ${s(item.publicationType)}` : ''}</div>
        ${hasValue(item.authors) ? `<p><strong>Authors:</strong> ${s(item.authors)}</p>` : ''}
        ${hasValue(item.description) ? `<p>${s(item.description)}</p>` : ''}
        ${hasValue(item.url || item.urlDoi) ? `<p style="margin-top:5px;"><a href="${s(item.url || item.urlDoi)}" target="_blank">Read</a></p>` : ''}
      </div>
    `).join('')}
  </div>` : ''}

  <!-- ═══ RESEARCH GRANTS ═══ -->
  ${(show('researchGrants') && Array.isArray(data.researchGrants) && data.researchGrants.length > 0) ? `
  <div class="section" data-section="researchGrants">
    <div class="section-title">Research Grants</div>
    ${data.researchGrants.map((item: any, index: number) => `
      <div class="experience-item" data-section="researchGrants" data-index="${index}">
        <div class="company-title">
          <div class="company">${s(item.title)}</div>
          <div class="date">${s(item.year)}</div>
        </div>
        <div class="job-title">${s(item.agency)}${hasValue(item.amount) ? ` | Amount: ${s(item.amount)}` : ''}</div>
        ${hasValue(item.description) ? `<p>${s(item.description)}</p>` : ''}
      </div>
    `).join('')}
  </div>` : ''}

  <!-- ═══ PATENTS ═══ -->
  ${(show('patents') && Array.isArray(data.patents) && data.patents.length > 0) ? `
  <div class="section" data-section="patents">
    <div class="section-title">Patents</div>
    ${data.patents.map((item: any, index: number) => `
      <div class="experience-item" data-section="patents" data-index="${index}">
        <div class="company-title">
          <div class="company">${s(item.title)}</div>
          <div class="date">${s(item.year)}</div>
        </div>
        <div class="job-title">
          ${hasValue(item.patentNumber) ? `No: ${s(item.patentNumber)}` : ''}
          ${hasValue(item.status) ? ` | ${s(item.status)}` : ''}
          ${hasValue(item.issuingAuthority) ? ` | ${s(item.issuingAuthority)}` : ''}
        </div>
        ${hasValue(item.description) ? `<p>${s(item.description)}</p>` : ''}
      </div>
    `).join('')}
  </div>` : ''}

  <!-- ═══ TEST SCORES ═══ -->
  ${(show('testScores') && Array.isArray(data.testScores) && data.testScores.length > 0) ? `
  <div class="section" data-section="testScores">
    <div class="section-title">Test Scores</div>
    <div class="badge-list">
      ${data.testScores.map((item: any, index: number) => `
        <div class="badge" data-section="testScores" data-index="${index}">
          <strong>${s(item.testName)}</strong>: ${s(item.score)}
          ${hasValue(item.percentileRank) ? ` | ${s(item.percentileRank)} percentile` : ''}
          ${hasValue(item.year) ? ` | ${s(item.year)}` : ''}
        </div>
      `).join('')}
    </div>
  </div>` : ''}

  <!-- ═══ METHODOLOGIES ═══ -->
  ${(show('methodologies') && Array.isArray(data.methodologies) && data.methodologies.length > 0) ? `
  <div class="section" data-section="methodologies">
    <div class="section-title">Methodologies</div>
    <div class="badge-list">
      ${data.methodologies.map((item: any, index: number) => `
        <div class="badge" data-section="methodologies" data-index="${index}">
          <strong>${s(item.name)}</strong>
          ${hasValue(item.certification) ? ` (${s(item.certification)})` : ''}
          ${hasValue(item.experienceDuration) ? ` | ${s(item.experienceDuration)} yrs` : ''}
        </div>
      `).join('')}
    </div>
  </div>` : ''}

  <!-- ═══ INDUSTRY EXPERTISE ═══ -->
  ${(show('industryExpertise') && Array.isArray(data.industryExpertise) && data.industryExpertise.length > 0) ? `
  <div class="section" data-section="industryExpertise">
    <div class="section-title">Industry Expertise</div>
    <div class="badge-list">
      ${data.industryExpertise.map((item: any, index: number) => `
        <div class="badge" data-section="industryExpertise" data-index="${index}">
          <strong>${s(item.industry)}</strong>
          ${hasValue(item.domainArea) ? ` — ${s(item.domainArea)}` : ''}
          ${hasValue(item.experienceDuration) ? ` | ${s(item.experienceDuration)} yrs` : ''}
        </div>
      `).join('')}
    </div>
  </div>` : ''}

  <!-- ═══ TOOLS & TECHNOLOGIES (structured) ═══ -->
  ${(show('toolsTechnologies') && Array.isArray(data.toolsTechnologies) && data.toolsTechnologies.length > 0) ? `
  <div class="section" data-section="toolsTechnologies">
    <div class="section-title">Tools &amp; Technologies</div>
    <div class="badge-list">
      ${data.toolsTechnologies.map((item: any, index: number) => `
        <div class="badge" data-section="toolsTechnologies" data-index="${index}">
          <strong>${s(item.name)}</strong>
          ${hasValue(item.category) ? ` (${s(item.category)})` : ''}
          ${hasValue(item.proficiency) ? ` | ${s(item.proficiency)}` : ''}
          ${hasValue(item.experienceDuration) ? ` | ${s(item.experienceDuration)}` : ''}
        </div>
      `).join('')}
    </div>
  </div>` : ''}

  <!-- ═══ TOOLS (freetext) ═══ -->
  ${(show('tools') && hasValue(data.tools)) ? `
  <div class="section" data-section="tools">
    <div class="section-title">Tools &amp; Technologies</div>
    <ul>
      ${toLines(data.tools).map((l: string, i: number) => `<li data-section="tools" data-index="${i}">${l.trim()}</li>`).join('')}
    </ul>
  </div>` : ''}

  <!-- ═══ KEY ACHIEVEMENTS ═══ -->
  ${(show('keyAchievements') && Array.isArray(data.keyAchievements) && data.keyAchievements.length > 0) ? `
  <div class="section" data-section="keyAchievements">
    <div class="section-title">Key Achievements</div>
    <ul>
      ${data.keyAchievements.map((a: string, i: number) => `<li data-section="keyAchievements" data-index="${i}">${s(a)}</li>`).join('')}
    </ul>
  </div>` : ''}

  <!-- ═══ KEY RESPONSIBILITIES ═══ -->
  ${responsibilityLines.length > 0 ? `
  <div class="section" data-section="responsibilities">
    <div class="section-title">Key Responsibilities</div>
    <ul>
      ${responsibilityLines.map((l: string, i: number) => `<li data-section="responsibilities" data-index="${i}">${l.trim()}</li>`).join('')}
    </ul>
  </div>` : ''}

  <!-- ═══ CO-CURRICULAR ═══ -->
  ${(show('coCurricular') && Array.isArray(data.coCurricular) && data.coCurricular.length > 0) ? `
  <div class="section" data-section="coCurricular">
    <div class="section-title">Co-Curricular Activities</div>
    ${data.coCurricular.map((item: any, index: number) => `
      <div class="experience-item" data-section="coCurricular" data-index="${index}">
        <div class="company-title">
          <div class="company">${s(item.activity)}</div>
          <div class="date">${s(item.year) || (item.startDate ? `${s(item.startDate)} – ${s(item.endDate) || ''}` : '')}</div>
        </div>
        <div class="job-title">${s(item.organization)}${hasValue(item.role) ? ` | ${s(item.role)}` : ''}</div>
        ${hasValue(item.description) ? `<p>${s(item.description)}</p>` : ''}
      </div>
    `).join('')}
  </div>` : ''}

  <!-- ═══ EXTRACURRICULAR ═══ -->
  ${(show('extracurricular') && Array.isArray(data.extracurricular) && data.extracurricular.length > 0) ? `
  <div class="section" data-section="extracurricular">
    <div class="section-title">Extracurricular Activities</div>
    ${data.extracurricular.map((item: any, index: number) => `
      <div class="experience-item" data-section="extracurricular" data-index="${index}">
        <div class="company-title">
          <div class="company">${s(item.activity)}</div>
          <div class="date">${s(item.year) || (item.startDate ? `${s(item.startDate)} – ${s(item.endDate) || ''}` : '')}</div>
        </div>
        <div class="job-title">${s(item.organization)}${hasValue(item.role) ? ` | ${s(item.role)}` : ''}</div>
        ${hasValue(item.description) ? `<p>${s(item.description)}</p>` : ''}
      </div>
    `).join('')}
  </div>` : ''}

  <!-- ═══ SOCIAL PROFILES ═══ -->
  ${(show('socialProfiles') && Array.isArray(data.socialProfiles) && data.socialProfiles.length > 0) ? `
  <div class="section" data-section="socialProfiles">
    <div class="section-title">Social Profiles</div>
    <div class="skills-list">
      ${data.socialProfiles.map((item: any, index: number) => `
        <div class="skill-item" data-section="socialProfiles" data-index="${index}">
          <a href="${s(item.url)}" target="_blank">${s(item.platform)}</a>
          ${hasValue(item.username) ? ` (${s(item.username)})` : ''}
        </div>
      `).join('')}
    </div>
  </div>` : ''}

  <!-- ═══ SOCIAL LINKS ═══ -->
  ${(show('socialLinks') && Array.isArray(data.socialLinks) && data.socialLinks.length > 0) ? `
  <div class="section" data-section="socialLinks">
    <div class="section-title">Social Links</div>
    <div class="skills-list">
      ${data.socialLinks.map((link: any, index: number) => `
        <div class="skill-item" data-section="socialLinks" data-index="${index}">
          <a href="${s(link.url)}" target="_blank">${s(link.urlText) || s(link.url).replace(/https?:\/\//, '')}</a>
        </div>
      `).join('')}
    </div>
  </div>` : ''}

  <!-- ═══ LANGUAGES + HOBBIES ═══ -->
  ${(show('languages') && Array.isArray(data.languages) && data.languages.length > 0) || (show('hobbies') && Array.isArray(data.hobbies) && data.hobbies.length > 0) ? `
  <div class="section" data-section="additional">
    <div class="section-title">Additional Information</div>
    ${(show('languages') && Array.isArray(data.languages) && data.languages.length > 0) ? `
    <p><strong>Languages:</strong> ${data.languages.map((lang: any) =>
      typeof lang === 'string' ? lang : `${s(lang.language)}${hasValue(lang.level) ? ` (${s(lang.level)})` : ''}`
    ).join(', ')}</p>` : ''}
    ${(show('hobbies') && Array.isArray(data.hobbies) && data.hobbies.length > 0) ? `
    <p style="margin-top:6px;"><strong>Hobbies:</strong> ${data.hobbies.join(', ')}</p>` : ''}
  </div>` : ''}

  <!-- ═══ AVAILABILITY & WORK AUTH ═══ -->
  ${(show('availabilityWorkAuth') && hasValue(data.availabilityWorkAuth)) ? (() => {
    const a = data.availabilityWorkAuth;
    const fields = [a?.availabilityNoticePeriod, a?.workAuthorizationStatus, a?.preferredLocation, a?.visaType].filter(Boolean);
    return fields.length > 0 ? `
    <div class="section" data-section="availabilityWorkAuth">
      <div class="section-title">Availability &amp; Work Authorization</div>
      <div class="info-row">
        ${hasValue(a?.availabilityNoticePeriod) ? `<div><strong>Notice Period:</strong> ${s(a.availabilityNoticePeriod)}</div>` : ''}
        ${hasValue(a?.workAuthorizationStatus)  ? `<div><strong>Work Auth:</strong> ${s(a.workAuthorizationStatus)}</div>` : ''}
        ${hasValue(a?.preferredLocation)        ? `<div><strong>Preferred Location:</strong> ${s(a.preferredLocation)}</div>` : ''}
        ${hasValue(a?.visaType)                 ? `<div><strong>Visa Type:</strong> ${s(a.visaType)}</div>` : ''}
        ${hasValue(a?.willingToRelocate)        ? `<div><strong>Relocate:</strong> ${s(a.willingToRelocate)}</div>` : ''}
      </div>
    </div>` : '';
  })() : ''}

  <!-- ═══ DECLARATION ═══ -->
  ${(show('declaration') && hasValue(data.declaration)) ? `
  <div class="section" data-section="declaration">
    <div class="section-title">Declaration</div>
    <p>${s(data.declaration)}</p>
  </div>` : ''}

  <!-- ═══ REFERENCES ═══ -->
  ${hasValue(data.references) ? `
  <div class="section" data-section="references">
    <div class="section-title">References</div>
    ${Array.isArray(data.references)
      ? `<div style="display:flex;flex-wrap:wrap;gap:20px;font-size:${bodyFontSize};">
          ${data.references.map((ref: any, index: number) => `
            <div data-section="references" data-index="${index}" style="min-width:160px;">
              ${hasValue(ref.name)                                    ? `<div style="font-weight:bold;">${s(ref.name)}</div>` : ''}
              ${hasValue(ref.position || ref.designationRelationship) ? `<div>${s(ref.position || ref.designationRelationship)}</div>` : ''}
              ${hasValue(ref.company || ref.organization)             ? `<div>${s(ref.company || ref.organization)}</div>` : ''}
              ${hasValue(ref.phone || ref.contactInformation)         ? `<div>📞 ${s(ref.phone || ref.contactInformation)}</div>` : ''}
              ${hasValue(ref.email)                                   ? `<div>✉️ ${s(ref.email)}</div>` : ''}
              ${hasValue(ref.relationship)                            ? `<div><em>${s(ref.relationship)}</em></div>` : ''}
            </div>
          `).join('')}
        </div>`
      : `<p>${s(data.references)}</p>`}
  </div>` : ''}

  <!-- ═══ CUSTOM SECTIONS ═══ -->
  ${(Array.isArray(data.customSections) && data.customSections.length > 0)
    ? data.customSections
        .filter((section: any) => section.isVisible && Array.isArray(section.entries) && section.entries.some((e: any) => e.isVisible))
        .map((section: any) => `
      <div class="section" data-section="customSections">
        <div class="section-title">${s(section.heading) || 'Custom Section'}</div>
        ${section.entries.filter((entry: any) => entry.isVisible).map((entry: any, i: number) => `
          <div class="experience-item" data-section="customSections" data-index="${i}">
            <div class="company-title">
              <div class="company">${s(entry.title)}${hasValue(entry.organization) ? ` at ${s(entry.organization)}` : ''}</div>
              ${hasValue(entry.date) ? `<div class="date">${s(entry.date)}</div>` : ''}
            </div>
            ${hasValue(entry.subtitle)    ? `<div class="job-title">${s(entry.subtitle)}</div>` : ''}
            ${hasValue(entry.location)    ? `<p><strong>Location:</strong> ${s(entry.location)}</p>` : ''}
            ${hasValue(entry.description) ? `<p>${s(entry.description)}</p>` : ''}
            ${hasValue(entry.url)         ? `<p style="margin-top:5px;"><a href="${s(entry.url)}" target="_blank">${s(entry.urlText) || 'View'}</a></p>` : ''}
          </div>
        `).join('')}
      </div>
    `).join('')
    : ''}

</div>
</body>
</html>`;
}