using System.Text.Json.Serialization;

namespace StajDefteri.Api.Dtos;
public record BaglantiIstegiGonder([property: JsonRequired] int YetkiliId, string Mesaj);
public record BaglantiIstegiCevabi(
    int Id,
    int OgrenciId,
    string OgrenciAd,
    string Mesaj,
    string Durum,
    DateTime Tarih
);