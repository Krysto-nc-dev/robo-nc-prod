import asyncHandler from "../middlewares/async.js";
import Classnum from "../models/classnumModel.js";

// @desc    Get all classnums
// @route   GET /api/classnums
// @access  Public
const getClassnums = asyncHandler(async (req, res) => {
  const classnums = await Classnum.find();
  res.status(200).json(classnums);
});

// @desc    Get classnum by CLASSNUM
// @route   GET /api/classnums/:classnum
// @access  Public
const getClassnumByClassnum = asyncHandler(async (req, res) => {
  const classnum = await Classnum.findOne({ CLASSNUM: req.params.classnum });

  if (!classnum) {
    res.status(404);
    throw new Error("Classnum introuvable.");
  }

  res.status(200).json(classnum);
});

export { getClassnums, getClassnumByClassnum };
