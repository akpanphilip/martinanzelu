import { useState } from 'react';
import { Box } from '@chakra-ui/react';
import { Global } from '@emotion/react';
import { AnimatePresence } from 'framer-motion';
import { useLocation, useOutlet } from 'react-router-dom';
import { useContent } from '../context/ContentContext';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { CustomCursor } from './CustomCursor';
import { ScrollProgress } from './Effects';
import { MotionBox, EASE } from './motion';

/** Keeps the outgoing page rendered while it animates out. */
function FrozenOutlet() {
  const outlet = useOutlet();
  const [frozen] = useState(outlet);
  return frozen;
}

export function SiteLayout() {
  const location = useLocation();
  const { content } = useContent();

  return (
    <Box minH="100vh" position="relative">
      <Global
        styles={`
          html.has-custom-cursor, html.has-custom-cursor * { cursor: none !important; }
          .noise::after { content: ''; position: fixed; inset: 0; pointer-events: none; z-index: 1;
            opacity: .035; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E"); }
        `}
      />
      {content.settings.customCursor && <CustomCursor />}
      <ScrollProgress />
      <Navbar />
      <Box className="noise">
        <AnimatePresence
          mode="wait"
          onExitComplete={() => {
            if (!window.location.hash) window.scrollTo({ top: 0 });
          }}
        >
          <MotionBox
            key={location.pathname}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.5, ease: EASE }}
          >
            <FrozenOutlet />
          </MotionBox>
        </AnimatePresence>
      </Box>
      <Footer />
    </Box>
  );
}
