import { BaseEntity } from "../base";

/**
 *  Main Entity
 */
interface App extends BaseEntity {
  id?: string;
  name: string;
  description: string;
  dashboard_settings: {
    group: string;
    icon: string;
    path: string;
    color: string;
    title: string;
    iconColor: string;
  };
}

export { App };
