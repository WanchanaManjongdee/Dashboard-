# คู่มือการติดตั้ง Firebase Realtime Database และการ Deploy ระบบประเมินการอบรม

คู่มือนี้แนะนำขั้นตอนการนำ **survey.html** (หน้าตอบแบบสอบถามบนมือถือ) และ **dashboard.html** (หน้าแดชบอร์ดขึ้นจอโปรเจกเตอร์) ไปใช้งานจริง โดยใช้แพ็กเกจฟรี 100% (Spark Plan ของ Google Firebase)

---

## 1. คุณสมบัติของระบบ
1. **หน้าแบบสอบถาม (survey.html)**: ออกแบบ Mobile-first ปุ่มใหญ่ 1 - 5 คะแนน พร้อมอีโมจิและข้อความกำกับ มีช่องข้อเสนอแนะ และป้องกันการตอบซ้ำในเครื่องเดียวกัน
2. **หน้าแดชบอร์ด (dashboard.html)**: ออกแบบสำหรับขึ้นจอใหญ่/โปรเจกเตอร์ อัปเดตทันทีที่มีคนส่งคำตอบ (Real-time), แสดงคะแนนเฉลี่ยรวม, แปลผลตามเกณฑ์ 5 ระดับ, กราฟแท่งเปรียบเทียบรายข้อ, แสดงความคิดเห็นล่าสุด และมี QR Code ให้สแกนบนจอ
3. **ส่งออกข้อมูล (CSV Export)**: มีปุ่มดาวน์โหลดข้อมูลทั้งหมดเป็นไฟล์ `.csv` รองรับภาษาไทยใน Microsoft Excel โดยตรง (มี UTF-8 BOM)

---

## 2. ขั้นตอนการตั้งค่า Firebase Realtime Database (ฟรี 100%)

### ขั้นตอนที่ 1: สร้างโปรเจกต์ Firebase
1. เข้าไปที่ [https://console.firebase.google.com](https://console.firebase.google.com)
2. เข้าสู่ระบบด้วยบัญชี Google
3. คลิก **"Add project"** (หรือ Create a project)
4. ตั้งชื่อโปรเจกต์ เช่น `training-feedback` แล้วกด **Continue**
5. เลือกปิด Google Analytics (หรือเปิดไว้ก็ได้ตามต้องการ) แล้วกด **Create project**

### ขั้นตอนที่ 2: สร้าง Realtime Database
1. ในเมนูด้านซ้าย เลือก **Build > Realtime Database**
2. คลิกปุ่ม **"Create Database"**
3. **เลือกตำแหน่งเซิร์ฟเวอร์ (Location)**: 
   - แนะนำเลือก **Singapore (`asia-southeast1`)** หรือ **United States (`us-central1`)** เพื่อความเร็วในการตอบสนองสูงสุดในประเทศไทย
4. ในขั้นตอน Security rules ให้เลือก **"Start in test mode"** แล้วกด **Enable**

### ขั้นตอนที่ 3: ตั้งค่ากฎความปลอดภัย (Security Rules)
เพื่อให้ผู้เข้าอบรมสามารถส่งคำตอบและหน้าจอ Dashboard อ่านข้อมูลได้ทันทีโดยไม่ต้องล็อกอิน:
1. ไปที่แท็บ **"Rules"** ของ Realtime Database
2. เปลี่ยนเนื้อหาเป็น:
```json
{
  "rules": {
    ".read": true,
    ".write": true
  }
}
```
3. กดปุ่ม **"Publish"**

### ขั้นตอนที่ 4: คัดลอก Database URL
1. กลับมาที่แท็บ **"Data"**
2. สังเกตด้านบนจะมี URL ฐานข้อมูล เช่น:
   `https://training-feedback-default-rtdb.asia-southeast1.firebasedatabase.app/`
3. คัดลอก URL นี้ไว้

---

## 3. การใส่ Database URL ลงในไฟล์โค้ดทั้ง 2 ไฟล์

เปิดไฟล์ทั้งสองใน Text Editor (เช่น VS Code, Notepad):

### 1) ในไฟล์ `survey.html`
ค้นหาบรรทัด:
```javascript
const firebaseConfig = {
  databaseURL: "YOUR_FIREBASE_DATABASE_URL",
};
```
เปลี่ยนเป็น URL ของคุณ เช่น:
```javascript
const firebaseConfig = {
  databaseURL: "https://training-feedback-default-rtdb.asia-southeast1.firebasedatabase.app",
};
```

### 2) ในไฟล์ `dashboard.html`
ค้นหาบรรทัดเดียวกัน แล้วเปลี่ยนเป็น URL เดียวกัน:
```javascript
const firebaseConfig = {
  databaseURL: "https://training-feedback-default-rtdb.asia-southeast1.firebasedatabase.app",
};
```

---

## 4. วิธี Deploy ออนไลน์ฟรี ใช้งานจริงได้ทันที

### ทางเลือกที่ 1: Netlify Drop (ง่ายและเร็วที่สุด - ไม่ต้องติดตั้งโปรแกรม)
1. นำไฟล์ `survey.html` และ `dashboard.html` ใส่ไว้ในโฟลเดอร์เดียวกัน
2. เปิดเบราว์เซอร์ไปที่ [https://app.netlify.com/drop](https://app.netlify.com/drop)
3. ลากโฟลเดอร์นั้นไปวางบนหน้าเว็บ Netlify
4. รอ 5 วินาที คุณจะได้ลิงก์เว็บไซต์ เช่น `https://random-name.netlify.app/`
   - ลิงก์สำหรับผู้เข้าอบรม: `https://your-site.netlify.app/survey.html`
   - ลิงก์ขึ้นจอโปรเจกเตอร์: `https://your-site.netlify.app/dashboard.html`

### ทางเลือกที่ 2: Firebase Hosting (อยู่ร่วมโปรเจกต์เดียวกัน)
1. ติดตั้ง Firebase CLI ผ่านเทอร์มินัล: `npm install -g firebase-tools`
2. ล็อกอิน: `firebase login`
3. เริ่มต้น Hosting: `firebase init hosting` (เลือกโปรเจกต์เดิม และเลือกโฟลเดอร์ที่มีไฟล์ทั้งสอง)
4. อัปโหลด: `firebase deploy`
5. จะได้ URL พร้อมใช้งานฟรีตลอดชีพ เช่น `https://training-feedback.web.app/`

### ทางเลือกที่ 3: GitHub Pages
1. สร้าง Repository ใหม่บน GitHub แล้วอัปโหลดทั้ง 2 ไฟล์ขึ้นไป
2. ไปที่ **Settings > Pages** ใน GitHub
3. ในส่วน Branch เลือก **main** แล้วกด **Save**
4. จะได้ URL สำหรับนำไปใช้งานได้ทันที

---

## 5. เกณฑ์การแปลผลคะแนนเฉลี่ย 5 ระดับ (Likert Scale)
ระบบคำนวณและแปลผลแบบเรียลไทม์ตามเกณฑ์มาตรฐาน:
- **4.51 - 5.00**: ความพึงพอใจระดับ **มากที่สุด** (Highest / Excellent)
- **3.51 - 4.50**: ความพึงพอใจระดับ **มาก** (High / Good)
- **2.51 - 3.50**: ความพึงพอใจระดับ **ปานกลาง** (Moderate / Fair)
- **1.51 - 2.50**: ความพึงพอใจระดับ **น้อย** (Low / Poor)
- **1.00 - 1.50**: ความพึงพอใจระดับ **น้อยที่สุด** (Lowest / Very Poor)
