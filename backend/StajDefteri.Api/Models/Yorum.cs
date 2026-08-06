namespace StajDefteri.Api.Models;

public class Yorum
{
    public int Id { get; set; }
    public int KayitId { get; set; }       
    public int KullaniciId { get; set; }  
    public string Icerik { get; set; } = string.Empty;
    public DateTime Tarih { get; set; }
}