// controllers/payrollController.js
const Payroll = require("../models/Payroll");

const getPayrolls = async (req, res) => {
  const payrolls = await Payroll.find().populate("employeeId");
  res.json(payrolls);
};

const createPayroll = async (req, res) => {
  const payroll = new Payroll(req.body);
  await payroll.save();
  res.status(201).json(payroll);
};

const updatePayroll = async (req, res) => {
  const updatedPayroll = await Payroll.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updatedPayroll);
};

module.exports = { getPayrolls, createPayroll, updatePayroll };