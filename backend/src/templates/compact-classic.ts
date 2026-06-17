export function buildCompactClassicTemplate(
  data: any,
  theme?: any
): string {
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
    primary: "#7A0C2E", // Deep Burgundy Crimson
    secondary: "#111111",
    background: "#ffffff",
    headingFont: "sans-serif",
    bodyFont: "sans-serif",
  };
  const currentTheme = { ...defaultTheme, ...(theme || {}) };

  const userFontSize = data.formatting?.bodyFontSize || data.formatting?.fontSize || 10.5;
  const bodyFontSize = `${userFontSize}pt`;
  const smallFontSize = `${Math.max(userFontSize * 0.95, 9)}pt`;
  const smallerFontSize = `${Math.max(userFontSize * 0.9, 8.5)}pt`;
  const headingFontSize = `${userFontSize * 1.25}pt`;
  const nameFontSize = `${userFontSize * 2.5}pt`;

  const sortedExperience = data.experience
    ? [...data.experience].sort(
      (a: any, b: any) =>
        new Date(b.startDate || "1900-01-01").getTime() -
        new Date(a.startDate || "1900-01-01").getTime()
    )
    : [];

  const formatLocation = (): string => {
    return [
      personal.fullAddress || personal.location,
      personal.country
    ].filter(Boolean).join(", ");
  };

  const formatDateRange = (startDate?: string, endDate?: string, isCurrent?: boolean): string => {
    const parts = [];
    if (startDate && startDate.trim()) parts.push(startDate.trim());
    if (endDate && endDate.trim()) parts.push(endDate.trim());
    else if (isCurrent) parts.push("Present");
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
      return `<div class="description-html">${description}</div>`;
    }
    const lines = description.split('\n').filter(line => line.trim());
    if (lines.length === 0) return '';
    return `
      <ul class="bullet-list">
        ${lines.map(line => `<li>${line.trim()}</li>`).join('')}
      </ul>
    `;
  };

  const getNonEmptyArray = (arr: any): any[] => {
    if (!arr || !Array.isArray(arr)) return [];
    return arr.filter((item: any) => {
      if (typeof item === "string") return item.trim().length > 0;
      if (typeof item === "object" && item !== null) {
        return Object.values(item).some((val: any) => typeof val === "string" && val.trim().length > 0);
      }
      return false;
    });
  };

  const hasObjectValues = (obj: any): boolean => {
    if (!obj || typeof obj !== "object") return false;
    return Object.values(obj).some(val => val !== null && val !== undefined && val !== "");
  };

  const nonEmptyExperience = getNonEmptyArray(experience);
  const nonEmptyEducation = getNonEmptyArray(education);
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

  const parseSkills = (): any[] => {
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

  const parseCoreCompetencies = (): any[] => {
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

  const skillsArray = parseSkills();
  const coreCompetenciesArray = parseCoreCompetencies();

  // SVG Icons
  const icons = {
    phone: `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>`,
    email: `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>`,
    location: `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>`,
    calendar: `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`,
    user: `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
    linkedin: `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>`,
    briefcase: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>`,
    userIcon: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
    graduation: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5"/></svg>`,
    wrench: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.5 8.5 9 7l3-3 1.5 1.5"/><path d="M16 12a4 4 0 0 0-4-4H8.5L4 12.5 7 16l4.5-4.5"/><path d="M4 22l4-4"/></svg>`,
    star: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,
    chip: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="16" height="16" rx="2" ry="2"/><rect x="9" y="9" width="6" height="6"/><line x1="9" y1="2" x2="9" y2="4"/><line x1="15" y1="2" x2="15" y2="4"/><line x1="9" y1="20" x2="9" y2="22"/><line x1="15" y1="20" x2="15" y2="22"/><line x1="2" y1="9" x2="4" y2="9"/><line x1="2" y1="15" x2="4" y2="15"/><line x1="20" y1="9" x2="22" y2="9"/><line x1="20" y1="15" x2="22" y2="15"/></svg>`,
    language: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 8h14"/><path d="M8 3v5"/><path d="M16 3v5"/><path d="M10 13l2 8 2-8"/><path d="M6 21h12"/><path d="M3 13h4"/><path d="M17 13h4"/></svg>`,
    clock: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
    chart: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><path d="M12 22V12"/><path d="M9 10.5l3-1.5 3 1.5"/></svg>`,
    bullseye: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>`,
    project: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>`,
    chalkboard: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16v12H4z"/><path d="M9 20l3-4 3 4"/><path d="M12 16v4"/></svg>`,
    flask: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3h8"/><path d="M10 8v6"/><path d="M14 8v6"/><path d="M6 14h12"/><path d="M12 20a4 4 0 0 1-4-4v-2h8v2a4 4 0 0 1-4 4z"/></svg>`,
    users: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
    palette: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="4"/><line x1="12" y1="2" x2="12" y2="4"/><line x1="12" y1="20" x2="12" y2="22"/><line x1="2" y1="12" x2="4" y2="12"/><line x1="20" y1="12" x2="22" y2="12"/></svg>`,
    football: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a10 10 0 0 1 10 10"/><path d="M12 2a10 10 0 0 0-10 10"/><path d="M2 12h20"/><path d="M12 2v20"/></svg>`,
    certificate: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16v16H4z"/><path d="M9 9h6"/><path d="M9 13h6"/><path d="M9 17h4"/></svg>`,
    trophy: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M8 2h8v4c0 2.21-1.79 4-4 4s-4-1.79-4-4V2z"/></svg>`,
    medal: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="6"/><path d="M8 14v5a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2v-5"/><path d="M10 10l2-2 2 2"/></svg>`,
    microphone: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="22"/></svg>`,
    handshake: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
    handHeart: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 12a8 8 0 0 1-8 8 8 8 0 0 1-8-8 8 8 0 0 1 8-8"/><path d="M12 2v4"/><path d="M6 6l2 2"/><path d="M18 6l-2 2"/><path d="M12 14a2 2 0 0 0 2-2 2 2 0 0 0-2-2 2 2 0 0 0-2 2 2 2 0 0 0 2 2z"/></svg>`,
    shield: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`,
    diagram: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="3" y1="15" x2="21" y2="15"/><line x1="9" y1="3" x2="9" y2="21"/><line x1="15" y1="3" x2="15" y2="21"/></svg>`,
    building: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"/><line x1="9" y1="6" x2="15" y2="6"/><line x1="9" y1="10" x2="15" y2="10"/><line x1="9" y1="14" x2="15" y2="14"/><line x1="9" y1="18" x2="15" y2="18"/></svg>`,
    book: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>`,
    file: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>`,
    card: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>`,
    heartIcon: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>`,
    share: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>`
  };

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Resume</title>
  <style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: ${data.formatting?.fontFamily || 'Arial, sans-serif'};
      color: #222222;
      line-height: 1.5;
      background: #ffffff;
      padding: 45px;
    }

    .page {
      max-width: 820px;
      margin: 0 auto;
      background: white;
    }

    /* Top Grid Header */
    .header-container {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 25px;
      padding-bottom: 10px;
    }

    .meta-identity {
      flex: 1;
      padding-right: 20px;
    }

    .name {
      font-size: ${nameFontSize};
      font-weight: 800;
      color: ${currentTheme.primary};
      text-transform: uppercase;
      letter-spacing: 0.5px;
      line-height: 1.1;
      margin-bottom: 6px;
    }

    .role-title {
      font-size: ${headingFontSize};
      font-weight: 700;
      color: #111111;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .contact-pane {
      display: flex;
      flex-direction: column;
      gap: 8px;
      flex-shrink: 0;
    }

    .contact-row {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      font-size: ${smallerFontSize};
      color: #222222;
      text-align: right;
    }

    .contact-row a {
      color: #222222;
      text-decoration: none;
    }

    .icon-bubble {
      background-color: ${currentTheme.primary};
      color: #ffffff;
      width: 22px;
      height: 22px;
      border-radius: 50%;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      margin-left: 10px;
    }

    /* Section Typography */
    .section {
      margin-top: 25px;
      margin-bottom: 15px;
    }

    .section-header {
      display: flex;
      align-items: center;
      gap: 12px;
      border-bottom: 2px solid ${currentTheme.primary};
      padding-bottom: 6px;
      margin-bottom: 15px;
      width: 100%;
    }

    .section-icon {
      background-color: ${currentTheme.primary};
      color: #ffffff;
      width: 28px;
      height: 28px;
      border-radius: 50%;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .section-title {
      font-size: ${headingFontSize};
      font-weight: 700;
      text-transform: uppercase;
      color: ${currentTheme.primary};
      letter-spacing: 0.5px;
    }

    .summary-text {
      font-size: ${bodyFontSize};
      color: #222222;
      line-height: 1.5;
      text-align: justify;
    }

    .entry-block {
      margin-bottom: 20px;
      page-break-inside: avoid;
    }

    .entry-meta-row {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      margin-bottom: 4px;
    }

    .entry-primary-line {
      font-size: ${bodyFontSize};
      font-weight: 700;
      color: #111111;
    }

    .entry-primary-line span.divider-dash {
      font-weight: 400;
      color: #555555;
      margin: 0 4px;
    }

    .entry-primary-line span.subtitle-context {
      font-weight: 400;
      color: #111111;
    }

    .entry-date {
      font-size: ${smallFontSize};
      color: #111111;
      font-weight: 500;
      white-space: nowrap;
    }

    .bullet-list {
      margin-left: 16px;
      margin-top: 5px;
      list-style-type: disc;
    }

    .bullet-list li {
      font-size: ${smallFontSize};
      color: #222222;
      margin-bottom: 5px;
      line-height: 1.4;
      text-align: justify;
    }

    .skills-list {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-top: 10px;
    }

    .skill-tag {
      background: #f0f0f0;
      padding: 4px 12px;
      border-radius: 4px;
      font-size: ${smallerFontSize};
      color: #555555;
    }

    @media print {
      body { padding: 0; }
      .section-header { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      .icon-bubble, .section-icon { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    }
  </style>
</head>
<body>
<div class="page">

  <!-- HEADER SECTION -->
  <div class="header-container" id="section-header" data-section="header">
    <div class="meta-identity">
      <div class="name">${personal.name || "Your Name "}</div>
      ${personal?.role &&
      !["undefined", "null"].includes(String(personal.role).toLowerCase())
      ? `<div class="role-title">${personal.role}</div>`
      : ""
    }
    </div>
    
    <div class="contact-pane">
      ${(() => {
        const addressString = personal.location || personal.fullAddress || "";
        const linkedinProfile = socialProfiles?.find((p: any) => 
          String(p.network || p.platform).toLowerCase().includes("linkedin") || 
          String(p.url).toLowerCase().includes("linkedin")
        );
        const linkedinUrl = personal.linkedinUrl || linkedinProfile?.url || linkedinProfile?.username || "";
        const cleanLinkedinLabel = linkedinUrl ? linkedinUrl.replace(/^(https?:\/\/)?(www\.)?/, "") : "";
        
        const items = [];
        if (personal.phone) {
          items.push(`
            <div class="contact-row">
              <span>${personal.phone}</span>
              <span class="icon-bubble">${icons.phone}</span>
            </div>
          `);
        }
        if (personal.email) {
          items.push(`
            <div class="contact-row">
              <span><a href="mailto:${personal.email}">${personal.email}</a></span>
              <span class="icon-bubble">${icons.email}</span>
            </div>
          `);
        }
        if (personal.dob) {
          items.push(`
            <div class="contact-row">
              <span>DOB: ${personal.dob}</span>
              <span class="icon-bubble">${icons.calendar}</span>
            </div>
          `);
          if (linkedinUrl) {
            items.push(`
              <div class="contact-row">
                <span><a href="${linkedinUrl}" target="_blank">${cleanLinkedinLabel}</a></span>
                <span class="icon-bubble">${icons.linkedin}</span>
              </div>
            `);
          } else if (addressString) {
            items.push(`
              <div class="contact-row">
                <span>${addressString}</span>
                <span class="icon-bubble">${icons.location}</span>
              </div>
            `);
          }
        } else {
          if (linkedinUrl) {
            items.push(`
              <div class="contact-row">
                <span><a href="${linkedinUrl}" target="_blank">${cleanLinkedinLabel}</a></span>
                <span class="icon-bubble">${icons.linkedin}</span>
              </div>
            `);
          } else if (addressString) {
            items.push(`
              <div class="contact-row">
                <span>${addressString}</span>
                <span class="icon-bubble">${icons.location}</span>
              </div>
            `);
          }
        }
        return items.join("");
      })()}
    </div>
  </div>

  <!-- AVAILABILITY & WORK AUTH SECTION -->
  ${availabilityWorkAuth && hasObjectValues(availabilityWorkAuth) ? `
  <div class="section" id="section-availability" data-section="availability">
    <div class="section-header">
      <span class="section-icon">${icons.clock}</span>
      <span class="section-title">Availability</span>
    </div>
    <div class="skills-list">
      ${availabilityWorkAuth.availabilityNoticePeriod ? `<span class="skill-tag">Notice: ${availabilityWorkAuth.availabilityNoticePeriod}</span>` : ''}
      ${availabilityWorkAuth.workAuthorizationStatus ? `<span class="skill-tag">Work Auth: ${availabilityWorkAuth.workAuthorizationStatus}</span>` : ''}
      ${availabilityWorkAuth.preferredLocation ? `<span class="skill-tag">Preferred: ${availabilityWorkAuth.preferredLocation}</span>` : ''}
    </div>
  </div>` : ""}


  <!-- PROFESSIONAL SUMMARY SECTION -->
  ${summary && summary.trim() ? `
  <div class="section" id="section-summary" data-section="summary">
    <div class="section-header">
      <span class="section-icon">${icons.userIcon}</span>
      <span class="section-title">Professional Summary</span>
    </div>
    <p class="summary-text">${summary}</p>
  </div>` : ""}

  <!-- CAREER OBJECTIVE SECTION -->
  ${careerObjective && careerObjective.trim() && (!summary || !summary.trim()) ? `
  <div class="section" id="section-careerObjective" data-section="careerObjective">
    <div class="section-header">
      <span class="section-icon">${icons.bullseye}</span>
      <span class="section-title">Career Objective</span>
    </div>
    <p class="summary-text">${careerObjective}</p>
  </div>` : ""}


    


  <!-- EXPERIENCE SECTION -->
  ${nonEmptyExperience.length > 0 ? `
  <div class="section" id="section-experience" data-section="experience">
    <div class="section-header">
      <span class="section-icon">${icons.briefcase}</span>
      <span class="section-title">Experience</span>
    </div>
    ${nonEmptyExperience.map((exp, idx) => {
        const dateRange = formatDateRange(exp.startDate, exp.endDate, exp.isCurrent);
        const compositeSub = [exp.company, exp.location].filter(Boolean).join(", ");
        return `
      <div class="entry-block" data-index="${idx}">
        <div class="entry-meta-row">
          <div class="entry-primary-line">
            ${exp.title || ""}
            ${compositeSub ? `<span class="divider-dash">–</span><span class="subtitle-context">${compositeSub}</span>` : ""}
          </div>
          ${dateRange ? `<div class="entry-date">${dateRange}</div>` : ""}
        </div>
        ${exp.description ? renderDescription(exp.description) : ""}
        ${exp.achievements ? `<div class="entry-content" style="font-size: ${smallFontSize}; margin-left: 16px; margin-top: 5px; text-align: justify; color: #222222; line-height: 1.4;"><strong>Achievements:</strong> ${exp.achievements}</div>` : ""}
      </div>
    `}).join("")}
  </div>` : ""}



  <!-- SKILLS SECTION -->
  ${skillsArray.length > 0 ? `
  <div class="section" id="section-skills" data-section="skills">
    <div class="section-header">
      <span class="section-icon">${icons.wrench}</span>
      <span class="section-title">Skills</span>
    </div>
    <div class="skills-list">
      ${skillsArray.map((skill) => `<span class="skill-tag">${skill}</span>`).join("")}
    </div>
  </div>` : ""}

  <!-- CORE COMPETENCIES SECTION -->
  ${coreCompetenciesArray.length > 0 ? `
  <div class="section" id="section-coreCompetencies" data-section="coreCompetencies">
    <div class="section-header">
      <span class="section-icon">${icons.star}</span>
      <span class="section-title">Core Competencies</span>
    </div>
    <div class="skills-list">
      ${coreCompetenciesArray.map((comp) => `<span class="skill-tag">${comp}</span>`).join("")}
    </div>
  </div>` : ""}

  <!-- TOOLS & TECHNOLOGIES SECTION -->
  ${nonEmptyToolsTechnologies.length > 0 ? `
  <div class="section" id="section-toolsTechnologies" data-section="toolsTechnologies">
    <div class="section-header">
      <span class="section-icon">${icons.chip}</span>
      <span class="section-title">Tools & Technologies</span>
    </div>
    <div class="skills-list">
      ${nonEmptyToolsTechnologies.map((item) => `<span class="skill-tag">${item.name || ''}${item.proficiency ? ` (${item.proficiency})` : ''}</span>`).join("")}
    </div>
  </div>` : ""}

  <!-- LANGUAGES SECTION -->
  ${nonEmptyLanguages.length > 0 ? `
  <div class="section" id="section-languages" data-section="languages">
    <div class="section-header">
      <span class="section-icon">${icons.language}</span>
      <span class="section-title">Languages</span>
    </div>
    <div class="skills-list">
      ${nonEmptyLanguages.map((lang) => `<span class="skill-tag">${lang.language || lang}${lang.proficiency ? ` (${lang.proficiency})` : ''}</span>`).join("")}
    </div>
  </div>` : ""}

  

  <!-- PROJECTS SECTION -->
  ${nonEmptyProjects.length > 0 ? `
  <div class="section" id="section-projects" data-section="projects">
    <div class="section-header">
      <span class="section-icon">${icons.project}</span>
      <span class="section-title">Projects</span>
    </div>
    ${nonEmptyProjects.map((project, idx) => `
      <div class="entry-block" data-index="${idx}">
        <div class="entry-meta-row">
          <div class="entry-primary-line">${project.name || project.title || ''}</div>
          ${project.duration ? `<div class="entry-date">${project.duration}</div>` : ""}
        </div>
        ${project.role ? `<div style="font-size: 10pt; color: #333333;">Role: ${project.role}</div>` : ""}
        ${project.description ? renderDescription(project.description) : ''}
        ${project.technologies ? `<div style="font-size: 9.5pt; color: #555555; margin-top: 5px;"><strong>Technologies:</strong> ${project.technologies}</div>` : ''}
      </div>
    `).join("")}
  </div>` : ""}

  <!-- INTERNSHIPS SECTION -->
  ${nonEmptyInternships.length > 0 ? `
  <div class="section" id="section-internships" data-section="internships">
    <div class="section-header">
      <span class="section-icon">${icons.chalkboard}</span>
      <span class="section-title">Internships</span>
    </div>
    ${nonEmptyInternships.map((item, idx) => `
      <div class="entry-block" data-index="${idx}">
        <div class="entry-meta-row">
          <div class="entry-primary-line">${item.title || item.role || ''}</div>
          <div class="entry-date">${item.duration || formatDateRange(item.startDate, item.endDate)}</div>
        </div>
        <div style="font-size: ${smallFontSize}; color: #333333;">${formatSubtitle([item.company, item.location])}</div>
        ${item.description ? renderDescription(item.description) : ''}
      </div>
    `).join("")}
  </div>` : ""}

  <!-- TRAINING PROGRAMS SECTION -->
  ${nonEmptyTrainingPrograms.length > 0 ? `
  <div class="section" id="section-trainingPrograms" data-section="trainingPrograms">
    <div class="section-header">
      <span class="section-icon">${icons.certificate}</span>
      <span class="section-title">Training Programs</span>
    </div>
    ${nonEmptyTrainingPrograms.map((item, idx) => `
      <div class="entry-block" data-index="${idx}">
        <div class="entry-meta-row">
          <div class="entry-primary-line">${item.name || item.title || ''}</div>
          ${item.completionDate ? `<div class="entry-date">${item.completionDate}</div>` : ''}
        </div>
        <div style="font-size: ${smallFontSize}; color: #333333;">${item.provider || item.organization || ''}</div>
        ${item.description ? `<div class="summary-text">${item.description}</div>` : ''}
      </div>
    `).join("")}
  </div>` : ""}

  <!-- ACADEMIC PROJECTS SECTION -->
  ${nonEmptyAcademicProjects.length > 0 ? `
  <div class="section" id="section-academicProjects" data-section="academicProjects">
    <div class="section-header">
      <span class="section-icon">${icons.flask}</span>
      <span class="section-title">Academic Projects</span>
    </div>
    ${nonEmptyAcademicProjects.map((item, idx) => `
      <div class="entry-block" data-index="${idx}">
        <div class="entry-meta-row">
          <div class="entry-primary-line">${item.name || item.title || ''}</div>
          ${item.duration ? `<div class="entry-date">${item.duration}</div>` : ''}
        </div>
        <div style="font-size: 10pt; color: #333333;">${item.institution || ''}${item.course ? ` - ${item.course}` : ''}</div>
        ${item.description ? renderDescription(item.description) : ''}
        ${item.technologies ? `<div style="font-size: 9.5pt; color: #555555;"><strong>Technologies:</strong> ${Array.isArray(item.technologies) ? item.technologies.join(', ') : item.technologies}</div>` : ''}
        ${item.url ? `<div style="margin-top: 5px;"><a href="${item.url}" target="_blank">${item.url}</a></div>` : ''}
      </div>
    `).join("")}
  </div>` : ""}


  <!-- EDUCATION SECTION -->
  ${nonEmptyEducation.length > 0 ? `
  <div class="section" id="section-education" data-section="education">
    <div class="section-header">
      <span class="section-icon">${icons.graduation}</span>
      <span class="section-title">Education</span>
    </div>
    ${nonEmptyEducation.map((edu, idx) => {
      const eduDate = edu.graduationDate || formatDateRange(edu.startDate || edu.startYear, edu.endDate || edu.endYear);
      const schoolContext = formatSubtitle([edu.school, edu.location]);
      return `
      <div class="entry-block" data-index="${idx}">
        <div class="entry-meta-row">
          <div class="entry-primary-line">${edu.degree || ""}${edu.field ? ` – ${edu.field}` : ""}</div>
          ${eduDate ? `<div class="entry-date">${eduDate}</div>` : ""}
        </div>
        ${schoolContext ? `<div style="font-size: ${smallFontSize}; color: #333333;">${schoolContext}</div>` : ""}
        ${edu.grade ? `<div style="font-size: ${smallerFontSize}; color: #444444; font-weight: 500; margin-top: 2px;">${edu.grade}</div>` : ""}
        ${edu.description ? `<div class="summary-text" style="margin-top: 5px;">${edu.description}</div>` : ""}
      </div>
    `}).join("")}
  </div>` : ""}

  <!-- LEADERSHIP POSITIONS SECTION -->
  ${nonEmptyLeadershipPositions.length > 0 ? `
  <div class="section" id="section-leadershipPositions" data-section="leadershipPositions">
    <div class="section-header">
      <span class="section-icon">${icons.users}</span>
      <span class="section-title">Leadership Positions</span>
    </div>
    ${nonEmptyLeadershipPositions.map((item, idx) => `
      <div class="entry-block" data-index="${idx}">
        <div class="entry-meta-row">
          <div class="entry-primary-line">${item.position || item.title || ''}</div>
          <div class="entry-date">${formatDateRange(item.startDate, item.endDate)}</div>
        </div>
        <div style="font-size: 10pt; color: #333333;">${item.organization || ''}</div>
        ${item.description ? renderDescription(item.description) : ''}
      </div>
    `).join("")}
  </div>` : ""}

  <!-- CO-CURRICULAR SECTION -->
  ${nonEmptyCoCurricular.length > 0 ? `
  <div class="section" id="section-coCurricular" data-section="coCurricular">
    <div class="section-header">
      <span class="section-icon">${icons.palette}</span>
      <span class="section-title">Co-curricular Activities</span>
    </div>
    ${nonEmptyCoCurricular.map((item, idx) => `
      <div class="entry-block" data-index="${idx}">
        <div class="entry-meta-row">
          <div class="entry-primary-line">${item.activity || ''}</div>
          ${item.year ? `<div class="entry-date">${item.year}</div>` : ''}
        </div>
        ${item.role ? `<div style="font-size: 10pt; color: #333333;">Role: ${item.role}</div>` : ''}
        ${item.description ? `<div class="summary-text">${item.description}</div>` : ''}
      </div>
    `).join("")}
  </div>` : ""}

  <!-- EXTRACURRICULAR SECTION -->
  ${nonEmptyExtracurricular.length > 0 ? `
  <div class="section" id="section-extracurricular" data-section="extracurricular">
    <div class="section-header">
      <span class="section-icon">${icons.football}</span>
      <span class="section-title">Extracurricular Activities</span>
    </div>
    ${nonEmptyExtracurricular.map((item, idx) => `
      <div class="entry-block" data-index="${idx}">
        <div class="entry-meta-row">
          <div class="entry-primary-line">${item.activity || ''}</div>
          ${item.year ? `<div class="entry-date">${item.year}</div>` : ''}
        </div>
        ${item.role ? `<div style="font-size: 10pt; color: #333333;">Role: ${item.role}</div>` : ''}
        ${item.description ? `<div class="summary-text">${item.description}</div>` : ''}
      </div>
    `).join("")}
  </div>` : ""}



  <!-- CERTIFICATIONS SECTION -->
  ${nonEmptyCertifications.length > 0 ? `
  <div class="section" id="section-certifications" data-section="certifications">
    <div class="section-header">
      <span class="section-icon">${icons.certificate}</span>
      <span class="section-title">Certifications</span>
    </div>
    <ul class="bullet-list">
      ${nonEmptyCertifications.map((cert, idx) => `
        <li data-index="${idx}"><strong>${cert.name || cert.title || ''}</strong>${cert.issuer ? ` – ${cert.issuer}` : ""}${cert.date ? ` (${cert.date})` : ""}</li>
      `).join("")}
    </ul>
  </div>` : ""}

  <!-- SCHOLARSHIPS SECTION -->
  ${nonEmptyScholarships.length > 0 ? `
  <div class="section" id="section-scholarships" data-section="scholarships">
    <div class="section-header">
      <span class="section-icon">${icons.trophy}</span>
      <span class="section-title">Scholarships</span>
    </div>
    ${nonEmptyScholarships.map((item, idx) => `
      <div class="entry-block" data-index="${idx}">
        <div class="entry-meta-row">
          <div class="entry-primary-line">${item.name || ''}</div>
          ${item.year ? `<div class="entry-date">${item.year}</div>` : ''}
        </div>
        <div style="font-size: 10pt; color: #333333;">${item.provider || item.organization || ''}</div>
        ${item.description ? `<div class="summary-text">${item.description}</div>` : ''}
      </div>
    `).join("")}
  </div>` : ""}

  <!-- AWARDS SECTION -->
  ${nonEmptyAwards.length > 0 ? `
  <div class="section" id="section-awards" data-section="awards">
    <div class="section-header">
      <span class="section-icon">${icons.medal}</span>
      <span class="section-title">Awards & Recognition</span>
    </div>
    ${nonEmptyAwards.map((item, idx) => `
      <div class="entry-block" data-index="${idx}">
        <div class="entry-meta-row">
          <div class="entry-primary-line">${item.title || ''}</div>
          ${item.issueYear || item.year ? `<div class="entry-date">${item.issueYear || item.year}</div>` : ''}
        </div>
        <div style="font-size: 10pt; color: #333333;">${item.organization || ''}</div>
        ${item.description ? `<div class="summary-text">${item.description}</div>` : ''}
      </div>
    `).join("")}
  </div>` : ""}

  <!-- SPEAKING ENGAGEMENTS SECTION -->
  ${nonEmptySpeakingEngagements.length > 0 ? `
  <div class="section" id="section-speakingEngagements" data-section="speakingEngagements">
    <div class="section-header">
      <span class="section-icon">${icons.microphone}</span>
      <span class="section-title">Speaking Engagements</span>
    </div>
    ${nonEmptySpeakingEngagements.map((item, idx) => `
      <div class="entry-block" data-index="${idx}">
        <div class="entry-meta-row">
          <div class="entry-primary-line">${item.topic || ''}</div>
          ${item.date ? `<div class="entry-date">${item.date}</div>` : ''}
        </div>
        <div style="font-size: 10pt; color: #333333;">${item.eventName || ''}</div>
        ${item.description ? `<div class="summary-text">${item.description}</div>` : ''}
      </div>
    `).join("")}
  </div>` : ""}

  <!-- MEMBERSHIPS SECTION -->
  ${nonEmptyMemberships.length > 0 ? `
  <div class="section" id="section-memberships" data-section="memberships">
    <div class="section-header">
      <span class="section-icon">${icons.handshake}</span>
      <span class="section-title">Memberships</span>
    </div>
    ${nonEmptyMemberships.map((item, idx) => `
      <div class="entry-block" data-index="${idx}">
        <div class="entry-meta-row">
          <div class="entry-primary-line">${item.membershipName || item.name || ''}</div>
          ${item.year ? `<div class="entry-date">${item.year}</div>` : ''}
        </div>
        <div style="font-size: 10pt; color: #333333;">${item.organizationName || item.organization || ''}</div>
        ${item.description ? `<div class="summary-text">${item.description}</div>` : ''}
      </div>
    `).join("")}
  </div>` : ""}

  <!-- WORKSHOPS SECTION -->
  ${nonEmptyWorkshops.length > 0 ? `
  <div class="section" id="section-workshops" data-section="workshops">
    <div class="section-header">
      <span class="section-icon">${icons.chalkboard}</span>
      <span class="section-title">Workshops</span>
    </div>
    ${nonEmptyWorkshops.map((item, idx) => `
      <div class="entry-block" data-index="${idx}">
        <div class="entry-meta-row">
          <div class="entry-primary-line">${item.programTitle || item.title || ''}</div>
          ${item.year ? `<div class="entry-date">${item.year}</div>` : ''}
        </div>
        <div style="font-size: 10pt; color: #333333;">${item.conductedBy || ''}</div>
        ${item.description ? `<div class="summary-text">${item.description}</div>` : ''}
      </div>
    `).join("")}
  </div>` : ""}

  <!-- CLIENT PROJECTS SECTION -->
  ${nonEmptyClientProjects.length > 0 ? `
  <div class="section" id="section-clientProjects" data-section="clientProjects">
    <div class="section-header">
      <span class="section-icon">${icons.briefcase}</span>
      <span class="section-title">Client Projects</span>
    </div>
    ${nonEmptyClientProjects.map((item, idx) => `
      <div class="entry-block" data-index="${idx}">
        <div class="entry-meta-row">
          <div class="entry-primary-line">${item.name || ''}</div>
          ${item.duration ? `<div class="entry-date">${item.duration}</div>` : ''}
        </div>
        <div style="font-size: 10pt; color: #333333;">${item.clientOrganization || ''}${item.role ? ` - ${item.role}` : ''}</div>
        ${item.description ? renderDescription(item.description) : ''}
        ${item.toolsTechnologies ? `<div style="font-size: 9.5pt; color: #555555; margin-top: 5px;"><strong>Tools:</strong> ${item.toolsTechnologies}</div>` : ''}
        ${item.projectUrl ? `<div style="margin-top: 5px;"><a href="${item.projectUrl}" target="_blank">${item.projectUrl}</a></div>` : ''}
      </div>
    `).join("")}
  </div>` : ""}

  <!-- PORTFOLIO SECTION -->
  ${nonEmptyPortfolio.length > 0 ? `
  <div class="section" id="section-portfolio" data-section="portfolio">
    <div class="section-header">
      <span class="section-icon">${icons.card}</span>
      <span class="section-title">Portfolio</span>
    </div>
    ${nonEmptyPortfolio.map((item, idx) => `
      <div class="entry-block" data-index="${idx}">
        <div class="entry-meta-row">
          <div class="entry-primary-line">${item.name || ''}</div>
        </div>
        <div style="font-size: 10pt; color: #333333;">${item.type || ''}${item.platform ? ` on ${item.platform}` : ''}</div>
        ${item.url ? `<div><a href="${item.url}" target="_blank">${item.url}</a></div>` : ''}
        ${item.description ? `<div class="summary-text">${item.description}</div>` : ''}
      </div>
    `).join("")}
  </div>` : ""}

  <!-- VOLUNTEERING SECTION -->
  ${nonEmptyVolunteering.length > 0 ? `
  <div class="section" id="section-volunteering" data-section="volunteering">
    <div class="section-header">
      <span class="section-icon">${icons.handHeart}</span>
      <span class="section-title">Volunteering</span>
    </div>
    ${nonEmptyVolunteering.map((item, idx) => `
      <div class="entry-block" data-index="${idx}">
        <div class="entry-meta-row">
          <div class="entry-primary-line">${item.role || ''}</div>
          <div class="entry-date">${item.duration || formatDateRange(item.startDate, item.endDate)}</div>
        </div>
        <div style="font-size: 10pt; color: #333333;">${item.organization || ''}${item.causeArea ? ` - ${item.causeArea}` : ''}</div>
        ${item.description ? renderDescription(item.description) : ''}
      </div>
    `).join("")}
  </div>` : ""}

  <!-- MILITARY SERVICE SECTION -->
  ${nonEmptyMilitaryService.length > 0 ? `
  <div class="section" id="section-militaryService" data-section="militaryService">
    <div class="section-header">
      <span class="section-icon">${icons.shield}</span>
      <span class="section-title">Military Service</span>
    </div>
    ${nonEmptyMilitaryService.map((item, idx) => `
      <div class="entry-block" data-index="${idx}">
        <div class="entry-meta-row">
          <div class="entry-primary-line">${item.branch ? item.branch : ''}${item.rank ? ` - ${item.rank}` : ''}</div>
          <div class="entry-date">${item.duration || formatDateRange(item.startDate, item.endDate)}</div>
        </div>
        ${item.specialization ? `<div style="font-size: 10pt; color: #333333;">Specialization: ${item.specialization}</div>` : ''}
        ${item.description ? renderDescription(item.description) : ''}
      </div>
    `).join("")}
  </div>` : ""}

  <!-- METHODOLOGIES SECTION -->
  ${nonEmptyMethodologies.length > 0 ? `
  <div class="section" id="section-methodologies" data-section="methodologies">
    <div class="section-header">
      <span class="section-icon">${icons.diagram}</span>
      <span class="section-title">Methodologies</span>
    </div>
    <div class="skills-list">
      ${nonEmptyMethodologies.map((item, idx) => `<span class="skill-tag" data-index="${idx}">${item.name || ''}${item.certification ? ` (${item.certification})` : ''}</span>`).join("")}
    </div>
  </div>` : ""}

  <!-- INDUSTRY EXPERTISE SECTION -->
  ${nonEmptyIndustryExpertise.length > 0 ? `
  <div class="section" id="section-industryExpertise" data-section="industryExpertise">
    <div class="section-header">
      <span class="section-icon">${icons.building}</span>
      <span class="section-title">Industry Expertise</span>
    </div>
    <div class="skills-list">
      ${nonEmptyIndustryExpertise.map((item, idx) => `<span class="skill-tag" data-index="${idx}">${item.industry || ''}${item.domainArea ? ` - ${item.domainArea}` : ''}</span>`).join("")}
    </div>
  </div>` : ""}

  <!-- TEACHING EXPERIENCE SECTION -->
  ${nonEmptyTeachingExperience.length > 0 ? `
  <div class="section" id="section-teachingExperience" data-section="teachingExperience">
    <div class="section-header">
      <span class="section-icon">${icons.chalkboard}</span>
      <span class="section-title">Teaching Experience</span>
    </div>
    ${nonEmptyTeachingExperience.map((item, idx) => `
      <div class="entry-block" data-index="${idx}">
        <div class="entry-meta-row">
          <div class="entry-primary-line">${item.subjectCourseTaught || item.title || ''}</div>
          <div class="entry-date">${item.duration || formatDateRange(item.startDate, item.endDate)}</div>
        </div>
        <div style="font-size: 10pt; color: #333333;">${item.institution || ''}</div>
        ${item.description ? renderDescription(item.description) : ''}
      </div>
    `).join("")}
  </div>` : ""}

  <!-- MENTORSHIP EXPERIENCE SECTION -->
  ${nonEmptyMentorshipExperience.length > 0 ? `
  <div class="section" id="section-mentorshipExperience" data-section="mentorshipExperience">
    <div class="section-header">
      <span class="section-icon">${icons.users}</span>
      <span class="section-title">Mentorship Experience</span>
    </div>
    ${nonEmptyMentorshipExperience.map((item, idx) => `
      <div class="entry-block" data-index="${idx}">
        <div class="entry-meta-row">
          <div class="entry-primary-line">${item.mentorshipArea || ''}</div>
          <div class="entry-date">${item.duration || formatDateRange(item.startDate, item.endDate)}</div>
        </div>
        <div style="font-size: 10pt; color: #333333;">${item.organizationPlatform || ''}${item.menteeLevel ? ` - ${item.menteeLevel}` : ''}</div>
        ${item.description ? renderDescription(item.description) : ''}
      </div>
    `).join("")}
  </div>` : ""}

  <!-- RESEARCH GRANTS SECTION -->
  ${nonEmptyResearchGrants.length > 0 ? `
  <div class="section" id="section-researchGrants" data-section="researchGrants">
    <div class="section-header">
      <span class="section-icon">${icons.flask}</span>
      <span class="section-title">Research Grants</span>
    </div>
    ${nonEmptyResearchGrants.map((item, idx) => `
      <div class="entry-block" data-index="${idx}">
        <div class="entry-meta-row">
          <div class="entry-primary-line">${item.title || ''}</div>
          ${item.year ? `<div class="entry-date">${item.year}</div>` : ''}
        </div>
        <div style="font-size: 10pt; color: #333333;">${item.agency || ''}${item.amount ? ` | Amount: ${item.amount}` : ''}</div>
        ${item.description ? `<div class="summary-text">${item.description}</div>` : ''}
      </div>
    `).join("")}
  </div>` : ""}

  <!-- TEST SCORES SECTION -->
  ${nonEmptyTestScores.length > 0 ? `
  <div class="section" id="section-testScores" data-section="testScores">
    <div class="section-header">
      <span class="section-icon">${icons.chart}</span>
      <span class="section-title">Test Scores</span>
    </div>
    ${nonEmptyTestScores.map((item, idx) => `
      <div class="entry-block" data-index="${idx}">
        <div class="entry-meta-row">
          <div class="entry-primary-line">${item.testName || ''}</div>
          ${item.year ? `<div class="entry-date">${item.year}</div>` : ''}
        </div>
        <div style="font-size: 10pt; color: #333333;">Score: ${item.score || ''}${item.percentileRank ? ` (${item.percentileRank} percentile)` : ''}</div>
      </div>
    `).join("")}
  </div>` : ""}

  <!-- PUBLICATIONS SECTION -->
  ${nonEmptyPublications.length > 0 ? `
  <div class="section" id="section-publications" data-section="publications">
    <div class="section-header">
      <span class="section-icon">${icons.book}</span>
      <span class="section-title">Publications</span>
    </div>
    ${nonEmptyPublications.map((item, idx) => `
      <div class="entry-block" data-index="${idx}">
        <div class="entry-meta-row">
          <div class="entry-primary-line">${item.title || ''}</div>
          ${item.year ? `<div class="entry-date">${item.year}</div>` : ''}
        </div>
        <div style="font-size: 10pt; color: #333333;">${item.journalPublisher || ''}${item.publicationType ? ` (${item.publicationType})` : ''}</div>
        ${item.urlDoi ? `<div><a href="${item.urlDoi}" target="_blank">${item.urlDoi}</a></div>` : ''}
      </div>
    `).join("")}
  </div>` : ""}

  <!-- PATENTS SECTION -->
  ${nonEmptyPatents.length > 0 ? `
  <div class="section" id="section-patents" data-section="patents">
    <div class="section-header">
      <span class="section-icon">${icons.file}</span>
      <span class="section-title">Patents</span>
    </div>
    ${nonEmptyPatents.map((item, idx) => `
      <div class="entry-block" data-index="${idx}">
        <div class="entry-meta-row">
          <div class="entry-primary-line">${item.title || ''}</div>
          ${item.year ? `<div class="entry-date">${item.year}</div>` : ''}
        </div>
        <div style="font-size: 10pt; color: #333333;">${item.patentNumber ? `Patent #: ${item.patentNumber}` : ''}${item.issuingAuthority ? ` | ${item.issuingAuthority}` : ''}</div>
        ${item.status ? `<div style="font-size: 9.5pt; color: #555555;"><strong>Status:</strong> ${item.status}</div>` : ''}
      </div>
    `).join("")}
  </div>` : ""}

  <!-- REFERENCES SECTION -->
  ${nonEmptyReferences.length > 0 ? `
  <div class="section" id="section-references" data-section="references">
    <div class="section-header">
      <span class="section-icon">${icons.card}</span>
      <span class="section-title">References</span>
    </div>
    ${nonEmptyReferences.map((item, idx) => `
      <div class="entry-block" data-index="${idx}">
        <div class="entry-meta-row">
          <div class="entry-primary-line">${item.name || ''}</div>
        </div>
        <div style="font-size: 10pt; color: #333333;">${item.designationRelationship || ''}${item.organization ? ` at ${item.organization}` : ''}</div>
        ${item.contactInformation ? `<div class="summary-text" style="margin-top: 5px;">${item.contactInformation}</div>` : ''}
      </div>
    `).join("")}
  </div>` : ""}

  <!-- HOBBIES SECTION -->
  ${nonEmptyHobbies.length > 0 ? `
  <div class="section" id="section-hobbies" data-section="hobbies">
    <div class="section-header">
      <span class="section-icon">${icons.heartIcon}</span>
      <span class="section-title">Hobbies & Interests</span>
    </div>
    <div class="skills-list">
      ${nonEmptyHobbies.map((hobby, idx) => `<span class="skill-tag" data-index="${idx}">${typeof hobby === "string" ? hobby.trim() : hobby}</span>`).join("")}
    </div>
  </div>` : ""}

  <!-- SOCIAL PROFILES SECTION -->
  ${nonEmptySocialProfiles.length > 0 ? `
  <div class="section" id="section-socialProfiles" data-section="socialProfiles">
    <div class="section-header">
      <span class="section-icon">${icons.share}</span>
      <span class="section-title">Social Profiles</span>
    </div>
    <div class="skills-list">
      ${nonEmptySocialProfiles.map((profile, idx) => `<a href="${profile.url}" target="_blank" style="color: ${currentTheme.primary}; text-decoration: none; margin-right: 10px;" data-index="${idx}"><span class="skill-tag">${profile.platform || profile.network || 'Profile'}</span></a>`).join("")}
    </div>
  </div>` : ""}

</div>
</body>
</html>`;
}