export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  isAdmin: boolean;
  permissions: string[];
  organization: Organization;
  role?: Role;
}

export interface Organization {
  id: string;
  name: string;
  users: User[];
  roles: Role[];
}

export interface Role {
  id: string;
  name: string;
  description?: string;
  wage: number;
  metadata?: Record<string, any>;
}

export interface AuthUser extends User {
  auth0Id: string;
}
