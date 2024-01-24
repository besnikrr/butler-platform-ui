export interface AppsWithPermissions {
  allChecked?: boolean;
  app: {
    id?: string;
    name: string;
    description: string;
    checked?: boolean;
    pk?: string;
    sk?: string;
  };
  permissions?: Array<SinglePermission>;
  activeSearch?: boolean;
}

export interface SinglePermission {
  name: string;
  checked?: boolean;
  searched?: boolean;
}
