const kullanicilar = [
  { id: 1, email: "ogrenci@test.com",  sifre: "1234", rol: "ogrenci", ad: "Batuhan",     yetkiliId: 3 },
  { id: 2, email: "ogrenci2@test.com", sifre: "1234", rol: "ogrenci", ad: "Ayse",        yetkiliId: 4 },
  { id: 3, email: "yetkili@test.com",  sifre: "1234", rol: "yetkili", ad: "ilker Hoca",  yetkiliId: null },
  { id: 4, email: "yetkili2@test.com", sifre: "1234", rol: "yetkili", ad: "Zeynep Hoca", yetkiliId: null },
];

export function girisYap(email, sifre) {
  const kullanici = kullanicilar.find(
    (k) => k.email === email && k.sifre === sifre
  );
  if (!kullanici) return null;

  const { sifre: _, ...guvenliKullanici } = kullanici;
  return guvenliKullanici;
}

export function bagliOgrenciIdleri(yetkiliId) {
  return kullanicilar
    .filter((k) => k.rol === "ogrenci" && k.yetkiliId === yetkiliId)
    .map((k) => k.id);
}

export function kullaniciAdiGetir(id) {
  const k = kullanicilar.find((k) => k.id === id);
  return k ? k.ad : "Bilinmeyen";
}