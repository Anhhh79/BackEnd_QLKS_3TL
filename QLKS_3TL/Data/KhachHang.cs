using System;
using System.Collections.Generic;

namespace QLKS_3TL.Data;

public partial class KhachHang
{
    public string SoDienThoai { get; set; } = null!;

    public string? HoTen { get; set; }

    public string? Cccd { get; set; }

    public string? Email { get; set; }

    public string? GioiTinh { get; set; }

    public string MaKhachHang { get; set; } = null!;

    public virtual ICollection<ThongTinDatPhong> ThongTinDatPhongs { get; set; } = new List<ThongTinDatPhong>();
}
