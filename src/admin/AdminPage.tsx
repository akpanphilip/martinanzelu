import { useState, type FormEvent } from 'react';
import {
  Alert, AlertDescription, AlertIcon, Badge, Box, Button, Container, Flex, FormControl, Heading, HStack, Icon, IconButton,
  Input, InputGroup, InputRightElement, Stack, Text, useColorMode, VStack,
} from '@chakra-ui/react';
import { AnimatePresence } from 'framer-motion';
import { Link as RouterLink, useSearchParams } from 'react-router-dom';
import {
  FiBriefcase, FiExternalLink, FiEye, FiEyeOff, FiGrid, FiInbox, FiLayers, FiLock, FiLogOut, FiMoon, FiSettings,
  FiStar, FiSun, FiTrendingUp, FiUser, FiClock, FiRepeat,
} from 'react-icons/fi';
import { useContent } from '../context/ContentContext';
import { DEFAULT_PASSCODE } from '../data/defaultContent';
import { AuroraBackground } from '../components/Effects';
import { MotionBox, EASE } from '../components/motion';
import { initials } from '../lib/utils';
import {
  DashboardPanel, ExperiencePanel, ProcessPanel, MessagesPanel, ProfilePanel, ProjectsPanel, ServicesPanel, SettingsPanel, SkillsPanel,
  TestimonialsPanel,
} from './panels';

const SESSION_KEY = 'uiportfolio:admin';

function Login({ onSuccess }: { onSuccess: () => void }) {
  const { content } = useContent();
  const [value, setValue] = useState('');
  const [show, setShow] = useState(false);
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(0);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (value === content.settings.passcode) {
      sessionStorage.setItem(SESSION_KEY, '1');
      onSuccess();
    } else {
      setError(true);
      setShake((s) => s + 1);
    }
  };

  return (
    <Flex minH="100vh" align="center" justify="center" position="relative" overflow="hidden" px={4}>
      <AuroraBackground />
      <MotionBox
        key={shake}
        position="relative"
        zIndex={1}
        w="full"
        maxW="md"
        initial={shake ? { x: 0 } : { opacity: 0, y: 30, scale: 0.96 }}
        animate={shake ? { x: [0, -12, 12, -8, 8, 0] } : { opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: shake ? 0.4 : 0.8, ease: EASE }}
      >
        <Box as="form" onSubmit={submit} p={{ base: 8, md: 10 }} borderRadius="3xl" bg="glass" backdropFilter="blur(20px)" border="1px solid" borderColor="border.strong" boxShadow="2xl">
          <Flex w="56px" h="56px" borderRadius="2xl" bgGradient="linear(135deg, brand.400, partner.500)" color="white" align="center" justify="center" fontSize="2xl" mb={6}>
            <FiLock />
          </Flex>
          <Heading size="lg">Admin panel</Heading>
          <Text color="muted" mt={2} mb={8}>
            Enter your passcode to manage your portfolio.
          </Text>
          <FormControl isInvalid={error}>
            <InputGroup size="lg">
              <Input
                type={show ? 'text' : 'password'}
                value={value}
                onChange={(e) => {
                  setValue(e.target.value);
                  setError(false);
                }}
                placeholder="Passcode"
                autoFocus
              />
              <InputRightElement>
                <IconButton aria-label="Toggle visibility" icon={show ? <FiEyeOff /> : <FiEye />} size="sm" variant="ghost" onClick={() => setShow((s) => !s)} />
              </InputRightElement>
            </InputGroup>
          </FormControl>
          {error && (
            <Text color="red.400" fontSize="sm" mt={2}>
              Incorrect passcode.
            </Text>
          )}
          <Button type="submit" size="lg" w="full" mt={6}>
            Unlock
          </Button>
          {content.settings.passcode === DEFAULT_PASSCODE && (
            <Text fontSize="xs" color="muted" mt={4} textAlign="center">
              First time? The default passcode is <b>{DEFAULT_PASSCODE}</b>. Change it in Settings.
            </Text>
          )}
          <Button as={RouterLink} to="/" variant="link" size="sm" w="full" mt={4} colorScheme="gray">
            ← Back to site
          </Button>
        </Box>
      </MotionBox>
    </Flex>
  );
}

const TABS = [
  { id: 'dashboard', label: 'Dashboard', icon: FiGrid },
  { id: 'profile', label: 'Profile', icon: FiUser },
  { id: 'projects', label: 'Projects', icon: FiBriefcase },
  { id: 'services', label: 'Services', icon: FiLayers },
  { id: 'process', label: 'Process', icon: FiRepeat },
  { id: 'skills', label: 'Skills & tools', icon: FiTrendingUp },
  { id: 'experience', label: 'Experience', icon: FiClock },
  { id: 'testimonials', label: 'Testimonials', icon: FiStar },
  { id: 'messages', label: 'Messages', icon: FiInbox },
  { id: 'settings', label: 'Settings', icon: FiSettings },
];

export default function AdminPage() {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem(SESSION_KEY) === '1');
  const [params, setParams] = useSearchParams();
  const tab = TABS.some((t) => t.id === params.get('tab')) ? (params.get('tab') as string) : 'dashboard';
  const goTo = (id: string) => {
    setParams({ tab: id });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const { content, storageError, isLocalDraft } = useContent();
  const { colorMode, toggleColorMode } = useColorMode();
  const unread = content.messages.filter((m) => !m.read).length;

  if (!authed) return <Login onSuccess={() => setAuthed(true)} />;

  const panel = {
    dashboard: <DashboardPanel goTo={goTo} />,
    profile: <ProfilePanel />,
    projects: <ProjectsPanel />,
    services: <ServicesPanel />,
    process: <ProcessPanel />,
    skills: <SkillsPanel />,
    experience: <ExperiencePanel />,
    testimonials: <TestimonialsPanel />,
    messages: <MessagesPanel />,
    settings: <SettingsPanel />,
  }[tab];

  return (
    <Flex minH="100vh" bg="bg">
      <Box
        as="aside"
        display={{ base: 'none', lg: 'flex' }}
        flexDirection="column"
        w="260px"
        flexShrink={0}
        borderRight="1px solid"
        borderColor="border"
        p={5}
        position="sticky"
        top={0}
        h="100vh"
        bg="bg.subtle"
      >
        <HStack mb={8} px={2}>
          <Flex w="40px" h="40px" borderRadius="xl" bgGradient="linear(135deg, brand.400, partner.400)" color="white" fontWeight="700" align="center" justify="center">
            {initials(content.profile.name)}
          </Flex>
          <Box lineHeight="1.2">
            <Text fontWeight="700">{content.profile.name}</Text>
            <Text fontSize="xs" color="muted">
              Portfolio admin
            </Text>
          </Box>
        </HStack>
        <VStack align="stretch" spacing={1} flex="1">
          {TABS.map((t) => (
            <Button
              key={t.id}
              justifyContent="flex-start"
              variant="ghost"
              colorScheme="gray"
              borderRadius="xl"
              fontWeight={tab === t.id ? 700 : 500}
              color={tab === t.id ? 'accent' : 'muted'}
              bg={tab === t.id ? 'surface.hover' : 'transparent'}
              leftIcon={<Icon as={t.icon} />}
              onClick={() => goTo(t.id)}
              position="relative"
            >
              {tab === t.id && (
                <MotionBox layoutId="admin-nav" position="absolute" left={0} top="25%" bottom="25%" w="3px" borderRadius="full" bg="accent" />
              )}
              {t.label}
              {t.id === 'messages' && unread > 0 && (
                <Badge ml="auto" borderRadius="full" colorScheme="brand" variant="solid">
                  {unread}
                </Badge>
              )}
            </Button>
          ))}
        </VStack>
        <Stack spacing={1}>
          <Button as={RouterLink} to="/" target="_blank" justifyContent="flex-start" variant="ghost" colorScheme="gray" leftIcon={<FiExternalLink />} borderRadius="xl">
            View site
          </Button>
          <Button
            justifyContent="flex-start"
            variant="ghost"
            colorScheme="gray"
            leftIcon={<FiLogOut />}
            borderRadius="xl"
            onClick={() => {
              sessionStorage.removeItem(SESSION_KEY);
              setAuthed(false);
            }}
          >
            Log out
          </Button>
        </Stack>
      </Box>

      <Box flex="1" minW={0}>
        <Flex
          as="header"
          position="sticky"
          top={0}
          zIndex={10}
          bg="glass"
          backdropFilter="blur(16px)"
          borderBottom="1px solid"
          borderColor="border"
          px={{ base: 4, md: 8 }}
          py={3}
          align="center"
          justify="space-between"
          gap={3}
        >
          <Heading size="md" display={{ base: 'none', lg: 'block' }}>
            {TABS.find((t) => t.id === tab)?.label}
          </Heading>
          <HStack
            display={{ base: 'flex', lg: 'none' }}
            overflowX="auto"
            spacing={1}
            flex="1"
            sx={{ scrollbarWidth: 'none', '&::-webkit-scrollbar': { display: 'none' } }}
          >
            {TABS.map((t) => (
              <Button key={t.id} size="sm" flexShrink={0} variant={tab === t.id ? 'solid' : 'ghost'} colorScheme={tab === t.id ? 'brand' : 'gray'} leftIcon={<Icon as={t.icon} />} onClick={() => goTo(t.id)}>
                {t.label}
              </Button>
            ))}
          </HStack>
          <HStack flexShrink={0}>
            {isLocalDraft && (
              <Badge colorScheme="green" variant="subtle" borderRadius="full" px={3} py={1} display={{ base: 'none', md: 'inline-flex' }}>
                ● Saved in this browser
              </Badge>
            )}
            <IconButton aria-label="Toggle color mode" icon={colorMode === 'dark' ? <FiSun /> : <FiMoon />} onClick={toggleColorMode} variant="ghost" borderRadius="full" />
            <IconButton
              aria-label="Log out"
              icon={<FiLogOut />}
              variant="ghost"
              borderRadius="full"
              display={{ lg: 'none' }}
              onClick={() => {
                sessionStorage.removeItem(SESSION_KEY);
                setAuthed(false);
              }}
            />
          </HStack>
        </Flex>

        <Container maxW="5xl" py={{ base: 6, md: 10 }} px={{ base: 4, md: 8 }}>
          {storageError && (
            <Alert status="error" borderRadius="xl" mb={6}>
              <AlertIcon />
              <AlertDescription>{storageError}</AlertDescription>
            </Alert>
          )}
          <AnimatePresence mode="wait">
            <MotionBox key={tab} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.3, ease: EASE }}>
              {panel}
            </MotionBox>
          </AnimatePresence>
        </Container>
      </Box>
    </Flex>
  );
}
