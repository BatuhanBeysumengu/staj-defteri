namespace StajDefteri.Api.Models;

public class Odev
{
    public int Id { get; set; }
    public string Baslik { get; set; } = string.Empty;
    public string Aciklama { get; set; } = string.Empty;
    public DateOnly SonTeslimTarihi { get; set; }
    public int OgrenciId { get; set; }
    public int VerenId { get; set; }
    public string Durum { get; set; } = "bekliyor";
    public DateTime OlusturmaTarihi { get; set; }
    public string? TeslimNotu { get; set; }
    public string? TeslimDosyaYolu { get; set; }
    public string? RedAciklamasi { get; set; }
    }
    