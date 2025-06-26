// import express from "express";
// import cors from "cors";
// import axios from "axios";
// import serviceRoutes from "./routes/serviceRoutes.js";

// const app = express();

// // Allow CORS from your frontend
// app.use(cors({ origin: "http://localhost:5173" }));

// // Parse JSON bodies
// app.use(express.json());

// // Attach your service routes
// app.use("/services", serviceRoutes);

// // SCIM PATCH endpoint for updating user attributes
// let accessToken = "";

// const getAccessToken = async () => {
//   const data = new URLSearchParams({
//     grant_type: "client_credentials",
//     client_id: process.env.CLIENT_ID,
//     client_secret: process.env.CLIENT_SECRET,
//     scope: "internal_scim2 internal_user_mgt_update",
//   });

//   const res = await axios.post(process.env.TOKEN_URL, data);
//   accessToken = res.data.access_token;
// };

// app.patch("/api/update-user", async (req, res) => {
//   const { userId, phone, bio } = req.body;

//   try {
//     if (!accessToken) await getAccessToken();

//     const scimPayload = {
//       Operations: [
//         {
//           op: "replace",
//           value: {
//             phoneNumbers: [{ type: "mobile", value: phone }],
//             "urn:ietf:params:scim:schemas:extension:enterprise:2.0:User": {
//               organization: bio,
//             },
//           },
//         },
//       ],
//       schemas: ["urn:ietf:params:scim:api:messages:2.0:PatchOp"],
//     };

//     const response = await axios.patch(`${process.env.SCIM_URL}/${userId}`, scimPayload, {
//       headers: {
//         Authorization: `Bearer ${accessToken}`,
//         "Content-Type": "application/json",
//       },
//     });

//     res.status(200).json({ message: "User updated successfully" });
//   } catch (error) {
//     console.error("SCIM error:", error.response?.data || error.message);
//     res.status(500).json({ error: "SCIM update failed" });
//   }
// });

// export default app;
