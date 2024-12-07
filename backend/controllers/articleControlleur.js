import asyncHandler from "../middlewares/async.js";
import Article from "../models/qc/articleModel.js";

// @desc    Get all articles with pagination and filters
// @route   GET /api/articles
// @access  Public
const getArticles = asyncHandler(async (req, res) => {
    const { page = 1, limit = 20, sort = 'createdAt', order = 'desc', search, filter } = req.query;
  
    // Convertir `page` et `limit` en nombres entiers
    const pageNumber = parseInt(page, 10);
    const pageSize = parseInt(limit, 10);
  
    // Construire les filtres
    const queryFilters = {};
  
    if (search) {
      queryFilters.$or = [
        { NART: { $regex: search, $options: 'i' } },
        { DESIGN: { $regex: search, $options: 'i' } },
        { DESIGN2: { $regex: search, $options: 'i' } },
      ];
    }
  
    if (filter) {
      const parsedFilter = JSON.parse(filter);
      Object.entries(parsedFilter).forEach(([key, value]) => {
        queryFilters[key] = value;
      });
    }
  
    // Obtenir les articles avec pagination, tri et filtres
    const totalItems = await Article.countDocuments(queryFilters); // Compte total des articles correspondant aux filtres
  
    const articles = await Article.find(queryFilters)
      .sort({ [sort]: order === 'desc' ? -1 : 1 }) // Tri
      .skip((pageNumber - 1) * pageSize) // Sauter les articles des pages précédentes
      .limit(pageSize); // Limiter le nombre d'articles retournés
  
    // Retourner les données
    res.status(200).json({
      page: pageNumber,
      limit: pageSize,
      totalItems,
      totalPages: Math.ceil(totalItems / pageSize),
      articles,
    });
  });
  

// @desc    Get article by ID
// @route   GET /api/articles/:id
// @access  Public
const getArticleById = asyncHandler(async (req, res) => {
  const article = await Article.findById(req.params.id);

  if (!article) {
    res.status(404);
    throw new Error("Article introuvable.");
  }

  res.status(200).json(article);
});

// @desc    Create a new article
// @route   POST /api/articles
// @access  Public
const createArticle = asyncHandler(async (req, res) => {
  const articleData = req.body;

  const existingArticle = await Article.findOne({ NART: articleData.NART });

  if (existingArticle) {
    res.status(400);
    throw new Error("Un article avec ce code existe déjà.");
  }

  const article = new Article(articleData);
  const createdArticle = await article.save();

  res.status(201).json(createdArticle);
});

// @desc    Update an article
// @route   PUT /api/articles/:id
// @access  Public
const updateArticle = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const article = await Article.findById(id);

  if (!article) {
    res.status(404);
    throw new Error("Article introuvable.");
  }

  Object.keys(req.body).forEach((key) => {
    article[key] = req.body[key];
  });

  const updatedArticle = await article.save();
  res.status(200).json(updatedArticle);
});

// @desc    Delete an article
// @route   DELETE /api/articles/:id
// @access  Public
const deleteArticle = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const article = await Article.findById(id);

  if (!article) {
    res.status(404);
    throw new Error("Article introuvable.");
  }

  await article.deleteOne();
  res.status(200).json({ message: "Article supprimé avec succès." });
});

export { getArticles, getArticleById, createArticle, updateArticle, deleteArticle };
