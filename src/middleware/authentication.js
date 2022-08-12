const jwt = require('jsonwebtoken')

const authentication = async function (req, res, next) {
    try {
      let token = req.headers["authorization"];
  
      if (!token)
        return res.status(403).send({ status: false, msg: "Token is required" });
  
      let token1 = token.split(" ").pop()
  
  
      jwt.verify(token1, "wowTalent-Assignment", { ignoreExpiration: true, }, function (err, decoded) {
        if (err) { return res.status(400).send({ status: false, meessage: "token invalid" }) }
        else {
          if (Date.now() > decoded.exp * 1000) {
            return res.status(401).send({ status: false, msg: "Session Expired", });
          }
         
          req.userName = decoded.user_name;
          next();
        }
      });
    }
    catch (err) {
      return res.status(500).send({ err: err.message })
    }
}
  
module.exports = {authentication}