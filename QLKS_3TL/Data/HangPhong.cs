using System;
using System.Collections.Generic;

namespace QLKS_3TL.Data;

public partial class HangPhong
{
    public string MaHangPhong { get; set; } = null!;

    public string? TenHangPhong { get; set; }

    public decimal? GiaHangPhong { get; set; }

    public int? SoGiuong { get; set; }

    public double? DienTich { get; set; }

    public string? AnhHangPhong { get; set; }

    public string? MoTa { get; set; }

    public virtual ICollection<Phong> Phongs { get; set; } = new List<Phong>();

    public virtual ICollection<ThongTinDatPhong> ThongTinDatPhongs { get; set; } = new List<ThongTinDatPhong>();
}
