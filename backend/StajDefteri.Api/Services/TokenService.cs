using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using StajDefteri.Api.Models;

namespace StajDefteri.Api.Services;

public class TokenService
{
    private readonly IConfiguration _config;
    public TokenService(IConfiguration config)
    {
        _config = config;
    }

    public string TokenUret(Kullanici kullanici)
    {

        var claims = new[]
        {
            new Claim("id", kullanici.Id.ToString()),
            new Claim("rol", kullanici.Rol),
            new Claim("ad", kullanici.Ad),
        };

        var anahtar = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(_config["Jwt:Key"]!));
        var imza = new SigningCredentials(anahtar, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: _config["Jwt:Issuer"],
            claims: claims,
            expires: DateTime.Now.AddHours(8),  
            signingCredentials: imza
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}