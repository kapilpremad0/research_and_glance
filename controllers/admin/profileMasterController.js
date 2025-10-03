const ProfileMaster = require('../../models/ProfileMaster'); // ProfileMaster model
const path = require('path');
const fs = require('fs');

// List all Profile Masters
exports.getList = async (req, res) => {
    try {
        res.render('admin/profileMasters/list', { title: "Profile Masters" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Show Create Form
exports.create = async (req, res) => {
    try {
        res.render('admin/profileMasters/create', {
            title: "Create Profile Master",
            profile: null
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Show Edit Form
exports.edit = async (req, res) => {
    try {
        const profile = await ProfileMaster.findById(req.params.id);
        if (!profile) return res.status(404).send("Profile Master not found");

        res.render('admin/profileMasters/create', {
            title: "Edit Profile Master",
            profile
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get Profile Master Details
exports.getDetail = async (req, res) => {
    try {
        const profileMaster = await ProfileMaster.findById(req.params.id);
        if (!profileMaster) return res.status(404).send("Profile Master not found");

        res.render('admin/profileMasters/show', {
            title: "Profile Master Details",
            profileMaster
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Delete Profile Master
exports.deleteRecord = async (req, res) => {
    try {
        const profileMaster = await ProfileMaster.findById(req.params.id);
        if (!profileMaster) return res.status(404).json({ error: "Profile Master not found" });

        await ProfileMaster.findByIdAndDelete(req.params.id);

        res.json({ message: "Profile Master deleted successfully" });
    } catch (err) {
        console.error("Error deleting Profile Master:", err);
        res.status(500).json({ message: "Error deleting Profile Master", error: err.message });
    }
};

// Fetch data for datatables or AJAX
exports.getData = async (req, res) => {
    try {
        const draw = parseInt(req.body.draw) || 0;
        const start = parseInt(req.body.start) || 0;
        const length = parseInt(req.body.length) || 10;
        const search = req.body.search?.value || "";

        const query = {};
        if (search) {
            query.$or = [
                { profile_name: new RegExp(search, "i") },
                { "questions.question_text": new RegExp(search, "i") }
            ];
        }

        const totalRecords = await ProfileMaster.countDocuments();
        const filteredRecords = await ProfileMaster.countDocuments(query);

        const data_fetch = await ProfileMaster.find(query)
            .sort({ created_at: -1 })
            .skip(start)
            .limit(length)
            .exec();

        const data = data_fetch.map((profile, index) => ({
            serial: start + index + 1,
            _id: profile._id,
            earn_point: profile.earn_point,
            image: profile.image,
            profile_name: profile.profile_name,
            created_at: profile.created_at,
            questions: profile.questions.map(q =>
                `<div><b>${q.question_text}</b> (${q.type}) ${q.options.length ? " → " + q.options.join(", ") : ""}</div>`
            ).join(""),
            action: `
                <a href="/admin/profileMaster/edit/${profile._id}" class="btn btn-sm btn-warning">Edit</a>
                <button data-id="${profile._id}" class="btn btn-sm btn-danger deleteProfileMaster">Delete</button>
            `
        }));

        res.json({
            draw,
            recordsTotal: totalRecords,
            recordsFiltered: filteredRecords,
            data
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Store New Profile Master
exports.storeData = async (req, res) => {
    try {
        const { profile_name, questions, earn_point = [] } = req.body;
        const image = req.files?.image?.[0] ?? null; // uploaded profile image (if exists)

        console.log(req.body);

        const errors = {};
        if (!profile_name) errors.profile_name = "Profile name is required";
        if (!earn_point) errors.profile_name = "Profile name is required";
        if (!questions.length) errors.questions = "At least one question is required";

        if (Object.keys(errors).length > 0) return res.status(400).json({ errors });

        const profileMaster = await ProfileMaster.create({
            profile_name,
            questions,
            earn_point,
            image: image ? image.filename : "",
        });

        res.status(201).json({
            message: "Profile Master created successfully",
            data: profileMaster
        });

    } catch (err) {
        console.error("Error saving Profile Master:", err);
        res.status(500).json({ error: "Failed to save Profile Master. Please try again later." });
    }
};

// Update Existing Profile Master
exports.updateData = async (req, res) => {
    try {
        const image = req.files?.image?.[0] ?? null; // uploaded profile image (if exists)
        const profileMasterId = req.params.id;
        const profileMaster = await ProfileMaster.findById(profileMasterId);
        if (!profileMaster) return res.status(404).json({ error: "Profile Master not found" });

        const { profile_name, questions , earn_point = [] } = req.body;


        const errors = {};
        if (!profile_name) errors.profile_name = "Profile name is required";
        if (!earn_point) errors.earn_point = "Earn Point is required";
        if (!questions.length) errors.questions = "At least one question is required";

        if (Object.keys(errors).length > 0) return res.status(400).json({ errors });

        profileMaster.profile_name = profile_name;
        profileMaster.questions = questions;
         profileMaster.image = image ? image.filename : profileMaster.image;

        await profileMaster.save();

        res.status(200).json({
            message: "Profile Master updated successfully",
            data: profileMaster
        });

    } catch (err) {
        console.error("Error updating Profile Master:", err);
        res.status(500).json({ error: "Failed to update Profile Master. Please try again later." });
    }
};
