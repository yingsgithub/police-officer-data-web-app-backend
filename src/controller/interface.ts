export interface WorkHistoryDTO {
    id: number;
    startDate: string;
    separationDate: string;
    separationReason: string;
}

export interface PeaceOfficerDTO {
    id: number;
    name: string;
    workHistory: WorkHistoryDTO[];
}

export interface AgencyDTO {
    id: number;
    agencyName: string;
    peaceOfficerList: PeaceOfficerDTO[];
}
