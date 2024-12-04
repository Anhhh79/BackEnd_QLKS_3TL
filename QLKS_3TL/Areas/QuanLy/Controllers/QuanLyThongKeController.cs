using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QLKS_3TL.Data;

namespace QLKS_3TL.Areas.QuanLy.Controllers
{
    public class QuanLyThongKeController : Controller
    {
        private readonly Qlks3tlContext dbContext;

        public QuanLyThongKeController(Qlks3tlContext dbContext)
        {
            this.dbContext = dbContext;
        }

        public IActionResult Index()
        {
            // Lấy dữ liệu Hóa đơn Thu theo tháng
            var hoaDonThuData = dbContext.HoaDonThus
                .Where(hd => hd.ThoiGian.HasValue)
                .GroupBy(hd => hd.ThoiGian.Value.Month)
                .Select(g => new
                {
                    Month = g.Key,
                    TotalAmount = g.Sum(hd => hd.TongGia)
                })
                .ToList();

            // Lấy dữ liệu Hóa đơn Chi theo tháng
            var hoaDonChiData = dbContext.HoaDonChis
                .Where(hd => hd.ThoiGian.HasValue)
                .GroupBy(hd => hd.ThoiGian.Value.Month)
                .Select(g => new
                {
                    Month = g.Key,
                    TotalAmount = g.Sum(hd => hd.TongGia)
                })
                .ToList();

            // Dữ liệu trả về
            var model = new
            {
                HoaDonThu = hoaDonThuData,
                HoaDonChi = hoaDonChiData
            };

            return View(model);
        }
    }
}
