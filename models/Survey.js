const mongoose = require("mongoose");

const FilterSchema = new mongoose.Schema({
  country: [String],
  state: [String],
  city: [String],
  age_range: { min: Number, max: Number },
  gender: [String],
  visible_to_all: { type: Boolean, default: false }
});

const SurveySchema = new mongoose.Schema({
  client_name: { type: String, required: true },
  client_country: { type: String, required: true },
  survey_name: { type: String, required: true },
  survey_description: { type: String },
  survey_url: { type: String },
  start_date: { type: Date },
  end_date: { type: Date },
  duration: { type: Number }, // in minutes
  quota: { type: Number },
  filters: FilterSchema,
  status: { type: Boolean, default: false },
  created_by: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Survey", SurveySchema);
