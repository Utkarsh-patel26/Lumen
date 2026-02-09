import jwt from "jsonwebtoken"
const JWT_SECRET_USER = "HeyUserPrathamHere"

const verifyTokenUser = (req,res,next) => {

  const token = req.headers.authorization;

  

  try{

    const decodedInfo = jwt.verify(token,JWT_SECRET_USER);
    req.id = decodedInfo.id;
    next();
    

  }catch(e){

    res.status(400).json({"message" : "Invalid Jwt"})
  }



}

export {JWT_SECRET_USER,verifyTokenUser}