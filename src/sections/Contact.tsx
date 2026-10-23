import { useState, type FormEvent } from 'react';
import {
  Box, Button, Container, Flex, FormControl, FormLabel, Grid, Heading, HStack, IconButton, Input, Stack, Text,
  Textarea, useClipboard, useToast,
} from '@chakra-ui/react';
import { FiCheck, FiCopy, FiMail, FiMapPin, FiPhone, FiSend } from 'react-icons/fi';
import { useContent } from '../context/ContentContext';
import { uid } from '../lib/utils';
import { Reveal, SplitText } from '../components/Reveal';
import { Magnetic, AuroraBackground } from '../components/Effects';
import { SOCIAL_ICONS } from '../components/icons';

const empty = { name: '', email: '', subject: '', body: '' };

export function Contact() {
  const { content, setContent } = useContent();
  const { profile } = content;
  const { onCopy, hasCopied } = useClipboard(profile.email);
  const [form, setForm] = useState(empty);
  const [sending, setSending] = useState(false);
  const toast = useToast();

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setSending(true);
    const endpoint = content.settings.formEndpoint.trim();
    try {
      if (endpoint) {
        // Works with Formspree, Getform, Basin, etc.
        const res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({ name: form.name, email: form.email, subject: form.subject, message: form.body }),
        });
        if (!res.ok) throw new Error(`Request failed (${res.status})`);
      } else {
        // No form service configured: open the visitor's email app with the message prefilled.
        const subject = encodeURIComponent(form.subject || `New enquiry from ${form.name}`);
        const body = encodeURIComponent(`${form.body}\n\n${form.name}\n${form.email}`);
        window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`;
      }
      // Keep a copy in this browser's admin inbox as well.
      setContent((c) => ({
        ...c,
        messages: [{ id: uid(), ...form, date: new Date().toISOString(), read: false }, ...c.messages],
      }));
      setForm(empty);
      toast({
        title: endpoint ? 'Message sent!' : 'Opening your email app…',
        description: `Thanks for reaching out. ${profile.name.split(' ')[0]} will get back to you soon.`,
        status: 'success',
        position: 'top',
        duration: 5000,
        isClosable: true,
      });
    } catch {
      toast({
        title: 'Something went wrong',
        description: `Please email ${profile.email} directly.`,
        status: 'error',
        position: 'top',
        isClosable: true,
      });
    } finally {
      setSending(false);
    }
  };

  const field = (k: keyof typeof empty) => ({
    value: form[k],
    onChange: (e: { target: { value: string } }) => setForm((f) => ({ ...f, [k]: e.target.value })),
  });

  const inputStyle = { variant: 'flushed' as const, size: 'lg' as const, borderColor: 'border.strong' };

  return (
    <Box as="section" id="contact" py={{ base: 20, md: 32 }} position="relative" overflow="hidden">
      <AuroraBackground />
      <Container maxW="7xl" position="relative" zIndex={1}>
        <Grid templateColumns={{ base: '1fr', lg: '1fr 1fr' }} gap={{ base: 14, lg: 20 }}>
          <Box>
            <Text textTransform="uppercase" letterSpacing="0.25em" fontSize="xs" fontWeight="600" color="accent" mb={4}>
              Get in touch
            </Text>
            <Heading fontSize={{ base: '5xl', md: '7xl' }} lineHeight="1" mb={8}>
              <SplitText text="Let's create" inView />
              <br />
              <Box as="span" bgGradient="linear(to-r, brand.300, partner.300)" bgClip="text">
                <SplitText text="something great." inView delay={0.15} />
              </Box>
            </Heading>
            <Reveal delay={0.2}>
              <Text color="muted" fontSize="lg" mb={10} maxW="md">
                Have a project in mind, a role to fill or just want to say hi? My inbox is always open.
              </Text>
              <Stack spacing={5}>
                <HStack spacing={4}>
                  <Flex w="48px" h="48px" borderRadius="xl" bg="surface" border="1px solid" borderColor="border" align="center" justify="center" color="accent">
                    <FiMail />
                  </Flex>
                  <Box flex="1" minW={0}>
                    <Text fontSize="sm" color="muted">
                      Email
                    </Text>
                    <Text as="a" href={`mailto:${profile.email}`} fontWeight="600" fontSize="lg" wordBreak="break-all" _hover={{ color: 'accent' }}>
                      {profile.email}
                    </Text>
                  </Box>
                  <IconButton aria-label="Copy email" icon={hasCopied ? <FiCheck /> : <FiCopy />} onClick={onCopy} variant="ghost" borderRadius="full" />
                </HStack>
                {profile.phone && (
                  <HStack spacing={4}>
                    <Flex w="48px" h="48px" borderRadius="xl" bg="surface" border="1px solid" borderColor="border" align="center" justify="center" color="accent">
                      <FiPhone />
                    </Flex>
                    <Box>
                      <Text fontSize="sm" color="muted">
                        Phone
                      </Text>
                      <Text as="a" href={`tel:${profile.phone}`} fontWeight="600" fontSize="lg">
                        {profile.phone}
                      </Text>
                    </Box>
                  </HStack>
                )}
                <HStack spacing={4}>
                  <Flex w="48px" h="48px" borderRadius="xl" bg="surface" border="1px solid" borderColor="border" align="center" justify="center" color="accent">
                    <FiMapPin />
                  </Flex>
                  <Box>
                    <Text fontSize="sm" color="muted">
                      Location
                    </Text>
                    <Text fontWeight="600" fontSize="lg">
                      {profile.location}
                    </Text>
                  </Box>
                </HStack>
              </Stack>
              <HStack spacing={3} mt={10}>
                {profile.socials.map((s) => {
                  const Icon = SOCIAL_ICONS[s.platform];
                  return (
                    <Magnetic key={s.id}>
                      <IconButton
                        as="a"
                        href={s.url}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={s.platform}
                        icon={<Icon />}
                        size="lg"
                        borderRadius="full"
                        variant="outline"
                        colorScheme="gray"
                        _hover={{ bg: 'brand.500', color: 'white', borderColor: 'brand.500' }}
                      />
                    </Magnetic>
                  );
                })}
              </HStack>
            </Reveal>
          </Box>

          <Reveal delay={0.2}>
            <Box
              as="form"
              onSubmit={submit}
              p={{ base: 6, md: 10 }}
              borderRadius="3xl"
              bg="glass"
              backdropFilter="blur(20px)"
              border="1px solid"
              borderColor="border.strong"
              boxShadow="0 40px 80px -40px rgba(0,0,0,0.4)"
            >
              <Stack spacing={7}>
                <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={7}>
                  <FormControl isRequired>
                    <FormLabel color="muted" fontSize="sm">
                      Your name
                    </FormLabel>
                    <Input {...inputStyle} placeholder="Jane Doe" {...field('name')} />
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel color="muted" fontSize="sm">
                      Email
                    </FormLabel>
                    <Input {...inputStyle} type="email" placeholder="jane@company.com" {...field('email')} />
                  </FormControl>
                </Grid>
                <FormControl>
                  <FormLabel color="muted" fontSize="sm">
                    Subject
                  </FormLabel>
                  <Input {...inputStyle} placeholder="New app redesign" {...field('subject')} />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel color="muted" fontSize="sm">
                    Tell me about your project
                  </FormLabel>
                  <Textarea {...inputStyle} rows={5} resize="none" placeholder="Goals, timeline, budget..." {...field('body')} />
                </FormControl>
                <Button
                  type="submit"
                  size="lg"
                  h="60px"
                  color="white"
                  bgGradient="linear(to-r, brand.500, partner.500)"
                  _hover={{ bgGradient: 'linear(to-r, brand.400, partner.400)', transform: 'translateY(-2px)' }}
                  rightIcon={<FiSend />}
                  isLoading={sending}
                  loadingText="Sending"
                >
                  Send message
                </Button>
              </Stack>
            </Box>
          </Reveal>
        </Grid>
      </Container>
    </Box>
  );
}
