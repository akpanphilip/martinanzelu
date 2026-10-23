import { useEffect, useRef, useState } from 'react';
import { Box, Button, Container, Flex, Heading, HStack, Image, SimpleGrid, Stack, Text } from '@chakra-ui/react';
import { AnimatePresence, useMotionValue, useScroll, useSpring, useTransform } from 'framer-motion';
import { FiArrowDown, FiArrowDownRight, FiArrowUpRight, FiDownload, FiMapPin } from 'react-icons/fi';
import { useContent } from '../context/ContentContext';
import { AuroraBackground, CountUp, Magnetic } from '../components/Effects';
import { SplitText } from '../components/Reveal';
import { MotionBox, EASE } from '../components/motion';
import { useSectionNav } from '../components/Navbar';

function RotatingWord({ words }: { words: string[] }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (words.length < 2) return;
    const t = setInterval(() => setI((p) => (p + 1) % words.length), 2400);
    return () => clearInterval(t);
  }, [words.length]);
  const word = words[i % Math.max(words.length, 1)] ?? '';
  return (
    <Box as="span" display="inline-flex" position="relative" overflow="hidden" verticalAlign="bottom" pb="0.1em">
      <AnimatePresence mode="wait">
        <MotionBox
          as="span"
          key={word}
          display="inline-block"
          bgGradient="linear(to-r, ink.a, ink.b)"
          bgClip="text"
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '-100%', opacity: 0 }}
          transition={{ duration: 0.5, ease: EASE }}
        >
          {word}
        </MotionBox>
      </AnimatePresence>
    </Box>
  );
}

function CircularBadge({ text, onClick }: { text: string; onClick: () => void }) {
  return (
    <Box
      as="button"
      aria-label="Scroll to work"
      onClick={onClick}
      role="group"
      position="absolute"
      w={{ base: '110px', md: '140px' }}
      h={{ base: '110px', md: '140px' }}
      bottom={{ base: '-20px', md: '-30px' }}
      left={{ base: '-20px', md: '-40px' }}
      borderRadius="full"
      bg="glass"
      backdropFilter="blur(14px)"
      border="1px solid"
      borderColor="border.strong"
      zIndex={2}
      boxShadow="0 20px 50px -20px rgba(0,0,0,0.5)"
    >
      <MotionBox position="absolute" inset={0} animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}>
        <svg viewBox="0 0 100 100" width="100%" height="100%">
          <defs>
            <path id="badge-circle" d="M 50,50 m -37,0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0" />
          </defs>
          <text fontSize="8.5" fill="currentColor" style={{ textTransform: 'uppercase', fontWeight: 600 }}>
            <textPath href="#badge-circle" textLength="228" lengthAdjust="spacing">
              {text}
            </textPath>
          </text>
        </svg>
      </MotionBox>
      <Flex
        position="absolute"
        inset="30%"
        borderRadius="full"
        align="center"
        justify="center"
        fontSize={{ base: 'lg', md: 'xl' }}
        color="onFill"
        bgGradient="linear(135deg, fill.a, fill.b)"
        transition="transform .5s cubic-bezier(.22,1,.36,1)"
        _groupHover={{ transform: 'rotate(-45deg) scale(1.08)' }}
      >
        <FiArrowDownRight />
      </Flex>
    </Box>
  );
}

export function Hero() {
  const { content } = useContent();
  const { profile } = content;
  const goTo = useSectionNav();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const yText = useTransform(scrollYProgress, [0, 1], ['0%', '40%']);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotY = useSpring(useTransform(mx, [-0.5, 0.5], [-12, 12]), { stiffness: 100, damping: 20 });
  const rotX = useSpring(useTransform(my, [-0.5, 0.5], [10, -10]), { stiffness: 100, damping: 20 });
  const floatX = useSpring(useTransform(mx, [-0.5, 0.5], [-25, 25]), { stiffness: 80, damping: 20 });
  const floatY = useSpring(useTransform(my, [-0.5, 0.5], [-25, 25]), { stiffness: 80, damping: 20 });

  const firstName = profile.name.split(' ')[0] ?? profile.name;

  return (
    <Box
      ref={ref}
      id="home"
      position="relative"
      minH="100vh"
      display="flex"
      alignItems="center"
      pt={{ base: 32, md: 28 }}
      pb={{ base: 20, md: 16 }}
      overflow="hidden"
      onMouseMove={(e) => {
        mx.set(e.clientX / window.innerWidth - 0.5);
        my.set(e.clientY / window.innerHeight - 0.5);
      }}
    >
      <AuroraBackground />
      <Container maxW="7xl" position="relative" zIndex={2}>
        <MotionBox style={{ y: yText, opacity }}>
          <Flex direction={{ base: 'column', lg: 'row' }} align="center" gap={{ base: 14, lg: 10 }}>
            <Box flex="1.3">
              {profile.available && (
                <MotionBox
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                  display="inline-flex"
                  alignItems="center"
                  gap={2}
                  px={4}
                  py={1.5}
                  mb={6}
                  borderRadius="full"
                  border="1px solid"
                  borderColor="border.strong"
                  bg="surface"
                  backdropFilter="blur(10px)"
                  fontSize="sm"
                >
                  <Box position="relative" w="8px" h="8px">
                    <Box position="absolute" inset={0} borderRadius="full" bg="green.400" />
                    <MotionBox
                      position="absolute"
                      inset={0}
                      borderRadius="full"
                      bg="green.400"
                      animate={{ scale: [1, 2.6], opacity: [0.7, 0] }}
                      transition={{ duration: 1.6, repeat: Infinity }}
                    />
                  </Box>
                  Available for new projects
                </MotionBox>
              )}

              <Heading
                as="h1"
                fontSize={{ base: '5xl', sm: '6xl', md: '7xl', xl: '8xl' }}
                lineHeight={{ base: '1.05', md: '1' }}
                fontWeight="700"
              >
                <SplitText text={`Hi, I'm ${firstName}.`} delay={0.3} />
                <br />
                <Box as="span" fontSize="0.62em" fontWeight="500" color="muted" display="block" mt={3}>
                  <SplitText text="I design" delay={0.6} /> <RotatingWord words={profile.heroWords} />
                  <br />
                  <SplitText text="digital experiences." delay={0.75} />
                </Box>
              </Heading>

              <MotionBox
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.8, ease: EASE }}
              >
                <Text mt={6} fontSize={{ base: 'md', md: 'xl' }} color="muted" maxW="xl">
                  {profile.tagline}
                </Text>
                <HStack mt={3} color="muted" fontSize="sm">
                  <FiMapPin />
                  <Text>{profile.location}</Text>
                </HStack>

                <Stack direction={{ base: 'column', sm: 'row' }} spacing={4} mt={10}>
                  <Magnetic>
                    <Button
                      size="lg"
                      h="60px"
                      px={8}
                      color="onFill"
                      bgGradient="linear(to-r, fill.a, fill.b)"
                      _hover={{ filter: 'brightness(1.08)', boxShadow: '0 20px 40px -12px var(--chakra-colors-brand-500)' }}
                      rightIcon={<FiArrowUpRight />}
                      onClick={() => goTo('work')}
                      w={{ base: 'full', sm: 'auto' }}
                    >
                      View my work
                    </Button>
                  </Magnetic>
                  <Magnetic>
                    {profile.resumeUrl ? (
                      <Button as="a" href={profile.resumeUrl} target="_blank" size="lg" h="60px" px={8} variant="outline" colorScheme="gray" leftIcon={<FiDownload />} w={{ base: 'full', sm: 'auto' }}>
                        Download CV
                      </Button>
                    ) : (
                      <Button size="lg" h="60px" px={8} variant="outline" colorScheme="gray" onClick={() => goTo('contact')} w={{ base: 'full', sm: 'auto' }}>
                        Get in touch
                      </Button>
                    )}
                  </Magnetic>
                </Stack>
              </MotionBox>
            </Box>

            <MotionBox
              flex="1"
              w="full"
              maxW={{ base: '320px', md: '420px' }}
              position="relative"
              initial={{ opacity: 0, scale: 0.85, rotate: -6 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ delay: 0.5, duration: 1.2, ease: EASE }}
            >
              <MotionBox style={{ rotateX: rotX, rotateY: rotY, transformPerspective: 1200 }} position="relative">
                <Box
                  position="absolute"
                  inset="-14px"
                  borderRadius="40px"
                  bgGradient="linear(135deg, brand.300, partner.400)"
                  filter="blur(30px)"
                  opacity={0.5}
                />
                <Box position="relative" borderRadius="36px" overflow="hidden" border="1px solid" borderColor="border.strong" aspectRatio={4 / 5}>
                  <Image
                    src={profile.avatar}
                    alt={profile.name}
                    w="full"
                    h="full"
                    objectFit="cover"
                  objectPosition="68% center"
                    fallback={<Box w="full" h="full" bgGradient="linear(135deg, brand.600, partner.600)" />}
                  />
                  <Box position="absolute" inset={0} bgGradient="linear(to-t, blackAlpha.600, transparent 50%)" />
                </Box>
                <CircularBadge text={`${profile.role} · Scroll to explore · `} onClick={() => goTo('work')} />
              </MotionBox>

              <MotionBox
                position="absolute"
                top={{ base: '8%', md: '10%' }}
                right={{ base: '-10px', md: '-50px' }}
                style={{ x: floatX, y: floatY }}
              >
                <MotionBox
                  bg="glass"
                  backdropFilter="blur(16px)"
                  border="1px solid"
                  borderColor="border.strong"
                  borderRadius="2xl"
                  px={4}
                  py={3}
                  boxShadow="xl"
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <Text fontSize="2xl" fontWeight="700" fontFamily="heading" color="accent">
                    {profile.stats[0] ? `${profile.stats[0].value}${profile.stats[0].suffix}` : '—'}
                  </Text>
                  <Text fontSize="xs" color="muted">
                    {profile.stats[0]?.label ?? 'Designer'}
                  </Text>
                </MotionBox>
              </MotionBox>
            </MotionBox>
          </Flex>

          {profile.stats.length > 0 && (
            <SimpleGrid
              columns={{ base: 2, md: Math.min(profile.stats.length, 4) }}
              spacing={{ base: 6, md: 10 }}
              mt={{ base: 16, md: 20 }}
              pt={10}
              borderTop="1px solid"
              borderColor="border"
            >
              {profile.stats.map((s, i) => (
                <MotionBox
                  key={s.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2 + i * 0.1, duration: 0.7, ease: EASE }}
                >
                  <Heading fontSize={{ base: '4xl', md: '5xl' }} fontWeight="700">
                    <CountUp value={s.value} suffix={s.suffix} />
                  </Heading>
                  <Text color="muted" fontSize="sm" mt={1}>
                    {s.label}
                  </Text>
                </MotionBox>
              ))}
            </SimpleGrid>
          )}
        </MotionBox>
      </Container>

      <MotionBox
        position="absolute"
        bottom={6}
        left="50%"
        ml="-12px"
        zIndex={2}
        display={{ base: 'none', md: 'block' }}
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 1.8, repeat: Infinity }}
        cursor="pointer"
        onClick={() => goTo('work')}
        color="muted"
        fontSize="xl"
      >
        <FiArrowDown />
      </MotionBox>
    </Box>
  );
}
