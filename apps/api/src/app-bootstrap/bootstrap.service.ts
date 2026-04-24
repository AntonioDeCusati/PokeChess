import { getBoardConfig, type BoardConfigDto } from '../board-config/board-config.service';
import { listCatalogWithOwnership } from '../creature/creature.service';
import type { UserCreatureDto } from '../creature/creature.dto';
import { getTeam, type TeamDto } from '../team/team.service';
import { getProfile, type UserProfile } from '../user/user.service';

/**
 * Aggregate payload returned by GET /app/bootstrap.
 *
 * Contains everything the player client needs to hydrate its initial
 * state in a single round-trip: profile + wallet, full catalog merged
 * with ownership (one stable list for Collezione), the 6 team slots and
 * the board-level configuration (support / trainer / background).
 */
export interface BootstrapDto {
  profile: UserProfile;
  creatures: UserCreatureDto[];
  team: TeamDto;
  boardConfig: BoardConfigDto;
}

export async function buildBootstrap(userId: string): Promise<BootstrapDto> {
  const [profile, creatures, team, boardConfig] = await Promise.all([
    getProfile(userId),
    listCatalogWithOwnership(userId),
    getTeam(userId),
    getBoardConfig(userId),
  ]);
  return { profile, creatures, team, boardConfig };
}
