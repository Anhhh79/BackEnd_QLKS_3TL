using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace QLKS_3TL.Data;

public partial class DanhGia
{
    public int Id { get; set; }

    public string? SoDienThoai { get; set; }

    public int? SoSao { get; set; }

    public string? HoTen { get; set; }

    public DateOnly? ThoiGian { get; set; }

    public string? MaNhanVien { get; set; }

    public string? NoiDung { get; set; }

    public virtual NhanVien? MaNhanVienNavigation { get; set; }
}
