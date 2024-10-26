using Microsoft.AspNetCore.Mvc;
using QLKS_3TL.Models;
using System.Diagnostics;

namespace QLKS_3TL.Areas.QuanLy.Controllers
{
    public class TrangChuController : Controller
    {
        private readonly ILogger<TrangChuController> _logger;

        public TrangChuController(ILogger<TrangChuController> logger)
        {
            _logger = logger;
        }

        public IActionResult Index()
        {
            return View();
        }
    }
}
