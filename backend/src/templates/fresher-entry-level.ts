export function buildFresherEntryLevelTemplate(data: any, theme?: any): string {
  const defaultTheme = {
    primary: '#111827',
    secondary: '#4b5563',
    background: '#ffffff',
    accent: '#e11d48',
    headingFont: 'Inter, Arial, sans-serif',
    bodyFont: 'Inter, Arial, sans-serif'
  };
  const currentTheme = theme || defaultTheme;

  const bodyFontSize = '10pt';
  const headingFontSize = '11pt';
  const nameFontSize = '26pt';

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
          new Date(b.startDate || '1900').getTime() -
          new Date(a.startDate || '1900').getTime()
      )
    : [];

  const nameParts = (s(data.personal?.name) || 'Your Name').split(' ');
  const firstName = nameParts[0];
  const lastName = nameParts.slice(1).join(' ');

  const expAchievements = (item: any): string[] => {
    if (!item.achievements) return [];
    if (Array.isArray(item.achievements))
      return item.achievements.filter((a: string) => String(a).trim());
    return String(item.achievements).split('\n').filter((a: string) => a.trim());
  };

  /** Render skills — handles array of strings/objects OR HTML string */
  const renderSkillsGrid = (skills: any): string => {
    if (!skills) return '';
    if (typeof skills === 'string') {
      // HTML string (e.g. <ul><li>java</li>...)
      if (skills.includes('<')) return `<div style="font-size:${bodyFontSize};">${skills}</div>`;
      // comma-separated plain string
      return skills.split(',').filter((s: string) => s.trim()).map((s: string) =>
        `<div class="skill-item">${s.trim()}</div>`).join('');
    }
    if (Array.isArray(skills)) {
      return skills.map((skill: any) =>
        `<div class="skill-item">${typeof skill === 'object'
          ? s(skill.name) + (skill.level ? ` (${s(skill.level)})` : '')
          : s(skill).trim()}</div>`
      ).join('');
    }
    return '';
  };

  const sectionDiv = (content: string, label: string, sectionKey: string) =>
    `<div class="section" data-section="${sectionKey}">
      <div class="section-title">${label}</div>
      <hr class="section-divider">
      ${content}
    </div>`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<title>Resume</title>
<style>
:root {
  --primary: ${currentTheme.primary};
  --secondary: ${currentTheme.secondary};
  --accent: ${currentTheme.accent};
  --bg: ${currentTheme.background};
}
* { box-sizing: border-box; }
body {
  margin: 0; padding: 0;
  font-family: ${currentTheme.bodyFont};
  background: var(--bg);
  color: var(--primary);
  line-height: 1.4;
}
.resume-wrapper { max-width: 850px; margin: 0 auto; padding: 40px; }
.top-bar {
  height: 12px;
  background: repeating-linear-gradient(45deg,#334155,#334155 10px,#475569 10px,#475569 20px);
  margin-bottom: 30px;
}
.header { text-align: center; margin-bottom: 25px; }
.name { font-size: ${nameFontSize}; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; }
.first-name { color: var(--accent); }
.last-name { color: #334155; }
.contact-info {
  font-size: 9pt; color: #4b5563; margin-top: 8px;
  display: flex; justify-content: center; gap: 15px; flex-wrap: wrap;
}
.contact-info a { color: #4b5563; text-decoration: none; }
.section { margin-bottom: 20px; }
.section-title {
  font-size: ${headingFontSize}; font-weight: 700;
  text-transform: uppercase; color: var(--primary);
  margin-bottom: 5px; display: block;
}
.section-divider { height: 1px; background-color: #fecdd3; border: none; margin-bottom: 12px; }
.item-row { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 2px; }
.company-name { font-weight: 700; font-size: 10.5pt; }
.date-text { font-size: 9pt; color: #4b5563; }
.job-title { font-weight: 600; font-style: italic; font-size: 10pt; color: #4b5563; margin-bottom: 5px; }
.job-title-plain { font-weight: 600; font-size: 10pt; color: #4b5563; margin-bottom: 5px; }
ul { margin: 5px 0 15px 18px; padding: 0; }
li { font-size: ${bodyFontSize}; margin-bottom: 4px; color: var(--primary); }
.skills-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.skill-item { font-size: ${bodyFontSize}; display: flex; align-items: center; }
.skill-item::before { content: "•"; color: var(--accent); margin-right: 8px; font-weight: bold; }
.badge-row { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 6px; }
.badge {
  background: #fff1f2; border: 1px solid #fecdd3;
  padding: 3px 10px; border-radius: 12px;
  font-size: 9pt; color: var(--primary);
}
.info-grid { display: flex; flex-direction: column; gap: 6px; font-size: ${bodyFontSize}; color: var(--secondary); }
@media print { .resume-wrapper { padding: 20px; } }
</style>
</head>
<body>
<div class="resume-wrapper">
  <div class="top-bar"></div>

  <!-- ═══ HEADER ═══ -->
  <header class="header" data-section="personal">
    <div class="name">
      <span class="first-name">${firstName}</span>${lastName ? ` <span class="last-name">${lastName}</span>` : ''}
    </div>
    ${hasValue(data.personal?.role || data.personal?.title) ? `<div style="font-size:12pt;font-weight:600;color:var(--secondary);margin-top:4px;">${s(data.personal?.role || data.personal?.title)}</div>` : ''}
    <div class="contact-info">
      ${(() => { const loc = [data.personal?.fullAddress, data.personal?.location, data.personal?.city, data.personal?.state, data.personal?.country, data.personal?.pinCode].filter(Boolean).join(', '); return loc ? `<span>${loc}</span>` : ''; })()}
      ${hasValue(data.personal?.phone)         ? `<span>${s(data.personal.phone)}</span>` : ''}
      ${hasValue(data.personal?.alternatePhone) ? `<span>${s(data.personal.alternatePhone)}</span>` : ''}
      ${hasValue(data.personal?.email)         ? `<span><a href="mailto:${s(data.personal.email)}">${s(data.personal.email)}</a></span>` : ''}
      ${hasValue(data.personal?.linkedinUrl)   ? `<span><a href="${s(data.personal.linkedinUrl)}">LinkedIn</a></span>` : ''}
      ${hasValue(data.personal?.githubUrl)     ? `<span><a href="${s(data.personal.githubUrl)}">GitHub</a></span>` : ''}
      ${hasValue(data.personal?.portfolioUrl)  ? `<span><a href="${s(data.personal.portfolioUrl)}">Portfolio</a></span>` : ''}
      ${hasValue(data.personal?.website)       ? `<span><a href="${s(data.personal.website)}">Website</a></span>` : ''}
      ${hasValue(data.personal?.twitter)       ? `<span><a href="${s(data.personal.twitter)}">Twitter</a></span>` : ''}
      ${hasValue(data.personal?.skype)         ? `<span>Skype: ${s(data.personal.skype)}</span>` : ''}
    </div>
    ${hasValue(data.personal?.image) ? `<img src="${s(data.personal.image)}" alt="Profile" style="width:80px;height:80px;border-radius:50%;object-fit:cover;margin-top:12px;border:2px solid #fecdd3;">` : ''}
  </header>

  <!-- ═══ PERSONAL DETAILS ═══ -->
  ${(hasValue(data.personal?.fathersName) || hasValue(data.personal?.mothersName) || hasValue(data.personal?.dob) || hasValue(data.personal?.gender) || hasValue(data.personal?.maritalStatus) || hasValue(data.personal?.nationality) || hasValue(data.personal?.religion) || hasValue(data.personal?.category)) ? `
  <div class="section" data-section="personal">
    <div class="section-title">Personal Details</div>
    <hr class="section-divider">
    <div class="info-grid">
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
  <div class="section" data-section="summary">
    <div class="section-title">Summary</div>
    <hr class="section-divider">
    <div style="font-size:${bodyFontSize};text-align:justify;">${s(data.summary)}</div>
  </div>` : ''}

  <!-- ═══ CAREER OBJECTIVE ═══ -->
  ${(show('careerObjective') && hasValue(data.careerObjective)) ? `
  <div class="section" data-section="careerObjective">
    <div class="section-title">Career Objective</div>
    <hr class="section-divider">
    <div style="font-size:${bodyFontSize};text-align:justify;">${s(data.careerObjective)}</div>
  </div>` : ''}

  <!-- ═══ EXPERIENCE ═══ -->
  ${(show('experience') && sortedExperience.length > 0) ? `
  <div class="section" data-section="experience">
    <div class="section-title">Experience</div>
    <hr class="section-divider">
    ${sortedExperience.map((exp: any, index: number) => {
      const lines = toLines(exp.description);
      const achievements = expAchievements(exp);
      return `
      <div class="experience-item" data-index="${index}">
        <div class="item-row">
          <span class="company-name">${s(exp.company)}${hasValue(exp.location) ? ` — ${s(exp.location)}` : ''}</span>
          <span class="date-text">${s(exp.startDate)}${(exp.startDate || exp.endDate) ? ' – ' : ''}${s(exp.endDate) || (exp.startDate ? 'Present' : '')}</span>
        </div>
        <div class="job-title">${s(exp.title)}${hasValue(exp.employmentType) ? ` | ${s(exp.employmentType)}` : ''}</div>
        ${lines.length > 0 ? `<ul>${lines.map((l: string, li: number) => `<li data-section="experience" data-index="${index}" data-item-index="${li}">${l.trim()}</li>`).join('')}</ul>` : ''}
        ${achievements.length > 0 ? `<ul>${achievements.map((a: string, ai: number) => `<li data-section="experience" data-index="${index}" data-item-index="${ai}"> ${a}</li>`).join('')}</ul>` : ''}
        ${hasValue(exp.technologies) ? `<div class="job-title-plain" style="margin-top:4px;"><strong>Tech:</strong> ${s(exp.technologies)}</div>` : ''}
      </div>`;
    }).join('')}
  </div>` : ''}

  <!-- ═══ SKILLS ═══ -->
  ${(show('skills') && hasValue(data.skills)) ? `
  <div class="section" data-section="skills">
    <div class="section-title">Skills</div>
    <hr class="section-divider">
    <div class="skills-grid">${renderSkillsGrid(data.skills)}</div>
  </div>` : ''}

  <!-- ═══ EDUCATION ═══ -->
  ${(show('education') && Array.isArray(data.education) && data.education.length > 0) ? `
  <div class="section" data-section="education">
    <div class="section-title">Education</div>
    <hr class="section-divider">
    ${data.education.map((edu: any, index: number) => `
      <div class="education-item" data-index="${index}">
        <div class="item-row">
          <span class="company-name">${s(edu.school) || s(edu.university)}</span>
          <span class="date-text">
            ${edu.startDate && edu.endDate ? `${s(edu.startDate)} – ${s(edu.endDate)}` : (s(edu.graduationDate) || s(edu.endDate) || s(edu.startDate))}
          </span>
        </div>
        <div class="job-title">
          ${s(edu.degree)}${hasValue(edu.qualification) ? ` (${s(edu.qualification)})` : ''}${hasValue(edu.field) ? ` | ${s(edu.field)}` : ''}
        </div>
        ${hasValue(edu.board)      ? `<div style="font-size:9pt;color:var(--secondary);">Board: ${s(edu.board)}</div>` : ''}
        ${hasValue(edu.location)   ? `<div style="font-size:9pt;color:var(--secondary);font-style:italic;">${s(edu.location)}</div>` : ''}
        ${hasValue(edu.percentage) ? `<div style="font-size:9pt;color:var(--secondary);">Score: ${s(edu.percentage)}%</div>` : ''}
        ${hasValue(edu.cgpa)       ? `<div style="font-size:9pt;color:var(--secondary);">CGPA: ${s(edu.cgpa)}</div>` : ''}
        ${hasValue(edu.gpa)        ? `<div style="font-size:9pt;color:var(--secondary);">GPA: ${s(edu.gpa)}</div>` : ''}
        ${hasValue(edu.grade)      ? `<div style="font-size:9pt;color:var(--secondary);"> ${s(edu.grade)}</div>` : ''}
        ${hasValue(edu.description) ? `<div style="font-size:9pt;margin-bottom:10px;">${s(edu.description)}</div>` : ''}
        ${(Array.isArray(edu.achievements) && edu.achievements.filter((a: string) => a.trim()).length > 0) ? `
          <ul>${edu.achievements.filter((a: string) => a.trim()).map((a: string) => `<li>${a}</li>`).join('')}</ul>` : ''}
      </div>
    `).join('')}
  </div>` : ''}

  <!-- ═══ PROJECTS ═══ -->
  ${(show('projects') && Array.isArray(data.projects) && data.projects.length > 0) ? `
  <div class="section" data-section="projects">
    <div class="section-title">Projects</div>
    <hr class="section-divider">
    ${data.projects.map((project: any, index: number) => {
      const lines = toLines(project.description);
      return `
      <div class="experience-item" data-index="${index}">
        <div class="item-row">
          <span class="company-name">${s(project.name)}</span>
          <span class="date-text">${s(project.startDate)}${(project.startDate || project.endDate) ? ' – ' : ''}${s(project.endDate) || (project.startDate ? 'Present' : '')}</span>
        </div>
        ${hasValue(project.role)         ? `<div class="job-title">${s(project.role)}</div>` : ''}
        ${hasValue(project.technologies) ? `<div class="job-title">${s(project.technologies)}</div>` : ''}
        ${lines.length > 0 ? `<ul>${lines.map((l: string) => `<li>${l.trim()}</li>`).join('')}</ul>` : ''}
        ${hasValue(project.url)       ? `<div style="font-size:9pt;margin-bottom:10px;"><a href="${s(project.url)}" target="_blank" style="color:var(--accent);">${s(project.urlText) || 'View Project'}</a></div>` : ''}
        ${hasValue(project.githubUrl) ? `<div style="font-size:9pt;margin-bottom:10px;"><a href="${s(project.githubUrl)}" target="_blank" style="color:var(--accent);">GitHub</a></div>` : ''}
      </div>`;
    }).join('')}
  </div>` : ''}

  <!-- ═══ CERTIFICATIONS ═══ -->
  ${(show('certifications') && Array.isArray(data.certifications) && data.certifications.length > 0) ? `
  <div class="section" data-section="certifications">
    <div class="section-title">Certifications</div>
    <hr class="section-divider">
    <div style="font-size:${bodyFontSize};">
      ${data.certifications.map((cert: any, index: number) => `
        <div style="margin-bottom:8px;" data-section="certifications" data-index="${index}">
          <strong>${s(cert.name)}</strong>${hasValue(cert.date) ? ` | ${s(cert.date)}` : ''}
          ${hasValue(cert.expiryDate) ? ` | Expires: ${s(cert.expiryDate)}` : ''}
          ${hasValue(cert.credentialId) ? ` | ID: ${s(cert.credentialId)}` : ''}
          ${hasValue(cert.issuer) ? `<br><span style="color:#4b5563;">${s(cert.issuer)}</span>` : ''}
          ${hasValue(cert.description) ? `<br><span style="color:var(--secondary);">${s(cert.description)}</span>` : ''}
          ${hasValue(cert.url) ? `<br><a href="${s(cert.url)}" target="_blank" style="color:var(--accent);font-size:9pt;">View Certificate</a>` : ''}
        </div>
      `).join('')}
    </div>
  </div>` : ''}

  <!-- ═══ INTERNSHIPS ═══ -->
  ${(show('internships') && Array.isArray(data.internships) && data.internships.length > 0) ? `
  <div class="section" data-section="internships">
    <div class="section-title">Internships</div>
    <hr class="section-divider">
    ${data.internships.map((item: any, index: number) => {
      const lines = toLines(item.description);
      return `
      <div class="experience-item" data-section="internships" data-index="${index}">
        <div class="item-row">
          <span class="company-name">${s(item.title)}</span>
          <span class="date-text">${s(item.startDate)}${(item.startDate || item.endDate || item.duration) ? ' ' : ''}${s(item.endDate) || s(item.duration)}</span>
        </div>
        <div class="job-title">${s(item.company)}${hasValue(item.location) ? `, ${s(item.location)}` : ''}</div>
        ${hasValue(item.stipend) ? `<div style="font-size:9pt;color:var(--secondary);"><strong>Stipend:</strong> ${s(item.stipend)}</div>` : ''}
        ${lines.length > 0 ? `<ul>${lines.map((l: string, li: number) => `<li data-section="internships" data-index="${index}" data-item-index="${li}">${l.trim()}</li>`).join('')}</ul>` : ''}
        ${hasValue(item.technologies) ? `<div class="job-title-plain"><strong>Tech:</strong> ${s(item.technologies)}</div>` : ''}
      </div>`;
    }).join('')}
  </div>` : ''}

  <!-- ═══ ACADEMIC PROJECTS ═══ -->
  ${(show('academicProjects') && Array.isArray(data.academicProjects) && data.academicProjects.length > 0) ? `
  <div class="section" data-section="academicProjects">
    <div class="section-title">Academic Projects</div>
    <hr class="section-divider">
    ${data.academicProjects.map((item: any, index: number) => `
      <div class="experience-item" data-section="academicProjects" data-index="${index}">
        <div class="item-row">
          <span class="company-name">${s(item.name) || s(item.title)}</span>
          <span class="date-text">${s(item.duration)}${hasValue(item.year) ? ` | ${s(item.year)}` : ''}</span>
        </div>
        <div class="job-title">${s(item.institution)}${hasValue(item.course) ? ` | ${s(item.course)}` : ''}</div>
        ${hasValue(item.description)  ? `<div style="font-size:9pt;margin-bottom:10px;">${s(item.description)}</div>` : ''}
        ${hasValue(item.technologies) ? `<div class="job-title-plain">Technologies: ${Array.isArray(item.technologies) ? item.technologies.join(', ') : s(item.technologies)}</div>` : ''}
        ${hasValue(item.url)          ? `<div style="font-size:9pt;margin-bottom:10px;"><a href="${s(item.url)}" target="_blank" style="color:var(--accent);">View Project</a></div>` : ''}
      </div>
    `).join('')}
  </div>` : ''}

  <!-- ═══ LEADERSHIP POSITIONS ═══ -->
  ${(show('leadershipPositions') && Array.isArray(data.leadershipPositions) && data.leadershipPositions.length > 0) ? `
  <div class="section" data-section="leadershipPositions">
    <div class="section-title">Leadership &amp; Positions</div>
    <hr class="section-divider">
    ${data.leadershipPositions.map((item: any, index: number) => `
      <div class="experience-item" data-section="leadershipPositions" data-index="${index}">
        <div class="item-row">
          <span class="company-name">${s(item.position) || s(item.title)}</span>
          <span class="date-text">${s(item.startDate)}${(item.startDate || item.endDate) ? ' – ' : ''}${s(item.endDate) || (item.startDate ? 'Present' : '')}</span>
        </div>
        <div class="job-title">${s(item.organization)}</div>
        ${hasValue(item.description) ? `<div style="font-size:9pt;margin-bottom:10px;">${s(item.description)}</div>` : ''}
      </div>
    `).join('')}
  </div>` : ''}

  <!-- ═══ TRAINING PROGRAMS ═══ -->
  ${(show('trainingPrograms') && Array.isArray(data.trainingPrograms) && data.trainingPrograms.length > 0) ? `
  <div class="section" data-section="trainingPrograms">
    <div class="section-title">Training Programs</div>
    <hr class="section-divider">
    ${data.trainingPrograms.map((item: any, index: number) => `
      <div class="experience-item" data-section="trainingPrograms" data-index="${index}">
        <div class="item-row">
          <span class="company-name">${s(item.name)}</span>
          <span class="date-text">${s(item.completionDate)}</span>
        </div>
        <div class="job-title">${s(item.provider) || s(item.organization)}${hasValue(item.duration) ? ` | ${s(item.duration)}` : ''}${hasValue(item.mode) ? ` | ${s(item.mode)}` : ''}</div>
        ${hasValue(item.description) ? `<div style="font-size:9pt;margin-bottom:10px;">${s(item.description)}</div>` : ''}
      </div>
    `).join('')}
  </div>` : ''}

  <!-- ═══ SCHOLARSHIPS ═══ -->
  ${(show('scholarships') && Array.isArray(data.scholarships) && data.scholarships.length > 0) ? `
  <div class="section" data-section="scholarships">
    <div class="section-title">Scholarships</div>
    <hr class="section-divider">
    ${data.scholarships.map((item: any, index: number) => `
      <div class="experience-item" data-section="scholarships" data-index="${index}">
        <div class="item-row">
          <span class="company-name">${s(item.name)}</span>
          <span class="date-text">${s(item.year)}</span>
        </div>
        <div class="job-title">${s(item.provider) || s(item.organization)}${hasValue(item.amount) ? ` | ${s(item.amount)}` : ''}</div>
        ${hasValue(item.description) ? `<div style="font-size:9pt;margin-bottom:10px;">${s(item.description)}</div>` : ''}
      </div>
    `).join('')}
  </div>` : ''}

  <!-- ═══ AWARDS ═══ -->
  ${(show('awards') && Array.isArray(data.awards) && data.awards.length > 0) ? `
  <div class="section" data-section="awards">
    <div class="section-title">Awards &amp; Honors</div>
    <hr class="section-divider">
    ${data.awards.map((item: any, index: number) => `
      <div class="experience-item" data-section="awards" data-index="${index}">
        <div class="item-row">
          <span class="company-name">${s(item.title) || s(item.name)}</span>
          <span class="date-text">${s(item.date || item.issueYear || item.year)}</span>
        </div>
        <div class="job-title">${s(item.issuer || item.organization)}</div>
        ${hasValue(item.description) ? `<div style="font-size:9pt;margin-bottom:10px;">${s(item.description)}</div>` : ''}
      </div>
    `).join('')}
  </div>` : ''}

  <!-- ═══ SPEAKING ENGAGEMENTS ═══ -->
  ${(show('speakingEngagements') && Array.isArray(data.speakingEngagements) && data.speakingEngagements.length > 0) ? `
  <div class="section" data-section="speakingEngagements">
    <div class="section-title">Speaking Engagements</div>
    <hr class="section-divider">
    ${data.speakingEngagements.map((item: any, index: number) => `
      <div class="experience-item" data-section="speakingEngagements" data-index="${index}">
        <div class="item-row">
          <span class="company-name">${s(item.topic)}</span>
          <span class="date-text">${s(item.date)}</span>
        </div>
        <div class="job-title">${s(item.eventName)}${hasValue(item.location) ? ` | ${s(item.location)}` : ''}</div>
        ${hasValue(item.description) ? `<div style="font-size:9pt;margin-bottom:10px;">${s(item.description)}</div>` : ''}
      </div>
    `).join('')}
  </div>` : ''}

  <!-- ═══ MEMBERSHIPS ═══ -->
  ${(show('memberships') && Array.isArray(data.memberships) && data.memberships.length > 0) ? `
  <div class="section" data-section="memberships">
    <div class="section-title">Memberships</div>
    <hr class="section-divider">
    ${data.memberships.map((item: any, index: number) => `
      <div class="experience-item" data-section="memberships" data-index="${index}">
        <div class="item-row">
          <span class="company-name">${s(item.membershipName)}</span>
          <span class="date-text">${s(item.year)}</span>
        </div>
        <div class="job-title">${s(item.organizationName)}${hasValue(item.membershipId) ? ` | ID: ${s(item.membershipId)}` : ''}</div>
        ${hasValue(item.description) ? `<div style="font-size:9pt;margin-bottom:10px;">${s(item.description)}</div>` : ''}
      </div>
    `).join('')}
  </div>` : ''}

  <!-- ═══ WORKSHOPS ═══ -->
  ${(show('workshops') && Array.isArray(data.workshops) && data.workshops.length > 0) ? `
  <div class="section" data-section="workshops">
    <div class="section-title">Workshops</div>
    <hr class="section-divider">
    ${data.workshops.map((item: any, index: number) => `
      <div class="experience-item" data-section="workshops" data-index="${index}">
        <div class="item-row">
          <span class="company-name">${s(item.programTitle)}</span>
          <span class="date-text">${s(item.year)}</span>
        </div>
        <div class="job-title">${s(item.conductedBy)}${hasValue(item.duration) ? ` | ${s(item.duration)}` : ''}${hasValue(item.location) ? ` | ${s(item.location)}` : ''}</div>
        ${hasValue(item.description) ? `<div style="font-size:9pt;margin-bottom:10px;">${s(item.description)}</div>` : ''}
      </div>
    `).join('')}
  </div>` : ''}

  <!-- ═══ PORTFOLIO ═══ -->
  ${(show('portfolio') && Array.isArray(data.portfolio) && data.portfolio.length > 0) ? `
  <div class="section" data-section="portfolio">
    <div class="section-title">Portfolio</div>
    <hr class="section-divider">
    ${data.portfolio.map((item: any, index: number) => `
      <div class="experience-item" data-section="portfolio" data-index="${index}">
        <div class="item-row">
          <span class="company-name">${s(item.name)}</span>
          <span class="date-text">${s(item.type)}${hasValue(item.platform) ? ` | ${s(item.platform)}` : ''}</span>
        </div>
        ${hasValue(item.description) ? `<div style="font-size:9pt;margin-bottom:6px;">${s(item.description)}</div>` : ''}
        ${hasValue(item.url) ? `<div style="font-size:9pt;margin-bottom:10px;"><a href="${s(item.url)}" target="_blank" style="color:var(--accent);">View</a></div>` : ''}
      </div>
    `).join('')}
  </div>` : ''}

  <!-- ═══ CLIENT PROJECTS ═══ -->
  ${(show('clientProjects') && Array.isArray(data.clientProjects) && data.clientProjects.length > 0) ? `
  <div class="section" data-section="clientProjects">
    <div class="section-title">Client Projects</div>
    <hr class="section-divider">
    ${data.clientProjects.map((item: any, index: number) => `
      <div class="experience-item" data-section="clientProjects" data-index="${index}">
        <div class="item-row">
          <span class="company-name">${s(item.name)}</span>
          <span class="date-text">${s(item.duration)}</span>
        </div>
        <div class="job-title">${s(item.role)}${hasValue(item.clientOrganization) ? ` | Client: ${s(item.clientOrganization)}` : ''}</div>
        ${hasValue(item.description)       ? `<div style="font-size:9pt;margin-bottom:6px;">${s(item.description)}</div>` : ''}
        ${hasValue(item.toolsTechnologies) ? `<div class="job-title-plain"><strong>Tech:</strong> ${s(item.toolsTechnologies)}</div>` : ''}
        ${hasValue(item.projectUrl)        ? `<div style="font-size:9pt;margin-bottom:10px;"><a href="${s(item.projectUrl)}" target="_blank" style="color:var(--accent);">View Project</a></div>` : ''}
      </div>
    `).join('')}
  </div>` : ''}

  <!-- ═══ VOLUNTEERING ═══ -->
  ${(show('volunteering') && Array.isArray(data.volunteering) && data.volunteering.length > 0) ? `
  <div class="section" data-section="volunteering">
    <div class="section-title">Volunteering</div>
    <hr class="section-divider">
    ${data.volunteering.map((item: any, index: number) => `
      <div class="experience-item" data-section="volunteering" data-index="${index}">
        <div class="item-row">
          <span class="company-name">${s(item.role)}</span>
          <span class="date-text">${s(item.duration)}${(item.startDate || item.endDate) ? ` | ${s(item.startDate)} – ${s(item.endDate) || 'Present'}` : ''}</span>
        </div>
        <div class="job-title">${s(item.organization)}${hasValue(item.causeArea) ? ` | ${s(item.causeArea)}` : ''}</div>
        ${hasValue(item.description) ? `<div style="font-size:9pt;margin-bottom:10px;">${s(item.description)}</div>` : ''}
      </div>
    `).join('')}
  </div>` : ''}

  <!-- ═══ MILITARY SERVICE ═══ -->
  ${(show('militaryService') && Array.isArray(data.militaryService) && data.militaryService.length > 0) ? `
  <div class="section" data-section="militaryService">
    <div class="section-title">Military Service</div>
    <hr class="section-divider">
    ${data.militaryService.map((item: any, index: number) => `
      <div class="experience-item" data-section="militaryService" data-index="${index}">
        <div class="item-row">
          <span class="company-name">${s(item.rank)}${hasValue(item.branch) ? ` — ${s(item.branch)}` : ''}</span>
          <span class="date-text">${s(item.duration)}</span>
        </div>
        ${hasValue(item.specialization) ? `<div class="job-title">${s(item.specialization)}</div>` : ''}
        ${hasValue(item.description) ? `<div style="font-size:9pt;margin-bottom:10px;">${s(item.description)}</div>` : ''}
      </div>
    `).join('')}
  </div>` : ''}

  <!-- ═══ TEACHING EXPERIENCE ═══ -->
  ${(show('teachingExperience') && Array.isArray(data.teachingExperience) && data.teachingExperience.length > 0) ? `
  <div class="section" data-section="teachingExperience">
    <div class="section-title">Teaching Experience</div>
    <hr class="section-divider">
    ${data.teachingExperience.map((item: any, index: number) => `
      <div class="experience-item" data-section="teachingExperience" data-index="${index}">
        <div class="item-row">
          <span class="company-name">${s(item.title)}</span>
          <span class="date-text">${s(item.duration)}</span>
        </div>
        <div class="job-title">${s(item.institution)}</div>
        ${hasValue(item.subjectCourseTaught) ? `<div style="font-size:9pt;"><strong>Subject:</strong> ${s(item.subjectCourseTaught)}</div>` : ''}
        ${hasValue(item.description) ? `<div style="font-size:9pt;margin-bottom:10px;">${s(item.description)}</div>` : ''}
      </div>
    `).join('')}
  </div>` : ''}

  <!-- ═══ MENTORSHIP EXPERIENCE ═══ -->
  ${(show('mentorshipExperience') && Array.isArray(data.mentorshipExperience) && data.mentorshipExperience.length > 0) ? `
  <div class="section" data-section="mentorshipExperience">
    <div class="section-title">Mentorship Experience</div>
    <hr class="section-divider">
    ${data.mentorshipExperience.map((item: any, index: number) => `
      <div class="experience-item" data-section="mentorshipExperience" data-index="${index}">
        <div class="item-row">
          <span class="company-name">${s(item.mentorshipArea)}</span>
          <span class="date-text">${s(item.duration)}</span>
        </div>
        <div class="job-title">${s(item.organizationPlatform)}${hasValue(item.menteeLevel) ? ` | Mentee Level: ${s(item.menteeLevel)}` : ''}</div>
        ${hasValue(item.description) ? `<div style="font-size:9pt;margin-bottom:10px;">${s(item.description)}</div>` : ''}
      </div>
    `).join('')}
  </div>` : ''}

  <!-- ═══ PUBLICATIONS ═══ -->
  ${(show('publications') && Array.isArray(data.publications) && data.publications.length > 0) ? `
  <div class="section" data-section="publications">
    <div class="section-title">Publications</div>
    <hr class="section-divider">
    <div style="font-size:${bodyFontSize};">
      ${data.publications.map((item: any, index: number) => `
        <div style="margin-bottom:10px;" data-section="publications" data-index="${index}">
          <strong>${s(item.title)}</strong>
          ${hasValue(item.date || item.year) ? ` | ${s(item.date || item.year)}` : ''}
          <br><span style="color:var(--secondary);">${s(item.publisher || item.journalPublisher || item.journal)}${hasValue(item.publicationType) ? ` | ${s(item.publicationType)}` : ''}</span>
          ${hasValue(item.authors) ? `<br><span style="color:var(--secondary);">Authors: ${s(item.authors)}</span>` : ''}
          ${hasValue(item.description) ? `<br><span style="color:var(--secondary);">${s(item.description)}</span>` : ''}
          ${hasValue(item.url || item.urlDoi) ? `<br><a href="${s(item.url || item.urlDoi)}" target="_blank" style="color:var(--accent);font-size:9pt;">Read</a>` : ''}
        </div>
      `).join('')}
    </div>
  </div>` : ''}

  <!-- ═══ RESEARCH GRANTS ═══ -->
  ${(show('researchGrants') && Array.isArray(data.researchGrants) && data.researchGrants.length > 0) ? `
  <div class="section" data-section="researchGrants">
    <div class="section-title">Research Grants</div>
    <hr class="section-divider">
    ${data.researchGrants.map((item: any, index: number) => `
      <div class="experience-item" data-section="researchGrants" data-index="${index}">
        <div class="item-row">
          <span class="company-name">${s(item.title)}</span>
          <span class="date-text">${s(item.year)}</span>
        </div>
        <div class="job-title">${s(item.agency)}${hasValue(item.amount) ? ` | ${s(item.amount)}` : ''}</div>
        ${hasValue(item.description) ? `<div style="font-size:9pt;margin-bottom:10px;">${s(item.description)}</div>` : ''}
      </div>
    `).join('')}
  </div>` : ''}

  <!-- ═══ PATENTS ═══ -->
  ${(show('patents') && Array.isArray(data.patents) && data.patents.length > 0) ? `
  <div class="section" data-section="patents">
    <div class="section-title">Patents</div>
    <hr class="section-divider">
    ${data.patents.map((item: any, index: number) => `
      <div class="experience-item" data-section="patents" data-index="${index}">
        <div class="item-row">
          <span class="company-name">${s(item.title)}</span>
          <span class="date-text">${s(item.year)}</span>
        </div>
        <div class="job-title">
          ${hasValue(item.patentNumber) ? `No: ${s(item.patentNumber)}` : ''}
          ${hasValue(item.status) ? ` | ${s(item.status)}` : ''}
          ${hasValue(item.issuingAuthority) ? ` | ${s(item.issuingAuthority)}` : ''}
        </div>
        ${hasValue(item.description) ? `<div style="font-size:9pt;margin-bottom:10px;">${s(item.description)}</div>` : ''}
      </div>
    `).join('')}
  </div>` : ''}

  <!-- ═══ TEST SCORES ═══ -->
  ${(show('testScores') && Array.isArray(data.testScores) && data.testScores.length > 0) ? `
  <div class="section" data-section="testScores">
    <div class="section-title">Test Scores</div>
    <hr class="section-divider">
    <div class="badge-row">
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
    <hr class="section-divider">
    <div class="badge-row">
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
    <hr class="section-divider">
    <div class="badge-row">
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
    <hr class="section-divider">
    <div class="skills-grid">
      ${data.toolsTechnologies.map((item: any, index: number) => `
        <div class="skill-item" data-section="toolsTechnologies" data-index="${index}">
          ${s(item.name)}
          ${hasValue(item.category) ? ` (${s(item.category)})` : ''}
          ${hasValue(item.proficiency) ? ` | ${s(item.proficiency)}` : ''}
          ${hasValue(item.experienceDuration) ? ` | ${s(item.experienceDuration)}` : ''}
        </div>
      `).join('')}
    </div>
  </div>` : ''}

  <!-- ═══ TOOLS (freetext) ═══ -->
  ${(show('tools') && hasValue(data.tools) && !Array.isArray(data.toolsTechnologies)) ? `
  <div class="section" data-section="tools">
    <div class="section-title">Tools &amp; Technologies</div>
    <hr class="section-divider">
    <div class="skills-grid">
      ${(Array.isArray(data.tools) ? data.tools : s(data.tools).split(',')).filter((t: any) => String(t).trim()).map((t: any) =>
        `<div class="skill-item">${s(t).trim()}</div>`).join('')}
    </div>
  </div>` : ''}

  <!-- ═══ CO-CURRICULAR ═══ -->
  ${(show('coCurricular') && Array.isArray(data.coCurricular) && data.coCurricular.length > 0) ? `
  <div class="section" data-section="coCurricular">
    <div class="section-title">Co-Curricular Activities</div>
    <hr class="section-divider">
    ${data.coCurricular.map((item: any, index: number) => `
      <div class="experience-item" data-section="coCurricular" data-index="${index}">
        <div class="item-row">
          <span class="company-name">${s(item.activity)}</span>
          <span class="date-text">${s(item.year) || (item.startDate ? `${s(item.startDate)} – ${s(item.endDate) || ''}` : '')}</span>
        </div>
        <div class="job-title">${s(item.organization)}${hasValue(item.role) ? ` | ${s(item.role)}` : ''}</div>
        ${hasValue(item.description) ? `<div style="font-size:9pt;margin-bottom:10px;">${s(item.description)}</div>` : ''}
      </div>
    `).join('')}
  </div>` : ''}

  <!-- ═══ EXTRACURRICULAR ═══ -->
  ${(show('extracurricular') && Array.isArray(data.extracurricular) && data.extracurricular.length > 0) ? `
  <div class="section" data-section="extracurricular">
    <div class="section-title">Extracurricular Activities</div>
    <hr class="section-divider">
    ${data.extracurricular.map((item: any, index: number) => `
      <div class="experience-item" data-section="extracurricular" data-index="${index}">
        <div class="item-row">
          <span class="company-name">${s(item.activity)}</span>
          <span class="date-text">${s(item.year) || (item.startDate ? `${s(item.startDate)} – ${s(item.endDate) || ''}` : '')}</span>
        </div>
        <div class="job-title">${s(item.organization)}${hasValue(item.role) ? ` | ${s(item.role)}` : ''}</div>
        ${hasValue(item.description) ? `<div style="font-size:9pt;margin-bottom:10px;">${s(item.description)}</div>` : ''}
      </div>
    `).join('')}
  </div>` : ''}

  <!-- ═══ KEY ACHIEVEMENTS ═══ -->
  ${(show('keyAchievements') && Array.isArray(data.keyAchievements) && data.keyAchievements.filter((a: string) => a && a.trim()).length > 0) ? `
  <div class="section" data-section="keyAchievements">
    <div class="section-title">Key Achievements</div>
    <hr class="section-divider">
    <ul>${data.keyAchievements.filter((a: string) => a && a.trim()).map((a: string, i: number) => `<li data-section="keyAchievements" data-index="${i}">${a}</li>`).join('')}</ul>
  </div>` : ''}

  <!-- ═══ KEY RESPONSIBILITIES ═══ -->
  ${toLines(data.responsibilities).length > 0 ? `
  <div class="section" data-section="responsibilities">
    <div class="section-title">Key Responsibilities</div>
    <hr class="section-divider">
    <ul>${toLines(data.responsibilities).map((l: string, i: number) => `<li data-section="responsibilities" data-index="${i}">${l.trim()}</li>`).join('')}</ul>
  </div>` : ''}

  <!-- ═══ LANGUAGES ═══ -->
  ${(show('languages') && Array.isArray(data.languages) && data.languages.length > 0) ? `
  <div class="section" data-section="languages">
    <div class="section-title">Languages</div>
    <hr class="section-divider">
    <div style="font-size:${bodyFontSize};">
      ${data.languages.map((lang: any) =>
        `<div class="skill-item">${typeof lang === 'string' ? lang : s(lang.language)}${hasValue(typeof lang === 'object' ? lang.level : '') ? ` (${s(lang.level)})` : ''}${hasValue(typeof lang === 'object' ? lang.capability : '') ? ` — ${s(lang.capability)}` : ''}</div>`
      ).join('')}
    </div>
  </div>` : ''}

  <!-- ═══ HOBBIES ═══ -->
  ${(show('hobbies') && Array.isArray(data.hobbies) && data.hobbies.length > 0) ? `
  <div class="section" data-section="hobbies">
    <div class="section-title">Interests</div>
    <hr class="section-divider">
    <div style="font-size:${bodyFontSize};">
      ${data.hobbies.map((h: any) => `<div class="skill-item">${s(h).trim()}</div>`).join('')}
    </div>
  </div>` : ''}

  <!-- ═══ SOCIAL PROFILES ═══ -->
  ${(show('socialProfiles') && Array.isArray(data.socialProfiles) && data.socialProfiles.length > 0) ? `
  <div class="section" data-section="socialProfiles">
    <div class="section-title">Social Profiles</div>
    <hr class="section-divider">
    <div style="font-size:${bodyFontSize};display:flex;flex-wrap:wrap;gap:10px;">
      ${data.socialProfiles.map((item: any, i: number) => `
        <div data-section="socialProfiles" data-index="${i}">
          <a href="${s(item.url)}" target="_blank" style="color:var(--accent);">${s(item.platform)}</a>
          ${hasValue(item.username) ? ` (${s(item.username)})` : ''}
        </div>`).join('')}
    </div>
  </div>` : ''}

  <!-- ═══ SOCIAL LINKS ═══ -->
  ${(show('socialLinks') && Array.isArray(data.socialLinks) && data.socialLinks.length > 0) ? `
  <div class="section" data-section="socialLinks">
    <div class="section-title">Social Links</div>
    <hr class="section-divider">
    <div style="font-size:${bodyFontSize};display:flex;flex-wrap:wrap;gap:10px;">
      ${data.socialLinks.map((link: any, i: number) => `
        <div data-section="socialLinks" data-index="${i}">
          <a href="${s(link.url)}" target="_blank" style="color:var(--accent);">${s(link.urlText) || s(link.url).replace(/https?:\/\//, '')}</a>
        </div>`).join('')}
    </div>
  </div>` : ''}

  <!-- ═══ AVAILABILITY & WORK AUTH ═══ -->
  ${(show('availabilityWorkAuth') && hasValue(data.availabilityWorkAuth)) ? (() => {
    const a = data.availabilityWorkAuth;
    const fields = [a?.availabilityNoticePeriod, a?.workAuthorizationStatus, a?.preferredLocation, a?.visaType].filter(Boolean);
    return fields.length > 0 ? `
    <div class="section" data-section="availabilityWorkAuth">
      <div class="section-title">Availability &amp; Work Authorization</div>
      <hr class="section-divider">
      <div class="info-grid">
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
    <hr class="section-divider">
    <div style="font-size:${bodyFontSize};text-align:justify;">${s(data.declaration)}</div>
  </div>` : ''}

  <!-- ═══ REFERENCES ═══ -->
  ${hasValue(data.references) ? `
  <div class="section" data-section="references">
    <div class="section-title">References</div>
    <hr class="section-divider">
    ${Array.isArray(data.references)
      ? `<div style="display:flex;flex-wrap:wrap;gap:20px;font-size:${bodyFontSize};">
          ${data.references.map((ref: any, index: number) => `
            <div data-section="references" data-index="${index}" style="min-width:150px;">
              ${hasValue(ref.name)                                    ? `<div style="font-weight:bold;">${s(ref.name)}</div>` : ''}
              ${hasValue(ref.position || ref.designationRelationship) ? `<div>${s(ref.position || ref.designationRelationship)}</div>` : ''}
              ${hasValue(ref.company || ref.organization)             ? `<div>${s(ref.company || ref.organization)}</div>` : ''}
              ${hasValue(ref.phone || ref.contactInformation)         ? `<div>📞 ${s(ref.phone || ref.contactInformation)}</div>` : ''}
              ${hasValue(ref.email)                                   ? `<div>✉️ ${s(ref.email)}</div>` : ''}
              ${hasValue(ref.relationship)                            ? `<div><em>${s(ref.relationship)}</em></div>` : ''}
            </div>
          `).join('')}
        </div>`
      : `<div style="font-size:${bodyFontSize};">${s(data.references)}</div>`}
  </div>` : ''}

  <!-- ═══ CUSTOM SECTIONS ═══ -->
  ${(Array.isArray(data.customSections) && data.customSections.length > 0)
    ? data.customSections
        .filter((section: any) =>
          section.isVisible !== false &&
          Array.isArray(section.entries) &&
          section.entries.length > 0 &&
          section.entries.some((e: any) => e.isVisible !== false)
        )
        .map((section: any) => `
      <div class="section" data-section="customSections" data-custom-section-id="${s(section.id)}">
        <div class="section-title">${s(section.heading) || s(section.title) || 'Custom Section'}</div>
        <hr class="section-divider">
        ${section.entries
          .filter((e: any) => e.isVisible !== false)
          .map((entry: any, i: number) => `
            <div style="margin-bottom:10px;" data-section="customSections" data-index="${i}">
              <div class="item-row">
                <span class="company-name">${s(entry.title)}</span>
                <span class="date-text">${s(entry.date) || s(entry.subtitle)}</span>
              </div>
              ${hasValue(entry.organization) ? `<div class="job-title">${s(entry.organization)}</div>` : ''}
              ${hasValue(entry.location)     ? `<div style="font-size:9pt;color:var(--secondary);">${s(entry.location)}</div>` : ''}
              ${hasValue(entry.description)  ? `<div style="font-size:${bodyFontSize};margin-top:5px;">${s(entry.description)}</div>` : ''}
              ${hasValue(entry.url)          ? `<div style="font-size:9pt;"><a href="${s(entry.url)}" target="_blank" style="color:var(--accent);">${s(entry.urlText) || 'View'}</a></div>` : ''}
            </div>
          `).join('')}
      </div>
    `).join('')
    : ''}

</div>
</body>
</html>`;
}