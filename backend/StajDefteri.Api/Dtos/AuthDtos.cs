namespace StajDefteri.Api.Dtos;

public record GirisIstegi(string Email, string Sifre);
public record GirisCevabi(int Id, string Ad, string Email, string Rol);