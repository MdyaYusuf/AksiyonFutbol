// Responses
export interface ClubPresidentResponse {
  id: string;
  userId: string;
  userName: string;
  name: string;
  reputationPoints: number;
  title?: string | null;
  createdDate: string;
}

export interface ClubPresidentPreview {
  id: string;
  name: string;
  reputationPoints: number;
  title?: string | null;
}

export interface CreatedClubPresidentResponse {
  id: string;
  name: string;
  title?: string | null;
}

// Requests
export interface CreateClubPresidentRequest {
  name: string;
  title?: string | null;
}

export interface UpdateClubPresidentRequest {
  id: string;
  name: string;
  title?: string | null;
}

export interface UpdateClubPresidentReputationRequest {
  id: string;
  reputationPoints: number;
}
