// useQualifications.ts
import { useState, useCallback, useEffect } from 'react';
import { QualificationAPI, Qualification, FieldOfStudy, EducationInstitution } from '../api/qualification-api';

export function useQualifications() {
  const [suggestions, setSuggestions] = useState<Qualification[]>([]);
  const [fields, setFields] = useState<FieldOfStudy[]>([]);
  const [institutions, setInstitutions] = useState<EducationInstitution[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Search qualifications
  const searchQualifications = useCallback((query: string) => {
    if (!query.trim()) {
      setSuggestions(QualificationAPI.getPopularQualifications());
      return;
    }
    
    setLoading(true);
    setTimeout(() => {
      const results = QualificationAPI.searchQualifications(query);
      setSuggestions(results);
      setLoading(false);
    }, 150);
  }, []);
  
  // Search fields of study
  const searchFields = useCallback((query: string) => {
    if (!query.trim()) {
      setFields(QualificationAPI.getFieldsByCategory('technology').slice(0, 10));
      return;
    }
    
    setLoading(true);
    setTimeout(() => {
      const results = QualificationAPI.searchFields(query);
      setFields(results);
      setLoading(false);
    }, 150);
  }, []);
  
  // Search institutions
  const searchInstitutions = useCallback((query: string) => {
    if (!query.trim()) {
      setInstitutions(QualificationAPI.getInstitutionsByType('university').slice(0, 10));
      return;
    }
    
    setLoading(true);
    setTimeout(() => {
      const results = QualificationAPI.searchInstitutions(query);
      setInstitutions(results);
      setLoading(false);
    }, 150);
  }, []);
  
  // Get qualifications for a specific field
  const getQualificationsForField = useCallback((fieldId: string) => {
    return QualificationAPI.getQualificationsForField(fieldId);
  }, []);
  
  // Get all degree types
  const getDegreeTypes = useCallback(() => {
    return [
      { label: 'Undergraduate', value: 'undergraduate' },
      { label: 'Postgraduate', value: 'postgraduate' },
      { label: 'Doctorate', value: 'doctorate' },
    ];
  }, []);
  
  // Get qualification categories
  const getQualificationCategories = useCallback(() => {
    const categories = new Set(QualificationAPI.getDegrees().map(q => q.category));
    return Array.from(categories).map(cat => ({
      label: cat.charAt(0).toUpperCase() + cat.slice(1),
      value: cat
    }));
  }, []);
  
  // Initialize with popular suggestions
  useEffect(() => {
    setSuggestions(QualificationAPI.getPopularQualifications());
    setFields(QualificationAPI.getFieldsByCategory('technology').slice(0, 10));
    setInstitutions(QualificationAPI.getInstitutionsByType('university').slice(0, 10));
  }, []);
  
  return {
    suggestions,
    fields,
    institutions,
    loading,
    searchQualifications,
    searchFields,
    searchInstitutions,
    getQualificationsForField,
    getDegreeTypes,
    getQualificationCategories,
  };
}