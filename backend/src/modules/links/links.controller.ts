import { Request, Response, NextFunction } from "express";
import { LinksService } from "./links.services";
import { AuthRequest } from "backend/src/shared/middlewares/auth.middleware";

export class LinksController {
    constructor(private readonly service: LinksService) { }


    redirect = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { slug } = req.params as { slug: string };

            const forwardedFor = req.headers["x-forwarded-for"];
            const rawIp =
                (Array.isArray(forwardedFor) ? forwardedFor[0] : forwardedFor)?.split(",")[0]?.trim() ??
                req.socket.remoteAddress;

            const userAgent = req.headers["user-agent"];

            const destinationUrl = await this.service.handleRedirect(slug, rawIp, userAgent);

            res.redirect(302, destinationUrl);
        } catch (error) {
            next(error);
        }
    };


  
    getAnalytics = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { id: linkId } = req.params as { id: string };
            const userId = req.user!.id;

            const data = await this.service.getLinkAnalytics(linkId, userId);

            res.status(200).json({
                success: true,
                data,
            });
        } catch (error) {
            next(error);
        }
    };
}
