using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StajDefteri.Api.Data;

namespace StajDefteri.Api.Controllers;
[ApiController]
[Route("api/[controller]")]
public class KayitlarController: ControllerBase
{
  private readonly AppDbContext _db;
  public KayitlarController(AppDbContext db)
  {
    _db = db; 
  }
  [HttpGet]
  public async Task<IActionResult> Hepsi()
  {
    var kayitlar =await _db.DefterKayitlari.ToListAsync();
    return Ok(kayitlar);
  }
}