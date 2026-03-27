import React from 'react';

import Select from '../../../components/ui/Select';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';

const FilterPanel = ({
  filters,
  onFilterChange,
  onClearFilters,
  isCollapsed,
  onToggleCollapse
}) => {
  const subjectOptions = [
    { value: 'all', label: 'All Subjects' },
    { value: 'Math', label: 'Mathematics' },
    { value: 'Science', label: 'Science' },
    { value: 'Technology', label: 'Technology' },
    { value: 'Engineering', label: 'Engineering' }
  ];

  const gradeOptions = [
    { value: 'all', label: 'All Grades' },
    { value: '6', label: 'Grade 6' },
    { value: '7', label: 'Grade 7' },
    { value: '8', label: 'Grade 8' },
    { value: '9', label: 'Grade 9' },
    { value: '10', label: 'Grade 10' },
    { value: '11', label: 'Grade 11' },
    { value: '12', label: 'Grade 12' }
  ];

  const sortOptions = [
    { value: 'popularity', label: 'Most Popular' },
    { value: 'newest', label: 'Newest First' },
    { value: 'difficulty', label: 'By Difficulty' },
    { value: 'duration', label: 'By Duration' },
    { value: 'alphabetical', label: 'A to Z' }
  ];

  const handleDifficultyChange = (difficulty, checked) => {
    const newDifficulties = checked
      ? [...filters?.difficulty, difficulty]
      : filters?.difficulty?.filter(d => d !== difficulty);
    
    onFilterChange('difficulty', newDifficulties);
  };

  return (
    <div className="bg-card rounded-xl border border-border p-4 lg:p-6">
      {/* Mobile Toggle Header */}
      <div className="flex items-center justify-between lg:hidden mb-4">
        <h2 className="text-lg font-heading font-semibold text-foreground">Filters</h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleCollapse}
          iconName={isCollapsed ? 'ChevronDown' : 'ChevronUp'}
          iconSize={20}
        >
          <span className="sr-only">Toggle filters</span>
        </Button>
      </div>
      {/* Desktop Header */}
      <div className="hidden lg:flex items-center justify-between mb-6">
        <h2 className="text-lg font-heading font-semibold text-foreground">Filter Games</h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearFilters}
          iconName="X"
          iconPosition="left"
          iconSize={16}
        >
          Clear All
        </Button>
      </div>
      {/* Filter Content */}
      <div className={`space-y-6 ${isCollapsed ? 'hidden lg:block' : 'block'}`}>
        {/* Search */}
        <div>
          <Input
            type="search"
            placeholder="Search games..."
            value={filters?.search}
            onChange={(e) => onFilterChange('search', e?.target?.value)}
            className="w-full"
          />
        </div>

        {/* Subject Filter */}
        <div>
          <Select
            label="Subject"
            options={subjectOptions}
            value={filters?.subject}
            onChange={(value) => onFilterChange('subject', value)}
          />
        </div>

        {/* Grade Level Filter */}
        <div>
          <Select
            label="Grade Level"
            options={gradeOptions}
            value={filters?.gradeLevel}
            onChange={(value) => onFilterChange('gradeLevel', value)}
          />
        </div>

        {/* Difficulty Filter */}
        <div>
          <label className="block text-sm font-body font-medium text-foreground mb-3">
            Difficulty Level
          </label>
          <div className="space-y-2">
            {['Easy', 'Medium', 'Hard']?.map((difficulty) => (
              <Checkbox
                key={difficulty}
                label={difficulty}
                checked={filters?.difficulty?.includes(difficulty)}
                onChange={(e) => handleDifficultyChange(difficulty, e?.target?.checked)}
              />
            ))}
          </div>
        </div>

        {/* Availability Filter */}
        <div>
          <label className="block text-sm font-body font-medium text-foreground mb-3">
            Availability
          </label>
          <div className="space-y-2">
            <Checkbox
              label="Downloaded Games"
              checked={filters?.showDownloaded}
              onChange={(e) => onFilterChange('showDownloaded', e?.target?.checked)}
            />
            <Checkbox
              label="Featured Games"
              checked={filters?.showFeatured}
              onChange={(e) => onFilterChange('showFeatured', e?.target?.checked)}
            />
          </div>
        </div>

        {/* Sort Options */}
        <div>
          <Select
            label="Sort By"
            options={sortOptions}
            value={filters?.sortBy}
            onChange={(value) => onFilterChange('sortBy', value)}
          />
        </div>

        {/* Mobile Clear Button */}
        <div className="lg:hidden pt-4 border-t border-border">
          <Button
            variant="outline"
            size="sm"
            onClick={onClearFilters}
            iconName="X"
            iconPosition="left"
            iconSize={16}
            className="w-full"
          >
            Clear All Filters
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;