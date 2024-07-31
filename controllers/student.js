import StudentPersonalDetails from "../model/student.js";
import User from "../model/user.js";

// GET all student details
export const getAllStudentDetails = async (req, res) => {
  try {
    // Find all users with userType 'student'
    const studentUsers = await User.find({ usertype: "Student" });

    // Check if any users are found
    if (studentUsers.length === 0) {
      return res.status(404).json({
        message: "No student users found",
        success: false,
      });
    }

    // Fetch student details for each user
    const studentDetailsList = await Promise.all(
      studentUsers.map(async (user) => {
        const studentDetails = await StudentPersonalDetails.findById(
          user.studentDetailsId
        );
        return {
          user: {
            email: user.email,
            name: user.name,
            userType: user.userType,
          },
          studentDetails,
        };
      })
    );

    res.status(200).json({
      data: studentDetailsList,
      message: "Student details fetched successfully",
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching student details",
      success: false,
      error,
    });
  }
};

export const getStudentDetails = async (req, res) => {
  const { email } = req.query;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: `User with email ${email} not found`,
        success: false,
      });
    }

    const studentDetails = await StudentPersonalDetails.findById(
      user.studentDetailsId
    );

    if (!studentDetails) {
      return res.status(404).json({
        message: "Student details not found",
        success: false,
      });
    }

    // Combine user data and studentDetails data
    const combinedData = {
      user: {
        email: user.email,
        name: user.name,
        userType: user.userType, // Corrected typo: usertype to userType
      },
      studentDetails,
    };

    res.status(200).json({
      data: combinedData,
      message: "Student details fetched successfully",
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching student details",
      success: false,
      error,
    });
  }
};

// POST create a new student
export const createStudent = async (req, res) => {
  const student = req.body;

  try {
    const newStudent = await StudentPersonalDetails.create(student);
    res.status(201).json(newStudent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT update student details (with file upload handling)
export const updateStudentDetails = async (req, res) => {
  const { email, studentDetails } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    const studentDetailsId = user.studentDetailsId;

    // Handle file upload if photo exists in req.file
    if (req.file) {
      const photoBase64 = req.file.buffer.toString("base64");
      studentDetails.photo = `data:${req.file.mimetype};base64,${photoBase64}`;
    }

    const updatedDetails = await StudentPersonalDetails.findByIdAndUpdate(
      studentDetailsId,
      studentDetails,
      { new: true }
    );

    res.status(200).json({
      message: "Student details updated successfully",
      success: true,
      data: updatedDetails,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating student details",
      success: false,
      error,
    });
  }
};

// DELETE delete student by ID
export const deleteStudent = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedStudent = await StudentPersonalDetails.findByIdAndRemove(id);
    if (!deletedStudent) {
      return res.status(404).json({ message: "Student not found" });
    }
    res.status(200).json({ message: "Student deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
