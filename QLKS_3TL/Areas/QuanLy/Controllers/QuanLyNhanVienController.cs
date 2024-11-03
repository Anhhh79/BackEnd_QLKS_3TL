using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QLKS_3TL.Data;
using QLKS_3TL.Models;

namespace QLKS_3TL.Areas.QuanLy.Controllers
{
    public class QuanLyNhanVienController : Controller
    {
        // nhúng cơ sở dữ liệu
        private readonly Qlks3tlContext db;

        public QuanLyNhanVienController(Qlks3tlContext context) => db = context;

        //Hàm hiển thị danh sách nhân viên theo cơ chế bất đồng bộ
        [HttpGet]
        public async Task<IActionResult> Index()
        {
            try
            {
                var nhanViens = await db.NhanViens.OrderBy(nv => nv.MaNhanVien).ToListAsync();
                // Sử dụng ToListAsync lấy danh sách nhân viên được sắp xếp theo mã nhân viên
                return View(nhanViens);
            }
            catch (Exception)
            {
                return View("Error", new ErrorViewModel());
            }
        }

        //lấy thông tin chi tiết
        [HttpGet]
        public async Task<JsonResult> ChiTietNhanVien(string id)
        {
            var nhanVien = await db.NhanViens.FindAsync(id);

            if (nhanVien == null)
            {
                Response.StatusCode = 404; // Thiết lập mã lỗi 404 cho phản hồi
                return Json(new { success = false, message = $"Không tìm thấy nhân viên có id: {id}" });
            }

            return Json(new { success = true, data = nhanVien });
        }

        // Hàm thêm nhân viên (POST)
        [HttpPost]
        public async Task<JsonResult> Insert(NhanVien model, IFormFile AnhNhanVien)
        {
            try
            {
                if (model == null)
                {
                    return Json(new { success = false, message = "Dữ liệu nhân viên không được null" });
                }

                // Kiểm tra nếu đã tồn tại mã nhân viên trong cơ sở dữ liệu
                var existingNhanVien = await db.NhanViens
                    .FirstOrDefaultAsync(nv => nv.MaNhanVien == model.MaNhanVien);

                if (existingNhanVien != null)
                {
                    return Json(new { success = false, message = $"Mã nhân viên {model.MaNhanVien} đã tồn tại" });
                }

                // Lấy mã nhân viên cuối cùng từ cơ sở dữ liệu
                var lastNhanVien = await db.NhanViens
                    .OrderByDescending(nv => nv.MaNhanVien)
                    .FirstOrDefaultAsync();

                // Tạo mã nhân viên mới
                if (lastNhanVien != null && lastNhanVien.MaNhanVien.StartsWith("NV"))
                {
                    int lastNumber = int.Parse(lastNhanVien.MaNhanVien.Substring(2));
                    string newMaNhanVien;
                    do
                    {
                        lastNumber++;
                        newMaNhanVien = "NV" + lastNumber.ToString("D3");
                        // Kiểm tra xem mã mới đã tồn tại hay chưa
                        existingNhanVien = await db.NhanViens
                            .FirstOrDefaultAsync(nv => nv.MaNhanVien == newMaNhanVien);
                    } while (existingNhanVien != null);
                    model.MaNhanVien = newMaNhanVien; // Gán mã nhân viên mới
                }
                else
                {
                    model.MaNhanVien = "NV001"; // Khởi tạo nếu chưa có nhân viên nào
                }

                // Lưu file ảnh nếu có
                if (AnhNhanVien != null && AnhNhanVien.Length > 0)
                {
                    // Đảm bảo thư mục lưu ảnh tồn tại
                    string imagesPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/images");
                    if (!Directory.Exists(imagesPath))
                    {
                        Directory.CreateDirectory(imagesPath);
                    }

                    // Đặt tên file duy nhất và lưu file vào thư mục images
                    string fileName = $"NV_{Guid.NewGuid()}_{AnhNhanVien.FileName}";
                    string filePath = Path.Combine(imagesPath, fileName);

                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        await AnhNhanVien.CopyToAsync(stream);
                    }

                    // Lưu đường dẫn ảnh vào model
                    model.AnhNhanVien = "/images/" + fileName;
                }
                else
                {
                    // Đặt giá trị mặc định nếu không có ảnh
                    model.AnhNhanVien = "/images/account.png";
                }

                db.NhanViens.Add(model);
                await db.SaveChangesAsync();

                return Json(new { success = true, message = "Đã lưu thông tin nhân viên vào cơ sở dữ liệu" });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "Đã xảy ra lỗi khi lưu thông tin nhân viên", error = ex.Message });
            }
        }
    }


    //// Hàm chỉnh sửa nhân viên (GET)
    //[HttpGet]
    //public async Task<IActionResult> Edit(string id)
    //{
    //    var nhanVien = await db.NhanViens.FindAsync(id);
    //    if (nhanVien == null)
    //    {
    //        return NotFound();
    //    }

    //    var model = new NhanVienViewModel
    //    {
    //        MaNhanVien = nhanVien.MaNhanVien,
    //        AnhNhanVien = nhanVien.AnhNhanVien,
    //        HoTen = nhanVien.HoTen,
    //        Cccd = nhanVien.Cccd,
    //        SoDienThoai = nhanVien.SoDienThoai,
    //        DiaChi = nhanVien.DiaChi,
    //        ChucVu = nhanVien.ChucVu,
    //        LuongCoBan = (decimal)nhanVien.LuongCoBan,
    //        GioiTinh = nhanVien.GioiTinh
    //    };

    //    return View(model);
    //}

    //// Hàm chỉnh sửa nhân viên (POST)
    //[HttpPost]
    //public async Task<IActionResult> Edit(string id, NhanVienViewModel model)
    //{
    //    if (id != model.MaNhanVien)
    //    {
    //        return BadRequest();
    //    }

    //    if (ModelState.IsValid)
    //    {
    //        try
    //        {
    //            var nhanVien = await db.NhanViens.FindAsync(id);
    //            if (nhanVien == null)
    //            {
    //                return NotFound();
    //            }

    //            nhanVien.AnhNhanVien = model.AnhNhanVien;
    //            nhanVien.HoTen = model.HoTen;
    //            nhanVien.Cccd = model.Cccd;
    //            nhanVien.SoDienThoai = model.SoDienThoai;
    //            nhanVien.DiaChi = model.DiaChi;
    //            nhanVien.ChucVu = model.ChucVu;
    //            nhanVien.LuongCoBan = model.LuongCoBan;
    //            nhanVien.GioiTinh = model.GioiTinh;

    //            db.NhanViens.Update(nhanVien);
    //            await db.SaveChangesAsync();
    //            return RedirectToAction(nameof(Index));
    //        }
    //        catch (DbUpdateConcurrencyException)
    //        {
    //            return StatusCode(500, "Không thể cập nhật dữ liệu.");
    //        }
    //    }
    //    return View(model);
    //}

    //// Hàm xóa nhân viên (GET để hiển thị xác nhận)
    //[HttpGet]
    //public async Task<IActionResult> Delete(string id)
    //{
    //    var nhanVien = await db.NhanViens.FindAsync(id);
    //    if (nhanVien == null)
    //    {
    //        return NotFound();
    //    }

    //    var model = new NhanVienViewModel
    //    {
    //        MaNhanVien = nhanVien.MaNhanVien,
    //        HoTen = nhanVien.HoTen
    //    };

    //    return View(model);
    //}

    //// Hàm xóa nhân viên (POST để thực hiện xóa)
    //[HttpPost, ActionName("Delete")]
    //public async Task<IActionResult> DeleteConfirmed(string id)
    //{
    //    var nhanVien = await db.NhanViens.FindAsync(id);
    //    if (nhanVien == null)
    //    {
    //        return NotFound();
    //    }

    //    db.NhanViens.Remove(nhanVien);
    //    await db.SaveChangesAsync();
    //    return RedirectToAction(nameof(Index));
    //}
}

