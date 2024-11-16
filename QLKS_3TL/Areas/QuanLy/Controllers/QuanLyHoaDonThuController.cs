using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QLKS_3TL.Areas.QuanLy.Models;
using QLKS_3TL.Data;
using QLKS_3TL.Models;
using System.Diagnostics;
using System.Runtime.Intrinsics.Arm;

namespace QLKS_3TL.Areas.QuanLy.Controllers
{
    public class QuanLyHoaDonThuController : Controller
    {
        // nhúng cơ sở dữ liệu
        private readonly Qlks3tlContext db;

        public QuanLyHoaDonThuController(Qlks3tlContext context) => db = context;

        //Hàm hiển thị danh sách hóa đơn thu
        public async Task<IActionResult> Index()
        {
            try
            {
                // Lấy dữ liệu từ bảng KhachHang và liên kết với ThongTinDatPhong thông qua khóa ngoại MaKhachHang
                var hoaDonThus = await db.HoaDonThus
                    .Include(hd => hd.MaNhanVienNavigation)
                    .Include(hd => hd.MaDatPhongNavigation)
                    .ThenInclude(dp => dp.MaKhachHangNavigation)
                    .Select(hd => new ThongTinHoaDonThu
                    {
                        MaHoaDonThu = hd.MaHoaDonThu,
                        ThoiGian = hd.ThoiGian,
                        TongGia = hd.TongGia,
                        TenNhanVien = hd.MaNhanVienNavigation.HoTen,
                        TenKhachHang = hd.MaDatPhongNavigation.MaKhachHangNavigation.HoTen
                    })
                    .ToListAsync();

                return View(hoaDonThus);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Lỗi: {ex.Message}");
                return View("Error", new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
            }

        }

    }
}
