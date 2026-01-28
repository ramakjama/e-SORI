// Banco de preguntas para quizzes educativos sobre seguros
// Total: 250 preguntas (50 por categoría)

export type QuizCategory = 'SEGUROS_GENERALES' | 'AUTO' | 'HOGAR' | 'SALUD' | 'PREVENCION';
export type QuizDifficulty = 1 | 2 | 3; // 1=Fácil, 2=Medio, 3=Difícil

export interface QuizQuestion {
  id: string;
  category: QuizCategory;
  difficulty: QuizDifficulty;
  question: string;
  options: [string, string, string, string];
  correctIndex: 0 | 1 | 2 | 3;
  explanation: string;
  tags: string[];
}

// ============================================
// CATEGORÍA 1: SEGUROS GENERALES (50 preguntas)
// ============================================

const segurosGenerales: QuizQuestion[] = [
  // FÁCILES (25 preguntas)
  {
    id: 'sg001',
    category: 'SEGUROS_GENERALES',
    difficulty: 1,
    question: '¿Qué es una póliza de seguro?',
    options: [
      'Un contrato entre asegurador y asegurado',
      'Una factura de pago',
      'Un documento sin valor legal',
      'Una multa administrativa'
    ],
    correctIndex: 0,
    explanation: 'Una póliza es el contrato legal que establece los derechos y obligaciones entre la compañía aseguradora y el cliente asegurado.',
    tags: ['conceptos-basicos', 'poliza', 'contrato']
  },
  {
    id: 'sg002',
    category: 'SEGUROS_GENERALES',
    difficulty: 1,
    question: '¿Qué es la prima de un seguro?',
    options: [
      'El bonus que recibes',
      'El precio que pagas por el seguro',
      'La cantidad que te devuelven',
      'El descuento aplicado'
    ],
    correctIndex: 1,
    explanation: 'La prima es el importe que el asegurado paga periódicamente (mensual, trimestral o anualmente) a la compañía por mantener la cobertura activa.',
    tags: ['prima', 'precio', 'conceptos-basicos']
  },
  {
    id: 'sg003',
    category: 'SEGUROS_GENERALES',
    difficulty: 1,
    question: '¿Qué significa "franquicia" en un seguro?',
    options: [
      'Una red de oficinas',
      'La parte del daño que paga el asegurado',
      'Un tipo de descuento',
      'Una cobertura adicional'
    ],
    correctIndex: 1,
    explanation: 'La franquicia es la cantidad fija que el asegurado debe pagar de su bolsillo en caso de siniestro, antes de que la aseguradora cubra el resto.',
    tags: ['franquicia', 'conceptos-basicos', 'siniestro']
  },
  {
    id: 'sg004',
    category: 'SEGUROS_GENERALES',
    difficulty: 1,
    question: '¿Qué es un siniestro?',
    options: [
      'Un tipo de seguro',
      'El evento dañoso cubierto por el seguro',
      'Una prima adicional',
      'Un descuento especial'
    ],
    correctIndex: 1,
    explanation: 'Un siniestro es el suceso cubierto por la póliza (accidente, robo, incendio, etc.) que activa la protección del seguro.',
    tags: ['siniestro', 'conceptos-basicos', 'reclamacion']
  },
  {
    id: 'sg005',
    category: 'SEGUROS_GENERALES',
    difficulty: 1,
    question: '¿Qué es el tomador de un seguro?',
    options: [
      'El empleado de la aseguradora',
      'La persona que contrata y paga el seguro',
      'El beneficiario del seguro',
      'El inspector de siniestros'
    ],
    correctIndex: 1,
    explanation: 'El tomador es quien firma el contrato y tiene la obligación de pagar las primas, aunque no siempre es el mismo que el asegurado.',
    tags: ['tomador', 'conceptos-basicos', 'contrato']
  },
  {
    id: 'sg006',
    category: 'SEGUROS_GENERALES',
    difficulty: 1,
    question: '¿Qué es el capital asegurado?',
    options: [
      'El dinero en tu cuenta bancaria',
      'La cantidad máxima que pagará la aseguradora',
      'La prima anual',
      'El coste del seguro'
    ],
    correctIndex: 1,
    explanation: 'El capital asegurado es el límite máximo de indemnización que la compañía pagará en caso de siniestro cubierto por la póliza.',
    tags: ['capital-asegurado', 'indemnizacion', 'conceptos-basicos']
  },
  {
    id: 'sg007',
    category: 'SEGUROS_GENERALES',
    difficulty: 1,
    question: '¿Qué significa "cobertura" en seguros?',
    options: [
      'El techo de un edificio',
      'Los riesgos protegidos por la póliza',
      'El descuento aplicado',
      'El periodo de carencia'
    ],
    correctIndex: 1,
    explanation: 'La cobertura define qué eventos, daños o situaciones están protegidos por la póliza de seguro contratada.',
    tags: ['cobertura', 'proteccion', 'conceptos-basicos']
  },
  {
    id: 'sg008',
    category: 'SEGUROS_GENERALES',
    difficulty: 1,
    question: '¿Con qué frecuencia se suele pagar la prima del seguro?',
    options: [
      'Solo mensual',
      'Mensual, trimestral, semestral o anual',
      'Solo al final del año',
      'Cada 5 años'
    ],
    correctIndex: 1,
    explanation: 'Las aseguradoras suelen ofrecer varias opciones de pago: mensual, trimestral, semestral o anual, con posibles descuentos por pago anual.',
    tags: ['prima', 'pago', 'fraccionamiento']
  },
  {
    id: 'sg009',
    category: 'SEGUROS_GENERALES',
    difficulty: 1,
    question: '¿Qué es un mediador de seguros?',
    options: [
      'Un abogado especializado',
      'Un profesional que asesora y gestiona seguros',
      'Un empleado del banco',
      'Un inspector de siniestros'
    ],
    correctIndex: 1,
    explanation: 'El mediador es un profesional independiente que asesora al cliente, compara opciones y gestiona sus seguros con las compañías.',
    tags: ['mediador', 'asesoramiento', 'profesional']
  },
  {
    id: 'sg010',
    category: 'SEGUROS_GENERALES',
    difficulty: 1,
    question: '¿Cuándo entra en vigor un seguro normalmente?',
    options: [
      'Inmediatamente al firmarlo',
      'A las 24 horas del pago de la primera prima',
      'Al mes siguiente',
      'Cuando hay un siniestro'
    ],
    correctIndex: 1,
    explanation: 'La mayoría de seguros entran en vigor 24 horas después del pago de la primera prima, aunque puede variar según el tipo de póliza.',
    tags: ['vigencia', 'entrada-vigor', 'contrato']
  },
  {
    id: 'sg011',
    category: 'SEGUROS_GENERALES',
    difficulty: 1,
    question: '¿Qué es el periodo de carencia?',
    options: [
      'El tiempo sin cobertura al inicio',
      'Las vacaciones del asegurado',
      'El tiempo para pagar',
      'El periodo de renovación'
    ],
    correctIndex: 0,
    explanation: 'El periodo de carencia es el tiempo inicial tras contratar el seguro durante el cual ciertas coberturas aún no están activas.',
    tags: ['carencia', 'periodo', 'vigencia']
  },
  {
    id: 'sg012',
    category: 'SEGUROS_GENERALES',
    difficulty: 1,
    question: '¿Qué documento acredita que tienes un seguro contratado?',
    options: [
      'El recibo de pago',
      'La póliza o certificado de seguro',
      'Tu DNI',
      'La tarjeta bancaria'
    ],
    correctIndex: 1,
    explanation: 'La póliza (o certificado/tarjeta de seguro) es el documento oficial que prueba que tienes una cobertura activa.',
    tags: ['poliza', 'documentacion', 'certificado']
  },
  {
    id: 'sg013',
    category: 'SEGUROS_GENERALES',
    difficulty: 1,
    question: '¿Puedes cancelar un seguro cuando quieras?',
    options: [
      'No, nunca se puede cancelar',
      'Sí, respetando el plazo de preaviso',
      'Solo si cambias de ciudad',
      'Solo tras 10 años'
    ],
    correctIndex: 1,
    explanation: 'Los seguros se pueden cancelar voluntariamente, aunque hay que respetar un preaviso (normalmente de 1-2 meses) y puede aplicarse penalización.',
    tags: ['cancelacion', 'baja', 'derechos']
  },
  {
    id: 'sg014',
    category: 'SEGUROS_GENERALES',
    difficulty: 1,
    question: '¿Qué es el beneficiario de un seguro?',
    options: [
      'El que paga la prima',
      'La persona que recibe la indemnización',
      'El agente de seguros',
      'El inspector de riesgos'
    ],
    correctIndex: 1,
    explanation: 'El beneficiario es la persona designada para recibir la prestación o indemnización del seguro en caso de siniestro.',
    tags: ['beneficiario', 'indemnizacion', 'conceptos-basicos']
  },
  {
    id: 'sg015',
    category: 'SEGUROS_GENERALES',
    difficulty: 1,
    question: '¿Qué es el asegurado?',
    options: [
      'La compañía de seguros',
      'La persona o bien protegido por el seguro',
      'El mediador de seguros',
      'El documento de la póliza'
    ],
    correctIndex: 1,
    explanation: 'El asegurado es la persona física o jurídica, o el bien, sobre el cual recae la cobertura del seguro contratado.',
    tags: ['asegurado', 'conceptos-basicos', 'partes']
  },
  {
    id: 'sg016',
    category: 'SEGUROS_GENERALES',
    difficulty: 1,
    question: '¿Qué debes hacer si cambias de domicilio?',
    options: [
      'No hace falta avisar',
      'Comunicarlo a tu aseguradora',
      'Cancelar todos los seguros',
      'Esperar a la renovación'
    ],
    correctIndex: 1,
    explanation: 'Es obligatorio comunicar el cambio de domicilio a la aseguradora, ya que puede afectar al riesgo y a las condiciones de la póliza.',
    tags: ['modificacion', 'domicilio', 'obligaciones']
  },
  {
    id: 'sg017',
    category: 'SEGUROS_GENERALES',
    difficulty: 1,
    question: '¿Qué es una cobertura obligatoria?',
    options: [
      'Una que debes contratar por ley',
      'Una que la aseguradora impone',
      'Una solo para empresas',
      'Una que es gratuita'
    ],
    correctIndex: 0,
    explanation: 'Las coberturas obligatorias son las exigidas por ley, como el seguro de Responsabilidad Civil en automóviles.',
    tags: ['cobertura', 'obligatorio', 'legal']
  },
  {
    id: 'sg018',
    category: 'SEGUROS_GENERALES',
    difficulty: 1,
    question: '¿Qué es el "suplemento" de una póliza?',
    options: [
      'Un descuento adicional',
      'Una modificación del contrato',
      'Un regalo de la aseguradora',
      'Un tipo de prima'
    ],
    correctIndex: 1,
    explanation: 'El suplemento es el documento que refleja cualquier cambio o modificación en las condiciones de la póliza original.',
    tags: ['suplemento', 'modificacion', 'poliza']
  },
  {
    id: 'sg019',
    category: 'SEGUROS_GENERALES',
    difficulty: 1,
    question: '¿Para qué sirve la tarjeta del seguro?',
    options: [
      'Para pagar en tiendas',
      'Para acreditar que tienes seguro',
      'Para sacar dinero',
      'Solo es decorativa'
    ],
    correctIndex: 1,
    explanation: 'La tarjeta del seguro (común en auto y salud) es un documento portable que acredita tu cobertura y facilita datos en caso de necesidad.',
    tags: ['tarjeta', 'documentacion', 'acreditacion']
  },
  {
    id: 'sg020',
    category: 'SEGUROS_GENERALES',
    difficulty: 1,
    question: '¿Qué es un "parte amistoso"?',
    options: [
      'Una felicitación de la aseguradora',
      'Un documento para accidentes entre vehículos',
      'Un tipo de descuento',
      'Una cobertura opcional'
    ],
    correctIndex: 1,
    explanation: 'El parte amistoso (o declaración amistosa) es el formulario que cumplimentan los conductores tras un accidente para documentar lo ocurrido.',
    tags: ['parte-amistoso', 'accidente', 'documentacion']
  },
  {
    id: 'sg021',
    category: 'SEGUROS_GENERALES',
    difficulty: 1,
    question: '¿Qué significa "renovación automática"?',
    options: [
      'El seguro se renueva solo cada año',
      'Debes renovar presencialmente',
      'El seguro caduca siempre',
      'Solo aplica a seguros de vida'
    ],
    correctIndex: 0,
    explanation: 'La renovación automática (tácita reconducción) significa que el seguro se renueva automáticamente cada anualidad si no lo cancelas.',
    tags: ['renovacion', 'tacita-reconduccion', 'vigencia']
  },
  {
    id: 'sg022',
    category: 'SEGUROS_GENERALES',
    difficulty: 1,
    question: '¿Cuál es el plazo habitual para comunicar un siniestro?',
    options: [
      '1 año',
      '7 días hábiles',
      '24 horas',
      'No hay plazo'
    ],
    correctIndex: 1,
    explanation: 'Generalmente se dispone de 7 días hábiles desde el siniestro para comunicarlo a la aseguradora, aunque es recomendable hacerlo cuanto antes.',
    tags: ['siniestro', 'comunicacion', 'plazos']
  },
  {
    id: 'sg023',
    category: 'SEGUROS_GENERALES',
    difficulty: 1,
    question: '¿Qué es la "fecha de efecto" de un seguro?',
    options: [
      'Cuando caduca',
      'Cuando comienza la cobertura',
      'Cuando pagas',
      'Cuando hay siniestro'
    ],
    correctIndex: 1,
    explanation: 'La fecha de efecto es el momento exacto en que comienza la cobertura del seguro y éste empieza a protegerte.',
    tags: ['fecha-efecto', 'vigencia', 'cobertura']
  },
  {
    id: 'sg024',
    category: 'SEGUROS_GENERALES',
    difficulty: 1,
    question: '¿Qué es un "perito de seguros"?',
    options: [
      'Un vendedor de seguros',
      'Un experto que valora daños',
      'Un tipo de cobertura',
      'Un documento legal'
    ],
    correctIndex: 1,
    explanation: 'El perito es el profesional especializado que evalúa y cuantifica los daños tras un siniestro para determinar la indemnización.',
    tags: ['perito', 'valoracion', 'siniestro']
  },
  {
    id: 'sg025',
    category: 'SEGUROS_GENERALES',
    difficulty: 1,
    question: '¿Qué significa "declaración del riesgo"?',
    options: [
      'Un tipo de seguro',
      'Informar verazmente sobre lo que aseguras',
      'Cancelar la póliza',
      'Pagar la prima'
    ],
    correctIndex: 1,
    explanation: 'Es la obligación del asegurado de proporcionar información veraz y completa sobre el bien o persona a asegurar al contratar la póliza.',
    tags: ['declaracion-riesgo', 'obligaciones', 'veracidad']
  },

  // MEDIAS (15 preguntas)
  {
    id: 'sg026',
    category: 'SEGUROS_GENERALES',
    difficulty: 2,
    question: '¿Qué consecuencias tiene ocultar información al contratar un seguro?',
    options: [
      'Ninguna, es opcional',
      'La aseguradora puede anular la póliza',
      'Solo aumenta la prima',
      'Solo afecta a la renovación'
    ],
    correctIndex: 1,
    explanation: 'Ocultar información relevante (reticencia) puede llevar a la anulación de la póliza, pérdida de primas pagadas y denegación de indemnizaciones.',
    tags: ['reticencia', 'fraude', 'anulacion']
  },
  {
    id: 'sg027',
    category: 'SEGUROS_GENERALES',
    difficulty: 2,
    question: '¿Qué es el "principio de buena fe" en seguros?',
    options: [
      'Un descuento por fidelidad',
      'La obligación mutua de honestidad',
      'Un tipo de cobertura',
      'Una cláusula opcional'
    ],
    correctIndex: 1,
    explanation: 'Es el principio fundamental que obliga a ambas partes a actuar con honestidad, transparencia y lealtad durante toda la vigencia del contrato.',
    tags: ['buena-fe', 'principios', 'etica']
  },
  {
    id: 'sg028',
    category: 'SEGUROS_GENERALES',
    difficulty: 2,
    question: '¿Qué es el "infraseguro"?',
    options: [
      'Un seguro muy barato',
      'Asegurar por menos valor del real',
      'Un seguro ilegal',
      'Un seguro sin coberturas'
    ],
    correctIndex: 1,
    explanation: 'Infraseguro ocurre cuando aseguras un bien por un valor inferior al real, lo que reduce proporcionalmente la indemnización en caso de siniestro.',
    tags: ['infraseguro', 'valoracion', 'indemnizacion']
  },
  {
    id: 'sg029',
    category: 'SEGUROS_GENERALES',
    difficulty: 2,
    question: '¿Qué es el "sobreseguro"?',
    options: [
      'Tener muchos seguros',
      'Asegurar por más valor del real',
      'Un seguro muy completo',
      'Un seguro premium'
    ],
    correctIndex: 1,
    explanation: 'Sobreseguro es asegurar un bien por encima de su valor real. La indemnización nunca superará el valor real, por lo que pagas prima de más innecesariamente.',
    tags: ['sobreseguro', 'valoracion', 'prima']
  },
  {
    id: 'sg030',
    category: 'SEGUROS_GENERALES',
    difficulty: 2,
    question: '¿Qué es la "prescripción" en seguros?',
    options: [
      'La renovación automática',
      'El plazo límite para reclamar',
      'La cancelación voluntaria',
      'El descuento por antigüedad'
    ],
    correctIndex: 1,
    explanation: 'La prescripción es el plazo legal (generalmente 2-5 años) tras el cual se pierde el derecho a reclamar una indemnización.',
    tags: ['prescripcion', 'plazos', 'derechos']
  },
  {
    id: 'sg031',
    category: 'SEGUROS_GENERALES',
    difficulty: 2,
    question: '¿Qué es la "subrogación" en seguros?',
    options: [
      'Cambiar de aseguradora',
      'La aseguradora asume tus derechos para reclamar',
      'Renovar la póliza',
      'Añadir coberturas'
    ],
    correctIndex: 1,
    explanation: 'Tras pagar una indemnización, la aseguradora puede subrogarse en tus derechos para reclamar al culpable del daño y recuperar lo pagado.',
    tags: ['subrogacion', 'derechos', 'reclamacion']
  },
  {
    id: 'sg032',
    category: 'SEGUROS_GENERALES',
    difficulty: 2,
    question: '¿Qué es el "valor de reposición"?',
    options: [
      'El valor antiguo del bien',
      'El coste de reponer el bien por uno nuevo',
      'El valor sentimental',
      'El descuento aplicado'
    ],
    correctIndex: 1,
    explanation: 'Es el coste actual de adquirir un bien nuevo equivalente, sin aplicar depreciación. Algunas pólizas ofrecen esta cobertura premium.',
    tags: ['valor-reposicion', 'indemnizacion', 'valoracion']
  },
  {
    id: 'sg033',
    category: 'SEGUROS_GENERALES',
    difficulty: 2,
    question: '¿Qué es el "valor real" o "valor venal"?',
    options: [
      'El precio original de compra',
      'El valor actual considerando depreciación',
      'El valor emocional',
      'El valor máximo asegurable'
    ],
    correctIndex: 1,
    explanation: 'Es el valor de mercado actual del bien, teniendo en cuenta su estado, antigüedad y depreciación. Base común para indemnizaciones.',
    tags: ['valor-real', 'depreciacion', 'valoracion']
  },
  {
    id: 'sg034',
    category: 'SEGUROS_GENERALES',
    difficulty: 2,
    question: '¿Qué es una "exclusión" en la póliza?',
    options: [
      'Un descuento especial',
      'Situaciones no cubiertas por el seguro',
      'Una cobertura adicional',
      'Un tipo de franquicia'
    ],
    correctIndex: 1,
    explanation: 'Las exclusiones son circunstancias, eventos o daños específicamente no cubiertos por la póliza, detallados en las condiciones.',
    tags: ['exclusiones', 'limitaciones', 'cobertura']
  },
  {
    id: 'sg035',
    category: 'SEGUROS_GENERALES',
    difficulty: 2,
    question: '¿Qué diferencia hay entre "culpa" y "dolo" en seguros?',
    options: [
      'No hay diferencia',
      'Culpa es negligencia, dolo es intención',
      'Ambos están cubiertos igual',
      'Solo importa en seguros de vida'
    ],
    correctIndex: 1,
    explanation: 'La culpa es negligencia sin intención de daño (puede estar cubierta), mientras que el dolo es daño intencionado (nunca está cubierto).',
    tags: ['culpa', 'dolo', 'exclusiones']
  },
  {
    id: 'sg036',
    category: 'SEGUROS_GENERALES',
    difficulty: 2,
    question: '¿Qué es el "concurso de seguros"?',
    options: [
      'Una competición entre aseguradoras',
      'Tener varios seguros para lo mismo',
      'Un sorteo de premios',
      'Una póliza colectiva'
    ],
    correctIndex: 1,
    explanation: 'Ocurre cuando se tienen múltiples seguros cubriendo el mismo riesgo. Cada aseguradora paga proporcionalmente, sin enriquecimiento injusto.',
    tags: ['concurso', 'multiples-seguros', 'indemnizacion']
  },
  {
    id: 'sg037',
    category: 'SEGUROS_GENERALES',
    difficulty: 2,
    question: '¿Qué es la "regla proporcional"?',
    options: [
      'Un descuento por volumen',
      'Reducción de indemnización por infraseguro',
      'Un tipo de franquicia',
      'Una forma de pago'
    ],
    correctIndex: 1,
    explanation: 'Si hay infraseguro, la indemnización se reduce en la misma proporción entre valor asegurado y valor real del bien.',
    tags: ['regla-proporcional', 'infraseguro', 'indemnizacion']
  },
  {
    id: 'sg038',
    category: 'SEGUROS_GENERALES',
    difficulty: 2,
    question: '¿Qué es el "parte de siniestro"?',
    options: [
      'Un documento de renovación',
      'El formulario para comunicar un daño',
      'La póliza de seguro',
      'El recibo de pago'
    ],
    correctIndex: 1,
    explanation: 'Es el documento oficial donde se detallan las circunstancias del siniestro para iniciar el proceso de reclamación ante la aseguradora.',
    tags: ['parte-siniestro', 'documentacion', 'reclamacion']
  },
  {
    id: 'sg039',
    category: 'SEGUROS_GENERALES',
    difficulty: 2,
    question: '¿Qué es la "salvaguarda" en seguros?',
    options: [
      'Un tipo de cobertura',
      'Bienes recuperados tras indemnizar',
      'Una exclusión',
      'Un descuento especial'
    ],
    correctIndex: 1,
    explanation: 'Son los restos o bienes recuperados después de un siniestro. La aseguradora puede quedárselos tras pagar la indemnización total.',
    tags: ['salvaguarda', 'siniestro', 'recuperacion']
  },
  {
    id: 'sg040',
    category: 'SEGUROS_GENERALES',
    difficulty: 2,
    question: '¿Qué es un "seguro colectivo"?',
    options: [
      'Un seguro para varios bienes',
      'Un seguro contratado para un grupo',
      'Un seguro muy barato',
      'Un seguro obligatorio'
    ],
    correctIndex: 1,
    explanation: 'Es un único contrato que cubre a múltiples personas (ej. empleados de una empresa), generalmente con mejores condiciones por volumen.',
    tags: ['colectivo', 'grupo', 'empresa']
  },

  // DIFÍCILES (10 preguntas)
  {
    id: 'sg041',
    category: 'SEGUROS_GENERALES',
    difficulty: 3,
    question: '¿Qué regula la Ley 50/1980 en España?',
    options: [
      'Los impuestos sobre seguros',
      'El Contrato de Seguro',
      'Las pensiones',
      'Los mediadores de seguros'
    ],
    correctIndex: 1,
    explanation: 'La Ley 50/1980 de Contrato de Seguro es la norma fundamental que regula las relaciones jurídicas entre aseguradoras y asegurados en España.',
    tags: ['legislacion', 'ley-contrato-seguro', 'normativa']
  },
  {
    id: 'sg042',
    category: 'SEGUROS_GENERALES',
    difficulty: 3,
    question: '¿Qué es el "coaseguro"?',
    options: [
      'Tener dos seguros iguales',
      'Varias aseguradoras comparten un riesgo',
      'Un seguro muy caro',
      'Un seguro sin franquicia'
    ],
    correctIndex: 1,
    explanation: 'El coaseguro es cuando varias aseguradoras se reparten porcentajes del riesgo y de la prima de un mismo seguro, común en riesgos grandes.',
    tags: ['coaseguro', 'reparto-riesgo', 'aseguradoras']
  },
  {
    id: 'sg043',
    category: 'SEGUROS_GENERALES',
    difficulty: 3,
    question: '¿Qué es el "reaseguro"?',
    options: [
      'Renovar el seguro',
      'Seguro que contrata una aseguradora',
      'Un segundo seguro del cliente',
      'Una cobertura adicional'
    ],
    correctIndex: 1,
    explanation: 'El reaseguro es el seguro que contrata la propia aseguradora para transferir parte de sus riesgos a otra compañía (reaseguradora).',
    tags: ['reaseguro', 'transferencia-riesgo', 'aseguradoras']
  },
  {
    id: 'sg044',
    category: 'SEGUROS_GENERALES',
    difficulty: 3,
    question: '¿Qué es la "prima pura" o "prima de riesgo"?',
    options: [
      'La prima sin descuentos',
      'El coste estadístico del riesgo',
      'La prima más cara',
      'La primera prima pagada'
    ],
    correctIndex: 1,
    explanation: 'Es la cantidad calculada actuarialmente que corresponde estrictamente al riesgo asegurado, sin incluir gastos ni beneficios de la compañía.',
    tags: ['prima-pura', 'actuarial', 'calculo-riesgo']
  },
  {
    id: 'sg045',
    category: 'SEGUROS_GENERALES',
    difficulty: 3,
    question: '¿Qué es la "mutualidad"?',
    options: [
      'Una compañía de seguros estándar',
      'Una entidad sin ánimo de lucro de asegurados',
      'Un descuento por fidelidad',
      'Un tipo de mediador'
    ],
    correctIndex: 1,
    explanation: 'Es una entidad aseguradora sin fines lucrativos, propiedad de sus propios mutualistas, que reparte excedentes entre ellos.',
    tags: ['mutualidad', 'tipos-aseguradoras', 'entidades']
  },
  {
    id: 'sg046',
    category: 'SEGUROS_GENERALES',
    difficulty: 3,
    question: '¿Qué establece el principio de "indemnización" en seguros?',
    options: [
      'Siempre pagas lo mismo',
      'No puedes ganar con el seguro, solo recuperar',
      'Recibes el doble del daño',
      'No hay límite de indemnización'
    ],
    correctIndex: 1,
    explanation: 'Este principio fundamental establece que el seguro repara el daño pero nunca puede suponer un enriquecimiento para el asegurado.',
    tags: ['principio-indemnizacion', 'fundamentos', 'derecho']
  },
  {
    id: 'sg047',
    category: 'SEGUROS_GENERALES',
    difficulty: 3,
    question: '¿Qué es el "bonus-malus"?',
    options: [
      'Un tipo de franquicia',
      'Sistema de descuentos/recargos por siniestralidad',
      'Una cobertura opcional',
      'Un seguro colectivo'
    ],
    correctIndex: 1,
    explanation: 'Es un sistema que ajusta la prima según tu historial: descuentos (bonus) si no has tenido siniestros o recargos (malus) si los has tenido.',
    tags: ['bonus-malus', 'prima', 'siniestralidad']
  },
  {
    id: 'sg048',
    category: 'SEGUROS_GENERALES',
    difficulty: 3,
    question: '¿Qué es el Consorcio de Compensación de Seguros?',
    options: [
      'Una aseguradora privada',
      'Entidad pública que cubre riesgos extraordinarios',
      'Un mediador de seguros',
      'Una asociación de clientes'
    ],
    correctIndex: 1,
    explanation: 'Es una entidad pública española que cubre eventos extraordinarios (terrorismo, inundaciones, etc.) mediante recargo obligatorio en las pólizas.',
    tags: ['consorcio', 'riesgos-extraordinarios', 'entidad-publica']
  },
  {
    id: 'sg049',
    category: 'SEGUROS_GENERALES',
    difficulty: 3,
    question: '¿Qué es la "reserva técnica" de una aseguradora?',
    options: [
      'Su beneficio anual',
      'Fondos reservados para futuras indemnizaciones',
      'El capital social',
      'Las inversiones en bolsa'
    ],
    correctIndex: 1,
    explanation: 'Son provisiones obligatorias que la aseguradora debe mantener para garantizar el pago de siniestros futuros y compromisos adquiridos.',
    tags: ['reserva-tecnica', 'solvencia', 'regulacion']
  },
  {
    id: 'sg050',
    category: 'SEGUROS_GENERALES',
    difficulty: 3,
    question: '¿Qué diferencia hay entre corredor y agente de seguros?',
    options: [
      'No hay diferencia',
      'El corredor es independiente, el agente representa a una aseguradora',
      'Solo el nombre',
      'Uno trabaja online y otro no'
    ],
    correctIndex: 1,
    explanation: 'El corredor es independiente y asesora al cliente, mientras el agente representa y vende productos de una aseguradora específica.',
    tags: ['corredor', 'agente', 'mediacion']
  }
];

// ============================================
// CATEGORÍA 2: SEGUROS DE AUTO (50 preguntas)
// ============================================

const segurosAuto: QuizQuestion[] = [
  // FÁCILES (25 preguntas)
  {
    id: 'au001',
    category: 'AUTO',
    difficulty: 1,
    question: '¿Qué cobertura de auto es obligatoria por ley en España?',
    options: [
      'Todo riesgo',
      'Responsabilidad Civil',
      'Robo',
      'Lunas'
    ],
    correctIndex: 1,
    explanation: 'La Responsabilidad Civil es obligatoria para circular. Cubre daños que causes a terceros (personas y bienes) con tu vehículo.',
    tags: ['obligatorio', 'responsabilidad-civil', 'legal']
  },
  {
    id: 'au002',
    category: 'AUTO',
    difficulty: 1,
    question: '¿Qué cubre el seguro a terceros?',
    options: [
      'Daños a tu propio coche',
      'Daños que causes a otros',
      'Robo de tu vehículo',
      'Todo tipo de daños'
    ],
    correctIndex: 1,
    explanation: 'El seguro a terceros (RC obligatoria) solo cubre los daños que tú causes a otras personas o sus bienes, no los de tu vehículo.',
    tags: ['terceros', 'responsabilidad-civil', 'cobertura']
  },
  {
    id: 'au003',
    category: 'AUTO',
    difficulty: 1,
    question: '¿Qué es un seguro a todo riesgo?',
    options: [
      'Solo cubre terceros',
      'Cubre daños propios y a terceros',
      'Solo cubre robo',
      'No cubre nada'
    ],
    correctIndex: 1,
    explanation: 'El todo riesgo es la cobertura más completa: incluye terceros, daños propios (incluso por culpa tuya), robo, incendio, etc.',
    tags: ['todo-riesgo', 'cobertura-completa', 'daños-propios']
  },
  {
    id: 'au004',
    category: 'AUTO',
    difficulty: 1,
    question: '¿Qué documenta el "parte amistoso" tras un accidente?',
    options: [
      'Solo tus datos personales',
      'Las circunstancias del accidente',
      'El precio del coche',
      'El historial de multas'
    ],
    correctIndex: 1,
    explanation: 'El parte amistoso (declaración amistosa de accidente) documenta qué ocurrió, dónde, los daños y la versión de ambos conductores.',
    tags: ['parte-amistoso', 'accidente', 'documentacion']
  },
  {
    id: 'au005',
    category: 'AUTO',
    difficulty: 1,
    question: '¿Qué debes hacer inmediatamente después de un accidente?',
    options: [
      'Huir del lugar',
      'Asegurar la zona y ayudar a heridos',
      'Llamar al periódico',
      'Esperar una semana'
    ],
    correctIndex: 1,
    explanation: 'Lo primero es señalizar la zona, atender heridos si los hay y llamar a emergencias (112) si es necesario. Luego documentar y avisar al seguro.',
    tags: ['accidente', 'protocolo', 'emergencia']
  },
  {
    id: 'au006',
    category: 'AUTO',
    difficulty: 1,
    question: '¿Qué cubre la garantía de "lunas"?',
    options: [
      'Solo el parabrisas',
      'Parabrisas, lunetas y ventanillas',
      'Faros delanteros',
      'Espejos retrovisores'
    ],
    correctIndex: 1,
    explanation: 'La cobertura de lunas repara o sustituye el parabrisas, luneta trasera y ventanillas laterales. Suele tener franquicia mínima o nula.',
    tags: ['lunas', 'cristales', 'cobertura']
  },
  {
    id: 'au007',
    category: 'AUTO',
    difficulty: 1,
    question: '¿Qué es la asistencia en viaje?',
    options: [
      'Un GPS gratuito',
      'Servicio de grúa y ayuda en carretera',
      'Descuentos en gasolineras',
      'Un mapa de carreteras'
    ],
    correctIndex: 1,
    explanation: 'La asistencia en viaje incluye grúa, mecánico de emergencia, vehículo de sustitución, alojamiento si te quedas parado lejos de casa, etc.',
    tags: ['asistencia-viaje', 'grua', 'servicios']
  },
  {
    id: 'au008',
    category: 'AUTO',
    difficulty: 1,
    question: '¿Qué es el "conductor habitual" de un vehículo?',
    options: [
      'El dueño del coche',
      'Quien más usa el vehículo',
      'El conductor más joven',
      'El pasajero principal'
    ],
    correctIndex: 1,
    explanation: 'El conductor habitual es la persona que usa el vehículo la mayor parte del tiempo. Su perfil afecta al precio de la prima.',
    tags: ['conductor-habitual', 'contratacion', 'prima']
  },
  {
    id: 'au009',
    category: 'AUTO',
    difficulty: 1,
    question: '¿Cubre el seguro si conduce alguien sin permiso?',
    options: [
      'Sí, siempre',
      'No en daños propios, sí en RC terceros',
      'Nunca cubre nada',
      'Solo los martes'
    ],
    correctIndex: 1,
    explanation: 'La RC a terceros opera siempre (protege a las víctimas), pero la aseguradora puede luego reclamar al conductor ilegal y no paga daños propios.',
    tags: ['conductor-no-autorizado', 'cobertura', 'exclusiones']
  },
  {
    id: 'au010',
    category: 'AUTO',
    difficulty: 1,
    question: '¿Qué es la franquicia en el seguro de auto?',
    options: [
      'Un descuento anual',
      'La cantidad que pagas tú en cada siniestro',
      'Una cobertura adicional',
      'El precio total del seguro'
    ],
    correctIndex: 1,
    explanation: 'La franquicia es la cantidad fija que pagas de tu bolsillo en cada siniestro con culpa. El resto lo cubre el seguro.',
    tags: ['franquicia', 'coste', 'siniestro']
  },
  {
    id: 'au011',
    category: 'AUTO',
    difficulty: 1,
    question: '¿Qué cubre el seguro contra robo?',
    options: [
      'Solo objetos dentro del coche',
      'El robo o hurto del vehículo',
      'Multas de aparcamiento',
      'Cambios de aceite'
    ],
    correctIndex: 1,
    explanation: 'La cobertura de robo indemniza si te roban el vehículo completo o piezas. Puede incluir objetos personales con límites.',
    tags: ['robo', 'hurto', 'cobertura']
  },
  {
    id: 'au012',
    category: 'AUTO',
    difficulty: 1,
    question: '¿Qué es un "siniestro sin culpa"?',
    options: [
      'Un accidente imaginario',
      'Accidente causado por otro',
      'Un accidente sin daños',
      'Una multa de tráfico'
    ],
    correctIndex: 1,
    explanation: 'Es cuando otro conductor tiene toda la culpa del accidente. No afecta a tu bonus ni historial, y puedes reclamar al seguro del culpable.',
    tags: ['sin-culpa', 'accidente', 'bonus']
  },
  {
    id: 'au013',
    category: 'AUTO',
    difficulty: 1,
    question: '¿Cubre el seguro de auto las multas de tráfico?',
    options: [
      'Sí, todas',
      'No, nunca',
      'Solo las de aparcamiento',
      'Solo si es sin culpa'
    ],
    correctIndex: 1,
    explanation: 'Las multas por infracciones de tráfico son responsabilidad personal del conductor y nunca están cubiertas por el seguro.',
    tags: ['multas', 'exclusiones', 'infracciones']
  },
  {
    id: 'au014',
    category: 'AUTO',
    difficulty: 1,
    question: '¿Qué es la "defensa jurídica" en el seguro de auto?',
    options: [
      'Un descuento legal',
      'Cobertura de gastos de abogado y juicio',
      'Una multa gratuita',
      'Un tipo de franquicia'
    ],
    correctIndex: 1,
    explanation: 'Cubre los gastos de abogados y procuradores si necesitas defender tus derechos o reclamar daños tras un accidente.',
    tags: ['defensa-juridica', 'legal', 'cobertura']
  },
  {
    id: 'au015',
    category: 'AUTO',
    difficulty: 1,
    question: '¿Qué debes llevar siempre en el coche según la ley?',
    options: [
      'Solo el DNI',
      'Permiso, ficha técnica, seguro y ITV',
      'Solo el seguro',
      'Nada es obligatorio'
    ],
    correctIndex: 1,
    explanation: 'Es obligatorio llevar: permiso de conducir, permiso de circulación, ficha técnica, justificante del seguro en vigor e ITV vigente.',
    tags: ['documentacion', 'obligatorio', 'legal']
  },
  {
    id: 'au016',
    category: 'AUTO',
    difficulty: 1,
    question: '¿Qué pasa si circulas sin seguro?',
    options: [
      'Nada grave',
      'Multa hasta 3.000€ e inmovilización del vehículo',
      'Solo una advertencia',
      'Te regalan un seguro'
    ],
    correctIndex: 1,
    explanation: 'Circular sin seguro es infracción muy grave: multa de hasta 3.000€, inmovilización del vehículo y posible retirada del permiso.',
    tags: ['sin-seguro', 'sanciones', 'legal']
  },
  {
    id: 'au017',
    category: 'AUTO',
    difficulty: 1,
    question: '¿Qué es el certificado del seguro o "tarjeta verde"?',
    options: [
      'Una tarjeta de descuentos',
      'Documento que acredita tu seguro',
      'El permiso de conducir',
      'La ITV del coche'
    ],
    correctIndex: 1,
    explanation: 'Es el documento (antes verde, ahora digital) que demuestra que tienes seguro en vigor. Debes llevarlo siempre contigo.',
    tags: ['certificado', 'tarjeta-verde', 'documentacion']
  },
  {
    id: 'au018',
    category: 'AUTO',
    difficulty: 1,
    question: '¿Qué cubre el "seguro de ocupantes"?',
    options: [
      'Solo al conductor',
      'Lesiones de pasajeros del vehículo',
      'Daños del coche',
      'Robo de equipaje'
    ],
    correctIndex: 1,
    explanation: 'Indemniza a los ocupantes del vehículo asegurado (conductor y pasajeros) por lesiones, invalidez o muerte en accidente.',
    tags: ['ocupantes', 'pasajeros', 'lesiones']
  },
  {
    id: 'au019',
    category: 'AUTO',
    difficulty: 1,
    question: '¿Qué es un "vehículo de sustitución"?',
    options: [
      'Tu coche nuevo',
      'Coche que te prestan mientras reparan el tuyo',
      'El coche del mecánico',
      'Un taxi gratuito'
    ],
    correctIndex: 1,
    explanation: 'Es un coche de alquiler que te facilita el seguro mientras el tuyo está en el taller tras un siniestro cubierto.',
    tags: ['vehiculo-sustitucion', 'reparacion', 'servicios']
  },
  {
    id: 'au020',
    category: 'AUTO',
    difficulty: 1,
    question: '¿Cubre el seguro daños por fenómenos meteorológicos?',
    options: [
      'Nunca',
      'Sí, con coberturas de incendio o todo riesgo',
      'Solo en verano',
      'Solo si hay tornado'
    ],
    correctIndex: 1,
    explanation: 'Daños por granizo, rayos, inundaciones suelen estar cubiertos en pólizas de incendio y todo riesgo. A terceros solo cubre RC obligatoria.',
    tags: ['meteorologia', 'fenomenos-naturales', 'cobertura']
  },
  {
    id: 'au021',
    category: 'AUTO',
    difficulty: 1,
    question: '¿Qué es la "pérdida total" de un vehículo?',
    options: [
      'Cuando se pierde la llave',
      'Cuando el coste de reparación supera el valor',
      'Cuando tiene más de 10 años',
      'Cuando falla el motor'
    ],
    correctIndex: 1,
    explanation: 'Se declara pérdida total cuando reparar el vehículo costaría más que su valor de mercado. La aseguradora indemniza el valor y se queda el coche.',
    tags: ['perdida-total', 'indemnizacion', 'siniestro']
  },
  {
    id: 'au022',
    category: 'AUTO',
    difficulty: 1,
    question: '¿Qué información necesitas intercambiar tras un accidente leve?',
    options: [
      'Solo los nombres',
      'Datos personales, seguro, matrícula y fotos',
      'Solo la matrícula',
      'No hace falta nada'
    ],
    correctIndex: 1,
    explanation: 'Intercambia: nombre, DNI, teléfono, matrícula, aseguradora, póliza, fotos de daños y posición de vehículos. Rellena el parte amistoso.',
    tags: ['accidente', 'documentacion', 'protocolo']
  },
  {
    id: 'au023',
    category: 'AUTO',
    difficulty: 1,
    question: '¿Puedes contratar un seguro si tienes puntos suspendidos?',
    options: [
      'No, es imposible',
      'Sí, pero puede ser más caro',
      'Solo a terceros',
      'Solo para motos'
    ],
    correctIndex: 1,
    explanation: 'Puedes contratar seguro con suspensión de puntos, pero las aseguradoras lo consideran mayor riesgo y suelen cobrar primas más altas.',
    tags: ['puntos-carnet', 'contratacion', 'prima']
  },
  {
    id: 'au024',
    category: 'AUTO',
    difficulty: 1,
    question: '¿Afecta la edad del conductor al precio del seguro?',
    options: [
      'No, nunca',
      'Sí, los jóvenes suelen pagar más',
      'Solo en vehículos nuevos',
      'Solo los mayores de 80'
    ],
    correctIndex: 1,
    explanation: 'Los conductores jóvenes (menores de 25-30 años) suelen tener primas más altas por mayor siniestralidad estadística.',
    tags: ['edad', 'prima', 'factores-precio']
  },
  {
    id: 'au025',
    category: 'AUTO',
    difficulty: 1,
    question: '¿Qué es el "valor venal" del vehículo?',
    options: [
      'El precio de compra original',
      'El valor actual de mercado',
      'El valor sentimental',
      'El precio de piezas de recambio'
    ],
    correctIndex: 1,
    explanation: 'Es el valor real del vehículo en el mercado actual, considerando antigüedad, estado y kilometraje. Base para indemnizaciones.',
    tags: ['valor-venal', 'indemnizacion', 'tasacion']
  },

  // MEDIAS (15 preguntas)
  {
    id: 'au026',
    category: 'AUTO',
    difficulty: 2,
    question: '¿Qué es el sistema bonus-malus en seguros de auto?',
    options: [
      'Un tipo de coche',
      'Descuentos/recargos según historial de siniestros',
      'Una marca de seguros',
      'Un modelo de franquicia'
    ],
    correctIndex: 1,
    explanation: 'Sistema que reduce tu prima (bonus) por años sin siniestros o la aumenta (malus) si tienes accidentes con culpa. Puede llegar a 50-70% de descuento.',
    tags: ['bonus-malus', 'descuentos', 'siniestralidad']
  },
  {
    id: 'au027',
    category: 'AUTO',
    difficulty: 2,
    question: '¿Qué es la "responsabilidad civil voluntaria" en auto?',
    options: [
      'No existe',
      'Ampliación del capital asegurado de RC',
      'Un seguro opcional diferente',
      'Lo mismo que todo riesgo'
    ],
    correctIndex: 1,
    explanation: 'Aumenta el capital mínimo legal de RC (actualmente 70M€ en España) a cantidades mayores para mejor protección ante daños graves.',
    tags: ['rc-voluntaria', 'ampliacion', 'capital']
  },
  {
    id: 'au028',
    category: 'AUTO',
    difficulty: 2,
    question: '¿Qué es un "recibo impagado" en el seguro?',
    options: [
      'Un descuento',
      'Una prima no pagada que puede anular cobertura',
      'Un tipo de franquicia',
      'Una cobertura especial'
    ],
    correctIndex: 1,
    explanation: 'Si no pagas un recibo, tras avisos la aseguradora puede suspender la cobertura en 1-2 meses. Sin cobertura, no puedes circular legalmente.',
    tags: ['impago', 'suspension', 'coberturas']
  },
  {
    id: 'au029',
    category: 'AUTO',
    difficulty: 2,
    question: '¿Qué diferencia hay entre "todo riesgo" y "todo riesgo con franquicia"?',
    options: [
      'No hay diferencia',
      'Con franquicia pagas una parte en cada siniestro',
      'Sin franquicia no cubre nada',
      'Con franquicia es más caro'
    ],
    correctIndex: 1,
    explanation: 'El todo riesgo con franquicia es más barato, pero pagas (ej. 300-600€) en cada siniestro con culpa. Sin franquicia, pagas más prima pero 0€ en siniestros.',
    tags: ['todo-riesgo', 'franquicia', 'modalidades']
  },
  {
    id: 'au030',
    category: 'AUTO',
    difficulty: 2,
    question: '¿Cubre el seguro si conduces bajo efectos del alcohol?',
    options: [
      'Sí, todo',
      'RC a terceros sí, daños propios no',
      'Nada en absoluto',
      'Solo con autorización'
    ],
    correctIndex: 1,
    explanation: 'La RC obligatoria siempre opera (protege a víctimas), pero el seguro no cubre daños propios y puede reclamar lo pagado al conductor ebrio.',
    tags: ['alcohol', 'exclusiones', 'responsabilidad-civil']
  },
  {
    id: 'au031',
    category: 'AUTO',
    difficulty: 2,
    question: '¿Qué es el "parte contradictorio" de accidente?',
    options: [
      'Un accidente complejo',
      'Cuando los conductores no están de acuerdo',
      'Un tipo de cobertura',
      'Un documento opcional'
    ],
    correctIndex: 1,
    explanation: 'Ocurre cuando los conductores no coinciden en la versión de los hechos. Cada uno rellena su parte por separado y puede requerir peritaje.',
    tags: ['parte-contradictorio', 'accidente', 'discrepancia']
  },
  {
    id: 'au032',
    category: 'AUTO',
    difficulty: 2,
    question: '¿Qué es la "depreciación por uso"?',
    options: [
      'Un descuento en la prima',
      'La reducción de valor del coche con el tiempo',
      'Un tipo de franquicia',
      'Una cobertura adicional'
    ],
    correctIndex: 1,
    explanation: 'Es la pérdida de valor del vehículo por antigüedad y kilometraje. Las indemnizaciones por siniestro se calculan sobre el valor depreciado.',
    tags: ['depreciacion', 'valor', 'indemnizacion']
  },
  {
    id: 'au033',
    category: 'AUTO',
    difficulty: 2,
    question: '¿Qué es la cobertura de "daños propios sin culpa"?',
    options: [
      'No existe',
      'Cubre tu coche cuando otro tiene la culpa',
      'Solo para terceros',
      'Un tipo de robo'
    ],
    correctIndex: 1,
    explanation: 'Intermedia entre terceros y todo riesgo. Cubre daños de tu coche solo cuando otro conductor identificado tiene la culpa total o parcial.',
    tags: ['daños-propios-sin-culpa', 'modalidad', 'cobertura']
  },
  {
    id: 'au034',
    category: 'AUTO',
    difficulty: 2,
    question: '¿Qué es el "baremo de autos"?',
    options: [
      'Un tipo de vehículo',
      'Sistema para valorar daños corporales',
      'Una marca de coches',
      'Un descuento especial'
    ],
    correctIndex: 1,
    explanation: 'Es el sistema legal que establece las indemnizaciones por lesiones, secuelas e incapacidades derivadas de accidentes de tráfico.',
    tags: ['baremo', 'indemnizacion', 'lesiones']
  },
  {
    id: 'au035',
    category: 'AUTO',
    difficulty: 2,
    question: '¿Qué son los "accesorios no originales" del coche?',
    options: [
      'Piezas de fábrica',
      'Elementos añadidos después de la compra',
      'El color del coche',
      'Los neumáticos'
    ],
    correctIndex: 1,
    explanation: 'Son elementos añadidos tras la compra (GPS, equipo de música, llantas especiales). Deben declararse para estar cubiertos, con límites de indemnización.',
    tags: ['accesorios', 'declaracion', 'cobertura']
  },
  {
    id: 'au036',
    category: 'AUTO',
    difficulty: 2,
    question: '¿Qué es la "responsabilidad del conductor"?',
    options: [
      'La RC a terceros',
      'Cobertura de lesiones del conductor culpable',
      'Una multa',
      'Un tipo de bonus'
    ],
    correctIndex: 1,
    explanation: 'Cobertura adicional que indemniza al conductor por sus propias lesiones incluso cuando él causó el accidente.',
    tags: ['responsabilidad-conductor', 'lesiones', 'cobertura-adicional']
  },
  {
    id: 'au037',
    category: 'AUTO',
    difficulty: 2,
    question: '¿Qué es el "seguro temporal de vehículos"?',
    options: [
      'No existe',
      'Seguro por días o semanas',
      'Un seguro que caduca',
      'Solo para vacaciones'
    ],
    correctIndex: 1,
    explanation: 'Póliza de corta duración (días, semanas o meses) útil para vehículos que circulan poco o temporalmente (clásicos, mudanzas, etc.).',
    tags: ['temporal', 'corta-duracion', 'modalidad']
  },
  {
    id: 'au038',
    category: 'AUTO',
    difficulty: 2,
    question: '¿Afecta el lugar de estacionamiento habitual al precio?',
    options: [
      'No, nunca',
      'Sí, garaje cerrado suele ser más barato',
      'Solo en coches rojos',
      'Solo en invierno'
    ],
    correctIndex: 1,
    explanation: 'Aparcar en garaje privado reduce riesgos de robo y vandalismo, lo que generalmente reduce la prima del seguro.',
    tags: ['estacionamiento', 'garaje', 'prima']
  },
  {
    id: 'au039',
    category: 'AUTO',
    difficulty: 2,
    question: '¿Qué es la "asistencia en viaje desde 0 km"?',
    options: [
      'No existe',
      'Asistencia incluso cerca de casa',
      'Solo para viajes largos',
      'Solo en el extranjero'
    ],
    correctIndex: 1,
    explanation: 'Algunas pólizas ofrecen grúa y asistencia desde tu propia puerta. La básica suele ser desde 25-50 km de tu domicilio.',
    tags: ['asistencia', '0km', 'cobertura']
  },
  {
    id: 'au040',
    category: 'AUTO',
    difficulty: 2,
    question: '¿Qué es el "certificado internacional de seguro"?',
    options: [
      'No es necesario en Europa',
      'Extensión del seguro a países concretos',
      'Un pasaporte para el coche',
      'Una multa internacional'
    ],
    correctIndex: 1,
    explanation: 'Aunque en UE/EEE tu seguro español es válido, para ciertos países (Marruecos, Túnez, etc.) necesitas la Carta Verde específica.',
    tags: ['internacional', 'carta-verde', 'extranjero']
  },

  // DIFÍCILES (10 preguntas)
  {
    id: 'au041',
    category: 'AUTO',
    difficulty: 3,
    question: '¿Qué es la "acción directa" contra la aseguradora?',
    options: [
      'Una manifestación',
      'Derecho del perjudicado a reclamar directamente',
      'Un tipo de seguro',
      'Una cobertura especial'
    ],
    correctIndex: 1,
    explanation: 'Derecho legal que permite al perjudicado en un accidente reclamar directamente a la aseguradora del culpable, sin pasar por tribunales.',
    tags: ['accion-directa', 'reclamacion', 'derecho']
  },
  {
    id: 'au042',
    category: 'AUTO',
    difficulty: 3,
    question: '¿Qué es el "convenio de indemnización directa" (CID)?',
    options: [
      'Un tribunal de seguros',
      'Acuerdo para agilizar indemnizaciones sin culpa',
      'Un tipo de franquicia',
      'Una cobertura opcional'
    ],
    correctIndex: 1,
    explanation: 'Acuerdo entre aseguradoras para que tu propia compañía te indemnice rápidamente cuando no tienes culpa, y luego reclame al culpable.',
    tags: ['cid', 'indemnizacion-directa', 'convenio']
  },
  {
    id: 'au043',
    category: 'AUTO',
    difficulty: 3,
    question: '¿Qué es el "fondo de garantía del automóvil"?',
    options: [
      'Una cuenta de ahorro',
      'Fondo que indemniza cuando el culpable no tiene seguro',
      'Un seguro gratuito',
      'Una prima adicional'
    ],
    correctIndex: 1,
    explanation: 'Fondo público que indemniza a víctimas de accidentes causados por vehículos sin seguro, no identificados o robados.',
    tags: ['fondo-garantia', 'sin-seguro', 'proteccion']
  },
  {
    id: 'au044',
    category: 'AUTO',
    difficulty: 3,
    question: '¿Qué es la "subrogación" en seguros de auto?',
    options: [
      'Cambiar de coche',
      'La aseguradora reclama al culpable lo que te pagó',
      'Renovar el seguro',
      'Un tipo de descuento'
    ],
    correctIndex: 1,
    explanation: 'Tras indemnizarte, tu aseguradora asume tus derechos para reclamar al responsable del daño y recuperar lo pagado.',
    tags: ['subrogacion', 'reclamacion', 'recuperacion']
  },
  {
    id: 'au045',
    category: 'AUTO',
    difficulty: 3,
    question: '¿Qué es la "agravación del riesgo"?',
    options: [
      'Conducir más rápido',
      'Cambio en circunstancias que aumenta riesgo',
      'Un accidente grave',
      'Una cobertura adicional'
    ],
    correctIndex: 1,
    explanation: 'Cambios no comunicados que aumentan el riesgo (cambio de conductor habitual, uso profesional, modificaciones) pueden anular cobertura.',
    tags: ['agravacion-riesgo', 'modificaciones', 'obligaciones']
  },
  {
    id: 'au046',
    category: 'AUTO',
    difficulty: 3,
    question: '¿Qué es el "coeficiente reductor por limitación de conductores"?',
    options: [
      'Un descuento por limitar quién conduce',
      'Una multa',
      'Un tipo de franquicia',
      'No existe'
    ],
    correctIndex: 0,
    explanation: 'Algunas aseguradoras ofrecen descuentos si limitas los conductores autorizados a personas concretas (ej. solo titular y cónyuge).',
    tags: ['descuentos', 'conductores-autorizados', 'prima']
  },
  {
    id: 'au047',
    category: 'AUTO',
    difficulty: 3,
    question: '¿Qué es el "valor de nuevo" o "reposición a nuevo"?',
    options: [
      'El precio del coche usado',
      'Cobertura que indemniza por un coche nuevo',
      'Un tipo de franquicia',
      'Un descuento especial'
    ],
    correctIndex: 1,
    explanation: 'Garantía que, durante los primeros años, indemniza el precio de un vehículo nuevo equivalente en vez del valor depreciado.',
    tags: ['valor-nuevo', 'reposicion', 'garantia']
  },
  {
    id: 'au048',
    category: 'AUTO',
    difficulty: 3,
    question: '¿Qué diferencia hay entre "taller concertado" y "taller libre"?',
    options: [
      'No hay diferencia',
      'Concertado tiene acuerdo con la aseguradora',
      'Libre es más caro siempre',
      'Concertado solo para motos'
    ],
    correctIndex: 1,
    explanation: 'Talleres concertados tienen convenio con la aseguradora (suele incluir garantías extra y sin adelantar dinero). Taller libre puedes elegir pero con posibles límites.',
    tags: ['taller-concertado', 'taller-libre', 'reparacion']
  },
  {
    id: 'au049',
    category: 'AUTO',
    difficulty: 3,
    question: '¿Qué es la "pérdida de valor venal" del vehículo?',
    options: [
      'Una multa',
      'Depreciación extra por haber tenido accidente',
      'La prima anual',
      'Un descuento'
    ],
    correctIndex: 1,
    explanation: 'Un coche reparado tras accidente grave vale menos que uno sin historial. Algunas pólizas premium indemnizan esta pérdida de valor comercial.',
    tags: ['perdida-valor', 'depreciacion', 'indemnizacion']
  },
  {
    id: 'au050',
    category: 'AUTO',
    difficulty: 3,
    question: '¿Qué es el "peritaje contradictorio"?',
    options: [
      'Un perito que miente',
      'Segundo peritaje cuando no estás de acuerdo',
      'Un tipo de accidente',
      'Una cobertura especial'
    ],
    correctIndex: 1,
    explanation: 'Si discrepas de la valoración del perito de la aseguradora, puedes contratar tu propio perito. Si no hay acuerdo, interviene un tercero dirimente.',
    tags: ['peritaje-contradictorio', 'valoracion', 'reclamacion']
  }
];

// ============================================
// CATEGORÍA 3: SEGUROS DE HOGAR (50 preguntas)
// ============================================

const segurosHogar: QuizQuestion[] = [
  // FÁCILES (25 preguntas)
  {
    id: 'ho001',
    category: 'HOGAR',
    difficulty: 1,
    question: '¿Qué cubre básicamente un seguro de hogar?',
    options: [
      'Solo el edificio',
      'Continente (estructura) y contenido (bienes)',
      'Solo los muebles',
      'Solo incendios'
    ],
    correctIndex: 1,
    explanation: 'El seguro de hogar cubre tanto el continente (paredes, techos, instalaciones) como el contenido (muebles, electrodomésticos, objetos personales).',
    tags: ['conceptos-basicos', 'continente', 'contenido']
  },
  {
    id: 'ho002',
    category: 'HOGAR',
    difficulty: 1,
    question: '¿Qué es el "continente" en un seguro de hogar?',
    options: [
      'Los muebles',
      'La estructura física de la vivienda',
      'El jardín',
      'Los vecinos'
    ],
    correctIndex: 1,
    explanation: 'El continente incluye: paredes, suelos, techos, puertas, ventanas, instalaciones fijas (fontanería, electricidad, calefacción).',
    tags: ['continente', 'estructura', 'conceptos-basicos']
  },
  {
    id: 'ho003',
    category: 'HOGAR',
    difficulty: 1,
    question: '¿Qué es el "contenido" en un seguro de hogar?',
    options: [
      'Las paredes',
      'Muebles y objetos personales',
      'Los vecinos',
      'El portal'
    ],
    correctIndex: 1,
    explanation: 'El contenido abarca: muebles, electrodomésticos, ropa, objetos personales, decoración, equipos electrónicos, etc.',
    tags: ['contenido', 'bienes', 'conceptos-basicos']
  },
  {
    id: 'ho004',
    category: 'HOGAR',
    difficulty: 1,
    question: '¿Qué cubre la garantía de incendio en hogar?',
    options: [
      'Solo fuegos en la cocina',
      'Daños por fuego, explosión, humo y rayo',
      'Solo incendios forestales',
      'No cubre nada'
    ],
    correctIndex: 1,
    explanation: 'Cubre daños causados por incendio, explosión, impacto de rayos, humo y los gastos de extinción del fuego.',
    tags: ['incendio', 'explosion', 'coberturas']
  },
  {
    id: 'ho005',
    category: 'HOGAR',
    difficulty: 1,
    question: '¿Qué es la Responsabilidad Civil en el seguro de hogar?',
    options: [
      'Pagar la hipoteca',
      'Daños que causes a terceros desde tu vivienda',
      'Reparar tus muebles',
      'Pagar la comunidad'
    ],
    correctIndex: 1,
    explanation: 'Cubre daños involuntarios que tú o tu familia causáis a terceros desde la vivienda (ej: inundación al vecino, objeto que cae a la calle).',
    tags: ['responsabilidad-civil', 'terceros', 'coberturas']
  },
  {
    id: 'ho006',
    category: 'HOGAR',
    difficulty: 1,
    question: '¿Cubre el seguro de hogar el robo?',
    options: [
      'Nunca',
      'Sí, con la cobertura de robo contratada',
      'Solo en vacaciones',
      'Solo joyas'
    ],
    correctIndex: 1,
    explanation: 'La cobertura de robo indemniza por sustracción de objetos mediante fuerza (escalamiento, rotura) y daños causados por los ladrones.',
    tags: ['robo', 'hurto', 'coberturas']
  },
  {
    id: 'ho007',
    category: 'HOGAR',
    difficulty: 1,
    question: '¿Qué son los "daños por agua" en hogar?',
    options: [
      'Solo inundaciones de río',
      'Roturas de tuberías, fugas, atascos',
      'Solo lluvia',
      'El agua embotellada'
    ],
    correctIndex: 1,
    explanation: 'Cubre daños por roturas de tuberías, fugas de agua, atascos de desagües, filtraciones desde otras viviendas, etc.',
    tags: ['daños-agua', 'fugas', 'coberturas']
  },
  {
    id: 'ho008',
    category: 'HOGAR',
    difficulty: 1,
    question: '¿Qué es la cobertura de cristales en hogar?',
    options: [
      'Solo espejos',
      'Ventanas, puertas de cristal, mamparas',
      'Solo el microondas',
      'Las gafas'
    ],
    correctIndex: 1,
    explanation: 'Cubre rotura accidental de cristales, ventanas, puertas acristaladas, mamparas de baño, espejos fijos y vitrocerámicas.',
    tags: ['cristales', 'roturas', 'coberturas']
  },
  {
    id: 'ho009',
    category: 'HOGAR',
    difficulty: 1,
    question: '¿Qué es la asistencia en el hogar?',
    options: [
      'Una empleada de hogar',
      'Servicios de fontanero, cerrajero, electricista',
      'Clases de cocina',
      'Limpieza semanal'
    ],
    correctIndex: 1,
    explanation: 'Servicio 24/7 de profesionales (fontanero, electricista, cerrajero, cristalero) para urgencias en el hogar, a menudo sin coste.',
    tags: ['asistencia', 'urgencias', 'servicios']
  },
  {
    id: 'ho010',
    category: 'HOGAR',
    difficulty: 1,
    question: '¿Debo asegurar el valor de compra de mi vivienda?',
    options: [
      'Sí, siempre',
      'No, solo el valor de reconstrucción',
      'Sí, con el terreno incluido',
      'Solo si es nueva'
    ],
    correctIndex: 1,
    explanation: 'Debes asegurar el coste de reconstruir la vivienda (sin incluir el valor del terreno), no el precio de mercado o compra.',
    tags: ['valoracion', 'suma-asegurada', 'continente']
  },
  {
    id: 'ho011',
    category: 'HOGAR',
    difficulty: 1,
    question: '¿Qué es la defensa jurídica en el seguro de hogar?',
    options: [
      'Un servicio de seguridad',
      'Cobertura de gastos legales relacionados con el hogar',
      'Una alarma',
      'Un descuento fiscal'
    ],
    correctIndex: 1,
    explanation: 'Cubre gastos de abogados y procuradores en conflictos legales relacionados con tu vivienda (comunidad, inquilinos, etc.).',
    tags: ['defensa-juridica', 'legal', 'coberturas']
  },
  {
    id: 'ho012',
    category: 'HOGAR',
    difficulty: 1,
    question: '¿Cubre el seguro si me olvido un grifo abierto?',
    options: [
      'Sí, siempre',
      'Generalmente no, es negligencia',
      'Solo en verano',
      'Solo si es el baño'
    ],
    correctIndex: 1,
    explanation: 'Los daños por negligencia grave (grifos abiertos, aparatos sin vigilar) normalmente están excluidos de la cobertura.',
    tags: ['exclusiones', 'negligencia', 'daños-agua']
  },
  {
    id: 'ho013',
    category: 'HOGAR',
    difficulty: 1,
    question: '¿Qué debes hacer si hay un robo en tu casa?',
    options: [
      'Esperar una semana',
      'Denunciarlo a la policía inmediatamente',
      'Limpiar todo',
      'No hacer nada'
    ],
    correctIndex: 1,
    explanation: 'Debes poner denuncia policial inmediata, no tocar nada hasta que vengan, hacer fotos, listar lo robado y avisar al seguro en 7 días.',
    tags: ['robo', 'protocolo', 'siniestro']
  },
  {
    id: 'ho014',
    category: 'HOGAR',
    difficulty: 1,
    question: '¿Qué cubre el seguro si hay un escape de gas?',
    options: [
      'Nada',
      'Daños por explosión y gastos de reparación',
      'Solo en cocinas nuevas',
      'Solo la bombona'
    ],
    correctIndex: 1,
    explanation: 'La cobertura de incendio/explosión incluye daños por fugas de gas que causen explosión, y los gastos de localización y reparación de la fuga.',
    tags: ['gas', 'explosion', 'coberturas']
  },
  {
    id: 'ho015',
    category: 'HOGAR',
    difficulty: 1,
    question: '¿Cubre el seguro los electrodomésticos?',
    options: [
      'Nunca',
      'Sí, dentro del capital de contenido',
      'Solo la nevera',
      'Solo si son nuevos'
    ],
    correctIndex: 1,
    explanation: 'Los electrodomésticos están cubiertos dentro del capital asegurado de contenido frente a riesgos como incendio, robo, daños por agua, etc.',
    tags: ['electrodomesticos', 'contenido', 'coberturas']
  },
  {
    id: 'ho016',
    category: 'HOGAR',
    difficulty: 1,
    question: '¿Qué es un "inventario de bienes"?',
    options: [
      'Una lista de compras',
      'Relación detallada de tus pertenencias',
      'El recibo del seguro',
      'La escritura de la casa'
    ],
    correctIndex: 1,
    explanation: 'Es una lista con descripción, valor y fotos de tus bienes. Fundamental para justificar el contenido en caso de siniestro total (robo, incendio).',
    tags: ['inventario', 'documentacion', 'contenido']
  },
  {
    id: 'ho017',
    category: 'HOGAR',
    difficulty: 1,
    question: '¿Cubre el seguro roturas de electrodomésticos por avería?',
    options: [
      'Sí, siempre',
      'Solo con cobertura específica de electromecánicos',
      'Automáticamente',
      'Nunca'
    ],
    correctIndex: 1,
    explanation: 'Las averías eléctricas o mecánicas requieren cobertura específica adicional. El seguro básico cubre daños por siniestros (incendio, agua), no averías.',
    tags: ['electromecanicos', 'averias', 'cobertura-adicional']
  },
  {
    id: 'ho018',
    category: 'HOGAR',
    difficulty: 1,
    question: '¿Qué es la cobertura de "objetos valiosos"?',
    options: [
      'No existe',
      'Protección extra para joyas, arte, objetos caros',
      'Solo para casas grandes',
      'Un tipo de alarma'
    ],
    correctIndex: 1,
    explanation: 'Cobertura específica para objetos de gran valor (joyas, arte, antigüedades) que necesitas declarar con tasación para estar bien cubiertos.',
    tags: ['objetos-valiosos', 'joyas', 'cobertura-adicional']
  },
  {
    id: 'ho019',
    category: 'HOGAR',
    difficulty: 1,
    question: '¿Debo declarar reformas importantes al seguro?',
    options: [
      'No es necesario',
      'Sí, pueden cambiar el valor asegurado',
      'Solo si cambias de piso',
      'Solo decoración'
    ],
    correctIndex: 1,
    explanation: 'Reformas que aumentan valor o modifican la vivienda deben comunicarse para actualizar el capital asegurado y evitar infraseguro.',
    tags: ['reformas', 'modificaciones', 'obligaciones']
  },
  {
    id: 'ho020',
    category: 'HOGAR',
    difficulty: 1,
    question: '¿Cubre el seguro daños por fenómenos atmosféricos?',
    options: [
      'Nunca',
      'Sí, viento, granizo, nieve, rayo',
      'Solo en invierno',
      'Solo en la costa'
    ],
    correctIndex: 1,
    explanation: 'Están cubiertos daños por viento, huracán, granizo, nieve, pedrisco, caída de rayo, etc. Las inundaciones las cubre el Consorcio.',
    tags: ['fenomenos-atmosfericos', 'meteorologia', 'coberturas']
  },
  {
    id: 'ho021',
    category: 'HOGAR',
    difficulty: 1,
    question: '¿Qué es el "alojamiento alternativo"?',
    options: [
      'Un hotel de lujo',
      'Pago de alojamiento si tu casa es inhabitable',
      'Mudanza gratis',
      'No existe'
    ],
    correctIndex: 1,
    explanation: 'Si tu vivienda queda inhabitable por siniestro cubierto, el seguro paga alojamiento temporal (hotel, alquiler) con límites establecidos.',
    tags: ['alojamiento-alternativo', 'inhabitable', 'servicios']
  },
  {
    id: 'ho022',
    category: 'HOGAR',
    difficulty: 1,
    question: '¿Cubre el seguro si un rayo daña la televisión?',
    options: [
      'Nunca',
      'Sí, por daños eléctricos debidos a rayo',
      'Solo televisores nuevos',
      'Solo en verano'
    ],
    correctIndex: 1,
    explanation: 'Los daños en aparatos eléctricos causados directamente por caída de rayo o sobretensión derivada están normalmente cubiertos.',
    tags: ['rayo', 'daños-electricos', 'coberturas']
  },
  {
    id: 'ho023',
    category: 'HOGAR',
    difficulty: 1,
    question: '¿Necesitas seguro de hogar si vives de alquiler?',
    options: [
      'No, nunca',
      'Sí, al menos para contenido y RC',
      'Solo el propietario',
      'Solo si es un piso grande'
    ],
    correctIndex: 1,
    explanation: 'Aunque el propietario asegure el continente, debes asegurar tu contenido (muebles, objetos) y tu Responsabilidad Civil como inquilino.',
    tags: ['alquiler', 'inquilino', 'contenido']
  },
  {
    id: 'ho024',
    category: 'HOGAR',
    difficulty: 1,
    question: '¿Qué es la "inhabilitación de vivienda"?',
    options: [
      'Una multa',
      'Cuando no puedes vivir en casa por siniestro',
      'Cambiar de domicilio',
      'Una reforma'
    ],
    correctIndex: 1,
    explanation: 'Es cuando la vivienda queda temporalmente no habitable por siniestro. El seguro cubre gastos de alojamiento alternativo durante las reparaciones.',
    tags: ['inhabilitacion', 'alojamiento', 'siniestro']
  },
  {
    id: 'ho025',
    category: 'HOGAR',
    difficulty: 1,
    question: '¿Cubre el seguro si se rompe una tubería antigua?',
    options: [
      'Nunca',
      'Sí, los daños causados por la rotura',
      'Solo tuberías nuevas',
      'Solo en invierno'
    ],
    correctIndex: 1,
    explanation: 'Cubre los daños causados por la rotura (agua filtrada, destrozos). La reparación de la tubería puede tener límites o franquicia.',
    tags: ['tuberias', 'daños-agua', 'coberturas']
  },

  // MEDIAS (15 preguntas)
  {
    id: 'ho026',
    category: 'HOGAR',
    difficulty: 2,
    question: '¿Qué diferencia hay entre "valor de reposición" y "valor real"?',
    options: [
      'No hay diferencia',
      'Reposición es nuevo, real es con depreciación',
      'Real es más caro',
      'Solo importa en incendios'
    ],
    correctIndex: 1,
    explanation: 'Valor de reposición indemniza el coste de comprar nuevo. Valor real aplica depreciación por uso y antigüedad (menos indemnización).',
    tags: ['valor-reposicion', 'valor-real', 'indemnizacion']
  },
  {
    id: 'ho027',
    category: 'HOGAR',
    difficulty: 2,
    question: '¿Qué es la "regla proporcional" en hogar?',
    options: [
      'Un descuento',
      'Reducción de indemnización por infraseguro',
      'Una cobertura adicional',
      'No existe'
    ],
    correctIndex: 1,
    explanation: 'Si aseguras por menos valor del real (infraseguro), la indemnización se reduce proporcionalmente. Ejemplo: aseguras 50% → te pagan 50% del daño.',
    tags: ['regla-proporcional', 'infraseguro', 'indemnizacion']
  },
  {
    id: 'ho028',
    category: 'HOGAR',
    difficulty: 2,
    question: '¿Qué son los "daños estéticos" en hogar?',
    options: [
      'Muebles feos',
      'Daños visibles que no afectan funcionalidad',
      'Reformas de decoración',
      'No están cubiertos'
    ],
    correctIndex: 1,
    explanation: 'Daños estéticos son desperfectos visibles (manchas, desconchones) que no afectan la función. Muchas pólizas los limitan o excluyen.',
    tags: ['daños-esteticos', 'indemnizacion', 'limitaciones']
  },
  {
    id: 'ho029',
    category: 'HOGAR',
    difficulty: 2,
    question: '¿Qué es la "busca y reparación de fugas"?',
    options: [
      'Un servicio gratuito',
      'Cobertura de costes de localizar y arreglar fuga oculta',
      'Solo para fontaneros',
      'No está cubierto'
    ],
    correctIndex: 1,
    explanation: 'Cubre los gastos de detectar una fuga oculta (picado de paredes, suelos) y su reparación, con límites en la póliza.',
    tags: ['fugas', 'busca-reparacion', 'daños-agua']
  },
  {
    id: 'ho030',
    category: 'HOGAR',
    difficulty: 2,
    question: '¿Qué es la cobertura de "daños por agua de comunidad"?',
    options: [
      'No existe',
      'Daños causados por elementos comunes del edificio',
      'Solo piscinas',
      'Solo jardines'
    ],
    correctIndex: 1,
    explanation: 'Cubre daños en tu vivienda causados por roturas en elementos comunes (bajantes generales, terrazas comunitarias, etc.).',
    tags: ['comunidad', 'elementos-comunes', 'daños-agua']
  },
  {
    id: 'ho031',
    category: 'HOGAR',
    difficulty: 2,
    question: '¿Qué es el "fraude informático" en seguros de hogar?',
    options: [
      'No lo cubre',
      'Cobertura contra phishing, estafas online',
      'Solo para empresas',
      'Un tipo de robo'
    ],
    correctIndex: 1,
    explanation: 'Algunas pólizas modernas cubren pérdidas por fraudes online, phishing, suplantación de identidad, con límites específicos.',
    tags: ['fraude-informatico', 'ciberriesgos', 'cobertura-moderna']
  },
  {
    id: 'ho032',
    category: 'HOGAR',
    difficulty: 2,
    question: '¿Qué es la "RC del propietario"?',
    options: [
      'No existe',
      'Responsabilidad del dueño ante inquilinos y terceros',
      'Solo para casas',
      'Un impuesto'
    ],
    correctIndex: 1,
    explanation: 'Responsabilidad Civil específica del propietario por daños derivados del estado del inmueble alquilado (humedades, caídas, etc.).',
    tags: ['rc-propietario', 'alquiler', 'responsabilidad']
  },
  {
    id: 'ho033',
    category: 'HOGAR',
    difficulty: 2,
    question: '¿Cubre el seguro robo sin signos de violencia?',
    options: [
      'Sí, siempre',
      'Generalmente no, salvo cobertura específica',
      'Solo de día',
      'Solo joyas'
    ],
    correctIndex: 1,
    explanation: 'El robo básico requiere escalamiento o fuerza. El hurto sin signos (ej: llave robada) necesita cobertura adicional específica.',
    tags: ['robo', 'hurto', 'exclusiones']
  },
  {
    id: 'ho034',
    category: 'HOGAR',
    difficulty: 2,
    question: '¿Qué son los "gastos de salvamento"?',
    options: [
      'Gastos de vacaciones',
      'Costes para evitar o reducir daños mayores',
      'Reparaciones estéticas',
      'No están cubiertos'
    ],
    correctIndex: 1,
    explanation: 'Gastos razonables en que incurres para evitar daños mayores o salvaguardar bienes (ej: alquilar bomba de agua en inundación).',
    tags: ['gastos-salvamento', 'prevencion', 'coberturas']
  },
  {
    id: 'ho035',
    category: 'HOGAR',
    difficulty: 2,
    question: '¿Qué es la "pérdida de alquileres"?',
    options: [
      'No existe',
      'Indemnización si no puedes alquilar tras siniestro',
      'Solo para hoteles',
      'Un descuento'
    ],
    correctIndex: 1,
    explanation: 'Si eres propietario y alquilas la vivienda, cubre la pérdida de rentas mientras la casa está inhabitable por siniestro.',
    tags: ['perdida-alquileres', 'propietario', 'cobertura-adicional']
  },
  {
    id: 'ho036',
    category: 'HOGAR',
    difficulty: 2,
    question: '¿Qué es la cobertura de "comunidades"?',
    options: [
      'Fiestas vecinales',
      'Seguro que cubre elementos comunes del edificio',
      'Solo para presidentes',
      'No existe'
    ],
    correctIndex: 1,
    explanation: 'Seguro específico para comunidades de propietarios que cubre estructura, zonas comunes, RC de la comunidad, etc.',
    tags: ['comunidades', 'elementos-comunes', 'seguro-comunitario']
  },
  {
    id: 'ho037',
    category: 'HOGAR',
    difficulty: 2,
    question: '¿Qué es la "responsabilidad civil familiar"?',
    options: [
      'Solo del padre',
      'RC de toda la familia en vida privada',
      'Solo en casa',
      'No existe'
    ],
    correctIndex: 1,
    explanation: 'Cubre daños involuntarios causados por ti y tu familia en vida privada (no solo en casa): deportes, mascotas, hijos, etc.',
    tags: ['rc-familiar', 'responsabilidad', 'vida-privada']
  },
  {
    id: 'ho038',
    category: 'HOGAR',
    difficulty: 2,
    question: '¿Cubre el seguro daños causados por mascotas?',
    options: [
      'Nunca',
      'Daños a terceros sí, a tu casa puede tener límites',
      'Todo siempre',
      'Solo perros'
    ],
    correctIndex: 1,
    explanation: 'La RC familiar cubre daños de tu mascota a terceros. Daños en tu propia vivienda causados por tu mascota suelen estar excluidos o limitados.',
    tags: ['mascotas', 'rc-familiar', 'exclusiones']
  },
  {
    id: 'ho039',
    category: 'HOGAR',
    difficulty: 2,
    question: '¿Qué es el "seguro de impago de alquiler"?',
    options: [
      'Para inquilinos',
      'Protege al propietario si el inquilino no paga',
      'Solo para bancos',
      'No existe'
    ],
    correctIndex: 1,
    explanation: 'Producto específico para propietarios que cubre los alquileres si el inquilino deja de pagar, más gastos jurídicos de desahucio.',
    tags: ['impago-alquiler', 'propietario', 'proteccion-renta']
  },
  {
    id: 'ho040',
    category: 'HOGAR',
    difficulty: 2,
    question: '¿Qué es la cobertura de "todo riesgo en contenido"?',
    options: [
      'No existe',
      'Cubre daños accidentales a objetos',
      'Solo robo',
      'Solo incendio'
    ],
    correctIndex: 1,
    explanation: 'Cobertura premium que indemniza daños accidentales en objetos del contenido (caídas, roturas, derrames) no cubiertos en pólizas básicas.',
    tags: ['todo-riesgo-contenido', 'accidentes', 'cobertura-premium']
  },

  // DIFÍCILES (10 preguntas)
  {
    id: 'ho041',
    category: 'HOGAR',
    difficulty: 3,
    question: '¿Qué es el "coeficiente de depreciación"?',
    options: [
      'Un descuento',
      'Porcentaje de pérdida de valor por antigüedad',
      'Una prima adicional',
      'No existe'
    ],
    correctIndex: 1,
    explanation: 'Fórmula que calcula la reducción de valor de objetos/vivienda por uso y antigüedad, aplicado en indemnizaciones a "valor real".',
    tags: ['depreciacion', 'valoracion', 'indemnizacion']
  },
  {
    id: 'ho042',
    category: 'HOGAR',
    difficulty: 3,
    question: '¿Qué es el "concurso de acreedores" del Consorcio?',
    options: [
      'Un sorteo',
      'Cuando cobras tanto del seguro como del Consorcio',
      'Una multa',
      'No existe'
    ],
    correctIndex: 1,
    explanation: 'Situación donde un daño está cubierto tanto por tu seguro como por el Consorcio (ej: inundación). Ambos pagan proporcionalmente, sin enriquecimiento.',
    tags: ['consorcio', 'concurso', 'indemnizacion']
  },
  {
    id: 'ho043',
    category: 'HOGAR',
    difficulty: 3,
    question: '¿Qué es la "actualización automática del capital"?',
    options: [
      'Un aumento manual',
      'Revisión anual del capital según IPC',
      'Una penalización',
      'No existe'
    ],
    correctIndex: 1,
    explanation: 'Cláusula que actualiza automáticamente cada año el capital asegurado según IPC para mantener cobertura ante inflación.',
    tags: ['actualizacion-capital', 'ipc', 'inflacion']
  },
  {
    id: 'ho044',
    category: 'HOGAR',
    difficulty: 3,
    question: '¿Qué cubre exactamente el Consorcio en hogar?',
    options: [
      'Todo',
      'Riesgos extraordinarios: inundación, terrorismo, motín',
      'Solo incendios',
      'Nada'
    ],
    correctIndex: 1,
    explanation: 'El Consorcio cubre eventos extraordinarios no cubiertos por seguros privados: inundaciones, terremotos, terrorismo, tumultos, hechos de las FFAA.',
    tags: ['consorcio', 'riesgos-extraordinarios', 'cobertura-publica']
  },
  {
    id: 'ho045',
    category: 'HOGAR',
    difficulty: 3,
    question: '¿Qué es la "cláusula de nuevos valores"?',
    options: [
      'Una penalización',
      'Indemnización sin aplicar depreciación',
      'Un descuento',
      'Solo para viviendas nuevas'
    ],
    correctIndex: 1,
    explanation: 'Garantía que indemniza a valor de reposición sin descontar depreciación, aplicando el coste actual de nuevo equivalente.',
    tags: ['nuevos-valores', 'sin-depreciacion', 'indemnizacion']
  },
  {
    id: 'ho046',
    category: 'HOGAR',
    difficulty: 3,
    question: '¿Qué es el "derecho de subrogación" de la aseguradora?',
    options: [
      'Cambiar de seguro',
      'Reclamar al culpable lo que te indemnizó',
      'Cancelar la póliza',
      'No existe'
    ],
    correctIndex: 1,
    explanation: 'Tras indemnizarte, la aseguradora asume tus derechos para reclamar al responsable del daño (ej: vecino que causó inundación).',
    tags: ['subrogacion', 'reclamacion', 'recuperacion']
  },
  {
    id: 'ho047',
    category: 'HOGAR',
    difficulty: 3,
    question: '¿Qué es el "infraseguro sobrevenido"?',
    options: [
      'Un fraude',
      'Cuando aumenta el valor y no actualizas el capital',
      'Un descuento',
      'Una prima extra'
    ],
    correctIndex: 1,
    explanation: 'Ocurre cuando el valor real aumenta (reformas, inflación) y no actualizas el capital asegurado, quedando infrasegurado sin saberlo.',
    tags: ['infraseguro', 'actualizacion', 'riesgo']
  },
  {
    id: 'ho048',
    category: 'HOGAR',
    difficulty: 3,
    question: '¿Qué es la "tasación pericial contradictoria"?',
    options: [
      'Una estafa',
      'Segundo peritaje cuando discrepas del primero',
      'Un descuento',
      'No existe'
    ],
    correctIndex: 1,
    explanation: 'Si no estás de acuerdo con la valoración del perito de la aseguradora, puedes contratar tu perito. Si discrepan, un tercero decide.',
    tags: ['peritaje-contradictorio', 'valoracion', 'reclamacion']
  },
  {
    id: 'ho049',
    category: 'HOGAR',
    difficulty: 3,
    question: '¿Qué es el "periodo de carencia"?',
    options: [
      'Vacaciones del seguro',
      'Tiempo sin cobertura al inicio de la póliza',
      'Un descuento',
      'La renovación'
    ],
    correctIndex: 1,
    explanation: 'Periodo inicial tras contratar donde ciertas coberturas aún no están activas (común en RC, poco habitual en hogar salvo coberturas específicas).',
    tags: ['carencia', 'periodo', 'vigencia']
  },
  {
    id: 'ho050',
    category: 'HOGAR',
    difficulty: 3,
    question: '¿Qué es la "responsabilidad subsidiaria" del propietario?',
    options: [
      'No existe',
      'Responsable si el inquilino no paga daños',
      'Un descuento',
      'Solo para empresas'
    ],
    correctIndex: 1,
    explanation: 'El propietario puede ser responsable de daños causados por el estado del inmueble, incluso si lo ocupa un inquilino.',
    tags: ['responsabilidad-subsidiaria', 'propietario', 'legal']
  }
];

// ============================================
// CATEGORÍA 4: SEGUROS DE SALUD (50 preguntas)
// ============================================

const segurosSalud: QuizQuestion[] = [
  // FÁCILES (25 preguntas)
  {
    id: 'sa001',
    category: 'SALUD',
    difficulty: 1,
    question: '¿Qué es un seguro de salud privado?',
    options: [
      'Un médico particular',
      'Póliza que cubre asistencia médica privada',
      'El sistema público',
      'Una farmacia'
    ],
    correctIndex: 1,
    explanation: 'Es un contrato que te da acceso a servicios médicos privados: consultas, pruebas, especialistas, hospitalizaciones, cirugías, etc.',
    tags: ['conceptos-basicos', 'salud-privada', 'cobertura']
  },
  {
    id: 'sa002',
    category: 'SALUD',
    difficulty: 1,
    question: '¿Qué es el "cuadro médico"?',
    options: [
      'Un diploma',
      'Lista de médicos y centros disponibles',
      'Una enfermedad',
      'Un tipo de cirugía'
    ],
    correctIndex: 1,
    explanation: 'Es la red de profesionales, clínicas y hospitales con los que la aseguradora tiene convenio y a los que puedes acudir.',
    tags: ['cuadro-medico', 'red-sanitaria', 'conceptos-basicos']
  },
  {
    id: 'sa003',
    category: 'SALUD',
    difficulty: 1,
    question: '¿Qué es un "copago" en el seguro de salud?',
    options: [
      'Pagar dos veces',
      'Pequeña cantidad que pagas por cada servicio',
      'La prima mensual',
      'Un descuento'
    ],
    correctIndex: 1,
    explanation: 'Es una cantidad fija (ej: 3-10€) que pagas cada vez que usas ciertos servicios (consulta, prueba), además de la prima mensual.',
    tags: ['copago', 'coste', 'conceptos-basicos']
  },
  {
    id: 'sa004',
    category: 'SALUD',
    difficulty: 1,
    question: '¿Qué son las "enfermedades preexistentes"?',
    options: [
      'Enfermedades futuras',
      'Problemas de salud que tenías antes de contratar',
      'Enfermedades contagiosas',
      'Alergias alimentarias'
    ],
    correctIndex: 1,
    explanation: 'Son condiciones médicas o enfermedades que ya tenías diagnosticadas o manifestadas antes de contratar el seguro.',
    tags: ['preexistencias', 'exclusiones', 'contratacion']
  },
  {
    id: 'sa005',
    category: 'SALUD',
    difficulty: 1,
    question: '¿Cubren las preexistencias los seguros de salud?',
    options: [
      'Siempre',
      'Generalmente no, o con carencias',
      'Solo las graves',
      'Solo las leves'
    ],
    correctIndex: 1,
    explanation: 'Normalmente las preexistencias están excluidas o tienen periodos de carencia largos (6 meses a 2 años) antes de estar cubiertas.',
    tags: ['preexistencias', 'carencias', 'exclusiones']
  },
  {
    id: 'sa006',
    category: 'SALUD',
    difficulty: 1,
    question: '¿Qué es una "segunda opinión médica"?',
    options: [
      'Ir al mismo doctor dos veces',
      'Consultar a otro especialista sobre tu diagnóstico',
      'Una cobertura de emergencia',
      'Un tipo de cirugía'
    ],
    correctIndex: 1,
    explanation: 'Servicio que te permite consultar a otro especialista para confirmar un diagnóstico o tratamiento, común en casos graves.',
    tags: ['segunda-opinion', 'servicios', 'especialistas']
  },
  {
    id: 'sa007',
    category: 'SALUD',
    difficulty: 1,
    question: '¿Qué es la "medicina general" o "atención primaria"?',
    options: [
      'Solo para militares',
      'Consulta con médico de familia',
      'Solo urgencias',
      'Cirugías simples'
    ],
    correctIndex: 1,
    explanation: 'Es la atención básica por médico general/familia que diagnostica, trata problemas comunes y deriva a especialistas si necesario.',
    tags: ['atencion-primaria', 'medico-general', 'conceptos-basicos']
  },
  {
    id: 'sa008',
    category: 'SALUD',
    difficulty: 1,
    question: '¿Qué son las "especialidades médicas"?',
    options: [
      'Comida especial',
      'Ramas específicas: cardiología, traumatología, etc.',
      'Medicinas caras',
      'Solo cirugías'
    ],
    correctIndex: 1,
    explanation: 'Son áreas médicas especializadas: cardiología, dermatología, traumatología, ginecología, oftalmología, etc.',
    tags: ['especialidades', 'medicos-especialistas', 'conceptos-basicos']
  },
  {
    id: 'sa009',
    category: 'SALUD',
    difficulty: 1,
    question: '¿Qué cubre la "hospitalización"?',
    options: [
      'Solo visitas',
      'Ingreso, habitación, quirófano, atención médica',
      'Solo comida',
      'Solo urgencias'
    ],
    correctIndex: 1,
    explanation: 'Cubre ingresos hospitalarios: habitación, manutención, quirófano, honorarios médicos, material sanitario, medicamentos durante el ingreso.',
    tags: ['hospitalizacion', 'ingreso', 'cobertura']
  },
  {
    id: 'sa010',
    category: 'SALUD',
    difficulty: 1,
    question: '¿Qué son las "pruebas diagnósticas"?',
    options: [
      'Exámenes escolares',
      'Análisis, radiografías, escáneres, etc.',
      'Solo análisis de sangre',
      'Operaciones'
    ],
    correctIndex: 1,
    explanation: 'Son pruebas médicas para diagnosticar: análisis clínicos, radiografías, TAC, resonancias, ecografías, endoscopias, etc.',
    tags: ['pruebas-diagnosticas', 'analisis', 'cobertura']
  },
  {
    id: 'sa011',
    category: 'SALUD',
    difficulty: 1,
    question: '¿Qué es la "cirugía ambulatoria"?',
    options: [
      'Operación en ambulancia',
      'Cirugía sin ingreso nocturno',
      'Solo operaciones menores',
      'Cirugía de urgencia'
    ],
    correctIndex: 1,
    explanation: 'Intervenciones quirúrgicas que no requieren hospitalización: entras, te operan y sales el mismo día.',
    tags: ['cirugia-ambulatoria', 'sin-ingreso', 'cobertura']
  },
  {
    id: 'sa012',
    category: 'SALUD',
    difficulty: 1,
    question: '¿Cubre el seguro de salud las urgencias?',
    options: [
      'Nunca',
      'Sí, atención urgente 24/7',
      'Solo de día',
      'Solo en hospital'
    ],
    correctIndex: 1,
    explanation: 'Los seguros de salud cubren atención urgente las 24 horas en centros de urgencias o servicios de emergencia del cuadro médico.',
    tags: ['urgencias', 'emergencias', 'cobertura']
  },
  {
    id: 'sa013',
    category: 'SALUD',
    difficulty: 1,
    question: '¿Qué es la "pediatría"?',
    options: [
      'Cuidado de pies',
      'Medicina para niños y adolescentes',
      'Solo bebés',
      'Vacunas'
    ],
    correctIndex: 1,
    explanation: 'Especialidad médica dedicada a la salud y desarrollo de bebés, niños y adolescentes, incluida en la mayoría de seguros.',
    tags: ['pediatria', 'niños', 'especialidad']
  },
  {
    id: 'sa014',
    category: 'SALUD',
    difficulty: 1,
    question: '¿Qué es la "rehabilitación"?',
    options: [
      'Reformar la casa',
      'Fisioterapia y recuperación tras lesión/cirugía',
      'Solo para deportistas',
      'Ejercicio general'
    ],
    correctIndex: 1,
    explanation: 'Tratamientos de fisioterapia y recuperación funcional tras lesiones, cirugías o para problemas musculoesqueléticos.',
    tags: ['rehabilitacion', 'fisioterapia', 'cobertura']
  },
  {
    id: 'sa015',
    category: 'SALUD',
    difficulty: 1,
    question: '¿Cubre el seguro de salud la odontología?',
    options: [
      'Siempre todo',
      'Depende: básica incluida, tratamientos con copago',
      'Nunca',
      'Solo extracciones'
    ],
    correctIndex: 1,
    explanation: 'Revisiones y limpieza suelen estar incluidas. Tratamientos (empastes, endodoncias, ortodoncia) con copagos o coberturas opcionales.',
    tags: ['odontologia', 'dental', 'cobertura']
  },
  {
    id: 'sa016',
    category: 'SALUD',
    difficulty: 1,
    question: '¿Qué es el "embarazo y parto"?',
    options: [
      'No lo cubre ningún seguro',
      'Cobertura de seguimiento del embarazo y parto',
      'Solo para el bebé',
      'Solo adopciones'
    ],
    correctIndex: 1,
    explanation: 'Cobertura específica que incluye: seguimiento gestacional, pruebas, ecografías, parto, cesárea, hospitalización, con carencias (8-10 meses).',
    tags: ['embarazo', 'parto', 'maternidad']
  },
  {
    id: 'sa017',
    category: 'SALUD',
    difficulty: 1,
    question: '¿Qué es un "periodo de carencia"?',
    options: [
      'Vacaciones del seguro',
      'Tiempo de espera para ciertas coberturas',
      'La renovación',
      'Un descuento'
    ],
    correctIndex: 1,
    explanation: 'Tiempo desde la contratación durante el cual ciertas coberturas aún no están activas (ej: 6 meses cirugía, 10 meses parto).',
    tags: ['carencias', 'periodo-espera', 'contratacion']
  },
  {
    id: 'sa018',
    category: 'SALUD',
    difficulty: 1,
    question: '¿Puedes elegir cualquier médico con seguro de salud?',
    options: [
      'Sí, cualquier médico del mundo',
      'Solo médicos del cuadro médico',
      'Solo médicos públicos',
      'Solo un médico asignado'
    ],
    correctIndex: 1,
    explanation: 'Debes acudir a profesionales y centros del cuadro médico de tu aseguradora. Fuera del cuadro no hay cobertura (salvo reembolso si contratado).',
    tags: ['cuadro-medico', 'eleccion-medico', 'limitaciones']
  },
  {
    id: 'sa019',
    category: 'SALUD',
    difficulty: 1,
    question: '¿Qué es la "medicina alternativa"?',
    options: [
      'Solo homeopatía',
      'Terapias complementarias: acupuntura, osteopatía',
      'Está siempre excluida',
      'Solo plantas medicinales'
    ],
    correctIndex: 1,
    explanation: 'Algunas pólizas incluyen sesiones limitadas de medicinas complementarias: acupuntura, osteopatía, quiropraxia, homeopatía.',
    tags: ['medicina-alternativa', 'terapias-complementarias', 'cobertura']
  },
  {
    id: 'sa020',
    category: 'SALUD',
    difficulty: 1,
    question: '¿Cubre el seguro las gafas y lentillas?',
    options: [
      'Siempre totalmente',
      'Con reembolsos limitados o descuentos',
      'Nunca',
      'Solo cirugía láser'
    ],
    correctIndex: 1,
    explanation: 'Muchas pólizas incluyen reembolso anual limitado (50-150€) para gafas/lentillas o descuentos en ópticas concertadas.',
    tags: ['optica', 'gafas', 'reembolsos']
  },
  {
    id: 'sa021',
    category: 'SALUD',
    difficulty: 1,
    question: '¿Qué es la "asistencia en viaje"?',
    options: [
      'Seguro de equipaje',
      'Cobertura médica durante viajes',
      'Solo en España',
      'Guía turística'
    ],
    correctIndex: 1,
    explanation: 'Extensión que cubre gastos médicos urgentes, repatriación y asistencia sanitaria durante viajes nacionales o internacionales.',
    tags: ['asistencia-viaje', 'viajes', 'cobertura-adicional']
  },
  {
    id: 'sa022',
    category: 'SALUD',
    difficulty: 1,
    question: '¿Qué es un "reconocimiento médico"?',
    options: [
      'Un premio',
      'Chequeo completo de salud',
      'Solo para mayores',
      'Una operación'
    ],
    correctIndex: 1,
    explanation: 'Revisión preventiva completa que incluye: análisis, pruebas, evaluación física, a menudo incluido gratis anualmente.',
    tags: ['reconocimiento', 'chequeo', 'prevencion']
  },
  {
    id: 'sa023',
    category: 'SALUD',
    difficulty: 1,
    question: '¿Puedes cambiar de aseguradora de salud?',
    options: [
      'No, nunca',
      'Sí, respetando preaviso',
      'Solo una vez en la vida',
      'Solo si te mudas'
    ],
    correctIndex: 1,
    explanation: 'Puedes cambiar de aseguradora cuando quieras, respetando el preaviso (1-2 meses) y considerando nuevas carencias en la nueva póliza.',
    tags: ['cambio-aseguradora', 'movilidad', 'derechos']
  },
  {
    id: 'sa024',
    category: 'SALUD',
    difficulty: 1,
    question: '¿Qué es la "psicología" en el seguro?',
    options: [
      'No está cubierta',
      'Sesiones de terapia psicológica',
      'Solo psiquiatría',
      'Solo para niños'
    ],
    correctIndex: 1,
    explanation: 'Muchas pólizas incluyen sesiones limitadas (ej: 10-20 al año) de psicología clínica para problemas emocionales, ansiedad, depresión.',
    tags: ['psicologia', 'salud-mental', 'cobertura']
  },
  {
    id: 'sa025',
    category: 'SALUD',
    difficulty: 1,
    question: '¿Aumenta la prima del seguro con la edad?',
    options: [
      'No, siempre igual',
      'Sí, generalmente por franjas de edad',
      'Solo a partir de 100 años',
      'Solo si enfermas'
    ],
    correctIndex: 1,
    explanation: 'La prima suele aumentar al cambiar de franja de edad (cada 5-10 años), ya que el riesgo de enfermedades aumenta con la edad.',
    tags: ['prima', 'edad', 'coste']
  },

  // MEDIAS (15 preguntas)
  {
    id: 'sa026',
    category: 'SALUD',
    difficulty: 2,
    question: '¿Qué es un seguro "con reembolso"?',
    options: [
      'Te devuelven la prima',
      'Vas a cualquier médico y te reembolsan gastos',
      'Solo para extranjero',
      'Un tipo de copago'
    ],
    correctIndex: 1,
    explanation: 'Modalidad que te permite ir a cualquier médico (no solo cuadro médico) y te reembolsan un % de los gastos según baremo.',
    tags: ['reembolso', 'libre-eleccion', 'modalidad']
  },
  {
    id: 'sa027',
    category: 'SALUD',
    difficulty: 2,
    question: '¿Qué es el "límite anual" o "sublímite"?',
    options: [
      'No existe',
      'Máximo que paga el seguro por cierta cobertura/año',
      'Tu límite de visitas',
      'La prima máxima'
    ],
    correctIndex: 1,
    explanation: 'Cantidad máxima que la aseguradora paga por determinadas coberturas al año (ej: rehabilitación: máx 1.000€/año).',
    tags: ['sublimites', 'limitaciones', 'indemnizacion']
  },
  {
    id: 'sa028',
    category: 'SALUD',
    difficulty: 2,
    question: '¿Qué son las "prótesis e implantes"?',
    options: [
      'Solo dentales',
      'Dispositivos que sustituyen partes del cuerpo',
      'Solo estéticas',
      'No los cubre'
    ],
    correctIndex: 1,
    explanation: 'Dispositivos médicos: prótesis de cadera, rodilla, marcapasos, implantes, etc. Cobertura varía: a veces 100%, otras con límites.',
    tags: ['protesis', 'implantes', 'cobertura']
  },
  {
    id: 'sa029',
    category: 'SALUD',
    difficulty: 2,
    question: '¿Qué es la "cirugía estética"?',
    options: [
      'Siempre cubierta',
      'Generalmente excluida salvo causa médica',
      'Totalmente cubierta',
      'Solo para famosos'
    ],
    correctIndex: 1,
    explanation: 'Las cirugías puramente estéticas están excluidas. Se cubren las reconstructivas por accidente, enfermedad o malformación.',
    tags: ['cirugia-estetica', 'exclusiones', 'cirugia-reconstructiva']
  },
  {
    id: 'sa030',
    category: 'SALUD',
    difficulty: 2,
    question: '¿Qué es la "medicina preventiva"?',
    options: [
      'Vacunas y prevención',
      'Chequeos, vacunas, screenings',
      'Solo para niños',
      'No existe'
    ],
    correctIndex: 1,
    explanation: 'Servicios preventivos: chequeos anuales, vacunas, mamografías, colonoscopias, controles de salud periódicos.',
    tags: ['medicina-preventiva', 'chequeos', 'prevencion']
  },
  {
    id: 'sa031',
    category: 'SALUD',
    difficulty: 2,
    question: '¿Qué es la "declaración de salud"?',
    options: [
      'No es necesaria',
      'Cuestionario sobre tu estado de salud al contratar',
      'Un certificado médico',
      'Una firma'
    ],
    correctIndex: 1,
    explanation: 'Formulario donde declaras enfermedades previas al contratar. Ocultar información puede anular cobertura (reticencia).',
    tags: ['declaracion-salud', 'preexistencias', 'contratacion']
  },
  {
    id: 'sa032',
    category: 'SALUD',
    difficulty: 2,
    question: '¿Qué es la "telemedicina"?',
    options: [
      'Ver la tele',
      'Consultas médicas por videollamada',
      'Solo para emergencias',
      'No existe'
    ],
    correctIndex: 1,
    explanation: 'Servicio cada vez más común: consultas médicas por videollamada, chat o teléfono 24/7, para problemas no urgentes.',
    tags: ['telemedicina', 'consultas-online', 'servicios-digitales']
  },
  {
    id: 'sa033',
    category: 'SALUD',
    difficulty: 2,
    question: '¿Qué es la "reproducción asistida"?',
    options: [
      'Partos múltiples',
      'Tratamientos de fertilidad: FIV, inseminación',
      'Solo adopción',
      'Siempre cubierta'
    ],
    correctIndex: 1,
    explanation: 'Tratamientos de fertilidad (FIV, inseminación artificial). Suelen estar excluidos o requerir cobertura específica adicional.',
    tags: ['reproduccion-asistida', 'fertilidad', 'cobertura-especifica']
  },
  {
    id: 'sa034',
    category: 'SALUD',
    difficulty: 2,
    question: '¿Qué es la "interrupción voluntaria del embarazo"?',
    options: [
      'Nunca cubierta',
      'Cubierta según indicaciones legales',
      'Solo privadamente',
      'No aplicable'
    ],
    correctIndex: 1,
    explanation: 'IVE está cubierta en seguros cuando es legal: por riesgo materno, malformaciones fetales graves o dentro de plazos legales.',
    tags: ['ive', 'interrupcion-embarazo', 'cobertura-legal']
  },
  {
    id: 'sa035',
    category: 'SALUD',
    difficulty: 2,
    question: '¿Qué son las "listas de espera"?',
    options: [
      'Solo en seguridad social',
      'Tiempos de espera para consultas/cirugías',
      'Colas en el hospital',
      'No existen en privado'
    ],
    correctIndex: 1,
    explanation: 'Aunque en privado son menores que en público, puede haber esperas para ciertas especialidades o cirugías no urgentes.',
    tags: ['listas-espera', 'acceso', 'tiempos']
  },
  {
    id: 'sa036',
    category: 'SALUD',
    difficulty: 2,
    question: '¿Qué es el "alta voluntaria"?',
    options: [
      'Ser voluntario',
      'Dejar el hospital antes de que el médico lo indique',
      'Dar de alta la póliza',
      'No existe'
    ],
    correctIndex: 1,
    explanation: 'Salir del hospital por decisión propia antes del alta médica. Puede afectar la cobertura y conllevar riesgos médicos.',
    tags: ['alta-voluntaria', 'hospitalizacion', 'procedimientos']
  },
  {
    id: 'sa037',
    category: 'SALUD',
    difficulty: 2,
    question: '¿Qué es la cobertura de "trasplantes"?',
    options: [
      'Nunca cubiertos',
      'Cubiertos en pólizas completas',
      'Solo de riñón',
      'Solo para niños'
    ],
    correctIndex: 1,
    explanation: 'Seguros completos cubren trasplantes de órganos (riñón, hígado, corazón, etc.) con límites elevados o sin límite.',
    tags: ['trasplantes', 'cobertura-completa', 'cirugia-mayor']
  },
  {
    id: 'sa038',
    category: 'SALUD',
    difficulty: 2,
    question: '¿Qué es la "oncología"?',
    options: [
      'Estudio de ondas',
      'Tratamiento de cáncer',
      'Solo quimioterapia',
      'No cubierta'
    ],
    correctIndex: 1,
    explanation: 'Especialidad que trata el cáncer: diagnóstico, quimioterapia, radioterapia, cirugías oncológicas, seguimiento.',
    tags: ['oncologia', 'cancer', 'especialidad']
  },
  {
    id: 'sa039',
    category: 'SALUD',
    difficulty: 2,
    question: '¿Qué es el "parte de asistencia"?',
    options: [
      'Parte médico',
      'Documento que acredita la visita médica',
      'Un descuento',
      'La factura'
    ],
    correctIndex: 1,
    explanation: 'Documento que emite el médico/centro tras atenderte, detallando el servicio prestado para justificación con la aseguradora.',
    tags: ['parte-asistencia', 'documentacion', 'justificante']
  },
  {
    id: 'sa040',
    category: 'SALUD',
    difficulty: 2,
    question: '¿Qué es la "salud mental"?',
    options: [
      'Solo psicología',
      'Psicología y psiquiatría',
      'No cubierta',
      'Solo para casos graves'
    ],
    correctIndex: 1,
    explanation: 'Área que incluye psicología (terapia) y psiquiatría (medicación). Cobertura varía: a veces limitada a sesiones o con copagos.',
    tags: ['salud-mental', 'psicologia', 'psiquiatria']
  },

  // DIFÍCILES (10 preguntas)
  {
    id: 'sa041',
    category: 'SALUD',
    difficulty: 3,
    question: '¿Qué es el "periodo de observación"?',
    options: [
      'No existe',
      'Tiempo para evaluar si una enfermedad es preexistente',
      'La hospitalización',
      'Un tipo de carencia'
    ],
    correctIndex: 1,
    explanation: 'Periodo inicial (ej: 6 meses) donde la aseguradora evalúa si enfermedades que aparecen eran realmente preexistentes.',
    tags: ['periodo-observacion', 'preexistencias', 'evaluacion']
  },
  {
    id: 'sa042',
    category: 'SALUD',
    difficulty: 3,
    question: '¿Qué es la "cobertura de grandes enfermedades"?',
    options: [
      'Solo cáncer',
      'Enfermedades graves: cáncer, infartos, ictus',
      'No existe',
      'Solo infecciosas'
    ],
    correctIndex: 1,
    explanation: 'Cobertura específica que paga capital por diagnóstico de enfermedades graves (cáncer, infarto, ictus, trasplantes, etc.).',
    tags: ['grandes-enfermedades', 'enfermedades-graves', 'capital']
  },
  {
    id: 'sa043',
    category: 'SALUD',
    difficulty: 3,
    question: '¿Qué es el "copago farmacéutico"?',
    options: [
      'No existe en privado',
      'Pago parcial de medicamentos',
      'Solo en hospitales',
      'Un descuento'
    ],
    correctIndex: 1,
    explanation: 'Algunos seguros cubren parte del coste de medicamentos en farmacias mediante reembolsos o descuentos, con % y límites.',
    tags: ['copago-farmaceutico', 'medicamentos', 'farmacias']
  },
  {
    id: 'sa044',
    category: 'SALUD',
    difficulty: 3,
    question: '¿Qué es la "cobertura dental completa"?',
    options: [
      'Limpieza gratis',
      'Incluye tratamientos, endodoncias, coronas, implantes',
      'Solo extracciones',
      'No existe'
    ],
    correctIndex: 1,
    explanation: 'Cobertura avanzada que incluye tratamientos complejos (endodoncias, coronas, implantes, ortodoncia) con copagos reducidos.',
    tags: ['dental-completa', 'odontologia', 'cobertura-avanzada']
  },
  {
    id: 'sa045',
    category: 'SALUD',
    difficulty: 3,
    question: '¿Qué son las "enfermedades raras"?',
    options: [
      'Poco comunes',
      'Enfermedades con baja prevalencia poblacional',
      'Muy caras de tratar',
      'No cubiertas'
    ],
    correctIndex: 1,
    explanation: 'Enfermedades de baja frecuencia (menos de 5 por 10.000). Suelen estar cubiertas pero con limitaciones en tratamientos experimentales.',
    tags: ['enfermedades-raras', 'baja-prevalencia', 'cobertura']
  },
  {
    id: 'sa046',
    category: 'SALUD',
    difficulty: 3,
    question: '¿Qué es el "cuadro médico abierto"?',
    options: [
      'Sin restricciones de horario',
      'Modalidad que permite médicos fuera del cuadro con reembolso',
      'Solo médicos jóvenes',
      'No existe'
    ],
    correctIndex: 1,
    explanation: 'Modalidad flexible donde puedes acudir a médicos fuera del cuadro oficial y te reembolsan un % según baremo.',
    tags: ['cuadro-abierto', 'reembolso', 'flexibilidad']
  },
  {
    id: 'sa047',
    category: 'SALUD',
    difficulty: 3,
    question: '¿Qué es la "asistencia internacional"?',
    options: [
      'Solo Europa',
      'Cobertura médica en cualquier país',
      'Solo viajes de trabajo',
      'No existe'
    ],
    correctIndex: 1,
    explanation: 'Extensión que cubre gastos médicos urgentes en el extranjero, repatriación sanitaria y asistencia 24/7 en cualquier país.',
    tags: ['asistencia-internacional', 'extranjero', 'cobertura-mundial']
  },
  {
    id: 'sa048',
    category: 'SALUD',
    difficulty: 3,
    question: '¿Qué es el "seguro dental independiente"?',
    options: [
      'No existe',
      'Póliza específica solo para tratamientos dentales',
      'Solo para ortodoncias',
      'Parte del seguro de salud'
    ],
    correctIndex: 1,
    explanation: 'Producto específico de cobertura dental completa, independiente del seguro de salud, con amplias coberturas y copagos reducidos.',
    tags: ['seguro-dental', 'independiente', 'especializado']
  },
  {
    id: 'sa049',
    category: 'SALUD',
    difficulty: 3,
    question: '¿Qué es la "medicina genómica"?',
    options: [
      'Solo ADN',
      'Tratamientos personalizados según genética',
      'No cubierta',
      'Solo investigación'
    ],
    correctIndex: 1,
    explanation: 'Medicina personalizada basada en tu perfil genético. Algunos seguros premium empiezan a cubrir tests genéticos y tratamientos dirigidos.',
    tags: ['medicina-genomica', 'genetica', 'innovacion']
  },
  {
    id: 'sa050',
    category: 'SALUD',
    difficulty: 3,
    question: '¿Qué es la "continuidad asistencial"?',
    options: [
      'Ir siempre al mismo médico',
      'Derecho a seguimiento sin cambios de aseguradora',
      'Solo para crónicos',
      'No existe'
    ],
    correctIndex: 1,
    explanation: 'Derecho a continuar tratamientos en curso sin interrupciones al cambiar de aseguradora, especialmente en enfermedades crónicas.',
    tags: ['continuidad-asistencial', 'cambio-aseguradora', 'derechos']
  }
];

// ============================================
// CATEGORÍA 5: PREVENCIÓN Y SEGURIDAD (50 preguntas)
// ============================================

const prevencionSeguridad: QuizQuestion[] = [
  // FÁCILES (25 preguntas)
  {
    id: 'pr001',
    category: 'PREVENCION',
    difficulty: 1,
    question: '¿Cuál es la mejor forma de prevenir incendios en casa?',
    options: [
      'No cocinar nunca',
      'Mantenimiento de instalaciones y cuidado con fuego',
      'Tener muchos seguros',
      'Vivir en la calle'
    ],
    correctIndex: 1,
    explanation: 'Revisión eléctrica periódica, cuidado con velas, no sobrecargar enchufes, mantenimiento de calefacción, detector de humos.',
    tags: ['prevencion', 'incendios', 'hogar']
  },
  {
    id: 'pr002',
    category: 'PREVENCION',
    difficulty: 1,
    question: '¿Qué debes hacer al salir de casa para prevenir robos?',
    options: [
      'Dejar la puerta abierta',
      'Cerrar bien puertas/ventanas y activar alarma',
      'Publicar que te vas',
      'No hacer nada'
    ],
    correctIndex: 1,
    explanation: 'Cerrar y trabar todas las puertas y ventanas, activar alarma si tienes, no dejar señales de ausencia prolongada.',
    tags: ['prevencion', 'robo', 'seguridad']
  },
  {
    id: 'pr003',
    category: 'PREVENCION',
    difficulty: 1,
    question: '¿Cada cuánto debes revisar tu vehículo?',
    options: [
      'Nunca',
      'Según indicaciones del fabricante y antes de viajes',
      'Solo cuando se rompe',
      'Cada 10 años'
    ],
    correctIndex: 1,
    explanation: 'Revisiones según manual (cada 10-20k km o anual), plus controles antes de viajes largos: neumáticos, frenos, luces, líquidos.',
    tags: ['prevencion', 'mantenimiento', 'vehiculo']
  },
  {
    id: 'pr004',
    category: 'PREVENCION',
    difficulty: 1,
    question: '¿Por qué es importante llevar el cinturón de seguridad?',
    options: [
      'Solo para evitar multas',
      'Reduce drásticamente lesiones en accidentes',
      'Es solo decorativo',
      'No es importante'
    ],
    correctIndex: 1,
    explanation: 'El cinturón reduce hasta un 50% la mortalidad en accidentes. Es el elemento de seguridad más efectivo del vehículo.',
    tags: ['prevencion', 'seguridad-vial', 'proteccion']
  },
  {
    id: 'pr005',
    category: 'PREVENCION',
    difficulty: 1,
    question: '¿Qué hábitos ayudan a prevenir problemas de salud?',
    options: [
      'Comer solo comida rápida',
      'Dieta equilibrada, ejercicio, descanso, chequeos',
      'Fumar y no dormir',
      'No hacer nada'
    ],
    correctIndex: 1,
    explanation: 'Alimentación sana, ejercicio regular, dormir bien, no fumar, alcohol moderado, hidratación, chequeos médicos periódicos.',
    tags: ['prevencion', 'salud', 'habitos']
  },
  {
    id: 'pr006',
    category: 'PREVENCION',
    difficulty: 1,
    question: '¿Qué debes tener en casa para emergencias?',
    options: [
      'Nada',
      'Botiquín, extintores, números de emergencia',
      'Solo comida',
      'Un televisor grande'
    ],
    correctIndex: 1,
    explanation: 'Botiquín de primeros auxilios, extintor, detector de humo, linterna, números de emergencia visibles, agua embotellada.',
    tags: ['prevencion', 'emergencias', 'preparacion']
  },
  {
    id: 'pr007',
    category: 'PREVENCION',
    difficulty: 1,
    question: '¿Cómo prevenir fugas de agua en casa?',
    options: [
      'No usar agua',
      'Revisar tuberías, gomas, grifos periódicamente',
      'Ignorar goteos',
      'No preocuparse'
    ],
    correctIndex: 1,
    explanation: 'Revisar estado de tuberías, cambiar gomas de grifos cuando gotean, inspeccionar bajo fregaderos, controlar recibos de agua.',
    tags: ['prevencion', 'fugas', 'mantenimiento']
  },
  {
    id: 'pr008',
    category: 'PREVENCION',
    difficulty: 1,
    question: '¿Por qué no debes conducir cansado?',
    options: [
      'Es legal',
      'Disminuye reflejos y aumenta riesgo de accidentes',
      'No pasa nada',
      'Solo afecta de noche'
    ],
    correctIndex: 1,
    explanation: 'La fatiga reduce tiempos de reacción, atención y capacidad de decisión, multiplicando el riesgo de accidentes.',
    tags: ['prevencion', 'fatiga', 'seguridad-vial']
  },
  {
    id: 'pr009',
    category: 'PREVENCION',
    difficulty: 1,
    question: '¿Qué es un detector de humos?',
    options: [
      'Un fumador',
      'Dispositivo que alerta de incendios',
      'Un tipo de alarma de robo',
      'Un juguete'
    ],
    correctIndex: 1,
    explanation: 'Dispositivo que detecta humo y emite alarma sonora, crucial para alertar de incendios a tiempo y salvar vidas.',
    tags: ['prevencion', 'detector-humos', 'incendios']
  },
  {
    id: 'pr010',
    category: 'PREVENCION',
    difficulty: 1,
    question: '¿Cómo prevenir caídas en el hogar?',
    options: [
      'Andar descalzo en mojado',
      'Alfombras fijadas, buena iluminación, no cables sueltos',
      'Dejar todo por el suelo',
      'No importa'
    ],
    correctIndex: 1,
    explanation: 'Fijar alfombras, buena iluminación, recoger cables, pasamanos en escaleras, suelos no resbaladizos, especialmente para mayores.',
    tags: ['prevencion', 'caidas', 'seguridad-hogar']
  },
  {
    id: 'pr011',
    category: 'PREVENCION',
    difficulty: 1,
    question: '¿Por qué es importante vacunarse?',
    options: [
      'No lo es',
      'Previene enfermedades graves y protege a otros',
      'Solo para niños',
      'Es obligatorio siempre'
    ],
    correctIndex: 1,
    explanation: 'Las vacunas previenen enfermedades graves, reducen complicaciones y crean inmunidad colectiva que protege a los más vulnerables.',
    tags: ['prevencion', 'vacunas', 'salud-publica']
  },
  {
    id: 'pr012',
    category: 'PREVENCION',
    difficulty: 1,
    question: '¿Qué distancia de seguridad debes mantener al conducir?',
    options: [
      'Pegado al de delante',
      'Al menos 2 segundos o más en mal tiempo',
      'No importa',
      'Solo de noche'
    ],
    correctIndex: 1,
    explanation: 'Regla de 2-3 segundos en buenas condiciones, 4-5 en lluvia. Te da tiempo de reaccionar si el de delante frena bruscamente.',
    tags: ['prevencion', 'distancia-seguridad', 'conduccion']
  },
  {
    id: 'pr013',
    category: 'PREVENCION',
    difficulty: 1,
    question: '¿Cómo prevenir intoxicaciones de gas en casa?',
    options: [
      'No usar gas',
      'Revisiones periódicas, ventilación, detector de CO',
      'Abrir el gas siempre',
      'No preocuparse'
    ],
    correctIndex: 1,
    explanation: 'Revisión anual de instalaciones de gas, ventilación adecuada, detectores de CO, no usar estufas de gas sin ventilación.',
    tags: ['prevencion', 'gas', 'intoxicacion']
  },
  {
    id: 'pr014',
    category: 'PREVENCION',
    difficulty: 1,
    question: '¿Por qué no debes usar el móvil conduciendo?',
    options: [
      'Solo es multa',
      'Distrae y multiplica el riesgo de accidente',
      'No pasa nada',
      'Solo afecta si escribes'
    ],
    correctIndex: 1,
    explanation: 'Usar el móvil al volante multiplica por 4 el riesgo de accidente. Incluso manos libres reduce concentración significativamente.',
    tags: ['prevencion', 'distracciones', 'seguridad-vial']
  },
  {
    id: 'pr015',
    category: 'PREVENCION',
    difficulty: 1,
    question: '¿Qué es un extintor y para qué sirve?',
    options: [
      'Un adorno',
      'Dispositivo para apagar incendios pequeños',
      'Solo para bomberos',
      'No funciona'
    ],
    correctIndex: 1,
    explanation: 'Equipo para extinguir fuegos incipientes. Obligatorio en vehículos y comunidades. Debe revisarse y estar accesible.',
    tags: ['prevencion', 'extintor', 'incendios']
  },
  {
    id: 'pr016',
    category: 'PREVENCION',
    difficulty: 1,
    question: '¿Cómo prevenir electrocuciones en casa?',
    options: [
      'No usar electricidad',
      'No sobrecargar enchufes, revisar cables, protectores',
      'Tocar cables pelados',
      'Meter dedos en enchufes'
    ],
    correctIndex: 1,
    explanation: 'No sobrecargar enchufes, revisar cables dañados, diferenciales actualizados, protectores en enchufes con niños, no tocar con manos mojadas.',
    tags: ['prevencion', 'electrocucion', 'electricidad']
  },
  {
    id: 'pr017',
    category: 'PREVENCION',
    difficulty: 1,
    question: '¿Por qué debes respetar los límites de velocidad?',
    options: [
      'Solo para evitar multas',
      'Velocidad adecuada reduce gravedad de accidentes',
      'No importa si conduces bien',
      'Solo en ciudad'
    ],
    correctIndex: 1,
    explanation: 'A mayor velocidad, menor tiempo de reacción y mayor gravedad del impacto. Respetar límites salva vidas.',
    tags: ['prevencion', 'velocidad', 'seguridad-vial']
  },
  {
    id: 'pr018',
    category: 'PREVENCION',
    difficulty: 1,
    question: '¿Qué es la protección solar y por qué es importante?',
    options: [
      'Solo para la playa',
      'Previene cáncer de piel y envejecimiento',
      'No es necesaria',
      'Solo en verano'
    ],
    correctIndex: 1,
    explanation: 'La protección solar previene cáncer de piel, quemaduras y envejecimiento prematuro. Necesaria todo el año.',
    tags: ['prevencion', 'proteccion-solar', 'salud']
  },
  {
    id: 'pr019',
    category: 'PREVENCION',
    difficulty: 1,
    question: '¿Cómo prevenir robos en el vehículo?',
    options: [
      'Dejar todo visible',
      'No dejar objetos a la vista, aparcar bien iluminado',
      'Dejar las llaves puestas',
      'No importa'
    ],
    correctIndex: 1,
    explanation: 'No dejar objetos de valor visibles, cerrar bien, alarma activa, parking seguro e iluminado, no dejar documentación.',
    tags: ['prevencion', 'robo-vehiculo', 'seguridad']
  },
  {
    id: 'pr020',
    category: 'PREVENCION',
    difficulty: 1,
    question: '¿Por qué son importantes los chequeos médicos?',
    options: [
      'Solo si estás enfermo',
      'Detectan problemas antes de que sean graves',
      'Son innecesarios',
      'Solo para mayores'
    ],
    correctIndex: 1,
    explanation: 'Los chequeos preventivos detectan enfermedades en fases tempranas cuando son más tratables, mejorando pronóstico.',
    tags: ['prevencion', 'chequeos', 'deteccion-precoz']
  },
  {
    id: 'pr021',
    category: 'PREVENCION',
    difficulty: 1,
    question: '¿Qué debes hacer con la comida para prevenir intoxicaciones?',
    options: [
      'Dejarla fuera de la nevera',
      'Refrigeración adecuada, cocción completa, higiene',
      'No importa',
      'Congelar todo'
    ],
    correctIndex: 1,
    explanation: 'Refrigerar alimentos perecederos, cocción completa de carnes, lavar frutas/verduras, no romper cadena de frío, higiene al manipular.',
    tags: ['prevencion', 'intoxicaciones', 'alimentos']
  },
  {
    id: 'pr022',
    category: 'PREVENCION',
    difficulty: 1,
    question: '¿Por qué no debes beber alcohol si vas a conducir?',
    options: [
      'Solo es ilegal',
      'Altera percepción, reflejos y juicio',
      'No pasa nada con poco',
      'Solo de noche importa'
    ],
    correctIndex: 1,
    explanation: 'El alcohol altera la percepción, ralentiza reflejos, reduce campo visual y afecta toma de decisiones, multiplicando accidentes.',
    tags: ['prevencion', 'alcohol', 'seguridad-vial']
  },
  {
    id: 'pr023',
    category: 'PREVENCION',
    difficulty: 1,
    question: '¿Qué es una alarma de seguridad en el hogar?',
    options: [
      'Un reloj despertador',
      'Sistema que detecta intrusiones y alerta',
      'Solo un pitido',
      'No sirve de nada'
    ],
    correctIndex: 1,
    explanation: 'Sistema con sensores que detecta intrusiones, movimientos o aperturas, alertando a propietarios y/o central de alarmas.',
    tags: ['prevencion', 'alarma', 'seguridad-hogar']
  },
  {
    id: 'pr024',
    category: 'PREVENCION',
    difficulty: 1,
    question: '¿Cómo prevenir problemas dentales?',
    options: [
      'No ir nunca al dentista',
      'Higiene diaria, revisiones periódicas, dieta sana',
      'Solo cepillarse una vez al mes',
      'No usar hilo dental'
    ],
    correctIndex: 1,
    explanation: 'Cepillado 2-3 veces/día, hilo dental, enjuague, revisiones semestrales, limitar azúcar, no fumar.',
    tags: ['prevencion', 'salud-dental', 'higiene']
  },
  {
    id: 'pr025',
    category: 'PREVENCION',
    difficulty: 1,
    question: '¿Por qué es importante hacer ejercicio regular?',
    options: [
      'Solo para adelgazar',
      'Mejora salud cardiovascular, mental, previene enfermedades',
      'No es importante',
      'Solo para atletas'
    ],
    correctIndex: 1,
    explanation: 'El ejercicio reduce riesgo cardiovascular, diabetes, obesidad, mejora salud mental, fortalece huesos y músculos, aumenta longevidad.',
    tags: ['prevencion', 'ejercicio', 'salud']
  },

  // MEDIAS (15 preguntas)
  {
    id: 'pr026',
    category: 'PREVENCION',
    difficulty: 2,
    question: '¿Qué es la prevención de riesgos laborales?',
    options: [
      'Solo para construcción',
      'Medidas para evitar accidentes/enfermedades en el trabajo',
      'No es obligatoria',
      'Solo para grandes empresas'
    ],
    correctIndex: 1,
    explanation: 'Conjunto de medidas para proteger la salud y seguridad de trabajadores: equipos protección, formación, evaluación de riesgos.',
    tags: ['prevencion', 'laboral', 'riesgos']
  },
  {
    id: 'pr027',
    category: 'PREVENCION',
    difficulty: 2,
    question: '¿Qué es un plan de evacuación?',
    options: [
      'Unas vacaciones',
      'Procedimiento para salir del edificio en emergencia',
      'Solo para hospitales',
      'No es necesario'
    ],
    correctIndex: 1,
    explanation: 'Procedimiento establecido con rutas, puntos de reunión y roles para evacuación ordenada en caso de emergencia (incendio, terremoto).',
    tags: ['prevencion', 'evacuacion', 'emergencias']
  },
  {
    id: 'pr028',
    category: 'PREVENCION',
    difficulty: 2,
    question: '¿Qué es el control de la presión arterial?',
    options: [
      'No es importante',
      'Monitorización para prevenir hipertensión y problemas cardiovasculares',
      'Solo para mayores',
      'Una vez en la vida'
    ],
    correctIndex: 1,
    explanation: 'Revisión periódica de la tensión arterial para detectar hipertensión temprano y prevenir infartos, ictus y problemas renales.',
    tags: ['prevencion', 'presion-arterial', 'cardiovascular']
  },
  {
    id: 'pr029',
    category: 'PREVENCION',
    difficulty: 2,
    question: '¿Qué es la ciberseguridad personal?',
    options: [
      'Solo para empresas',
      'Proteger tus datos y dispositivos de amenazas online',
      'No es necesaria',
      'Solo para hackers'
    ],
    correctIndex: 1,
    explanation: 'Contraseñas fuertes, autenticación doble, antivirus actualizado, evitar phishing, copias de seguridad, cuidado con wifi públicos.',
    tags: ['prevencion', 'ciberseguridad', 'digital']
  },
  {
    id: 'pr030',
    category: 'PREVENCION',
    difficulty: 2,
    question: '¿Qué es la conducción defensiva?',
    options: [
      'Conducir agresivamente',
      'Anticipar peligros y actuar preventivamente',
      'Conducir muy lento',
      'Ignorar a otros'
    ],
    correctIndex: 1,
    explanation: 'Técnica que busca anticipar situaciones de riesgo, mantener distancias, control de velocidad, prever errores de otros conductores.',
    tags: ['prevencion', 'conduccion-defensiva', 'seguridad-vial']
  },
  {
    id: 'pr031',
    category: 'PREVENCION',
    difficulty: 2,
    question: '¿Qué es el colesterol y por qué controlarlo?',
    options: [
      'No es importante',
      'Grasa en sangre que en exceso aumenta riesgo cardiovascular',
      'Solo para mayores',
      'Una vitamina'
    ],
    correctIndex: 1,
    explanation: 'El colesterol alto obstruye arterias aumentando riesgo de infarto e ictus. Control mediante dieta, ejercicio y análisis periódicos.',
    tags: ['prevencion', 'colesterol', 'cardiovascular']
  },
  {
    id: 'pr032',
    category: 'PREVENCION',
    difficulty: 2,
    question: '¿Qué son los sistemas ADAS en vehículos?',
    options: [
      'Una marca',
      'Sistemas avanzados de asistencia a la conducción',
      'Solo para lujo',
      'No sirven'
    ],
    correctIndex: 1,
    explanation: 'Tecnologías de seguridad: frenado automático, asistente de carril, punto ciego, etc. que previenen accidentes.',
    tags: ['prevencion', 'adas', 'tecnologia-vehiculo']
  },
  {
    id: 'pr033',
    category: 'PREVENCION',
    difficulty: 2,
    question: '¿Qué es el screening de cáncer?',
    options: [
      'Una película',
      'Pruebas periódicas para detectar cáncer temprano',
      'Solo si hay síntomas',
      'No es necesario'
    ],
    correctIndex: 1,
    explanation: 'Programas de detección precoz (mamografías, colonoscopias, PSA) en población sana para encontrar cáncer en fases iniciales curables.',
    tags: ['prevencion', 'screening', 'cancer']
  },
  {
    id: 'pr034',
    category: 'PREVENCION',
    difficulty: 2,
    question: '¿Qué es la ergonomía en el puesto de trabajo?',
    options: [
      'Decoración',
      'Adaptar el trabajo para prevenir lesiones y fatiga',
      'Solo para oficinas',
      'No importa'
    ],
    correctIndex: 1,
    explanation: 'Diseño del espacio de trabajo adaptado a la persona: silla adecuada, altura de pantalla, pausas, iluminación, para prevenir lesiones.',
    tags: ['prevencion', 'ergonomia', 'laboral']
  },
  {
    id: 'pr035',
    category: 'PREVENCION',
    difficulty: 2,
    question: '¿Qué es la prevención de legionela?',
    options: [
      'No existe',
      'Control de agua para evitar bacteria peligrosa',
      'Solo en hospitales',
      'No es importante'
    ],
    correctIndex: 1,
    explanation: 'Mantenimiento de sistemas de agua (torres de refrigeración, duchas, jacuzzis) para evitar proliferación de Legionella que causa neumonía.',
    tags: ['prevencion', 'legionela', 'salud-publica']
  },
  {
    id: 'pr036',
    category: 'PREVENCION',
    difficulty: 2,
    question: '¿Qué son los EPIs?',
    options: [
      'Un juego',
      'Equipos de Protección Individual para el trabajo',
      'Solo para construcción',
      'No son obligatorios'
    ],
    correctIndex: 1,
    explanation: 'Equipos que protegen al trabajador de riesgos: cascos, guantes, gafas, arneses, mascarillas. Obligatorios según tipo de trabajo.',
    tags: ['prevencion', 'epis', 'proteccion-laboral']
  },
  {
    id: 'pr037',
    category: 'PREVENCION',
    difficulty: 2,
    question: '¿Qué es la prevención de la diabetes tipo 2?',
    options: [
      'No se puede prevenir',
      'Dieta sana, ejercicio, control de peso',
      'Solo medicación',
      'Es genética exclusivamente'
    ],
    correctIndex: 1,
    explanation: 'La diabetes tipo 2 se puede prevenir o retrasar con dieta equilibrada, ejercicio regular, peso saludable y control periódico de glucosa.',
    tags: ['prevencion', 'diabetes', 'estilo-vida']
  },
  {
    id: 'pr038',
    category: 'PREVENCION',
    difficulty: 2,
    question: '¿Qué es un sistema de retención infantil (SRI)?',
    options: [
      'Una guardería',
      'Sillas y dispositivos de seguridad para niños en coche',
      'Solo para bebés',
      'No es obligatorio'
    ],
    correctIndex: 1,
    explanation: 'Sistemas homologados (sillas, elevadores) adaptados a peso/altura del niño. Obligatorios hasta 135cm. Reducen mortalidad 75%.',
    tags: ['prevencion', 'sri', 'seguridad-infantil']
  },
  {
    id: 'pr039',
    category: 'PREVENCION',
    difficulty: 2,
    question: '¿Qué es la prevención de caídas en ancianos?',
    options: [
      'No salir de casa',
      'Adaptaciones del hogar y ejercicios de equilibrio',
      'Solo medicación',
      'No se puede prevenir'
    ],
    correctIndex: 1,
    explanation: 'Eliminar obstáculos, buena iluminación, asideros, calzado adecuado, ejercicios de equilibrio, revisión de medicación.',
    tags: ['prevencion', 'caidas', 'ancianos']
  },
  {
    id: 'pr040',
    category: 'PREVENCION',
    difficulty: 2,
    question: '¿Qué es el phishing y cómo prevenirlo?',
    options: [
      'Un juego',
      'Estafa online para robar datos',
      'Un virus de ordenador',
      'No existe'
    ],
    correctIndex: 1,
    explanation: 'Fraude donde suplanten entidades para robar contraseñas/datos. Prevención: verificar remitentes, no clicar enlaces sospechosos, doble autenticación.',
    tags: ['prevencion', 'phishing', 'ciberestafas']
  },

  // DIFÍCILES (10 preguntas)
  {
    id: 'pr041',
    category: 'PREVENCION',
    difficulty: 3,
    question: '¿Qué es el protocolo RACE ante un incendio?',
    options: [
      'Una carrera',
      'Rescatar, Avisar, Confinar, Extinguir',
      'Solo para bomberos',
      'No existe'
    ],
    correctIndex: 1,
    explanation: 'Protocolo de actuación: Rescatar a personas en peligro, Avisar a emergencias, Confinar el fuego cerrando puertas, Extinguir si es seguro.',
    tags: ['prevencion', 'protocolo-race', 'incendios']
  },
  {
    id: 'pr042',
    category: 'PREVENCION',
    difficulty: 3,
    question: '¿Qué es la prevención cuaternaria en salud?',
    options: [
      'Cuatro vacunas',
      'Evitar sobremedicación y pruebas innecesarias',
      'Solo para hospitales',
      'No existe'
    ],
    correctIndex: 1,
    explanation: 'Prevención de la iatrogenia: evitar pruebas, tratamientos o intervenciones médicas innecesarias que pueden causar más daño que beneficio.',
    tags: ['prevencion', 'cuaternaria', 'medicina']
  },
  {
    id: 'pr043',
    category: 'PREVENCION',
    difficulty: 3,
    question: '¿Qué es la resiliencia de infraestructuras?',
    options: [
      'Resistencia al vandalismo',
      'Capacidad de recuperarse tras desastres',
      'Solo para edificios nuevos',
      'No es importante'
    ],
    correctIndex: 1,
    explanation: 'Capacidad de infraestructuras (edificios, carreteras, redes) de resistir, adaptarse y recuperarse rápidamente de eventos extremos.',
    tags: ['prevencion', 'resiliencia', 'infraestructuras']
  },
  {
    id: 'pr044',
    category: 'PREVENCION',
    difficulty: 3,
    question: '¿Qué es el concepto "Visión Cero" en seguridad vial?',
    options: [
      'No ver nada',
      'Objetivo de cero muertos en accidentes de tráfico',
      'Conducir sin luces',
      'No existe'
    ],
    correctIndex: 1,
    explanation: 'Filosofía sueca adoptada globalmente que establece como objetivo alcanzable cero muertes y lesiones graves en tráfico mediante diseño, tecnología y educación.',
    tags: ['prevencion', 'vision-cero', 'seguridad-vial']
  },
  {
    id: 'pr045',
    category: 'PREVENCION',
    difficulty: 3,
    question: '¿Qué es el análisis de riesgo biométrico?',
    options: [
      'Medir la altura',
      'Evaluación de riesgos de salud según datos biológicos',
      'Solo para seguros',
      'No existe'
    ],
    correctIndex: 1,
    explanation: 'Evaluación de riesgo de enfermedades futuras basada en marcadores biológicos (genética, biomarcadores) para prevención personalizada.',
    tags: ['prevencion', 'biometria', 'riesgo-salud']
  },
  {
    id: 'pr046',
    category: 'PREVENCION',
    difficulty: 3,
    question: '¿Qué es el principio de precaución?',
    options: [
      'Tener mucho cuidado',
      'Actuar preventivamente ante incertidumbre científica',
      'Solo para químicos',
      'No aplicar medidas hasta estar seguros'
    ],
    correctIndex: 1,
    explanation: 'Principio que justifica tomar medidas preventivas incluso ante incertidumbre científica, si existe posibilidad de daño grave irreversible.',
    tags: ['prevencion', 'principio-precaucion', 'gestion-riesgo']
  },
  {
    id: 'pr047',
    category: 'PREVENCION',
    difficulty: 3,
    question: '¿Qué es la prevención de blanqueo de capitales?',
    options: [
      'Lavar ropa',
      'Medidas para evitar introducir dinero ilegal en economía',
      'Solo para bancos grandes',
      'No afecta a seguros'
    ],
    correctIndex: 1,
    explanation: 'Obligaciones de identificación de clientes, detección de operaciones sospechosas y reporte para prevenir que dinero de actividades ilícitas entre en el sistema.',
    tags: ['prevencion', 'blanqueo', 'compliance']
  },
  {
    id: 'pr048',
    category: 'PREVENCION',
    difficulty: 3,
    question: '¿Qué es el estrés térmico laboral?',
    options: [
      'Tener calor',
      'Riesgo por exposición a temperaturas extremas en trabajo',
      'Solo en verano',
      'No es un riesgo laboral'
    ],
    correctIndex: 1,
    explanation: 'Riesgo laboral por exposición a calor o frío extremos. Requiere evaluación, medidas preventivas (pausas, hidratación, ropa) y protocolos específicos.',
    tags: ['prevencion', 'estres-termico', 'riesgos-laborales']
  },
  {
    id: 'pr049',
    category: 'PREVENCION',
    difficulty: 3,
    question: '¿Qué es la prevención de la resistencia antibiótica?',
    options: [
      'No usar antibióticos nunca',
      'Uso racional de antibióticos para evitar bacterias resistentes',
      'Solo problema de hospitales',
      'No se puede prevenir'
    ],
    correctIndex: 1,
    explanation: 'Uso responsable de antibióticos (solo si necesario, completar tratamiento, no automedicación) para evitar crear bacterias resistentes.',
    tags: ['prevencion', 'resistencia-antibiotica', 'salud-publica']
  },
  {
    id: 'pr050',
    category: 'PREVENCION',
    difficulty: 3,
    question: '¿Qué es el análisis predictivo de riesgos?',
    options: [
      'Adivinar el futuro',
      'Usar datos e IA para anticipar riesgos',
      'Solo para ciencia ficción',
      'No existe'
    ],
    correctIndex: 1,
    explanation: 'Uso de big data, machine learning y modelos estadísticos para predecir probabilidad de siniestros, enfermedades o accidentes y prevenirlos.',
    tags: ['prevencion', 'analisis-predictivo', 'tecnologia']
  }
];

export const quizQuestions: QuizQuestion[] = [
  ...segurosGenerales,
  ...segurosAuto,
  ...segurosHogar,
  ...segurosSalud,
  ...prevencionSeguridad
];

// Funciones de utilidad
export const getQuestionsByCategory = (category: QuizCategory): QuizQuestion[] => {
  return quizQuestions.filter(q => q.category === category);
};

export const getQuestionsByDifficulty = (difficulty: QuizDifficulty): QuizQuestion[] => {
  return quizQuestions.filter(q => q.difficulty === difficulty);
};

export const getRandomQuestions = (count: number, category?: QuizCategory): QuizQuestion[] => {
  const pool = category ? getQuestionsByCategory(category) : quizQuestions;
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
};

export const getCategoryStats = () => {
  const stats: Record<QuizCategory, { total: number; easy: number; medium: number; hard: number }> = {
    SEGUROS_GENERALES: { total: 0, easy: 0, medium: 0, hard: 0 },
    AUTO: { total: 0, easy: 0, medium: 0, hard: 0 },
    HOGAR: { total: 0, easy: 0, medium: 0, hard: 0 },
    SALUD: { total: 0, easy: 0, medium: 0, hard: 0 },
    PREVENCION: { total: 0, easy: 0, medium: 0, hard: 0 }
  };

  quizQuestions.forEach(q => {
    stats[q.category].total++;
    if (q.difficulty === 1) stats[q.category].easy++;
    if (q.difficulty === 2) stats[q.category].medium++;
    if (q.difficulty === 3) stats[q.category].hard++;
  });

  return stats;
};
