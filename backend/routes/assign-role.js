import express from "express";
import axios from "axios";

const router = express.Router();

router.post("/assign-role", async (req, res) => {
  const accessToken = req.headers.authorization?.split(" ")[1];
  const { role } = req.body;

  if (!accessToken) return res.status(401).json({ message: "Access token missing" });
  if (!role) return res.status(400).json({ message: "Role is required" });

  try {
    const patchBody = {
      schemas: ["urn:ietf:params:scim:api:messages:2.0:PatchOp"],
      Operations: [
        {
          op: "add",
          path: "roles",
          value: [{ value: `Internal/${role}` }],
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

    res.status(200).json({ message: "Role assigned successfully" });
  } catch (err) {
    console.error("❌ Role assignment failed:", err.response?.data || err.message);
    res.status(err.response?.status || 500).json({
      message: "Failed to assign role",
      error: err.response?.data || err.message,
    });
  }
});

export default router;
