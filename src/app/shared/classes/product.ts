export class Product {
    _id: String;
    code: String;
    name: String;
    price: Number;
    quantity: Number;
    typeQuantity: String;
    color: String;
    available: Boolean;
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