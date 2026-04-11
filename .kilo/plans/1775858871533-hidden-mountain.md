# Plan: Agregar traducciones del blog a los archivos de locale

## Problema
El blog.html tiene `data-i18n` en todos los elementos pero las claves (como `blog_home`, `blog_category`, `blog_title`, etc.) NO existen en los archivos de traducción.

El blog.js usa `loadTranslations()` de landing.js que carga `/locales/{lang}/translation.json`, pero faltan todas las claves del blog.

## Claves a agregar

```json
{
  "blog_page_title": "Stacking Sats - Flash",
  "blog_back": "← Volver al inicio",
  "blog_home": "Inicio",
  "blog_category": "Guía Práctica",
  "blog_article": "Artículo",
  "blog_read_time": "6 min de lectura",
  "blog_title": "Stacking Sats: ¿Cómo comprar Bitcoin simplemente desde Bénín, Togo o Costa de Marfil?",
  "blog_subtitle": "Aprende paso a paso cómo empezar a acumular Bitcoin con pequeñas cantidades y sin complicaciones en África Occidental.",
  "blog_what_are_sats": "¿Qué son los Satoshis?",
  "blog_sats_desc": "Antes de hablar de cómo comprar, es importante entender la unidad básica de Bitcoin. Un Satoshi (o "Sat") es la unidad más pequeña de Bitcoin. Un Bitcoin equivale a exactamente 100 millones de Satoshis (1 BTC = 100,000,000 sats).",
  "blog_sats_accessible": "Esto significa que no necesitas comprar un Bitcoin completo para empezar. Puedes comprar fracciones muy pequeñas, lo que hace que Bitcoin sea accesible para todos, independientemente de su poder adquisitivo.",
  "blog_did_you_know": "¿Sabías que...?",
  "blog_100fcfa": "Con solo 100 FCFA (menos de $0.17 USD) puedes comprar tus primeros Satoshis. No hay mínimo alto ni barreras de entrada.",
  "blog_why_save": "¿Por qué ahorrar en Bitcoin?",
  "blog_why_save_intro": "En África Occidental, donde las monedas locales pueden perder valor rápidamente y el acceso a servicios financieros es limitado, Bitcoin ofrece ventajas significativas:",
  "blog_accessibility": "Accesibilidad:",
  "blog_accessibility_desc": "Puedes empezar con montos tan pequeños como 100 FCFA. No necesitas cientos de dólares para invertir.",
  "blog_tontine": "Alternativa a la tontine:",
  "blog_tontine_desc": "La tradicional tontine (caja de ahorro comunitaria) requiere confiar en una persona o grupo. Con Bitcoin, tú controlas tu dinero directamente.",
  "blog_real_ownership": "Posesión real:",
  "blog_real_ownership_desc": "Tu Bitcoin está en tu billetera, no en un banco. Nadie puede congelarlo o confiscarlo sin tu consentimiento.",
  "blog_instant_transfers": "Transferencias instantáneas:",
  "blog_instant_transfers_desc": "Enviar Bitcoin a familiares en otro país es rápido y barato, especialmente con Lightning Network.",
  "blog_warning_title": "⚠️ Nota importante",
  "blog_warning_text": "Bitcoin es volátil. Su precio puede subir y bajar significativamente. Nunca inviertas más de lo que puedas permitirte perder. Este artículo es solo informativo, no es consejo financiero.",
  "blog_how_to_buy": "Cómo comprar Bitcoin en 5 pasos",
  "blog_steps_intro": "Flash facilita la compra de Bitcoin en África Occidental. Sigue estos 5 pasos para empezar:",
  "blog_step1_title": "Obtener una billetera Lightning",
  "blog_step1_desc": "Una billetera Bitcoin te permite recibir, almacenar y enviar Bitcoin. Para compras pequeñas y frecuentes, una billetera Lightning es ideal: rápida y con comisiones mínimas.",
  "blog_step2_title": "Crear una cuenta en Flash",
  "blog_step2_desc": "Regístrate en bitcoinflash.xyz con tu correo electrónico y número de teléfono. El proceso toma menos de 2 minutos y no requiere documentos para comenzar.",
  "blog_step3_title": "Preparar la recepción",
  "blog_step3_desc": "Abre tu billetera Lightning y copia tu dirección de recepción (empieza con "lnbc..." o similar). Esta dirección es única y te pertenecerá.",
  "blog_step4_title": "Comprar Sats en Flash",
  "blog_step4_desc": "Selecciona el monto que deseas comprar (desde 100 FCFA), ingresa tu dirección Lightning, y realiza el pago. Recibirás tus Bitcoin casi instantáneamente.",
  "blog_step5_title": "Vender o intercambiar",
  "blog_step5_desc": "Cuando quieras convertir tus Bitcoin de vuelta a FCFA o CFA, puedes hacerlo directamente en Flash. También puedes enviar Bitcoin a otras personas.",
  "blog_conclusion": "Conclusión",
  "blog_conclusion_p1": "Comenzar con Bitcoin nunca había sido tan fácil en África Occidental. Con Flash, puedes comprar tu primera fracción de Bitcoin en minutos y empezar a construir tu futuro financiero de forma independiente.",
  "blog_conclusion_p2": "Lo más importante es dar el primer paso. Empieza pequeño, aprende mientras avanzas, y descubre por qué millones de personas en todo el mundo están eligiendo Bitcoin como forma de ahorro.",
  "blog_resources": "Recursos útiles",
  "blog_bitcoin_guide": "Bitcoin.org - Guía para principiantes →",
  "blog_lightning_info": "Lightning Network - Cómo funciona →",
  "blog_flash_link": "Flash - Compra tu primer Bitcoin →",
  "blog_disclaimer": "Aviso legal:",
  "blog_disclaimer_text": "Este contenido es meramente informativo y no constituye asesoramiento financiero. Las inversiones en Bitcoin implican riesgos. Consulta siempre con un profesional financiero antes de tomar decisiones de inversión."
}
```

## Archivos a modificar

### 1. public/locales/es/translation.json
- Agregar todas las claves `blog_*` al final

### 2. public/locales/en/translation.json
- Agregar mismas claves traducidas al inglés

### 3. public/locales/fr/translation.json
- Agregar mismas claves traducidas al francés

### 4. public/locales/pt/translation.json
- Agregar mismas claves traducidas al portugués

## Nota
El blog.html en línea 185-186 usa `loadTranslations()` de landing.js, por lo que NO necesita modificar - solo hay que agregar las claves a los archivos JSON existentes.
