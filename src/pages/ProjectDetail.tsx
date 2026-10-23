import { useRef, useState } from 'react';
import {
  Box, Button, Container, Flex, Grid, Heading, HStack, IconButton, Image, Modal, ModalContent, ModalOverlay,
  SimpleGrid, Stack, Tag, Text, Wrap, WrapItem,
} from '@chakra-ui/react';
import { AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { Link as RouterLink, useParams } from 'react-router-dom';
import { FiArrowLeft, FiArrowRight, FiArrowUpRight, FiChevronLeft, FiChevronRight, FiX } from 'react-icons/fi';
import { useContent } from '../context/ContentContext';
import { Reveal, SplitText } from '../components/Reveal';
import { MotionBox, MotionImage, EASE } from '../components/motion';
import { AuroraBackground } from '../components/Effects';
import NotFound from './NotFound';

function Block({ label, title, body }: { label: string; title: string; body: string }) {
  if (!body) return null;
  return (
    <Grid templateColumns={{ base: '1fr', md: '1fr 2fr' }} gap={{ base: 4, md: 16 }} py={{ base: 10, md: 16 }} borderTop="1px solid" borderColor="border">
      <Reveal>
        <Text color="accent" fontSize="sm" fontWeight="600" letterSpacing="0.2em" textTransform="uppercase" mb={2}>
          {label}
        </Text>
        <Heading size="lg">{title}</Heading>
      </Reveal>
      <Reveal delay={0.1}>
        {body.split(/\n+/).map((p, i) => (
          <Text key={i} fontSize={{ base: 'lg', md: 'xl' }} color="muted" lineHeight="1.8" mb={4}>
            {p}
          </Text>
        ))}
      </Reveal>
    </Grid>
  );
}

export default function ProjectDetail() {
  const { slug } = useParams();
  const { content } = useContent();
  const projects = content.projects.filter((p) => p.published);
  const idx = projects.findIndex((p) => p.slug === slug);
  const project = projects[idx];
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start end', 'end start'] });
  const imgY = useTransform(scrollYProgress, [0, 1], ['-12%', '12%']);
  const imgScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.2, 1.05, 1.2]);
  const [lightbox, setLightbox] = useState<number | null>(null);

  if (!project) return <NotFound />;
  const next = projects[(idx + 1) % projects.length];
  const gallery = project.gallery.filter(Boolean);
  const meta = [
    { k: 'Client', v: project.client },
    { k: 'Year', v: project.year },
    { k: 'Role', v: project.role },
    { k: 'Duration', v: project.duration },
  ].filter((m) => m.v);

  return (
    <Box>
      <Box position="relative" pt={{ base: 36, md: 44 }} pb={{ base: 12, md: 16 }} overflow="hidden">
        <AuroraBackground />
        <Container maxW="7xl" position="relative" zIndex={1}>
          <MotionBox initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
            <Button as={RouterLink} to="/#work" variant="ghost" colorScheme="gray" leftIcon={<FiArrowLeft />} mb={8} ml={-4}>
              All projects
            </Button>
          </MotionBox>
          <HStack spacing={3} mb={6}>
            <Tag borderRadius="full" size="lg">
              {project.category}
            </Tag>
            {project.tags.map((t) => (
              <Tag key={t} borderRadius="full" size="lg" variant="outline" colorScheme="gray" display={{ base: 'none', md: 'inline-flex' }}>
                {t}
              </Tag>
            ))}
          </HStack>
          <Heading as="h1" fontSize={{ base: '5xl', md: '7xl', xl: '8xl' }} lineHeight="1" fontWeight="700" maxW="5xl">
            <SplitText text={project.title} delay={0.2} />
          </Heading>
          <MotionBox initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 0.8, ease: EASE }}>
            <Text fontSize={{ base: 'lg', md: '2xl' }} color="muted" mt={6} maxW="3xl">
              {project.summary}
            </Text>
            <SimpleGrid columns={{ base: 2, md: 4 }} spacing={8} mt={12} pt={8} borderTop="1px solid" borderColor="border">
              {meta.map((m) => (
                <Box key={m.k}>
                  <Text fontSize="sm" color="muted" mb={1}>
                    {m.k}
                  </Text>
                  <Text fontWeight="600" fontSize="lg">
                    {m.v}
                  </Text>
                </Box>
              ))}
            </SimpleGrid>
          </MotionBox>
        </Container>
      </Box>

      <Container maxW="7xl">
        <MotionBox
          ref={heroRef}
          borderRadius={{ base: '2xl', md: '4xl' }}
          overflow="hidden"
          aspectRatio={{ base: 4 / 3, md: 16 / 8 }}
          position="relative"
          initial={{ clipPath: 'inset(20% 10% 0% 10% round 40px)' }}
          animate={{ clipPath: 'inset(0% 0% 0% 0% round 32px)' }}
          transition={{ duration: 1.4, delay: 0.3, ease: EASE }}
        >
          <MotionImage
            src={project.cover}
            alt={project.title}
            w="full"
            h="full"
            objectFit="cover"
            style={{ y: imgY, scale: imgScale }}
            fallback={<Box w="full" h="full" bg={project.color || 'brand.600'} />}
          />
        </MotionBox>

        <Box py={{ base: 10, md: 20 }}>
          <Block label="Overview" title="The project" body={project.overview} />
          <Block label="Challenge" title="The problem" body={project.challenge} />
          <Block label="Solution" title="The approach" body={project.solution} />

          {project.metrics.length > 0 && (
            <SimpleGrid columns={{ base: 1, sm: 2, md: Math.min(project.metrics.length, 4) }} spacing={6} py={{ base: 10, md: 16 }} borderTop="1px solid" borderColor="border">
              {project.metrics.map((m, i) => (
                <Reveal key={`${m.label}-${i}`} delay={i * 0.1}>
                  <Box p={8} borderRadius="3xl" bg="surface" border="1px solid" borderColor="border" textAlign="center" _hover={{ borderColor: 'accent' }} transition="all .3s">
                    <Heading fontSize={{ base: '5xl', md: '6xl' }} bgGradient="linear(to-r, ink.a, ink.b)" bgClip="text" fontWeight="700">
                      {m.value}
                    </Heading>
                    <Text color="muted" mt={2}>
                      {m.label}
                    </Text>
                  </Box>
                </Reveal>
              ))}
            </SimpleGrid>
          )}

          <Block label="Results" title="The impact" body={project.results} />

          {gallery.length > 0 && (
            <Box py={{ base: 10, md: 16 }} borderTop="1px solid" borderColor="border">
              <Reveal>
                <Text color="accent" fontSize="sm" fontWeight="600" letterSpacing="0.2em" textTransform="uppercase" mb={8}>
                  Gallery
                </Text>
              </Reveal>
              <Box sx={{ columnCount: [1, 2], columnGap: '24px' }}>
                {gallery.map((g, i) => (
                  <Reveal key={`${g}-${i}`} delay={(i % 2) * 0.1} mb={6} sx={{ breakInside: 'avoid' }}>
                    <Box
                      borderRadius="2xl"
                      overflow="hidden"
                      cursor="zoom-in"
                      data-cursor="Zoom"
                      onClick={() => setLightbox(i)}
                      role="group"
                    >
                      <Image src={g} alt={`${project.title} ${i + 1}`} w="full" transition="transform .8s cubic-bezier(.22,1,.36,1)" _groupHover={{ transform: 'scale(1.05)' }} />
                    </Box>
                  </Reveal>
                ))}
              </Box>
            </Box>
          )}

          <Stack direction={{ base: 'column', md: 'row' }} justify="space-between" align={{ md: 'center' }} spacing={6} py={10} borderTop="1px solid" borderColor="border">
            <Box>
              <Text color="muted" fontSize="sm" mb={3}>
                Tools used
              </Text>
              <Wrap>
                {project.tools.map((t) => (
                  <WrapItem key={t}>
                    <Tag borderRadius="full" size="lg" variant="subtle">
                      {t}
                    </Tag>
                  </WrapItem>
                ))}
              </Wrap>
            </Box>
            {project.liveUrl && (
              <Button as="a" href={project.liveUrl} target="_blank" rel="noreferrer" size="lg" rightIcon={<FiArrowUpRight />}>
                Visit live project
              </Button>
            )}
          </Stack>
        </Box>
      </Container>

      {next && next.id !== project.id && (
        <Box as={RouterLink} to={`/work/${next.slug}`} display="block" role="group" position="relative" overflow="hidden" py={{ base: 20, md: 32 }} data-cursor="Next">
          <Image src={next.cover} alt="" position="absolute" inset={0} w="full" h="full" objectFit="cover" opacity={0.15} transition="all 1s" _groupHover={{ opacity: 0.35, transform: 'scale(1.05)' }} />
          <Container maxW="7xl" position="relative">
            <Text color="muted" mb={4} letterSpacing="0.2em" textTransform="uppercase" fontSize="sm">
              Next project
            </Text>
            <Flex justify="space-between" align="center" gap={6}>
              <Heading fontSize={{ base: '4xl', md: '7xl' }} transition="all .5s" _groupHover={{ color: 'accent', transform: 'translateX(20px)' }}>
                {next.title}
              </Heading>
              <Flex
                flexShrink={0}
                w={{ base: '60px', md: '100px' }}
                h={{ base: '60px', md: '100px' }}
                borderRadius="full"
                border="1px solid"
                borderColor="border.strong"
                align="center"
                justify="center"
                fontSize={{ base: 'xl', md: '3xl' }}
                transition="all .5s"
                _groupHover={{ bg: 'brand.500', color: 'white', borderColor: 'brand.500', transform: 'rotate(-45deg)' }}
              >
                <FiArrowRight />
              </Flex>
            </Flex>
          </Container>
        </Box>
      )}

      <Modal isOpen={lightbox !== null} onClose={() => setLightbox(null)} size="full" motionPreset="scale">
        <ModalOverlay bg="blackAlpha.900" backdropFilter="blur(10px)" />
        <ModalContent bg="transparent" boxShadow="none" m={0} onClick={() => setLightbox(null)}>
          <Flex h="100vh" align="center" justify="center" p={{ base: 4, md: 16 }} position="relative">
            <AnimatePresence mode="wait">
              {lightbox !== null && (
                <MotionImage
                  key={lightbox}
                  src={gallery[lightbox]}
                  maxH="90vh"
                  maxW="full"
                  borderRadius="xl"
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.92 }}
                  transition={{ duration: 0.35 }}
                  onClick={(e: React.MouseEvent) => e.stopPropagation()}
                />
              )}
            </AnimatePresence>
            <IconButton aria-label="Close" icon={<FiX />} position="absolute" top={6} right={6} borderRadius="full" onClick={() => setLightbox(null)} />
            {gallery.length > 1 && (
              <>
                <IconButton
                  aria-label="Previous image"
                  icon={<FiChevronLeft />}
                  position="absolute"
                  left={{ base: 2, md: 6 }}
                  borderRadius="full"
                  onClick={(e) => {
                    e.stopPropagation();
                    setLightbox((l) => ((l ?? 0) - 1 + gallery.length) % gallery.length);
                  }}
                />
                <IconButton
                  aria-label="Next image"
                  icon={<FiChevronRight />}
                  position="absolute"
                  right={{ base: 2, md: 6 }}
                  borderRadius="full"
                  onClick={(e) => {
                    e.stopPropagation();
                    setLightbox((l) => ((l ?? 0) + 1) % gallery.length);
                  }}
                />
              </>
            )}
          </Flex>
        </ModalContent>
      </Modal>
    </Box>
  );
}
