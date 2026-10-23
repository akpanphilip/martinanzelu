import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Hero } from '../sections/Hero';
import { ToolsMarquee } from '../sections/ToolsMarquee';
import { Work } from '../sections/Work';
import { About } from '../sections/About';
import { Services } from '../sections/Services';
import { Process } from '../sections/Process';
import { Experience } from '../sections/Experience';
import { Testimonials } from '../sections/Testimonials';
import { Contact } from '../sections/Contact';

export default function Home() {
  const { hash } = useLocation();

  useEffect(() => {
    if (!hash) return;
    const t = setTimeout(() => {
      document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 150);
    return () => clearTimeout(t);
  }, [hash]);

  return (
    <>
      <Hero />
      <ToolsMarquee />
      <Work />
      <About />
      <Services />
      <Process />
      <Experience />
      <Testimonials />
      <Contact />
    </>
  );
}
