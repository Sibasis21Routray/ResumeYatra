import { resumeAPI } from "./services/apiClient";

export type Language = "en" | "es" | "fr" | "hi" | "bn";

export const translations: Record<Language, Record<string, string>> = {
  en: {
    greatProgress: "Great Progress!",
    getStarted: "Let's Get Started!",
    fillSection: "Now, let's fill in your",
    almostDone: "You're Almost Done!",
    completed: "You've completed",
    section: "section",
    sections: "sections",
    more: "more",
    helpText:
      "Get help with content suggestions, grammar fixes, and professional phrasing.",
    back: "Back",
    continueTo: "Continue to",
    finishResume: "Finish Resume",
    loading: "Loading your resume...",
    previewError: "Preview Error",
    resumePreview: "Resume preview will appear here",
    continueBuilding: "Continue to start building your resume",
  },
  es: {
    greatProgress: "¡Gran progreso!",
    getStarted: "¡Empecemos!",
    fillSection: "Ahora, completemos tu sección de",
    almostDone: "¡Ya casi terminas!",
    completed: "Has completado",
    section: "sección",
    sections: "secciones",
    more: "más",
    helpText:
      "Obtén ayuda con sugerencias de contenido, correcciones gramaticales y frases profesionales.",
    back: "Atrás",
    continueTo: "Continuar a",
    finishResume: "Finalizar currículum",
    loading: "Cargando tu currículum...",
    previewError: "Error de vista previa",
    resumePreview: "La vista previa del currículum aparecerá aquí",
    continueBuilding: "Continúa para comenzar a construir tu currículum",
  },
  fr: {
    greatProgress: "Excellent progrès !",
    getStarted: "Commençons !",
    fillSection: "Maintenant, remplissons votre section",
    almostDone: "Vous avez presque terminé !",
    completed: "Vous avez terminé",
    section: "section",
    sections: "sections",
    more: "plus",
    helpText:
      "Obtenez de l'aide avec des suggestions de contenu, des corrections grammaticales et des formulations professionnelles.",
    back: "Retour",
    continueTo: "Continuer vers",
    finishResume: "Terminer le CV",
    loading: "Chargement de votre CV...",
    previewError: "Erreur de prévisualisation",
    resumePreview: "L'aperçu du CV apparaîtra ici",
    continueBuilding: "Continuez pour commencer à construire votre CV",
  },
  hi: {
    greatProgress: "अद्भुत प्रगति!",
    getStarted: "आइए शुरू करें!",
    fillSection: "अब आपका भरें",
    almostDone: "आप लगभग तैयार हैं!",
    completed: "आपने पूरा किया है",
    section: "अनुभाग",
    sections: "अनुभाग",
    more: "और",
    helpText:
      "सामग्री सुझाव, व्याकरण सुधार और पेशेवर वाक्य रचना में मदद प्राप्त करें।",
    back: "वापस",
    continueTo: "जारी रखें",
    finishResume: "रिज्यूमे समाप्त करें",
    loading: "आपका रिज्यूमे लोड हो रहा है...",
    previewError: "पूर्वावलोकन त्रुटि",
    resumePreview: "रिज्यूमे पूर्वावलोकन यहां दिखाई देगा",
    continueBuilding: "बिल्डिंग जारी रखने के लिए आगे बढ़ें",
  },
  bn: {
    greatProgress: "চমৎকার অগ্রগতি!",
    getStarted: "চলুন শুরু করি!",
    fillSection: "এখন আপনার পূরণ করুন",
    almostDone: "আপনি প্রায় শেষ!",
    completed: "আপনি সম্পন্ন করেছেন",
    section: "অধ্যায়",
    sections: "অধ্যায়",
    more: "আরও",
    helpText:
      "সামগ্রী পরামর্শ, ব্যাকরণ সংশোধন এবং পেশাদার বাক্য গঠনে সাহায্য পান।",
    back: "পিছনে",
    continueTo: "চালিয়ে যান",
    finishResume: "রেজুমে শেষ করুন",
    loading: "আপনার রেজুমে লোড হচ্ছে...",
    previewError: "প্রিভিউ ত্রুটি",
    resumePreview: "রেজুমে প্রিভিউ এখানে প্রদর্শিত হবে",
    continueBuilding: "নির্মাণ চালিয়ে যেতে এগিয়ে যান",
  },
};

// Cache for dynamic translations
const translationCache: Map<string, Record<string, string>> = new Map();

export async function getDynamicTranslation(
  resumeId: string,
  targetLanguage: string,
  text: string
): Promise<string> {
  const cacheKey = `${targetLanguage}:${text}`;
  if (translationCache.has(cacheKey)) {
    return translationCache.get(cacheKey)![text] || text;
  }

  try {
    const response = await resumeAPI.translate(resumeId, text, targetLanguage);
    const translated = response.data.translated;

    // Cache the result
    if (!translationCache.has(targetLanguage)) {
      translationCache.set(targetLanguage, {});
    }
    translationCache.get(targetLanguage)![text] = translated;

    return translated;
  } catch (error) {
    console.error("Translation failed:", error);
    return text; // Fallback to original text
  }
}

export async function getTranslatedTexts(
  resumeId: string,
  targetLanguage: string,
  keys: string[]
): Promise<Record<string, string>> {
  const englishTexts = keys.map((key) => translations.en[key] || key);
  const translated: Record<string, string> = {};

  // Translate each text
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    const englishText = englishTexts[i];
    translated[key] = await getDynamicTranslation(
      resumeId,
      targetLanguage,
      englishText
    );
  }

  return translated;
}
