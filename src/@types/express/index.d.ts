import { Request } from 'express';

interface AppRequest extends Request {
  user: T;
}

export type ExtendedRequest = AppRequest<{
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
  organizationId: number;
  isAdmin: boolean;
  credits: number;
}>;

interface AppRequestWithApiKey extends Request {
  organization: T;
}

export type ExtendedRequestWithApiKey = AppRequestWithApiKey<{
  id: number;
  projectId: number | null;
  apiKeyId: number;
}>;
