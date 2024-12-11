import asyncHandler from "../middlewares/async.js";
import FactureDetails from "../models/qc/factureDetailsModel.js";
import ExcelJS from "exceljs";

// @desc    Get all facture details with pagination and filters
// @route   GET /api/facture-details
// @access  Public
const getFactureDetails = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, sort = "createdAt", order = "desc", search, filter } = req.query;

  const pageNumber = parseInt(page, 10);
  const pageSize = parseInt(limit, 10);

  const queryFilters = {};

  if (search) {
    queryFilters.$or = [
      { NUMFACT: { $regex: search, $options: "i" } },
      { NART: { $regex: search, $options: "i" } },
      { DESIGN: { $regex: search, $options: "i" } },
    ];
  }

  if (filter) {
    const parsedFilter = JSON.parse(filter);
    Object.entries(parsedFilter).forEach(([key, value]) => {
      queryFilters[key] = value;
    });
  }

  const totalItems = await FactureDetails.countDocuments(queryFilters);

  const factureDetails = await FactureDetails.find(queryFilters)
    .sort({ [sort]: order === "desc" ? -1 : 1 })
    .skip((pageNumber - 1) * pageSize)
    .limit(pageSize);

  res.status(200).json({
    page: pageNumber,
    limit: pageSize,
    totalItems,
    totalPages: Math.ceil(totalItems / pageSize),
    factureDetails,
  });
});

// @desc    Get facture details by NUMFACT
// @route   GET /api/facture-details/:numfact
// @access  Public
const getFactureDetailsByNumfact = asyncHandler(async (req, res) => {
  const factureDetails = await FactureDetails.find({ NUMFACT: req.params.numfact });

  if (!factureDetails || factureDetails.length === 0) {
    res.status(404);
    throw new Error("Aucun détail trouvé pour ce numéro de facture.");
  }

  res.status(200).json(factureDetails);
});

// @desc    Export facture details by NUMFACT to Excel
// @route   GET /api/facture-details/export/:numfact
// @access  Public
const exportFactureDetailsByNumfactToExcel = asyncHandler(async (req, res) => {
  const factureDetails = await FactureDetails.find({ NUMFACT: req.params.numfact });

  if (!factureDetails || factureDetails.length === 0) {
    res.status(404);
    throw new Error("Aucun détail trouvé pour ce numéro de facture.");
  }

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Facture Details");

  worksheet.columns = [
    { header: "Numéro de Facture", key: "NUMFACT", width: 15 },
    { header: "Code Article", key: "NART", width: 10 },
    { header: "Désignation", key: "DESIGN", width: 30 },
    { header: "Quantité", key: "QTE", width: 10 },
    { header: "Prix Vente", key: "PVTE", width: 15 },
    { header: "Prix Prévu", key: "PREV", width: 15 },
    { header: "Pourcentage", key: "POURC", width: 10 },
    { header: "Prix TTC", key: "PVTTC", width: 15 },
  ];

  factureDetails.forEach((detail) => {
    worksheet.addRow({
      NUMFACT: detail.NUMFACT,
      NART: detail.NART,
      DESIGN: detail.DESIGN,
      QTE: detail.QTE,
      PVTE: detail.PVTE,
      PREV: detail.PREV,
      POURC: detail.POURC,
      PVTTC: detail.PVTTC,
    });
  });

  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );
  res.setHeader(
    "Content-Disposition",
    `attachment; filename="facture-details-${req.params.numfact}.xlsx"`
  );

  await workbook.xlsx.write(res);
  res.end();
});

// @desc    Export facture details by date to Excel
// @route   GET /api/facture-details/export/date/:date
// @access  Public
const exportFactureDetailsByDateToExcel = asyncHandler(async (req, res) => {
  const date = new Date(req.params.date);
  const factureDetails = await FactureDetails.find({
    createdAt: {
      $gte: date.setHours(0, 0, 0, 0),
      $lt: date.setHours(23, 59, 59, 999),
    },
  });

  if (!factureDetails || factureDetails.length === 0) {
    res.status(404);
    throw new Error("Aucun détail trouvé pour cette date.");
  }

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Facture Details");

  worksheet.columns = [
    { header: "Numéro de Facture", key: "NUMFACT", width: 15 },
    { header: "Code Article", key: "NART", width: 10 },
    { header: "Désignation", key: "DESIGN", width: 30 },
    { header: "Quantité", key: "QTE", width: 10 },
    { header: "Prix Vente", key: "PVTE", width: 15 },
    { header: "Prix Prévu", key: "PREV", width: 15 },
    { header: "Pourcentage", key: "POURC", width: 10 },
    { header: "Prix TTC", key: "PVTTC", width: 15 },
  ];

  factureDetails.forEach((detail) => {
    worksheet.addRow({
      NUMFACT: detail.NUMFACT,
      NART: detail.NART,
      DESIGN: detail.DESIGN,
      QTE: detail.QTE,
      PVTE: detail.PVTE,
      PREV: detail.PREV,
      POURC: detail.POURC,
      PVTTC: detail.PVTTC,
    });
  });

  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );
  res.setHeader(
    "Content-Disposition",
    `attachment; filename="facture-details-date-${req.params.date}.xlsx"`
  );

  await workbook.xlsx.write(res);
  res.end();
});

export {
  getFactureDetails,
  getFactureDetailsByNumfact,
  exportFactureDetailsByNumfactToExcel,
  exportFactureDetailsByDateToExcel,
};
