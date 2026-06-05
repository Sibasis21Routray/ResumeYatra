"use strict";
exports.__esModule = true;
exports.normalizeParsedResume = void 0;
function normalizeParsedResume(parsed) {
    if (!parsed)
        parsed = {};
    // Helper function to safely get string value
    // Helper function to safely get string value
    function safeString(value) {
        if (value === null || value === undefined)
            return null;
        if (typeof value === 'string')
            return value;
        if (typeof value === 'number')
            return value.toString();
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
    function objectToArray(obj) {
        if (!obj || typeof obj !== 'object' || Array.isArray(obj))
            return obj;
        var keys = Object.keys(obj);
        if (keys.length === 0)
            return [];
        // If all keys are numeric, convert to array
        var allNumeric = keys.every(function (key) { return !isNaN(Number(key)); });
        if (allNumeric) {
            return Object.values(obj);
        }
        return obj;
    }
    // Helper function to remove empty fields from objects
    function removeEmptyFields(obj) {
        if (!obj || typeof obj !== 'object')
            return obj;
        if (Array.isArray(obj)) {
            var filtered = obj
                .map(function (item) { return removeEmptyFields(item); })
                .filter(function (item) {
                if (item === null || item === undefined)
                    return false;
                if (typeof item === 'object' && Object.keys(item).length === 0)
                    return false;
                if (typeof item === 'string' && item.trim() === '')
                    return false;
                return true;
            });
            return filtered.length > 0 ? filtered : undefined;
        }
        var cleaned = {};
        for (var _i = 0, _a = Object.entries(obj); _i < _a.length; _i++) {
            var _b = _a[_i], key = _b[0], value = _b[1];
            // Skip id fields - they should come from the source data, not be generated
            if (key === 'id' || key === '_id') {
                // Only keep id if it looks like a real ID (not a title)
                if (value && typeof value === 'string' &&
                    (value.includes('-') || /^[a-f0-9]{24}$/.test(value))) {
                    cleaned[key] = value;
                }
                continue;
            }
            if (value === null || value === undefined)
                continue;
            if (typeof value === 'object') {
                var cleanedValue = removeEmptyFields(value);
                if (cleanedValue &&
                    (typeof cleanedValue === 'object' && Object.keys(cleanedValue).length > 0) ||
                    (Array.isArray(cleanedValue) && cleanedValue.length > 0)) {
                    cleaned[key] = cleanedValue;
                }
            }
            else if (typeof value === 'string' && value.trim() !== '') {
                cleaned[key] = value;
            }
            else if (typeof value !== 'string') {
                // Keep non-string values (numbers, booleans)
                cleaned[key] = value;
            }
        }
        return Object.keys(cleaned).length > 0 ? cleaned : undefined;
    }
    // Helper function to check if an object has any meaningful data
    function hasData(obj) {
        if (!obj || typeof obj !== 'object')
            return false;
        return Object.values(obj).some(function (value) {
            if (value === null || value === undefined)
                return false;
            if (typeof value === 'string' && value.trim() === '')
                return false;
            if (Array.isArray(value) && value.length === 0)
                return false;
            if (typeof value === 'object' && Object.keys(value).length === 0)
                return false;
            return true;
        });
    }
    // Ensure parsed.data exists
    var source = parsed.data || parsed;
    var normalized = {};
    // Personal
    if (source.personal && Object.keys(source.personal).length > 0) {
        var personal = {};
        if (source.personal.name)
            personal.name = safeString(source.personal.name);
        if (source.personal.email)
            personal.email = safeString(source.personal.email);
        if (source.personal.phone)
            personal.phone = safeString(source.personal.phone);
        if (source.personal.dob)
            personal.dob = safeString(source.personal.dob);
        if (source.personal.gender)
            personal.gender = safeString(source.personal.gender);
        if (source.personal.middleName)
            personal.middleName = safeString(source.personal.middleName);
        if (source.personal.alternatePhone || source.personal.alt_phone) {
            personal.alternatePhone = safeString(source.personal.alternatePhone || source.personal.alt_phone);
        }
        if (source.personal.maritalStatus || source.personal.marital_status) {
            personal.maritalStatus = safeString(source.personal.maritalStatus || source.personal.marital_status);
        }
        if (source.personal.fullAddress || source.personal.address) {
            personal.fullAddress = safeString(source.personal.fullAddress || source.personal.address);
        }
        if (source.personal.location)
            personal.location = safeString(source.personal.location);
        if (source.personal.pinCode)
            personal.pinCode = safeString(source.personal.pinCode);
        if (source.personal.country)
            personal.country = safeString(source.personal.country);
        if (source.personal.image)
            personal.image = safeString(source.personal.image);
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
        var summary = source.summary || source.professionalSummary;
        if (typeof summary === 'string') {
            normalized.summary = summary;
        }
        else if (summary && typeof summary === 'object') {
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
                var str = JSON.stringify(summary);
                // Try to extract text if it's wrapped in an object
                var textMatch = str.match(/"text":"([^"]+)"/);
                if (textMatch) {
                    normalized.summary = textMatch[1];
                }
                else {
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
            var skillsList = source.skills
                .map(function (skill) {
                if (typeof skill === 'string') {
                    return skill;
                }
                else if (skill && typeof skill === 'object') {
                    // Try to get the skill name from common properties
                    return skill.name || skill.skill || skill.value || Object.values(skill)[0] || null;
                }
                return null;
            })
                .filter(function (s) { return s !== null; });
            if (skillsList.length > 0) {
                normalized.skills = '<ul>' + skillsList.map(function (s) { return "<li>" + s + "</li>"; }).join('') + '</ul>';
            }
        }
        else if (typeof source.skills === 'object') {
            // Handle object format {java: {}, py: {}}
            var skillsArray = Object.keys(source.skills);
            if (skillsArray.length > 0) {
                normalized.skills = '<ul>' + skillsArray.map(function (s) { return "<li>" + s + "</li>"; }).join('') + '</ul>';
            }
        }
    }
    // Core Competencies - preserve HTML format (same as skills)
    if (source.coreCompetencies || source.core_competencies) {
        var coreCompSource = source.coreCompetencies || source.core_competencies;
        if (typeof coreCompSource === 'string') {
            // If it's already a string (hopefully HTML), keep it
            normalized.coreCompetencies = coreCompSource;
        }
        else if (Array.isArray(coreCompSource)) {
            // Handle array of objects like [{name: "Strategic Planning"}, {name: "Team Leadership"}]
            var coreCompList = coreCompSource
                .map(function (comp) {
                if (typeof comp === 'string') {
                    return comp;
                }
                else if (comp && typeof comp === 'object') {
                    // Try to get the competency name from common properties
                    return comp.name || comp.competency || comp.value || Object.values(comp)[0] || null;
                }
                return null;
            })
                .filter(function (c) { return c !== null; });
            if (coreCompList.length > 0) {
                normalized.coreCompetencies = '<ul>' + coreCompList.map(function (c) { return "<li>" + c + "</li>"; }).join('') + '</ul>';
            }
        }
        else if (typeof coreCompSource === 'object') {
            // Handle object format {strategicPlanning: {}, teamLeadership: {}}
            var coreCompArray = Object.keys(coreCompSource);
            if (coreCompArray.length > 0) {
                normalized.coreCompetencies = '<ul>' + coreCompArray.map(function (c) { return "<li>" + c + "</li>"; }).join('') + '</ul>';
            }
        }
    }
    // Experience
    if (source.experience || source.workExperience) {
        var expData = source.experience || source.workExperience;
        var expArray = Array.isArray(expData) ? expData : objectToArray(expData);
        if (expArray && expArray.length > 0) {
            normalized.experience = expArray
                .map(function (e) {
                if (!e || Object.keys(e).length === 0)
                    return null;
                var exp = {};
                // Only include id if it exists and looks real
                if (e.id && typeof e.id === 'string' &&
                    (e.id.includes('-') || /^[a-f0-9]{24}$/.test(e.id) || e.id.startsWith('exp-'))) {
                    exp.id = e.id;
                }
                if (e.title || e.position)
                    exp.title = safeString(e.title || e.position);
                if (e.company) {
                    // Clean company name (remove location)
                    exp.company = safeString(e.company.split(',')[0].trim());
                }
                if (e.location)
                    exp.location = safeString(e.location);
                if (e.startDate || e.start)
                    exp.startDate = safeString(e.startDate || e.start);
                if (e.endDate || e.end)
                    exp.endDate = safeString(e.endDate || e.end);
                if (e.isCurrent !== undefined)
                    exp.isCurrent = !!e.isCurrent;
                if (e.description)
                    exp.description = safeString(e.description);
                if (e.achievements)
                    exp.achievements = safeString(e.achievements);
                return Object.keys(exp).length > 0 ? exp : null;
            })
                .filter(function (e) { return e !== null; });
        }
    }
    // Education
    if (source.education) {
        var eduData = source.education;
        var eduArray = Array.isArray(eduData) ? eduData : objectToArray(eduData);
        if (eduArray && eduArray.length > 0) {
            normalized.education = eduArray
                .map(function (edu) {
                if (!edu || Object.keys(edu).length === 0)
                    return null;
                var education = {};
                // Only include id if it exists and looks real
                if (edu.id && typeof edu.id === 'string' &&
                    (edu.id.includes('-') || /^[a-f0-9]{24}$/.test(edu.id) || edu.id.startsWith('edu-'))) {
                    education.id = edu.id;
                }
                if (edu.school || edu.institution)
                    education.school = safeString(edu.school || edu.institution);
                if (edu.location)
                    education.location = safeString(edu.location);
                if (edu.degree)
                    education.degree = safeString(edu.degree);
                if (edu.field)
                    education.field = safeString(edu.field);
                if (edu.startDate || edu.start)
                    education.startDate = safeString(edu.startDate || edu.start);
                if (edu.graduationDate || edu.endDate || edu.end) {
                    education.graduationDate = safeString(edu.graduationDate || edu.endDate || edu.end);
                }
                if (edu.description)
                    education.description = safeString(edu.description);
                if (edu.grade)
                    education.grade = safeString(edu.grade);
                return Object.keys(education).length > 0 ? education : null;
            })
                .filter(function (edu) { return edu !== null; });
        }
    }
    // Internships
    if (source.internships) {
        var internData = source.internships;
        var internArray = Array.isArray(internData) ? internData : objectToArray(internData);
        if (internArray && internArray.length > 0) {
            normalized.internships = internArray
                .map(function (intern) {
                if (!intern || Object.keys(intern).length === 0)
                    return null;
                var internship = {};
                // Only include id if it exists and looks real
                if (intern.id && typeof intern.id === 'string' &&
                    (intern.id.includes('-') || /^[a-f0-9]{24}$/.test(intern.id))) {
                    internship.id = intern.id;
                }
                if (intern.title || intern.name)
                    internship.title = safeString(intern.title || intern.name);
                if (intern.company)
                    internship.company = safeString(intern.company);
                if (intern.description)
                    internship.description = safeString(intern.description);
                if (intern.duration || intern.dates)
                    internship.duration = safeString(intern.duration || intern.dates);
                return Object.keys(internship).length > 0 ? internship : null;
            })
                .filter(function (intern) { return intern !== null; });
        }
    }
    // Training Programs
    if (source.trainingPrograms || source.training_programs) {
        var trainingData = source.trainingPrograms || source.training_programs;
        var trainingArray = Array.isArray(trainingData) ? trainingData : objectToArray(trainingData);
        if (trainingArray && trainingArray.length > 0) {
            normalized.trainingPrograms = trainingArray
                .map(function (training) {
                if (!training || Object.keys(training).length === 0)
                    return null;
                var program = {};
                if (training.id && typeof training.id === 'string' &&
                    (training.id.includes('-') || /^[a-f0-9]{24}$/.test(training.id))) {
                    program.id = training.id;
                }
                if (training.name || training.title)
                    program.name = safeString(training.name || training.title);
                if (training.provider || training.company)
                    program.provider = safeString(training.provider || training.company);
                if (training.completionDate || training.dates || training.date) {
                    program.completionDate = safeString(training.completionDate || training.dates || training.date);
                }
                if (training.duration)
                    program.duration = safeString(training.duration);
                if (training.description)
                    program.description = safeString(training.description);
                return Object.keys(program).length > 0 ? program : null;
            })
                .filter(function (p) { return p !== null; });
        }
    }
    // Academic Projects
    if (source.academicProjects || source.projects) {
        var projectData = source.academicProjects || source.projects;
        var projectArray = Array.isArray(projectData) ? projectData : objectToArray(projectData);
        if (projectArray && projectArray.length > 0) {
            normalized.academicProjects = projectArray
                .map(function (project) {
                if (!project || Object.keys(project).length === 0)
                    return null;
                var proj = {};
                if (project.id && typeof project.id === 'string' &&
                    (project.id.includes('-') || /^[a-f0-9]{24}$/.test(project.id))) {
                    proj.id = project.id;
                }
                if (project.name || project.title)
                    proj.name = safeString(project.name || project.title);
                if (project.course)
                    proj.course = safeString(project.course);
                if (project.institution)
                    proj.institution = safeString(project.institution);
                if (project.duration || project.dates)
                    proj.duration = safeString(project.duration || project.dates);
                if (project.description)
                    proj.description = safeString(project.description);
                if (project.technologies) {
                    if (Array.isArray(project.technologies)) {
                        proj.technologies = project.technologies.filter(function (t) { return t && typeof t === 'string'; });
                    }
                    else if (typeof project.technologies === 'string') {
                        proj.technologies = [project.technologies];
                    }
                }
                if (project.url)
                    proj.url = safeString(project.url);
                return Object.keys(proj).length > 0 ? proj : null;
            })
                .filter(function (p) { return p !== null; });
        }
    }
    // Leadership Positions
    if (source.leadershipPositions || source.leadership_positions) {
        var leadershipData = source.leadershipPositions || source.leadership_positions;
        var leadershipArray = Array.isArray(leadershipData) ? leadershipData : objectToArray(leadershipData);
        if (leadershipArray && leadershipArray.length > 0) {
            normalized.leadershipPositions = leadershipArray
                .map(function (pos) {
                if (!pos || Object.keys(pos).length === 0)
                    return null;
                var position = {};
                if (pos.id && typeof pos.id === 'string' &&
                    (pos.id.includes('-') || /^[a-f0-9]{24}$/.test(pos.id))) {
                    position.id = pos.id;
                }
                if (pos.position || pos.title || pos.name) {
                    position.position = safeString(pos.position || pos.title || pos.name);
                }
                if (pos.organization || pos.company)
                    position.organization = safeString(pos.organization || pos.company);
                if (pos.startDate || pos.start)
                    position.startDate = safeString(pos.startDate || pos.start);
                if (pos.endDate || pos.end)
                    position.endDate = safeString(pos.endDate || pos.end);
                if (pos.description)
                    position.description = safeString(pos.description);
                return Object.keys(position).length > 0 ? position : null;
            })
                .filter(function (p) { return p !== null; });
        }
    }
    // Co-Curricular
    if (source.coCurricular || source.coCurricularActivities) {
        var coData = source.coCurricular || source.coCurricularActivities;
        var coArray = Array.isArray(coData) ? coData : objectToArray(coData);
        if (coArray && coArray.length > 0) {
            normalized.coCurricular = coArray
                .map(function (item) {
                if (!item || Object.keys(item).length === 0)
                    return null;
                var activity = {};
                if (item.id && typeof item.id === 'string' &&
                    (item.id.includes('-') || /^[a-f0-9]{24}$/.test(item.id))) {
                    activity.id = item.id;
                }
                if (item.activity || item.title || item.name) {
                    activity.activity = safeString(item.activity || item.title || item.name);
                }
                if (item.role)
                    activity.role = safeString(item.role);
                if (item.year || item.date)
                    activity.year = safeString(item.year || item.date);
                return Object.keys(activity).length > 0 ? activity : null;
            })
                .filter(function (a) { return a !== null; });
        }
    }
    // Extracurricular
    if (source.extracurricular || source.extracurricularActivities) {
        var extraData = source.extracurricular || source.extracurricularActivities;
        var extraArray = Array.isArray(extraData) ? extraData : objectToArray(extraData);
        if (extraArray && extraArray.length > 0) {
            normalized.extracurricular = extraArray
                .map(function (item) {
                if (!item || Object.keys(item).length === 0)
                    return null;
                var activity = {};
                if (item.id && typeof item.id === 'string' &&
                    (item.id.includes('-') || /^[a-f0-9]{24}$/.test(item.id))) {
                    activity.id = item.id;
                }
                if (item.activity || item.title || item.name) {
                    activity.activity = safeString(item.activity || item.title || item.name);
                }
                if (item.role)
                    activity.role = safeString(item.role);
                if (item.year || item.date)
                    activity.year = safeString(item.year || item.date);
                return Object.keys(activity).length > 0 ? activity : null;
            })
                .filter(function (a) { return a !== null; });
        }
    }
    // Languages
    if (source.languages) {
        if (Array.isArray(source.languages)) {
            normalized.languages = source.languages
                .map(function (lang) {
                if (!lang || Object.keys(lang).length === 0)
                    return null;
                var language = {};
                if (lang.language)
                    language.language = safeString(lang.language);
                if (lang.level)
                    language.level = safeString(lang.level);
                if (lang.capability)
                    language.capability = safeString(lang.capability);
                return Object.keys(language).length > 0 ? language : null;
            })
                .filter(function (l) { return l !== null; });
        }
        else if (typeof source.languages === 'object') {
            // Handle object format {English: {level: "Intermediate"}}
            normalized.languages = Object.entries(source.languages)
                .map(function (_a) {
                var lang = _a[0], data = _a[1];
                var language = { language: lang };
                if (data && typeof data === 'object') {
                    if (data.level)
                        language.level = safeString(data.level);
                    if (data.capability)
                        language.capability = safeString(data.capability);
                }
                else if (typeof data === 'string') {
                    language.level = data;
                }
                return language;
            })
                .filter(function (l) { return l.language; });
        }
    }
    // Certifications
    if (source.certifications) {
        if (Array.isArray(source.certifications)) {
            normalized.certifications = source.certifications
                .map(function (cert) {
                if (!cert || Object.keys(cert).length === 0)
                    return null;
                var certification = {};
                if (cert.id && typeof cert.id === 'string' &&
                    (cert.id.includes('-') || /^[a-f0-9]{24}$/.test(cert.id))) {
                    certification.id = cert.id;
                }
                if (cert.name || cert.title)
                    certification.name = safeString(cert.name || cert.title);
                if (cert.issuer || cert.company)
                    certification.issuer = safeString(cert.issuer || cert.company);
                if (cert.date)
                    certification.date = safeString(cert.date);
                if (cert.url)
                    certification.url = safeString(cert.url);
                return Object.keys(certification).length > 0 ? certification : null;
            })
                .filter(function (c) { return c !== null; });
        }
        else if (typeof source.certifications === 'object') {
            normalized.certifications = Object.entries(source.certifications)
                .map(function (_a) {
                var name = _a[0], data = _a[1];
                var certification = { name: name };
                if (data && typeof data === 'object') {
                    if (data.issuer)
                        certification.issuer = safeString(data.issuer);
                    if (data.date)
                        certification.date = safeString(data.date);
                    if (data.url)
                        certification.url = safeString(data.url);
                }
                return certification;
            });
        }
    }
    // Scholarships
    if (source.scholarships) {
        if (Array.isArray(source.scholarships)) {
            normalized.scholarships = source.scholarships
                .map(function (scholar) {
                if (!scholar || Object.keys(scholar).length === 0)
                    return null;
                var scholarship = {};
                if (scholar.id && typeof scholar.id === 'string' &&
                    (scholar.id.includes('-') || /^[a-f0-9]{24}$/.test(scholar.id))) {
                    scholarship.id = scholar.id;
                }
                if (scholar.name || scholar.title)
                    scholarship.name = safeString(scholar.name || scholar.title);
                if (scholar.provider || scholar.company)
                    scholarship.provider = safeString(scholar.provider || scholar.company);
                if (scholar.organization)
                    scholarship.organization = safeString(scholar.organization);
                if (scholar.year || scholar.date)
                    scholarship.year = safeString(scholar.year || scholar.date);
                if (scholar.description)
                    scholarship.description = safeString(scholar.description);
                return Object.keys(scholarship).length > 0 ? scholarship : null;
            })
                .filter(function (s) { return s !== null; });
        }
    }
    // Awards
    if (source.awards) {
        var awardsArray = Array.isArray(source.awards) ? source.awards : objectToArray(source.awards);
        if (awardsArray && awardsArray.length > 0) {
            normalized.awards = awardsArray
                .map(function (award) {
                if (!award || Object.keys(award).length === 0)
                    return null;
                var awardItem = {};
                if (award.id && typeof award.id === 'string' &&
                    (award.id.includes('-') || /^[a-f0-9]{24}$/.test(award.id) || award.id.startsWith('award-'))) {
                    awardItem.id = award.id;
                }
                if (award.title || award.name)
                    awardItem.title = safeString(award.title || award.name);
                if (award.organization || award.company)
                    awardItem.organization = safeString(award.organization || award.company);
                if (award.issueYear || award.year || award.date) {
                    awardItem.issueYear = safeString(award.issueYear || award.year || award.date);
                }
                if (award.description)
                    awardItem.description = safeString(award.description);
                return Object.keys(awardItem).length > 0 ? awardItem : null;
            })
                .filter(function (a) { return a !== null; });
        }
    }
    // Speaking Engagements
    if (source.speakingEngagements) {
        var speakingArray = Array.isArray(source.speakingEngagements) ? source.speakingEngagements : objectToArray(source.speakingEngagements);
        if (speakingArray && speakingArray.length > 0) {
            normalized.speakingEngagements = speakingArray
                .map(function (item) {
                if (!item || Object.keys(item).length === 0)
                    return null;
                var speaking = {};
                if (item.id && typeof item.id === 'string' &&
                    (item.id.includes('-') || /^[a-f0-9]{24}$/.test(item.id) || item.id.startsWith('speaking-'))) {
                    speaking.id = item.id;
                }
                if (item.topic || item.title || item.name)
                    speaking.topic = safeString(item.topic || item.title || item.name);
                if (item.eventName || item.event || item.company) {
                    speaking.eventName = safeString(item.eventName || item.event || item.company);
                }
                if (item.date)
                    speaking.date = safeString(item.date);
                if (item.description)
                    speaking.description = safeString(item.description);
                return Object.keys(speaking).length > 0 ? speaking : null;
            })
                .filter(function (s) { return s !== null; });
        }
    }
    // Memberships
    if (source.memberships) {
        var membershipsArray = Array.isArray(source.memberships) ? source.memberships : objectToArray(source.memberships);
        if (membershipsArray && membershipsArray.length > 0) {
            normalized.memberships = membershipsArray
                .map(function (item) {
                if (!item || Object.keys(item).length === 0)
                    return null;
                var membership = {};
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
                if (item.year || item.date)
                    membership.year = safeString(item.year || item.date);
                if (item.description)
                    membership.description = safeString(item.description);
                return Object.keys(membership).length > 0 ? membership : null;
            })
                .filter(function (m) { return m !== null; });
        }
    }
    // Workshops
    if (source.workshops) {
        var workshopsArray = Array.isArray(source.workshops) ? source.workshops : objectToArray(source.workshops);
        if (workshopsArray && workshopsArray.length > 0) {
            normalized.workshops = workshopsArray
                .map(function (item) {
                if (!item || Object.keys(item).length === 0)
                    return null;
                var workshop = {};
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
                if (item.year || item.date)
                    workshop.year = safeString(item.year || item.date);
                if (item.description)
                    workshop.description = safeString(item.description);
                return Object.keys(workshop).length > 0 ? workshop : null;
            })
                .filter(function (w) { return w !== null; });
        }
    }
    // Professional Context
    if (source.professionalContext || source.professional_context) {
        var pc = source.professionalContext || source.professional_context;
        var profContext = {};
        if (pc.id && typeof pc.id === 'string' &&
            (pc.id.includes('-') || /^[a-f0-9]{24}$/.test(pc.id))) {
            profContext.id = pc.id;
        }
        if (pc.totalExperience)
            profContext.totalExperience = safeString(pc.totalExperience);
        if (pc.teamSize)
            profContext.teamSize = safeString(pc.teamSize);
        if (pc.industry)
            profContext.industry = safeString(pc.industry);
        if (pc.functionalDomain)
            profContext.functionalDomain = safeString(pc.functionalDomain);
        if (pc.geographicScope)
            profContext.geographicScope = safeString(pc.geographicScope);
        if (pc.revenueResponsibility)
            profContext.revenueResponsibility = safeString(pc.revenueResponsibility);
        if (Object.keys(profContext).length > 0) {
            normalized.professionalContext = profContext;
        }
    }
    // Section Visibility
    if (source.sectionVisibility && Object.keys(source.sectionVisibility).length > 0) {
        normalized.sectionVisibility = source.sectionVisibility;
    }
    // Font settings
    if (source.fontSize)
        normalized.fontSize = source.fontSize;
    if (source.fontFamily)
        normalized.fontFamily = safeString(source.fontFamily);
    // Portfolio
    if (source.portfolio) {
        var portfolioArray = Array.isArray(source.portfolio) ? source.portfolio : objectToArray(source.portfolio);
        if (portfolioArray && portfolioArray.length > 0) {
            normalized.portfolio = portfolioArray
                .map(function (item) {
                if (!item || Object.keys(item).length === 0)
                    return null;
                var portfolio = {};
                if (item.id && typeof item.id === 'string' &&
                    (item.id.includes('-') || /^[a-f0-9]{24}$/.test(item.id))) {
                    portfolio.id = item.id;
                }
                if (item.name || item.title)
                    portfolio.name = safeString(item.name || item.title);
                if (item.description)
                    portfolio.description = safeString(item.description);
                if (item.url)
                    portfolio.url = safeString(item.url);
                if (item.type)
                    portfolio.type = safeString(item.type);
                if (item.platform)
                    portfolio.platform = safeString(item.platform);
                return Object.keys(portfolio).length > 0 ? portfolio : null;
            })
                .filter(function (p) { return p !== null; });
        }
    }
    // Client Projects
    if (source.clientProjects) {
        var clientArray = Array.isArray(source.clientProjects) ? source.clientProjects : objectToArray(source.clientProjects);
        if (clientArray && clientArray.length > 0) {
            normalized.clientProjects = clientArray
                .map(function (item) {
                if (!item || Object.keys(item).length === 0)
                    return null;
                var project = {};
                if (item.id && typeof item.id === 'string' &&
                    (item.id.includes('-') || /^[a-f0-9]{24}$/.test(item.id))) {
                    project.id = item.id;
                }
                if (item.name || item.title)
                    project.name = safeString(item.name || item.title);
                if (item.role)
                    project.role = safeString(item.role);
                if (item.description)
                    project.description = safeString(item.description);
                if (item.clientOrganization)
                    project.clientOrganization = safeString(item.clientOrganization);
                if (item.duration)
                    project.duration = safeString(item.duration);
                if (item.toolsTechnologies) {
                    if (Array.isArray(item.toolsTechnologies)) {
                        project.toolsTechnologies = item.toolsTechnologies.filter(function (t) { return t; });
                    }
                    else if (typeof item.toolsTechnologies === 'string') {
                        project.toolsTechnologies = item.toolsTechnologies;
                    }
                }
                if (item.projectUrl || item.url)
                    project.projectUrl = safeString(item.projectUrl || item.url);
                return Object.keys(project).length > 0 ? project : null;
            })
                .filter(function (p) { return p !== null; });
        }
    }
    // Volunteering
    if (source.volunteering) {
        var volArray = Array.isArray(source.volunteering) ? source.volunteering : objectToArray(source.volunteering);
        if (volArray && volArray.length > 0) {
            normalized.volunteering = volArray
                .map(function (item) {
                if (!item || Object.keys(item).length === 0)
                    return null;
                var volunteer = {};
                if (item.id && typeof item.id === 'string' &&
                    (item.id.includes('-') || /^[a-f0-9]{24}$/.test(item.id))) {
                    volunteer.id = item.id;
                }
                if (item.organization || item.company)
                    volunteer.organization = safeString(item.organization || item.company);
                if (item.role || item.title)
                    volunteer.role = safeString(item.role || item.title);
                if (item.description)
                    volunteer.description = safeString(item.description);
                if (item.causeArea || item.cause)
                    volunteer.causeArea = safeString(item.causeArea || item.cause);
                if (item.duration)
                    volunteer.duration = safeString(item.duration);
                return Object.keys(volunteer).length > 0 ? volunteer : null;
            })
                .filter(function (v) { return v !== null; });
        }
    }
    // Military Service
    if (source.militaryService) {
        var militaryArray = Array.isArray(source.militaryService) ? source.militaryService : objectToArray(source.militaryService);
        if (militaryArray && militaryArray.length > 0) {
            normalized.militaryService = militaryArray
                .map(function (item) {
                if (!item || Object.keys(item).length === 0)
                    return null;
                var service = {};
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
                if (item.description)
                    service.description = safeString(item.description);
                if (item.duration)
                    service.duration = safeString(item.duration);
                if (item.specialization)
                    service.specialization = safeString(item.specialization);
                return Object.keys(service).length > 0 ? service : null;
            })
                .filter(function (s) { return s !== null; });
        }
    }
    // Methodologies
    if (source.methodologies) {
        var methodArray = Array.isArray(source.methodologies) ? source.methodologies : objectToArray(source.methodologies);
        if (methodArray && methodArray.length > 0) {
            normalized.methodologies = methodArray
                .map(function (item) {
                if (!item || Object.keys(item).length === 0)
                    return null;
                var method = {};
                if (item.id && typeof item.id === 'string' &&
                    (item.id.includes('-') || /^[a-f0-9]{24}$/.test(item.id))) {
                    method.id = item.id;
                }
                if (item.name || item.methodology)
                    method.name = safeString(item.name || item.methodology);
                if (item.certification)
                    method.certification = safeString(item.certification);
                if (item.experienceDuration || item.experience) {
                    method.experienceDuration = safeString(item.experienceDuration || item.experience);
                }
                return Object.keys(method).length > 0 ? method : null;
            })
                .filter(function (m) { return m !== null; });
        }
    }
    // Industry Expertise
    if (source.industryExpertise) {
        var expArray = Array.isArray(source.industryExpertise) ? source.industryExpertise : objectToArray(source.industryExpertise);
        if (expArray && expArray.length > 0) {
            normalized.industryExpertise = expArray
                .map(function (item) {
                if (!item || Object.keys(item).length === 0)
                    return null;
                var expertise = {};
                if (item.id && typeof item.id === 'string' &&
                    (item.id.includes('-') || /^[a-f0-9]{24}$/.test(item.id))) {
                    expertise.id = item.id;
                }
                if (item.industry || item.name || item.id) {
                    expertise.industry = safeString(item.industry || item.name || item.id);
                }
                if (item.domainArea || item.domain)
                    expertise.domainArea = safeString(item.domainArea || item.domain);
                if (item.experienceDuration || item.experience) {
                    expertise.experienceDuration = safeString(item.experienceDuration || item.experience);
                }
                return Object.keys(expertise).length > 0 ? expertise : null;
            })
                .filter(function (e) { return e !== null; });
        }
    }
    // References
    if (source.references) {
        var refArray = Array.isArray(source.references) ? source.references : objectToArray(source.references);
        if (refArray && refArray.length > 0) {
            normalized.references = refArray
                .map(function (item) {
                if (!item || Object.keys(item).length === 0)
                    return null;
                var ref = {};
                if (item.id && typeof item.id === 'string' &&
                    (item.id.includes('-') || /^[a-f0-9]{24}$/.test(item.id))) {
                    ref.id = item.id;
                }
                if (item.name)
                    ref.name = safeString(item.name);
                if (item.designationRelationship || item.role) {
                    ref.designationRelationship = safeString(item.designationRelationship || item.role);
                }
                if (item.organization)
                    ref.organization = safeString(item.organization);
                if (item.contactInformation || item.contact) {
                    ref.contactInformation = safeString(item.contactInformation || item.contact);
                }
                return Object.keys(ref).length > 0 ? ref : null;
            })
                .filter(function (r) { return r !== null; });
        }
    }
    // Social Profiles
    if (source.socialProfiles) {
        var socialArray = Array.isArray(source.socialProfiles) ? source.socialProfiles : objectToArray(source.socialProfiles);
        if (socialArray && socialArray.length > 0) {
            normalized.socialProfiles = socialArray
                .map(function (item) {
                if (!item || Object.keys(item).length === 0)
                    return null;
                var profile = {};
                if (item.id && typeof item.id === 'string' &&
                    (item.id.includes('-') || /^[a-f0-9]{24}$/.test(item.id))) {
                    profile.id = item.id;
                }
                if (item.platform)
                    profile.platform = safeString(item.platform);
                if (item.url)
                    profile.url = safeString(item.url);
                return Object.keys(profile).length > 0 ? profile : null;
            })
                .filter(function (p) { return p !== null; });
        }
    }
    // Availability Work Auth
    if (source.availabilityWorkAuth || source.availability_work_authorization) {
        var auth = source.availabilityWorkAuth || source.availability_work_authorization;
        var workAuth = {};
        if (auth.availabilityNoticePeriod || auth.noticePeriod) {
            workAuth.availabilityNoticePeriod = safeString(auth.availabilityNoticePeriod || auth.noticePeriod);
        }
        if (auth.workAuthorizationStatus || auth.workAuth) {
            workAuth.workAuthorizationStatus = safeString(auth.workAuthorizationStatus || auth.workAuth);
        }
        if (auth.preferredLocation)
            workAuth.preferredLocation = safeString(auth.preferredLocation);
        if (Object.keys(workAuth).length > 0) {
            normalized.availabilityWorkAuth = workAuth;
        }
    }
    // Teaching Experience
    if (source.teachingExperience) {
        var teachArray = Array.isArray(source.teachingExperience) ? source.teachingExperience : objectToArray(source.teachingExperience);
        if (teachArray && teachArray.length > 0) {
            normalized.teachingExperience = teachArray
                .map(function (item) {
                if (!item || Object.keys(item).length === 0)
                    return null;
                var teaching = {};
                if (item.id && typeof item.id === 'string' &&
                    (item.id.includes('-') || /^[a-f0-9]{24}$/.test(item.id))) {
                    teaching.id = item.id;
                }
                if (item.title)
                    teaching.title = safeString(item.title);
                if (item.institution || item.company)
                    teaching.institution = safeString(item.institution || item.company);
                if (item.description)
                    teaching.description = safeString(item.description);
                if (item.subjectCourseTaught || item.role) {
                    teaching.subjectCourseTaught = safeString(item.subjectCourseTaught || item.role);
                }
                if (item.duration)
                    teaching.duration = safeString(item.duration);
                return Object.keys(teaching).length > 0 ? teaching : null;
            })
                .filter(function (t) { return t !== null; });
        }
    }
    // Mentorship Experience
    if (source.mentorshipExperience) {
        var mentorArray = Array.isArray(source.mentorshipExperience) ? source.mentorshipExperience : objectToArray(source.mentorshipExperience);
        if (mentorArray && mentorArray.length > 0) {
            normalized.mentorshipExperience = mentorArray
                .map(function (item) {
                if (!item || Object.keys(item).length === 0)
                    return null;
                var mentor = {};
                if (item.id && typeof item.id === 'string' &&
                    (item.id.includes('-') || /^[a-f0-9]{24}$/.test(item.id))) {
                    mentor.id = item.id;
                }
                if (item.description)
                    mentor.description = safeString(item.description);
                if (item.mentorshipArea || item.role) {
                    mentor.mentorshipArea = safeString(item.mentorshipArea || item.role);
                }
                if (item.organizationPlatform || item.title || item.company) {
                    mentor.organizationPlatform = safeString(item.organizationPlatform || item.title || item.company);
                }
                if (item.menteeLevel)
                    mentor.menteeLevel = safeString(item.menteeLevel);
                if (item.duration)
                    mentor.duration = safeString(item.duration);
                return Object.keys(mentor).length > 0 ? mentor : null;
            })
                .filter(function (m) { return m !== null; });
        }
    }
    // Research Grants
    if (source.researchGrants) {
        var grantArray = Array.isArray(source.researchGrants) ? source.researchGrants : objectToArray(source.researchGrants);
        if (grantArray && grantArray.length > 0) {
            normalized.researchGrants = grantArray
                .map(function (item) {
                if (!item || Object.keys(item).length === 0)
                    return null;
                var grant = {};
                if (item.id && typeof item.id === 'string' &&
                    (item.id.includes('-') || /^[a-f0-9]{24}$/.test(item.id))) {
                    grant.id = item.id;
                }
                if (item.title || item.name)
                    grant.title = safeString(item.title || item.name);
                if (item.agency)
                    grant.agency = safeString(item.agency);
                if (item.amount)
                    grant.amount = safeString(item.amount);
                if (item.description)
                    grant.description = safeString(item.description);
                if (item.year)
                    grant.year = safeString(item.year);
                return Object.keys(grant).length > 0 ? grant : null;
            })
                .filter(function (g) { return g !== null; });
        }
    }
    // Test Scores
    if (source.testScores) {
        var testArray = Array.isArray(source.testScores) ? source.testScores : objectToArray(source.testScores);
        if (testArray && testArray.length > 0) {
            normalized.testScores = testArray
                .map(function (item) {
                if (!item || Object.keys(item).length === 0)
                    return null;
                var test = {};
                if (item.id && typeof item.id === 'string' &&
                    (item.id.includes('-') || /^[a-f0-9]{24}$/.test(item.id))) {
                    test.id = item.id;
                }
                if (item.testName || item.name)
                    test.testName = safeString(item.testName || item.name);
                if (item.score !== undefined && item.score !== null) {
                    if (typeof item.score === 'number') {
                        test.score = item.score;
                    }
                    else {
                        test.score = safeString(item.score);
                    }
                }
                if (item.year)
                    test.year = safeString(item.year);
                if (item.percentileRank || item.percentile) {
                    test.percentileRank = safeString(item.percentileRank || item.percentile);
                }
                return Object.keys(test).length > 0 ? test : null;
            })
                .filter(function (t) { return t !== null; });
        }
    }
    // Publications
    if (source.publications) {
        var pubArray = Array.isArray(source.publications) ? source.publications : objectToArray(source.publications);
        if (pubArray && pubArray.length > 0) {
            normalized.publications = pubArray
                .map(function (item) {
                if (!item || Object.keys(item).length === 0)
                    return null;
                var pub = {};
                if (item.id && typeof item.id === 'string' &&
                    (item.id.includes('-') || /^[a-f0-9]{24}$/.test(item.id))) {
                    pub.id = item.id;
                }
                if (item.title || item.name)
                    pub.title = safeString(item.title || item.name);
                if (item.journalPublisher)
                    pub.journalPublisher = safeString(item.journalPublisher);
                if (item.publicationType)
                    pub.publicationType = safeString(item.publicationType);
                if (item.year)
                    pub.year = safeString(item.year);
                if (item.urlDoi || item.url)
                    pub.urlDoi = safeString(item.urlDoi || item.url);
                if (item.authors)
                    pub.authors = safeString(item.authors);
                return Object.keys(pub).length > 0 ? pub : null;
            })
                .filter(function (p) { return p !== null; });
        }
    }
    // Patents
    if (source.patents) {
        var patentArray = Array.isArray(source.patents) ? source.patents : objectToArray(source.patents);
        if (patentArray && patentArray.length > 0) {
            normalized.patents = patentArray
                .map(function (item) {
                if (!item || Object.keys(item).length === 0)
                    return null;
                var patent = {};
                if (item.id && typeof item.id === 'string' &&
                    (item.id.includes('-') || /^[a-f0-9]{24}$/.test(item.id))) {
                    patent.id = item.id;
                }
                if (item.title || item.name)
                    patent.title = safeString(item.title || item.name);
                if (item.patentNumber)
                    patent.patentNumber = safeString(item.patentNumber);
                if (item.status)
                    patent.status = safeString(item.status);
                if (item.issuingAuthority)
                    patent.issuingAuthority = safeString(item.issuingAuthority);
                if (item.year)
                    patent.year = safeString(item.year);
                return Object.keys(patent).length > 0 ? patent : null;
            })
                .filter(function (p) { return p !== null; });
        }
    }
    // Tools & Technologies
    if (source.toolsTechnologies) {
        var toolArray = Array.isArray(source.toolsTechnologies) ? source.toolsTechnologies : objectToArray(source.toolsTechnologies);
        if (toolArray && toolArray.length > 0) {
            normalized.toolsTechnologies = toolArray
                .map(function (item) {
                if (!item || Object.keys(item).length === 0)
                    return null;
                var tool = {};
                if (item.id && typeof item.id === 'string' &&
                    (item.id.includes('-') || /^[a-f0-9]{24}$/.test(item.id))) {
                    tool.id = item.id;
                }
                if (item.name || item.tool)
                    tool.name = safeString(item.name || item.tool);
                if (item.category)
                    tool.category = safeString(item.category);
                if (item.proficiency)
                    tool.proficiency = safeString(item.proficiency);
                if (item.experienceDuration || item.experience) {
                    tool.experienceDuration = safeString(item.experienceDuration || item.experience);
                }
                return Object.keys(tool).length > 0 ? tool : null;
            })
                .filter(function (t) { return t !== null; });
        }
    }
    //   console.log("NORMALIZED SKILLS:", normalized.skills);
    // console.log("NORMALIZED CORE:", normalized.coreCompetencies);
    return normalized;
}
exports.normalizeParsedResume = normalizeParsedResume;
// Helper function for date parsing (if needed)
function parseDateRange(dateStr) {
    if (!dateStr || typeof dateStr !== 'string') {
        return { startDate: null, endDate: null, isCurrent: false };
    }
    var startDate = null;
    var endDate = null;
    var isCurrent = false;
    if (/present|current|now/i.test(dateStr)) {
        isCurrent = true;
        var parts = dateStr.split(/\s*[-–—]\s*|\s*to\s*/);
        if (parts.length >= 1) {
            startDate = parts[0].trim();
        }
    }
    else {
        var parts = dateStr.split(/\s*[-–—]\s*|\s*to\s*/);
        if (parts.length >= 1)
            startDate = parts[0].trim();
        if (parts.length >= 2)
            endDate = parts[1].trim();
    }
    return { startDate: startDate, endDate: endDate, isCurrent: isCurrent };
}
