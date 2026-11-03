import React from 'react';
import type { Achievement } from '../../types';
import PageHero from '../../components/common/PageHero';
import ExperienceSection from '../../components/sections/ExperienceSection';
import { buildTitle, roleFromTagline, useRouteMetadata } from '../../utils/routeMetadata';

interface AchievementsPageProps {
  achievements: Achievement[];
  username: string;
  displayName: string;
  /** Optional tagline used for the title role suffix. */
  tagline?: string;
}

/**
 * Experience & Education page. The public route stays `/achievements` so
 * existing links keep working; the label and content now present career
 * records instead of award cards (UX-10).
 */
const AchievementsPage: React.FC<AchievementsPageProps> = ({
  achievements,
  username,
  displayName,
  tagline,
}) => {
  const role = roleFromTagline(tagline);

  useRouteMetadata({
    title: buildTitle('Experience and Education', displayName, role),
    description: `Work, education and recognitions on ${displayName}'s record, most recent first.`,
    path: `/${username}/achievements`,
  });

  if (achievements.length === 0) {
    return (
      <PageHero
        label="Career"
        title="Experience &"
        highlight="Education"
        description="No records available yet."
      />
    );
  }

  return (
    <>
      <PageHero
        label="Career"
        title="Experience &"
        highlight="Education"
        description="Work, education and recognitions, most recent first."
      />
      <ExperienceSection records={achievements} variant="full" showHeader={false} />
    </>
  );
};

export default AchievementsPage;
