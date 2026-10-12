# ORBI Energy Swarm — Android Packaging

## Certified container decision

ES-12I2 uses **Capacitor 8** as the native Android container. The application packages the local Vite `dist` output and does not define a remote runtime `server.url`. Web/PWA delivery remains independently available through GitHub Pages.

## Stable Android identity

- Application ID: `com.orbiecosystem.energyswarm`
- App name: `ORBI Energy Swarm`
- Minimum SDK: 24
- Compile SDK: 36
- Target SDK: 36
- Phone orientation: `sensorLandscape`

Android 16 large-screen adaptive behavior is intentionally not disabled. The existing responsive viewport system remains authoritative for tablets and other large screens.

## Build commands

- `npm run android:sync` — builds the local web bundle and synchronizes it into the native project.
- `npm run android:debug` — performs sync and builds the debug APK through the checked-in Gradle wrapper.

The permanent Android workflow runs the same debug pipeline on pull requests and canonical `main` changes, then uploads `app-debug.apk` as a CI artifact.

## Signing boundary

No keystore, upload key, signing password or Play credential is committed to the repository. I2 proves deterministic native packaging only. Release signing must be introduced through protected external secrets in a later release-candidate phase.

## Runtime preservation

The Android shell does not own gameplay state and does not alter Campaign, Infinite, H4–H12 systems, FOTON GLB, entity arrays or projectile/enemy budgets. The same compiled web runtime is packaged locally inside the Capacitor container.
