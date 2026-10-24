# 🎮 PUBG Game Ziyodjon - 3D Battle Royale & Xazina Qidiruvi

Three.js (WebGL) va Web Audio API asosida yaratilgan zamonaviy, interaktiv 3D Battle Royale o'yini!

![Three.js](https://img.shields.io/badge/Three.js-r128-orange)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow)
![HTML5](https://img.shields.io/badge/HTML5-3D%20Game-red)
![CSS3](https://img.shields.io/badge/CSS3-Modern%20HUD-blue)

---

## 🌟 O'yin Imkoniyatlari (Features)

### 1. 🔫 Kengaytirilgan Qurollar Arsenali
- **🗡️ Qilich (Sword)**: Cheksiz yaqin jang quroli.
- **🔫 M416 Avtomat**: Tezkor o't ochuvchi taktik qurol (30/90 o'q).
- **💥 AK-47 Kalashnikov**: Yuqori zarar beruvchi og'ir 7.62mm qurol.
- **🔭 AWM Snayper Vintovkasi**: Uzoq masofali halokatli snayper (dushmanni 1 ta o'qda yo'q qiladi).
- **⚡ Shotgun (Drobovik)**: Yaqin masofada tarqaluvchi 6 ta sochma patron.
- **🎯 Cho'pak (Stick)**: Daraxt tepasidan uloqtiriladigan o'tkir nayzalar.

### 2. 🚗 PUBG Transport Vositalari
- **🚙 Chevrolet Tracker SUV**: To'liq 3D SUV modeli, yuqori tezlik, dushmanlarni bosib ketish va signal chalish (<kbd>H</kbd>).
- **🏍️ Tezkor Mototsikl**: Realistik egilish fizikasi (Lean/Roll physics) va tepaliklardan sakrash.
- **✈️ Uchuvchi Harbiy Samalyot (Pilotable Airplane)**: 95 metrli aerodromdan parvoz qilish, havodan erga qo'shaloq pulemyotlar bilan o't ochish va <kbd>E</kbd> orqali parashyutda sakrash (PUBG Ejection)!

### 3. 🏠 Kirish Mumkin Bo'lgan Uylar va Qurollar (Loot)
- Orol bo'ylab 4 ta harbiy va qishloq uylari joylashtirilgan.
- Har bir uyga ochiq eshik orqali kirib, stolda aylanib turgan **AK-47**, **AWM Snayper**, **Shotgun** va **Katta Harbiy Aptechkalar**ni olish mumkin.

### 4. 🛩️ Harbiy Kargo Samalyoti va Airdrop
- Osmon bo'ylab parvoz qiluvchi harbiy C-130 samalyoti.
- Parashyutda erga tushuvchi qizil tutunli **PUBG Airdrop qutisi** (+60 o'q, +100% yoqilg'i, +10 tanga, +1 ❤️).

### 5. 📚 Fanlar va Qayta Tirilish Tizimi (Revival Quiz)
O'yinda jonlar tugaganda o'yinchi darhol mag'lub bo'lmaydi!
- **📐 Matematika**: Oson arifmetik misollar (+, -, ×, ÷).
- **🇬🇧 Ingliz tili**: Kundalik sodda so'zlar va tarjimalar.
- **🌍 Geografiya**: Davlat poytaxtlari va bayroqlari (<kbd>🇺🇿</kbd>, <kbd>🇹🇷</kbd>, <kbd>🇯🇵</kbd>, <kbd>🇫🇷</kbd> va h.k.).
- **To'g'ri javob berilsa**: Qahramon to'liq jon (❤️❤️❤️) bilan o'sha joydan davom etadi!
- **Noto'g'ri javob berilsa**: O'yin 1-bosqichdan va 0 tanga bilan qayta boshlanadi.

---

## 🕹️ Boshqaruv (Controls)

| Tugma | Amal |
|-------|------|
| <kbd>W</kbd>, <kbd>A</kbd>, <kbd>S</kbd>, <kbd>D</kbd> | Harakatlanish / Haydash / Parvoz |
| <kbd>Shift</kbd> | Tez yugurish (Sprint) / Samalyotni pastga sho'ng'itish |
| <kbd>Space</kbd> | Sakrash / Zinapoyaga chiqish / Samalyotni havoga ko'tarish |
| <kbd>Sichqoncha</kbd> | 360° Kamera ko'rinishi |
| <kbd>LKM (Chap tugma)</kbd> | O't ochish / Qilich zarbasi / Samalyot pulemyotlari |
| <kbd>1</kbd> - <kbd>6</kbd> | Qurollarni almashtirish (Qilich, M416, AK-47, AWM, Shotgun, Cho'pak) |
| <kbd>R</kbd> | Qurolni o'qlash (Reload) |
| <kbd>E</kbd> | Minish / Tushish / Airdrop ochish / Qurollarni terish / Parashyutda sakrash |
| <kbd>F</kbd> | Transportga yoqilg'i quyish (5 tanga) |
| <kbd>H</kbd> | Mashina signali |
| <kbd>M</kbd> | Ovozni yoqish / o'chirish |

---

## 🚀 Ishga Tushirish (How to Run)

1. Ushbu loyihani yuklab oling:
```bash
git clone https://github.com/umarovafiruza/pubg-game-Ziyodjon.git
```
2. Loyiha papkasiga kiring:
```bash
cd pubg-game-Ziyodjon
```
3. Lokal serverni ishga tushiring:
```powershell
powershell -ExecutionPolicy Bypass -File .\server.ps1
```
4. Brauzerda oching:
```
http://localhost:8080/
```

Yoki to'g'ridan-to'g'ri `index.html` faylini istalgan zamonaviy veb-brauzerda ochib o'ynash mumkin!

---

## 🛠️ Texnologiyalar
- **Three.js**: 3D grafika, relyef (heightmap), yoritish va soyalar.
- **Web Audio API**: Realistik o'q ovozlari, samalyot va transport dvigatellari, portlashlar.
- **HTML5 & CSS3**: Zamonaviy shaffof shisha (glassmorphism) uslubidagi HUD panellari.
- **Mobile Touch Engine**: Smartfon va planshetlar uchun Virtual Joystick, 360° sensorli kamera, tezkor o't ochish, sakrash va dinamik interaktiv boshqaruv paneli.
