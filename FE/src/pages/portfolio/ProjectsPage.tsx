import React from 'react';
import type { Project } from '../../types';
import PageHero from '../../components/common/PageHero';
import ProjectsSection from '../../components/sections/ProjectsSection';

interface ProjectsPageProps {
  projects: Project[];
  username: string;
}

const ProjectsPage: React.FC<ProjectsPageProps> = ({ projects, username }) => {
  if (projects.length === 0) {
    return (
      <>
        <PageHero label="Work" title="My" highlight="Projects" description="No projects available yet." />
      </>
    );
  }

  return (
    <>
      <PageHero
        label="Work"
        title="My"
        highlight="Projects"
        description="A collection of my work showcasing various technologies and solutions."
      />
      <ProjectsSection projects={projects} username={username} showHeader={false} />
    </>
  );
};

export default ProjectsPage;
