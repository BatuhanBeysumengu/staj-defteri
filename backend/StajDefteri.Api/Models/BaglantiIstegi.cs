namespace StajDefteri.Api.Models;

public class BaglantiIstegi
{
    public int Id { get; set; }
    public int OgrenciId { get; set; }      
    public int YetkiliId { get; set; }     
    public string Mesaj { get; set; } = string.Empty;   
    public string Durum { get; set; } = "bekliyor";     
    public DateTime Tarih { get; set; }
}