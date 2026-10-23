import { Box, Container, Flex, Heading, Icon, SimpleGrid, Text } from '@chakra-ui/react';
import { FiStar } from 'react-icons/fi';
import { useContent } from '../context/ContentContext';
import { SectionHeading } from '../components/SectionHeading';
import { Reveal } from '../components/Reveal';
import { SpotlightCard } from '../components/Effects';
import { SERVICE_ICONS } from '../components/icons';

export function Services() {
  const { content } = useContent();
  if (!content.services.length) return null;

  return (
    <Box as="section" id="services" py={{ base: 20, md: 32 }} bg="bg.subtle" position="relative">
      <Container maxW="7xl">
        <SectionHeading
          eyebrow="What I do"
          title="Services that turn ideas into"
          highlight="products."
          description="From the first research session to the final pixel, I help teams design experiences that are useful, usable and unforgettable."
        />
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
          {content.services.map((s, i) => {
            const ServiceIcon = SERVICE_ICONS[s.icon] ?? FiStar;
            return (
              <Reveal key={s.id} delay={(i % 3) * 0.1} h="full">
                <SpotlightCard
                  role="group"
                  h="full"
                  p={8}
                  borderRadius="3xl"
                  bg="surface"
                  border="1px solid"
                  borderColor="border"
                  transition="all .5s cubic-bezier(.22,1,.36,1)"
                  _hover={{ transform: 'translateY(-8px)', borderColor: 'brand.400', boxShadow: '0 30px 60px -30px var(--chakra-colors-brand-500)' }}
                >
                  <Flex justify="space-between" align="flex-start" mb={10} position="relative">
                    <Flex
                      w="60px"
                      h="60px"
                      borderRadius="2xl"
                      align="center"
                      justify="center"
                      bg="brand.500"
                      bgGradient="linear(135deg, fill.a, fill.b)"
                      color="onFill"
                      fontSize="2xl"
                      transition="transform .6s cubic-bezier(.22,1,.36,1)"
                      _groupHover={{ transform: 'rotate(-12deg) scale(1.1)' }}
                    >
                      <Icon as={ServiceIcon} />
                    </Flex>
                    <Text fontFamily="heading" fontSize="5xl" fontWeight="700" color="border.strong" lineHeight="1">
                      {String(i + 1).padStart(2, '0')}
                    </Text>
                  </Flex>
                  <Heading size="lg" mb={3} position="relative">
                    {s.title}
                  </Heading>
                  <Text color="muted" position="relative">
                    {s.description}
                  </Text>
                </SpotlightCard>
              </Reveal>
            );
          })}
        </SimpleGrid>
      </Container>
    </Box>
  );
}
