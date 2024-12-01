using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QLKS_3TL.Data;

namespace QLKS_3TL.Areas.KhachHang.Controllers
{
    public class DatPhongOnlController : Controller
    {
        private readonly Qlks3tlContext dbContext;
        public DatPhongOnlController(Qlks3tlContext dbContext)
        {
            this.dbContext = dbContext;
        }
        public async Task<IActionResult> Index()
        {
            return View(await dbContext.HangPhongs.ToListAsync());
        }

        [HttpGet]
        public async Task<IActionResult> ModalDP(string maHangPhong)
        {
            var HangPhong = await dbContext.HangPhongs.FindAsync(maHangPhong);
            if (HangPhong == null)
            {
                return NotFound();
            }

            // Trả về dữ liệu dưới dạng JSON
            return Json(new
            {
                TenHangPhong = HangPhong.TenHangPhong,
                MaHangPhong = HangPhong.MaHangPhong,
                GiaHangPhong = HangPhong.GiaHangPhong,
            });
        }
    }
}
