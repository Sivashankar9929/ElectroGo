using ElectroGO.Data;
using ElectroGO.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace ElectroGO.Pages.Account;

public class ProfileModel : PageModel
{
    private readonly ApplicationDbContext _db;

    public ProfileModel(ApplicationDbContext db)
    {
        _db = db;
    }

    public User ProfileUser { get; set; } = new();

    public IActionResult OnGet()
    {
        if (!(HttpContext.User?.Identity?.IsAuthenticated ?? false))
        {
            return RedirectToPage("/Account/Login");
        }

        var userIdClaim = HttpContext.User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        if (!int.TryParse(userIdClaim, out var userId))
        {
            return RedirectToPage("/Account/Login");
        }

        var user = _db.Users.FirstOrDefault(u => u.Id == userId);
        if (user == null)
        {
            return RedirectToPage("/Account/Login");
        }

        ProfileUser = user;
        return Page();
    }
}
