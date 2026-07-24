namespace StajDefteri.Api.Models;

public class Kullanici
{
    public int Id { get; set; }
    public string Email { get; set; } = string.Empty;
    public string Ad { get; set; } = string.Empty;
    public string Rol { get; set; } = string.Empty;   
    public int? YetkiliId { get; set; }
}