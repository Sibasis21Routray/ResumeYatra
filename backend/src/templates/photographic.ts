export function buildPhotographicTemplate(data: any, theme?: any): string {
  const defaultTheme = {
    primary: "#0ea5e9",
    secondary: "#64748b",
    background: "#ffffff",
    headingFont: "Inter",
    bodyFont: "Inter",
  };

  const currentTheme = theme || defaultTheme;
  const typography = theme?.typography || {
    fontSize: "medium",
    alignment: "left",
    fontWeight: "normal",
  };

  // Font size and family from data (user settings)
  const userFontSize = data.formatting?.bodyFontSize || data.fontSize || 14; // Default 14px
  const userFontFamily =
    data.formatting?.fontFamily || data.fontFamily || "Inter, sans-serif";

  // Calculate responsive font sizes based on user font size
  const baseFontSize = userFontSize;
  const headingFontSize = Math.round(userFontSize * 2.25); // 2.25x base size
  const subheadingFontSize = Math.round(userFontSize * 1.125); // 1.125x base size

  const fontSizeMap = {
    small: { base: "11px", heading: "30px", subheading: "14px" },
    medium: { base: "14px", heading: "36px", subheading: "15px" },
    large: { base: "16px", heading: "42px", subheading: "17px" },
  };

  const alignmentMap = {
    left: "left",
    center: "center",
    justify: "justify",
  };

  const fontWeightMap = {
    normal: "400",
    bold: "700",
  };

  const currentFontSize =
    fontSizeMap[typography.fontSize as keyof typeof fontSizeMap] ||
    fontSizeMap.medium;
  const currentAlignment =
    alignmentMap[typography.alignment as keyof typeof alignmentMap] || "left";
  const currentFontWeight =
    fontWeightMap[typography.fontWeight as keyof typeof fontWeightMap] || "400";

  // Helper function to check if an array has meaningful content
  const hasContent = (arr: any): boolean => {
    if (!arr || !Array.isArray(arr)) return false;
    if (arr.length === 0) return false;
    // Check if any item has non-empty content
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

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Resume</title>

<!-- Google Fonts disabled for PDF compatibility -->

<style>
  * {
    margin: 0; padding: 0; box-sizing: border-box;
  }

  :root {
    --primary-color: ${currentTheme.primary};
    --secondary-color: ${currentTheme.secondary};
    --background-color: ${currentTheme.background};
    --heading-font: ${currentTheme.headingFont};
    --body-font: ${currentTheme.bodyFont};
  }


  body {
    font-family: ${userFontFamily};
    background: #f3f6fa;
    color: #1e293b;
    line-height: 1.65;
    font-size: ${baseFontSize}px;
  }

  .container {
    max-width: 880px;
    margin: 40px auto;
    padding: 48px;
    background: var(--background-color);
    border-radius: 14px;
    box-shadow: 0 6px 32px rgba(0, 0, 0, 0.07);
  }

  /* --- HEADER SECTION --- */
  .header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 40px;
    padding-bottom: 30px;
    border-bottom: 2px solid #e5e7eb;
    position: relative;
  }

  .header-content {
    flex: 1;
    padding-right: 30px;
  }

  .name {
    font-size: ${Math.round(baseFontSize * 3)}px;
    font-weight: 700;
    color: var(--primary-color);
    margin-bottom: 8px;
    letter-spacing: 0.5px;
    text-transform: uppercase;
  }


  .contact-info {
    font-size: 14px;
    color: var(--secondary-color);
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .contact-row {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
    align-items: center;
  }

  .contact-item {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  /* --- PROFILE PHOTO SECTION --- */
  .profile-photo-container {
    position: relative;
    width: 160px;
    height: 160px;
    flex-shrink: 0;
  }

  .profile-photo {
    width: 100%;
    height: 100%;
    border-radius: 8px;
    object-fit: cover;
    border: 3px solid var(--primary-color);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    background-color: #f8fafc;
  }

  .photo-placeholder {
    width: 100%;
    height: 100%;
    border-radius: 50px;
    background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
    border: 3px solid var(--primary-color);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #64748b;
    font-size: 14px;
    text-align: center;
    padding: 10px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  /* --- MAIN CONTENT LAYOUT --- */
  .main-content {
    display: flex;
    gap: 40px;
  }

  .left-column {
    flex: 1;
  }

  .right-column {
    flex: 2;
  }

  /* --- SECTION STYLING --- */
  .section {
    margin-bottom: 32px;
  }

  .section-title {
    font-size: 18px;
    font-weight: 700;
    color: var(--primary-color);
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-bottom: 15px;
    padding-bottom: 8px;
    border-bottom: 2px solid var(--primary-color);
  }

  /* --- SKILLS STYLING --- */
  .skills-list {
    list-style: none;
  }

  .skill-item {
    font-size: ${currentFontSize.base};
    color: #334155;
    margin-bottom: 10px;
    padding-left: 15px;
    position: relative;
  }

  .skill-item:before {
    content: "•";
    color: var(--primary-color);
    font-weight: bold;
    position: absolute;
    left: 0;
  }

  /* --- SUMMARY STYLING --- */
  .summary-text {
    font-size: ${currentFontSize.base};
    line-height: 1.7;
    color: #475569;
    text-align: ${currentAlignment};
    font-weight: ${currentFontWeight};
  }

  /* --- EDUCATION & EXPERIENCE --- */
  .entry {
    margin-bottom: 22px;
    padding-bottom: 18px;
    border-bottom: 1px solid #f1f5f9;
  }

  .entry:last-child {
    border-bottom: none;
    margin-bottom: 0;
  }

  .entry-title {
    font-size: 16px;
    font-weight: 600;
    color: var(--primary-color);
    margin-bottom: 6px;
  }

  .entry-subtitle {
    font-size: 14px;
    color: var(--secondary-color);
    font-style: italic;
    margin-bottom: 8px;
  }

  .entry-content {
    font-size: 14px;
    color: #334155;
    line-height: 1.6;
  }

  .entry-content ul {
    margin: 8px 0 8px 20px;
    padding: 0;
    list-style-type: disc;
  }

  .entry-content li {
    margin: 4px 0;
    padding: 0;
    color: #334155;
  }

  .entry-content b {
    font-weight: 700;
    color: #1e293b;
  }

  /* --- ENHANCED EDUCATION STYLES --- */
  .education-school {
    font-size: 14px;
    color: var(--secondary-color);
    font-weight: 500;
    margin-bottom: 4px;
  }

  .education-field {
    font-size: 13px;
    color: #475569;
    font-weight: 500;
    margin-bottom: 4px;
  }

  .education-location {
    font-size: 12px;
    color: var(--secondary-color);
    margin-bottom: 6px;
  }

  .education-date {
    font-size: 12px;
    color: var(--secondary-color);
    font-weight: 500;
  }

  .education-description {
    font-size: 14px;
    color: #334155;
    line-height: 1.6;
    margin-top: 10px;
    padding: 8px 0;
  }

  .education-achievements {
    margin-top: 12px;
    padding-top: 12px;
    border-top: 1px solid #e2e8f0;
  }

  .education-achievements h4 {
    font-size: 13px;
    font-weight: 600;
    color: var(--primary-color);
    margin-bottom: 8px;
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
    padding-left: 15px;
    margin-bottom: 6px;
    color: #334155;
    font-size: 14px;
  }

  .education-achievements li:before {
    content: "•";
    color: var(--primary-color);
    font-weight: bold;
    position: absolute;
    left: 0;
  }

  /* Mobile Responsive */
  @media (max-width: 768px) {
    .header {
      flex-direction: column;
      align-items: center;
      text-align: center;
    }
    
    .header-content {
      padding-right: 0;
      margin-bottom: 20px;
    }
    
    .profile-photo-container {
      width: 140px;
      height: 140px;
      order: -1;
      margin-bottom: 20px;
    }
    
    .main-content {
      flex-direction: column;
      gap: 30px;
    }
    
    .name {
      font-size: 36px;
    }
    
    .contact-info {
      align-items: center;
    }
    
    .container {
      padding: 30px 25px;
      margin: 20px auto;
    }
  }

  @media (max-width: 480px) {
    .name {
      font-size: 30px;
    }
    
    .profile-photo-container {
      width: 120px;
      height: 120px;
    }
  }
</style>
</head>

<body>
<div class="container">


  <div class="header" data-section="personal">
    <div class="header-content" data-section="personal">
      <div class="name">${
        data.personal?.name && data.personal?.name !== "undefined"
          ? data.personal.name
          : "DEBANJALI LENKA"
      }</div>
      ${
        data.personal?.role
          ? `<div style="font-size: 16px; color: #64748b; margin-bottom: 10px; font-weight: 600;">${data.personal.role}</div>`
          : ""
      }


      ${
        data.personal?.email ||
        data.personal?.phone ||
        data.personal?.alternatePhone ||
        data.personal?.location ||
        data.personal?.country ||
        data.personal?.pinCode ||
        data.personal?.linkedinUrl ||
        data.personal?.githubUrl ||
        data.personal?.portfolioUrl ||
        data.personal?.website ||
        data.personal?.twitterUrl ||
        data.personal?.facebookUrl ||
        data.personal?.instagramUrl ||
        data.personal?.behanceUrl ||
        data.personal?.dribbbleUrl ||
        data.personal?.stackoverflowUrl ||
        data.personal?.mediumUrl
          ? `
      <div class="contact-info">
        <!-- Address Line -->
        <div class="contact-row">
          ${
            data.personal?.location
              ? `<div class="contact-item">${data.personal.location}</div>`
              : ""
          }
          ${
            data.personal?.country
              ? `<div class="contact-item">${data.personal.country}</div>`
              : ""
          }
          ${
            data.personal?.pinCode
              ? `<div class="contact-item">${data.personal.pinCode}</div>`
              : ""
          }
          ${
            data.personal?.fullAddress
              ? `<div class="contact-item">${data.personal.fullAddress}</div>`
              : ""
          }
        </div>

        <!-- Contact Line -->
        <div class="contact-row">
          ${
            data.personal?.email
              ? `<div class="contact-item">${data.personal.email}</div>`
              : ""
          }
          ${
            data.personal?.phone
              ? `<div class="contact-item">${data.personal.phone}</div>`
              : ""
          }
          ${
            data.personal?.alternatePhone
              ? `<div class="contact-item">${data.personal.alternatePhone}</div>`
              : ""
          }
        </div>

        <!-- URLs Line -->
        <div class="contact-row">
          ${
            data.personal?.linkedinUrl
              ? `<div class="contact-item"><a href="${data.personal.linkedinUrl}" target="_blank" style="color: var(--primary-color); text-decoration: none;">LinkedIn</a></div>`
              : ""
          }
          ${
            data.personal?.githubUrl
              ? `<div class="contact-item"><a href="${data.personal.githubUrl}" target="_blank" style="color: var(--primary-color); text-decoration: none;">GitHub</a></div>`
              : ""
          }
          ${
            data.personal?.portfolioUrl
              ? `<div class="contact-item"><a href="${data.personal.portfolioUrl}" target="_blank" style="color: var(--primary-color); text-decoration: none;">Portfolio</a></div>`
              : ""
          }
          ${
            data.personal?.website
              ? `<div class="contact-item"><a href="${data.personal.website}" target="_blank" style="color: var(--primary-color); text-decoration: none;">Website</a></div>`
              : ""
          }
          ${
            data.personal?.twitterUrl
              ? `<div class="contact-item"><a href="${data.personal.twitterUrl}" target="_blank" style="color: var(--primary-color); text-decoration: none;">Twitter</a></div>`
              : ""
          }
          ${
            data.personal?.facebookUrl
              ? `<div class="contact-item"><a href="${data.personal.facebookUrl}" target="_blank" style="color: var(--primary-color); text-decoration: none;">Facebook</a></div>`
              : ""
          }
          ${
            data.personal?.instagramUrl
              ? `<div class="contact-item"><a href="${data.personal.instagramUrl}" target="_blank" style="color: var(--primary-color); text-decoration: none;">Instagram</a></div>`
              : ""
          }
          ${
            data.personal?.behanceUrl
              ? `<div class="contact-item"><a href="${data.personal.behanceUrl}" target="_blank" style="color: var(--primary-color); text-decoration: none;">Behance</a></div>`
              : ""
          }
          ${
            data.personal?.dribbbleUrl
              ? `<div class="contact-item"><a href="${data.personal.dribbbleUrl}" target="_blank" style="color: var(--primary-color); text-decoration: none;">Dribbble</a></div>`
              : ""
          }
          ${
            data.personal?.stackoverflowUrl
              ? `<div class="contact-item"><a href="${data.personal.stackoverflowUrl}" target="_blank" style="color: var(--primary-color); text-decoration: none;">Stack Overflow</a></div>`
              : ""
          }
          ${
            data.personal?.mediumUrl
              ? `<div class="contact-item"><a href="${data.personal.mediumUrl}" target="_blank" style="color: var(--primary-color); text-decoration: none;">Medium</a></div>`
              : ""
          }
        </div>

        ${
          data.personal?.personalInfoDisplay === "inline"
            ? `
        <!-- Personal Details Line - Inline Mode -->
        <div class="contact-row">
          ${
            data.personal?.fathersName
              ? `<div class="contact-item">Father's Name: ${data.personal.fathersName}</div>`
              : ""
          }
          ${
            data.personal?.dob
              ? `<div class="contact-item">DOB: ${data.personal.dob}</div>`
              : ""
          }
          ${
            data.personal?.gender
              ? `<div class="contact-item">Gender: ${data.personal.gender}</div>`
              : ""
          }
          ${
            data.personal?.maritalStatus
              ? `<div class="contact-item">Marital Status: ${data.personal.maritalStatus}</div>`
              : ""
          }
          ${
            data.personal?.nationality
              ? `<div class="contact-item">Nationality: ${data.personal.nationality}</div>`
              : ""
          }
        </div>
        `
            : ""
        }
      </div>
      `
          : ""
      }
    </div>
    
    <div class="profile-photo-container">
      ${
        data.personal?.image
          ? `<img src="${data.personal.image}" alt="${
              data.personal?.name && data.personal?.name !== "undefined"
                ? data.personal.name
                : "Profile Photo"
            }" class="profile-photo" />`
          : `<div class="photo-placeholder">Profile Photo</div>`
      }
    </div>
  </div>

  <div class="main-content">
    <!-- Left Column for Skills -->
    <div class="left-column">

      ${
        data.sectionVisibility?.skills !== false &&
        data.skills &&
        (Array.isArray(data.skills)
          ? data.skills.length > 0
          : (data.skills || "").trim().length > 0)
          ? `
      <div class="section" data-section="skills">
        <div class="section-title">Skills</div>
        <ul class="skills-list" data-section="skills">
          ${(Array.isArray(data.skills) ? data.skills : data.skills.split(","))
            .filter((s: any) => s && (typeof s === "string" ? s.trim() : s))
            .map(
              (s: any) =>
                `<li class="skill-item">${
                  typeof s === "string" ? s.trim() : s
                }</li>`
            )
            .join("")}
        </ul>
      </div>`
          : ""
      }
      

      ${
        data.education?.length
          ? `
      <div class="section" data-section="education">
        <div class="section-title">Education</div>
        ${data.education
          .map(
            (edu: any, index: number) => `
          <div class="entry" data-index="${index}">
            <div class="entry-title">
              ${edu.degree || ""}${
              edu.qualification ? ` (${edu.qualification})` : ""
            }
            </div>
            ${
              edu.school
                ? `<div class="education-school">${edu.school}</div>`
                : ""
            }
            ${
              edu.field ? `<div class="education-field">${edu.field}</div>` : ""
            }
            ${
              edu.location
                ? `<div class="education-location">${edu.location}</div>`
                : ""
            }
            ${
              edu.graduationDate
                ? `<div class="education-date">${edu.graduationDate}</div>`
                : ""
            }
            
            ${
              edu.description
                ? `
              <div class="education-description">
                ${
                  edu.description.includes("<ul>") ||
                  edu.description.includes("<li>")
                    ? edu.description
                    : `<p>${edu.description}</p>`
                }
              </div>
            `
                : ""
            }
            
            ${
              edu.achievements && edu.achievements.length > 0
                ? `
              <div class="education-achievements">
                <h4>Achievements & Highlights</h4>
                <ul>
                  ${edu.achievements
                    .filter((achievement: string) => achievement.trim())
                    .map((achievement: string) => `<li>${achievement}</li>`)
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
      </div>`
          : ""
      }


      ${
        data.sectionVisibility?.languages !== false &&
        data.languages &&
        data.languages.length > 0
          ? `
      <div class="section" data-section="languages">
        <div class="section-title">Languages</div>
        <ul class="skills-list" data-section="languages">
          ${(data.languages || [])
            .map(
              (lang: any) =>
                `<li class="skill-item">${lang.language || lang}${
                  lang.level ? ` (${lang.level})` : ""
                }</li>`
            )
            .join("")}
        </ul>
      </div>`
          : ""
      }


      ${
        data.sectionVisibility?.hobbies !== false &&
        data.hobbies &&
        data.hobbies.length > 0
          ? `
      <div class="section" data-section="hobbies">
        <div class="section-title">Hobbies & Interests</div>
        <div style="display: flex; flex-wrap: wrap; gap: 10px; margin-top: 15px;">
          ${(data.hobbies || [])
            .map(
              (hobby: any, index: number) => `
            <div style="background: #f1f5f9; color: #475569; padding: 6px 12px; border-radius: 4px; font-size: 12px; font-weight: 500;" data-section="hobbies" data-index="${index}">${hobby}</div>
          `
            )
            .join("")}
        </div>
      </div>`
          : ""
      }

      ${
        data.sectionVisibility?.socialLinks !== false &&
        data.socialLinks &&
        data.socialLinks.length > 0
          ? `<div class="section" data-section="socialLinks">
        <div class="section-title">Social Links</div>
        <div style="display: flex; flex-wrap: wrap; gap: 15px; margin-top: 15px;">
          ${data.socialLinks
            .map(
              (link: any, index: number) => `
            <a href="${
              link.url
            }" target="_blank" style="color: var(--primary-color); text-decoration: none; font-weight: 500; font-size: ${baseFontSize}px;" data-section="socialLinks" data-index="${index}">${
                link.urlText ||
                link.url.replace("https://", "").replace("http://", "")
              }</a>
          `
            )
            .join("")}
        </div>
      </div>`
          : ""
      }
    </div>

    <!-- Right Column for Summary and Experience -->
    <div class="right-column">

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
        <div class="section-title">Personal Details</div>
        <div class="entry-content">
          <ul>
            ${
              data.personal?.fathersName
                ? `<li><strong>Father's Name:</strong> ${data.personal.fathersName}</li>`
                : ""
            }
            ${
              data.personal?.dob
                ? `<li><strong>Date of Birth:</strong> ${data.personal.dob}</li>`
                : ""
            }
            ${
              data.personal?.gender
                ? `<li><strong>Gender:</strong> ${data.personal.gender}</li>`
                : ""
            }
            ${
              data.personal?.maritalStatus
                ? `<li><strong>Marital Status:</strong> ${data.personal.maritalStatus}</li>`
                : ""
            }
            ${
              data.personal?.nationality
                ? `<li><strong>Nationality:</strong> ${data.personal.nationality}</li>`
                : ""
            }
            ${
              data.personal?.passportNo
                ? `<li><strong>Passport No:</strong> ${data.personal.passportNo}</li>`
                : ""
            }
          </ul>
        </div>
      </div>
      `
          : ""
      }

      ${
        data.sectionVisibility?.summary !== false && data.summary
          ? `

      <div class="section" data-section="summary">
        <div class="section-title">Professional Summary</div>
        <p class="summary-text" data-section="summary">${data.summary}</p>
      </div>`
          : ""
      }

      ${
        typeof data.careerObjective === "string" &&
        data.careerObjective.trim().length > 0
          ? `
      <div class="section" data-section="careerObjective">
        <div class="section-title">Career Objective</div>
        <p class="summary-text" data-section="careerObjective">${data.careerObjective}</p>
      </div>`
          : ""
      }


      ${
        data.experience?.length
          ? `
      <div class="section" data-section="experience">
        <div class="section-title">Work Experience</div>
        ${data.experience
          .map(
            (exp: any, index: number) => `
          <div class="entry" data-index="${index}">
            <div class="entry-title">${exp.title}</div>
            <div class="entry-subtitle">${exp.company}${
              exp.location ? `, ${exp.location}` : ""
            } • ${exp.startDate} - ${exp.endDate || "Present"}</div>
            <div class="entry-content">${exp.description}</div>
          </div>
        `
          )
          .join("")}
      </div>`
          : ""
      }


      ${
        data.internships && data.internships.length > 0
          ? `
      <div class="section" data-section="internships">
        <div class="section-title">Internships</div>
        ${data.internships
          .map(
            (item: any, index: number) => `
          <div class="entry" data-index="${index}">
            <div class="entry-title">${item.title || ""}</div>
            <div class="entry-subtitle">${item.company || ""}${
              item.location ? `, ${item.location}` : ""
            } • ${item.startDate || ""} - ${item.endDate || ""}</div>
            <div class="entry-content">${item.description || ""}</div>
          </div>
        `
          )
          .join("")}
      </div>`
          : ""
      }


      ${
        data.projects?.length
          ? `
      <div class="section" data-section="projects">
        <div class="section-title">Projects</div>
        ${data.projects
          .map((project: any, index: number) => {
            const projectName =
              typeof project === "string"
                ? project.split(" – ")[0] || project
                : project.name || project.title || "";
            const projectDesc =
              typeof project === "string" ? project : project.description || "";
            const technologies =
              typeof project === "string" ? "" : project.technologies || "";
            const startDate =
              typeof project === "string" ? "" : project.startDate || "";
            const endDate =
              typeof project === "string" ? "" : project.endDate || "";
            const url = typeof project === "string" ? "" : project.url || "";
            const urlText =
              typeof project === "string"
                ? ""
                : project.urlText || "View Project";
            return `
          <div class="entry" data-index="${index}">
            <div class="entry-title">${projectName}</div>
            ${
              startDate || endDate
                ? `<div class="entry-subtitle">${startDate} ${
                    startDate && endDate ? "- " : ""
                  }${endDate}</div>`
                : ""
            }
            ${
              technologies
                ? `<div class="entry-content" style="font-style: italic; margin-bottom: 5px;">${technologies}</div>`
                : ""
            }
            <div class="entry-content">${projectDesc}</div>
            ${
              url
                ? `<div class="entry-content" style="margin-top: 8px;"><a href="${url}" target="_blank" style="color: var(--primary-color); text-decoration: underline;">${urlText}</a></div>`
                : ""
            }
          </div>`;
          })
          .join("")}
      </div>`
          : ""
      }


      ${
        data.sectionVisibility?.certifications !== false &&
        data.certifications &&
        data.certifications.length > 0
          ? `
      <div class="section" data-section="certifications">
        <div class="section-title">Certifications</div>
        ${data.certifications
          .map(
            (cert: any, index: number) => `
          <div class="entry" data-index="${index}">
            <div class="entry-title">${cert.name || ""}</div>
            <div class="entry-subtitle">${cert.issuer || ""} • ${
              cert.date || ""
            }</div>
            ${
              cert.url
                ? `<div class="entry-content" style="margin-top: 8px;"><a href="${cert.url}" target="_blank" style="color: var(--primary-color); text-decoration: underline;">View Certificate</a></div>`
                : ""
            }
          </div>
        `
          )
          .join("")}
      </div>`
          : ""
      }


      ${
        data.academicProjects && data.academicProjects.length > 0
          ? `
      <div class="section" data-section="academicProjects">
        <div class="section-title">Academic Projects</div>
        ${data.academicProjects
          .map(
            (item: any, index: number) => `
          <div class="entry" data-index="${index}">
            <div class="entry-title">${item.name || item.title || ""}</div>
            <div class="entry-subtitle">${item.duration || ""}${
              item.institution ? ` • ${item.institution}` : ""
            }</div>
            <div class="entry-content">${item.description || ""}</div>
            ${
              item.technologies
                ? `<div class="entry-content" style="margin-top: 5px;"><strong>Technologies:</strong> ${item.technologies}</div>`
                : ""
            }
            ${
              item.url
                ? `<div class="entry-content" style="margin-top: 5px;"><a href="${item.url}" target="_blank" style="color: var(--primary-color); text-decoration: underline;">View Project</a></div>`
                : ""
            }
          </div>
        `
          )
          .join("")}
      </div>`
          : ""
      }


      ${
        data.leadershipPositions && data.leadershipPositions.length > 0
          ? `
      <div class="section" data-section="leadershipPositions">
        <div class="section-title">Leadership & Positions</div>
        ${data.leadershipPositions
          .map(
            (item: any, index: number) => `
          <div class="entry" data-index="${index}">
            <div class="entry-title">${item.position || item.title || ""}</div>
            <div class="entry-subtitle">${item.organization || ""} • ${
              item.startDate || ""
            } - ${item.endDate || ""}</div>
            <div class="entry-content">${item.description || ""}</div>
          </div>
        `
          )
          .join("")}
      </div>`
          : ""
      }


      ${
        data.trainingPrograms && data.trainingPrograms.length > 0
          ? `
      <div class="section" data-section="trainingPrograms">
        <div class="section-title">Training Programs</div>
        ${data.trainingPrograms
          .map(
            (item: any, index: number) => `
          <div class="entry" data-index="${index}">
            <div class="entry-title">${item.name || ""}</div>
            <div class="entry-subtitle">${item.provider || item.organization || ""} • ${
              item.completionDate || ""
            }${item.duration ? ` • ${item.duration}` : ""}</div>
            <div class="entry-content">${item.description || ""}</div>
          </div>
        `
          )
          .join("")}
      </div>`
          : ""
      }


      ${
        data.scholarships && data.scholarships.length > 0
          ? `
      <div class="section" data-section="scholarships">
        <div class="section-title">Scholarships</div>
        ${data.scholarships
          .map(
            (item: any, index: number) => `
          <div class="entry" data-index="${index}">
            <div class="entry-title">${item.name || ""}</div>
            <div class="entry-subtitle">${item.provider || item.organization || ""} • ${
              item.year || ""
            }${item.amount ? ` • ${item.amount}` : ""}</div>
            <div class="entry-content">${item.description || ""}</div>
          </div>
        `
          )
          .join("")}
      </div>`
          : ""
      }


      ${
        data.coCurricular && data.coCurricular.length > 0
          ? `
      <div class="section" data-section="coCurricular">
        <div class="section-title">Co-curricular Activities</div>
        ${data.coCurricular
          .map(
            (item: any, index: number) => `
          <div class="entry" data-index="${index}">
            <div class="entry-title">${item.activity || ""}</div>
            <div class="entry-subtitle">${item.organization || ""}${
              item.role ? ` • ${item.role}` : ""
            } • ${
              item.year ||
              (item.startDate ? `${item.startDate} - ${item.endDate || ""}` : "")
            }</div>
            <div class="entry-content">${item.description || ""}</div>
          </div>
        `
          )
          .join("")}
      </div>`
          : ""
      }


      ${
        data.extracurricular && data.extracurricular.length > 0
          ? `
      <div class="section" data-section="extracurricular">
        <div class="section-title">Extracurricular Activities</div>
        ${data.extracurricular
          .map(
            (item: any, index: number) => `
          <div class="entry" data-index="${index}">
            <div class="entry-title">${item.activity || ""}</div>
            <div class="entry-subtitle">${item.organization || ""}${
              item.role ? ` • ${item.role}` : ""
            } • ${
              item.year ||
              (item.startDate ? `${item.startDate} - ${item.endDate || ""}` : "")
            }</div>
            <div class="entry-content">${item.description || ""}</div>
          </div>
        `
          )
          .join("")}
      </div>`
          : ""
      }


      ${
        data.keyAchievements && data.keyAchievements.length > 0
          ? `
      <div class="section" data-section="keyAchievements">
        <div class="section-title">Key Achievements</div>
        <div class="entry-content">
          <ul>
            ${data.keyAchievements
              .map((achievement: string) => `<li>${achievement}</li>`)
              .join("")}
          </ul>
        </div>
      </div>`
          : ""
      }



      ${
        hasContent(data.responsibilities)
          ? `
      <div class="section" data-section="responsibilities">
        <div class="section-title">Key Responsibilities</div>
        <div class="entry-content">
          <ul>
            ${getNonEmptyArray(
              Array.isArray(data.responsibilities)
                ? data.responsibilities
                : (data.responsibilities || "").split("\n")
            )
              .map(
                (line: string, index: number) =>
                  `<li data-section="responsibilities" data-index="${index}">${line.trim()}</li>`
              )
              .join("")}
          </ul>
        </div>
      </div>`
          : ""
      }


      ${
        hasContent(data.tools)
          ? `
      <div class="section" data-section="tools">
        <div class="section-title">Tools & Technologies</div>
        <div class="entry-content">
          <ul>
            ${getNonEmptyArray(
              Array.isArray(data.tools)
                ? data.tools
                : (data.tools || "").split("\n")
            )
              .map(
                (line: string, index: number) =>
                  `<li data-section="tools" data-index="${index}">${line.trim()}</li>`
              )
              .join("")}
          </ul>
        </div>
      </div>`
          : ""
      }


      ${
        data.customSections && data.customSections.length > 0
          ? data.customSections
              .filter((section: any) => section.isVisible)
              .map((section: any) => {
                const heading = section.heading || "Custom Section";
                if (heading === "Social Links") {
                  return `
        <div class="section" data-section="customSections">
          <div class="section-title">${heading}</div>
          <div style="display: flex; flex-wrap: wrap; gap: 15px; margin-top: 15px;">
            ${
              section.entries && section.entries.length > 0
                ? section.entries
                    .filter((entry: any) => entry.isVisible)
                    .map(
                      (entry: any, entryIndex: number) => `
              <div style="display: flex; align-items: center; gap: 8px;" data-section="socialLinks" data-index="${entryIndex}">
                <span style="font-weight: 600; color: var(--primary-color); font-size: ${baseFontSize}px;">${
                        entry.title || "Link"
                      }:</span>
                <a href="${
                  entry.organization || entry.description || "#"
                }" target="_blank" style="color: var(--primary-color); text-decoration: none; font-weight: 500; font-size: ${baseFontSize}px;">${(
                        entry.organization ||
                        entry.description ||
                        ""
                      )
                        .replace("https://", "")
                        .replace("http://", "")}</a>
              </div>
            `
                    )
                    .join("")
                : '<div style="color: #64748b; font-style: italic;">No social links added</div>'
            }
          </div>
        </div>
      `;
                } else if (heading === "Languages") {
                  return `
        <div class="section" data-section="customSections">
          <div class="section-title">${heading}</div>
          <div>
            ${
              section.entries && section.entries.length > 0
                ? section.entries
                    .filter((entry: any) => entry.isVisible)
                    .map(
                      (entry: any, entryIndex: number) => `
              <div style="margin-bottom: 8px; font-size: 13px; color: #475569;" data-section="customSections" data-index="${entryIndex}">
                <span style="font-weight: 600;">${
                  entry.title || entry.organization || "Language"
                }</span>
                ${
                  entry.description
                    ? `<span style="color: #64748b; margin-left: 8px;">(${entry.description})</span>`
                    : ""
                }
              </div>
            `
                    )
                    .join("")
                : '<div style="color: #64748b; font-style: italic;">No languages added</div>'
            }
          </div>
        </div>
      `;
                } else if (heading === "Hobbies & Interests") {
                  return `
        <div class="section" data-section="customSections">
          <div class="section-title">${heading}</div>
          <div style="display: flex; flex-wrap: wrap; gap: 10px; margin-top: 15px;">
            ${
              section.entries && section.entries.length > 0
                ? section.entries
                    .filter((entry: any) => entry.isVisible)
                    .map(
                      (entry: any, entryIndex: number) => `
              <div style="background: #f1f5f9; color: #475569; padding: 6px 12px; border-radius: 4px; font-size: 12px; font-weight: 500;" data-section="customSections" data-index="${entryIndex}">${
                        entry.title ||
                        entry.organization ||
                        entry.description ||
                        "Hobby"
                      }</div>
            `
                    )
                    .join("")
                : '<div style="color: #64748b; font-style: italic;">No hobbies added</div>'
            }
          </div>
        </div>
      `;
                } else if (heading === "Key Achievements") {
                  return `
        <div class="section" data-section="customSections">
          <div class="section-title">${heading}</div>
          <div class="entry-content">
            <ul>
              ${
                section.entries && section.entries.length > 0
                  ? section.entries
                      .filter((entry: any) => entry.isVisible)
                      .map(
                        (entry: any, entryIndex: number) =>
                          `<li data-section="customSections" data-index="${entryIndex}">${
                            entry.title ||
                            entry.organization ||
                            entry.description ||
                            "Achievement"
                          }</li>`
                      )
                      .join("")
                  : '<li style="color: #64748b; font-style: italic;">No achievements added</li>'
              }
            </ul>
          </div>
        </div>
      `;
                } else if (heading === "Responsibilities") {
                  return `
        <div class="section" data-section="customSections">
          <div class="section-title">${heading}</div>
          <div class="entry-content">
            <ul>
              ${
                section.entries && section.entries.length > 0
                  ? section.entries
                      .filter((entry: any) => entry.isVisible)
                      .map(
                        (entry: any, entryIndex: number) =>
                          `<li data-section="customSections" data-index="${entryIndex}">${
                            entry.title ||
                            entry.organization ||
                            entry.description ||
                            "Responsibility"
                          }</li>`
                      )
                      .join("")
                  : '<li style="color: #64748b; font-style: italic;">No responsibilities added</li>'
              }
            </ul>
          </div>
        </div>
      `;
                } else if (heading === "Tools & Technologies") {
                  return `
        <div class="section" data-section="customSections">
          <div class="section-title">${heading}</div>
          <div class="entry-content">
            <ul>
              ${
                section.entries && section.entries.length > 0
                  ? section.entries
                      .filter((entry: any) => entry.isVisible)
                      .map(
                        (entry: any, entryIndex: number) =>
                          `<li data-section="customSections" data-index="${entryIndex}">${
                            entry.title ||
                            entry.organization ||
                            entry.description ||
                            "Tool"
                          }</li>`
                      )
                      .join("")
                  : '<li style="color: #64748b; font-style: italic;">No tools added</li>'
              }
            </ul>
          </div>
        </div>
      `;
                } else {
                  // Default custom section rendering
                  return `
        <div class="section" data-section="customSections">
          <div class="section-title">${heading}</div>
          ${
            section.entries && section.entries.length > 0
              ? section.entries
                  .filter((entry: any) => entry.isVisible)
                  .map(
                    (entry: any, entryIndex: number) => `
            <div class="entry" data-index="${entryIndex}">
              <div class="entry-title">${entry.title || ""}${
                      entry.title && entry.organization ? " at " : ""
                    }${entry.organization || ""}</div>
              ${
                entry.date
                  ? `<div class="entry-subtitle">${entry.date}</div>`
                  : ""
              }
              ${
                entry.description
                  ? `<div class="entry-content">${entry.description}</div>`
                  : ""
              }
            </div>
          `
                  )
                  .join("")
              : '<div style="color: #64748b; font-style: italic;">No entries in this section</div>'
          }
        </div>
      `;
                }
              })
              .join("")
          : ""
      }
    </div>
  </div>

</div>
</body>
</html>`;
}
