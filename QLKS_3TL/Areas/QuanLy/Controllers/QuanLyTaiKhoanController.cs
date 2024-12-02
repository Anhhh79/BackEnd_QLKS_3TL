using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QLKS_3TL.Areas.QuanLy.Models;
using QLKS_3TL.Data;
using QLKS_3TL.Models;

namespace QLKS_3TL.Areas.QuanLy.Controllers
{
    public class QuanLyTaiKhoanController : Controller
    {
        // nhúng cơ sở dữ liệu
        private readonly Qlks3tlContext db;

        public QuanLyTaiKhoanController(Qlks3tlContext context) => db = context;

        //lấy thông tin tài khoản
        [HttpGet]
        public async Task<IActionResult> Index()
        {
            try
            {
                // Lấy dữ liệu từ bảng TaiKhoan và liên kết với NhanVien thông qua khóa ngoại
                var taiKhoans = await db.TaiKhoans
                    .Include(tk => tk.MaNhanVienNavigation) // Include để lấy dữ liệu từ bảng NhanVien
                    .Select(tk => new ThongTinTaiKhoan
                    {
                        // Thuộc tính từ bảng TaiKhoan
                        TaiKhoan = tk.TaiKhoan1,
                        MatKhau = tk.MatKhau,
                        QuyenTruyCap = tk.QuyenTruyCap,
                        MaNhanVien = tk.MaNhanVien,

                        // Thuộc tính từ bảng NhanVien
                        HoTen = tk.MaNhanVienNavigation.HoTen,
                        ChucVu = tk.MaNhanVienNavigation.ChucVu,

                    }).ToListAsync();
                return View(taiKhoans);
            }
            catch (Exception)
            {
                return View("Error", new ErrorViewModel());
            }
        }

        //load thông tin tài khoản
        [HttpGet]
        public async Task<JsonResult> LoadTaiKhoans()
        {
            try
            {
                // Lấy dữ liệu từ bảng TaiKhoan và liên kết với NhanVien thông qua khóa ngoại
                var taiKhoans = await db.TaiKhoans
                    .Include(tk => tk.MaNhanVienNavigation) // Include để lấy dữ liệu từ bảng NhanVien
                    .Select(tk => new ThongTinTaiKhoan
                    {
                        // Thuộc tính từ bảng TaiKhoan
                        TaiKhoan = tk.TaiKhoan1,
                        MatKhau = tk.MatKhau,
                        QuyenTruyCap = tk.QuyenTruyCap,
                        MaNhanVien = tk.MaNhanVien,

                        // Thuộc tính từ bảng NhanVien
                        HoTen = tk.MaNhanVienNavigation.HoTen,
                        ChucVu = tk.MaNhanVienNavigation.ChucVu,
                    }).ToListAsync();
                return Json(new { success = true, data = taiKhoans });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }

        // Hàm xóa thông tin tài khoản
        [HttpDelete]
        public async Task<JsonResult> Delete(string maNhanVien)
        {
            try
            {
                var taiKhoan = await db.TaiKhoans.FirstOrDefaultAsync(tk => tk.TaiKhoan1 == maNhanVien);
                if (taiKhoan == null)
                {
                    return Json(new { success = false, message = "Tài khoản không tồn tại." });
                }

                db.TaiKhoans.Remove(taiKhoan);
                await db.SaveChangesAsync();

                return Json(new { success = true, message = "Xóa tài khoản thành công." });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "Lỗi khi xóa tài khoản: " + ex.Message });
            }
        }

        //hàm lấy mã nhân viên chưa có tài khoản
        [HttpGet]
        public async Task<JsonResult> GetMaNhanViens()
        {
            try
            {
                // Lấy danh sách mã nhân viên từ bảng NhanVien
                var allNhanVienIds = await db.NhanViens
                                             .Select(nv => nv.MaNhanVien)
                                             .ToListAsync();

                // Lấy danh sách mã nhân viên từ bảng TaiKhoan
                var existingAccountNhanVienIds = await db.TaiKhoans
                                                         .Select(tk => tk.MaNhanVien)
                                                         .ToListAsync();

                // Lấy ra những mã nhân viên chưa có trong bảng TaiKhoan
                var nhanVienIdsWithoutAccount = allNhanVienIds
                                                .Except(existingAccountNhanVienIds)
                                                .ToList();

                // Trả về danh sách mã nhân viên chưa có tài khoản dưới dạng JSON
                return Json(new { success = true, data = nhanVienIdsWithoutAccount });
            }
            catch (Exception ex)
            {
                // Trả về thông tin lỗi dưới dạng JSON
                return Json(new { success = false, message = ex.Message });
            }
        }


        //hàm lấy thông tin nhân viên đưa lên modal thêm tài khoản
        [HttpGet]
        public async Task<JsonResult> LayThongTinNhanVien(string maNhanVien)
        {
            var nhanVien = await db.NhanViens
                .Where(nv => nv.MaNhanVien == maNhanVien)
                .Select(nv => new
                {
                    HoTen = nv.HoTen,
                    ChucVu = nv.ChucVu
                })
                .FirstOrDefaultAsync();

            if (nhanVien == null)
            {
                return Json(new { success = false, message = "Nhân viên không tồn tại" });
            }

            return Json(new { success = true, data = nhanVien });
        }

        // Hàm thêm tài khoản
        [HttpPost]
        public async Task<JsonResult> Insert([FromBody] TaiKhoan model)
        {
            try
            {
                if (model == null)
                {
                    return Json(new { success = false, message = "Dữ liệu tài khoản không được null" });
                }

                if (model.MaNhanVien == null)
                {
                    return Json(new { success = false, message = "mã nhân viên không được null" });
                }

                // Kiểm tra nếu đã tồn tại mã nhân viên trong cơ sở dữ liệu
                var existingNhanVienCount = await db.TaiKhoans
                    .Where(nv => nv.MaNhanVien == model.MaNhanVien)
                    .CountAsync();

                if (existingNhanVienCount > 0)
                {
                    return Json(new { success = false, message = $"Mã nhân viên {model.MaNhanVien} đã có tài khoản" });
                }

                db.TaiKhoans.Add(model);
                await db.SaveChangesAsync();

                return Json(new { success = true, message = "Thêm thành công tài khoản cho nhân viên" });
            }
            catch (Exception)
            {
                // Log lỗi chi tiết ở phía server
                //Log.Error(ex, "Đã xảy ra lỗi khi thêm tài khoản");

                return Json(new { success = false, message = "Đã xảy ra lỗi khi thêm tài khoản", error = "Lỗi hệ thống, vui lòng thử lại sau." });
            }
        }
    }
}
