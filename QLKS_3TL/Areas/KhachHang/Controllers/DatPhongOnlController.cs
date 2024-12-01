using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QLKS_3TL.Areas.KhachHang.Models;
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

        [HttpPost]
        public IActionResult TimKiemThongTin([FromBody] TimKiemThongTinViewModel model)
        {
            // Query database với Entity Framework
            var query = dbContext.ThongTinDatPhongs.AsQueryable();

            if (model.NgayNhan.HasValue)
            {
                query = query.Where(x => x.NgayNhan >= model.NgayNhan);
            }

            if (model.NgayTra.HasValue)
            {
                query = query.Where(x => x.NgayTra <= model.NgayTra);
            }

            if (model.MucGiaMin.HasValue && model.MucGiaMax.HasValue)
            {
                query = query.Where(x => x.TongThanhToan >= model.MucGiaMin && x.TongThanhToan <= model.MucGiaMax);
            }

            if (model.SoGiuong.HasValue)
            {
                query = query.Where(x => x.SoLuongPhong == model.SoGiuong);
            }

            var result = query.Select(x => new
            {
                x.MaDatPhong,
                x.NgayNhan,
                x.NgayTra,
                x.TongThanhToan,
                x.SoLuongPhong
            }).ToList();

            return Json(result);
        }

    }
}
