import React, { useState, useEffect } from 'react';
import { useResumeStore } from '../../stores';
import { ReviewListStep, ItemConfig } from './steps/ReviewListStep';
import { BasicDetailsStep, FieldConfig } from './steps/BasicDetailsStep';
import { DescriptionStep } from './steps/DescriptionStep';

// Step type
type ProjectStep = 'review' | 'basic' | 'description';

// Project data interface (matching store types)
interface ProjectData {
  id: string;
  name?: string;
  description?: string;
  technologies?: string;
  url?: string;
  urlText?: string;
}


interface ProjectsFormProps {
  data?: any;
  onNext?: () => void;
  onBack?: () => void;
  onOpenAIModal?: () => void;
  resumeId?: string;
}

export function ProjectsForm({
  data,
  onNext,
  onBack,
  onOpenAIModal,
  resumeId,
}: ProjectsFormProps) {
  const updateData = useResumeStore((state) => state.updateData);
  const resumeData = useResumeStore((state) => state.data);

  // Use store data
  const projectsData = resumeData.projects || [];

  const [currentStep, setCurrentStep] = useState<ProjectStep>(projectsData.length === 0 ? 'basic' : 'review');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showSkipModal, setShowSkipModal] = useState(false);

  // Update currentStep based on project data
  useEffect(() => {
    if (projectsData.length === 0) {
      setCurrentStep('basic');
    }
  }, [projectsData.length]);

  // Convert project data to review items
  const reviewItems = projectsData.map(project => ({
    id: project.id,
    title: project.name || 'Untitled Project',
    subtitle: project.technologies || 'No technologies listed',
    description: project.description || '',
    name: project.name,
    technologies: project.technologies,
    url: project.url,
    urlText: project.urlText,
  }));

  // Item config for ReviewListStep
  const itemConfig: ItemConfig = {
    titleField: 'name',
    subtitleField: 'technologies',
    descriptionField: 'description',
  };

  // Basic details fields configuration
  const basicFields: FieldConfig[] = [
    {
      name: 'name',
      label: 'Project Title',
      type: 'text',
      placeholder: 'e.g., E-Commerce Platform',
     
    },
    {
      name: 'technologies',
      label: 'Technologies Used',
      type: 'text',
      placeholder: 'e.g., React, Node.js, MongoDB',
      
    },
    {
      name: 'url',
      label: 'Project URL',
      type: 'url',
      placeholder: 'https://github.com/username/project',
      optional: true,
    },
  ];

  // Get project by ID
  const getProjectById = (id: string): ProjectData | undefined => {
    return projectsData.find(project => project.id === id);
  };

  // Get current editing project data
  const currentProject = editingId ? getProjectById(editingId) : null;

  // Handle add new project
  const handleAdd = () => {
    setEditingId(null);
    setCurrentStep('basic');
  };


  // Handle delete project
  const handleDelete = (id: string) => {
    updateData((draft) => {
      const index = draft.projects.findIndex(project => project.id === id);
      if (index !== -1) {
        draft.projects.splice(index, 1);
      }
    });
  };

 const handleBasicSubmit = (basicData: Record<string, any>) => {
   const isAllRequiredEmpty = !basicData.name && !basicData.technologies;

   // 🔹 CASE 1: All required fields empty → show skip modal
   if (isAllRequiredEmpty) {
     setShowSkipModal(true);
     return;
   }

   // 🔹 CASE 2: Some required fields missing → do nothing (validation will show errors)
   if (!basicData.name || !basicData.technologies) {
     return;
   }

   // 🔹 CASE 3: All required fields filled → continue to description
  const newProject: ProjectData = {
    id: editingId || `proj-${Date.now()}`,
    name: basicData.name,
    technologies: basicData.technologies,
    url: basicData.url,
  };

  if (editingId) {
    updateData((draft) => {
      const index = draft.projects.findIndex(p => p.id === editingId);
      if (index !== -1) {
        draft.projects[index] = {
          ...draft.projects[index],
          ...newProject,
        };
      }
    });
  } else {
    updateData((draft) => {
      draft.projects.push(newProject);
    });
    setEditingId(newProject.id);
  }

  // ✅ Move to description
  setCurrentStep('description');
};



  // Handle description submit
  const handleDescriptionSubmit = (descData: { description: string }) => {
    if (editingId) {
      // Update existing project
      updateData((draft) => {
        const project = draft.projects.find(p => p.id === editingId);
        if (project) {
          project.description = descData.description;
        }
      });
      setCurrentStep('review');
      setEditingId(null);
    } else {
      // This shouldn't happen now, but just in case
      if (onNext) onNext();
    }
  };

  // Handle back navigation
  const handleBack = () => {
    if (currentStep === 'basic' || currentStep === 'description') {
      if (projectsData.length === 0 && currentStep === 'basic') {
        if (onBack) onBack();
      } else {
        setCurrentStep('review');
        setEditingId(null);
      }
    } else if (onBack) {
      onBack();
    }
  };

  // Render current step
  const renderStep = () => {
    switch (currentStep) {
      case 'review':
        return (
          <ReviewListStep
            title="Review your projects"
            items={reviewItems}
            itemConfig={itemConfig}
            emptyTitle="No Projects Added"
            emptyDescription="Add your projects to showcase your technical skills and accomplishments to potential employers."
            addButtonText="+ Add more projects"
            onAdd={handleAdd}
            onEditBasic={(id) => {
              setEditingId(id);
              setCurrentStep('basic');
            }}
            onEditDescription={(id) => {
              setEditingId(id);
              setCurrentStep('description');
            }}
            onDelete={handleDelete}
            onBack={onBack}
            onContinue={() => {
              if (projectsData.length === 0) {
                setShowSkipModal(true);
              } else {
                if (onNext) onNext();
              }
            }}
            canContinue={true}
            isContinueLoading={isLoading}
          />
        );

      case 'basic':
        return (
          <BasicDetailsStep
            title={editingId ? 'Edit project' : 'Add your project'}
            subtitle="Enter the basic details about your project"
            fields={basicFields}
            initialData={currentProject ? {
              name: currentProject.name,
              technologies: currentProject.technologies,
              url: currentProject.url,
            } : {}}
            onSubmit={handleBasicSubmit}
            onEmptySubmit={() => setShowSkipModal(true)}
            onBack={handleBack}
            submitButtonText="Continue"
            isEditing={!!editingId}
            isLoading={isLoading}
          />
        );

      case 'description':
        return (
          <DescriptionStep
            title={editingId ? 'Update your project' : 'Add your project'}
            subtitle="Describe the project, your role, and key achievements"
            initialDescription={currentProject?.description || ''}
            initialData={currentProject || {}}
            searchPlaceholder="Search by technology, feature, or achievement..."
            onSubmit={handleDescriptionSubmit}
            onBack={handleBack}
            submitButtonText="Continue"
            resumeId={resumeId}
            context="project"
            metadata={{
              name: currentProject?.name || '',
              technologies: currentProject?.technologies || '',
            }}
            isEditing={!!editingId}
            isLoading={isLoading}
            onDescriptionChange={(desc) => {
              if (editingId) {
                updateData((draft) => {
                  const project = draft.projects.find(p => p.id === editingId);
                  if (project) {
                    project.description = desc;
                  }
                });
              }
            }}
            onEnhanceWithAI={onOpenAIModal}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="w-full mb-8">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
        </div>
      </div>
      {renderStep()}

      {showSkipModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md">
            <h3 className="text-lg font-semibold mb-4">Skip Projects Section?</h3>
            <p className="mb-6">Are you sure you don't want to add any projects? You can always come back later.</p>
            <div className="flex gap-4">
              <button
                onClick={() => {
                  setShowSkipModal(false);
                  if (onNext) onNext();
                }}
                className="flex-1 bg-green-500 text-white py-2 rounded"
              >
                Yes, I don't want
              </button>
              <button
                onClick={() => setShowSkipModal(false)}
                className="flex-1 border py-2 rounded"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProjectsForm;

