import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";

//export type UserDocument = HydratedDocument <User & Document>;
export type UserDocument = HydratedDocument<User>;
@Schema()

export class User {
    @Prop({required: true })
    name: string;

    @Prop({required: true })
    lastname: string;

    @Prop({ required: true, unique: true })
    email: string;

    @Prop({ required: true })
    password: string;

    @Prop({type:'oid', unique: true, name: 'reset_password_token', nullable: true})
    resetPasswordToken: string;

    // @Prop({required: true})
    // token: string;

    // @Prop({required: true, type: mongoose.Types.ObjectId})
    // userId: string;

    // @Prop({required: true})
    // expiryDate: Date;



}

export const UserSchema = SchemaFactory.createForClass(User);