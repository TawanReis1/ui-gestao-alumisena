import { Product } from './product'

export class Quote {
    name: String;
    client: String;
    aditionalEmail: String;
    products: [Product];
    total: Number;
    validUntil: any;
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