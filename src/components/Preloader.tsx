import { useEffect, useState } from 'react';
import { Box, Flex, Heading, Text } from '@chakra-ui/react';
import { animate } from 'framer-motion';
import { MotionBox, EASE } from './motion';

export function Preloader({ name, onDone }: { name: string; onDone: () => void }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const controls = animate(0, 100, {
      duration: 1.8,
      ease: [0.65, 0, 0.35, 1],
      onUpdate: (v) => setCount(Math.round(v)),
      onComplete: () => setTimeout(onDone, 250),
    });
    return () => controls.stop();
  }, [onDone]);

  return (
    <MotionBox
      position="fixed"
      inset={0}
      zIndex={5000}
      bg="#07070d"
      color="white"
      exit={{ y: '-100%', borderBottomLeftRadius: '50%', borderBottomRightRadius: '50%' }}
      transition={{ duration: 1, ease: EASE }}
    >
      <Flex direction="column" h="full" justify="space-between" p={{ base: 6, md: 12 }}>
        <MotionBox initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <Text letterSpacing="0.3em" textTransform="uppercase" fontSize="xs" color="whiteAlpha.700">
            Portfolio · {new Date().getFullYear()}
          </Text>
        </MotionBox>
        <Box overflow="hidden">
          <MotionBox initial={{ y: '100%' }} animate={{ y: 0 }} transition={{ duration: 1, ease: EASE }}>
            <Heading fontSize={{ base: '5xl', md: '8xl' }} bgGradient="linear(to-r, brand.200, partner.300)" bgClip="text">
              {name}
            </Heading>
          </MotionBox>
        </Box>
        <Flex justify="space-between" align="flex-end">
          <Box w={{ base: '50%', md: '30%' }} h="2px" bg="whiteAlpha.200" position="relative" overflow="hidden" mb={4}>
            <Box position="absolute" inset={0} w={`${count}%`} bgGradient="linear(to-r, brand.400, partner.400)" />
          </Box>
          <Heading fontSize={{ base: '6xl', md: '9xl' }} fontWeight="700" lineHeight="1" sx={{ fontVariantNumeric: 'tabular-nums' }}>
            {count}
            <Box as="span" fontSize="0.4em" color="brand.300">
              %
            </Box>
          </Heading>
        </Flex>
      </Flex>
    </MotionBox>
  );
}
