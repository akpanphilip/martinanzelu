import { Box, Container, Flex, Grid, Heading, HStack, IconButton, Image, Stack, Text, Wrap, WrapItem } from '@chakra-ui/react';
import { useContent } from '../context/ContentContext';
import { SectionHeading } from '../components/SectionHeading';
import { Reveal } from '../components/Reveal';
import { MotionBox, EASE } from '../components/motion';
import { SOCIAL_ICONS } from '../components/icons';

export function About() {
  const { content } = useContent();
  const { profile, skills, tools } = content;

  return (
    <Box as="section" id="about" py={{ base: 20, md: 32 }} position="relative">
      <Container maxW="7xl">
        <SectionHeading eyebrow="About me" title="Design with purpose," highlight="built for people." />
        <Grid templateColumns={{ base: '1fr', lg: '5fr 7fr' }} gap={{ base: 12, lg: 20 }} alignItems="start">
          <Reveal>
            <Box position="relative" maxW={{ base: 'sm', lg: 'none' }} mx={{ base: 'auto', lg: 0 }}>
              <Box
                position="absolute"
                top="24px"
                left="24px"
                right="-24px"
                bottom="-24px"
                borderRadius="3xl"
                border="2px solid"
                borderColor="accent"
                opacity={0.5}
              />
              <Box borderRadius="3xl" overflow="hidden" position="relative" role="group" aspectRatio={4 / 5}>
                <Image
                  src={profile.avatar}
                  alt={profile.name}
                  w="full"
                  h="full"
                  objectFit="cover"
                  objectPosition="68% center"
                  filter="grayscale(40%)"
                  transition="all .8s cubic-bezier(.22,1,.36,1)"
                  _groupHover={{ filter: 'grayscale(0%)', transform: 'scale(1.06)' }}
                  fallback={<Box w="full" h="full" bgGradient="linear(135deg, brand.600, partner.600)" />}
                />
              </Box>
            </Box>
          </Reveal>

          <Stack spacing={10}>
            <Reveal delay={0.1}>
              {profile.bio.split(/\n+/).map((p, i) => (
                <Text key={i} fontSize={{ base: 'lg', md: 'xl' }} color={i === 0 ? 'fg' : 'muted'} mb={5} lineHeight="1.7">
                  {p}
                </Text>
              ))}
              <HStack spacing={3} mt={2}>
                {profile.socials.map((s) => {
                  const Icon = SOCIAL_ICONS[s.platform];
                  return (
                    <IconButton
                      key={s.id}
                      as="a"
                      href={s.url}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={s.platform}
                      icon={<Icon />}
                      variant="outline"
                      colorScheme="gray"
                      borderRadius="full"
                      _hover={{ bg: 'brand.500', color: 'white', borderColor: 'brand.500', transform: 'translateY(-4px) rotate(-8deg)' }}
                    />
                  );
                })}
              </HStack>
            </Reveal>

            {skills.length > 0 && (
              <Box>
                <Heading size="md" mb={6}>
                  Core skills
                </Heading>
                <Stack spacing={6}>
                  {skills.map((s, i) => (
                    <Reveal key={s.id} delay={i * 0.08} y={20}>
                      <Flex justify="space-between" mb={2}>
                        <Text fontWeight="500">{s.name}</Text>
                        <Text color="accent" fontWeight="600" fontFamily="heading">
                          {s.level}%
                        </Text>
                      </Flex>
                      <Box h="6px" bg="border" borderRadius="full" overflow="hidden">
                        <MotionBox
                          h="full"
                          borderRadius="full"
                          bgGradient="linear(to-r, brand.400, partner.400)"
                          initial={{ width: 0 }}
                          whileInView={{ width: `${Math.min(100, Math.max(0, s.level))}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1.4, delay: 0.2 + i * 0.1, ease: EASE }}
                        />
                      </Box>
                    </Reveal>
                  ))}
                </Stack>
              </Box>
            )}

            {tools.length > 0 && (
              <Reveal>
                <Heading size="md" mb={5}>
                  Toolbox
                </Heading>
                <Wrap spacing={3}>
                  {tools.map((t, i) => (
                    <WrapItem key={t}>
                      <MotionBox
                        px={4}
                        py={2}
                        borderRadius="full"
                        border="1px solid"
                        borderColor="border.strong"
                        bg="surface"
                        fontSize="sm"
                        initial={{ opacity: 0, scale: 0.6 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.04, type: 'spring', stiffness: 260, damping: 18 }}
                        whileHover={{ y: -4, scale: 1.05 }}
                        _hover={{ borderColor: 'accent', color: 'accent' }}
                      >
                        {t}
                      </MotionBox>
                    </WrapItem>
                  ))}
                </Wrap>
              </Reveal>
            )}
          </Stack>
        </Grid>
      </Container>
    </Box>
  );
}
