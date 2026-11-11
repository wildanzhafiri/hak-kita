import {
  BookOpenText,
  Check,
  CircleX,
  Radar,
  Search,
  ShieldCheck,
  Sparkles,
  TriangleAlert,
} from 'lucide-react';
import type { RadarAgentStatus, RadarRunPhase, RadarSourceTone, RadarTone } from './types';

export const RADAR_CONTROLS_ENDPOINT = '/api/admin/radar/controls';

export const RADAR_DISCOVERY_PHASES = ['search', 'read', 'draft', 'check'] as const;

export const RADAR_AGENT_ICONS = {
  search: Search,
  read: BookOpenText,
  draft: Sparkles,
  check: ShieldCheck,
  monitor: Radar,
} as const satisfies Record<RadarRunPhase | 'monitor', unknown>;

export const RADAR_TONE_ICONS = {
  info: Check,
  success: Check,
  warning: TriangleAlert,
  error: CircleX,
} as const satisfies Record<RadarTone, unknown>;

export const RADAR_TONE_CLASSES: Record<RadarTone, string> = {
  info: 'text-[#8a99ad]',
  success: 'text-[#176543]',
  warning: 'text-[#8a580e]',
  error: 'text-[#b72f35]',
};

export const RADAR_AGENT_BADGE_CLASSES: Record<RadarAgentStatus, string> = {
  waiting: 'border-[#dce4ed] bg-white text-[#98a6b8]',
  working: 'border-[#196dcc] bg-[#eef5fc] text-[#196dcc]',
  done: 'border-[#bfe0cd] bg-[#eefaf3] text-[#176543]',
  skipped: 'border-[#ecd9b6] bg-[#fff8ec] text-[#8a580e]',
  failed: 'border-[#f0c7c9] bg-[#fff5f5] text-[#b72f35]',
};

export const RADAR_SOURCE_CLASSES: Record<RadarSourceTone, string> = {
  read: 'border-[#d6e5f5] bg-[#f6faff] text-[#2b4d78]',
  same: 'border-[#e3e9f0] bg-white text-[#64748b]',
  changed: 'border-[#f3cfae] bg-[#fff6ed] text-[#a14d12]',
  failed: 'border-[#f0c7c9] bg-[#fff5f5] text-[#b72f35]',
};

export const RADAR_AGENT_RAIL_CLASSES: Record<RadarAgentStatus, string> = {
  waiting: 'bg-[#e6edf5]',
  working: 'bg-[#bcd5f1]',
  done: 'bg-[#9fd4b5]',
  skipped: 'bg-[#ecd9b6]',
  failed: 'bg-[#f0c7c9]',
};

export const MAX_RADAR_SOURCES = 12;
export const SECONDS_PER_MINUTE = 60;
