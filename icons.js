// Shared icon library for the Kids' Logic Puzzle App shell.
// Each entry is the INNER markup for a 40x40 viewBox SVG, e.g.:
//   <svg viewBox="0 0 40 40">${ICONS['panda']}</svg>
// Colors are hardcoded (not CSS vars) so icons render correctly regardless
// of the shell's own theme. Seeded from the four prototype puzzles built
// before the shell existed (see puzzle-authoring-context.md).

export const ICONS = {
  // --- Animals: Field Day Mystery (Hana) ---
  panda: '<circle cx="20" cy="21" r="13" fill="#fff" stroke="#E2E2E2"/><circle cx="11" cy="10" r="5" fill="#262422"/><circle cx="29" cy="10" r="5" fill="#262422"/><ellipse cx="14" cy="19" rx="3.6" ry="4.6" fill="#262422"/><ellipse cx="26" cy="19" rx="3.6" ry="4.6" fill="#262422"/><circle cx="14.4" cy="20" r="1.3" fill="#fff"/><circle cx="26.4" cy="20" r="1.3" fill="#fff"/><ellipse cx="20" cy="25" rx="2" ry="1.4" fill="#262422"/><path d="M17 27.5 Q20 29.5 23 27.5" stroke="#262422" stroke-width="1.2" fill="none" stroke-linecap="round"/>',
  rabbit: '<ellipse cx="14" cy="8" rx="3" ry="9" fill="#E8D9C8" transform="rotate(-10 14 8)"/><ellipse cx="26" cy="8" rx="3" ry="9" fill="#E8D9C8" transform="rotate(10 26 8)"/><circle cx="20" cy="22" r="13" fill="#F2E6D8"/><circle cx="15" cy="20" r="1.8" fill="#3B3540"/><circle cx="25" cy="20" r="1.8" fill="#3B3540"/>',
  elephant: '<ellipse cx="10" cy="18" rx="7" ry="9" fill="#A9B4BD"/><ellipse cx="30" cy="18" rx="7" ry="9" fill="#A9B4BD"/><ellipse cx="20" cy="20" rx="13" ry="12" fill="#B9C3CB"/><path d="M20 26 Q18 34 22 38" stroke="#B9C3CB" stroke-width="5" fill="none" stroke-linecap="round"/><circle cx="15" cy="18" r="1.6" fill="#2E2630"/><circle cx="25" cy="18" r="1.6" fill="#2E2630"/>',
  otter: '<ellipse cx="20" cy="22" rx="13" ry="12" fill="#8B6A4A"/><ellipse cx="20" cy="26" rx="8" ry="7" fill="#C9AE8C"/><circle cx="12" cy="14" r="4" fill="#8B6A4A"/><circle cx="28" cy="14" r="4" fill="#8B6A4A"/><circle cx="15" cy="20" r="1.6" fill="#2E2630"/><circle cx="25" cy="20" r="1.6" fill="#2E2630"/>',

  // --- Animals: Science Fair Mystery (Hana) ---
  hedgehog: '<ellipse cx="20" cy="24" rx="14" ry="11" fill="#8B6A4A"/><path d="M8 18 L4 8 M12 14 L9 4 M16 12 L15 2 M24 12 L25 2 M28 14 L31 4 M32 18 L36 8" stroke="#5A4530" stroke-width="2" stroke-linecap="round"/><circle cx="14" cy="22" r="1.6" fill="#2A2640"/><circle cx="26" cy="22" r="1.6" fill="#2A2640"/>',
  raccoon: '<ellipse cx="20" cy="22" rx="13" ry="12" fill="#A9A4A0"/><path d="M8 10 L14 18 M32 10 L26 18" stroke="#3B3540" stroke-width="3" stroke-linecap="round"/><ellipse cx="14" cy="20" rx="4" ry="3" fill="#3B3540"/><ellipse cx="26" cy="20" rx="4" ry="3" fill="#3B3540"/><circle cx="14" cy="20" r="1.3" fill="#fff"/><circle cx="26" cy="20" r="1.3" fill="#fff"/>',
  koala: '<ellipse cx="10" cy="16" rx="6" ry="7" fill="#B9B4B0"/><ellipse cx="30" cy="16" rx="6" ry="7" fill="#B9B4B0"/><ellipse cx="20" cy="22" rx="13" ry="12" fill="#C9C4C0"/><ellipse cx="20" cy="26" rx="5" ry="4" fill="#5A4530"/><circle cx="14" cy="18" r="1.6" fill="#2A2640"/><circle cx="26" cy="18" r="1.6" fill="#2A2640"/>',
  fox: '<path d="M20 6 L30 20 L25 34 L15 34 L10 20 Z" fill="#E07A3E"/><path d="M15 34 Q20 30 25 34" fill="#fff"/><circle cx="16" cy="20" r="2" fill="#2A2640"/><circle cx="24" cy="20" r="2" fill="#2A2640"/>',

  // --- Named recurring cast: Dance Studio + Art Studio Mystery (Perry) ---
  'cat-whiskers': '<path d="M12 14 L8 4 L18 10 Z" fill="#D98A3D"/><path d="M28 14 L32 4 L22 10 Z" fill="#D98A3D"/><path d="M12.5 11 L10.5 6 L15.5 9.5 Z" fill="#F2B9C4"/><path d="M27.5 11 L29.5 6 L24.5 9.5 Z" fill="#F2B9C4"/><ellipse cx="20" cy="22" rx="14" ry="12" fill="#D98A3D"/><path d="M15 19.5 Q15 17.5 17 19" stroke="#2E2630" stroke-width="1.3" fill="none" stroke-linecap="round"/><path d="M25 19.5 Q25 17.5 23 19" stroke="#2E2630" stroke-width="1.3" fill="none" stroke-linecap="round"/><path d="M19 24 L21 24 L20 25.6 Z" fill="#F2B9C4"/><path d="M20 25.6 Q17.5 28 15 27" stroke="#2E2630" stroke-width="1.1" fill="none" stroke-linecap="round"/><path d="M20 25.6 Q22.5 28 25 27" stroke="#2E2630" stroke-width="1.1" fill="none" stroke-linecap="round"/><path d="M9 23 L2 21.5 M9 25.5 L2 25.5 M9 28 L2 29.5" stroke="#8A5A26" stroke-width="1" stroke-linecap="round"/><path d="M31 23 L38 21.5 M31 25.5 L38 25.5 M31 28 L38 29.5" stroke="#8A5A26" stroke-width="1" stroke-linecap="round"/>',
  'cat-luna': '<path d="M12 14 L8 4 L18 10 Z" fill="#9AA3AE"/><path d="M28 14 L32 4 L22 10 Z" fill="#9AA3AE"/><ellipse cx="20" cy="22" rx="14" ry="12" fill="#9AA3AE"/><circle cx="15" cy="20" r="1.6" fill="#2E2630"/><circle cx="25" cy="20" r="1.6" fill="#2E2630"/>',
  'cat-oliver': '<path d="M12 14 L8 4 L18 10 Z" fill="#3B3540"/><path d="M28 14 L32 4 L22 10 Z" fill="#3B3540"/><ellipse cx="20" cy="22" rx="14" ry="12" fill="#3B3540"/><circle cx="15" cy="20" r="1.6" fill="#D9D4E0"/><circle cx="25" cy="20" r="1.6" fill="#D9D4E0"/>',
  'cat-bella': '<path d="M12 14 L8 4 L18 10 Z" fill="#E8D9C8"/><path d="M28 14 L32 4 L22 10 Z" fill="#E8D9C8"/><ellipse cx="20" cy="22" rx="14" ry="12" fill="#E8D9C8"/><circle cx="15" cy="20" r="1.6" fill="#2E2630"/><circle cx="25" cy="20" r="1.6" fill="#2E2630"/>',

  // --- Sports: Field Day Mystery ---
  swimming: '<path d="M6 26 Q11 22 16 26 Q21 22 26 26 Q31 22 36 26" stroke="#4F9BD9" stroke-width="3" fill="none" stroke-linecap="round"/><ellipse cx="20" cy="16" rx="10" ry="7" fill="#4F9BD9"/>',
  soccer: '<circle cx="20" cy="20" r="12" fill="#fff" stroke="#22312D" stroke-width="1.5"/><path d="M20 10 L25 15 L23 21 L17 21 L15 15 Z" fill="#22312D"/>',
  gymnastics: '<path d="M10 10 Q20 2 30 10 Q22 20 30 30 Q20 38 10 30 Q18 20 10 10 Z" fill="#E8923C"/>',
  basketball: '<circle cx="20" cy="20" r="12" fill="#D9742E"/><path d="M8 20 L32 20 M20 8 L20 32" stroke="#22312D" stroke-width="1.2"/><path d="M11 11 Q20 20 11 29 M29 11 Q20 20 29 29" stroke="#22312D" stroke-width="1.2" fill="none"/>',

  // --- Experiments: Science Fair Mystery ---
  volcano: '<path d="M14 32 L18 16 L14 16 L22 4 L18 16 L24 16 Z" fill="#D9534F"/><path d="M8 32 L32 32 L28 22 L12 22 Z" fill="#8B6A4A"/>',
  magnets: '<path d="M10 10 A12 12 0 0 1 30 10 L30 20 A10 10 0 0 1 10 20 Z" fill="#5C54A4"/><rect x="7" y="18" width="7" height="8" fill="#B9B4D8"/><rect x="26" y="18" width="7" height="8" fill="#D9534F"/>',
  'plant-growth': '<rect x="17" y="20" width="6" height="14" fill="#8B6A4A"/><path d="M20 20 Q10 18 10 8 Q20 10 20 20 Q30 10 30 8 Q30 18 20 20 Z" fill="#3FA398"/>',
  stargazing: '<rect x="8" y="16" width="20" height="7" rx="3" fill="#5C54A4" transform="rotate(-20 18 19)"/><circle cx="30" cy="12" r="2" fill="#E3A23C"/><circle cx="34" cy="22" r="1.5" fill="#E3A23C"/><circle cx="24" cy="6" r="1.3" fill="#E3A23C"/>',

  // --- Dance styles: Dance Studio Mystery ---
  ballet: '<path d="M14 30 Q10 18 20 14 Q30 18 26 30 Q20 34 14 30 Z" fill="#F2C9D9"/><circle cx="20" cy="12" r="3" fill="#8E4C6B"/>',
  tap: '<rect x="10" y="22" width="20" height="10" rx="4" fill="#2E2630"/><circle cx="14" cy="32" r="2.5" fill="#D9A441"/><circle cx="26" cy="32" r="2.5" fill="#D9A441"/>',
  jazz: '<path d="M12 30 Q10 16 20 16 Q30 16 28 30 Q20 24 12 30 Z" fill="#6E9A7C"/>',
  'hip-hop': '<rect x="9" y="20" width="22" height="11" rx="5" fill="#D9A441"/><rect x="9" y="29" width="22" height="5" rx="2" fill="#fff"/>',

  // --- Instruments: Dance Studio Mystery ---
  piano: '<rect x="8" y="14" width="24" height="14" rx="2" fill="#fff" stroke="#776C7A"/><rect x="10" y="16" width="3" height="10" fill="#2E2630"/><rect x="15" y="16" width="3" height="10" fill="#2E2630"/><rect x="20" y="16" width="3" height="10" fill="#2E2630"/><rect x="25" y="16" width="3" height="10" fill="#2E2630"/>',
  violin: '<ellipse cx="18" cy="26" rx="8" ry="10" fill="#D9A441"/><rect x="16" y="8" width="4" height="14" fill="#8B5E2E"/>',
  drums: '<ellipse cx="20" cy="22" rx="13" ry="9" fill="#8E4C6B"/><line x1="10" y1="10" x2="16" y2="16" stroke="#2E2630" stroke-width="2"/><line x1="30" y1="10" x2="24" y2="16" stroke="#2E2630" stroke-width="2"/>',
  guitar: '<ellipse cx="20" cy="26" rx="10" ry="8" fill="#6E9A7C"/><rect x="18" y="6" width="4" height="16" fill="#8B5E2E"/>',

  // --- Art mediums: Art Studio Mystery ---
  painting: '<ellipse cx="18" cy="22" rx="14" ry="10" fill="#fff" stroke="#7A7064" transform="rotate(-15 18 22)"/><circle cx="12" cy="18" r="3" fill="#D9704C"/><circle cx="20" cy="14" r="3" fill="#D9A441"/><circle cx="26" cy="22" r="3" fill="#4F9BD9"/>',
  sculpture: '<rect x="10" y="20" width="20" height="14" rx="2" fill="#C9AD8C"/><rect x="14" y="10" width="12" height="12" rx="2" fill="#C9AD8C"/>',
  drawing: '<rect x="8" y="8" width="24" height="24" rx="2" fill="#fff" stroke="#7A7064"/><path d="M12 24 L18 16 L22 20 L28 12" stroke="#302A24" stroke-width="2" fill="none"/>',
  collage: '<rect x="8" y="8" width="12" height="10" fill="#D9704C" transform="rotate(-8 14 13)"/><rect x="20" y="14" width="12" height="10" fill="#4F9BD9" transform="rotate(10 26 19)"/><rect x="12" y="22" width="12" height="10" fill="#D9A441" transform="rotate(5 18 27)"/>',

  // --- Generic colors: Art Studio Mystery (reusable for any future "favorite color" category) ---
  red: '<circle cx="20" cy="20" r="13" fill="#D9534F"/>',
  blue: '<circle cx="20" cy="20" r="13" fill="#4F9BD9"/>',
  yellow: '<circle cx="20" cy="20" r="13" fill="#E8A23C"/>',
  green: '<circle cx="20" cy="20" r="13" fill="#6E9A5A"/>'
};
