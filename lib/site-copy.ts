export const siteCopy = {
  eyebrow: "Proyecto de Título de Diseño UC",
  hero: {
    title: "LatticeXR",
    headline: "Cambia la forma de planificar tus exposiciones",
    tagline:
      "Herramienta VR para prototipado ágil de montajes expositivos sobre espacios reconstruidos con Gaussian Splatting.",
    subcopy:
      "Esta web es el brazo accesible del proyecto: explora los mismos espacios desde navegador, sin headset.",
    ctaPrimary: "Descargar para Quest",
    ctaSecondary: "Explorar espacios",
  },
  github: {
    url: "https://github.com/santiagovianadno/latticexrweb",
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
    },
  },
  vrDownload: {
    title: "App MR — Meta Quest 3",
    description:
      "Descarga la build beta de LatticeXR para recorrer y prototipar montajes en realidad mixta (solo ha sido testeada en un Meta Quest 3).",
    button: "Descargar APK",
    href: "/downloads/latticexr-quest.apk",
  },
  loading: {
    heroVideo: "Cargando video",
    scenePreview: "Cargando vista previa",
    scenePreviewHint: "Gaussian Splat · puede tardar unos segundos",
    scenePreviewFailed: "Vista previa no disponible",
  },
  footer: {
    line: "LatticeXR · Santiago Viana · Diseño UC",
    contactLabel: "Contacto",
    contactEmail: "sviana@uc.cl",
    advisorLabel: "Profesor guía",
    advisorName: "Leonel Merino",
  },
  about: {
    eyebrow: "Acerca del proyecto",
    paragraphs: [
      "LatticeXR es una herramienta de realidad mixta para prototipar montajes expositivos sobre espacios reconstruidos con Gaussian Splatting. Permite caminar dentro del splat, evaluar proporciones y iterar la disposición de piezas antes de montar en físico.",
      "Este sitio web complementa la app MR: no todos tienen un headset, pero sí necesitan ver y compartir el espacio. Aquí puedes explorar escenas desde el navegador con controles first-person y límites de espacio configurables.",
    ],
  },
} as const;
