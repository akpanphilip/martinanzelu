import { useState, type FormEvent, type ReactNode } from 'react';
import {
  Box, Button, Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerFooter, DrawerHeader, DrawerOverlay, Flex,
  Heading, HStack, IconButton, Input, InputGroup, InputLeftElement, Menu, MenuButton, MenuItem, MenuList, Stack, Text,
  useToast,
} from '@chakra-ui/react';
import { AnimatePresence } from 'framer-motion';
import { FiArrowDown, FiArrowUp, FiCopy, FiEdit2, FiMoreVertical, FiPlus, FiSearch, FiTrash2 } from 'react-icons/fi';
import { uid } from '../lib/utils';
import { MotionBox } from '../components/motion';
import { FieldGrid, type FieldDef } from './fields';

interface Props<T extends { id: string }> {
  title: string;
  description?: string;
  items: T[];
  onChange: (items: T[]) => void;
  fields: FieldDef[];
  createItem: () => T;
  itemTitle: (item: T) => string;
  itemSubtitle?: (item: T) => string;
  renderThumb?: (item: T) => ReactNode;
  renderBadges?: (item: T) => ReactNode;
  prepare?: (item: T, all: T[]) => T;
  singular?: string;
  searchable?: boolean;
}

export function CollectionEditor<T extends { id: string }>({
  title, description, items, onChange, fields, createItem, itemTitle, itemSubtitle, renderThumb, renderBadges, prepare,
  singular = 'item', searchable = false,
}: Props<T>) {
  const [draft, setDraft] = useState<T | null>(null);
  const [query, setQuery] = useState('');
  const toast = useToast();
  const isNew = draft ? !items.some((i) => i.id === draft.id) : false;

  const move = (index: number, dir: -1 | 1) => {
    const next = [...items];
    const target = index + dir;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  };

  const save = (e: FormEvent) => {
    e.preventDefault();
    if (!draft) return;
    const ready = prepare ? prepare(draft, items) : draft;
    onChange(isNew ? [ready, ...items] : items.map((i) => (i.id === ready.id ? ready : i)));
    toast({ title: isNew ? `${singular} added` : `${singular} updated`, status: 'success', duration: 2000, position: 'bottom-right' });
    setDraft(null);
  };

  const remove = (item: T) => {
    if (!window.confirm(`Delete "${itemTitle(item)}"? This cannot be undone.`)) return;
    onChange(items.filter((i) => i.id !== item.id));
    toast({ title: `${singular} deleted`, status: 'info', duration: 2000, position: 'bottom-right' });
  };

  const duplicate = (item: T) => {
    const copy = prepare ? prepare({ ...structuredClone(item), id: uid() }, items) : { ...structuredClone(item), id: uid() };
    const idx = items.findIndex((i) => i.id === item.id);
    const next = [...items];
    next.splice(idx + 1, 0, copy);
    onChange(next);
  };

  const q = query.toLowerCase();
  const shown = items.filter((i) => !q || `${itemTitle(i)} ${itemSubtitle?.(i) ?? ''}`.toLowerCase().includes(q));

  return (
    <Box>
      <Flex justify="space-between" align={{ base: 'flex-start', sm: 'center' }} direction={{ base: 'column', sm: 'row' }} gap={4} mb={6}>
        <Box>
          <Heading size="md">{title}</Heading>
          {description && (
            <Text color="muted" fontSize="sm" mt={1}>
              {description}
            </Text>
          )}
        </Box>
        <HStack>
          {searchable && (
            <InputGroup size="sm" maxW="220px">
              <InputLeftElement pointerEvents="none" color="muted">
                <FiSearch />
              </InputLeftElement>
              <Input placeholder="Search…" value={query} onChange={(e) => setQuery(e.target.value)} borderRadius="full" />
            </InputGroup>
          )}
          <Button leftIcon={<FiPlus />} onClick={() => setDraft(createItem())} size="sm" flexShrink={0}>
            Add {singular}
          </Button>
        </HStack>
      </Flex>

      <Stack spacing={3}>
        <AnimatePresence initial={false}>
          {shown.map((item) => {
            const index = items.indexOf(item);
            return (
              <MotionBox
                key={item.id}
                layout
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.25 }}
              >
                <Flex
                  align="center"
                  gap={4}
                  p={3}
                  pr={2}
                  borderRadius="xl"
                  bg="surface"
                  border="1px solid"
                  borderColor="border"
                  _hover={{ borderColor: 'brand.400' }}
                  transition="border-color .2s"
                >
                  {renderThumb?.(item)}
                  <Box flex="1" minW={0} cursor="pointer" onClick={() => setDraft(structuredClone(item))}>
                    <HStack spacing={2} mb={0.5} flexWrap="wrap">
                      <Text fontWeight="600" noOfLines={1}>
                        {itemTitle(item) || 'Untitled'}
                      </Text>
                      {renderBadges?.(item)}
                    </HStack>
                    {itemSubtitle && (
                      <Text fontSize="sm" color="muted" noOfLines={1}>
                        {itemSubtitle(item)}
                      </Text>
                    )}
                  </Box>
                  <HStack spacing={0} display={{ base: 'none', md: 'flex' }}>
                    <IconButton aria-label="Move up" icon={<FiArrowUp />} size="sm" variant="ghost" isDisabled={index === 0 || !!q} onClick={() => move(index, -1)} />
                    <IconButton aria-label="Move down" icon={<FiArrowDown />} size="sm" variant="ghost" isDisabled={index === items.length - 1 || !!q} onClick={() => move(index, 1)} />
                    <IconButton aria-label="Edit" icon={<FiEdit2 />} size="sm" variant="ghost" onClick={() => setDraft(structuredClone(item))} />
                  </HStack>
                  <Menu placement="bottom-end">
                    <MenuButton as={IconButton} aria-label="More" icon={<FiMoreVertical />} size="sm" variant="ghost" />
                    <MenuList>
                      <MenuItem icon={<FiEdit2 />} onClick={() => setDraft(structuredClone(item))}>
                        Edit
                      </MenuItem>
                      <MenuItem icon={<FiArrowUp />} isDisabled={index === 0} onClick={() => move(index, -1)}>
                        Move up
                      </MenuItem>
                      <MenuItem icon={<FiArrowDown />} isDisabled={index === items.length - 1} onClick={() => move(index, 1)}>
                        Move down
                      </MenuItem>
                      <MenuItem icon={<FiCopy />} onClick={() => duplicate(item)}>
                        Duplicate
                      </MenuItem>
                      <MenuItem icon={<FiTrash2 />} color="red.400" onClick={() => remove(item)}>
                        Delete
                      </MenuItem>
                    </MenuList>
                  </Menu>
                </Flex>
              </MotionBox>
            );
          })}
        </AnimatePresence>
        {shown.length === 0 && (
          <Box textAlign="center" py={12} borderRadius="xl" border="1px dashed" borderColor="border.strong" color="muted">
            {q ? 'No matches.' : `No ${title.toLowerCase()} yet. Click "Add ${singular}" to create one.`}
          </Box>
        )}
      </Stack>

      <Drawer isOpen={draft !== null} onClose={() => setDraft(null)} size="lg" placement="right">
        <DrawerOverlay backdropFilter="blur(4px)" />
        <DrawerContent bg="bg">
          <Box as="form" onSubmit={save} display="flex" flexDirection="column" h="full" minH={0}>
          <DrawerCloseButton />
          <DrawerHeader borderBottom="1px solid" borderColor="border">
            {isNew ? `New ${singular}` : `Edit ${singular}`}
          </DrawerHeader>
          <DrawerBody py={6}>
            {draft && (
              <FieldGrid
                fields={fields}
                values={draft as unknown as Record<string, unknown>}
                onChange={(k, v) => setDraft((d) => (d ? ({ ...d, [k]: v } as T) : d))}
              />
            )}
          </DrawerBody>
          <DrawerFooter borderTop="1px solid" borderColor="border" gap={3}>
            <Button variant="ghost" colorScheme="gray" onClick={() => setDraft(null)}>
              Cancel
            </Button>
            <Button type="submit">{isNew ? `Create ${singular}` : 'Save changes'}</Button>
          </DrawerFooter>
          </Box>
        </DrawerContent>
      </Drawer>
    </Box>
  );
}
