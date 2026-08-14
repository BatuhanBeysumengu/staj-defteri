
namespace StajDefteri.Api.Dtos;

public record KayitEkleIstegi(string Icerik,string Gorunurluk);
public record RedIstegi(string Aciklama);
public record KayitCevabi(
    int Id,
    DateOnly Tarih,
    string Icerik,
    string Durum,
    int OgrenciId,
    string? RedAciklamasi,
    DateTime? RedTarihi,
    string? ReddedenAd,
    string? FotografYolu
);
public record PdfIstegi(int[] KayitIdler);
public record GorunurlukIstegi(string Gorunurluk);