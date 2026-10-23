import { useMemo, useState } from 'react';
import { Box, Button, Container, Flex, Grid, Heading, HStack, Image, Tag, Text, Wrap, WrapItem } from '@chakra-ui/react';
import { AnimatePresence, LayoutGroup } from 'framer-motion';
import { Link as RouterLink } from 'react-router-dom';
import { FiArrowUpRight } from 'react-icons/fi';
import { useContent } from '../context/ContentContext';
import type { Project } from '../data/types';
import { SectionHeading } from '../components/SectionHeading';
import { TiltCard, Orb } from '../components/Effects';
import { MotionBox, EASE } from '../components/motion';

export function ProjectCard({ project, large = false }: { project: Project; large?: boolean }) {
  return (
    <TiltCard max={large ? 4 : 7} borderRadius="3xl" h="full">
      <Box
        as={RouterLink}
        to={`/work/${project.slug}`}
        data-cursor="View"
        display="block"
        role="group"
        h="full"
        borderRadius="3xl"
        overflow="hidden"
        bg="surface"
        border="1px solid"
        borderColor="border"
        transition="border-color .4s, box-shadow .4s"
        _hover={{ borderColor: 'border.strong', boxShadow: `0 40px 80px -40px ${project.color || 'black'}` }}
      >
        <Box position="relative" overflow="hidden" aspectRatio={large ? { base: 4 / 3, md: 21 / 9 } : 4 / 3}>
          <Image
            src={project.cover}
            alt={project.title}
            w="full"
            h="full"
            objectFit="cover"
            transition="transform 1.2s cubic-bezier(.22,1,.36,1)"
            _groupHover={{ transform: 'scale(1.08)' }}
            fallback={<Box w="full" h="full" bg={project.color || 'brand.600'} />}
          />
          <Box
            position="absolute"
            inset={0}
            bg={project.color || 'brand.500'}
            mixBlendMode="multiply"
            opacity={0}
            transition="opacity .6s"
            _groupHover={{ opacity: 0.35 }}
          />
          <HStack position="absolute" top={4} left={4} spacing={2}>
            <Tag size="md" borderRadius="full" bg="blackAlpha.600" color="white" backdropFilter="blur(10px)">
              {project.category}
            </Tag>
            {project.featured && (
              <Tag size="md" borderRadius="full" bg="blackAlpha.600" color="white" backdropFilter="blur(10px)" gap={2}>
                <Orb size="10px" />
                Featured
              </Tag>
            )}
          </HStack>
          <Flex
            position="absolute"
            right={4}
            bottom={4}
            w="56px"
            h="56px"
            borderRadius="full"
            bg="white"
            color="black"
            align="center"
            justify="center"
            fontSize="xl"
            transform="scale(0) rotate(-45deg)"
            transition="transform .5s cubic-bezier(.22,1,.36,1)"
            _groupHover={{ transform: 'scale(1) rotate(0deg)' }}
          >
            <FiArrowUpRight />
          </Flex>
        </Box>
        <Box p={{ base: 6, md: 7 }}>
          <Flex justify="space-between" align="baseline" gap={4} mb={2}>
            <Heading size={large ? 'lg' : 'md'} transition="color .3s" _groupHover={{ color: 'accent' }}>
              {project.title}
            </Heading>
            <Text color="muted" fontSize="sm" flexShrink={0}>
              {project.year}
            </Text>
          </Flex>
          <Text color="muted" noOfLines={2}>
            {project.summary}
          </Text>
          <Wrap mt={4} spacing={2}>
            {project.tags.slice(0, 4).map((t) => (
              <WrapItem key={t}>
                <Text fontSize="xs" px={3} py={1} borderRadius="full" border="1px solid" borderColor="border.strong" color="muted">
                  {t}
                </Text>
              </WrapItem>
            ))}
          </Wrap>
        </Box>
      </Box>
    </TiltCard>
  );
}

export function Work() {
  const { content } = useContent();
  const projects = content.projects.filter((p) => p.published);
  const categories = useMemo(() => ['All', ...Array.from(new Set(projects.map((p) => p.category).filter(Boolean)))], [projects]);
  const [filter, setFilter] = useState('All');
  const visible = projects.filter((p) => filter === 'All' || p.category === filter);

  return (
    <Box as="section" id="work" py={{ base: 20, md: 32 }}>
      <Container maxW="7xl">
        <Flex direction={{ base: 'column', lg: 'row' }} justify="space-between" align={{ lg: 'flex-end' }} mb={{ base: 0, lg: 4 }}>
          <SectionHeading
            eyebrow="Selected work"
            title="Projects I'm"
            highlight="proud of."
            description="A curated selection of case studies across product, brand and systems design."
          />
          <LayoutGroup id="filters">
            <HStack
              spacing={1}
              p={1.5}
              mb={{ base: 10, lg: 16 }}
              borderRadius="full"
              border="1px solid"
              borderColor="border"
              bg="surface"
              overflowX="auto"
              maxW="full"
              flexShrink={0}
              sx={{ scrollbarWidth: 'none' }}
            >
              {categories.map((c) => (
                <Button
                  key={c}
                  size="sm"
                  variant="unstyled"
                  position="relative"
                  px={4}
                  h="36px"
                  flexShrink={0}
                  color={filter === c ? 'onFill' : 'muted'}
                  onClick={() => setFilter(c)}
                  _hover={{ color: filter === c ? 'onFill' : 'fg' }}
                >
                  {filter === c && (
                    <MotionBox
                      layoutId="filter-pill"
                      position="absolute"
                      inset={0}
                      borderRadius="full"
                      bgGradient="linear(to-r, fill.a, fill.b)"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                  <Box as="span" position="relative">
                    {c}
                  </Box>
                </Button>
              ))}
            </HStack>
          </LayoutGroup>
        </Flex>

        <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={{ base: 6, md: 8 }}>
          <AnimatePresence mode="popLayout">
            {visible.map((p, i) => {
              const large = p.featured && filter === 'All';
              return (
                <MotionBox
                  key={p.id}
                  layout
                  gridColumn={large ? { md: 'span 2' } : undefined}
                  initial={{ opacity: 0, y: 60, scale: 0.96 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true, margin: '-60px' }}
                  exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.25 } }}
                  transition={{ duration: 0.8, delay: (i % 2) * 0.1, ease: EASE }}
                >
                  <ProjectCard project={p} large={large} />
                </MotionBox>
              );
            })}
          </AnimatePresence>
        </Grid>
        {visible.length === 0 && (
          <Text textAlign="center" color="muted" py={20}>
            No projects yet. Add some from the admin panel.
          </Text>
        )}
      </Container>
    </Box>
  );
}
