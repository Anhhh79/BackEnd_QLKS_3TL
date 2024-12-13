using Microsoft.AspNetCore.Mvc;
using Microsoft.DotNet.Scaffolding.Shared.Messaging;
using Microsoft.EntityFrameworkCore;
using QLKS_3TL.Data;
using QLKS_3TL.Models;

namespace QLKS_3TL.Areas.KhachHang.Controllers
{
    public class DanhGiaController : Controller
    {
        // nhúng cơ sở dữ liệu
        private readonly Qlks3tlContext db;

        public DanhGiaController(Qlks3tlContext context) => db = context;

        // Test thêm dữ liệu
        [HttpPost]
        public async Task<JsonResult> ThemDanhGia([FromBody] DanhGia model)
        {
            try
            {
                // Kiểm tra xem số điện thoại có tồn tại trong bảng KhachHang hay không
                var khachHang = await db.KhachHangs
                    .FirstOrDefaultAsync(kh => kh.SoDienThoai == model.SoDienThoai);
                if (khachHang == null)
                {
                    // Nếu số điện thoại không tồn tại, trả về thông báo
                    return Json(new { success = false, message = "Số điện thoại chưa đặt phòng!" });
                }

                // Tạo một bản ghi mới cho bảng DanhGia
                var danhGia = new DanhGia
                {
                    SoDienThoai = model.SoDienThoai,
                    SoSao = model.SoSao,
                    HoTen = model.HoTen,
                    ThoiGian = DateOnly.FromDateTime(DateTime.Now),
                    NoiDung = model.NoiDung
                };

                db.DanhGia.Add(danhGia);
                await db.SaveChangesAsync();

                return Json(new { success = true, message = "Thêm đánh giá thành công!" });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = $"Có lỗi xảy ra: {ex.Message}" });
            }
        }

        //lấy các số liệu đánh giá 
        [HttpGet]
        public async Task<JsonResult> GetSoLieuDanhGia()
        {
            try
            {
                var danhGias = await db.DanhGia.ToListAsync();

                if (!danhGias.Any())
                {
                    return Json(new
                    {
                        success = true,
                        total = 0,
                        average = 0,
                        Sum1sao = 0,
                        Sum2sao = 0,
                        Sum3sao = 0,
                        Sum4sao = 0,
                        Sum5sao = 0
                    });
                }
                double? average1 = danhGias.Average(d => d.SoSao);
                int total = danhGias.Count;
                var average = Math.Round((decimal)average1, 1);
                int Sum5sao = danhGias.Count(d => d.SoSao == 5);
                int Sum4sao = danhGias.Count(d => d.SoSao == 4);
                int Sum3sao = danhGias.Count(d => d.SoSao == 3);
                int Sum2sao = danhGias.Count(d => d.SoSao == 2);
                int Sum1sao = danhGias.Count(d => d.SoSao == 1);

                return Json(new
                {
                    success = true,
                    total,
                    average,
                    Sum1sao,
                    Sum2sao,
                    Sum3sao,
                    Sum4sao,
                    Sum5sao
                });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "Không thể lấy danh sách các đánh giá: " + ex.Message });
            }
        }

        //lấy dữ liệu đánh giá 
        [HttpGet]
        public async Task<JsonResult> GetDanhGia()
        {
            try
            {
                var danhGias = await db.DanhGia.OrderByDescending(n => n.Id).Select(n => new
                {
                    hoTen = n.HoTen,
                    thoiGian = n.ThoiGian,
                    noiDung = n.NoiDung,
                    soSao = n.SoSao
                }).ToListAsync();

                return Json(new { success = true, data = danhGias });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, Message = "không thể lấy danh sách các đánh giá !: " + ex.Message });
            }
        }
    }
}
