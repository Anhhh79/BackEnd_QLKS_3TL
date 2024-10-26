using Microsoft.AspNetCore.Mvc;

namespace QLKS_3TL.Controllers
{
    public class HomeController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
