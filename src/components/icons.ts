import type { IconType } from 'react-icons';
import {
  FiLayout, FiUsers, FiSmartphone, FiLayers, FiZap, FiPenTool, FiMonitor, FiCompass, FiBox, FiTrendingUp,
  FiCode, FiEye, FiGrid, FiHeart, FiFeather, FiTarget, FiGlobe,
} from 'react-icons/fi';
import {
  FaDribbble, FaBehance, FaLinkedinIn, FaXTwitter, FaInstagram, FaGithub, FaFigma, FaMedium,
} from 'react-icons/fa6';
import type { SocialPlatform } from '../data/types';

export const SERVICE_ICONS: Record<string, IconType> = {
  layout: FiLayout, users: FiUsers, smartphone: FiSmartphone, layers: FiLayers, zap: FiZap, pen: FiPenTool,
  monitor: FiMonitor, compass: FiCompass, box: FiBox, trending: FiTrendingUp, code: FiCode, eye: FiEye,
  grid: FiGrid, heart: FiHeart, feather: FiFeather, target: FiTarget, globe: FiGlobe,
};

export const SOCIAL_ICONS: Record<SocialPlatform, IconType> = {
  dribbble: FaDribbble, behance: FaBehance, linkedin: FaLinkedinIn, x: FaXTwitter, instagram: FaInstagram,
  github: FaGithub, figma: FaFigma, medium: FaMedium, website: FiGlobe,
};

export const SOCIAL_PLATFORMS = Object.keys(SOCIAL_ICONS) as SocialPlatform[];
