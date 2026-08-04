namespace StajDefteri.Api.Dtos;
public record BaglantiIstegiGonder(int YetkiliId, string Mesaj);
public record BaglantiIstegiCevabi(
    int Id,
    int OgrenciId,
    string OgrenciAd,
    string Mesaj,
    string Durum,
    DateTime Tarih
);