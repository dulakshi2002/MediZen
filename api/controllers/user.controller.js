import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";
import bcryptjs from "bcryptjs";

export const test = (req, res) => {
  res.json({
    message: "API is working!",
  });
};
export const verifyAdmin = (req, res, next) => {
  const token = req.cookies.access_token;
  if (!token) return next(errorHandler(401, "Unauthorized access!"));

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return next(errorHandler(403, "Invalid token!"));
    if (!decoded.isAdmin)
      return next(errorHandler(403, "Admin access required!"));
    req.user = decoded;
    next();
  });
};
// update user

export const updateUser = async (req, res, next) => {
  try {
    if (req.body.password) {
      req.body.password = bcryptjs.hashSync(req.body.password, 10);
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found!" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          username: req.body.username,
          name: req.body.name, // Add this
          email: req.body.email,
          password: req.body.password,
          profilePicture: req.body.profilePicture,
          isAdmin: user.isAdmin,
        },
      },
      { new: true }
    );

    const { password, ...rest } = updatedUser._doc;
    res.status(200).json({ ...rest, isAdmin: updatedUser.isAdmin });
  } catch (error) {
    next(error);
  }
};


export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({}, "username email profilePicture isAdmin"); // Exclude password
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

// delete user
export const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id); // Find the user making the request

    if (!user) {
      return next(errorHandler(404, "User not found"));
    }

    // Only allow deletion if the user is an admin or if the user is deleting their own account
    if (user.isAdmin || req.user.id === req.params.id) {
      await User.findByIdAndDelete(req.params.id);
      return res
        .status(200)
        .json({ message: "User has been deleted successfully." });
    } else {
      return next(
        errorHandler(403, "You do not have permission to delete this account.")
      );
    }
  } catch (error) {
    next(error);
  }
};

// Get all users except doctors and admins
export const getAllNonDoctorsAndAdmins = async (req, res, next) => {
  try {
    const users = await User.find(
      { isDoctor: false, isAdmin: false },
      "username"
    );
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

export const getAllPatients = async (req, res) => {
  try {
    // Fetch users who are not admins or doctors
    const patients = await User.find(
      { isAdmin: false, isDoctor: false },
      "username email profilePicture name"
    );
    res.status(200).json(patients);
  } catch (error) {
    res.status(500).json({ message: "Error fetching patients" });
  }
};

// for treatment purpose

export const updateUserAttributes = async (req, res, next) => {
  try {
    const { name, age, weight, height } = req.body;

    // Ensure the request contains valid data for these attributes
    const updates = {};
    if (name !== undefined) updates.name = name;
    if (age !== undefined) updates.age = age;
    if (weight !== undefined) updates.weight = weight;
    if (height !== undefined) updates.height = height;

    if (Object.keys(updates).length === 0) {
      return next(
        errorHandler(400, "No valid attributes provided for update.")
      );
    }

    // Find the user by ID and update the specific fields
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true }
    );

    if (!updatedUser) {
      return next(errorHandler(404, "User not found."));
    }

    res.status(200).json({
      message: "User attributes updated successfully.",
      name: updatedUser.name,
      age: updatedUser.age,
      weight: updatedUser.weight,
      height: updatedUser.height,
    });
  } catch (error) {
    next(error);
  }
};

export const getUserAttributes = async (req, res, next) => {
  try {
    // Find the user by ID and include the `name` field
    const user = await User.findById(req.params.id, "name age weight height");

    if (!user) {
      return next(errorHandler(404, "User not found."));
    }

    // Return the specific attributes including `name`
    res.status(200).json({
      name: user.name,
      age: user.age,
      weight: user.weight,
      height: user.height,
    });
  } catch (error) {
    next(error);
  }
};
