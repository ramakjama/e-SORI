export interface QuizQuestion {
  id: string
  category: 'auto' | 'hogar' | 'vida' | 'salud' | 'general' | 'legal' | 'siniestros'
  difficulty: 'easy' | 'medium' | 'hard'
  question: string
  options: string[]
  correctIndex: number
  explanation: string
  points: number
}

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  // ─────────────────────────────────────────────
  // AUTO (10 questions)
  // ─────────────────────────────────────────────
  {
    id: 'auto-01',
    category: 'auto',
    difficulty: 'easy',
    question: '¿Cuál es la diferencia principal entre un seguro a "todo riesgo" y uno a "terceros"?',
    options: [
      'No hay diferencia, son lo mismo',
      'El todo riesgo cubre también los daños propios del vehículo asegurado',
      'El de terceros cubre más que el todo riesgo',
      'El todo riesgo solo cubre incendio y robo',
    ],
    correctIndex: 1,
    explanation:
      'El seguro a todo riesgo cubre los daños propios del vehículo además de los daños a terceros, mientras que el seguro a terceros solo cubre los daños que causes a otros.',
    points: 10,
  },
  {
    id: 'auto-02',
    category: 'auto',
    difficulty: 'easy',
    question: '¿Es obligatorio en España tener un seguro de automóvil?',
    options: [
      'Solo si conduces por autopista',
      'No, es voluntario',
      'Sí, al menos el seguro obligatorio de responsabilidad civil',
      'Solo si el coche tiene menos de 10 años',
    ],
    correctIndex: 2,
    explanation:
      'La Ley sobre Responsabilidad Civil y Seguro en la Circulación de Vehículos a Motor obliga a todo propietario de un vehículo a motor a contratar al menos el seguro obligatorio (SOA).',
    points: 10,
  },
  {
    id: 'auto-03',
    category: 'auto',
    difficulty: 'easy',
    question: '¿Qué es la "franquicia" en un seguro de automóvil?',
    options: [
      'El precio total de la póliza',
      'La cantidad que paga el asegurado de su bolsillo antes de que la aseguradora cubra el resto',
      'Un descuento por buen conductor',
      'El impuesto que se aplica al seguro',
    ],
    correctIndex: 1,
    explanation:
      'La franquicia es la cantidad que el asegurado asume en cada siniestro. Por ejemplo, con una franquicia de 300 €, el asegurado paga los primeros 300 € del daño.',
    points: 10,
  },
  {
    id: 'auto-04',
    category: 'auto',
    difficulty: 'medium',
    question: '¿Qué cubre la garantía de "lunas" en un seguro de automóvil?',
    options: [
      'Solo el parabrisas delantero',
      'Parabrisas, luneta trasera y ventanillas laterales',
      'Solo las ventanillas laterales',
      'Únicamente los retrovisores',
    ],
    correctIndex: 1,
    explanation:
      'La cobertura de lunas incluye generalmente el parabrisas delantero, la luneta trasera y las ventanillas laterales. Algunas pólizas también incluyen el techo solar.',
    points: 20,
  },
  {
    id: 'auto-05',
    category: 'auto',
    difficulty: 'medium',
    question: '¿Qué es el "baremo de tráfico" en España?',
    options: [
      'El código de circulación',
      'Un sistema para calcular las indemnizaciones por daños personales en accidentes de tráfico',
      'La tabla de precios de los seguros de coche',
      'El registro de multas de tráfico',
    ],
    correctIndex: 1,
    explanation:
      'El baremo de tráfico (Ley 35/2015) establece un sistema de valoración de los daños y perjuicios causados a las personas en accidentes de circulación, determinando las cuantías indemnizatorias.',
    points: 20,
  },
  {
    id: 'auto-06',
    category: 'auto',
    difficulty: 'medium',
    question: '¿Qué ocurre si tienes un accidente con un vehículo sin seguro en España?',
    options: [
      'No pasa nada, el otro conductor paga',
      'El Consorcio de Compensación de Seguros indemniza a la víctima y luego reclama al responsable',
      'La policía se hace cargo de los pagos',
      'El hospital público cubre todos los gastos',
    ],
    correctIndex: 1,
    explanation:
      'El Consorcio de Compensación de Seguros actúa como fondo de garantía, indemnizando a las víctimas de accidentes causados por vehículos sin seguro, y posteriormente repite contra el propietario del vehículo no asegurado.',
    points: 20,
  },
  {
    id: 'auto-07',
    category: 'auto',
    difficulty: 'medium',
    question: '¿Qué es la "Declaración Amistosa de Accidente" (parte amistoso)?',
    options: [
      'Una denuncia policial',
      'Un documento que ambos conductores rellenan de mutuo acuerdo describiendo el accidente',
      'Un recurso legal ante el juzgado',
      'Una carta de disculpa al otro conductor',
    ],
    correctIndex: 1,
    explanation:
      'El parte amistoso es un documento europeo estandarizado que ambos conductores firman tras un accidente, describiendo las circunstancias. Facilita y agiliza la tramitación del siniestro.',
    points: 20,
  },
  {
    id: 'auto-08',
    category: 'auto',
    difficulty: 'hard',
    question: '¿Cuál es el plazo máximo que tiene una aseguradora para hacer una oferta motivada de indemnización en un accidente de tráfico con daños personales?',
    options: [
      '1 mes desde la reclamación',
      '3 meses desde la reclamación del perjudicado',
      '6 meses desde la reclamación',
      '1 año desde el accidente',
    ],
    correctIndex: 1,
    explanation:
      'Según la Ley 35/2015, la aseguradora del vehículo causante debe presentar una oferta motivada de indemnización en el plazo de 3 meses desde la reclamación del perjudicado.',
    points: 30,
  },
  {
    id: 'auto-09',
    category: 'auto',
    difficulty: 'hard',
    question: '¿Qué sistema utiliza España para determinar la culpabilidad en accidentes de tráfico entre aseguradoras?',
    options: [
      'El sistema judicial exclusivamente',
      'El Convenio CIDE/ASCIDE entre aseguradoras',
      'La Dirección General de Tráfico decide',
      'Siempre se reparte al 50%',
    ],
    correctIndex: 1,
    explanation:
      'El Convenio CIDE (Convenio de Indemnización Directa Española) y ASCIDE permiten a las aseguradoras resolver la mayoría de los siniestros de tráfico entre ellas de forma ágil, sin necesidad de acudir a los tribunales.',
    points: 30,
  },
  {
    id: 'auto-10',
    category: 'auto',
    difficulty: 'hard',
    question: '¿Qué es el sistema bonus-malus en los seguros de automóvil?',
    options: [
      'Un programa de puntos para canjear regalos',
      'Un sistema que ajusta la prima según el historial de siniestralidad del conductor',
      'Un tipo de cobertura para vehículos de lujo',
      'Un impuesto especial sobre los seguros de coche',
    ],
    correctIndex: 1,
    explanation:
      'El sistema bonus-malus bonifica a los conductores sin siniestros con primas más bajas y penaliza con primas más altas a quienes declaran siniestros. Es una forma de incentivar la conducción segura.',
    points: 30,
  },

  // ─────────────────────────────────────────────
  // HOGAR (10 questions)
  // ─────────────────────────────────────────────
  {
    id: 'hogar-01',
    category: 'hogar',
    difficulty: 'easy',
    question: '¿Qué cubre generalmente la garantía de "daños por agua" en un seguro de hogar?',
    options: [
      'Solo inundaciones por lluvia',
      'Daños causados por rotura de tuberías, escapes y filtraciones',
      'Solo daños estéticos en paredes',
      'Únicamente el coste del fontanero',
    ],
    correctIndex: 1,
    explanation:
      'La cobertura de daños por agua incluye los daños producidos por roturas u obstrucciones de tuberías, escapes de instalaciones y filtraciones. Es una de las coberturas más utilizadas del seguro de hogar.',
    points: 10,
  },
  {
    id: 'hogar-02',
    category: 'hogar',
    difficulty: 'easy',
    question: '¿Qué diferencia hay entre "continente" y "contenido" en un seguro de hogar?',
    options: [
      'Son sinónimos, significan lo mismo',
      'Continente es la estructura del edificio y contenido son los bienes muebles del interior',
      'Continente son los electrodomésticos y contenido es la ropa',
      'Continente es el jardín y contenido es la casa',
    ],
    correctIndex: 1,
    explanation:
      'El continente comprende la estructura del inmueble (paredes, suelos, techos, instalaciones fijas) y el contenido son los bienes muebles: muebles, electrodomésticos, ropa, objetos personales, etc.',
    points: 10,
  },
  {
    id: 'hogar-03',
    category: 'hogar',
    difficulty: 'easy',
    question: '¿Es obligatorio tener un seguro de hogar en España?',
    options: [
      'Sí, siempre es obligatorio',
      'No es obligatorio por ley, pero el banco lo exige al conceder una hipoteca',
      'Solo es obligatorio para pisos, no para casas',
      'Solo es obligatorio en comunidades de más de 10 vecinos',
    ],
    correctIndex: 1,
    explanation:
      'No existe una ley que obligue a contratar seguro de hogar, pero las entidades bancarias lo exigen como condición para conceder un préstamo hipotecario, al menos cubriendo el continente.',
    points: 10,
  },
  {
    id: 'hogar-04',
    category: 'hogar',
    difficulty: 'medium',
    question: '¿Qué es la "responsabilidad civil" en un seguro de hogar?',
    options: [
      'La obligación de pagar la comunidad de vecinos',
      'La cobertura que protege frente a daños que puedas causar involuntariamente a terceros desde tu vivienda',
      'El seguro del portero de la finca',
      'La obligación de mantener la fachada en buen estado',
    ],
    correctIndex: 1,
    explanation:
      'La responsabilidad civil del hogar cubre los daños que involuntariamente causes a terceros como consecuencia del uso de tu vivienda, por ejemplo, un escape de agua que afecte al vecino de abajo.',
    points: 20,
  },
  {
    id: 'hogar-05',
    category: 'hogar',
    difficulty: 'medium',
    question: '¿Qué es la "infraseguro" o "regla proporcional" en un seguro de hogar?',
    options: [
      'Un tipo de descuento por ser cliente fiel',
      'Si el valor asegurado es inferior al valor real, la indemnización se reduce proporcionalmente',
      'Una subida automática de la prima cada año',
      'Un recargo por tener objetos de valor',
    ],
    correctIndex: 1,
    explanation:
      'Si declaras un valor de contenido de 30.000 € pero realmente tienes bienes por 60.000 €, estás en infraseguro. En caso de siniestro, la aseguradora puede aplicar la regla proporcional y pagar solo la mitad.',
    points: 20,
  },
  {
    id: 'hogar-06',
    category: 'hogar',
    difficulty: 'medium',
    question: '¿Qué fenómenos extraordinarios cubre el Consorcio de Compensación de Seguros en un seguro de hogar?',
    options: [
      'Solo terremotos',
      'Inundaciones, terremotos, tempestades atípicas, terrorismo y otros riesgos extraordinarios',
      'Solo incendios',
      'Únicamente actos de vandalismo',
    ],
    correctIndex: 1,
    explanation:
      'El Consorcio de Compensación de Seguros cubre riesgos extraordinarios como inundaciones, terremotos, maremotos, erupciones volcánicas, tempestades ciclónicas atípicas, caída de cuerpos siderales y actos de terrorismo.',
    points: 20,
  },
  {
    id: 'hogar-07',
    category: 'hogar',
    difficulty: 'medium',
    question: '¿Qué es la cobertura de "defensa jurídica" en un seguro de hogar?',
    options: [
      'Un abogado para divorcios',
      'Asistencia legal y cobertura de gastos judiciales en conflictos relacionados con la vivienda',
      'Protección contra okupas exclusivamente',
      'Asesoría fiscal para la declaración de la renta',
    ],
    correctIndex: 1,
    explanation:
      'La defensa jurídica cubre los gastos de abogado y procurador en reclamaciones judiciales y extrajudiciales relacionadas con la vivienda, como disputas con vecinos, comunidad o proveedores de servicios.',
    points: 20,
  },
  {
    id: 'hogar-08',
    category: 'hogar',
    difficulty: 'hard',
    question: '¿Qué son los "objetos de especial valor" o "joyas y objetos valiosos" en un seguro de hogar y cómo se suelen cubrir?',
    options: [
      'Se cubren automáticamente sin límite',
      'Necesitan declaración específica y suelen tener un sublímite, requiriendo a veces una cobertura adicional',
      'Nunca están cubiertos por el seguro de hogar',
      'Solo están cubiertos si se guardan en una caja fuerte bancaria',
    ],
    correctIndex: 1,
    explanation:
      'Los objetos de especial valor (joyas, obras de arte, pieles, etc.) suelen tener un sublímite dentro de la póliza. Para asegurar su valor total, es recomendable declararlos individualmente y contratar una cobertura ampliada.',
    points: 30,
  },
  {
    id: 'hogar-09',
    category: 'hogar',
    difficulty: 'hard',
    question: '¿Qué diferencia hay entre "valor de nuevo" y "valor real" a efectos de indemnización del contenido?',
    options: [
      'Son exactamente lo mismo',
      'Valor de nuevo es el coste de reposición sin deducir depreciación; valor real descuenta la antigüedad y uso',
      'Valor de nuevo es más barato que el valor real',
      'Valor real solo se aplica a inmuebles, nunca a contenido',
    ],
    correctIndex: 1,
    explanation:
      'El valor de nuevo indemniza el coste de reponer el bien por uno nuevo equivalente. El valor real aplica depreciación por uso y antigüedad. Contratar a valor de nuevo es más caro pero ofrece mejor protección.',
    points: 30,
  },
  {
    id: 'hogar-10',
    category: 'hogar',
    difficulty: 'hard',
    question: '¿Qué obligación tiene el asegurado de un seguro de hogar en caso de siniestro según la Ley de Contrato de Seguro?',
    options: [
      'Ninguna, la aseguradora se encarga de todo',
      'Comunicar el siniestro en un plazo máximo de 7 días y aminorar las consecuencias del mismo',
      'Reparar los daños inmediatamente sin avisar a la aseguradora',
      'Esperar 30 días antes de llamar a la aseguradora',
    ],
    correctIndex: 1,
    explanation:
      'El artículo 16 de la Ley de Contrato de Seguro establece que el tomador debe comunicar el siniestro en un plazo de 7 días y está obligado a emplear los medios a su alcance para aminorar las consecuencias del siniestro.',
    points: 30,
  },

  // ─────────────────────────────────────────────
  // VIDA (8 questions)
  // ─────────────────────────────────────────────
  {
    id: 'vida-01',
    category: 'vida',
    difficulty: 'easy',
    question: '¿Cuál es la función principal de un seguro de vida?',
    options: [
      'Cubrir gastos médicos',
      'Proteger económicamente a los beneficiarios en caso de fallecimiento del asegurado',
      'Ahorrar dinero para la jubilación exclusivamente',
      'Pagar el entierro del asegurado',
    ],
    correctIndex: 1,
    explanation:
      'El seguro de vida garantiza una prestación económica a los beneficiarios designados en caso de fallecimiento del asegurado, proporcionando protección financiera a la familia.',
    points: 10,
  },
  {
    id: 'vida-02',
    category: 'vida',
    difficulty: 'easy',
    question: '¿Qué es el "beneficiario" en un seguro de vida?',
    options: [
      'La persona que paga la póliza',
      'La persona que contrata el seguro',
      'La persona o personas que recibirán la indemnización',
      'El agente de seguros que vende la póliza',
    ],
    correctIndex: 2,
    explanation:
      'El beneficiario es la persona física o jurídica designada por el tomador del seguro para recibir la prestación en caso de que se produzca el evento asegurado (fallecimiento o supervivencia).',
    points: 10,
  },
  {
    id: 'vida-03',
    category: 'vida',
    difficulty: 'easy',
    question: '¿Qué es un seguro de vida-riesgo?',
    options: [
      'Un seguro que solo cubre deportes de riesgo',
      'Un seguro que paga solo si el asegurado fallece durante la vigencia de la póliza, sin componente de ahorro',
      'Un seguro que cubre riesgos laborales',
      'Un seguro que invierte en bolsa',
    ],
    correctIndex: 1,
    explanation:
      'El seguro de vida-riesgo cubre exclusivamente el fallecimiento del asegurado durante la vigencia del contrato. No tiene componente de ahorro, por lo que su prima suele ser más asequible.',
    points: 10,
  },
  {
    id: 'vida-04',
    category: 'vida',
    difficulty: 'medium',
    question: '¿Qué es el "período de carencia" en un seguro de vida?',
    options: [
      'El plazo para pagar la primera prima',
      'Un período inicial durante el cual ciertas coberturas no están activas',
      'El tiempo que tarda la aseguradora en aprobar la póliza',
      'El período de prueba gratuito del seguro',
    ],
    correctIndex: 1,
    explanation:
      'El período de carencia es un plazo inicial (generalmente 1 año para suicidio) durante el cual la aseguradora no cubre ciertos riesgos. Es una medida de protección contra la selección adversa.',
    points: 20,
  },
  {
    id: 'vida-05',
    category: 'vida',
    difficulty: 'medium',
    question: '¿Es obligatorio el seguro de vida para contratar una hipoteca en España?',
    options: [
      'Sí, es un requisito legal obligatorio',
      'No es legalmente obligatorio, pero el banco puede ofrecerlo vinculado a mejores condiciones',
      'Solo es obligatorio para hipotecas superiores a 200.000 €',
      'Solo es obligatorio si el titular tiene más de 50 años',
    ],
    correctIndex: 1,
    explanation:
      'La Ley de Crédito Inmobiliario prohíbe la venta vinculada obligatoria, pero permite productos combinados. El banco puede ofrecer mejores condiciones si contratas el seguro de vida con ellos, aunque puedes elegir otra aseguradora.',
    points: 20,
  },
  {
    id: 'vida-06',
    category: 'vida',
    difficulty: 'medium',
    question: '¿Qué diferencia hay entre un seguro de vida temporal y uno de vida entera?',
    options: [
      'No hay diferencia',
      'El temporal cubre un período definido; el de vida entera cubre hasta el fallecimiento del asegurado sin límite de tiempo',
      'El temporal es más caro que el de vida entera',
      'El de vida entera solo cubre hasta los 65 años',
    ],
    correctIndex: 1,
    explanation:
      'El seguro temporal cubre un período concreto (10, 20 años, etc.) y si no ocurre el siniestro no se percibe nada. El de vida entera garantiza la prestación siempre que ocurra el fallecimiento, independientemente de cuándo.',
    points: 20,
  },
  {
    id: 'vida-07',
    category: 'vida',
    difficulty: 'hard',
    question: '¿Qué ocurre con el seguro de vida si el tomador deja de pagar las primas?',
    options: [
      'El seguro se anula inmediatamente sin derecho a nada',
      'Depende del tipo: en seguros con valor de rescate se puede reducir la póliza; en vida-riesgo se extingue tras el período de gracia',
      'La aseguradora continúa la cobertura indefinidamente',
      'El Estado se hace cargo del pago',
    ],
    correctIndex: 1,
    explanation:
      'En seguros con componente de ahorro, el tomador tiene derecho a reducir la póliza o rescatar el valor acumulado. En seguros vida-riesgo puros, transcurrido el período de gracia (habitualmente 30 días), el contrato se extingue.',
    points: 30,
  },
  {
    id: 'vida-08',
    category: 'vida',
    difficulty: 'hard',
    question: '¿Qué tratamiento fiscal tiene la prestación por fallecimiento de un seguro de vida en España?',
    options: [
      'Está exenta de impuestos siempre',
      'Tributa por el Impuesto sobre Sucesiones y Donaciones',
      'Tributa por el IRPF como rendimiento del trabajo',
      'Tributa por el Impuesto de Sociedades',
    ],
    correctIndex: 1,
    explanation:
      'Cuando el beneficiario es distinto del tomador y el evento es el fallecimiento, la prestación tributa por el Impuesto sobre Sucesiones y Donaciones, con las reducciones y bonificaciones que establezca cada Comunidad Autónoma.',
    points: 30,
  },

  // ─────────────────────────────────────────────
  // SALUD (8 questions)
  // ─────────────────────────────────────────────
  {
    id: 'salud-01',
    category: 'salud',
    difficulty: 'easy',
    question: '¿Qué es un "cuadro médico" en un seguro de salud?',
    options: [
      'Un lienzo pintado por un médico',
      'La lista de médicos, centros y hospitales a los que puedes acudir con tu seguro',
      'Un informe clínico del paciente',
      'La decoración de la consulta médica',
    ],
    correctIndex: 1,
    explanation:
      'El cuadro médico es la red de profesionales sanitarios, clínicas y hospitales concertados con la aseguradora a los que el asegurado puede acudir para recibir asistencia cubierta por su póliza.',
    points: 10,
  },
  {
    id: 'salud-02',
    category: 'salud',
    difficulty: 'easy',
    question: '¿Qué diferencia hay entre un seguro de salud con "cuadro médico" y uno de "reembolso"?',
    options: [
      'Son exactamente iguales',
      'Con cuadro médico acudes a la red concertada; con reembolso eliges cualquier profesional y la aseguradora te devuelve un porcentaje',
      'El de reembolso es gratuito',
      'El de cuadro médico solo cubre urgencias',
    ],
    correctIndex: 1,
    explanation:
      'El seguro de cuadro médico te limita a una red de profesionales concertados. El de reembolso te permite acudir a cualquier profesional y la aseguradora te reembolsa un porcentaje del gasto, ofreciendo mayor libertad de elección.',
    points: 10,
  },
  {
    id: 'salud-03',
    category: 'salud',
    difficulty: 'easy',
    question: '¿Qué es el "copago" en un seguro de salud?',
    options: [
      'La prima mensual del seguro',
      'Una pequeña cantidad que paga el asegurado cada vez que utiliza un servicio médico',
      'El coste total de la operación',
      'Un pago único al contratar el seguro',
    ],
    correctIndex: 1,
    explanation:
      'El copago es la cantidad fija que el asegurado abona cada vez que usa un servicio (consulta, urgencia, prueba diagnóstica). Las pólizas con copago suelen tener primas mensuales más bajas.',
    points: 10,
  },
  {
    id: 'salud-04',
    category: 'salud',
    difficulty: 'medium',
    question: '¿Qué son las "preexistencias" en un seguro de salud?',
    options: [
      'Las enfermedades que puedas tener en el futuro',
      'Enfermedades o condiciones que el asegurado ya tenía antes de contratar la póliza',
      'Los antecedentes familiares de enfermedades',
      'Las alergias estacionales',
    ],
    correctIndex: 1,
    explanation:
      'Las preexistencias son enfermedades, lesiones o condiciones médicas que el asegurado ya padecía antes de contratar el seguro. Deben declararse y pueden estar excluidas o sujetas a un período de carencia ampliado.',
    points: 20,
  },
  {
    id: 'salud-05',
    category: 'salud',
    difficulty: 'medium',
    question: '¿Cuál es el período de carencia habitual para un parto en un seguro de salud privado en España?',
    options: [
      'No hay período de carencia',
      'Entre 8 y 12 meses normalmente',
      '3 meses',
      '24 meses',
    ],
    correctIndex: 1,
    explanation:
      'La mayoría de las aseguradoras de salud en España establecen un período de carencia de 8 a 12 meses para la cobertura de parto, para evitar que se contrate el seguro estando ya embarazada.',
    points: 20,
  },
  {
    id: 'salud-06',
    category: 'salud',
    difficulty: 'medium',
    question: '¿Puede una aseguradora de salud cancelar tu póliza porque hayas tenido muchos gastos médicos?',
    options: [
      'Sí, puede cancelarla en cualquier momento',
      'No, la aseguradora no puede resolver el contrato por la utilización de los servicios, salvo fraude',
      'Solo si los gastos superan 50.000 € anuales',
      'Sí, pero solo después de 5 años',
    ],
    correctIndex: 1,
    explanation:
      'La Ley de Contrato de Seguro y la normativa del sector protegen al asegurado: la aseguradora no puede cancelar la póliza por alta siniestralidad. Solo puede no renovar en la fecha de vencimiento con el preaviso establecido.',
    points: 20,
  },
  {
    id: 'salud-07',
    category: 'salud',
    difficulty: 'hard',
    question: '¿Qué ventaja fiscal tiene contratar un seguro de salud a través de la empresa en España?',
    options: [
      'No tiene ninguna ventaja fiscal',
      'Las primas pagadas por la empresa están exentas de IRPF para el trabajador hasta 500 € anuales por persona asegurada',
      'El trabajador puede deducirse el 100% en su declaración de la renta',
      'La empresa paga menos Impuesto de Sociedades por cada póliza',
    ],
    correctIndex: 1,
    explanation:
      'Las primas de seguro de salud pagadas por la empresa a favor del trabajador, su cónyuge y descendientes están exentas de tributar en el IRPF del trabajador hasta 500 € anuales por persona (1.500 € si tiene discapacidad).',
    points: 30,
  },
  {
    id: 'salud-08',
    category: 'salud',
    difficulty: 'hard',
    question: '¿Qué es el "cuestionario de salud" y qué consecuencias tiene no declarar la verdad?',
    options: [
      'Es opcional y sin consecuencias',
      'Es obligatorio y ocultar información puede suponer la anulación de la póliza por dolo o la reducción proporcional de la prestación',
      'Solo afecta a la primera consulta médica',
      'Solo se usa para calcular el copago',
    ],
    correctIndex: 1,
    explanation:
      'El artículo 10 de la Ley de Contrato de Seguro obliga al tomador a declarar las circunstancias que conozca y puedan influir en la valoración del riesgo. La ocultación dolosa puede anular el contrato; la negligente puede reducir la prestación.',
    points: 30,
  },

  // ─────────────────────────────────────────────
  // GENERAL (12 questions)
  // ─────────────────────────────────────────────
  {
    id: 'general-01',
    category: 'general',
    difficulty: 'easy',
    question: '¿Qué es una "prima" en el contexto de los seguros?',
    options: [
      'La prima del seguro es la cantidad que el asegurado paga a la aseguradora por la cobertura',
      'Es un regalo que te da la aseguradora',
      'Es la indemnización que recibes tras un siniestro',
      'Es el nombre del agente de seguros',
    ],
    correctIndex: 0,
    explanation:
      'La prima es el precio del seguro, la contraprestación económica que paga el tomador a la aseguradora a cambio de la cobertura de los riesgos establecidos en la póliza.',
    points: 10,
  },
  {
    id: 'general-02',
    category: 'general',
    difficulty: 'easy',
    question: '¿Qué diferencia hay entre "tomador", "asegurado" y "beneficiario"?',
    options: [
      'Son la misma persona siempre',
      'El tomador contrata y paga, el asegurado es la persona sobre la que recae el riesgo, y el beneficiario recibe la prestación',
      'El tomador es el agente de seguros',
      'El beneficiario es quien paga la póliza',
    ],
    correctIndex: 1,
    explanation:
      'Son tres figuras distintas del contrato de seguro. Pueden coincidir en la misma persona o ser personas diferentes. Por ejemplo, un padre (tomador) puede asegurar a su hijo (asegurado) designando a la madre como beneficiaria.',
    points: 10,
  },
  {
    id: 'general-03',
    category: 'general',
    difficulty: 'easy',
    question: '¿Qué es un "mediador de seguros"?',
    options: [
      'Un empleado de la compañía aseguradora',
      'Un profesional independiente que asesora al cliente y le ayuda a encontrar el seguro más adecuado',
      'Un juez que resuelve disputas de seguros',
      'Un perito que valora daños',
    ],
    correctIndex: 1,
    explanation:
      'El mediador de seguros (corredor o agente) es un profesional que actúa como intermediario entre el cliente y las compañías aseguradoras, asesorando de forma independiente para encontrar la mejor cobertura según las necesidades del cliente.',
    points: 10,
  },
  {
    id: 'general-04',
    category: 'general',
    difficulty: 'easy',
    question: '¿Qué es una "póliza" de seguros?',
    options: [
      'La tarjeta de identificación del asegurado',
      'El documento donde se recogen las condiciones del contrato de seguro',
      'Un formulario de reclamación',
      'La factura del taller de reparación',
    ],
    correctIndex: 1,
    explanation:
      'La póliza es el documento que formaliza el contrato de seguro, recogiendo las condiciones generales, particulares y especiales, así como los derechos y obligaciones de ambas partes.',
    points: 10,
  },
  {
    id: 'general-05',
    category: 'general',
    difficulty: 'medium',
    question: '¿Qué es el "Consorcio de Compensación de Seguros"?',
    options: [
      'Una aseguradora privada',
      'Una entidad pública empresarial que cubre riesgos extraordinarios y actúa como fondo de garantía',
      'Un tribunal de arbitraje de seguros',
      'Una asociación de consumidores',
    ],
    correctIndex: 1,
    explanation:
      'El Consorcio de Compensación de Seguros es una entidad pública adscrita al Ministerio de Economía que cubre riesgos extraordinarios (catástrofes, terrorismo), vehículos sin seguro y la insolvencia de aseguradoras, entre otras funciones.',
    points: 20,
  },
  {
    id: 'general-06',
    category: 'general',
    difficulty: 'medium',
    question: '¿Qué es el "derecho de subrogación" de una aseguradora?',
    options: [
      'El derecho a subir la prima cada año',
      'El derecho de la aseguradora, tras pagar al asegurado, a reclamar al causante del daño la cantidad indemnizada',
      'El derecho del asegurado a cambiar de compañía',
      'El derecho a subrogar la póliza a otra persona',
    ],
    correctIndex: 1,
    explanation:
      'Tras indemnizar al asegurado, la aseguradora se subroga en sus derechos y puede reclamar al tercero responsable del daño la cantidad pagada. Este derecho está regulado en el artículo 43 de la Ley de Contrato de Seguro.',
    points: 20,
  },
  {
    id: 'general-07',
    category: 'general',
    difficulty: 'medium',
    question: '¿Qué es un "suplemento" o "apéndice" en una póliza de seguros?',
    options: [
      'Un folleto publicitario de la aseguradora',
      'Un documento que modifica las condiciones de la póliza original durante su vigencia',
      'El recibo de pago de la prima',
      'Una queja formal contra la aseguradora',
    ],
    correctIndex: 1,
    explanation:
      'Un suplemento o apéndice es un documento que se añade a la póliza para modificar alguna de sus condiciones, como añadir coberturas, cambiar capitales asegurados o actualizar datos del tomador.',
    points: 20,
  },
  {
    id: 'general-08',
    category: 'general',
    difficulty: 'medium',
    question: '¿Cuánto tiempo antes del vencimiento debes comunicar la no renovación de un seguro en España?',
    options: [
      'El mismo día del vencimiento',
      'Con al menos un mes de antelación a la fecha de vencimiento',
      'Con 6 meses de antelación',
      'No es necesario comunicar nada, el seguro se cancela solo',
    ],
    correctIndex: 1,
    explanation:
      'Según el artículo 22 de la Ley de Contrato de Seguro, tanto el tomador como la aseguradora pueden oponerse a la prórroga del contrato con un preaviso de al menos un mes antes de la fecha de vencimiento.',
    points: 20,
  },
  {
    id: 'general-09',
    category: 'general',
    difficulty: 'medium',
    question: '¿Qué es la "nota informativa previa" que debe entregar el mediador antes de contratar un seguro?',
    options: [
      'Una factura anticipada',
      'Un documento que informa al cliente sobre las condiciones del seguro, coberturas y exclusiones antes de firmar',
      'Un parte de accidente',
      'Una carta de bienvenida',
    ],
    correctIndex: 1,
    explanation:
      'La normativa de distribución de seguros obliga a entregar información previa al cliente sobre las coberturas, exclusiones, franquicias y condiciones principales del producto antes de la contratación, para que tome una decisión informada.',
    points: 20,
  },
  {
    id: 'general-10',
    category: 'general',
    difficulty: 'hard',
    question: '¿Cuál es el plazo de prescripción de las acciones derivadas de un contrato de seguro en España?',
    options: [
      '1 año',
      '2 años para seguros de daños y 5 años para seguros de personas',
      '5 años para todos los seguros',
      '10 años',
    ],
    correctIndex: 1,
    explanation:
      'El artículo 23 de la Ley de Contrato de Seguro establece un plazo de prescripción de 2 años para seguros de daños y 5 años para seguros de personas, contados desde que pudo ejercitarse la acción.',
    points: 30,
  },
  {
    id: 'general-11',
    category: 'general',
    difficulty: 'hard',
    question: '¿Qué es el "IPS" (Impuesto sobre Primas de Seguros) en España y cuál es su tipo general?',
    options: [
      'No existe tal impuesto',
      'Un impuesto del 6% que grava la mayoría de las primas de seguros, excepto vida y salud entre otras exenciones',
      'Un impuesto del 21% como el IVA',
      'Un impuesto del 10% solo para seguros de automóvil',
    ],
    correctIndex: 1,
    explanation:
      'El Impuesto sobre Primas de Seguros (IPS) grava al 6% la mayoría de operaciones de seguro en España. Están exentos los seguros de vida, enfermedad, crédito a la exportación y los seguros agrarios combinados, entre otros.',
    points: 30,
  },
  {
    id: 'general-12',
    category: 'general',
    difficulty: 'hard',
    question: '¿Qué función cumple el "Defensor del Asegurado" o servicio de atención al cliente de una compañía de seguros?',
    options: [
      'Solo sirve para contratar nuevos seguros',
      'Atender y resolver quejas y reclamaciones de los asegurados antes de acudir a la DGSFP o a los tribunales',
      'Vender seguros de competidores',
      'Redactar las pólizas',
    ],
    correctIndex: 1,
    explanation:
      'El Defensor del Asegurado o el Servicio de Atención al Cliente es una vía obligatoria de resolución de conflictos interna. Es requisito previo acudir a esta instancia antes de reclamar ante la DGSFP (Dirección General de Seguros).',
    points: 30,
  },

  // ─────────────────────────────────────────────
  // LEGAL (6 questions)
  // ─────────────────────────────────────────────
  {
    id: 'legal-01',
    category: 'legal',
    difficulty: 'easy',
    question: '¿Cuál es la ley principal que regula los contratos de seguros en España?',
    options: [
      'La Ley del Consumidor',
      'La Ley 50/1980, de 8 de octubre, de Contrato de Seguro',
      'El Código de Comercio exclusivamente',
      'La Ley de Propiedad Horizontal',
    ],
    correctIndex: 1,
    explanation:
      'La Ley 50/1980, de 8 de octubre, de Contrato de Seguro (LCS) es la norma fundamental que regula las relaciones entre aseguradoras y tomadores/asegurados en España.',
    points: 10,
  },
  {
    id: 'legal-02',
    category: 'legal',
    difficulty: 'medium',
    question: '¿Ante qué organismo público puede reclamar un asegurado insatisfecho con su compañía de seguros?',
    options: [
      'Ante el Ministerio de Sanidad',
      'Ante la Dirección General de Seguros y Fondos de Pensiones (DGSFP)',
      'Ante el Banco de España',
      'Ante Hacienda',
    ],
    correctIndex: 1,
    explanation:
      'La DGSFP, dependiente del Ministerio de Asuntos Económicos, es el organismo supervisor del sector asegurador en España y atiende las reclamaciones de los asegurados tras agotar la vía interna de la compañía.',
    points: 20,
  },
  {
    id: 'legal-03',
    category: 'legal',
    difficulty: 'medium',
    question: '¿Qué es la Ley de Distribución de Seguros (LOSSEAR) y a quién afecta?',
    options: [
      'Una ley que regula la distribución del correo',
      'La ley que regula la actividad de mediadores de seguros (corredores, agentes) y la distribución de productos aseguradores',
      'Una ley que afecta solo a las reaseguradoras',
      'Una normativa municipal de tráfico',
    ],
    correctIndex: 1,
    explanation:
      'El Real Decreto-ley 3/2020 transpone la Directiva de Distribución de Seguros (IDD) y regula los requisitos de los mediadores, los deberes de información al cliente y la venta de productos aseguradores en España.',
    points: 20,
  },
  {
    id: 'legal-04',
    category: 'legal',
    difficulty: 'medium',
    question: '¿Qué derecho tiene el asegurado si la aseguradora se retrasa en el pago de una indemnización?',
    options: [
      'Ningún derecho adicional',
      'Derecho a intereses de demora: el 20% anual si transcurren más de 3 meses desde el siniestro sin causa justificada',
      'Solo puede quejarse verbalmente',
      'Puede dejar de pagar la prima',
    ],
    correctIndex: 1,
    explanation:
      'El artículo 20 de la Ley de Contrato de Seguro establece que si la aseguradora no paga o no consigna la indemnización pasados 3 meses desde el siniestro, se aplica un interés de demora del 20% anual como mínimo.',
    points: 20,
  },
  {
    id: 'legal-05',
    category: 'legal',
    difficulty: 'hard',
    question: '¿Qué es la "Solvencia II" y cómo afecta a las aseguradoras en España?',
    options: [
      'Un tipo de póliza de seguros',
      'Una directiva europea que establece los requisitos de capital y gestión de riesgos para las compañías aseguradoras',
      'Un impuesto europeo sobre los seguros',
      'Un tratado internacional sobre accidentes de tráfico',
    ],
    correctIndex: 1,
    explanation:
      'Solvencia II es la directiva europea (2009/138/CE) que establece el marco regulatorio de capital, gobernanza y transparencia para las aseguradoras, garantizando su solidez financiera y la protección de los asegurados.',
    points: 30,
  },
  {
    id: 'legal-06',
    category: 'legal',
    difficulty: 'hard',
    question: '¿Qué es el "deber de declaración del riesgo" del tomador y cuáles son las consecuencias de incumplirlo?',
    options: [
      'Solo afecta a los seguros de vida',
      'El tomador debe declarar verazmente las circunstancias del riesgo; la ocultación dolosa anula el contrato y la negligente permite reducir la prestación proporcionalmente',
      'No tiene consecuencias legales',
      'Solo afecta a la primera mensualidad',
    ],
    correctIndex: 1,
    explanation:
      'Los artículos 10 y 11 de la LCS regulan este deber. Si hay dolo, la aseguradora puede rescindir el contrato quedándose con las primas. Si hay culpa, puede reducir proporcionalmente la prestación según la prima que se hubiera cobrado de conocer el riesgo real.',
    points: 30,
  },

  // ─────────────────────────────────────────────
  // SINIESTROS (6 questions)
  // ─────────────────────────────────────────────
  {
    id: 'siniestros-01',
    category: 'siniestros',
    difficulty: 'easy',
    question: '¿Qué es un "siniestro" en el ámbito de los seguros?',
    options: [
      'Un accidente de tráfico exclusivamente',
      'Cualquier evento cuyas consecuencias están cubiertas por la póliza de seguros',
      'Solo un incendio en la vivienda',
      'Una avería mecánica del coche',
    ],
    correctIndex: 1,
    explanation:
      'En seguros, un siniestro es la materialización del riesgo cubierto por la póliza. Puede ser un accidente de tráfico, un robo en el hogar, un daño por agua, una enfermedad cubierta, etc.',
    points: 10,
  },
  {
    id: 'siniestros-02',
    category: 'siniestros',
    difficulty: 'easy',
    question: '¿Cuál es lo primero que debes hacer al sufrir un siniestro cubierto por tu seguro?',
    options: [
      'Esperar a que alguien te llame',
      'Comunicarlo a tu aseguradora o mediador lo antes posible, dentro del plazo establecido en la póliza',
      'Publicarlo en redes sociales',
      'Reparar los daños inmediatamente sin avisar a nadie',
    ],
    correctIndex: 1,
    explanation:
      'Lo primero es comunicar el siniestro a tu aseguradora o mediador dentro del plazo legal (7 días según la LCS, salvo que la póliza establezca otro). También debes tomar medidas para aminorar los daños si es posible.',
    points: 10,
  },
  {
    id: 'siniestros-03',
    category: 'siniestros',
    difficulty: 'medium',
    question: '¿Qué es un "perito" en el proceso de un siniestro de seguros?',
    options: [
      'Un abogado que te defiende en juicio',
      'Un profesional que evalúa y valora los daños del siniestro para determinar la indemnización',
      'Un policía que investiga el caso',
      'El director de la oficina del seguro',
    ],
    correctIndex: 1,
    explanation:
      'El perito es un profesional cualificado que inspecciona y valora los daños producidos por el siniestro. La aseguradora designa su perito, y el asegurado tiene derecho a designar el suyo si no está conforme con la valoración.',
    points: 20,
  },
  {
    id: 'siniestros-04',
    category: 'siniestros',
    difficulty: 'medium',
    question: '¿Qué es un "tercer perito" en la valoración de un siniestro?',
    options: [
      'El perito del taller mecánico',
      'Un perito designado de común acuerdo o judicialmente cuando los peritos de cada parte no alcanzan un acuerdo',
      'Un perito que solo trabaja los jueves',
      'El supervisor del perito de la aseguradora',
    ],
    correctIndex: 1,
    explanation:
      'Cuando el perito del asegurado y el de la aseguradora no se ponen de acuerdo en la valoración de los daños, se puede nombrar un tercer perito cuya decisión será vinculante, según el artículo 38 de la LCS.',
    points: 20,
  },
  {
    id: 'siniestros-05',
    category: 'siniestros',
    difficulty: 'hard',
    question: '¿Qué es el "procedimiento de pericial contradictoria" regulado en el artículo 38 de la LCS?',
    options: [
      'Un juicio rápido en el juzgado',
      'Un mecanismo extrajudicial donde cada parte nombra un perito y, si no hay acuerdo, un tercer perito dirimente fija la valoración del daño',
      'Una reunión informal entre vecinos',
      'Un método para calcular la prima del seguro',
    ],
    correctIndex: 1,
    explanation:
      'El artículo 38 de la LCS establece este procedimiento para resolver discrepancias en la valoración de daños. Cada parte designa un perito; si no se ponen de acuerdo, un tercer perito dirimente toma la decisión final.',
    points: 30,
  },
  {
    id: 'siniestros-06',
    category: 'siniestros',
    difficulty: 'hard',
    question: '¿Puede la aseguradora rechazar un siniestro si el asegurado comunicó el hecho fuera del plazo de 7 días?',
    options: [
      'Sí, siempre queda rechazado automáticamente',
      'Solo puede rechazarlo si demuestra que el retraso le ha causado un perjuicio real, salvo que haya habido dolo',
      'No, el plazo es solo orientativo y no tiene consecuencias',
      'Sí, pero solo en seguros de automóvil',
    ],
    correctIndex: 1,
    explanation:
      'Según el artículo 16 de la LCS, la comunicación tardía solo libera a la aseguradora si demuestra que el retraso le ha causado perjuicio. Si hubo dolo en el retraso, la aseguradora queda liberada de la prestación.',
    points: 30,
  },

  // ─────────────────────────────────────────────
  // AUTO - Additional questions (11-30)
  // ─────────────────────────────────────────────
  {
    id: 'auto-11',
    category: 'auto',
    difficulty: 'easy',
    question: '¿Qué es el seguro "a terceros ampliado"?',
    options: [
      'Un seguro solo para camiones',
      'Un seguro a terceros con coberturas adicionales como robo, incendio o lunas',
      'Un seguro para tres vehículos',
      'Un seguro internacional',
    ],
    correctIndex: 1,
    explanation:
      'El seguro a terceros ampliado añade al seguro básico obligatorio coberturas adicionales como robo, incendio, lunas, asistencia en carretera, etc., sin llegar a ser un todo riesgo completo.',
    points: 10,
  },
  {
    id: 'auto-12',
    category: 'auto',
    difficulty: 'easy',
    question: '¿Qué es la asistencia en carretera o "grúa"?',
    options: [
      'Un descuento en talleres',
      'Un servicio que remolca tu vehículo en caso de avería o accidente',
      'Un seguro para el conductor',
      'Una cobertura para cambiar ruedas en casa',
    ],
    correctIndex: 1,
    explanation:
      'La asistencia en carretera incluye servicios como remolque del vehículo a un taller, pequeñas reparaciones in situ, cambio de rueda, suministro de combustible, etc.',
    points: 10,
  },
  {
    id: 'auto-13',
    category: 'auto',
    difficulty: 'easy',
    question: '¿Qué es el "conductor habitual" en un seguro de automóvil?',
    options: [
      'El único que puede conducir el coche',
      'La persona que utiliza el vehículo con más frecuencia y que influye en el cálculo de la prima',
      'El dueño del taller',
      'Un conductor profesional contratado',
    ],
    correctIndex: 1,
    explanation:
      'El conductor habitual es quien utiliza el vehículo la mayor parte del tiempo. Sus datos (edad, experiencia, historial) afectan al cálculo de la prima del seguro.',
    points: 10,
  },
  {
    id: 'auto-14',
    category: 'auto',
    difficulty: 'easy',
    question: '¿Cubre el seguro a terceros los daños en tu propio vehículo si el otro conductor no tiene seguro?',
    options: [
      'Sí, siempre',
      'No, el seguro a terceros no cubre daños propios. El Consorcio puede intervenir para cubrir a las víctimas',
      'Solo los fines de semana',
      'Solo si el accidente es en autopista',
    ],
    correctIndex: 1,
    explanation:
      'El seguro a terceros solo cubre los daños que causes a otros. Si sufres daños por un conductor sin seguro, el Consorcio de Compensación puede indemnizarte, pero no tu seguro a terceros.',
    points: 10,
  },
  {
    id: 'auto-15',
    category: 'auto',
    difficulty: 'medium',
    question: '¿Qué es el "valor venal" de un vehículo?',
    options: [
      'El precio de compra original',
      'El valor de mercado del vehículo en el momento del siniestro, considerando su antigüedad y estado',
      'El valor que aparece en la factura',
      'El precio de un coche nuevo equivalente',
    ],
    correctIndex: 1,
    explanation:
      'El valor venal es el valor real de mercado del vehículo en el momento del siniestro, considerando depreciación, antigüedad, kilómetros y estado de conservación.',
    points: 20,
  },
  {
    id: 'auto-16',
    category: 'auto',
    difficulty: 'medium',
    question: '¿Qué es la cobertura de "vehículo de sustitución"?',
    options: [
      'Te regalan un coche nuevo',
      'La aseguradora proporciona un coche de alquiler mientras el tuyo está en reparación tras un siniestro cubierto',
      'Te devuelven el dinero del coche',
      'Solo te dan transporte público gratis',
    ],
    correctIndex: 1,
    explanation:
      'Esta cobertura proporciona un vehículo de alquiler durante el tiempo que tu coche permanezca en el taller para reparar los daños de un siniestro cubierto por la póliza.',
    points: 20,
  },
  {
    id: 'auto-17',
    category: 'auto',
    difficulty: 'medium',
    question: '¿Qué es la "pérdida total" o "siniestro total" de un vehículo?',
    options: [
      'Cuando el coche tiene más de 20 años',
      'Cuando el coste de reparación supera un porcentaje del valor venal (generalmente 70-80%) o es técnicamente irreparable',
      'Cuando el vehículo tiene una multa pendiente',
      'Cuando se vende el coche',
    ],
    correctIndex: 1,
    explanation:
      'Se declara siniestro total cuando reparar el vehículo cuesta más que un porcentaje de su valor (habitualmente 70-80%) o cuando es técnicamente irreparable. La aseguradora indemniza el valor venal.',
    points: 20,
  },
  {
    id: 'auto-18',
    category: 'auto',
    difficulty: 'medium',
    question: '¿Qué cubre la garantía de "defensa jurídica" en el seguro de automóvil?',
    options: [
      'Solo multas de tráfico',
      'Los gastos de abogado y procurador en reclamaciones y procedimientos judiciales relacionados con el vehículo asegurado',
      'El carnet de conducir',
      'Los impuestos del coche',
    ],
    correctIndex: 1,
    explanation:
      'La defensa jurídica cubre los gastos de abogado, procurador y fianzas judiciales derivados de procedimientos por accidentes de tráfico, reclamaciones relacionadas con el vehículo, etc.',
    points: 20,
  },
  {
    id: 'auto-19',
    category: 'auto',
    difficulty: 'medium',
    question: '¿Qué es la "Carta Verde" internacional?',
    options: [
      'Un permiso ecológico para coches eléctricos',
      'Un certificado internacional de seguro para circular por países no miembros de la UE',
      'Una tarjeta de descuento en gasolina',
      'Un permiso de circulación especial',
    ],
    correctIndex: 1,
    explanation:
      'La Carta Verde es un certificado internacional que acredita que tu vehículo tiene seguro válido y permite circular por determinados países fuera de la UE donde es obligatoria.',
    points: 20,
  },
  {
    id: 'auto-20',
    category: 'auto',
    difficulty: 'medium',
    question: '¿Cubre el seguro de coche los daños si el conductor estaba bajo los efectos del alcohol?',
    options: [
      'Sí, siempre cubre todos los daños',
      'Cubre los daños a terceros (obligatorio por ley), pero puede excluir los daños propios y reclamar al conductor',
      'No cubre absolutamente nada',
      'Solo cubre si es la primera vez',
    ],
    correctIndex: 1,
    explanation:
      'Por imperativo legal, la aseguradora debe cubrir los daños a terceros incluso si el conductor iba bebido, pero puede repetir contra el conductor asegurado y excluir los daños propios del vehículo.',
    points: 20,
  },
  {
    id: 'auto-21',
    category: 'auto',
    difficulty: 'hard',
    question: '¿Qué es la "acción directa" del perjudicado contra la aseguradora del responsable?',
    options: [
      'Un tipo de denuncia policial',
      'El derecho del perjudicado a reclamar directamente a la aseguradora del responsable sin necesidad de demandar primero al conductor',
      'Una forma de pagar la prima',
      'Un procedimiento administrativo de tráfico',
    ],
    correctIndex: 1,
    explanation:
      'El artículo 76 de la LCS otorga al perjudicado acción directa contra la aseguradora del responsable, pudiendo reclamarle directamente la indemnización sin tener que demandar primero al conductor.',
    points: 30,
  },
  {
    id: 'auto-22',
    category: 'auto',
    difficulty: 'hard',
    question: '¿Qué ocurre si modificas tu vehículo (potencia, aspecto) sin comunicarlo a la aseguradora?',
    options: [
      'No pasa nada',
      'Puede suponer un agravamiento del riesgo que, si no se comunica, permite a la aseguradora anular la cobertura o reducir la prestación',
      'Solo te aumentan la prima automáticamente',
      'Solo afecta al ITV',
    ],
    correctIndex: 1,
    explanation:
      'Según el artículo 11 de la LCS, el tomador debe comunicar las circunstancias que agraven el riesgo. Las modificaciones no comunicadas pueden dar lugar a la anulación del contrato o reducción de la indemnización.',
    points: 30,
  },
  {
    id: 'auto-23',
    category: 'auto',
    difficulty: 'hard',
    question: '¿Qué es el "sistema de indemnización por siniestro único" previsto en el Convenio CIDE?',
    options: [
      'Un sistema de multas',
      'Un procedimiento que permite resolver extrajudicialmente entre aseguradoras los siniestros con daños materiales donde no hay heridos',
      'Un tipo de seguro especial',
      'Una forma de calcular el bonus-malus',
    ],
    correctIndex: 1,
    explanation:
      'El Convenio CIDE establece un sistema de resolución de siniestros entre aseguradoras adheridas, evitando largos procesos judiciales. Cada aseguradora indemniza a su propio asegurado y luego liquidan entre ellas según la culpabilidad.',
    points: 30,
  },
  {
    id: 'auto-24',
    category: 'auto',
    difficulty: 'easy',
    question: '¿Qué es el "seguro por kilómetros" o "pay as you drive"?',
    options: [
      'Un seguro gratuito',
      'Un seguro donde pagas en función de los kilómetros que recorres',
      'Un seguro solo para autobuses',
      'Un seguro internacional',
    ],
    correctIndex: 1,
    explanation:
      'Los seguros por kilómetros ajustan la prima según el uso real del vehículo. Cuantos menos kilómetros recorres, menos pagas. Son ideales para conductores ocasionales.',
    points: 10,
  },
  {
    id: 'auto-25',
    category: 'auto',
    difficulty: 'easy',
    question: '¿Qué documento debe llevar siempre el conductor como prueba del seguro?',
    options: [
      'La factura del taller',
      'El recibo del seguro vigente o el certificado del seguro',
      'El manual del coche',
      'La tarjeta del banco',
    ],
    correctIndex: 1,
    explanation:
      'El conductor debe llevar el recibo del seguro vigente o el certificado de seguro. No llevarlo puede conllevar una sanción, aunque el seguro esté en vigor.',
    points: 10,
  },
  {
    id: 'auto-26',
    category: 'auto',
    difficulty: 'medium',
    question: '¿Qué diferencia hay entre el "valor declarado" y el "valor tasado" en un seguro de automóvil?',
    options: [
      'Son exactamente lo mismo',
      'El valor declarado lo fija el asegurado; el valor tasado lo establece un perito de la aseguradora antes de contratar',
      'El valor tasado es siempre más bajo',
      'El valor declarado no sirve para nada',
    ],
    correctIndex: 1,
    explanation:
      'En pólizas a valor declarado, el asegurado indica el valor del vehículo. En pólizas a valor tasado, un perito valora el vehículo antes de contratar, ofreciendo mayor seguridad sobre la indemnización en caso de siniestro total.',
    points: 20,
  },
  {
    id: 'auto-27',
    category: 'auto',
    difficulty: 'medium',
    question: '¿Qué es el "conductor novel" y cómo afecta a la prima del seguro?',
    options: [
      'Un conductor profesional',
      'Un conductor con menos de 2 años de experiencia desde la obtención del permiso, lo que generalmente encarece la prima',
      'Un conductor mayor de 65 años',
      'Un conductor que solo conduce de día',
    ],
    correctIndex: 1,
    explanation:
      'Se considera conductor novel quien tiene el carnet de conducir hace menos de 2 años. Estadísticamente tienen mayor siniestralidad, por lo que las primas suelen ser más altas.',
    points: 20,
  },
  {
    id: 'auto-28',
    category: 'auto',
    difficulty: 'hard',
    question: '¿Qué es la "revisión del siniestro" y cuándo puede ejercerse?',
    options: [
      'Una inspección del vehículo antes de contratar',
      'El derecho de la aseguradora o del asegurado a solicitar la revisión de la valoración de daños ante discrepancias',
      'Un mantenimiento anual obligatorio',
      'Una auditoría fiscal',
    ],
    correctIndex: 1,
    explanation:
      'Según la LCS, si hay desacuerdo con la valoración del perito, cualquiera de las partes puede solicitar una pericial contradictoria para revisar la tasación de los daños.',
    points: 30,
  },
  {
    id: 'auto-29',
    category: 'auto',
    difficulty: 'hard',
    question: '¿Puede la aseguradora imponer un taller de reparación concreto al asegurado?',
    options: [
      'Sí, siempre puede obligarte',
      'No, el asegurado tiene libertad de elección de taller, aunque la póliza puede ofrecer ventajas por usar talleres concertados',
      'Solo en seguros a terceros',
      'Solo si eres conductor novel',
    ],
    correctIndex: 1,
    explanation:
      'El asegurado tiene libertad para elegir el taller de reparación. Las aseguradoras pueden ofrecer ventajas (sin franquicia, vehículo de sustitución) si usas su red de talleres concertados, pero no pueden obligar.',
    points: 30,
  },
  {
    id: 'auto-30',
    category: 'auto',
    difficulty: 'medium',
    question: '¿Qué es la cobertura de "ocupantes" o "accidentes del conductor"?',
    options: [
      'Un seguro de salud general',
      'Una garantía que indemniza al conductor y ocupantes del vehículo asegurado por lesiones o fallecimiento en accidente de tráfico',
      'Un descuento por llevar pasajeros',
      'Una cobertura solo para taxis',
    ],
    correctIndex: 1,
    explanation:
      'Esta cobertura indemniza al conductor y ocupantes del vehículo asegurado por daños corporales sufridos en accidente, independientemente de quién tenga la culpa.',
    points: 20,
  },

  // ─────────────────────────────────────────────
  // HOGAR - Additional questions (11-30)
  // ─────────────────────────────────────────────
  {
    id: 'hogar-11',
    category: 'hogar',
    difficulty: 'easy',
    question: '¿Qué es la cobertura de "robo" en un seguro de hogar?',
    options: [
      'Solo cubre robos con violencia',
      'Cubre el robo y hurto de objetos del hogar, generalmente con entrada violenta o forzando cerraduras',
      'Solo cubre robos en la calle',
      'No cubre objetos de valor',
    ],
    correctIndex: 1,
    explanation:
      'La cobertura de robo indemniza el valor de los bienes sustraídos del hogar mediante robo (con violencia) o hurto con señales evidentes de forzamiento de puertas o ventanas.',
    points: 10,
  },
  {
    id: 'hogar-12',
    category: 'hogar',
    difficulty: 'easy',
    question: '¿Qué es la garantía de "responsabilidad civil familiar"?',
    options: [
      'Un seguro de vida para la familia',
      'Cubre los daños que el asegurado o su familia causen involuntariamente a terceros en su vida privada',
      'Solo cubre accidentes en casa',
      'Es un seguro médico familiar',
    ],
    correctIndex: 1,
    explanation:
      'La RC familiar cubre daños involuntarios causados a terceros en tu vida privada: tu hijo rompe un cristal jugando, tu perro muerde a alguien, daños en una casa alquilada, etc.',
    points: 10,
  },
  {
    id: 'hogar-13',
    category: 'hogar',
    difficulty: 'easy',
    question: '¿Qué es un seguro "multirriesgo de hogar"?',
    options: [
      'Un seguro solo para edificios antiguos',
      'Un seguro que agrupa múltiples coberturas en una sola póliza: incendio, robo, agua, RC, cristales, etc.',
      'Un seguro para varias viviendas',
      'Un seguro obligatorio por ley',
    ],
    correctIndex: 1,
    explanation:
      'El seguro multirriesgo combina en una sola póliza diversas coberturas para el hogar: daños por agua, incendio, robo, cristales, RC, asistencia, etc., ofreciendo protección integral.',
    points: 10,
  },
  {
    id: 'hogar-14',
    category: 'hogar',
    difficulty: 'easy',
    question: '¿Qué es la "asistencia en el hogar" o "servicio de urgencias"?',
    options: [
      'Un servicio médico',
      'Un servicio que envía profesionales (fontanero, electricista, cerrajero) en caso de emergencia en el hogar',
      'Un servicio de limpieza',
      'Una ambulancia a domicilio',
    ],
    correctIndex: 1,
    explanation:
      'La asistencia en el hogar proporciona profesionales (fontanero, electricista, cerrajero) ante emergencias como fugas de agua, fallos eléctricos o pérdida de llaves, generalmente 24/7.',
    points: 10,
  },
  {
    id: 'hogar-15',
    category: 'hogar',
    difficulty: 'medium',
    question: '¿Qué diferencia hay entre "robo" y "hurto" a efectos del seguro de hogar?',
    options: [
      'Son exactamente lo mismo',
      'El robo implica violencia o intimidación; el hurto es la sustracción sin violencia pero con forzamiento de entrada',
      'El hurto siempre está excluido',
      'El robo solo ocurre de noche',
    ],
    correctIndex: 1,
    explanation:
      'Legalmente, el robo se produce con violencia o intimidación. El hurto es sin violencia. En seguros, normalmente se cubren ambos si hay evidencia de forzamiento de puertas, ventanas o cerraduras.',
    points: 20,
  },
  {
    id: 'hogar-16',
    category: 'hogar',
    difficulty: 'medium',
    question: '¿Qué es la cobertura de "daños estéticos" en un seguro de hogar?',
    options: [
      'Cubre cirugía estética',
      'Cubre la reparación de daños que afectan solo al aspecto pero no comprometen la funcionalidad (manchas, arañazos en paredes)',
      'Solo cubre cuadros y decoración',
      'No existe tal cobertura',
    ],
    correctIndex: 1,
    explanation:
      'Los daños estéticos afectan al aspecto de la vivienda sin comprometer su funcionalidad. Muchas pólizas los excluyen o aplican franquicia, ya que su reparación es costosa y no es esencial.',
    points: 20,
  },
  {
    id: 'hogar-17',
    category: 'hogar',
    difficulty: 'medium',
    question: '¿Cubre el seguro de hogar los daños por filtraciones del vecino de arriba?',
    options: [
      'No, nunca cubre esos daños',
      'Sí, tu seguro cubre los daños en tu vivienda y luego puede reclamar al seguro del vecino responsable',
      'Solo si el vecino es familiar',
      'Solo si la comunidad lo aprueba',
    ],
    correctIndex: 1,
    explanation:
      'Si tu seguro incluye daños por agua, cubrirá los daños en tu vivienda causados por filtraciones del vecino. Después, tu aseguradora se subrogará y reclamará al seguro del vecino responsable.',
    points: 20,
  },
  {
    id: 'hogar-18',
    category: 'hogar',
    difficulty: 'medium',
    question: '¿Qué es la cobertura de "rotura de cristales"?',
    options: [
      'Solo cubre gafas',
      'Cubre la rotura accidental de cristales, lunas, mamparas y espejos fijos de la vivienda',
      'Solo cubre ventanas exteriores',
      'Solo cubre si hay robo',
    ],
    correctIndex: 1,
    explanation:
      'Esta garantía cubre la rotura accidental de cristales, ventanas, lunas, mamparas de baño, espejos fijos, placas de vitrocerámica, etc., por causas fortuitas.',
    points: 20,
  },
  {
    id: 'hogar-19',
    category: 'hogar',
    difficulty: 'medium',
    question: '¿Qué es el "complemento de alojamiento" en un seguro de hogar?',
    options: [
      'Un servicio de hotel gratis todos los años',
      'Una cobertura que paga gastos de alojamiento alternativo si tu vivienda queda inhabitable tras un siniestro cubierto',
      'Un descuento en hostales',
      'Solo para vacaciones',
    ],
    correctIndex: 1,
    explanation:
      'Si tu vivienda queda inhabitable por un siniestro cubierto (incendio, inundación), esta garantía paga los gastos de alojamiento en hotel u otra vivienda durante la reparación, hasta cierto límite.',
    points: 20,
  },
  {
    id: 'hogar-20',
    category: 'hogar',
    difficulty: 'hard',
    question: '¿Qué es la cobertura de "daños por fenómenos atmosféricos" y qué suele incluir?',
    options: [
      'Solo cubre lluvia',
      'Cubre daños por lluvia, viento, granizo, nieve y rayo, siempre que no sean extraordinarios (entonces cubre el Consorcio)',
      'Solo cubre terremotos',
      'No existe tal cobertura',
    ],
    correctIndex: 1,
    explanation:
      'Esta garantía cubre daños causados por lluvia, viento, granizo, nieve o rayo en circunstancias ordinarias. Si el fenómeno es extraordinario (inundación catastrófica), interviene el Consorcio.',
    points: 30,
  },
  {
    id: 'hogar-21',
    category: 'hogar',
    difficulty: 'hard',
    question: '¿Qué es la "protección jurídica ante ocupación ilegal" que ofrecen algunas pólizas?',
    options: [
      'Un servicio de vigilancia 24h',
      'Cobertura de gastos legales y procedimientos para recuperar la vivienda en caso de ocupación ilegal',
      'Un seguro de alquiler',
      'Solo cubre cambio de cerraduras',
    ],
    correctIndex: 1,
    explanation:
      'Esta cobertura asume los gastos del procedimiento legal para desalojar a ocupantes ilegales de tu vivienda, incluyendo abogados, procuradores y tasas judiciales.',
    points: 30,
  },
  {
    id: 'hogar-22',
    category: 'hogar',
    difficulty: 'hard',
    question: '¿Están cubiertos los daños por humedades en un seguro de hogar?',
    options: [
      'Sí, siempre y todos los tipos',
      'Depende: generalmente se cubren si son consecuencia de un siniestro súbito (rotura de tubería), pero no las humedades por filtraciones crónicas o falta de mantenimiento',
      'No, nunca se cubren',
      'Solo si la vivienda tiene menos de 5 años',
    ],
    correctIndex: 1,
    explanation:
      'Las humedades derivadas de un evento súbito y fortuito (rotura de tubería) suelen estar cubiertas. Las humedades por filtraciones crónicas, condensación o falta de mantenimiento generalmente están excluidas.',
    points: 30,
  },
  {
    id: 'hogar-23',
    category: 'hogar',
    difficulty: 'easy',
    question: '¿Qué es la cobertura de "incendio" en un seguro de hogar?',
    options: [
      'Solo cubre incendios forestales',
      'Cubre los daños causados por fuego, humo, hollín y las medidas de extinción del incendio',
      'Solo cubre si el incendio es provocado',
      'No cubre daños por humo',
    ],
    correctIndex: 1,
    explanation:
      'La cobertura de incendio indemniza los daños causados directamente por el fuego, humo, explosión y también por las medidas de extinción (agua usada por bomberos, por ejemplo).',
    points: 10,
  },
  {
    id: 'hogar-24',
    category: 'hogar',
    difficulty: 'medium',
    question: '¿Qué es la cobertura de "daños eléctricos"?',
    options: [
      'La factura de la luz',
      'Cubre los daños en electrodomésticos y aparatos eléctricos por sobretensión, cortocircuito o caída de rayo',
      'Solo cubre la instalación eléctrica',
      'Un servicio de electricista gratis',
    ],
    correctIndex: 1,
    explanation:
      'Esta garantía indemniza los daños en aparatos eléctricos y electrónicos causados por sobretensión, cortocircuito, caída de rayo u otros problemas eléctricos.',
    points: 20,
  },
  {
    id: 'hogar-25',
    category: 'hogar',
    difficulty: 'medium',
    question: '¿Cubre el seguro de hogar los daños causados por mascotas del asegurado?',
    options: [
      'No, nunca',
      'Sí, la RC familiar suele cubrir daños causados por mascotas a terceros',
      'Solo perros de raza pequeña',
      'Solo si la mascota tiene menos de 1 año',
    ],
    correctIndex: 1,
    explanation:
      'La responsabilidad civil familiar incluye generalmente los daños causados por mascotas domésticas del asegurado a terceras personas o sus bienes.',
    points: 20,
  },
  {
    id: 'hogar-26',
    category: 'hogar',
    difficulty: 'hard',
    question: '¿Qué es la "reconstrucción del valor" o "actualización de capitales" en un seguro de hogar?',
    options: [
      'Una subida de precio injustificada',
      'Una cláusula que actualiza automáticamente cada año el capital asegurado según el IPC para mantener la protección frente a la inflación',
      'Un descuento por antigüedad',
      'Una penalización por siniestros',
    ],
    correctIndex: 1,
    explanation:
      'Esta cláusula actualiza anualmente el capital asegurado según el IPC (Índice de Precios al Consumo) para evitar el infraseguro derivado de la inflación y el aumento de costes de construcción.',
    points: 30,
  },
  {
    id: 'hogar-27',
    category: 'hogar',
    difficulty: 'medium',
    question: '¿Qué es la garantía de "pérdida de alimentos en congelador"?',
    options: [
      'Un seguro de salud',
      'Cubre el valor de los alimentos que se estropean por avería del congelador o corte de suministro eléctrico',
      'Un vale de supermercado',
      'Solo cubre neveras nuevas',
    ],
    correctIndex: 1,
    explanation:
      'Esta cobertura indemniza el valor de los alimentos congelados que se estropean por avería del congelador, corte prolongado de electricidad u otras causas cubiertas.',
    points: 20,
  },
  {
    id: 'hogar-28',
    category: 'hogar',
    difficulty: 'hard',
    question: '¿Cubre el seguro de hogar los daños causados durante una reforma?',
    options: [
      'Sí, siempre',
      'Generalmente no, las obras mayores suelen estar excluidas o requieren una comunicación previa y posible modificación de condiciones',
      'Solo si la reforma es menor de 1000 euros',
      'Solo los fines de semana',
    ],
    correctIndex: 1,
    explanation:
      'Las obras mayores pueden agravar el riesgo y suelen estar excluidas. Es importante comunicar a la aseguradora las reformas importantes; algunas pueden requerir condiciones especiales o exclusiones temporales.',
    points: 30,
  },
  {
    id: 'hogar-29',
    category: 'hogar',
    difficulty: 'medium',
    question: '¿Qué es la cobertura de "responsabilidad civil de inmuebles en construcción"?',
    options: [
      'No existe',
      'Cubre la responsabilidad del propietario por daños a terceros durante la construcción o reforma de la vivienda',
      'Solo para empresas constructoras',
      'Un seguro de vida para albañiles',
    ],
    correctIndex: 1,
    explanation:
      'Esta garantía específica cubre la responsabilidad civil del propietario promotor por daños a terceros durante obras de construcción o rehabilitación importantes en su inmueble.',
    points: 20,
  },
  {
    id: 'hogar-30',
    category: 'hogar',
    difficulty: 'easy',
    question: '¿Qué es la cobertura de "responsabilidad civil por daño a inmuebles alquilados"?',
    options: [
      'Solo para propietarios',
      'Cubre los daños involuntarios que el inquilino cause al inmueble alquilado',
      'Solo cubre el alquiler mensual',
      'Es un seguro de impago de alquiler',
    ],
    correctIndex: 1,
    explanation:
      'Esta garantía de la RC familiar cubre los daños involuntarios que el asegurado inquilino cause al inmueble alquilado (incendio fortuito, daño por agua, etc.).',
    points: 10,
  },

  // ─────────────────────────────────────────────
  // VIDA - Additional questions (9-25)
  // ─────────────────────────────────────────────
  {
    id: 'vida-09',
    category: 'vida',
    difficulty: 'easy',
    question: '¿Qué es un seguro de "vida ahorro"?',
    options: [
      'Un seguro solo para bancos',
      'Un seguro que combina protección por fallecimiento con un componente de ahorro o inversión',
      'Un seguro para comprar una casa',
      'Un plan de pensiones',
    ],
    correctIndex: 1,
    explanation:
      'El seguro de vida ahorro combina cobertura de fallecimiento con acumulación de capital. Parte de la prima se destina a cobertura y parte se capitaliza, generando un valor de rescate.',
    points: 10,
  },
  {
    id: 'vida-10',
    category: 'vida',
    difficulty: 'easy',
    question: '¿Qué es la "suma asegurada" o "capital asegurado" en un seguro de vida?',
    options: [
      'La prima mensual',
      'La cantidad que recibirán los beneficiarios en caso de fallecimiento del asegurado',
      'El coste del entierro',
      'Un impuesto adicional',
    ],
    correctIndex: 1,
    explanation:
      'La suma asegurada es el importe que la aseguradora pagará a los beneficiarios si se produce el evento cubierto (fallecimiento, invalidez, etc.).',
    points: 10,
  },
  {
    id: 'vida-11',
    category: 'vida',
    difficulty: 'easy',
    question: '¿Puede cambiarse el beneficiario de un seguro de vida?',
    options: [
      'No, nunca puede cambiarse',
      'Sí, el tomador puede cambiar el beneficiario en cualquier momento salvo que haya un beneficiario irrevocable',
      'Solo con permiso de un juez',
      'Solo tras el fallecimiento',
    ],
    correctIndex: 1,
    explanation:
      'El tomador de la póliza puede cambiar el beneficiario cuando lo desee, salvo que haya designado un beneficiario irrevocable, caso en el que necesitará su consentimiento.',
    points: 10,
  },
  {
    id: 'vida-12',
    category: 'vida',
    difficulty: 'medium',
    question: '¿Qué es el "valor de rescate" en un seguro de vida?',
    options: [
      'El valor de mercado de la póliza',
      'La cantidad que el tomador puede recuperar si cancela anticipadamente la póliza, en seguros con componente de ahorro',
      'La prima total pagada',
      'Un impuesto de cancelación',
    ],
    correctIndex: 1,
    explanation:
      'El valor de rescate es el importe que ha acumulado la póliza en su componente de ahorro y que el tomador puede recuperar si decide cancelar el contrato antes de su vencimiento.',
    points: 20,
  },
  {
    id: 'vida-13',
    category: 'vida',
    difficulty: 'medium',
    question: '¿Qué es un seguro de "vida cruzado" o "vida cruzada"?',
    options: [
      'Un seguro internacional',
      'Un seguro donde dos personas (generalmente cónyuges o socios) se aseguran mutuamente siendo cada uno beneficiario del otro',
      'Un seguro para gemelos',
      'Un tipo de seguro de salud',
    ],
    correctIndex: 1,
    explanation:
      'En el seguro de vida cruzado, cada persona contrata una póliza sobre la vida del otro designándose como beneficiario. Es común entre cónyuges y socios de negocios.',
    points: 20,
  },
  {
    id: 'vida-14',
    category: 'vida',
    difficulty: 'medium',
    question: '¿Qué diferencia hay entre "prima única" y "prima periódica" en un seguro de vida?',
    options: [
      'No hay diferencia',
      'Prima única se paga una sola vez al contratar; prima periódica se paga regularmente (mensual, anual)',
      'Prima única es más cara siempre',
      'Prima periódica solo es para empresas',
    ],
    correctIndex: 1,
    explanation:
      'En la prima única, el tomador paga el total al inicio. En prima periódica, paga regularmente (mensual, trimestral, anual) durante la vigencia del contrato.',
    points: 20,
  },
  {
    id: 'vida-15',
    category: 'vida',
    difficulty: 'medium',
    question: '¿Qué es la "cobertura de invalidez" en un seguro de vida?',
    options: [
      'Solo cubre enfermedades mentales',
      'Una garantía complementaria que paga un capital o renta si el asegurado queda inválido de forma permanente',
      'Un seguro de desempleo',
      'Solo cubre accidentes laborales',
    ],
    correctIndex: 1,
    explanation:
      'La cobertura de invalidez paga un capital o renta al asegurado si sufre una invalidez permanente absoluta o total que le impida trabajar, según los términos de la póliza.',
    points: 20,
  },
  {
    id: 'vida-16',
    category: 'vida',
    difficulty: 'hard',
    question: '¿Qué es un "seguro unit linked"?',
    options: [
      'Un seguro de grupo',
      'Un seguro de vida-ahorro donde las primas se invierten en fondos de inversión elegidos por el tomador, asumiendo este el riesgo de la inversión',
      'Un seguro solo para ejecutivos',
      'Un tipo de plan de pensiones',
    ],
    correctIndex: 1,
    explanation:
      'En los unit linked, la aseguradora invierte las primas en fondos seleccionados por el tomador. El riesgo de la inversión lo asume el tomador, pudiendo obtener rentabilidad o pérdidas.',
    points: 30,
  },
  {
    id: 'vida-17',
    category: 'vida',
    difficulty: 'hard',
    question: '¿Cubre el seguro de vida el suicidio del asegurado?',
    options: [
      'No, nunca cubre el suicidio',
      'Generalmente no lo cubre durante el primer año (período de carencia), pero sí después',
      'Siempre lo cubre desde el primer día',
      'Solo si hay testigos',
    ],
    correctIndex: 1,
    explanation:
      'Según el artículo 93 de la LCS, el suicidio está excluido durante el primer año. Transcurrido ese plazo, la aseguradora debe pagar la prestación completa aunque sea por suicidio.',
    points: 30,
  },
  {
    id: 'vida-18',
    category: 'vida',
    difficulty: 'hard',
    question: '¿Qué es la "tabla de mortalidad" en los seguros de vida?',
    options: [
      'Un listado de enfermedades graves',
      'Una tabla estadística que refleja la probabilidad de fallecimiento por edad y sexo, usada para calcular primas',
      'Un registro de defunciones nacional',
      'Un documento médico',
    ],
    correctIndex: 1,
    explanation:
      'Las tablas de mortalidad son herramientas actuariales que indican la probabilidad estadística de fallecimiento según edad, sexo y otros factores. Las aseguradoras las usan para calcular primas.',
    points: 30,
  },
  {
    id: 'vida-19',
    category: 'vida',
    difficulty: 'easy',
    question: '¿Qué es la cobertura de "enfermedades graves" en un seguro de vida?',
    options: [
      'Un seguro de salud completo',
      'Una garantía que paga un capital si el asegurado es diagnosticado con una enfermedad grave especificada (cáncer, infarto, ictus)',
      'Solo cubre visitas al médico',
      'Un descuento en medicamentos',
    ],
    correctIndex: 1,
    explanation:
      'Esta cobertura paga un capital al asegurado si es diagnosticado con una de las enfermedades graves listadas en la póliza (cáncer, infarto de miocardio, ictus, etc.), ayudando a afrontar gastos.',
    points: 10,
  },
  {
    id: 'vida-20',
    category: 'vida',
    difficulty: 'medium',
    question: '¿Qué es un "seguro de vida a prima nivelada"?',
    options: [
      'Un seguro con descuento',
      'Un seguro donde la prima permanece constante durante toda la vigencia del contrato',
      'Un seguro solo para pensionistas',
      'Un seguro internacional',
    ],
    correctIndex: 1,
    explanation:
      'En los seguros a prima nivelada, la cuota se mantiene constante durante toda la vida del contrato, a diferencia de las primas naturales que aumentan con la edad.',
    points: 20,
  },
  {
    id: 'vida-21',
    category: 'vida',
    difficulty: 'medium',
    question: '¿Qué es la "reducción de la póliza" en un seguro de vida-ahorro?',
    options: [
      'Una multa por impago',
      'Una opción que permite dejar de pagar primas manteniendo una cobertura reducida proporcional al ahorro acumulado',
      'Un descuento especial',
      'La cancelación total del seguro',
    ],
    correctIndex: 1,
    explanation:
      'Si dejas de pagar primas en un seguro con ahorro, puedes optar por reducir la póliza: mantienes una cobertura menor proporcional al valor acumulado, sin tener que seguir pagando.',
    points: 20,
  },
  {
    id: 'vida-22',
    category: 'vida',
    difficulty: 'hard',
    question: '¿Qué es el "anticipo sobre la póliza" en un seguro de vida-ahorro?',
    options: [
      'Un regalo de la aseguradora',
      'Un préstamo que la aseguradora concede al tomador sobre el valor acumulado de la póliza, manteniendo la cobertura vigente',
      'Una multa',
      'Un descuento en la prima',
    ],
    correctIndex: 1,
    explanation:
      'El tomador puede solicitar un préstamo (anticipo) sobre el valor de rescate acumulado. La póliza sigue vigente y el préstamo se descuenta de la prestación si se produce el evento asegurado.',
    points: 30,
  },
  {
    id: 'vida-23',
    category: 'vida',
    difficulty: 'easy',
    question: '¿A partir de qué edad suele ser más difícil contratar un seguro de vida?',
    options: [
      'A partir de 30 años',
      'A partir de 65-70 años, aunque depende de cada aseguradora',
      'No hay límite de edad',
      'A partir de 45 años',
    ],
    correctIndex: 1,
    explanation:
      'Muchas aseguradoras establecen límites de edad para contratar seguros de vida-riesgo, generalmente entre 65-70 años, debido al aumento del riesgo de fallecimiento.',
    points: 10,
  },
  {
    id: 'vida-24',
    category: 'vida',
    difficulty: 'medium',
    question: '¿Qué es un "seguro de rentas vitalicias"?',
    options: [
      'Un seguro de desempleo',
      'Un producto que garantiza al asegurado un pago periódico (mensual, anual) de por vida a cambio de un capital inicial',
      'Un tipo de hipoteca',
      'Un seguro temporal',
    ],
    correctIndex: 1,
    explanation:
      'El seguro de rentas vitalicias transforma un capital en una renta periódica garantizada de por vida. Es común en la jubilación para complementar la pensión.',
    points: 20,
  },
  {
    id: 'vida-25',
    category: 'vida',
    difficulty: 'hard',
    question: '¿Puede un acreedor embargar la prestación de un seguro de vida?',
    options: [
      'Sí, siempre puede embargarse',
      'Depende: la prestación por fallecimiento a favor de beneficiarios no entra en la herencia del asegurado y generalmente no es embargable',
      'Solo si la deuda supera 100.000 euros',
      'Solo tras 5 años de impago',
    ],
    correctIndex: 1,
    explanation:
      'Según la LCS y jurisprudencia, el capital del seguro de vida pagado a beneficiarios designados no forma parte de la herencia y está protegido frente a acreedores del fallecido.',
    points: 30,
  },

  // ─────────────────────────────────────────────
  // SALUD - Additional questions (9-25)
  // ─────────────────────────────────────────────
  {
    id: 'salud-09',
    category: 'salud',
    difficulty: 'easy',
    question: '¿Qué es un "seguro de salud dental"?',
    options: [
      'Un seguro para dentistas',
      'Un seguro específico que cubre tratamientos dentales como limpiezas, empastes, ortodoncias, etc.',
      'Solo cubre urgencias',
      'Un descuento en clínicas',
    ],
    correctIndex: 1,
    explanation:
      'El seguro dental cubre tratamientos odontológicos: revisiones, limpiezas, empastes, endodoncias, ortodoncias y cirugía oral, según las condiciones de cada póliza.',
    points: 10,
  },
  {
    id: 'salud-10',
    category: 'salud',
    difficulty: 'easy',
    question: '¿Qué es la "hospitalización" en un seguro de salud?',
    options: [
      'Solo cubre urgencias',
      'La cobertura de los gastos derivados de un ingreso hospitalario: habitación, cirugía, medicamentos, honorarios médicos',
      'Solo cubre visitas ambulatorias',
      'Un tipo de seguro de vida',
    ],
    correctIndex: 1,
    explanation:
      'La garantía de hospitalización cubre los gastos de ingresos hospitalarios programados o urgentes: habitación, intervención quirúrgica, anestesia, medicamentos, honorarios, etc.',
    points: 10,
  },
  {
    id: 'salud-11',
    category: 'salud',
    difficulty: 'easy',
    question: '¿Qué es la "medicina ambulatoria" en un seguro de salud?',
    options: [
      'Solo servicios de ambulancia',
      'La asistencia médica sin necesidad de ingreso hospitalario: consultas, pruebas diagnósticas, tratamientos externos',
      'Solo urgencias',
      'Solo cirugías mayores',
    ],
    correctIndex: 1,
    explanation:
      'La asistencia ambulatoria cubre consultas médicas, pruebas diagnósticas, análisis, radiografías y tratamientos que no requieren ingreso hospitalario.',
    points: 10,
  },
  {
    id: 'salud-12',
    category: 'salud',
    difficulty: 'medium',
    question: '¿Qué diferencia hay entre "seguro de salud con cuadro médico" y "seguro con libre elección de especialista"?',
    options: [
      'Son exactamente iguales',
      'Con cuadro médico eliges entre profesionales de la red; con libre elección puedes ir a cualquier especialista',
      'Libre elección es siempre más barato',
      'Cuadro médico solo cubre urgencias',
    ],
    correctIndex: 1,
    explanation:
      'El cuadro médico te limita a la red de profesionales concertados. La libre elección te permite acudir a cualquier especialista, aunque suele ser más cara o funcionar por reembolso.',
    points: 20,
  },
  {
    id: 'salud-13',
    category: 'salud',
    difficulty: 'medium',
    question: '¿Qué son las "pruebas diagnósticas" en un seguro de salud?',
    options: [
      'Solo análisis de sangre',
      'Procedimientos médicos para diagnosticar enfermedades: análisis, radiografías, TAC, resonancias, ecografías, etc.',
      'Solo consultas con el médico',
      'Únicamente operaciones quirúrgicas',
    ],
    correctIndex: 1,
    explanation:
      'Las pruebas diagnósticas incluyen análisis clínicos, radiografías, ecografías, TAC, resonancias magnéticas, endoscopias y otras técnicas para diagnosticar patologías.',
    points: 20,
  },
  {
    id: 'salud-14',
    category: 'salud',
    difficulty: 'medium',
    question: '¿Qué es la "segunda opinión médica" en un seguro de salud?',
    options: [
      'No existe tal servicio',
      'Un servicio que permite consultar a otro especialista para contrastar un diagnóstico o tratamiento propuesto',
      'Solo para enfermedades terminales',
      'Un descuento en consultas',
    ],
    correctIndex: 1,
    explanation:
      'La segunda opinión médica permite al paciente consultar con otro especialista para confirmar o contrastar un diagnóstico complejo o un tratamiento propuesto, dándole más seguridad.',
    points: 20,
  },
  {
    id: 'salud-15',
    category: 'salud',
    difficulty: 'medium',
    question: '¿Cubre el seguro de salud privado los tratamientos de fertilidad?',
    options: [
      'Sí, siempre todos los tratamientos',
      'Depende de la póliza: algunos incluyen estudio de fertilidad básico, pero tratamientos como FIV suelen estar excluidos o tener coberturas limitadas',
      'No, nunca',
      'Solo si eres menor de 30 años',
    ],
    correctIndex: 1,
    explanation:
      'La mayoría de seguros cubren estudios básicos de fertilidad, pero tratamientos avanzados como fecundación in vitro (FIV) suelen estar excluidos o tener coberturas muy limitadas.',
    points: 20,
  },
  {
    id: 'salud-16',
    category: 'salud',
    difficulty: 'hard',
    question: '¿Qué es el "periodo de observación" o "carencia por preexistencias" en un seguro de salud?',
    options: [
      'El tiempo de espera en la sala de urgencias',
      'Un plazo de 6-12 meses durante el cual no se cubren enfermedades preexistentes no declaradas',
      'El horario de consultas',
      'El plazo para cambiar de aseguradora',
    ],
    correctIndex: 1,
    explanation:
      'El período de observación es un plazo (habitualmente 6-12 meses) donde la aseguradora puede no cubrir patologías preexistentes que no fueron declaradas al contratar o que se manifiestan tras la contratación.',
    points: 30,
  },
  {
    id: 'salud-17',
    category: 'salud',
    difficulty: 'hard',
    question: '¿Puede una aseguradora de salud rechazar la renovación de la póliza por haber usado mucho el seguro?',
    options: [
      'Sí, puede negarse a renovar en cualquier momento',
      'Puede no renovar en el vencimiento con preaviso, pero no durante la vigencia anual por alta siniestralidad',
      'No, nunca puede no renovar',
      'Solo si hay fraude',
    ],
    correctIndex: 1,
    explanation:
      'La aseguradora puede decidir no renovar la póliza en el vencimiento anual con el preaviso estipulado, pero no puede cancelarla durante su vigencia por alta utilización, salvo impago o fraude.',
    points: 30,
  },
  {
    id: 'salud-18',
    category: 'salud',
    difficulty: 'hard',
    question: '¿Qué es la "red de urgencias" de un seguro de salud?',
    options: [
      'No existe tal red',
      'Centros y hospitales concertados donde el asegurado puede acudir en caso de urgencia sin copago o con copago reducido',
      'Solo el 112',
      'Únicamente hospitales públicos',
    ],
    correctIndex: 1,
    explanation:
      'La red de urgencias son los centros hospitalarios concertados con la aseguradora donde el asegurado puede acudir ante urgencias médicas, generalmente sin copago o con copago reducido.',
    points: 30,
  },
  {
    id: 'salud-19',
    category: 'salud',
    difficulty: 'easy',
    question: '¿Qué es la cobertura de "maternidad" en un seguro de salud?',
    options: [
      'Solo paga una baja maternal',
      'Cubre la asistencia médica durante el embarazo, el parto y el postparto, incluyendo controles, pruebas y hospitalización',
      'Solo cubre el pediatra del bebé',
      'Un subsidio económico por hijo',
    ],
    correctIndex: 1,
    explanation:
      'La cobertura de maternidad incluye seguimiento del embarazo, pruebas, ecografías, preparación al parto, asistencia durante el parto y atención postparto, tras superar el período de carencia.',
    points: 10,
  },
  {
    id: 'salud-20',
    category: 'salud',
    difficulty: 'medium',
    question: '¿Qué es un "seguro de indemnización por hospitalización"?',
    options: [
      'Un seguro que cubre todos los gastos médicos',
      'Un seguro que paga una cantidad diaria fija por cada día de hospitalización, independientemente de los gastos',
      'Un seguro de vida',
      'Solo para cirugías',
    ],
    correctIndex: 1,
    explanation:
      'Este tipo de seguro paga una indemnización diaria fija por cada día que el asegurado permanece hospitalizado, ayudando a cubrir gastos adicionales, pérdida de ingresos, etc.',
    points: 20,
  },
  {
    id: 'salud-21',
    category: 'salud',
    difficulty: 'medium',
    question: '¿Qué es la "asistencia sanitaria en el extranjero" en un seguro de salud?',
    options: [
      'No existe tal cobertura',
      'Una garantía que cubre urgencias médicas, hospitalización y repatriación cuando viajas fuera de España',
      'Solo cubre vacaciones en Europa',
      'Un seguro de viaje completo',
    ],
    correctIndex: 1,
    explanation:
      'Esta garantía cubre asistencia sanitaria urgente, hospitalización, repatriación sanitaria y otros gastos médicos cuando el asegurado viaja al extranjero, generalmente con límites geográficos y temporales.',
    points: 20,
  },
  {
    id: 'salud-22',
    category: 'salud',
    difficulty: 'easy',
    question: '¿Qué es la "pediatría" en un seguro de salud?',
    options: [
      'Solo para recién nacidos',
      'La especialidad médica que atiende la salud de niños y adolescentes, cubierta por el seguro',
      'Solo vacunas',
      'Un tipo de seguro escolar',
    ],
    correctIndex: 1,
    explanation:
      'La pediatría es la especialidad médica que atiende a niños y adolescentes. Los seguros de salud familiar incluyen consultas pediátricas, revisiones y seguimiento del desarrollo infantil.',
    points: 10,
  },
  {
    id: 'salud-23',
    category: 'salud',
    difficulty: 'medium',
    question: '¿Cubre el seguro de salud las cirugías estéticas?',
    options: [
      'Sí, todas las cirugías estéticas',
      'Generalmente no, salvo que sean reconstructivas por accidente, enfermedad o malformación congénita',
      'Solo si pagas un extra',
      'Solo la primera cirugía',
    ],
    correctIndex: 1,
    explanation:
      'Las cirugías puramente estéticas están excluidas. Sin embargo, se cubren las cirugías reconstructivas necesarias por accidente, enfermedad, malformación congénita o secuelas de tratamientos médicos.',
    points: 20,
  },
  {
    id: 'salud-24',
    category: 'salud',
    difficulty: 'hard',
    question: '¿Qué es la "gestión de autorizaciones previas" en un seguro de salud?',
    options: [
      'No hace falta pedir autorizaciones',
      'El proceso por el cual el asegurado debe solicitar aprobación de la aseguradora antes de ciertos tratamientos o pruebas costosas',
      'Solo para extranjeros',
      'Un trámite administrativo fiscal',
    ],
    correctIndex: 1,
    explanation:
      'Para ciertos procedimientos médicos, pruebas diagnósticas complejas o tratamientos costosos, la aseguradora requiere autorización previa para verificar que están cubiertos y son médicamente necesarios.',
    points: 30,
  },
  {
    id: 'salud-25',
    category: 'salud',
    difficulty: 'hard',
    question: '¿Qué es un "seguro de salud colectivo" o de empresa?',
    options: [
      'Un seguro para comunidades de vecinos',
      'Una póliza que contrata la empresa para sus empleados, generalmente con mejores condiciones y sin periodo de carencia entre las partes',
      'Un seguro solo para directivos',
      'Un plan de pensiones',
    ],
    correctIndex: 1,
    explanation:
      'El seguro colectivo lo contrata la empresa para un grupo de empleados. Suele tener mejores condiciones (sin carencias, precios reducidos) y ventajas fiscales para empresa y trabajador.',
    points: 30,
  },

  // ─────────────────────────────────────────────
  // GENERAL - Additional questions (13-40)
  // ─────────────────────────────────────────────
  {
    id: 'general-13',
    category: 'general',
    difficulty: 'easy',
    question: '¿Qué es una "aseguradora"?',
    options: [
      'Un banco que da préstamos',
      'Una entidad autorizada que asume riesgos y proporciona cobertura a cambio de una prima',
      'Una empresa de inversión',
      'Un organismo público',
    ],
    correctIndex: 1,
    explanation:
      'Una aseguradora es una entidad mercantil autorizada para asumir riesgos ajenos mediante contratos de seguro, indemnizando los daños o prestando servicios a cambio de una prima.',
    points: 10,
  },
  {
    id: 'general-14',
    category: 'general',
    difficulty: 'easy',
    question: '¿Qué es el "periodo de vigencia" de una póliza?',
    options: [
      'El tiempo que tardas en pagar',
      'El período durante el cual el contrato de seguro está activo y cubre los riesgos',
      'La antigüedad del asegurado',
      'El plazo para presentar reclamaciones',
    ],
    correctIndex: 1,
    explanation:
      'El periodo de vigencia es el tiempo durante el cual la póliza está activa y proporciona cobertura, generalmente un año, renovándose automáticamente salvo que se comunique lo contrario.',
    points: 10,
  },
  {
    id: 'general-15',
    category: 'general',
    difficulty: 'easy',
    question: '¿Qué significa que un seguro tenga "prórroga tácita"?',
    options: [
      'Que nunca se renueva',
      'Que se renueva automáticamente al vencimiento salvo que alguna de las partes comunique lo contrario',
      'Que es obligatorio renovarlo cada año',
      'Que solo dura un mes',
    ],
    correctIndex: 1,
    explanation:
      'La prórroga tácita significa que al finalizar el periodo de vigencia, la póliza se renueva automáticamente por otro periodo igual, salvo comunicación de no renovación con el preaviso estipulado.',
    points: 10,
  },
  {
    id: 'general-16',
    category: 'general',
    difficulty: 'easy',
    question: '¿Qué es el "recibo del seguro"?',
    options: [
      'El contrato completo',
      'El documento que acredita el pago de la prima del seguro',
      'El informe del siniestro',
      'La factura del taller',
    ],
    correctIndex: 1,
    explanation:
      'El recibo es el documento que indica el importe de la prima, el periodo que cubre y sirve como justificante del pago. Es importante conservarlo como prueba de que el seguro está vigente.',
    points: 10,
  },
  {
    id: 'general-17',
    category: 'general',
    difficulty: 'medium',
    question: '¿Qué es el "riesgo" en el lenguaje de los seguros?',
    options: [
      'La probabilidad de tener un accidente',
      'El evento incierto cuya ocurrencia genera la obligación de la aseguradora de indemnizar o prestar el servicio asegurado',
      'El coste de la prima',
      'La franquicia',
    ],
    correctIndex: 1,
    explanation:
      'En seguros, el riesgo es el evento futuro e incierto (accidente, enfermedad, incendio) cuya materialización obliga a la aseguradora a cumplir con la prestación prevista en la póliza.',
    points: 20,
  },
  {
    id: 'general-18',
    category: 'general',
    difficulty: 'medium',
    question: '¿Qué es una "exclusión" en un contrato de seguro?',
    options: [
      'Un tipo de cobertura especial',
      'Situaciones, circunstancias o bienes que expresamente NO están cubiertos por la póliza',
      'Un descuento en la prima',
      'Un beneficiario secundario',
    ],
    correctIndex: 1,
    explanation:
      'Las exclusiones son circunstancias, eventos o bienes que la póliza no cubre. Por ejemplo, daños por guerra, desgaste natural, actos dolosos del asegurado, etc. Deben estar claramente especificadas.',
    points: 20,
  },
  {
    id: 'general-19',
    category: 'general',
    difficulty: 'medium',
    question: '¿Qué es el "deber de buena fe" en el contrato de seguro?',
    options: [
      'No existe tal deber',
      'La obligación de ambas partes de actuar con honestidad, sinceridad y lealtad durante toda la vida del contrato',
      'Solo afecta a la aseguradora',
      'Un requisito para trabajar en seguros',
    ],
    correctIndex: 1,
    explanation:
      'El deber de buena fe obliga a ambas partes (asegurado y aseguradora) a actuar con honestidad, transparencia y lealtad, declarando la verdad y cumpliendo las obligaciones del contrato.',
    points: 20,
  },
  {
    id: 'general-20',
    category: 'general',
    difficulty: 'medium',
    question: '¿Qué es el "coaseguro" en el sector asegurador?',
    options: [
      'Cuando dos personas contratan un seguro juntas',
      'Cuando varias aseguradoras comparten la cobertura de un mismo riesgo en proporciones determinadas',
      'Un tipo de franquicia',
      'Un seguro para empresas',
    ],
    correctIndex: 1,
    explanation:
      'El coaseguro se da cuando varias aseguradoras cubren conjuntamente un mismo riesgo (por su gran tamaño o complejidad), repartiéndose las primas y las responsabilidades según porcentajes acordados.',
    points: 20,
  },
  {
    id: 'general-21',
    category: 'general',
    difficulty: 'medium',
    question: '¿Qué es el "reaseguro"?',
    options: [
      'Contratar dos seguros para lo mismo',
      'El seguro de las aseguradoras: una compañía transfiere parte de sus riesgos a otra entidad para protegerse',
      'Un segundo seguro gratuito',
      'Una multa por cambiar de aseguradora',
    ],
    correctIndex: 1,
    explanation:
      'El reaseguro es un contrato mediante el cual una aseguradora (reasegurado) transfiere parte de sus riesgos a otra entidad (reasegurador) para protegerse de grandes pérdidas y equilibrar su cartera.',
    points: 20,
  },
  {
    id: 'general-22',
    category: 'general',
    difficulty: 'hard',
    question: '¿Qué es la "acción de repetición" de la aseguradora?',
    options: [
      'Renovar automáticamente el seguro',
      'El derecho de la aseguradora a reclamar al causante del daño las cantidades pagadas al asegurado',
      'Cancelar la póliza',
      'Aumentar la prima cada año',
    ],
    correctIndex: 1,
    explanation:
      'La acción de repetición es el derecho de la aseguradora, tras indemnizar al asegurado, a reclamar al tercero responsable del daño o al propio asegurado si incumplió gravemente sus obligaciones.',
    points: 30,
  },
  {
    id: 'general-23',
    category: 'general',
    difficulty: 'hard',
    question: '¿Qué es el "agravamiento del riesgo" y qué consecuencias tiene?',
    options: [
      'No tiene importancia',
      'Un cambio en las circunstancias que aumenta la probabilidad de siniestro; debe comunicarse a la aseguradora o puede anular coberturas',
      'Solo afecta a seguros de vida',
      'Un incremento automático de prima',
    ],
    correctIndex: 1,
    explanation:
      'Según el artículo 11 de la LCS, el tomador debe comunicar cualquier cambio que aumente el riesgo. Si no lo hace y ocurre un siniestro, la aseguradora puede reducir la prestación proporcionalmente.',
    points: 30,
  },
  {
    id: 'general-24',
    category: 'general',
    difficulty: 'hard',
    question: '¿Qué es el "principio indemnizatorio" en los seguros de daños?',
    options: [
      'Pagar el doble del valor asegurado',
      'El seguro debe indemnizar el daño real sufrido, sin que el asegurado obtenga un beneficio económico',
      'Pagar siempre el máximo',
      'No indemnizar nunca',
    ],
    correctIndex: 1,
    explanation:
      'En seguros de daños, el principio indemnizatorio establece que la indemnización debe compensar el perjuicio real sufrido, sin que el asegurado pueda enriquecerse con el seguro.',
    points: 30,
  },
  {
    id: 'general-25',
    category: 'general',
    difficulty: 'easy',
    question: '¿Qué es un "agente de seguros"?',
    options: [
      'Un empleado de un banco',
      'Un profesional que representa a una o varias aseguradoras y comercializa sus productos',
      'Un perito',
      'Un abogado especializado en seguros',
    ],
    correctIndex: 1,
    explanation:
      'El agente de seguros es un profesional independiente que, mediante un contrato de agencia, representa y comercializa productos de una o varias compañías aseguradoras.',
    points: 10,
  },
  {
    id: 'general-26',
    category: 'general',
    difficulty: 'easy',
    question: '¿Qué es un "corredor de seguros"?',
    options: [
      'Un atleta profesional',
      'Un mediador independiente que asesora al cliente y busca las mejores opciones en el mercado asegurador',
      'Un vendedor de una aseguradora',
      'Un inspector de siniestros',
    ],
    correctIndex: 1,
    explanation:
      'El corredor de seguros es un mediador independiente que no representa a ninguna aseguradora en particular, sino que asesora al cliente y busca entre diferentes compañías la mejor opción.',
    points: 10,
  },
  {
    id: 'general-27',
    category: 'general',
    difficulty: 'medium',
    question: '¿Qué diferencia hay entre "condiciones generales" y "condiciones particulares" de una póliza?',
    options: [
      'Son lo mismo',
      'Las generales se aplican a todos los contratos de ese tipo; las particulares son específicas de tu póliza',
      'Las generales son opcionales',
      'Las particulares son más caras',
    ],
    correctIndex: 1,
    explanation:
      'Las condiciones generales son cláusulas predefinidas que se aplican a todas las pólizas de ese producto. Las condiciones particulares detallan datos específicos: asegurado, capitales, primas, fechas.',
    points: 20,
  },
  {
    id: 'general-28',
    category: 'general',
    difficulty: 'medium',
    question: '¿Qué es el "fraccionamiento del pago" en un seguro?',
    options: [
      'Dividir el riesgo entre varias aseguradoras',
      'La posibilidad de pagar la prima en varios plazos (mensual, trimestral) en lugar de un pago anual único',
      'Un tipo de franquicia',
      'Una penalización',
    ],
    correctIndex: 1,
    explanation:
      'El fraccionamiento permite pagar la prima en varios plazos (mensual, trimestral, semestral) en lugar de anualmente. Suele llevar un pequeño recargo por costes de gestión.',
    points: 20,
  },
  {
    id: 'general-29',
    category: 'general',
    difficulty: 'hard',
    question: '¿Qué es la "DGSFP" y cuál es su función?',
    options: [
      'Una aseguradora pública',
      'La Dirección General de Seguros y Fondos de Pensiones, organismo supervisor del sector asegurador en España',
      'Un sindicato de trabajadores de seguros',
      'Un tipo de seguro especial',
    ],
    correctIndex: 1,
    explanation:
      'La DGSFP es el organismo del Ministerio de Asuntos Económicos que supervisa y controla el sector asegurador español, protegiendo los intereses de los asegurados y garantizando la solvencia de las entidades.',
    points: 30,
  },
  {
    id: 'general-30',
    category: 'general',
    difficulty: 'hard',
    question: '¿Qué es el "conflicto de intereses" en la distribución de seguros?',
    options: [
      'Una disputa entre aseguradoras',
      'Una situación donde el mediador podría priorizar su beneficio económico sobre el mejor interés del cliente',
      'Un problema entre vecinos',
      'Una exclusión de la póliza',
    ],
    correctIndex: 1,
    explanation:
      'Existe conflicto de intereses cuando el mediador tiene incentivos (comisiones, bonos) que podrían llevarle a recomendar un producto que no es el más adecuado para el cliente. Debe declararlo.',
    points: 30,
  },
  {
    id: 'general-31',
    category: 'general',
    difficulty: 'easy',
    question: '¿Qué es la "fecha de efecto" de un seguro?',
    options: [
      'El día que se firma el contrato',
      'El momento a partir del cual el seguro comienza a tener validez y proporciona cobertura',
      'El día que termina el seguro',
      'El día que se paga la primera prima',
    ],
    correctIndex: 1,
    explanation:
      'La fecha de efecto es el momento en que el seguro entra en vigor y comienza a cubrir los riesgos asegurados. Puede coincidir con la firma o ser posterior.',
    points: 10,
  },
  {
    id: 'general-32',
    category: 'general',
    difficulty: 'medium',
    question: '¿Qué es el "deber de veracidad" del asegurado?',
    options: [
      'No existe tal deber',
      'La obligación del tomador de declarar de forma veraz y completa las circunstancias del riesgo al contratar',
      'Solo afecta tras un siniestro',
      'Es opcional',
    ],
    correctIndex: 1,
    explanation:
      'El artículo 10 de la LCS establece que el tomador debe declarar verazmente todas las circunstancias que puedan influir en la valoración del riesgo. La ocultación puede anular el contrato.',
    points: 20,
  },
  {
    id: 'general-33',
    category: 'general',
    difficulty: 'medium',
    question: '¿Qué es una "cláusula" en un contrato de seguro?',
    options: [
      'El nombre de la aseguradora',
      'Cada una de las disposiciones o condiciones que conforman el contrato y regulan derechos y obligaciones',
      'El precio del seguro',
      'Un tipo de descuento',
    ],
    correctIndex: 1,
    explanation:
      'Las cláusulas son las disposiciones concretas que componen el contrato de seguro, estableciendo coberturas, exclusiones, obligaciones, derechos y demás condiciones del acuerdo.',
    points: 20,
  },
  {
    id: 'general-34',
    category: 'general',
    difficulty: 'hard',
    question: '¿Qué es el "límite de indemnización" o "suma asegurada"?',
    options: [
      'La prima que pagas',
      'La cantidad máxima que la aseguradora pagará por siniestro o por año, según lo contratado',
      'El número de siniestros permitidos',
      'Un descuento máximo',
    ],
    correctIndex: 1,
    explanation:
      'El límite de indemnización o suma asegurada es la cantidad máxima que la aseguradora pagará en caso de siniestro. Puede ser por evento, por año o por tipo de cobertura.',
    points: 30,
  },
  {
    id: 'general-35',
    category: 'general',
    difficulty: 'easy',
    question: '¿Qué es el "capital asegurado"?',
    options: [
      'El dinero que tienes en el banco',
      'La cantidad por la que se asegura un bien o el importe que se pagará en caso de siniestro',
      'La prima anual',
      'Los ahorros del asegurado',
    ],
    correctIndex: 1,
    explanation:
      'El capital asegurado es el valor por el que se contrata el seguro y que servirá de base para calcular la indemnización en caso de siniestro.',
    points: 10,
  },
  {
    id: 'general-36',
    category: 'general',
    difficulty: 'medium',
    question: '¿Qué es una "póliza colectiva"?',
    options: [
      'Un seguro para comunidades de vecinos',
      'Un contrato de seguro que cubre a un grupo de personas vinculadas por una relación común (empresa, asociación, colegio)',
      'Un seguro familiar',
      'Un tipo de inversión colectiva',
    ],
    correctIndex: 1,
    explanation:
      'La póliza colectiva cubre a un grupo de personas unidas por una relación común. El tomador suele ser la entidad (empresa, sindicato) y los asegurados son los miembros del colectivo.',
    points: 20,
  },
  {
    id: 'general-37',
    category: 'general',
    difficulty: 'hard',
    question: '¿Qué es el "seguro obligatorio" y cuáles son ejemplos en España?',
    options: [
      'No existen seguros obligatorios en España',
      'Seguros que la ley obliga a contratar: seguro de automóvil (RC), seguro decenal de construcción, RC de cazadores',
      'Todos los seguros son obligatorios',
      'Solo el seguro de hogar es obligatorio',
    ],
    correctIndex: 1,
    explanation:
      'Los seguros obligatorios son aquellos que la ley exige contratar: seguro de RC de automóvil, seguro decenal en construcción, RC de cazadores, RC profesional de ciertas profesiones, entre otros.',
    points: 30,
  },
  {
    id: 'general-38',
    category: 'general',
    difficulty: 'medium',
    question: '¿Qué es el "derecho de desistimiento" en un contrato de seguro?',
    options: [
      'No existe tal derecho',
      'El derecho del tomador a cancelar el contrato dentro de los 30 días siguientes a la contratación y recuperar las primas pagadas',
      'Solo para seguros de vida',
      'Un descuento especial',
    ],
    correctIndex: 1,
    explanation:
      'El derecho de desistimiento permite al tomador cancelar el contrato en los primeros 30 días (14 en algunos casos) recuperando las primas pagadas, salvo la parte proporcional al período cubierto.',
    points: 20,
  },
  {
    id: 'general-39',
    category: 'general',
    difficulty: 'hard',
    question: '¿Qué es la "cláusula de salvaguarda" o "cláusula claims made"?',
    options: [
      'Una cláusula de descuento',
      'Una cláusula en seguros de RC profesional donde la póliza cubre reclamaciones presentadas durante su vigencia, no cuando ocurrió el hecho',
      'Solo para seguros de vida',
      'Una forma de pago',
    ],
    correctIndex: 1,
    explanation:
      'La cláusula claims made cubre las reclamaciones presentadas durante la vigencia de la póliza, independientemente de cuándo ocurrió el hecho dañoso. Es común en RC profesional y directivos.',
    points: 30,
  },
  {
    id: 'general-40',
    category: 'general',
    difficulty: 'medium',
    question: '¿Qué es la "mutua de seguros"?',
    options: [
      'Un banco de seguros',
      'Una sociedad sin ánimo de lucro donde los asegurados son socios y comparten los riesgos',
      'Una aseguradora internacional',
      'Un fondo de inversión',
    ],
    correctIndex: 1,
    explanation:
      'Una mutua de seguros es una sociedad sin ánimo de lucro donde los asegurados son también socios. Los excedentes se reparten entre los mutualistas o se destinan a reducir primas.',
    points: 20,
  },

  // ─────────────────────────────────────────────
  // LEGAL - Additional questions (7-30)
  // ─────────────────────────────────────────────
  {
    id: 'legal-07',
    category: 'legal',
    difficulty: 'easy',
    question: '¿Qué es la "Ley de Contrato de Seguro" (LCS)?',
    options: [
      'Una ley sobre compraventa',
      'La ley que regula las relaciones contractuales entre aseguradores y asegurados en España',
      'Una ley solo para empresas',
      'Un reglamento europeo',
    ],
    correctIndex: 1,
    explanation:
      'La Ley 50/1980 de Contrato de Seguro es la norma fundamental que regula los derechos y obligaciones de aseguradoras, tomadores, asegurados y beneficiarios en los contratos de seguro en España.',
    points: 10,
  },
  {
    id: 'legal-08',
    category: 'legal',
    difficulty: 'easy',
    question: '¿Qué es el "derecho de información precontractual" del asegurado?',
    options: [
      'No existe tal derecho',
      'El derecho a recibir información clara sobre coberturas, exclusiones y condiciones antes de contratar',
      'Solo para seguros de vida',
      'Un descuento informativo',
    ],
    correctIndex: 1,
    explanation:
      'La normativa obliga al mediador y aseguradora a proporcionar al cliente información clara, completa y comprensible sobre el producto de seguro antes de su contratación.',
    points: 10,
  },
  {
    id: 'legal-09',
    category: 'legal',
    difficulty: 'medium',
    question: '¿Qué plazo tiene el asegurado para reclamar ante la DGSFP tras recibir respuesta negativa de la aseguradora?',
    options: [
      '15 días',
      '2 años desde la respuesta del servicio de atención al cliente de la aseguradora',
      '5 años',
      '30 días',
    ],
    correctIndex: 1,
    explanation:
      'El plazo para presentar una reclamación ante la DGSFP es de 2 años desde que se recibe la respuesta del Defensor del Asegurado o Servicio de Atención al Cliente de la compañía.',
    points: 20,
  },
  {
    id: 'legal-10',
    category: 'legal',
    difficulty: 'medium',
    question: '¿Qué es el "arbitraje de seguros"?',
    options: [
      'Un juicio público',
      'Un método alternativo de resolución de conflictos donde un árbitro imparcial decide sobre la disputa entre asegurado y aseguradora',
      'Una multa administrativa',
      'Una inspección de la DGSFP',
    ],
    correctIndex: 1,
    explanation:
      'El arbitraje es un método extrajudicial de resolución de conflictos donde un árbitro independiente emite una decisión vinculante, evitando acudir a los tribunales.',
    points: 20,
  },
  {
    id: 'legal-11',
    category: 'legal',
    difficulty: 'medium',
    question: '¿Qué es la "transparencia en la comercialización de seguros"?',
    options: [
      'No existe tal obligación',
      'El deber de mediadores y aseguradoras de proporcionar información clara, comprensible y no engañosa sobre los productos',
      'Solo afecta a seguros de vida',
      'Un tipo de descuento',
    ],
    correctIndex: 1,
    explanation:
      'La normativa de distribución de seguros exige transparencia: información clara, comprensible y no engañosa sobre productos, costes, coberturas y exclusiones antes de la contratación.',
    points: 20,
  },
  {
    id: 'legal-12',
    category: 'legal',
    difficulty: 'hard',
    question: '¿Qué es el "principio de máxima buena fe" (uberrima fides) en el contrato de seguro?',
    options: [
      'No existe tal principio',
      'Un principio fundamental que exige la máxima honestidad y transparencia de ambas partes en el contrato de seguro',
      'Solo afecta a la aseguradora',
      'Un requisito para mediadores',
    ],
    correctIndex: 1,
    explanation:
      'El principio de máxima buena fe (uberrima fides) es esencial en seguros: ambas partes deben actuar con absoluta honestidad, especialmente en la declaración del riesgo y gestión de siniestros.',
    points: 30,
  },
  {
    id: 'legal-13',
    category: 'legal',
    difficulty: 'hard',
    question: '¿Qué es la "Directiva de Distribución de Seguros" (IDD)?',
    options: [
      'Una norma solo española',
      'Una directiva europea que establece requisitos de formación, transparencia y protección al cliente en la venta de seguros',
      'Un tipo de seguro',
      'Una multa para aseguradoras',
    ],
    correctIndex: 1,
    explanation:
      'La Directiva IDD (Insurance Distribution Directive) 2016/97/UE regula la distribución de seguros en la UE, estableciendo requisitos de formación, información, transparencia y protección del consumidor.',
    points: 30,
  },
  {
    id: 'legal-14',
    category: 'legal',
    difficulty: 'easy',
    question: '¿Qué organismo supervisiona a las aseguradoras en España?',
    options: [
      'El Banco de España',
      'La Dirección General de Seguros y Fondos de Pensiones (DGSFP)',
      'Hacienda',
      'La Policía',
    ],
    correctIndex: 1,
    explanation:
      'La DGSFP, dependiente del Ministerio de Asuntos Económicos, es el organismo público que supervisa y controla a las entidades aseguradoras en España.',
    points: 10,
  },
  {
    id: 'legal-15',
    category: 'legal',
    difficulty: 'medium',
    question: '¿Qué es el "registro de contratos de seguros con cobertura de fallecimiento"?',
    options: [
      'No existe tal registro',
      'Un registro donde se inscriben los seguros de vida para facilitar la localización de beneficiarios tras el fallecimiento',
      'Un registro de defunciones',
      'Solo para seguros de empresa',
    ],
    correctIndex: 1,
    explanation:
      'Existe un registro oficial gestionado por la DGSFP donde se inscriben los seguros con cobertura de fallecimiento, permitiendo a herederos localizar pólizas del fallecido.',
    points: 20,
  },
  {
    id: 'legal-16',
    category: 'legal',
    difficulty: 'hard',
    question: '¿Qué es el "blanqueo de capitales" y cómo afecta al sector asegurador?',
    options: [
      'No afecta a los seguros',
      'Las aseguradoras deben cumplir normativa antiblanqueo identificando clientes y detectando operaciones sospechosas',
      'Solo afecta a bancos',
      'Es un tipo de seguro especial',
    ],
    correctIndex: 1,
    explanation:
      'La normativa de prevención de blanqueo de capitales obliga a aseguradoras y mediadores a identificar clientes, conocer el origen de los fondos y reportar operaciones sospechosas.',
    points: 30,
  },
  {
    id: 'legal-17',
    category: 'legal',
    difficulty: 'medium',
    question: '¿Qué es la "venta vinculada" en seguros y está permitida?',
    options: [
      'Siempre está permitida',
      'Obligar al cliente a contratar un seguro como condición para otro producto. Está prohibida salvo excepciones con mejora demostrable',
      'Es la forma normal de vender seguros',
      'Solo se permite en empresas',
    ],
    correctIndex: 1,
    explanation:
      'La venta vinculada obligatoria está prohibida. Se permite la venta combinada si el cliente obtiene una ventaja clara y puede contratar los productos por separado.',
    points: 20,
  },
  {
    id: 'legal-18',
    category: 'legal',
    difficulty: 'hard',
    question: '¿Qué es el "fondo de garantía" del Consorcio de Compensación de Seguros?',
    options: [
      'Un fondo de inversión',
      'Un mecanismo que garantiza el pago de indemnizaciones en caso de insolvencia de la aseguradora',
      'Una cuenta de ahorro',
      'Un impuesto adicional',
    ],
    correctIndex: 1,
    explanation:
      'El Consorcio actúa como fondo de garantía protegiendo a los asegurados en caso de insolvencia de su aseguradora en seguros obligatorios (autos), vida y decenales de construcción.',
    points: 30,
  },
  {
    id: 'legal-19',
    category: 'legal',
    difficulty: 'easy',
    question: '¿Qué es el "periodo de reflexión" o "derecho de desistimiento"?',
    options: [
      'No existe',
      'Un plazo (generalmente 30 días) durante el cual el tomador puede cancelar el contrato sin penalización',
      'Solo para seguros de vida',
      'Un tiempo de espera para contratar',
    ],
    correctIndex: 1,
    explanation:
      'El derecho de desistimiento permite al tomador cancelar la póliza en los primeros 30 días (14 en algunos seguros) recuperando las primas, salvo la parte proporcional consumida.',
    points: 10,
  },
  {
    id: 'legal-20',
    category: 'legal',
    difficulty: 'medium',
    question: '¿Qué es la "protección de datos personales" en el sector asegurador?',
    options: [
      'No afecta a los seguros',
      'Las aseguradoras deben cumplir el RGPD protegiendo los datos personales de clientes y obteniendo su consentimiento informado',
      'Solo para seguros de salud',
      'Una multa administrativa',
    ],
    correctIndex: 1,
    explanation:
      'El Reglamento General de Protección de Datos (RGPD) obliga a aseguradoras y mediadores a proteger datos personales, informar sobre su uso y obtener consentimiento del cliente.',
    points: 20,
  },
  {
    id: 'legal-21',
    category: 'legal',
    difficulty: 'hard',
    question: '¿Qué es el "seguro obligatorio decenal" en construcción?',
    options: [
      'No existe tal seguro',
      'Un seguro obligatorio que cubre durante 10 años los daños estructurales en edificaciones de nueva construcción',
      'Un seguro para inquilinos',
      'Un seguro solo para reformas',
    ],
    correctIndex: 1,
    explanation:
      'La Ley de Ordenación de la Edificación (LOE) exige un seguro decenal que cubra durante 10 años los daños estructurales que comprometan la resistencia y estabilidad del edificio.',
    points: 30,
  },
  {
    id: 'legal-22',
    category: 'legal',
    difficulty: 'medium',
    question: '¿Qué es la "Ley de Mediación de Seguros"?',
    options: [
      'Una ley sobre arbitrajes',
      'La normativa que regula la actividad profesional de corredores y agentes de seguros en España',
      'Solo para aseguradoras',
      'Una ley europea',
    ],
    correctIndex: 1,
    explanation:
      'La Ley de Mediación de Seguros y Reaseguros (transpone la IDD) regula los requisitos, obligaciones y funcionamiento de los mediadores de seguros (corredores, agentes, operadores).',
    points: 20,
  },
  {
    id: 'legal-23',
    category: 'legal',
    difficulty: 'hard',
    question: '¿Qué es la "responsabilidad civil profesional" obligatoria para mediadores de seguros?',
    options: [
      'No existe tal obligación',
      'Un seguro obligatorio que deben contratar los mediadores para cubrir daños a clientes por errores u omisiones profesionales',
      'Solo para abogados',
      'Un impuesto profesional',
    ],
    correctIndex: 1,
    explanation:
      'Los mediadores de seguros deben contratar obligatoriamente un seguro de RC profesional que cubra daños causados a clientes por errores, omisiones o negligencias en su actividad.',
    points: 30,
  },
  {
    id: 'legal-24',
    category: 'legal',
    difficulty: 'medium',
    question: '¿Qué es el "test de idoneidad" o "test de conveniencia" en la venta de seguros?',
    options: [
      'No existe tal test',
      'Una evaluación que el mediador debe hacer de las necesidades del cliente para recomendar productos adecuados',
      'Un examen para trabajar en seguros',
      'Una prueba médica',
    ],
    correctIndex: 1,
    explanation:
      'La normativa de distribución obliga a realizar un test de idoneidad (seguros de inversión) o conveniencia para asegurar que el producto recomendado se ajusta a las necesidades del cliente.',
    points: 20,
  },
  {
    id: 'legal-25',
    category: 'legal',
    difficulty: 'easy',
    question: '¿Puede una aseguradora modificar unilateralmente las condiciones de la póliza durante su vigencia?',
    options: [
      'Sí, cuando quiera',
      'No, salvo casos excepcionales previstos en la póliza y con consentimiento del tomador o posibilidad de rescindir',
      'Solo puede bajar precios',
      'Puede hacerlo sin avisar',
    ],
    correctIndex: 1,
    explanation:
      'Durante la vigencia de la póliza, la aseguradora no puede modificar las condiciones unilateralmente salvo situaciones excepcionales previstas legalmente, dando opción al tomador de rescindir.',
    points: 10,
  },
  {
    id: 'legal-26',
    category: 'legal',
    difficulty: 'hard',
    question: '¿Qué es el "contrato de reaseguro" y qué lo diferencia del seguro?',
    options: [
      'Son exactamente iguales',
      'El reaseguro es un contrato entre aseguradoras para transferir riesgos; no tiene asegurado final ni aplicación directa de la LCS',
      'Solo existe en el extranjero',
      'Es un seguro para empresas grandes',
    ],
    correctIndex: 1,
    explanation:
      'El reaseguro es un contrato entre la aseguradora (reasegurado) y el reasegurador para transferir parte de los riesgos asumidos. No se rige por la LCS sino por contratos mercantiles.',
    points: 30,
  },
  {
    id: 'legal-27',
    category: 'legal',
    difficulty: 'medium',
    question: '¿Qué es la "conciliación" como medio de resolución de conflictos en seguros?',
    options: [
      'No existe en seguros',
      'Un procedimiento voluntario donde las partes intentan llegar a un acuerdo con ayuda de un conciliador imparcial',
      'Un juicio rápido',
      'Una inspección administrativa',
    ],
    correctIndex: 1,
    explanation:
      'La conciliación es un método alternativo de resolución de conflictos donde un tercero neutral ayuda a las partes a alcanzar un acuerdo voluntario, evitando el proceso judicial.',
    points: 20,
  },
  {
    id: 'legal-28',
    category: 'legal',
    difficulty: 'hard',
    question: '¿Qué es el "principio de especialidad" en derecho de seguros?',
    options: [
      'No existe tal principio',
      'El principio que establece que las normas específicas de la LCS prevalecen sobre las normas generales del derecho común',
      'Solo para seguros especiales',
      'Un tipo de cobertura',
    ],
    correctIndex: 1,
    explanation:
      'El principio de especialidad establece que la Ley de Contrato de Seguro, como norma especial, prevalece sobre el Código Civil y Código de Comercio en materia de seguros.',
    points: 30,
  },
  {
    id: 'legal-29',
    category: 'legal',
    difficulty: 'medium',
    question: '¿Qué es el "registro de mediadores de seguros" (RDGS)?',
    options: [
      'Un listado de clientes',
      'El Registro administrativo oficial donde deben inscribirse todos los mediadores autorizados para ejercer en España',
      'Un directorio telefónico',
      'Un registro de pólizas',
    ],
    correctIndex: 1,
    explanation:
      'El Registro de Distribuidores de Seguros y Reaseguros, gestionado por la DGSFP, inscribe a todos los mediadores autorizados (corredores, agentes, operadores) para ejercer en España.',
    points: 20,
  },
  {
    id: 'legal-30',
    category: 'legal',
    difficulty: 'hard',
    question: '¿Qué es la "acción directa" en el seguro de responsabilidad civil?',
    options: [
      'Una forma de pago directo',
      'El derecho de la víctima a demandar directamente a la aseguradora del responsable sin necesidad de demandar primero al causante',
      'Un tipo de cobertura',
      'Una multa administrativa',
    ],
    correctIndex: 1,
    explanation:
      'El artículo 76 de la LCS otorga a la víctima de un daño el derecho a reclamar directamente a la aseguradora del responsable, sin tener que demandar previamente al causante del daño.',
    points: 30,
  },

  // ─────────────────────────────────────────────
  // SINIESTROS - Additional questions (7-20)
  // ─────────────────────────────────────────────
  {
    id: 'siniestros-07',
    category: 'siniestros',
    difficulty: 'easy',
    question: '¿Qué es la "declaración de siniestro"?',
    options: [
      'Una denuncia policial',
      'La comunicación formal que hace el asegurado a la aseguradora informando de un evento cubierto por la póliza',
      'Un formulario de contratación',
      'El recibo del seguro',
    ],
    correctIndex: 1,
    explanation:
      'La declaración de siniestro es el documento donde el asegurado comunica formalmente a su aseguradora que ha ocurrido un evento cubierto, detallando las circunstancias.',
    points: 10,
  },
  {
    id: 'siniestros-08',
    category: 'siniestros',
    difficulty: 'easy',
    question: '¿Qué documentación suele solicitar la aseguradora tras un siniestro?',
    options: [
      'Solo tu DNI',
      'Parte de siniestro, fotos de daños, facturas, presupuestos, documentos de propiedad según el caso',
      'No solicita documentación',
      'Solo el número de póliza',
    ],
    correctIndex: 1,
    explanation:
      'Dependiendo del siniestro, la aseguradora puede solicitar: declaración del siniestro, fotos de los daños, facturas, presupuestos de reparación, denuncia policial, informes médicos, etc.',
    points: 10,
  },
  {
    id: 'siniestros-09',
    category: 'siniestros',
    difficulty: 'medium',
    question: '¿Qué es la "prueba del siniestro" y quién debe aportarla?',
    options: [
      'La aseguradora debe probar que no ocurrió',
      'El asegurado debe probar que ocurrió el siniestro y que está cubierto; la aseguradora debe probar si aplica una exclusión',
      'No hace falta probar nada',
      'Solo se requiere en siniestros grandes',
    ],
    correctIndex: 1,
    explanation:
      'El asegurado debe probar que ocurrió el siniestro, su alcance y que está cubierto por la póliza. La aseguradora debe probar si aplica alguna exclusión o excepción.',
    points: 20,
  },
  {
    id: 'siniestros-10',
    category: 'siniestros',
    difficulty: 'medium',
    question: '¿Qué es el "informe pericial" tras un siniestro?',
    options: [
      'Un documento policial',
      'El documento técnico elaborado por el perito que describe los daños, sus causas y valora el coste de reparación',
      'Un recibo de pago',
      'Una factura del taller',
    ],
    correctIndex: 1,
    explanation:
      'El informe pericial es el documento técnico donde el perito describe el siniestro, analiza las causas, valora los daños y estima el coste de reparación o reposición.',
    points: 20,
  },
  {
    id: 'siniestros-11',
    category: 'siniestros',
    difficulty: 'medium',
    question: '¿Qué es la "carta de pago" o "finiquito" en un siniestro?',
    options: [
      'El presupuesto de reparación',
      'El documento que firma el asegurado al recibir la indemnización, reconociendo que el siniestro queda cerrado',
      'El parte amistoso',
      'La póliza del seguro',
    ],
    correctIndex: 1,
    explanation:
      'La carta de pago o finiquito es el documento que firma el asegurado al cobrar la indemnización, declarando que acepta el importe y da por cerrado el siniestro.',
    points: 20,
  },
  {
    id: 'siniestros-12',
    category: 'siniestros',
    difficulty: 'hard',
    question: '¿Puede la aseguradora rechazar un siniestro si el asegurado no colabora en la investigación?',
    options: [
      'No, nunca puede rechazarlo',
      'Sí, la falta de colaboración del asegurado puede liberar a la aseguradora de su obligación de indemnizar',
      'Solo en seguros de vida',
      'Solo si hay fraude demostrado',
    ],
    correctIndex: 1,
    explanation:
      'El asegurado tiene el deber de colaborar con la aseguradora facilitando información, documentación y acceso para la investigación. Su incumplimiento puede liberar a la aseguradora.',
    points: 30,
  },
  {
    id: 'siniestros-13',
    category: 'siniestros',
    difficulty: 'hard',
    question: '¿Qué es el "fraude en seguros" y qué consecuencias tiene?',
    options: [
      'No existe el fraude en seguros',
      'Declarar siniestros falsos, exagerar daños o mentir para obtener indemnizaciones; conlleva anulación del contrato, devolución de indemnizaciones y responsabilidad penal',
      'Solo es una infracción administrativa leve',
      'Solo afecta a la prima',
    ],
    correctIndex: 1,
    explanation:
      'El fraude en seguros (simular siniestros, exagerar daños) es un delito penal. La aseguradora puede rescindir el contrato, negar la indemnización, reclamar lo pagado y denunciar penalmente.',
    points: 30,
  },
  {
    id: 'siniestros-14',
    category: 'siniestros',
    difficulty: 'easy',
    question: '¿Qué es un "parte de siniestro"?',
    options: [
      'Un formulario para contratar seguros',
      'El documento o formulario que el asegurado completa para comunicar un siniestro a su aseguradora',
      'Un certificado médico',
      'La póliza del seguro',
    ],
    correctIndex: 1,
    explanation:
      'El parte de siniestro es el formulario donde el asegurado describe el evento ocurrido, las circunstancias, los daños y aporta los datos necesarios para la tramitación.',
    points: 10,
  },
  {
    id: 'siniestros-15',
    category: 'siniestros',
    difficulty: 'medium',
    question: '¿Qué es la "investigación de siniestros" por parte de la aseguradora?',
    options: [
      'Una auditoría fiscal',
      'El proceso mediante el cual la aseguradora verifica las circunstancias, causas y alcance del siniestro para determinar la cobertura',
      'Una inspección policial',
      'Un trámite administrativo rutinario',
    ],
    correctIndex: 1,
    explanation:
      'La aseguradora tiene derecho a investigar el siniestro para verificar que ocurrió, está cubierto, no hay fraude y determinar la indemnización procedente.',
    points: 20,
  },
  {
    id: 'siniestros-16',
    category: 'siniestros',
    difficulty: 'hard',
    question: '¿Qué es la "suspensión de la cobertura" tras un siniestro en algunos seguros?',
    options: [
      'No existe tal suspensión',
      'En algunos seguros, tras un siniestro total la cobertura queda suspendida hasta que se repare el bien o se pague la indemnización',
      'Es una penalización permanente',
      'Solo ocurre en seguros de vida',
    ],
    correctIndex: 1,
    explanation:
      'En ciertos seguros (como marítimo), tras un siniestro total la cobertura puede quedar suspendida. En seguros de vehículos, tras siniestro total se suele extinguir el contrato.',
    points: 30,
  },
  {
    id: 'siniestros-17',
    category: 'siniestros',
    difficulty: 'medium',
    question: '¿Qué es la "indemnización a valor de nuevo" vs. "a valor real"?',
    options: [
      'Son lo mismo',
      'Valor de nuevo paga el coste de reposición sin depreciación; valor real descuenta la antigüedad y uso del bien',
      'Valor nuevo es más barato',
      'Valor real solo existe en seguros de vida',
    ],
    correctIndex: 1,
    explanation:
      'La indemnización a valor de nuevo cubre el coste de reposición sin depreciación. A valor real se descuenta el desgaste y antigüedad del bien. Valor nuevo es más caro pero mejor cobertura.',
    points: 20,
  },
  {
    id: 'siniestros-18',
    category: 'siniestros',
    difficulty: 'easy',
    question: '¿Qué es la "reparación en especie" en un siniestro?',
    options: [
      'Pagar con productos',
      'Cuando la aseguradora repara o repone directamente el bien dañado en lugar de dar dinero al asegurado',
      'Una penalización',
      'Un descuento',
    ],
    correctIndex: 1,
    explanation:
      'La reparación en especie es cuando la aseguradora, en lugar de dar dinero, organiza y paga directamente la reparación o reposición del bien dañado en talleres o proveedores concertados.',
    points: 10,
  },
  {
    id: 'siniestros-19',
    category: 'siniestros',
    difficulty: 'medium',
    question: '¿Qué es el "salvamento" tras un siniestro?',
    options: [
      'El rescate de personas',
      'Los restos del bien siniestrado que conservan valor y que la aseguradora puede recuperar tras pagar la indemnización',
      'Una prima adicional',
      'Un tipo de cobertura',
    ],
    correctIndex: 1,
    explanation:
      'El salvamento son los restos del bien siniestrado que aún tienen valor. Tras pagar siniestro total, la aseguradora puede quedarse con el salvamento o descontar su valor de la indemnización.',
    points: 20,
  },
  {
    id: 'siniestros-20',
    category: 'siniestros',
    difficulty: 'hard',
    question: '¿Qué es la "prescripción de la acción de reclamación" de un siniestro?',
    options: [
      'No prescriben las reclamaciones',
      'El plazo legal tras el cual el asegurado pierde el derecho a reclamar la indemnización: 2 años seguros de daños, 5 años seguros de personas',
      'El plazo para pagar la prima',
      'Solo un mes desde el siniestro',
    ],
    correctIndex: 1,
    explanation:
      'Según el artículo 23 de la LCS, las acciones derivadas del contrato de seguro prescriben en 2 años (seguros de daños) o 5 años (seguros de personas) desde el hecho que las origina.',
    points: 30,
  },
]

/**
 * Devuelve un array de preguntas aleatorias, opcionalmente filtradas por categoría.
 */
export function getRandomQuestions(count: number, category?: string): QuizQuestion[] {
  let pool = category
    ? QUIZ_QUESTIONS.filter((q) => q.category === category)
    : [...QUIZ_QUESTIONS]

  const shuffled = pool.sort(() => Math.random() - 0.5)
  return shuffled.slice(0, Math.min(count, shuffled.length))
}

/**
 * Devuelve 5 preguntas diarias aleatorias, garantizando al menos 1 de cada dificultad.
 */
export function getDailyQuestions(): QuizQuestion[] {
  const easy = QUIZ_QUESTIONS.filter((q) => q.difficulty === 'easy')
  const medium = QUIZ_QUESTIONS.filter((q) => q.difficulty === 'medium')
  const hard = QUIZ_QUESTIONS.filter((q) => q.difficulty === 'hard')

  const shuffle = <T>(arr: T[]): T[] => [...arr].sort(() => Math.random() - 0.5)

  const picked: QuizQuestion[] = [
    shuffle(easy)[0],
    shuffle(medium)[0],
    shuffle(hard)[0],
  ]

  // Fill remaining 2 slots from all questions not already picked
  const remaining = QUIZ_QUESTIONS.filter((q) => !picked.includes(q))
  const shuffledRemaining = shuffle(remaining)
  picked.push(shuffledRemaining[0], shuffledRemaining[1])

  // Shuffle final order
  return shuffle(picked)
}
