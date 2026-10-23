import { Box, Container, Flex, Heading, HStack, IconButton, Link, Stack, Text } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { FiArrowUp } from 'react-icons/fi';
import { useContent } from '../context/ContentContext';
import { Marquee, Orb } from './Effects';
import { SOCIAL_ICONS } from './icons';
import { NAV_ITEMS, useSectionNav } from './Navbar';

export function Footer() {
  const { content } = useContent();
  const { profile } = content;
  const goTo = useSectionNav();

  return (
    <Box as="footer" position="relative" borderTop="1px solid" borderColor="border" pt={16} pb={8} overflow="hidden">
      <Box mb={12} userSelect="none">
        <Marquee speed={40}>
          {[0, 1, 2].map((i) => (
            <HStack key={i} spacing={{ base: 6, md: 10 }} px={{ base: 3, md: 5 }}>
              <Heading fontSize={{ base: "6xl", md: "9xl" }} whiteSpace="nowrap" color="border.strong">
                {profile.name}
              </Heading>
              <Orb size={{ base: '36px', md: '64px' }} />
              <Heading
                fontSize={{ base: '6xl', md: '9xl' }}
                whiteSpace="nowrap"
                color="transparent"
                sx={{ WebkitTextStroke: "1.5px var(--chakra-colors-border-strong)" }}
              >
                {profile.role}
              </Heading>
              <Orb size={{ base: '36px', md: '64px' }} />
            </HStack>
          ))}
        </Marquee>
      </Box>
      <Container maxW="7xl">
        <Stack direction={{ base: 'column', md: 'row' }} justify="space-between" spacing={8} mb={10}>
          <Box maxW="sm">
            <Heading size="md" mb={3}>
              {profile.name}
            </Heading>
            <Text color="muted">{profile.tagline}</Text>
          </Box>
          <HStack spacing={8} align="flex-start" wrap="wrap">
            {NAV_ITEMS.map((n) => (
              <Link key={n.id} onClick={() => goTo(n.id)} color="muted" _hover={{ color: 'accent' }}>
                {n.label}
              </Link>
            ))}
          </HStack>
        </Stack>
        <Flex
          direction={{ base: 'column-reverse', md: 'row' }}
          justify="space-between"
          align="center"
          gap={6}
          pt={8}
          borderTop="1px solid"
          borderColor="border"
        >
          <Text fontSize="sm" color="muted">
            © {new Date().getFullYear()} {profile.name}. Crafted with care.{' '}
            <Link as={RouterLink} to="/admin" color="muted" opacity={0.5} _hover={{ opacity: 1 }}>
              Admin
            </Link>
          </Text>
          <HStack spacing={2}>
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
                  variant="ghost"
                  colorScheme="gray"
                  borderRadius="full"
                  _hover={{ bg: 'brand.500', color: 'white', transform: 'translateY(-3px)' }}
                />
              );
            })}
            <IconButton
              aria-label="Back to top"
              icon={<FiArrowUp />}
              borderRadius="full"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            />
          </HStack>
        </Flex>
      </Container>
    </Box>
  );
}
