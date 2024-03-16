import { prismaClient } from "../../application/database.js";

const handleUnauthorized = (res) => {
    res.status(401).json({
        errors: "Unauthorized"
    }).end();
};

const isUser = (user, req, res, next) => {
    if (!user) {
        handleUnauthorized(res);
    } else {
        req.user = user;
        next();
    }
}

export const authMiddleware = async (request, response, next) => {
    const token = request.get("Authorization");

    if (!token) {
        handleUnauthorized(response);
    } else {
        const user = await prismaClient.user.findFirst({
            where: {
                token: token
            }
        });

        isUser(user, request, response, next);
    }
};

export const isSuperAdminMiddleware = async (request, response, next) => {
    const token = request.get("Authorization");

    if (!token) {
        handleUnauthorized(response);
    } else {
        const user = await prismaClient.user.findFirst({
            where: {
                token: token,
                role: 'superadmin'
            }
        });

        isUser(user, request, response, next);
    }
};

export const isAdminOrSuperAdminMiddleware = async (request, response, next) => {
    const token = request.get("Authorization");

    if (!token) {
        handleUnauthorized(response);
    } else {
        const user = await prismaClient.user.findFirst({
            where: {
                token: token,
                OR: [
                    { role: "superadmin" },
                    { role: "admin" }
                ]
            }
        });

        isUser(user, request, response, next);
    }
};
