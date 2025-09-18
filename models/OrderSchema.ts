import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

export interface IOrder extends Document{
    orderId:string;
    orderDate:Date;
    pickupLocation:string,
    comment:string,
    resellerName:string;
    companyName:string;
    billing:{
        firstName:string;
        lastName?:string;
        address1:string;
        address2:string;
        isdCode:string;
        city:string;
        pincode:string;
        state:string;
        country:string;
        email:string;
        phone:string;
        alternatePhone:string
    }
    shipping:{
        useBilling:boolean;
        firstName:string;
        lastName:string;
        address1:string;
        address2:string;
        city:string;
        pincode:string;
        state:string;
        country:string;
        email:string;
        phone:string;
    }
    items:[
        {
           name:string; 
           sku:string;
           units:number;
           selling_price:number;
           discount:number;
           tax:number;
           hsn:string
        }
    ]
    paymentMethod:string;
    shippingCharges:number;
    giftwrapCharges:number;
    transactionCharges:number;
    totalDiscount:number;
    subTotal:number;
    package:{
        length:number;
        breadth:number;
        height:number;
        weight:number;
    }
    invoiceNumber:string;
    ewaybillNo:string;
    customerGstin:string;
    orderType:string;
    shiprocketResponse:{}
}

const OrderSchema = new mongoose.Schema<IOrder>(
    {
        orderId: { type: String, default: () => uuidv4(), required: true, unique: true },
        orderDate: { type: Date, default: Date.now },
        pickupLocation: { type: String, required: true },
        comment: String,
        resellerName: String,
        companyName: String,
        billing: {
            firstName: { type: String, required: true },
            lastName: { type: String },
            address1: { type: String, required: true },
            address2: { type: String },
            isdCode: { type: String, default: "+91" },
            city: { type: String, required: true },
            pincode: { type: String, required: true },
            state: { type: String, required: true },
            country: { type: String, default: "India" },
            email: { type: String, required: true },
            phone: { type: String, required: true },
            alternatePhone: String
        },
        shipping: {
            useBilling: { type: Boolean, default: true },
            firstName: String,
            lastName: String,
            address1: String,
            address2: String,
            city: String,
            pincode: String,
            state: String,
            country: String,
            email: String,
            phone: String
        },
        items: [
            {
                name: { type: String, required: true },
                sku: String,
                units: { type: Number, required: true },
                selling_price: { type: Number, required: true },
                discount: { type: Number, default: 0 },
                tax: { type: Number, default: 0 },
                hsn: String
            }
        ],
        paymentMethod: { type: String, enum: ["Prepaid", "COD"], required: true },
        shippingCharges: { type: Number, default: 0 },
        giftwrapCharges: { type: Number, default: 0 },
        transactionCharges: { type: Number, default: 0 },
        totalDiscount: { type: Number, default: 0 },
        subTotal: { type: Number, required: true },
        package: {
            length: { type: Number, required: true },
            breadth: { type: Number, required: true },
            height: { type: Number, required: true },
            weight: { type: Number, required: true }
        },

        invoiceNumber: String,
        ewaybillNo: String,
        customerGstin: String,
        orderType: { type: String, default: "ESSENTIALS" },
        shiprocketResponse: Object
    },
    { timestamps: true }
);

export default mongoose.models.Order || mongoose.model("Order", OrderSchema);
