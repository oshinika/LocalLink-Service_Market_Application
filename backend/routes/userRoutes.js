import express from "express";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

router.get("/users", async (req, res) => {
  try {
    const response = await axios.get(
      `${process.env.ASGARDEO_BASE_URL}/scim2/Users`,
      {
        headers: {
          Authorization: `Bearer ${process.env.ASGARDEO_ACCESS_TOKEN}`,
          Accept: "application/scim+json",
        },
      }
    );

    res.json(response.data.Resources); // Only return the users array
  } catch (error) {
    console.error("Error fetching users from Asgardeo:", error.response?.data || error.message);
    res.status(500).json({ message: "Failed to fetch users" });
  }
});

export default router;
