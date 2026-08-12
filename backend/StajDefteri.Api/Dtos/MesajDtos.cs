using System.Text.Json.Serialization;

namespace StajDefteri.Api.Dtos;
public record MesajGonder(
    [property: JsonRequired] int AliciId,
    string? Icerik,
    int? PaylasilanKayitId
);
public record MesajCevabi(
    int Id,
    int GonderenId,
    int AliciId,
    string? Icerik,
    int? PaylasilanKayitId,
    string? PaylasilanKayitOnizleme,  
    DateTime Tarih
);
public record KonusmaOzeti(
    int KullaniciId,
    string KullaniciAd,
    string SonMesaj,
    DateTime SonTarih
);