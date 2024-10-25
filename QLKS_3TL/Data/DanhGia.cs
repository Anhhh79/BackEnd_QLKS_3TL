using System;
using System.Collections.Generic;

namespace QLKS_3TL.Data;

public partial class DanhGia
{
    public int Id { get; set; }

    public string? SoDienThoai { get; set; }

    public int? SoSao { get; set; }

    public string? HoTen { get; set; }

    public DateOnly? ThoiGian { get; set; }

    public string? MaNhanVien { get; set; }

    public virtual NhanVien? MaNhanVienNavigation { get; set; }
}
