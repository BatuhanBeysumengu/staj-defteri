namespace StajDefteri.Api.Models;

public class Bildirim
{
    public int Id { get; set; }
    public int KullaniciId { get; set; }
    public string Metin { get; set; } = string.Empty;
    public string Tur { get; set; } = "genel";
    public string? Link { get; set; }
    public bool Okundu { get; set; }
    public DateTime Tarih { get; set; }
}