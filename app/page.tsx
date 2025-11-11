import { Fragment } from 'react'

import Home from '@/components/content/home/Home';

import Skills from '@/components/content/skills/Skills';

import Projects from '@/components/content/projects/Projects';

import Achviement from '@/components/content/achvievement/Achviement';

import Gallery from '@/components/content/gallery/Gallery';

import { fetchHomeContents } from '@/utils/fetching/FetchHome';

import { fetchTechSkillsContents, fetchSkillsContents } from "@/utils/fetching/FetchTechSkills";

import { fetchProjects } from "@/utils/fetching/FetchProjects";

import { fetchGalleryContents } from "@/utils/fetching/FetchGallery";

import { fetchAchievementContents } from "@/utils/fetching/FetchAchievement";

export default async function HomePage() {
  const homeData = await fetchHomeContents();
  const skillsData = await fetchTechSkillsContents();
  const skillsContentData = await fetchSkillsContents();
  const achievementData = await fetchAchievementContents();
  const projectsData = await fetchProjects();
  const galleryData = await fetchGalleryContents();

  return (
    <Fragment>
      <Home homeData={homeData} />
      <Skills techSkillsData={skillsData} skillsData={skillsContentData} />
      <Achviement achievementData={achievementData} />
      <Projects projectsData={projectsData} />
      <Gallery galleryData={galleryData} />
    </Fragment>
  );
}