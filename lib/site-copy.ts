export const GITHUB_URL = "https://github.com/santiagovianadno/LATTICEXR";
export const APK_HREF =
  "https://github.com/santiagovianadno/LATTICEXR/releases/latest/download/LatticeXRv0.999.apk";
export const CONTACT_EMAIL = "sviana@uc.cl";
export const ADVISOR_NAME = "Leonel Merino";

const en = {
  nav: {
    scenes: "Scenes",
    explore: "Explore",
    about: "About",
    language: "Language",
  },
  eyebrow: "UC Design Graduation Project",
  hero: {
    title: "LatticeXR",
    headline: "The spatial curation pipeline for modern galleries",
    tagline:
      "A VR tool for agile prototyping of exhibition layouts on spaces reconstructed with Gaussian Splatting.",
    subcopy:
      "This site is the accessible side of the project: explore the same spaces in the browser, without a headset.",
    ctaPrimary: "Download for Quest",
    ctaSecondary: "Explore spaces",
  },
  github: {
    button: "GitHub",
    note: "Open source project",
  },
  howItWorks: {
    title: "How it works",
    steps: [
      {
        title: "Capture and reconstruction",
        description:
          "The space is scanned and converted into a navigable Gaussian Splat.",
      },
      {
        title: "Layout in VR",
        description:
          "On the headset of your choice, you design and test the exhibition layout at full scale, walking inside the splat.",
      },
      {
        title: "Web preview",
        description:
          "Share an accessible view with curators, educators, or visitors who do not have a VR headset.",
      },
    ],
  },
  sections: {
    latticeScenes: {
      title: "Spaces scanned with LatticeXR",
    },
    explore: {
      title: "Explore other splats",
      subtitle: "A selection of Gaussian Splats hosted on SuperSplat.",
      supersplatUrl: "https://superspl.at",
      supersplatButton: "Go to SuperSplat",
      attribution: "Work by {author} · hosted on",
      openExternal: "Open on superspl.at",
      embedBlocked:
        "This viewer cannot be embedded here. Open it directly on SuperSplat.",
      close: "Close",
    },
    emptyScenes:
      "No scenes published yet. Add a SuperSplat HTML export in public/scenes/ and register it in lib/scenes.ts.",
  },
  sceneCard: {
    enter: "Enter",
  },
  viewer: {
    loading: "Loading scene…",
    back: "Back",
  },
  vrDownload: {
    title: "MR App — Meta Quest 3",
    description:
      "Download the LatticeXR beta build to walk through and prototype layouts in mixed reality (only tested on a Meta Quest 3).",
    button: "Download APK",
  },
  loading: {
    scenePreview: "Loading preview",
    scenePreviewHint: "Gaussian Splat · may take a few seconds",
    scenePreviewFailed: "Preview unavailable",
  },
  footer: {
    line: "LatticeXR · Santiago Viana · UC Design",
    contactLabel: "Contact",
    advisorLabel: "Thesis advisor",
  },
  about: {
    eyebrow: "About the project",
    paragraphs: [
      "LatticeXR is a mixed-reality tool for prototyping exhibition layouts on spaces reconstructed with Gaussian Splatting. It lets you walk inside the splat, evaluate proportions, and iterate on piece placement before installing physically.",
      "This website complements the MR app: not everyone has a headset, but they still need to see and share the space. Here you can explore scenes in the browser with first-person controls and configurable space bounds.",
    ],
    credits: "Credits",
    authorLabel: "Author",
    authorName: "Santiago Viana",
    institutionLabel: "Institution",
    institutionName: "Pontificia Universidad Católica de Chile",
    programLabel: "Program",
    programName: "Design",
    communityBefore: "Curated scenes in the gallery come from the community on",
    communityAfter:
      ". Original scenes are HTML exports integrated with the LatticeXR patch.",
    backToScenes: "Back to scenes",
  },
};

const es: typeof en = {
  nav: {
    scenes: "Escenas",
    explore: "Explorar",
    about: "Acerca de",
    language: "Idioma",
  },
  eyebrow: "Proyecto de Título de Diseño UC",
  hero: {
    title: "LatticeXR",
    headline: "El pipeline de curaduría espacial para galerías modernas",
    tagline:
      "Herramienta VR para prototipado ágil de montajes expositivos sobre espacios reconstruidos con Gaussian Splatting.",
    subcopy:
      "Esta web es el brazo accesible del proyecto: explora los mismos espacios desde navegador, sin headset.",
    ctaPrimary: "Descargar para Quest",
    ctaSecondary: "Explorar espacios",
  },
  github: {
    button: "GitHub",
    note: "Proyecto open source",
  },
  howItWorks: {
    title: "Cómo funciona",
    steps: [
      {
        title: "Captura y reconstrucción",
        description:
          "El espacio se escanea y se convierte en un Gaussian Splat navegable.",
      },
      {
        title: "Montaje en VR",
        description:
          "En el headset de tu preferencia, diseñas y pruebas el montaje expositivo a escala real, caminando dentro del splat.",
      },
      {
        title: "Preview web",
        description:
          "Comparte una vista accesible para curadores, docentes o visitantes sin dispositivo VR.",
      },
    ],
  },
  sections: {
    latticeScenes: {
      title: "Espacios escaneados con LatticeXR",
    },
    explore: {
      title: "Explorar otros splats",
      subtitle: "Selección de Gaussian Splats alojados en SuperSplat.",
      supersplatUrl: "https://superspl.at",
      supersplatButton: "Ir a SuperSplat",
      attribution: "Obra de {author} · alojada en",
      openExternal: "Abrir en superspl.at",
      embedBlocked:
        "El visor no puede incrustarse aquí. Ábrelo directamente en SuperSplat.",
      close: "Cerrar",
    },
    emptyScenes:
      "No hay escenas publicadas aún. Agrega una exportación HTML de SuperSplat en public/scenes/ y regístrala en lib/scenes.ts.",
  },
  sceneCard: {
    enter: "Entrar",
  },
  viewer: {
    loading: "Cargando escena…",
    back: "Volver",
  },
  vrDownload: {
    title: "App MR — Meta Quest 3",
    description:
      "Descarga la build beta de LatticeXR para recorrer y prototipar montajes en realidad mixta (solo ha sido testeada en un Meta Quest 3).",
    button: "Descargar APK",
  },
  loading: {
    scenePreview: "Cargando vista previa",
    scenePreviewHint: "Gaussian Splat · puede tardar unos segundos",
    scenePreviewFailed: "Vista previa no disponible",
  },
  footer: {
    line: "LatticeXR · Santiago Viana · Diseño UC",
    contactLabel: "Contacto",
    advisorLabel: "Profesor guía",
  },
  about: {
    eyebrow: "Acerca del proyecto",
    paragraphs: [
      "LatticeXR es una herramienta de realidad mixta para prototipar montajes expositivos sobre espacios reconstruidos con Gaussian Splatting. Permite caminar dentro del splat, evaluar proporciones y iterar la disposición de piezas antes de montar en físico.",
      "Este sitio web complementa la app MR: no todos tienen un headset, pero sí necesitan ver y compartir el espacio. Aquí puedes explorar escenas desde el navegador con controles first-person y límites de espacio configurables.",
    ],
    credits: "Créditos",
    authorLabel: "Autor",
    authorName: "Santiago Viana",
    institutionLabel: "Institución",
    institutionName: "Pontificia Universidad Católica de Chile",
    programLabel: "Programa",
    programName: "Diseño",
    communityBefore:
      "Las escenas curadas en la galería provienen de la comunidad en",
    communityAfter:
      ". Las escenas propias son exportaciones HTML integradas con el patch LatticeXR.",
    backToScenes: "Volver a las escenas",
  },
};

export const siteCopy = { en, es } as const;
export type SiteCopy = typeof en;
