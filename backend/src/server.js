const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: process.env.FRONTEND_URL || "*" }));
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ success: true, message: "Bangalore Pincode Explorer API is running" });
});

app.get("/api/pincode/:pincode", async (req, res) => {
  const { pincode } = req.params;

  if (!/^\d{6}$/.test(pincode)) {
    return res.status(400).json({
      success: false,
      message: "Pincode must be exactly 6 digits."
    });
  }

  try {
    const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);

    if (!response.ok) {
      throw new Error(`Postal API returned ${response.status}`);
    }

    const data = await response.json();
    const result = data?.[0];

    if (!result || result.Status !== "Success" || !Array.isArray(result.PostOffice)) {
      return res.status(404).json({
        success: false,
        message: "No postal areas found for this pincode."
      });
    }

    // Keep the explorer focused on Bangalore/Bengaluru.
    const bangaloreAreas = result.PostOffice.filter((office) => {
      const district = String(office.District || "").toLowerCase();
      const division = String(office.Division || "").toLowerCase();
      return (
        district.includes("bangalore") ||
        district.includes("bengaluru") ||
        division.includes("bangalore") ||
        division.includes("bengaluru")
      );
    });

    if (!bangaloreAreas.length) {
      return res.status(404).json({
        success: false,
        message: "This pincode is not associated with Bangalore/Bengaluru."
      });
    }

    const areas = [...new Set(bangaloreAreas.map((office) => office.Name).filter(Boolean))];

    res.json({
      success: true,
      pincode,
      city: "Bangalore",
      state: "Karnataka",
      areas,
      postOffices: bangaloreAreas.map((office) => ({
        name: office.Name,
        branchType: office.BranchType,
        deliveryStatus: office.DeliveryStatus,
        district: office.District,
        division: office.Division,
        region: office.Region,
        state: office.State
      }))
    });
  } catch (error) {
    console.error(error);
    res.status(502).json({
      success: false,
      message: "Unable to fetch pincode data right now. Please try again."
    });
  }
});

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ success: false, message: "Internal server error." });
});

app.listen(PORT, () => {
  console.log(`API running at http://localhost:${PORT}`);
});