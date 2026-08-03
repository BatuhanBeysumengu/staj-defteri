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