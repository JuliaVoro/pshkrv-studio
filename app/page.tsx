import Navbar from '@/components/layout/Navbar'
import NavbarAnimated from '@/components/layout/NavbarAnimated'
import Footer from '@/components/layout/Footer'
import Hero from '@/components/sections/Hero'
import HeroAnimated from '@/components/sections/HeroAnimated'
import Services from '@/components/sections/Services'
import Work from '@/components/sections/Work'
import Approach from '@/components/sections/Approach'
import Expertise from '@/components/sections/Expertise'
import Studio from '@/components/sections/Studio'
import Contact from '@/components/sections/Contact'
import CursorFollower from '@/components/ui/CursorFollower'
import { getFeaturedProjects } from '@/lib/data/projects'
import { getServices } from '@/lib/data/services'
import { getStudioInfo } from '@/lib/data/studio'

export default function Home() {
  const projects = getFeaturedProjects()
  const services = getServices()
  const studio = getStudioInfo()

  return (
    <>
      <CursorFollower />
      {studio.headerStyle === 'animated'
        ? <NavbarAnimated darkHero={studio.heroStyle === 'animated'} />
        : <Navbar />}
      <main>
        {studio.heroStyle === 'animated' ? <HeroAnimated /> : <Hero />}
        <Services services={services} />
        <Work projects={projects} />
        <Approach studio={studio} />
        <Expertise studio={studio} />
        <Studio studio={studio} />
        <Contact studio={studio} />
      </main>
      <Footer studio={studio} />
    </>
  )
}
