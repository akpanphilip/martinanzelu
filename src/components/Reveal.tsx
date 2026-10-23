import type { ReactNode } from 'react';
import { Box } from '@chakra-ui/react';
import { MotionBox, EASE, type MotionBoxProps } from './motion';

interface RevealProps extends Omit<MotionBoxProps, 'children'> {
  children: ReactNode;
  delay?: number;
  y?: number;
  x?: number;
  scale?: number;
  once?: boolean;
}

/** Fades and slides children in when they scroll into view. */
export function Reveal({ children, delay = 0, y = 40, x = 0, scale = 1, once = true, ...rest }: RevealProps) {
  return (
    <MotionBox
      initial={{ opacity: 0, y, x, scale, filter: 'blur(6px)' }}
      whileInView={{ opacity: 1, y: 0, x: 0, scale: 1, filter: 'blur(0px)' }}
      viewport={{ once, margin: '-80px' }}
      transition={{ duration: 0.9, delay, ease: EASE }}
      {...rest}
    >
      {children}
    </MotionBox>
  );
}

/** Splits text into words that slide up from a mask, one after another. */
export function SplitText({
  text, delay = 0, stagger = 0.06, inView = false,
}: { text: string; delay?: number; stagger?: number; inView?: boolean }) {
  const words = text.split(' ');
  return (
    <>
      {words.map((w, i) => (
        <Box as="span" key={`${w}-${i}`} display="inline-block" overflow="hidden" verticalAlign="top" pb="0.08em">
          <MotionBox
            as="span"
            display="inline-block"
            initial={{ y: '110%', rotate: 4 }}
            {...(inView
              ? { whileInView: { y: '0%', rotate: 0 }, viewport: { once: true } }
              : { animate: { y: '0%', rotate: 0 } })}
            transition={{ duration: 0.9, delay: delay + i * stagger, ease: EASE }}
          >
            {w}
            {i < words.length - 1 ? ' ' : ''}
          </MotionBox>
        </Box>
      ))}
    </>
  );
}
