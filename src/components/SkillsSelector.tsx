import React, { useState } from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X, Plus } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const AVAILABLE_SKILLS = [
  // Programming Languages
  'Python', 'JavaScript', 'TypeScript', 'Java', 'C++', 'C#', 'Go', 'Rust', 'PHP', 'Ruby', 'Swift', 'Kotlin',
  // Frontend
  'React', 'Vue.js', 'Angular', 'Next.js', 'Svelte', 'HTML', 'CSS', 'Tailwind CSS', 'Bootstrap', 'Material-UI',
  // Backend
  'Node.js', 'Express', 'Django', 'Flask', 'Spring Boot', 'ASP.NET', 'Laravel', 'Ruby on Rails',
  // Databases
  'PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'SQLite', 'SQL', 'Firebase', 'Supabase',
  // Cloud & DevOps
  'AWS', 'Azure', 'Google Cloud', 'Docker', 'Kubernetes', 'CI/CD', 'Jenkins', 'GitHub Actions',
  // Data Science & ML
  'Machine Learning', 'Data Analysis', 'TensorFlow', 'PyTorch', 'Pandas', 'NumPy', 'Scikit-learn', 'Tableau', 'Power BI',
  // Mobile
  'React Native', 'Flutter', 'iOS Development', 'Android Development',
  // Other
  'Git', 'REST API', 'GraphQL', 'Microservices', 'Agile', 'Scrum', 'UI/UX Design', 'Figma'
];

interface SkillsSelectorProps {
  selectedSkills: string[];
  onChange: (skills: string[]) => void;
  isEditing: boolean;
}

export const SkillsSelector: React.FC<SkillsSelectorProps> = ({
  selectedSkills,
  onChange,
  isEditing
}) => {
  const [open, setOpen] = useState(false);

  const addSkill = (skill: string) => {
    if (!selectedSkills.includes(skill)) {
      onChange([...selectedSkills, skill]);
    }
    setOpen(false);
  };

  const removeSkill = (skill: string) => {
    onChange(selectedSkills.filter(s => s !== skill));
  };

  const availableSkills = AVAILABLE_SKILLS.filter(
    skill => !selectedSkills.includes(skill)
  );

  return (
    <div className="space-y-3">
      {isEditing && (
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full justify-start">
              <Plus className="mr-2 h-4 w-4" />
              Add Skills
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0" align="start">
            <Command>
              <CommandInput placeholder="Search skills..." />
              <CommandList>
                <CommandEmpty>No skills found.</CommandEmpty>
                <CommandGroup>
                  {availableSkills.map((skill) => (
                    <CommandItem
                      key={skill}
                      onSelect={() => addSkill(skill)}
                    >
                      {skill}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      )}
      
      <div className="flex flex-wrap gap-2">
        {selectedSkills.length === 0 ? (
          <p className="text-sm text-gray-500">No skills added yet</p>
        ) : (
          selectedSkills.map((skill, index) => (
            <Badge 
              key={index} 
              variant="secondary"
              className={`${isEditing ? 'flex items-center gap-1 pr-1' : ''}`}
            >
              {skill}
              {isEditing && (
                <button
                  onClick={() => removeSkill(skill)}
                  className="ml-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </Badge>
          ))
        )}
      </div>
    </div>
  );
};
