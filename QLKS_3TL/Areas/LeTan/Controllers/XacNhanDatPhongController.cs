using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QLKS_3TL.Areas.LeTan.Models;
using QLKS_3TL.Data;

namespace QLKS_3TL.Areas.LeTan.Controllers
{
    public class XacNhanDatPhongController : Controller
    {
        private readonly Qlks3tlContext dbContext;
        public XacNhanDatPhongController(Qlks3tlContext dbContext)
        {
            this.dbContext = dbContext;
        }
        // Hiển thị thông tin đặt phòng
        public async Task<IActionResult> Index()
        {
            // Lấy thông tin đặt phòng kèm theo thông tin khách hàng, phòng, hạng phòng
            var thongTinDatPhong = await dbContext.ThongTinDatPhongs
                .Include(t => t.MaKhachHangNavigation)  // Liên kết với KhachHang
                .Include(t => t.MaPhongNavigation)  // Liên kết với Phong
                .Include(t => t.MaHangPhongNavigation)  // Liên kết với HangPhong
                .Where(t => t.TrangThaiXacNhan == "1")  // Lọc theo TrangThaiXacNhan
                .ToListAsync();

            return View(thongTinDatPhong);
        }

        public IActionResult GetBookingDetails(string maDatPhong)
        {
            var bookingDetails = dbContext.ThongTinDatPhongs
                .Where(b => b.MaDatPhong == maDatPhong)
                .Select(b => new
                {
                    b.MaDatPhong,
                    b.NgayNhan,
                    b.NgayTra,
                    b.SoLuongPhong,
                    b.TongThanhToan,
                    b.YeuCauThem,
                    b.MaKhachHangNavigation.HoTen,
                    b.MaKhachHangNavigation.SoDienThoai,
                    b.MaKhachHangNavigation.GioiTinh,
                    b.MaKhachHangNavigation.Email,
                    b.MaKhachHangNavigation.Cccd,
                    b.MaHangPhongNavigation.TenHangPhong,
                    Phongs = b.MaHangPhongNavigation.Phongs
                        .Where(p => !p.ThongTinDatPhongs.Any(tdp => tdp.TrangThaiPhong == "Đã đặt"))
                        .Select(p => p.MaPhong)
                        .ToList() // Chuyển về dạng danh sách
                })
                .FirstOrDefault();

            if (bookingDetails == null)
            {
                return NotFound("Không tìm thấy thông tin đặt phòng.");
            }

            return Json(bookingDetails);
        }


        [HttpPost]
        public async Task<IActionResult> XuLyThongTinDatPhong([FromBody] ThongTinDatPhongViewModel model)
        {
            if (model == null || model.SoLuongPhong <= 0 || model.DanhSachPhong == null || model.DanhSachPhong.Count == 0)
                return BadRequest(new { message = "Dữ liệu không hợp lệ!" });

            try
            {
                // Kiểm tra nếu có phòng đã được đặt từ trước
                var thongTinDatPhong = await dbContext.ThongTinDatPhongs
                    .FirstOrDefaultAsync(dp => dp.MaHangPhong == model.MaHangPhong
                                               && dp.MaKhachHang == model.MaKhachHang);

                // Nếu số lượng phòng = 1, cập nhật thông tin phòng hiện có
                if (model.SoLuongPhong == 1)
                {
                    if (thongTinDatPhong == null)
                        return NotFound(new { message = "Không tìm thấy thông tin đặt phòng cần cập nhật!" });

                    // Cập nhật thông tin phòng đã đặt
                    thongTinDatPhong.TrangThaiXacNhan = "2";
                    thongTinDatPhong.TrangThaiPhong = "Đã đặt";
                    thongTinDatPhong.TongThanhToan = model.TongThanhToan;
                    thongTinDatPhong.ThoiGianDatPhong = DateTime.Now;
                    thongTinDatPhong.YeuCauThem = model.YeuCauThem;

                    var maPhong = model.DanhSachPhong.FirstOrDefault(); // Lấy phòng đầu tiên trong danh sách (vì chỉ có 1 phòng)
                    if (!string.IsNullOrEmpty(maPhong))
                    {
                        thongTinDatPhong.MaPhong = maPhong;  // Gắn Mã phòng vào thông tin đặt phòng
                    }

                    await dbContext.SaveChangesAsync();
                    return Ok(new { message = "Cập nhật thông tin thành công!" });
                }
                else
                {
                    // Thêm các thông tin phòng mới trước khi xóa bản ghi cũ
                    foreach (var maPhong in model.DanhSachPhong)
                    {
                        var phong = await dbContext.Phongs
                            .FirstOrDefaultAsync(p => p.MaPhong == maPhong && p.MaHangPhong == model.MaHangPhong
                                && !dbContext.ThongTinDatPhongs.Any(dp => dp.MaPhong == p.MaPhong && dp.TrangThaiPhong == "Đã đặt"));

                        if (phong == null)
                        {
                            // Kiểm tra nếu phòng không tồn tại hoặc không còn phòng trống
                            return BadRequest(new { message = $"Phòng {maPhong} không hợp lệ hoặc không có phòng trống!" });
                        }

                        // Tiến hành thêm thông tin đặt phòng
                        var thongTinMoi = new ThongTinDatPhong
                        {
                            MaDatPhong = $"MDP-{Guid.NewGuid()}",
                            NgayNhan = model.NgayNhan ?? DateOnly.MinValue,
                            NgayTra = model.NgayTra ?? DateOnly.MinValue,
                            MaPhong = phong.MaPhong,
                            TongThanhToan = model.TongThanhToan / model.SoLuongPhong,
                            ThoiGianDatPhong = DateTime.Now,
                            SoLuongPhong = 1,
                            TongSoNgay = (model.NgayTra.HasValue && model.NgayNhan.HasValue)
                                ? (model.NgayTra.Value.DayNumber - model.NgayNhan.Value.DayNumber)
                                : 0,
                            MaKhachHang = model.MaKhachHang,
                            MaHangPhong = model.MaHangPhong,
                            TrangThaiXacNhan = "Đã Xác Nhận",
                            TrangThaiPhong = "Đã đặt",
                            YeuCauThem = model.YeuCauThem,
                        };

                        dbContext.ThongTinDatPhongs.Add(thongTinMoi);
                    }

                    // Lưu các bản ghi mới vào cơ sở dữ liệu
                    await dbContext.SaveChangesAsync();

                    // Xóa các bản ghi cũ sau khi thêm thành công
                    if (!string.IsNullOrEmpty(model.MaDatPhong))
                    {
                        var oldBookingRecords = await dbContext.ThongTinDatPhongs
                            .Where(dp => dp.MaDatPhong == model.MaDatPhong)
                            .ToListAsync();

                        if (oldBookingRecords.Any())
                        {
                            dbContext.ThongTinDatPhongs.RemoveRange(oldBookingRecords); // Xóa các bản ghi cũ
                        }
                    }

                    // Lưu lại sau khi xóa các bản ghi cũ
                    await dbContext.SaveChangesAsync();

                    return Ok(new { message = "Cập nhật và thêm thông tin thành công!" });
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi hệ thống!", details = ex.Message });
            }
        }
    }
}
    

