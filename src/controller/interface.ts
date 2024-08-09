export interface WorkHistoryDTO {
    id: number;
    startDate: string;
    separationDate: string;
    separationReason: string;
}

export interface PeaceOfficerDTO {
    id: number;
    firstName: string;
    lastName: string;
    workHistory: WorkHistoryDTO[];
}

export interface AgencyDTO {
    id: number;
    agencyName: string;
    peaceOfficerList: PeaceOfficerDTO[];
}
