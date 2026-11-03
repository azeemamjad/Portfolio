import React from 'react';
import type { About } from '../../types';
import PageHero from '../../components/common/PageHero';
import ContactSection from '../../components/sections/ContactSection';
import { buildTitle, roleFromTagline, useRouteMetadata } from '../../utils/routeMetadata';

interface ContactPageProps {
  username: string;
  about?: About;
  displayName: string;
  tagline?: string;
}

const ContactPage: React.FC<ContactPageProps> = ({ username, about, displayName, tagline }) => {
  const role = roleFromTagline(tagline);

  useRouteMetadata({
    title: buildTitle('Contact', displayName, role),
    description: `Get in touch with ${displayName}${about?.location ? ` in ${about.location}` : ''} about roles, freelance projects or collaborations.`,
    path: `/${username}/contact`,
    image: undefined,
  });

  return (
    <>
      <PageHero
        label="Contact"
        title="Let's"
        highlight="Work Together"
        description="Have a project in mind or want to collaborate? Send a message or use the direct email below."
      />
      <ContactSection
        username={username}
        email={about?.email}
        about={about}
        showHeader={false}
      />
    </>
  );
};

export default ContactPage;
