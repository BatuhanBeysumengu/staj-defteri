namespace StajDefteri.Api.Models;

public class Arkadaslik
{
    public int Id { get; set; }
    public int GonderenId { get; set; }    
    public int AliciId { get; set; }        
    public string Durum { get; set; } = "bekliyor";   
    public DateTime Tarih { get; set; }
}