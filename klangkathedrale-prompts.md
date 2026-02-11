# Klangkathedrale — Prompt-Bibliothek
## Helmuth Rilling Digital Memorial: Design & Implementation Prompts

*Jeder Prompt ist sofort einsetzbar. Kopiere einen Prompt in einen neuen Claude-Chat, zusammen mit der aktuellen `klangkathedrale.html` als Kontext.*

---

## 🎵 I. IMMERSIVE AUDIO EXPERIENCES

---

### Prompt 1: Web Audio API — Interactive Bach Organ

```
You are building a sacred digital experience. I have a memorial website for Helmuth Rilling
(1933–2026), the legendary Bach conductor. The file "klangkathedrale.html" is attached.

Your task: Add a fully functional Web Audio API synthesizer that creates a REAL-TIME
interactive organ experience. This is the centerpiece interaction of the memorial.

REQUIREMENTS:
1. Create a floating "Orgel" (Organ) button that opens a full-screen overlay
2. The overlay shows a visual organ keyboard (2 octaves, C3–C5) playable by:
   - Mouse/touch on the visual keys
   - Computer keyboard mapping (A=C, W=C#, S=D, E=D#, D=E, F=F, T=F#, G=G, Y=G#, H=A, U=A#, J=B, K=C5)
3. Use Web Audio API OscillatorNodes to simulate organ pipes:
   - Layer 3 oscillators per note (fundamental + octave + fifth) for rich organ timbre
   - Add subtle reverb using ConvolverNode (generate impulse response procedurally)
   - ADSR envelope: slow attack (0.1s), full sustain, gentle release (0.5s)
4. Include 3 "stops" (organ register switches) the user can toggle:
   - Prinzipal 8' (fundamental)
   - Oktave 4' (one octave up)
   - Mixtur (adds the fifth)
5. Pre-program a "Play Bach" button that auto-plays the opening measures of:
   - Toccata and Fugue in D minor (BWV 565) — the iconic da-da-da-DAAA
   - Use setTimeout chains for timing, with visual key highlighting
6. Visual design must match the memorial aesthetic:
   - Dark background with gold accents
   - Keys styled as organ pipes (tall, narrow, gold-bordered)
   - Warm glow effect on active keys
   - Cathedral-like reverb ambiance
   - Bodoni Moda + Cormorant Garamond fonts

TECHNICAL: Everything must be in a single HTML file. No external audio files.
Use only Web Audio API for sound generation. Must work on mobile (touch events).

The goal: Someone who has never played an instrument should feel the wonder of Bach's
organ music through their own fingers. Make it magical.
```

---

### Prompt 2: Generative Ambient Soundscape

```
I have a memorial website for Helmuth Rilling, the Bach conductor. I want to add a subtle,
always-on generative ambient soundscape that enhances the contemplative atmosphere.

Create a JavaScript module (embeddable in a single HTML file) that:

1. AMBIENT LAYER: Generates a continuous, evolving pad using Web Audio API
   - Slowly shifting between notes of a B-minor chord (Bach's key of choice)
   - Use 4 detuned sine waves with slow LFO modulation
   - Volume should be very quiet (0.03-0.06) — barely perceptible
   - Crossfade between chord tones every 15-20 seconds

2. CATHEDRAL RESONANCE: Simulate the acoustic space
   - Procedurally generate a reverb impulse response (2-3 second decay)
   - Apply to all sounds for a "large stone room" feeling

3. SCROLL-REACTIVE ELEMENTS:
   - As user scrolls through different sections, subtly shift the harmonic base:
     * Overture → B minor (contemplation)
     * Das Leben → D major (warmth, life)
     * Das Werk → G major (grandeur)
     * Die Zeitreise → E minor (journey, searching)
     * Die Welt → C major (openness, universality)
     * Einladung → F major (tenderness, invitation)
     * Coda → B minor returning to unison B (resolution, peace)
   - Transitions should take 8-10 seconds, imperceptible

4. INTERACTION SOUNDS:
   - When hovering over the 172 CD dots: soft pizzicato pluck (synthesized)
   - When clicking timeline events: gentle bell tone
   - When entering the Coda section: a single, long organ tone fading in

5. USER CONTROL:
   - Small, elegant speaker icon (gold, bottom-left corner)
   - Click to toggle sound on/off
   - Default: OFF (respect user, require opt-in)
   - Tooltip: "Klangkathedrale erleben" / "Experience the Sound Cathedral"

AESTHETIC: The sound should feel like entering a real cathedral — you sense the space
before you hear anything specific. It should never feel intrusive, always sacred.

Technical: Pure Web Audio API synthesis. No audio files. Single HTML file.
```

---

## 🏛️ II. 3D & SPATIAL EXPERIENCES

---

### Prompt 3: Three.js Cathedral Walk-Through

```
Create a Three.js 3D cathedral interior that serves as an immersive memorial for
Helmuth Rilling. This should be a separate HTML page linked from the main memorial.

THE VISION: The user walks through a virtual gothic cathedral. Along the walls are
"stained glass windows" — each one representing a chapter of Rilling's life. At the
far end, a massive organ with animated pipes.

ARCHITECTURE:
1. Gothic nave: 80m long, 25m wide, 40m high
   - Pointed arches, ribbed vaulting (use cylinder geometry for ribs)
   - Two rows of columns (cylinder geometry, stone texture via procedural shader)
   - Checkered floor (alternating dark/light stone tiles)

2. STAINED GLASS WINDOWS (6 along each side wall):
   - Use PlaneGeometry with emissive materials
   - Each window has a warm colored glow (golds, reds, blues)
   - Content panels floating in front of each window with:
     Left side: 1933, 1954, 1965, 1967, 1970, 1981
     Right side: 1985, 2000, 2001, 2011, 2014, 2026
   - When player approaches a window, text fades in describing that era

3. THE ORGAN (far wall):
   - Array of cylinders arranged as organ pipes (varying heights)
   - Gold/bronze metallic material
   - Subtle animation: pipes gently oscillate in height (breathing effect)
   - Point light source behind the organ creating a golden halo

4. ATMOSPHERIC EFFECTS:
   - Volumetric light rays through windows (use transparent planes with gradient)
   - Particle dust floating in the air (Points geometry with slow drift)
   - Fog (exponential, starting at 40m)
   - Ambient occlusion feeling through careful lighting

5. NAVIGATION:
   - WASD + mouse look (PointerLockControls)
   - OR: Auto-guided walk (click "Führung" button for guided tour)
   - Guided tour slowly moves camera through nave, pausing at each window
   - Mobile: touch joystick + gyroscope look

6. AUDIO (optional, Web Audio):
   - Footstep sounds (filtered noise bursts) with cathedral reverb
   - Ambient organ drone that gets louder as you approach the altar end

DESIGN CONSTRAINTS:
- Must run at 60fps on mid-range devices
- Use only Three.js (r128 from CDN)
- Procedural textures (no external image files)
- Single HTML file
- Color palette: stone grays, warm golds, deep cathedral blues
- Text in Cormorant Garamond font (loaded from Google Fonts)

This should feel like a sacred pilgrimage through one man's life in music.
```

---

### Prompt 4: Particle Universe — 172 CDs as Star Constellation

```
Transform the "172 CDs" visualization in the Rilling memorial into a full-screen
THREE.js particle universe. Each of the 172 recordings becomes a star in a constellation.

CONCEPT: "Das Bachsche Universum" — The Bach Universe

1. PARTICLE SYSTEM:
   - 172 primary particles (one per CD), plus 2000 background stars
   - Primary particles are larger (varying size by work importance), with glow
   - Color-coded by category:
     * Cantatas: warm gold (#C9A84C)
     * Passions: deep red (#D4725C)
     * Oratorios: forest green (#6B9080)
     * Masses: royal purple (#8B7EC8)
     * Instrumental: amber (#C8956E)
     * Organ works: steel blue (#7BA0B8)

2. SPATIAL ARRANGEMENT:
   - Cantatas form a spiral galaxy arm (they are the core of Bach's work)
   - Passions cluster at the galactic center (brightest, largest)
   - Other categories orbit at different radii
   - The whole system slowly rotates (0.001 rad/frame)

3. INTERACTION:
   - Mouse/touch orbit controls (rotate, zoom, pan)
   - Hover on any star: it pulses, a line connects to related works, and a
     tooltip shows: BWV number, title, recording year, and a one-line description
   - Click on a star: expands into a "detail view" showing the CD cover art
     area (a generated geometric pattern, not a real image), tracklist, and
     a YouTube search link
   - "Constellation mode": toggle that draws lines between related works
     (e.g., all cantatas for a liturgical season, the 6 Brandenburg Concertos)

4. SEARCH/FILTER:
   - Floating search bar (top) — type to filter (e.g., "BWV 244" or "Kantate")
   - Category filter buttons that fade non-matching stars
   - "Highlight path": show Rilling's recording chronology as a golden thread
     connecting stars in the order they were recorded (1970–2000)

5. CINEMATIC MOMENTS:
   - On load: camera flies in from far away, stars appearing one by one
   - "Tour" button: camera auto-navigates to notable works with narration panels
   - When idle for 30 seconds: gentle camera drift like a planetarium screensaver

TECHNICAL: Three.js r128, Points/BufferGeometry for performance, custom shaders
for glow effects, Raycaster for interaction. Single HTML file. 60fps target.
```

---

## 📜 III. INTERACTIVE CONTENT EXPERIENCES

---

### Prompt 5: Interactive Score Viewer — Animated Bach Notation

```
Create a beautiful, interactive music score visualization for the Rilling memorial.
The user sees animated musical notation being "written" in real-time, as if Bach's
pen is composing before their eyes.

CONCEPT: "Bachs Feder" (Bach's Quill)

1. SCORE RENDERING (SVG-based, no external libraries):
   - Draw a grand staff (treble + bass clef) using SVG paths
   - Render the opening 8 measures of the "Air on the G String" (BWV 1068)
   - Notes should be hand-drawn style (slight imperfections, organic curves)
   - Staff lines are warm sepia/gold color on dark background

2. ANIMATION:
   - Notes appear one by one, left to right, with an "ink flowing" animation
   - Each note starts as a dot and "blooms" into its full shape
   - Stems and beams draw themselves with a quill-stroke animation
   - Bar lines sweep down gracefully
   - The whole sequence takes about 30 seconds

3. AUDIO SYNC (Web Audio API):
   - As each note appears, play the corresponding pitch
   - Use a warm sine+triangle wave blend (simulating a gentle string sound)
   - Reverb for cathedral ambiance
   - Notes sustain and overlap naturally

4. INTERACTION:
   - User can hover over any note to hear it individually
   - A "Tempo" slider to speed up or slow down the animation
   - "Replay" button with a quill icon
   - Toggle between 3 pieces:
     * Air on the G String (BWV 1068)
     * Jesu, Joy of Man's Desiring (BWV 147)
     * Opening of the B Minor Mass (BWV 232)

5. EDUCATIONAL LAYER:
   - Below the score, show real-time analysis:
     * Current key and chord (in German: "h-Moll, Tonika")
     * Voice leading arrows
     * "Did you know?" facts about the piece and Rilling's interpretation
   - Toggle this layer on/off

DESIGN: Parchment-dark aesthetic. The score area should feel like a precious
manuscript under glass in a museum. Gold illuminated initial letters.
Cormorant Garamond for all text. Single HTML file.
```

---

### Prompt 6: "Entdecke Bach" — AI-Powered Recommendation Engine

```
Build a React artifact that is an AI-powered "Discover Bach" experience for the
Rilling memorial. It uses the Anthropic API (Claude Sonnet) to create personalized
Bach listening journeys.

CONCEPT: "Entdecke Bach mit Rilling" — A personal guide to Bach's music

1. ONBOARDING (3 questions, one at a time, elegant transitions):
   Q1: "Wie fühlen Sie sich gerade?" (How are you feeling?)
       Options: Friedlich (Peaceful) / Energiegeladen (Energized) /
                Nachdenklich (Contemplative) / Traurig (Sad) / Neugierig (Curious)

   Q2: "Kennen Sie klassische Musik?" (Do you know classical music?)
       Options: Neuling (Newcomer) / Etwas (A little) /
                Kenner (Connoisseur) / Musiker (Musician)

   Q3: "Was berührt Sie in Kunst?" (What moves you in art?)
       Options: Schönheit (Beauty) / Drama / Tiefe (Depth) /
                Virtuosität (Virtuosity) / Stille (Silence)

2. API CALL: Send the 3 answers to Claude Sonnet with this system prompt:
   "You are a knowledgeable, warm guide to Johann Sebastian Bach's music, speaking
   in the spirit of Helmuth Rilling — who believed music must 'startle people and
   reach deep inside them.' Based on the listener's mood, experience level, and
   aesthetic preference, recommend exactly 3 Bach works. For each, provide:
   - BWV number and German title
   - A poetic one-sentence description (in German)
   - Why this piece matches their current state (2 sentences, German)
   - A suggested Rilling recording if one exists
   - Listening tip (1 sentence)
   Respond ONLY in JSON format with an array of 3 objects."

3. RESULTS DISPLAY:
   - 3 cards animate in with staggered delays
   - Each card has: BWV number (gold, small), title (large, italic),
     description, personal note, and a "Anhören" (Listen) button
   - "Anhören" links to YouTube search for "Rilling + [work title]"
   - Below cards: "Neue Reise beginnen" (Start new journey) button

4. BONUS — DEEP DIVE MODE:
   - Each card has a "Mehr erfahren" (Learn more) expandable section
   - On expand, makes another API call asking Claude to explain:
     * The historical context of when Bach composed this
     * What makes Rilling's interpretation special
     * How to listen actively (what to pay attention to)
   - Display as elegant prose, not bullet points

5. DESIGN:
   - Dark background (#1A1410), gold accents (#C9A84C)
   - Bodoni Moda for headings, Cormorant Garamond for body
   - Smooth crossfade transitions between states
   - Loading state: animated musical notes
   - No generic UI — every element should feel hand-crafted and sacred
   - Cards have subtle border glow on hover
   - Use Tailwind for layout, custom CSS for the aesthetic

This should feel like having a private audience with a wise music professor
who knows exactly what your soul needs to hear right now.
```

---

## 🌍 IV. DATA VISUALIZATION & MAPPING

---

### Prompt 7: Interactive World Map — Rilling's Global Footprint

```
Create an interactive SVG world map for the Rilling memorial showing every city
where he conducted, taught, or founded an institution.

CONCEPT: "Die Musik kennt keine Grenzen" (Music knows no borders)

1. MAP BASE:
   - Simplified world map SVG (Natural Earth projection)
   - Dark fill (#1A1410), gold country borders (rgba(201,168,76,0.1))
   - No country labels — the map is a canvas for Rilling's journeys

2. LOCATION MARKERS (30+ cities):
   Primary (large pulsing gold dots):
   - Stuttgart (Bachakademie, Gächinger Kantorei, Bach-Collegium)
   - Eugene, Oregon (Oregon Bach Festival, 1970–2013)
   - Frankfurt (Professor, 1965–1985)

   Secondary (medium gold dots):
   - New York (Bernstein study 1967, NY Philharmonic)
   - Vienna (Wiener Philharmoniker)
   - Tel Aviv (Israel Philharmonic, 100+ concerts)
   - Tokyo (NHK Symphony)
   - Rome (Studies with Germani)
   - Siena (Accademia Chigiana)

   Tertiary (small dots):
   - Moscow, St. Petersburg, Buenos Aires, Caracas, Kraków, Toronto,
     Beijing, Taipei, Hong Kong, Madrid, Budapest, Warsaw, London,
     Berlin, Spandau, Weimar, Baden-Baden, plus any others from research

3. CONNECTIONS:
   - Animated golden lines (SVG path with stroke-dasharray animation) connecting
     Stuttgart to each city, like flight paths
   - Lines appear sequentially on scroll or with "Play" button
   - Line thickness represents frequency of visits

4. INTERACTION:
   - Hover on any dot: city name appears + a brief note
     (e.g., "Tel Aviv — Über 100 Konzerte mit dem Israel Philharmonic Orchestra")
   - Click: expanded card with full history of Rilling's work in that city
   - Filter buttons: "Orchester" / "Festivals" / "Akademien" / "Lehre"

5. TIMELINE SCRUBBER:
   - Bottom slider: 1954 → 2026
   - As you drag, only locations active in that era are visible
   - Stuttgart is always visible (constant throughout his career)
   - Shows how his reach expanded decade by decade

6. STATISTICS SIDEBAR:
   - Animated counters: "30+ Länder" / "6 Kontinente" / "100+ Konzerte in Israel"
   - Quote: "Musik muss die Menschen aufschrecken..." with attribution

DESIGN: The map should feel like a sacred manuscript — as if someone drew
golden routes on an ancient dark vellum chart. Subtle grain texture overlay.
All text in Cormorant Garamond. Gold palette. Single HTML file with inline SVG.
```

---

### Prompt 8: Animated Infographic — Rilling's Recording Legacy

```
Create a stunning animated data visualization (React/HTML) showing the scale of
Helmuth Rilling's recording legacy — a visual argument for why he was the most
important Bach interpreter of the 20th century.

SECTIONS (vertically scrolling, each triggered by scroll position):

1. "DER BERG" (The Mountain) — Stacked area chart
   - X-axis: 1970–2000 (recording years)
   - Y-axis: cumulative number of recordings
   - Stacked by category (cantatas, passions, masses, instrumental, organ)
   - Animate: mountain "grows" as user scrolls
   - Annotation at 2000: "172 CDs — Das vollständige Werk Bachs"

2. "DER VERGLEICH" (The Comparison) — Horizontal bar race
   - Compare total Bach recordings by conductor:
     Rilling: 172 CDs (complete works)
     Gardiner: ~40 cantata volumes
     Koopman: ~67 cantata volumes
     Suzuki: ~55 cantata volumes
     Harnoncourt/Leonhardt: ~60 cantata volumes
   - Rilling's bar is gold, others are muted gray
   - Annotation: "Als Einziger hat er ALLE Werke Bachs eingespielt — zweimal."

3. "DAS NETZWERK" (The Network) — Force-directed graph
   - Center node: Rilling
   - Connected to: his ensembles, orchestras, students, institutions, festivals
   - Node size by importance, color by category
   - Hover reveals details about each connection
   - Shows how one person built an entire ecosystem for Bach's music

4. "DIE PREISE" (The Awards) — Timeline dots
   - UNESCO Prize (1994), Theodor Heuss Prize (1995), Grammy (2001),
     Bach Medal (2004), Sanford Award Yale (2008), Karajan Prize (2011),
     ECHO Klassik (2013), Honorary Academy membership (2003)
   - Each award appears as a gold medal icon with details on hover

5. "DAS ERBE" (The Legacy) — Ripple effect
   - A single drop (Rilling) creates expanding ripples
   - Each ripple ring represents a generation of conductors he taught
   - Named students appear along the rings
   - The ripples keep expanding to fill the screen
   - Text: "Die Wellen seiner Arbeit werden nie aufhören."
     (The waves of his work will never cease.)

DESIGN: Dark background, gold accents, Bodoni Moda headings,
Cormorant Garamond body. Each section is fullscreen height.
Use CSS scroll-snap for clean section transitions.
Smooth D3.js or pure SVG/Canvas animations. Single HTML file.
```

---

## 🎭 V. CREATIVE & ARTISTIC EXPERIENCES

---

### Prompt 9: Generative Art — "The Fugue Machine"

```
Create a full-screen generative art piece using p5.js that visualizes the structure
of a Bach fugue in real-time. This is art, not a diagram — it should be frame-worthy.

CONCEPT: "Die Fugenmaschine" — A living painting that generates itself

THE ALGORITHM:
1. Define a "subject" (the fugue theme) as a sequence of 12-16 data points:
   - Each point has: pitch (y-position), duration (width), velocity (opacity)
   - Based loosely on the subject of Fugue in G minor (BWV 578, "Little Fugue")

2. FOUR VOICES enter one by one (like a real fugue):
   - Voice 1 (Soprano): enters at t=0, draws from top
   - Voice 2 (Alto): enters at t=4 bars, draws from upper-middle
   - Voice 3 (Tenor): enters at t=8 bars, draws from lower-middle
   - Voice 4 (Bass): enters at t=12 bars, draws from bottom

3. VISUAL RENDERING:
   - Each voice is a flowing ribbon/stream of particles
   - When playing the subject: particles are dense, bright, gold
   - When playing counter-subject: particles are sparser, cooler color
   - When in free counterpoint: particles drift and swirl organically
   - Voices interweave — when two voices cross, create interference patterns

4. COLOR PALETTE:
   - Voice 1: Gold (#C9A84C)
   - Voice 2: Rose (#D4725C)
   - Voice 3: Sage (#6B9080)
   - Voice 4: Amethyst (#8B7EC8)
   - Background: near-black with subtle grain texture
   - Interactions between voices: white/bright flashes

5. PARAMETERS (interactive sidebar, hidden by default):
   - Tempo: 60–180 BPM
   - Density: sparse ↔ lush
   - Style: "Geometric" / "Organic" / "Calligraphic"
   - Seed: randomize for infinite variations
   - "Stretto" toggle: voices enter closer together (more intense)
   - "Inversion" toggle: some entries are upside-down (classic fugue technique)

6. SPECIAL FEATURES:
   - Screenshot button (saves canvas as PNG with title overlay)
   - Fullscreen toggle
   - Seeded randomness — same seed = same artwork (shareable via URL param)
   - "Rilling Mode": particles form the silhouette of a conductor's hands

TECHNICAL: p5.js, single HTML file, runs at 60fps. Canvas fills viewport.
The art should be mesmerizing — something you could watch for hours,
like staring at a fire or flowing water. Each run is unique but structured,
just like a fugue. Add a subtle "S.D.G." watermark in the corner.
```

---

### Prompt 10: Interactive Poem / Text Experience

```
Create an immersive typographic experience — a digital poem/tribute to Helmuth Rilling
that unfolds as the user scrolls. Each line appears with choreographed animations.

CONCEPT: "Brief an die Zukunft" (Letter to the Future)

THE TEXT (write this as part of the prompt — a German poem/meditation):

Structure the tribute as 7 stanzas, one per scroll-section:

1. STANZA 1 — "Der Anfang" (The Beginning)
   Words about a boy in Stuttgart hearing Bach for the first time
   - Letters assemble from scattered particles into words
   - Fade from chaos to order (like tuning an orchestra)

2. STANZA 2 — "Die Berufung" (The Calling)
   Words about founding the Gächinger Kantorei at 21
   - Text types itself, letter by letter, like a typewriter
   - Each completed word creates a small golden ripple

3. STANZA 3 — "Das Werk" (The Work)
   Words about the monumental recording project
   - Numbers (172, 1000+) animate counting up
   - Text arranged in the shape of sheet music staves

4. STANZA 4 — "Die Lehre" (The Teaching)
   Words about his students spreading across 30+ countries
   - Text starts centered, then words scatter outward like seeds
   - Each word drifts to a different position on screen

5. STANZA 5 — "Die Welt" (The World)
   Words about music crossing borders
   - City names orbit slowly around the central text
   - Text in multiple languages (German, English, Japanese, Hebrew, Spanish)

6. STANZA 6 — "Die Stille" (The Silence)
   Words about the final rest
   - Text fades word by word, leaving only silence
   - Screen gradually darkens
   - Last word visible: "Musik"

7. STANZA 7 — "S.D.G."
   Three letters. Soli Deo Gloria.
   - Appear with maximum grandeur — golden, glowing, slowly pulsing
   - Then: "Helmuth Rilling, 1933–2026"

TYPOGRAPHY:
- Each stanza uses a different font treatment:
  1. Bodoni Moda, scattered → ordered
  2. Cormorant Garamond italic, typewriter effect
  3. EB Garamond, architectural/grid layout
  4. Cormorant Garamond light, expanding
  5. Mixed fonts and scripts
  6. Bodoni Moda, dissolving
  7. Bodoni Moda 900 weight, monumental

TECHNICAL: Pure HTML/CSS/JS. Scroll-triggered animations (IntersectionObserver).
Each section is 100vh. Smooth scroll-snap. No libraries except Google Fonts.
Dark background, gold text, the aesthetic of the existing Klangkathedrale.
```

---

## 🔧 VI. TECHNICAL INFRASTRUCTURE

---

### Prompt 11: Progressive Web App — Offline Memorial

```
Convert the Klangkathedrale memorial into a Progressive Web App (PWA) that works
offline and can be installed on any device as a permanent memorial.

REQUIREMENTS:
1. SERVICE WORKER: Cache all assets for full offline functionality
2. MANIFEST: App name "Klangkathedrale", gold theme color, custom icons
3. Generate app icons (SVG-based):
   - A stylized golden treble clef inside a gothic arch shape
   - Sizes: 192x192, 512x512
   - Maskable version for adaptive icons
4. SPLASH SCREEN: "Klangkathedrale" in Bodoni Moda on black
5. META TAGS: Full Open Graph + Twitter Card metadata for sharing:
   - Title: "Klangkathedrale — Helmuth Rilling (1933–2026)"
   - Description: "Ein digitales Denkmal für den großen Bach-Dirigenten"
   - Image: Generate a 1200x630 OG image (canvas-rendered)
6. PERFORMANCE:
   - Lazy load all images with IntersectionObserver
   - Preload critical fonts
   - Compress and inline critical CSS
   - Defer non-critical JavaScript
   - Target: Lighthouse score 95+ on all categories
7. ACCESSIBILITY:
   - Proper heading hierarchy
   - ARIA labels on all interactive elements
   - Keyboard navigation for all features
   - Reduced motion mode (prefers-reduced-motion)
   - High contrast mode support
   - Screen reader announcements for scroll-triggered content
8. INTERNATIONALIZATION FRAMEWORK:
   - Prepare for German / English / Japanese / Hebrew
   - Language switcher in footer
   - Store translations in a JSON structure
   - Default: German

Output: A single, production-ready HTML file with inline service worker
registration and manifest. This should be deployable to any static host
(Netlify, Vercel, GitHub Pages) immediately.
```

---

### Prompt 12: Multi-Page Architecture Blueprint

```
I have a single-page memorial website (klangkathedrale.html) for Helmuth Rilling.
I want to expand it into a full multi-page website architecture. Don't build it yet —
create a detailed architectural plan as a beautiful HTML document.

THE PLAN SHOULD COVER:

1. SITE MAP (visual, interactive tree diagram):
   /                     → Landing (current Klangkathedrale, condensed)
   /leben                → Full biography (10,000+ words)
   /werk                 → Complete discography browser (172+ CDs)
   /werk/[bwv-number]    → Individual work detail page
   /zeitreise            → Full interactive timeline
   /welt                 → Interactive world map
   /orgel                → Web Audio organ experience
   /fugenmaschine        → Generative art installation
   /entdecke-bach        → AI-powered Bach discovery
   /galerie              → Photo/video gallery
   /stimmen              → Testimonials from musicians, students
   /brief                → The scrolling poem/tribute
   /ressourcen           → Links to recordings, institutions, archives
   /impressum            → Legal / credits

2. TECH STACK RECOMMENDATION:
   - Framework: Astro (static site generation, zero JS by default, island architecture)
   - Styling: Tailwind + custom CSS for the cathedral aesthetic
   - Animations: GSAP for scroll-triggered, Framer Motion for React islands
   - 3D: Three.js (isolated to specific pages)
   - Audio: Web Audio API (global ambient + page-specific)
   - CMS: Markdown files in /content (no database)
   - Hosting: Vercel or Cloudflare Pages
   - Domain suggestion: klangkathedrale.de or rilling-memorial.org

3. SHARED DESIGN SYSTEM:
   - Color tokens (CSS custom properties)
   - Typography scale (Bodoni Moda / Cormorant Garamond / EB Garamond)
   - Component library: GoldButton, CathedralCard, TimelineNode, etc.
   - Animation presets: fadeInUp, goldGlow, particleBurst, etc.
   - Navigation: persistent side rail + footer navigation

4. CONTENT STRATEGY:
   - What content needs to be written/researched
   - Suggested primary sources (Bachakademie archives, Oregon Bach Festival)
   - Photo licensing considerations
   - Video embed strategy (YouTube, archive footage)
   - Translation workflow for multilingual support

5. PERFORMANCE BUDGET:
   - Per-page JS limits
   - Image optimization strategy (AVIF/WebP with fallbacks)
   - Core Web Vitals targets
   - CDN configuration

Format this as a stunning HTML document with the Klangkathedrale aesthetic —
dark background, gold accents, clean typography. Include Mermaid diagrams for
the site map and data flow. This document should itself be a work of art.
```

---

## 🌟 VII. COMMUNITY & LEGACY

---

### Prompt 13: Digital Guest Book — "Stimmen" (Voices)

```
Create a React artifact with persistent storage that serves as a digital guest book
for the Rilling memorial. Musicians, students, and music lovers from around the world
can leave tributes.

CONCEPT: "Stimmen" — Voices

1. DISPLAY:
   - Entries appear as floating "pages" on a dark background
   - Each entry is a card with subtle parchment texture (CSS gradient)
   - Cards are arranged in a loose masonry grid, gently swaying (CSS animation)
   - Newest entries glow briefly with gold border

2. ENTRY FORM (elegant, minimal):
   - Name (optional — can be "Anonym")
   - City/Country (optional)
   - Relationship: dropdown — "Student", "Musician", "Listener", "Colleague", "Other"
   - Message: textarea (max 500 chars)
   - "Eine Kerze anzünden" (Light a candle) — submit button

3. CANDLE METAPHOR:
   - Each entry = one candle in a virtual cathedral
   - Header shows: "327 Kerzen brennen" (327 candles are burning)
   - When a new entry is submitted, a candle-lighting animation plays
   - Background has subtle flickering warm light that intensifies with more entries

4. MODERATION:
   - All entries are shared (shared: true in storage)
   - Entries stored as JSON with timestamp, name, city, relationship, message
   - Use hierarchical keys: "guestbook:entry_[timestamp]"
   - A separate "featured" key for curated highlights

5. READING MODE:
   - "Alle Stimmen" (All Voices) — scrollable feed
   - "Zufällige Stimme" (Random Voice) — shows one random entry, full screen
   - Filter by relationship type
   - Search by keyword

6. DESIGN:
   - Background: #0A0908 with warm radial gradient at top (candle glow)
   - Cards: rgba(201,168,76,0.03) background, 1px gold border, Cormorant Garamond
   - Form: floating overlay, slide-up animation
   - All text gold/ivory/parchment palette
   - Mobile-responsive

Use window.storage API for persistence. Shared data so all visitors see all entries.
Single JSX artifact file with Tailwind.
```

---

### Prompt 14: "Rillings Erben" — Student Network Visualization

```
Create an interactive force-directed network graph showing Helmuth Rilling's
pedagogical legacy — the conductors he trained and where they work today.

DATA (research and include all known students):
- Hans-Christoph Rademann (Dresdner Kammerchor, RIAS Kammerchor)
- Matthias Manasi (Orchestra Sinfonica di Roma)
- Eberhard Friedrich (Bayreuth Festival Chorus)
- [Research and add 15-20 more known students from various sources]

For each student, include:
- Name, current position, city, country
- Connection to Rilling (studied at Frankfurt, Bach Academy, Oregon, etc.)
- Their own notable students (2nd generation) if known

VISUALIZATION:
1. Central node: Rilling (large, gold, pulsing)
2. First ring: Direct students (medium, warm colors)
3. Second ring: Students of students (small, cooler colors)
4. Connecting lines: weighted by relationship intensity
5. Force simulation: nodes repel, connections attract (D3 force layout)
6. Geography mode: toggle to arrange nodes on a world map by current city
7. Timeline mode: toggle to arrange by year of study

INTERACTION:
- Hover: highlight all connections to/from that person
- Click: expand detail card with bio, photo placeholder, and links
- Search bar to find specific conductors
- Filter by institution (Frankfurt / Stuttgart / Oregon)

This shows how one teacher's influence ripples through generations.
D3.js force simulation, single HTML file, cathedral aesthetic.
```

---

## ♾️ VIII. THE META-PROMPT

---

### Prompt 15: The Infinite Generator

```
You are a creative director for "Klangkathedrale" — a digital memorial for the
legendary Bach conductor Helmuth Rilling (1933–2026). The memorial is a website
built as a single HTML file with gold-on-dark cathedral aesthetics, generative
particle animations, and interactive visualizations.

I will give you a THEME or CONCEPT, and you will:

1. Design a complete interactive web experience around that theme
2. Write the full implementation as a single HTML file
3. Ensure it matches the Klangkathedrale aesthetic:
   - Colors: gold (#C9A84C), dark ink (#1A1410), ivory (#F5F0E8), parchment (#EDE6D6)
   - Fonts: Bodoni Moda (display), Cormorant Garamond (body italic), EB Garamond (serif body)
   - Mood: sacred, contemplative, grand, timeless
   - Technical: canvas/SVG animations, smooth interactions, mobile-responsive
4. Include at least one "moment of wonder" — something unexpected that delights

THEMES TO TRY (pick one, or give me your own):
- "The Last Concert" — What would Rilling's final concert program have been?
- "172 Sunsets" — Each CD visualized as a unique sunset color palette
- "The Tuning Fork" — A meditation on the note A=440Hz that unites all musicians
- "Bachs Handschrift" — Generative calligraphy that writes itself
- "Der leere Stuhl" — The empty conductor's podium, rendered in 3D
- "Stimmengeflecht" — A web of vocal lines that the user can weave
- "Die Stille zwischen den Noten" — Visualizing the silence BETWEEN notes
- "Zeitkapsel 2126" — A message to the world 100 years from now
- "Die 200 Kantaten" — A visual journey through all of Bach's cantatas
- "Klangfarben" — Synesthetic color translation of Bach's harmonies

My theme is: [USER ENTERS THEME HERE]
```

---

*Diese Prompt-Bibliothek ist ein lebendiges Dokument.
Jeder Prompt ist ein Samen — pflanze ihn in einen Claude-Chat
und beobachte, wie ein neues Kapitel der Klangkathedrale wächst.*

**S. D. G.**
