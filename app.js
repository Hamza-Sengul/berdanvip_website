import express from "express";
import pageRoute from "./routes/pageRoute.js";
import mysql from "mysql";
import bodyParser from "body-parser";
import multer from "multer";
import path from "path";

const db = mysql.createConnection({
  host: "localhost", // Veritabanı sunucusunun adresi
  user: "root", // Veritabanı kullanıcı adı
  password: "", // Veritabanı şifresi
  database: "dugunveritabani2_db", // Bağlanılacak veritabanı
  port: 3306,
});

// Bağlantıyı kurma
db.connect((err) => {
  if (err) {
    console.error("Veritabanına bağlanırken bir hata oluştu: " + err.stack);
    return;
  }
  console.log("Veritabanına başarıyla bağlandı, id: " + db.threadId);
});

const app = express();
const port = 3000;

// ejs template engines
app.set("view engine", "ejs");

//Static Files
app.use(express.static("public"));

// Multer yapılandırması (dosya yükleme için)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use("/uploads", express.static("uploads"));

app.post("/admin/update", (req, res) => {
  const {
    siteBasligi,
    anasayfaBasligi,
    anasayfaAltBasligi,
    anaSayfaImg,
    telNo,
    email,
    adres,
    calismaSaatleriHaftaIci,
    calismaSaatleriHaftaSonu,
  } = req.body;
  const anasayfaImg = req.file ? req.file.filename : null;

  const sql = `INSERT INTO site_ayarları (siteBasligi, anasayfaBasligi, anasayfaAltBasligi, anaSayfaImg, telNo, email, adres, calismaSaatleriHaftaIci, calismaSaatleriHaftaSonu) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  db.query(
    sql,
    [
      siteBasligi,
      anasayfaBasligi,
      anasayfaAltBasligi,
      anaSayfaImg,
      telNo,
      email,
      adres,
      calismaSaatleriHaftaIci,
      calismaSaatleriHaftaSonu,
    ],
    (err, result) => {
      if (err) throw err;
      console.log("Genel ayarlar kaydedildi: ", result.insertId);
      res.redirect("/");
    }
  );
});

app.post("/admin/paketler", (req, res) => {
  const { paketBasligi, paketAciklamasi } = req.body;

  const sql = `INSERT INTO paketler (paketBasligi, paketAciklamasi) VALUES (?, ?)`;
  db.query(sql, [paketBasligi, paketAciklamasi], (err, result) => {
    if (err) throw err;
    console.log("Paket kaydedildi: ", result.insertId);
    res.redirect("/");
  });
});

app.post("/admin/salonlar", upload.single("salonImg"), (req, res) => {
  const salonImg = req.file ? req.file.filename : null;

  const sql = `INSERT INTO salonlar (salonImg) VALUES (?)`;
  db.query(sql, [salonImg], (err, result) => {
    if (err) throw err;
    console.log("Salon görseli kaydedildi: ", result.insertId);
    res.redirect("/");
  });
});

app.post("/admin/hizmetler", upload.single("hizmetImg"), (req, res) => {
  const { hizmetBasligi, hizmetAciklama } = req.body;
  const hizmetImg = req.file ? req.file.filename : null;

  const sql = `INSERT INTO hizmetler (hizmetBasligi, hizmetImg, hizmetAciklama) VALUES (?, ?, ?)`;
  db.query(sql, [hizmetBasligi, hizmetImg, hizmetAciklama], (err, result) => {
    if (err) throw err;
    console.log("Hizmet kaydedildi: ", result.insertId);
    res.redirect("/");
  });
});

app.post("/admin/hakkimizda", (req, res) => {
  const { hakkimizdaBaslik, hakkimizdaAciklama } = req.body;

  const sql = `INSERT INTO hakkimizda (baslik, aciklama) VALUES (?, ?)`;
  db.query(sql, [hakkimizdaBaslik, hakkimizdaAciklama], (err, result) => {
    if (err) throw err;
    console.log("Hakkımızda bilgisi kaydedildi: ", result.insertId);
    res.redirect("/");
  });
});

const getSiteAyarları = (callback) => {
  const sql = "SELECT * FROM site_ayarları";
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Site ayarları çekme hatası: " + err.stack);
      return callback(err, null);
    }
    // Array'in son elemanını al
    const lastIndex = results.length - 1;
    callback(null, results[lastIndex]); // Son kaydı döndürüyoruz
  });
};

const getHakkimizda = (callback) => {
  const sql = "SELECT * FROM hakkimizda";
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Hakkımızda bilgisi çekme hatası: " + err.stack);
      return callback(err, null);
    }
    // Array'in son elemanını al
    const lastIndex = results.length - 1;
    callback(null, results[lastIndex]); // Son kaydı döndürüyoruz
  });
};

// Hizmetler tablosundaki tüm verileri almak
const getHizmetler = (callback) => {
  const sql = "SELECT * FROM hizmetler";
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Hizmetler çekme hatası: " + err.stack);
      return callback(err, null);
    }
    callback(null, results); // Tüm hizmetleri döndürüyoruz
  });
};

// Paketler tablosundaki tüm verileri almak
const getPaketler = (callback) => {
  const sql = "SELECT * FROM paketler";
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Paketler çekme hatası: " + err.stack);
      return callback(err, null);
    }
    callback(null, results); // Tüm paketleri döndürüyoruz
  });
};

const getSalonlar = (callback) => {
  const sql = "SELECT * FROM salonlar";
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Salonlar çekme hatası: " + err.stack);
      return callback(err, null);
    }
    callback(null, results); // Salon verilerini döndürüyoruz
  });
};

app.use((req, res, next) => {
  getSiteAyarları((err, siteAyarları) => {
    if (err) return res.status(500).send("Veri çekme hatası");

    getHakkimizda((err, hakkimizda) => {
      if (err) return res.status(500).send("Veri çekme hatası");

      getHizmetler((err, hizmetler) => {
        if (err) return res.status(500).send("Veri çekme hatası");

        getPaketler((err, paketler) => {
          if (err) return res.status(500).send("Veri çekme hatası");

          getSalonlar((err, salonlar) => {
            if (err) return res.status(500).send("Veri çekme hatası");

            // Verileri res.locals üzerinden her sayfada kullanılabilir hale getir
            res.locals.siteAyarları = siteAyarları;
            res.locals.hakkimizda = hakkimizda;
            res.locals.hizmetler = hizmetler;
            res.locals.paketler = paketler;
            res.locals.salonlar = salonlar;

            // Bir sonraki middleware veya route'a geçiş
            next();
          });
        });
      });
    });
  });
});

app.get("/", (req, res) => {
  res.render("index", {
    siteAyarları: res.locals.siteAyarları,
    hakkimizda: res.locals.hakkimizda,
    hizmetler: res.locals.hizmetler,
    paketler: res.locals.paketler,
    salonlar: res.locals.salonlar,
  });
});

// Hizmetler sayfası
app.get("/services", (req, res) => {
  res.render("services", {
    siteAyarları: res.locals.siteAyarları,
    hizmetler: res.locals.hizmetler,
  });
});

// Fotoğraflar sayfası
app.get("/photos", (req, res) => {
  res.render("photos", {
    siteAyarları: res.locals.siteAyarları,
    salonlar: res.locals.salonlar,
  });
});

// İletişim sayfası
app.get("/contact", (req, res) => {
  res.render("contact", {
    siteAyarları: res.locals.siteAyarları,
    hakkimizda: res.locals.hakkimizda,
  });
});

// Hakkımızda sayfası
app.get("/about", (req, res) => {
  res.render("about", {
    siteAyarları: res.locals.siteAyarları,
    hakkimizda: res.locals.hakkimizda,
  });
});

function romevoPacket(e, packetId) {
  if (e.target.id == "delete-packet") {
    alert("silmek istedğinizden emin misiniz?");
    // Veritabanından silme isteği gönderiliyor
    fetch(`/admin/delete-packet/${packetId}`, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          e.target.parentElement.remove(); // UI'dan öğeyi kaldır
        } else {
          console.error("Silme işlemi başarısız oldu");
        }
      })
      .catch((error) => console.error("Hata:", error));
  }
}
app.delete("/admin/delete-packet/:id", (req, res) => {
  const packetId = req.params.id;

  const query = "DELETE FROM paketler WHERE id = ?";

  db.query(query, [packetId], (err, result) => {
    if (err) {
      console.error("Veritabanı hatası:", err);
      return res
        .status(500)
        .json({ success: false, message: "Veritabanı hatası" });
    }

    if (result.affectedRows > 0) {
      res.json({ success: true, message: "Paket başarıyla silindi" });
    } else {
      res.json({ success: false, message: "Paket bulunamadı" });
    }
  });
});

app.delete("/admin/delete-packet/:id", (req, res) => {
  const packetId = req.params.id;

  const query = "DELETE FROM paketler WHERE id = ?";

  db.query(query, [packetId], (err, result) => {
    if (err) {
      console.error("Veritabanı hatası:", err);
      return res
        .status(500)
        .json({ success: false, message: "Veritabanı hatası" });
    }

    if (result.affectedRows > 0) {
      res.json({ success: true, message: "Paket başarıyla silindi" });
    } else {
      res.json({ success: false, message: "Paket bulunamadı" });
    }
  });
});

app.delete("/admin/delete-services/:id", (req, res) => {
  const packetId = req.params.id;

  const query = "DELETE FROM hizmetler WHERE id = ?";

  db.query(query, [packetId], (err, result) => {
    if (err) {
      console.error("Veritabanı hatası:", err);
      return res
        .status(500)
        .json({ success: false, message: "Veritabanı hatası" });
    }

    if (result.affectedRows > 0) {
      res.json({ success: true, message: "Hizmet başarıyla silindi" });
    } else {
      res.json({ success: false, message: "Hizmet bulunamadı" });
    }
  });
});
app.delete("/admin/delete-photos/:id", (req, res) => {
  const packetId = req.params.id;

  const query = "DELETE FROM salonlar WHERE id = ?";

  db.query(query, [packetId], (err, result) => {
    if (err) {
      console.error("Veritabanı hatası:", err);
      return res
        .status(500)
        .json({ success: false, message: "Veritabanı hatası" });
    }

    if (result.affectedRows > 0) {
      res.json({ success: true, message: "Hizmet başarıyla silindi" });
    } else {
      res.json({ success: false, message: "Hizmet bulunamadı" });
    }
  });
});

//Router
app.use("/", pageRoute);

app.listen(port, () => {
  console.log("Listening port 3000");
});
