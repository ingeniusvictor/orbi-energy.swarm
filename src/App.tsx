/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import EnergySwarmGame from "./game/EnergySwarmGame";
import { LanguageProvider } from "./i18n";

export default function App() {
  return (
    <LanguageProvider>
      <EnergySwarmGame />
    </LanguageProvider>
  );
}
