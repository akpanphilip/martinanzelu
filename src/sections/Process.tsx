import { useRef } from 'react';
import { Box, Container, Grid, Heading, HStack, Stack, Text } from '@chakra-ui/react';
import { useScroll, useTransform, type MotionValue } from 'framer-motion';
import { useContent } from '../context/ContentContext';
import type { ProcessStep } from '../data/types';
import { SectionHeading } from '../components/SectionHeading';
import { Orb } from '../components/Effects';
import { MotionBox } from '../components/motion';

function StepCard({ step, index, total, progress }: { step: ProcessStep; index: number; total: number; progress: MotionValue<number> }) {
  const start = index / total;
  const targetScale = 1 - (total - 1 - index) * 0.04;
  const scale = useTransform(progress, [start, 1], [1, targetScale]);
  const dim = useTransform(progress, [start, Math.min(1, start + 1 / total)], [0, index === total - 1 ? 0 : 0.35]);

  return (
    <Box position="sticky" top={{ base: `${88 + index * 14}px`, md: `${120 + index * 26}px` }} mb={{ base: 6, md: 10 }}>
      <MotionBox
        style={{ scale, transformOrigin: 'top center' }}
        position="relative"
        overflow="hidden"
        borderRadius={{ base: '2xl', md: '4xl' }}
        bg="bg"
        border="1px solid"
        borderColor="border.strong"
        boxShadow="0 -20px 60px -30px rgba(0,0,0,0.45)"
        p={{ base: 7, md: 12 }}
        minH={{ md: '420px' }}
      >
        <Box
          position="absolute"
          right="-120px"
          top="-120px"
          w="380px"
          h="380px"
          borderRadius="full"
          bg="brand.500"
          opacity={0.14}
          filter="blur(80px)"
          pointerEvents="none"
        />
        <Grid templateColumns={{ base: '1fr', md: '1.2fr 1fr' }} gap={{ base: 8, md: 16 }} position="relative" h="full">
          <Stack spacing={6} justify="space-between">
            <HStack spacing={4}>
              <Text fontFamily="heading" fontSize="sm" fontWeight="600" letterSpacing="0.2em" color="accent">
                {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
              </Text>
              <Box flex="1" h="1px" bg="border.strong" maxW="120px" />
            </HStack>
            <Box>
              <Heading fontSize={{ base: '5xl', md: '7xl' }} lineHeight="1" mb={5} fontWeight="700">
                {step.title}
              </Heading>
              <Text fontSize={{ base: 'md', md: 'xl' }} color="muted" lineHeight="1.7" maxW="lg">
                {step.description}
              </Text>
            </Box>
          </Stack>
          <Stack spacing={0} alignSelf="end">
            <Text fontSize="xs" textTransform="uppercase" letterSpacing="0.25em" color="muted" mb={3}>
              Deliverables
            </Text>
            {step.deliverables.map((d) => (
              <HStack key={d} py={4} borderTop="1px solid" borderColor="border" spacing={4} role="group">
                <Orb size="10px" />
                <Text fontSize={{ base: 'md', md: 'lg' }} fontWeight="500" transition="transform .4s" _groupHover={{ transform: 'translateX(6px)' }}>
                  {d}
                </Text>
              </HStack>
            ))}
          </Stack>
        </Grid>
        <MotionBox position="absolute" inset={0} bg="black" pointerEvents="none" style={{ opacity: dim }} />
      </MotionBox>
    </Box>
  );
}

export function Process() {
  const { content } = useContent();
  const steps = content.process ?? [];
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });

  if (!steps.length) return null;

  return (
    <Box as="section" id="process" py={{ base: 20, md: 32 }}>
      <Container maxW="7xl">
        <SectionHeading
          eyebrow="How I work"
          title="A process built for"
          highlight="clarity."
          description="Senior design is about judgement: knowing which problems to solve, which to defer, and how to bring a whole team along. This is how I approach every engagement."
        />
        <Box ref={ref} position="relative">
          {steps.map((s, i) => (
            <StepCard key={s.id} step={s} index={i} total={steps.length} progress={scrollYProgress} />
          ))}
        </Box>
      </Container>
    </Box>
  );
}
