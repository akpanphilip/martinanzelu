import { useRef, useState, type KeyboardEvent } from 'react';
import {
  Box, Button, Flex, FormControl, FormHelperText, FormLabel, HStack, IconButton, Image, Input, NumberInput,
  NumberInputField, Select, SimpleGrid, Slider, SliderFilledTrack, SliderThumb, SliderTrack, Switch, Tag, TagCloseButton,
  TagLabel, Text, Textarea, useToast, Wrap, WrapItem, Icon,
} from '@chakra-ui/react';
import { FiPlus, FiTrash2, FiUpload, FiImage } from 'react-icons/fi';
import type { Metric } from '../data/types';
import { imageFileToDataUrl } from '../lib/utils';
import { SERVICE_ICONS } from '../components/icons';

export type FieldType =
  | 'text' | 'textarea' | 'number' | 'switch' | 'select' | 'image' | 'tags' | 'gallery' | 'pairs' | 'color' | 'slider' | 'icon';

export interface FieldDef {
  key: string;
  label: string;
  type: FieldType;
  options?: { label: string; value: string }[];
  placeholder?: string;
  help?: string;
  required?: boolean;
  full?: boolean;
  rows?: number;
}

export function ImageInput({ value, onChange, compact = false }: { value: string; onChange: (v: string) => void; compact?: boolean }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const toast = useToast();
  const [busy, setBusy] = useState(false);

  const pick = async (file?: File) => {
    if (!file) return;
    setBusy(true);
    try {
      onChange(await imageFileToDataUrl(file));
    } catch {
      toast({ title: 'Could not read that image', status: 'error' });
    } finally {
      setBusy(false);
    }
  };

  return (
    <Flex gap={3} align="center" direction={compact ? 'row' : { base: 'column', sm: 'row' }}>
      <Box
        flexShrink={0}
        w={compact ? '56px' : '96px'}
        h={compact ? '56px' : '72px'}
        borderRadius="lg"
        overflow="hidden"
        bg="bg.subtle"
        border="1px dashed"
        borderColor="border.strong"
        display="flex"
        alignItems="center"
        justifyContent="center"
        color="muted"
      >
        {value ? <Image src={value} w="full" h="full" objectFit="cover" alt="" /> : <Icon as={FiImage} />}
      </Box>
      <Input
        value={value.startsWith('data:') ? '(uploaded image)' : value}
        isReadOnly={value.startsWith('data:')}
        onChange={(e) => onChange(e.target.value)}
        placeholder="https://… or upload"
        size="sm"
      />
      <HStack>
        <Button size="sm" leftIcon={<FiUpload />} onClick={() => fileRef.current?.click()} isLoading={busy} variant="outline" flexShrink={0}>
          Upload
        </Button>
        {value && <IconButton size="sm" aria-label="Clear image" icon={<FiTrash2 />} variant="ghost" colorScheme="red" onClick={() => onChange('')} />}
      </HStack>
      <input ref={fileRef} type="file" accept="image/*" hidden onChange={(e) => { pick(e.target.files?.[0]); e.target.value = ''; }} />
    </Flex>
  );
}

export function TagsInput({ value, onChange, placeholder }: { value: string[]; onChange: (v: string[]) => void; placeholder?: string }) {
  const [draft, setDraft] = useState('');
  const add = () => {
    const parts = draft.split(',').map((s) => s.trim()).filter(Boolean).filter((s) => !value.includes(s));
    if (parts.length) onChange([...value, ...parts]);
    setDraft('');
  };
  const onKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      add();
    } else if (e.key === 'Backspace' && !draft && value.length) {
      onChange(value.slice(0, -1));
    }
  };
  return (
    <Box border="1px solid" borderColor="border.strong" borderRadius="md" p={2}>
      <Wrap spacing={2} mb={value.length ? 2 : 0}>
        {value.map((t, i) => (
          <WrapItem key={`${t}-${i}`}>
            <Tag borderRadius="full" variant="subtle">
              <TagLabel>{t}</TagLabel>
              <TagCloseButton onClick={() => onChange(value.filter((_, j) => j !== i))} />
            </Tag>
          </WrapItem>
        ))}
      </Wrap>
      <Input
        size="sm"
        variant="unstyled"
        px={1}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={onKey}
        onBlur={add}
        placeholder={placeholder ?? 'Type and press Enter'}
      />
    </Box>
  );
}

function GalleryInput({ value, onChange }: { value: string[]; onChange: (v: string[]) => void }) {
  return (
    <Box>
      <Box display="grid" gap={3}>
        {value.map((img, i) => (
          <Flex key={i} gap={2} align="center">
            <Box flex="1">
              <ImageInput compact value={img} onChange={(v) => onChange(value.map((x, j) => (j === i ? v : x)))} />
            </Box>
            <IconButton aria-label="Remove image" icon={<FiTrash2 />} size="sm" variant="ghost" colorScheme="red" onClick={() => onChange(value.filter((_, j) => j !== i))} />
          </Flex>
        ))}
      </Box>
      <Button mt={3} size="sm" leftIcon={<FiPlus />} variant="outline" onClick={() => onChange([...value, ''])}>
        Add image
      </Button>
    </Box>
  );
}

function PairsInput({ value, onChange }: { value: Metric[]; onChange: (v: Metric[]) => void }) {
  return (
    <Box>
      {value.map((m, i) => (
        <HStack key={i} mb={2}>
          <Input size="sm" placeholder="Value e.g. +48%" value={m.value} onChange={(e) => onChange(value.map((x, j) => (j === i ? { ...x, value: e.target.value } : x)))} maxW="140px" />
          <Input size="sm" placeholder="Label e.g. Conversion" value={m.label} onChange={(e) => onChange(value.map((x, j) => (j === i ? { ...x, label: e.target.value } : x)))} />
          <IconButton aria-label="Remove" icon={<FiTrash2 />} size="sm" variant="ghost" colorScheme="red" onClick={() => onChange(value.filter((_, j) => j !== i))} />
        </HStack>
      ))}
      <Button size="sm" leftIcon={<FiPlus />} variant="outline" onClick={() => onChange([...value, { label: '', value: '' }])}>
        Add metric
      </Button>
    </Box>
  );
}

function IconPicker({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <SimpleGrid columns={{ base: 6, sm: 9 }} spacing={2}>
      {Object.entries(SERVICE_ICONS).map(([k, I]) => (
        <IconButton
          key={k}
          aria-label={k}
          title={k}
          icon={<I />}
          variant={value === k ? 'solid' : 'outline'}
          colorScheme={value === k ? 'brand' : 'gray'}
          onClick={() => onChange(k)}
        />
      ))}
    </SimpleGrid>
  );
}

export function FieldInput({ field, value, onChange }: { field: FieldDef; value: unknown; onChange: (v: unknown) => void }) {
  const str = (value as string) ?? '';
  let control;
  switch (field.type) {
    case 'textarea':
      control = <Textarea value={str} rows={field.rows ?? 4} placeholder={field.placeholder} onChange={(e) => onChange(e.target.value)} />;
      break;
    case 'number':
      control = (
        <NumberInput value={Number(value ?? 0)} onChange={(_, n) => onChange(Number.isNaN(n) ? 0 : n)}>
          <NumberInputField />
        </NumberInput>
      );
      break;
    case 'slider':
      control = (
        <HStack spacing={4}>
          <Slider value={Number(value ?? 0)} min={0} max={100} onChange={(n) => onChange(n)} colorScheme="brand">
            <SliderTrack>
              <SliderFilledTrack />
            </SliderTrack>
            <SliderThumb />
          </Slider>
          <Text w="48px" textAlign="right" fontWeight="600">
            {Number(value ?? 0)}%
          </Text>
        </HStack>
      );
      break;
    case 'switch':
      control = <Switch isChecked={Boolean(value)} onChange={(e) => onChange(e.target.checked)} size="lg" />;
      break;
    case 'select':
      control = (
        <Select value={str} onChange={(e) => onChange(e.target.value)}>
          {field.options?.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </Select>
      );
      break;
    case 'image':
      control = <ImageInput value={str} onChange={onChange} />;
      break;
    case 'tags':
      control = <TagsInput value={(value as string[]) ?? []} onChange={onChange} placeholder={field.placeholder} />;
      break;
    case 'gallery':
      control = <GalleryInput value={(value as string[]) ?? []} onChange={onChange} />;
      break;
    case 'pairs':
      control = <PairsInput value={(value as Metric[]) ?? []} onChange={onChange} />;
      break;
    case 'icon':
      control = <IconPicker value={str} onChange={onChange} />;
      break;
    case 'color':
      control = (
        <HStack>
          <Input type="color" value={str || '#805AD5'} onChange={(e) => onChange(e.target.value)} w="64px" p={1} />
          <Input value={str} onChange={(e) => onChange(e.target.value)} placeholder="#805AD5" />
        </HStack>
      );
      break;
    default:
      control = <Input value={str} placeholder={field.placeholder} onChange={(e) => onChange(e.target.value)} />;
  }
  return (
    <FormControl isRequired={field.required} gridColumn={field.full || ['textarea', 'gallery', 'pairs', 'image', 'icon', 'tags'].includes(field.type) ? '1 / -1' : undefined}>
      <FormLabel fontSize="sm" fontWeight="600">
        {field.label}
      </FormLabel>
      {control}
      {field.help && <FormHelperText>{field.help}</FormHelperText>}
    </FormControl>
  );
}

export function FieldGrid({ fields, values, onChange }: { fields: FieldDef[]; values: Record<string, unknown>; onChange: (key: string, v: unknown) => void }) {
  return (
    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={5}>
      {fields.map((f) => (
        <FieldInput key={f.key} field={f} value={values[f.key]} onChange={(v) => onChange(f.key, v)} />
      ))}
    </SimpleGrid>
  );
}
