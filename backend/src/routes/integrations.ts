import { Router } from "express";
import { asyncHandler } from "../middleware/asyncHandler";
import { sendSuccess } from "../lib/response";
import { testGoogleConnection } from "../services/googleService";
import { testZoomConnection } from "../services/zoomService";

const router = Router();

/* GET /api/integrations/status
   Returns real connection status for each integration */
router.get(
  "/status",
  asyncHandler(async (_req, res) => {
    // Run checks in parallel for speed
    const [googleConnected, zoomConnected] = await Promise.allSettled([
      testGoogleConnection(),
      testZoomConnection(),
    ]);

    const googleOk =
      googleConnected.status === "fulfilled" && googleConnected.value === true;
    const zoomOk =
      zoomConnected.status === "fulfilled" && zoomConnected.value === true;

    sendSuccess(res, {
      googleCalendar: googleOk,
      googleMeet: googleOk, // Meet uses same Google OAuth
      zoom: zoomOk,
      // Static integrations (not implemented yet)
      outlookCalendar: false,
      microsoftTeams: false,
      slack: false,
      hubspot: false,
      salesforce: false,
      stripe: false,
      zapier: false,
      webhooks: false,
      googleAnalytics: false,
    });
  })
);

export default router;
