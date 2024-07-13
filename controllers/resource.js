import Resource from "../model/resource.js";
import User from "../model/user.js";

export const createResource = async (req, res) => {
  try {
    const { title, description, url, keywords, email } = req.body;
    const user = await User.findOne({ email });

    // Check if req.file exists and get the file path
    const file = req.file ? req.file.path : null;
    console.log(file);

    const resource = new Resource({
      title,
      description,
      url,
      file,
      keywords,
      uploadedBy: user._id,
    });

    await resource.save();
    res.status(201).json(resource);
  } catch (err) {
    console.error("Error creating resource:", err);
    res.status(500).json({ error: err.message });
  }
};
export const getResources = async (req, res) => {
  try {
    const resources = await Resource.find().populate({
      path: "uploadedBy",
      select: "name alumniDetailsId",
      populate: {
        path: "alumniDetailsId",
        model: "AlumniPersonalDetails",
        select: "photo",
      },
    });

    res.status(200).json(resources);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getResourcesByUser = async (req, res) => {
  try {
    const { email } = req.query;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const resources = await Resource.find({ uploadedBy: user._id }).populate({
      path: "uploadedBy",
      select: "name alumniDetailsId",
      populate: {
        path: "alumniDetailsId",
        model: "AlumniPersonalDetails",
        select: "photo",
      },
    });

    res.status(200).json(resources);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getResourceById = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id).populate({
      path: "uploadedBy",
      select: "name alumniDetailsId",
      populate: {
        path: "alumniDetailsId",
        model: "AlumniPersonalDetails",
        select: "photo email phone",
      },
    });

    if (!resource) {
      return res.status(404).json({ error: "Resource not found" });
    }
    res.status(200).json(resource);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
