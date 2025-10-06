import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, X, Briefcase } from "lucide-react";
import { WorkExperience } from "@/types/firestore";

interface ExperienceFormProps {
  experiences: WorkExperience[];
  onChange: (experiences: WorkExperience[]) => void;
  isEditing: boolean;
}

export const ExperienceForm: React.FC<ExperienceFormProps> = ({
  experiences,
  onChange,
  isEditing
}) => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<WorkExperience>({
    title: '',
    company: '',
    startDate: '',
    endDate: '',
    description: ''
  });

  const handleAdd = () => {
    if (formData.title && formData.company) {
      onChange([...experiences, formData]);
      setFormData({
        title: '',
        company: '',
        startDate: '',
        endDate: '',
        description: ''
      });
      setShowForm(false);
    }
  };

  const handleRemove = (index: number) => {
    onChange(experiences.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      {experiences.map((exp, index) => (
        <div key={index} className="border-l-2 border-dicey-azure pl-4 py-2 relative">
          {isEditing && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute -right-2 -top-2 h-6 w-6"
              onClick={() => handleRemove(index)}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
          <h4 className="font-semibold text-gray-900 dark:text-white">{exp.title}</h4>
          <p className="text-dicey-azure font-medium">{exp.company}</p>
          <p className="text-xs text-gray-500 mb-1">
            {exp.startDate} - {exp.endDate || 'Present'}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-300">{exp.description}</p>
        </div>
      ))}

      {experiences.length === 0 && !isEditing && (
        <p className="text-gray-500 text-sm">No work experience to display</p>
      )}

      {isEditing && (
        <>
          {!showForm ? (
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setShowForm(true)}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Work Experience
            </Button>
          ) : (
            <Card>
              <CardContent className="pt-6 space-y-3">
                <Input
                  placeholder="Job Title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
                <Input
                  placeholder="Company"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                />
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    placeholder="Start Date (e.g., Jan 2023)"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  />
                  <Input
                    placeholder="End Date (or Present)"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  />
                </div>
                <Textarea
                  placeholder="Description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                />
                <div className="flex gap-2">
                  <Button onClick={handleAdd} className="flex-1">Add</Button>
                  <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
};
