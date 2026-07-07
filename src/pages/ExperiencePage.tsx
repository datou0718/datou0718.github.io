import React from 'react';
import { Education, Experience, SelectedAwards, Teaching } from '../components/Sections';

const ExperiencePage: React.FC = () => {
  return (
    <div className="fade-in compact-sections">
      <Education />
      <Experience />
      <SelectedAwards />
      <Teaching />
    </div>
  );
};

export default ExperiencePage;
