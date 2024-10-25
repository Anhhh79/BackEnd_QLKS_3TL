using System;
using System.Collections.Generic;

namespace QLKS_3TL.Data;

public partial class TaiKhoan
{
    public string MaNhanVien { get; set; } = null!;

    public string? TaiKhoan1 { get; set; }

    public string? MatKhau { get; set; }

    public string? QuyenTruyCap { get; set; }

    public virtual NhanVien MaNhanVienNavigation { get; set; } = null!;
}
