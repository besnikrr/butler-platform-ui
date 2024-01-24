import { BaseEntity } from "../base";

/**
 *  Main Entity
 */
interface Tenant extends BaseEntity {
  id?: string;
  name?: string;
  cognito: { poolId: string; clientId: string };
  assignedApps?: string[];
}

export { Tenant };
