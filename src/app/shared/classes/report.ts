export class Report {
    _id: String;
    name: String;
    clients: any;
    catalogs: any;
    sales: any;
    totalCollected: Number;
    bestSellingItem: any;
    wholeQuantity: any;
    bestClient: any;
    dateRange: any
    type: String;
    createdBy: {
        type: String;
        name: String;
        email: String;
        document: String
    };
    updatedBy: {
        type: String;
        name: String;
        email: String;
        document: String
    };
}