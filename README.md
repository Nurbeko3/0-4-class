# Kompyuter bilan tanishuv

Tayyorlov va 1–4-sinf o'quvchilari uchun kompyuter savodxonligi o'yinlari: sichqoncha, klaviatura,
tezkor tugmalar (Ctrl+C, Ctrl+V, Ctrl+Z...), kompyuter qismlari, ish stoli, matn muharriri (Word), rasm chizish
va Paint asboblari, mantiq, algoritm, jadval (Excel) va internet xavfsizligi. Interfeys o'zbek va
rus tilida. Sayt internetsiz ishlaydi, akkaunt va server yo'q — natijalar shu brauzerning o'zida saqlanadi.

## O'rnatish (bir marta, internet bilan)

1. [Node.js](https://nodejs.org) ni o'rnating (LTS versiyasi).
2. Loyiha papkasida buyruq qatorini oching va bajaring:

   ```
   npm install
   npm run build
   ```

`npm run build` tayyor saytni `dist/` papkasiga yig'adi. Kod, matn yoki ovoz o'zgarsa, uni qayta bajaring.

## Ishga tushirish

`start.bat` faylini ikki marta bosing. U saytni `http://localhost:4173` manzilida ochadi
(`dist/` hali yo'q bo'lsa, avval o'zi yig'adi). To'xtatish uchun qora oynani yoping.

Buyruq qatoridan: `npm start`.

Dasturchilar uchun: `npm run dev` (ishlab chiqish serveri), `npm test` (testlar), `npm run lint`.

## Sinf xonasida internetsiz ishlatish

Uch xil yo'l bor, qulayini tanlang:

- **Har kompyuterda alohida.** Loyiha papkasini (`node_modules` va `dist` bilan birga) fleshka orqali
  ko'chiring va har birida `start.bat` ni ishga tushiring. Kompyuterda Node.js o'rnatilgan bo'lishi kerak.
- **Bitta kompyuterdan butun sinfga.** O'qituvchi kompyuterida `start.bat` ni ishga tushiring. Qora oynada
  `Network: http://192.168.x.x:4173` ko'rinishidagi manzil chiqadi — o'quvchilar kompyuterida brauzerga shu
  manzilni yozing. Kompyuterlar bitta lokal tarmoqda (Wi-Fi yoki kabel) bo'lishi kerak, internet shart emas.
- **O'rnatilgan ilova sifatida.** Sayt `http://localhost:4173` manzilida bir marta ochilgach, brauzer uni
  to'liq keshlaydi. Chrome yoki Edge manzil qatoridagi "O'rnatish" tugmasi orqali uni ilova qilib
  o'rnatish mumkin. Bu faqat `localhost` manzilida ishlaydi; tarmoq manzili (`192.168...`) orqali ochilganda
  brauzer saytni keshlamaydi, shuning uchun o'qituvchi kompyuteri yoniq turishi kerak.

Har bir o'quvchining natijalari (yulduzchalar) o'zi ishlagan brauzerda saqlanadi.

## Ovozli yo'riqnoma

Har bir topshiriq matni ovoz bilan ham o'qiladi. Hozir ovoz fayllari o'rnida jimjit namunalar turibdi —
ularni o'zingiz yozib olishingiz kerak:

1. `AUDIO_SCRIPT.md` ni oching: unda har bir fayl nomi va o'qiladigan matn (o'zbekcha va ruscha) bor.
2. Har bir matnni yozib oling va MP3 qilib, aynan shu nom bilan saqlang:
   - o'zbekcha — `public/audio/uz/`
   - ruscha — `public/audio/ru/`
3. `npm run build` ni qayta bajaring.

Matnlar `src/i18n/strings.ts` da va yangi modullarda `src/modules/<modul>/strings.ts` da (`say.` bilan boshlanadigan kalitlar). Yangi matn qo'shilsa,
`npm run audio` buyrug'i yetishmayotgan fayllar uchun jimjit namuna yaratadi va `AUDIO_SCRIPT.md` ni
yangilaydi. Siz yozgan fayllarga u tegmaydi.

## Tezkor tugmalar darsi haqida

«Tezkor tugmalar» o'yinlarida (Ctrl+C, Ctrl+V, Ctrl+X, Ctrl+Z, Ctrl+A, Ctrl+S) tugmalar klaviaturadagi
joyiga qarab aniqlanadi, shuning uchun rus raskladkasida ham ishlaydi. O'yin ichida brauzerning o'z amali
(masalan, Ctrl+S — sahifani saqlash) to'xtatib qo'yiladi. Sensorli ekranda avval ekrandagi Ctrl, keyin harf bosiladi.

## O'qituvchi rejimi

Manzil: `/teacher` (bosh sahifaning pastki o'ng burchagidagi "O'qituvchi" havolasi).

- **PIN-kod.** Birinchi kirishda 4 raqamli PIN o'ylab topasiz (ikki marta kiritiladi), keyin har safar so'raladi.
  PIN faqat shu kompyuterning brauzerida saqlanadi — har kompyuterda alohida o'rnatiladi. Bu bolalardan himoya,
  jiddiy xavfsizlik emas. PIN esdan chiqsa: brauzerda sayt ma'lumotlarini tozalang (progress ham o'chadi).
- **To'liq ekran** tugmasi — proyektor uchun. Har darajadagi **Ko'rsatish** tugmasi o'yinni ochadi; o'qituvchi
  yopiq darajani ham ko'rsata oladi.
- **Dars rejasi.** Har mavzuda: maqsad, tushuntirish, amaliyot, maslahat (matnlar `src/i18n/strings.ts` dagi
  `lesson.*` kalitlari).
- **Qulflash.** "Sinfni yopish" butun sinfni, har darajadagi "Ochiq/Yopiq" tugmasi bitta darajani o'quvchilar
  uchun yopadi. Qulflar ham faqat shu kompyuterga tegishli.
- **Progressni tozalash** — shu kompyuterdagi barcha yulduzchalarni o'chiradi (tasdiq so'raladi).
- Ishni tugatgach **Chiqish** tugmasini bosing — aks holda shu brauzer tabi yopilguncha panel ochiq qoladi.
