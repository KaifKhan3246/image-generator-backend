import jwt from 'jsonwebtoken'; 

// User authentication middleware
const authUser = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ success: false, message: 'Not Authorized. Login Again' });
        }
        
        const token = authHeader.split(' ')[1];

        // Verify the token using the secret key
        const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);

        // Check if the decoded token contains a user ID
        if (tokenDecode.id) {
            // Attach user ID to the request object so routes do not depend on req.body
            req.userId = tokenDecode.id;
            next();
        } else {
            return res.status(401).json({ success: false, message: 'Not Authorized. Login Again' });
        }
    } catch (error) {
        return res.status(401).json({ success: false, message: error.message });
    }
};

// Export the middleware
export default authUser; 
