using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QLKS_3TL.Areas.KhachHang.Models;
using QLKS_3TL.Areas.LeTan.Models;
using QLKS_3TL.Areas.QuanLy.Models;
using QLKS_3TL.Data;
using QLKS_3TL.Models;
using System.Diagnostics;
using System.Runtime.Intrinsics.Arm;

namespace QLKS_3TL.Areas.LeTan.Controllers
{
    public class QuanLyDatPhongController : Controller
    {
        // nhúng cơ sở dữ liệu
        private readonly Qlks3tlContext db;

        public QuanLyDatPhongController(Qlks3tlContext context) => db = context;

        //Hàm hiển thị danh sách phòng
        public async Task<IActionResult> Index()
        {
            try
            {
                // Lấy dữ liệu từ bảng KhachHang và liên kết với ThongTinDatPhong thông qua khóa ngoại MaKhachHang
                var ThongTins = await db.Phongs.Include(hp => hp.HangPhong).Include(dp => dp.ThongTinDatPhongs)
                    .Select(hd => new ThongTinPhongLT
                    {
                        MaPhong = hd.MaPhong,
                        TenHangPhong = hd.HangPhong.TenHangPhong,
                        GiaPhong = hd.HangPhong.GiaHangPhong,
                        TrangThai = hd.ThongTinDatPhongs
                    .OrderByDescending(dp => dp.ThoiGianDatPhong) // Giả sử bạn có trường NgayDatPhong
                    .Select(dp => dp.TrangThaiPhong)
                    .FirstOrDefault() ?? "Trống" // Lấy trạng thái của đặt phòng mới nhất
                    })
                    .ToListAsync();
                return View(ThongTins);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Lỗi: {ex.Message}");
                return View("Error", new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
            }
        }

        //load 
        [HttpGet]
        public async Task<JsonResult> LoadThongTinPhongLT()
        {
            try
            {
                var ThongTins = await db.Phongs.Include(hp => hp.HangPhong).Include(dp => dp.ThongTinDatPhongs)
                   .Select(hd => new ThongTinPhongLT
                   {
                       MaPhong = hd.MaPhong,
                       TenHangPhong = hd.HangPhong.TenHangPhong,
                       GiaPhong = hd.HangPhong.GiaHangPhong,
                       MaDatPhong = hd.ThongTinDatPhongs
                         .OrderByDescending(dp => dp.ThoiGianDatPhong)
                         .Select(dp => dp.MaDatPhong)
                         .FirstOrDefault(),
                       TrangThai = hd.ThongTinDatPhongs
                         .OrderByDescending(dp => dp.ThoiGianDatPhong)
                         .Select(dp => dp.TrangThaiPhong)
                         .FirstOrDefault() ?? "Trống"
                   })
                   .ToListAsync();
                // Trả về danh sách nhân viên dưới dạng JSON
                return Json(new { success = true, data = ThongTins });
            }
            catch (Exception ex)
            {
                // Trả về thông tin lỗi dưới dạng JSON
                return Json(new { success = false, message = ex.Message });
            }
        }

        //Hiển thị thông tin lên modal nhận phòng 
        [HttpGet]
        [Route("/LeTan/QuanLyDatPhong/GetThongTinNhanPhong/{maDatPhong2}")]
        public async Task<JsonResult> GetThongTinNhanPhong(string maDatPhong2)
        {

            try
            {
                var ThongTin = await db.ThongTinDatPhongs
                    .Include(dp => dp.MaPhongNavigation)  // Liên kết với bảng Phòng
                    .Include(dp => dp.MaKhachHangNavigation)
                    .Include(dp => dp.MaHangPhongNavigation)
                    .Where(p => p.MaDatPhong == maDatPhong2)
                    .Select(dp => new
                    {
                        NgayNhan = dp.NgayNhan,
                        NgayTra = dp.NgayTra,
                        TongSoNgay = dp.NgayTra.HasValue && dp.NgayNhan.HasValue
                                ? EF.Functions.DateDiffDay(dp.NgayNhan.Value, dp.NgayTra.Value)
                                : (int?)null,
                        YeuCau = dp.YeuCauThem ?? "Không có yêu cầu",
                        GiaHangPhong = dp.MaHangPhongNavigation.GiaHangPhong, // Lấy giá từ hạng phòng
                        TongThanhToan = dp.NgayTra.HasValue && dp.NgayNhan.HasValue && dp.MaHangPhongNavigation.GiaHangPhong.HasValue
                                ? EF.Functions.DateDiffDay(dp.NgayNhan.Value, dp.NgayTra.Value) * dp.MaHangPhongNavigation.GiaHangPhong.Value
                                : (decimal?)0,
                        ThoiGianDatPhong = dp.ThoiGianDatPhong,
                        TrangThaiPhong = dp.TrangThaiPhong,
                        KhachHang = new
                        {
                            HoTen = dp.MaKhachHangNavigation.HoTen ?? "Không xác định",
                            SoDienThoai = dp.MaKhachHangNavigation.SoDienThoai ?? "Chưa cung cấp",
                            Cccd = dp.MaKhachHangNavigation.Cccd ?? "Không có",
                            GioiTinh = dp.MaKhachHangNavigation.GioiTinh ?? "Chưa xác định",
                            Email = dp.MaKhachHangNavigation.Email ?? "Không có email"
                        },
                        Phong = new
                        {
                            MaPhong = dp.MaPhongNavigation.MaPhong ?? "Không xác định"
                        },
                        HangPhong = new
                        {
                            TenHangPhong = dp.MaPhongNavigation.HangPhong != null
                                            ? dp.MaPhongNavigation.HangPhong.TenHangPhong
                                            : "Chưa rõ hạng phòng"
                        }
                    })
                    .FirstOrDefaultAsync();


                if (ThongTin == null)
                {
                    return Json(new { success = false, message = $"Không tìm thấy thông tin đặt phòng với mã: {maDatPhong2}" });
                }

                return Json(new { success = true, data = ThongTin });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = $"Lỗi: {ex.Message}" });
            }
        }

        //Hiển thị thông tin lên modal trả phòng 
        [HttpGet]
        [Route("/LeTan/QuanLyDatPhong/GetThongTinTraPhong/{maDatPhong}")]
        public async Task<JsonResult> GetThongTinTraPhong(string maDatPhong)
        {

            try
            {
                var ThongTin = await db.ThongTinDatPhongs
                    .Include(dp => dp.MaPhongNavigation)  // Liên kết với bảng Phòng
                    .Include(dp => dp.MaKhachHangNavigation)
                    .Include(dp => dp.MaHangPhongNavigation)
                    .Where(p => p.MaDatPhong == maDatPhong)
                    .Select(dp => new
                    {
                        NgayNhan = dp.NgayNhan,
                        NgayTra = dp.NgayTra,
                        TongSoNgay = dp.TongSoNgay,
                        YeuCau = dp.YeuCauThem ?? "Không có yêu cầu",
                        TongThanhToan = dp.TongThanhToan,
                        ThoiGianDatPhong = dp.ThoiGianDatPhong,
                        TrangThaiPhong = dp.TrangThaiPhong,
                        KhachHang = new
                        {
                            HoTen = dp.MaKhachHangNavigation.HoTen ?? "Không xác định",
                            SoDienThoai = dp.MaKhachHangNavigation.SoDienThoai ?? "Chưa cung cấp",
                            Cccd = dp.MaKhachHangNavigation.Cccd ?? "Không có",
                            GioiTinh = dp.MaKhachHangNavigation.GioiTinh ?? "Chưa xác định",
                            Email = dp.MaKhachHangNavigation.Email ?? "Không có email"
                        },
                        Phong = new
                        {
                            MaPhong = dp.MaPhongNavigation.MaPhong ?? "Không xác định"
                        },
                        HangPhong = new
                        {
                            TenHangPhong = dp.MaPhongNavigation.HangPhong != null
                                            ? dp.MaPhongNavigation.HangPhong.TenHangPhong
                                            : "Chưa rõ hạng phòng"
                        }
                    })
                    .FirstOrDefaultAsync();


                if (ThongTin == null)
                {
                    return Json(new { success = false, message = $"Không tìm thấy thông tin đặt phòng với mã: {maDatPhong}" });
                }

                return Json(new { success = true, data = ThongTin });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = $"Lỗi: {ex.Message}" });
            }
        }

        //Xử lý nút trả phòng
        [HttpPost]
        public async Task<JsonResult> XuLyTraPhong(string maDatPhong)
        {
            try
            {
                var datPhong = await db.ThongTinDatPhongs.FirstOrDefaultAsync(dp => dp.MaDatPhong == maDatPhong);

                if (datPhong == null)
                    return Json(new { success = false, message = "Không tìm thấy thông tin đặt phòng." });

                datPhong.TrangThaiPhong = "Đã thanh toán"; // Cập nhật trạng thái phòng

                var lastHoaDon = await db.HoaDonThus
            .OrderByDescending(hd => hd.MaHoaDonThu)
            .FirstOrDefaultAsync();
                string newMaHoaDon;
                if (lastHoaDon != null)
                {
                    // Tăng mã hóa đơn lên 1
                    int lastNumber = int.Parse(lastHoaDon.MaHoaDonThu.Replace("HDT", ""));
                    newMaHoaDon = "HDT" + (lastNumber + 1).ToString("D5"); // D5: 5 chữ số, ví dụ: HD00001
                }
                else
                {
                    // Trường hợp chưa có hóa đơn nào, bắt đầu từ HD00001
                    newMaHoaDon = "HDT00001";
                }
                var maNhanVien = HttpContext.Session.GetString("MaNhanVien");
                var hoaDonThus = new HoaDonThu
                {
                    TongGia = datPhong.TongThanhToan,
                    ThoiGian = DateTime.Now,
                    MaHoaDonThu = newMaHoaDon,
                    MaDatPhong = maDatPhong,
                    MaNhanVien = maNhanVien
                };
                // Lưu hóa đơn vào cơ sở dữ liệu
                db.HoaDonThus.Add(hoaDonThus);
                await db.SaveChangesAsync(); // Lưu thay đổi vào cơ sở dữ liệu

                return Json(new { success = true, message = "Trả phòng thành công!" });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "Có lỗi xảy ra: " + ex.Message });
            }
        }

        //Xử lý nút nhận phòng
        [HttpPost]
        public async Task<JsonResult> XuLyNhanPhong(string maDatPhong, DateOnly ngayNhan, DateOnly ngayTra)
        {
            try
            {
                // Tìm thông tin đặt phòng
                var datPhong = await db.ThongTinDatPhongs
                    .FirstOrDefaultAsync(dp => dp.MaDatPhong == maDatPhong);

                if (datPhong == null)
                    return Json(new { success = false, message = "Không tìm thấy thông tin đặt phòng." });

                // Kiểm tra hợp lệ
                if (ngayTra < ngayNhan)
                {
                    return Json(new { success = false, message = "Ngày trả không thể trước ngày nhận." });
                }

                // Tính tổng số ngày
                int tongSoNgay = (int)(ngayTra.ToDateTime(TimeOnly.MinValue) - ngayNhan.ToDateTime(TimeOnly.MinValue)).TotalDays;

                // Tìm giá hạng phòng
                var hangPhong = await db.HangPhongs
                    .FirstOrDefaultAsync(hp => hp.MaHangPhong == datPhong.MaHangPhong);

                if (hangPhong == null)
                    return Json(new { success = false, message = "Không tìm thấy thông tin hạng phòng." });

                // Tính tổng thanh toán
                decimal giaHangPhong = hangPhong.GiaHangPhong ?? 0;
                decimal tongThanhToan = giaHangPhong * tongSoNgay;

                // Cập nhật thông tin
                datPhong.NgayNhan = ngayNhan; // Chuyển đổi sang DateTime
                datPhong.NgayTra = ngayTra;   // Chuyển đổi sang DateTime
                datPhong.TongSoNgay = tongSoNgay;
                datPhong.TongThanhToan = tongThanhToan;
                datPhong.TrangThaiPhong = "Đang hoạt động";

                await db.SaveChangesAsync();

                return Json(new { success = true, message = "Nhận phòng thành công!" });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "Có lỗi xảy ra: " + ex.Message });
            }
        }



        //Xử lý nút đặt phòng khi phòng trống
        [HttpPost]
        public async Task<IActionResult> DatPhongTrong([FromBody] thongTinDatPhongTrong models)
        {
            // Kiểm tra model có hợp lệ không
            if (models == null || !ModelState.IsValid)
            {
                var errors = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage).ToList();
                return BadRequest(new { success = false, message = "Dữ liệu không hợp lệ.", errors });
            }

            try
            {
                // Kiểm tra và parse ngày nhận, ngày trả
                if (!DateOnly.TryParseExact(models.NgayNhan, "dd/MM/yyyy", null, System.Globalization.DateTimeStyles.None, out var ngayNhan))
                {
                    return BadRequest(new { success = false, message = "Ngày nhận không đúng định dạng." });
                }

                if (!DateOnly.TryParseExact(models.NgayTra, "dd/MM/yyyy", null, System.Globalization.DateTimeStyles.None, out var ngayTra))
                {
                    return BadRequest(new { success = false, message = "Ngày trả không đúng định dạng." });
                }

                // Tính tổng số ngày
                var tongSoNgay = (ngayTra.ToDateTime(TimeOnly.MinValue) - ngayNhan.ToDateTime(TimeOnly.MinValue)).Days;
                if (tongSoNgay <= 0)
                {
                    return BadRequest(new { success = false, message = "Ngày trả phải lớn hơn ngày nhận." });
                }

                // Lấy giá hạng phòng
                var hangPhong = await db.HangPhongs.FirstOrDefaultAsync(hp => hp.MaHangPhong == models.MaHangPhong);
                if (hangPhong == null)
                {
                    return BadRequest(new { success = false, message = "Hạng phòng không tồn tại." });
                }

                // Tính tổng thanh toán
                var tongThanhToan = tongSoNgay * hangPhong.GiaHangPhong;

                // Tạo mã khách hàng
                string maKhachHang;
                do
                {
                    maKhachHang = $"KH{Guid.NewGuid().ToString().Substring(0, 5)}";
                } while (db.KhachHangs.Any(kh => kh.MaKhachHang == maKhachHang));

                // Tạo mã đặt phòng
                string maDatPhong;
                do
                {
                    maDatPhong = $"DP{Guid.NewGuid().ToString().Substring(0, 5)}";
                } while (db.ThongTinDatPhongs.Any(dp => dp.MaDatPhong == maDatPhong));

                // Lưu thông tin khách hàng
                var khachHang = new QLKS_3TL.Data.KhachHang
                {
                    MaKhachHang = maKhachHang,
                    HoTen = models.FullName,
                    GioiTinh = models.Sex,
                    Cccd = models.CCCD,
                    SoDienThoai = models.PhoneNumber,
                    Email = models.EmailAddress
                };

                // Lưu thông tin đặt phòng
                var thongTinDatPhong = new ThongTinDatPhong
                {
                    MaDatPhong = maDatPhong,
                    NgayNhan = ngayNhan,
                    NgayTra = ngayTra,
                    MaKhachHang = maKhachHang,
                    MaHangPhong = models.MaHangPhong,
                    SoLuongPhong = 1,
                    TongThanhToan = tongThanhToan,
                    TongSoNgay = tongSoNgay,
                    YeuCauThem = string.IsNullOrWhiteSpace(models.AdditionalRequest) ? "Không" : models.AdditionalRequest,
                    ThoiGianDatPhong = DateTime.Now,
                    TrangThaiXacNhan = "2",
                    MaPhong = models.MaPhong, // Nếu có mã phòng từ client
                    TrangThaiPhong = "Đã đặt"
                };

                // Lưu vào cơ sở dữ liệu trong giao dịch
                using (var transaction = await db.Database.BeginTransactionAsync())
                {
                    try
                    {
                        db.KhachHangs.Add(khachHang);
                        db.ThongTinDatPhongs.Add(thongTinDatPhong);
                        await db.SaveChangesAsync();
                        await transaction.CommitAsync();
                    }
                    catch (Exception ex)
                    {
                        await transaction.RollbackAsync();
                        return StatusCode(500, new { success = false, message = "Lỗi lưu dữ liệu: " + ex.Message });
                    }
                }

                return Ok(new { success = true, message = "Đặt phòng thành công.", tongThanhToan });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "Đã xảy ra lỗi không xác định: " + ex.Message });
            }
        }

        //Hiển thị thông tin lên modal đặt phòng 
        [HttpGet]
        [Route("/LeTan/QuanLyDatPhong/GetMaPhong/{maPhong}")]
        public async Task<JsonResult> GetMaPhong(string maPhong)
        {
            try
            {
                var ThongTin = await db.Phongs
                    .Where(p => p.MaPhong == maPhong)
                    .Select(p => new { MaHangPhong = p.MaHangPhong, MaPhong = p.MaPhong, GiaHangPhong = p.HangPhong.GiaHangPhong }).FirstOrDefaultAsync();


                if (ThongTin == null)
                {
                    return Json(new { success = false, message = $"Thông tin không hợp lệ" });
                }

                return Json(new { success = true, data = ThongTin });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = $"Lỗi: {ex.Message}" });
            }
        }

        //Xử lý nút Nhận phòng khi phòng trống
        [HttpPost]
        public async Task<IActionResult> NhanPhongTrong([FromBody] thongTinDatPhongTrong models)
        {
            // Kiểm tra model có hợp lệ không
            if (models == null || !ModelState.IsValid)
            {
                var errors = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage).ToList();
                return BadRequest(new { success = false, message = "Dữ liệu không hợp lệ.", errors });
            }

            try
            {
                // Kiểm tra và parse ngày nhận, ngày trả
                if (!DateOnly.TryParseExact(models.NgayNhan, "dd/MM/yyyy", null, System.Globalization.DateTimeStyles.None, out var ngayNhan))
                {
                    return BadRequest(new { success = false, message = "Ngày nhận không đúng định dạng." });
                }

                if (!DateOnly.TryParseExact(models.NgayTra, "dd/MM/yyyy", null, System.Globalization.DateTimeStyles.None, out var ngayTra))
                {
                    return BadRequest(new { success = false, message = "Ngày trả không đúng định dạng." });
                }

                // Tính tổng số ngày
                var tongSoNgay = (ngayTra.ToDateTime(TimeOnly.MinValue) - ngayNhan.ToDateTime(TimeOnly.MinValue)).Days;
                if (tongSoNgay <= 0)
                {
                    return BadRequest(new { success = false, message = "Ngày trả phải lớn hơn ngày nhận." });
                }

                // Lấy giá hạng phòng
                var hangPhong = await db.HangPhongs.FirstOrDefaultAsync(hp => hp.MaHangPhong == models.MaHangPhong);
                if (hangPhong == null)
                {
                    return BadRequest(new { success = false, message = "Hạng phòng không tồn tại." });
                }

                // Tính tổng thanh toán
                var tongThanhToan = tongSoNgay * hangPhong.GiaHangPhong;

                // Tạo mã khách hàng
                string maKhachHang;
                do
                {
                    maKhachHang = $"KH{Guid.NewGuid().ToString().Substring(0, 5)}";
                } while (db.KhachHangs.Any(kh => kh.MaKhachHang == maKhachHang));

                // Tạo mã đặt phòng
                string maDatPhong;
                do
                {
                    maDatPhong = $"DP{Guid.NewGuid().ToString().Substring(0, 5)}";
                } while (db.ThongTinDatPhongs.Any(dp => dp.MaDatPhong == maDatPhong));

                // Lưu thông tin khách hàng
                var khachHang = new QLKS_3TL.Data.KhachHang
                {
                    MaKhachHang = maKhachHang,
                    HoTen = models.FullName,
                    GioiTinh = models.Sex,
                    Cccd = models.CCCD,
                    SoDienThoai = models.PhoneNumber,
                    Email = models.EmailAddress
                };

                // Lưu thông tin đặt phòng
                var thongTinDatPhong = new ThongTinDatPhong
                {
                    MaDatPhong = maDatPhong,
                    NgayNhan = ngayNhan,
                    NgayTra = ngayTra,
                    MaKhachHang = maKhachHang,
                    MaHangPhong = models.MaHangPhong,
                    SoLuongPhong = 1,
                    TongThanhToan = tongThanhToan,
                    TongSoNgay = tongSoNgay,
                    YeuCauThem = string.IsNullOrWhiteSpace(models.AdditionalRequest) ? "Không" : models.AdditionalRequest,
                    ThoiGianDatPhong = DateTime.Now,
                    TrangThaiXacNhan = "2",
                    MaPhong = models.MaPhong, // Nếu có mã phòng từ client
                    TrangThaiPhong = "Đang hoạt động"
                };

                // Lưu vào cơ sở dữ liệu trong giao dịch
                using (var transaction = await db.Database.BeginTransactionAsync())
                {
                    try
                    {
                        db.KhachHangs.Add(khachHang);
                        db.ThongTinDatPhongs.Add(thongTinDatPhong);
                        await db.SaveChangesAsync();
                        await transaction.CommitAsync();
                    }
                    catch (Exception ex)
                    {
                        await transaction.RollbackAsync();
                        return StatusCode(500, new { success = false, message = "Lỗi lưu dữ liệu: " + ex.Message });
                    }
                }

                return Ok(new { success = true, message = "Nhận phòng thành công.", tongThanhToan });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "Đã xảy ra lỗi không xác định: " + ex.Message });
            }
        }
    }
}
