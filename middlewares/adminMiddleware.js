import jwt from "jsonwebtoken"
const JWT_SECRET_ADMIN = "HeyAdminPrathamHere"


const verifyTokenAdmin = (req,res,next) => {

  const token = req.headers.authorization;

  

  try{

    const decodedInfo = jwt.verify(token,JWT_SECRET_ADMIN);
    req.id = decodedInfo.id;
    next();
    

  }catch(e){

    res.status(400).json({"message" : "Invalid Jwt"})
  }



}

export {JWT_SECRET_ADMIN,verifyTokenAdmin}