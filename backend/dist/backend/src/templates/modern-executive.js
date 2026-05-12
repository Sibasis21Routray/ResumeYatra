"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildModernExecutiveTemplate = buildModernExecutiveTemplate;
function buildModernExecutiveTemplate(data, theme) {
    const defaultTheme = {
        primary: "#7aa333",
        secondary: "#ffffff",
        background: "#ffffff",
        headingFont: "Helvetica, sans-serif",
        bodyFont: "Inter, sans-serif",
    };
    const currentTheme = { ...defaultTheme, ...theme };
    const green = currentTheme.primary;
    const headingFontSize = data.formatting?.headingFontSize || 18;
    const bodyFontSize = data.formatting?.bodyFontSize || 14;
    const fontFamily = data.formatting?.fontFamily || currentTheme.bodyFont;
    return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<title>${data.personal?.name || "Resume"}</title>

<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
<link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" rel="stylesheet">

<style>
* { box-sizing: border-box; margin: 0; padding: 0; }

body {
  background: #e5e7eb;
  font-family: ${fontFamily};
  padding: 40px 0;
}

.resume {
  width: 210mm;
  min-height: 297mm;
  background: #fff;
  margin: auto;
  display: flex;
  position: relative;
  box-shadow: 0 10px 25px rgba(0,0,0,.12);
}

/* LEFT GREEN BAR */
.left-bar {
  width: 150px;
  background: ${green};
}

/* CONTENT */
.content {
  flex: 1;
  padding: 30px 38px;
}

/* HEADER */
.header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;
}

.name {
  font-size:40px;
  font-weight: 700;
  color: ${green};
}

.role {
  font-size: ${bodyFontSize}px;
  font-weight: 500;
  color: #374151;
  margin-top: 2px;
}

.photo {
  width: 88px;
  height: 88px;
  border: 1px solid #d1d5db;
  object-fit: cover;
}

/* CONTACT */
.contact {
  font-size: ${bodyFontSize}px;
  margin-bottom: 18px;
}

.contact div {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
}

.contact i {
  width: 20px;
  height: 20px;
  background: ${green};
  color: #fff;
  font-size: 11px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* SECTION */
.section {
  margin-bottom: 16px;
}

.section-title {
  font-size: ${headingFontSize}px;
  font-weight: 700;
  color: ${green};
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

/* TIMELINE */
.timeline {
  position: relative;
  padding-left: 26px;
}

.timeline::before {
  content: '';
  position: absolute;
  left: 10px;
  top: 0;
  bottom: 0;
  width: 2px;
  background: ${green};
  opacity: .4;
}

/* TIMELINE ITEM */
.timeline-item {
  position: relative;
  padding-left: 14px;
  margin-bottom: 12px;
}

.timeline-item::before {
  content: '';
  position: absolute;
  left: -19px;
  top: 6px;
  width: 10px;
  height: 10px;
  background: ${green};
  border-radius: 50%;
}

/* TEXT */
.text {
  font-size: ${bodyFontSize}px;
  line-height: 1.6;
}

/* LIST */
li {
  font-size: ${bodyFontSize}px;
  margin-bottom: 6px;
}

/* EXPERIENCE */
.exp-title {
  font-weight: 600;
  font-size: ${bodyFontSize + 0.5}px;
}

.exp-meta {
  font-size: ${bodyFontSize - 1}px;
  color: #374151;
  margin-bottom: 4px;
}

/* STAMP */
.recommended {
  position: absolute;
  bottom: 28px;
  right: 40px;
  font-size: 13px;
  font-weight: 800;
  color: #b91c1c;
  border: 2px solid #b91c1c;
  padding: 4px 14px;
  transform: rotate(-6deg);
}

/* PRINT */
@media print {
  body { background: #fff; padding: 0; }
  .resume { box-shadow: none; }
}
</style>
</head>

<body>
<div class="resume">
  <div class="left-bar"></div>

  <div class="content">
    <div class="header">
      <div>
        <div class="name">${data.personal?.name || "Your Name"}</div>
        <div class="role">${data.personal?.role || ""}</div>
      </div>
      ${data.personal?.image
        ? `<img class="photo" src="${data.personal.image}" />`
        : `<div class="photo"></div>`}
    </div>

    <div class="contact" data-section="personal">
      ${data.personal?.location ||
        data.personal?.country ||
        data.personal?.pinCode ||
        data.personal?.fullAddress
        ? `<div><i class="fa-solid fa-location-dot"></i>${[
            data.personal?.location,
            data.personal?.country,
            data.personal?.pinCode,
            data.personal?.fullAddress,
        ]
            .filter(Boolean)
            .join(", ")}</div>`
        : ""}
      ${data.personal?.phone
        ? `<div><i class="fa-solid fa-phone"></i>${data.personal.phone}</div>`
        : ""}
      ${data.personal?.email
        ? `<div><i class="fa-solid fa-envelope"></i>${data.personal.email}</div>`
        : ""}
      ${data.personal?.alternatePhone
        ? `<div><i class="fa-solid fa-phone"></i>${data.personal.alternatePhone}</div>`
        : ""}
      ${data.personal?.personalInfoDisplay === "inline" &&
        data.personal?.fathersName
        ? `<div><i class="fa-solid fa-user"></i>Father's Name: ${data.personal.fathersName}</div>`
        : ""}
      ${data.personal?.personalInfoDisplay === "inline" && data.personal?.dob
        ? `<div><i class="fa-solid fa-calendar"></i>Date of Birth: ${data.personal.dob}</div>`
        : ""}
      ${data.personal?.personalInfoDisplay === "inline" && data.personal?.gender
        ? `<div><i class="fa-solid fa-venus-mars"></i>Gender: ${data.personal.gender}</div>`
        : ""}
      ${data.personal?.personalInfoDisplay === "inline" &&
        data.personal?.maritalStatus
        ? `<div><i class="fa-solid fa-ring"></i>Marital Status: ${data.personal.maritalStatus}</div>`
        : ""}
      ${data.personal?.personalInfoDisplay === "inline" &&
        data.personal?.nationality
        ? `<div><i class="fa-solid fa-globe"></i>Nationality: ${data.personal.nationality}</div>`
        : ""}
      ${data.personal?.linkedinUrl
        ? `<div><i class="fa-brands fa-linkedin"></i><a href="${data.personal.linkedinUrl}" target="_blank">LinkedIn</a></div>`
        : ""}
      ${data.personal?.githubUrl
        ? `<div><i class="fa-brands fa-github"></i><a href="${data.personal.githubUrl}" target="_blank">GitHub</a></div>`
        : ""}
      ${data.personal?.portfolioUrl
        ? `<div><i class="fa-solid fa-globe"></i><a href="${data.personal.portfolioUrl}" target="_blank">Portfolio</a></div>`
        : ""}
      ${data.personal?.website
        ? `<div><i class="fa-solid fa-link"></i><a href="${data.personal.website}" target="_blank">Website</a></div>`
        : ""}
    </div>

    ${data.personal?.personalInfoDisplay !== "inline" &&
        (data.personal?.fathersName ||
            data.personal?.dob ||
            data.personal?.gender ||
            data.personal?.maritalStatus ||
            data.personal?.nationality)
        ? `<div class="section" data-section="personal">
            <div class="section-title"><i class="fa-solid fa-id-card"></i>Personal Details</div>
            <div class="timeline">
              ${data.personal?.fathersName
            ? `<div class="timeline-item" data-section="personal"><b>Father's Name:</b> ${data.personal.fathersName}</div>`
            : ""}
              ${data.personal?.dob
            ? `<div class="timeline-item" data-section="personal"><b>Date of Birth:</b> ${data.personal.dob}</div>`
            : ""}
              ${data.personal?.gender
            ? `<div class="timeline-item" data-section="personal"><b>Gender:</b> ${data.personal.gender}</div>`
            : ""}
              ${data.personal?.maritalStatus
            ? `<div class="timeline-item" data-section="personal"><b>Marital Status:</b> ${data.personal.maritalStatus}</div>`
            : ""}
              ${data.personal?.nationality
            ? `<div class="timeline-item" data-section="personal"><b>Nationality:</b> ${data.personal.nationality}</div>`
            : ""}
            </div>
          </div>`
        : ""}

    ${data.summary
        ? `<div class="section" data-section="summary">
            <div class="section-title"><i class="fa-solid fa-user"></i>Profile</div>
            <div class="text">${data.summary}</div>
          </div>`
        : ""}

    ${data.skills
        ? `<div class="section" data-section="skills">
            <div class="section-title"><i class="fa-solid fa-list-check"></i>Skills</div>
            <div class="timeline">
              ${(Array.isArray(data.skills)
            ? data.skills
            : data.skills.split(","))
            .map((s, i) => `
                  <div class="timeline-item" data-section="skills" data-index="${i}">
                    ${s.trim()}
                  </div>`)
            .join("")}
            </div>
          </div>`
        : ""}

    ${data.experience?.length
        ? `<div class="section" data-section="experience">
            <div class="section-title"><i class="fa-solid fa-briefcase"></i>Work History</div>
            <div class="timeline">
              ${data.experience
            .map((exp, i) => `
                <div class="timeline-item" data-section="experience" data-index="${i}">
                  <div class="exp-title">${exp.title}</div>
                  <div class="exp-meta">${exp.company}${exp.domain ? ` | ${exp.domain}` : ""}${exp.location ? `, ${exp.location}` : ""} • ${exp.startDate} – ${exp.endDate || "Present"}</div>
                  <div class="text">${exp.description || ""}</div>
                  ${exp.achievements
            ? `<div class="text" style="margin-top: 8px;"><strong style="color: #333;">Key Achievements:</strong><br/>${exp.achievements}</div>`
            : ""}
                </div>
              `)
            .join("")}
            </div>
          </div>`
        : ""}

    ${data.education?.length
        ? `<div class="section" data-section="education">
            <div class="section-title"><i class="fa-solid fa-graduation-cap"></i>Education</div>
            <div class="timeline">
              ${data.education
            .map((edu, i) => `
                <div class="timeline-item" data-section="education" data-index="${i}">
                  <div class="exp-title">${edu.degree}${edu.field ? ` in ${edu.field}` : ""}</div>
                  <div class="exp-meta">${edu.school}${edu.cgpa ? ` • CGPA: ${edu.cgpa}` : ""} • ${edu.graduationDate}</div>
                  <div class="text">${edu.description || ""}</div>
                </div>
              `)
            .join("")}
            </div>
          </div>`
        : ""}

    ${data.languages && data.languages.length > 0
        ? `<div class="section" data-section="languages">
            <div class="section-title"><i class="fa-solid fa-language"></i>Languages</div>
            <div class="timeline">
              ${data.languages
            .map((lang, i) => `
                <div class="timeline-item" data-section="languages" data-index="${i}">
                  ${lang.language || lang}${lang.level ? ` (${lang.level})` : ""}${lang.capability ? ` - ${lang.capability}` : ""}
                </div>
              `)
            .join("")}
            </div>
          </div>`
        : ""}

    ${data.hobbies && data.hobbies.length > 0
        ? `<div class="section" data-section="hobbies">
            <div class="section-title"><i class="fa-solid fa-heart"></i>Hobbies & Interests</div>
            <div class="timeline">
              ${data.hobbies
            .map((hobby, i) => `
                <div class="timeline-item" data-section="hobbies" data-index="${i}">
                  ${hobby}
                </div>
              `)
            .join("")}
            </div>
          </div>`
        : ""}

    ${data.socialLinks && data.socialLinks.length > 0
        ? `<div class="section" data-section="socialLinks">
            <div class="section-title"><i class="fa-solid fa-share-nodes"></i>Social Links</div>
            <div class="timeline">
              ${data.socialLinks
            .map((link, i) => `
                <div class="timeline-item" data-section="socialLinks" data-index="${i}">
                  <a href="${link.url}" target="_blank">${link.urlText || link.url}</a>
                </div>
              `)
            .join("")}
            </div>
          </div>`
        : ""}

    ${data.projects && data.projects.length > 0
        ? `<div class="section" data-section="projects">
            <div class="section-title"><i class="fa-solid fa-project-diagram"></i>Projects</div>
            <div class="timeline">
              ${data.projects
            .map((project, i) => `
                <div class="timeline-item" data-section="projects" data-index="${i}">
                  <div class="exp-title">${project.name}${project.technologies ? ` | ${project.technologies}` : ""}</div>
                  <div class="exp-meta">${project.startDate} – ${project.endDate || "Present"}</div>
                  <div class="text">${project.description}</div>
                  ${project.url
            ? `<div><a href="${project.url}" target="_blank">${project.urlText || "View Project"}</a></div>`
            : ""}
                </div>
              `)
            .join("")}
            </div>
          </div>`
        : ""}

    ${data.certifications && data.certifications.length > 0
        ? `<div class="section" data-section="certifications">
            <div class="section-title"><i class="fa-solid fa-certificate"></i>Certifications</div>
            <div class="timeline">
              ${data.certifications
            .map((cert, i) => `
                <div class="timeline-item" data-section="certifications" data-index="${i}">
                  <div class="exp-title">${cert.name}</div>
                  <div class="exp-meta">${cert.issuer} • ${cert.date}</div>
                  ${cert.description
            ? `<div class="text">${cert.description}</div>`
            : ""}
                  ${cert.url
            ? `<div><a href="${cert.url}" target="_blank">View Certificate</a></div>`
            : ""}
                </div>
              `)
            .join("")}
            </div>
          </div>`
        : ""}

    ${data.keyAchievements && data.keyAchievements.length > 0
        ? `<div class="section" data-section="keyAchievements">
            <div class="section-title"><i class="fa-solid fa-trophy"></i>Key Achievements</div>
            <div class="timeline">
              ${data.keyAchievements
            .map((achievement, i) => `
                <div class="timeline-item" data-section="keyAchievements" data-index="${i}">
                  ${achievement}
                </div>
              `)
            .join("")}
            </div>
          </div>`
        : ""}

    ${data.awards && data.awards.length > 0
        ? `<div class="section" data-section="awards">
            <div class="section-title"><i class="fa-solid fa-award"></i>Awards</div>
            <div class="timeline">
              ${data.awards
            .map((award, i) => `
                <div class="timeline-item" data-section="awards" data-index="${i}">
                  <div class="exp-title">${award.title}</div>
                  <div class="exp-meta">${award.organization} • ${award.issueYear}</div>
                  ${award.description
            ? `<div class="text">${award.description}</div>`
            : ""}
                </div>
              `)
            .join("")}
            </div>
          </div>`
        : ""}

    ${(Array.isArray(data.responsibilities)
        ? data.responsibilities
        : (data.responsibilities || "").split("\n")).filter((line) => line.trim()).length > 0
        ? `<div class="section" data-section="responsibilities">
            <div class="section-title"><i class="fa-solid fa-tasks"></i>Key Responsibilities</div>
            <div class="timeline">
              ${(Array.isArray(data.responsibilities)
            ? data.responsibilities
            : (data.responsibilities || "").split("\n"))
            .filter((line) => line.trim())
            .map((line, i) => `
                <div class="timeline-item" data-section="responsibilities" data-index="${i}">
                  ${line.trim()}
                </div>
              `)
            .join("")}
            </div>
          </div>`
        : ""}

    ${data.tools &&
        (Array.isArray(data.tools)
            ? data.tools.length > 0
            : (data.tools || "").trim().length > 0)
        ? `<div class="section" data-section="tools">
            <div class="section-title"><i class="fa-solid fa-tools"></i>Tools & Technologies</div>
            <div class="timeline">
              ${Array.isArray(data.tools)
            ? data.tools
                .map((tool, i) => `
                <div class="timeline-item" data-section="tools" data-index="${i}">
                  ${tool}
                </div>
              `)
                .join("")
            : data.tools
                .split(",")
                .map((tool, i) => `
                <div class="timeline-item" data-section="tools" data-index="${i}">
                  ${tool.trim()}
                </div>
              `)
                .join("")}
            </div>
          </div>`
        : ""}

    ${data.references
        ? `<div class="section" data-section="references">
            <div class="section-title"><i class="fa-solid fa-address-book"></i>References</div>
            <div class="text">${data.references}</div>
          </div>`
        : ""}

    ${data.customSections && data.customSections.length > 0
        ? data.customSections
            .filter((section) => section.entries && section.entries.length > 0)
            .map((section, sectionIndex) => `
        <div class="section" data-section="customSections">
          <div class="section-title"><i class="fa-solid fa-star"></i>${section.heading || "Custom Section"}</div>
          <div class="timeline">
            ${section.entries
            .map((entry, entryIndex) => `
              <div class="timeline-item" data-section="customSections" data-index="${entryIndex}">
                <div class="exp-title">${entry.title}</div>
                <div class="exp-meta">${entry.organization} • ${entry.date}</div>
                <div class="text">${entry.description}</div>
              </div>
            `)
            .join("")}
          </div>
        </div>
      `)
            .join("")
        : ""}

  </div>
</div>
</body>
</html>`;
}
