import React from 'react';
import type { Skill } from '../../types';
import PageHero from '../../components/common/PageHero';
import SkillsSection from '../../components/sections/SkillsSection';

interface SkillsPageProps {
  skills: Skill[];
}

const SkillsPage: React.FC<SkillsPageProps> = ({ skills }) => {
  if (skills.length === 0) {
    return <PageHero label="Expertise" title="My" highlight="Skills" description="No skills available yet." />;
  }

  return (
    <>
      <PageHero
        label="Expertise"
        title="My"
        highlight="Skills"
        description="Technologies, tools, and strengths I bring to every project."
      />
      <SkillsSection skills={skills} showHeader={false} />
    </>
  );
};

export default SkillsPage;
