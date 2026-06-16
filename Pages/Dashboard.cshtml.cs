using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc.RazorPages;
using System.Security.Claims;

namespace ElectroGO.Pages;

[Authorize]
public class DashboardModel : PageModel
{
    public string UserName { get; set; } = "Driver";
    public string Greeting { get; set; } = "Welcome back";
    public string TimeOfDayGreeting { get; set; } = "day";

    public void OnGet()
    {
        if (User.Identity?.IsAuthenticated ?? false)
        {
            UserName = User.FindFirst(ClaimTypes.Name)?.Value ?? "Driver";
        }

        var hour = DateTime.Now.Hour;
        if (hour < 12) TimeOfDayGreeting = "morning";
        else if (hour < 18) TimeOfDayGreeting = "afternoon";
        else TimeOfDayGreeting = "evening";

        Greeting = TimeOfDayGreeting switch
        {
            "morning" => "Good morning",
            "afternoon" => "Good afternoon",
            _ => "Good evening"
        };
    }
}
