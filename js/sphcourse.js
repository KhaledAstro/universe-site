// Spherical astronomy course: theory, worked problems with step-by-step solutions, exercises.
// Original text and problems by Khaled Mohamed's program (style of a university course based on Smart's "Textbook on Spherical Astronomy").
// Every numerical answer is computed live from the inputs, so students can change the data and follow the same steps.
(function (root) {
'use strict';
const D = Math.PI / 180, R = 180 / Math.PI;
let lang = 'ar';
const S = (a, e) => lang === 'ar' ? a : e;
const sin = x => Math.sin(x * D), cos = x => Math.cos(x * D), tan = x => Math.tan(x * D);
const asin = x => Math.asin(Math.max(-1, Math.min(1, x))) * R, acos = x => Math.acos(Math.max(-1, Math.min(1, x))) * R, atan2 = (y, x) => Math.atan2(y, x) * R;
const n360 = x => ((x % 360) + 360) % 360;
const f = (x, d) => { const s = (+x).toFixed(d === undefined ? 4 : d); return s === '-0.0000' || /^-0\.?0*$/.test(s) ? s.replace('-', '') : s; };
// angle in TeX d m s
function dms(x, secDp) {
  const sg = x < 0 ? '-' : ''; x = Math.abs(x); const sd = secDp || 0;
  let d = Math.floor(x), m = Math.floor((x - d) * 60), s = ((x - d) * 60 - m) * 60;
  s = +s.toFixed(sd); if (s >= 60) { s -= 60; m++; } if (m >= 60) { m -= 60; d++; }
  return `${sg}${d}^\\circ\\,${String(m).padStart(2, '0')}'\\,${s.toFixed(sd).padStart(sd ? 3 + sd : 2, '0')}''`;
}
function hmsT(hours, secDp) {
  hours = ((hours % 24) + 24) % 24; const sd = secDp || 0;
  let h = Math.floor(hours), m = Math.floor((hours - h) * 60), s = ((hours - h) * 60 - m) * 60;
  s = +s.toFixed(sd); if (s >= 60) { s -= 60; m++; } if (m >= 60) { m -= 60; h = (h + 1) % 24; }
  return `${h}^{\\mathrm h}\\,${String(m).padStart(2, '0')}^{\\mathrm m}\\,${s.toFixed(sd).padStart(sd ? 3 + sd : 2, '0')}^{\\mathrm s}`;
}
const deg = (x, d) => `${f(x, d === undefined ? 4 : d)}^\\circ`;
const DM = (x) => `${deg(x)} = ${dms(x)}`;
const box = (s) => `\\boxed{${s}}`;

// ------------------------------------------------------------------ CHAPTERS (theory)
const CH = [
{ id: 'trig', icon: '🔺', t: ['المثلثات الكروية', 'Spherical trigonometry'],
  th: () => S(
`<p>على سطح كرة نصف قطرها 1 تكون «الدائرة العظمى» هي تقاطع الكرة مع مستوى يمر بمركزها، وهي أقصر طريق بين نقطتين على الكرة. و«المثلث الكروي» ثلاث نقاط تصل بينها أقواس من دوائر عظمى. <b>أضلاعه زوايا</b> (الزاوية التي يقابلها الضلع عند مركز الكرة)، وزواياه هي الزوايا بين المستويات. نرمز للزوايا A, B, C وللأضلاع المقابلة a, b, c، وكلها بين 0° و 180°.</p>
<h4>اشتقاق قانون جيب التمام (بالمتجهات)</h4>
<p>لتكن \\(\\hat{\\mathbf A},\\hat{\\mathbf B},\\hat{\\mathbf C}\\) متجهات الوحدة من المركز إلى الرؤوس. ضع المحور z على \\(\\hat{\\mathbf A}\\)، والضلعان AB, AC يصنعان مع المحور زاويتي c و b، والمستويان بينهما بزاوية A:</p>
\\[\\hat{\\mathbf B}=(\\sin c,\\,0,\\,\\cos c),\\qquad \\hat{\\mathbf C}=(\\sin b\\cos A,\\,\\sin b\\sin A,\\,\\cos b)\\]
<p>وبما أن \\(\\cos a=\\hat{\\mathbf B}\\cdot\\hat{\\mathbf C}\\):</p>
\\[\\boxed{\\cos a=\\cos b\\cos c+\\sin b\\sin c\\cos A}\\qquad\\text{(قانون جيب التمام)}\\]
<p>ومن الضرب الاتجاهي (أو بالحذف بين صيغ جيب التمام) نحصل على:</p>
\\[\\boxed{\\frac{\\sin A}{\\sin a}=\\frac{\\sin B}{\\sin b}=\\frac{\\sin C}{\\sin c}}\\qquad\\text{(قانون الجيوب)}\\]
\\[\\sin a\\cos B=\\cos b\\sin c-\\sin b\\cos c\\cos A\\qquad\\text{(الصيغة المناظرة لجيب التمام)}\\]
\\[\\cos a\\cos C=\\sin a\\cot b-\\sin C\\cot B\\qquad\\text{(صيغة الأجزاء الأربعة)}\\]
<p>تربط صيغة الأجزاء الأربعة أربعة عناصر متجاورة: ضلعين بينهما زاوية (a, C, b) والزاوية المقابلة للضلع الأبعد (B). وهي الأنسب حين نعرف ضلعين والزاوية المحصورة ونريد زاوية أخرى مباشرة.</p>
<h4>المثلث القطبي</h4>
<p>إذا أخذنا قطب كل ضلع (في جهة الرأس المقابل) نحصل على المثلث القطبي A′B′C′، حيث \\(a'=180^\\circ-A\\) و \\(A'=180^\\circ-a\\). بتطبيق قانون جيب التمام عليه نحصل على قانون جيب التمام للزوايا:</p>
\\[\\cos A=-\\cos B\\cos C+\\sin B\\sin C\\cos a\\]
<h4>الزيادة الكروية والمساحة</h4>
<p>مجموع زوايا المثلث الكروي أكبر من 180°: \\(E=A+B+C-180^\\circ\\) («الزيادة الكروية»)، والمساحة على كرة نصف قطرها r هي \\(\\mathcal A=E\\,r^2\\) (E بالراديان).</p>
<h4>المثلث القائم وقواعد نابير</h4>
<p>إذا كانت C = 90° نرتب الأجزاء الخمسة الباقية في دائرة: \\(a,\\; b,\\; 90^\\circ-A,\\; 90^\\circ-c,\\; 90^\\circ-B\\). عندئذ: <b>جيب الجزء الأوسط = حاصل ضرب ظلّي الجزأين المجاورين = حاصل ضرب جيبَي تمام الجزأين المقابلين</b>. مثلًا: \\(\\sin a=\\sin c\\sin A\\)، و \\(\\cos c=\\cos a\\cos b\\)، و \\(\\cos A=\\tan b\\cot c\\).</p>
<h4>المثلثات الصغيرة والصيغ التفاضلية</h4>
<p>بتفاضل قانون جيب التمام نحصل على أثر خطأ صغير في أحد العناصر على عنصر آخر، وهذا أساس تحليل أخطاء الرصد. مثلًا من \\(\\sin h=\\sin\\phi\\sin\\delta+\\cos\\phi\\cos\\delta\\cos H\\):</p>
\\[\\frac{\\partial h}{\\partial H}=\\cos\\phi\\,\\sin A,\\qquad \\frac{\\partial A}{\\partial H}=\\sin\\phi-\\cos\\phi\\tan h\\cos A\\]
<p>(السمت A مقيس من الشمال نحو الشرق، والزاوية الساعية H موجبة غربًا.)</p>`,
`<p>On a sphere of unit radius a <b>great circle</b> is the intersection with a plane through the centre; its arcs are the shortest paths on the sphere. A <b>spherical triangle</b> is formed by three great-circle arcs. <b>Its sides are angles</b> (subtended at the centre) and its angles are the angles between the planes. We write A, B, C for the angles and a, b, c for the opposite sides, all between 0° and 180°.</p>
<h4>The cosine formula (vector proof)</h4>
<p>Let \\(\\hat{\\mathbf A},\\hat{\\mathbf B},\\hat{\\mathbf C}\\) be unit vectors from the centre. Put the z-axis along \\(\\hat{\\mathbf A}\\); sides AB, AC make angles c and b with it and their planes meet at angle A:</p>
\\[\\hat{\\mathbf B}=(\\sin c,\\,0,\\,\\cos c),\\qquad \\hat{\\mathbf C}=(\\sin b\\cos A,\\,\\sin b\\sin A,\\,\\cos b)\\]
<p>Since \\(\\cos a=\\hat{\\mathbf B}\\cdot\\hat{\\mathbf C}\\):</p>
\\[\\boxed{\\cos a=\\cos b\\cos c+\\sin b\\sin c\\cos A}\\qquad\\text{(cosine formula)}\\]
<p>The cross product (or elimination between cosine formulae) gives</p>
\\[\\boxed{\\frac{\\sin A}{\\sin a}=\\frac{\\sin B}{\\sin b}=\\frac{\\sin C}{\\sin c}}\\qquad\\text{(sine formula)}\\]
\\[\\sin a\\cos B=\\cos b\\sin c-\\sin b\\cos c\\cos A\\qquad\\text{(analogue of the cosine formula)}\\]
\\[\\cos a\\cos C=\\sin a\\cot b-\\sin C\\cot B\\qquad\\text{(four-parts formula)}\\]
<p>The four-parts formula links four consecutive elements — two sides with their included angle (a, C, b) and the angle opposite the outer side (B). It is the right tool when two sides and the included angle are known and another angle is wanted directly.</p>
<h4>The polar triangle</h4>
<p>Taking the pole of each side (on the side of the opposite vertex) gives the polar triangle A′B′C′, with \\(a'=180^\\circ-A\\), \\(A'=180^\\circ-a\\). Applying the cosine formula to it gives the cosine formula for angles:</p>
\\[\\cos A=-\\cos B\\cos C+\\sin B\\sin C\\cos a\\]
<h4>Spherical excess and area</h4>
<p>The angles sum to more than 180°: \\(E=A+B+C-180^\\circ\\) (spherical excess), and the area on a sphere of radius r is \\(\\mathcal A=E\\,r^2\\) (E in radians).</p>
<h4>Right-angled triangles: Napier’s rules</h4>
<p>With C = 90°, arrange the other five parts in a circle: \\(a,\\; b,\\; 90^\\circ-A,\\; 90^\\circ-c,\\; 90^\\circ-B\\). Then <b>sine of the middle part = product of tangents of the adjacent parts = product of cosines of the opposite parts</b>. E.g. \\(\\sin a=\\sin c\\sin A\\), \\(\\cos c=\\cos a\\cos b\\), \\(\\cos A=\\tan b\\cot c\\).</p>
<h4>Small triangles and differential formulae</h4>
<p>Differentiating the cosine formula shows how a small error in one element affects another — the basis of error analysis in observation. From \\(\\sin h=\\sin\\phi\\sin\\delta+\\cos\\phi\\cos\\delta\\cos H\\):</p>
\\[\\frac{\\partial h}{\\partial H}=\\cos\\phi\\,\\sin A,\\qquad \\frac{\\partial A}{\\partial H}=\\sin\\phi-\\cos\\phi\\tan h\\cos A\\]
<p>(Azimuth A measured from north through east; hour angle H positive westwards.)</p>`) },
{ id: 'coord', icon: '🧭', t: ['أنظمة الإحداثيات والتحويل بينها', 'Coordinate systems and transformations'],
  th: () => S(
`<p>لكل نظام إحداثيات دائرة أساسية وقطب ونقطة بداية:</p>
<ul><li><b>الأفقي:</b> الأفق، والسمت Z؛ الإحداثيان: الارتفاع h (أو المسافة السمتية z = 90° − h) والسمت A (من الشمال نحو الشرق).</li>
<li><b>الاستوائي الساعي:</b> الاستواء السماوي، والقطب P؛ الإحداثيان: الميل δ والزاوية الساعية H (موجبة غربًا من خط الزوال). يتغير H مع الوقت.</li>
<li><b>الاستوائي:</b> الميل δ والمطلع المستقيم α من نقطة الاعتدال الربيعي ♈ شرقًا. ويرتبطان بالزمن النجمي المحلي: \\(H=\\text{LST}-\\alpha\\).</li>
<li><b>البروجي:</b> دائرة البروج، وقطبها K؛ الطول λ والعرض β. ميل البروج \\(\\varepsilon\\approx 23^\\circ 26'\\).</li>
<li><b>المجري:</b> مستوى المجرة، الطول l والعرض b.</li></ul>
<h4>القاعدة الذهبية: مثلث لكل تحويل</h4>
<p>كل تحويل هو حل لمثلث كروي رأساه قطبا النظامين والثالث هو الجرم X:</p>
<ul><li>أفقي ↔ استوائي: المثلث PZX، أضلاعه \\(90^\\circ-\\phi,\\;90^\\circ-\\delta,\\;z\\) وزواياه H عند P، و A (أو \\(360^\\circ-A\\)) عند Z، و q عند X.</li>
<li>استوائي ↔ بروجي: المثلث PKX، حيث PK = ε، و PX = 90° − δ، و KX = 90° − β، والزاوية عند P = 90° + α، وعند K = 90° − λ.</li></ul>
\\[\\sin h=\\sin\\phi\\sin\\delta+\\cos\\phi\\cos\\delta\\cos H,\\qquad \\tan A=\\frac{-\\cos\\delta\\sin H}{\\sin\\delta\\cos\\phi-\\cos\\delta\\cos H\\sin\\phi}\\]
\\[\\sin\\beta=\\sin\\delta\\cos\\varepsilon-\\cos\\delta\\sin\\varepsilon\\sin\\alpha,\\qquad \\tan\\lambda=\\frac{\\sin\\alpha\\cos\\varepsilon+\\tan\\delta\\sin\\varepsilon}{\\cos\\alpha}\\]
<p><b>تنبيه مهم:</b> عند حساب زاوية من جيبها يوجد احتمالان (x أو 180° − x)، ومن جيب تمامها احتمالان (±x). لذلك نحسب الزاوية دائمًا بدالة \\(\\operatorname{atan2}\\) من البسط والمقام بإشارتيهما، أو نتحقق من الربع بصيغة ثانية.</p>
<p><b>بالمصفوفات</b> (الطريقة الحديثة): متجه الوحدة \\(\\mathbf r=(\\cos\\delta\\cos\\alpha,\\cos\\delta\\sin\\alpha,\\sin\\delta)\\)، والتحويل بين نظامين دوران: \\(\\mathbf r_{\\text{ecl}}=R_x(\\varepsilon)\\,\\mathbf r_{\\text{eq}}\\). والنتيجة مطابقة لحل المثلث.</p>`,
`<p>Each coordinate system has a fundamental circle, a pole and an origin:</p>
<ul><li><b>Horizontal:</b> horizon, zenith Z; altitude h (or zenith distance z = 90° − h) and azimuth A (from north through east).</li>
<li><b>Hour-angle equatorial:</b> celestial equator, pole P; declination δ and hour angle H (positive westwards from the meridian). H changes with time.</li>
<li><b>Equatorial:</b> δ and right ascension α measured eastwards from the vernal equinox ♈; linked to local sidereal time by \\(H=\\text{LST}-\\alpha\\).</li>
<li><b>Ecliptic:</b> ecliptic, pole K; longitude λ, latitude β; obliquity \\(\\varepsilon\\approx 23^\\circ 26'\\).</li>
<li><b>Galactic:</b> galactic plane; l and b.</li></ul>
<h4>The golden rule: one triangle per transformation</h4>
<p>Every transformation solves a spherical triangle whose vertices are the two poles and the object X:</p>
<ul><li>horizontal ↔ equatorial: triangle PZX with sides \\(90^\\circ-\\phi,\\;90^\\circ-\\delta,\\;z\\) and angles H at P, A (or \\(360^\\circ-A\\)) at Z, q at X;</li>
<li>equatorial ↔ ecliptic: triangle PKX with PK = ε, PX = 90° − δ, KX = 90° − β, angle at P = 90° + α, at K = 90° − λ.</li></ul>
\\[\\sin h=\\sin\\phi\\sin\\delta+\\cos\\phi\\cos\\delta\\cos H,\\qquad \\tan A=\\frac{-\\cos\\delta\\sin H}{\\sin\\delta\\cos\\phi-\\cos\\delta\\cos H\\sin\\phi}\\]
\\[\\sin\\beta=\\sin\\delta\\cos\\varepsilon-\\cos\\delta\\sin\\varepsilon\\sin\\alpha,\\qquad \\tan\\lambda=\\frac{\\sin\\alpha\\cos\\varepsilon+\\tan\\delta\\sin\\varepsilon}{\\cos\\alpha}\\]
<p><b>Important:</b> an angle found from its sine is ambiguous (x or 180° − x), and from its cosine (±x). Always compute angles with \\(\\operatorname{atan2}\\) using the signs of numerator and denominator, or check the quadrant with a second formula.</p>
<p><b>With matrices</b> (the modern way): the unit vector \\(\\mathbf r=(\\cos\\delta\\cos\\alpha,\\cos\\delta\\sin\\alpha,\\sin\\delta)\\) is rotated between systems, e.g. \\(\\mathbf r_{\\text{ecl}}=R_x(\\varepsilon)\\,\\mathbf r_{\\text{eq}}\\) — identical to solving the triangle.</p>`) },
{ id: 'diurnal', icon: '🌗', t: ['الحركة اليومية: الشروق والعبور والغروب', 'Diurnal motion: rising, culmination, setting'],
  th: () => S(
`<p>بسبب دوران الأرض يرسم كل نجم دائرة صغيرة موازية للاستواء (دائرة الميل الثابت δ). أهم الحالات الخاصة للمثلث PZX:</p>
<ul><li><b>العبور (التوسط):</b> H = 0 (العلوي) أو H = 12ʰ (السفلي):
\\[h_{\\text{upper}}=90^\\circ-|\\phi-\\delta|,\\qquad h_{\\text{lower}}=\\phi+\\delta-90^\\circ\\ \\ (\\phi>0)\\]
والنجم حول قطبي (لا يغرب) إذا كان \\(\\delta>90^\\circ-\\phi\\)، ولا يشرق إذا كان \\(\\delta<-(90^\\circ-\\phi)\\).</li>
<li><b>الشروق والغروب:</b> نضع \\(h=h_0\\) (للنجوم \\(h_0=-34'\\) بسبب الانكسار، وللشمس \\(-50'\\)، وللقمر \\(+0.7275\\,\\pi-34'\\)):
\\[\\cos H_0=\\frac{\\sin h_0-\\sin\\phi\\sin\\delta}{\\cos\\phi\\cos\\delta}\\xrightarrow{h_0=0}\\cos H_0=-\\tan\\phi\\tan\\delta\\]
وسمت الشروق (من الشمال): \\(\\cos A_r=\\dfrac{\\sin\\delta-\\sin\\phi\\sin h_0}{\\cos\\phi\\cos h_0}\\)، و«سعة الشروق» \\(90^\\circ-A_r\\).</li>
<li><b>العبور بالدائرة الرأسية الأولى</b> (شرق أو غرب تمامًا، A = 90° أو 270°): الزاوية عند Z قائمة، وبقواعد نابير:
\\[\\cos H=\\frac{\\tan\\delta}{\\tan\\phi},\\qquad \\sin h=\\frac{\\sin\\delta}{\\sin\\phi}\\]
ويحدث فقط إذا كان \\(0<\\delta<\\phi\\) (في نصف الكرة الشمالي).</li>
<li><b>أقصى سمت (الاستطالة)</b> لنجم حول قطبي: الزاوية عند X قائمة:
\\[\\sin A_{\\max}=\\frac{\\cos\\delta}{\\cos\\phi},\\qquad \\cos H=\\frac{\\tan\\phi}{\\tan\\delta},\\qquad \\sin h=\\frac{\\sin\\phi}{\\sin\\delta}\\]
وهي اللحظة المثلى لتحديد الشمال الحقيقي بالجدي، لأن السمت يكاد لا يتغير حولها.</li>
<li><b>معدلات التغير:</b> \\(\\dfrac{dh}{dt}=15\\cos\\phi\\sin A\\) ثانية قوسية لكل ثانية زمنية، وهو أقصى ما يكون على الدائرة الرأسية الأولى؛ لذلك تُرصد النجوم هناك لتعيين الزمن، وعند خط الزوال لتعيين العرض (لأن h ثابت تقريبًا).</li></ul>`,
`<p>Because Earth rotates, each star describes a small circle parallel to the equator (constant δ). The key special cases of triangle PZX:</p>
<ul><li><b>Culmination:</b> H = 0 (upper) or H = 12ʰ (lower):
\\[h_{\\text{upper}}=90^\\circ-|\\phi-\\delta|,\\qquad h_{\\text{lower}}=\\phi+\\delta-90^\\circ\\ \\ (\\phi>0)\\]
A star is circumpolar if \\(\\delta>90^\\circ-\\phi\\) and never rises if \\(\\delta<-(90^\\circ-\\phi)\\).</li>
<li><b>Rising and setting:</b> put \\(h=h_0\\) (stars \\(h_0=-34'\\) for refraction; Sun \\(-50'\\); Moon \\(+0.7275\\,\\pi-34'\\)):
\\[\\cos H_0=\\frac{\\sin h_0-\\sin\\phi\\sin\\delta}{\\cos\\phi\\cos\\delta}\\xrightarrow{h_0=0}\\cos H_0=-\\tan\\phi\\tan\\delta\\]
Rising azimuth (from north): \\(\\cos A_r=\\dfrac{\\sin\\delta-\\sin\\phi\\sin h_0}{\\cos\\phi\\cos h_0}\\); the amplitude is \\(90^\\circ-A_r\\).</li>
<li><b>Prime-vertical transit</b> (due east or west, A = 90° or 270°): right angle at Z; by Napier’s rules
\\[\\cos H=\\frac{\\tan\\delta}{\\tan\\phi},\\qquad \\sin h=\\frac{\\sin\\delta}{\\sin\\phi}\\]
which happens only if \\(0<\\delta<\\phi\\) (northern hemisphere).</li>
<li><b>Maximum azimuth (elongation)</b> of a circumpolar star: right angle at X:
\\[\\sin A_{\\max}=\\frac{\\cos\\delta}{\\cos\\phi},\\qquad \\cos H=\\frac{\\tan\\phi}{\\tan\\delta},\\qquad \\sin h=\\frac{\\sin\\phi}{\\sin\\delta}\\]
the best moment to fix true north with Polaris, since the azimuth hardly changes there.</li>
<li><b>Rates:</b> \\(\\dfrac{dh}{dt}=15\\cos\\phi\\sin A\\) arcsec per second of time, largest on the prime vertical — so stars are observed there to determine time, and on the meridian to determine latitude (where h is stationary).</li></ul>`) },
{ id: 'refr', icon: '🌫️', t: ['الانكسار الجوي', 'Atmospheric refraction'],
  th: () => S(
`<p>يرفع الغلاف الجوي صورة الجرم نحو السمت؛ فالمسافة السمتية الظاهرة \\(z'\\) أصغر من الحقيقية z: \\(z=z'+R\\). في نموذج الطبقات المستوية (قانون سنل عند كل طبقة) يكون \\(n_0\\sin z'=\\sin z\\)، ومنه للزوايا غير القريبة من الأفق:</p>
\\[R\\simeq (n_0-1)\\tan z'\\approx 58.3''\\tan z'-0.067''\\tan^3 z'\\]
<p>ويصحَّح للضغط P (هكتوباسكال) ودرجة الحرارة T (°C) بالمعامل \\(\\dfrac{P}{1010}\\cdot\\dfrac{283}{273+T}\\). قرب الأفق تفشل هذه الصيغة، ونستخدم صيغة تجريبية مثل صيغة بينيت (Bennett 1982) للارتفاع الظاهر h′ بالدرجات:</p>
\\[R=\\cot\\!\\left(h'+\\frac{7.31}{h'+4.4}\\right)\\ \\text{دقيقة قوسية}\\qquad (R\\approx 34'\\ \\text{عند الأفق})\\]
<p>نتائج مهمة: (1) يرى الراصد قرص الشمس كله فوق الأفق بينما هو هندسيًا تحته؛ (2) يطول النهار عدة دقائق؛ (3) يبدو قرص الشمس الغاربة مفلطحًا لأن الانكسار عند حافته السفلى أكبر منه عند العليا؛ (4) يؤثر الانكسار على α و δ عبر الزاوية الاختلافية q: \\(\\Delta\\delta\\approx R\\cos q\\)، \\(\\Delta\\alpha\\cos\\delta\\approx R\\sin q\\).</p>`,
`<p>The atmosphere lifts the image towards the zenith: the apparent zenith distance \\(z'\\) is smaller than the true z, \\(z=z'+R\\). In a plane-parallel model (Snell’s law at each layer) \\(n_0\\sin z'=\\sin z\\), hence away from the horizon</p>
\\[R\\simeq (n_0-1)\\tan z'\\approx 58.3''\\tan z'-0.067''\\tan^3 z'\\]
<p>corrected for pressure P (hPa) and temperature T (°C) by the factor \\(\\dfrac{P}{1010}\\cdot\\dfrac{283}{273+T}\\). Near the horizon this fails and an empirical formula is used, e.g. Bennett (1982) for apparent altitude h′ in degrees:</p>
\\[R=\\cot\\!\\left(h'+\\frac{7.31}{h'+4.4}\\right)\\ \\text{arcmin}\\qquad (R\\approx 34'\\ \\text{at the horizon})\\]
<p>Consequences: (1) the whole solar disc is seen above the horizon while it is geometrically below; (2) the day is lengthened by several minutes; (3) the setting Sun looks flattened because refraction is larger at its lower limb; (4) refraction shifts α and δ through the parallactic angle q: \\(\\Delta\\delta\\approx R\\cos q\\), \\(\\Delta\\alpha\\cos\\delta\\approx R\\sin q\\).</p>`) },
{ id: 'twi', icon: '🌅', t: ['الشفق', 'Twilight'],
  th: () => S(
`<p>يبدأ الشفق المسائي بغروب الشمس وينتهي عندما تنخفض تحت الأفق إلى: 6° (مدني)، أو 12° (بحري)، أو 18° (فلكي، حيث تبلغ السماء أقصى ظلمة). مدته هي الفرق بين زاويتين ساعيتين:</p>
\\[T=\\frac{H(-18^\\circ)-H(h_0)}{15^\\circ/\\text{h}},\\qquad \\cos H(h)=\\frac{\\sin h-\\sin\\phi\\sin\\delta}{\\cos\\phi\\cos\\delta}\\]
<p><b>أقصر شفق</b> (مسألة كلاسيكية): بين الأفق الهندسي (h = 0) وانخفاض D، تكون المدة أقصر ما يمكن عندما</p>
\\[\\sin\\delta=-\\sin\\phi\\tan\\tfrac{D}{2},\\qquad \\sin\\tfrac{T_{\\min}}{2}=\\frac{\\sin(D/2)}{\\cos\\phi}\\]
<p>(T هنا زاوية تُقسم على 15° لتصير ساعات). البرهان: نفاضل T بالنسبة إلى δ ونضع المشتقة صفرًا؛ ويمكن أيضًا بهندسة المثلثين PZX₁ و PZX₂ المتساويين في PX.</p>
<p><b>الليالي البيضاء:</b> لا ينتهي الشفق الفلكي طوال الليل إذا كان الارتفاع عند العبور السفلي أكبر من −18°، أي \\(\\phi+\\delta-90^\\circ>-18^\\circ\\). في الانقلاب الصيفي (δ = +23.44°) يحدث هذا عند \\(\\phi>48.56^\\circ\\).</p>`,
`<p>Evening twilight begins at sunset and ends when the Sun is 6° (civil), 12° (nautical) or 18° (astronomical, darkest sky) below the horizon. Its duration is a difference of hour angles:</p>
\\[T=\\frac{H(-18^\\circ)-H(h_0)}{15^\\circ/\\text{h}},\\qquad \\cos H(h)=\\frac{\\sin h-\\sin\\phi\\sin\\delta}{\\cos\\phi\\cos\\delta}\\]
<p><b>Shortest twilight</b> (a classic problem): between the geometric horizon (h = 0) and depression D the duration is minimum when</p>
\\[\\sin\\delta=-\\sin\\phi\\tan\\tfrac{D}{2},\\qquad \\sin\\tfrac{T_{\\min}}{2}=\\frac{\\sin(D/2)}{\\cos\\phi}\\]
<p>(T as an angle, divided by 15° to get hours). Proof: differentiate T with respect to δ and set it to zero, or use the geometry of triangles PZX₁ and PZX₂, which share PX.</p>
<p><b>White nights:</b> astronomical twilight lasts all night if the Sun’s lower-culmination altitude stays above −18°, i.e. \\(\\phi+\\delta-90^\\circ>-18^\\circ\\). At the June solstice (δ = +23.44°) this happens for \\(\\phi>48.56^\\circ\\).</p>`) },
{ id: 'time', icon: '⏱️', t: ['الزمن: النجمي والشمسي ومعادلة الزمن', 'Time: sidereal, solar and the equation of time'],
  th: () => S(
`<p><b>الزمن النجمي المحلي</b> هو الزاوية الساعية لنقطة الاعتدال الربيعي: \\(\\text{LST}=H+\\alpha\\). ولغرينتش في لحظة UT (Meeus 12.4، والزمن بالأيام الجوليانية من J2000):</p>
\\[\\theta_0=280.46061837^\\circ+360.98564736629^\\circ\\,(JD-2451545.0)+0.000387933\\,T^2-\\frac{T^3}{38710000}\\]
\\[\\text{LST}=\\theta_0+\\lambda_{\\text{East}}\\]
<p>اليوم النجمي أقصر من الشمسي المتوسط لأن الأرض تقطع نحو 1° من مدارها كل يوم، فتحتاج الشمس دورانًا إضافيًا: </p>
\\[1\\ \\text{يوم شمسي متوسط}=1.00273790935\\ \\text{يوم نجمي},\\qquad 1\\ \\text{يوم نجمي}=23^{\\mathrm h}\\,56^{\\mathrm m}\\,04.0905^{\\mathrm s}\\]
<p><b>معادلة الزمن</b> هي الفرق بين الزمن الشمسي الظاهري (الساعة الشمسية) والمتوسط: \\(E=H_{\\odot}-H_{\\text{mean}}=\\alpha_{\\text{mean}}-\\alpha_{\\odot}\\). سببها اثنان: إهليلجية المدار (قانون كبلر الثاني) وميل البروج (إسقاط حركة منتظمة في البروج على الاستواء). وتقريبًا:</p>
\\[E\\approx -7.66^{\\mathrm m}\\sin M+9.87^{\\mathrm m}\\sin(2L)\\ \\ (\\text{تقريب أولي})\\]
<p>والظهر الحقيقي عند خط طول λ وبتوقيت منطقة خط طولها \\(\\lambda_z\\): \\(t_{\\text{noon}}=12^{\\mathrm h}-E+\\dfrac{\\lambda_z-\\lambda}{15}\\).</p>`,
`<p><b>Local sidereal time</b> is the hour angle of the vernal equinox: \\(\\text{LST}=H+\\alpha\\). For Greenwich at instant UT (Meeus 12.4; JD from J2000):</p>
\\[\\theta_0=280.46061837^\\circ+360.98564736629^\\circ\\,(JD-2451545.0)+0.000387933\\,T^2-\\frac{T^3}{38710000}\\]
\\[\\text{LST}=\\theta_0+\\lambda_{\\text{East}}\\]
<p>The sidereal day is shorter than the mean solar day because Earth moves about 1° along its orbit each day, so the Sun needs extra rotation:</p>
\\[1\\ \\text{mean solar day}=1.00273790935\\ \\text{sidereal days},\\qquad 1\\ \\text{sidereal day}=23^{\\mathrm h}\\,56^{\\mathrm m}\\,04.0905^{\\mathrm s}\\]
<p>The <b>equation of time</b> is apparent minus mean solar time: \\(E=H_{\\odot}-H_{\\text{mean}}=\\alpha_{\\text{mean}}-\\alpha_{\\odot}\\). It has two causes: the orbital eccentricity (Kepler’s second law) and the obliquity (uniform motion along the ecliptic projected onto the equator). To first order:</p>
\\[E\\approx -7.66^{\\mathrm m}\\sin M+9.87^{\\mathrm m}\\sin(2L)\\]
<p>True noon at longitude λ, in a time zone of meridian \\(\\lambda_z\\): \\(t_{\\text{noon}}=12^{\\mathrm h}-E+\\dfrac{\\lambda_z-\\lambda}{15}\\).</p>`) },
{ id: 'kepler', icon: '🪐', t: ['المدارات ومعادلة كبلر', 'Orbits and Kepler’s equation'],
  th: () => S(
`<p>في مدار إهليلجي نصف محوره a واختلافه المركزي e نعرّف ثلاثة «شذوذات»: <b>المتوسط</b> M (يزداد بانتظام: \\(M=n(t-\\tau)\\)، \\(n=360^\\circ/P\\))، و<b>اللامركزي</b> E (زاوية على الدائرة المساعدة)، و<b>الحقيقي</b> ν (الزاوية الفعلية عند البؤرة). العلاقات:</p>
\\[M=E-e\\sin E\\ \\ (E\\ \\text{بالراديان}),\\qquad \\tan\\frac{\\nu}{2}=\\sqrt{\\frac{1+e}{1-e}}\\tan\\frac{E}{2},\\qquad r=a(1-e\\cos E)\\]
<p>تُحل معادلة كبلر بالتكرار (نيوتن): \\(E_{k+1}=E_k-\\dfrac{E_k-e\\sin E_k-M}{1-e\\cos E_k}\\). ولقيم e الصغيرة تفيد «معادلة المركز»:</p>
\\[\\nu-M=2e\\sin M+\\tfrac54 e^2\\sin 2M+e^3\\!\\left(\\tfrac{13}{12}\\sin 3M-\\tfrac14\\sin M\\right)+\\dots\\ \\ (\\text{راديان})\\]
<p>من المدار إلى السماء: الإحداثيات الشمسية المركز للكوكب في مستوى مداره \\((r\\cos\\nu,\\,r\\sin\\nu)\\)، ثم تدور بعناصره (Ω, i, ω) إلى نظام البروج، ثم نطرح موضع الأرض لنحصل على الإحداثيات الأرضية المركز.</p>`,
`<p>For an ellipse of semi-major axis a and eccentricity e we define three anomalies: the <b>mean</b> anomaly M (uniform: \\(M=n(t-\\tau)\\), \\(n=360^\\circ/P\\)), the <b>eccentric</b> anomaly E (on the auxiliary circle) and the <b>true</b> anomaly ν (the real angle at the focus):</p>
\\[M=E-e\\sin E\\ \\ (E\\ \\text{in radians}),\\qquad \\tan\\frac{\\nu}{2}=\\sqrt{\\frac{1+e}{1-e}}\\tan\\frac{E}{2},\\qquad r=a(1-e\\cos E)\\]
<p>Kepler’s equation is solved iteratively (Newton): \\(E_{k+1}=E_k-\\dfrac{E_k-e\\sin E_k-M}{1-e\\cos E_k}\\). For small e the equation of the centre is useful:</p>
\\[\\nu-M=2e\\sin M+\\tfrac54 e^2\\sin 2M+e^3\\!\\left(\\tfrac{13}{12}\\sin 3M-\\tfrac14\\sin M\\right)+\\dots\\ \\ (\\text{rad})\\]
<p>From orbit to sky: heliocentric coordinates in the orbital plane \\((r\\cos\\nu,\\,r\\sin\\nu)\\) are rotated by the elements (Ω, i, ω) into the ecliptic frame, then Earth’s position is subtracted to get geocentric coordinates.</p>`) },
{ id: 'planet', icon: '♂️', t: ['ظواهر الكواكب', 'Planetary phenomena'],
  th: () => S(
`<p><b>الدورة الاقترانية</b> S (بين اقترانين متتاليين كما يُرى من الأرض) من الدورتين النجميتين للكوكب P والأرض E:</p>
\\[\\frac1S=\\left|\\frac1P-\\frac1E\\right|\\]
<p><b>أعظم استطالة</b> لكوكب داخلي في مدار دائري نصف قطره a (وحدة فلكية): خط النظر مماس للمدار، فالزاوية عند الكوكب قائمة: \\(\\sin\\varepsilon_{\\max}=a\\).</p>
<p><b>نقاط التوقف والحركة التراجعية</b> (مداران دائريان في مستوى واحد، نصفا قطريهما 1 و b، والسرعة \\(\\propto r^{-1/2}\\)): يتوقف الكوكب ظاهريًا عندما تكون مركبتا سرعتي الأرض والكوكب العموديتان على خط النظر متساويتين. ينتج أن الزاوية θ بين الكوكبين كما تُرى من الشمس تحقق</p>
\\[\\cos\\theta=\\frac{\\sqrt b}{1+b-\\sqrt b}\\]
<p>وبعدها نحسب الزمن من المقابلة \\(t=\\theta/(n_E-n_P)\\)، والاستطالة من مثلث الشمس–الأرض–الكوكب.</p>`,
`<p>The <b>synodic period</b> S (between successive conjunctions as seen from Earth) from the sidereal periods of the planet P and Earth E:</p>
\\[\\frac1S=\\left|\\frac1P-\\frac1E\\right|\\]
<p><b>Greatest elongation</b> of an inner planet on a circular orbit of radius a (AU): the line of sight is tangent to the orbit, so the angle at the planet is 90°: \\(\\sin\\varepsilon_{\\max}=a\\).</p>
<p><b>Stationary points and retrograde motion</b> (coplanar circular orbits of radii 1 and b, speed \\(\\propto r^{-1/2}\\)): the planet appears stationary when the components of Earth’s and the planet’s velocities perpendicular to the line of sight are equal. The heliocentric angle θ between the two planets then satisfies</p>
\\[\\cos\\theta=\\frac{\\sqrt b}{1+b-\\sqrt b}\\]
<p>The time from opposition is \\(t=\\theta/(n_E-n_P)\\), and the elongation follows from the Sun–Earth–planet triangle.</p>`) },
{ id: 'parallax', icon: '📐', t: ['اختلاف المنظر', 'Parallax'],
  th: () => S(
`<p><b>اختلاف المنظر اليومي (الأرضي)</b>: نرصد من سطح الأرض لا من مركزها، فيبدو الجرم القريب أخفض. إذا كان \\(\\pi\\) اختلاف المنظر الأفقي (\\(\\sin\\pi=R_\\oplus/d\\)) فإن الإزاحة في الارتفاع</p>
\\[\\sin p=\\sin\\pi\\cos h'\\ \\ \\Rightarrow\\ \\ h_{\\text{geo}}=h'+p\\]
<p>وهي كبيرة للقمر (\\(\\pi\\approx 57'\\)) ومهمة لرؤية الهلال والكسوف، وصغيرة للشمس (\\(8.794''\\)). وللدقة نستخدم العرض المركزي الأرضي \\(\\phi'\\approx\\phi-11.55'\\sin2\\phi\\) وبُعد الراصد عن المركز ρ.</p>
<p><b>اختلاف المنظر السنوي</b>: بسبب دوران الأرض حول الشمس يرسم النجم القريب قطعًا ناقصًا نصف محوره الأكبر ϖ (اختلاف المنظر)، والمسافة \\(d\\,[\\text{pc}]=1/\\varpi\\,[''] \\). وتقيسه بعثة جايا بدقة أجزاء من الألف من الثانية القوسية حتى لأبعد من 10 كيلوفرسك أحيانًا.</p>`,
`<p><b>Diurnal (geocentric) parallax</b>: we observe from Earth’s surface, not its centre, so a nearby body appears lower. With horizontal parallax \\(\\pi\\) (\\(\\sin\\pi=R_\\oplus/d\\)) the displacement in altitude is</p>
\\[\\sin p=\\sin\\pi\\cos h'\\ \\ \\Rightarrow\\ \\ h_{\\text{geo}}=h'+p\\]
<p>large for the Moon (\\(\\pi\\approx 57'\\)) and essential for crescent visibility and eclipses, small for the Sun (\\(8.794''\\)). Precisely, use the geocentric latitude \\(\\phi'\\approx\\phi-11.55'\\sin2\\phi\\) and the observer’s distance ρ from the centre.</p>
<p><b>Annual parallax</b>: as Earth orbits the Sun a nearby star traces an ellipse of semi-major axis ϖ, and \\(d\\,[\\text{pc}]=1/\\varpi\\,['']\\). Gaia measures it to tens of micro-arcseconds.</p>`) },
{ id: 'aberr', icon: '🏃', t: ['الزيغان', 'Aberration'],
  th: () => S(
`<p>بسبب سرعة الراصد v يميل اتجاه الضوء الظاهري نحو جهة الحركة (كالمطر على راكب يجري). الزاوية بين الاتجاه الحقيقي θ واتجاه الحركة تنقص بمقدار</p>
\\[\\Delta\\theta\\approx\\frac{v}{c}\\sin\\theta\\]
<p><b>الزيغان السنوي</b>: \\(\\kappa=v_\\oplus/c=29.78/299792.458\\) راديان \\(=20.496''\\) («ثابت الزيغان»). يرسم النجم خلال السنة قطعًا ناقصًا حول موضعه، نصف محوره الأكبر κ موازٍ للبروج، والأصغر \\(\\kappa\\sin\\beta\\):</p>
\\[\\Delta\\lambda\\cos\\beta=-\\kappa\\cos(\\lambda_\\odot-\\lambda),\\qquad \\Delta\\beta=-\\kappa\\sin\\beta\\sin(\\lambda_\\odot-\\lambda)\\]
<p><b>الزيغان اليومي</b> بسبب دوران الأرض: \\(0.320''\\cos\\phi\\). اكتشف برادلي الزيغان عام 1725 أثناء بحثه عن اختلاف المنظر، وكان أول دليل مباشر على حركة الأرض حول الشمس.</p>`,
`<p>Because of the observer’s velocity v, the apparent direction of light tilts towards the direction of motion (like rain on a runner). The angle θ from the direction of motion decreases by</p>
\\[\\Delta\\theta\\approx\\frac{v}{c}\\sin\\theta\\]
<p><b>Annual aberration</b>: \\(\\kappa=v_\\oplus/c=29.78/299792.458\\) rad \\(=20.496''\\) (constant of aberration). In a year the star traces an ellipse with semi-major axis κ parallel to the ecliptic and semi-minor axis \\(\\kappa\\sin\\beta\\):</p>
\\[\\Delta\\lambda\\cos\\beta=-\\kappa\\cos(\\lambda_\\odot-\\lambda),\\qquad \\Delta\\beta=-\\kappa\\sin\\beta\\sin(\\lambda_\\odot-\\lambda)\\]
<p><b>Diurnal aberration</b> from Earth’s rotation: \\(0.320''\\cos\\phi\\). Bradley discovered aberration in 1725 while searching for parallax — the first direct proof that Earth orbits the Sun.</p>`) },
{ id: 'prec', icon: '🌀', t: ['المبادرة والترنح', 'Precession and nutation'],
  th: () => S(
`<p>تشد الشمس والقمر انتفاخ الأرض الاستوائي، فيدور محور الأرض حول قطب البروج K في دائرة نصف قطرها ε كل نحو 25 770 سنة. فتتراجع نقطة الاعتدال على البروج بمقدار <b>p ≈ 50.29″ في السنة</b> (المبادرة العامة في الطول)، ويتغير α و δ لكل النجوم. بالتقريب الأول (لسنوات قليلة):</p>
\\[\\Delta\\alpha=m+n\\sin\\alpha\\tan\\delta,\\qquad \\Delta\\delta=n\\cos\\alpha\\]
\\[m=3.07496^{\\mathrm s}=46.124'',\\qquad n=1.33621^{\\mathrm s}=20.043''\\ \\ (\\text{لكل سنة، J2000})\\]
<p>وللفترات الطويلة نستخدم مصفوفة الدوران الدقيقة (Meeus 21.2) بالزوايا ζ, z, θ. أما <b>الترنح</b> فاهتزاز صغير (أكبر حدوده 17.2″ في الطول و9.2″ في الميل) بدورة 18.6 سنة سببه دوران عقدة مدار القمر.</p>
<p>نتيجة جميلة: نجم القطب يتغير. بعد نحو 12 ألف سنة يقترب القطب من النسر الواقع (Vega)، وقبل 4800 سنة تقريبًا كان قريبًا من الثعبان (Thuban, α Dra) وقت بناء الأهرامات.</p>`,
`<p>The Sun and Moon pull on Earth’s equatorial bulge, so Earth’s axis circles the ecliptic pole K at radius ε every ~25,770 years. The equinox slides back along the ecliptic by <b>p ≈ 50.29″ per year</b> (general precession in longitude), changing α and δ of every star. To first order (a few years):</p>
\\[\\Delta\\alpha=m+n\\sin\\alpha\\tan\\delta,\\qquad \\Delta\\delta=n\\cos\\alpha\\]
\\[m=3.07496^{\\mathrm s}=46.124'',\\qquad n=1.33621^{\\mathrm s}=20.043''\\ \\ (\\text{per year, J2000})\\]
<p>For long intervals the rigorous rotation matrix (Meeus 21.2, angles ζ, z, θ) is used. <b>Nutation</b> is a small wobble (largest terms 17.2″ in longitude and 9.2″ in obliquity) with an 18.6-yr period due to the regression of the Moon’s nodes.</p>
<p>A nice consequence: the pole star changes. In about 12,000 years the pole will be near Vega; about 4,800 years ago it was near Thuban (α Dra), in the age of the pyramids.</p>`) }
];

// ------------------------------------------------------------------ helpers for problems
function horFrom(phi, dec, H) { // H west-positive (deg); returns [h, A from N via E]
  const sh = sin(phi) * sin(dec) + cos(phi) * cos(dec) * cos(H);
  const y = -cos(dec) * sin(H), x = sin(dec) * cos(phi) - cos(dec) * cos(H) * sin(phi);
  return [asin(sh), n360(atan2(y, x)), y, x];
}
function jd(y, m, d, hUT) { if (m <= 2) { y--; m += 12; } const A = Math.floor(y / 100), B = 2 - A + Math.floor(A / 4); return Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + d + B - 1524.5 + (hUT || 0) / 24; }
function gmst(J) { const T = (J - 2451545) / 36525; return n360(280.46061837 + 360.98564736629 * (J - 2451545) + 0.000387933 * T * T - T * T * T / 38710000); }
function solveKep(Mdeg, e) { const M = Mdeg * D; let E = e > 0.8 ? Math.PI : M; const it = []; for (let k = 0; k < 15; k++) { const fv = E - e * Math.sin(E) - M; it.push([k, E, fv]); if (Math.abs(fv) < 1e-14) break; E -= fv / (1 - e * Math.cos(E)); } return { E: E * R, it }; }

// ------------------------------------------------------------------ PROBLEMS
// lvl: 1 = first year, 2 = intermediate, 4 = advanced (4th year)
const P = [
// ---------- trig
{ id: 'qibla', ch: 'trig', lvl: 1,
  t: ['المسافة بين القاهرة ومكة واتجاه القبلة', 'Cairo to Mecca: distance and Qibla direction'],
  inp: [['phA', ['عرض القاهرة φ₁', 'Latitude of Cairo φ₁'], 30.0444, '°'], ['laA', ['طول القاهرة λ₁ (شرق)', 'Longitude of Cairo λ₁ (E)'], 31.2357, '°'], ['phB', ['عرض الكعبة φ₂', 'Latitude of the Kaaba φ₂'], 21.4225, '°'], ['laB', ['طول الكعبة λ₂ (شرق)', 'Longitude of the Kaaba λ₂ (E)'], 39.8262, '°']],
  q: p => S(`أوجد طول القوس العظيم بين القاهرة \\((\\phi_1=${p.phA}^\\circ,\\ \\lambda_1=${p.laA}^\\circ\\text{E})\\) والكعبة \\((\\phi_2=${p.phB}^\\circ,\\ \\lambda_2=${p.laB}^\\circ\\text{E})\\) بالدرجات والكيلومترات (نصف قطر الأرض 6371 كم)، وأوجد اتجاه القبلة من القاهرة (السمت الابتدائي للدائرة العظمى).`,
    `Find the great-circle distance between Cairo \\((\\phi_1=${p.phA}^\\circ,\\ \\lambda_1=${p.laA}^\\circ\\text{E})\\) and the Kaaba \\((\\phi_2=${p.phB}^\\circ,\\ \\lambda_2=${p.laB}^\\circ\\text{E})\\) in degrees and km (Earth radius 6371 km), and the Qibla direction from Cairo (initial azimuth of the great circle).`),
  solve: p => {
    const b = 90 - p.phB, c = 90 - p.phA, P_ = p.laB - p.laA;
    const cosa = cos(b) * cos(c) + sin(b) * sin(c) * cos(P_), a = acos(cosa), km = a * D * 6371;
    // four-parts at A (Cairo): angle at Cairo between meridian (to N pole) and great circle
    const num = sin(P_), den = sin(c) * (1 / tan(b)) - cos(c) * cos(P_); const Aq = n360(atan2(num, den));
    return { steps: [
      S(`<b>رسم المثلث.</b> الرؤوس: القطب الشمالي P، والقاهرة A، ومكة B. الضلعان من القطب هما تماما العرضين، والزاوية عند القطب هي فرق الطولين:`, `<b>Draw the triangle.</b> Vertices: north pole P, Cairo A, Mecca B. The sides from the pole are the co-latitudes and the angle at the pole is the longitude difference:`) +
        `\\[PA=90^\\circ-\\phi_1=${deg(c)},\\quad PB=90^\\circ-\\phi_2=${deg(b)},\\quad \\angle P=\\lambda_2-\\lambda_1=${deg(P_)}\\]`,
      S(`<b>قانون جيب التمام</b> للضلع AB المقابل للزاوية P:`, `<b>Cosine formula</b> for side AB opposite angle P:`) +
        `\\[\\cos AB=\\cos PA\\cos PB+\\sin PA\\sin PB\\cos P=${f(cos(c), 6)}\\times${f(cos(b), 6)}+${f(sin(c), 6)}\\times${f(sin(b), 6)}\\times${f(cos(P_), 6)}=${f(cosa, 6)}\\]` +
        `\\[AB=${DM(a)}\\]`,
      S(`<b>بالكيلومترات:</b> طول القوس = الزاوية بالراديان × نصف القطر:`, `<b>In kilometres:</b> arc length = angle in radians × radius:`) + `\\[s=${f(a * D, 6)}\\times 6371=${box(f(km, 1) + '\\ \\text{km}')}\\]`,
      S(`<b>اتجاه القبلة</b> = الزاوية عند A بين خط الزوال (نحو P) والقوس AB. نعرف ضلعين (PA, PB) والزاوية المحصورة P، فنستخدم <b>صيغة الأجزاء الأربعة</b> \\(\\cos PA\\cos P=\\sin PA\\cot PB-\\sin P\\cot A\\) ونرتبها:`, `<b>Qibla</b> = the angle at A between the meridian (towards P) and arc AB. Two sides (PA, PB) and the included angle P are known, so use the <b>four-parts formula</b> \\(\\cos PA\\cos P=\\sin PA\\cot PB-\\sin P\\cot A\\), rearranged:`) +
        `\\[\\tan A=\\frac{\\sin P}{\\sin PA\\cot PB-\\cos PA\\cos P}=\\frac{${f(num, 6)}}{${f(den, 6)}}\\]`,
      S(`البسط موجب والمقام سالب، فالزاوية في الربع الثاني (وهذا منطقي: مكة جنوب شرق القاهرة):`, `Numerator positive and denominator negative ⇒ second quadrant (sensible: Mecca is south-east of Cairo):`) + `\\[A=${box(DM(Aq))}\\ \\ ${S('\\text{من الشمال الحقيقي نحو الشرق}', '\\text{from true north through east}')}\\]`,
      S(`<b>تحقق</b> بقانون الجيوب: \\(\\sin A=\\sin P\\,\\sin PB/\\sin AB=${f(sin(P_) * sin(b) / sin(a), 6)}\\) و \\(\\sin ${f(Aq, 2)}^\\circ=${f(sin(Aq), 6)}\\) ✓ (لكن الجيب وحده لا يميّز بين A و 180° − A؛ لهذا استخدمنا صيغة الظل بإشارتيها).`, `<b>Check</b> with the sine formula: \\(\\sin A=\\sin P\\,\\sin PB/\\sin AB=${f(sin(P_) * sin(b) / sin(a), 6)}\\) and \\(\\sin ${f(Aq, 2)}^\\circ=${f(sin(Aq), 6)}\\) ✓ (the sine alone cannot tell A from 180° − A; hence the tangent with signs).`)],
      ans: S(`المسافة ${f(a, 3)}° ≈ ${f(km, 0)} كم، والقبلة ${f(Aq, 2)}° من الشمال.`, `Distance ${f(a, 3)}° ≈ ${f(km, 0)} km; Qibla ${f(Aq, 2)}° from north.`) };
  } },
{ id: 'sss', ch: 'trig', lvl: 2,
  t: ['حل مثلث كروي بمعلومية أضلاعه الثلاثة، والزيادة الكروية', 'Triangle from three sides; spherical excess'],
  inp: [['a', ['الضلع a', 'Side a'], 60, '°'], ['b', ['الضلع b', 'Side b'], 75, '°'], ['c', ['الضلع c', 'Side c'], 50, '°']],
  q: p => S(`في مثلث كروي أضلاعه \\(a=${p.a}^\\circ,\\ b=${p.b}^\\circ,\\ c=${p.c}^\\circ\\). أوجد زواياه الثلاث، والزيادة الكروية، ومساحته على كرة الأرض (R = 6371 كم).`, `A spherical triangle has sides \\(a=${p.a}^\\circ,\\ b=${p.b}^\\circ,\\ c=${p.c}^\\circ\\). Find its three angles, the spherical excess, and its area on the Earth (R = 6371 km).`),
  solve: p => {
    const cA = (cos(p.a) - cos(p.b) * cos(p.c)) / (sin(p.b) * sin(p.c)), cB = (cos(p.b) - cos(p.a) * cos(p.c)) / (sin(p.a) * sin(p.c)), cC = (cos(p.c) - cos(p.a) * cos(p.b)) / (sin(p.a) * sin(p.b));
    const A = acos(cA), B = acos(cB), C = acos(cC), E = A + B + C - 180, area = E * D * 6371 * 6371;
    const bad = Math.abs(cA) > 1 || Math.abs(cB) > 1 || Math.abs(cC) > 1;
    return { steps: [
      S(`<b>الشرط:</b> يجب أن يكون مجموع أي ضلعين أكبر من الثالث، ومجموع الأضلاع أقل من 360°.`, `<b>Condition:</b> any two sides must exceed the third and the sum must be below 360°.`) + (bad ? S(' ✗ غير محقق!', ' ✗ not satisfied!') : ' ✓'),
      S(`نعيد ترتيب قانون جيب التمام لإيجاد كل زاوية (جيب التمام يحدد الزاوية بين 0° و 180° دون لبس):`, `Rearrange the cosine formula for each angle (the cosine fixes an angle in 0°–180° without ambiguity):`) +
        `\\[\\cos A=\\frac{\\cos a-\\cos b\\cos c}{\\sin b\\sin c}=${f(cA, 6)}\\ \\Rightarrow\\ A=${DM(A)}\\]` +
        `\\[\\cos B=\\frac{\\cos b-\\cos a\\cos c}{\\sin a\\sin c}=${f(cB, 6)}\\ \\Rightarrow\\ B=${DM(B)}\\]` +
        `\\[\\cos C=\\frac{\\cos c-\\cos a\\cos b}{\\sin a\\sin b}=${f(cC, 6)}\\ \\Rightarrow\\ C=${DM(C)}\\]`,
      S(`<b>تحقق بقانون الجيوب:</b>`, `<b>Check with the sine formula:</b>`) + `\\[\\frac{\\sin A}{\\sin a}=${f(sin(A) / sin(p.a), 6)},\\quad \\frac{\\sin B}{\\sin b}=${f(sin(B) / sin(p.b), 6)},\\quad \\frac{\\sin C}{\\sin c}=${f(sin(C) / sin(p.c), 6)}\\ \\checkmark\\]`,
      S(`<b>الزيادة الكروية</b> والمساحة:`, `<b>Spherical excess</b> and area:`) + `\\[E=A+B+C-180^\\circ=${deg(E)}=${f(E * D, 6)}\\ \\text{rad}\\]\\[\\mathcal A=E\\,R^2=${f(E * D, 6)}\\times 6371^2=${box(f(area / 1e6, 3) + '\\times10^{6}\\ \\text{km}^2')}\\]`,
      S(`للمقارنة: مساحة سطح الأرض \\(4\\pi R^2=510\\times10^6\\) كم²، أي أن المثلث يغطي ${f(area / 5.10e8 * 100, 2)}٪ منها.`, `For comparison, Earth’s surface is \\(4\\pi R^2=510\\times10^6\\) km², so the triangle covers ${f(area / 5.10e8 * 100, 2)}% of it.`)],
      ans: S(`A = ${f(A, 3)}°، B = ${f(B, 3)}°، C = ${f(C, 3)}°، E = ${f(E, 3)}°`, `A = ${f(A, 3)}°, B = ${f(B, 3)}°, C = ${f(C, 3)}°, E = ${f(E, 3)}°`) };
  } },
{ id: 'napier', ch: 'trig', lvl: 2,
  t: ['قواعد نابير: إحداثيات الشمس من طولها البروجي', 'Napier’s rules: the Sun’s α, δ from its longitude'],
  inp: [['lam', ['طول الشمس البروجي λ☉', 'Sun’s ecliptic longitude λ☉'], 60, '°'], ['eps', ['ميل البروج ε', 'Obliquity ε'], 23.4393, '°']],
  q: p => S(`الشمس على دائرة البروج (β = 0) عند طول \\(\\lambda_\\odot=${p.lam}^\\circ\\). باعتبار المثلث القائم الذي رؤوسه نقطة الاعتدال ♈ والشمس ☉ ومسقط الشمس على الاستواء، أوجد مطلعها المستقيم وميلها، علمًا بأن \\(\\varepsilon=${p.eps}^\\circ\\).`, `The Sun is on the ecliptic (β = 0) at longitude \\(\\lambda_\\odot=${p.lam}^\\circ\\). Using the right-angled triangle formed by the equinox ♈, the Sun ☉ and the foot of the Sun’s hour circle on the equator, find its right ascension and declination for \\(\\varepsilon=${p.eps}^\\circ\\).`),
  solve: p => {
    const dl = asin(sin(p.eps) * sin(p.lam)), al = n360(atan2(cos(p.eps) * sin(p.lam), cos(p.lam)));
    return { steps: [
      S(`<b>المثلث:</b> الزاوية القائمة عند المسقط على الاستواء. الوتر هو القوس ♈☉ = λ، والضلعان القائمان هما α (على الاستواء) و δ (على دائرة الساعة)، والزاوية عند ♈ هي ε.`, `<b>The triangle:</b> right angle at the foot on the equator. The hypotenuse is ♈☉ = λ, the legs are α (along the equator) and δ (along the hour circle), and the angle at ♈ is ε.`),
      S(`<b>دائرة نابير:</b> \\(\\alpha,\\ \\delta,\\ 90^\\circ-\\angle\\odot,\\ 90^\\circ-\\lambda,\\ 90^\\circ-\\varepsilon\\). الجزء الأوسط δ، والجزآن المقابلان \\(90^\\circ-\\lambda\\) و \\(90^\\circ-\\varepsilon\\):`, `<b>Napier’s circle:</b> \\(\\alpha,\\ \\delta,\\ 90^\\circ-\\angle\\odot,\\ 90^\\circ-\\lambda,\\ 90^\\circ-\\varepsilon\\). Middle part δ; opposite parts \\(90^\\circ-\\lambda\\) and \\(90^\\circ-\\varepsilon\\):`) +
        `\\[\\sin\\delta=\\cos(90^\\circ-\\lambda)\\cos(90^\\circ-\\varepsilon)=\\sin\\lambda\\sin\\varepsilon=${f(sin(p.lam), 6)}\\times${f(sin(p.eps), 6)}\\ \\Rightarrow\\ \\delta=${box(DM(dl))}\\]`,
      S(`الجزء الأوسط \\(90^\\circ-\\varepsilon\\)، والمجاوران α و \\(90^\\circ-\\lambda\\):`, `Middle part \\(90^\\circ-\\varepsilon\\); adjacent parts α and \\(90^\\circ-\\lambda\\):`) +
        `\\[\\cos\\varepsilon=\\tan\\alpha\\cot\\lambda\\ \\Rightarrow\\ \\tan\\alpha=\\cos\\varepsilon\\tan\\lambda\\]` +
        S(`ولأن α و λ في الربع نفسه دائمًا نكتب \\(\\alpha=\\operatorname{atan2}(\\cos\\varepsilon\\sin\\lambda,\\ \\cos\\lambda)\\):`, `Since α and λ always lie in the same quadrant, \\(\\alpha=\\operatorname{atan2}(\\cos\\varepsilon\\sin\\lambda,\\ \\cos\\lambda)\\):`) +
        `\\[\\alpha=${deg(al)}=${box(hmsT(al / 15, 1))}\\]`,
      S(`<b>تفسير:</b> الفرق \\(\\lambda-\\alpha=${f(p.lam - al, 3)}^\\circ\\) هو «أثر ميل البروج» في معادلة الزمن (كل 1° يعادل 4 دقائق زمنية).`, `<b>Interpretation:</b> the difference \\(\\lambda-\\alpha=${f(p.lam - al, 3)}^\\circ\\) is the obliquity term of the equation of time (1° = 4 minutes of time).`)],
      ans: `α = ${f(al, 4)}°, δ = ${f(dl, 4)}°` };
  } },
{ id: 'polar', ch: 'trig', lvl: 4,
  t: ['المثلث القطبي: زاويتان والضلع بينهما', 'Polar triangle: two angles and the included side'],
  inp: [['A', ['الزاوية A', 'Angle A'], 70, '°'], ['B', ['الزاوية B', 'Angle B'], 80, '°'], ['c', ['الضلع c', 'Side c'], 40, '°']],
  q: p => S(`في مثلث كروي \\(A=${p.A}^\\circ,\\ B=${p.B}^\\circ,\\ c=${p.c}^\\circ\\). أوجد الزاوية الثالثة C ثم الضلعين a و b.`, `In a spherical triangle \\(A=${p.A}^\\circ,\\ B=${p.B}^\\circ,\\ c=${p.c}^\\circ\\). Find the third angle C, then sides a and b.`),
  solve: p => {
    const cC = -cos(p.A) * cos(p.B) + sin(p.A) * sin(p.B) * cos(p.c), C = acos(cC);
    const ca = (cos(p.A) + cos(p.B) * cos(C)) / (sin(p.B) * sin(C)), a = acos(ca);
    const cb = (cos(p.B) + cos(p.A) * cos(C)) / (sin(p.A) * sin(C)), b = acos(cb);
    return { steps: [
      S(`<b>الفكرة:</b> في المثلث القطبي \\(a'=180^\\circ-A,\\ b'=180^\\circ-B,\\ C'=180^\\circ-c\\)، فالمعطيات فيه «ضلعان والزاوية بينهما»، فنطبق قانون جيب التمام ثم نرجع:`, `<b>Idea:</b> in the polar triangle \\(a'=180^\\circ-A,\\ b'=180^\\circ-B,\\ C'=180^\\circ-c\\), so the data become “two sides and the included angle”; apply the cosine formula and transform back:`) +
        `\\[\\cos c'=\\cos a'\\cos b'+\\sin a'\\sin b'\\cos C'\\ \\Longrightarrow\\ \\cos C=-\\cos A\\cos B+\\sin A\\sin B\\cos c\\]`,
      `\\[\\cos C=-(${f(cos(p.A), 6)})(${f(cos(p.B), 6)})+(${f(sin(p.A), 6)})(${f(sin(p.B), 6)})(${f(cos(p.c), 6)})=${f(cC, 6)}\\ \\Rightarrow\\ C=${box(DM(C))}\\]`,
      S(`ومن قانون جيب التمام للزوايا مرة أخرى (\\(\\cos A=-\\cos B\\cos C+\\sin B\\sin C\\cos a\\)):`, `Again from the cosine formula for angles (\\(\\cos A=-\\cos B\\cos C+\\sin B\\sin C\\cos a\\)):`) +
        `\\[\\cos a=\\frac{\\cos A+\\cos B\\cos C}{\\sin B\\sin C}=${f(ca, 6)}\\Rightarrow a=${DM(a)},\\qquad \\cos b=\\frac{\\cos B+\\cos A\\cos C}{\\sin A\\sin C}=${f(cb, 6)}\\Rightarrow b=${DM(b)}\\]`,
      S(`<b>تحقق</b> بقانون الجيوب: \\(\\sin a/\\sin A=${f(sin(a) / sin(p.A), 6)}\\)، \\(\\sin b/\\sin B=${f(sin(b) / sin(p.B), 6)}\\)، \\(\\sin c/\\sin C=${f(sin(p.c) / sin(C), 6)}\\) ✓`, `<b>Check</b> with the sine formula: \\(\\sin a/\\sin A=${f(sin(a) / sin(p.A), 6)}\\), \\(\\sin b/\\sin B=${f(sin(b) / sin(p.B), 6)}\\), \\(\\sin c/\\sin C=${f(sin(p.c) / sin(C), 6)}\\) ✓`)],
      ans: `C = ${f(C, 3)}°, a = ${f(a, 3)}°, b = ${f(b, 3)}°` };
  } },
{ id: 'diff', ch: 'trig', lvl: 4,
  t: ['تحليل الخطأ: أثر خطأ الساعة على الارتفاع', 'Error analysis: effect of a clock error on altitude'],
  inp: [['phi', ['العرض φ', 'Latitude φ'], 30.04, '°'], ['dec', ['ميل النجم δ', 'Declination δ'], 15, '°'], ['H', ['الزاوية الساعية H (غرب +)', 'Hour angle H (west +)'], -45, '°'], ['dt', ['خطأ الساعة Δt', 'Clock error Δt'], 2, 's']],
  q: p => S(`راصد على عرض \\(${p.phi}^\\circ\\) يقيس ارتفاع نجم ميله \\(${p.dec}^\\circ\\) عند زاوية ساعية \\(${p.H}^\\circ\\). إذا كانت ساعته متقدمة \\(${p.dt}\\) ثانية، فما الخطأ الناتج في الارتفاع المحسوب؟ وأين يجب أن يكون النجم ليكون الأثر أكبر ما يمكن؟`, `An observer at latitude \\(${p.phi}^\\circ\\) measures a star of declination \\(${p.dec}^\\circ\\) at hour angle \\(${p.H}^\\circ\\). If the clock is \\(${p.dt}\\) s fast, what error results in the computed altitude? Where should the star be for the effect to be largest?`),
  solve: p => {
    const [h, A] = horFrom(p.phi, p.dec, p.H), rate = cos(p.phi) * sin(A), dH = p.dt * 15; // arcsec of hour angle
    const err = rate * dH;
    return { steps: [
      S(`<b>الموضع:</b>`, `<b>Position:</b>`) + `\\[h=${DM(h)},\\qquad A=${DM(A)}\\]`,
      S(`<b>نفاضل</b> قانون جيب التمام بالنسبة إلى H مع ثبات φ و δ: \\(\\cos h\\,dh=-\\cos\\phi\\cos\\delta\\sin H\\,dH\\). ومن قانون الجيوب في المثلث PZX: \\(\\cos\\delta\\sin H=-\\cos h\\sin A\\) (بإشارات السمت من الشمال)، إذن:`, `<b>Differentiate</b> the cosine formula with respect to H at fixed φ, δ: \\(\\cos h\\,dh=-\\cos\\phi\\cos\\delta\\sin H\\,dH\\). From the sine formula in PZX, \\(\\cos\\delta\\sin H=-\\cos h\\sin A\\) (azimuth from north), hence`) +
        `\\[\\boxed{\\frac{dh}{dH}=\\cos\\phi\\,\\sin A}=${f(cos(p.phi), 5)}\\times${f(sin(A), 5)}=${f(rate, 5)}\\]`,
      S(`خطأ الساعة \\(${p.dt}\\) ث يعني خطأ في الزاوية الساعية \\(\\Delta H=15''\\times${p.dt}=${f(dH, 1)}''\\)، فيكون:`, `A clock error of \\(${p.dt}\\) s means \\(\\Delta H=15''\\times${p.dt}=${f(dH, 1)}''\\), so`) + `\\[\\Delta h=${f(rate, 5)}\\times${f(dH, 1)}''=${box(f(err, 2) + "''")}\\]`,
      S(`<b>الأثر أكبر ما يمكن</b> عندما \\(|\\sin A|=1\\)، أي على الدائرة الرأسية الأولى (شرق أو غرب تمامًا)، ويساوي عندئذ \\(15''\\cos\\phi=${f(15 * cos(p.phi), 2)}''\\) لكل ثانية. ولذلك تُرصد النجوم قرب الدائرة الرأسية الأولى لتعيين <b>الزمن</b>، وقرب خط الزوال (\\(\\sin A\\approx 0\\)) لتعيين <b>العرض</b> لأن الارتفاع هناك لا يتأثر بخطأ الساعة.`, `<b>The effect is largest</b> when \\(|\\sin A|=1\\), on the prime vertical, where it equals \\(15''\\cos\\phi=${f(15 * cos(p.phi), 2)}''\\) per second. Hence stars near the prime vertical are used to find <b>time</b>, and stars near the meridian (\\(\\sin A\\approx 0\\)) to find <b>latitude</b>, since there the altitude is insensitive to clock error.`)],
      ans: `Δh = ${f(err, 2)}″` };
  } },
// ---------- coordinates
{ id: 'eq2hor', ch: 'coord', lvl: 1,
  t: ['من الإحداثيات الاستوائية إلى الأفقية', 'Equatorial to horizontal coordinates'],
  inp: [['phi', ['العرض φ', 'Latitude φ'], 30.0444, '°'], ['dec', ['الميل δ', 'Declination δ'], 7.4071, '°'], ['Hh', ['الزاوية الساعية H (ساعات، غرب +)', 'Hour angle H (hours, west +)'], 2.5, 'h']],
  q: p => S(`نجم ميله \\(\\delta=${p.dec}^\\circ\\) (منكب الجوزاء تقريبًا) وزاويته الساعية \\(H=${p.Hh}^{\\mathrm h}\\) غربًا، يرصده راصد على عرض \\(\\phi=${p.phi}^\\circ\\). أوجد ارتفاعه وسمته.`, `A star of declination \\(\\delta=${p.dec}^\\circ\\) (about Betelgeuse) is at hour angle \\(H=${p.Hh}^{\\mathrm h}\\) west, seen from latitude \\(\\phi=${p.phi}^\\circ\\). Find its altitude and azimuth.`),
  solve: p => {
    const H = p.Hh * 15, [h, A, y, x] = horFrom(p.phi, p.dec, H);
    const sh = sin(p.phi) * sin(p.dec) + cos(p.phi) * cos(p.dec) * cos(H);
    const cAz = (sin(p.dec) - sin(p.phi) * sh) / (cos(p.phi) * cos(h));
    return { steps: [
      S(`<b>حوّل الزاوية الساعية إلى درجات:</b> \\(H=${p.Hh}\\times15=${deg(H, 2)}\\).`, `<b>Hour angle in degrees:</b> \\(H=${p.Hh}\\times15=${deg(H, 2)}\\).`),
      S(`<b>المثلث PZX:</b> \\(PZ=90^\\circ-\\phi=${deg(90 - p.phi)}\\)، \\(PX=90^\\circ-\\delta=${deg(90 - p.dec)}\\)، والزاوية عند P تساوي H. قانون جيب التمام للضلع ZX = z:`, `<b>Triangle PZX:</b> \\(PZ=90^\\circ-\\phi=${deg(90 - p.phi)}\\), \\(PX=90^\\circ-\\delta=${deg(90 - p.dec)}\\), angle at P = H. Cosine formula for side ZX = z:`) +
        `\\[\\sin h=\\sin\\phi\\sin\\delta+\\cos\\phi\\cos\\delta\\cos H=${f(sin(p.phi) * sin(p.dec), 6)}+${f(cos(p.phi) * cos(p.dec) * cos(H), 6)}=${f(sh, 6)}\\]\\[h=${box(DM(h))}\\]`,
      S(`<b>السمت</b> من قانون جيب التمام للضلع PX (يعطي A بلا لبس بين 0° و 180°):`, `<b>Azimuth</b> from the cosine formula for side PX (gives the angle at Z unambiguously in 0°–180°):`) +
        `\\[\\cos Z=\\frac{\\sin\\delta-\\sin\\phi\\sin h}{\\cos\\phi\\cos h}=${f(cAz, 6)}\\ \\Rightarrow\\ Z=${deg(acos(cAz))}\\]`,
      S(`النجم ${H > 0 ? 'غرب' : 'شرق'} خط الزوال (H ${H > 0 ? 'موجبة' : 'سالبة'})، لذلك السمت من الشمال ${H > 0 ? 'هو \\(360^\\circ-Z\\)' : 'يساوي Z'}:`, `The star is ${H > 0 ? 'west' : 'east'} of the meridian (H ${H > 0 ? 'positive' : 'negative'}), so the azimuth from north is ${H > 0 ? '\\(360^\\circ-Z\\)' : 'Z'}:`) + `\\[A=${box(DM(A))}\\]`,
      S(`<b>تحقق بالصيغة الشاملة</b> (atan2): \\(\\tan A=\\dfrac{-\\cos\\delta\\sin H}{\\sin\\delta\\cos\\phi-\\cos\\delta\\cos H\\sin\\phi}=\\dfrac{${f(y, 6)}}{${f(x, 6)}}\\) ⇒ \\(A=${f(A, 4)}^\\circ\\) ✓`, `<b>Check with the general formula</b> (atan2): \\(\\tan A=\\dfrac{-\\cos\\delta\\sin H}{\\sin\\delta\\cos\\phi-\\cos\\delta\\cos H\\sin\\phi}=\\dfrac{${f(y, 6)}}{${f(x, 6)}}\\) ⇒ \\(A=${f(A, 4)}^\\circ\\) ✓`)],
      ans: `h = ${f(h, 3)}°, A = ${f(A, 3)}°` };
  } },
{ id: 'hor2eq', ch: 'coord', lvl: 1,
  t: ['من الإحداثيات الأفقية إلى الاستوائية', 'Horizontal to equatorial coordinates'],
  inp: [['phi', ['العرض φ', 'Latitude φ'], 30.0444, '°'], ['h', ['الارتفاع h', 'Altitude h'], 40, '°'], ['A', ['السمت A (من الشمال)', 'Azimuth A (from N)'], 120, '°']],
  q: p => S(`رصد جرم على ارتفاع \\(h=${p.h}^\\circ\\) وسمت \\(A=${p.A}^\\circ\\) من عرض \\(\\phi=${p.phi}^\\circ\\). أوجد ميله وزاويته الساعية.`, `An object is seen at altitude \\(h=${p.h}^\\circ\\), azimuth \\(A=${p.A}^\\circ\\), from latitude \\(\\phi=${p.phi}^\\circ\\). Find its declination and hour angle.`),
  solve: p => {
    const sd = sin(p.phi) * sin(p.h) + cos(p.phi) * cos(p.h) * cos(p.A), dec = asin(sd);
    const y = -sin(p.A) * cos(p.h), x = sin(p.h) * cos(p.phi) - cos(p.h) * sin(p.phi) * cos(p.A); const H = atan2(y, x);
    return { steps: [
      S(`<b>المثلث نفسه PZX</b> لكن المعلوم الآن \\(PZ=90^\\circ-\\phi\\)، و \\(ZX=90^\\circ-h\\)، والزاوية عند Z (السمت). قانون جيب التمام للضلع PX:`, `<b>The same triangle PZX</b>, now with \\(PZ=90^\\circ-\\phi\\), \\(ZX=90^\\circ-h\\) and the angle at Z (azimuth) known. Cosine formula for side PX:`) +
        `\\[\\sin\\delta=\\sin\\phi\\sin h+\\cos\\phi\\cos h\\cos A=${f(sd, 6)}\\ \\Rightarrow\\ \\delta=${box(DM(dec))}\\]`,
      S(`<b>الزاوية الساعية</b> بالصيغة المناظرة (تماثل كامل بين النظامين: φ ثابت، و h ↔ δ، و A ↔ H):`, `<b>Hour angle</b> by the symmetric formula (full symmetry: φ fixed, h ↔ δ, A ↔ H):`) +
        `\\[\\tan H=\\frac{-\\sin A\\cos h}{\\sin h\\cos\\phi-\\cos h\\sin\\phi\\cos A}=\\frac{${f(y, 6)}}{${f(x, 6)}}\\ \\Rightarrow\\ H=${deg(H)}=${box(hmsT(H / 15, 0))}\\]`,
      S(`${H < 0 ? 'H سالبة: الجرم شرق خط الزوال وما زال صاعدًا، ويعبر الزوال بعد ' + f(-H / 15, 3) + ' ساعة نجمية.' : 'H موجبة: الجرم غرب خط الزوال وقد عبره منذ ' + f(H / 15, 3) + ' ساعة نجمية.'}`, `${H < 0 ? 'H negative: the object is east of the meridian, still rising; it transits in ' + f(-H / 15, 3) + ' sidereal hours.' : 'H positive: the object is west of the meridian; it transited ' + f(H / 15, 3) + ' sidereal hours ago.'}`)],
      ans: `δ = ${f(dec, 3)}°, H = ${f(H / 15, 4)} h` };
  } },
{ id: 'eq2ecl', ch: 'coord', lvl: 2,
  t: ['من الاستوائية إلى البروجية (قلب الأسد)', 'Equatorial to ecliptic (Regulus)'],
  inp: [['ra', ['المطلع المستقيم α (درجات)', 'Right ascension α (deg)'], 152.0930, '°'], ['dec', ['الميل δ', 'Declination δ'], 11.9672, '°'], ['eps', ['ميل البروج ε', 'Obliquity ε'], 23.4393, '°']],
  q: p => S(`نجم قلب الأسد (Regulus) إحداثياته \\(\\alpha=${p.ra}^\\circ,\\ \\delta=${p.dec}^\\circ\\) (J2000). أوجد طوله وعرضه البروجيين. لماذا يحجب القمر هذا النجم أحيانًا؟`, `Regulus has \\(\\alpha=${p.ra}^\\circ,\\ \\delta=${p.dec}^\\circ\\) (J2000). Find its ecliptic longitude and latitude. Why is it sometimes occulted by the Moon?`),
  solve: p => {
    const sb = sin(p.dec) * cos(p.eps) - cos(p.dec) * sin(p.eps) * sin(p.ra), b = asin(sb);
    const y = sin(p.ra) * cos(p.eps) + tan(p.dec) * sin(p.eps), x = cos(p.ra), l = n360(atan2(y, x));
    return { steps: [
      S(`<b>المثلث PKX:</b> \\(PK=\\varepsilon\\)، \\(PX=90^\\circ-\\delta\\)، \\(KX=90^\\circ-\\beta\\). الزاوية عند P بين دائرة الساعة المارة بقطب البروج (التي تقع عند \\(\\alpha=270^\\circ\\)) ودائرة ساعة النجم هي \\(90^\\circ+\\alpha\\).`, `<b>Triangle PKX:</b> \\(PK=\\varepsilon\\), \\(PX=90^\\circ-\\delta\\), \\(KX=90^\\circ-\\beta\\). The angle at P between the hour circle through the ecliptic pole (at \\(\\alpha=270^\\circ\\)) and the star’s hour circle is \\(90^\\circ+\\alpha\\).`),
      S(`قانون جيب التمام للضلع KX:`, `Cosine formula for side KX:`) + `\\[\\sin\\beta=\\cos\\varepsilon\\sin\\delta+\\sin\\varepsilon\\cos\\delta\\cos(90^\\circ+\\alpha)=\\sin\\delta\\cos\\varepsilon-\\cos\\delta\\sin\\varepsilon\\sin\\alpha=${f(sb, 6)}\\]\\[\\beta=${box(DM(b))}\\]`,
      S(`ومن الصيغة المناظرة وقانون الجيوب:`, `From the analogue formula and the sine formula:`) + `\\[\\tan\\lambda=\\frac{\\sin\\alpha\\cos\\varepsilon+\\tan\\delta\\sin\\varepsilon}{\\cos\\alpha}=\\frac{${f(y, 6)}}{${f(x, 6)}}\\ \\Rightarrow\\ \\lambda=${box(DM(l))}\\]`,
      S(`<b>التفسير:</b> \\(|\\beta|=${f(Math.abs(b), 2)}^\\circ\\) أصغر من ميل مدار القمر على البروج (5.1°) مضافًا إليه نصف قطر القمر واختلاف منظره، لذلك يمر القمر أمام النجم في فترات تتكرر كل 18.6 سنة تقريبًا.`, `<b>Interpretation:</b> \\(|\\beta|=${f(Math.abs(b), 2)}^\\circ\\) is less than the Moon’s orbital inclination (5.1°) plus its radius and parallax, so the Moon passes in front of it in seasons recurring about every 18.6 years.`)],
      ans: `λ = ${f(l, 3)}°, β = ${f(b, 3)}°` };
  } },
{ id: 'gal', ch: 'coord', lvl: 4,
  t: ['الإحداثيات المجرية (ذنب الدجاجة)', 'Galactic coordinates (Deneb)'],
  inp: [['ra', ['α (درجات)', 'α (deg)'], 310.3580, '°'], ['dec', ['δ', 'δ'], 45.2803, '°']],
  q: p => S(`أوجد الإحداثيات المجرية (l, b) لنجم ذنب الدجاجة \\(\\alpha=${p.ra}^\\circ,\\ \\delta=${p.dec}^\\circ\\) (J2000). قطب المجرة الشمالي عند \\(\\alpha_G=192.85948^\\circ,\\ \\delta_G=27.12825^\\circ\\)، وطول القطب السماوي الشمالي المجري \\(l_{NCP}=122.93192^\\circ\\).`, `Find the galactic coordinates (l, b) of Deneb, \\(\\alpha=${p.ra}^\\circ,\\ \\delta=${p.dec}^\\circ\\) (J2000). The north galactic pole is at \\(\\alpha_G=192.85948^\\circ,\\ \\delta_G=27.12825^\\circ\\); the galactic longitude of the north celestial pole is \\(l_{NCP}=122.93192^\\circ\\).`),
  solve: p => {
    const aG = 192.85948, dG = 27.12825, lN = 122.93192;
    const sb = sin(p.dec) * sin(dG) + cos(p.dec) * cos(dG) * cos(p.ra - aG), b = asin(sb);
    const y = cos(p.dec) * sin(p.ra - aG), x = sin(p.dec) * cos(dG) - cos(p.dec) * sin(dG) * cos(p.ra - aG), l = n360(lN - atan2(y, x));
    return { steps: [
      S(`<b>المثلث:</b> القطب السماوي P، وقطب المجرة G، والنجم X. \\(PG=90^\\circ-\\delta_G\\)، \\(PX=90^\\circ-\\delta\\)، والزاوية عند P هي \\(\\alpha-\\alpha_G=${deg(p.ra - aG)}\\). نلاحظ أنه نفس شكل المثلث PZX تمامًا مع وضع G مكان Z!`, `<b>Triangle:</b> celestial pole P, galactic pole G, star X. \\(PG=90^\\circ-\\delta_G\\), \\(PX=90^\\circ-\\delta\\), angle at P = \\(\\alpha-\\alpha_G=${deg(p.ra - aG)}\\). It is exactly triangle PZX with G in place of Z!`),
      `\\[\\sin b=\\sin\\delta\\sin\\delta_G+\\cos\\delta\\cos\\delta_G\\cos(\\alpha-\\alpha_G)=${f(sb, 6)}\\ \\Rightarrow\\ b=${box(DM(b))}\\]`,
      S(`الزاوية عند G بين القوس GP والقوس GX:`, `The angle at G between arcs GP and GX:`) + `\\[\\tan\\theta=\\frac{\\cos\\delta\\sin(\\alpha-\\alpha_G)}{\\sin\\delta\\cos\\delta_G-\\cos\\delta\\sin\\delta_G\\cos(\\alpha-\\alpha_G)}=\\frac{${f(y, 6)}}{${f(x, 6)}}\\ \\Rightarrow\\ \\theta=${deg(atan2(y, x))}\\]`,
      S(`ولأن الأطوال المجرية تُقاس في الاتجاه المعاكس حول G بدءًا من اتجاه P (عند \\(l_{NCP}\\)):`, `Since galactic longitude is measured the other way round G, starting from the direction of P (at \\(l_{NCP}\\)):`) + `\\[l=l_{NCP}-\\theta=${box(DM(l))}\\]`,
      S(`ذنب الدجاجة يقع تقريبًا في مستوى المجرة (b ≈ ${f(b, 1)}°) باتجاه ذراع الجبار المحلية، ولهذا يبدو داخل شريط درب التبانة في الصيف.`, `Deneb lies almost in the galactic plane (b ≈ ${f(b, 1)}°) towards the local Orion Arm, which is why it sits inside the summer Milky Way.`)],
      ans: `l = ${f(l, 3)}°, b = ${f(b, 3)}°` };
  } },
// ---------- diurnal
{ id: 'culm', ch: 'diurnal', lvl: 1,
  t: ['العبور العلوي والسفلي والنجوم حول القطبية (العيوق)', 'Upper/lower culmination and circumpolarity (Capella)'],
  inp: [['phi', ['العرض φ', 'Latitude φ'], 30.0444, '°'], ['dec', ['الميل δ', 'Declination δ'], 45.998, '°']],
  q: p => S(`نجم العيوق (Capella) ميله \\(\\delta=${p.dec}^\\circ\\). أوجد ارتفاعه وجهته عند العبورين العلوي والسفلي من عرض \\(\\phi=${p.phi}^\\circ\\). هل هو نجم حول قطبي هنا؟ وما أقل عرض يصبح عنده كذلك؟`, `Capella has \\(\\delta=${p.dec}^\\circ\\). Find its altitude and direction at upper and lower culmination from latitude \\(\\phi=${p.phi}^\\circ\\). Is it circumpolar there? From what latitude does it become circumpolar?`),
  solve: p => {
    const hu = 90 - Math.abs(p.phi - p.dec), hl = p.phi + p.dec - 90, side = p.dec > p.phi ? S('شمال السمت', 'north of the zenith') : S('جنوب السمت', 'south of the zenith');
    return { steps: [
      S(`<b>العبور العلوي (H = 0):</b> النجم على خط الزوال، فالمسافة السمتية هي الفرق بين الميل والعرض: \\(z=|\\phi-\\delta|=${deg(Math.abs(p.phi - p.dec))}\\).`, `<b>Upper culmination (H = 0):</b> the star is on the meridian, so the zenith distance is the difference of declination and latitude: \\(z=|\\phi-\\delta|=${deg(Math.abs(p.phi - p.dec))}\\).`) +
        `\\[h_{\\text{upper}}=90^\\circ-|\\phi-\\delta|=${box(deg(hu))}\\quad\\text{(${side})}\\]`,
      S(`<b>العبور السفلي (H = 12ʰ):</b> النجم تحت القطب. ارتفاع القطب = φ، والنجم أبعد عن القطب بمقدار \\(90^\\circ-\\delta\\):`, `<b>Lower culmination (H = 12ʰ):</b> below the pole. The pole’s altitude is φ, and the star is \\(90^\\circ-\\delta\\) from it:`) +
        `\\[h_{\\text{lower}}=\\phi-(90^\\circ-\\delta)=\\phi+\\delta-90^\\circ=${box(deg(hl))}\\]`,
      hl > 0 ? S(`الارتفاع السفلي موجب، فالنجم <b>حول قطبي</b> لا يغرب أبدًا من هذا المكان.`, `The lower altitude is positive: the star is <b>circumpolar</b> here.`) : S(`الارتفاع السفلي سالب، فالنجم <b>يشرق ويغرب</b> من هذا المكان.`, `The lower altitude is negative: the star <b>rises and sets</b> here.`),
      S(`<b>شرط القطبية:</b> \\(\\phi+\\delta-90^\\circ>0\\Rightarrow\\phi>90^\\circ-\\delta=${box(deg(90 - p.dec, 3))}\\). (مثلًا في قازان على عرض 55.8° يصبح العيوق نجمًا حول قطبي.)`, `<b>Circumpolar condition:</b> \\(\\phi+\\delta-90^\\circ>0\\Rightarrow\\phi>90^\\circ-\\delta=${box(deg(90 - p.dec, 3))}\\). (E.g. at Kazan, latitude 55.8°, Capella is circumpolar.)`)],
      ans: `h_upper = ${f(hu, 3)}°, h_lower = ${f(hl, 3)}°` };
  } },
{ id: 'rise', ch: 'diurnal', lvl: 2,
  t: ['زمن بقاء النجم فوق الأفق وسمت شروقه، وأثر الانكسار (قلب العقرب)', 'Time above the horizon, rising azimuth, effect of refraction (Antares)'],
  inp: [['phi', ['العرض φ', 'Latitude φ'], 30.0444, '°'], ['dec', ['الميل δ', 'Declination δ'], -26.432, '°'], ['h0', ['ارتفاع الشروق h₀', 'Rising altitude h₀'], -0.5667, '°']],
  q: p => S(`نجم قلب العقرب (Antares) ميله \\(\\delta=${p.dec}^\\circ\\). من عرض \\(\\phi=${p.phi}^\\circ\\): أوجد نصف قوسه النهاري (الزاوية الساعية للشروق)، ومدة بقائه فوق الأفق بالساعات الشمسية، وسمت شروقه وسعته، أولًا بإهمال الانكسار ثم بأخذه (\\(h_0=${p.h0}^\\circ\\)).`, `Antares has \\(\\delta=${p.dec}^\\circ\\). From latitude \\(\\phi=${p.phi}^\\circ\\) find its semi-diurnal arc (hour angle at rising), the time it spends above the horizon in solar hours, and its rising azimuth and amplitude — first neglecting refraction, then with it (\\(h_0=${p.h0}^\\circ\\)).`),
  solve: p => {
    const c0 = -tan(p.phi) * tan(p.dec), H0 = acos(c0);
    const c1 = (sin(p.h0) - sin(p.phi) * sin(p.dec)) / (cos(p.phi) * cos(p.dec)), H1 = acos(c1);
    const T0 = 2 * H0 / 15 / 1.00273790935, T1 = 2 * H1 / 15 / 1.00273790935;
    const cA = (sin(p.dec) - sin(p.phi) * sin(p.h0)) / (cos(p.phi) * cos(p.h0)), Ar = acos(cA);
    return { steps: [
      S(`<b>بإهمال الانكسار (h = 0):</b> \\(\\cos H_0=-\\tan\\phi\\tan\\delta=-(${f(tan(p.phi), 6)})(${f(tan(p.dec), 6)})=${f(c0, 6)}\\)`, `<b>Neglecting refraction (h = 0):</b> \\(\\cos H_0=-\\tan\\phi\\tan\\delta=-(${f(tan(p.phi), 6)})(${f(tan(p.dec), 6)})=${f(c0, 6)}\\)`) +
        `\\[H_0=${deg(H0)}=${hmsT(H0 / 15, 1)}\\ \\text{${S('(زمن نجمي)', '(sidereal)')}}\\]`,
      S(`<b>المدة فوق الأفق</b> \\(=2H_0\\) ساعة نجمية، وللتحويل إلى ساعات شمسية نقسم على 1.0027379:`, `<b>Time above the horizon</b> \\(=2H_0\\) sidereal hours; divide by 1.0027379 for solar hours:`) + `\\[T=\\frac{2\\times${f(H0 / 15, 5)}}{1.0027379}=${f(T0, 4)}\\ \\text{h}=${hmsT(T0, 0)}\\]`,
      S(`<b>مع الانكسار:</b> يظهر النجم وهو هندسيًا تحت الأفق بـ ${f(-p.h0 * 60, 1)}′:`, `<b>With refraction:</b> the star appears while geometrically ${f(-p.h0 * 60, 1)}′ below the horizon:`) +
        `\\[\\cos H_0'=\\frac{\\sin h_0-\\sin\\phi\\sin\\delta}{\\cos\\phi\\cos\\delta}=${f(c1, 6)}\\Rightarrow H_0'=${deg(H1)}\\]` +
        `\\[T'=${box(hmsT(T1, 0))}\\quad\\Rightarrow\\quad T'-T=${f((T1 - T0) * 60, 2)}\\ \\text{${S('دقيقة', 'min')}}\\]`,
      S(`<b>سمت الشروق</b> (قانون جيب التمام للضلع PX مع \\(z=90^\\circ-h_0\\)):`, `<b>Rising azimuth</b> (cosine formula for side PX with \\(z=90^\\circ-h_0\\)):`) +
        `\\[\\cos A_r=\\frac{\\sin\\delta-\\sin\\phi\\sin h_0}{\\cos\\phi\\cos h_0}=${f(cA, 6)}\\Rightarrow A_r=${box(deg(Ar, 3))}\\]` +
        S(`والسعة (الزاوية من الشرق) \\(=90^\\circ-A_r=${f(90 - Ar, 3)}^\\circ\\) ${90 - Ar < 0 ? 'جنوب الشرق' : 'شمال الشرق'}، ويغرب عند السمت \\(360^\\circ-A_r=${f(360 - Ar, 3)}^\\circ\\).`, `and the amplitude (from east) \\(=90^\\circ-A_r=${f(90 - Ar, 3)}^\\circ\\) ${90 - Ar < 0 ? 'south of east' : 'north of east'}; it sets at azimuth \\(360^\\circ-A_r=${f(360 - Ar, 3)}^\\circ\\).`),
      S(`<b>لماذا الأثر هنا كبير؟</b> معدل تغير الارتفاع عند الأفق \\(dh/dt=15\\cos\\phi\\sin A\\) يكون صغيرًا للنجوم ذات الميل الجنوبي الكبير لأنها تشرق بزاوية مائلة على الأفق، فيحتاج الانكسار (34′) وقتًا أطول للتعويض.`, `<b>Why is the effect large here?</b> The rate \\(dh/dt=15\\cos\\phi\\sin A\\) at the horizon is small for strongly southern stars, which rise obliquely, so the 34′ of refraction takes longer to “cover”.`)],
      ans: S(`H₀ = ${f(H1, 3)}°، فوق الأفق ${f(T1, 3)} ساعة، سمت الشروق ${f(Ar, 2)}°`, `H₀ = ${f(H1, 3)}°, above horizon ${f(T1, 3)} h, rising azimuth ${f(Ar, 2)}°`) };
  } },
{ id: 'pv', ch: 'diurnal', lvl: 2,
  t: ['عبور الدائرة الرأسية الأولى (السماك الرامح)', 'Prime-vertical transit (Arcturus)'],
  inp: [['phi', ['العرض φ', 'Latitude φ'], 30.0444, '°'], ['dec', ['الميل δ', 'Declination δ'], 19.1824, '°']],
  q: p => S(`متى يكون نجم السماك الرامح (\\(\\delta=${p.dec}^\\circ\\)) شرق الراصد تمامًا (A = 90°) على عرض \\(${p.phi}^\\circ\\)؟ أوجد الزاوية الساعية والارتفاع، وناقش شرط حدوث ذلك.`, `When is Arcturus (\\(\\delta=${p.dec}^\\circ\\)) exactly due east (A = 90°) for latitude \\(${p.phi}^\\circ\\)? Find the hour angle and altitude, and discuss when this can happen.`),
  solve: p => {
    const ok = p.dec > 0 && p.dec < p.phi; const cH = tan(p.dec) / tan(p.phi), sh = sin(p.dec) / sin(p.phi);
    if (!ok) return { steps: [S(`الشرط \\(0<\\delta<\\phi\\) غير محقق (\\(\\delta=${p.dec}^\\circ,\\ \\phi=${p.phi}^\\circ\\))، فالنجم لا يعبر الدائرة الرأسية الأولى فوق الأفق: ${p.dec >= p.phi ? 'إنه يبقى شمال الدائرة الرأسية الأولى طوال مساره فوق الأفق (مثل النسر الواقع من القاهرة).' : 'يعبرها تحت الأفق فقط.'}`, `The condition \\(0<\\delta<\\phi\\) fails (\\(\\delta=${p.dec}^\\circ,\\ \\phi=${p.phi}^\\circ\\)), so the star does not cross the prime vertical above the horizon: ${p.dec >= p.phi ? 'it stays north of it throughout its visible path (like Vega from Cairo).' : 'it crosses it only below the horizon.'}`)], ans: '—' };
    const H = -acos(cH), h = asin(sh);
    return { steps: [
      S(`<b>المثلث PZX قائم عند Z</b> (الزاوية بين خط الزوال والدائرة الرأسية الأولى 90°). الوتر هو PX المقابل للزاوية القائمة. دائرة نابير: \\(PZ,\\ ZX,\\ 90^\\circ-\\angle X,\\ 90^\\circ-PX,\\ 90^\\circ-\\angle P\\).`, `<b>Triangle PZX has a right angle at Z</b> (meridian ⟂ prime vertical). The hypotenuse is PX. Napier’s circle: \\(PZ,\\ ZX,\\ 90^\\circ-\\angle X,\\ 90^\\circ-PX,\\ 90^\\circ-\\angle P\\).`),
      S(`الجزء الأوسط \\(90^\\circ-P\\)، والمجاوران PZ و \\(90^\\circ-PX\\):`, `Middle part \\(90^\\circ-P\\); adjacent parts PZ and \\(90^\\circ-PX\\):`) + `\\[\\cos H=\\tan PZ\\cot PX=\\cot\\phi\\tan\\delta=\\frac{\\tan\\delta}{\\tan\\phi}=${f(cH, 6)}\\]` +
        `\\[|H|=${deg(-H)}=${hmsT(-H / 15, 0)}\\]` + S(`فيكون شرقًا عند \\(H=-${f(-H / 15, 4)}^{\\mathrm h}\\) (قبل العبور)، وغربًا عند \\(H=+${f(-H / 15, 4)}^{\\mathrm h}\\).`, `So it is due east at \\(H=-${f(-H / 15, 4)}^{\\mathrm h}\\) (before transit) and due west at \\(H=+${f(-H / 15, 4)}^{\\mathrm h}\\).`),
      S(`والجزء الأوسط \\(90^\\circ-PX\\) مع الجزأين المقابلين PZ و ZX يعطي «فيثاغورس الكروية» \\(\\cos PX=\\cos PZ\\cos ZX\\):`, `Middle part \\(90^\\circ-PX\\) with the opposite parts PZ and ZX gives the spherical Pythagoras \\(\\cos PX=\\cos PZ\\cos ZX\\):`) +
        `\\[\\sin\\delta=\\sin\\phi\\,\\sin h\\ \\Rightarrow\\ \\sin h=\\frac{\\sin\\delta}{\\sin\\phi}=${f(sh, 6)}\\ \\Rightarrow\\ h=${box(DM(h))}\\]`,
      S(`<b>الأهمية العملية:</b> هنا \\(dh/dt=15''\\cos\\phi\\) لكل ثانية زمنية، وهي أقصى قيمة؛ ولذلك كانت الأرصاد عند الدائرة الرأسية الأولى أدق طريقة تقليدية لضبط الساعات.`, `<b>Practical importance:</b> here \\(dh/dt=15''\\cos\\phi\\) per second of time, the maximum; prime-vertical observations were the classical way of regulating clocks.`)],
      ans: `|H| = ${f(-H / 15, 4)} h, h = ${f(h, 3)}°` };
  } },
{ id: 'elong', ch: 'diurnal', lvl: 4,
  t: ['أقصى سمت لنجم الجدي وتحديد الشمال الحقيقي', 'Maximum azimuth of Polaris and true north'],
  inp: [['phi', ['العرض φ', 'Latitude φ'], 30.0444, '°'], ['dec', ['ميل الجدي δ (2026)', 'Polaris declination δ (2026)'], 89.3713, '°']],
  q: p => S(`نجم الجدي ميله \\(\\delta=${p.dec}^\\circ\\). من عرض \\(\\phi=${p.phi}^\\circ\\) أوجد أكبر انحراف لسمته عن الشمال الحقيقي، والزاوية الساعية والارتفاع في تلك اللحظة. ولماذا تكون هذه اللحظة الأنسب لتحديد الشمال؟`, `Polaris has \\(\\delta=${p.dec}^\\circ\\). From latitude \\(\\phi=${p.phi}^\\circ\\) find its maximum azimuth from true north, and the hour angle and altitude at that moment. Why is this the best moment to fix north?`),
  solve: p => {
    if (p.dec <= p.phi) return { steps: [S('الشرط δ > φ غير محقق: النجم ليس حول قطبي بالقدر الكافي ليكون له سمت أقصى.', 'Condition δ > φ fails: no maximum azimuth.')], ans: '—' };
    const sA = cos(p.dec) / cos(p.phi), Am = asin(sA), cH = tan(p.phi) / tan(p.dec), H = acos(cH), sh = sin(p.phi) / sin(p.dec), h = asin(sh);
    return { steps: [
      S(`<b>الفكرة:</b> عند أقصى سمت تكون الدائرة الرأسية ZX مماسة لدائرة الميل الصغيرة التي يرسمها النجم، والمماس عمودي على نصف القطر PX، فتكون <b>الزاوية عند X قائمة</b>.`, `<b>Idea:</b> at maximum azimuth the vertical circle ZX is tangent to the star’s diurnal circle, and the tangent is perpendicular to the radius PX, so the <b>angle at X is 90°</b>.`),
      S(`بقانون الجيوب مع \\(\\angle X=90^\\circ\\): \\(\\sin Z/\\sin PX=\\sin X/\\sin PZ\\):`, `Sine formula with \\(\\angle X=90^\\circ\\): \\(\\sin Z/\\sin PX=\\sin X/\\sin PZ\\):`) + `\\[\\sin A_{\\max}=\\frac{\\sin(90^\\circ-\\delta)}{\\sin(90^\\circ-\\phi)}=\\frac{\\cos\\delta}{\\cos\\phi}=${f(sA, 7)}\\Rightarrow A_{\\max}=${box(dms(Am, 1))}\\]`,
      S(`ومن قواعد نابير (الوتر PZ):`, `By Napier’s rules (hypotenuse PZ):`) + `\\[\\cos H=\\tan PX\\cot PZ=\\frac{\\tan\\phi}{\\tan\\delta}=${f(cH, 7)}\\Rightarrow H=\\pm${deg(H, 3)}=\\pm${hmsT(H / 15, 0)}\\]` +
        `\\[\\cos PZ=\\cos PX\\cos ZX\\ \\Rightarrow\\ \\sin h=\\frac{\\sin\\phi}{\\sin\\delta}=${f(sh, 7)}\\Rightarrow h=${dms(h, 0)}\\]`,
      S(`<b>لماذا هي الأنسب؟</b> عند أقصى قيمة يكون \\(dA/dt=0\\)، فخطأ صغير في توقيت الرصد لا يغير السمت تقريبًا. السمت الحقيقي للشمال = سمت الجدي المقيس ∓ ${f(Am * 60, 2)}′.`, `<b>Why best?</b> At the maximum \\(dA/dt=0\\), so a small timing error barely changes the azimuth. True north = measured azimuth of Polaris ∓ ${f(Am * 60, 2)}′.`)],
      ans: `A_max = ${f(Am * 60, 2)}′, H = ±${f(H / 15, 3)} h, h = ${f(h, 3)}°` };
  } },
{ id: 'rates', ch: 'diurnal', lvl: 4,
  t: ['معدلات تغير الارتفاع والسمت، والزاوية الاختلافية', 'Rates of change of altitude and azimuth; parallactic angle'],
  inp: [['phi', ['العرض φ', 'Latitude φ'], 30.0444, '°'], ['dec', ['الميل δ', 'Declination δ'], -16.716, '°'], ['H', ['الزاوية الساعية H (درجات، غرب +)', 'Hour angle H (deg, west +)'], -30, '°']],
  q: p => S(`نجم الشعرى اليمانية (\\(\\delta=${p.dec}^\\circ\\)) عند \\(H=${p.H}^\\circ\\) من عرض \\(${p.phi}^\\circ\\). أوجد: الارتفاع والسمت، ومعدلي تغيرهما بالدقائق القوسية لكل دقيقة زمنية، والزاوية الاختلافية q.`, `Sirius (\\(\\delta=${p.dec}^\\circ\\)) at \\(H=${p.H}^\\circ\\) from latitude \\(${p.phi}^\\circ\\). Find its altitude and azimuth, their rates of change in arcmin per minute of time, and the parallactic angle q.`),
  solve: p => {
    const [h, A] = horFrom(p.phi, p.dec, p.H); const k = 15.04107 / 60; // deg per min of solar time: 15.041 arcmin per min
    const dh = cos(p.phi) * sin(A), dA = sin(p.phi) - cos(p.phi) * tan(h) * cos(A);
    const q = atan2(sin(p.H), tan(p.phi) * cos(p.dec) - sin(p.dec) * cos(p.H));
    return { steps: [
      `\\[h=${DM(h)},\\qquad A=${DM(A)}\\]`,
      S(`<b>المشتقات</b> (H بالراديان؛ والساعة تتقدم بمعدل 15.041′ قوسية لكل دقيقة شمسية):`, `<b>Derivatives</b> (H in radians; the hour angle advances 15.041′ per solar minute):`) +
        `\\[\\frac{dh}{dH}=\\cos\\phi\\sin A=${f(dh, 5)},\\qquad \\frac{dA}{dH}=\\sin\\phi-\\cos\\phi\\tan h\\cos A=${f(dA, 5)}\\]` +
        `\\[\\frac{dh}{dt}=${f(dh * 15.041, 3)}'\\ /\\text{min},\\qquad \\frac{dA}{dt}=${f(dA * 15.041, 3)}'\\ /\\text{min}\\]`,
      S(`<b>الزاوية الاختلافية</b> (الزاوية عند X بين اتجاه القطب واتجاه السمت):`, `<b>Parallactic angle</b> (the angle at X between the directions to the pole and to the zenith):`) + `\\[\\tan q=\\frac{\\sin H}{\\tan\\phi\\cos\\delta-\\sin\\delta\\cos H}\\Rightarrow q=${box(deg(q, 3))}\\]`,
      S(`<b>تحقق مستقل:</b> \\(dA/dH=\\cos\\delta\\cos q/\\cos h=${f(cos(p.dec) * cos(q) / cos(h), 5)}\\) ✓. والزاوية q مهمة في تصوير الأجرام (دوران الحقل في التلسكوبات ذات الحامل السمتي) وفي رسم اتجاه قرن الهلال.`, `<b>Independent check:</b> \\(dA/dH=\\cos\\delta\\cos q/\\cos h=${f(cos(p.dec) * cos(q) / cos(h), 5)}\\) ✓. The angle q matters for imaging (field rotation in alt-az telescopes) and for drawing the crescent’s orientation.`)],
      ans: `dh/dt = ${f(dh * 15.041, 2)}′/min, dA/dt = ${f(dA * 15.041, 2)}′/min, q = ${f(q, 2)}°` };
  } },

{ id: 'circum', ch: 'diurnal', lvl: 4,
  t: ['تعيين العرض من رصد قرب الزوال (الاختزال إلى الزوال)', 'Latitude from a circum-meridian altitude (reduction to the meridian)'],
  inp: [['dec', ['ميل النجم δ', 'Declination δ'], -16.7161, '°'], ['hobs', ['الارتفاع المرصود (بعد تصحيح الانكسار)', 'Observed altitude (refraction removed)'], 42.95, '°'], ['Hm', ['الزمن قبل العبور (دقائق نجمية)', 'Time before transit (sidereal min)'], 12, 'min']],
  q: p => S(`رُصد نجم الشعرى (\\(\\delta=${p.dec}^\\circ\\)) جنوب السمت على ارتفاع \\(${p.hobs}^\\circ\\) قبل عبوره الزوال بـ ${p.Hm} دقيقة نجمية. أوجد عرض الراصد.`, `Sirius (\\(\\delta=${p.dec}^\\circ\\)) was observed south of the zenith at altitude \\(${p.hobs}^\\circ\\), ${p.Hm} sidereal minutes before transit. Find the observer’s latitude.`),
  solve: p => {
    const H = p.Hm / 4; let phi = 90 - p.hobs + p.dec; const its = [];
    for (let k = 0; k < 6; k++) { const hm = asin(sin(p.hobs) + 2 * cos(phi) * cos(p.dec) * Math.pow(sin(H / 2), 2)); const nphi = 90 - hm + p.dec; its.push([k, phi, hm, nphi]); if (Math.abs(nphi - phi) < 1e-9) { phi = nphi; break; } phi = nphi; }
    const check = horFrom(phi, p.dec, -H)[0];
    return { steps: [
      S(`<b>الفكرة:</b> قرب الزوال يتغير الارتفاع ببطء (لأن \\(dh/dH\\propto\\sin A\\approx0\\))، فيمكن «اختزال» الرصد إلى ارتفاع الزوال بتصحيح صغير. نكتب \\(\\cos H=1-2\\sin^2(H/2)\\) في قانون جيب التمام:`, `<b>Idea:</b> near the meridian the altitude changes slowly (\\(dh/dH\\propto\\sin A\\approx0\\)), so the observation can be “reduced” to the meridian altitude with a small correction. Write \\(\\cos H=1-2\\sin^2(H/2)\\) in the cosine formula:`) +
        `\\[\\sin h=\\cos(\\phi-\\delta)-2\\cos\\phi\\cos\\delta\\sin^2\\frac H2\\ \\Longrightarrow\\ \\sin h_{\\text{mer}}=\\sin h+2\\cos\\phi\\cos\\delta\\sin^2\\frac H2\\]`,
      S(`<b>الزاوية الساعية:</b> \\(H=${p.Hm}^{\\mathrm m}=${deg(H, 2)}\\). ولأن الطرف الأيمن يحتوي φ المجهولة نحل بالتكرار، مبتدئين بإهمال التصحيح: \\(\\phi_0=90^\\circ-h+\\delta\\) (النجم جنوب السمت):`, `<b>Hour angle:</b> \\(H=${p.Hm}^{\\mathrm m}=${deg(H, 2)}\\). The right side contains the unknown φ, so iterate, starting without the correction: \\(\\phi_0=90^\\circ-h+\\delta\\) (star south of the zenith):`) +
        `\\[\\begin{array}{c|c|c|c}k&\\phi_k&h_{\\text{mer}}&\\phi_{k+1}=90^\\circ-h_{\\text{mer}}+\\delta\\\\\\hline ${its.map(x => `${x[0]}&${f(x[1], 5)}^\\circ&${f(x[2], 5)}^\\circ&${f(x[3], 5)}^\\circ`).join('\\\\')}\\end{array}\\]`,
      S(`<b>النتيجة:</b>`, `<b>Result:</b>`) + `\\[\\phi=${box(DM(phi))}\\]` + S(`والتصحيح \\(h_{\\text{mer}}-h=${f((its[its.length - 1][2] - p.hobs) * 60, 2)}'\\) — لو أهملناه لأخطأنا في العرض بنفس المقدار (نحو ${f((its[its.length - 1][2] - p.hobs) * 60 * 1.852, 1)} كم!).`, `The correction \\(h_{\\text{mer}}-h=${f((its[its.length - 1][2] - p.hobs) * 60, 2)}'\\) — neglecting it would put the latitude wrong by as much (about ${f((its[its.length - 1][2] - p.hobs) * 60 * 1.852, 1)} km!).`),
      S(`<b>تحقق:</b> ارتفاع النجم المحسوب عند هذا العرض و H = −${f(H, 2)}° هو \\(${deg(check, 4)}\\) ✓.`, `<b>Check:</b> the computed altitude at this latitude and H = −${f(H, 2)}° is \\(${deg(check, 4)}\\) ✓.`)],
      ans: `φ = ${f(phi, 4)}°` };
  } },
{ id: 'fix', ch: 'coord', lvl: 4,
  t: ['تعيين الموقع (العرض والطول) من ارتفاعَي نجمين: طريقة التقاطع', 'Position fix (latitude and longitude) from two star altitudes: the intercept method'],
  inp: [['phT', ['العرض الحقيقي (لتوليد الأرصاد)', 'True latitude (to generate the data)'], 29.9326, '°'], ['laT', ['الطول الحقيقي', 'True longitude'], 31.8275, '°'], ['ph0', ['العرض المفترض φ₀', 'Assumed latitude φ₀'], 30.0444, '°'], ['la0', ['الطول المفترض λ₀', 'Assumed longitude λ₀'], 31.2357, '°'], ['gst', ['الزمن النجمي لغرينتش (درجات)', 'Greenwich sidereal time (deg)'], 30, '°']],
  q: p => S(`في لحظة كان فيها الزمن النجمي لغرينتش \\(${p.gst}^\\circ\\)، رصد ملاح ارتفاعَي نجمين: الشعرى (\\(\\alpha=101.287^\\circ,\\ \\delta=-16.716^\\circ\\)) والعيوق (\\(\\alpha=79.172^\\circ,\\ \\delta=+45.998^\\circ\\)). (الارتفاعان المرصودان محسوبان هنا من موقع مرصد القطامية الحقيقي ليتمكن الطالب من التحقق.) ابدأ من موقع مفترض (القاهرة) وأوجد موقع الراصد.`, `When Greenwich sidereal time was \\(${p.gst}^\\circ\\), a navigator measured the altitudes of Sirius (\\(\\alpha=101.287^\\circ,\\ \\delta=-16.716^\\circ\\)) and Capella (\\(\\alpha=79.172^\\circ,\\ \\delta=+45.998^\\circ\\)). (The observed altitudes are generated from the true position of Kottamia Observatory so the student can check.) Starting from an assumed position (Cairo), find the observer’s position.`),
  solve: p => {
    const st = [[101.287, -16.716], [79.172, 45.998]];
    const hobs = st.map(s => horFrom(p.phT, s[1], p.gst + p.laT - s[0])[0]);
    let ph = p.ph0, la = p.la0; const rows = [];
    for (let k = 0; k < 4; k++) {
      const c = st.map(s => horFrom(ph, s[1], p.gst + la - s[0]));
      const dh = c.map((x, i) => hobs[i] - x[0]);
      // dh = cosA dφ + cosφ sinA dλ
      const a11 = cos(c[0][1]), a12 = cos(ph) * sin(c[0][1]), a21 = cos(c[1][1]), a22 = cos(ph) * sin(c[1][1]);
      const det = a11 * a22 - a12 * a21, dphi = (dh[0] * a22 - a12 * dh[1]) / det, dla = (a11 * dh[1] - a21 * dh[0]) / det;
      rows.push([k, ph, la, c[0][0], c[1][0], dh[0] * 60, dh[1] * 60, c[0][1], c[1][1]]);
      ph += dphi; la += dla;
    }
    const r0 = rows[0];
    return { steps: [
      S(`<b>الارتفاعان المرصودان</b> (معطيان):`, `<b>Observed altitudes</b> (given):`) + `\\[h_1=${DM(hobs[0])},\\qquad h_2=${DM(hobs[1])}\\]`,
      S(`<b>من الموقع المفترض</b> نحسب لكل نجم الزاوية الساعية \\(H=\\text{GST}+\\lambda-\\alpha\\) ثم الارتفاع «المحسوب» \\(h_c\\) والسمت \\(A\\):`, `<b>From the assumed position</b> compute for each star \\(H=\\text{GST}+\\lambda-\\alpha\\), then the computed altitude \\(h_c\\) and azimuth A:`) +
        `\\[h_{c1}=${deg(r0[3])},\\ A_1=${deg(r0[7], 2)};\\qquad h_{c2}=${deg(r0[4])},\\ A_2=${deg(r0[8], 2)}\\]`,
      S(`<b>الفروق (intercepts):</b> \\(\\Delta h=h_{\\text{obs}}-h_c\\) بالدقائق القوسية (كل دقيقة = ميل بحري واحد على الأرض):`, `<b>Intercepts:</b> \\(\\Delta h=h_{\\text{obs}}-h_c\\) in arcmin (one arcmin = one nautical mile on Earth):`) + `\\[\\Delta h_1=${f(r0[5], 3)}',\\qquad \\Delta h_2=${f(r0[6], 3)}'\\]`,
      S(`<b>خط الموقع:</b> من التفاضل (الفصل 1) \\(\\partial h/\\partial\\phi=\\cos A\\) و \\(\\partial h/\\partial\\lambda=\\cos\\phi\\sin A\\)، فكل نجم يعطي معادلة خطية:`, `<b>Line of position:</b> from the differential formulae (chapter 1) \\(\\partial h/\\partial\\phi=\\cos A\\), \\(\\partial h/\\partial\\lambda=\\cos\\phi\\sin A\\), so each star gives a linear equation:`) +
        `\\[\\Delta h_i=\\cos A_i\\,\\Delta\\phi+\\cos\\phi\\sin A_i\\,\\Delta\\lambda\\]` + S(`وهي معادلة خط عمودي على اتجاه النجم (سمته)، يبعد عن الموقع المفترض بمقدار Δh. تقاطع الخطين هو الموقع المصحح.`, `— a line perpendicular to the star’s azimuth, at distance Δh from the assumed position. The two lines intersect at the corrected position.`),
      S(`<b>نحل المعادلتين ونكرر</b> (لأن الأرض كروية والخطوط تقريب):`, `<b>Solve the pair and iterate</b> (the lines are a linear approximation of circles):`) +
        `\\[\\begin{array}{c|c|c|c|c}k&\\phi_k&\\lambda_k&\\Delta h_1&\\Delta h_2\\\\\\hline ${rows.map(x => `${x[0]}&${f(x[1], 5)}^\\circ&${f(x[2], 5)}^\\circ&${f(x[5], 3)}'&${f(x[6], 3)}'`).join('\\\\')}\\end{array}\\]`,
      S(`<b>الموقع:</b>`, `<b>Position:</b>`) + `\\[\\phi=${box(DM(ph))},\\qquad \\lambda=${box(DM(la))}\\ \\text{E}\\]` + S(`وهو موقع مرصد القطامية ✓. هذه هي طريقة «مارك سانت هيلير» (1875) التي استخدمها الملاحون حتى ظهور GPS.`, `— the Kottamia Observatory ✓. This is Marcq St-Hilaire’s intercept method (1875), used by navigators until GPS.`)],
      ans: `φ = ${f(ph, 4)}°, λ = ${f(la, 4)}°` };
  } },
// ---------- refraction
{ id: 'refr1', ch: 'refr', lvl: 1,
  t: ['تصحيح الانكسار وتأثير الضغط والحرارة', 'Refraction correction with pressure and temperature'],
  inp: [['ha', ['الارتفاع الظاهر h′', 'Apparent altitude h′'], 20, '°'], ['P', ['الضغط (هكتوباسكال)', 'Pressure (hPa)'], 1013, ''], ['T', ['درجة الحرارة °C', 'Temperature °C'], 35, '']],
  q: p => S(`رُصد نجم على ارتفاع ظاهري \\(h'=${p.ha}^\\circ\\) في يوم حار (\\(T=${p.T}^\\circ\\)C، \\(P=${p.P}\\) هكتوباسكال). أوجد الانكسار والارتفاع الحقيقي.`, `A star is observed at apparent altitude \\(h'=${p.ha}^\\circ\\) on a hot day (\\(T=${p.T}^\\circ\\)C, \\(P=${p.P}\\) hPa). Find the refraction and the true altitude.`),
  solve: p => {
    const z = 90 - p.ha, R0 = 58.3 * tan(z) - 0.067 * Math.pow(tan(z), 3), Rb = 60 / Math.tan((p.ha + 7.31 / (p.ha + 4.4)) * D), k = p.P / 1010 * 283 / (273 + p.T);
    return { steps: [
      S(`<b>المسافة السمتية الظاهرة:</b> \\(z'=90^\\circ-h'=${deg(z, 2)}\\).`, `<b>Apparent zenith distance:</b> \\(z'=90^\\circ-h'=${deg(z, 2)}\\).`),
      S(`<b>الصيغة الكلاسيكية</b> (صالحة حتى \\(z'\\approx 75^\\circ\\)):`, `<b>Classical formula</b> (valid to \\(z'\\approx 75^\\circ\\)):`) + `\\[R_0=58.3''\\tan z'-0.067''\\tan^3 z'=${f(58.3 * tan(z), 2)}''-${f(0.067 * Math.pow(tan(z), 3), 2)}''=${f(R0, 2)}''\\]`,
      S(`<b>صيغة بينيت</b> للمقارنة:`, `<b>Bennett’s formula</b> for comparison:`) + `\\[R=\\cot\\!\\left(h'+\\frac{7.31}{h'+4.4}\\right)'=${f(Rb, 2)}''\\]`,
      S(`<b>تصحيح الضغط والحرارة:</b> الهواء الساخن أقل كثافة، فينكسر الضوء أقل:`, `<b>Pressure–temperature correction:</b> hot air is less dense, so it bends light less:`) + `\\[k=\\frac{P}{1010}\\cdot\\frac{283}{273+T}=${f(k, 4)}\\Rightarrow R=${f(k * R0, 2)}''\\]`,
      S(`<b>الارتفاع الحقيقي</b> (الانكسار يرفع الجرم، فنطرحه):`, `<b>True altitude</b> (refraction raises the object, so subtract):`) + `\\[h=h'-R=${box(dms(p.ha - k * R0 / 3600, 1))}\\]`],
      ans: `R = ${f(k * R0, 1)}″` };
  } },
{ id: 'refr2', ch: 'refr', lvl: 4,
  t: ['تفلطح قرص الشمس الغاربة', 'The flattened setting Sun'],
  inp: [['hc', ['الارتفاع الظاهر لمركز الشمس', 'Apparent altitude of the Sun’s centre'], 0.3, '°'], ['sd', ['نصف قطر الشمس الزاوي', 'Solar semi-diameter'], 16, '′']],
  q: p => S(`مركز قرص الشمس يُرى على ارتفاع \\(${p.hc}^\\circ\\) ونصف قطرها الزاوي \\(${p.sd}'\\). باستخدام صيغة بينيت أوجد القطر الرأسي الظاهر للقرص ونسبة تفلطحه.`, `The Sun’s centre appears at altitude \\(${p.hc}^\\circ\\) and its semi-diameter is \\(${p.sd}'\\). Using Bennett’s formula find the apparent vertical diameter and the flattening ratio.`),
  solve: p => {
    const Rb = h => 1 / Math.tan((h + 7.31 / (h + 4.4)) * D); // arcmin, h apparent deg
    // find apparent altitudes of limbs: true limb altitudes = true centre ± sd
    const hcTrue = p.hc - Rb(p.hc) / 60;
    const app = ht => { let x = ht; for (let i = 0; i < 30; i++) x = ht + Rb(x) / 60; return x; };
    const up = app(hcTrue + p.sd / 60), lo = app(hcTrue - p.sd / 60), vd = (up - lo) * 60;
    return { steps: [
      S(`<b>الارتفاع الحقيقي للمركز:</b> \\(R(${p.hc}^\\circ)=${f(Rb(p.hc), 2)}'\\Rightarrow h_c=${f(p.hc, 3)}^\\circ-${f(Rb(p.hc) / 60, 4)}^\\circ=${deg(hcTrue)}\\).`, `<b>True altitude of the centre:</b> \\(R(${p.hc}^\\circ)=${f(Rb(p.hc), 2)}'\\Rightarrow h_c=${f(p.hc, 3)}^\\circ-${f(Rb(p.hc) / 60, 4)}^\\circ=${deg(hcTrue)}\\).`),
      S(`<b>الحافتان الحقيقيتان:</b> \\(h_c\\pm${p.sd}'\\). لكل حافة نحل \\(h'=h+R(h')\\) بالتكرار (لأن R يعتمد على الارتفاع الظاهر):`, `<b>True limbs:</b> \\(h_c\\pm${p.sd}'\\). For each limb solve \\(h'=h+R(h')\\) iteratively (R depends on the apparent altitude):`) +
        `\\[h'_{\\text{upper}}=${deg(up)},\\qquad h'_{\\text{lower}}=${deg(lo)}\\]`,
      S(`<b>القطر الرأسي الظاهر:</b>`, `<b>Apparent vertical diameter:</b>`) + `\\[d_v=h'_{\\text{upper}}-h'_{\\text{lower}}=${box(f(vd, 2) + "'")}\\quad\\text{${S('مقابل القطر الأفقي', 'vs horizontal diameter')}}\\ ${2 * p.sd}'\\]`,
      S(`<b>نسبة التفلطح</b> \\(d_v/d_h=${f(vd / (2 * p.sd), 3)}\\)، أي أن القرص يبدو بيضاويًا مضغوطًا بنسبة ${f((1 - vd / (2 * p.sd)) * 100, 1)}٪. السبب أن الانكسار عند الحافة السفلى (الأقرب للأفق) أكبر منه عند العليا بنحو ${f(Rb(lo) - Rb(up), 1)}′.`, `<b>Flattening</b> \\(d_v/d_h=${f(vd / (2 * p.sd), 3)}\\): the disc looks squashed by ${f((1 - vd / (2 * p.sd)) * 100, 1)}%, because refraction at the lower limb exceeds that at the upper limb by about ${f(Rb(lo) - Rb(up), 1)}′.`)],
      ans: `d_v = ${f(vd, 1)}′ (${f(vd / (2 * p.sd), 3)})` };
  } },
// ---------- twilight
{ id: 'twi1', ch: 'twi', lvl: 1,
  t: ['مدة الشفق المدني والبحري والفلكي', 'Duration of civil, nautical and astronomical twilight'],
  inp: [['phi', ['العرض φ', 'Latitude φ'], 30.0444, '°'], ['dec', ['ميل الشمس δ☉', 'Solar declination δ☉'], 0, '°']],
  q: p => S(`على عرض \\(${p.phi}^\\circ\\) وميل الشمس \\(${p.dec}^\\circ\\)، أوجد مدة الشفق المسائي بأنواعه الثلاثة (الغروب عند \\(h=-0^\\circ 50'\\)).`, `At latitude \\(${p.phi}^\\circ\\) with solar declination \\(${p.dec}^\\circ\\), find the duration of evening civil, nautical and astronomical twilight (sunset at \\(h=-0^\\circ 50'\\)).`),
  solve: p => {
    const Hh = h => acos((sin(h) - sin(p.phi) * sin(p.dec)) / (cos(p.phi) * cos(p.dec)));
    const H0 = Hh(-50 / 60), H6 = Hh(-6), H12 = Hh(-12), H18 = Hh(-18), m = x => (x - H0) * 4 / 1.0027379;
    return { steps: [
      S(`لكل ارتفاع h نحسب الزاوية الساعية من \\(\\cos H=\\dfrac{\\sin h-\\sin\\phi\\sin\\delta}{\\cos\\phi\\cos\\delta}\\):`, `For each altitude h compute the hour angle from \\(\\cos H=\\dfrac{\\sin h-\\sin\\phi\\sin\\delta}{\\cos\\phi\\cos\\delta}\\):`) +
        `\\[H(-0^\\circ50')=${deg(H0, 3)},\\ H(-6^\\circ)=${deg(H6, 3)},\\ H(-12^\\circ)=${deg(H12, 3)},\\ H(-18^\\circ)=${deg(H18, 3)}\\]`,
      S(`المدة = الفرق × 4 دقائق لكل درجة (÷1.0027379 للزمن الشمسي، لأن الشمس تتحرك شرقًا قليلًا):`, `Duration = difference × 4 min per degree (÷1.0027379 for solar time):`) +
        `\\[T_{\\text{civil}}=${box(f(m(H6), 1) + '\\ \\text{min}')},\\quad T_{\\text{naut}}=${box(f(m(H12), 1) + '\\ \\text{min}')},\\quad T_{\\text{astro}}=${box(f(m(H18), 1) + '\\ \\text{min}')}\\]`,
      S(`<b>ملاحظة فقهية–فلكية:</b> نهاية الشفق الفلكي (−18°) قريبة من معيار العشاء في الهيئة المصرية (−17.5°)، وبدايته صباحًا قريبة من معيار الفجر (−19.5°).`, `<b>Note:</b> the end of astronomical twilight (−18°) is close to the Egyptian Survey Isha criterion (−17.5°), and its morning start close to the Fajr criterion (−19.5°).`)],
      ans: `${f(m(H6), 1)} / ${f(m(H12), 1)} / ${f(m(H18), 1)} min` };
  } },
{ id: 'twi2', ch: 'twi', lvl: 4,
  t: ['أقصر شفق في السنة (مسألة كلاسيكية)', 'The shortest twilight of the year (a classic)'],
  inp: [['phi', ['العرض φ', 'Latitude φ'], 30.0444, '°'], ['Dp', ['انخفاض نهاية الشفق D', 'Depression at the end D'], 18, '°']],
  q: p => S(`أثبت أن الشفق (من \\(h=0\\) إلى \\(h=-${p.Dp}^\\circ\\)) يكون أقصر ما يمكن عندما \\(\\sin\\delta=-\\sin\\phi\\tan\\frac{D}{2}\\)، ثم احسب هذا الميل والمدة الدنيا لعرض \\(${p.phi}^\\circ\\)، وحدد تاريخيه التقريبيين.`, `Show that twilight (from \\(h=0\\) to \\(h=-${p.Dp}^\\circ\\)) is shortest when \\(\\sin\\delta=-\\sin\\phi\\tan\\frac{D}{2}\\); then compute this declination and the minimum duration for latitude \\(${p.phi}^\\circ\\), and find the approximate dates.`),
  solve: p => {
    const dm = asin(-sin(p.phi) * tan(p.Dp / 2)), Tm = 2 * asin(sin(p.Dp / 2) / cos(p.phi));
    const Hh = (h, d) => acos((sin(h) - sin(p.phi) * sin(d)) / (cos(p.phi) * cos(d)));
    const num = Hh(-p.Dp, dm) - Hh(0, dm);
    // solar longitude for declination: sin δ = sin ε sin λ
    const lam1 = asin(sin(dm) / sin(23.4393)), lamA = n360(180 - lam1), lamB = n360(lam1 + 360);
    const sunLon = J => { const T = (J - 2451545) / 36525, L0 = 280.46646 + 36000.76983 * T, M = 357.52911 + 35999.05029 * T; return n360(L0 + 1.914602 * sin(M) + 0.019993 * sin(2 * M)); };
    const toDate = l => { const J0 = jd(2026, 9, 1, 0); let best = 0, bd = 1e9; for (let k = 0; k < 366; k++) { const d = Math.abs(((sunLon(J0 + k) - l + 540) % 360) - 180); if (d < bd) { bd = d; best = k; } } return new Date(Date.UTC(2026, 8, 1) + best * 86400000).toISOString().slice(0, 10); };
    return { steps: [
      S(`<b>الإعداد:</b> لتكن \\(H_1\\) و \\(H_2\\) الزاويتين الساعيتين عند \\(h=0\\) و \\(h=-D\\):`, `<b>Set-up:</b> let \\(H_1\\), \\(H_2\\) be the hour angles at \\(h=0\\) and \\(h=-D\\):`) +
        `\\[\\cos H_1=-\\tan\\phi\\tan\\delta,\\qquad \\cos H_2=\\frac{-\\sin D-\\sin\\phi\\sin\\delta}{\\cos\\phi\\cos\\delta}\\]`,
      S(`نريد أصغر \\(T=H_2-H_1\\) كدالة في δ، أي \\(dH_2/d\\delta=dH_1/d\\delta\\). بتفاضل \\(\\cos H=(\\sin h-\\sin\\phi\\sin\\delta)/(\\cos\\phi\\cos\\delta)\\) مع ثبات h:`, `Minimise \\(T=H_2-H_1\\) as a function of δ: \\(dH_2/d\\delta=dH_1/d\\delta\\). Differentiating \\(\\cos H=(\\sin h-\\sin\\phi\\sin\\delta)/(\\cos\\phi\\cos\\delta)\\) at fixed h:`) +
        `\\[\\frac{d(\\cos H)}{d\\delta}=\\cos H\\tan\\delta-\\tan\\phi\\ \\Longrightarrow\\ \\cos\\delta\\,\\frac{dH}{d\\delta}=\\frac{\\tan\\phi\\cos\\delta-\\sin\\delta\\cos H}{\\sin H}=\\cot q\\]` +
        S(`فالشرط هو تساوي الزاوية الاختلافية في اللحظتين: \\(q_1=q_2\\). هندسيًا: المثلثان \\(PZX_1\\) و \\(PZX_2\\) يشتركان في PZ ويتساوى فيهما PX، ومع تساوي الزاويتين عند X يكون القوس \\(X_1X_2\\) مقسومًا بالتماثل، ويؤدي الحل إلى:`, `So the condition is equal parallactic angles at the two instants: \\(q_1=q_2\\). Geometrically, triangles \\(PZX_1\\), \\(PZX_2\\) share PZ and have equal PX; equal angles at X make the configuration symmetric, and the solution is:`) +
        `\\[\\boxed{\\sin\\delta=-\\sin\\phi\\tan\\frac D2},\\qquad \\boxed{\\sin\\frac{T_{\\min}}{2}=\\frac{\\sin(D/2)}{\\cos\\phi}}\\]`,
      S(`<b>بالأرقام:</b>`, `<b>Numbers:</b>`) + `\\[\\sin\\delta=-${f(sin(p.phi), 6)}\\times${f(tan(p.Dp / 2), 6)}=${f(sin(dm), 6)}\\Rightarrow\\delta=${deg(dm, 3)}\\]` +
        `\\[\\sin\\frac{T_{\\min}}{2}=\\frac{${f(sin(p.Dp / 2), 6)}}{${f(cos(p.phi), 6)}}\\Rightarrow T_{\\min}=${deg(Tm, 3)}=${box(f(Tm * 4 / 1.0027379, 1) + '\\ \\text{min}')}\\]`,
      S(`<b>تحقق عددي:</b> بحساب \\(H_2-H_1\\) مباشرة عند هذا الميل نحصل على \\(${deg(num, 3)}\\) ✓.`, `<b>Numerical check:</b> computing \\(H_2-H_1\\) directly at this declination gives \\(${deg(num, 3)}\\) ✓.`),
      S(`<b>التاريخان:</b> \\(\\sin\\lambda_\\odot=\\sin\\delta/\\sin\\varepsilon\\Rightarrow\\lambda_\\odot\\approx${f(lamA, 1)}^\\circ\\) و \\(${f(lamB, 1)}^\\circ\\)، أي تقريبًا ${toDate(lamA)} و ${toDate(lamB)} (قبل الاعتدال الربيعي وبعد الاعتدال الخريفي بنحو أسبوعين، وليس عند الاعتدالين كما قد يُظن).`, `<b>Dates:</b> \\(\\sin\\lambda_\\odot=\\sin\\delta/\\sin\\varepsilon\\Rightarrow\\lambda_\\odot\\approx${f(lamA, 1)}^\\circ\\) and \\(${f(lamB, 1)}^\\circ\\), i.e. about ${toDate(lamA)} and ${toDate(lamB)} — some two weeks after the September equinox and before the March equinox, not at the equinoxes as one might guess.`)],
      ans: `δ = ${f(dm, 2)}°, T_min = ${f(Tm * 4 / 1.0027379, 1)} min` };
  } },
{ id: 'twi3', ch: 'twi', lvl: 2,
  t: ['الليالي البيضاء (قازان مثالًا)', 'White nights (Kazan as an example)'],
  inp: [['phi', ['العرض φ', 'Latitude φ'], 55.79, '°'], ['eps', ['ميل البروج ε', 'Obliquity ε'], 23.4393, '°']],
  q: p => S(`على عرض \\(${p.phi}^\\circ\\) (قازان): ما أدنى ارتفاع للشمس ليلة الانقلاب الصيفي؟ وهل ينتهي الشفق الفلكي؟ وما المدى الزمني من السنة الذي لا يحل فيه ليل فلكي؟`, `At latitude \\(${p.phi}^\\circ\\) (Kazan): what is the Sun’s lowest altitude on the June-solstice night? Does astronomical twilight end? For which part of the year is there no astronomical night?`),
  solve: p => {
    const hl = p.phi + p.eps - 90, dLim = 90 - 18 - p.phi; // need δ > dLim
    const lam = asin(sin(dLim) / sin(p.eps)); const days = (180 - 2 * lam) / 360 * 365.2422;
    return { steps: [
      S(`<b>العبور السفلي للشمس:</b> \\(h_{\\text{low}}=\\phi+\\delta-90^\\circ=${p.phi}+${p.eps}-90=${box(deg(hl, 2))}\\).`, `<b>Sun’s lower culmination:</b> \\(h_{\\text{low}}=\\phi+\\delta-90^\\circ=${p.phi}+${p.eps}-90=${box(deg(hl, 2))}\\).`),
      hl > -18 ? S(`الارتفاع أعلى من −18°، فالشفق الفلكي <b>لا ينتهي</b> ليلًا: «ليالٍ بيضاء».`, `Above −18°: astronomical twilight <b>never ends</b> — “white nights”.`) : S(`الارتفاع أقل من −18°، فيوجد ليل فلكي حتى في الانقلاب.`, `Below −18°: there is astronomical night even at the solstice.`),
      S(`<b>المدى:</b> لا يحل ليل فلكي ما دام \\(\\delta_\\odot>90^\\circ-18^\\circ-\\phi=${deg(dLim, 2)}\\). ومن \\(\\sin\\delta=\\sin\\varepsilon\\sin\\lambda\\): \\(\\lambda_\\odot\\) بين \\(${f(lam, 1)}^\\circ\\) و \\(${f(180 - lam, 1)}^\\circ\\)، أي نحو`, `<b>Interval:</b> no astronomical night while \\(\\delta_\\odot>90^\\circ-18^\\circ-\\phi=${deg(dLim, 2)}\\). From \\(\\sin\\delta=\\sin\\varepsilon\\sin\\lambda\\): \\(\\lambda_\\odot\\) between \\(${f(lam, 1)}^\\circ\\) and \\(${f(180 - lam, 1)}^\\circ\\), i.e. about`) + `\\[${box(f(days, 0))}\\ \\text{${S('يومًا', 'days')}}\\]`,
      S(`(تقريب: سرعة الشمس على البروج منتظمة؛ والخطأ بضعة أيام. وأقل عرض للظاهرة \\(90-18-23.44=48.56^\\circ\\).)`, `(Approximation: uniform solar motion; error a few days. The lowest latitude for the effect is \\(90-18-23.44=48.56^\\circ\\).)`)],
      ans: hl > -18 ? `${f(days, 0)} d` : '—' };
  } },
// ---------- time
{ id: 'lst', ch: 'time', lvl: 1,
  t: ['حساب الزمن النجمي المحلي', 'Computing local sidereal time'],
  inp: [['Y', ['السنة', 'Year'], 2026, ''], ['M', ['الشهر', 'Month'], 11, ''], ['Dd', ['اليوم', 'Day'], 20, ''], ['ut', ['الساعة UT', 'Hour UT'], 18, 'h'], ['lon', ['خط الطول (شرق)', 'Longitude (E)'], 31.2357, '°']],
  q: p => S(`احسب الزمن النجمي المحلي في القاهرة (\\(\\lambda=${p.lon}^\\circ\\)E) يوم ${p.Y}/${p.M}/${p.Dd} الساعة \\(${p.ut}^{\\mathrm h}\\) UT. وأي نجم لامع يعبر الزوال تقريبًا في هذه اللحظة؟`, `Compute the local sidereal time at Cairo (\\(\\lambda=${p.lon}^\\circ\\)E) on ${p.Y}-${p.M}-${p.Dd} at \\(${p.ut}^{\\mathrm h}\\) UT. Which bright star is near the meridian then?`),
  solve: p => {
    const J0 = jd(p.Y, p.M, p.Dd, 0), J = J0 + p.ut / 24, T = (J0 - 2451545) / 36525;
    const g0 = n360(100.46061837 + 36000.770053608 * T + 0.000387933 * T * T - T * T * T / 38710000);
    const g = n360(g0 + 360.98564736629 * (p.ut / 24)), l = n360(g + p.lon), gm = gmst(J);
    const stars = [['الشعرى اليمانية', 'Sirius', 101.29], ['منكب الجوزاء', 'Betelgeuse', 88.79], ['العيوق', 'Capella', 79.17], ['الدبران', 'Aldebaran', 68.98], ['الثريا', 'Pleiades', 56.75], ['رجل الجبار', 'Rigel', 78.63], ['قلب الأسد', 'Regulus', 152.09], ['السماك الرامح', 'Arcturus', 213.92], ['النسر الواقع', 'Vega', 279.23], ['ذنب الدجاجة', 'Deneb', 310.36], ['فم الحوت', 'Fomalhaut', 344.41], ['قلب العقرب', 'Antares', 247.35], ['النسر الطائر', 'Altair', 297.70]];
    let best = stars[0], bd = 999; for (const s of stars) { const d = Math.abs(((s[2] - l + 540) % 360) - 180); if (d < bd) { bd = d; best = s; } }
    return { steps: [
      S(`<b>اليوم الجولياني</b> عند 0ʰ UT (Meeus 7.1):`, `<b>Julian Day</b> at 0ʰ UT (Meeus 7.1):`) + `\\[JD_0=${f(J0, 1)},\\qquad T=\\frac{JD_0-2451545.0}{36525}=${f(T, 9)}\\]`,
      S(`<b>الزمن النجمي في غرينتش عند 0ʰ UT:</b>`, `<b>Greenwich sidereal time at 0ʰ UT:</b>`) + `\\[\\theta_0=100.46061837^\\circ+36000.770053608^\\circ T+0.000387933\\,T^2-\\frac{T^3}{38710000}=${deg(g0)}\\]`,
      S(`<b>أضف دوران ${p.ut} ساعة شمسية</b> (كل ساعة شمسية = 1.0027379 ساعة نجمية = 15.041069°):`, `<b>Add ${p.ut} solar hours</b> (each = 1.0027379 sidereal hours = 15.041069°):`) + `\\[\\theta=\\theta_0+${p.ut}\\times15.041069^\\circ=${deg(g)}\\ (\\text{mod }360^\\circ)\\]`,
      S(`<b>أضف خط الطول الشرقي:</b>`, `<b>Add the east longitude:</b>`) + `\\[\\text{LST}=\\theta+\\lambda=${deg(l)}=${box(hmsT(l / 15, 1))}\\]`,
      S(`<b>تحقق</b> بالصيغة المباشرة (Meeus 12.4) للحظة نفسها: \\(\\theta=${deg(gm)}\\) ✓. والنجم الذي يعبر الزوال الآن هو الذي مطلعه المستقيم ≈ LST: <b>${best[0]}</b> (α = ${f(best[2] / 15, 2)}ʰ).`, `<b>Check</b> with the direct formula (Meeus 12.4) at the same instant: \\(\\theta=${deg(gm)}\\) ✓. The star now transiting is the one with α ≈ LST: <b>${best[1]}</b> (α = ${f(best[2] / 15, 2)}ʰ).`)],
      ans: `LST = ${f(l / 15, 4)} h` };
  } },
{ id: 'eot', ch: 'time', lvl: 2,
  t: ['معادلة الزمن ووقت الظهر الحقيقي', 'Equation of time and true noon'],
  inp: [['Y', ['السنة', 'Year'], 2026, ''], ['M', ['الشهر', 'Month'], 11, ''], ['Dd', ['اليوم', 'Day'], 3, ''], ['lon', ['خط الطول (شرق)', 'Longitude (E)'], 31.2357, '°'], ['zone', ['خط طول المنطقة الزمنية', 'Time-zone meridian'], 30, '°']],
  q: p => S(`احسب معادلة الزمن يوم ${p.Y}/${p.M}/${p.Dd}، ثم وقت الظهر الحقيقي (عبور الشمس) في القاهرة بتوقيت المنطقة (خط طولها \\(${p.zone}^\\circ\\)).`, `Compute the equation of time on ${p.Y}-${p.M}-${p.Dd}, then the time of true noon (solar transit) at Cairo in zone time (zone meridian \\(${p.zone}^\\circ\\)).`),
  solve: p => {
    const J = jd(p.Y, p.M, p.Dd, 12 - p.lon / 15), T = (J - 2451545) / 36525;
    const L0 = n360(280.46646 + 36000.76983 * T + 0.0003032 * T * T), Mm = n360(357.52911 + 35999.05029 * T - 0.0001537 * T * T), e = 0.016708634 - 0.000042037 * T;
    const C = (1.914602 - 0.004817 * T) * sin(Mm) + (0.019993 - 0.000101 * T) * sin(2 * Mm) + 0.000289 * sin(3 * Mm);
    const lam = L0 + C - 0.00569 - 0.00478 * sin(125.04 - 1934.136 * T), eps = 23.4392911 - 0.0130042 * T + 0.00256 * cos(125.04 - 1934.136 * T);
    const al = n360(atan2(cos(eps) * sin(lam), cos(lam)));
    let E = L0 - 0.0057183 - al; E = ((E + 540) % 360) - 180; const Em = E * 4;
    const noon = 12 - Em / 60 + (p.zone - p.lon) / 15;
    return { steps: [
      S(`<b>الزمن بالقرون الجوليانية</b> قرب الظهر المحلي: \\(T=${f(T, 8)}\\).`, `<b>Time in Julian centuries</b> near local noon: \\(T=${f(T, 8)}\\).`),
      S(`<b>الطول المتوسط والشذوذ المتوسط للشمس:</b>`, `<b>Sun’s mean longitude and mean anomaly:</b>`) + `\\[L_0=${deg(L0)},\\qquad M=${deg(Mm)}\\]`,
      S(`<b>معادلة المركز</b> (أثر الإهليلجية) والطول الحقيقي ثم الظاهري (بالزيغان والترنح):`, `<b>Equation of the centre</b> (eccentricity effect), true then apparent longitude (aberration + nutation):`) + `\\[C=${deg(C)},\\qquad \\lambda_\\odot=L_0+C-0.00569^\\circ-0.00478^\\circ\\sin\\Omega=${deg(lam)}\\]`,
      S(`<b>المطلع المستقيم</b> (أثر الميل): \\(\\alpha_\\odot=\\operatorname{atan2}(\\cos\\varepsilon\\sin\\lambda,\\cos\\lambda)=${deg(al)}\\).`, `<b>Right ascension</b> (obliquity effect): \\(\\alpha_\\odot=\\operatorname{atan2}(\\cos\\varepsilon\\sin\\lambda,\\cos\\lambda)=${deg(al)}\\).`),
      S(`<b>معادلة الزمن</b> = المطلع المستقيم للشمس المتوسطة − المطلع المستقيم للشمس الحقيقية:`, `<b>Equation of time</b> = RA of the mean Sun − RA of the true Sun:`) + `\\[E=L_0-0.0057183^\\circ-\\alpha_\\odot=${deg(E)}\\ \\Rightarrow\\ E=${box(f(Em, 2) + '\\ \\text{min}')}\\]`,
      S(`<b>الظهر الحقيقي بتوقيت المنطقة:</b>`, `<b>True noon in zone time:</b>`) + `\\[t=12^{\\mathrm h}-E+\\frac{\\lambda_z-\\lambda}{15}=12^{\\mathrm h}-${f(Em, 2)}^{\\mathrm m}+\\frac{${p.zone}-${p.lon}}{15}=${box(hmsT(noon, 0))}\\]`,
      S(`(في أوائل نوفمبر تبلغ E أقصى قيمة موجبة ≈ +16.4 دقيقة؛ ولهذا يكون الظهر في القاهرة حوالي 11:39 بالتوقيت الشتوي.)`, `(In early November E reaches its maximum ≈ +16.4 min, which is why noon in Cairo is about 11:39 in winter time.)`)],
      ans: `E = ${f(Em, 2)} min, noon ${Math.floor(noon)}:${String(Math.round((noon % 1) * 60)).padStart(2, '0')}` };
  } },
{ id: 'sidint', ch: 'time', lvl: 1,
  t: ['تحويل الفترات بين الزمن النجمي والشمسي', 'Converting intervals between sidereal and solar time'],
  inp: [['hh', ['فترة شمسية (ساعات)', 'Solar interval (hours)'], 24, 'h']],
  q: p => S(`نجم يعبر الزوال الليلة الساعة 21:00. متى يعبر بعد ${p.hh} ساعة شمسية؟ ومتى يعبر في الوقت نفسه بعد شهر؟`, `A star transits tonight at 21:00. When does it transit after ${p.hh} solar hours? At what time will it transit one month later?`),
  solve: p => {
    const k = 1.00273790935, sid = p.hh * k, day = 24 / k;
    return { steps: [
      S(`<b>العلاقة:</b> \\(\\Delta t_{\\text{sid}}=1.00273790935\\,\\Delta t_{\\text{sol}}\\). فـ ${p.hh} ساعة شمسية = \\(${f(sid, 6)}\\) ساعة نجمية.`, `<b>Relation:</b> \\(\\Delta t_{\\text{sid}}=1.00273790935\\,\\Delta t_{\\text{sol}}\\). So ${p.hh} solar hours = \\(${f(sid, 6)}\\) sidereal hours.`),
      S(`<b>اليوم النجمي بالزمن الشمسي:</b> \\(24/1.00273790935=${f(day, 6)}^{\\mathrm h}=${hmsT(day, 4)}\\). فالنجم يعبر كل يوم أبكر بـ \\(${f((24 - day) * 60, 3)}\\) دقيقة (≈ 3ᵐ 56ˢ).`, `<b>Sidereal day in solar time:</b> \\(24/1.00273790935=${f(day, 6)}^{\\mathrm h}=${hmsT(day, 4)}\\). The star transits \\(${f((24 - day) * 60, 3)}\\) min earlier each day (≈ 3ᵐ 56ˢ).`),
      S(`<b>بعد 30 يومًا</b> يتقدم العبور \\(30\\times3.9344=${f(30 * (24 - day) * 60, 1)}\\) دقيقة ≈ ساعتين، فيعبر نحو ${hmsT(21 - 30 * (24 - day), 0)}. لهذا تتغير سماء المساء مع الفصول.`, `<b>After 30 days</b> the transit is \\(30\\times3.9344=${f(30 * (24 - day) * 60, 1)}\\) min ≈ 2 h earlier, near ${hmsT(21 - 30 * (24 - day), 0)}. That is why the evening sky changes with the seasons.`)],
      ans: `${f(sid, 4)} h sid.` };
  } },
// ---------- Kepler
{ id: 'kep1', ch: 'kepler', lvl: 2,
  t: ['موضع الأرض في مدارها في تاريخ معين', 'Earth’s position in its orbit on a given date'],
  inp: [['days', ['أيام منذ الحضيض (3 يناير)', 'Days since perihelion (3 Jan)'], 321, 'd'], ['e', ['الاختلاف المركزي e', 'Eccentricity e'], 0.0167086, '']],
  q: p => S(`مرت الأرض بالحضيض يوم 3 يناير. أوجد شذوذها الحقيقي وبعدها عن الشمس بعد ${p.days} يومًا (الدورة 365.2596 يومًا، e = ${p.e}، a = 1 و.ف).`, `Earth passed perihelion on 3 January. Find its true anomaly and distance from the Sun ${p.days} days later (period 365.2596 d, e = ${p.e}, a = 1 AU).`),
  solve: p => {
    const n = 360 / 365.2596, M = n360(n * p.days), sol = solveKep(M, p.e), E = sol.E, nu = n360(2 * atan2(Math.sqrt(1 + p.e) * sin(E / 2), Math.sqrt(1 - p.e) * cos(E / 2))), r = 1 - p.e * cos(E);
    const eoc = (2 * p.e * sin(M) + 1.25 * p.e * p.e * sin(2 * M) + p.e ** 3 * (13 / 12 * sin(3 * M) - 0.25 * sin(M))) * R;
    return { steps: [
      S(`<b>الحركة المتوسطة والشذوذ المتوسط:</b>`, `<b>Mean motion and mean anomaly:</b>`) + `\\[n=\\frac{360^\\circ}{365.2596}=${f(n, 7)}^\\circ/\\text{d},\\qquad M=n\\,t=${deg(M)}=${f(M * D, 7)}\\ \\text{rad}\\]`,
      S(`<b>معادلة كبلر بطريقة نيوتن</b> (\\(E_0=M\\)):`, `<b>Kepler’s equation by Newton</b> (\\(E_0=M\\)):`) + `\\[\\begin{array}{c|c|c}k & E_k\\ (\\text{rad}) & f(E_k)\\\\\\hline ${sol.it.map(x => `${x[0]} & ${x[1].toFixed(10)} & ${x[2].toExponential(2)}`).join('\\\\')}\\end{array}\\]` + `\\[E=${deg(E)}\\]`,
      S(`<b>الشذوذ الحقيقي والبعد:</b>`, `<b>True anomaly and distance:</b>`) + `\\[\\tan\\frac\\nu2=\\sqrt{\\frac{1+e}{1-e}}\\tan\\frac E2\\Rightarrow\\nu=${box(deg(nu))},\\qquad r=a(1-e\\cos E)=${box(f(r, 6) + '\\ \\text{AU}')}\\]`,
      S(`<b>تحقق بمعادلة المركز:</b> \\(\\nu-M\\approx${deg(eoc)}\\)، والدقيق \\(${deg(((nu - M + 540) % 360) - 180)}\\) ✓. والبعد بالكيلومترات \\(${f(r * 149597870.7 / 1e6, 3)}\\) مليون كم.`, `<b>Check with the equation of the centre:</b> \\(\\nu-M\\approx${deg(eoc)}\\), exact \\(${deg(((nu - M + 540) % 360) - 180)}\\) ✓. Distance \\(${f(r * 149597870.7 / 1e6, 3)}\\) million km.`)],
      ans: `ν = ${f(nu, 3)}°, r = ${f(r, 5)} AU` };
  } },
{ id: 'kep2', ch: 'kepler', lvl: 4,
  t: ['مذنب هالي: الزمن اللازم بين بعدين', 'Halley’s comet: time between two distances'],
  inp: [['r', ['البعد عن الشمس r (و.ف)', 'Distance r (AU)'], 1, 'AU'], ['a', ['نصف المحور a', 'Semi-major axis a'], 17.834, 'AU'], ['e', ['الاختلاف المركزي e', 'Eccentricity e'], 0.96714, '']],
  q: p => S(`كم يومًا يقضي مذنب هالي (\\(a=${p.a}\\) و.ف، \\(e=${p.e}\\)) داخل كرة نصف قطرها \\(r=${p.r}\\) و.ف حول الشمس؟`, `How many days does Halley’s comet (\\(a=${p.a}\\) AU, \\(e=${p.e}\\)) spend inside a sphere of radius \\(r=${p.r}\\) AU around the Sun?`),
  solve: p => {
    const q = p.a * (1 - p.e); if (p.r <= q) return { steps: [S(`الحضيض \\(q=a(1-e)=${f(q, 4)}\\) أكبر من r: المذنب لا يدخل هذه الكرة.`, `Perihelion \\(q=a(1-e)=${f(q, 4)}\\) exceeds r: it never gets inside.`)], ans: '—' };
    const cE = (1 - p.r / p.a) / p.e, E = acos(cE), M = E * D - p.e * Math.sin(E * D), P = Math.pow(p.a, 1.5) * 365.25, t = M / (2 * Math.PI) * P, nu = 2 * atan2(Math.sqrt(1 + p.e) * sin(E / 2), Math.sqrt(1 - p.e) * cos(E / 2));
    return { steps: [
      S(`<b>هنا المسألة عكسية:</b> نعرف r ونريد الزمن، فلا نحتاج للتكرار. من \\(r=a(1-e\\cos E)\\):`, `<b>An inverse problem:</b> r is known and the time is wanted, so no iteration is needed. From \\(r=a(1-e\\cos E)\\):`) + `\\[\\cos E=\\frac{1-r/a}{e}=${f(cE, 7)}\\Rightarrow E=${deg(E)}=${f(E * D, 7)}\\ \\text{rad}\\]`,
      S(`<b>الشذوذ المتوسط</b> من معادلة كبلر مباشرة:`, `<b>Mean anomaly</b> directly from Kepler’s equation:`) + `\\[M=E-e\\sin E=${f(E * D, 7)}-${p.e}\\times${f(Math.sin(E * D), 7)}=${f(M, 7)}\\ \\text{rad}\\]`,
      S(`<b>الدورة</b> من قانون كبلر الثالث \\(P=a^{3/2}\\) سنة \\(=${f(P / 365.25, 2)}\\) سنة، والزمن من الحضيض حتى r:`, `<b>Period</b> from Kepler’s third law \\(P=a^{3/2}\\) yr \\(=${f(P / 365.25, 2)}\\) yr; time from perihelion to r:`) + `\\[t=\\frac{M}{2\\pi}P=${f(t, 2)}\\ \\text{d}\\ \\Rightarrow\\ 2t=${box(f(2 * t, 1))}\\ \\text{${S('يومًا', 'days')}}\\]`,
      S(`الشذوذ الحقيقي عند الدخول \\(\\nu=\\pm${f(nu, 2)}^\\circ\\). لاحظ: يقضي المذنب نحو ${f(2 * t / P * 100, 2)}٪ فقط من دورته داخل مدار الأرض (قانون كبلر الثاني).`, `True anomaly at entry \\(\\nu=\\pm${f(nu, 2)}^\\circ\\). The comet spends only ${f(2 * t / P * 100, 2)}% of its orbit inside Earth’s orbit (Kepler’s second law).`)],
      ans: `${f(2 * t, 1)} d` };
  } },
// ---------- planets
{ id: 'syn', ch: 'planet', lvl: 1,
  t: ['الدورة الاقترانية وأعظم استطالة', 'Synodic period and greatest elongation'],
  inp: [['Pp', ['الدورة النجمية للكوكب (يوم)', 'Planet sidereal period (d)'], 224.701, 'd'], ['a', ['نصف قطر المدار (و.ف)', 'Orbital radius (AU)'], 0.72333, 'AU']],
  q: p => S(`كوكب الزهرة: دورته النجمية \\(${p.Pp}\\) يومًا ونصف قطر مداره \\(${p.a}\\) و.ف. أوجد دورته الاقترانية وأعظم استطالة له (بفرض مدارين دائريين).`, `Venus: sidereal period \\(${p.Pp}\\) d, orbital radius \\(${p.a}\\) AU. Find its synodic period and greatest elongation (circular orbits).`),
  solve: p => {
    const E = 365.25636, S_ = 1 / Math.abs(1 / p.Pp - 1 / E), inner = p.a < 1, el = inner ? asin(p.a) : null;
    return { steps: [
      S(`<b>الدورة الاقترانية:</b> في كل يوم يتقدم الكوكب على الأرض بزاوية \\(360^\\circ/P-360^\\circ/E\\)، ويلتقيان مرة أخرى بعد دورة نسبية كاملة:`, `<b>Synodic period:</b> each day the planet gains \\(360^\\circ/P-360^\\circ/E\\) on Earth; they line up again after a full relative turn:`) + `\\[\\frac1S=\\left|\\frac1{${p.Pp}}-\\frac1{365.256}\\right|\\Rightarrow S=${box(f(S_, 2) + '\\ \\text{d}')}=${f(S_ / 365.25, 3)}\\ \\text{yr}\\]`,
      inner ? S(`<b>أعظم استطالة:</b> خط النظر من الأرض مماس لمدار الكوكب، فالمثلث شمس–كوكب–أرض قائم عند الكوكب:`, `<b>Greatest elongation:</b> the line of sight from Earth is tangent to the planet’s orbit, so the Sun–planet–Earth triangle has a right angle at the planet:`) + `\\[\\sin\\varepsilon_{\\max}=\\frac{a}{1}=${p.a}\\Rightarrow\\varepsilon_{\\max}=${box(deg(el, 2))}\\]` + S(`(في الواقع تتراوح بين 45° و 47° بسبب إهليلجية المدارين.)`, `(In reality 45°–47°, because both orbits are elliptical.)`) : S(`كوكب خارجي: يمكن أن تبلغ استطالته 180° (المقابلة).`, `Outer planet: its elongation can reach 180° (opposition).`)],
      ans: `S = ${f(S_, 1)} d${inner ? ', ε = ' + f(el, 2) + '°' : ''}` };
  } },
{ id: 'stat', ch: 'planet', lvl: 4,
  t: ['نقطتا التوقف والحركة التراجعية للمريخ', 'Stationary points and retrograde motion of Mars'],
  inp: [['b', ['نصف قطر مدار الكوكب b (و.ف)', 'Planet orbital radius b (AU)'], 1.5237, 'AU']],
  q: p => S(`بفرض مدارين دائريين في مستوى واحد للأرض (1 و.ف) والكوكب (\\(b=${p.b}\\) و.ف)، أثبت أن الكوكب يبدو متوقفًا عندما تحقق الزاوية الشمسية المركز θ بينهما \\(\\cos\\theta=\\dfrac{\\sqrt b}{1+b-\\sqrt b}\\). ثم احسب θ، والزمن من التوقف إلى المقابلة، واستطالة الكوكب عند التوقف، ومدة الحركة التراجعية.`, `With coplanar circular orbits for Earth (1 AU) and the planet (\\(b=${p.b}\\) AU), show that the planet appears stationary when the heliocentric angle θ between them satisfies \\(\\cos\\theta=\\dfrac{\\sqrt b}{1+b-\\sqrt b}\\). Then compute θ, the time from the stationary point to opposition, the planet’s elongation at that moment, and the duration of retrograde motion.`),
  solve: p => {
    const b = p.b, c = Math.sqrt(b) / (1 + b - Math.sqrt(b)), th = acos(c), nE = 360 / 365.25636, nP = nE / Math.pow(b, 1.5), t = th / (nE - nP);
    const xe = 1, ye = 0, xm = b * cos(th), ym = b * sin(th); // earth at angle 0 heliocentric, planet ahead by θ? geometry for elongation
    const dx = xm - xe, dy = ym - ye, el = acos((-xe * dx - ye * dy) / Math.hypot(dx, dy));
    return { steps: [
      S(`<b>السرعات:</b> لمدار دائري \\(v=\\sqrt{GM/r}\\)، فإذا كانت سرعة الأرض 1 فسرعة الكوكب \\(1/\\sqrt b\\). ضع الشمس في الأصل والأرض E عند \\((1,0)\\) والكوكب P عند \\((b\\cos\\theta,\\,b\\sin\\theta)\\).`, `<b>Speeds:</b> for a circular orbit \\(v=\\sqrt{GM/r}\\); with Earth’s speed 1 the planet’s is \\(1/\\sqrt b\\). Put the Sun at the origin, Earth E at \\((1,0)\\) and the planet P at \\((b\\cos\\theta,\\,b\\sin\\theta)\\).`),
      S(`<b>شرط التوقف:</b> اتجاه خط النظر \\(\\mathbf d=\\mathbf P-\\mathbf E\\) لا يتغير، أي أن \\(\\mathbf d\\times\\dot{\\mathbf d}=0\\). بالتعويض بالسرعتين المماسيتين \\(\\dot{\\mathbf E}=(0,1)\\) و \\(\\dot{\\mathbf P}=b^{-1/2}(-\\sin\\theta,\\cos\\theta)\\) والتبسيط نحصل على:`, `<b>Stationary condition:</b> the line of sight \\(\\mathbf d=\\mathbf P-\\mathbf E\\) does not turn: \\(\\mathbf d\\times\\dot{\\mathbf d}=0\\). With the tangential velocities \\(\\dot{\\mathbf E}=(0,1)\\), \\(\\dot{\\mathbf P}=b^{-1/2}(-\\sin\\theta,\\cos\\theta)\\), simplifying gives`) +
        `\\[(b\\cos\\theta-1)\\left(b^{-1/2}\\cos\\theta-1\\right)+b\\,b^{-1/2}\\sin^2\\theta=0\\ \\Longrightarrow\\ \\boxed{\\cos\\theta=\\frac{\\sqrt b}{1+b-\\sqrt b}}\\]`,
      S(`<b>بالأرقام:</b>`, `<b>Numbers:</b>`) + `\\[\\cos\\theta=\\frac{${f(Math.sqrt(b), 6)}}{1+${b}-${f(Math.sqrt(b), 6)}}=${f(c, 6)}\\Rightarrow\\theta=${box(deg(th, 3))}\\]`,
      S(`<b>الزمن حتى المقابلة</b> (θ = 0 عند المقابلة، والزاوية تتناقص بالمعدل النسبي):`, `<b>Time to opposition</b> (θ = 0 at opposition; it shrinks at the relative rate):`) + `\\[n_E-n_P=${f(nE, 6)}-${f(nP, 6)}=${f(nE - nP, 6)}^\\circ/\\text{d}\\Rightarrow t=${box(f(t, 1) + '\\ \\text{d}')}\\]` +
        S(`فتدوم الحركة التراجعية نحو \\(2t=${f(2 * t, 0)}\\) يومًا (للمريخ في الواقع 60–80 يومًا حسب موضعه في مداره الإهليلجي).`, `so retrograde motion lasts about \\(2t=${f(2 * t, 0)}\\) days (for Mars really 60–80 days, depending on its place in its elliptical orbit).`),
      S(`<b>الاستطالة عند التوقف</b> (الزاوية عند الأرض بين الشمس والكوكب):`, `<b>Elongation at the stationary point</b> (angle at Earth between Sun and planet):`) + `\\[\\cos\\varepsilon=\\frac{(\\mathbf S-\\mathbf E)\\cdot(\\mathbf P-\\mathbf E)}{|\\mathbf S-\\mathbf E||\\mathbf P-\\mathbf E|}\\Rightarrow\\varepsilon=${box(deg(el, 2))}\\]`],
      ans: `θ = ${f(th, 2)}°, t = ${f(t, 1)} d, ε = ${f(el, 1)}°` };
  } },
// ---------- parallax
{ id: 'par1', ch: 'parallax', lvl: 1,
  t: ['اختلاف المنظر السنوي والمسافة', 'Annual parallax and distance'],
  inp: [['pmas', ['اختلاف المنظر (ملّي ثانية قوسية)', 'Parallax (mas)'], 768.07, 'mas']],
  q: p => S(`اختلاف المنظر السنوي لبروكسيما قنطورس \\(${p.pmas}\\) ملّي ثانية قوسية (جايا). أوجد بُعدها بالفرسك والسنة الضوئية والوحدة الفلكية والكيلومتر.`, `Proxima Centauri’s annual parallax is \\(${p.pmas}\\) mas (Gaia). Find its distance in parsecs, light-years, AU and km.`),
  solve: p => {
    const pc = 1000 / p.pmas;
    return { steps: [
      S(`<b>تعريف الفرسك:</b> المسافة التي يقابل عندها نصف قطر مدار الأرض (1 و.ف) زاوية ثانية قوسية واحدة. ولأن الزاوية صغيرة: \\(\\tan\\varpi\\approx\\varpi\\)، فـ \\(1\\ \\text{pc}=1\\ \\text{AU}/(1''\\ \\text{بالراديان})=206264.806\\ \\text{AU}\\).`, `<b>The parsec:</b> the distance at which 1 AU subtends one arcsecond. For small angles \\(\\tan\\varpi\\approx\\varpi\\), so \\(1\\ \\text{pc}=1\\ \\text{AU}/(1''\\ \\text{in rad})=206264.806\\ \\text{AU}\\).`),
      `\\[d=\\frac{1}{\\varpi''}=\\frac{1}{${f(p.pmas / 1000, 5)}}=${box(f(pc, 4) + '\\ \\text{pc}')}\\]`,
      `\\[d=${f(pc * 3.26156, 3)}\\ \\text{ly}=${f(pc * 206264.806, 0)}\\ \\text{AU}=${f(pc * 3.0857e13 / 1e13, 3)}\\times10^{13}\\ \\text{km}\\]`,
      S(`أي أن ضوءها يحتاج ${f(pc * 3.26156, 2)} سنة ليصلنا. ولو صغّرنا المسافة بين الأرض والشمس إلى 1 سم لكانت بروكسيما على بُعد ${f(pc * 206264.806 / 100000, 2)} كم!`, `Its light takes ${f(pc * 3.26156, 2)} years to reach us. If the Earth–Sun distance were 1 cm, Proxima would be ${f(pc * 206264.806 / 100000, 2)} km away!`)],
      ans: `${f(pc, 4)} pc` };
  } },
{ id: 'par2', ch: 'parallax', lvl: 2,
  t: ['اختلاف منظر القمر وتصحيح ارتفاعه', 'The Moon’s parallax and altitude correction'],
  inp: [['d', ['بُعد القمر عن مركز الأرض (كم)', 'Moon’s geocentric distance (km)'], 384400, 'km'], ['ha', ['ارتفاع القمر الظاهر', 'Moon’s apparent altitude'], 5, '°']],
  q: p => S(`القمر على بُعد \\(${p.d}\\) كم من مركز الأرض. أوجد اختلاف منظره الأفقي، ثم ارتفاعه المركزي الأرضي إذا رُصد على ارتفاع ظاهري \\(${p.ha}^\\circ\\) (بعد تصحيح الانكسار). ولماذا هذا مهم في رؤية الهلال؟`, `The Moon is \\(${p.d}\\) km from Earth’s centre. Find its horizontal parallax, then its geocentric altitude if seen at apparent altitude \\(${p.ha}^\\circ\\) (refraction already removed). Why does this matter for crescent sighting?`),
  solve: p => {
    const pi = asin(6378.14 / p.d), pp = asin(sin(pi) * cos(p.ha));
    return { steps: [
      S(`<b>اختلاف المنظر الأفقي:</b> الزاوية التي يقابلها نصف قطر الأرض الاستوائي عند القمر:`, `<b>Horizontal parallax:</b> the angle Earth’s equatorial radius subtends at the Moon:`) + `\\[\\sin\\pi=\\frac{R_\\oplus}{d}=\\frac{6378.14}{${p.d}}\\Rightarrow\\pi=${box(dms(pi, 1))}\\]`,
      S(`<b>المثلث:</b> مركز الأرض O، والراصد T، والقمر M. الزاوية عند T هي \\(90^\\circ+h'\\)، وبقانون الجيوب المستوية:`, `<b>Triangle:</b> Earth’s centre O, observer T, Moon M. The angle at T is \\(90^\\circ+h'\\); by the plane sine rule`) + `\\[\\frac{\\sin p}{R_\\oplus}=\\frac{\\sin(90^\\circ+h')}{d}\\Rightarrow\\sin p=\\sin\\pi\\cos h'\\Rightarrow p=${dms(pp, 1)}\\]`,
      S(`<b>الارتفاع المركزي الأرضي</b> (من مركز الأرض يبدو القمر أعلى):`, `<b>Geocentric altitude</b> (from the centre the Moon looks higher):`) + `\\[h_{\\text{geo}}=h'+p=${box(DM(p.ha + pp))}\\]`,
      S(`<b>الأهمية:</b> قرب الأفق يصل الفرق إلى نحو درجة كاملة (ضعف قطر القمر!). معايير رؤية الهلال (مثل معيار عودة) تستخدم الارتفاع الطوبوغرافي (من سطح الأرض) لأن الراصد على السطح، وإهمال اختلاف المنظر يجعل الهلال يبدو أسهل رؤية مما هو فعلًا.`, `<b>Why it matters:</b> near the horizon the difference reaches about a degree (twice the Moon’s diameter!). Crescent criteria (e.g. Odeh) use topocentric quantities because the observer is on the surface; neglecting parallax makes the crescent seem easier to see than it is.`)],
      ans: `π = ${f(pi * 60, 2)}′, h_geo = ${f(p.ha + pp, 3)}°` };
  } },
// ---------- aberration
{ id: 'ab1', ch: 'aberr', lvl: 4,
  t: ['قطع الزيغان لنجم وموضعه في تاريخ معين', 'The aberration ellipse of a star and its displacement on a date'],
  inp: [['lam', ['طول النجم البروجي λ', 'Star ecliptic longitude λ'], 285.31, '°'], ['beta', ['عرضه البروجي β', 'Ecliptic latitude β'], 61.73, '°'], ['lsun', ['طول الشمس λ☉', 'Sun’s longitude λ☉'], 238, '°']],
  q: p => S(`نجم النسر الواقع (Vega) إحداثياته البروجية \\(\\lambda=${p.lam}^\\circ,\\ \\beta=${p.beta}^\\circ\\). أوجد نصفي محوري قطع الزيغان السنوي، وإزاحته في الطول والعرض عندما يكون طول الشمس \\(\\lambda_\\odot=${p.lsun}^\\circ\\).`, `Vega has ecliptic coordinates \\(\\lambda=${p.lam}^\\circ,\\ \\beta=${p.beta}^\\circ\\). Find the semi-axes of its annual aberration ellipse and its displacement in longitude and latitude when the Sun’s longitude is \\(\\lambda_\\odot=${p.lsun}^\\circ\\).`),
  solve: p => {
    const k = 29.7847 / 299792.458 * R * 3600, dl = -k * cos(p.lsun - p.lam) / cos(p.beta), db = -k * sin(p.beta) * sin(p.lsun - p.lam);
    return { steps: [
      S(`<b>ثابت الزيغان:</b> \\(\\kappa=\\dfrac{v_\\oplus}{c}=\\dfrac{29.785}{299792.458}\\) راديان \\(\\times206264.8=${f(k, 3)}''\\).`, `<b>Constant of aberration:</b> \\(\\kappa=\\dfrac{v_\\oplus}{c}=\\dfrac{29.785}{299792.458}\\) rad \\(\\times206264.8=${f(k, 3)}''\\).`),
      S(`<b>القطع الناقص:</b> سرعة الأرض في مستوى البروج، فالإزاحة الكاملة κ تظهر موازية للبروج، بينما تُرى مسقطة في الاتجاه العمودي بمعامل \\(\\sin\\beta\\):`, `<b>The ellipse:</b> Earth’s velocity lies in the ecliptic, so the full κ appears parallel to it, while perpendicular to it the displacement is foreshortened by \\(\\sin\\beta\\):`) + `\\[a=\\kappa=${f(k, 2)}'',\\qquad b=\\kappa\\sin\\beta=${f(k * sin(p.beta), 2)}''\\]`,
      S(`<b>الإزاحة في التاريخ المعطى</b> (سرعة الأرض متجهة نحو الطول \\(\\lambda_\\odot-90^\\circ\\)):`, `<b>Displacement on the date</b> (Earth moves towards longitude \\(\\lambda_\\odot-90^\\circ\\)):`) +
        `\\[\\Delta\\lambda=-\\frac{\\kappa\\cos(\\lambda_\\odot-\\lambda)}{\\cos\\beta}=${box(f(dl, 2) + "''")},\\qquad \\Delta\\beta=-\\kappa\\sin\\beta\\sin(\\lambda_\\odot-\\lambda)=${box(f(db, 2) + "''")}\\]`,
      S(`لاحظ أن \\(\\Delta\\lambda\\) كبيرة لنجم قريب من قطب البروج لأن دوائر الطول تتقارب هناك، لكن الإزاحة الزاوية الفعلية \\(\\Delta\\lambda\\cos\\beta=${f(dl * cos(p.beta), 2)}''\\) لا تتجاوز κ.`, `Note \\(\\Delta\\lambda\\) is large for a star near the ecliptic pole because meridians of longitude converge there, but the true angular shift \\(\\Delta\\lambda\\cos\\beta=${f(dl * cos(p.beta), 2)}''\\) never exceeds κ.`)],
      ans: `κ = ${f(k, 2)}″, Δλ = ${f(dl, 2)}″, Δβ = ${f(db, 2)}″` };
  } },
// ---------- precession
{ id: 'pr1', ch: 'prec', lvl: 2,
  t: ['المبادرة السنوية في المطلع المستقيم والميل (الشعرى)', 'Annual precession in α and δ (Sirius)'],
  inp: [['ra', ['α (درجات)', 'α (deg)'], 101.2872, '°'], ['dec', ['δ', 'δ'], -16.7161, '°'], ['yrs', ['عدد السنوات', 'Number of years'], 26, 'yr']],
  q: p => S(`نجم الشعرى اليمانية \\(\\alpha=${p.ra}^\\circ,\\ \\delta=${p.dec}^\\circ\\) (J2000). احسب تغيّر α و δ بسبب المبادرة خلال ${p.yrs} سنة بالصيغ التقريبية، وقارن بالحل الدقيق بالمصفوفة.`, `Sirius: \\(\\alpha=${p.ra}^\\circ,\\ \\delta=${p.dec}^\\circ\\) (J2000). Compute the change in α and δ due to precession over ${p.yrs} years with the first-order formulae, and compare with the rigorous matrix solution.`),
  solve: p => {
    const m = 3.07496, n = 1.33621; const dA = (m + n * sin(p.ra) * tan(p.dec)) * p.yrs, dD = 15 * n * cos(p.ra) * p.yrs; // s, arcsec
    // rigorous
    const T = p.yrs / 100, as = D / 3600; const zeta = (2306.2181 * T + 0.30188 * T * T + 0.017998 * T ** 3) / 3600, z = (2306.2181 * T + 1.09468 * T * T + 0.018203 * T ** 3) / 3600, th = (2004.3109 * T - 0.42665 * T * T - 0.041833 * T ** 3) / 3600;
    const A_ = cos(p.dec) * sin(p.ra + zeta), B_ = cos(th) * cos(p.dec) * cos(p.ra + zeta) - sin(th) * sin(p.dec), C_ = sin(th) * cos(p.dec) * cos(p.ra + zeta) + cos(th) * sin(p.dec);
    const ra2 = n360(atan2(A_, B_) + z), de2 = asin(C_);
    return { steps: [
      S(`<b>الصيغ التقريبية</b> لكل سنة (m = 3.07496ˢ، n = 1.33621ˢ = 20.043″):`, `<b>First-order formulae</b> per year (m = 3.07496ˢ, n = 1.33621ˢ = 20.043″):`) +
        `\\[\\Delta\\alpha=m+n\\sin\\alpha\\tan\\delta=3.07496+1.33621\\times${f(sin(p.ra), 5)}\\times(${f(tan(p.dec), 5)})=${f(dA / p.yrs, 4)}^{\\mathrm s}/\\text{yr}\\]` +
        `\\[\\Delta\\delta=n\\cos\\alpha=20.043''\\times(${f(cos(p.ra), 5)})=${f(dD / p.yrs, 3)}''/\\text{yr}\\]`,
      S(`<b>خلال ${p.yrs} سنة:</b>`, `<b>Over ${p.yrs} years:</b>`) + `\\[\\Delta\\alpha=${box(f(dA, 2) + '^{\\mathrm s}')}=${f(dA * 15 / 60, 2)}',\\qquad \\Delta\\delta=${box(f(dD, 1) + "''")}\\]`,
      S(`<b>الحل الدقيق</b> (Meeus 21.2): \\(\\zeta=${f(zeta * 3600, 2)}''\\)، \\(z=${f(z * 3600, 2)}''\\)، \\(\\theta=${f(th * 3600, 2)}''\\):`, `<b>Rigorous solution</b> (Meeus 21.2): \\(\\zeta=${f(zeta * 3600, 2)}''\\), \\(z=${f(z * 3600, 2)}''\\), \\(\\theta=${f(th * 3600, 2)}''\\):`) +
        `\\[\\alpha'=${deg(ra2, 5)}\\ (\\Delta\\alpha=${f((ra2 - p.ra) * 240, 2)}^{\\mathrm s}),\\qquad \\delta'=${deg(de2, 5)}\\ (\\Delta\\delta=${f((de2 - p.dec) * 3600, 1)}'')\\]`,
      S(`الفرق بين الطريقتين ${f(Math.abs((ra2 - p.ra) * 240 - dA), 3)}ˢ و ${f(Math.abs((de2 - p.dec) * 3600 - dD), 2)}″: الصيغة التقريبية ممتازة لعشرات السنين، أما للقرون فيجب استخدام المصفوفة.`, `The two methods differ by ${f(Math.abs((ra2 - p.ra) * 240 - dA), 3)}ˢ and ${f(Math.abs((de2 - p.dec) * 3600 - dD), 2)}″: the first-order formulae are excellent for decades; for centuries use the matrix.`)],
      ans: `Δα = ${f(dA, 2)}s, Δδ = ${f(dD, 1)}″` };
  } },
{ id: 'pr2', ch: 'prec', lvl: 4,
  t: ['متى يصبح النسر الواقع نجم القطب؟', 'When will Vega be the pole star?'],
  inp: [['beta', ['عرض النجم البروجي β', 'Star ecliptic latitude β'], 61.73, '°'], ['eps', ['ميل البروج ε', 'Obliquity ε'], 23.44, '°'], ['lam', ['طول النجم البروجي λ', 'Ecliptic longitude λ'], 285.31, '°']],
  q: p => S(`يرسم القطب السماوي دائرة نصف قطرها ε حول قطب البروج. لنجم النسر الواقع (\\(\\beta=${p.beta}^\\circ,\\ \\lambda=${p.lam}^\\circ\\)) أوجد أقل مسافة زاوية بينه وبين القطب السماوي، ومتى يحدث ذلك تقريبًا (المبادرة 50.29″ في السنة).`, `The celestial pole traces a circle of radius ε around the ecliptic pole. For Vega (\\(\\beta=${p.beta}^\\circ,\\ \\lambda=${p.lam}^\\circ\\)) find its minimum angular distance from the celestial pole, and roughly when this happens (precession 50.29″/yr).`),
  solve: p => {
    const dmin = 90 - p.beta - p.eps; // when the pole lies between K and the star on the same meridian
    // pole currently at ecliptic longitude 90° (the NCP lies on the solstitial colure at λ = 90°); star longitude λ; pole longitude decreases... the pole is at λ_pole=90° now in a frame moving with equinox; star longitude increases by p per yr
    const need = n360(90 - p.lam), yrs = need * 3600 / 50.29;
    return { steps: [
      S(`<b>هندسة المسألة:</b> قطب البروج K ثابت تقريبًا بين النجوم، والقطب السماوي P يبعد عنه دائمًا ε ويدور حوله. والنجم X يبعد عن K مسافة \\(90^\\circ-\\beta\\) ثابتة (الأعراض البروجية لا تتغير بالمبادرة).`, `<b>Geometry:</b> the ecliptic pole K is nearly fixed among the stars; the celestial pole P stays ε from it and circles it. The star X is a fixed \\(90^\\circ-\\beta\\) from K (ecliptic latitudes do not change with precession).`),
      S(`<b>في المثلث PKX:</b> \\(\\cos PX=\\cos\\varepsilon\\cos(90^\\circ-\\beta)+\\sin\\varepsilon\\sin(90^\\circ-\\beta)\\cos K\\)، وتكون PX أصغر ما يمكن عندما \\(K=0\\)، أي حين يقع P على القوس KX:`, `<b>In triangle PKX:</b> \\(\\cos PX=\\cos\\varepsilon\\cos(90^\\circ-\\beta)+\\sin\\varepsilon\\sin(90^\\circ-\\beta)\\cos K\\); PX is least when \\(K=0\\), i.e. when P lies on arc KX:`) + `\\[PX_{\\min}=(90^\\circ-\\beta)-\\varepsilon=${box(deg(dmin, 2))}\\]`,
      S(`<b>متى؟</b> القطب الشمالي يقع الآن عند طول بروجي 90° (على دائرة الانقلابين). بالمبادرة يزداد طول كل نجم بمعدل 50.29″ سنويًا، فنحتاج أن يصبح طول النجم \\(90^\\circ\\) (+ 360° إن لزم):`, `<b>When?</b> The north celestial pole now lies at ecliptic longitude 90° (on the solstitial colure). Precession increases every star’s longitude by 50.29″/yr, so we need the star’s longitude to reach \\(90^\\circ\\) (mod 360°):`) +
        `\\[\\Delta\\lambda=${deg(need, 2)}\\Rightarrow t=\\frac{${f(need, 2)}\\times3600}{50.29}\\approx${box(f(yrs, 0))}\\ \\text{${S('سنة', 'yr')}}\\]`,
      S(`(النماذج الدقيقة تعطي نحو 4° وحوالي العام 13 700م؛ والفرق لأن ε والمبادرة يتغيران قليلًا مع الزمن ولأن للنجم حركة ذاتية.)`, `(Rigorous models give about 4° around AD 13,700; the difference arises because ε and the precession rate change slowly and Vega has its own proper motion.)`)],
      ans: `${f(dmin, 2)}°, ~${f(yrs, 0)} yr` };
  } }
];

// ------------------------------------------------------------------ exercises (answers computed)
const EX = {
  trig: [
    [() => S('أوجد المسافة بالكيلومترات بين القاهرة (30.04°N, 31.24°E) وقازان (55.79°N, 49.12°E).', 'Find the distance in km between Cairo (30.04°N, 31.24°E) and Kazan (55.79°N, 49.12°E).'), () => { const a = acos(sin(30.04) * sin(55.79) + cos(30.04) * cos(55.79) * cos(49.12 - 31.24)); return `${f(a, 3)}° ≈ ${f(a * D * 6371, 0)} km`; }],
    [() => S('مثلث كروي متساوي الأضلاع ضلعه 90°. أوجد زواياه ومساحته على كرة الوحدة. (تلميح: إنه ثُمن الكرة.)', 'An equilateral spherical triangle has sides 90°. Find its angles and area on the unit sphere. (Hint: it is an octant.)'), () => `A = B = C = 90°, E = 90° = π/2 sr`],
    [() => S('في مثلث قائم (C = 90°): a = 30°، b = 40°. أوجد c و A بقواعد نابير.', 'In a right triangle (C = 90°): a = 30°, b = 40°. Find c and A with Napier’s rules.'), () => { const c = acos(cos(30) * cos(40)), A = atan2(tan(30), sin(40)); return `c = ${f(c, 3)}°, A = ${f(A, 3)}°`; }]],
  coord: [
    [() => S('نجم على خط الزوال جنوبًا بارتفاع 50° من عرض 30°N. ما ميله؟', 'A star on the meridian, south, at altitude 50° from latitude 30°N. What is its declination?'), () => `δ = ${f(50 + 30 - 90, 1)}°`],
    [() => S('أوجد α و δ لنقطة على البروج طولها 150°.', 'Find α and δ of the ecliptic point with longitude 150°.'), () => { const d = asin(sin(23.4393) * sin(150)), a = n360(atan2(cos(23.4393) * sin(150), cos(150))); return `α = ${f(a, 3)}° (${f(a / 15, 3)} h), δ = ${f(d, 3)}°`; }]],
  diurnal: [
    [() => S('ما أطول نهار (بإهمال الانكسار) في القاهرة (30.04°N) يوم الانقلاب الصيفي؟', 'What is the longest day (no refraction) at Cairo (30.04°N) at the June solstice?'), () => { const H = acos(-tan(30.04) * tan(23.44)); return `${f(2 * H / 15, 3)} h`; }],
    [() => S('ما أدنى عرض شمالي يُرى منه سهيل (δ = −52.70°) فوق الأفق؟ وهل يُرى من أسوان (24.09°N)؟', 'What is the northernmost latitude from which Canopus (δ = −52.70°) rises? Is it visible from Aswan (24.09°N)?'), () => `φ < 37.30° (${S('مع الانكسار ≈ 37.9°', 'with refraction ≈ 37.9°')}); Aswan: h_max = ${f(90 - 24.09 - 52.70, 2)}° ✓`]],
  refr: [[() => S('احسب الانكسار عند ارتفاع ظاهري 45° في الظروف القياسية.', 'Compute the refraction at apparent altitude 45° in standard conditions.'), () => `${f(58.3 - 0.067, 1)}″`]],
  twi: [[() => S('احسب مدة الشفق الفلكي في قازان (55.79°N) يوم الاعتدال.', 'Compute the astronomical twilight duration at Kazan (55.79°N) at an equinox.'), () => { const H0 = acos(sin(-50 / 60) / cos(55.79)), H18 = acos(sin(-18) / cos(55.79)); return `${f((H18 - H0) * 4 / 1.0027379, 0)} min`; }]],
  time: [[() => S('كم يومًا نجميًا في السنة الاستوائية (365.2422 يومًا شمسيًا)؟ ولماذا يزيد يومًا بالضبط؟', 'How many sidereal days are in a tropical year (365.2422 solar days)? Why exactly one more?'), () => `${f(365.2422 * 1.00273790935, 4)}`]],
  kepler: [[() => S('أوجد البعد الأقصى (الأوج) والأدنى (الحضيض) للمريخ (a = 1.5237 و.ف، e = 0.0934).', 'Find the aphelion and perihelion distances of Mars (a = 1.5237 AU, e = 0.0934).'), () => `q = ${f(1.5237 * (1 - 0.0934), 4)} AU, Q = ${f(1.5237 * 1.0934, 4)} AU`]],
  planet: [[() => S('أوجد الدورة الاقترانية للمريخ (P = 686.98 يومًا).', 'Find the synodic period of Mars (P = 686.98 d).'), () => `${f(1 / (1 / 365.25636 - 1 / 686.98), 1)} d`], [() => S('أعظم استطالة لعطارد بفرض مدار دائري نصف قطره 0.387 و.ف.', 'Greatest elongation of Mercury for a circular orbit of radius 0.387 AU.'), () => `${f(asin(0.387), 2)}°`]],
  parallax: [[() => S('اختلاف منظر الشمس الأفقي (d = 1 و.ف = 149 597 871 كم).', 'The Sun’s horizontal parallax (d = 1 AU = 149,597,871 km).'), () => `${f(asin(6378.14 / 149597871) * 3600, 3)}″`]],
  aberr: [[() => S('ما أقصى زيغان يومي لراصد في القاهرة؟', 'What is the maximum diurnal aberration for an observer in Cairo?'), () => `${f(0.320 * cos(30.04), 3)}″`]],
  prec: [[() => S('كم سنة تحتاج نقطة الاعتدال لتتراجع برجًا كاملًا (30°)؟', 'How many years does the equinox take to regress one zodiac sign (30°)?'), () => `${f(30 * 3600 / 50.29, 0)} yr`]]
};

root.SphCourse = { CH, P, EX, setLang: l => { lang = l; } };
})(typeof window !== 'undefined' ? window : globalThis);
