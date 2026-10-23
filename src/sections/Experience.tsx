import { useRef } from 'react';
import { Box, Container, Heading, Text } from '@chakra-ui/react';
import { useScroll, useSpring } from 'framer-motion';
import { useContent } from '../context/ContentContext';
import { SectionHeading } from '../components/SectionHeading';
import { MotionBox, EASE } from '../components/motion';

export function Experience() {
  const { content } = useContent();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 70%', 'end 60%'] });
  const scaleY = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  if (!content.experience.length) return null;

  return (
    <Box as="section" id="experience" py={{ base: 20, md: 32 }}>
      <Container maxW="6xl">
        <SectionHeading eyebrow="Journey" title="Experience &" highlight="career." align="center" />
        <Box ref={ref} position="relative">
          <Box position="absolute" left={{ base: '15px', md: '50%' }} top={0} bottom={0} w="2px" bg="border" ml={{ md: '-1px' }} />
          <MotionBox
            position="absolute"
            left={{ base: '15px', md: '50%' }}
            top={0}
            bottom={0}
            w="2px"
            ml={{ md: '-1px' }}
            bgGradient="linear(to-b, fill.a, fill.b)"
            style={{ scaleY, transformOrigin: 'top' }}
          />
          {content.experience.map((e, i) => {
            const left = i % 2 === 0;
            return (
              <Box
                key={e.id}
                position="relative"
                display="flex"
                justifyContent={{ base: 'flex-start', md: left ? 'flex-start' : 'flex-end' }}
                mb={{ base: 10, md: 14 }}
              >
                <MotionBox
                  position="absolute"
                  left={{ base: '16px', md: '50%' }}
                  top="28px"
                  w="18px"
                  h="18px"
                  ml="-9px"
                  borderRadius="full"
                  bg="bg"
                  border="3px solid"
                  borderColor="accent"
                  zIndex={1}
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true, margin: '-100px' }}
                  transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                  boxShadow="0 0 0 6px var(--chakra-colors-bg)"
                />
                <MotionBox
                  w={{ base: 'calc(100% - 48px)', md: 'calc(50% - 48px)' }}
                  ml={{ base: '48px', md: 0 }}
                  p={{ base: 6, md: 8 }}
                  borderRadius="3xl"
                  bg="surface"
                  border="1px solid"
                  borderColor="border"
                  initial={{ opacity: 0, x: left ? -60 : 60 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-100px' }}
                  transition={{ duration: 0.9, ease: EASE }}
                  whileHover={{ y: -6 }}
                  _hover={{ borderColor: 'brand.400' }}
                >
                  <Text fontSize="sm" fontWeight="600" color="accent" mb={2} letterSpacing="0.05em">
                    {e.period}
                  </Text>
                  <Heading size="md">{e.role}</Heading>
                  <Text fontWeight="500" color="muted" mb={3}>
                    {e.company}
                  </Text>
                  <Text color="muted">{e.description}</Text>
                </MotionBox>
              </Box>
            );
          })}
        </Box>
      </Container>
    </Box>
  );
}
