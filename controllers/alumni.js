import AlumniPersonalDetails from "../model/alumni.js";
import User from "../model/user.js";

// GET all alumni details
export const getAllAlumniDetails = async (req, res) => {
  try {
    // Find all users with userType 'alumni'
    const alumniUsers = await User.find({ usertype: "Alumni" });

    // Check if any users are found
    if (alumniUsers.length === 0) {
      return res.status(404).json({
        message: "No alumni users found",
        success: false,
      });
    }

    // Fetch alumni details for each user
    const alumniDetailsList = await Promise.all(
      alumniUsers.map(async (user) => {
        const alumniDetails = await AlumniPersonalDetails.findById(
          user.alumniDetailsId
        );
        return {
          user: {
            email: user.email,
            name: user.name,
            userType: user.userType,
          },
          alumniDetails,
        };
      })
    );

    res.status(200).json({
      data: alumniDetailsList,
      message: "Alumni details fetched successfully",
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching alumni details",
      success: false,
      error,
    });
  }
};


export const getAlumniDetails = async (req, res) => {
  const { email } = req.query;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: `User with email ${email} not found`,
        success: false,
      });
    }

    const alumniDetails = await AlumniPersonalDetails.findById(
      user.alumniDetailsId
    );

    if (!alumniDetails) {
      return res.status(404).json({
        message: "Alumni details not found",
        success: false,
      });
    }

    // Combine user data and alumniDetails data
    const combinedData = {
      user: {
        email: user.email,
        name: user.name,
        userType: user.userType, // Corrected typo: usertype to userType
      },
      alumniDetails,
    };

    res.status(200).json({
      data: combinedData,
      message: "Alumni details fetched successfully",
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching alumni details",
      success: false,
      error,
    });
  }
};

// POST create a new alumni
export const createAlumni = async (req, res) => {
  const alumni = req.body;

  try {
    const newAlumni = await AlumniPersonalDetails.create(alumni);
    res.status(201).json(newAlumni);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// PUT update alumni details (with file upload handling)
export const updateAlumniDetails = async (req, res) => {
  const { email, alumniDetails } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    const alumniDetailsId = user.alumniDetailsId;

    // Handle file upload if photo exists in req.file
    if (req.file) {
      const photoBase64 = req.file.buffer.toString("base64");
      alumniDetails.photo = `data:${req.file.mimetype};base64,${photoBase64}`;
    }

    const updatedDetails = await AlumniPersonalDetails.findByIdAndUpdate(
      alumniDetailsId,
      alumniDetails,
      { new: true }
    );

    res.status(200).json({
      message: "Alumni details updated successfully",
      success: true,
      data: updatedDetails,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating alumni details",
      success: false,
      error,
    });
  }
};

// DELETE delete alumni by ID
export const deleteAlumni = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedAlumni = await AlumniPersonalDetails.findByIdAndRemove(id);
    if (!deletedAlumni) {
      return res.status(404).json({ message: "Alumni not found" });
    }
    res.status(200).json({ message: "Alumni deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
