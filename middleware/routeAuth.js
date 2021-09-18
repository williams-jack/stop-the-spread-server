// Middleware to ensure that certain routes are authorized.
const businessRouteAuth = (req, res, next) => {
    // TODO: Create javascript constants/types for roles.
    if (req.session.role != "Business") {
        return res.status(401).json({
            error:
                "You are not authorized to access this content. " +
                "Please sign in with a business account.",
        });
    } else {
        next();
    }
};

const userRouteAuth = (req, res, next) => {
    // TODO: Create javascript constants/types for roles.
    if (req.session.role != "User") {
        return res.status(401).json({
            error:
                "You are not authorized to access this content. " +
                "Please sign in with a user (individual) account.",
        });
    } else {
        next();
    }
};

module.exports = { businessRouteAuth, userRouteAuth };
