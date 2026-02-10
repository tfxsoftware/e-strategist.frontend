E-Strategist: React/Next.js Project Structure

This structure is designed for scalability, allowing you to manage complex management modules while maintaining a consistent "Warcraft-style" theme.

1. Top-Level Overview

/src
  /app                # Next.js App Router (Pages, Layouts, API routes)
  /assets             # Static textures (stone, leather), global SVG icons
  /components         # Reusable UI components
    /ui               # Low-level primitives (Buttons, Inputs, Tooltips)
    /theme            # Fantasy-specific elements (StoneFrame, RunicDivider)
    /modules          # Feature-specific complex components (MarketCard, DraftBoard)
  /hooks              # Custom React hooks (useAuth, useMarket, useMatchEngine)
  /lib                # Utilities (formatting, math helpers, win probability logic)
  /services           # API Communication (Axios/Fetch wrappers for Spring Boot)
  /store              # State Management (Zustand, Redux, or Context)
  /types              # TypeScript interfaces/types (Hero, Player, Event)
  /styles             # Global CSS, Tailwind configurations, Runic fonts


2. Key Directories Explained

/components/theme (Crucial for your WC3 Style)

Since your style is so specific, you should "componentize" your borders. Instead of writing complex Tailwind classes every time, you create:

<StoneFrame />: A wrapper that provides the beveled stone border.

<RunicButton />: The glowing red/green buttons we designed.

<GoldText />: Standardized styles for the "etched gold" headers.

/services

This is your bridge to the Spring Boot backend.

api.js: The base configuration.

eventService.js: Functions like registerForEvent(), fetchActiveLeagues().

marketService.js: Functions like placeBid(), finalizeListing().

/hooks

Use these to encapsulate the "Management" logic.

useMarketPolling: A hook that automatically refreshes the auction list every 30 seconds.

useMatchSimulation: Handles the real-time "progress bar" updates while the backend calculates the winner.

/lib

Since you have a lot of math (XP curves, Win Probability), keep those functions here.

xp-calculator.js: Shared logic with the backend to show users "Estimated Level after training."

formatters.js: Formatting currency (e.g., $10,000.00) and dates.

3. The app/ Router Layout

/app
  /layout.jsx         # Global shell (CRT Scanlines, Vignette)
  /page.jsx           # Landing Page
  /(dashboard)        # Route group for the logged-in experience
    /layout.jsx       # The "War Room" HUD (Top bar, Sidebars)
    /war-room         # Main Dashboard
    /roster           # Team management
    /market           # Auction House
    /history          # Match Logs
  /auth
    /login
    /signup


4. Why this works for E-Strategist

Feature Encapsulation: If you want to change how the Market works, you only touch /app/market and /services/marketService.js.

Theme Consistency: If you decide to change the "Stone" texture to a "Marble" texture, you only change the components in /components/theme.

Clean Page Components: Your pages will look very clean, mostly importing complex components from the modules folder.