export function buildMetricsDrivenTemplate(data: any, theme?: any): string {
  const defaultTheme = {
    primary: '#1a1a1a',
    secondary: '#555555',
    background: '#ffffff',
    accent: '#959a88',
    lightAccent: '#e5e4db',
    headingFont: 'Arial, sans-serif',
    bodyFont: 'Arial, sans-serif'
  };
  const currentTheme = theme || defaultTheme;

  const bodyFontSize = '9pt';
  const headingFontSize = '12pt';
  const nameFontSize = '32pt';

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

  const expAchievements = (item: any): string[] => {
    if (!item.achievements) return [];
    if (Array.isArray(item.achievements))
      return item.achievements.filter((a: string) => String(a).trim());
    return String(item.achievements).split('\n').filter((a: string) => a.trim());
  };

  const renderSkillsSidebar = (): string => {
    if (!data.skills) return '';
    if (Array.isArray(data.skills)) {
      return data.skills.map((skill: any, i: number) => `
        <div class="skill-item" data-section="skills" data-index="${i}">• ${
          typeof skill === 'object'
            ? s(skill.name) + (skill.level ? ` (${s(skill.level)})` : '')
            : s(skill)
        }</div>`).join('');
    }
    return `<div class="skill-item" data-section="skills" data-index="0">${data.skills}</div>`;
  };

  // Contact footer items (deduped helper)
  const contactFooter = (): string => {
    const items: string[] = [];
    if (hasValue(data.personal?.phone))         items.push(`<span data-section="personal" data-index="0">📞 ${s(data.personal.phone)}</span>`);
    if (hasValue(data.personal?.alternatePhone)) items.push(`<span data-section="personal" data-index="1">📞 ${s(data.personal.alternatePhone)}</span>`);
    if (hasValue(data.personal?.email))         items.push(`<span data-section="personal" data-index="2">✉️ ${s(data.personal.email)}</span>`);
    const loc = [data.personal?.fullAddress, data.personal?.location, data.personal?.city, data.personal?.state, data.personal?.country, data.personal?.pinCode].filter(Boolean).join(', ');
    if (loc) items.push(`<span data-section="personal" data-index="3">📍 ${loc}</span>`);
    if (hasValue(data.personal?.linkedinUrl))   items.push(`<span data-section="personal" data-index="6">🔗 <a href="${s(data.personal.linkedinUrl)}" target="_blank">LinkedIn</a></span>`);
    if (hasValue(data.personal?.githubUrl))     items.push(`<span data-section="personal" data-index="7">💻 <a href="${s(data.personal.githubUrl)}" target="_blank">GitHub</a></span>`);
    if (hasValue(data.personal?.portfolioUrl))  items.push(`<span data-section="personal" data-index="8">🌐 <a href="${s(data.personal.portfolioUrl)}" target="_blank">Portfolio</a></span>`);
    if (hasValue(data.personal?.website))       items.push(`<span data-section="personal" data-index="9">🌐 <a href="${s(data.personal.website)}" target="_blank">Website</a></span>`);
    if (hasValue(data.personal?.twitter))       items.push(`<span>🐦 <a href="${s(data.personal.twitter)}" target="_blank">Twitter</a></span>`);
    if (hasValue(data.personal?.skype))         items.push(`<span>💬 Skype: ${s(data.personal.skype)}</span>`);
    return items.join('');
  };

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    :root {
      --primary-color: ${currentTheme.primary};
      --secondary-color: ${currentTheme.secondary};
      --accent-color: ${currentTheme.accent};
      --light-accent: ${currentTheme.lightAccent};
    }
    body {
      font-family: ${currentTheme.bodyFont};
      color: var(--primary-color);
      line-height: 1.5;
      margin: 0; padding: 0;
      background: white;
    }
    .container { display: flex; flex-direction: column; width: 100%; }

    /* Header */
    .header { display: flex; width: 100%; min-height: 180px; }
    .header-left { width: 35%; background-color: var(--accent-color); }
    .header-right {
      width: 65%; background-color: var(--light-accent);
      display: flex; flex-direction: column; justify-content: center; padding-left: 40px;
    }
    .name { font-size: ${nameFontSize}; font-weight: bold; margin: 0; color: var(--primary-color); letter-spacing: 1px; }
    .job-title { font-size: 14pt; text-transform: uppercase; color: var(--secondary-color); letter-spacing: 2px; margin-top: 5px; }

    /* Layout */
    .main-grid { display: flex; width: 100%; }
    .sidebar {
      width: 35%; background-color: var(--accent-color);
      color: black; padding: 20px 30px;
      min-height: calc(100vh - 180px);
    }
    .profile-img-container {
      width: 100%; aspect-ratio: 1/1.2; background: #ccc;
      margin-top: -100px; margin-bottom: 30px;
      border: 4px solid white; overflow: hidden;
    }
    .profile-img-container img { width: 100%; height: 100%; object-fit: cover; }
    .content { width: 65%; background-color: var(--light-accent); padding: 40px; }

    .section-title-sidebar {
      font-size: 13pt; font-weight: bold; text-transform: uppercase;
      letter-spacing: 2px; border-bottom: 1px solid rgba(255,255,255,0.3);
      padding-bottom: 5px; margin-top: 30px; margin-bottom: 15px;
      color: var(--primary-color);
    }
    .section-title-main {
      font-size: ${headingFontSize}; font-weight: bold; text-transform: uppercase;
      letter-spacing: 2px; color: var(--primary-color);
      border-bottom: 1px solid #ccc; padding-bottom: 5px;
      margin-bottom: 20px; margin-top: 10px;
    }

    /* Skill / badge styles */
    .skill-item { margin-bottom: 12px; font-size: 9pt; }
    .badge-list { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 8px; }
    .badge {
      background: rgba(255,255,255,0.6); border: 1px solid rgba(0,0,0,0.15);
      padding: 3px 8px; border-radius: 3px; font-size: 8.5pt;
    }

    /* Experience */
    .exp-item { margin-bottom: 30px; }
    .exp-header { display: flex; justify-content: space-between; align-items: baseline; font-weight: bold; font-size: 10pt; }
    .exp-subhead { font-style: italic; color: var(--secondary-color); font-size: 9pt; margin-bottom: 8px; }

    /* Footer */
    .footer-contact {
      display: flex; flex-wrap: wrap; justify-content: space-around; gap: 10px;
      background-color: #e2e2d9; padding: 15px; font-size: 8pt; border-top: 1px solid #ccc;
    }

    p, li { font-size: ${bodyFontSize}; margin-bottom: 5px; }
    ul { padding-left: 15px; margin-top: 5px; }
    a { color: inherit; text-decoration: none; }
    a:hover { text-decoration: underline; }

    /* Education */
    .education-entry {
      margin-bottom: 25px; padding: 15px;
      background: rgba(255,255,255,0.7);
      border: 1px solid rgba(0,0,0,0.1);
      border-left: 4px solid var(--secondary-color);
      border-radius: 4px;
    }
    .education-degree  { font-weight: bold; color: var(--primary-color); margin-bottom: 5px; font-size: 10pt; }
    .education-field   { font-weight: 600; color: var(--secondary-color); margin-bottom: 4px; font-size: 9pt; }
    .education-school  { font-weight: bold; color: var(--primary-color); margin-bottom: 4px; font-size: 10pt; }
    .education-location{ color: var(--secondary-color); font-style: italic; margin-bottom: 6px; font-size: 9pt; }
    .education-date    { font-size: 9pt; color: var(--secondary-color); font-weight: 600; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 1px; }
    .education-gpa     { font-size: 9pt; color: var(--secondary-color); margin-bottom: 6px; }
    .education-description {
      font-size: 9pt; color: var(--secondary-color); line-height: 1.5;
      margin-top: 10px; padding: 10px; background: rgba(255,255,255,0.9);
      border-radius: 3px; border-left: 2px solid var(--secondary-color);
    }
    .education-description ul { margin: 4px 0 4px 15px; padding: 0; list-style-type: disc; }
    .education-description li { margin: 2px 0; color: var(--secondary-color); }
    .education-description b  { font-weight: bold; color: var(--primary-color); }
    .education-achievements { margin-top: 10px; padding-top: 10px; border-top: 2px solid rgba(0,0,0,0.1); }
    .education-achievements h4 { font-size: 9pt; font-weight: bold; color: var(--primary-color); margin-bottom: 6px; text-transform: uppercase; letter-spacing: 1px; }
    .education-achievements ul { margin: 0; padding-left: 0; list-style: none; }
    .education-achievements li { position: relative; padding-left: 14px; margin-bottom: 3px; color: var(--secondary-color); font-size: 9pt; }
    .education-achievements li:before { content: "📊"; position: absolute; left: 0; font-size: 8pt; }
    .info-row { display: flex; flex-direction: column; gap: 6px; font-size: 9pt; color: rgba(19,20,20,0.9); }
  </style>
</head>
<body>
<div class="container">

  <!-- ═══ HEADER ═══ -->
  <div class="header">
    <div class="header-left"></div>
    <div class="header-right" data-section="personal">
      <h1 class="name">${s(data.personal?.name) || 'Your Name'}</h1>
      ${hasValue(data.personal?.role || data.personal?.title) ? `<div class="job-title">${s(data.personal?.role || data.personal?.title)}</div>` : ''}
      <div style="font-size:8pt;margin-top:10px;display:flex;flex-wrap:wrap;gap:15px;color:var(--secondary-color);">
        ${hasValue(data.personal?.email)         ? `<span>✉️ ${s(data.personal.email)}</span>` : ''}
        ${hasValue(data.personal?.phone)         ? `<span>📞 ${s(data.personal.phone)}</span>` : ''}
        ${hasValue(data.personal?.alternatePhone) ? `<span>📱 ${s(data.personal.alternatePhone)}</span>` : ''}
        ${(() => { const loc = [data.personal?.fullAddress, data.personal?.location, data.personal?.city, data.personal?.state, data.personal?.country, data.personal?.pinCode].filter(Boolean).join(', '); return loc ? `<span>📍 ${loc}</span>` : ''; })()}
        ${hasValue(data.personal?.linkedinUrl)   ? `<span>🔗 <a href="${s(data.personal.linkedinUrl)}" target="_blank">LinkedIn</a></span>` : ''}
        ${hasValue(data.personal?.githubUrl)     ? `<span>💻 <a href="${s(data.personal.githubUrl)}" target="_blank">GitHub</a></span>` : ''}
        ${hasValue(data.personal?.portfolioUrl)  ? `<span>🌐 <a href="${s(data.personal.portfolioUrl)}" target="_blank">Portfolio</a></span>` : ''}
        ${hasValue(data.personal?.website)       ? `<span>🌐 <a href="${s(data.personal.website)}" target="_blank">Website</a></span>` : ''}
        ${hasValue(data.personal?.twitter)       ? `<span>🐦 <a href="${s(data.personal.twitter)}" target="_blank">Twitter</a></span>` : ''}
      </div>
    </div>
  </div>

  <div class="main-grid">

    <!-- ═══ SIDEBAR ═══ -->
    <div class="sidebar">
      <div class="profile-img-container">
        ${hasValue(data.personal?.image)
          ? `<img src="${s(data.personal.image)}" alt="Profile">`
          : `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;color:#666;">Photo</div>`}
      </div>

      <!-- Personal Details -->
      ${(hasValue(data.personal?.fathersName) || hasValue(data.personal?.mothersName) || hasValue(data.personal?.dob) || hasValue(data.personal?.gender) || hasValue(data.personal?.maritalStatus) || hasValue(data.personal?.nationality) || hasValue(data.personal?.religion) || hasValue(data.personal?.category)) ? `
      <div class="sidebar-section" data-section="personal">
        <div class="section-title-sidebar">PERSONAL DETAILS</div>
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

      <!-- Profile / Summary -->
      ${(show('summary') && hasValue(data.summary)) ? `
      <div class="sidebar-section" data-section="summary">
        <div class="section-title-sidebar">PROFILE</div>
        <p style="color:rgba(19,20,20,0.9);">${s(data.summary)}</p>
      </div>` : ''}

      <!-- Career Objective -->
      ${(show('careerObjective') && hasValue(data.careerObjective)) ? `
      <div class="sidebar-section" data-section="careerObjective">
        <div class="section-title-sidebar">CAREER OBJECTIVE</div>
        <p style="color:rgba(19,20,20,0.9);">${s(data.careerObjective)}</p>
      </div>` : ''}

      <!-- Skills -->
      ${(show('skills') && hasValue(data.skills)) ? `
      <div class="sidebar-section" data-section="skills">
        <div class="section-title-sidebar">SKILLS</div>
        ${renderSkillsSidebar()}
      </div>` : ''}

      <!-- Key Achievements sidebar -->
      ${(Array.isArray(data.keyAchievements) && data.keyAchievements.length > 0) ? `
      <div class="sidebar-section" data-section="keyAchievements">
        <div class="section-title-sidebar">KEY ACHIEVEMENTS</div>
        ${data.keyAchievements.map((a: any, i: number) => `<div class="skill-item" data-section="keyAchievements" data-index="${i}">• ${s(a)}</div>`).join('')}
      </div>` : ''}

      <!-- Languages -->
      ${(show('languages') && Array.isArray(data.languages) && data.languages.length > 0) ? `
      <div class="sidebar-section" data-section="languages">
        <div class="section-title-sidebar">LANGUAGES</div>
        <div style="font-size:9pt;color:rgba(22,21,21,0.9);">
          ${data.languages.map((lang: any) =>
            typeof lang === 'string' ? lang : `${s(lang.language)}${hasValue(lang.level) ? ` (${s(lang.level)})` : ''}`
          ).join(', ')}
        </div>
      </div>` : ''}

      <!-- Hobbies -->
      ${(show('hobbies') && Array.isArray(data.hobbies) && data.hobbies.length > 0) ? `
      <div class="sidebar-section" data-section="hobbies">
        <div class="section-title-sidebar">HOBBIES</div>
        <div style="font-size:9pt;color:rgba(46,44,44,0.9);">${data.hobbies.join(', ')}</div>
      </div>` : ''}

      <!-- Social Profiles -->
      ${(show('socialProfiles') && Array.isArray(data.socialProfiles) && data.socialProfiles.length > 0) ? `
      <div class="sidebar-section" data-section="socialProfiles">
        <div class="section-title-sidebar">SOCIAL PROFILES</div>
        <div style="font-size:9pt;color:rgba(46,44,44,0.9);display:flex;flex-direction:column;gap:5px;">
          ${data.socialProfiles.map((item: any, i: number) => `
            <div data-section="socialProfiles" data-index="${i}">
              <a href="${s(item.url)}" target="_blank">${s(item.platform)}</a>
              ${hasValue(item.username) ? ` (${s(item.username)})` : ''}
            </div>`).join('')}
        </div>
      </div>` : ''}

      <!-- Social Links -->
      ${(show('socialLinks') && Array.isArray(data.socialLinks) && data.socialLinks.length > 0) ? `
      <div class="sidebar-section" data-section="socialLinks">
        <div class="section-title-sidebar">SOCIAL LINKS</div>
        <div style="font-size:9pt;color:rgba(46,44,44,0.9);display:flex;flex-direction:column;gap:5px;">
          ${data.socialLinks.map((link: any, i: number) => `
            <div data-section="socialLinks" data-index="${i}">
              <a href="${s(link.url)}" target="_blank">${s(link.urlText) || s(link.url).replace(/https?:\/\//, '')}</a>
            </div>`).join('')}
        </div>
      </div>` : ''}

      <!-- Methodologies -->
      ${(show('methodologies') && Array.isArray(data.methodologies) && data.methodologies.length > 0) ? `
      <div class="sidebar-section" data-section="methodologies">
        <div class="section-title-sidebar">METHODOLOGIES</div>
        ${data.methodologies.map((item: any, i: number) => `
          <div class="skill-item" data-section="methodologies" data-index="${i}">
            • <strong>${s(item.name)}</strong>
            ${hasValue(item.certification) ? ` (${s(item.certification)})` : ''}
            ${hasValue(item.experienceDuration) ? ` | ${s(item.experienceDuration)} yrs` : ''}
          </div>`).join('')}
      </div>` : ''}

      <!-- Industry Expertise -->
      ${(show('industryExpertise') && Array.isArray(data.industryExpertise) && data.industryExpertise.length > 0) ? `
      <div class="sidebar-section" data-section="industryExpertise">
        <div class="section-title-sidebar">INDUSTRY EXPERTISE</div>
        ${data.industryExpertise.map((item: any, i: number) => `
          <div class="skill-item" data-section="industryExpertise" data-index="${i}">
            • <strong>${s(item.industry)}</strong>
            ${hasValue(item.domainArea) ? ` — ${s(item.domainArea)}` : ''}
            ${hasValue(item.experienceDuration) ? ` | ${s(item.experienceDuration)} yrs` : ''}
          </div>`).join('')}
      </div>` : ''}

      <!-- Tools (freetext) -->
      ${(show('tools') && hasValue(data.tools)) ? `
      <div class="sidebar-section" data-section="tools">
        <div class="section-title-sidebar">TOOLS</div>
        <div style="font-size:9pt;color:rgba(32,31,31,0.9);">${Array.isArray(data.tools) ? data.tools.join(', ') : s(data.tools)}</div>
      </div>` : ''}

      <!-- Tools & Technologies (structured array) -->
      ${(show('toolsTechnologies') && Array.isArray(data.toolsTechnologies) && data.toolsTechnologies.length > 0) ? `
      <div class="sidebar-section" data-section="toolsTechnologies">
        <div class="section-title-sidebar">TOOLS &amp; TECH</div>
        ${data.toolsTechnologies.map((item: any, i: number) => `
          <div class="skill-item" data-section="toolsTechnologies" data-index="${i}">
            • <strong>${s(item.name)}</strong>
            ${hasValue(item.category) ? ` (${s(item.category)})` : ''}
            ${hasValue(item.proficiency) ? ` | ${s(item.proficiency)}` : ''}
            ${hasValue(item.experienceDuration) ? ` | ${s(item.experienceDuration)}` : ''}
          </div>`).join('')}
      </div>` : ''}

      <!-- Responsibilities -->
      ${responsibilityLines.length > 0 ? `
      <div class="sidebar-section" data-section="responsibilities">
        <div class="section-title-sidebar">RESPONSIBILITIES</div>
        <ul style="color:rgba(31,30,30,0.9);">
          ${responsibilityLines.map((l: string, i: number) => `<li style="font-size:9pt;" data-section="responsibilities" data-index="${i}">${l.trim()}</li>`).join('')}
        </ul>
      </div>` : ''}

      <!-- Availability & Work Auth -->
      ${(show('availabilityWorkAuth') && hasValue(data.availabilityWorkAuth)) ? (() => {
        const a = data.availabilityWorkAuth;
        const fields = [a?.availabilityNoticePeriod, a?.workAuthorizationStatus, a?.preferredLocation, a?.visaType].filter(Boolean);
        return fields.length > 0 ? `
        <div class="sidebar-section" data-section="availabilityWorkAuth">
          <div class="section-title-sidebar">AVAILABILITY</div>
          <div class="info-row">
            ${hasValue(a?.availabilityNoticePeriod) ? `<div><strong>Notice Period:</strong> ${s(a.availabilityNoticePeriod)}</div>` : ''}
            ${hasValue(a?.workAuthorizationStatus)  ? `<div><strong>Work Auth:</strong> ${s(a.workAuthorizationStatus)}</div>` : ''}
            ${hasValue(a?.preferredLocation)        ? `<div><strong>Preferred Location:</strong> ${s(a.preferredLocation)}</div>` : ''}
            ${hasValue(a?.visaType)                 ? `<div><strong>Visa Type:</strong> ${s(a.visaType)}</div>` : ''}
            ${hasValue(a?.willingToRelocate)        ? `<div><strong>Relocate:</strong> ${s(a.willingToRelocate)}</div>` : ''}
          </div>
        </div>` : '';
      })() : ''}

      <!-- Declaration -->
      ${(show('declaration') && hasValue(data.declaration)) ? `
      <div class="sidebar-section" data-section="declaration">
        <div class="section-title-sidebar">DECLARATION</div>
        <p style="font-size:9pt;color:rgba(19,20,20,0.9);">${s(data.declaration)}</p>
      </div>` : ''}

    </div><!-- /sidebar -->

    <!-- ═══ MAIN CONTENT ═══ -->
    <div class="content">

      <!-- Work Experience -->
      ${(show('experience') && sortedExperience.length > 0) ? `
      <div class="main-section" data-section="experience">
        <div class="section-title-main">WORK EXPERIENCE</div>
        ${sortedExperience.map((exp: any, index: number) => {
          const lines = toLines(exp.description);
          const achievements = expAchievements(exp);
          return `
          <div class="exp-item" data-section="experience" data-index="${index}">
            <div class="exp-header">
              <span>${s(exp.title)}${hasValue(exp.employmentType) ? ` | ${s(exp.employmentType)}` : ''}</span>
              <span style="font-weight:normal;font-size:9pt;">${s(exp.startDate)}${(exp.startDate || exp.endDate) ? ' – ' : ''}${s(exp.endDate) || (exp.startDate ? 'Present' : '')}</span>
            </div>
            <div class="exp-subhead">
              ${s(exp.company)}${hasValue(exp.location) ? `, ${s(exp.location)}` : ''}
            </div>
            ${lines.length > 0 ? `<ul>${lines.map((l: string, li: number) => `<li data-section="experience" data-index="${index}" data-item-index="${li}">${l.trim()}</li>`).join('')}</ul>` : ''}
            ${achievements.length > 0 ? `<ul style="margin-top:4px;">${achievements.map((a: string, ai: number) => `<li data-section="experience" data-index="${index}" data-item-index="${ai}">⭐ ${a}</li>`).join('')}</ul>` : ''}
            ${hasValue(exp.technologies) ? `<p style="margin-top:4px;"><strong>Technologies:</strong> ${s(exp.technologies)}</p>` : ''}
          </div>`;
        }).join('')}
      </div>` : ''}

      <!-- Education -->
      ${(show('education') && Array.isArray(data.education) && data.education.length > 0) ? `
      <div class="main-section" data-section="education">
        <div class="section-title-main">EDUCATIONAL HISTORY</div>
        ${data.education.map((edu: any, index: number) => `
          <div class="education-entry" data-section="education" data-index="${index}">
            ${hasValue(edu.degree) ? `<div class="education-degree" data-section="education" data-index="${index}">${s(edu.degree)}${hasValue(edu.qualification) ? ` (${s(edu.qualification)})` : ''}</div>` : ''}
            ${hasValue(edu.field)       ? `<div class="education-field"    data-section="education" data-index="${index}">${s(edu.field)}</div>` : ''}
            ${hasValue(edu.school)      ? `<div class="education-school"   data-section="education" data-index="${index}">${s(edu.school)}</div>` : ''}
            ${hasValue(edu.university)  ? `<div class="education-school"   data-section="education" data-index="${index}">${s(edu.university)}</div>` : ''}
            ${hasValue(edu.board)       ? `<div style="font-size:9pt;color:var(--secondary-color);" data-section="education" data-index="${index}">Board: ${s(edu.board)}</div>` : ''}
            ${hasValue(edu.location)    ? `<div class="education-location" data-section="education" data-index="${index}">${s(edu.location)}</div>` : ''}
            ${(hasValue(edu.graduationDate) || hasValue(edu.startDate) || hasValue(edu.endDate)) ? `
              <div class="education-date" data-section="education" data-index="${index}">
                ${edu.startDate && edu.endDate ? `${s(edu.startDate)} – ${s(edu.endDate)}` : (s(edu.graduationDate) || s(edu.endDate) || s(edu.startDate))}
              </div>` : ''}
            ${hasValue(edu.percentage)  ? `<div class="education-gpa" data-section="education" data-index="${index}">Score: ${s(edu.percentage)}%</div>` : ''}
            ${hasValue(edu.cgpa)        ? `<div class="education-gpa" data-section="education" data-index="${index}">CGPA: ${s(edu.cgpa)}</div>` : ''}
            ${hasValue(edu.gpa)         ? `<div class="education-gpa" data-section="education" data-index="${index}">GPA: ${s(edu.gpa)}</div>` : ''}
            ${hasValue(edu.grade)       ? `<div class="education-gpa" data-section="education" data-index="${index}"> ${s(edu.grade)}</div>` : ''}
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

      <!-- Projects -->
      ${(show('projects') && Array.isArray(data.projects) && data.projects.length > 0) ? `
      <div class="main-section" data-section="projects">
        <div class="section-title-main">PROJECTS</div>
        ${data.projects.map((project: any, index: number) => `
          <div class="exp-item" data-section="projects" data-index="${index}">
            <div class="exp-header">
              <span>${s(project.name)}</span>
              <span style="font-weight:normal;font-size:9pt;">${s(project.startDate)}${(project.startDate || project.endDate) ? ' – ' : ''}${s(project.endDate) || (project.startDate ? 'Present' : '')}</span>
            </div>
            ${hasValue(project.role)         ? `<div class="exp-subhead">${s(project.role)}</div>` : ''}
            ${hasValue(project.technologies) ? `<div class="exp-subhead">${s(project.technologies)}</div>` : ''}
            ${hasValue(project.description)  ? `<p>${s(project.description)}</p>` : ''}
            ${hasValue(project.url)          ? `<p style="font-size:8pt;"><a href="${s(project.url)}" target="_blank">${s(project.urlText) || 'View Project'}</a></p>` : ''}
            ${hasValue(project.githubUrl)    ? `<p style="font-size:8pt;"><a href="${s(project.githubUrl)}" target="_blank">GitHub</a></p>` : ''}
          </div>
        `).join('')}
      </div>` : ''}

      <!-- Certifications -->
      ${(show('certifications') && Array.isArray(data.certifications) && data.certifications.length > 0) ? `
      <div class="main-section" data-section="certifications">
        <div class="section-title-main">CERTIFICATIONS</div>
        ${data.certifications.map((cert: any, index: number) => `
          <div class="exp-item" data-section="certifications" data-index="${index}">
            <div class="exp-header"><span>${s(cert.name)}</span><span style="font-weight:normal;font-size:9pt;">${s(cert.date)}</span></div>
            <div class="exp-subhead">${s(cert.issuer)}${hasValue(cert.expiryDate) ? ` | Expires: ${s(cert.expiryDate)}` : ''}${hasValue(cert.credentialId) ? ` | ID: ${s(cert.credentialId)}` : ''}</div>
            ${hasValue(cert.description) ? `<p>${s(cert.description)}</p>` : ''}
            ${hasValue(cert.url) ? `<p style="font-size:8pt;"><a href="${s(cert.url)}" target="_blank">View Certificate</a></p>` : ''}
          </div>
        `).join('')}
      </div>` : ''}

      <!-- Internships -->
      ${(show('internships') && Array.isArray(data.internships) && data.internships.length > 0) ? `
      <div class="main-section" data-section="internships">
        <div class="section-title-main">INTERNSHIPS</div>
        ${data.internships.map((item: any, index: number) => {
          const lines = toLines(item.description);
          return `
          <div class="exp-item" data-section="internships" data-index="${index}">
            <div class="exp-header">
              <span>${s(item.title)}</span>
              <span style="font-weight:normal;font-size:9pt;">${s(item.startDate)}${(item.startDate || item.endDate || item.duration) ? ' ' : ''}${s(item.endDate) || s(item.duration)}</span>
            </div>
            <div class="exp-subhead">${s(item.company)}${hasValue(item.location) ? `, ${s(item.location)}` : ''}</div>
            ${hasValue(item.stipend) ? `<p><strong>Stipend:</strong> ${s(item.stipend)}</p>` : ''}
            ${lines.length > 0 ? `<ul>${lines.map((l: string, li: number) => `<li data-section="internships" data-index="${index}" data-item-index="${li}">${l.trim()}</li>`).join('')}</ul>` : ''}
            ${hasValue(item.technologies) ? `<p style="margin-top:4px;"><strong>Technologies:</strong> ${s(item.technologies)}</p>` : ''}
          </div>`;
        }).join('')}
      </div>` : ''}

      <!-- Academic Projects -->
      ${(show('academicProjects') && Array.isArray(data.academicProjects) && data.academicProjects.length > 0) ? `
      <div class="main-section" data-section="academicProjects">
        <div class="section-title-main">ACADEMIC PROJECTS</div>
        ${data.academicProjects.map((item: any, index: number) => `
          <div class="exp-item" data-section="academicProjects" data-index="${index}">
            <div class="exp-header">
              <span>${s(item.name) || s(item.title)}</span>
              <span style="font-weight:normal;font-size:9pt;">${s(item.duration)}${hasValue(item.year) ? ` | ${s(item.year)}` : ''}</span>
            </div>
            <div class="exp-subhead">${s(item.institution)}${hasValue(item.course) ? ` | ${s(item.course)}` : ''}</div>
            ${hasValue(item.description)  ? `<p>${s(item.description)}</p>` : ''}
            ${hasValue(item.technologies) ? `<div class="exp-subhead"><strong>Technologies:</strong> ${Array.isArray(item.technologies) ? item.technologies.join(', ') : s(item.technologies)}</div>` : ''}
            ${hasValue(item.url)          ? `<p style="font-size:8pt;"><a href="${s(item.url)}" target="_blank">View Project</a></p>` : ''}
          </div>
        `).join('')}
      </div>` : ''}

      <!-- Leadership Positions -->
      ${(show('leadershipPositions') && Array.isArray(data.leadershipPositions) && data.leadershipPositions.length > 0) ? `
      <div class="main-section" data-section="leadershipPositions">
        <div class="section-title-main">LEADERSHIP &amp; POSITIONS</div>
        ${data.leadershipPositions.map((item: any, index: number) => `
          <div class="exp-item" data-section="leadershipPositions" data-index="${index}">
            <div class="exp-header">
              <span>${s(item.position) || s(item.title)}</span>
              <span style="font-weight:normal;font-size:9pt;">${s(item.startDate)}${(item.startDate || item.endDate) ? ' – ' : ''}${s(item.endDate) || (item.startDate ? 'Present' : '')}</span>
            </div>
            <div class="exp-subhead">${s(item.organization)}</div>
            ${hasValue(item.description) ? `<p>${s(item.description)}</p>` : ''}
          </div>
        `).join('')}
      </div>` : ''}

      <!-- Training Programs -->
      ${(show('trainingPrograms') && Array.isArray(data.trainingPrograms) && data.trainingPrograms.length > 0) ? `
      <div class="main-section" data-section="trainingPrograms">
        <div class="section-title-main">TRAINING PROGRAMS</div>
        ${data.trainingPrograms.map((item: any, index: number) => `
          <div class="exp-item" data-section="trainingPrograms" data-index="${index}">
            <div class="exp-header">
              <span>${s(item.name)}</span>
              <span style="font-weight:normal;font-size:9pt;">${s(item.completionDate)}</span>
            </div>
            <div class="exp-subhead">${s(item.provider) || s(item.organization)}${hasValue(item.duration) ? ` | ${s(item.duration)}` : ''}${hasValue(item.mode) ? ` | ${s(item.mode)}` : ''}</div>
            ${hasValue(item.description) ? `<p>${s(item.description)}</p>` : ''}
          </div>
        `).join('')}
      </div>` : ''}

      <!-- Scholarships -->
      ${(show('scholarships') && Array.isArray(data.scholarships) && data.scholarships.length > 0) ? `
      <div class="main-section" data-section="scholarships">
        <div class="section-title-main">SCHOLARSHIPS</div>
        ${data.scholarships.map((item: any, index: number) => `
          <div class="exp-item" data-section="scholarships" data-index="${index}">
            <div class="exp-header">
              <span>${s(item.name)}</span>
              <span style="font-weight:normal;font-size:9pt;">${s(item.year)}</span>
            </div>
            <div class="exp-subhead">${s(item.provider) || s(item.organization)}${hasValue(item.amount) ? ` | ${s(item.amount)}` : ''}</div>
            ${hasValue(item.description) ? `<p>${s(item.description)}</p>` : ''}
          </div>
        `).join('')}
      </div>` : ''}

      <!-- Awards -->
      ${(show('awards') && Array.isArray(data.awards) && data.awards.length > 0) ? `
      <div class="main-section" data-section="awards">
        <div class="section-title-main">AWARDS &amp; HONORS</div>
        ${data.awards.map((item: any, index: number) => `
          <div class="exp-item" data-section="awards" data-index="${index}">
            <div class="exp-header">
              <span>${s(item.title) || s(item.name)}</span>
              <span style="font-weight:normal;font-size:9pt;">${s(item.date || item.issueYear || item.year)}</span>
            </div>
            <div class="exp-subhead">${s(item.issuer || item.organization)}</div>
            ${hasValue(item.description) ? `<p>${s(item.description)}</p>` : ''}
          </div>
        `).join('')}
      </div>` : ''}

      <!-- Speaking Engagements -->
      ${(show('speakingEngagements') && Array.isArray(data.speakingEngagements) && data.speakingEngagements.length > 0) ? `
      <div class="main-section" data-section="speakingEngagements">
        <div class="section-title-main">SPEAKING ENGAGEMENTS</div>
        ${data.speakingEngagements.map((item: any, index: number) => `
          <div class="exp-item" data-section="speakingEngagements" data-index="${index}">
            <div class="exp-header">
              <span>${s(item.topic)}</span>
              <span style="font-weight:normal;font-size:9pt;">${s(item.date)}</span>
            </div>
            <div class="exp-subhead">${s(item.eventName)}${hasValue(item.location) ? ` | ${s(item.location)}` : ''}</div>
            ${hasValue(item.description) ? `<p>${s(item.description)}</p>` : ''}
          </div>
        `).join('')}
      </div>` : ''}

      <!-- Memberships -->
      ${(show('memberships') && Array.isArray(data.memberships) && data.memberships.length > 0) ? `
      <div class="main-section" data-section="memberships">
        <div class="section-title-main">MEMBERSHIPS</div>
        ${data.memberships.map((item: any, index: number) => `
          <div class="exp-item" data-section="memberships" data-index="${index}">
            <div class="exp-header">
              <span>${s(item.membershipName)}</span>
              <span style="font-weight:normal;font-size:9pt;">${s(item.year)}</span>
            </div>
            <div class="exp-subhead">${s(item.organizationName)}${hasValue(item.membershipId) ? ` | ID: ${s(item.membershipId)}` : ''}</div>
            ${hasValue(item.description) ? `<p>${s(item.description)}</p>` : ''}
          </div>
        `).join('')}
      </div>` : ''}

      <!-- Workshops -->
      ${(show('workshops') && Array.isArray(data.workshops) && data.workshops.length > 0) ? `
      <div class="main-section" data-section="workshops">
        <div class="section-title-main">WORKSHOPS</div>
        ${data.workshops.map((item: any, index: number) => `
          <div class="exp-item" data-section="workshops" data-index="${index}">
            <div class="exp-header">
              <span>${s(item.programTitle)}</span>
              <span style="font-weight:normal;font-size:9pt;">${s(item.year)}</span>
            </div>
            <div class="exp-subhead">${s(item.conductedBy)}${hasValue(item.duration) ? ` | ${s(item.duration)}` : ''}${hasValue(item.location) ? ` | ${s(item.location)}` : ''}</div>
            ${hasValue(item.description) ? `<p>${s(item.description)}</p>` : ''}
          </div>
        `).join('')}
      </div>` : ''}

      <!-- Portfolio -->
      ${(show('portfolio') && Array.isArray(data.portfolio) && data.portfolio.length > 0) ? `
      <div class="main-section" data-section="portfolio">
        <div class="section-title-main">PORTFOLIO</div>
        ${data.portfolio.map((item: any, index: number) => `
          <div class="exp-item" data-section="portfolio" data-index="${index}">
            <div class="exp-header">
              <span>${s(item.name)}</span>
              <span style="font-weight:normal;font-size:9pt;">${s(item.type)}${hasValue(item.platform) ? ` | ${s(item.platform)}` : ''}</span>
            </div>
            ${hasValue(item.description) ? `<p>${s(item.description)}</p>` : ''}
            ${hasValue(item.url) ? `<p style="font-size:8pt;"><a href="${s(item.url)}" target="_blank">View</a></p>` : ''}
          </div>
        `).join('')}
      </div>` : ''}

      <!-- Client Projects -->
      ${(show('clientProjects') && Array.isArray(data.clientProjects) && data.clientProjects.length > 0) ? `
      <div class="main-section" data-section="clientProjects">
        <div class="section-title-main">CLIENT PROJECTS</div>
        ${data.clientProjects.map((item: any, index: number) => `
          <div class="exp-item" data-section="clientProjects" data-index="${index}">
            <div class="exp-header">
              <span>${s(item.name)}</span>
              <span style="font-weight:normal;font-size:9pt;">${s(item.duration)}</span>
            </div>
            <div class="exp-subhead">${s(item.role)}${hasValue(item.clientOrganization) ? ` | Client: ${s(item.clientOrganization)}` : ''}</div>
            ${hasValue(item.description)       ? `<p>${s(item.description)}</p>` : ''}
            ${hasValue(item.toolsTechnologies) ? `<p style="margin-top:4px;"><strong>Tech:</strong> ${s(item.toolsTechnologies)}</p>` : ''}
            ${hasValue(item.projectUrl)        ? `<p style="font-size:8pt;"><a href="${s(item.projectUrl)}" target="_blank">View Project</a></p>` : ''}
          </div>
        `).join('')}
      </div>` : ''}

      <!-- Volunteering -->
      ${(show('volunteering') && Array.isArray(data.volunteering) && data.volunteering.length > 0) ? `
      <div class="main-section" data-section="volunteering">
        <div class="section-title-main">VOLUNTEERING</div>
        ${data.volunteering.map((item: any, index: number) => `
          <div class="exp-item" data-section="volunteering" data-index="${index}">
            <div class="exp-header">
              <span>${s(item.role)}</span>
              <span style="font-weight:normal;font-size:9pt;">${s(item.duration)}${(item.startDate || item.endDate) ? ` | ${s(item.startDate)} – ${s(item.endDate) || 'Present'}` : ''}</span>
            </div>
            <div class="exp-subhead">${s(item.organization)}${hasValue(item.causeArea) ? ` | ${s(item.causeArea)}` : ''}</div>
            ${hasValue(item.description) ? `<p>${s(item.description)}</p>` : ''}
          </div>
        `).join('')}
      </div>` : ''}

      <!-- Military Service -->
      ${(show('militaryService') && Array.isArray(data.militaryService) && data.militaryService.length > 0) ? `
      <div class="main-section" data-section="militaryService">
        <div class="section-title-main">MILITARY SERVICE</div>
        ${data.militaryService.map((item: any, index: number) => `
          <div class="exp-item" data-section="militaryService" data-index="${index}">
            <div class="exp-header">
              <span>${s(item.rank)}${hasValue(item.branch) ? ` — ${s(item.branch)}` : ''}</span>
              <span style="font-weight:normal;font-size:9pt;">${s(item.duration)}${(item.startDate || item.endDate) ? ` | ${s(item.startDate)} – ${s(item.endDate) || 'Present'}` : ''}</span>
            </div>
            ${hasValue(item.specialization) ? `<div class="exp-subhead">${s(item.specialization)}</div>` : ''}
            ${hasValue(item.description) ? `<p>${s(item.description)}</p>` : ''}
          </div>
        `).join('')}
      </div>` : ''}

      <!-- Teaching Experience -->
      ${(show('teachingExperience') && Array.isArray(data.teachingExperience) && data.teachingExperience.length > 0) ? `
      <div class="main-section" data-section="teachingExperience">
        <div class="section-title-main">TEACHING EXPERIENCE</div>
        ${data.teachingExperience.map((item: any, index: number) => `
          <div class="exp-item" data-section="teachingExperience" data-index="${index}">
            <div class="exp-header">
              <span>${s(item.title)}</span>
              <span style="font-weight:normal;font-size:9pt;">${s(item.duration)}</span>
            </div>
            <div class="exp-subhead">${s(item.institution)}</div>
            ${hasValue(item.subjectCourseTaught) ? `<p><strong>Subject:</strong> ${s(item.subjectCourseTaught)}</p>` : ''}
            ${hasValue(item.description) ? `<p>${s(item.description)}</p>` : ''}
          </div>
        `).join('')}
      </div>` : ''}

      <!-- Mentorship Experience -->
      ${(show('mentorshipExperience') && Array.isArray(data.mentorshipExperience) && data.mentorshipExperience.length > 0) ? `
      <div class="main-section" data-section="mentorshipExperience">
        <div class="section-title-main">MENTORSHIP EXPERIENCE</div>
        ${data.mentorshipExperience.map((item: any, index: number) => `
          <div class="exp-item" data-section="mentorshipExperience" data-index="${index}">
            <div class="exp-header">
              <span>${s(item.mentorshipArea)}</span>
              <span style="font-weight:normal;font-size:9pt;">${s(item.duration)}</span>
            </div>
            <div class="exp-subhead">${s(item.organizationPlatform)}${hasValue(item.menteeLevel) ? ` | Mentee Level: ${s(item.menteeLevel)}` : ''}</div>
            ${hasValue(item.description) ? `<p>${s(item.description)}</p>` : ''}
          </div>
        `).join('')}
      </div>` : ''}

      <!-- Publications -->
      ${(show('publications') && Array.isArray(data.publications) && data.publications.length > 0) ? `
      <div class="main-section" data-section="publications">
        <div class="section-title-main">PUBLICATIONS</div>
        ${data.publications.map((item: any, index: number) => `
          <div class="exp-item" data-section="publications" data-index="${index}">
            <div class="exp-header">
              <span>${s(item.title)}</span>
              <span style="font-weight:normal;font-size:9pt;">${s(item.date || item.year)}</span>
            </div>
            <div class="exp-subhead">${s(item.publisher || item.journalPublisher || item.journal)}${hasValue(item.publicationType) ? ` | ${s(item.publicationType)}` : ''}</div>
            ${hasValue(item.authors) ? `<p><strong>Authors:</strong> ${s(item.authors)}</p>` : ''}
            ${hasValue(item.description) ? `<p>${s(item.description)}</p>` : ''}
            ${hasValue(item.url || item.urlDoi) ? `<p style="font-size:8pt;"><a href="${s(item.url || item.urlDoi)}" target="_blank">Read</a></p>` : ''}
          </div>
        `).join('')}
      </div>` : ''}

      <!-- Research Grants -->
      ${(show('researchGrants') && Array.isArray(data.researchGrants) && data.researchGrants.length > 0) ? `
      <div class="main-section" data-section="researchGrants">
        <div class="section-title-main">RESEARCH GRANTS</div>
        ${data.researchGrants.map((item: any, index: number) => `
          <div class="exp-item" data-section="researchGrants" data-index="${index}">
            <div class="exp-header">
              <span>${s(item.title)}</span>
              <span style="font-weight:normal;font-size:9pt;">${s(item.year)}</span>
            </div>
            <div class="exp-subhead">${s(item.agency)}${hasValue(item.amount) ? ` | Amount: ${s(item.amount)}` : ''}</div>
            ${hasValue(item.description) ? `<p>${s(item.description)}</p>` : ''}
          </div>
        `).join('')}
      </div>` : ''}

      <!-- Patents -->
      ${(show('patents') && Array.isArray(data.patents) && data.patents.length > 0) ? `
      <div class="main-section" data-section="patents">
        <div class="section-title-main">PATENTS</div>
        ${data.patents.map((item: any, index: number) => `
          <div class="exp-item" data-section="patents" data-index="${index}">
            <div class="exp-header">
              <span>${s(item.title)}</span>
              <span style="font-weight:normal;font-size:9pt;">${s(item.year)}</span>
            </div>
            <div class="exp-subhead">
              ${hasValue(item.patentNumber) ? `No: ${s(item.patentNumber)}` : ''}
              ${hasValue(item.status) ? ` | ${s(item.status)}` : ''}
              ${hasValue(item.issuingAuthority) ? ` | ${s(item.issuingAuthority)}` : ''}
            </div>
            ${hasValue(item.description) ? `<p>${s(item.description)}</p>` : ''}
          </div>
        `).join('')}
      </div>` : ''}

      <!-- Test Scores -->
      ${(show('testScores') && Array.isArray(data.testScores) && data.testScores.length > 0) ? `
      <div class="main-section" data-section="testScores">
        <div class="section-title-main">TEST SCORES</div>
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

      <!-- Co-Curricular -->
      ${(show('coCurricular') && Array.isArray(data.coCurricular) && data.coCurricular.length > 0) ? `
      <div class="main-section" data-section="coCurricular">
        <div class="section-title-main">CO-CURRICULAR ACTIVITIES</div>
        ${data.coCurricular.map((item: any, index: number) => `
          <div class="exp-item" data-section="coCurricular" data-index="${index}">
            <div class="exp-header">
              <span>${s(item.activity)}</span>
              <span style="font-weight:normal;font-size:9pt;">${s(item.year) || (item.startDate ? `${s(item.startDate)} – ${s(item.endDate) || ''}` : '')}</span>
            </div>
            <div class="exp-subhead">${s(item.organization)}${hasValue(item.role) ? ` | ${s(item.role)}` : ''}</div>
            ${hasValue(item.description) ? `<p>${s(item.description)}</p>` : ''}
          </div>
        `).join('')}
      </div>` : ''}

      <!-- Extracurricular -->
      ${(show('extracurricular') && Array.isArray(data.extracurricular) && data.extracurricular.length > 0) ? `
      <div class="main-section" data-section="extracurricular">
        <div class="section-title-main">EXTRACURRICULAR ACTIVITIES</div>
        ${data.extracurricular.map((item: any, index: number) => `
          <div class="exp-item" data-section="extracurricular" data-index="${index}">
            <div class="exp-header">
              <span>${s(item.activity)}</span>
              <span style="font-weight:normal;font-size:9pt;">${s(item.year) || (item.startDate ? `${s(item.startDate)} – ${s(item.endDate) || ''}` : '')}</span>
            </div>
            <div class="exp-subhead">${s(item.organization)}${hasValue(item.role) ? ` | ${s(item.role)}` : ''}</div>
            ${hasValue(item.description) ? `<p>${s(item.description)}</p>` : ''}
          </div>
        `).join('')}
      </div>` : ''}

      <!-- References -->
      ${hasValue(data.references) ? `
      <div class="main-section" data-section="references">
        <div class="section-title-main">REFERENCES</div>
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
          : `<p>${s(data.references)}</p>`}
      </div>` : ''}

      <!-- Custom Sections -->
      ${(Array.isArray(data.customSections) && data.customSections.length > 0)
        ? data.customSections
            .filter((section: any) =>
              section.isVisible &&
              Array.isArray(section.entries) &&
              section.entries.some((e: any) => e.isVisible)
            )
            .map((section: any) => `
          <div class="main-section" data-section="customSections">
            <div class="section-title-main">${s(section.heading) || 'Custom Section'}</div>
            ${section.entries.filter((e: any) => e.isVisible).map((entry: any, i: number) => `
              <div class="exp-item" data-section="customSections" data-index="${i}">
                <div class="exp-header">
                  ${s(entry.title)}${hasValue(entry.organization) ? ` | ${s(entry.organization)}` : ''}
                  ${hasValue(entry.date) ? `<span style="font-weight:normal;font-size:9pt;">${s(entry.date)}</span>` : ''}
                </div>
                ${hasValue(entry.subtitle)    ? `<div class="exp-subhead">${s(entry.subtitle)}</div>` : ''}
                ${hasValue(entry.location)    ? `<p><strong>Location:</strong> ${s(entry.location)}</p>` : ''}
                ${hasValue(entry.description) ? `<p>${s(entry.description)}</p>` : ''}
                ${hasValue(entry.url)         ? `<p style="font-size:8pt;"><a href="${s(entry.url)}" target="_blank">${s(entry.urlText) || 'View'}</a></p>` : ''}
              </div>
            `).join('')}
          </div>
        `).join('')
        : ''}

    </div><!-- /content -->
  </div><!-- /main-grid -->

  <!-- ═══ FOOTER CONTACT BAR ═══ -->
  <div class="footer-contact" data-section="personal">
    ${contactFooter()}
  </div>

</div>
</body>
</html>`;
}