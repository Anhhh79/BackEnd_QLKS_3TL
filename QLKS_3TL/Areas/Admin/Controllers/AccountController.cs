﻿using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QLKS_3TL.Areas.Admin.Models;
using QLKS_3TL.Data;

namespace QLKS_3TL.Areas.Admin.Controllers
{
    public class AccountController : Controller
    {
        private readonly Qlks3tlContext dbContext;
        private readonly ILogger<AccountController> _logger;

        public AccountController(Qlks3tlContext dbContext, ILogger<AccountController> logger)
        {
            this.dbContext = dbContext;
            _logger = logger;
        }

        // Hiển thị trang đăng nhập
        public IActionResult Login()
        {
            return View();
        }

        // Xử lý đăng nhập
        [HttpPost]
        public async Task<IActionResult> Login(LoginViewModel model)
        {
            if (ModelState.IsValid)
            {
                try
                {
                    // Ghi log để xác nhận ModelState hợp lệ
                    _logger.LogInformation("ModelState is valid. Attempting login for user: {TaiKhoan}", model.TaiKhoan);

                    // Tìm tài khoản trong cơ sở dữ liệu
                    var taiKhoan = await dbContext.TaiKhoans
                        .FirstOrDefaultAsync(t => t.TaiKhoan1 == model.TaiKhoan && t.MatKhau == model.MatKhau);

                    if (taiKhoan != null)
                    {
                        _logger.LogInformation("Login successful for user: {TaiKhoan}", model.TaiKhoan);
                        // Lưu thông tin vào session
                        HttpContext.Session.SetString("TaiKhoan", model.TaiKhoan);

                        // Kiểm tra quyền truy cập và chuyển hướng
                        if (taiKhoan.QuyenTruyCap == "3")
                        {
                            return RedirectToAction("Index", "Home", new { area = "QuanLy" });
                        }
                        else if (taiKhoan.QuyenTruyCap == "2")
                        {
                            return RedirectToAction("PageForRole2", "Home");
                        }
                        else
                        {
                            return RedirectToAction("Index", "Home");
                        }
                    }
                    else
                    {
                        _logger.LogWarning("Invalid login attempt for user: {TaiKhoan}", model.TaiKhoan);
                        ModelState.AddModelError("", "Tài khoản hoặc mật khẩu không đúng.");
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error occurred during login for user: {TaiKhoan}", model.TaiKhoan);
                    ModelState.AddModelError("", "Đã xảy ra lỗi, vui lòng thử lại.");
                }
            }
            else
            {
                _logger.LogWarning("ModelState is invalid.");
                foreach (var error in ModelState.Values.SelectMany(v => v.Errors))
                {
                    _logger.LogWarning(error.ErrorMessage);
                }
            }

            return View(model);
        }

        // Đăng xuất
        public IActionResult Logout()
        {
            HttpContext.Session.Clear(); // Xóa session khi người dùng đăng xuất
            return RedirectToAction("Login");
        }
    }
}
