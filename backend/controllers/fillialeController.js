import asyncHandler from '../middlewares/async.js';
import Filliale from '../models/filialeModel.js';

// @desc    Get all filliales
// @route   GET /api/filliales
// @access  Public
const getFilliales = asyncHandler(async (req, res) => {
  const filliales = await Filliale.find();
  res.status(200).json(filliales);
});

// @desc    Create a new filliale
// @route   POST /api/filliales
// @access  Public
const createFilliale = asyncHandler(async (req, res) => {
  const {
    nom,
    acronyme,
    website,
    adresse,
    logo,
    debutAnneeFiscale,
    finAnneeFiscale,
  } = req.body;

  if (!debutAnneeFiscale || !finAnneeFiscale) {
    res.status(400);
    throw new Error("Veuillez fournir les mois de début et de fin de l'année fiscale");
  }

  const filliale = new Filliale({
    nom,
    acronyme,
    website,
    adresse,
    logo,
    debutAnneeFiscale,
    finAnneeFiscale,
  });

  const createdFilliale = await filliale.save();



  res.status(201).json(createdFilliale);
});


// @desc    Get filliale by ID
// @route   GET /api/filliales/:id
// @access  Public
const getFillialeById = asyncHandler(async (req, res) => {
  const filliale = await Filliale.findById(req.params.id);

  if (filliale) {
    res.status(200).json(filliale);
  } else {
    res.status(404);
    throw new Error('Filliale introuvable');
  }
});

// @desc    Update filliale
// @route   PUT /api/filliales/:id
// @access  Public
const updateFilliale = asyncHandler(async (req, res) => {
  const {
    nom,
    acronyme,
    website,
    adresse,
    logo,
    debutAnneeFiscale,
    finAnneeFiscale,
  } = req.body;

  const filliale = await Filliale.findById(req.params.id);

  if (filliale) {
    filliale.nom = nom || filliale.nom;
    filliale.acronyme = acronyme || filliale.acronyme;
    filliale.website = website || filliale.website;
    filliale.adresse = adresse || filliale.adresse;
    filliale.logo = logo || filliale.logo;
    filliale.debutAnneeFiscale = debutAnneeFiscale || filliale.debutAnneeFiscale;
    filliale.finAnneeFiscale = finAnneeFiscale || filliale.finAnneeFiscale;

    const updatedFilliale = await filliale.save();
    res.status(200).json(updatedFilliale);
  } else {
    res.status(404);
    throw new Error('Filliale introuvable');
  }
});

// @desc    Delete filliale
// @route   DELETE /api/filliales/:id
// @access  Public
const deleteFilliale = asyncHandler(async (req, res) => {
  const filliale = await Filliale.findById(req.params.id);

  if (filliale) {
    await filliale.deleteOne();
    res.status(200).json({ message: 'Filliale supprimée' });
  } else {
    res.status(404);
    throw new Error('Filliale introuvable');
  }
});

export {
  getFilliales,
  createFilliale,
  getFillialeById,
  updateFilliale,
  deleteFilliale,
};
