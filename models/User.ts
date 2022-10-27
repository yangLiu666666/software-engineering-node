import AccountType from "./AccountType";
import MaritalStatus from "./MaritalStatus";
import Location from "./Location";
import mongoose from "mongoose";

export default interface User {
    _id?: mongoose.Schema.Types.ObjectId;
     username: string ;
     password: string ;
     firstName: string | null ;
     lastName: string | null ;
     email: string ;
    profilePhoto: string | null ;
     headerImage: string | null ;
     accountType?: AccountType;
     maritalStatus?: MaritalStatus;
     biography: string | null ;
     dateOfBirth: Date | null ;
     joined: Date;
     location: Location | null ;
}
