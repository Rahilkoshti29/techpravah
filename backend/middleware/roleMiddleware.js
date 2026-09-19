export const authorize = (...allowedRoles) => { //["author","admin"]
    return (req, res, next) => {
  
      if (!req.user) {
        return res.status(401).json({
          message: "Not authorized. Please login first."
        });
      }
  
      if (!allowedRoles.includes(req.user.role)) {
        return res.status(403).json({
          message: "You do not have permission to perform this action."
        });
      }
  
      next();
    };
  };