export type Faq = {
  id: number;
  category: string;
  question: string;
  answer: string;
};

export const categorias = [
  "Todas las categorías",
  "Sobre reglamentos académicos",
  "Sobre el uso de Don Fede",
  "Sobre búsqueda de documentos",
  "Sobre vigencia y versiones",
  "Sobre reglamentos estudiantiles",
];

export const preguntas: Faq[] = [
  {
    id: 1,
    category: "Sobre reglamentos académicos",
    question: "¿Cómo sé si un reglamento sigue vigente?",
    answer:
      "El sistema muestra el estado de vigencia de cada documento. También puedes revisar su fecha de actualización y si existe una normativa posterior que lo modifique, reemplace o derogue.",
  },
  {
    id: 2,
    category: "Sobre reglamentos académicos",
    question: "¿Qué significa que un documento esté derogado?",
    answer:
      "Significa que el documento dejó de estar vigente. Generalmente fue reemplazado, eliminado o modificado por una normativa posterior.",
  },
  {
    id: 3,
    category: "Sobre el uso de Don Fede",
    question: "¿Don Fede reemplaza la lectura del documento oficial?",
    answer:
      "No. Don Fede entrega una interpretación de apoyo para facilitar la comprensión de los documentos. La fuente oficial siempre corresponde al documento institucional vigente.",
  },
  {
    id: 4,
    category: "Sobre el uso de Don Fede",
    question: "¿Puedo confiar en las respuestas de Don Fede?",
    answer:
      "Las respuestas de Don Fede buscan orientar al usuario y se acompañan de referencias a los documentos utilizados. Para decisiones oficiales siempre debes revisar la fuente institucional citada.",
  },
  {
    id: 5,
    category: "Sobre búsqueda de documentos",
    question: "¿Cómo puedo encontrar el artículo exacto que aplica a mi caso?",
    answer:
      "Puedes buscar por tema, número de artículo, palabra clave, tipo de documento u organismo. También puedes realizar una consulta directamente a Don Fede.",
  },
  {
    id: 6,
    category: "Sobre búsqueda de documentos",
    question: "¿Qué pasa si dos documentos se contradicen?",
    answer:
      "Debes revisar la vigencia, la fecha de publicación, la jerarquía normativa y las relaciones entre ambos documentos. Una norma posterior puede modificar o reemplazar una anterior.",
  },
  {
    id: 7,
    category: "Sobre vigencia y versiones",
    question: "¿Cómo puedo ver versiones anteriores de un documento?",
    answer:
      "Cuando existan versiones anteriores, el sistema mostrará sus relaciones y antecedentes. Podrás acceder a ellas desde la información detallada del documento.",
  },
  {
    id: 8,
    category: "Sobre vigencia y versiones",
    question: "¿Con qué frecuencia se actualizan los documentos en el sistema?",
    answer:
      "Los documentos se actualizan cuando la Universidad publica nuevas normativas, modificaciones o antecedentes oficiales. La fecha de actualización aparece en cada documento.",
  },
  {
    id: 9,
    category: "Sobre reglamentos estudiantiles",
    question: "¿Dónde encuentro información sobre sanciones disciplinarias?",
    answer:
      "Puedes buscar el Reglamento Disciplinario o utilizar palabras clave como sanciones, faltas, medidas disciplinarias o procedimientos.",
  },
  {
    id: 10,
    category: "Sobre reglamentos estudiantiles",
    question: "¿Qué normativa regula las becas y beneficios?",
    answer:
      "La normativa depende del tipo de beneficio. Puedes buscar utilizando términos como becas, beneficios estudiantiles, ayudas económicas o el nombre específico del beneficio.",
  },
];