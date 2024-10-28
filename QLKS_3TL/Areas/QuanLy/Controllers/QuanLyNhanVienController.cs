using Microsoft.AspNetCore.Mvc;
using QLKS_3TL.Areas.QuanLy.Models;
using QLKS_3TL.Data;

namespace QLKS_3TL.Areas.QuanLy.Controllers
{
    public class QuanLyNhanVienController : Controller
    {
        // nhúng cơ sở dữ liệu
        private readonly Qlks3tlContext db;

        public QuanLyNhanVienController(Qlks3tlContext context) { db = context; }

        public IActionResult Index()
        {
            // Lấy tất cả nhân viên và chuyển sang view model
            var nhanViens = db.NhanViens.AsQueryable();
            var result = db.NhanViens
               .Select(p => new NhanVienViewModal
               {
                   MaNhanVien = p.MaNhanVien,
                   AnhNhanVien = p.AnhNhanVien ?? "",
                   HoTen = p.HoTen ?? "",
                   Cccd = p.Cccd ?? "",
                   SoDienThoai = p.SoDienThoai ?? "",
                   DiaChi = p.DiaChi ?? "",
                   ChucVu = p.ChucVu ?? "",
                   LuongCoBan = p.LuongCoBan ?? 0m,
                   GioiTinh = p.GioiTinh ?? ""
               });
            return View(result);
        }
    }
}
