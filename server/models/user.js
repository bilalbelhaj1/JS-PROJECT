import mongoose from "mongoose";


const userSchema = new mongoose.Schema(
    {
        Fname:{
            type:String,
            required:true
        },
        Lname:{
            type:String,
            required:true
        },
        username:{
            type: String,
            required: true,
            unique: true
        },
        password:{
            type: String,
            required: true,
        },
        email:{
            type: String,
            required: true,
            unique: true
        },
        gendre:{
            type:String,
        },
        role: {
            type: String
        }
    }
)

export default mongoose.model('User', userSchema);