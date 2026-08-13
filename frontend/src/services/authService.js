import { API_URL } from "./api";

export async function girisYap(email, sifre) {
  try {
    const cevap = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, sifre }),
    });

    if (!cevap.ok) return null;

    return await cevap.json();   
  } catch (error_) {
    console.error("Giriş isteği başarısız:", error_);
    return null;
  }
}
export async function ogrenciEkle(ad, email, sifre, yetkiliId) {
  try {
    const cevap = await fetch(`${API_URL}/kullanicilar/ogrenci`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ad, email, sifre, yetkiliId }),
    });

    if (!cevap.ok) {
      const error_ = await cevap.json();
      return { basarili: false, mesaj: error_.mesaj || "Ekleme başarısız" };
    }

    const yeni = await cevap.json();
    return { basarili: true, ogrenci: yeni };
  } catch {
    return { basarili: false, mesaj: "Sunucuya ulaşılamadı" };
  }
}