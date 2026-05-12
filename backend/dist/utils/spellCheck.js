"use strict";
// Basic spell-check and content validation utilities
Object.defineProperty(exports, "__esModule", { value: true });
exports.correctTypos = correctTypos;
exports.validateGrammar = validateGrammar;
exports.enhanceWithActionVerbs = enhanceWithActionVerbs;
exports.spellCheckContent = spellCheckContent;
exports.isContentQualityPoor = isContentQualityPoor;
exports.retryWithQualityCheck = retryWithQualityCheck;
// Common typos in resume context and their corrections
const COMMON_TYPOS = {
    'buit': 'built',
    'bult': 'built',
    'buillt': 'built',
    'developement': 'development',
    'managment': 'management',
    'recieve': 'receive',
    'seperate': 'separate',
    'definately': 'definitely',
    'occured': 'occurred',
    'begining': 'beginning',
    'accomodate': 'accommodate',
    'maintainance': 'maintenance',
    'occurence': 'occurrence',
    'resistence': 'resistance',
    'suprise': 'surprise',
    'wich': 'which',
    'till': 'until',
    'seperately': 'separately',
    'independant': 'independent',
    'existance': 'existence',
    'concious': 'conscious',
    'harrass': 'harass',
    'commited': 'committed',
    'tommorow': 'tomorrow',
    'neccessary': 'necessary',
    'embarass': 'embarrass',
    'priviledge': 'privilege',
    'agressive': 'aggressive',
    'agressively': 'aggressively',
    'congradulations': 'congratulations',
    'tansfer': 'transfer',
    'recomend': 'recommend',
    'recomendation': 'recommendation',
    'indespensable': 'indispensable',
    'occuring': 'occurring',
    'reciept': 'receipt',
    'proccess': 'process',
    'anwser': 'answer',
    'enviroment': 'environment',
    'comming': 'coming'
};
// Grammar rules for resume context
const GRAMMAR_RULES = [
    { pattern: /\b(a|an)\s+[aeiouAEIOU]\b/g, replacement: (match) => match.includes('a') ? match.replace('a', 'an') : match.replace('an', 'a') },
    { pattern: /\b(there|their|they're)\b/g, replacement: (match) => {
            const context = match.toLowerCase();
            return context;
        } }
];
// Resume-specific action verbs that should be used
const RESUME_ACTION_VERBS = [
    'achieved', 'accelerated', 'advanced', 'analyzed', 'automated', 'built', 'coordinated', 'created', 'delivered', 'designed',
    'developed', 'directed', 'enhanced', 'established', 'executed', 'facilitated', 'generated', 'implemented', 'improved',
    'increased', 'launched', 'led', 'managed', 'optimized', 'organized', 'planned', 'reduced', 'resolved', 'streamlined',
    'supervised', 'transformed'
];
function correctTypos(text) {
    let correctedText = text;
    // Fix common typos
    Object.entries(COMMON_TYPOS).forEach(([typo, correction]) => {
        const regex = new RegExp(`\\b${typo}\\b`, 'gi');
        correctedText = correctedText.replace(regex, correction);
    });
    return correctedText;
}
function validateGrammar(text) {
    let validatedText = text;
    // Apply grammar rules
    GRAMMAR_RULES.forEach(rule => {
        validatedText = validatedText.replace(rule.pattern, rule.replacement);
    });
    return validatedText;
}
function enhanceWithActionVerbs(text) {
    // Capitalize first letter of sentences
    let enhanced = text.replace(/(^|\.\s+)([a-z])/g, (match, p1, p2) => {
        return p1 + p2.toUpperCase();
    });
    return enhanced;
}
function spellCheckContent(text) {
    const issues = [];
    let corrected = text;
    // Check for common typos
    Object.keys(COMMON_TYPOS).forEach(typo => {
        const regex = new RegExp(`\\b${typo}\\b`, 'gi');
        if (regex.test(text)) {
            issues.push(`Found typo: "${typo}" should be "${COMMON_TYPOS[typo]}"`);
        }
    });
    // Apply corrections
    corrected = correctTypos(text);
    corrected = validateGrammar(corrected);
    corrected = enhanceWithActionVerbs(corrected);
    return { corrected, issues };
}
function isContentQualityPoor(text) {
    const issues = spellCheckContent(text).issues;
    // Consider content poor if it has many typos or grammar issues
    if (issues.length > 3)
        return true;
    // Check for very short or incomplete content
    if (text.trim().length < 10)
        return true;
    // Check for excessive repetition
    const words = text.toLowerCase().split(/\s+/);
    const wordFreq = words.reduce((acc, word) => {
        acc[word] = (acc[word] || 0) + 1;
        return acc;
    }, {});
    const maxFreq = Math.max(...Object.values(wordFreq));
    if (maxFreq > words.length * 0.3)
        return true; // More than 30% repetition
    return false;
}
function retryWithQualityCheck(text, maxRetries = 2) {
    let attempts = 0;
    let currentText = text;
    while (attempts < maxRetries && isContentQualityPoor(currentText)) {
        attempts++;
        // Apply spell check
        const spellCheck = spellCheckContent(currentText);
        currentText = spellCheck.corrected;
        // If still poor quality after spell check, add more corrections
        if (isContentQualityPoor(currentText)) {
            // Apply more aggressive corrections
            currentText = currentText.replace(/\b(worked on|helped with)\b/gi, 'led');
            currentText = currentText.replace(/\b(very|really|quite)\s+/gi, '');
            currentText = currentText.replace(/\s+/g, ' ').trim();
        }
    }
    return currentText;
}
