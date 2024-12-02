using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QLKS_3TL.Areas.KhachHang.Models;
using QLKS_3TL.Data;

namespace QLKS_3TL.Areas.KhachHang.Controllers
{
    public class ThanhToanController : Controller
    {
        private readonly Qlks3tlContext _dbContext;
        public ThanhToanController(Qlks3tlContext dbContext)
        {
            _dbContext = dbContext;
        }
        public IActionResult Index()
        {
            return View();
        }

        public static async Task<string> GenerateUniqueCodeAsync(string prefix, string entityType)
        {
            // Tạo GUID và lấy 8 ký tự đầu tiên
            string randomString = Guid.NewGuid().ToString("N").Substring(0, 8).ToUpper();

            // Ghép mã theo định dạng yêu cầu
            string generatedCode = $"{prefix}-{randomString}";
            return generatedCode;
        }


        [HttpPost]
        public async Task<IActionResult> DatPhongOnline([FromBody] List<DatPhongViewModel> models)
        {
            if (models == null || !models.Any())
            {
                return Json(new { success = false, message = "Dữ liệu không hợp lệ." });
            }

            try
            {
                foreach (var model in models)
                {
                    // Tạo mã khách hàng tự động
                    string maKhachHang = await GenerateUniqueCodeAsync("KH", "KhachHang");

                    // Tạo mã đặt phòng tự động
                    string maDatPhong = await GenerateUniqueCodeAsync("MDP", "DatPhong");

                    // Lưu thông tin khách hàng
                    var khachHang = new QLKS_3TL.Data.KhachHang
                    {
                        MaKhachHang = maKhachHang,
                        HoTen = model.FullName,
                        GioiTinh = model.Sex,
                        Cccd = model.CCCD,
                        SoDienThoai = model.PhoneNumber,
                        Email = model.EmailAddress,
                    };

                    // Tính tổng số ngày
                    var ngayNhan = DateOnly.ParseExact(model.NgayNhan, "dd-MM-yyyy");
                    var ngayTra = DateOnly.ParseExact(model.NgayTra, "dd-MM-yyyy");
                    var tongSoNgay = (ngayTra.ToDateTime(TimeOnly.MinValue) - ngayNhan.ToDateTime(TimeOnly.MinValue)).Days;

                    if (tongSoNgay <= 0)
                    {
                        return Json(new { success = false, message = "Ngày trả phải lớn hơn ngày nhận." });
                    }

                    // Lưu thông tin đặt phòng
                    var thongTinDatPhong = new ThongTinDatPhong
                    {
                        MaDatPhong = maDatPhong,
                        NgayNhan = ngayNhan,
                        NgayTra = ngayTra,
                        MaKhachHang = maKhachHang,
                        MaHangPhong = model.MaHangPhong,
                        SoLuongPhong = model.SoLuongPhong,
                        TongThanhToan = model.TongThanhToan,
                        TongSoNgay = tongSoNgay,
                        YeuCauThem = model.AdditionalRequest,
                        ThoiGianDatPhong = DateTime.Now,
                        TrangThaiXacNhan = "1"
                    };

                    // Lưu vào cơ sở dữ liệu
                    _dbContext.KhachHangs.Add(khachHang);
                    _dbContext.ThongTinDatPhongs.Add(thongTinDatPhong);
                }

                await _dbContext.SaveChangesAsync();

                return Json(new { success = true, redirectUrl = "/KhachHang/Home/Index" });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }
    }
}
