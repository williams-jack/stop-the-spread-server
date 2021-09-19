// Middleware to ensure that certain routes are authorized.

// Middleware to ensure only Business accounts can access Business-based routes.
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

// Middleware to ensure only User accounts can access User-based routes.
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

// Ensures that the user is logged in to protect routes that require an account to be
// logged in.
const accountLoggedIn = (req, res, next) => {
    if (!req.session) {
        res.sendStaus(401);
    } else {
        next();
    }
};

module.exports = { businessRouteAuth, userRouteAuth, accountLoggedIn };
