import path from 'path';
import asyncHandler from '../middlewares/async.js';
import Article from '../models/articleModel.js';
import Filiale from '../models/filialeModel.js';
import csv from 'csv-parser';

import fs from 'fs';


import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// @desc    Import articles from CSV
// @route   POST /api/articles/import
// @access  Public
const importArticlesFromCSV = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error('Veuillez fournir un fichier CSV.');
  }

  const articles = [];
  const filePath = path.join(__dirname, '..', req.file.path);

  try {
    const readStream = fs.createReadStream(filePath).pipe(csv({ separator: ';' }));

    for await (const row of readStream) {
      // Assurez-vous que les champs du CSV correspondent aux champs du modèle Article
      const {
        filialle,
        nart,
        design,
        gencode,
        refer,
        fourn,
        prev,
        qt2,
        pr2,
        pr3,
        qt3,
        pvte,
        smini,
        stock,
        stloc2,
        reserv,
        unite,
        conditnm,
        encde,
        groupe,
        pdetail,
        pachat,
        taxes,
        observ,
        pourc,
        v1,
        v2,
        v3,
        v4,
        v5,
        v6,
        v7,
        v8,
        v9,
        v10,
        v11,
        v12,
        douane,
        devise,
        datinv,
        deprec,
        codmaj,
        pvpromo,
        atva,
        codtar,
        dpromod,
        dpromof,
        datinv2,
        s1,
        s2,
        s3,
        s4,
        s5,
        gism1,
        gism2,
        gism3,
        gism4,
        gism5,
        place,
        tarifl,
        rup1,
        rup2,
        rup3,
        rup4,
        rup5,
        rup6,
        rup7,
        rup8,
        rup9,
        rup10,
        rup11,
        rup12,
        texte,
        gendoubl,
        associe,
        photo,
        web,
        desifrn,
        coulr,
        cdespec,
        stsecur,
        renv,
        compose,
        codetgc,
        creation,
        vol,
        kl,
        pvtettc,
        txadeduire,
      } = row;

      articles.push({
        filialle,
        nart,
        design,
        gencode,
        refer,
        fourn,
        prev,
        qt2,
        pr2,
        pr3,
        qt3,
        pvte,
        smini,
        stock,
        stloc2,
        reserv,
        unite,
        conditnm,
        encde,
        groupe,
        pdetail,
        pachat,
        taxes,
        observ,
        pourc,
        v1,
        v2,
        v3,
        v4,
        v5,
        v6,
        v7,
        v8,
        v9,
        v10,
        v11,
        v12,
        douane,
        devise,
        datinv,
        deprec,
        codmaj,
        pvpromo,
        atva,
        codtar,
        dpromod,
        dpromof,
        datinv2,
        s1,
        s2,
        s3,
        s4,
        s5,
        gism1,
        gism2,
        gism3,
        gism4,
        gism5,
        place,
        tarifl,
        rup1,
        rup2,
        rup3,
        rup4,
        rup5,
        rup6,
        rup7,
        rup8,
        rup9,
        rup10,
        rup11,
        rup12,
        texte,
        gendoubl,
        associe,
        photo,
        web,
        desifrn,
        coulr,
        cdespec,
        stsecur,
        renv,
        compose,
        codetgc,
        creation,
        vol,
        kl,
        pvtettc,
        txadeduire,
      });
    }

    const createdArticles = await Article.insertMany(articles);

    res.status(201).json({
      message: 'Articles importés avec succès.',
      articles: createdArticles,
    });
  } catch (error) {
    console.error('Erreur lors de l\'importation des articles :', error);
    res.status(500);
    throw new Error('Erreur lors de l\'importation des articles.');
  } finally {
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  }
});






// @desc    Get all articles
// @route   GET /api/articles
// @access  Public
const getArticles = asyncHandler(async (req, res) => {
  const articles = await Article.find()
  res.status(200).json(articles);
});



// @desc    Create a new article
// @route   POST /api/articles
// @access  Public
const createArticle = asyncHandler(async (req, res) => {
  const {
    filialle,
    nart,
    design,
    gencode,
    refer,
    fourn,
    prev,
    qt2,
    pr2,
    pr3,
    qt3,
    pvte,
    smini,
    stock,
    stloc2,
    reserv,
    unite,
    conditnm,
    encde,
    groupe,
    pdetail,
    pachat,
    taxes,
    observ,
    pourc,
    v1,
    v2,
    v3,
    v4,
    v5,
    v6,
    v7,
    v8,
    v9,
    v10,
    v12,
    douane,
    devise,
    datinv,
    deprec,
    codmaj,
    pvpromo,
    atva,
    codtar,
    dpromod,
    dpromof,
    datinv2,
    s1,
    s2,
    s3,
    s4,
    s5,
    gism1,
    gism2,
    gism3,
    gism4,
    gism5,
    place,
    tarifl,
    rup1,
    rup2,
    rup3,
    rup4,
    rup5,
    rup6,
    rup7,
    rup8,
    rup9,
    rup10,
    rup11,
    rup12,
    texte,
    gendoubl,
    associe,
    photo,
    web,
    desifrn,
    coulr,
    cdespec,
    stsecur,
    renv,
    compose,
    codetgc,
    creation,
    vol,
    kl,
    pvtettc,
    txadeduire,
  } = req.body;

  // Vérification de l'association avec une filiale
  if (!filialle) {
    res.status(400);
    throw new Error('Veuillez fournir une filiale associée.');
  }

  const filialeExists = await Filiale.findById(filialle);
  if (!filialeExists) {
    res.status(404);
    throw new Error('Filiale introuvable.');
  }

  const article = new Article({
    filialle,
    nart,
    design,
    gencode,
    refer,
    fourn,
    prev,
    qt2,
    pr2,
    pr3,
    qt3,
    pvte,
    smini,
    stock,
    stloc2,
    reserv,
    unite,
    conditnm,
    encde,
    groupe,
    pdetail,
    pachat,
    taxes,
    observ,
    pourc,
    v1,
    v2,
    v3,
    v4,
    v5,
    v6,
    v7,
    v8,
    v9,
    v10,
    v12,
    douane,
    devise,
    datinv,
    deprec,
    codmaj,
    pvpromo,
    atva,
    codtar,
    dpromod,
    dpromof,
    datinv2,
    s1,
    s2,
    s3,
    s4,
    s5,
    gism1,
    gism2,
    gism3,
    gism4,
    gism5,
    place,
    tarifl,
    rup1,
    rup2,
    rup3,
    rup4,
    rup5,
    rup6,
    rup7,
    rup8,
    rup9,
    rup10,
    rup11,
    rup12,
    texte,
    gendoubl,
    associe,
    photo,
    web,
    desifrn,
    coulr,
    cdespec,
    stsecur,
    renv,
    compose,
    codetgc,
    creation,
    vol,
    kl,
    pvtettc,
    txadeduire,
  });

  const createdArticle = await article.save();

  res.status(201).json(createdArticle);
});




// @desc    Get article by ID
// @route   GET /api/articles/:id
// @access  Public
const getArticleById = asyncHandler(async (req, res) => {
  const article = await Article.findById(req.params.id).populate('filiale');

  if (article) {
    res.status(200).json(article);
  } else {
    res.status(404);
    throw new Error("Article introuvable.");
  }
});


// @desc    Update article
// @route   PUT /api/articles/:id
// @access  Public
const updateArticle = asyncHandler(async (req, res) => {
  const {
    nart,
    design,
    gencode,
    refer,
    fourn,
    prev,
    qt2,
    pr2,
    pr3,
    qt3,
    pvte,
    smini,
    stock,
    stloc2,
    reserv,
    unite,
    conditnm,
    encde,
    groupe,
    pdetail,
    pachat,
    taxes,
    observ,
    pourc,
    v1,
    v2,
    v3,
    v4,
    v5,
    v6,
    v7,
    v8,
    v9,
    v10,
    v12,
    douane,
    devise,
    datinv,
    deprec,
    codmaj,
    pvpromo,
    atva,
    codtar,
    dpromod,
    dpromof,
    datinv2,
    s1,
    s2,
    s3,
    s4,
    s5,
    gism1,
    gism2,
    gism3,
    gism4,
    gism5,
    place,
    tarifl,
    rup1,
    rup2,
    rup3,
    rup4,
    rup5,
    rup6,
    rup7,
    rup8,
    rup9,
    rup10,
    rup11,
    rup12,
    texte,
    gendoubl,
    associe,
    photo,
    web,
    desifrn,
    coulr,
    cdespec,
    stsecur,
    renv,
    compose,
    codetgc,
    creation,
    vol,
    kl,
    pvtettc,
    txadeduire,
    filiale,
  } = req.body;

  const article = await Article.findById(req.params.id);

  if (article) {
    article.nart = nart || article.nart;
    article.design = design || article.design;
    article.gencode = gencode || article.gencode;
    article.refer = refer || article.refer;
    article.fourn = fourn || article.fourn;
    article.prev = prev || article.prev;
    article.qt2 = qt2 || article.qt2;
    article.pr2 = pr2 || article.pr2;
    article.pr3 = pr3 || article.pr3;
    article.qt3 = qt3 || article.qt3;
    article.pvte = pvte || article.pvte;
    article.smini = smini || article.smini;
    article.stock = stock || article.stock;
    article.stloc2 = stloc2 || article.stloc2;
    article.reserv = reserv || article.reserv;
    article.unite = unite || article.unite;
    article.conditnm = conditnm || article.conditnm;
    article.encde = encde || article.encde;
    article.groupe = groupe || article.groupe;
    article.pdetail = pdetail || article.pdetail;
    article.pachat = pachat || article.pachat;
    article.taxes = taxes || article.taxes;
    article.observ = observ || article.observ;
    article.pourc = pourc || article.pourc;
    article.v1 = v1 || article.v1;
    article.v2 = v2 || article.v2;
    article.v3 = v3 || article.v3;
    article.v4 = v4 || article.v4;
    article.v5 = v5 || article.v5;
    article.v6 = v6 || article.v6;
    article.v7 = v7 || article.v7;
    article.v8 = v8 || article.v8;
    article.v9 = v9 || article.v9;
    article.v10 = v10 || article.v10;
    article.v12 = v12 || article.v12;
    article.douane = douane || article.douane;
    article.devise = devise || article.devise;
    article.datinv = datinv || article.datinv;
    article.deprec = deprec || article.deprec;
    article.codmaj = codmaj || article.codmaj;
    article.pvpromo = pvpromo || article.pvpromo;
    article.atva = atva || article.atva;
    article.codtar = codtar || article.codtar;
    article.dpromod = dpromod || article.dpromod;
    article.dpromof = dpromof || article.dpromof;
    article.datinv2 = datinv2 || article.datinv2;
    article.s1 = s1 || article.s1;
    article.s2 = s2 || article.s2;
    article.s3 = s3 || article.s3;
    article.s4 = s4 || article.s4;
    article.s5 = s5 || article.s5;
    article.gism1 = gism1 || article.gism1;
    article.gism2 = gism2 || article.gism2;
    article.gism3 = gism3 || article.gism3;
    article.gism4 = gism4 || article.gism4;
    article.gism5 = gism5 || article.gism5;
    article.place = place || article.place;
    article.tarifl = tarifl || article.tarifl;
    article.rup1 = rup1 || article.rup1;
    article.rup2 = rup2 || article.rup2;
    article.rup3 = rup3 || article.rup3;
    article.rup4 = rup4 || article.rup4;
    article.rup5 = rup5 || article.rup5;
    article.rup6 = rup6 || article.rup6;
    article.rup7 = rup7 || article.rup7;
    article.rup8 = rup8 || article.rup8;
    article.rup9 = rup9 || article.rup9;
    article.rup10 = rup10 || article.rup10;
    article.rup11 = rup11 || article.rup11;
    article.rup12 = rup12 || article.rup12;
    article.texte = texte || article.texte;
    article.gendoubl = gendoubl || article.gendoubl;
    article.associe = associe || article.associe;
    article.photo = photo || article.photo;
    article.web = web || article.web;
    article.desifrn = desifrn || article.desifrn;
    article.coulr = coulr || article.coulr;
    article.cdespec = cdespec || article.cdespec;
    article.stsecur = stsecur || article.stsecur;
    article.renv = renv || article.renv;
    article.compose = compose || article.compose;
    article.codetgc = codetgc || article.codetgc;
    article.creation = creation || article.creation;
    article.vol = vol || article.vol;
    article.kl = kl || article.kl;
    article.pvtettc = pvtettc || article.pvtettc;
    article.txadeduire = txadeduire || article.txadeduire;
    article.filiale = filiale || article.filiale;

    const updatedArticle = await article.save();
    res.status(200).json(updatedArticle);
  } else {
    res.status(404);
    throw new Error('Article introuvable.');
  }
});



// @desc    Delete article
// @route   DELETE /api/articles/:id
// @access  Public
const deleteArticle = asyncHandler(async (req, res) => {
  const article = await Article.findById(req.params.id);

  if (article) {
    await article.deleteOne();
    res.status(200).json({ message: "Article supprimé avec succès." });
  } else {
    res.status(404);
    throw new Error("Article introuvable.");
  }
});

export { getArticles, createArticle, getArticleById, updateArticle, deleteArticle, importArticlesFromCSV };

