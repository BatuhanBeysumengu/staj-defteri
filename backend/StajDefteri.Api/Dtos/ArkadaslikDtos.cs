namespace StajDefteri.Api.Dtos;

public record ArkadaslikIstegiCevabi(
    int Id,
    int GonderenId,
    string GonderenAd,
    DateTime Tarih
);
public record ArkadasCevabi(int Id, string Ad, string Rol);