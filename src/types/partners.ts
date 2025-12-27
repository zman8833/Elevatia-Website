import { Timestamp } from 'firebase/firestore';

// Organization - Partner companies
export interface Organization {
  id: string;
  name: string;
  slug: string;
  logo: string;
  primaryColor: string;
  status: 'active' | 'suspended' | 'pending';
  tier: 'starter' | 'growth' | 'enterprise';
  maxActiveUsers: number;
  defaultCodeDurationDays: number;
  contactEmail: string;
  contactName: string;
  createdAt: Timestamp;
  partnerSince: Timestamp;
  description?: string;
  website?: string;
}

// Partner Code - Access codes
export interface PartnerCode {
  id: string;
  code: string;
  organizationId: string;
  type: 'single' | 'multi';
  maxRedemptions?: number;
  currentRedemptions: number;
  expiresAt: Timestamp;
  durationDays: number;
  createdBy: string;
  createdAt: Timestamp;
  isActive: boolean;
  label?: string;
  notes?: string;
}

// Partner Admin - Dashboard users
export interface PartnerAdmin {
  id: string;
  email: string;
  organizationId: string;
  role: 'owner' | 'admin' | 'viewer';
  displayName?: string;
  createdAt: Timestamp;
  lastLoginAt?: Timestamp;
}

// Partner Path - Exclusive partner paths
export interface PartnerPath {
  id: string;
  organizationId: string;
  pathId: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  category: string;
  isActive: boolean;
  sortOrder?: number;
  createdAt: Timestamp;
}

// Partner Redemption - Redemption log
export interface PartnerRedemption {
  id: string;
  userId: string;
  organizationId: string;
  codeId: string;
  codeUsed: string;
  redeemedAt: Timestamp;
  accessExpiresAt: Timestamp;
}

// Stats returned from Firebase Functions
export interface PartnerStats {
  activeUsers: number;
  expiredUsers: number;
  totalRedemptions: number;
  activeCodesCount: number;
}

// Form types for creating/editing
export interface CreateCodeForm {
  type: 'single' | 'multi';
  maxRedemptions?: number;
  expiresAt: string; // ISO date string
  durationDays: number;
  label?: string;
  notes?: string;
  prefix?: string;
}

export interface CreateOrganizationForm {
  name: string;
  slug: string;
  primaryColor: string;
  tier: 'starter' | 'growth' | 'enterprise';
  maxActiveUsers: number;
  defaultCodeDurationDays: number;
  contactEmail: string;
  contactName: string;
  description?: string;
  website?: string;
}

export interface CreatePathForm {
  pathId: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  category: string;
}

export interface CreateAdminForm {
  email: string;
  role: 'owner' | 'admin' | 'viewer';
  displayName?: string;
}

// Partner Path Request - Custom path requests from partners
export interface PartnerPathRequest {
  id: string;
  organizationId: string;
  requestedBy: string;           // UID of partner admin
  pathName: string;
  description: string;
  targetAudience: string;
  goals: string[];
  preferredCategory: 'fitness' | 'nutrition' | 'mental' | 'sleep' | 'recovery' | 'other';
  additionalNotes?: string;
  status: 'pending' | 'in_review' | 'approved' | 'rejected' | 'live';
  reviewNotes?: string;
  rejectionReason?: string;
  submittedAt: Timestamp;
  reviewedAt?: Timestamp;
  completedAt?: Timestamp;
  partnerPathId?: string;
}

export interface CreatePathRequestForm {
  pathName: string;
  description: string;
  targetAudience: string;
  goals: string[];
  preferredCategory: 'fitness' | 'nutrition' | 'mental' | 'sleep' | 'recovery' | 'other';
  additionalNotes?: string;
}

