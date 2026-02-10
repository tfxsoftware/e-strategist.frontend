# Project Features - MemServer

Mem is a MOBA-themed Esports Management Server. Below is a comprehensive list of all project features categorized by module.

### 1. Authentication & User Management
*   **JWT-Based Authentication**: Secure sign-in and sign-up using JSON Web Tokens.
*   **User Profiles**: Support for unique usernames, emails, and organization details (name, image).
*   **Region System**: Multi-region support (BR, NA, EUW, KR, etc.) for users and events.
*   **Role-Based Access**: Infrastructure for different user roles.

### 2. Hero System
*   **Hero Pool**: Diverse pool of 20+ heroes with unique attributes.
*   **Roles & Archetypes**:
    *   **Roles**: Top, Mid, Jungle, Carry (ADC), and Support.
    *   **Archetypes**: Mage, Assassin, Bruiser, Tank, Enchanter, and Marksman.
*   **Meta Tiers**: Dynamic tier system (S, A, B, C, D) reflecting hero strength in specific roles.
*   **Multi-Role Compatibility**: Heroes can have primary and secondary roles with different effectiveness tiers.

### 3. Player Management
*   **Recruitment (Rookie System)**: Generate new players with randomized traits and base stats.
*   **Player Traits**: Specialized traits affecting performance and team dynamics:
    *   **Adaptive**: Increased XP gain on losses and training.
    *   **Leader**: Enhanced morale/cohesion gains for the team.
    *   **Team Player**: Bonus to team cohesion.
    *   **Lone Wolf**: Increased strength Penalty to team cohesion.
    *   **Inspiring**: Reduces team energy consumption.
*   **Mastery System**:
    *   **Role Mastery**: Players improve their effectiveness in specific roles through experience.
    *   **Hero Mastery**: Deep specialization for individual heroes.
*   **Economics**: Fixed salary system and payment scheduling.
*   **Condition Tracking**: Players can have different health conditions (e.g., Healthy).

### 4. Roster & Team Dynamics
*   **Roster Management**: Create and manage teams (rosters) owned by users.
*   **Team Stats**:
    *   **Morale**: Fluctuates based on match results and player traits.
    *   **Cohesion**: Represents team chemistry, improved by playing together.
    *   **Energy**: Consumed during matches and bootcamps; recovered hourly based on activity (Idle vs. In Event).
*   **Activity States**: Track if a roster is Idle, Training, or participating in an Event.

### 5. Match Engine & Simulation
*   **Draft System**:
    *   **Bans**: Strategy phase to remove heroes from the pool.
    *   **Pick Intentions**: Players select preferred heroes for specific roles.
    *   **Draft Resolution**: Automated logic to assign heroes based on preferences and availability.
*   **Simulation Logic**:
    *   **Performance Calculation**: Based on Player Mastery, Hero Meta Tier, Synergy, and Counter-picks.
    *   **Synergy & Counters**: Team-wide bonuses for compatible archetypes and penalties for being countered by the opponent.
*   **Post-Match Processing**:
    *   Automatic XP distribution for players (Role & Hero).
    *   Updates to Roster Morale, Cohesion, and Energy.
*   **Match History & Scheduling**: View upcoming matches and past results.

### 6. Event & League Management
*   **Event Orchestration**: Support for different event types (Leagues, Tournaments, Cups).
*   **League System**:
    *   **Automated Scheduling**: Generate round-robin or block-based match schedules.
    *   **Live Standings**: Real-time tracking of Wins, Losses, and Table Positions.
    *   **Registration**: Entry fee and region-lock validation.
*   **Prize Distribution**: Configurable rank-based prize pools with automatic distribution upon event completion.

### 7. Training & Development (Bootcamps)
*   **Bootcamp Sessions**: Send rosters to intensive training to gain XP.
*   **Tick-Based XP**: Periodic experience gains for specific heroes and roles during the session.
*   **Training Config**: Customize which hero and role each player focuses on during the bootcamp.

### 8. Scenarios
*   **Automated Scenarios**: Quick setup of pre-configured matches and rosters for testing, tutorials, or debugging.
*   **Rookie Generation**: Instant creation of full teams with rookies for immediate simulation.
