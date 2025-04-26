import User from '../models/user.js'
import bcrypt from 'bcrypt';
 const updateProfile = async (req,res)=>{
    const userId = req.user.userId;
    const {username, email} = req.body;
    console.log(username, email);

    const user = await User.findOne({_id:userId});
    if(!user){
        res.status(400).json({message:"Username not found", type:'danger'});
    }else{
        const usersTockeck = await User.find({_id:{$ne:userId}});
        // check if the provided username is in those
        const usernameExists = usersTockeck.some(user=>user.username === username);

        const emailExists = usersTockeck.some(user=>user.email === email);

        if(usernameExists){
            res.status(400).json({message:"This Username Already Taken", type:'danger'});
        }
        else if(emailExists){
            res.status(400).json({message:"This email Already Exists", type:'danger'});
        }else{
            await User.updateOne({_id:userId},{$set:{username:username,email:email}});

            res.status(201).json({message:"Username Updated Succefully", type:'success'});
        }
        
    }
}

const changePassword = async (req,res)=>{
    const userId = req.user.userId;
    const {currentPassword, newPassword} = req.body;
    const user = await User.findOne({_id:userId});
    if(!user){
        res.status(400).json({message:"No user Found", type:"danger"});
        return;
    }
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if(!isMatch){
        res.status(400).json({
            message:"Your current Password is invalid",type:"danger"
        })
        return;
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.updateOne({_id:userId},{$set:{password: hashedPassword}})
    res.status(201).json({message:"Password Updated Succefully", type:'success'});


}
export {changePassword, updateProfile};