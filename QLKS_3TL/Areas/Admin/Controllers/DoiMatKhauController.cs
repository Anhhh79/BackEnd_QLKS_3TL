using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QLKS_3TL.Areas.Admin.Models;
using QLKS_3TL.Data;

namespace QLKS_3TL.Areas.Admin.Controllers
{
    public class DoiMatKhauController : Controller
    {
        private readonly Qlks3tlContext dbContext; 

        public DoiMatKhauController(Qlks3tlContext dbContext)
        {
            this.dbContext = dbContext;
        }
        public IActionResult Index()
        {
            return View();
        }
        [HttpPost]
        public IActionResult ChangePassword([FromBody] ChangePasswordViewModel model)
        {
            if (!ModelState.IsValid)
            {
                return Json(new
                {
                    success = false,
                    message = "Dữ liệu không hợp lệ.",
                    errors = ModelState.Values.SelectMany(v => v.Errors.Select(e => e.ErrorMessage))
                });
            }

            var maNhanVien = HttpContext.Session.GetString("MaNhanVien");
            if (maNhanVien == null)
            {
                return Json(new { success = false, message = "Người dùng chưa đăng nhập." });
            }

            var taiKhoan = dbContext.TaiKhoans.FirstOrDefault(tk => tk.MaNhanVien == maNhanVien);
            if (taiKhoan == null)
            {
                return Json(new { success = false, message = "Không tìm thấy tài khoản." });
            }

            // Kiểm tra mật khẩu hiện tại
            if (taiKhoan.MatKhau != model.CurrentPassword)
            {
                return Json(new
                {
                    success = false,
                    message = "Mật khẩu hiện tại không đúng.",
                    errors = "Mật khẩu hiện tại không chính xác."
                });
            }

            // Cập nhật mật khẩu
            taiKhoan.MatKhau = model.NewPassword; // Lưu ý: Nên mã hóa mật khẩu
            dbContext.SaveChanges();

            return Json(new { success = true, message = "Đổi mật khẩu thành công." });
        }

    }
}
