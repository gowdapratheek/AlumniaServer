import AlumniPersonalDetails from "../model/alumni.js";

// GET all alumni
export const getAllAlumni = async (req, res) => {
  try {
    const alumni = await AlumniPersonalDetails.find();
    res.status(200).json(alumni);
  } catch (error) {
    res.status(500).json({ message: error.message });
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

// PUT update alumni details
export const updateAlumni = async (req, res) => {
  const { id } = req.params;
  const updatedAlumni = req.body;

  try {
    const alumni = await AlumniPersonalDetails.findByIdAndUpdate(
      id,
      updatedAlumni,
      { new: true }
    );
    if (!alumni) {
      return res.status(404).json({ message: "Alumni not found" });
    }
    res.status(200).json(alumni);
  } catch (error) {
    res.status(500).json({ message: error.message });
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
