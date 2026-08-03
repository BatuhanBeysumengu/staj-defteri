namespace StajDefteri.Api.Models;

public class IslemLog
{
    public int Id { get; set; }
    public int KullaniciId { get; set; }   
    public string KullaniciAd { get; set; } = string.Empty;
    public string Islem { get; set; } = string.Empty;   
     public string Detay { get; set; } = string.Empty; 
    public DateTime Tarih { get; set; }
}