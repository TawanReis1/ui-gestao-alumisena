export class Client {
    _id: String;
    name: String;
    birthFundationDate: any;
    type: String;
    rg: String;
    cpfCnpj: String;
    email: String;
    telephone: String;
    street: String;
    houseNumber: Number;
    city: String;
    neighborhood: String;
    cep: String;
    totalSpent: Number;
    orderQuantity: Number;
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
