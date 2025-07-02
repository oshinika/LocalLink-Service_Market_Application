import Service from "../models/Service.js";
import path from "path";
import fs from "fs";


export const getAllServices = async (req, res) => {
  try {
    const services = await Service.find().sort({ createdAt: -1 });
    res.json(services);
  } catch (err) {
    console.error("Error fetching services:", err);
    res.status(500).json({ message: "Server error" });
  }
};


export const createService = async (req, res) => {
  try {
    const { title, description, provider_user_id } = req.body;
    let photoUrl = null;

    if (!title || !description || !provider_user_id) {
      return res.status(400).json({ message: "Please provide all required fields" });
    }

    if (req.file) {
      photoUrl = `/uploads/${req.file.filename}`;
    }

    const newService = new Service({
      title,
      description,
      provider_user_id,
      photo: photoUrl,
    });

    const savedService = await newService.save();
    res.status(201).json(savedService);
  } catch (err) {
    console.error("Error creating service:", err);
    res.status(500).json({ message: "Server error" });
  }
};


export const updateService = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, provider_user_id } = req.body;

    if (!title || !description || !provider_user_id) {
      return res.status(400).json({ message: "Please provide all required fields" });
    }

    const service = await Service.findById(id);
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    if (service.provider_user_id !== provider_user_id) {
      return res.status(403).json({ message: "Unauthorized to update this service" });
    }

    if (req.file) {
      if (service.photo) {
        const oldPhotoPath = path.join(process.cwd(), "uploads", path.basename(service.photo));
        if (fs.existsSync(oldPhotoPath)) {
          fs.unlinkSync(oldPhotoPath);
        }
      }
      service.photo = `/uploads/${req.file.filename}`;
    }

    service.title = title;
    service.description = description;

    const updatedService = await service.save();
    res.json(updatedService);
  } catch (err) {
    console.error("Error updating service:", err);
    res.status(500).json({ message: "Server error" });
  }
};


export const deleteService = async (req, res) => {
  try {
    const { id } = req.params;
    const { provider_user_id } = req.body;

    const service = await Service.findById(id);
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    if (service.provider_user_id !== provider_user_id) {
      return res.status(403).json({ message: "Unauthorized to delete this service" });
    }

    if (service.photo) {
      const photoPath = path.join(process.cwd(), "uploads", path.basename(service.photo));
      if (fs.existsSync(photoPath)) {
        fs.unlinkSync(photoPath);
      }
    }

    await Service.findByIdAndDelete(id);
    res.json({ message: "Service deleted successfully" });
  } catch (err) {
    console.error("Error deleting service:", err);
    res.status(500).json({ message: "Server error" });
  }
};