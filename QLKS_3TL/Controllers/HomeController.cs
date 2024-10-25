using Microsoft.AspNetCore.Mvc;
using QLKS_3TL.Models;
using System.Diagnostics;

namespace QLKS_3TL.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;

        public HomeController(ILogger<HomeController> logger)
        {
            _logger = logger;
        }

        public IActionResult Index()
        {
            return View();
        }
    }
}
