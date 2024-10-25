using System;
using System.Collections.Generic;

namespace QLKS_3TL.Data;

public partial class NhanVien
{
    public string MaNhanVien { get; set; } = null!;

    public string? AnhNhanVien { get; set; }

    public string? HoTen { get; set; }

    public string? Cccd { get; set; }

    public string? SoDienThoai { get; set; }

    public string? DiaChi { get; set; }

    public string? ChucVu { get; set; }

    public decimal? LuongCoBan { get; set; }

    public string? GioiTinh { get; set; }

    public virtual ICollection<DanhGia> DanhGia { get; set; } = new List<DanhGia>();

    public virtual ICollection<HoaDonChi> HoaDonChis { get; set; } = new List<HoaDonChi>();

    public virtual ICollection<HoaDonThu> HoaDonThus { get; set; } = new List<HoaDonThu>();

    public virtual TaiKhoan? TaiKhoan { get; set; }
}
