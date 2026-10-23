import { useEffect, useRef, useState } from 'react';
import {
  Alert, AlertDescription, AlertIcon, Avatar, Badge, Box, Button, Code, Divider, Flex, FormControl, FormHelperText,
  FormLabel, Heading, HStack, Icon, IconButton, Image, Input, Progress, SimpleGrid, Stack, Switch, Text, Tooltip,
  useToast, Wrap, WrapItem,
} from '@chakra-ui/react';
import {
  FiBriefcase, FiCheck, FiDownload, FiExternalLink, FiInbox, FiLayers, FiMail, FiMessageSquare, FiRefreshCw,
  FiSave, FiStar, FiTrash2, FiUpload,
} from 'react-icons/fi';
import { useContent, normalizeContent } from '../context/ContentContext';
import type { ProcessStep, Experience, Project, Service, Skill, Social, Stat, Testimonial, Profile } from '../data/types';
import { DEFAULT_PASSCODE } from '../data/defaultContent';
import { ACCENTS } from '../theme';
import { downloadJson, formatBytes, slugify, uid } from '../lib/utils';
import { CollectionEditor } from './CollectionEditor';
import { FieldGrid, TagsInput, type FieldDef } from './fields';
import { SERVICE_ICONS, SOCIAL_ICONS, SOCIAL_PLATFORMS } from '../components/icons';

function Card({ children, ...rest }: React.ComponentProps<typeof Box>) {
  return (
    <Box p={{ base: 5, md: 6 }} borderRadius="2xl" bg="surface" border="1px solid" borderColor="border" {...rest}>
      {children}
    </Box>
  );
}

/* ------------------------------------------------------------------ Dashboard */

export function DashboardPanel({ goTo }: { goTo: (tab: string) => void }) {
  const { content } = useContent();
  const bytes = new Blob([JSON.stringify(content)]).size;
  const limit = 5 * 1024 * 1024;
  const unread = content.messages.filter((m) => !m.read).length;
  const stats = [
    { label: 'Projects', value: content.projects.length, sub: `${content.projects.filter((p) => p.published).length} published`, icon: FiBriefcase, tab: 'projects' },
    { label: 'Services', value: content.services.length, sub: 'offerings', icon: FiLayers, tab: 'services' },
    { label: 'Testimonials', value: content.testimonials.length, sub: 'client quotes', icon: FiStar, tab: 'testimonials' },
    { label: 'Messages', value: content.messages.length, sub: `${unread} unread`, icon: FiInbox, tab: 'messages' },
  ];

  return (
    <Stack spacing={6}>
      <Box>
        <Heading size="lg">Welcome back, {content.profile.name.split(' ')[0]} 👋</Heading>
        <Text color="muted" mt={1}>
          Manage everything on your portfolio from here. Changes appear on the site instantly.
        </Text>
      </Box>
      <SimpleGrid columns={{ base: 1, sm: 2, xl: 4 }} spacing={4}>
        {stats.map((s) => (
          <Card key={s.label} cursor="pointer" onClick={() => goTo(s.tab)} _hover={{ borderColor: 'brand.400', transform: 'translateY(-3px)' }} transition="all .2s">
            <Flex justify="space-between" align="center">
              <Box>
                <Text color="muted" fontSize="sm">
                  {s.label}
                </Text>
                <Heading size="xl" mt={1}>
                  {s.value}
                </Heading>
                <Text color="muted" fontSize="xs">
                  {s.sub}
                </Text>
              </Box>
              <Flex w="48px" h="48px" borderRadius="xl" bgGradient="linear(135deg, brand.400, partner.500)" color="white" align="center" justify="center" fontSize="xl">
                <Icon as={s.icon} />
              </Flex>
            </Flex>
          </Card>
        ))}
      </SimpleGrid>
      <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={4}>
        <Card>
          <Heading size="sm" mb={4}>
            Browser storage
          </Heading>
          <Progress value={(bytes / limit) * 100} borderRadius="full" size="sm" mb={2} />
          <Text fontSize="sm" color="muted">
            {formatBytes(bytes)} of ~5 MB used. Uploaded images take the most space, so prefer image links for large galleries.
          </Text>
        </Card>
        <Card>
          <Heading size="sm" mb={4}>
            Latest messages
          </Heading>
          {content.messages.slice(0, 3).map((m) => (
            <HStack key={m.id} py={2} borderBottom="1px solid" borderColor="border">
              <Avatar size="sm" name={m.name} />
              <Box flex="1" minW={0}>
                <Text fontWeight="600" fontSize="sm" noOfLines={1}>
                  {m.name} {!m.read && <Badge ml={1}>new</Badge>}
                </Text>
                <Text fontSize="xs" color="muted" noOfLines={1}>
                  {m.subject || m.body}
                </Text>
              </Box>
            </HStack>
          ))}
          {content.messages.length === 0 && (
            <Text fontSize="sm" color="muted">
              No messages yet.
            </Text>
          )}
        </Card>
      </SimpleGrid>
    </Stack>
  );
}

/* ------------------------------------------------------------------ Profile */

const profileFields: FieldDef[] = [
  { key: 'name', label: 'Full name', type: 'text', required: true },
  { key: 'role', label: 'Role / title', type: 'text', required: true },
  { key: 'email', label: 'Email', type: 'text', required: true },
  { key: 'phone', label: 'Phone', type: 'text' },
  { key: 'location', label: 'Location', type: 'text' },
  { key: 'resumeUrl', label: 'Résumé / CV link', type: 'text', placeholder: 'https://…', help: 'Shows a "Download CV" button in the hero.' },
  { key: 'available', label: 'Available for work', type: 'switch', help: 'Shows the pulsing "available" badge.' },
  { key: 'heroWords', label: 'Rotating hero words', type: 'tags', help: '"I design ___ digital experiences."' },
  { key: 'tagline', label: 'Tagline', type: 'textarea', rows: 2 },
  { key: 'bio', label: 'Bio', type: 'textarea', rows: 7, help: 'Leave a blank line between paragraphs.' },
  { key: 'avatar', label: 'Portrait photo', type: 'image' },
];

export function ProfilePanel() {
  const { content, setContent } = useContent();
  const [draft, setDraft] = useState<Profile>(content.profile);
  const toast = useToast();
  const dirty = JSON.stringify(draft) !== JSON.stringify(content.profile);

  useEffect(() => setDraft(content.profile), [content.profile]);

  const setProfile = (p: Partial<Profile>) => setContent((c) => ({ ...c, profile: { ...c.profile, ...p } }));

  return (
    <Stack spacing={8}>
      <Card>
        <Flex justify="space-between" align="center" mb={6} gap={4}>
          <Heading size="md">Personal details</Heading>
          <Button
            leftIcon={<FiSave />}
            size="sm"
            isDisabled={!dirty}
            onClick={() => {
              setProfile({ ...draft, socials: content.profile.socials, stats: content.profile.stats });
              toast({ title: 'Profile saved', status: 'success', duration: 2000, position: 'bottom-right' });
            }}
          >
            Save profile
          </Button>
        </Flex>
        <FieldGrid fields={profileFields} values={draft as unknown as Record<string, unknown>} onChange={(k, v) => setDraft((d) => ({ ...d, [k]: v }))} />
      </Card>

      <Card>
        <CollectionEditor<Social>
          title="Social links"
          singular="link"
          items={content.profile.socials}
          onChange={(socials) => setProfile({ socials })}
          fields={[
            { key: 'platform', label: 'Platform', type: 'select', options: SOCIAL_PLATFORMS.map((p) => ({ label: p[0].toUpperCase() + p.slice(1), value: p })) },
            { key: 'url', label: 'URL', type: 'text', required: true, placeholder: 'https://…' },
          ]}
          createItem={() => ({ id: uid(), platform: 'dribbble', url: '' })}
          itemTitle={(s) => s.platform[0].toUpperCase() + s.platform.slice(1)}
          itemSubtitle={(s) => s.url}
          renderThumb={(s) => {
            const I = SOCIAL_ICONS[s.platform];
            return (
              <Flex w="40px" h="40px" borderRadius="lg" bg="bg.subtle" align="center" justify="center">
                <I />
              </Flex>
            );
          }}
        />
      </Card>

      <Card>
        <CollectionEditor<Stat>
          title="Hero stats"
          description="Animated counters shown under the hero."
          singular="stat"
          items={content.profile.stats}
          onChange={(stats) => setProfile({ stats })}
          fields={[
            { key: 'value', label: 'Number', type: 'number', required: true },
            { key: 'suffix', label: 'Suffix', type: 'text', placeholder: '+, %, k' },
            { key: 'label', label: 'Label', type: 'text', required: true, full: true },
          ]}
          createItem={() => ({ id: uid(), value: 10, suffix: '+', label: '' })}
          itemTitle={(s) => `${s.value}${s.suffix}`}
          itemSubtitle={(s) => s.label}
        />
      </Card>
    </Stack>
  );
}

/* ------------------------------------------------------------------ Projects */

const projectFields: FieldDef[] = [
  { key: 'title', label: 'Project title', type: 'text', required: true },
  { key: 'slug', label: 'URL slug', type: 'text', help: 'Leave blank to generate from the title.' },
  { key: 'client', label: 'Client', type: 'text' },
  { key: 'year', label: 'Year', type: 'text' },
  { key: 'category', label: 'Category', type: 'text', required: true, help: 'Used for the filter tabs, e.g. Mobile App.' },
  { key: 'role', label: 'Your role', type: 'text' },
  { key: 'duration', label: 'Duration', type: 'text' },
  { key: 'color', label: 'Accent colour', type: 'color' },
  { key: 'published', label: 'Published', type: 'switch', help: 'Hidden from the site when off.' },
  { key: 'featured', label: 'Featured', type: 'switch', help: 'Shows full-width at the top of the grid.' },
  { key: 'cover', label: 'Cover image', type: 'image' },
  { key: 'summary', label: 'Short summary', type: 'textarea', rows: 2, required: true },
  { key: 'tags', label: 'Tags', type: 'tags' },
  { key: 'tools', label: 'Tools used', type: 'tags' },
  { key: 'overview', label: 'Overview', type: 'textarea' },
  { key: 'challenge', label: 'Challenge', type: 'textarea' },
  { key: 'solution', label: 'Solution / process', type: 'textarea', rows: 6 },
  { key: 'results', label: 'Results', type: 'textarea' },
  { key: 'metrics', label: 'Key metrics', type: 'pairs' },
  { key: 'gallery', label: 'Gallery images', type: 'gallery' },
  { key: 'liveUrl', label: 'Live project URL', type: 'text', placeholder: 'https://…', full: true },
];

const newProject = (): Project => ({
  id: uid(), slug: '', title: '', client: '', year: String(new Date().getFullYear()), category: 'Web App', tags: [], cover: '',
  summary: '', role: 'Product Designer', duration: '', tools: ['Figma'], overview: '', challenge: '', solution: '', results: '',
  metrics: [], gallery: [], liveUrl: '', color: '#805AD5', featured: false, published: true,
});

export function ProjectsPanel() {
  const { content, setContent } = useContent();
  return (
    <Card>
      <CollectionEditor<Project>
        title="Projects"
        description="Each project gets its own animated case-study page."
        singular="project"
        searchable
        items={content.projects}
        onChange={(projects) => setContent((c) => ({ ...c, projects }))}
        fields={projectFields}
        createItem={newProject}
        prepare={(p, all) => {
          let slug = slugify(p.slug || p.title);
          const taken = new Set(all.filter((o) => o.id !== p.id).map((o) => o.slug));
          let n = 2;
          const base = slug;
          while (taken.has(slug)) slug = `${base}-${n++}`;
          return { ...p, slug, gallery: p.gallery.filter(Boolean), metrics: p.metrics.filter((m) => m.label || m.value) };
        }}
        itemTitle={(p) => p.title}
        itemSubtitle={(p) => `${p.category} · ${p.client || 'Personal'} · ${p.year}`}
        renderThumb={(p) => (
          <Box w={{ base: '56px', md: '80px' }} h={{ base: '42px', md: '56px' }} borderRadius="lg" overflow="hidden" bg={p.color} flexShrink={0}>
            {p.cover && <Image src={p.cover} w="full" h="full" objectFit="cover" alt="" />}
          </Box>
        )}
        renderBadges={(p) => (
          <>
            {p.featured && <Badge colorScheme="yellow">Featured</Badge>}
            {!p.published && <Badge colorScheme="gray">Draft</Badge>}
          </>
        )}
      />
    </Card>
  );
}

/* ------------------------------------------------------------------ Simple collections */

export function ServicesPanel() {
  const { content, setContent } = useContent();
  return (
    <Card>
      <CollectionEditor<Service>
        title="Services"
        singular="service"
        items={content.services}
        onChange={(services) => setContent((c) => ({ ...c, services }))}
        fields={[
          { key: 'title', label: 'Title', type: 'text', required: true, full: true },
          { key: 'description', label: 'Description', type: 'textarea', rows: 3 },
          { key: 'icon', label: 'Icon', type: 'icon' },
        ]}
        createItem={() => ({ id: uid(), title: '', description: '', icon: 'layout' })}
        itemTitle={(s) => s.title}
        itemSubtitle={(s) => s.description}
        renderThumb={(s) => {
          const I = SERVICE_ICONS[s.icon] ?? FiStar;
          return (
            <Flex w="40px" h="40px" borderRadius="lg" bgGradient="linear(135deg, brand.400, partner.500)" color="white" align="center" justify="center" flexShrink={0}>
              <I />
            </Flex>
          );
        }}
      />
    </Card>
  );
}

export function SkillsPanel() {
  const { content, setContent } = useContent();
  return (
    <Stack spacing={8}>
      <Card>
        <CollectionEditor<Skill>
          title="Skills"
          description="Animated progress bars in the About section."
          singular="skill"
          items={content.skills}
          onChange={(skills) => setContent((c) => ({ ...c, skills }))}
          fields={[
            { key: 'name', label: 'Skill', type: 'text', required: true, full: true },
            { key: 'level', label: 'Proficiency', type: 'slider', full: true },
          ]}
          createItem={() => ({ id: uid(), name: '', level: 80 })}
          itemTitle={(s) => s.name}
          itemSubtitle={(s) => `${s.level}%`}
        />
      </Card>
      <Card>
        <Heading size="md" mb={1}>
          Toolbox
        </Heading>
        <Text color="muted" fontSize="sm" mb={4}>
          Shown in the scrolling marquee and the About section. Press Enter after each tool.
        </Text>
        <TagsInput value={content.tools} onChange={(tools) => setContent((c) => ({ ...c, tools }))} placeholder="Add a tool, e.g. Figma" />
      </Card>
    </Stack>
  );
}

export function ExperiencePanel() {
  const { content, setContent } = useContent();
  return (
    <Card>
      <CollectionEditor<Experience>
        title="Experience"
        description="Your career timeline, most recent first."
        singular="role"
        items={content.experience}
        onChange={(experience) => setContent((c) => ({ ...c, experience }))}
        fields={[
          { key: 'role', label: 'Role', type: 'text', required: true },
          { key: 'company', label: 'Company', type: 'text', required: true },
          { key: 'period', label: 'Period', type: 'text', placeholder: '2022 — Present', full: true },
          { key: 'description', label: 'Description', type: 'textarea' },
        ]}
        createItem={() => ({ id: uid(), role: '', company: '', period: '', description: '' })}
        itemTitle={(e) => `${e.role} @ ${e.company}`}
        itemSubtitle={(e) => e.period}
      />
    </Card>
  );
}

export function TestimonialsPanel() {
  const { content, setContent } = useContent();
  return (
    <Card>
      <CollectionEditor<Testimonial>
        title="Testimonials"
        singular="testimonial"
        items={content.testimonials}
        onChange={(testimonials) => setContent((c) => ({ ...c, testimonials }))}
        fields={[
          { key: 'name', label: 'Name', type: 'text', required: true },
          { key: 'role', label: 'Role & company', type: 'text' },
          { key: 'quote', label: 'Quote', type: 'textarea', required: true },
          { key: 'avatar', label: 'Photo', type: 'image' },
        ]}
        createItem={() => ({ id: uid(), name: '', role: '', quote: '', avatar: '' })}
        itemTitle={(t) => t.name}
        itemSubtitle={(t) => t.quote}
        renderThumb={(t) => <Avatar src={t.avatar} name={t.name} size="md" />}
      />
    </Card>
  );
}

export function ProcessPanel() {
  const { content, setContent } = useContent();
  return (
    <Card>
      <CollectionEditor<ProcessStep>
        title="Process"
        description="The stacked, sticky cards in the How I work section. Order matters."
        singular="step"
        items={content.process}
        onChange={(process) => setContent((c) => ({ ...c, process }))}
        fields={[
          { key: 'title', label: 'Step name', type: 'text', required: true, full: true },
          { key: 'description', label: 'Description', type: 'textarea', rows: 3 },
          { key: 'deliverables', label: 'Deliverables', type: 'tags' },
        ]}
        createItem={() => ({ id: uid(), title: '', description: '', deliverables: [] })}
        itemTitle={(s) => s.title}
        itemSubtitle={(s) => s.deliverables.join(' · ')}
      />
    </Card>
  );
}

/* ------------------------------------------------------------------ Messages */

export function MessagesPanel() {
  const { content, setContent } = useContent();
  const setMessages = (fn: (m: typeof content.messages) => typeof content.messages) =>
    setContent((c) => ({ ...c, messages: fn(c.messages) }));

  return (
    <Stack spacing={4}>
      <Flex justify="space-between" align="center" wrap="wrap" gap={3}>
        <Box>
          <Heading size="md">Inbox</Heading>
          <Text color="muted" fontSize="sm">
            Copies of messages sent from the contact form in this browser.
          </Text>
        </Box>
        {content.messages.length > 0 && (
          <Button size="sm" variant="outline" leftIcon={<FiCheck />} onClick={() => setMessages((ms) => ms.map((m) => ({ ...m, read: true })))}>
            Mark all read
          </Button>
        )}
      </Flex>
      <Alert status="info" borderRadius="xl">
        <AlertIcon />
        <AlertDescription fontSize="sm">
          To receive messages from real visitors, add a form endpoint (for example Formspree) in Settings. Without one, the form opens the visitor&apos;s email app addressed to you.
        </AlertDescription>
      </Alert>
      {content.messages.map((m) => (
        <Card key={m.id} borderColor={m.read ? 'border' : 'brand.400'} onClick={() => !m.read && setMessages((ms) => ms.map((x) => (x.id === m.id ? { ...x, read: true } : x)))}>
          <Flex gap={4} align="flex-start">
            <Avatar name={m.name} size="md" />
            <Box flex="1" minW={0}>
              <Flex justify="space-between" wrap="wrap" gap={2}>
                <Box>
                  <Text fontWeight="700">
                    {m.name} {!m.read && <Badge ml={1}>new</Badge>}
                  </Text>
                  <Text fontSize="sm" color="muted">
                    {m.email}
                  </Text>
                </Box>
                <Text fontSize="xs" color="muted">
                  {new Date(m.date).toLocaleString()}
                </Text>
              </Flex>
              {m.subject && (
                <Text fontWeight="600" mt={3}>
                  {m.subject}
                </Text>
              )}
              <Text mt={1} color="muted" whiteSpace="pre-wrap">
                {m.body}
              </Text>
              <HStack mt={4}>
                <Button as="a" href={`mailto:${m.email}?subject=Re: ${encodeURIComponent(m.subject || 'Your enquiry')}`} size="sm" leftIcon={<FiMail />}>
                  Reply
                </Button>
                <IconButton
                  aria-label="Delete message"
                  icon={<FiTrash2 />}
                  size="sm"
                  variant="ghost"
                  colorScheme="red"
                  onClick={(e) => {
                    e.stopPropagation();
                    setMessages((ms) => ms.filter((x) => x.id !== m.id));
                  }}
                />
              </HStack>
            </Box>
          </Flex>
        </Card>
      ))}
      {content.messages.length === 0 && (
        <Flex direction="column" align="center" py={16} color="muted" border="1px dashed" borderColor="border.strong" borderRadius="2xl">
          <Icon as={FiMessageSquare} fontSize="3xl" mb={3} />
          <Text>No messages yet.</Text>
        </Flex>
      )}
    </Stack>
  );
}

/* ------------------------------------------------------------------ Settings */

export function SettingsPanel() {
  const { content, setContent, resetContent } = useContent();
  const { settings } = content;
  const fileRef = useRef<HTMLInputElement>(null);
  const toast = useToast();
  const [pass, setPass] = useState('');
  const set = (s: Partial<typeof settings>) => setContent((c) => ({ ...c, settings: { ...c.settings, ...s } }));

  const importFile = async (file?: File) => {
    if (!file) return;
    try {
      const data = JSON.parse(await file.text());
      if (!data || typeof data !== 'object' || !data.profile || !Array.isArray(data.projects)) throw new Error('bad');
      setContent(normalizeContent(data));
      toast({ title: 'Content imported', status: 'success' });
    } catch {
      toast({ title: 'That file is not a valid portfolio export', status: 'error' });
    }
  };

  return (
    <Stack spacing={6}>
      <Card>
        <Heading size="md" mb={1}>
          Appearance
        </Heading>
        <Text color="muted" fontSize="sm" mb={5}>
          Pick the accent colour used across the whole site.
        </Text>
        <Wrap spacing={3}>
          {ACCENTS.map((a) => (
            <WrapItem key={a}>
              <Tooltip label={a} textTransform="capitalize">
                <Box
                  as="button"
                  aria-label={a}
                  w="44px"
                  h="44px"
                  borderRadius="full"
                  bg={`${a}.400`}
                  outline="3px solid"
                  outlineColor={settings.accent === a ? 'fg' : 'transparent'}
                  outlineOffset="3px"
                  transition="transform .2s"
                  _hover={{ transform: 'scale(1.1)' }}
                  onClick={() => set({ accent: a })}
                />
              </Tooltip>
            </WrapItem>
          ))}
        </Wrap>
        <Divider my={6} />
        <Stack spacing={5}>
          <FormControl display="flex" justifyContent="space-between" alignItems="center">
            <Box>
              <FormLabel mb={0}>Intro preloader</FormLabel>
              <Text fontSize="sm" color="muted">
                Animated counter shown on first visit.
              </Text>
            </Box>
            <Switch isChecked={settings.showPreloader} onChange={(e) => set({ showPreloader: e.target.checked })} />
          </FormControl>
          <FormControl display="flex" justifyContent="space-between" alignItems="center">
            <Box>
              <FormLabel mb={0}>Custom cursor</FormLabel>
              <Text fontSize="sm" color="muted">
                Magnetic ring cursor on desktop.
              </Text>
            </Box>
            <Switch isChecked={settings.customCursor} onChange={(e) => set({ customCursor: e.target.checked })} />
          </FormControl>
          <FormControl>
            <FormLabel>Browser tab title</FormLabel>
            <Input value={settings.siteTitle} onChange={(e) => set({ siteTitle: e.target.value })} />
          </FormControl>
          <FormControl>
            <FormLabel>Contact form endpoint</FormLabel>
            <Input value={settings.formEndpoint} onChange={(e) => set({ formEndpoint: e.target.value })} placeholder="https://formspree.io/f/xxxxxxx" />
            <FormHelperText>Optional. When set, the contact form posts here so messages reach your email.</FormHelperText>
          </FormControl>
        </Stack>
      </Card>

      <Card>
        <Heading size="md" mb={1}>
          Admin passcode
        </Heading>
        <Text color="muted" fontSize="sm" mb={4}>
          {settings.passcode === DEFAULT_PASSCODE ? 'You are still using the default passcode. Change it now.' : 'Change the passcode used to open this panel.'}
        </Text>
        <HStack as="form" onSubmit={(e) => { e.preventDefault(); if (pass.length < 4) return; set({ passcode: pass }); setPass(''); toast({ title: 'Passcode updated', status: 'success' }); }}>
          <Input type="password" placeholder="New passcode (min 4 characters)" value={pass} onChange={(e) => setPass(e.target.value)} />
          <Button type="submit" isDisabled={pass.length < 4} flexShrink={0}>
            Update
          </Button>
        </HStack>
      </Card>

      <Card>
        <Heading size="md" mb={1}>
          Publish & backup
        </Heading>
        <Text color="muted" fontSize="sm" mb={4}>
          Edits are saved in this browser. To publish them for every visitor, export the content and save the file as <Code>public/content.json</Code> in the project, then redeploy.
        </Text>
        <Wrap spacing={3}>
          <Button leftIcon={<FiDownload />} onClick={() => downloadJson(content, 'content.json')}>
            Export content.json
          </Button>
          <Button leftIcon={<FiUpload />} variant="outline" onClick={() => fileRef.current?.click()}>
            Import JSON
          </Button>
          <Button as="a" href="/" target="_blank" leftIcon={<FiExternalLink />} variant="ghost">
            View site
          </Button>
        </Wrap>
        <input ref={fileRef} type="file" accept="application/json,.json" hidden onChange={(e) => { importFile(e.target.files?.[0]); e.target.value = ''; }} />
      </Card>

      <Card borderColor="red.400">
        <Heading size="md" mb={1} color="red.400">
          Danger zone
        </Heading>
        <Text color="muted" fontSize="sm" mb={4}>
          Discard all edits in this browser and restore the original content.
        </Text>
        <Button
          colorScheme="red"
          variant="outline"
          leftIcon={<FiRefreshCw />}
          onClick={() => {
            if (window.confirm('Reset all content? Export a backup first if you want to keep your changes.')) {
              resetContent();
              toast({ title: 'Content reset', status: 'info' });
            }
          }}
        >
          Reset to defaults
        </Button>
      </Card>
    </Stack>
  );
}
