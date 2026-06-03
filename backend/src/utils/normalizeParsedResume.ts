export function normalizeParsedResume(parsed: any) {
  if (!parsed) parsed = {};

  // Helper function to safely get string value
  // Helper function to safely get string value
function safeString(value: any): string | null {
  if (value === null || value === undefined) return null;
  if (typeof value === 'string') return value;
  if (typeof value === 'number') return value.toString();
  if (typeof value === 'object') {
    // If it's an object with a text property, use that
    if (value.text && typeof value.text === 'string') {
      return value.text;
    }
    // If it's an object with a value property, use that
    if (value.value && typeof value.value === 'string') {
      return value.value;
    }
    // Otherwise return null (don't try to trim objects)
    return null;
  }
  return null;
}

  // Helper function to convert object with numeric keys to array
  function objectToArray(obj: any): any[] {
    if (!obj || typeof obj !== 'object' || Array.isArray(obj)) return obj;
    
    const keys = Object.keys(obj);
    if (keys.length === 0) return [];
    
    // If all keys are numeric, convert to array
    const allNumeric = keys.every(key => !isNaN(Number(key)));
    if (allNumeric) {
      return Object.values(obj);
    }
    
    return obj;
  }

  // Helper function to remove empty fields from objects
  function removeEmptyFields(obj: any): any {
    if (!obj || typeof obj !== 'object') return obj;
    
    if (Array.isArray(obj)) {
      const filtered = obj
        .map(item => removeEmptyFields(item))
        .filter(item => {
          if (item === null || item === undefined) return false;
          if (typeof item === 'object' && Object.keys(item).length === 0) return false;
          if (typeof item === 'string' && item.trim() === '') return false;
          return true;
        });
      return filtered.length > 0 ? filtered : undefined;
    }
    
    const cleaned: any = {};
    for (const [key, value] of Object.entries(obj)) {
      // Skip id fields - they should come from the source data, not be generated
      if (key === 'id' || key === '_id') {
        // Only keep id if it looks like a real ID (not a title)
        if (value && typeof value === 'string' && 
            (value.includes('-') || /^[a-f0-9]{24}$/.test(value))) {
          cleaned[key] = value;
        }
        continue;
      }
      
      if (value === null || value === undefined) continue;
      
      if (typeof value === 'object') {
        const cleanedValue = removeEmptyFields(value);
        if (cleanedValue && 
            (typeof cleanedValue === 'object' && Object.keys(cleanedValue).length > 0) ||
            (Array.isArray(cleanedValue) && cleanedValue.length > 0)) {
          cleaned[key] = cleanedValue;
        }
      } else if (typeof value === 'string' && value.trim() !== '') {
        cleaned[key] = value;
      } else if (typeof value !== 'string') {
        // Keep non-string values (numbers, booleans)
        cleaned[key] = value;
      }
    }
    return Object.keys(cleaned).length > 0 ? cleaned : undefined;
  }

  // Helper function to check if an object has any meaningful data
  function hasData(obj: any): boolean {
    if (!obj || typeof obj !== 'object') return false;
    
    return Object.values(obj).some(value => {
      if (value === null || value === undefined) return false;
      if (typeof value === 'string' && value.trim() === '') return false;
      if (Array.isArray(value) && value.length === 0) return false;
      if (typeof value === 'object' && Object.keys(value).length === 0) return false;
      return true;
    });
  }

  // Ensure parsed.data exists
  const source = parsed.data || parsed;

  const normalized: any = {};

  // Personal
  if (source.personal && Object.keys(source.personal).length > 0) {
    const personal: any = {};
    if (source.personal.name) personal.name = safeString(source.personal.name);
    if (source.personal.email) personal.email = safeString(source.personal.email);
    if (source.personal.phone) personal.phone = safeString(source.personal.phone);
    if (source.personal.dob) personal.dob = safeString(source.personal.dob);
    if (source.personal.gender) personal.gender = safeString(source.personal.gender);
    if (source.personal.middleName) personal.middleName = safeString(source.personal.middleName);
    if (source.personal.alternatePhone || source.personal.alt_phone) {
      personal.alternatePhone = safeString(source.personal.alternatePhone || source.personal.alt_phone);
    }
    if (source.personal.maritalStatus || source.personal.marital_status) {
      personal.maritalStatus = safeString(source.personal.maritalStatus || source.personal.marital_status);
    }
    if (source.personal.fullAddress || source.personal.address) {
      personal.fullAddress = safeString(source.personal.fullAddress || source.personal.address);
    }
    if (source.personal.location) personal.location = safeString(source.personal.location);
    if (source.personal.pinCode) personal.pinCode = safeString(source.personal.pinCode);
    if (source.personal.country) personal.country = safeString(source.personal.country);
    if (source.personal.image) personal.image = safeString(source.personal.image);
    
    if (Object.keys(personal).length > 0) {
      normalized.personal = personal;
    }
  }

  // Career Objective & Summary
// In the normalizeParsedResume function, update the summary section:

// Career Objective & Summary
if (source.careerObjective || source.career_objective) {
  normalized.careerObjective = safeString(source.careerObjective || source.career_objective);
}

// Fix for summary - handle object with text property
if (source.summary || source.professionalSummary) {
  const summary = source.summary || source.professionalSummary;
  
  if (typeof summary === 'string') {
    normalized.summary = summary;
  } else if (summary && typeof summary === 'object') {
    // Check if it has a text property
    if (summary.text && typeof summary.text === 'string') {
      normalized.summary = summary.text;
    } 
    // Check if it has a value property
    else if (summary.value && typeof summary.value === 'string') {
      normalized.summary = summary.value;
    }
    // If it's an array, join it
    else if (Array.isArray(summary)) {
      normalized.summary = summary.join(' ');
    }
    // Otherwise, stringify it (but clean up if it's {text: "..."})
    else {
      const str = JSON.stringify(summary);
      // Try to extract text if it's wrapped in an object
      const textMatch = str.match(/"text":"([^"]+)"/);
      if (textMatch) {
        normalized.summary = textMatch[1];
      } else {
        normalized.summary = str;
      }
    }
  }
}

// Skills - preserve HTML format
if (source.skills) {
  if (typeof source.skills === 'string') {
    // If it's already a string (hopefully HTML), keep it
    normalized.skills = source.skills;
  } 
  else if (Array.isArray(source.skills)) {
    // Handle array of objects like [{name: "java"}, {name: "py"}]
    const skillsList = source.skills
      .map((skill: any) => {
        if (typeof skill === 'string') {
          return skill;
        } else if (skill && typeof skill === 'object') {
          // Try to get the skill name from common properties
          return skill.name || skill.skill || skill.value || Object.values(skill)[0] || null;
        }
        return null;
      })
      .filter((s: string | null) => s !== null);
    
    if (skillsList.length > 0) {
      normalized.skills = '<ul>' + skillsList.map((s: string) => `<li>${s}</li>`).join('') + '</ul>';
    }
  } 
  else if (typeof source.skills === 'object') {
    // Handle object format {java: {}, py: {}}
    const skillsArray = Object.keys(source.skills);
    if (skillsArray.length > 0) {
      normalized.skills = '<ul>' + skillsArray.map(s => `<li>${s}</li>`).join('') + '</ul>';
    }
  }
}

// Core Competencies - preserve HTML format (same as skills)
if (source.coreCompetencies || source.core_competencies) {
  const coreCompSource = source.coreCompetencies || source.core_competencies;
  
  if (typeof coreCompSource === 'string') {
    // If it's already a string (hopefully HTML), keep it
    normalized.coreCompetencies = coreCompSource;
  } 
  else if (Array.isArray(coreCompSource)) {
    // Handle array of objects like [{name: "Strategic Planning"}, {name: "Team Leadership"}]
    const coreCompList = coreCompSource
      .map((comp: any) => {
        if (typeof comp === 'string') {
          return comp;
        } else if (comp && typeof comp === 'object') {
          // Try to get the competency name from common properties
          return comp.name || comp.competency || comp.value || Object.values(comp)[0] || null;
        }
        return null;
      })
      .filter((c: string | null) => c !== null);
    
    if (coreCompList.length > 0) {
      normalized.coreCompetencies = '<ul>' + coreCompList.map((c: string) => `<li>${c}</li>`).join('') + '</ul>';
    }
  } 
  else if (typeof coreCompSource === 'object') {
    // Handle object format {strategicPlanning: {}, teamLeadership: {}}
    const coreCompArray = Object.keys(coreCompSource);
    if (coreCompArray.length > 0) {
      normalized.coreCompetencies = '<ul>' + coreCompArray.map(c => `<li>${c}</li>`).join('') + '</ul>';
    }
  }
}

  // Experience
  if (source.experience || source.workExperience) {
    const expData = source.experience || source.workExperience;
    let expArray = Array.isArray(expData) ? expData : objectToArray(expData);
    
    if (expArray && expArray.length > 0) {
      normalized.experience = expArray
        .map((e: any) => {
          if (!e || Object.keys(e).length === 0) return null;
          
          const exp: any = {};
          
          // Only include id if it exists and looks real
          if (e.id && typeof e.id === 'string' && 
              (e.id.includes('-') || /^[a-f0-9]{24}$/.test(e.id) || e.id.startsWith('exp-'))) {
            exp.id = e.id;
          }
          
          if (e.title || e.position) exp.title = safeString(e.title || e.position);
          if (e.company) {
            // Clean company name (remove location)
            exp.company = safeString(e.company.split(',')[0].trim());
          }
          if (e.location) exp.location = safeString(e.location);
          if (e.startDate || e.start) exp.startDate = safeString(e.startDate || e.start);
          if (e.endDate || e.end) exp.endDate = safeString(e.endDate || e.end);
          if (e.isCurrent !== undefined) exp.isCurrent = !!e.isCurrent;
          if (e.description) exp.description = safeString(e.description);
          if (e.achievements) exp.achievements = safeString(e.achievements);
          
          return Object.keys(exp).length > 0 ? exp : null;
        })
        .filter((e: any) => e !== null);
    }
  }

  // Education
  if (source.education) {
    const eduData = source.education;
    let eduArray = Array.isArray(eduData) ? eduData : objectToArray(eduData);
    
    if (eduArray && eduArray.length > 0) {
      normalized.education = eduArray
        .map((edu: any) => {
          if (!edu || Object.keys(edu).length === 0) return null;
          
          const education: any = {};
          
          // Only include id if it exists and looks real
          if (edu.id && typeof edu.id === 'string' && 
              (edu.id.includes('-') || /^[a-f0-9]{24}$/.test(edu.id) || edu.id.startsWith('edu-'))) {
            education.id = edu.id;
          }
          
          if (edu.school || edu.institution) education.school = safeString(edu.school || edu.institution);
          if (edu.location) education.location = safeString(edu.location);
          if (edu.degree) education.degree = safeString(edu.degree);
          if (edu.field) education.field = safeString(edu.field);
          if (edu.startDate || edu.start) education.startDate = safeString(edu.startDate || edu.start);
          if (edu.graduationDate || edu.endDate || edu.end) {
            education.graduationDate = safeString(edu.graduationDate || edu.endDate || edu.end);
          }
          if (edu.description) education.description = safeString(edu.description);
          if (edu.grade) education.grade = safeString(edu.grade);
          
          return Object.keys(education).length > 0 ? education : null;
        })
        .filter((edu: any) => edu !== null);
    }
  }

  // Internships
  if (source.internships) {
    const internData = source.internships;
    let internArray = Array.isArray(internData) ? internData : objectToArray(internData);
    
    if (internArray && internArray.length > 0) {
      normalized.internships = internArray
        .map((intern: any) => {
          if (!intern || Object.keys(intern).length === 0) return null;
          
          const internship: any = {};
          
          // Only include id if it exists and looks real
          if (intern.id && typeof intern.id === 'string' && 
              (intern.id.includes('-') || /^[a-f0-9]{24}$/.test(intern.id))) {
            internship.id = intern.id;
          }
          
          if (intern.title || intern.name) internship.title = safeString(intern.title || intern.name);
          if (intern.company) internship.company = safeString(intern.company);
          if (intern.description) internship.description = safeString(intern.description);
          if (intern.duration || intern.dates) internship.duration = safeString(intern.duration || intern.dates);
          
          return Object.keys(internship).length > 0 ? internship : null;
        })
        .filter((intern: any) => intern !== null);
    }
  }

  // Training Programs
  if (source.trainingPrograms || source.training_programs) {
    const trainingData = source.trainingPrograms || source.training_programs;
    let trainingArray = Array.isArray(trainingData) ? trainingData : objectToArray(trainingData);
    
    if (trainingArray && trainingArray.length > 0) {
      normalized.trainingPrograms = trainingArray
        .map((training: any) => {
          if (!training || Object.keys(training).length === 0) return null;
          
          const program: any = {};
          
          if (training.id && typeof training.id === 'string' && 
              (training.id.includes('-') || /^[a-f0-9]{24}$/.test(training.id))) {
            program.id = training.id;
          }
          
          if (training.name || training.title) program.name = safeString(training.name || training.title);
          if (training.provider || training.company) program.provider = safeString(training.provider || training.company);
          if (training.completionDate || training.dates || training.date) {
            program.completionDate = safeString(training.completionDate || training.dates || training.date);
          }
          if (training.duration) program.duration = safeString(training.duration);
          if (training.description) program.description = safeString(training.description);
          
          return Object.keys(program).length > 0 ? program : null;
        })
        .filter((p: any) => p !== null);
    }
  }

  // Academic Projects
  if (source.academicProjects || source.projects) {
    const projectData = source.academicProjects || source.projects;
    let projectArray = Array.isArray(projectData) ? projectData : objectToArray(projectData);
    
    if (projectArray && projectArray.length > 0) {
      normalized.academicProjects = projectArray
        .map((project: any) => {
          if (!project || Object.keys(project).length === 0) return null;
          
          const proj: any = {};
          
          if (project.id && typeof project.id === 'string' && 
              (project.id.includes('-') || /^[a-f0-9]{24}$/.test(project.id))) {
            proj.id = project.id;
          }
          
          if (project.name || project.title) proj.name = safeString(project.name || project.title);
          if (project.course) proj.course = safeString(project.course);
          if (project.institution) proj.institution = safeString(project.institution);
          if (project.duration || project.dates) proj.duration = safeString(project.duration || project.dates);
          if (project.description) proj.description = safeString(project.description);
          if (project.technologies) {
            if (Array.isArray(project.technologies)) {
              proj.technologies = project.technologies.filter((t: any) => t && typeof t === 'string');
            } else if (typeof project.technologies === 'string') {
              proj.technologies = [project.technologies];
            }
          }
          if (project.url) proj.url = safeString(project.url);
          
          return Object.keys(proj).length > 0 ? proj : null;
        })
        .filter((p: any) => p !== null);
    }
  }

  // Leadership Positions
  if (source.leadershipPositions || source.leadership_positions) {
    const leadershipData = source.leadershipPositions || source.leadership_positions;
    let leadershipArray = Array.isArray(leadershipData) ? leadershipData : objectToArray(leadershipData);
    
    if (leadershipArray && leadershipArray.length > 0) {
      normalized.leadershipPositions = leadershipArray
        .map((pos: any) => {
          if (!pos || Object.keys(pos).length === 0) return null;
          
          const position: any = {};
          
          if (pos.id && typeof pos.id === 'string' && 
              (pos.id.includes('-') || /^[a-f0-9]{24}$/.test(pos.id))) {
            position.id = pos.id;
          }
          
          if (pos.position || pos.title || pos.name) {
            position.position = safeString(pos.position || pos.title || pos.name);
          }
          if (pos.organization || pos.company) position.organization = safeString(pos.organization || pos.company);
          if (pos.startDate || pos.start) position.startDate = safeString(pos.startDate || pos.start);
          if (pos.endDate || pos.end) position.endDate = safeString(pos.endDate || pos.end);
          if (pos.description) position.description = safeString(pos.description);
          
          return Object.keys(position).length > 0 ? position : null;
        })
        .filter((p: any) => p !== null);
    }
  }

  // Co-Curricular
  if (source.coCurricular || source.coCurricularActivities) {
    const coData = source.coCurricular || source.coCurricularActivities;
    let coArray = Array.isArray(coData) ? coData : objectToArray(coData);
    
    if (coArray && coArray.length > 0) {
      normalized.coCurricular = coArray
        .map((item: any) => {
          if (!item || Object.keys(item).length === 0) return null;
          
          const activity: any = {};
          
          if (item.id && typeof item.id === 'string' && 
              (item.id.includes('-') || /^[a-f0-9]{24}$/.test(item.id))) {
            activity.id = item.id;
          }
          
          if (item.activity || item.title || item.name) {
            activity.activity = safeString(item.activity || item.title || item.name);
          }
          if (item.role) activity.role = safeString(item.role);
          if (item.year || item.date) activity.year = safeString(item.year || item.date);
          
          return Object.keys(activity).length > 0 ? activity : null;
        })
        .filter((a: any) => a !== null);
    }
  }

  // Extracurricular
  if (source.extracurricular || source.extracurricularActivities) {
    const extraData = source.extracurricular || source.extracurricularActivities;
    let extraArray = Array.isArray(extraData) ? extraData : objectToArray(extraData);
    
    if (extraArray && extraArray.length > 0) {
      normalized.extracurricular = extraArray
        .map((item: any) => {
          if (!item || Object.keys(item).length === 0) return null;
          
          const activity: any = {};
          
          if (item.id && typeof item.id === 'string' && 
              (item.id.includes('-') || /^[a-f0-9]{24}$/.test(item.id))) {
            activity.id = item.id;
          }
          
          if (item.activity || item.title || item.name) {
            activity.activity = safeString(item.activity || item.title || item.name);
          }
          if (item.role) activity.role = safeString(item.role);
          if (item.year || item.date) activity.year = safeString(item.year || item.date);
          
          return Object.keys(activity).length > 0 ? activity : null;
        })
        .filter((a: any) => a !== null);
    }
  }

  // Languages
  if (source.languages) {
    if (Array.isArray(source.languages)) {
      normalized.languages = source.languages
        .map((lang: any) => {
          if (!lang || Object.keys(lang).length === 0) return null;
          
          const language: any = {};
          if (lang.language) language.language = safeString(lang.language);
          if (lang.level) language.level = safeString(lang.level);
          if (lang.capability) language.capability = safeString(lang.capability);
          
          return Object.keys(language).length > 0 ? language : null;
        })
        .filter((l: any) => l !== null);
    } else if (typeof source.languages === 'object') {
      // Handle object format {English: {level: "Intermediate"}}
      normalized.languages = Object.entries(source.languages)
        .map(([lang, data]: [string, any]) => {
          const language: any = { language: lang };
          if (data && typeof data === 'object') {
            if (data.level) language.level = safeString(data.level);
            if (data.capability) language.capability = safeString(data.capability);
          } else if (typeof data === 'string') {
            language.level = data;
          }
          return language;
        })
        .filter((l: any) => l.language);
    }
  }

  // Certifications
  if (source.certifications) {
    if (Array.isArray(source.certifications)) {
      normalized.certifications = source.certifications
        .map((cert: any) => {
          if (!cert || Object.keys(cert).length === 0) return null;
          
          const certification: any = {};
          
          if (cert.id && typeof cert.id === 'string' && 
              (cert.id.includes('-') || /^[a-f0-9]{24}$/.test(cert.id))) {
            certification.id = cert.id;
          }
          
          if (cert.name || cert.title) certification.name = safeString(cert.name || cert.title);
          if (cert.issuer || cert.company) certification.issuer = safeString(cert.issuer || cert.company);
          if (cert.date) certification.date = safeString(cert.date);
          if (cert.url) certification.url = safeString(cert.url);
          
          return Object.keys(certification).length > 0 ? certification : null;
        })
        .filter((c: any) => c !== null);
    } else if (typeof source.certifications === 'object') {
      normalized.certifications = Object.entries(source.certifications)
        .map(([name, data]: [string, any]) => {
          const certification: any = { name };
          if (data && typeof data === 'object') {
            if (data.issuer) certification.issuer = safeString(data.issuer);
            if (data.date) certification.date = safeString(data.date);
            if (data.url) certification.url = safeString(data.url);
          }
          return certification;
        });
    }
  }

  // Scholarships
  if (source.scholarships) {
    if (Array.isArray(source.scholarships)) {
      normalized.scholarships = source.scholarships
        .map((scholar: any) => {
          if (!scholar || Object.keys(scholar).length === 0) return null;
          
          const scholarship: any = {};
          
          if (scholar.id && typeof scholar.id === 'string' && 
              (scholar.id.includes('-') || /^[a-f0-9]{24}$/.test(scholar.id))) {
            scholarship.id = scholar.id;
          }
          
          if (scholar.name || scholar.title) scholarship.name = safeString(scholar.name || scholar.title);
          if (scholar.provider || scholar.company) scholarship.provider = safeString(scholar.provider || scholar.company);
          if (scholar.organization) scholarship.organization = safeString(scholar.organization);
          if (scholar.year || scholar.date) scholarship.year = safeString(scholar.year || scholar.date);
          if (scholar.description) scholarship.description = safeString(scholar.description);
          
          return Object.keys(scholarship).length > 0 ? scholarship : null;
        })
        .filter((s: any) => s !== null);
    }
  }

  // Awards
  if (source.awards) {
    let awardsArray = Array.isArray(source.awards) ? source.awards : objectToArray(source.awards);
    
    if (awardsArray && awardsArray.length > 0) {
      normalized.awards = awardsArray
        .map((award: any) => {
          if (!award || Object.keys(award).length === 0) return null;
          
          const awardItem: any = {};
          
          if (award.id && typeof award.id === 'string' && 
              (award.id.includes('-') || /^[a-f0-9]{24}$/.test(award.id) || award.id.startsWith('award-'))) {
            awardItem.id = award.id;
          }
          
          if (award.title || award.name) awardItem.title = safeString(award.title || award.name);
          if (award.organization || award.company) awardItem.organization = safeString(award.organization || award.company);
          if (award.issueYear || award.year || award.date) {
            awardItem.issueYear = safeString(award.issueYear || award.year || award.date);
          }
          if (award.description) awardItem.description = safeString(award.description);
          
          return Object.keys(awardItem).length > 0 ? awardItem : null;
        })
        .filter((a: any) => a !== null);
    }
  }

  // Speaking Engagements
  if (source.speakingEngagements) {
    let speakingArray = Array.isArray(source.speakingEngagements) ? source.speakingEngagements : objectToArray(source.speakingEngagements);
    
    if (speakingArray && speakingArray.length > 0) {
      normalized.speakingEngagements = speakingArray
        .map((item: any) => {
          if (!item || Object.keys(item).length === 0) return null;
          
          const speaking: any = {};
          
          if (item.id && typeof item.id === 'string' && 
              (item.id.includes('-') || /^[a-f0-9]{24}$/.test(item.id) || item.id.startsWith('speaking-'))) {
            speaking.id = item.id;
          }
          
          if (item.topic || item.title || item.name) speaking.topic = safeString(item.topic || item.title || item.name);
          if (item.eventName || item.event || item.company) {
            speaking.eventName = safeString(item.eventName || item.event || item.company);
          }
          if (item.date) speaking.date = safeString(item.date);
          if (item.description) speaking.description = safeString(item.description);
          
          return Object.keys(speaking).length > 0 ? speaking : null;
        })
        .filter((s: any) => s !== null);
    }
  }

  // Memberships
  if (source.memberships) {
    let membershipsArray = Array.isArray(source.memberships) ? source.memberships : objectToArray(source.memberships);
    
    if (membershipsArray && membershipsArray.length > 0) {
      normalized.memberships = membershipsArray
        .map((item: any) => {
          if (!item || Object.keys(item).length === 0) return null;
          
          const membership: any = {};
          
          if (item.id && typeof item.id === 'string' && 
              (item.id.includes('-') || /^[a-f0-9]{24}$/.test(item.id) || item.id.startsWith('membership-'))) {
            membership.id = item.id;
          }
          
          if (item.membershipName || item.name || item.title) {
            membership.membershipName = safeString(item.membershipName || item.name || item.title);
          }
          if (item.organizationName || item.organization) {
            membership.organizationName = safeString(item.organizationName || item.organization);
          }
          if (item.year || item.date) membership.year = safeString(item.year || item.date);
          if (item.description) membership.description = safeString(item.description);
          
          return Object.keys(membership).length > 0 ? membership : null;
        })
        .filter((m: any) => m !== null);
    }
  }

  // Workshops
  if (source.workshops) {
    let workshopsArray = Array.isArray(source.workshops) ? source.workshops : objectToArray(source.workshops);
    
    if (workshopsArray && workshopsArray.length > 0) {
      normalized.workshops = workshopsArray
        .map((item: any) => {
          if (!item || Object.keys(item).length === 0) return null;
          
          const workshop: any = {};
          
          if (item.id && typeof item.id === 'string' && 
              (item.id.includes('-') || /^[a-f0-9]{24}$/.test(item.id) || item.id.startsWith('workshop-'))) {
            workshop.id = item.id;
          }
          
          if (item.programTitle || item.name || item.title) {
            workshop.programTitle = safeString(item.programTitle || item.name || item.title);
          }
          if (item.conductedBy || item.provider || item.company) {
            workshop.conductedBy = safeString(item.conductedBy || item.provider || item.company);
          }
          if (item.year || item.date) workshop.year = safeString(item.year || item.date);
          if (item.description) workshop.description = safeString(item.description);
          
          return Object.keys(workshop).length > 0 ? workshop : null;
        })
        .filter((w: any) => w !== null);
    }
  }

  // Professional Context
  if (source.professionalContext || source.professional_context) {
    const pc = source.professionalContext || source.professional_context;
    const profContext: any = {};
    
    if (pc.id && typeof pc.id === 'string' && 
        (pc.id.includes('-') || /^[a-f0-9]{24}$/.test(pc.id))) {
      profContext.id = pc.id;
    }
    if (pc.totalExperience) profContext.totalExperience = safeString(pc.totalExperience);
    if (pc.teamSize) profContext.teamSize = safeString(pc.teamSize);
    if (pc.industry) profContext.industry = safeString(pc.industry);
    if (pc.functionalDomain) profContext.functionalDomain = safeString(pc.functionalDomain);
    if (pc.geographicScope) profContext.geographicScope = safeString(pc.geographicScope);
    if (pc.revenueResponsibility) profContext.revenueResponsibility = safeString(pc.revenueResponsibility);
    
    if (Object.keys(profContext).length > 0) {
      normalized.professionalContext = profContext;
    }
  }

  // Section Visibility
  if (source.sectionVisibility && Object.keys(source.sectionVisibility).length > 0) {
    normalized.sectionVisibility = source.sectionVisibility;
  }

  // Font settings
  if (source.fontSize) normalized.fontSize = source.fontSize;
  if (source.fontFamily) normalized.fontFamily = safeString(source.fontFamily);

  // Portfolio
  if (source.portfolio) {
    let portfolioArray = Array.isArray(source.portfolio) ? source.portfolio : objectToArray(source.portfolio);
    
    if (portfolioArray && portfolioArray.length > 0) {
      normalized.portfolio = portfolioArray
        .map((item: any) => {
          if (!item || Object.keys(item).length === 0) return null;
          
          const portfolio: any = {};
          
          if (item.id && typeof item.id === 'string' && 
              (item.id.includes('-') || /^[a-f0-9]{24}$/.test(item.id))) {
            portfolio.id = item.id;
          }
          
          if (item.name || item.title) portfolio.name = safeString(item.name || item.title);
          if (item.description) portfolio.description = safeString(item.description);
          if (item.url) portfolio.url = safeString(item.url);
          if (item.type) portfolio.type = safeString(item.type);
          if (item.platform) portfolio.platform = safeString(item.platform);
          
          return Object.keys(portfolio).length > 0 ? portfolio : null;
        })
        .filter((p: any) => p !== null);
    }
  }

  // Client Projects
  if (source.clientProjects) {
    let clientArray = Array.isArray(source.clientProjects) ? source.clientProjects : objectToArray(source.clientProjects);
    
    if (clientArray && clientArray.length > 0) {
      normalized.clientProjects = clientArray
        .map((item: any) => {
          if (!item || Object.keys(item).length === 0) return null;
          
          const project: any = {};
          
          if (item.id && typeof item.id === 'string' && 
              (item.id.includes('-') || /^[a-f0-9]{24}$/.test(item.id))) {
            project.id = item.id;
          }
          
          if (item.name || item.title) project.name = safeString(item.name || item.title);
          if (item.role) project.role = safeString(item.role);
          if (item.description) project.description = safeString(item.description);
          if (item.clientOrganization) project.clientOrganization = safeString(item.clientOrganization);
          if (item.duration) project.duration = safeString(item.duration);
          if (item.toolsTechnologies) {
            if (Array.isArray(item.toolsTechnologies)) {
              project.toolsTechnologies = item.toolsTechnologies.filter((t: any) => t);
            } else if (typeof item.toolsTechnologies === 'string') {
              project.toolsTechnologies = item.toolsTechnologies;
            }
          }
          if (item.projectUrl || item.url) project.projectUrl = safeString(item.projectUrl || item.url);
          
          return Object.keys(project).length > 0 ? project : null;
        })
        .filter((p: any) => p !== null);
    }
  }

  // Volunteering
  if (source.volunteering) {
    let volArray = Array.isArray(source.volunteering) ? source.volunteering : objectToArray(source.volunteering);
    
    if (volArray && volArray.length > 0) {
      normalized.volunteering = volArray
        .map((item: any) => {
          if (!item || Object.keys(item).length === 0) return null;
          
          const volunteer: any = {};
          
          if (item.id && typeof item.id === 'string' && 
              (item.id.includes('-') || /^[a-f0-9]{24}$/.test(item.id))) {
            volunteer.id = item.id;
          }
          
          if (item.organization || item.company) volunteer.organization = safeString(item.organization || item.company);
          if (item.role || item.title) volunteer.role = safeString(item.role || item.title);
          if (item.description) volunteer.description = safeString(item.description);
          if (item.causeArea || item.cause) volunteer.causeArea = safeString(item.causeArea || item.cause);
          if (item.duration) volunteer.duration = safeString(item.duration);
          
          return Object.keys(volunteer).length > 0 ? volunteer : null;
        })
        .filter((v: any) => v !== null);
    }
  }

  // Military Service
  if (source.militaryService) {
    let militaryArray = Array.isArray(source.militaryService) ? source.militaryService : objectToArray(source.militaryService);
    
    if (militaryArray && militaryArray.length > 0) {
      normalized.militaryService = militaryArray
        .map((item: any) => {
          if (!item || Object.keys(item).length === 0) return null;
          
          const service: any = {};
          
          if (item.id && typeof item.id === 'string' && 
              (item.id.includes('-') || /^[a-f0-9]{24}$/.test(item.id))) {
            service.id = item.id;
          }
          
          if (item.branch || (item.title && item.title.split(' - ')[0])) {
            service.branch = safeString(item.branch || item.title.split(' - ')[0]);
          }
          if (item.rank || (item.title && item.title.split(' - ')[1])) {
            service.rank = safeString(item.rank || item.title.split(' - ')[1]);
          }
          if (item.description) service.description = safeString(item.description);
          if (item.duration) service.duration = safeString(item.duration);
          if (item.specialization) service.specialization = safeString(item.specialization);
          
          return Object.keys(service).length > 0 ? service : null;
        })
        .filter((s: any) => s !== null);
    }
  }

  // Methodologies
  if (source.methodologies) {
    let methodArray = Array.isArray(source.methodologies) ? source.methodologies : objectToArray(source.methodologies);
    
    if (methodArray && methodArray.length > 0) {
      normalized.methodologies = methodArray
        .map((item: any) => {
          if (!item || Object.keys(item).length === 0) return null;
          
          const method: any = {};
          
          if (item.id && typeof item.id === 'string' && 
              (item.id.includes('-') || /^[a-f0-9]{24}$/.test(item.id))) {
            method.id = item.id;
          }
          
          if (item.name || item.methodology) method.name = safeString(item.name || item.methodology);
          if (item.certification) method.certification = safeString(item.certification);
          if (item.experienceDuration || item.experience) {
            method.experienceDuration = safeString(item.experienceDuration || item.experience);
          }
          
          return Object.keys(method).length > 0 ? method : null;
        })
        .filter((m: any) => m !== null);
    }
  }

  // Industry Expertise
  if (source.industryExpertise) {
    let expArray = Array.isArray(source.industryExpertise) ? source.industryExpertise : objectToArray(source.industryExpertise);
    
    if (expArray && expArray.length > 0) {
      normalized.industryExpertise = expArray
        .map((item: any) => {
          if (!item || Object.keys(item).length === 0) return null;
          
          const expertise: any = {};
          
          if (item.id && typeof item.id === 'string' && 
              (item.id.includes('-') || /^[a-f0-9]{24}$/.test(item.id))) {
            expertise.id = item.id;
          }
          
          if (item.industry || item.name || item.id) {
            expertise.industry = safeString(item.industry || item.name || item.id);
          }
          if (item.domainArea || item.domain) expertise.domainArea = safeString(item.domainArea || item.domain);
          if (item.experienceDuration || item.experience) {
            expertise.experienceDuration = safeString(item.experienceDuration || item.experience);
          }
          
          return Object.keys(expertise).length > 0 ? expertise : null;
        })
        .filter((e: any) => e !== null);
    }
  }

  // References
  if (source.references) {
    let refArray = Array.isArray(source.references) ? source.references : objectToArray(source.references);
    
    if (refArray && refArray.length > 0) {
      normalized.references = refArray
        .map((item: any) => {
          if (!item || Object.keys(item).length === 0) return null;
          
          const ref: any = {};
          
          if (item.id && typeof item.id === 'string' && 
              (item.id.includes('-') || /^[a-f0-9]{24}$/.test(item.id))) {
            ref.id = item.id;
          }
          
          if (item.name) ref.name = safeString(item.name);
          if (item.designationRelationship || item.role) {
            ref.designationRelationship = safeString(item.designationRelationship || item.role);
          }
          if (item.organization) ref.organization = safeString(item.organization);
          if (item.contactInformation || item.contact) {
            ref.contactInformation = safeString(item.contactInformation || item.contact);
          }
          
          return Object.keys(ref).length > 0 ? ref : null;
        })
        .filter((r: any) => r !== null);
    }
  }

  // Social Profiles
  if (source.socialProfiles) {
    let socialArray = Array.isArray(source.socialProfiles) ? source.socialProfiles : objectToArray(source.socialProfiles);
    
    if (socialArray && socialArray.length > 0) {
      normalized.socialProfiles = socialArray
        .map((item: any) => {
          if (!item || Object.keys(item).length === 0) return null;
          
          const profile: any = {};
          
          if (item.id && typeof item.id === 'string' && 
              (item.id.includes('-') || /^[a-f0-9]{24}$/.test(item.id))) {
            profile.id = item.id;
          }
          
          if (item.platform) profile.platform = safeString(item.platform);
          if (item.url) profile.url = safeString(item.url);
          
          return Object.keys(profile).length > 0 ? profile : null;
        })
        .filter((p: any) => p !== null);
    }
  }

  // Availability Work Auth
  if (source.availabilityWorkAuth || source.availability_work_authorization) {
    const auth = source.availabilityWorkAuth || source.availability_work_authorization;
    const workAuth: any = {};
    
    if (auth.availabilityNoticePeriod || auth.noticePeriod) {
      workAuth.availabilityNoticePeriod = safeString(auth.availabilityNoticePeriod || auth.noticePeriod);
    }
    if (auth.workAuthorizationStatus || auth.workAuth) {
      workAuth.workAuthorizationStatus = safeString(auth.workAuthorizationStatus || auth.workAuth);
    }
    if (auth.preferredLocation) workAuth.preferredLocation = safeString(auth.preferredLocation);
    
    if (Object.keys(workAuth).length > 0) {
      normalized.availabilityWorkAuth = workAuth;
    }
  }

  // Teaching Experience
  if (source.teachingExperience) {
    let teachArray = Array.isArray(source.teachingExperience) ? source.teachingExperience : objectToArray(source.teachingExperience);
    
    if (teachArray && teachArray.length > 0) {
      normalized.teachingExperience = teachArray
        .map((item: any) => {
          if (!item || Object.keys(item).length === 0) return null;
          
          const teaching: any = {};
          
          if (item.id && typeof item.id === 'string' && 
              (item.id.includes('-') || /^[a-f0-9]{24}$/.test(item.id))) {
            teaching.id = item.id;
          }
          
          if (item.title) teaching.title = safeString(item.title);
          if (item.institution || item.company) teaching.institution = safeString(item.institution || item.company);
          if (item.description) teaching.description = safeString(item.description);
          if (item.subjectCourseTaught || item.role) {
            teaching.subjectCourseTaught = safeString(item.subjectCourseTaught || item.role);
          }
          if (item.duration) teaching.duration = safeString(item.duration);
          
          return Object.keys(teaching).length > 0 ? teaching : null;
        })
        .filter((t: any) => t !== null);
    }
  }

  // Mentorship Experience
  if (source.mentorshipExperience) {
    let mentorArray = Array.isArray(source.mentorshipExperience) ? source.mentorshipExperience : objectToArray(source.mentorshipExperience);
    
    if (mentorArray && mentorArray.length > 0) {
      normalized.mentorshipExperience = mentorArray
        .map((item: any) => {
          if (!item || Object.keys(item).length === 0) return null;
          
          const mentor: any = {};
          
          if (item.id && typeof item.id === 'string' && 
              (item.id.includes('-') || /^[a-f0-9]{24}$/.test(item.id))) {
            mentor.id = item.id;
          }
          
          if (item.description) mentor.description = safeString(item.description);
          if (item.mentorshipArea || item.role) {
            mentor.mentorshipArea = safeString(item.mentorshipArea || item.role);
          }
          if (item.organizationPlatform || item.title || item.company) {
            mentor.organizationPlatform = safeString(item.organizationPlatform || item.title || item.company);
          }
          if (item.menteeLevel) mentor.menteeLevel = safeString(item.menteeLevel);
          if (item.duration) mentor.duration = safeString(item.duration);
          
          return Object.keys(mentor).length > 0 ? mentor : null;
        })
        .filter((m: any) => m !== null);
    }
  }

  // Research Grants
  if (source.researchGrants) {
    let grantArray = Array.isArray(source.researchGrants) ? source.researchGrants : objectToArray(source.researchGrants);
    
    if (grantArray && grantArray.length > 0) {
      normalized.researchGrants = grantArray
        .map((item: any) => {
          if (!item || Object.keys(item).length === 0) return null;
          
          const grant: any = {};
          
          if (item.id && typeof item.id === 'string' && 
              (item.id.includes('-') || /^[a-f0-9]{24}$/.test(item.id))) {
            grant.id = item.id;
          }
          
          if (item.title || item.name) grant.title = safeString(item.title || item.name);
          if (item.agency) grant.agency = safeString(item.agency);
          if (item.amount) grant.amount = safeString(item.amount);
          if (item.description) grant.description = safeString(item.description);
          if (item.year) grant.year = safeString(item.year);
          
          return Object.keys(grant).length > 0 ? grant : null;
        })
        .filter((g: any) => g !== null);
    }
  }

  // Test Scores
  if (source.testScores) {
    let testArray = Array.isArray(source.testScores) ? source.testScores : objectToArray(source.testScores);
    
    if (testArray && testArray.length > 0) {
      normalized.testScores = testArray
        .map((item: any) => {
          if (!item || Object.keys(item).length === 0) return null;
          
          const test: any = {};
          
          if (item.id && typeof item.id === 'string' && 
              (item.id.includes('-') || /^[a-f0-9]{24}$/.test(item.id))) {
            test.id = item.id;
          }
          
          if (item.testName || item.name) test.testName = safeString(item.testName || item.name);
          if (item.score !== undefined && item.score !== null) {
            if (typeof item.score === 'number') {
              test.score = item.score;
            } else {
              test.score = safeString(item.score);
            }
          }
          if (item.year) test.year = safeString(item.year);
          if (item.percentileRank || item.percentile) {
            test.percentileRank = safeString(item.percentileRank || item.percentile);
          }
          
          return Object.keys(test).length > 0 ? test : null;
        })
        .filter((t: any) => t !== null);
    }
  }

  // Publications
  if (source.publications) {
    let pubArray = Array.isArray(source.publications) ? source.publications : objectToArray(source.publications);
    
    if (pubArray && pubArray.length > 0) {
      normalized.publications = pubArray
        .map((item: any) => {
          if (!item || Object.keys(item).length === 0) return null;
          
          const pub: any = {};
          
          if (item.id && typeof item.id === 'string' && 
              (item.id.includes('-') || /^[a-f0-9]{24}$/.test(item.id))) {
            pub.id = item.id;
          }
          
          if (item.title || item.name) pub.title = safeString(item.title || item.name);
          if (item.journalPublisher) pub.journalPublisher = safeString(item.journalPublisher);
          if (item.publicationType) pub.publicationType = safeString(item.publicationType);
          if (item.year) pub.year = safeString(item.year);
          if (item.urlDoi || item.url) pub.urlDoi = safeString(item.urlDoi || item.url);
          if (item.authors) pub.authors = safeString(item.authors);
          
          return Object.keys(pub).length > 0 ? pub : null;
        })
        .filter((p: any) => p !== null);
    }
  }

  // Patents
  if (source.patents) {
    let patentArray = Array.isArray(source.patents) ? source.patents : objectToArray(source.patents);
    
    if (patentArray && patentArray.length > 0) {
      normalized.patents = patentArray
        .map((item: any) => {
          if (!item || Object.keys(item).length === 0) return null;
          
          const patent: any = {};
          
          if (item.id && typeof item.id === 'string' && 
              (item.id.includes('-') || /^[a-f0-9]{24}$/.test(item.id))) {
            patent.id = item.id;
          }
          
          if (item.title || item.name) patent.title = safeString(item.title || item.name);
          if (item.patentNumber) patent.patentNumber = safeString(item.patentNumber);
          if (item.status) patent.status = safeString(item.status);
          if (item.issuingAuthority) patent.issuingAuthority = safeString(item.issuingAuthority);
          if (item.year) patent.year = safeString(item.year);
          
          return Object.keys(patent).length > 0 ? patent : null;
        })
        .filter((p: any) => p !== null);
    }
  }

  // Tools & Technologies
  if (source.toolsTechnologies) {
    let toolArray = Array.isArray(source.toolsTechnologies) ? source.toolsTechnologies : objectToArray(source.toolsTechnologies);
    
    if (toolArray && toolArray.length > 0) {
      normalized.toolsTechnologies = toolArray
        .map((item: any) => {
          if (!item || Object.keys(item).length === 0) return null;
          
          const tool: any = {};
          
          if (item.id && typeof item.id === 'string' && 
              (item.id.includes('-') || /^[a-f0-9]{24}$/.test(item.id))) {
            tool.id = item.id;
          }
          
          if (item.name || item.tool) tool.name = safeString(item.name || item.tool);
          if (item.category) tool.category = safeString(item.category);
          if (item.proficiency) tool.proficiency = safeString(item.proficiency);
          if (item.experienceDuration || item.experience) {
            tool.experienceDuration = safeString(item.experienceDuration || item.experience);
          }
          
          return Object.keys(tool).length > 0 ? tool : null;
        })
        .filter((t: any) => t !== null);
    }
  }

  return normalized;
}

// Helper function for date parsing (if needed)
function parseDateRange(dateStr: string | null): { startDate: string | null, endDate: string | null, isCurrent: boolean } {
  if (!dateStr || typeof dateStr !== 'string') {
    return { startDate: null, endDate: null, isCurrent: false };
  }

  let startDate = null;
  let endDate = null;
  let isCurrent = false;

  if (/present|current|now/i.test(dateStr)) {
    isCurrent = true;
    const parts = dateStr.split(/\s*[-–—]\s*|\s*to\s*/);
    if (parts.length >= 1) {
      startDate = parts[0].trim();
    }
  } else {
    const parts = dateStr.split(/\s*[-–—]\s*|\s*to\s*/);
    if (parts.length >= 1) startDate = parts[0].trim();
    if (parts.length >= 2) endDate = parts[1].trim();
  }

  return { startDate, endDate, isCurrent };
}