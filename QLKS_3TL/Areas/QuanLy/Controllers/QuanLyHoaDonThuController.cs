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
                        TenNhanVien = hd.MaNhanVienNavigation != null ? hd.MaNhanVienNavigation.HoTen : "Không xác định",
                        TenKhachHang = hd.MaDatPhongNavigation != null && hd.MaDatPhongNavigation.MaKhachHangNavigation != null ? hd.MaDatPhongNavigation.MaKhachHangNavigation.HoTen: "Khong Xac Dinh"
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

        // chi tiết hóa đơn
        [HttpGet]
        public async Task<JsonResult> ChiTietHoaDonThu(string id)
        {
            try
            {
                // Tìm một hóa đơn cụ thể theo id
                var hoaDonThu = await db.HoaDonThus
                    .Include(hd => hd.MaNhanVienNavigation)
                    .Include(hd => hd.MaDatPhongNavigation)
                    .ThenInclude(dp => dp.MaKhachHangNavigation)
                    .Where(hd => hd.MaHoaDonThu == id) // Thêm điều kiện lọc theo id
                    .Select(hd => new 
                    {
                        MaHoaDonThu = hd.MaHoaDonThu,
                        ThoiGian = hd.ThoiGian,
                        TongGia = hd.TongGia,
                        TenNhanVien = hd.MaNhanVienNavigation != null ? hd.MaNhanVienNavigation.HoTen : "Không xác định",
                        TenKhachHang = hd.MaDatPhongNavigation != null && hd.MaDatPhongNavigation.MaKhachHangNavigation != null
                            ? hd.MaDatPhongNavigation.MaKhachHangNavigation.HoTen
                            : "Không xác định",
                        MaPhong = hd.MaDatPhongNavigation != null ? hd.MaDatPhongNavigation.MaPhong : "Không xác định",
                        MaHangPhong = hd.MaDatPhongNavigation != null ? hd.MaDatPhongNavigation.MaHangPhong : "Không xác định",
                        NgayNhan = hd.MaDatPhongNavigation != null ? hd.MaDatPhongNavigation.NgayNhan : DateOnly.MinValue,
                        NgayTra = hd.MaDatPhongNavigation != null ? hd.MaDatPhongNavigation.NgayTra : DateOnly.MinValue,

                    })
                    .FirstOrDefaultAsync(); // Lấy duy nhất một kết quả (hoặc null nếu không tìm thấy)

                // Xử lý khi không tìm thấy hóa đơn
                if (hoaDonThu == null)
                {
                    Response.StatusCode = 404; // Thiết lập mã lỗi 404
                    return Json(new { success = false, message = $"Không tìm thấy hóa đơn có id: {id}" });
                }

                // Trả về thông tin chi tiết hóa đơn
                return Json(new { success = true, data = hoaDonThu });
            }
            catch (Exception ex)
            {
                // Xử lý lỗi
                Response.StatusCode = 500; // Thiết lập mã lỗi 500
                return Json(new { success = false, message = $"Đã xảy ra lỗi: {ex.Message}" });
            }
        }


    }

}
