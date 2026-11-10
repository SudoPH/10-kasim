/* 10 Kasım — sade anma sayfası.
   - Analog saat Türkiye saatini gösterir; 10 Kasım günü 09.05'te durur.
   - 10 Kasım 09.05–09.07: saygı duruşu. Sözler çekilir, yalnızca saat kalır.
   - Sözlerin her birinin kaynağı altında yazılıdır.
   Framework yok, bağımlılık yok. */
(function () {
  'use strict';

  var ONIZLEME = new URLSearchParams(location.search).get('onizleme');
  var NS = 'http://www.w3.org/2000/svg';
  var SURE_MS = 2 * 60 * 1000;   // saygı duruşu: 09.05.00 – 09.07.00
  var ROTASYON_MS = 12000;

  // Kaynağı belli sözler: [metin, kaynak]
  var sozler = [
    ['Dünyada her şey için, medeniyet için, hayat için, muvaffakiyet için en hakiki mürşit ilimdir, fendir. İlmin ve fennin haricinde mürşit aramak gaflettir, cehalettir, dalâlettir.', 'Samsun, 1924'],
    ['Arkadaşlar, barış istiyoruz, fakat dediğim gibi tam bağımsızlık istiyoruz. Barışın anlamı budur. Bunu istemeye hakkımız ve gücümüz vardır.', 'İzmir, 2 Şubat 1923'],
    ['Milletin hayatı tehlikeye maruz kalmadıkça, savaş bir cinayettir.', 'Adana, 16 Mart 1923'],
    ['Yurtta sulh, cihanda sulh için çalışıyoruz.', 'Cumhuriyet Halk Fırkası beyannamesi, 20 Nisan 1931'],
    ['Şuna da kaniim ki, eğer devamlı sulh isteniyorsa kütlelerin vaziyetlerini iyileştirecek beynelmilel tedbirler alınmalıdır. İnsanlığın heyeti umumiyesinin refahı, açlık ve tazyikin yerine geçmelidir. Dünya vatandaşları, haset, aç gözlülük ve kinden uzaklaşacak şekilde terbiye edilmelidir.', 'Gladys Baker ile söyleşi, Mayıs 1935'],
    ['Ne mutlu Türküm diyene!', 'Onuncu Yıl Nutku, 29 Ekim 1933'],
    ['Ey Türk gençliği! Birinci vazifen, Türk istiklâlini, Türk Cumhuriyetini, ilelebet muhafaza ve müdafaa etmektir.', 'Gençliğe Hitabe, Nutuk, 1927']
  ];

  function og(id) { return document.getElementById(id); }
  var saat = og('saat'), akrep = og('akrep'), yelkovan = og('yelkovan'),
      saniye = og('saniye'), not = og('not');

  // ---- Saat çizgileri -----------------------------------------
  var cizgiler = og('cizgiler');
  for (var i = 0; i < 12; i++) {
    var a = i * Math.PI / 6, c = Math.cos(a), s = Math.sin(a);
    var l = document.createElementNS(NS, 'line');
    l.setAttribute('x1', (100 + 84 * s).toFixed(2));
    l.setAttribute('y1', (100 - 84 * c).toFixed(2));
    l.setAttribute('x2', (100 + 92 * s).toFixed(2));
    l.setAttribute('y2', (100 - 92 * c).toFixed(2));
    cizgiler.appendChild(l);
  }

  // ---- Saat rakamları
  var rakamlar = og('rakamlar');
  for (var n = 1; n <= 12; n++) {
    var ar = n * Math.PI / 6;
    var r = document.createElementNS(NS, 'text');
    r.setAttribute('x', (100 + 66 * Math.sin(ar)).toFixed(2));
    r.setAttribute('y', (100 - 66 * Math.cos(ar)).toFixed(2));
    r.textContent = n;
    rakamlar.appendChild(r);
  }

  // ---- Türkiye saati -------------------------------------------
  var bicim = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/Istanbul', hourCycle: 'h23',
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit'
  });

  function parcala(ms) {
    var p = {};
    bicim.formatToParts(new Date(ms)).forEach(function (x) { p[x.type] = x.value; });
    return { yil: +p.year, ay: +p.month, gun: +p.day,
             saat: +p.hour, dakika: +p.minute, saniye: +p.second };
  }

  // Türkiye yıl boyu UTC+3
  function anmaAni(yil) { return new Date(yil + '-11-10T09:05:00+03:00').getTime(); }
  function ikiHane(n) { return (n < 10 ? '0' : '') + n; }

  var taban = Date.now();
  function simdi() {
    var yil = parcala(taban).yil;
    if (ONIZLEME === 'gecis') { return anmaAni(yil) - 10000 + (Date.now() - taban); }
    if (ONIZLEME === 'an')    { return anmaAni(yil) + (Date.now() - taban); }
    return Date.now();
  }

  function don(el, derece) { el.setAttribute('transform', 'rotate(' + derece + ' 100 100)'); }

  // ---- Sözler ---------------------------------------------------
  var kap = og('sozler'), nokKap = og('noktalar');
  var ogeler = [], noktalar = [], sira = 0, durakli = false;

  sozler.forEach(function (soz, k) {
    var bq = document.createElement('blockquote');
    bq.className = 'soz';
    var p = document.createElement('p');
    p.textContent = '\u00AB' + soz[0] + '\u00BB';
    var kaynak = document.createElement('cite');
    kaynak.className = 'soz-kaynak';
    kaynak.textContent = soz[1];
    bq.appendChild(p);
    bq.appendChild(kaynak);
    kap.appendChild(bq);
    ogeler.push(bq);

    var d = document.createElement('button');
    d.type = 'button';
    d.className = 'nokta';
    d.setAttribute('aria-label', (k + 1) + '. söz');
    d.addEventListener('click', function () { goster(k); });
    nokKap.appendChild(d);
    noktalar.push(d);
  });

  function goster(i) {
    sira = (i + sozler.length) % sozler.length;
    ogeler.forEach(function (e, k) {
      e.classList.toggle('aktif', k === sira);
      e.setAttribute('aria-hidden', k === sira ? 'false' : 'true');
    });
    noktalar.forEach(function (n, k) { n.classList.toggle('aktif', k === sira); });
  }

  og('sonraki').addEventListener('click', function () { goster(sira + 1); });
  og('onceki').addEventListener('click', function () { goster(sira - 1); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight') { goster(sira + 1); }
    else if (e.key === 'ArrowLeft') { goster(sira - 1); }
  });

  var sahne = og('sahne');
  ['mouseenter', 'focusin'].forEach(function (o) { sahne.addEventListener(o, function () { durakli = true; }); });
  ['mouseleave', 'focusout'].forEach(function (o) { sahne.addEventListener(o, function () { durakli = false; }); });

  setInterval(function () {
    if (!durakli && !document.hidden && !document.body.classList.contains('durus')) { goster(sira + 1); }
  }, ROTASYON_MS);

  goster(0);

  // ---- Ana döngü -------------------------------------------------
  var sonEtiket = '';

  function tik() {
    var t = simdi(), p = parcala(t);
    var anma = anmaAni(p.yil);
    var nov10 = p.ay === 11 && p.gun === 10;
    var durdu = ONIZLEME === 'gun' || (nov10 && t >= anma);
    var durusta = nov10 && t >= anma && t < anma + SURE_MS;

    var h = p.saat, m = p.dakika, s = p.saniye;
    if (durdu) { h = 9; m = 5; s = 0; }

    don(akrep, (h % 12) * 30 + m * 0.5 + s / 120);
    don(yelkovan, m * 6 + s * 0.1);
    don(saniye, s * 6);

    saat.classList.toggle('durdu', durdu);
    document.body.classList.toggle('durus', durusta);
    not.hidden = !durdu;
    not.textContent = durusta ? 'Saygı duruşu.' : 'Saat 09.05’te durdu.';

    var etiket = 'Saat ' + ikiHane(h) + '.' + ikiHane(m);
    if (etiket !== sonEtiket) {
      saat.setAttribute('aria-label', etiket);
      sonEtiket = etiket;
    }

  }

  tik();
  setInterval(tik, 250);
  document.addEventListener('visibilitychange', function () {
    if (!document.hidden) { tik(); }
  });
})();
