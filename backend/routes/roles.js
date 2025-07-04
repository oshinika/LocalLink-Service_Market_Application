// backend/routes/roles.js
import express from "express";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

router.post("/assign", async (req, res) => {
  const userAccessToken = req.headers.authorization?.split(" ")[1];
  const { role } = req.body;

  if (!userAccessToken) return res.status(401).json({ message: "Access token required" });
  if (!role) return res.status(400).json({ message: "Role is required" });

  try {
    // STEP 1: Get user's SCIM ID
    const userResponse = await axios.get(
      `https://api.asgardeo.io/t/${process.env.ASGARDEO_ORG}/scim2/Me`,
      {
        headers: {
          Authorization: `Bearer ${userAccessToken}`,
        },
      }
    );

    const userId = userResponse.data.id;
    if (!userId) throw new Error("User ID not found");

    // STEP 2: Get M2M admin token
    const tokenResponse = await axios.post(
      `https://api.asgardeo.io/t/${process.env.ASGARDEO_ORG}/oauth2/token`,
      new URLSearchParams({
        grant_type: "client_credentials",
        client_id: process.env.M2M_CLIENT_ID,
        client_secret: process.env.M2M_CLIENT_SECRET,
        scope: "internal_role_mgt_view internal_role_mgt_update internal_scim2",
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    const adminToken = tokenResponse.data.access_token;
    if (!adminToken) throw new Error("M2M token fetch failed");

    // STEP 3: Get Role ID by Role Name
    const roleListResponse = await axios.get(
      `https://api.asgardeo.io/t/${process.env.ASGARDEO_ORG}/scim2/v2/Roles`,
      {
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      }
    );

    const matchedRole = roleListResponse.data.Resources.find(
      (r) => r.displayName === role
    );

    if (!matchedRole) {
      return res.status(404).json({ message: `Role '${role}' not found` });
    }

    const roleId = matchedRole.id;

    // STEP 4: Assign user to role
    const patchBody = {
      schemas: ["urn:ietf:params:scim:api:messages:2.0:PatchOp"],
      Operations: [
        {
          op: "add",
          path: "users",
          value: [
            {
              value: userId,
            },
          ],
        },
      ],
    };

    await axios.patch(
      `https://api.asgardeo.io/t/${process.env.ASGARDEO_ORG}/scim2/v2/Roles/${roleId}`,
      patchBody,
      {
        headers: {
          Authorization: `Bearer ${adminToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    return res.status(200).json({ message: "✅ Role assigned successfully" });
  } catch (err) {
    console.error("❌ Failed to assign role:", {
      message: err.message,
      data: err.response?.data,
      status: err.response?.status,
    });

    res.status(err.response?.status || 500).json({
      message: "Role assignment failed",
      error: err.response?.data || err.message,
    });
  }
});

export default router;



