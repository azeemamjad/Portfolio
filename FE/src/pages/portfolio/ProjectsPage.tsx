import React from 'react';
import type { Project } from '../../types';
import PageHero from '../../components/common/PageHero';
import ProjectsSection from '../../components/sections/ProjectsSection';
import { buildTitle, roleFromTagline, useRouteMetadata } from '../../utils/routeMetadata';

interface ProjectsPageProps {
  projects: Project[];
  username: string;
  displayName: string;
  tagline?: string;
}

const ProjectsPage: React.FC<ProjectsPageProps> = ({ projects, username, displayName, tagline }) => {
  const role = roleFromTagline(tagline);

  useRouteMetadata({
    title: buildTitle('Projects', displayName, role),
    description: `Explore ${displayName}'s projects${role ? ` — ${role.toLowerCase()}` : ''}: live products, case studies and source code.`,
    path: `/${username}/projects`,
  });

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
