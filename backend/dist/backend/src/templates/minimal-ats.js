"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildMinimalAtsTemplate = buildMinimalAtsTemplate;
function buildMinimalAtsTemplate(data, theme) {
    const defaultTheme = {
        primary: "#1a1a1a",
        secondary: "#4b5563",
        background: "#ffffff",
        accent: "#ffffff",
        lightBackground: "#f3f4f6",
        headingFont: "Arial, Helvetica, sans-serif",
        bodyFont: "Arial, Helvetica, sans-serif",
    };
    const currentTheme = theme || defaultTheme;
    const bodyFontSize = "12pt";
    const headingFontSize = "14pt";
    const nameFontSize = "28pt";
    const isEmpty = (val) => {
        if (val === null || val === undefined)
            return true;
        if (typeof val === "string")
            return val.trim().length === 0;
        if (Array.isArray(val))
            return val.length === 0;
        if (typeof val === "object")
            return Object.keys(val).length === 0;
        return false;
    };
    const hasContent = (arr) => {
        if (!arr || !Array.isArray(arr))
            return false;
        return arr.some((item) => {
            if (typeof item === "string")
                return item.trim().length > 0;
            if (typeof item === "object" && item !== null) {
                return Object.values(item).some((val) => typeof val === "string" && val.trim().length > 0);
            }
            return false;
        });
    };
    const getNonEmptyArray = (arr) => {
        if (!arr || !Array.isArray(arr))
            return [];
        return arr.filter((item) => {
            if (typeof item === "string")
                return item.trim().length > 0;
            if (typeof item === "object" && item !== null) {
                return Object.values(item).some((val) => typeof val === "string" && val.trim().length > 0);
            }
            return false;
        });
    };
    const sortedExperience = hasContent(data.experience)
        ? [...data.experience].sort((a, b) => new Date(b.startDate || "1900-01-01").getTime() -
            new Date(a.startDate || "1900-01-01").getTime())
        : [];
    const nonEmptySkills = Array.isArray(data.skills)
        ? data.skills.filter((s) => (typeof s === "string" ? s.trim() : s))
        : typeof data.skills === "string" && data.skills.trim()
            ? [data.skills]
            : [];
    const nonEmptyEducation = getNonEmptyArray(data.education);
    const nonEmptyProjects = getNonEmptyArray(data.projects);
    const nonEmptyCertifications = getNonEmptyArray(data.certifications);
    const nonEmptyKeyAchievements = getNonEmptyArray(data.keyAchievements);
    const nonEmptyResponsibilities = getNonEmptyArray(Array.isArray(data.responsibilities)
        ? data.responsibilities
        : (data.responsibilities || "").split("\n"));
    const nonEmptyTools = getNonEmptyArray(Array.isArray(data.tools) ? data.tools : (data.tools || "").split("\n"));
    const nonEmptyLanguages = getNonEmptyArray(data.languages);
    const nonEmptySocialLinks = getNonEmptyArray(data.socialLinks);
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <style>
    :root {
      --sidebar-bg: #212121;
      --sidebar-text: #ffffff;
      --main-text: #363434ff;
      --accent-color: #666666;
    }

    * { margin: 0; padding: 0; box-sizing: border-box; }

    body {
      font-family: ${currentTheme.bodyFont};
      font-size: ${bodyFontSize};
      color: var(--main-text);
      line-height: 1.4;
      background: white;
    }

    .resume-wrapper {
      display: flex;
      min-height: 100vh;
      width: 100%;
    }

    /* Left Sidebar */
    .sidebar {
      width: 30%;
      background-color: var(--sidebar-bg);
      color: var(--sidebar-text);
      padding: 40px 20px;
    }

    .profile-img {
      width: 140px;
      height: 140px;
      background: #444;
      margin-bottom: 30px;
      border-radius: 4px;
      overflow: hidden;
    }
    
    .profile-img img { width: 100%; height: 100%; object-fit: cover; }

    .sidebar-section { margin-bottom: 25px; }

    .sidebar-title {
      font-size: 10pt;
      font-weight: bold;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 12px;
      border-bottom: 1px solid #444;
      padding-bottom: 4px;
    }

    .sidebar-item {
      font-size: 9pt;
      margin-bottom: 8px;
      color: #ccc;
    }

    /* Right Main Content */
    .main-content {
      width: 70%;
      padding: 40px 35px;
      background: white;
    }

    .header-name {
      font-size: ${nameFontSize};
      font-weight: bold;
      color: #000;
      margin-bottom: 20px;
      font-family: ${currentTheme.headingFont};
    }

    .main-section { margin-bottom: 25px; }

    .main-section-title {
      font-size: ${headingFontSize};
      font-weight: bold;
      text-transform: uppercase;
      border-bottom: 1px solid #eee;
      margin-bottom: 12px;
      padding-bottom: 2px;
    }

    .summary-text { margin-bottom: 15px; color: #555; text-align: justify; }

    .experience-item { margin-bottom: 18px; }
    .exp-header { display: flex; justify-content: space-between; font-weight: bold; }
    .exp-sub { color: #666; font-style: italic; margin-bottom: 5px; }
    .exp-desc { color: #555; margin-left: 10px; }

    .skill-tag {
      display: inline-block;
      background: #f0f0f0;
      padding: 2px 8px;
      margin: 2px;
      border-radius: 3px;
      font-size: 8.5pt;
      color: #444;
    }

    @media print {
      .sidebar { -webkit-print-color-adjust: exact; background-color: #212121 !important; }
    }
  </style>
</head>
<body>
<div class="resume-wrapper">
  <div class="sidebar">
    <div class="profile-img">
      ${data.personal?.image ? `<img src="${data.personal.image}" />` : ""}
    </div>

    <div class="sidebar-section" data-section="contact">
      <div class="sidebar-title" data-section="contact">Contact</div>
      <div class="sidebar-item" data-section="contact">${data.personal?.phone || ""}</div>
      <div class="sidebar-item" data-section="contact">${data.personal?.email || ""}</div>
      <div class="sidebar-item" data-section="contact">${[
        data.personal?.location,
        data.personal?.country,
        data.personal?.pinCode,
        data.personal?.fullAddress,
    ]
        .filter(Boolean)
        .join(", ") || ""}</div>
      ${data.personal?.personalInfoDisplay === "inline" &&
        (data.personal?.fathersName ||
            data.personal?.dateOfBirth ||
            data.personal?.dob ||
            data.personal?.gender ||
            data.personal?.maritalStatus ||
            data.personal?.nationality)
        ? `
      ${data.personal?.fathersName
            ? `<div class="sidebar-item" data-section="contact">Father: ${data.personal.fathersName}</div>`
            : ""}
      ${data.personal?.dateOfBirth || data.personal?.dob
            ? `<div class="sidebar-item" data-section="contact">DOB: ${data.personal?.dateOfBirth || data.personal?.dob}</div>`
            : ""}
      ${data.personal?.gender
            ? `<div class="sidebar-item" data-section="contact">Gender: ${data.personal.gender}</div>`
            : ""}
      ${data.personal?.maritalStatus
            ? `<div class="sidebar-item" data-section="contact">Marital: ${data.personal.maritalStatus}</div>`
            : ""}
      ${data.personal?.nationality
            ? `<div class="sidebar-item" data-section="contact">Nationality: ${data.personal.nationality}</div>`
            : ""}
      `
        : ""}
    </div>

    ${data.personal?.personalInfoDisplay !== "inline" &&
        (data.personal?.fathersName ||
            data.personal?.dateOfBirth ||
            data.personal?.dob ||
            data.personal?.gender ||
            data.personal?.maritalStatus ||
            data.personal?.nationality ||
            data.personal?.passportNo)
        ? `
    <div class="sidebar-section" data-section="personal">
      <div class="sidebar-title" data-section="personal">Personal Details</div>
      ${data.personal?.fathersName
            ? `<div class="sidebar-item" data-section="personal">Father: ${data.personal.fathersName}</div>`
            : ""}
      ${data.personal?.dateOfBirth || data.personal?.dob
            ? `<div class="sidebar-item" data-section="personal">DOB: ${data.personal?.dateOfBirth || data.personal?.dob}</div>`
            : ""}
      ${data.personal?.gender
            ? `<div class="sidebar-item" data-section="personal">Gender: ${data.personal.gender}</div>`
            : ""}
      ${data.personal?.maritalStatus
            ? `<div class="sidebar-item" data-section="personal">Marital: ${data.personal.maritalStatus}</div>`
            : ""}
      ${data.personal?.nationality
            ? `<div class="sidebar-item" data-section="personal">Nationality: ${data.personal.nationality}</div>`
            : ""}
      ${data.personal?.passportNo
            ? `<div class="sidebar-item" data-section="personal">Passport: ${data.personal.passportNo}</div>`
            : ""}
    </div>`
        : ""}

    ${!isEmpty(nonEmptySkills)
        ? `
    <div class="sidebar-section" data-section="skills">
      <div class="sidebar-title" data-section="skills">Skills</div>
      ${nonEmptySkills
            .map((s, index) => `<div class="sidebar-item" data-section="skills" data-index="${index}">• ${s}</div>`)
            .join("")}
    </div>`
        : ""}

    ${!isEmpty(nonEmptyLanguages)
        ? `
    <div class="sidebar-section" data-section="languages">
      <div class="sidebar-title" data-section="languages">Languages</div>
      ${nonEmptyLanguages
            .map((l, index) => `<div class="sidebar-item" data-section="languages" data-index="${index}">${l.language || l}</div>`)
            .join("")}
    </div>`
        : ""}
  </div>

  <div class="main-content" data-section="personal">
    <h1 class="header-name" data-section="personal">${data.personal?.name || "Your Name"}</h1>

    ${data.summary
        ? `
    <div class="main-section" data-section="summary">
      <div class="main-section-title" data-section="summary">Profile</div>
      <div class="summary-text" data-section="summary">${data.summary}</div>
    </div>`
        : ""}

    ${sortedExperience.length > 0
        ? `
    <div class="main-section" data-section="experience">
      <div class="main-section-title" data-section="experience">Experience</div>
      ${sortedExperience
            .map((exp, index) => `
        <div class="experience-item" data-section="experience" data-index="${index}">
          <div class="exp-header" data-section="experience" data-field="title" data-index="${index}">
            <span>${exp.title}</span>
            <span>${exp.startDate} - ${exp.endDate || "Present"}</span>
          </div>
          <div class="exp-sub" data-section="experience" data-field="company" data-index="${index}">${exp.company}${exp.location ? " | " + exp.location : ""}</div>
          <div class="exp-desc" data-section="experience" data-field="description" data-index="${index}">${exp.description || ""}</div>
        </div>
      `)
            .join("")}
    </div>`
        : ""}

    ${nonEmptyEducation.length > 0
        ? `
    <div class="main-section" data-section="education">
      <div class="main-section-title" data-section="education">Education</div>
      ${nonEmptyEducation
            .map((edu, index) => `
        <div class="experience-item" data-section="education" data-index="${index}">
          <div class="exp-header" data-section="education" data-index="${index}">
            <span>${edu.degree}</span>
            <span>${edu.graduationDate || ""}</span>
          </div>
          <div class="exp-sub" data-section="education" data-index="${index}">${edu.school}</div>
        </div>
      `)
            .join("")}
    </div>`
        : ""}

    ${nonEmptyCertifications.length > 0
        ? `
    <div class="main-section" data-section="certifications">
      <div class="main-section-title" data-section="certifications">Certifications</div>
      ${nonEmptyCertifications
            .map((cert, index) => `
        <div style="margin-bottom: 5px;" data-section="certifications" data-index="${index}">
          <strong data-section="certifications" data-field="name" data-index="${index}">${cert.name}</strong> - <span data-section="certifications" data-field="issuer" data-index="${index}">${cert.issuer}</span> (<span data-section="certifications" data-field="date" data-index="${index}">${cert.date}</span>)
        </div>
      `)
            .join("")}
    </div>`
        : ""}
  </div>
</div>
</body>
</html>`;
}
