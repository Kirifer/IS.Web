export interface Supply {
    id: string;
    category: string;
    item: string;
    color: string;
    size: string;
    quantity: number;
    suppliesTaken: number;
    suppliesLeft: number;
    costPerUnit: number;
    total: number;
    dateCreated: Date;
}
