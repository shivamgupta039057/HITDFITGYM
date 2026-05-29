const Plan = require("../models/plan.models");

const createPlan = async (req, res) => {

  try {

    const plan = await Plan.create(req.body);

    return res.status(201).json({
      status: 201,
      message: "Plan created successfully",
      data: plan,
    });

  } catch (error) {

    return res.status(500).json({
      status: 500,
      message: error.message,
    });

  }

};

const getPlans = async (req, res) => {

  try {

    const plans = await Plan.find({
      status: true,
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      status: 200,
      data: plans,
    });

  } catch (error) {

    return res.status(500).json({
      status: 500,
      message: error.message,
    });

  }

};


const editPlan = async (req, res) => {

  try {
console.log("dsfhkjdslslfsdjlkfdshksfdljskjjfdslkfnjkldfsjfkjdfskljldkfsj")
    const {

      planId,

      planName,
      duration,
      price,
      description,

    } = req.body;

    // Check Plan
    const plan =
    await Plan.findById(planId);

    console.log("planplanplanplanplanplan" , plan);
    

    if (!plan) {

      return res.status(404).json({

        status: 404,

        message: "Plan not found",

      });

    }

    // Update Plan
    const updatedPlan =
    await Plan.findByIdAndUpdate(

      planId,

      {

        planName,
        duration,
        price,
        description,

      },

      {
        new: true,
      }

    );

    return res.status(200).json({

      status: 200,

      message:
        "Plan updated successfully",

      data: updatedPlan,

    });

  } catch (error) {

    return res.status(500).json({

      status: 500,

      message: error.message,

    });

  }

};


const deletePlan = async (req, res) => {

  try {

    const { id } = req.body;

    await Plan.findByIdAndDelete(id);

    return res.status(200).json({
      status: 200,
      message: "Plan deleted successfully",
    });

  } catch (error) {

    return res.status(500).json({
      status: 500,
      message: error.message,
    });

  }

};

module.exports = {
  createPlan,
  getPlans,
  editPlan,
  deletePlan,
};