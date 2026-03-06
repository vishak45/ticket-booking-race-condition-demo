import jwt from "jsonwebtoken";

const verifyToken = async(req, res, next) => {
    try{ const authHeader = req.headers.token;
    if (authHeader) {
        const token = authHeader.split(" ")[1];
        
        const verify= jwt.verify(token, process.env.JWT_SECRET);
        if (!verify) {
            return res.status(403).json("Token is not valid!");
        }
        req.user = verify;
        next();
    } else {
        return res.status(401).json("You are not authenticated!");
    }}
    catch(err)
    {
        console.log(err);
        res.status(500).json({"message":"internal server error"});
    }
   
};

export default verifyToken;
