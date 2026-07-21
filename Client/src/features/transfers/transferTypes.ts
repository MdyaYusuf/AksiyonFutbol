import type { PlayerPosition } from "../basePlayers/basePlayerTypes";

export const TransferListingStatus = {
  Active: 1,
  Withdrawn: 2,
  Completed: 3,
} as const;

export type TransferListingStatus =
  (typeof TransferListingStatus)[keyof typeof TransferListingStatus];

export const TransferOfferStatus = {
  Pending: 1,
  Accepted: 2,
  Rejected: 3,
  Withdrawn: 4,
  Cancelled: 5,
} as const;

export type TransferOfferStatus =
  (typeof TransferOfferStatus)[keyof typeof TransferOfferStatus];

export interface TransferMarketItem {
  listingId: string;
  playerInstanceId: string;
  firstName: string;
  lastName: string;
  position: string;
  age: number;
  overallRating: number;
  marketValue: number;
  wage: number;
  isInjured: boolean;
  askingPrice: number;
  sellingClubId: string;
  sellingClubName: string;
  listedAt: string;
}

export interface TransferListingResponse {
  id: string;
  playerInstanceId: string;
  firstName: string;
  lastName: string;
  position: string;
  overallRating: number;
  marketValue: number;
  askingPrice: number;
  status: TransferListingStatus;
  clubId: string;
  clubName: string;
  pendingOfferCount: number;
  createdDate: string;
  updatedDate?: string | null;
}

export interface TransferOfferResponse {
  id: string;
  transferListingId: string;
  playerInstanceId: string;
  firstName: string;
  lastName: string;
  position: string;
  overallRating: number;
  askingPrice: number;
  offerFee: number;
  proposedWage: number;
  status: TransferOfferStatus;
  sellingClubId: string;
  sellingClubName: string;
  buyingClubId: string;
  buyingClubName: string;
  createdDate: string;
  updatedDate?: string | null;
}

export interface TransferDealsResponse {
  incomingOffers: TransferOfferResponse[];
  outgoingOffers: TransferOfferResponse[];
}

export interface CreateTransferListingRequest {
  playerInstanceId: string;
  askingPrice: number;
}

export interface CreateTransferOfferRequest {
  transferListingId: string;
  offerFee: number;
  proposedWage: number;
}

export interface TransferMarketQuery {
  position?: PlayerPosition;
  search?: string;
  sortBy?: string;
  sortDescending?: boolean;
}
