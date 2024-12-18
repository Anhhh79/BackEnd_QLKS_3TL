using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QLKS_3TL.Areas.LeTan.Models;
using QLKS_3TL.Data;
using QLKS_3TL.Models;

namespace QLKS_3TL.Areas.LeTan.Controllers
{
    public class QuanLyKhachHangLTController : Controller
    {
        private readonly Qlks3tlContext dbContext;

        public QuanLyKhachHangLTController(Qlks3tlContext dbContext)
        {
            this.dbContext = dbContext;
        }
        public async Task<IActionResult> Index()
        {
            try
            {
                // Lấy dữ liệu từ bảng KhachHang và liên kết với ThongTinDatPhong thông qua khóa ngoại MaKhachHang
                var khachHangs = await dbContext.KhachHangs
                    .Include(kh => kh.ThongTinDatPhongs) // Include để lấy dữ liệu từ ThongTinDatPhong
                    .Select(kh => new Areas.LeTan.Models.TTKHcs
                    {
                        // Thuộc tính từ bảng KhachHang
                        MaKhachHang = kh.MaKhachHang,
                        HoTen = kh.HoTen,
                        GioiTinh = kh.GioiTinh,
                        Cccd = kh.Cccd,
                        SoDienThoai = kh.SoDienThoai,
                        Email = kh.Email,

                        // Lấy một thông tin ngày đặt phòng (ví dụ: ngày đặt phòng đầu tiên)
                        ThoiGianDatPhong = kh.ThongTinDatPhongs.Select(dp => dp.ThoiGianDatPhong).FirstOrDefault()
                    }).OrderByDescending(kh => kh.ThoiGianDatPhong)
                    .ToListAsync();

                return View(khachHangs);
            }
            catch (Exception)
            {
                return View("Error", new ErrorViewModel());
            }
        }

        //Lấy thông tin chi tiết
        [HttpGet]
        public async Task<JsonResult> CTKhachHang(string id)
        {
            // Tìm khách hàng và bao gồm thông tin đặt phòng
            var khachHang = await dbContext.KhachHangs
                .Include(kh => kh.ThongTinDatPhongs) // Include để lấy dữ liệu từ bảng ThongTinDatPhongs
                .Where(kh => kh.MaKhachHang == id) // Tìm khách hàng theo id
                .Select(kh => new
                {
                    // Thông tin khách hàng
                    MaKhachHang = kh.MaKhachHang,
                    HoTen = kh.HoTen,
                    GioiTinh = kh.GioiTinh,
                    Cccd = kh.Cccd,
                    SoDienThoai = kh.SoDienThoai,
                    Email = kh.Email,

                    // Danh sách thông tin đặt phòng
                    DatPhongs = kh.ThongTinDatPhongs.Select(dp => new
                    {
                        NgayNhan = dp.NgayNhan,
                        NgayTra = dp.NgayTra,
                        TongSoNgay = dp.TongSoNgay,
                        HangPhong1 = dp.MaHangPhong,
                        TenPhong = dp.MaPhong,
                        YeuCau = dp.YeuCauThem,
                        ThanhToan = dp.TongThanhToan
                    }).FirstOrDefault()
                })
                .FirstOrDefaultAsync();

            // Xử lý khi không tìm thấy khách hàng
            if (khachHang == null)
            {
                Response.StatusCode = 404; // Thiết lập mã lỗi 404
                return Json(new { success = false, message = $"Không tìm thấy khách hàng có id: {id}" });
            }

            // Trả về thông tin khách hàng và danh sách đặt phòng
            return Json(new { success = true, data = khachHang });
        }
    }
}
