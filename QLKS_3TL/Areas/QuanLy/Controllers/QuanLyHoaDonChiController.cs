using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QLKS_3TL.Areas.QuanLy.Models;
using QLKS_3TL.Data;

namespace QLKS_3TL.Areas.QuanLy.Controllers
{
    public class QuanLyHoaDonChiController : Controller
    {
        private readonly Qlks3tlContext dbContext;

        public QuanLyHoaDonChiController(Qlks3tlContext dbContext)
        {
            this.dbContext = dbContext;
        }
        public async Task<IActionResult> Index()
        {
            var hoadonchis = await dbContext.HoaDonChis.ToListAsync();
            return View(hoadonchis);
        }
        // Hành động để trả về danh sách hóa đơn dưới dạng JSON
        [HttpGet]
        public IActionResult GetHoaDonList()
        {
            var hoaDonList = dbContext.HoaDonChis.ToList();
            return Json(hoaDonList); 
        }

        [HttpPost]
        public async Task<IActionResult> LuuHoaDon([FromBody] HoaDonChiViewModel hoaDonViewModel)
        {
            // Lấy mã nhân viên từ Session
            var maNhanVien = HttpContext.Session.GetString("MaNhanVien");

            if (maNhanVien == null)
            {
                return Unauthorized("Bạn cần đăng nhập để thực hiện chức năng này.");
            }

            // Kiểm tra dữ liệu đầu vào
            if (hoaDonViewModel == null || string.IsNullOrEmpty(hoaDonViewModel.TenMatHang) || hoaDonViewModel.SoLuong <= 0 || hoaDonViewModel.GiaMatHang <= 0)
            {
                return BadRequest("Dữ liệu không hợp lệ.");
            }

            // Lấy mã hóa đơn lớn nhất hiện tại
            var lastHoaDon = dbContext.HoaDonChis
                                     .OrderByDescending(hd => hd.MaHoaDonChi)
                                     .FirstOrDefault();

            // Tạo mã hóa đơn mới
            string newMaHoaDonChi = "HC001";
            if (lastHoaDon != null)
            {
                string lastMa = lastHoaDon.MaHoaDonChi;

                // Kiểm tra nếu mã hóa đơn cũ có ít nhất 3 ký tự
                if (lastMa.Length >= 3 && int.TryParse(lastMa.Substring(2), out int number))
                {
                    newMaHoaDonChi = $"HC{(number + 1).ToString("D3")}";
                }
                else
                {
                    // Xử lý trường hợp mã hóa đơn cũ không hợp lệ
                    // Ví dụ: Trả về một thông báo lỗi hoặc tạo mã mới mặc định
                }
            }
            // Tạo hóa đơn mới
            var hoaDonChi = new HoaDonChi
            {
                MaHoaDonChi = newMaHoaDonChi,
                TenMatHang = hoaDonViewModel.TenMatHang,
                GiaMatHang = hoaDonViewModel.GiaMatHang,
                SoLuong = hoaDonViewModel.SoLuong,
                TongGia = (decimal)(hoaDonViewModel.GiaMatHang * hoaDonViewModel.SoLuong),
                MaNhanVien = maNhanVien,
                ThoiGian = DateTime.Now
            };

            // Lưu vào cơ sở dữ liệu
            dbContext.HoaDonChis.Add(hoaDonChi);
            await dbContext.SaveChangesAsync();

            return Ok("Lập hóa đơn thành công!");
        }



    }
}