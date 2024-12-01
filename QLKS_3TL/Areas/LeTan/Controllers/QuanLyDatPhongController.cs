using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QLKS_3TL.Areas.LeTan.Models;
using QLKS_3TL.Areas.QuanLy.Models;
using QLKS_3TL.Data;
using QLKS_3TL.Models;
using System.Diagnostics;
using System.Runtime.Intrinsics.Arm;

namespace QLKS_3TL.Areas.LeTan.Controllers
{
    public class QuanLyDatPhongController : Controller
    {
        // nhúng cơ sở dữ liệu
        private readonly Qlks3tlContext db;

        public QuanLyDatPhongController(Qlks3tlContext context) => db = context;

        //Hàm hiển thị danh sách hóa đơn thu
        public async Task<IActionResult> Index()
        {
            try
            {
                // Lấy dữ liệu từ bảng KhachHang và liên kết với ThongTinDatPhong thông qua khóa ngoại MaKhachHang
                var ThongTins = await db.Phongs.Include(hp => hp.HangPhong).Include(dp => dp.ThongTinDatPhongs)
                    .Select(hd => new ThongTinPhongLT
                    {
                        MaPhong = hd.MaPhong,
                        TenHangPhong = hd.HangPhong.TenHangPhong,
                        GiaPhong = hd.HangPhong.GiaHangPhong,
                        TrangThai = hd.ThongTinDatPhongs
                    .OrderByDescending(dp => dp.ThoiGianDatPhong) // Giả sử bạn có trường NgayDatPhong
                    .Select(dp => dp.TrangThaiPhong)
                    .FirstOrDefault() ?? "Trống" // Lấy trạng thái của đặt phòng mới nhất
                    })
                    .ToListAsync();
                return View(ThongTins);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Lỗi: {ex.Message}");
                return View("Error", new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
            }
        }

        //load 
        [HttpGet]
        public async Task<JsonResult> LoadThongTinPhongLT()
        {
            try
            {
                var ThongTins = await db.Phongs.Include(hp => hp.HangPhong).Include(dp => dp.ThongTinDatPhongs)
                   .Select(hd => new ThongTinPhongLT
                   {
                       MaPhong = hd.MaPhong,
                       TenHangPhong = hd.HangPhong.TenHangPhong,
                       GiaPhong = hd.HangPhong.GiaHangPhong,
                       MaDatPhong = hd.ThongTinDatPhongs
                         .OrderByDescending(dp => dp.ThoiGianDatPhong)
                         .Select(dp => dp.MaDatPhong)
                         .FirstOrDefault(),
                       TrangThai = hd.ThongTinDatPhongs
                         .OrderByDescending(dp => dp.ThoiGianDatPhong)
                         .Select(dp => dp.TrangThaiPhong)
                         .FirstOrDefault() ?? "Trống"
                   })
                   .ToListAsync();
                // Trả về danh sách nhân viên dưới dạng JSON
                return Json(new { success = true, data = ThongTins });
            }
            catch (Exception ex)
            {
                // Trả về thông tin lỗi dưới dạng JSON
                return Json(new { success = false, message = ex.Message });
            }
        }

        //Hiển thị thông tin lên modal nhận phòng 
        [HttpGet]
        [Route("/LeTan/QuanLyDatPhong/GetThongTinNhanPhong/{maDatPhong2}")]
        public async Task<JsonResult> GetThongTinNhanPhong(string maDatPhong2)
        {
            
            try
            {
                var ThongTin = await db.ThongTinDatPhongs
                    .Include(dp => dp.MaPhongNavigation)  // Liên kết với bảng Phòng
                    .Include(dp => dp.MaKhachHangNavigation)
                    .Include(dp => dp.MaHangPhongNavigation)
                    .Where(p => p.MaDatPhong == maDatPhong2)
                    .Select(dp => new
                    {
                        NgayNhan = dp.NgayNhan,
                        NgayTra = dp.NgayTra,
                        TongSoNgay = dp.NgayTra.HasValue && dp.NgayNhan.HasValue
                                ? EF.Functions.DateDiffDay(dp.NgayNhan.Value, dp.NgayTra.Value)
                                : (int?)null,
                        YeuCau = dp.YeuCauThem ?? "Không có yêu cầu",
                        GiaHangPhong = dp.MaHangPhongNavigation.GiaHangPhong, // Lấy giá từ hạng phòng
                        TongThanhToan = dp.NgayTra.HasValue && dp.NgayNhan.HasValue && dp.MaHangPhongNavigation.GiaHangPhong.HasValue
                                ? EF.Functions.DateDiffDay(dp.NgayNhan.Value, dp.NgayTra.Value) * dp.MaHangPhongNavigation.GiaHangPhong.Value
                                : (decimal?)0,
                        ThoiGianDatPhong = dp.ThoiGianDatPhong,
                        TrangThaiPhong = dp.TrangThaiPhong,
                        KhachHang = new
                        {
                            HoTen = dp.MaKhachHangNavigation.HoTen ?? "Không xác định",
                            SoDienThoai = dp.MaKhachHangNavigation.SoDienThoai ?? "Chưa cung cấp",
                            Cccd = dp.MaKhachHangNavigation.Cccd ?? "Không có",
                            GioiTinh = dp.MaKhachHangNavigation.GioiTinh ?? "Chưa xác định",
                            Email = dp.MaKhachHangNavigation.Email ?? "Không có email"
                        },
                        Phong = new
                        {
                            MaPhong = dp.MaPhongNavigation.MaPhong ?? "Không xác định"
                        },
                        HangPhong = new
                        {
                            TenHangPhong = dp.MaPhongNavigation.HangPhong != null
                                            ? dp.MaPhongNavigation.HangPhong.TenHangPhong
                                            : "Chưa rõ hạng phòng"
                        }
                    })
                    .FirstOrDefaultAsync();
                 

                if (ThongTin == null)
                {
                    return Json(new { success = false, message = $"Không tìm thấy thông tin đặt phòng với mã: {maDatPhong2}" });
                }

                return Json(new { success = true, data = ThongTin });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = $"Lỗi: {ex.Message}" });
            }
        }

        //Hiển thị thông tin lên modal trả phòng 
        [HttpGet]
        [Route("/LeTan/QuanLyDatPhong/GetThongTinTraPhong/{maDatPhong}")]
        public async Task<JsonResult> GetThongTinTraPhong(string maDatPhong)
        {

            try
            {
                var ThongTin = await db.ThongTinDatPhongs
                    .Include(dp => dp.MaPhongNavigation)  // Liên kết với bảng Phòng
                    .Include(dp => dp.MaKhachHangNavigation)
                    .Include(dp => dp.MaHangPhongNavigation)
                    .Where(p => p.MaDatPhong == maDatPhong)
                    .Select(dp => new
                    {
                        NgayNhan = dp.NgayNhan,
                        NgayTra = dp.NgayTra,
                        TongSoNgay = dp.TongSoNgay,
                        YeuCau = dp.YeuCauThem ?? "Không có yêu cầu",
                        TongThanhToan = dp.TongThanhToan,
                        ThoiGianDatPhong = dp.ThoiGianDatPhong,
                        TrangThaiPhong = dp.TrangThaiPhong,
                        KhachHang = new
                        {
                            HoTen = dp.MaKhachHangNavigation.HoTen ?? "Không xác định",
                            SoDienThoai = dp.MaKhachHangNavigation.SoDienThoai ?? "Chưa cung cấp",
                            Cccd = dp.MaKhachHangNavigation.Cccd ?? "Không có",
                            GioiTinh = dp.MaKhachHangNavigation.GioiTinh ?? "Chưa xác định",
                            Email = dp.MaKhachHangNavigation.Email ?? "Không có email"
                        },
                        Phong = new
                        {
                            MaPhong = dp.MaPhongNavigation.MaPhong ?? "Không xác định"
                        },
                        HangPhong = new
                        {
                            TenHangPhong = dp.MaPhongNavigation.HangPhong != null
                                            ? dp.MaPhongNavigation.HangPhong.TenHangPhong
                                            : "Chưa rõ hạng phòng"
                        }
                    })
                    .FirstOrDefaultAsync();


                if (ThongTin == null)
                {
                    return Json(new { success = false, message = $"Không tìm thấy thông tin đặt phòng với mã: {maDatPhong}" });
                }

                return Json(new { success = true, data = ThongTin });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = $"Lỗi: {ex.Message}" });
            }
        }

        //Xử lý nút trả phòng
        [HttpPost]
        public async Task<JsonResult> XuLyTraPhong(string maDatPhong)
        {
            try
            {
                var datPhong = await db.ThongTinDatPhongs.FirstOrDefaultAsync(dp => dp.MaDatPhong == maDatPhong);

                if (datPhong == null)
                    return Json(new { success = false, message = "Không tìm thấy thông tin đặt phòng." });

                datPhong.TrangThaiPhong = "Đã thanh toán"; // Cập nhật trạng thái phòng
                await db.SaveChangesAsync(); // Lưu thay đổi vào cơ sở dữ liệu

                return Json(new { success = true, message = "Trả phòng thành công!" });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "Có lỗi xảy ra: " + ex.Message });
            }
        }

        //Xử lý nút nhận phòng
        [HttpPost]
        public async Task<JsonResult> XuLyNhanPhong(string maDatPhong)
        {
            try
            {
                var datPhong = await db.ThongTinDatPhongs.FirstOrDefaultAsync(dp => dp.MaDatPhong == maDatPhong);

                if (datPhong == null)
                    return Json(new { success = false, message = "Không tìm thấy thông tin đặt phòng." });

                datPhong.TrangThaiPhong = "Đang hoạt động"; // Cập nhật trạng thái phòng
                await db.SaveChangesAsync(); // Lưu thay đổi vào cơ sở dữ liệu

                return Json(new { success = true, message = "Nhận phòng thành công!" });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "Có lỗi xảy ra: " + ex.Message });
            }
        }



    }
}
