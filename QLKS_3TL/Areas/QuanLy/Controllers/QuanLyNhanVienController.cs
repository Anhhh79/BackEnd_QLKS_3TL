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

        //load danh sách nhân viên
        [HttpGet]
        public async Task<JsonResult> LoadNhanViens()
        {
            try
            {
                var nhanViens = await db.NhanViens.OrderBy(nv => nv.MaNhanVien).ToListAsync();
                // Trả về danh sách nhân viên dưới dạng JSON
                return Json(new { success = true, data = nhanViens });
            }
            catch (Exception ex)
            {
                // Trả về thông tin lỗi dưới dạng JSON
                return Json(new { success = false, message = ex.Message });
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

        // Hàm thêm nhân viên 
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
                        existingNhanVien = await db.NhanViens
                            .FirstOrDefaultAsync(nv => nv.MaNhanVien == newMaNhanVien);
                    } while (existingNhanVien != null);
                    model.MaNhanVien = newMaNhanVien; // Gán mã nhân viên mới
                }
                else
                {
                    model.MaNhanVien = "NV001"; // Khởi tạo nếu chưa có nhân viên nào
                }

                // Xử lý ảnh nhân viên
                if (AnhNhanVien != null && AnhNhanVien.Length > 0)
                {
                    string imagesPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/images");
                    if (!Directory.Exists(imagesPath))
                    {
                        Directory.CreateDirectory(imagesPath);
                    }

                    // Kiểm tra xem ảnh đã tồn tại hay chưa
                    string fileName = AnhNhanVien.FileName;
                    string filePath = Path.Combine(imagesPath, fileName);

                    if (!System.IO.File.Exists(filePath))
                    {
                        // Nếu file chưa tồn tại, lưu file mới
                        using (var stream = new FileStream(filePath, FileMode.Create))
                        {
                            await AnhNhanVien.CopyToAsync(stream);
                        }
                    }
                    // Gán đường dẫn ảnh cho model
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

        // Hàm xóa nhân viên
        [HttpDelete]
        public async Task<JsonResult> Delete(string maNhanVien)
        {
            try
            {
                var nhanVien = await db.NhanViens.FindAsync(maNhanVien);
                if (nhanVien == null)
                {
                    return Json(new { success = false, message = "Không tìm thấy nhân viên." });
                }

                // Kiểm tra mã nhân viên có trong bảng TaiKhoan hay không
                var hasAccount = await db.TaiKhoans.AnyAsync(tk => tk.MaNhanVien == maNhanVien);
                if (hasAccount) { return Json(new { success = false, message = "Bạn cần xóa tài khoản của nhân viên trước." }); }

                db.NhanViens.Remove(nhanVien);
                await db.SaveChangesAsync();

                return Json(new { success = true, message = "Xóa nhân viên thành công." });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }

        // Hàm cập nhật nhân viên
        [HttpPost]
        public async Task<JsonResult> Update([FromForm] NhanVien nhanVien, IFormFile AnhNhanVien)
        {
            if (nhanVien == null)
            {
                return Json(new { success = false, message = "Dữ liệu không hợp lệ." });
            }

            try
            {
                // Tìm nhân viên theo mã
                var nhanVienToUpdate = await db.NhanViens.FindAsync(nhanVien.MaNhanVien);
                if (nhanVienToUpdate == null)
                {
                    return Json(new { success = false, message = "Không tìm thấy nhân viên." });
                }

                // Cập nhật thông tin nhân viên
                nhanVienToUpdate.HoTen = nhanVien.HoTen;
                nhanVienToUpdate.GioiTinh = nhanVien.GioiTinh;
                nhanVienToUpdate.Cccd = nhanVien.Cccd;
                nhanVienToUpdate.SoDienThoai = nhanVien.SoDienThoai;
                nhanVienToUpdate.ChucVu = nhanVien.ChucVu;
                nhanVienToUpdate.DiaChi = nhanVien.DiaChi;
                nhanVienToUpdate.LuongCoBan = nhanVien.LuongCoBan;

                // Xử lý ảnh nhân viên
                if (AnhNhanVien != null && AnhNhanVien.Length > 0)
                {
                    string imagesPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/images");
                    if (!Directory.Exists(imagesPath))
                    {
                        Directory.CreateDirectory(imagesPath);
                    }

                    // Lấy tên file và kiểm tra nếu file đã tồn tại
                    string fileName = Path.GetFileName(AnhNhanVien.FileName);
                    string filePath = Path.Combine(imagesPath, fileName);

                    if (!System.IO.File.Exists(filePath))
                    {
                        // Nếu file chưa tồn tại, lưu file mới
                        using (var stream = new FileStream(filePath, FileMode.Create))
                        {
                            await AnhNhanVien.CopyToAsync(stream);
                        }
                    }

                    // Cập nhật đường dẫn ảnh vào cơ sở dữ liệu
                    nhanVienToUpdate.AnhNhanVien = "/images/" + fileName;
                }
                else
                {
                    // Giữ nguyên ảnh cũ hoặc đặt giá trị mặc định nếu không có ảnh nào trước đó
                    nhanVienToUpdate.AnhNhanVien = nhanVienToUpdate.AnhNhanVien ?? "/images/account.png";
                }

                // Lưu thay đổi vào cơ sở dữ liệu
                await db.SaveChangesAsync();

                return Json(new { success = true, message = "Cập nhật nhân viên thành công!" });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "Lỗi khi cập nhật nhân viên: " + ex.Message });
            }
        }
    }
}

