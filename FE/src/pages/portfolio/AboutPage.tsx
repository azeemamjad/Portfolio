import React from 'react';
import type { About } from '../../types';
import PageHero from '../../components/common/PageHero';
import AboutSection from '../../components/sections/AboutSection';

interface AboutPageProps {
  about?: About;
  username: string;
}

const AboutPage: React.FC<AboutPageProps> = ({ about, username }) => {
  if (!about) {
    return <PageHero label="Who I Am" title="About" highlight="Me" description="No information available yet." />;
  }

  return (
    <>
      <PageHero
        label="Who I Am"
        title="About"
        highlight="Me"
        description="Background, values, and how to reach me."
      />
      <AboutSection about={about} username={username} showHeader={false} />
    </>
  );
};

export default AboutPage;
