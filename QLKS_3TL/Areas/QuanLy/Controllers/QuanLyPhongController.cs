using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QLKS_3TL.Areas.QuanLy.Models.ModelPhong;
using QLKS_3TL.Data;

namespace QLKS_3TL.Areas.QuanLy.Controllers
{
    public class QuanLyPhongController : Controller
    {
        private readonly Qlks3tlContext dbContext;
        public QuanLyPhongController(Qlks3tlContext Context)
        {
            dbContext = Context;
        }
        // Action trả về tất cả phòng kèm theo thông tin hạng phòng
        public async Task<IActionResult> Index()
        {
            // Lấy tất cả các phòng và kèm theo dữ liệu hạng phòng
            var phongs = await dbContext.Phongs
                .Include(p => p.HangPhong)  // Bao gồm dữ liệu của HangPhong liên quan
                .ToListAsync();

            // Tạo ViewModel kết hợp dữ liệu từ cả hai bảng
            var phongViewModels = phongs.Select(p => new ModalThongTinPhong
            {
                MaPhong = p.MaPhong,
                MaHangPhong = p.MaHangPhong,
                TenHangPhong = p.HangPhong?.TenHangPhong,
                GiaHangPhong = p.HangPhong?.GiaHangPhong,
                MoTaHangPhong = p.HangPhong?.MoTa,
                AnhHangPhong = p.HangPhong?.AnhHangPhong,
                SoGiuong = p.HangPhong?.SoGiuong,  // Gán số giường
                DienTich = p.HangPhong?.DienTich  // Gán diện tích
            }).ToList();

            return View(phongViewModels);  // Trả về View với danh sách ViewModel
        }

        public async Task<IActionResult> LoadPhong()
        {
            var phongs = await dbContext.Phongs
                .Include(p => p.HangPhong) // Bao gồm hạng phòng
                .ToListAsync();

            var result = phongs.Select(p => new
            {
                MaPhong = p.MaPhong,
                MaHangPhong = p.MaHangPhong,
                TenHangPhong = p.HangPhong.TenHangPhong,
                GiaHangPhong = p.HangPhong.GiaHangPhong
            }).ToList();

            return Json(new { success = true, data = result });
        }
        // Phương thức LoadHangPhong để lấy danh sách hạng phòng
        [HttpGet]
        public JsonResult GetHangPhongOptions()
        {
            var hangPhongs = dbContext.HangPhongs.ToList(); // Lấy dữ liệu hạng phòng từ DB
            return Json(hangPhongs); // Trả về dữ liệu dưới dạng JSON
        }

        [HttpGet]
        public IActionResult Create()
        {
            // Trả về Partial View có tên "Create"
            return PartialView("Create");
        }
        // Phương thức xử lý thêm phòng
        [HttpPost]
        public async Task<IActionResult> Create(string MaHangPhong, string TenPhong)
        {
            if (string.IsNullOrEmpty(MaHangPhong) || string.IsNullOrEmpty(TenPhong))
            {
                return Json(new { success = false, message = "Thông tin không hợp lệ!" });
            }

            var phong = new Phong
            {
                MaPhong = TenPhong,
                MaHangPhong = MaHangPhong
            };

            dbContext.Phongs.Add(phong);
            await dbContext.SaveChangesAsync();

            return Json(new { success = true, message = "Thêm phòng thành công!" });
        }

        //[HttpPost]
        //public JsonResult Delete(string maPhong)
        //{
        //    var item = dbContext.Phongs.FirstOrDefault(h => h.MaPhong == maPhong);
        //    if (item != null)
        //    {
        //        dbContext.Phongs.Remove(item);
        //        dbContext.SaveChanges();
        //        return Json(new { success = true, message = "Xóa thành công" });
        //    }
        //    return Json(new { success = false, message = "Không tìm thấy mục cần xóa" });
        //}
        [HttpPost]
        public JsonResult Xoa(string maPhong)
        {
            var item = dbContext.Phongs.FirstOrDefault(h => h.MaPhong == maPhong);

            if (item == null)
            {
                return Json(new { success = false, message = "Không tìm thấy mục cần xóa" });
            }

            try
            {
                dbContext.Phongs.Remove(item);
                dbContext.SaveChanges();
                return Json(new { success = true, message = "Xóa thành công" });
            }
            catch (Exception ex)
            {
                // Log lỗi nếu cần, ví dụ: log.Error(ex);

                return Json(new { success = false, message = "Không thể xóa phòng này vì vẫn còn dữ liệu liên quan ở bảng khác" });
            }
        }

    }
}
