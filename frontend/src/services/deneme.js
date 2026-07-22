const denemekullanici =[
  {email :"ogrenci@test.com", sifre:"1234", rol : "ogrenci",ad:"Batuhan"},
  {email :"yetkili@test.com", sifre:"4321", rol : "yetkili",ad:"ilker"}
];
export function girisYap(email, sifre) {
  const kullanici= denemekullanici.find(
    (k) => k.email === email && k.sifre === sifre
  );
  return kullanici || null;
}