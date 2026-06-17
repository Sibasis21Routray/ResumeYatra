export function buildFormalIndianCvTemplate(data: any, theme?: any): string {
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
    coreCompetencies = "",
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
    availabilityWorkAuth = {},
    socialProfiles = []
  } = data;

  const defaultTheme = {
    primary: '#0c4354',
    secondary: '#164653',
    background: '#ffffff'
  };

  const userFontFamily =
    data.formatting?.fontFamily ||
    data.fontFamily ||
    "'Inter', Arial, sans-serif";


  const currentTheme = { ...defaultTheme, ...(theme || {}) };

  const userFontSize = data.formatting?.bodyFontSize || data.fontSize || 11;
  const baseFontSize = userFontSize;
  const nameFontSize = Math.round(userFontSize * 2.3);
  const headingFontSize = Math.round(userFontSize * 1.3);
  const subHeadingFontSize = Math.round(userFontSize * 1.05);
  const smallFontSize = Math.round(userFontSize * 0.9);

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

  const hasObjectValues = (obj: any): boolean => {
    if (!obj || typeof obj !== "object") return false;
    return Object.values(obj).some(val => val !== null && val !== undefined && val !== "");
  };

  const formatDateRange = (startDate?: string, endDate?: string, isCurrent?: boolean): string => {
    const parts = [];
    if (startDate && startDate.trim()) parts.push(startDate.trim());
    if (endDate && endDate.trim()) parts.push(endDate.trim());
    else if (isCurrent && parts.length > 0) parts.push("Present");
    if (parts.length === 0) return "";
    if (parts.length === 1) return parts[0];
    return parts.join(" – ");
  };

  const formatSubtitle = (parts: (string | undefined | null)[]): string => {
    const filtered = parts.filter(part => part && typeof part === "string" && part.trim().length > 0);
    return filtered.join(", ");
  };

  const renderDescription = (description: string): string => {
    if (!description) return '';
    if (description.includes('<ul>') || description.includes('<li>')) {
      return description;
    }
    const lines = description.split('\n').filter(line => line.trim());
    if (lines.length === 0) return '';
    return `
      <ul class="bullet-list">
        ${lines.map(line => `<li>${line.replace(/^[•\-*]\s*/, '').trim()}</li>`).join('')}
      </ul>
    `;
  };

  const parseSkills = (): string[] => {
    if (!skills) return [];
    if (Array.isArray(skills)) return skills.filter((s: any) => s && (typeof s === "string" ? s.trim() : s));
    if (typeof skills === 'string') {
      if (skills.includes('<ul>')) {
        const matches = skills.match(/<li>(.*?)<\/li>/g);
        if (matches) return matches.map(m => m.replace(/<\/?li>/g, '').trim());
      }
      return skills.split(',').map((s: string) => s.trim()).filter(Boolean);
    }
    return [];
  };

  const parseCoreCompetencies = (): string[] => {
    if (!coreCompetencies) return [];
    if (Array.isArray(coreCompetencies)) return coreCompetencies.filter((c: any) => c && (typeof c === "string" ? c.trim() : c));
    if (typeof coreCompetencies === 'string') {
      if (coreCompetencies.includes('<ul>')) {
        const matches = coreCompetencies.match(/<li>(.*?)<\/li>/g);
        if (matches) return matches.map(m => m.replace(/<\/?li>/g, '').trim());
      }
      return coreCompetencies.split(',').map((c: string) => c.trim()).filter(Boolean);
    }
    return [];
  };

  const skillsList = parseSkills();
  const coreCompetenciesList = parseCoreCompetencies();

  const sortedExperience = [...experience].sort(
    (a: any, b: any) =>
      new Date(b.startDate || "1900-01-01").getTime() -
      new Date(a.startDate || "1900-01-01").getTime()
  );

  const educationList = getNonEmptyArray(education);
  const nonEmptyProjects = getNonEmptyArray(projects);
  const nonEmptyInternships = getNonEmptyArray(internships);
  const nonEmptyTrainingPrograms = getNonEmptyArray(trainingPrograms);
  const nonEmptyAcademicProjects = getNonEmptyArray(academicProjects);
  const nonEmptyLeadershipPositions = getNonEmptyArray(leadershipPositions);
  const nonEmptyCoCurricular = getNonEmptyArray(coCurricular);
  const nonEmptyExtracurricular = getNonEmptyArray(extracurricular);
  const nonEmptyLanguages = getNonEmptyArray(languages);
  const nonEmptyCertifications = getNonEmptyArray(certifications);
  const nonEmptyScholarships = getNonEmptyArray(scholarships);
  const nonEmptyAwards = getNonEmptyArray(awards);
  const nonEmptySpeakingEngagements = getNonEmptyArray(speakingEngagements);
  const nonEmptyMemberships = getNonEmptyArray(memberships);
  const nonEmptyWorkshops = getNonEmptyArray(workshops);
  const nonEmptyClientProjects = getNonEmptyArray(clientProjects);
  const nonEmptyPortfolio = getNonEmptyArray(portfolio);
  const nonEmptyVolunteering = getNonEmptyArray(volunteering);
  const nonEmptyMilitaryService = getNonEmptyArray(militaryService);
  const nonEmptyMethodologies = getNonEmptyArray(methodologies);
  const nonEmptyIndustryExpertise = getNonEmptyArray(industryExpertise);
  const nonEmptyReferences = getNonEmptyArray(references);
  const nonEmptyTeachingExperience = getNonEmptyArray(teachingExperience);
  const nonEmptyMentorshipExperience = getNonEmptyArray(mentorshipExperience);
  const nonEmptyResearchGrants = getNonEmptyArray(researchGrants);
  const nonEmptyTestScores = getNonEmptyArray(testScores);
  const nonEmptyPublications = getNonEmptyArray(publications);
  const nonEmptyPatents = getNonEmptyArray(patents);
  const nonEmptyToolsTechnologies = getNonEmptyArray(toolsTechnologies);
  const nonEmptySocialProfiles = getNonEmptyArray(socialProfiles);
  const nonEmptyHobbies = getNonEmptyArray(hobbies);

  // SVG Icons (replacing Font Awesome)
  const svgIcons = {
    phone: `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="${currentTheme.primary}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>`,
    email: `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="${currentTheme.primary}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>`,
    location: `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="${currentTheme.primary}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>`,
    calendar: `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="${currentTheme.primary}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`,
    user: `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="${currentTheme.primary}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
    heart: `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="${currentTheme.primary}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>`,
    linkedin: `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="${currentTheme.primary}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>`,
    briefcase: `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="${currentTheme.primary}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>`,
    graduation: `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="${currentTheme.primary}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5"/></svg>`,
    wrench: `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="${currentTheme.primary}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.5 8.5 9 7l3-3 1.5 1.5"/><path d="M16 12a4 4 0 0 0-4-4H8.5L4 12.5 7 16l4.5-4.5"/><path d="M4 22l4-4"/></svg>`,
    star: `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="${currentTheme.primary}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,
    chip: `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="${currentTheme.primary}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="16" height="16" rx="2" ry="2"/><rect x="9" y="9" width="6" height="6"/><line x1="9" y1="2" x2="9" y2="4"/><line x1="15" y1="2" x2="15" y2="4"/><line x1="9" y1="20" x2="9" y2="22"/><line x1="15" y1="20" x2="15" y2="22"/><line x1="2" y1="9" x2="4" y2="9"/><line x1="2" y1="15" x2="4" y2="15"/><line x1="20" y1="9" x2="22" y2="9"/><line x1="20" y1="15" x2="22" y2="15"/></svg>`,
    language: `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="${currentTheme.primary}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 8h14"/><path d="M8 3v5"/><path d="M16 3v5"/><path d="M10 13l2 8 2-8"/><path d="M6 21h12"/><path d="M3 13h4"/><path d="M17 13h4"/></svg>`,
    certificate: `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="${currentTheme.primary}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16v16H4z"/><path d="M9 9h6"/><path d="M9 13h6"/><path d="M9 17h4"/></svg>`,
    trophy: `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="${currentTheme.primary}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M8 2h8v4c0 2.21-1.79 4-4 4s-4-1.79-4-4V2z"/></svg>`,
    medal: `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="${currentTheme.primary}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="6"/><path d="M8 14v5a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2v-5"/><path d="M10 10l2-2 2 2"/></svg>`,
    microphone: `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="${currentTheme.primary}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="22"/></svg>`,
    users: `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="${currentTheme.primary}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
    chalkboard: `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="${currentTheme.primary}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16v12H4z"/><path d="M9 20l3-4 3 4"/><path d="M12 16v4"/></svg>`,
    flask: `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="${currentTheme.primary}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3h8"/><path d="M10 8v6"/><path d="M14 8v6"/><path d="M6 14h12"/><path d="M12 20a4 4 0 0 1-4-4v-2h8v2a4 4 0 0 1-4 4z"/></svg>`,
    palette: `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="${currentTheme.primary}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="4"/><line x1="12" y1="2" x2="12" y2="4"/><line x1="12" y1="20" x2="12" y2="22"/><line x1="2" y1="12" x2="4" y2="12"/><line x1="20" y1="12" x2="22" y2="12"/></svg>`,
    football: `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="${currentTheme.primary}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a10 10 0 0 1 10 10"/><path d="M12 2a10 10 0 0 0-10 10"/><path d="M2 12h20"/><path d="M12 2v20"/></svg>`,
    handshake: `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="${currentTheme.primary}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
    clock: `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="${currentTheme.primary}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
    chart: `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="${currentTheme.primary}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><path d="M12 22V12"/><path d="M9 10.5l3-1.5 3 1.5"/></svg>`,
    bullseye: `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="${currentTheme.primary}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>`,
    folder: `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="${currentTheme.primary}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>`,
    shield: `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="${currentTheme.primary}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`,
    book: `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="${currentTheme.primary}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>`,
    file: `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="${currentTheme.primary}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>`,
    card: `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="${currentTheme.primary}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>`,
    share: `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="${currentTheme.primary}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>`
  };

  // --- Contact Priority Logic ---
  const addressString = personal.location || personal.fullAddress || "";
  const linkedinProfile = socialProfiles?.find((p: any) => 
    String(p.network || p.platform).toLowerCase().includes("linkedin") || 
    String(p.url).toLowerCase().includes("linkedin")
  );
  const linkedinUrl = personal.linkedinUrl || linkedinProfile?.url || linkedinProfile?.username || "";
  const cleanLinkedinLabel = linkedinUrl ? linkedinUrl.replace(/^(https?:\/\/)?(www\.)?/, "") : "";

  const headerContactItems = [];
  if (personal?.phone) {
    headerContactItems.push(`<div class="contact-item">${svgIcons.phone} <span>${personal.phone}</span></div>`);
  }
  if (personal?.email) {
    headerContactItems.push(`<div class="contact-item">${svgIcons.email} <span>${personal.email}</span></div>`);
  }
  if (personal?.dob) {
    headerContactItems.push(`<div class="contact-item">${svgIcons.calendar} <span>DOB: ${personal.dob}</span></div>`);
    if (linkedinUrl) {
      headerContactItems.push(`<div class="contact-item">${svgIcons.linkedin} <span><a href="${linkedinUrl}" target="_blank">${cleanLinkedinLabel}</a></span></div>`);
    } else if (addressString) {
      headerContactItems.push(`<div class="contact-item">${svgIcons.location} <span>${addressString}</span></div>`);
    }
  } else {
    if (linkedinUrl) {
      headerContactItems.push(`<div class="contact-item">${svgIcons.linkedin} <span><a href="${linkedinUrl}" target="_blank">${cleanLinkedinLabel}</a></span></div>`);
    } else if (addressString) {
      headerContactItems.push(`<div class="contact-item">${svgIcons.location} <span>${addressString}</span></div>`);
    }
  }
  // ------------------------------

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Resume</title>
  <style>
  @import url('https://fonts.googleapis.com/css2?family=Inter...&family=Roboto...&family=Open+Sans...&family=Montserrat...&family=Poppins...&family=Lato...');
    * { margin: 0; padding: 0; box-sizing: border-box; }

    body {
      font-family: ${userFontFamily};
      font-size: ${baseFontSize}pt;
      color: #222222;
      background: #f4f6f8;
      line-height: 1.5;
      padding: 30px 15px;
    }

    .container {
      max-width: 820px;
      margin: 0 auto;
      background: #ffffff;
      padding: 45px 50px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.08);
    }

    /* ===== HEADER STYLING ===== */
    .header-section {
      text-align: center;
      margin-bottom: 25px;
    }

    .name {
      font-family: ${userFontFamily};
      font-size: ${nameFontSize}pt;
      font-weight: 700;
      color: ${currentTheme.primary};
      text-transform: uppercase;
      letter-spacing: 1.5px;
      margin-bottom: 6px;
    }

    .role {
      font-size: ${subHeadingFontSize}pt;
      font-weight: 700;
      color: #333333;
      text-transform: uppercase;
      letter-spacing: 2px;
      margin-bottom: 18px;
    }

    /* Horizontal Contact Bar */
    .contact-container {
      border-top: 2px solid ${currentTheme.primary};
      border-bottom: 2px solid ${currentTheme.primary};
      padding: 8px 0;
      margin-bottom: 25px;
      position: relative;
    }

    .contact-flex {
      display: flex;
      justify-content: space-around;
      align-items: center;
      flex-wrap: wrap;
      gap: 10px;
    }

    .contact-item {
      font-size: ${smallFontSize}pt;
      color: #333333;
      display: flex;
      align-items: center;
      gap: 6px;
      font-weight: 500;
    }

    .contact-item svg {
      width: 12px;
      height: 12px;
    }

    /* Section Divider lines */
    .section-divider {
      display: flex;
      align-items: center;
      text-align: center;
      margin: 25px 0 15px 0;
    }

    .section-divider::before,
    .section-divider::after {
      content: '';
      flex: 1;
      border-bottom: 1px solid #a0b2b7;
    }

    .section-title {
      padding: 0 15px;
      font-family: ${userFontFamily};
      font-size: ${headingFontSize}pt;
      font-weight: 700;
      color: ${currentTheme.primary};
      text-transform: uppercase;
      letter-spacing: 1.5px;
    }

    /* ===== CONTENT STYLING ===== */
    .summary-text {
      font-size: ${baseFontSize}pt;
      color: #444444;
      text-align: center;
      line-height: 1.6;
      max-width: 92%;
      margin: 0 auto;
    }

    /* Table Styles */
    .resume-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 12px;
      border: 1px solid #7a9299;
    }

    .resume-table th {
      background-color: #f2f6f7;
      color: ${currentTheme.primary};
      font-family: ${userFontFamily};
      font-size: ${smallFontSize}pt;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      border: 1px solid #7a9299;
      padding: 8px 10px;
      text-align: center;
    }

    .resume-table td {
      border: 1px solid #7a9299;
      padding: 12px 14px;
      vertical-align: top;
      font-size: ${smallFontSize}pt;
    }

    .col-meta { width: 30%; }
    .col-main { width: 55%; }
    .col-time { width: 15%; text-align: center; }

    .company-title {
      font-weight: 700;
      color: #111111;
      font-size: ${baseFontSize}pt;
      margin-bottom: 2px;
    }

    .company-sub {
      color: #555555;
      font-size: ${smallFontSize}pt;
    }

    .bullet-list {
      list-style: none;
    }

    .bullet-list li {
      position: relative;
      padding-left: 12px;
      margin-bottom: 5px;
      color: #333333;
      text-align: justify;
    }

    .bullet-list li::before {
      content: "•";
      position: absolute;
      left: 0;
      color: #555555;
    }

    .tenure-text {
      font-weight: 600;
      color: #222222;
      text-align: center;
      display: block;
    }

    @media print {
      body { background: none; padding: 0; }
      .container { box-shadow: none; padding: 20px; }
      .resume-table th { background-color: #f2f6f7 !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    }
  </style>
</head>
<body>

  <div class="container" >
    
    <!-- HEADER AREA -->
    <div class="header-section" id="section-header" data-section="header">
      <div class="name">${personal?.name || "Your Name "}</div>
      ${personal?.role &&
      !["undefined", "null"].includes(String(personal.role).toLowerCase())
      ? `<div class="role">${personal.role}</div>`
      : ""
    }
      
      <div class="contact-container" >
        <div class="contact-flex">
          ${headerContactItems.join('')}
        </div>
      </div>
    </div>

    <!-- AVAILABILITY & WORK AUTH SECTION -->
    ${availabilityWorkAuth && hasObjectValues(availabilityWorkAuth) ? `
    <div class="section-divider" id="section-availability-divider" data-section="availability-divider">
      <span class="section-title">Availability & Work Authorization</span>
    </div>
    <div class="summary-text" id="section-availability" data-section="availability">
      ${availabilityWorkAuth.availabilityNoticePeriod ? `Notice Period: ${availabilityWorkAuth.availabilityNoticePeriod}<br>` : ''}
      ${availabilityWorkAuth.workAuthorizationStatus ? `Work Authorization: ${availabilityWorkAuth.workAuthorizationStatus}<br>` : ''}
      ${availabilityWorkAuth.preferredLocation ? `Preferred Location: ${availabilityWorkAuth.preferredLocation}` : ''}
    </div>
    ` : ""}


    <!-- CAREER OBJECTIVE / SUMMARY SECTION -->
    ${summary || careerObjective ? `
    <div class="section-divider" id="section-careerObjective-divider" data-section="careerObjective-divider">
      <span class="section-title">Career Objective</span>
    </div>
    <p class="summary-text" id="section-careerObjective" data-section="careerObjective">
      ${summary || careerObjective}
    </p>
    ` : ""}

    <!-- PROFESSIONAL EXPERIENCE TABULAR GRID -->
    ${sortedExperience.length > 0 ? `
    <div class="section-divider" id="section-experience-divider" data-section="experience-divider">
      <span class="section-title">Professional Experience</span>
    </div>
    
    <table class="resume-table" id="section-experience-table" data-section="experience-table">
      <thead>
        <tr>
          <th class="col-meta">Designation & Company</th>
          <th class="col-main">Key Responsibilities</th>
          <th class="col-time">Tenure</th>
        </tr>
      </thead>
      <tbody>
        ${sortedExperience.map((exp: any, idx: number) => {
      const range = formatDateRange(exp.startDate, exp.endDate, exp.isCurrent);
      const points = exp.description ? exp.description.split('\n').filter((p: string) => p.trim()) : [];

      return `
          <tr>
            <td class="col-meta">
              <div class="company-title">${exp.title || ""}</div>
              <div class="company-sub">${exp.company || ""}${exp.location ? `, ${exp.location}` : ""}</div>
             </td>
            <td class="col-main">
              ${points.length > 0 ? `
                <ul class="bullet-list">
                  ${points.map((pt: string, bidx: number) => `<li>${pt.replace(/^[•\-\*]\s*/, '')}</li>`).join("")}
                </ul>
              ` : `<p>${exp.description || ""}</p>`}
              ${exp.achievements ? `<p style="margin-top: 8px; text-align: justify; padding-left: 12px; color: #333333; line-height: 1.4;"><strong>Achievements:</strong> ${exp.achievements}</p>` : ""}
             </td>
            <td class="col-time">
              <span class="tenure-text">${range}</span>
             </td>
          </tr>
          `;
    }).join("")}
      </tbody>
    </table>
    ` : ""}

    <!-- PROJECTS SECTION -->
    ${nonEmptyProjects.length > 0 ? `
    <div class="section-divider" id="section-projects-divider" data-section="projects-divider">
      <span class="section-title">Projects</span>
    </div>
    <table class="resume-table" id="section-projects-table" data-section="projects-table">
      <thead>
        <tr>
          <th class="col-meta">Project Name</th>
          <th class="col-main">Description / Technologies</th>
          <th class="col-time">Duration</th>
        </tr>
      </thead>
      <tbody>
        ${nonEmptyProjects.map((project: any, idx: number) => `
        <tr>
          <td class="col-meta">
            <div class="company-title">${project.name || project.title || ''}</div>
            ${project.role ? `<div class="company-sub">Role: ${project.role}</div>` : ""}
           </td>
          <td class="col-main">
            ${project.description ? `<p>${project.description}</p>` : ""}
            ${project.technologies ? `<p><strong>Technologies:</strong> ${project.technologies}</p>` : ""}
           </td>
          <td class="col-time">
            <span class="tenure-text">${project.duration || formatDateRange(project.startDate, project.endDate)}</span>
           </td>
        </tr>
        `).join("")}
      </tbody>
    </table>
    ` : ""}

    <!-- INTERNSHIPS SECTION -->
    ${nonEmptyInternships.length > 0 ? `
    <div class="section-divider" id="section-internships-divider" data-section="internships-divider">
      <span class="section-title">Internships</span>
    </div>
    <table class="resume-table" id="section-internships-table" data-section="internships-table">
      <thead>
        <tr>
          <th class="col-meta">Title & Company</th>
          <th class="col-main">Description</th>
          <th class="col-time">Duration</th>
        </tr>
      </thead>
      <tbody>
        ${nonEmptyInternships.map((item: any, idx: number) => `
        <tr>
          <td class="col-meta">
            <div class="company-title">${item.title || item.role || ''}</div>
            <div class="company-sub">${item.company || item.organization || ''}</div>
           </td>
          <td class="col-main">${item.description ? `<p>${item.description}</p>` : ""}</td>
          <td class="col-time"><span class="tenure-text">${item.duration || formatDateRange(item.startDate, item.endDate)}</span></td>
        </tr>
        `).join("")}
      </tbody>
    </table>
    ` : ""}

    <!-- TRAINING PROGRAMS SECTION -->
    ${nonEmptyTrainingPrograms.length > 0 ? `
    <div class="section-divider" id="section-trainingPrograms-divider" data-section="trainingPrograms-divider">
      <span class="section-title">Training Programs</span>
    </div>
    <table class="resume-table" id="section-trainingPrograms-table" data-section="trainingPrograms-table">
      <thead>
        <tr>
          <th class="col-meta">Program Name</th>
          <th class="col-main">Provider</th>
          <th class="col-time">Completion Date</th>
        </tr>
      </thead>
      <tbody>
        ${nonEmptyTrainingPrograms.map((item: any, idx: number) => `
        <tr>
          <td class="col-meta"><div class="company-title">${item.name || item.title || ''}</div></td>
          <td class="col-main">${item.provider || item.organization || ''}</td>
          <td class="col-time"><span class="tenure-text">${item.completionDate || ''}</span></td>
        </tr>
        `).join("")}
      </tbody>
    </table>
    ` : ""}

    <!-- ACADEMIC PROJECTS SECTION -->
    ${nonEmptyAcademicProjects.length > 0 ? `
    <div class="section-divider" id="section-academicProjects-divider" data-section="academicProjects-divider">
      <span class="section-title">Academic Projects</span>
    </div>
    <table class="resume-table" id="section-academicProjects-table" data-section="academicProjects-table">
      <thead>
        <tr>
          <th class="col-meta">Project Name</th>
          <th class="col-main">Institution / Description</th>
          <th class="col-time">Duration</th>
        </tr>
      </thead>
      <tbody>
        ${nonEmptyAcademicProjects.map((item: any, idx: number) => `
        <tr>
          <td class="col-meta"><div class="company-title">${item.name || item.title || ''}</div></td>
          <td class="col-main">
            ${item.institution ? `<div class="company-sub">${item.institution}${item.course ? ` - ${item.course}` : ''}</div>` : ""}
            ${item.description ? `<p>${item.description}</p>` : ""}
            ${item.technologies ? `<p><strong>Technologies:</strong> ${Array.isArray(item.technologies) ? item.technologies.join(', ') : item.technologies}</p>` : ""}
            ${item.url ? `<p><a href="${item.url}" target="_blank">${item.url}</a></p>` : ""}
          </td>
          <td class="col-time"><span class="tenure-text">${item.duration || ''}</span></td>
        </tr>
        `).join("")}
      </tbody>
    </table>
    ` : ""}

    <!-- LEADERSHIP POSITIONS SECTION -->
    ${nonEmptyLeadershipPositions.length > 0 ? `
    <div class="section-divider" id="section-leadershipPositions-divider" data-section="leadershipPositions-divider">
      <span class="section-title">Leadership Positions</span>
    </div>
    <table class="resume-table" id="section-leadershipPositions-table" data-section="leadershipPositions-table">
      <thead>
        <tr>
          <th class="col-meta">Position</th>
          <th class="col-main">Organization</th>
          <th class="col-time">Duration</th>
        </tr>
      </thead>
      <tbody>
        ${nonEmptyLeadershipPositions.map((item: any, idx: number) => `
        <tr>
          <td class="col-meta"><div class="company-title">${item.position || item.title || ''}</div></td>
          <td class="col-main">${item.organization || ''}</td>
          <td class="col-time"><span class="tenure-text">${formatDateRange(item.startDate, item.endDate)}</span></td>
        </tr>
        `).join("")}
      </tbody>
    </table>
    ` : ""}

    <!-- CO-CURRICULAR SECTION -->
    ${nonEmptyCoCurricular.length > 0 ? `
    <div class="section-divider" id="section-coCurricular-divider" data-section="coCurricular-divider">
      <span class="section-title">Co-curricular Activities</span>
    </div>
    <table class="resume-table" id="section-coCurricular-table" data-section="coCurricular-table">
      <thead>
        <tr>
          <th class="col-meta">Activity</th>
          <th class="col-main">Role / Description</th>
          <th class="col-time">Year</th>
        </tr>
      </thead>
      <tbody>
        ${nonEmptyCoCurricular.map((item: any, idx: number) => `
        <tr>
          <td class="col-meta"><div class="company-title">${item.activity || ''}</div></td>
          <td class="col-main">${item.role ? `Role: ${item.role}<br>` : ""}${item.description || ''}</td>
          <td class="col-time"><span class="tenure-text">${item.year || ''}</span></td>
        </tr>
        `).join("")}
      </tbody>
    </table>
    ` : ""}

    <!-- EXTRACURRICULAR SECTION -->
    ${nonEmptyExtracurricular.length > 0 ? `
    <div class="section-divider" id="section-extracurricular-divider" data-section="extracurricular-divider">
      <span class="section-title">Extracurricular Activities</span>
    </div>
    <table class="resume-table" id="section-extracurricular-table" data-section="extracurricular-table">
      <thead>
        <tr>
          <th class="col-meta">Activity</th>
          <th class="col-main">Role / Description</th>
          <th class="col-time">Year</th>
        </tr>
      </thead>
      <tbody>
        ${nonEmptyExtracurricular.map((item: any, idx: number) => `
        <tr>
          <td class="col-meta"><div class="company-title">${item.activity || ''}</div></td>
          <td class="col-main">${item.role ? `Role: ${item.role}<br>` : ""}${item.description || ''}</td>
          <td class="col-time"><span class="tenure-text">${item.year || ''}</span></td>
        </tr>
        `).join("")}
      </tbody>
    </table>
    ` : ""}

    <!-- SKILLS SECTION -->
    ${skillsList.length > 0 ? `
    <div class="section-divider" id="section-skills-divider" data-section="skills-divider">
      <span class="section-title">Skills</span>
    </div>
    <div class="summary-text" id="section-skills" data-section="skills">
      ${skillsList.map((skill, idx) => `<span style="display: inline-block; background: #f0f0f0; padding: 2px 8px; margin: 3px; border-radius: 4px; font-size: ${smallFontSize}pt;">${skill}</span>`).join("")}
    </div>
    ` : ""}

    <!-- CORE COMPETENCIES SECTION -->
    ${coreCompetenciesList.length > 0 ? `
    <div class="section-divider" id="section-coreCompetencies-divider" data-section="coreCompetencies-divider">
      <span class="section-title">Core Competencies</span>
    </div>
    <div class="summary-text" id="section-coreCompetencies" data-section="coreCompetencies">
      ${coreCompetenciesList.map((comp, idx) => `<span style="display: inline-block; background: #f0f0f0; padding: 2px 8px; margin: 3px; border-radius: 4px; font-size: 10pt;">${comp}</span>`).join("")}
    </div>
    ` : ""}

    <!-- TOOLS & TECHNOLOGIES SECTION -->
    ${nonEmptyToolsTechnologies.length > 0 ? `
    <div class="section-divider" id="section-toolsTechnologies-divider" data-section="toolsTechnologies-divider">
      <span class="section-title">Tools & Technologies</span>
    </div>
    <div class="summary-text" id="section-toolsTechnologies" data-section="toolsTechnologies">
      ${nonEmptyToolsTechnologies.map((item, idx) => `<span style="display: inline-block; background: #f0f0f0; padding: 2px 8px; margin: 3px; border-radius: 4px; font-size: 10pt;">${typeof item === "string" ? item : item.name}${item.proficiency ? ` (${item.proficiency})` : ''}</span>`).join("")}
    </div>
    ` : ""}

    <!-- LANGUAGES SECTION -->
    ${nonEmptyLanguages.length > 0 ? `
    <div class="section-divider" id="section-languages-divider" data-section="languages-divider">
      <span class="section-title">Languages</span>
    </div>
    <div class="summary-text" id="section-languages" data-section="languages">
      ${nonEmptyLanguages.map((lang, idx) => `<span style="display: inline-block; background: #f0f0f0; padding: 2px 8px; margin: 3px; border-radius: 4px; font-size: 10pt;">${lang.language || lang}${lang.proficiency ? ` (${lang.proficiency})` : ''}</span>`).join("")}
    </div>
    ` : ""}

    <!-- SCHOLARSHIPS SECTION -->
    ${nonEmptyScholarships.length > 0 ? `
    <div class="section-divider" id="section-scholarships-divider" data-section="scholarships-divider">
      <span class="section-title">Scholarships</span>
    </div>
    <table class="resume-table" id="section-scholarships-table" data-section="scholarships-table">
      <thead>
        <tr>
          <th class="col-meta">Scholarship Name</th>
          <th class="col-main">Provider</th>
          <th class="col-time">Year</th>
        </tr>
      </thead>
      <tbody>
        ${nonEmptyScholarships.map((item: any, idx: number) => `
        <tr>
          <td class="col-meta"><div class="company-title">${item.name || ''}</div></td>
          <td class="col-main">${item.provider || item.organization || ''}</td>
          <td class="col-time"><span class="tenure-text">${item.year || ''}</span></td>
        </tr>
        `).join("")}
      </tbody>
    </table>
    ` : ""}

    <!-- AWARDS SECTION -->
    ${nonEmptyAwards.length > 0 ? `
    <div class="section-divider" id="section-awards-divider" data-section="awards-divider">
      <span class="section-title">Awards & Recognition</span>
    </div>
    <table class="resume-table" id="section-awards-table" data-section="awards-table">
      <thead>
        <tr>
          <th class="col-meta">Award Title</th>
          <th class="col-main">Organization</th>
          <th class="col-time">Year</th>
        </tr>
      </thead>
      <tbody>
        ${nonEmptyAwards.map((item: any, idx: number) => `
        <tr>
          <td class="col-meta"><div class="company-title">${item.title || ''}</div></td>
          <td class="col-main">${item.organization || ''}</td>
          <td class="col-time"><span class="tenure-text">${item.issueYear || item.year || ''}</span></td>
        </tr>
        `).join("")}
      </tbody>
    </table>
    ` : ""}

    <!-- SPEAKING ENGAGEMENTS SECTION -->
    ${nonEmptySpeakingEngagements.length > 0 ? `
    <div class="section-divider" id="section-speakingEngagements-divider" data-section="speakingEngagements-divider">
      <span class="section-title">Speaking Engagements</span>
    </div>
    <table class="resume-table" id="section-speakingEngagements-table" data-section="speakingEngagements-table">
      <thead>
        <tr>
          <th class="col-meta">Topic</th>
          <th class="col-main">Event</th>
          <th class="col-time">Date</th>
        </tr>
      </thead>
      <tbody>
        ${nonEmptySpeakingEngagements.map((item: any, idx: number) => `
        <tr>
          <td class="col-meta"><div class="company-title">${item.topic || ''}</div></td>
          <td class="col-main">${item.eventName || ''}</td>
          <td class="col-time"><span class="tenure-text">${item.date || ''}</span></td>
        </tr>
        `).join("")}
      </tbody>
    </table>
    ` : ""}

    <!-- MEMBERSHIPS SECTION -->
    ${nonEmptyMemberships.length > 0 ? `
    <div class="section-divider" id="section-memberships-divider" data-section="memberships-divider">
      <span class="section-title">Memberships</span>
    </div>
    <table class="resume-table" id="section-memberships-table" data-section="memberships-table">
      <thead>
        <tr>
          <th class="col-meta">Membership Name</th>
          <th class="col-main">Organization</th>
          <th class="col-time">Year</th>
        </tr>
      </thead>
      <tbody>
        ${nonEmptyMemberships.map((item: any, idx: number) => `
        <tr>
          <td class="col-meta"><div class="company-title">${item.membershipName || item.name || ''}</div></td>
          <td class="col-main">${item.organizationName || item.organization || ''}</td>
          <td class="col-time"><span class="tenure-text">${item.year || ''}</span></td>
        </tr>
        `).join("")}
      </tbody>
    </table>
    ` : ""}

    <!-- WORKSHOPS SECTION -->
    ${nonEmptyWorkshops.length > 0 ? `
    <div class="section-divider" id="section-workshops-divider" data-section="workshops-divider">
      <span class="section-title">Workshops</span>
    </div>
    <table class="resume-table" id="section-workshops-table" data-section="workshops-table">
      <thead>
        <tr>
          <th class="col-meta">Workshop Title</th>
          <th class="col-main">Conducted By</th>
          <th class="col-time">Year</th>
        </tr>
      </thead>
      <tbody>
        ${nonEmptyWorkshops.map((item: any, idx: number) => `
        <tr>
          <td class="col-meta"><div class="company-title">${item.programTitle || item.title || ''}</div></td>
          <td class="col-main">${item.conductedBy || ''}</td>
          <td class="col-time"><span class="tenure-text">${item.year || ''}</span></td>
        </tr>
        `).join("")}
      </tbody>
    </table>
    ` : ""}

    <!-- CLIENT PROJECTS SECTION -->
    ${nonEmptyClientProjects.length > 0 ? `
    <div class="section-divider" id="section-clientProjects-divider" data-section="clientProjects-divider">
      <span class="section-title">Client Projects</span>
    </div>
    <table class="resume-table" id="section-clientProjects-table" data-section="clientProjects-table">
      <thead>
        <tr>
          <th class="col-meta">Project Name</th>
          <th class="col-main">Client / Role / Description</th>
          <th class="col-time">Duration</th>
        </tr>
      </thead>
      <tbody>
        ${nonEmptyClientProjects.map((item: any, idx: number) => `
        <tr>
          <td class="col-meta"><div class="company-title">${item.name || ''}</div></td>
          <td class="col-main">
            ${item.clientOrganization ? `<strong>Client:</strong> ${item.clientOrganization}<br>` : ''}
            ${item.role ? `<strong>Role:</strong> ${item.role}<br>` : ''}
            ${item.description || ''}
            ${item.toolsTechnologies ? `<br><strong>Tools:</strong> ${item.toolsTechnologies}` : ''}
            ${item.projectUrl ? `<br><a href="${item.projectUrl}" target="_blank">${item.projectUrl}</a>` : ''}
          </td>
          <td class="col-time"><span class="tenure-text">${item.duration || ''}</span></td>
        </tr>
        `).join("")}
      </tbody>
    </table>
    ` : ""}

    <!-- PORTFOLIO SECTION -->
    ${nonEmptyPortfolio.length > 0 ? `
    <div class="section-divider" id="section-portfolio-divider" data-section="portfolio-divider">
      <span class="section-title">Portfolio</span>
    </div>
    <table class="resume-table" id="section-portfolio-table" data-section="portfolio-table">
      <thead>
        <tr>
          <th class="col-meta">Project Name</th>
          <th class="col-main">Type / Description</th>
          <th class="col-time">Platform</th>
        </tr>
      </thead>
      <tbody>
        ${nonEmptyPortfolio.map((item: any, idx: number) => `
        <tr>
          <td class="col-meta"><div class="company-title">${item.name || ''}</div></td>
          <td class="col-main">
            ${item.description || ''}
            ${item.url ? `<br><a href="${item.url}" target="_blank">${item.url}</a>` : ''}
          </td>
          <td class="col-time"><span class="tenure-text">${item.type || ''}${item.platform ? ` on ${item.platform}` : ''}</span></td>
        </tr>
        `).join("")}
      </tbody>
    </table>
    ` : ""}

    <!-- VOLUNTEERING SECTION -->
    ${nonEmptyVolunteering.length > 0 ? `
    <div class="section-divider" id="section-volunteering-divider" data-section="volunteering-divider">
      <span class="section-title">Volunteering</span>
    </div>
    <table class="resume-table" id="section-volunteering-table" data-section="volunteering-table">
      <thead>
        <tr>
          <th class="col-meta">Role</th>
          <th class="col-main">Organization / Description</th>
          <th class="col-time">Duration</th>
        </tr>
      </thead>
      <tbody>
        ${nonEmptyVolunteering.map((item: any, idx: number) => `
        <tr>
          <td class="col-meta"><div class="company-title">${item.role || ''}</div></td>
          <td class="col-main">
            ${item.organization || ''}${item.causeArea ? ` - ${item.causeArea}` : ''}
            ${item.description ? `<br>${item.description}` : ''}
          </td>
          <td class="col-time"><span class="tenure-text">${item.duration || formatDateRange(item.startDate, item.endDate)}</span></td>
        </tr>
        `).join("")}
      </tbody>
    </table>
    ` : ""}

    <!-- MILITARY SERVICE SECTION -->
    ${nonEmptyMilitaryService.length > 0 ? `
    <div class="section-divider" id="section-militaryService-divider" data-section="militaryService-divider">
      <span class="section-title">Military Service</span>
    </div>
    <table class="resume-table" id="section-militaryService-table" data-section="militaryService-table">
      <thead>
        <tr>
          <th class="col-meta">Branch / Rank</th>
          <th class="col-main">Specialization / Description</th>
          <th class="col-time">Duration</th>
        </tr>
      </thead>
      <tbody>
        ${nonEmptyMilitaryService.map((item: any, idx: number) => `
        <tr>
          <td class="col-meta"><div class="company-title">${item.branch ? item.branch : ''}${item.rank ? ` - ${item.rank}` : ''}</div></td>
          <td class="col-main">
            ${item.specialization ? `Specialization: ${item.specialization}<br>` : ''}
            ${item.description || ''}
          </td>
          <td class="col-time"><span class="tenure-text">${item.duration || formatDateRange(item.startDate, item.endDate)}</span></td>
        </tr>
        `).join("")}
      </tbody>
    </table>
    ` : ""}

    <!-- METHODOLOGIES SECTION -->
    ${nonEmptyMethodologies.length > 0 ? `
    <div class="section-divider" id="section-methodologies-divider" data-section="methodologies-divider">
      <span class="section-title">Methodologies</span>
    </div>
    <div class="summary-text" id="section-methodologies" data-section="methodologies">
      ${nonEmptyMethodologies.map((item, idx) => `<span style="display: inline-block; background: #f0f0f0; padding: 2px 8px; margin: 3px; border-radius: 4px; font-size: 10pt;">${item.name || ''}${item.certification ? ` (${item.certification})` : ''}</span>`).join("")}
    </div>
    ` : ""}

    <!-- INDUSTRY EXPERTISE SECTION -->
    ${nonEmptyIndustryExpertise.length > 0 ? `
    <div class="section-divider" id="section-industryExpertise-divider" data-section="industryExpertise-divider">
      <span class="section-title">Industry Expertise</span>
    </div>
    <div class="summary-text" id="section-industryExpertise" data-section="industryExpertise">
      ${nonEmptyIndustryExpertise.map((item, idx) => `<span style="display: inline-block; background: #f0f0f0; padding: 2px 8px; margin: 3px; border-radius: 4px; font-size: 10pt;">${item.industry || ''}${item.domainArea ? ` - ${item.domainArea}` : ''}</span>`).join("")}
    </div>
    ` : ""}

    <!-- TEACHING EXPERIENCE SECTION -->
    ${nonEmptyTeachingExperience.length > 0 ? `
    <div class="section-divider" id="section-teachingExperience-divider" data-section="teachingExperience-divider">
      <span class="section-title">Teaching Experience</span>
    </div>
    <table class="resume-table" id="section-teachingExperience-table" data-section="teachingExperience-table">
      <thead>
        <tr>
          <th class="col-meta">Subject / Course</th>
          <th class="col-main">Institution</th>
          <th class="col-time">Duration</th>
        </tr>
      </thead>
      <tbody>
        ${nonEmptyTeachingExperience.map((item: any, idx: number) => `
        <tr>
          <td class="col-meta"><div class="company-title">${item.subjectCourseTaught || item.title || ''}</div></td>
          <td class="col-main">${item.institution || ''}</td>
          <td class="col-time"><span class="tenure-text">${item.duration || formatDateRange(item.startDate, item.endDate)}</span></td>
        </tr>
        `).join("")}
      </tbody>
    </table>
    ` : ""}

    <!-- MENTORSHIP EXPERIENCE SECTION -->
    ${nonEmptyMentorshipExperience.length > 0 ? `
    <div class="section-divider" id="section-mentorshipExperience-divider" data-section="mentorshipExperience-divider">
      <span class="section-title">Mentorship Experience</span>
    </div>
    <table class="resume-table" id="section-mentorshipExperience-table" data-section="mentorshipExperience-table">
      <thead>
        <tr>
          <th class="col-meta">Mentorship Area</th>
          <th class="col-main">Organization / Mentee Level</th>
          <th class="col-time">Duration</th>
        </tr>
      </thead>
      <tbody>
        ${nonEmptyMentorshipExperience.map((item: any, idx: number) => `
        <tr>
          <td class="col-meta"><div class="company-title">${item.mentorshipArea || ''}</div></td>
          <td class="col-main">${item.organizationPlatform || ''}${item.menteeLevel ? ` - ${item.menteeLevel}` : ''}</td>
          <td class="col-time"><span class="tenure-text">${item.duration || formatDateRange(item.startDate, item.endDate)}</span></td>
        </tr>
        `).join("")}
      </tbody>
    </table>
    ` : ""}

    <!-- RESEARCH GRANTS SECTION -->
    ${nonEmptyResearchGrants.length > 0 ? `
    <div class="section-divider" id="section-researchGrants-divider" data-section="researchGrants-divider">
      <span class="section-title">Research Grants</span>
    </div>
    <table class="resume-table" id="section-researchGrants-table" data-section="researchGrants-table">
      <thead>
        <tr>
          <th class="col-meta">Grant Title</th>
          <th class="col-main">Agency / Amount</th>
          <th class="col-time">Year</th>
        </tr>
      </thead>
      <tbody>
        ${nonEmptyResearchGrants.map((item: any, idx: number) => `
        <tr>
          <td class="col-meta"><div class="company-title">${item.title || ''}</div></td>
          <td class="col-main">${item.agency || ''}${item.amount ? ` | ${item.amount}` : ''}</td>
          <td class="col-time"><span class="tenure-text">${item.year || ''}</span></td>
        </tr>
        `).join("")}
      </tbody>
    </table>
    ` : ""}

    <!-- TEST SCORES SECTION -->
    ${nonEmptyTestScores.length > 0 ? `
    <div class="section-divider" id="section-testScores-divider" data-section="testScores-divider">
      <span class="section-title">Test Scores</span>
    </div>
    <table class="resume-table" id="section-testScores-table" data-section="testScores-table">
      <thead>
        <tr>
          <th class="col-meta">Test Name</th>
          <th class="col-main">Score / Percentile</th>
          <th class="col-time">Year</th>
        </tr>
      </thead>
      <tbody>
        ${nonEmptyTestScores.map((item: any, idx: number) => `
        <tr>
          <td class="col-meta"><div class="company-title">${item.testName || ''}</div></td>
          <td class="col-main">Score: ${item.score || ''}${item.percentileRank ? ` (${item.percentileRank} percentile)` : ''}</td>
          <td class="col-time"><span class="tenure-text">${item.year || ''}</span></td>
        </tr>
        `).join("")}
      </tbody>
    </table>
    ` : ""}

    <!-- PUBLICATIONS SECTION -->
    ${nonEmptyPublications.length > 0 ? `
    <div class="section-divider" id="section-publications-divider" data-section="publications-divider">
      <span class="section-title">Publications</span>
    </div>
    <table class="resume-table" id="section-publications-table" data-section="publications-table">
      <thead>
        <tr>
          <th class="col-meta">Publication Title</th>
          <th class="col-main">Journal / Publisher</th>
          <th class="col-time">Year</th>
        </tr>
      </thead>
      <tbody>
        ${nonEmptyPublications.map((item: any, idx: number) => `
        <tr>
          <td class="col-meta"><div class="company-title">${item.title || ''}</div></td>
          <td class="col-main">${item.journalPublisher || item.publisher || ''}${item.publicationType ? ` (${item.publicationType})` : ''}
          ${item.urlDoi ? `<br><a href="${item.urlDoi}" target="_blank">${item.urlDoi}</a>` : ''}
          </td>
          <td class="col-time"><span class="tenure-text">${item.year || ''}</span></td>
        </tr>
        `).join("")}
      </tbody>
    </table>
    ` : ""}

    <!-- PATENTS SECTION -->
    ${nonEmptyPatents.length > 0 ? `
    <div class="section-divider" id="section-patents-divider" data-section="patents-divider">
      <span class="section-title">Patents</span>
    </div>
    <table class="resume-table" id="section-patents-table" data-section="patents-table">
      <thead>
        <tr>
          <th class="col-meta">Patent Title</th>
          <th class="col-main">Patent # / Issuing Authority</th>
          <th class="col-time">Year / Status</th>
        </tr>
      </thead>
      <tbody>
        ${nonEmptyPatents.map((item: any, idx: number) => `
        <tr>
          <td class="col-meta"><div class="company-title">${item.title || ''}</div></td>
          <td class="col-main">
            ${item.patentNumber ? `Patent #: ${item.patentNumber}<br>` : ''}
            ${item.issuingAuthority ? `${item.issuingAuthority}` : ''}
          </td>
          <td class="col-time">
            ${item.year ? `<span class="tenure-text">${item.year}</span>` : ''}
            ${item.status ? `<br><span style="font-size: 10pt;">${item.status}</span>` : ''}
          </td>
        </tr>
        `).join("")}
      </tbody>
    </table>
    ` : ""}

    <!-- REFERENCES SECTION -->
    ${nonEmptyReferences.length > 0 ? `
    <div class="section-divider" id="section-references-divider" data-section="references-divider">
      <span class="section-title">References</span>
    </div>
    <table class="resume-table" id="section-references-table" data-section="references-table">
      <thead>
        <tr>
          <th class="col-meta">Name</th>
          <th class="col-main">Designation / Organization</th>
          <th class="col-time">Contact</th>
        </tr>
      </thead>
      <tbody>
        ${nonEmptyReferences.map((item: any, idx: number) => `
        <tr>
          <td class="col-meta"><div class="company-title">${item.name || ''}</div></td>
          <td class="col-main">${item.designationRelationship || ''}${item.organization ? ` at ${item.organization}` : ''}</td>
          <td class="col-time">${item.contactInformation || ''}</span></td>
        </tr>
        `).join("")}
      </tbody>
    </table>
    ` : ""}

    <!-- CERTIFICATIONS SECTION -->
    ${nonEmptyCertifications.length > 0 ? `
    <div class="section-divider" id="section-certifications-divider" data-section="certifications-divider">
      <span class="section-title">Certifications</span>
    </div>
    <div class="summary-text" id="section-certifications" data-section="certifications">
      ${nonEmptyCertifications.map((cert, idx) => `<span style="display: inline-block; background: #f0f0f0; padding: 2px 8px; margin: 3px; border-radius: 4px; font-size: 10pt;">${cert.name || cert.title || ''}${cert.issuer ? ` – ${cert.issuer}` : ''}${cert.date ? ` (${cert.date})` : ''}</span>`).join("")}
    </div>
    ` : ""}

    <!-- EDUCATION TABULAR GRID -->
    ${educationList.length > 0 ? `
    <div class="section-divider" id="section-education-divider" data-section="education-divider">
      <span class="section-title">Education</span>
    </div>

    <table class="resume-table" id="section-education-table" data-section="education-table">
      <thead>
        <tr>
          <th class="col-meta">Degree</th>
          <th class="col-main">Institution</th>
          <th class="col-time">Year</th>
        </tr>
      </thead>
      <tbody>
        ${educationList.map((edu: any, idx: number) => `
        <tr>
          <td class="col-meta">
            <div class="company-title">${edu.degree || ""}${edu.field ? ` – ${edu.field}` : ""}</div>
          </td>
          <td class="col-main">
            <div class="company-sub">${edu.school || ""}${edu.location ? `, ${edu.location}` : ""}</div>
            ${edu.grade ? `<div class="company-sub">${edu.grade}</div>` : ""}
          </td>
          <td class="col-time">
            <span class="tenure-text">${edu.graduationDate || formatDateRange(edu.startDate || edu.startYear, edu.endDate || edu.endYear)}</span>
          </td>
        </tr>
        `).join("")}
      </tbody>
    </table>
    ` : ""}

    <!-- HOBBIES SECTION -->
    ${nonEmptyHobbies.length > 0 ? `
    <div class="section-divider" id="section-hobbies-divider" data-section="hobbies-divider">
      <span class="section-title">Hobbies & Interests</span>
    </div>
    <div class="summary-text" id="section-hobbies" data-section="hobbies">
      ${nonEmptyHobbies.map((hobby, idx) => `<span style="display: inline-block; background: #f0f0f0; padding: 2px 8px; margin: 3px; border-radius: 4px; font-size: 10pt;">${typeof hobby === "string" ? hobby.trim() : hobby}</span>`).join("")}
    </div>
    ` : ""}

    <!-- SOCIAL PROFILES SECTION -->
    ${nonEmptySocialProfiles.length > 0 ? `
    <div class="section-divider" id="section-socialProfiles-divider" data-section="socialProfiles-divider">
      <span class="section-title">Social Profiles</span>
    </div>
    <div class="summary-text" id="section-socialProfiles" data-section="socialProfiles">
      ${nonEmptySocialProfiles.map((profile, idx) => `<a href="${profile.url}" target="_blank" style="color: ${currentTheme.primary}; text-decoration: none; margin: 3px; display: inline-block;"><span style="background: #f0f0f0; padding: 2px 8px; margin: 3px; border-radius: 4px; font-size: ${smallFontSize}pt;">${profile.platform || profile.network || 'Profile'}</span></a>`).join("")}
    </div>
    ` : ""}

  </div>

</body>
</html>`;
}