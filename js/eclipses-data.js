// Eclipse datasets & image catalogue — every entry checked against its source page (Nov 2026).
// reuse: 'open' = open licence, reuse with credit | 'cond' = allowed under the source's guidelines |
//        'mixed' = licence differs per file | 'ask' = no licence stated, ask the owner | 'copy' = copyrighted, link only
window.ECLIPSE_DATA = [
  {
    id: 'em2024', date: '2024-04-08', kind: 'total', types: ['raw', 'fits', 'hdr'], aud: ['sci', 'pub'], reuse: 'ask',
    name: { ar: 'قاعدة بيانات Eclipse Megamovie 2024', en: 'Eclipse Megamovie 2024 Observatory Database' },
    by: { ar: 'فريق Eclipse Megamovie: جامعة سونوما ستيت، وجامعة كاليفورنيا بيركلي، ومركز غودارد التابع لناسا، مع ١٤٣ «مرصدًا» من المتطوعين', en: 'Eclipse Megamovie team: Sonoma State University, UC Berkeley and NASA Goddard, with 143 volunteer “observatories”' },
    desc: { ar: 'صور ضوء أبيض للإكليل من ١٤٣ كاميرا متطوعة، مع إطارات المعايرة (dark/flat/bias). ثلاثة مستويات: المستوى ١ صور كما التُقطت، والمستوى ٢ ملفات FITS غير معايرة، والمستوى ٣ صور HDR معايرة بصيغة FITS لـ٢٨ مرصدًا كانت سماؤها صافية.', en: 'White-light corona images from 143 volunteer cameras, with calibration frames (dark/flat/bias). Three levels: Level 1 as taken, Level 2 uncalibrated FITS, and Level 3 calibrated HDR FITS for the 28 observatories with clear skies.' },
    size: { ar: '٥٢٬٤٦٩ صورة', en: '52,469 photographs' }, released: '2025-12-19',
    lic: { ar: 'لم يُذكر ترخيص في صفحة قاعدة البيانات. اسأل الفريق (edeon@sonoma.edu) قبل إعادة النشر، واذكر المشروع دائمًا.', en: 'No licence is stated on the database page. Ask the team (edeon@sonoma.edu) before republishing, and always credit the project.' },
    cite: 'Eclipse Megamovie 2024 Team (Sonoma State University, UC Berkeley, NASA GSFC). Eclipse Megamovie 2024 Observatory Database, data release 19 Dec 2025. https://eclipsemegamovie.org/database',
    url: 'https://eclipsemegamovie.org/database', src: 'eclipsemegamovie.org'
  },
  {
    id: 'cate2024', date: '2024-04-08', kind: 'total', types: ['pol', 'hdr', 'fits', 'raw'], aud: ['sci'], reuse: 'open',
    name: { ar: 'تجربة Citizen CATE 2024: إكليل مستقطَب على مدى ساعة', en: 'Citizen CATE 2024: one hour of polarized corona' },
    by: { ar: 'معهد ساوث وست للأبحاث (SwRI) بقيادة أمير كاسبي، مع ٣٥ فريقًا من المواطنين العلماء، بتمويل NSF وناسا', en: 'Southwest Research Institute (SwRI), led by Amir Caspi, with 35 community teams; funded by NSF and NASA' },
    desc: { ar: 'تلسكوبات متطابقة على طول مسار الكلية من تكساس إلى مين، تصوّر الإكليل باستقطاب ومدى ديناميكي عالٍ (HDR) لتكوين فيلم متصل لنحو ساعة. نواتج البيانات بصيغة FITS (من المستوى ٠ الخام إلى المعاير)، وكذلك بيانات تدريب كسوف أستراليا ٢٠٢٣.', en: 'Identical telescopes along the path from Texas to Maine imaged the corona in polarized, high-dynamic-range light to build a continuous ~60-minute movie. Products are FITS files (Level-0 raw to calibrated), plus training data from the 2023 Australian eclipse.' },
    size: { ar: '٣٥ موقع رصد', en: '35 observing sites' }, released: '',
    status: { ar: 'سياسة بيانات مفتوحة: تُنشر النواتج بعد اكتمال المعايرة (تحقق من صفحة الوصول للبيانات).', en: 'Open-data policy: products are released after calibration (check the data-access page).' },
    lic: { ar: 'سياسة بيانات مفتوحة معلنة من المشروع، مع احترام مبادئ CARE لحوكمة بيانات المجتمعات.', en: 'Declared open-data policy, applied with the CARE Principles for community data governance.' },
    cite: 'Kovac, S. A., Caspi, A., Seaton, D. B., et al. (2026). Citizen CATE 2024: Extending Totality During the 8 April 2024 Total Solar Eclipse with a Distributed Network of Community Participants. Solar Physics, 301, 12. doi:10.1007/s11207-025-02588-9',
    url: 'https://eclipse.boulder.swri.edu/?p=598', src: 'eclipse.boulder.swri.edu', paper: 'https://doi.org/10.1007/s11207-025-02588-9'
  },
  {
    id: 'cate2017', date: '2017-08-21', kind: 'total', types: ['hdr', 'fits'], aud: ['sci'], reuse: 'open',
    name: { ar: 'تجربة Citizen CATE 2017: صور HDR متوسطة لكل المواقع', en: 'Citizen CATE 2017: averaged HDR frames from every site' },
    by: { ar: 'تجربة Citizen CATE بقيادة المرصد الشمسي الوطني الأمريكي (NSO)، مات بِن، مع ٦٨ فريقًا من أوريغون إلى كارولينا الجنوبية', en: 'Citizen CATE Experiment led by the US National Solar Observatory (Matt Penn), with 68 teams from Oregon to South Carolina' },
    desc: { ar: 'سلسلة مدتها ٩٠ دقيقة من صور الإكليل بالضوء الأبيض. المتاح للتنزيل: إطار HDR متوسط من كل موقع بصيغة FITS في أرشيف مضغوط واحد، مع رسم متحرك لكل المواقع.', en: 'A 90-minute sequence of white-light corona images. Download: one averaged HDR frame per site as FITS in a single compressed archive, plus an animation of all sites.' },
    size: { ar: 'أرشيف ٦٢١ ميغابايت', en: '621 MB archive' }, released: '',
    lic: { ar: 'لا يوجد ترخيص رسمي؛ أعلن الفريق أن البيانات متاحة مجانًا للمجتمعات العلمية والتعليمية وهواة الفلك. اذكر تجربة Citizen CATE عند الاستخدام. (شهادة أمان موقع الجامعة منتهية حاليًا، فقد يحذّرك المتصفح.)', en: 'No formal licence; the team stated the data are freely available to the scientific, education and amateur communities. Credit the Citizen CATE Experiment. (The university site’s security certificate is currently expired, so your browser may warn you.)' },
    cite: 'Citizen CATE Experiment 2017 Team (National Solar Observatory). Averaged HDR FITS files of all CATE sites, 21 August 2017 total solar eclipse. https://www2.physics.siu.edu/cate/',
    url: 'https://www2.physics.siu.edu/cate/', src: 'physics.siu.edu'
  },
  {
    id: 'proba3', date: '2025-05-23', kind: 'artificial', types: ['processed', 'fits'], aud: ['pub', 'sci'], reuse: 'open',
    name: { ar: 'بروبا-3: أول كسوف صناعي في الفضاء', en: 'Proba-3: the first artificial eclipse in space' },
    by: { ar: 'وكالة الفضاء الأوروبية (ESA)، والمرصد الملكي البلجيكي (أداة ASPIICS)', en: 'European Space Agency (ESA), with the Royal Observatory of Belgium (ASPIICS instrument)' },
    desc: { ar: 'قمران صناعيان يطيران معًا بدقة الملّيمتر، يحجب أحدهما قرص الشمس عن الآخر فيصنع «كسوفًا» يدوم حتى ٦ ساعات. أول الصور التُقطت في ٢٣ مايو ٢٠٢٥ ونُشرت في ١٦ يونيو ٢٠٢٥، ومنها صور في خط الإكليل الأخضر (Fe XIV). نواتج البيانات العلمية بصيغة FITS على ثلاثة مستويات.', en: 'Two satellites flying in precise formation: one blocks the Sun for the other, making an “eclipse” that lasts up to 6 hours. First images taken on 23 May 2025 and released on 16 June 2025, including the green coronal line (Fe XIV). Science products are FITS files at three levels.' },
    size: { ar: 'صور ونواتج FITS', en: 'Images + FITS products' }, released: '2025-06-16',
    lic: { ar: 'CC BY-SA 3.0 IGO (أو ترخيص ESA القياسي). يُسمح بإعادة الاستخدام مع ذكر المصدر ومشاركة الأعمال المشتقة بنفس الترخيص.', en: 'CC BY-SA 3.0 IGO (or the ESA Standard Licence). Reuse is allowed with credit; share derivatives under the same licence.' },
    cite: 'ESA/Proba-3/ASPIICS (WOW algorithm). “Proba-3’s first artificial solar eclipse”, ESA, 16 June 2025. CC BY-SA 3.0 IGO.',
    url: 'https://www.esa.int/Enabling_Support/Space_Engineering_Technology/Proba-3/Proba-3_s_first_artificial_solar_eclipse', src: 'esa.int'
  },
  {
    id: 'eso1919', date: '1919-05-29', kind: 'total', types: ['processed'], aud: ['pub'], reuse: 'open',
    name: { ar: 'كسوف ١٩١٩ الذي أثبت نظرية أينشتاين: صورة حديثة', en: 'The 1919 eclipse that tested Einstein: a modern view' },
    by: { ar: 'المرصد الأوروبي الجنوبي (ESO) ومرصد هايدلبرغ، من لوح زجاجي لبعثة دايسون وإدنغتون وديفيدسون', en: 'ESO and Landessternwarte Heidelberg-Königstuhl, from a glass-plate copy by Dyson, Eddington & Davidson' },
    desc: { ar: 'نسخة من لوح فوتوغرافي لكسوف ٢٩ مايو ١٩١٩، أعيدت معالجتها بتقنيات حديثة (إزالة الضوضاء والعيوب). تظهر فيها تفاصيل الإكليل، ونتوء ضخم، ونجوم كوكبة الثور التي استُخدمت لقياس انحناء الضوء. بدقة ٢٣٨٠٠×١٤١٩١ بكسل.', en: 'A copy of a 29 May 1919 eclipse plate, restored with modern processing (noise and artefact removal). It shows coronal detail, a giant prominence and the Taurus stars used to measure light bending. 23,800 × 14,191 px.' },
    size: { ar: '٣٣٫٥ ميغابايت JPEG', en: '33.5 MB JPEG' }, released: '2019-07-01',
    lic: { ar: 'صور ESO منشورة بترخيص CC BY 4.0 ما لم يُذكر غير ذلك: إعادة استخدام حرة مع ذكر المصدر بوضوح.', en: 'ESO images are released under CC BY 4.0 unless stated otherwise: free reuse with clear credit.' },
    cite: 'ESO/Landessternwarte Heidelberg-Königstuhl/F. W. Dyson, A. S. Eddington, & C. Davidson. “A modern view of the 1919 solar eclipse”, ESO image 1919-solar-eclipse, 1 July 2019.',
    url: 'https://eso.org/public/images/1919-solar-eclipse', src: 'eso.org'
  },
  {
    id: 'sherpas', date: '2024-04-08', kind: 'total', types: ['processed', 'hdr'], aud: ['pub', 'sci'], reuse: 'copy',
    also: ['2017-08-21', '2019-07-02', '2023-04-20', '2026-08-12'],
    name: { ar: 'صور «شيربا الرياح الشمسية»: معالجة دروكمولر للإكليل', en: 'Solar Wind Sherpas: Druckmüller’s processed corona images' },
    by: { ar: 'ميلوسلاف دروكمولر (جامعة برنو للتكنولوجيا) وشادية حبّال (جامعة هاواي) وفريقهما', en: 'Miloslav Druckmüller (Brno University of Technology), Shadia Habbal (University of Hawaii) and team' },
    desc: { ar: 'صور مركّبة من عشرات اللقطات بأزمنة تعريض مختلفة (HDR) تُعالج رياضيًا لإظهار البنى الدقيقة للإكليل، وأحيانًا بخطوط الحديد Fe XI وFe XIV. في كسوف ٢٠٢٤ استخدم الفريق طائرة ناسا WB-57، ورصد كسوف ١٢ أغسطس ٢٠٢٦ من إسبانيا وآيسلندا.', en: 'Composites of dozens of exposures (HDR), processed mathematically to reveal fine coronal structure, sometimes in Fe XI and Fe XIV lines. In 2024 the team also flew on NASA’s WB-57; in 2026 they observed the 12 August eclipse from Spain and Iceland.' },
    size: { ar: 'صور عالية الدقة', en: 'High-resolution images' }, released: '',
    lic: { ar: 'محفوظة الحقوق لأصحابها. اعرضها برابط فقط مع ذكر الأسماء، واطلب الإذن قبل أي إعادة نشر.', en: 'Copyright of the authors. Link only with full credit, and ask permission before any republication.' },
    cite: 'Druckmüller, M., Habbal, S. R., et al. (Solar Wind Sherpas). Total solar eclipse corona images, Brno University of Technology / Institute for Astronomy, University of Hawaii.',
    url: 'https://www.fme.vutbr.cz/en/fakulta/zfsi/73954', src: 'fme.vutbr.cz'
  },
  {
    id: 'nasa2024', date: '2024-04-08', kind: 'total', types: ['photo'], aud: ['pub'], reuse: 'cond',
    name: { ar: 'صور ناسا الرسمية لكسوف ٢٠٢٤', en: 'NASA’s official photos of the 2024 eclipse' },
    by: { ar: 'مصوّرو مقر ناسا، مثل أوبري جيميناني وجويل كوسكي', en: 'NASA Headquarters photographers, e.g. Aubrey Gemignani and Joel Kowsky' },
    desc: { ar: 'صور صحفية للكسوف والجمهور من تكساس وإنديانا وغيرهما، مناسبة للعروض والدروس.', en: 'Press photos of the eclipse and of the crowds in Texas, Indiana and elsewhere, ideal for slides and lessons.' },
    size: { ar: 'مئات الصور', en: 'Hundreds of photos' }, released: '2024-04-08',
    lic: { ar: 'إرشادات ناسا لاستخدام الصور: المدارس والمؤلفون ووسائل الإعلام يستخدمونها دون إذن مسبق، بشرط ذكر المصدر وعدم الإيحاء بتأييد ناسا. شعارات ناسا ليست ضمن ذلك.', en: 'NASA Images and Media Usage Guidelines: schools, authors and media may use them without prior permission, with credit and no implied endorsement. NASA logos are excluded.' },
    cite: 'NASA/Aubrey Gemignani (or the named photographer). Total solar eclipse, 8 April 2024. NASA Headquarters photo.',
    url: 'https://www.nasa.gov/image-article/best-of-2024-total-solar-eclipse-in-indianapolis/', src: 'nasa.gov'
  },
  {
    id: 'flickr2024', date: '2024-04-08', kind: 'total', types: ['photo'], aud: ['pub'], reuse: 'mixed',
    name: { ar: 'أرشيف «قارب نجاة البيانات» من فليكر لكسوف ٢٠٢٤', en: 'Flickr Data Lifeboat: members document the 2024 eclipse' },
    by: { ar: 'أعضاء مجتمع فليكر، من معرض جمعته ناسا، وأرشفته فليكر في نوفمبر ٢٠٢٥', en: 'Flickr community members, from a NASA-curated gallery, archived by Flickr in November 2025' },
    desc: { ar: 'أرشيف محفوظ لصور الهواة على طول مسار الكلية في أمريكا الشمالية، مع بيانات كل صورة وترخيصها.', en: 'A preserved archive of amateur photos along the North American path of totality, with each photo’s metadata and licence.' },
    size: { ar: 'أرشيف صور', en: 'Photo archive' }, released: '2025-11-25',
    lic: { ar: 'يختلف من صورة لأخرى: CC BY-SA 4.0 وCC BY-ND وCC0 وعلامة الملك العام. اقرأ ترخيص كل صورة قبل استخدامها.', en: 'Varies per photo: CC BY-SA 4.0, CC BY-ND, CC0 and Public Domain Mark. Check each photo’s licence before use.' },
    cite: 'Flickr members (individual photographers), “Flickr members document Total Solar Eclipse – April 8, 2024”, Flickr Data Lifeboat, 2025.',
    url: 'https://data-lifeboat.flickr.org/dl-showcase/SolarEclipseArchive/README.html', src: 'data-lifeboat.flickr.org'
  }
];
