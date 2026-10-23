import { Box, HStack, Text } from '@chakra-ui/react';
import { useContent } from '../context/ContentContext';
import { Marquee, Orb } from '../components/Effects';

/** Two straight, counter-scrolling bands: tools in large editorial type, services underneath. */
export function ToolsMarquee() {
  const { content } = useContent();
  const tools = content.tools.length ? content.tools : ['Design'];
  const services = content.services.map((s) => s.title);

  return (
    <Box as="section" aria-label="Tools and services" borderY="1px solid" borderColor="border" bg="bg.subtle" overflow="hidden">
      <Box py={{ base: 6, md: 8 }}>
        <Marquee speed={45} pauseOnHover>
          {tools.map((t, i) => (
            <HStack key={`${t}-${i}`} spacing={{ base: 6, md: 10 }} px={{ base: 3, md: 5 }}>
              <Text
                fontFamily="heading"
                fontSize={{ base: '3xl', md: '6xl' }}
                fontWeight="600"
                letterSpacing="-0.03em"
                whiteSpace="nowrap"
                lineHeight="1"
                transition="color .3s"
                {...(i % 2
                  ? { color: 'transparent', sx: { WebkitTextStroke: '1px var(--chakra-colors-muted)' }, _hover: { color: 'accent' } }
                  : { color: 'fg', _hover: { color: 'accent' } })}
              >
                {t}
              </Text>
              <Orb size={{ base: '18px', md: '26px' }} />
            </HStack>
          ))}
        </Marquee>
      </Box>
      {services.length > 0 && (
        <Box py={4} borderTop="1px solid" borderColor="border">
          <Marquee speed={55} reverse>
            {services.map((t, i) => (
              <HStack key={`${t}-${i}`} spacing={6} px={4}>
                <Text fontSize={{ base: 'sm', md: 'md' }} color="muted" whiteSpace="nowrap" textTransform="uppercase" letterSpacing="0.25em" fontWeight="500">
                  {t}
                </Text>
                <Box w="24px" h="1px" bg="border.strong" />
              </HStack>
            ))}
          </Marquee>
        </Box>
      )}
    </Box>
  );
}
