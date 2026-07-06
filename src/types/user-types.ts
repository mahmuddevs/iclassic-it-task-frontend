export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  authProvider: "local" | "google";
  createdAt?: string;
  updatedAt?: string;
}
