# MODULE 0B.6 — BOSS VICTORY & REWARDS SYSTEM
**Target Version:** `v0.2.6-blackout-devourer`

This document details the reward distribution, player telemetry aggregation, and permanent visual changes unlocked upon defeating the **Blackout Devourer**.

## 1. Permanent Persistence Flow
When the boss's health reaches 0, the game loop enters the cinematic defeat sequence. Once completed, `commitStats(true)` is triggered:
1. `bossVictories` is incremented in local storage.
2. The current run's duration is compared with `fastestBossVictory` to save the best completion speed.
3. The remaining integrity percentage is evaluated against `bestBossRemainingIntegrity` to log elite defensive performance.
4. Permanent stats are flushed using the standard `saveGameStats` interface.

## 2. Cosmetic First Victory Reward
Defeating the Devourer for the first time registers the `firstVictoryUnlocked` flag in the game session. This unlocks the **ORBI FOTON CHAMPION** cosmetic tier:
- **Golden Core Glow:** Orbi Foton (the amber player leader) receives a magnificent, pulsing golden crown ring drawn directly with high-fidelity canvas shadow blurs.
- **Visual Amplitude:** The golden crown pulses dynamically relative to the standard game loop timestamp (`Math.sin(time * 0.005)`), reflecting cosmic status.

## 3. UI Celebration Badge
On the `ResultScreen` after a victorious run:
- A dedicated **Cosmic Badge Unlocked** panel is displayed using a smooth fade-in animation.
- It features a golden `Award` icon and certifies the player's pilot identifier.
- If it is the user's very first victory of the session, it displays a distinct `🏆 (First Time)` label.
