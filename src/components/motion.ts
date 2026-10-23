import {
  Box, Flex, Heading, Text, Image, SimpleGrid,
  type BoxProps, type FlexProps, type HeadingProps, type TextProps, type ImageProps, type SimpleGridProps,
} from '@chakra-ui/react';
import { motion, type MotionProps } from 'framer-motion';
import type { ForwardRefExoticComponent, RefAttributes } from 'react';

type Motionized<P, E = HTMLDivElement> = ForwardRefExoticComponent<
  Omit<P, keyof MotionProps> & MotionProps & RefAttributes<E>
>;

export const MotionBox = motion(Box) as unknown as Motionized<BoxProps>;
export const MotionFlex = motion(Flex) as unknown as Motionized<FlexProps>;
export const MotionHeading = motion(Heading) as unknown as Motionized<HeadingProps, HTMLHeadingElement>;
export const MotionText = motion(Text) as unknown as Motionized<TextProps, HTMLParagraphElement>;
export const MotionImage = motion(Image) as unknown as Motionized<ImageProps, HTMLImageElement>;
export const MotionGrid = motion(SimpleGrid) as unknown as Motionized<SimpleGridProps>;

export const EASE = [0.22, 1, 0.36, 1] as const;

export type MotionBoxProps = Omit<BoxProps, keyof MotionProps> & MotionProps;
