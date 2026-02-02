using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using Template_API.Models;

namespace Template_API.Services
{
    public class JwtTokenService
    {
        private readonly IConfiguration _config;
        public JwtTokenService(IConfiguration config)
        {
            _config = config;
        }

        public string CreateToken(TblUsers user)
        {
            var jwtKey = _config["Jwt:Key"] ?? _config["JWT_KEY"] ?? "DefaultJwtSecretKeyForDevelopmentPurposesOnly2024!";
            var jwtIssuer = _config["Jwt:Issuer"] ?? _config["JWT_ISSUER"] ?? "Template_API";
            var jwtAudience = _config["Jwt:Audience"] ?? _config["JWT_AUDIENCE"] ?? "Template_API";
            var expiresMinutes = _config["Jwt:ExpiresMinutes"] ?? "60";
            
            if (string.IsNullOrEmpty(jwtKey))
            {
                throw new InvalidOperationException("JWT Key is not configured.");
            }
            
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            var expires = DateTime.UtcNow.AddMinutes(double.Parse(expiresMinutes));

            var claims = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
                new Claim(JwtRegisteredClaimNames.UniqueName, user.Username ?? string.Empty)
            };

            var token = new JwtSecurityToken(
                issuer: jwtIssuer,
                audience: jwtAudience,
                claims: claims,
                expires: expires,
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
