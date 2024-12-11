import asyncHandler from "../middlewares/async.js";
import Facture from "../models/qc/factureModel.js";
import ExcelJS from "exceljs";

// @desc    Get all factures with pagination and filters
// @route   GET /api/factures
// @access  Public
const getFactures = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, sort = "createdAt", order = "desc", search, filter } = req.query;

  const pageNumber = parseInt(page, 10);
  const pageSize = parseInt(limit, 10);

  const queryFilters = {};

  if (search) {
    queryFilters.$or = [
      { NUMFACT: { $regex: search, $options: "i" } },
      { TEXTE: { $regex: search, $options: "i" } },
    ];
  }

  if (filter) {
    const parsedFilter = JSON.parse(filter);
    Object.entries(parsedFilter).forEach(([key, value]) => {
      queryFilters[key] = value;
    });
  }

  const totalItems = await Facture.countDocuments(queryFilters);

  const factures = await Facture.find(queryFilters)
    .sort({ [sort]: order === "desc" ? -1 : 1 })
    .skip((pageNumber - 1) * pageSize)
    .limit(pageSize);

  res.status(200).json({
    page: pageNumber,
    limit: pageSize,
    totalItems,
    totalPages: Math.ceil(totalItems / pageSize),
    factures,
  });
});

// @desc    Get facture by NUMFACT
// @route   GET /api/factures/:numfact
// @access  Public
const getFactureByNumfact = asyncHandler(async (req, res) => {
  const facture = await Facture.findOne({ NUMFACT: req.params.numfact });

  if (!facture) {
    res.status(404);
    throw new Error("Facture introuvable.");
  }

  res.status(200).json(facture);
});

// @desc    Get factures by DATFACT
// @route   GET /api/factures/date
// @access  Public
const getFacturesByDate = asyncHandler(async (req, res) => {
  const { date, page = 1, limit = 20, sort = "createdAt", order = "desc" } = req.query;

  if (!date) {
    res.status(400);
    throw new Error("La date est requise pour cette requête.");
  }

  const pageNumber = parseInt(page, 10);
  const pageSize = parseInt(limit, 10);

  const queryFilters = {
    DATFACT: {
      $gte: new Date(date).setHours(0, 0, 0, 0),
      $lt: new Date(date).setHours(23, 59, 59, 999),
    },
  };

  const totalItems = await Facture.countDocuments(queryFilters);

  const factures = await Facture.find(queryFilters)
    .sort({ [sort]: order === "desc" ? -1 : 1 })
    .skip((pageNumber - 1) * pageSize)
    .limit(pageSize);

  res.status(200).json({
    page: pageNumber,
    limit: pageSize,
    totalItems,
    totalPages: Math.ceil(totalItems / pageSize),
    factures,
  });
});

// @desc    Export factures by date to Excel
// @route   GET /api/factures/export
// @access  Public
const exportFacturesToExcel = asyncHandler(async (req, res) => {
  const { date } = req.query;

  if (!date) {
    res.status(400);
    throw new Error("La date est requise pour cette requête.");
  }

  const queryFilters = {
    DATFACT: {
      $gte: new Date(date).setHours(0, 0, 0, 0),
      $lt: new Date(date).setHours(23, 59, 59, 999),
    },
  };

  const factures = await Facture.find(queryFilters);

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Factures");

  worksheet.columns = [
    { header: "Numéro de Facture", key: "NUMFACT", width: 15 },
    { header: "Type", key: "TYPFACT", width: 10 },
    { header: "Date de Facture", key: "DATFACT", width: 20 },
    { header: "Texte", key: "TEXTE", width: 30 },
    { header: "Montant", key: "MONTANT", width: 15 },
    { header: "Taxes", key: "MONTAXES", width: 15 },
    { header: "Représentant", key: "REPRES", width: 10 },
  ];

  factures.forEach((facture) => {
    worksheet.addRow({
      NUMFACT: facture.NUMFACT,
      TYPFACT: facture.TYPFACT,
      DATFACT: facture.DATFACT,
      TEXTE: facture.TEXTE,
      MONTANT: facture.MONTANT,
      MONTAXES: facture.MONTAXES,
      REPRES: facture.REPRES,
    });
  });

  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );
  res.setHeader(
    "Content-Disposition",
    `attachment; filename="factures-${date}.xlsx"`
  );

  await workbook.xlsx.write(res);
  res.end();
});

export { getFactures, getFactureByNumfact, getFacturesByDate, exportFacturesToExcel };
