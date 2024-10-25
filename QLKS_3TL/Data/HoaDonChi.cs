using System;
using System.Collections.Generic;

namespace QLKS_3TL.Data;

public partial class HoaDonChi
{
    public string MaHoaDonChi { get; set; } = null!;

    public string? TenMatHang { get; set; }

    public double? GiaMatHang { get; set; }

    public int? SoLuong { get; set; }

    public decimal? TongGia { get; set; }

    public string? MaNhanVien { get; set; }

    public DateTime? ThoiGian { get; set; }

    public virtual NhanVien? MaNhanVienNavigation { get; set; }
}
