import express from "express";
import axios from "axios";
import { checkJwt, authorizeRoles } from "../middleware/auth.js";

const router = express.Router();

router.get(
  "/asgardeo-users",
  checkJwt,
  authorizeRoles("admin"),
  async (req, res) => {
    try {
      // Get client credentials token to call SCIM API
      const tokenResponse = await axios.post(
        `https://api.asgardeo.io/t/${process.env.ASGARDEO_ORG}/oauth2/token`,
        new URLSearchParams({
          grant_type: "client_credentials",
          scope: "internal_user_mgt_list internal_user_mgt_view",
        }),
        {
          auth: {
            username: process.env.ASGARDEO_ADMIN_CLIENT_ID,
            password: process.env.ASGARDEO_ADMIN_CLIENT_SECRET,
          },
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      const accessToken = tokenResponse.data.access_token;

      // Fetch users from SCIM API
      const usersResponse = await axios.get(
        `https://api.asgardeo.io/t/${process.env.ASGARDEO_ORG}/scim2/Users`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const users = usersResponse.data.Resources.map((user) => ({
        id: user.id || "",
        username: user.userName || "",
        emails: Array.isArray(user.emails) ? user.emails.map(emailObj => emailObj.value) : [],
        firstName: user.name?.givenName || "",
        lastName: user.name?.familyName || "",
        roles: user.roles?.map((r) => r.display) || [],
        phone: user.phoneNumbers?.[0]?.value || "",
      }));

      res.json(users);
    } catch (error) {
      console.error(
        "❌ Error fetching users from Asgardeo:",
        error.response?.data || error.message
      );
      res.status(500).json({ message: "Failed to fetch users from Asgardeo" });
    }
  }
);

export default router;
