import { useEffect, useState } from 'react';
import { Box, Text } from '@chakra-ui/react';
import { AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
import { MotionBox } from './motion';

/** Dot + trailing ring cursor. Grows over links; shows a label over elements with data-cursor="Label". */
export function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const [hover, setHover] = useState(false);
  const [label, setLabel] = useState('');
  const [hidden, setHidden] = useState(true);
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const rx = useSpring(x, { stiffness: 350, damping: 30, mass: 0.5 });
  const ry = useSpring(y, { stiffness: 350, damping: 30, mass: 0.5 });

  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)').matches;
    setEnabled(fine);
    if (!fine) return;
    const move = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      setHidden(false);
    };
    const over = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      const labelled = t.closest<HTMLElement>('[data-cursor]');
      setLabel(labelled?.dataset.cursor ?? '');
      setHover(Boolean(labelled || t.closest('a, button, [role="button"], input, textarea, select, label')));
    };
    const leave = () => setHidden(true);
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseover', over);
    document.addEventListener('mouseleave', leave);
    document.documentElement.classList.add('has-custom-cursor');
    return () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseover', over);
      document.removeEventListener('mouseleave', leave);
      document.documentElement.classList.remove('has-custom-cursor');
    };
  }, [x, y]);

  if (!enabled) return null;
  const size = label ? 96 : hover ? 56 : 36;

  return (
    <Box pointerEvents="none" position="fixed" inset={0} zIndex={3000} opacity={hidden ? 0 : 1} transition="opacity .3s">
      <MotionBox
        position="fixed"
        top={0}
        left={0}
        style={{ x, y }}
        w="6px"
        h="6px"
        ml="-3px"
        mt="-3px"
        borderRadius="full"
        bg="accent"
        opacity={label ? 0 : 1}
      />
      <MotionBox
        position="fixed"
        top={0}
        left={0}
        style={{ x: rx, y: ry }}
        animate={{ width: size, height: size, marginLeft: -size / 2, marginTop: -size / 2 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        borderRadius="full"
        border="1.5px solid"
        borderColor="accent"
        bg={label ? 'fill.a' : hover ? 'color-mix(in srgb, var(--chakra-colors-brand-300) 14%, transparent)' : 'transparent'}
        display="flex"
        alignItems="center"
        justifyContent="center"
        backdropFilter={hover ? 'blur(2px)' : undefined}
      >
        <AnimatePresence>
          {label && (
            <MotionBox initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
              <Text fontSize="xs" fontWeight="700" color="onFill" textTransform="uppercase" letterSpacing="0.1em">
                {label}
              </Text>
            </MotionBox>
          )}
        </AnimatePresence>
      </MotionBox>
    </Box>
  );
}
