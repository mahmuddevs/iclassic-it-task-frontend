export interface Permission {
  name: string;
  module: string;
}

export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  authProvider?: "local" | "google";
  permissions: Permission[];
  createdAt?: string;
  updatedAt?: string;
}
