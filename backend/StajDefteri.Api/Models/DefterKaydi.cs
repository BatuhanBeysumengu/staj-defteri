namespace StajDefteri.Api.Models;

public class DefterKaydi
{
    public int Id { get; set; }
    public DateOnly Tarih { get; set; }
    public string Icerik { get; set; } = string.Empty;
    public string Durum { get; set; } = "bekliyor";
    public int OgrenciId { get; set; }
    public string? RedAciklamasi { get; set; }
    public DateTime? RedTarihi { get; set; }
    public int? ReddedenId { get; set; }
    public string Gorunurluk { get; set; } = "private"; 
    public string? FotografYolu { get; set; }
}