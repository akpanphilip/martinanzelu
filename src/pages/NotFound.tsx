import { Button, Container, Heading, Text, VStack } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import { MotionBox } from '../components/motion';
import { AuroraBackground } from '../components/Effects';

export default function NotFound() {
  return (
    <VStack minH="100vh" justify="center" position="relative" overflow="hidden">
      <AuroraBackground />
      <Container maxW="2xl" textAlign="center" position="relative" zIndex={1}>
        <MotionBox animate={{ y: [0, -20, 0], rotate: [0, 3, -3, 0] }} transition={{ duration: 5, repeat: Infinity }}>
          <Heading fontSize={{ base: '8xl', md: '12rem' }} lineHeight="1" bgGradient="linear(to-r, brand.300, partner.300)" bgClip="text">
            404
          </Heading>
        </MotionBox>
        <Text fontSize="xl" color="muted" my={6}>
          This page wandered off the artboard.
        </Text>
        <Button as={RouterLink} to="/" leftIcon={<FiArrowLeft />} size="lg">
          Back home
        </Button>
      </Container>
    </VStack>
  );
}
