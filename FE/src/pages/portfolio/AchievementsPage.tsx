import React from 'react';
import type { Achievement } from '../../types';
import PageHero from '../../components/common/PageHero';
import AchievementsSection from '../../components/sections/AchievementsSection';

interface AchievementsPageProps {
  achievements: Achievement[];
}

const AchievementsPage: React.FC<AchievementsPageProps> = ({ achievements }) => {
  if (achievements.length === 0) {
    return (
      <PageHero label="Recognition" title="My" highlight="Achievements" description="No achievements available yet." />
    );
  }

  return (
    <>
      <PageHero
        label="Recognition"
        title="My"
        highlight="Achievements"
        description="Awards, certifications, and milestones along the way."
      />
      <AchievementsSection achievements={achievements} showHeader={false} />
    </>
  );
};

export default AchievementsPage;
