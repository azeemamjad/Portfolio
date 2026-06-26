import React from 'react';
import type { About } from '../../types';
import PageHero from '../../components/common/PageHero';
import ContactSection from '../../components/sections/ContactSection';

interface ContactPageProps {
  username: string;
  about?: About;
}

const ContactPage: React.FC<ContactPageProps> = ({ username, about }) => {
  return (
    <>
      <PageHero
        label="Contact"
        title="Let's"
        highlight="Work Together"
        description="Have a project in mind or want to collaborate? I'll get back to you within 24 hours."
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
