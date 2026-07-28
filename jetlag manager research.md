# PRD: Clon funcional de Timeshifter — App de jet lag basada en ciencia circadiana

*(Documento en español; términos técnicos en inglés. Fecha de elaboración: 28 de julio de 2026.)*

## TL;DR
- **Un equipo puede clonar Timeshifter de forma funcional** porque, aunque el algoritmo propietario es una **caja negra** (sus patentes lo confirman), toda la ciencia subyacente que la empresa cita es pública y reconstruible: estimar el marcador de fase circadiana a partir del cronotipo y el sueño habitual, decidir la dirección de adaptación (advance vs delay), y aplicar reglas de curvas de respuesta de fase (PRC) para luz, melatonina y cafeína.
- **El corazón matemático reconstruible** es: CBTmin ≈ despertar − 2 h y DLMO ≈ inicio de sueño − 2/3 h; luz *después* de CBTmin adelanta el reloj y *antes* de CBTmin lo retrasa; el shift máximo alcanzable es ~1–2 h/día (hasta 3 h/día con intervención, según la propia patente de Timeshifter). Con luz + melatonina bien cronometradas se adapta 3–4× más rápido que el ~1 h/día natural.
- **Modelo de negocio y alcance:** primer plan gratis, $9.99/plan, $24.99/año, lifetime ~$149; más de 1,7 millones de viajeros y rating 4,7/5; línea de productos B2B (aerolíneas, hoteles, equipos deportivos, agencias espaciales), app separada de shift work, y productos "Peak Performance" y "My Circadian Day".

## Key Findings

1. **La app es simple en superficie, compleja en el motor.** La UI real tiene esencialmente **3 botones de navegación** (perfil / plan-timeline / vuelos); el diferencial no es la interfaz sino el motor circadiano, validado por el **Dr. Steven W. Lockley, Ph.D.**, co-fundador y Chief Scientist, más de 20 años en la facultad de Harvard Medical School y previamente neurocientífico en Brigham and Women's Hospital, con casi 30 años de investigación en ritmos circadianos; se incorporó a Timeshifter a tiempo completo en 2024.
2. **El algoritmo exacto de Timeshifter NO es público.** Sus patentes (inventores Lockley, Tony Hanna, Jacob Ravn, Mickey Beyer-Clausen, Fredric Maxik) protegen la *arquitectura y el flujo de trabajo* — ingesta de cronotipo + sueño + husos → programación de actividades (luz/melatonina/cafeína/naps) → notificaciones → lógica de cumplimiento ("practicality filter" y "partial/Quick Turnaround shift") — pero **omiten deliberadamente** las fórmulas de estimación de fase, las ventanas de PRC, las dosis y cualquier modelo oscilador. Los únicos números duros de las patentes son el **shift máximo diario de 1–2 h/día (hasta 3 h/día con intervención)** y la banda de luz azul de **450–485 nm**.
3. **La ciencia subyacente sí es pública y suficiente para clonar:** PRC de luz (Khalsa 2003; St Hilaire 2012), PRC de melatonina (Burgess 2008/2010), two-process model de Borbély, y el modelo oscilador Kronauer-Jewett (van der Pol modificado) con ecuaciones y parámetros publicados.
4. **Recomendaciones concretas que la propia app publica:** cafeína "little and often" = **20–25 mg/hora o 40–50 mg cada dos horas**; melatonina de liberación rápida **0.5–3 mg**; la luz azul (~480 nm) es la más potente para el reloj; para "avoid light" usar gafas de sol oscuras wrap-around.
5. **Competidores:** Arcascope (apps *Shift*/*Arcashift*, de Olivia Walch — PhD en matemáticas aplicadas — con Danny Forger como CSO y Kevin Hannay como CTO) es el rival científicamente más creíble, con modelos matemáticos propios de re-entrainment. *Entrain* (U. Michigan, gratis, precursor académico de Walch) es el origen del enfoque. *Jet Lag Rooster* y *StopJetLag* son más simples y basados en reglas.

## Details

### 1. PRODUCTO Y FEATURES

#### 1.1 Onboarding (perfil de usuario)
Datos que pide la app real:
- **Cronotipo.** El marketing popular a veces usa el esquema "lion/bear/wolf/dolphin" (de Michael Breus), pero la base científica de Timeshifter es la dimensión **morningness–eveningness** (morning type / intermediate / evening type). Para un clon, capturarlo con MEQ (Horne-Östberg) o MCTQ.
- **Hora habitual de dormir y de despertar** (bedtime / wake time).
- **Edad y sexo** (modulan fase y sensibilidad).
- **Uso de melatonina** (on/off, con disclaimers médicos).
- **Uso de cafeína** (on/off; si el usuario ya la consume — la app no anima a empezar).
- **Uso de siestas/naps** (on/off).
- **Preferencias de adaptación:** parcial vs completa; pre-travel adjustment sí/no.

**User story:** Como viajero, quiero introducir mi patrón de sueño y cronotipo una sola vez para que todos mis planes se personalicen.
**Criterios de aceptación:** el perfil persiste offline; es editable; los toggles de cafeína/melatonina/naps se reflejan de inmediato en el plan generado.

#### 1.2 Creación de un plan de viaje
- Origen, destino, fecha/hora de salida y llegada.
- Vuelos multi-leg / escalas (stopovers): el plan de $9.99 cubre un one-way o roundtrip con **hasta dos escalas cortas**.
- Roundtrip y multi-city.
- Adaptación parcial vs completa.
- **Quick Turnaround®:** detecta automáticamente viajes cortos y mantiene el reloj cercano a *home time* (ideal para viajes de negocios de 2–3 días, donde adaptarse por completo no compensa).
- El plan comienza **varios días antes de la salida** (pre-travel advice) y continúa **varios días tras la llegada**, ajustando la hora de dormir cada día hasta la adaptación completa.

**Criterios de aceptación:** el planner recalcula la fase en cada segmento; para roundtrip genera dos sub-planes; para <48 h aplica Quick Turnaround automáticamente.

#### 1.3 Estructura del plan (timeline)
- Timeline día por día, hora por hora, con iconos por actividad.
- Actividades pre-vuelo, durante el vuelo (funciona en modo avión) y post-llegada.
- Notificaciones push que entregan el consejo sin abrir la app.

#### 1.4 Tipos de recomendación (verbatim de la app)
- **See bright light:** máxima luz posible, sin gafas de sol; interiores con todas las luces encendidas; dispositivos a brillo máximo.
- **See some light:** luz aunque no sea brillante; evitar penumbra/oscuridad.
- **Avoid light:** minimizar la luz; si es inevitable, gafas de sol oscuras wrap-around; evitar pantallas.
- **Sleep (or avoid light):** dormir; cuarto frío, oscuro y silencioso; antifaz y tapones.
- **Nap / Nap if you're tired:** siestas estratégicas (pre-vuelo hasta 1 h; post-vuelo según plan).
- **Take melatonin:** tipo y dosis recomendadas.
- **Use caffeine / Avoid caffeine.**
- **Peak fatigue:** aviso de baja alerta para tareas que requieren concentración.
- (En *My Circadian Day* se añaden: Eat normally / Eat lean and light / Avoid eating; Exercise normally / low intensity / avoid.)

#### 1.5 Notificaciones, offline, plataformas
- Push notifications (activables desde el perfil).
- **Modo offline:** una vez creado el plan, **no necesita internet**; solo se requiere conexión para crear o modificar el plan.
- Plataformas: iOS (requiere iOS 15.6+), Android, macOS (Apple Silicon M1+), Apple Watch. UI minimalista de 3 botones.
- **Gap de producto:** no hay integración nativa confirmada con Oura/Whoop/Apple Health en la versión pública; los usuarios la piden en reseñas del App Store ("If this synced up to Apple Watch, Fitbit… and gave me a score… that would be awesome").

#### 1.6 Features B2B / white label
- **Timeshifter for Business (jet lag):** desplegable sin IT; usado por corporaciones, aerolíneas, equipos deportivos y agencias espaciales; incluye una "Jet lag cost calculator".
- **Timeshifter Shift Work (app independiente):** rotaciones de 12 h, semanas alternas, noches fijas permanentes, on-call e irregulares; usa la misma plataforma técnica.
- **Peak Performance** y **My Circadian Day®:** productos adicionales de la línea (rendimiento en eventos concretos y timing circadiano diario).
- **Concierge** para astronautas (Axiom Space), equipos NBA, pilotos de F1 y atletas olímpicos.
- Partners: **United Airlines** (Premier 1K/Global Services gratis; otros MileagePlus 500 millas al suscribirse), Lufthansa, SWISS, Austrian Airlines, InterContinental Hotels & Resorts, Six Senses, Under Armour, FCM (20% dto → $19.99/año).
- Financiación total **$5.3 M**, ronda liderada por Skip Capital (Scott Farquhar y Kim Jackson), con Nico Rosberg (campeón F1 2016), Michael López-Alegría (Chief Astronaut de Axiom Space) y Brian Kelly (The Points Guy).
- Tracción: **>1,7 millones de viajeros** y rating **4,7/5**; ~500.000 cuentas nuevas en 2025.

#### 1.7 Modelo de negocio y precios
- Primer plan **gratis** (sin tarjeta, sin compromiso).
- **$9.99** por plan (roundtrip + hasta 2 escalas).
- **$24.99/año** ilimitado.
- Suscripción **lifetime ~$149**.
- Planes corporativos/white-label vía "Contact sales".

### 2. ALGORITMO Y CIENCIA CIRCADIANA (RECONSTRUCCIÓN)

> **Nota de honestidad epistémica:** El algoritmo propietario de Timeshifter no es público. La subagente confirmó, leyendo las especificaciones completas de las patentes de Timeshifter (US20190366032A1 y el concedido US12214141B2), que estas **no contienen** fórmulas de DLMO/CBTmin, ventanas de PRC, dosis ni ecuaciones de oscilador — de hecho los términos "DLMO" y "CBTmin" no aparecen en ellas. Lo que sigue es la **mejor reconstrucción** basada en la literatura que la propia empresa cita (Lockley, Czeisler, Arendt, Burgess, Khalsa, Kronauer-Jewett) y en los pocos números que revelan las patentes.

#### 2.1 Estimación de fase circadiana (marcadores)
- **CBTmin (mínimo de temperatura corporal)** ≈ hora de despertar − 2 h. Rango individual: wake − 1 h a wake − 3 h según cronotipo; en *night owls* extremos puede estar cerca del despertar. Es el ancla de la PRC de luz.
- **DLMO (Dim Light Melatonin Onset)** ≈ inicio de sueño − 2 a 3 h; equivalentemente **CBTmin − 7 h** (ángulo de fase DLMO→CBTmin ≈ 7 h, valor usado en estudios de predicción de fase).
- **A partir del cronotipo:** MEQ o MCTQ. El MSFsc (midpoint of sleep on free days, corregido por deuda de sueño) correlaciona con DLMO r ≈ 0.54–0.68; el MEQ r ≈ −0.40 a −0.70. **Precaución de implementación:** para un mismo score de cuestionario se observa un rango de ~4 h en el DLMO real; no usar el cuestionario como única fuente para cronometrar luz/melatonina, porque un error de fase puede empeorar el jet lag.

#### 2.2 PRC de luz (forma y magnitudes)
- Curva **tipo 1**, punto de inflexión ~CBTmin, sin "dead zone" diurno prolongado.
- **Luz DESPUÉS de CBTmin → advance (adelanta el reloj). Luz ANTES de CBTmin → delay (retrasa).**
- Ventanas prácticas usadas en la literatura de predicción: las **6 h antes de CBTmin = zona de delay; 6 h después = zona de advance**.
- Magnitudes (Khalsa 2003, pulso de 6.7 h ~10.000 lux luz blanca): peak-to-trough ~5,0 h; advance máximo ~**2,0 h**, delay máximo ~**3,4 h**.
- Luz azul monocromática 480 nm (pulso 6.5 h): advance máx ~1,3–1,4 h, delay máx ~2,6–2,8 h (curva desplazada varias horas respecto a la de luz blanca).
- **Dependencia de intensidad:** la respuesta de fase satura alrededor de ~500 lux y se satura plenamente por encima de ~1.000 lux; subir de 2.000 a 8.000 lux **no** aumenta mucho la magnitud. La **duración** (1–3 h) sí la aumenta. (Dato útil para la lógica: la app trata "encender todas las luces" o "salir al exterior" como suficiente; no exige lightbox.)
- **Sensibilidad melanópica (ipRGC):** pico ~480 nm; la patente de Timeshifter define la banda azul relevante como **450–485 nm**.

#### 2.3 PRC de melatonina exógena (Burgess et al.)
- **Zona de advance:** CT 6–18; el advance máximo con **0.5 mg** ocurre tomándola **2–4 h antes del DLMO** (≈ 9–11 h antes del midpoint de sueño).
- **Zona de delay:** CT 18–6; el delay máximo se da cerca del despertar (CT 0).
- **Dosis:** 0.5 mg y 3.0 mg producen advances de magnitud similar **cuando cada dosis se administra a su hora óptima**; la dosis alta debe tomarse más temprano y causa más somnolencia vespertina. Timeshifter recomienda **liberación rápida, 1–3 mg** (evita liberación lenta y dosis altas que "permanecen demasiado tiempo y confunden el reloj").
- **Efecto indirecto vía sueño:** la melatonina abre la "puerta del sueño", reduce la exposición a luz (ojos cerrados) y así refuerza el shift.
- La app deja claro que la melatonina **no es imprescindible**: los planes sin melatonina siguen siendo efectivos, aunque la adaptación puede ser algo más lenta.

#### 2.4 Cafeína
- **Farmacocinética:** absorción ~45 min, pico plasmático 15 min–2 h. La app usa una **vida media de 3–5 h** (otras fuentes citan ~5–6 h); su ejemplo: 100 mg por la mañana → ~12,5 mg 12 h después.
- **Mecanismo:** antagonista de receptores de adenosina A1/A2A → ↑cAMP → alerta (bloquea la señal de sueño).
- **Efecto circadiano (clave para el timing):** según Burke et al., *Science Translational Medicine* (2015) — estudio doble ciego de 49 días de Kenneth Wright (CU Boulder) y John O'Neill (MRC-LMB Cambridge) — una dosis de cafeína equivalente a un doble espresso 3 h antes de la hora habitual de dormir induce un **delay de ~40 min del ritmo de melatonina**, "nearly half of the magnitude of the phase-delaying response induced by exposure to 3 hours of evening bright light (~3000 lux, ~7 W/m²)". Por eso la cafeína mal cronometrada no solo daña el sueño sino que retrasa la fase.
- **Regla de la app (verbatim):** "little and often" = **consumir unos 20–25 mg de cafeína cada hora o 40–50 mg cada dos horas"; evitar espressos grandes y bebidas energéticas; evitar cerca de la hora de dormir.

#### 2.5 Sueño/naps y two-process model (Borbély)
- **Process S** (presión homeostática de sueño): sube de forma exponencial durante la vigilia y decae durante el sueño ("sleep debt").
- **Process C** (circadiano): impone umbrales superior e inferior (~sinusoidales) que "gatean" el inicio y el fin del sueño. La propensión total al sueño ≈ combinación de S y C.
- **Naps:** reducen S (permiten aguantar despierto más tarde) y reducen exposición a luz (aceleran el shift). *Sleep inertia* = grogginess post-despertar que puede durar horas.
- **Restricciones de la patente de Timeshifter (números concretos):** nap post-aterrizaje ≤ 3 h y terminando ≤ 2 h después del despertar habitual; nap pre-vuelo temprano ≤ 3 h, empezando como mucho 2 h antes del sueño habitual; **naps pre-vuelo limitados a 1 h**; y el usuario debe despertarse al menos 4 h antes de viajar.

#### 2.6 Dirección óptima de adaptación (advance vs delay)
- El reloj humano libre corre ligeramente largo (~24.1–24.2 h) → **delay (oeste) es más fácil que advance (este)**.
- **Regla general:** vuelo al **este → advance** (buscar luz por la mañana en destino, evitarla por la noche); vuelo al **oeste → delay** (buscar luz por la tarde/noche, evitarla en la madrugada).
- **Caso extremo 10–12 husos:** cuando el advance requerido supera lo alcanzable, puede convenir **delay** (dar la vuelta al reloj); ~12 h son equivalentes por cualquier dirección. La zona ~9 h al este es la más difícil (ni se puede "ir hacia adelante" cómodamente ni beneficiarse de ir hacia atrás).
- **Tasa de adaptación:** sin intervención, ~1 h/día o menos; con luz + melatonina bien cronometradas, **3–4× más rápido** (~2–3 husos/día). Estimaciones de recuperación natural: ~1 día por huso al este, ~1 día por 1,5 husos al oeste.

#### 2.7 Modelo matemático de referencia (Kronauer-Jewett / van der Pol modificado)
> Estas ecuaciones **no** provienen de las patentes de Timeshifter (que no incluyen ningún oscilador). Provienen del modelo estándar de Harvard (Kronauer, Forger, Jewett) que sustenta toda esta literatura, tal como aparece transcrito en la patente **US9189739** (asignatario distinto de Timeshifter). Son el mejor punto de partida para un clon de alta fidelidad.

- Oscilador (par de variables x, xc):
  - ẋ = (π/12)·[ xc + μ·( ⅓x + (4/3)x³ − (256/105)x⁷ ) + B ]
  - ẋc = (π/12)·{ q·B·xc − [ (24/(τx·0.99729))² + k·B ]·x }
  - con **μ = 0.13, q = ⅓, τx = 24.2, k = 0.55**.
- Respuesta del ojo a la luz: **α = α0·(I/9500)^p**, con **α0 = 0.05, p = 0.5**, e I en lux.
- Filtro dinámico (fototransducción): **ṅ = 60·[α(1−n) − βn]**; **B = G·α·(1−n)·(1−mx)·(1−m·xc)**, con **β = 0.0075, G = 19.875**.
- CBTmin corresponde al mínimo de la variable de temperatura del modelo; el DLMO se deriva por offset (~CBTmin − 7 h).

**Modelos alternativos implementables:** Forger–Jewett–Kronauer (1999), "a simpler model of the human circadian pacemaker" (versión cúbica más ligera); St Hilaire/Klerman (añade un proceso no-fótico). **Repos open source de referencia:** el linaje `HCRSimPY`/`circadian` en Python y el trabajo de Olivia Walch, Kevin Hannay y Danny Forger (base de *Entrain* y de las apps de Arcascope).

### 3. ESPECIFICACIÓN TÉCNICA DEL MOTOR DE RECOMENDACIONES

#### 3.1 Entradas
`ChronotypeProfile` (MEQ/MCTQ score, bedtime, wakeTime, age, sex); toggles (`useMelatonin`, `useCaffeine`, `useNaps`, `preTravel`, `partialShift`); `Trip` (lista de `Segment` con origin/dest/tzOffset/departUTC/arriveUTC).

#### 3.2 Salidas
Lista ordenada de `Recommendation` (type, startLocal, endLocal, intensidad/dosis, texto explicativo) por día, materializable en notificaciones locales.

#### 3.3 Pseudocódigo del planner (reconstrucción)
```
phase0 = estimarFase(chronotype, bedtime, wakeTime)   # CBTmin, DLMO
delta  = tzDest - tzOrigin                            # husos con signo
direction = elegirDireccion(delta, chronotype)        # advance | delay
requiredShift = abs(normalizar(delta))                # 0..12 h
maxDaily = 1.5 (baseline) .. 3.0 (con intervención)   # h/día
nDays = ceil(requiredShift / maxDaily)

for d in [preTravel .. postArrival]:
    cbtmin_d = phase0.cbtmin + shiftAcumulado(d, direction, maxDaily)
    dlmo_d   = cbtmin_d - 7h
    if direction == advance:
        seekLight  = [cbtmin_d, cbtmin_d + 4h]        # zona advance
        avoidLight = [cbtmin_d - 6h, cbtmin_d]        # zona delay
        if useMelatonin: melatonin = dlmo_d - 3h  (0.5–3 mg)
    else: # delay
        seekLight  = [cbtmin_d - 6h, cbtmin_d]
        avoidLight = [cbtmin_d, cbtmin_d + 4h]
        if useMelatonin: melatonin = wakeTime_d   (delay)
    sleepWindow = derivarDe(cbtmin_d)                 # two-process
    if useCaffeine: caffeine = [wake, bedtime - 6h] "little&often" (20–25 mg/h)
    if useNaps: naps = programarNaps(processS, restricciones)
    aplicarPracticalityFilter(recos, restriccionesReales)
```

#### 3.4 Practicality filter (novedad central de la patente)
Elimina recomendaciones imposibles o difíciles de cumplir y las sustituye por alternativas con **efecto circadiano similar aunque moderado**. Ejemplo textual de la patente: si el ideal es dormir 4:00–11:00, propone dormir 2:00–9:00 y luego **evitar la luz 9:00–11:00**. Ancla el shift al máximo diario alcanzable (`maxDaily`).

#### 3.5 Quick Turnaround / partial shift
Si `requiredShift / maxDaily > díasDisponibles`, o si el viaje es demasiado corto para justificar un shift completo, el planner genera un **shift parcial** que minimiza síntomas manteniendo el reloj cercano a *home time*.

### 4. MODELO DE DATOS SUGERIDO
- **User** (id, prefs).
- **ChronotypeProfile** (userId, meqScore/mctqMSFsc, bedtime, wakeTime, age, sex).
- **Trip** (id, userId, type: oneway|roundtrip|multicity, quickTurnaround: bool).
- **Segment/Flight** (tripId, origin, dest, tzOffsetOrigin, tzOffsetDest, departUTC, arriveUTC, flightNo, layovers[]).
- **Plan** (tripId, direction, requiredShift, maxDaily, days[]).
- **Activity/Recommendation** (planId, type, startLocal, endLocal, payload{lux|dose_mg|napMin}, text).
- **Preferences** (useMelatonin, useCaffeine, useNaps, preTravel, pushEnabled).

### 5. ARQUITECTURA SUGERIDA
- **Offline-first:** el motor de cálculo corre en el cliente (cálculo determinista → reproducible sin red). El servidor solo persiste/sincroniza el perfil y sirve tablas de husos/DST actualizadas.
- **Notificaciones locales** programadas en el dispositivo (no requieren conectividad; funcionan en modo avión).
- **Cálculo local vs servidor:** el modelo de fase (reglas de PRC) es barato y cabe en el cliente; si se implementa el oscilador Kronauer-Jewett con integración numérica, considerar precomputar la trayectoria al crear/modificar el plan (único momento que la app real requiere internet).

### 6. CASOS BORDE
- **Escalas/layovers:** recalcular la fase estimada al final de cada segmento antes de programar actividades.
- **Cruce de la Línea Internacional de Cambio de Fecha:** normalizar `delta` a [−12, +12] h y elegir la dirección con menor coste de shift.
- **Viajes <48 h:** activar Quick Turnaround automáticamente (no adaptar del todo).
- **>12 husos:** evaluar delay en lugar de advance (dar la vuelta al reloj); tratar 8–10 husos al este como si fueran ~12 para el presupuesto de días.
- **DST** en origen o destino durante el viaje: aplicar el offset correcto por fecha.
- **Shift workers / social jet lag:** flujo distinto (turnos en vez de husos) → producto separado (app de shift work).
- **Vuelos nocturnos / tramos donde no se controla la luz de cabina:** el filtro de practicidad debe asumir exposición no controlable y compensar con gafas de sol/antifaz.

### 7. MÉTRICAS DE ÉXITO / KPIs
- **Eficacia autoinformada (benchmark de Timeshifter):** sobre **129.852 encuestas post-vuelo**, "96.4% of the travelers who followed Timeshifter's advice did not struggle with severe or very severe jet lag"; quienes no siguieron el consejo tuvieron un **aumento de 6,2× en jet lag severo/muy severo y de 14,1× en jet lag muy severo". *(Son datos de encuesta propia, con sesgo de autoselección; no un ensayo clínico revisado por pares.)*
- KPIs de producto para el clon: adherencia a notificaciones (% de actividades marcadas como cumplidas), retención por viaje, conversión free→paid, NPS post-viaje, y (si se añaden wearables) mejora objetiva de sueño/regularidad.

### 8. RIESGOS, DISCLAIMERS MÉDICOS Y REGULACIÓN
- **No es dispositivo médico:** "These statements have not been evaluated by the Food and Drug Administration"; solo para adultos sanos ≥18; no diagnostica ni trata enfermedades. Replicar disclaimers equivalentes.
- **Melatonina:** contraindicaciones (embarazo/lactancia, epilepsia o migrañas, uso de SSRIs/antidepresivos, warfarina, antecedentes psiquiátricos personales/familiares); no darla a niños; evitar alcohol y conducir/operar maquinaria en las 8 h posteriores; nunca tomarla por primera vez en el avión; en la UE la melatonina puede ser medicamento con receta (regulación distinta a EE. UU., donde es suplemento).
- **Cafeína:** advertir del riesgo de dependencia y de que mal cronometrada empeora el jet lag.
- **Sesgo de eficacia:** presentar los KPIs propios como autoinformados.
- **Privacidad/datos:** los datos de salud (sueño, cronotipo) exigen consentimiento y, según jurisdicción, cumplimiento GDPR/HIPAA si se integra con healthcare.

### 9. ROADMAP POR FASES
- **MVP:** onboarding (cronotipo + sueño), un roundtrip simple, motor de estimación de fase + PRC de luz + programación de sueño, notificaciones locales, modo offline.
- **V1:** melatonina + cafeína + naps con sus reglas; Practicality Filter; Quick Turnaround; multi-city y escalas; app de Apple Watch; textos educativos por recomendación.
- **V2:** integraciones con wearables (Oura/Whoop/Apple Health) — el gap real de Timeshifter; sincronización con calendario e itinerarios de aerolínea; migración del motor de reglas al oscilador Kronauer-Jewett para mayor precisión; modo shift work; dashboard B2B/white-label.

## Recommendations
1. **Construir primero el motor de estimación de fase + PRC de luz** (mayor ROI científico y suficiente para un MVP creíble). Empezar con reglas simples de PRC ancladas en CBTmin ≈ wake − 2 h; validar con casos conocidos (p. ej. NY→Tokio, 13 husos, debe recomendar advance/delay coherente y ~2–3 husos/día con intervención).
2. **Añadir el two-process model para sueño/naps** y dejar el oscilador Kronauer-Jewett (ecuaciones del §2.7) como upgrade de precisión en V2; no es necesario para el MVP.
3. **Diferenciarse con integraciones de wearables y scoring/gamificación**, que es la carencia más citada por los usuarios de Timeshifter.
4. **Regla de decisión operativa:** si `requiredShift/maxDaily > díasDisponibles` → activar partial shift / Quick Turnaround; si `|delta| > 10 h` → evaluar invertir la dirección (delay en vez de advance).
5. **Benchmarks que cambiarían el plan:** si la validación interna muestra error de fase >2 h con cuestionarios (rango observado ~4 h para un mismo MEQ), incorporar entrada de datos objetivos (actigrafía/wearable) antes de escalar; si la adherencia a notificaciones cae por debajo de ~50%, reforzar el Practicality Filter y simplificar el timeline.

## Caveats
- El algoritmo exacto de Timeshifter es **propietario y no divulgado**; esta reconstrucción combina literatura pública y los pocos números de sus patentes, y puede diferir en constantes concretas.
- Las ecuaciones del §2.7 provienen del modelo Kronauer-Jewett **según una patente de otro asignatario** (US9189739), no de Timeshifter; son el estándar de la disciplina, no una copia del código de Timeshifter.
- Las **magnitudes de PRC varían** según estudio, dosis, duración e intensidad; los valores citados (advance ~2 h, delay ~3,4 h con luz blanca 6.7 h) son de protocolos de laboratorio y no se trasladan 1:1 al mundo real.
- La vida media de la cafeína se ha reportado entre **3–5 h (cifra de la app)** y ~5–6 h (otras fuentes); varía mucho por genética (CYP1A2), tabaquismo y hormonas.
- Los **KPIs de eficacia de Timeshifter son autoinformados** (encuestas propias) y no equivalen a evidencia de ensayo clínico controlado.
- El esquema de cronotipos "lion/bear/wolf/dolphin" que aparece en algunas reseñas es un marco divulgativo (Breus); la base científica real es la dimensión morningness–eveningness — conviene no confundirlos al implementar el onboarding.