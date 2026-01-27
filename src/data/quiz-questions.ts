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
