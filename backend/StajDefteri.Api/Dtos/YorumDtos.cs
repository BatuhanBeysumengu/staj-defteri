namespace StajDefteri.Api.Dtos;

public record YorumIstegi(string Icerik);

public record YorumCevabi(
    int Id,
    int KullaniciId,
    string KullaniciAd,
    string Icerik,
    DateTime Tarih
);