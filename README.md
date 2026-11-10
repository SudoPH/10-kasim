# 10 Kasım

Mustafa Kemal Atatürk'ü anma sayfası. Saat, her 10 Kasım'da 09.05'te durur.

## Sayfada ne var

- Türkiye saatini gösteren analog bir saat. 10 Kasım günü 09.05'e gelince durur ve o gün boyunca devam etmez. Ertesi gün yeniden çalışır.
- 10 Kasım 09.05–09.07 arasında saygı duruşu: sözler çekilir, yalnızca saat kalır.
- Atatürk'ün sözleri. Her sözün altında nerede söylendiği yazılıdır.

Framework ve bağımlılık yok: yalnızca HTML, CSS ve JavaScript.

## Önizleme

Sayfanın 10 Kasım görünümünü o güne beklemeden görmek için adresin sonuna şunlardan birini ekleyin:

| Adres sonu | Ne gösterir |
| --- | --- |
| `?onizleme=gun` | Saat 09.05'te durmuş görünür |
| `?onizleme=gecis` | 09.04.50'den başlar, 10 saniye sonra saat durur ve saygı duruşu başlar |
| `?onizleme=an` | Saygı duruşunun ilk saniyesinden başlar |

## Yerelde açma

`index.html` dosyasını tarayıcıda açmanız yeterli.

## Sözler

Sözler `script.js` içindeki `sozler` listesindedir. Her satır `[söz, kaynak]` biçimindedir. Yeni bir söz eklerken kaynağını (konuşma, yer, tarih) mutlaka yazın.

## Lisans

Kod GNU Genel Kamu Lisansı (GPL) ile paylaşılmıştır. Ayrıntı için `LICENSE` dosyasına bakın.
