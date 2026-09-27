import { Particle, ParticleType } from "./types";

/**
 * Creates a unique random ID.
 */
function randomId(): string {
  return Math.random().toString(36).substr(2, 9);
}

/**
 * spawns a particle with standard defaults.
 */
export function createParticle(
  type: ParticleType,
  x: number,
  y: number,
  vx: number,
  vy: number,
  size: number,
  color: string,
  maxLife: number,
  extra: Partial<Particle> = {}
): Particle {
  return {
    id: randomId(),
    type,
    x,
    y,
    vx,
    vy,
    size,
    color,
    alpha: 1.0,
    life: maxLife,
    maxLife,
    rotation: extra.rotation ?? 0,
    rotSpeed: extra.rotSpeed ?? 0,
    drag: extra.drag ?? 0.98,
    gravity: extra.gravity ?? 0,
    glow: extra.glow ?? false
  };
}

/**
 * Updates a particle's physical coordinates, alpha fading, and rotations.
 * Returns false if the particle has expired.
 */
export function updateParticle(p: Particle, delta: number): boolean {
  p.life -= delta;
  if (p.life <= 0) return false;

  // Apply friction
  p.vx *= Math.pow(p.drag || 0.98, delta / 16.6);
  p.vy *= Math.pow(p.drag || 0.98, delta / 16.6);

  // Apply gravity
  if (p.gravity) {
    p.vy += p.gravity * (delta / 16.6);
  }

  p.x += p.vx * (delta / 16.6);
  p.y += p.vy * (delta / 16.6);

  if (p.rotation !== undefined && p.rotSpeed) {
    p.rotation += p.rotSpeed * (delta / 16.6);
  }

  // Linear alpha decay
  p.alpha = Math.max(0, p.life / p.maxLife);
  return true;
}

/**
 * Renders an active particle directly on the Canvas.
 */
export function drawParticle(ctx: CanvasRenderingContext2D, p: Particle) {
  ctx.save();
  ctx.globalAlpha = p.alpha;
  ctx.translate(p.x, p.y);

  if (p.rotation) {
    ctx.rotate(p.rotation);
  }

  if (p.glow) {
    ctx.shadowBlur = p.size * 2;
    ctx.shadowColor = p.color;
  }

  ctx.fillStyle = p.color;
  ctx.beginPath();
  
  if (p.type === ParticleType.RESOURCE_PICKUP) {
    // Draw tiny stars or diamonds
    ctx.moveTo(0, -p.size);
    ctx.lineTo(p.size * 0.7, 0);
    ctx.lineTo(0, p.size);
    ctx.lineTo(-p.size * 0.7, 0);
    ctx.closePath();
  } else if (p.type === ParticleType.BOSS_ENTRY || p.type === ParticleType.BOSS_DEFEATED) {
    // Large rings/hexagons
    ctx.arc(0, 0, p.size, 0, Math.PI * 2);
  } else {
    // Round circles for normal hits/damage sparks
    ctx.arc(0, 0, p.size, 0, Math.PI * 2);
  }

  ctx.fill();
  ctx.restore();
}

/**
 * Spawns a batch of particles for a specific trigger.
 */
export function triggerExplosion(
  particles: Particle[],
  maxCap: number,
  type: ParticleType,
  x: number,
  y: number,
  color: string,
  count: number,
  baseSpeed = 2.5
) {
  const currentCount = particles.length;
  if (currentCount >= maxCap) return;

  const toSpawn = Math.min(count, maxCap - currentCount);

  for (let i = 0; i < toSpawn; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = (0.3 + Math.random() * 0.7) * baseSpeed;
    const vx = Math.cos(angle) * speed;
    const vy = Math.sin(angle) * speed;
    const size = 1.5 + Math.random() * 3.5;
    const life = 200 + Math.random() * 500; // ms

    particles.push(
      createParticle(type, x, y, vx, vy, size, color, life, {
        drag: 0.96,
        glow: Math.random() > 0.4
      })
    );
  }
}
