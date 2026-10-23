import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Box, type BoxProps, useColorModeValue } from '@chakra-ui/react';
import { keyframes } from '@emotion/react';
import { animate, useInView, useMotionValue, useScroll, useSpring, useTransform } from 'framer-motion';
import { MotionBox, type MotionBoxProps } from './motion';

/** Soft, slowly drifting gradient blobs with a masked grid, used behind hero areas. */
export function AuroraBackground() {
  const gridColor = useColorModeValue('rgba(0,0,0,0.06)', 'rgba(255,255,255,0.05)');
  const blobs = [
    { c: 'brand.500', top: '-10%', left: '-10%', size: '55vw', d: 18 },
    { c: 'partner.500', top: '20%', left: '55%', size: '45vw', d: 22 },
    { c: 'brand.300', top: '60%', left: '10%', size: '35vw', d: 26 },
  ];
  return (
    <Box position="absolute" inset={0} overflow="hidden" pointerEvents="none" zIndex={0}>
      {blobs.map((b, i) => (
        <MotionBox
          key={i}
          position="absolute"
          top={b.top}
          left={b.left}
          w={b.size}
          h={b.size}
          maxW="900px"
          maxH="900px"
          borderRadius="full"
          bg={b.c}
          opacity={0.22}
          filter="blur(110px)"
          animate={{ x: [0, 80, -60, 0], y: [0, -60, 50, 0], scale: [1, 1.15, 0.9, 1] }}
          transition={{ duration: b.d, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
      <Box
        position="absolute"
        inset={0}
        backgroundImage={`linear-gradient(${gridColor} 1px, transparent 1px), linear-gradient(90deg, ${gridColor} 1px, transparent 1px)`}
        backgroundSize="64px 64px"
        sx={{ maskImage: 'radial-gradient(ellipse at center, black 20%, transparent 75%)' }}
      />
    </Box>
  );
}

/** Thin gradient bar at the top showing scroll progress. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 25, mass: 0.3 });
  return (
    <MotionBox
      position="fixed"
      top={0}
      left={0}
      right={0}
      h="3px"
      zIndex={2000}
      bgGradient="linear(to-r, fill.a, fill.b)"
      style={{ scaleX, transformOrigin: '0%' }}
    />
  );
}

/** Animated number counter that runs once when scrolled into view. */
export function CountUp({ value, suffix = '', duration = 2 }: { value: number; suffix?: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, value, {
      duration,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, value, duration]);
  return (
    <span ref={ref}>
      {display}
      {suffix}
    </span>
  );
}

/** Pulls its child gently towards the pointer. */
export function Magnetic({ children, strength = 0.35, ...rest }: { children: ReactNode; strength?: number } & Omit<MotionBoxProps, 'children'>) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 15, mass: 0.2 });
  const sy = useSpring(y, { stiffness: 200, damping: 15, mass: 0.2 });
  return (
    <MotionBox
      ref={ref}
      display="inline-block"
      style={{ x: sx, y: sy }}
      onMouseMove={(e: React.MouseEvent) => {
        const r = ref.current?.getBoundingClientRect();
        if (!r) return;
        x.set((e.clientX - (r.left + r.width / 2)) * strength);
        y.set((e.clientY - (r.top + r.height / 2)) * strength);
      }}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
      {...rest}
    >
      {children}
    </MotionBox>
  );
}

/** Card that tilts in 3D following the pointer, with a moving glare. */
export function TiltCard({ children, max = 10, ...rest }: { children: ReactNode; max?: number } & Omit<MotionBoxProps, 'children'>) {
  const ref = useRef<HTMLDivElement>(null);
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const rx = useSpring(useTransform(py, [0, 1], [max, -max]), { stiffness: 150, damping: 15 });
  const ry = useSpring(useTransform(px, [0, 1], [-max, max]), { stiffness: 150, damping: 15 });
  const glareX = useTransform(px, [0, 1], ['0%', '100%']);
  const glareY = useTransform(py, [0, 1], ['0%', '100%']);
  const glare = useTransform(
    [glareX, glareY],
    ([gx, gy]) => `radial-gradient(circle at ${gx} ${gy}, rgba(255,255,255,0.18), transparent 55%)`,
  );
  return (
    <MotionBox
      ref={ref}
      position="relative"
      style={{ rotateX: rx, rotateY: ry, transformPerspective: 1000 }}
      onMouseMove={(e: React.MouseEvent) => {
        const r = ref.current?.getBoundingClientRect();
        if (!r) return;
        px.set((e.clientX - r.left) / r.width);
        py.set((e.clientY - r.top) / r.height);
      }}
      onMouseLeave={() => {
        px.set(0.5);
        py.set(0.5);
      }}
      {...rest}
    >
      {children}
      <MotionBox position="absolute" inset={0} borderRadius="inherit" pointerEvents="none" zIndex={3} style={{ background: glare }} />
    </MotionBox>
  );
}

const scrollX = keyframes`from { transform: translate3d(0,0,0); } to { transform: translate3d(-50%,0,0); }`;
const scrollY = keyframes`from { transform: translate3d(0,0,0); } to { transform: translate3d(0,-50%,0); }`;

/** Infinite horizontal marquee (pure CSS, pauses on hover when pauseOnHover is set). */
export function Marquee({
  children, speed = 30, reverse = false, pauseOnHover = false,
}: { children: ReactNode; speed?: number; reverse?: boolean; pauseOnHover?: boolean }) {
  return (
    <Box
      overflow="hidden"
      w="full"
      role="group"
      sx={{ maskImage: 'linear-gradient(90deg, transparent, black 8%, black 92%, transparent)' }}
    >
      <Box
        display="flex"
        w="max-content"
        animation={`${scrollX} ${speed}s linear infinite ${reverse ? 'reverse' : 'normal'}`}
        _groupHover={pauseOnHover ? { animationPlayState: 'paused' } : undefined}
        sx={{ '@media (prefers-reduced-motion: reduce)': { animation: 'none' } }}
      >
        <Box display="flex">{children}</Box>
        <Box display="flex" aria-hidden>
          {children}
        </Box>
      </Box>
    </Box>
  );
}

/** Infinite vertical marquee column with soft faded edges. Pauses on hover. */
export function VerticalMarquee({
  children, speed = 40, reverse = false, height = '640px', gap = 5, offset = 0,
}: { children: ReactNode; speed?: number; reverse?: boolean; height?: string | Record<string, string>; gap?: number; offset?: number }) {
  return (
    <Box
      h={height}
      overflow="hidden"
      role="group"
      sx={{ maskImage: 'linear-gradient(to bottom, transparent, black 14%, black 86%, transparent)' }}
    >
      <Box
        display="flex"
        flexDirection="column"
        animation={`${scrollY} ${speed}s linear ${-offset * speed}s infinite ${reverse ? 'reverse' : 'normal'}`}
        _groupHover={{ animationPlayState: 'paused' }}
        sx={{ '@media (prefers-reduced-motion: reduce)': { animation: 'none' } }}
      >
        <Box display="flex" flexDirection="column" gap={gap} pb={gap}>
          {children}
        </Box>
        <Box display="flex" flexDirection="column" gap={gap} pb={gap} aria-hidden>
          {children}
        </Box>
      </Box>
    </Box>
  );
}

/** A small glossy gradient sphere with a slowly turning core — the site's signature glyph. */
export function Orb({ size = '0.55em' }: { size?: BoxProps['w'] }) {
  return (
    <Box
      as="span"
      display="inline-block"
      position="relative"
      w={size}
      h={size}
      flexShrink={0}
      borderRadius="full"
      overflow="hidden"
      verticalAlign="middle"
      boxShadow="0 0 0.9em -0.1em var(--chakra-colors-brand-400)"
    >
      <MotionBox
        as="span"
        position="absolute"
        inset="-25%"
        bg="conic-gradient(from 0deg, var(--chakra-colors-brand-200), var(--chakra-colors-partner-400), var(--chakra-colors-brand-600), var(--chakra-colors-partner-300), var(--chakra-colors-brand-200))"
        animate={{ rotate: 360 }}
        transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
      />
      <Box
        as="span"
        position="absolute"
        inset={0}
        borderRadius="full"
        bg="radial-gradient(circle at 30% 28%, rgba(255,255,255,0.85), rgba(255,255,255,0) 38%), radial-gradient(circle at 70% 80%, rgba(0,0,0,0.35), transparent 55%)"
      />
    </Box>
  );
}

/** Card with a soft spotlight that follows the pointer. */
export function SpotlightCard({ children, ...rest }: { children: ReactNode } & BoxProps) {
  const ref = useRef<HTMLDivElement>(null);
  const spot = useColorModeValue(
    'color-mix(in srgb, var(--chakra-colors-brand-500) 12%, transparent)',
    'color-mix(in srgb, var(--chakra-colors-brand-300) 12%, transparent)',
  );
  return (
    <Box
      ref={ref}
      position="relative"
      overflow="hidden"
      onMouseMove={(e) => {
        const r = ref.current?.getBoundingClientRect();
        if (!r || !ref.current) return;
        ref.current.style.setProperty('--mx', `${e.clientX - r.left}px`);
        ref.current.style.setProperty('--my', `${e.clientY - r.top}px`);
      }}
      _before={{
        content: '""',
        position: 'absolute',
        inset: 0,
        opacity: 0,
        transition: 'opacity .4s',
        background: `radial-gradient(400px circle at var(--mx) var(--my), ${spot}, transparent 40%)`,
        pointerEvents: 'none',
      }}
      _hover={{ _before: { opacity: 1 } }}
      {...rest}
    >
      {children}
    </Box>
  );
}
