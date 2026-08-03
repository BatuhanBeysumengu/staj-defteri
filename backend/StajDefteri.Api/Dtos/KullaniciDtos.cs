namespace StajDefteri.Api.Dtos;

public record OgrenciEkleIstegi
(string Ad, 
string Email, 
string Sifre,
int YetkiliId);
public record ProfilCevabi(
  int Id,
  string Ad,
  string Email,
  string Rol
);