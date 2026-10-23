import { useState } from 'react';
import {
  Box, Button, Container, Flex, HStack, IconButton, Link, Text, useColorMode, VStack, Portal,
} from '@chakra-ui/react';
import { AnimatePresence, useMotionValueEvent, useScroll } from 'framer-motion';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import { FiMoon, FiSun, FiArrowUpRight } from 'react-icons/fi';
import { useContent } from '../context/ContentContext';
import { initials } from '../lib/utils';
import { MotionBox, EASE } from './motion';
import { SOCIAL_ICONS } from './icons';

export const NAV_ITEMS = [
  { id: 'work', label: 'Work' },
  { id: 'about', label: 'About' },
  { id: 'services', label: 'Services' },
  { id: 'process', label: 'Process' },
  { id: 'experience', label: 'Experience' },
  { id: 'contact', label: 'Contact' },
];

export function useSectionNav() {
  const location = useLocation();
  const navigate = useNavigate();
  return (id: string) => {
    if (location.pathname === '/') {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      navigate(`/#${id}`);
    }
  };
}

function Burger({ open, onClick }: { open: boolean; onClick: () => void }) {
  return (
    <Box
      as="button"
      aria-label="Toggle menu"
      onClick={onClick}
      w="44px"
      h="44px"
      borderRadius="full"
      border="1px solid"
      borderColor="border.strong"
      position="relative"
      display={{ base: 'block', lg: 'none' }}
      zIndex={2}
    >
      {[0, 1].map((i) => (
        <MotionBox
          key={i}
          position="absolute"
          left="13px"
          w="18px"
          h="2px"
          bg="fg"
          borderRadius="full"
          initial={false}
          animate={open ? { top: '21px', rotate: i ? -45 : 45 } : { top: i ? '25px' : '17px', rotate: 0 }}
          transition={{ duration: 0.35, ease: EASE }}
        />
      ))}
    </Box>
  );
}

export function Navbar() {
  const { content } = useContent();
  const { profile } = content;
  const { colorMode, toggleColorMode } = useColorMode();
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const goTo = useSectionNav();

  useMotionValueEvent(scrollY, 'change', (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setHidden(y > prev && y > 300 && !open);
    setScrolled(y > 30);
  });

  const handleNav = (id: string) => {
    setOpen(false);
    setTimeout(() => goTo(id), open ? 350 : 0);
  };

  return (
    <>
      <MotionBox
        as="header"
        position="fixed"
        top={0}
        left={0}
        right={0}
        zIndex={1500}
        initial={{ y: -100 }}
        animate={{ y: hidden ? -100 : 0 }}
        transition={{ duration: 0.45, ease: EASE }}
      >
        <Container maxW="7xl" pt={scrolled ? 3 : 5} transition="padding .4s">
          <Flex
            align="center"
            justify="space-between"
            px={{ base: 3, md: 5 }}
            py={2.5}
            borderRadius="full"
            bg={scrolled || open ? 'glass' : 'transparent'}
            backdropFilter={scrolled ? 'saturate(180%) blur(18px)' : undefined}
            border="1px solid"
            borderColor={scrolled ? 'border' : 'transparent'}
            boxShadow={scrolled ? '0 10px 40px -10px rgba(0,0,0,0.25)' : undefined}
            transition="all .4s"
          >
            <HStack as={RouterLink} to="/" spacing={3} onClick={() => setOpen(false)} data-cursor="Home">
              <Flex
                w="40px"
                h="40px"
                borderRadius="xl"
                bgGradient="linear(135deg, brand.400, partner.400)"
                align="center"
                justify="center"
                color="white"
                fontWeight="700"
                fontFamily="heading"
                boxShadow="0 8px 24px -6px var(--chakra-colors-brand-500)"
              >
                {initials(profile.name)}
              </Flex>
              <Box display={{ base: 'none', sm: 'block' }} lineHeight="1.1">
                <Text fontWeight="700" fontFamily="heading">
                  {profile.name}
                </Text>
                <Text fontSize="xs" color="muted">
                  {profile.role}
                </Text>
              </Box>
            </HStack>

            <HStack spacing={1} display={{ base: 'none', lg: 'flex' }}>
              {NAV_ITEMS.map((item) => (
                <Button
                  key={item.id}
                  variant="ghost"
                  size="sm"
                  colorScheme="gray"
                  fontWeight="500"
                  onClick={() => handleNav(item.id)}
                  position="relative"
                  _after={{
                    content: '""',
                    position: 'absolute',
                    bottom: '4px',
                    left: '50%',
                    w: '0',
                    h: '2px',
                    bg: 'accent',
                    transition: 'all .3s',
                    transform: 'translateX(-50%)',
                  }}
                  _hover={{ bg: 'transparent', _after: { w: '40%' } }}
                >
                  {item.label}
                </Button>
              ))}
            </HStack>

            <HStack spacing={2}>
              <IconButton
                aria-label="Toggle color mode"
                icon={colorMode === 'dark' ? <FiSun /> : <FiMoon />}
                onClick={toggleColorMode}
                variant="ghost"
                colorScheme="gray"
                borderRadius="full"
              />
              <Button
                display={{ base: 'none', lg: 'inline-flex' }}
                size="sm"
                px={5}
                rightIcon={<FiArrowUpRight />}
                bgGradient="linear(to-r, brand.500, partner.500)"
                color="white"
                _hover={{ bgGradient: 'linear(to-r, brand.400, partner.400)', transform: 'translateY(-2px)' }}
                onClick={() => handleNav('contact')}
              >
                Let&apos;s talk
              </Button>
              <Burger open={open} onClick={() => setOpen((o) => !o)} />
            </HStack>
          </Flex>
        </Container>
      </MotionBox>

      <Portal>
        <AnimatePresence>
          {open && (
            <MotionBox
              position="fixed"
              inset={0}
              zIndex={1400}
              bg="bg"
              initial={{ clipPath: 'circle(0% at 100% 0%)' }}
              animate={{ clipPath: 'circle(150% at 100% 0%)' }}
              exit={{ clipPath: 'circle(0% at 100% 0%)' }}
              transition={{ duration: 0.7, ease: EASE }}
              display={{ lg: 'none' }}
            >
              <Flex direction="column" justify="space-between" h="full" pt="120px" pb={10} px={8}>
                <VStack align="flex-start" spacing={2}>
                  {NAV_ITEMS.map((item, i) => (
                    <Box key={item.id} overflow="hidden">
                      <MotionBox
                        initial={{ y: '100%' }}
                        animate={{ y: 0 }}
                        transition={{ delay: 0.2 + i * 0.07, duration: 0.6, ease: EASE }}
                      >
                        <Link
                          fontSize="5xl"
                          fontFamily="heading"
                          fontWeight="600"
                          onClick={() => handleNav(item.id)}
                          _hover={{ color: 'accent', textDecoration: 'none' }}
                        >
                          <Text as="span" fontSize="sm" color="accent" mr={3} verticalAlign="top">
                            0{i + 1}
                          </Text>
                          {item.label}
                        </Link>
                      </MotionBox>
                    </Box>
                  ))}
                </VStack>
                <MotionBox initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
                  <Text color="muted" mb={3}>
                    {profile.email}
                  </Text>
                  <HStack spacing={3}>
                    {profile.socials.map((s) => {
                      const Icon = SOCIAL_ICONS[s.platform];
                      return (
                        <IconButton
                          key={s.id}
                          as="a"
                          href={s.url}
                          target="_blank"
                          aria-label={s.platform}
                          icon={<Icon />}
                          variant="outline"
                          colorScheme="gray"
                          borderRadius="full"
                        />
                      );
                    })}
                  </HStack>
                </MotionBox>
              </Flex>
            </MotionBox>
          )}
        </AnimatePresence>
      </Portal>
    </>
  );
}
