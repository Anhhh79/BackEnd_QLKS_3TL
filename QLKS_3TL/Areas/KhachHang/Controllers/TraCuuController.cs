using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QLKS_3TL.Areas.KhachHang.Models;
using QLKS_3TL.Data;

namespace QLKS_3TL.Areas.KhachHang.Controllers
{
    public class TraCuuController : Controller
    {
        private readonly Qlks3tlContext db;
        public TraCuuController(Qlks3tlContext Context)
        {
            db = Context;
        }
        public IActionResult Index()
        {
            return View();
        }

        [HttpGet]
        [Route("/KhachHang/TraCuu/TraCuuLichSu/{soDienThoai}")]
        public async Task<JsonResult> TraCuuLichSu(string soDienThoai)
        {
            try
            {
                // Truy vấn danh sách thông tin đặt phòng với số điện thoại khách hàng trùng khớp
                var danhSachThongTin = await db.ThongTinDatPhongs
                    .Where(dp => dp.MaKhachHangNavigation != null && dp.MaKhachHangNavigation.SoDienThoai == soDienThoai)
                    .Select(dp => new LichSuDatPhong 
                    {
                        ThoiGianDat = dp.ThoiGianDatPhong,
                        HoTen = dp.MaKhachHangNavigation.HoTen,
                        SoDienThoai = dp.MaKhachHangNavigation.SoDienThoai,
                        MaPhong = dp.MaPhong,
                        TenHangPhong = dp.MaHangPhongNavigation.TenHangPhong,
                        NgayNhan = dp.NgayNhan,
                        NgayTra = dp.NgayTra,
                        TongThanhToan = dp.TongThanhToan
                    })
                    .ToListAsync();

                // Nếu không tìm thấy, trả về thông báo
                if (danhSachThongTin == null || !danhSachThongTin.Any())
                {
                    return Json(new { success = false, message = "Không tìm thấy thông tin đặt phòng với số điện thoại cung cấp." });
                }

                // Trả về danh sách thông tin
                return Json(new { success = true, data = danhSachThongTin });
            }
            catch (Exception ex)
            {
                // Xử lý lỗi nếu có
                return Json(new { success = false, message = "Có lỗi xảy ra: " + ex.Message });
            }
        }

    }
}
