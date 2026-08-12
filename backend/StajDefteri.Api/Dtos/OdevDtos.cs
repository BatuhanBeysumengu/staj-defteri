using System.Text.Json.Serialization;

namespace StajDefteri.Api.Dtos;
public record OdevVerIstegi(
    string Baslik,
    string? Aciklama,
    [property: JsonRequired] DateOnly SonTeslimTarihi,
    [property: JsonRequired] int OgrenciId
);
public record OdevCevabi(
    int Id,
    string Baslik,
    string Aciklama,
    DateOnly SonTeslimTarihi,
    string Durum,
    int KisiId,
    string KisiAd,
    string? TeslimNotu,
    string? TeslimDosyaYolu,
    string? RedAciklamasi
);

public record OdevTeslimIstegi(string? TeslimNotu);
public record OdevRedIstegi(string Aciklama);