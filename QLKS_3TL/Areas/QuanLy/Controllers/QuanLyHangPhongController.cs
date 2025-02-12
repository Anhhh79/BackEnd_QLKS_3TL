﻿using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QLKS_3TL.Data;

namespace QLKS_3TL.Areas.QuanLy.Controllers
{
    public class QuanLyHangPhongController : Controller
    {
        private readonly Qlks3tlContext dbContext;
        public QuanLyHangPhongController(Qlks3tlContext Context)
        {
            dbContext = Context;
        }

        public async Task<IActionResult> Index()
        {
            return View(await dbContext.HangPhongs.ToListAsync());
        }

        [HttpGet]
        public async Task<JsonResult> LoadHangPhongs()
        {
            try
            {
                var hangphongs = await dbContext.HangPhongs
                    .Select(hp => new {
                        hp.MaHangPhong,
                        hp.TenHangPhong,
                        hp.SoGiuong,
                        hp.DienTich,
                        hp.GiaHangPhong
                    }).ToListAsync();

                return Json(new { success = true, data = hangphongs });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }


        public IActionResult Create()
        {
            return PartialView("Create");
        }

        [HttpPost]
        public async Task<IActionResult> Create([Bind("TenHangPhong, GiaHangPhong, MoTa, SoGiuong, DienTich")] HangPhong hangphong, IFormFile AnhHangPhong)
        {
            // Xóa lỗi ModelState cho MaHangPhong
            ModelState.Remove("MaHangPhong");

            // Tạo mã phòng tự động
            var lastHangPhong = await dbContext.HangPhongs
                                                .OrderByDescending(h => h.MaHangPhong)
                                                .FirstOrDefaultAsync();
            int nextId = lastHangPhong != null ? int.Parse(lastHangPhong.MaHangPhong.Substring(2)) + 1 : 1;
            hangphong.MaHangPhong = "PH" + nextId.ToString("D3");

            // Kiểm tra ModelState
            if (ModelState.IsValid)
            {
                try
                {
                    if (AnhHangPhong != null && AnhHangPhong.Length > 0)
                    {
                        // Xử lý lưu file ảnh vào thư mục images
                        var fileName = Path.GetFileName(AnhHangPhong.FileName);
                        var filePath = Path.Combine("wwwroot/images", fileName); // Đường dẫn lưu file vào thư mục images
                        using (var stream = new FileStream(filePath, FileMode.Create))
                        {
                            await AnhHangPhong.CopyToAsync(stream);
                        }
                        hangphong.AnhHangPhong = "/images/" + fileName; // Lưu đường dẫn tương đối vào thuộc tính của mô hình
                    }

                    dbContext.Add(hangphong);
                    await dbContext.SaveChangesAsync();
                    return Json(new { success = true }); // Phản hồi thành công
                }
                catch (Exception ex)
                {
                    Console.WriteLine("Lỗi khi lưu dữ liệu: " + ex.Message); // In ra lỗi chi tiết
                    return Json(new { success = false, message = ex.Message }); // Phản hồi lỗi
                }
            }

            // Nếu ModelState không hợp lệ
            return Json(new { success = false, message = "Dữ liệu không hợp lệ." });
        }
        [HttpGet]
        public async Task<IActionResult> Edit(string maHangPhong)
        {
            var hangphong = await dbContext.HangPhongs.FindAsync(maHangPhong);
            if (hangphong == null)
            {
                return NotFound();
            }
            return PartialView("Edit", hangphong); // Trả về partial view cho modal
        }
        [HttpPost]
        public async Task<IActionResult> Edit([Bind("MaHangPhong, TenHangPhong, GiaHangPhong, MoTa, SoGiuong, DienTich")] HangPhong hangphong, IFormFile AnhHangPhong)
        {
            var existingHangPhong = await dbContext.HangPhongs.FindAsync(hangphong.MaHangPhong);
            if (existingHangPhong == null)
            {
                return NotFound();
            }

            existingHangPhong.TenHangPhong = hangphong.TenHangPhong;
            existingHangPhong.GiaHangPhong = hangphong.GiaHangPhong;
            existingHangPhong.MoTa = hangphong.MoTa;
            existingHangPhong.SoGiuong = hangphong.SoGiuong;
            existingHangPhong.DienTich = hangphong.DienTich;

            // Kiểm tra xem có hình ảnh mới không
            if (AnhHangPhong != null && AnhHangPhong.Length > 0)
            {
                var directory = Path.Combine("wwwroot/images");
                if (!Directory.Exists(directory))
                {
                    Directory.CreateDirectory(directory);
                }

                var fileName = Path.GetFileName(AnhHangPhong.FileName);
                var filePath = Path.Combine(directory, fileName);
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await AnhHangPhong.CopyToAsync(stream);
                }
                existingHangPhong.AnhHangPhong = "/images/" + fileName;
            }
            else
            {
                // Xóa lỗi yêu cầu `AnhHangPhong` khỏi `ModelState` nếu không có file ảnh mới
                ModelState.Remove("AnhHangPhong");
            }

            if (!ModelState.IsValid)
            {
                var errors = ModelState.Values.SelectMany(v => v.Errors)
                                              .Select(e => e.ErrorMessage)
                                              .ToList();
                return Json(new { success = false, message = "Dữ liệu không hợp lệ.", errors = errors });
            }

            try
            {
                dbContext.Update(existingHangPhong);
                await dbContext.SaveChangesAsync();
                return Json(new { success = true, message = "Cập nhật thành công!" });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "Lỗi khi lưu dữ liệu.", error = ex.Message });
            }
        }

        [HttpGet]
        public async Task<IActionResult> ChiTiet(string maHangPhong)
        {
            var roomDetail = await dbContext.HangPhongs.FindAsync(maHangPhong);
            if (roomDetail == null)
            {
                return NotFound();
            }

            // Trả về dữ liệu dưới dạng JSON
            return Json(new
            {
                AnhHangPhong = roomDetail.AnhHangPhong,
                TenHangPhong = roomDetail.TenHangPhong,
                MaHangPhong = roomDetail.MaHangPhong,
                SoGiuong = roomDetail.SoGiuong,
                DienTich = roomDetail.DienTich,
                GiaHangPhong = roomDetail.GiaHangPhong,
                MoTa = roomDetail.MoTa
            });
        }

        [HttpPost]
        public async Task<IActionResult> Delete(string maHangPhong)
        {
            try
            {
                // Tìm hạng phòng theo ID
                var hangPhong = await dbContext.HangPhongs.FindAsync(maHangPhong);
                if (hangPhong == null)
                {
                    return NotFound(); // Nếu không tìm thấy, trả về lỗi 404
                }

                // Xóa hạng phòng
                dbContext.HangPhongs.Remove(hangPhong);
                await dbContext.SaveChangesAsync(); // Lưu thay đổi vào cơ sở dữ liệu

                return Json(new { success = true }); // Phản hồi thành công
            }
            catch (DbUpdateException dbEx)
            {
                // In ra InnerException nếu có
                var errorMessage = dbEx.InnerException != null
                    ? dbEx.InnerException.Message
                    : "Lỗi không xác định trong quá trình cập nhật cơ sở dữ liệu.";

                Console.WriteLine("Lỗi khi lưu dữ liệu: " + errorMessage);
                return Json(new { success = false, message = "Có lỗi xảy ra khi lưu dữ liệu: " + errorMessage });
            }
            catch (Exception ex)
            {
                Console.WriteLine("Lỗi không xác định: " + ex.Message);
                return Json(new { success = false, message = "Có lỗi xảy ra." });
            }
        }
    }
}
