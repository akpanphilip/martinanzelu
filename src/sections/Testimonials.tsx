import { Avatar, Box, Container, HStack, SimpleGrid, Text } from '@chakra-ui/react';
import { useContent } from '../context/ContentContext';
import type { Testimonial } from '../data/types';
import { SectionHeading } from '../components/SectionHeading';
import { Reveal } from '../components/Reveal';
import { VerticalMarquee } from '../components/Effects';

function QuoteCard({ t, highlight }: { t: Testimonial; highlight: boolean }) {
  return (
    <Box
      position="relative"
      p={{ base: 6, md: 7 }}
      borderRadius="3xl"
      bg={highlight ? 'transparent' : 'surface'}
      bgGradient={highlight ? 'linear(150deg, hl.a, hl.b)' : undefined}
      color={highlight ? 'white' : undefined}
      border="1px solid"
      borderColor={highlight ? 'transparent' : 'border'}
      transition="border-color .3s, transform .4s cubic-bezier(.22,1,.36,1)"
      _hover={{ borderColor: highlight ? 'transparent' : 'brand.400', transform: 'translateY(-4px)' }}
    >
      <Text
        fontFamily="Georgia, serif"
        fontSize="6xl"
        lineHeight="0.6"
        h="28px"
        color={highlight ? 'whiteAlpha.700' : 'accent'}
        userSelect="none"
      >
        “
      </Text>
      <Text fontSize={{ base: 'md', md: 'lg' }} lineHeight="1.65" mb={6} color={highlight ? 'whiteAlpha.900' : 'fg'}>
        {t.quote}
      </Text>
      <HStack spacing={3}>
        <Avatar src={t.avatar} name={t.name} size="sm" border="2px solid" borderColor={highlight ? 'whiteAlpha.600' : 'border.strong'} />
        <Box lineHeight="1.25">
          <Text fontWeight="600" fontSize="sm">
            {t.name}
          </Text>
          <Text fontSize="xs" color={highlight ? 'whiteAlpha.700' : 'muted'}>
            {t.role}
          </Text>
        </Box>
      </HStack>
    </Box>
  );
}

const COLUMNS = [
  { speed: 48, reverse: false, offset: 0, highlightAt: 1, display: 'block' },
  { speed: 58, reverse: true, offset: 0.35, highlightAt: 3, display: { base: 'none', md: 'block' } },
  { speed: 52, reverse: false, offset: 0.7, highlightAt: 0, display: { base: 'none', lg: 'block' } },
] as const;

export function Testimonials() {
  const { content } = useContent();
  const items = content.testimonials;
  if (!items.length) return null;

  // Each column shows the full set, rotated so neighbouring columns never line up the same quote.
  // Short lists are repeated so the columns are always taller than the viewport window.
  const pool = items.length < 4 ? [...items, ...items, ...items].slice(0, Math.max(4, items.length)) : items;
  const columns = COLUMNS.map((_, c) => {
    const shift = (c * Math.ceil(pool.length / COLUMNS.length)) % pool.length;
    return [...pool.slice(shift), ...pool.slice(0, shift)];
  });
  const clients = Array.from(new Set(content.projects.filter((p) => p.published).map((p) => p.client).filter(Boolean))).slice(0, 4);

  return (
    <Box as="section" id="testimonials" py={{ base: 20, md: 32 }} bg="bg.subtle" overflow="hidden">
      <Container maxW="7xl">
        <SectionHeading
          eyebrow="Kind words"
          title="Trusted by teams who"
          highlight="ship."
          align="center"
          description={
            clients.length
              ? `Founders, product leaders and engineers at ${clients.join(', ')} and more.`
              : 'What founders, product leaders and engineers say about working together.'
          }
        />
        <Reveal>
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={5}>
            {COLUMNS.map((col, c) => (
              <Box key={c} display={col.display}>
                <VerticalMarquee speed={col.speed} reverse={col.reverse} offset={col.offset} height={{ base: '560px', md: '720px' }}>
                  {columns[c].map((t, i) => (
                    <QuoteCard key={`${t.id}-${i}`} t={t} highlight={i === col.highlightAt % columns[c].length} />
                  ))}
                </VerticalMarquee>
              </Box>
            ))}
          </SimpleGrid>
        </Reveal>
      </Container>
    </Box>
  );
}
