import { Request, Response, NextFunction } from "express";
import { LinksService } from "./links.services";
import { AuthRequest } from "backend/src/shared/middlewares/auth.middleware";

export class LinksController {
    constructor(private readonly service: LinksService) { }

    // ─── Public: Redirect ─────────────────────────────────────────────────────

    /**
     * GET /r/:slug
     * Public — no auth required.
     * Extracts client IP, hands off to service, then 302-redirects.
     */
    redirect = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { slug } = req.params as { slug: string };

            // Extract real client IP (trust proxy headers if behind nginx/load-balancer)
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

    // ─── Protected: Analytics ────────────────────────────────────────────────

    /**
     * GET /links/:id/analytics
     * Requires auth. Returns analytics for the requesting user's link.
     */
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
