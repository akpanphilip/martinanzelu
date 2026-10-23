import { Box, Heading, HStack, Text } from '@chakra-ui/react';
import { Reveal, SplitText } from './Reveal';

interface Props {
  eyebrow: string;
  title: string;
  highlight?: string;
  description?: string;
  align?: 'left' | 'center';
}

export function SectionHeading({ eyebrow, title, highlight, description, align = 'left' }: Props) {
  const center = align === 'center';
  return (
    <Box textAlign={align} mb={{ base: 10, md: 16 }} maxW={center ? '3xl' : '4xl'} mx={center ? 'auto' : undefined}>
      <Reveal y={20}>
        <HStack spacing={3} justify={center ? 'center' : 'flex-start'} mb={4}>
          <Box w="32px" h="2px" bgGradient="linear(to-r, fill.a, fill.b)" />
          <Text textTransform="uppercase" letterSpacing="0.25em" fontSize="xs" fontWeight="600" color="accent">
            {eyebrow}
          </Text>
        </HStack>
      </Reveal>
      <Heading fontSize={{ base: '4xl', md: '6xl' }} lineHeight="1.05">
        <SplitText text={title} inView />{' '}
        {highlight && (
          <Box as="span" bgGradient="linear(to-r, ink.a, ink.b)" bgClip="text">
            <SplitText text={highlight} inView delay={0.15} />
          </Box>
        )}
      </Heading>
      {description && (
        <Reveal delay={0.2} y={20}>
          <Text mt={5} fontSize={{ base: 'md', md: 'lg' }} color="muted" maxW="2xl" mx={center ? 'auto' : undefined}>
            {description}
          </Text>
        </Reveal>
      )}
    </Box>
  );
}
