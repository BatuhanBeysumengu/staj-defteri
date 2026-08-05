export const API_URL = "http://localhost:5106/api";
export async function apiIstek(yol, secenekler = {}) {
  const token = localStorage.getItem("token");

  const cevap = await fetch(`${API_URL}${yol}`, {
    ...secenekler,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...secenekler.headers,
    },
  });

  return cevap;
}
export async function benimProfilim() {
  const cevap = await apiIstek("/kullanicilar/profil/benim");
  if (!cevap.ok) return null;
  return await cevap.json();
}
export async function profilGetir(id) {
  const cevap = await apiIstek(`/kullanicilar/profil/${id}`);
  if (!cevap.ok) return null;
  return await cevap.json();
}
export async function baglantiIstegiGonder(yetkiliId, mesaj) {
  const cevap = await apiIstek("/baglanti/gonder", {
    method: "POST",
    body: JSON.stringify({ yetkiliId, mesaj }),
  });
  if (!cevap.ok) {
    const hata = await cevap.json();
    return { basarili: false, mesaj: hata.mesaj || "İstek gönderilemedi" };
  }
  return { basarili: true };
}
export async function gelenIstekler() {
  const cevap = await apiIstek("/baglanti/gelenler");
  if (!cevap.ok) return [];
  return await cevap.json();
}
export async function istekKabul(id) {
  const cevap = await apiIstek(`/baglanti/${id}/kabul`, { method: "PUT" });
  return cevap.ok;
}
export async function istekRet(id) {
  const cevap = await apiIstek(`/baglanti/${id}/ret`, { method: "PUT" });
  return cevap.ok;
}
export async function kullaniciAra(q, rol) {
  const params = new URLSearchParams();
  if (q) params.append("q", q);
  if (rol) params.append("rol", rol);

  const cevap = await apiIstek(`/kullanicilar/ara?${params.toString()}`);
  if (!cevap.ok) return [];
  return await cevap.json();
}
export async function kayitOl(ad, email, sifre, davetKodu) {
  try {
    const cevap = await fetch(`${API_URL}/auth/kayit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ad, email, sifre, davetKodu }),
    });

    if (!cevap.ok) {
      const hata = await cevap.json();
      return { basarili: false, mesaj: hata.mesaj || "Kayıt başarısız" };
    }

    return { basarili: true, veri: await cevap.json() };  
  } catch {
    return { basarili: false, mesaj: "Sunucuya ulaşılamadı" };
  }
}
export async function pdfIndir(kayitIdler) {
  const token = localStorage.getItem("token");
  const cevap = await fetch(`${API_URL}/kayitlar/pdf`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ kayitIdler }),
  });

  if (!cevap.ok) return false;

  const blob = await cevap.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "staj-defteri.pdf";
  a.click();
  window.URL.revokeObjectURL(url);
  return true;
}
export async function arkadaslikGonder(aliciId) {
  const cevap = await apiIstek(`/arkadaslik/gonder/${aliciId}`, { method: "POST" });
  if (!cevap.ok) {
    const hata = await cevap.json();
    return { basarili: false, mesaj: hata.mesaj || "İstek gönderilemedi" };
  }
  return { basarili: true };
}

export async function arkadaslikDurum(digerId) {
  const cevap = await apiIstek(`/arkadaslik/durum/${digerId}`);
  if (!cevap.ok) return { durum: "yok" };
  return await cevap.json();
}

export async function arkadaslikGelenler() {
  const cevap = await apiIstek("/arkadaslik/gelenler");
  if (!cevap.ok) return [];
  return await cevap.json();
}

export async function arkadaslikKabul(id) {
  const cevap = await apiIstek(`/arkadaslik/${id}/kabul`, { method: "PUT" });
  return cevap.ok;
}

export async function arkadaslikRet(id) {
  const cevap = await apiIstek(`/arkadaslik/${id}/ret`, { method: "PUT" });
  return cevap.ok;
}

export async function arkadasListem() {
  const cevap = await apiIstek("/arkadaslik/listem");
  if (!cevap.ok) return [];
  return await cevap.json();
}
export async function ocrIstek(dosya) {
  const token = localStorage.getItem("token");
  const form = new FormData();
  form.append("dosya", dosya);

  const cevap = await fetch(`${API_URL}/kayitlar/ocr`, {
    method: "POST",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: form,
  });

  if (!cevap.ok) return null;
  return await cevap.json(); 
}