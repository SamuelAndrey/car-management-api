import {prismaClient} from "../../application/database.js";

export const superAdminMiddleware = async (req, res, next) => {
    const token = req.get("Authorization");

    if (!token) {
        res.status(401).json({
            errors: "Unauthorized"
        }).end();
    } else {
        const user = await prismaClient.user.findFirst({
            where: {
                token: token,
                role: 'superadmin'
            }
        });

        if (!user) {
            res.status(401).json({
                errors: "Unauthorized"
            }).end();
        } else {
            req.user = user;
            next();
        }
    }
};