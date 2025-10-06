import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, X } from "lucide-react";
import { Education } from "@/types/firestore";

interface EducationFormProps {
  education: Education[];
  onChange: (education: Education[]) => void;
  isEditing: boolean;
}

export const EducationForm: React.FC<EducationFormProps> = ({
  education,
  onChange,
  isEditing
}) => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<Education>({
    degree: '',
    school: '',
    startDate: '',
    endDate: '',
    description: ''
  });

  const handleAdd = () => {
    if (formData.degree && formData.school) {
      onChange([...education, formData]);
      setFormData({
        degree: '',
        school: '',
        startDate: '',
        endDate: '',
        description: ''
      });
      setShowForm(false);
    }
  };

  const handleRemove = (index: number) => {
    onChange(education.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      {education.map((edu, index) => (
        <div key={index} className="border-l-2 border-dicey-magenta pl-4 py-2 relative">
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
          <h4 className="font-semibold text-gray-900 dark:text-white">{edu.degree}</h4>
          <p className="text-dicey-magenta font-medium">{edu.school}</p>
          <p className="text-xs text-gray-500 mb-1">
            {edu.startDate} - {edu.endDate}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-300">{edu.description}</p>
        </div>
      ))}

      {education.length === 0 && !isEditing && (
        <p className="text-gray-500 text-sm">No education to display</p>
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
              Add Education
            </Button>
          ) : (
            <Card>
              <CardContent className="pt-6 space-y-3">
                <Input
                  placeholder="Degree (e.g., Bachelor of Science in Computer Science)"
                  value={formData.degree}
                  onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                />
                <Input
                  placeholder="School/University"
                  value={formData.school}
                  onChange={(e) => setFormData({ ...formData, school: e.target.value })}
                />
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    placeholder="Start Year (e.g., 2018)"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  />
                  <Input
                    placeholder="End Year (e.g., 2022)"
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
