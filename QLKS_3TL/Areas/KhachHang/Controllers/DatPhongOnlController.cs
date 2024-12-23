﻿using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QLKS_3TL.Areas.KhachHang.Models;
using QLKS_3TL.Data;

namespace QLKS_3TL.Areas.KhachHang.Controllers
{
    public class DatPhongOnlController : Controller
    {
        private readonly Qlks3tlContext dbContext;
        public DatPhongOnlController(Qlks3tlContext dbContext)
        {
            this.dbContext = dbContext;
        }
        public async Task<IActionResult> Index()
        {
            return View(await dbContext.HangPhongs.ToListAsync());
        }

        [HttpGet]
        public async Task<IActionResult> ModalDP(string maHangPhong)
        {
            var HangPhong = await dbContext.HangPhongs.FindAsync(maHangPhong);
            if (HangPhong == null)
            {
                return NotFound();
            }

            // Trả về dữ liệu dưới dạng JSON
            return Json(new
            {
                TenHangPhong = HangPhong.TenHangPhong,
                MaHangPhong = HangPhong.MaHangPhong,
                GiaHangPhong = HangPhong.GiaHangPhong,
            });
        }
        [HttpGet]
        public async Task<IActionResult> GetAvailableRooms(DateOnly ngayNhan, DateOnly ngayTra, decimal? minPrice, decimal? maxPrice, int? minBeds, int? maxBeds)
        {
            Console.WriteLine($"ngayNhan: {ngayNhan}, ngayTra: {ngayTra}, minPrice: {minPrice}, maxPrice: {maxPrice}, minBeds: {minBeds}, maxBeds: {maxBeds}");

            // Kiểm tra nếu bảng ThongTinDatPhongs trống
            bool isThongTinDatPhongsEmpty = !dbContext.ThongTinDatPhongs.Any();

            // Truy vấn phòng có sẵn
            var availableRooms = await dbContext.HangPhongs
                .Where(hp => dbContext.Phongs
                    .Where(p => p.MaHangPhong == hp.MaHangPhong)
                    .All(p => isThongTinDatPhongsEmpty || // Nếu bảng ThongTinDatPhongs trống, coi tất cả phòng là trống
                        !dbContext.ThongTinDatPhongs
                            .Any(tdp => tdp.MaPhong == p.MaPhong
                                && tdp.TrangThaiPhong != "Trống"
                                && tdp.NgayNhan < ngayTra
                                && tdp.NgayTra > ngayNhan)))
                .Where(hp => (!minPrice.HasValue || hp.GiaHangPhong >= minPrice)
                             && (!maxPrice.HasValue || hp.GiaHangPhong <= maxPrice)
                             && (!minBeds.HasValue || hp.SoGiuong >= minBeds)
                             && (!maxBeds.HasValue || hp.SoGiuong <= maxBeds))
                .GroupBy(hp => new
                {
                    hp.MaHangPhong,
                    hp.TenHangPhong,
                    hp.GiaHangPhong,
                    hp.SoGiuong,
                    hp.DienTich,
                    hp.AnhHangPhong
                })
                .Select(group => new
                {
                    group.Key.MaHangPhong,
                    group.Key.TenHangPhong,
                    group.Key.GiaHangPhong,
                    group.Key.DienTich,
                    group.Key.SoGiuong,
                    group.Key.AnhHangPhong
                })
                .ToListAsync();

            // Debug output to check available rooms
            Console.WriteLine($"Dữ liệu phòng: {availableRooms.Count}");

            // Kiểm tra nếu không có phòng nào phù hợp
            if (availableRooms.Count == 0)
            {
                return NotFound(new { message = "Không có phòng trống phù hợp với tiêu chí tìm kiếm." });
            }

            // Trả về kết quả
            return Ok(availableRooms);
        }
    }
}
