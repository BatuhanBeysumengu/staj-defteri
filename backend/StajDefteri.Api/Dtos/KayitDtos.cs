
namespace StajDefteri.Api.Dtos;

public record KayitEkleIstegi(string Icerik);
public record RedIstegi(string Aciklama);
public record KayitCevabi(
    int Id,
    DateOnly Tarih,
    string Icerik,
    string Durum,
    int OgrenciId,
    string? RedAciklamasi,
    DateTime? RedTarihi,
    string? ReddedenAd
);
public record PdfIstegi(int[] KayitIdler);