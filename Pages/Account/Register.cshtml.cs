using ElectroGO.Data;
using ElectroGO.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace ElectroGO.Pages.Account;

public class RegisterModel : PageModel
{
    private readonly ApplicationDbContext _db;
    private readonly IPasswordHasher<User> _hasher;

    public RegisterModel(ApplicationDbContext db, IPasswordHasher<User> hasher)
    {
        _db = db;
        _hasher = hasher;
    }

    [BindProperty]
    public InputModel Input { get; set; } = new();

    public string? ErrorMessage { get; set; }

    public class InputModel
    {
        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Username { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }

    public void OnGet()
    {
    }

    public IActionResult OnPost()
    {
        if (!ModelState.IsValid)
        {
            ErrorMessage = "Please fill in all fields.";
            return Page();
        }

        if (_db.Users.Any(u => u.Email == Input.Email || u.Username == Input.Username))
        {
            ErrorMessage = "Email or username already in use.";
            return Page();
        }

        var user = new User
        {
            FullName = Input.FullName,
            Email = Input.Email,
            Username = Input.Username,
            Phone = Input.Phone,
            PasswordHash = _hasher.HashPassword(null!, Input.Password)
        };

        _db.Users.Add(user);
        _db.SaveChanges();

        return RedirectToPage("/Account/Login");
    }
}
