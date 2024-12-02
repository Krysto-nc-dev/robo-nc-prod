import mongoose from 'mongoose';

const ArticleSchema = new mongoose.Schema(
  {
    filialle: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Filiale',
        required: [true, "Veuillez fournir une filliale associé"],
      },

    nart: {
      type: String,
      required: [true, "Veuillez fournir le nom de l'agent"],
      maxlength: [50, "Le nom ne peut pas dépasser 50 caractères"],
      trim: true,
    },
    design: {
      type: String,
      required: [true, "Veuillez fournir le prénom de l'agent"],
      maxlength: [80, "Le prénom ne peut pas dépasser 80 caractères"],
      trim: true,
    },
    gencode: {
      type: String,
      trim: true,
    },
    refer: {
      type: String,
      required: [true, "Veuillez fournir la refferen e fournisseur de l'article"],
      trim: true,
    },
    fourn: {
        type: String, 
    },
    prev: {
        type: Number, 
    },
    qt2: {
        type: Number, 
    },
    pr2: {
        type: Number, 
    },
    pr3: {
        type: Number, 
    },
    qt3: {
        type: Number, 
    },
    pvte: {
        type: Number, 
    },
    smini: {
        type: Number, 
    },
    stock: {
        type: Number, 
    },
    stloc2: {
        type: Number, 
    },
    reserv: {
        type: Number, 
    },
    unite: {
        type: String, 
    },
    conditnm: {
        type: Number, 
    },
  
    encde: {
        type: Number, 
    },
    groupe: {
        type: String, 
    },
  
    pdetail: {
        type: Number, 
    },
    pachat: {
        type: Number, 
    },
    taxes: {
        type: Number, 
    },
    observ: {
        type: Number, 
    },
    pourc: {
        type: Number, 
    },
    v1: {
        type: Number, 
        default: 0
    },
    v2: {
        type: Number, 
        default: 0
    },
    v3: {
        type: Number, 
        default: 0
    },
    v4: {
        type: Number, 
        default: 0
    },
    v5: {
        type: Number, 
        default: 0
    },
    v6: {
        type: Number, 
        default: 0
    },
    v7: {
        type: Number, 
        default: 0
    },
    v8: {
        type: Number, 
        default: 0
    },
    v9: {
        type: Number, 
        default: 0
    },
    v10: {
        type: Number, 
        default: 0
    },
    v12: {
        type: Number, 
        default: 0
    },
    v12: {
        type: Number, 
        default: 0
    },
    douane: {
        type: String, 
      
    },
    devise: {
        type: String, 
    },
    datinv: {
        type: Date, 
    },
    deprec: {
        type: Number, 
    },
    codmaj: {
        type: String, 
    },
    pvpromo: {
        type: Number, 
    },
    atva: {
        type: Number, 
    },
  
    codtar: {
        type: String, 
    },
    dpromod: {
        type: Date, 
    },
    dpromof: {
        type: Date, 
    },
    datinv2: {
        type: Date, 
    },
    s1: {
        type: Number, 
    },
    s2: {
        type: Number, 
    },
    s3: {
        type: Number, 
    },
    s4: {
        type: Number, 
    },
    s5: {
        type: Number, 
    },
    gism1: {
        type: String, 
    },
    gism2: {
        type: String, 
    },
    gism3: {
        type: String, 
    },
    gism4: {
        type: String, 
    },
    gism5: {
        type: String, 
    },
    place: {
        type: String, 
    },
    tarifl: {
        type: String
    }, 
    rup1:{
        type: Number
    },
    rup2:{
        type: Number
    },
    rup3:{
        type: Number
    },
    rup4:{
        type: Number
    },
    rup5:{
        type: Number
    },
    rup6:{
        type: Number
    },
    rup7:{
        type: Number
    },
    rup8:{
        type: Number
    },
    rup9:{
        type: Number
    },
    rup10:{
        type: Number
    },
    rup11:{
        type: Number
    },
    rup12:{
        type: Number
    },
    texte:{
        type: Number
    },
    gendoubl:{
        type: String
    },
    associe:{
        type: String
    },
    photo:{
        type: String
    },
    web:{
        type: String
    },
    desifrn:{
        type: String
    },
    coulr:{
        type: String
    },
    cdespec: {
        type: Number
    },
    stsecur: {
        type: Number
    },
    renv: {
        type: String

    },
    compose: {
        type: String
    },
    codetgc: {
        type: String
    },
    creation: {
        type: String
    },
    vol: {
        type: Number
    },
    kl: {
        type: String
    },
    pvtettc: {
        type: Number
    },
    txadeduire: {
        type: Number
    },
  
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Article', ArticleSchema);
