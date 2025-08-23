// //find userID by ID
// import jwt from "jsonwebtoken";

// const userAuth = async (req, res, next) => {
//   const {token} = req.headers; // usually comes as 'Bearer <token>'
//   if (!token) {
//     return res.json({ success: false, message: "No token provided, not authorized" });
//   }

//   try {
//     const tokenDecoded = jwt.verify(token, process.env.JWT_SECRET);
//     if (tokenDecoded.id) {
//       req.userId = tokenDecoded.id; // set the userId in request
//     } else {
//       return res.json({ success: false, message: "Not authorized" });
//     }
//      next();
//   } catch (error) {
//     console.error(error);
//     res.json({ success: false, message: error.message });
//   }
// };

// export default userAuth;

// find userID by ID
;import jwt from "jsonwebtoken";

const userAuth = async (req, res, next) => {
  try {
    const { token } = req.headers;  // token should come from headers

    if (!token) {
      return res.json({ success: false, message: "No token provided, not authorized" });
    }

    // Verify token
    const tokenDecoded = jwt.verify(token, process.env.JWT_SECRET);

    if (tokenDecoded.id) {
      req.userId = tokenDecoded.id;  // ✅ safe place to attach userId
      next();
    } else {
      return res.json({ success: false, message: "Not authorized" });
    }
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

export default userAuth;