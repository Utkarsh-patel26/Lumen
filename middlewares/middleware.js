import jwt from "jsonwebtoken"


const JWT_SECRET = "HeyPratham"



const verifyToken = (req,res,next) => {

  const token = req.headers.authorization;

  

  try{

    const decodedInfo = jwt.verify(token,JWT_SECRET);
    req.id = decodedInfo.id;
    next();
    

  }catch(e){

    res.status(400).json({"message" : "Invalid Jwt"})
  }



}

export {JWT_SECRET,verifyToken}