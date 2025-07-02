
import express from "express";
import axios from "axios";

const router = express.Router();

// GET /api/profile/me - get current user's profile
router.get("/me", async (req, res) => {
  try {
    const accessToken = req.headers.authorization?.split(" ")[1];
    if (!accessToken) return res.status(401).json({ message: "Access token missing" });

    const response = await axios.get(
      `https://api.asgardeo.io/t/${process.env.ASGARDEO_ORG}/scim2/Me`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    res.status(200).json(response.data);
  } catch (err) {
    console.error("❌ Failed to fetch profile:", err.response?.data || err.message);
    res.status(err.response?.status || 500).json({
      message: "Fetching profile failed",
      error: err.response?.data || err.message,
    });
  }
});

// PATCH /api/profile/update - update user's profile
router.patch("/update", async (req, res) => {
  try {
    const accessToken = req.headers.authorization?.split(" ")[1];
    if (!accessToken) return res.status(401).json({ message: "Access token missing" });

    const patchBody = {
      schemas: ["urn:ietf:params:scim:api:messages:2.0:PatchOp"],
      Operations: [
        {
          op: "replace",
          path: "name.givenName",
          value: req.body.givenName,
        },
        {
          op: "replace",
          path: "name.familyName",
          value: req.body.familyName,
        },
      ],
    };

    const response = await axios.patch(
      `https://api.asgardeo.io/t/${process.env.ASGARDEO_ORG}/scim2/Me`,
      patchBody,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/scim+json",
        },
      }
    );

    res.status(200).json({ message: "Profile updated successfully" });
  } catch (err) {
    console.error("❌ Failed to update profile:", err.response?.data || err.message);
    res.status(err.response?.status || 500).json({
      message: "Profile update failed",
      error: err.response?.data || err.message,
    });
  }
});

export default router;
