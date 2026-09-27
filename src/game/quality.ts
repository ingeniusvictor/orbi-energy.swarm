import { QualityPreset } from "./types";

export interface QualityConfig {
  maxParticles: number;
  maxStars: number;
  drawNebula: boolean;
  drawPlanets: boolean;
  maxDPR: number;
}

export const QUALITY_PRESETS: Record<QualityPreset, QualityConfig> = {
  [QualityPreset.LOW]: {
    maxParticles: 80,
    maxStars: 50,
    drawNebula: false,
    drawPlanets: false,
    maxDPR: 1.0
  },
  [QualityPreset.MEDIUM]: {
    maxParticles: 250,
    maxStars: 150,
    drawNebula: true,
    drawPlanets: true,
    maxDPR: 1.5
  },
  [QualityPreset.HIGH]: {
    maxParticles: 600,
    maxStars: 300,
    drawNebula: true,
    drawPlanets: true,
    maxDPR: 2.0
  },
  [QualityPreset.ULTRA]: {
    maxParticles: 1200,
    maxStars: 600,
    drawNebula: true,
    drawPlanets: true,
    maxDPR: 2.0
  }
};

export function getQualityConfig(preset: QualityPreset): QualityConfig {
  return QUALITY_PRESETS[preset] || QUALITY_PRESETS[QualityPreset.MEDIUM];
}
