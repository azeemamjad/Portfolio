import React from 'react';
import type { Skill } from '../../types';
import PageHero from '../../components/common/PageHero';
import SkillsSection from '../../components/sections/SkillsSection';
import { buildTitle, roleFromTagline, useRouteMetadata } from '../../utils/routeMetadata';

interface SkillsPageProps {
  skills: Skill[];
  username: string;
  displayName: string;
  tagline?: string;
}

const SkillsPage: React.FC<SkillsPageProps> = ({ skills, username, displayName, tagline }) => {
  const role = roleFromTagline(tagline);

  useRouteMetadata({
    title: buildTitle('Skills', displayName, role),
    description: `Technologies, tools and working practices ${displayName} uses to build and ship software.`,
    path: `/${username}/skills`,
  });

  if (skills.length === 0) {
    return <PageHero label="Expertise" title="My" highlight="Skills" description="No skills available yet." />;
  }

  return (
    <>
      <PageHero
        label="Expertise"
        title="My"
        highlight="Skills"
        description="Technologies, tools and working practices I bring to real projects."
      />
      <SkillsSection skills={skills} showHeader={false} />
    </>
  );
};

export default SkillsPage;
