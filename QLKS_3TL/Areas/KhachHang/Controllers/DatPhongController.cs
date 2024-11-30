using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QLKS_3TL.Areas.KhachHang.Models;
using QLKS_3TL.Data;

namespace QLKS_3TL.Areas.KhachHang.Controllers
{
    public class DatPhongController : Controller
    {
        private readonly Qlks3tlContext _dbContext;
        public DatPhongController(Qlks3tlContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<IActionResult> GetRooms()
        {
            var rooms = await _dbContext.HangPhongs.ToListAsync();
            return Json(rooms); // Trả về dữ liệu dưới dạng JSON
        }

        // Action để trả về số lượng phòng
        public IActionResult GetSoLuongPhong()
        {
            // Đếm số lượng phòng trong cơ sở dữ liệu
            var soLuongPhong = _dbContext.Phongs.Count();

            // Trả về số lượng phòng (có thể trả dưới dạng JSON)
            return Json(new { soLuongPhong });
        }

        public IActionResult GetSoLuongNhanVien()
        {
            // Đếm số lượng phòng trong cơ sở dữ liệu
            var soLuongNhanVien = _dbContext.NhanViens.Count();

            // Trả về số lượng phòng (có thể trả dưới dạng JSON)
            return Json(new { soLuongNhanVien });
        }

        public IActionResult GetSoLuongKhachHang()
        {
            // Đếm số lượng phòng trong cơ sở dữ liệu
            var soLuongKhachHang = _dbContext.KhachHangs.Count();

            // Trả về số lượng phòng (có thể trả dưới dạng JSON)
            return Json(new { soLuongKhachHang });
        }
    }
}
