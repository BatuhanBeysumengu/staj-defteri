namespace StajDefteri.Api.Models;

public class Mesaj
{
    public int Id { get; set; }
    public int GonderenId { get; set; }
    public int AliciId { get; set; }
    public string? Icerik { get; set; }          
    public int? PaylasilanKayitId { get; set; }    
    public DateTime Tarih { get; set; }
}