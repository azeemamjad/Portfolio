import React from 'react';
import type { About, Achievement } from '../../types';
import PageHero from '../../components/common/PageHero';
import AboutSection from '../../components/sections/AboutSection';
import { buildTitle, roleFromTagline, useRouteMetadata } from '../../utils/routeMetadata';

interface AboutPageProps {
  about?: About;
  username: string;
  achievements?: Achievement[];
  displayName: string;
  tagline?: string;
}

const AboutPage: React.FC<AboutPageProps> = ({
  about,
  username,
  achievements,
  displayName,
  tagline,
}) => {
  const role = roleFromTagline(tagline);

  useRouteMetadata({
    title: buildTitle('About', displayName, role),
    description: about?.bio || `Background, experience and values of ${displayName}.`,
    path: `/${username}/about`,
    image: undefined,
  });

  if (!about) {
    return <PageHero label="Who I Am" title="About" highlight="Me" description="No information available yet." />;
  }

  return (
    <>
      <PageHero
        label="Who I Am"
        title="About"
        highlight="Me"
        description="Summary, experience, values and how to reach me."
      />
      <AboutSection
        about={about}
        username={username}
        achievements={achievements}
        showHeader={false}
      />
    </>
  );
};

export default AboutPage;
