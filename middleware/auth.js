import jwt from "jsonwebtoken"

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided, authorization denied" })
  }

  const token = authHeader.split(" ")[1]

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.userId = decoded.userId
    req.tenantId = decoded.tenantId
    req.storeId = decoded.storeId
    req.role = decoded.role
    next()
  } catch (err) {
    console.error("Token verification error:", err)
    res.status(403).json({ message: "Token is not valid" })
  }
}

export default authMiddleware
