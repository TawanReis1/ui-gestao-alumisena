export class Sale {
    _id: String;
    status: String;
    name: String;
    client: String;
    aditionalEmail: String;
    products: any;
    total: Number;
    soldAt: any;
    paymentMethod: String;
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