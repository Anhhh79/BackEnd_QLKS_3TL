using System;
using System.Collections.Generic;

namespace QLKS_3TL.Data;

public partial class HoaDonThu
{
    public string MaHoaDonThu { get; set; } = null!;

    public decimal? TongGia { get; set; }

    public string? MaNhanVien { get; set; }

    public DateTime? ThoiGian { get; set; }

    public string? MaDatPhong { get; set; }

    public virtual ThongTinDatPhong? MaDatPhongNavigation { get; set; }

    public virtual NhanVien? MaNhanVienNavigation { get; set; }
}
