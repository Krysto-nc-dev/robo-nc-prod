import {
  LayoutDashboard,
  Box,
  Users,
  Calendar,
  CreditCard,
  DollarSign,
  Warehouse,
  FilePen,
  CookingPot,
  Factory,
  Eye,
  RecycleIcon,
  Truck,
  Milk,
  Projector,
  Star,
  Receipt,
  ScanBarcode,
  FolderKanbanIcon,
} from "lucide-react";

export const DASHBOARD_PRIVATE_SIDEBAR_LINKS = [
  {
    key: "Tableau de bord",
    label: "Tableau de bord",
    icon: <LayoutDashboard />,
    href: "/private-dashboard",
  },

  {
    key: "tiers",
    label: "Tiers",
    icon: <Users />,
    href: "/private-tiers",
  },

  {
    key: "Produits",
    label: "Produits",
    icon: <Box />,
    href: "/private-products",
  },
  {
    key: "Entrepots",
    label: "Entrepots",
    icon: <Warehouse />,
    href: "/private-entrepots",
  },
  {
    key: "propal",
    label: "Devis",
    icon: <FilePen />,
    href: "/private-devis",
  },
  {
    key: "facturation & paiement",
    label: "Facturation & Paiement",
    icon: <DollarSign />,
    href: "/private-facturation",
  },
  {
    key: "Facture fournisseurs",
    label: "Facture fournisseurs",
    icon: <Receipt />,
    href: "/private-factures-fournisseurs",
  },
  {
    key: "banques",
    label: "Comptes bancaires",
    icon: <CreditCard />,
    href: "/private-compte",
  },
  {
    key: "Caisse",
    label: "Caisse",
    icon: <ScanBarcode />,
    href: "/private-caisse",
  },

  {
    key: "machineAndMoulds",
    label: "Machines & Moules",
    icon: <Factory />,
    href: "/private-machines-et-moules",
  },
  {
    key: "plastics",
    label: "plastiques",
    icon: <Milk />,
    href: "/private-plastic-types",
  },
  {
    key: "recyclableProducts",
    label: "produit recyclable",
    icon: <RecycleIcon />,
    href: "/private-recyclable-products",
  },
  {
    key: "collecte",
    label: "Collectes",
    icon: <Truck />,
    href: "/private-campagnes-de-collecte",
  },
  {
    key: "stockPlastic",
    label: "Stocks plastique",
    icon: <Star />,
    href: "/private-stock-plastiques",
  },

  {
    key: "recipes",
    label: "Recettes",
    icon: <CookingPot />,
    href: "/private-recettes",
  },
  {
    key: "agenda",
    label: "Agenda",
    icon: <Calendar />,
    href: "/private-agenda",
  },
  {
    key: "PROJET",
    label: "Projet",
    icon: <FolderKanbanIcon />,
    href: "/private-projets",
  },
  {
    key: "Presentations",
    label: "Presentations",
    icon: <Projector />,
    href: "/private-presentation",
  },
  {
    key: "veilles",
    label: "Veilles",
    icon: <Eye />,
    href: "/private-veilles",
  },

  // Ajoutez d'autres liens ici pour les autres menus du sidebar
];
