# MemServer API Routes

This document provides a comprehensive list of all available API endpoints in the MemServer project, categorized by module.

## 1. Authentication (`/api/auth`)
| Method | Endpoint | Description | Auth Required | Required Body Fields |
|--------|----------|-------------|---------------|----------------------|
| POST | `/signup` | Register a new user account. | No | `username`, `email`, `password`, `region` |
| POST | `/signin` | Authenticate and receive a JWT. | No | `email`, `password` |

## 2. Users (`/api/users`)
| Method | Endpoint | Description | Auth Required | Required Body Fields |
|--------|----------|-------------|---------------|----------------------|
| GET | `/me` | Get current user profile. | Yes | - |
| GET | `/me/players` | List all players owned by the current user. | Yes | - |
| PATCH | `/me/organization` | Update user organization details (name, image). | Yes | `organizationName`, `organizationImageUrl` |

## 3. Heroes (`/api/heroes`)
| Method | Endpoint | Description | Auth Required | Required Body Fields |
|--------|----------|-------------|---------------|----------------------|
| GET | `/` | List all available heroes with their meta tiers and roles. | Yes | - |

## 4. Players (`/api/players`)
| Method | Endpoint | Description | Auth Required | Required Body Fields |
|--------|----------|-------------|---------------|----------------------|
| GET | `/market` | View the public marketplace (unowned players). | Yes | - |
| POST | `/discover/rookie` | Generate a new rookie player for the user. | Yes | - |
| POST | `/` | Create a new player (Admin only). | Yes (Admin) | `nickname`, `salary` |

## 5. Rosters (`/api/rosters`)
| Method | Endpoint | Description | Auth Required | Required Body Fields |
|--------|----------|-------------|---------------|----------------------|
| GET | `/me` | List all rosters owned by the current user. | Yes | - |
| POST | `/` | Create a new roster. | Yes | `name`, `region`, `playerIds` (5 UUIDs) |
| PUT | `/{id}` | Update an existing roster's details. | Yes | `addPlayerIds`, `removePlayerIds` |
| DELETE | `/{id}` | Delete a roster. | Yes | - |

## 6. Bootcamps (`/api/bootcamps`)
| Method | Endpoint | Description | Auth Required | Required Body Fields |
|--------|----------|-------------|---------------|----------------------|
| POST | `/{rosterId}/start` | Start a bootcamp session for a specific roster. | Yes | `configs`: [`playerId`, `targetRole`, `primaryHeroId`] |
| POST | `/{rosterId}/stop` | Stop the current bootcamp session for a roster. | Yes | - |

## 7. Matches (`/api/matches`)
| Method | Endpoint | Description | Auth Required | Required Body Fields |
|--------|----------|-------------|---------------|----------------------|
| GET | `/my-schedule` | View upcoming scheduled matches for the user. | Yes | - |
| GET | `/my-history` | View paginated match history for the user. | Yes | - |
| POST | `/` | Create a new match (Admin only). | Yes (Admin) | `homeRosterId`, `awayRosterId`, `scheduledTime` |
| PATCH | `/{id}/draft` | Update the draft (picks/bans) for a specific match. | Yes | `teamBans`, `pickIntentions`: [`playerId`, `role`, `preferredHeroId1`, `preferredHeroId2`, `preferredHeroId3`, `pickOrder`] |
| POST | `/engine/test/{id}` | Manually simulate a match (Admin only). | Yes (Admin) | - |

## 8. Events (`/api/events`)
| Method | Endpoint | Description | Auth Required | Required Body Fields |
|--------|----------|-------------|---------------|----------------------|
| POST | `/` | Create a new event (League, Tournament). | Yes | `name`, `regions`, `type`, `tier`, `entryFee`, `totalPrizePool`, `opensAt`, `gamesPerBlock`, `minutesBetweenGames`, `minutesBetweenBlocks`, `maxPlayers` |
| POST | `/{eventId}/register/roster/{rosterId}` | Register a roster for a specific event. | Yes | - |

## 9. Scenarios (`/api/scenarios`)
| Method | Endpoint | Description | Auth Required | Required Body Fields |
|--------|----------|-------------|---------------|----------------------|
| POST | `/` | Create a testing scenario with pre-configured users (Admin only). | Yes (Admin) | `user1Id`, `user2Id` |
